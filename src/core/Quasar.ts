import { PARTICLES_BUFFER_CAPACITY } from "./buffers.const";
import { BufferSoAPool } from "./buffers/BufferSoAPool";
import type { IEngine } from "./engine/IEngine";
import type { ITransformation } from "./math/ITransformation";
import { getProjectionMatrix, getTransformationMatrix } from "./math/math";
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

  private _particlesPool: BufferSoAPool;
  private _blackHoleRadius: number = 0;

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
  private _prevTimestamp: DOMHighResTimeStamp = 0;

  private _transformation: ITransformation;

  constructor(cfg: IQuasarConfig) {
    this.engine = cfg.engine;
    this.renderer = cfg.renderer;
    this.renderer.bindMainClass(this);

    this._particlesPool = new BufferSoAPool(PARTICLES_BUFFER_CAPACITY);

    this._transformation = {
      distance: 1,
      mRotateX: [],
      mRotateY: [],
      mRotateZ: [],
      mProjection: [],
      mTransform: [],
    };
  }

  get particlesPool() {
    return this._particlesPool;
  }

  get blackHoleRadius() {
    return this._blackHoleRadius;
  }

  get transformation(): ITransformation {
    return this._transformation;
  }

  get animationState() {
    return this._animationState;
  }

  start() {
    if (this._animationState === 0) {
      this._animationState = 1;

      this._blackHoleRadius = 50;
      this.renderer.setupDrawData();

      this.tick(performance.now());
    }
  }

  tick(now: DOMHighResTimeStamp) {
    if (this._animationState === 1) {
      const deltaTime = now - this._prevTimestamp;
      this._prevTimestamp = now;

      if (deltaTime > 200) {
        // ignore cycle
        this._animationFrameId = requestAnimationFrame((now) => this.tick(now));
      } else {
        this.engine.process();
        this.renderer.render();
        this._animationFrameId = requestAnimationFrame((now) => this.tick(now));
      }
    }
  }

  pause() {
    if (this._animationState === 1) {
      this._animationState = 2;
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = 0;
    }
  }

  resume() {
    if (this._animationState === 2) {
      this._animationState = 1;
      this.tick(performance.now());
    }
  }

  stop() {
    if (this._animationState !== 0) {
      this._animationState = 0;
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

  resizeCanvas(width: number, height: number) {
    this._transformation.mProjection = getProjectionMatrix(width, height, width + height);
    this._transformation.mTransform = getTransformationMatrix(this._transformation.mRotateX, this._transformation.mRotateY, this._transformation.mRotateZ, this._transformation.mProjection);

    this.renderer.resize(width, height);

    if (this._animationState === 2) {
      this.renderer.render();
    }
  }

  private clearObjects() {
    this._particlesPool.clearObjects();
  }

  dispose() {
    this._particlesPool.freeMemory();
  }
}
