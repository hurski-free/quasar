import { PARTICLES_BUFFER_CAPACITY, PARTICLES_BUFFER_CPU_ID, PARTICLES_BUFFER_FLAGS_ID, PARTICLES_BUFFER_GPU_ID, PARTICLES_GPU_VALUES_PER_ELEMENT } from "./buffers.const";
import { BufferSoAPool } from "./buffers/BufferSoAPool";
import type { IEngine } from "./engine/IEngine";
import type { ITransformation, ITransformationData } from "./math/ITransformation";
import { clamp, DEGR_TO_RAD, getProjectionMatrix, getRotationX, getRotationY, getRotationZ, getTransformationMatrix, PI_MUL_TWO } from "./math/math";
import type { IQuasarModelConfig } from "./quasar.conf";
import type { IRender } from "./render/IRender";

/**
 * States:
 * 
 * 0 - wait for start
 *
 * 1 - running
 *
 * 2 - paused
 */
export type TGameState = 0 | 1 | 2;

interface IQuasarConfig {
  engine: IEngine;
  renderer: IRender;
}

export class Quasar {
  private engine: IEngine;
  private renderer: IRender;

  /**
   * @see particlesPool
   */
  private _particlesPool: BufferSoAPool;

  /**
   * States:
   * 
   * 0 - wait for start
   *
   * 1 - running
   *
   * 2 - paused
   */
  private _animationState: TGameState = 0;
  private _animationFrameId: number = 0;
  /** Bumped on pause/stop so in-flight tick callbacks cannot schedule another frame. */
  private _tickGeneration = 0;
  private _prevTimestamp: DOMHighResTimeStamp = 0;

  private _transformation: ITransformation;

  private _modelConfig!: IQuasarModelConfig;

  constructor(cfg: IQuasarConfig) {
    this.engine = cfg.engine;
    this.engine.bindMainClass(this);
    this.renderer = cfg.renderer;
    this.renderer.bindMainClass(this);

    this._particlesPool = new BufferSoAPool(PARTICLES_BUFFER_CAPACITY);
    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_CPU_ID,
      valuesPerElement: 1,
      typedConstructor: Float32Array,
    });
    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_GPU_ID,
      valuesPerElement: PARTICLES_GPU_VALUES_PER_ELEMENT,
      typedConstructor: Float32Array,
    });
    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_FLAGS_ID,
      valuesPerElement: 1,
      typedConstructor: Int32Array,
    });

    this._transformation = {
      distance: 1,
      mRotateX: [],
      mRotateY: [],
      mRotateZ: [],
      mProjection: [],
      mTransform: [],
    };
  }

  /**
   * Array[0] CPU DATA []
   *
   * Array[1] GPU DATA [polarR, polarAngle, z, diameter, colorR, colorG, colorB]
   *
   * Array[2] GPU DATA [armIndex]
   */
  get particlesPool() {
    return this._particlesPool;
  }

  get transformation(): ITransformation {
    return this._transformation;
  }

  get animationState() {
    return this._animationState;
  }

  get modelConfig(): Readonly<IQuasarModelConfig> {
    return this._modelConfig;
  }

  /* CYCLE CONTROL */

  start() {
    if (this._animationState === 0) {
      this._animationState = 1;

      this.engine.initializeData();
      this.renderer.setupDrawData();

      this._prevTimestamp = performance.now();
      this._animationFrameId = requestAnimationFrame((currentTime) => this.tick(currentTime));
    }
  }

  tick(now: DOMHighResTimeStamp) {
    const generation = this._tickGeneration;

    if (this._animationState !== 1 || generation !== this._tickGeneration) {
      return;
    }

    const deltaTime = now - this._prevTimestamp;
    this._prevTimestamp = now;

    if (deltaTime <= 200) {
      this.engine.process();
      this.renderer.render();
    }

    if (this._animationState === 1 && generation === this._tickGeneration) {
      this._animationFrameId = requestAnimationFrame((currentTime) => this.tick(currentTime));
    }
  }

  pause() {
    if (this._animationState === 1) {
      this._animationState = 2;
      this._tickGeneration++;
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = 0;
    }
  }

  resume() {
    if (this._animationState === 2) {
      this._animationState = 1;
      this._prevTimestamp = performance.now();
      this._animationFrameId = requestAnimationFrame((currentTime) => this.tick(currentTime));
    }
  }

  stop() {
    if (this._animationState !== 0) {
      this._animationState = 0;
      this._tickGeneration++;
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = 0;
      this.clearObjects();
      this.renderer.render();
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  /* TRANSFORMATION */

  rotateX(value: number, updateTransformation = true) {
    const rad = clamp(value * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this._transformation.mRotateX = getRotationX(rad);

    if (updateTransformation) {
      this.updateTransformation();
    }
  }

  rotateY(value: number, updateTransformation = true) {
    const rad = clamp(value * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this._transformation.mRotateY = getRotationY(rad);

    if (updateTransformation) {
      this.updateTransformation();
    }
  }

  rotateZ(value: number, updateTransformation = true) {
    const rad = clamp(value * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this._transformation.mRotateZ = getRotationZ(rad);

    if (updateTransformation) {
      this.updateTransformation();
    }
  }

  forward(value: number) {
    this._transformation.distance = value;

    if (this._animationState === 1) {
      this.renderer.render();
    }
  }

  prepareTransformation(data: ITransformationData) {
    const radX = clamp(data.rotateX * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this._transformation.mRotateX = getRotationX(radX);
    const radY = clamp(data.rotateY * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this._transformation.mRotateY = getRotationY(radY);
    const radZ = clamp(data.rotateZ * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this._transformation.mRotateZ = getRotationZ(radZ);

    this._transformation.distance = data.distance;

    this._transformation.mProjection = getProjectionMatrix(data.width, data.height, (data.width + data.height) * 2);
    this._transformation.mTransform = getTransformationMatrix(this._transformation.mRotateX, this._transformation.mRotateY, this._transformation.mRotateZ, this._transformation.mProjection);
  }

  resizeCanvas(width: number, height: number) {
    this._transformation.mProjection = getProjectionMatrix(width, height, width + height);
    this.renderer.resize(width, height);
    this.updateTransformation();
  }

  private updateTransformation() {
    this._transformation.mTransform = getTransformationMatrix(this._transformation.mRotateX, this._transformation.mRotateY, this._transformation.mRotateZ, this._transformation.mProjection);

    if (this._animationState === 2) {
      this.renderer.render();
    }
  }

  /* MODEL CONFIG MANAGMENT */

  setModelConfig(config: IQuasarModelConfig) {
    this._modelConfig = config;
  }

  /* MEMORY MANAGEMENT */

  private clearObjects() {
    this._particlesPool.clearObjects();
  }

  dispose() {
    this.stop();
    this._particlesPool.freeMemory();
  }
}
