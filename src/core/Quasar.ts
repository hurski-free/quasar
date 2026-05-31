import type { IEngine } from "./engine/IEngine";
import type { IFrameView, ITransformationData } from "./FrameView";
import { clamp, DEGR_TO_RAD, getProjectionMatrix, getRotationX, getRotationY, getRotationZ, getTransformationMatrix, PI_MUL_TWO } from "./math/math";
import type { IQuasarModelConfig } from "./quasar.conf";
import type { IRender } from "./render/IRender";
import type { ISession } from "./Session";
import type { World } from "./world";

export class Quasar<W extends World> {
  private world: W;
  private engine: IEngine<W>;
  private renderer: IRender<W>;
  private frameView: IFrameView;
  private session: ISession;

  private _animationFrameId: number = 0;
  /** Bumped on pause/stop so in-flight tick callbacks cannot schedule another frame. */
  private _tickGeneration = 0;
  private _prevTimestamp: DOMHighResTimeStamp = 0;

  constructor(world: W, engine: IEngine<W>, renderer: IRender<W>, frameView: IFrameView, session: ISession) {
    this.world = world;
    this.engine = engine;
    this.renderer = renderer;
    this.frameView = frameView;
    this.session = session;
  }

  /**
   * States:
   * 
   * 0 - wait for start
   *
   * 1 - running
   *
   * 2 - paused
   */
  get state() {
    return this.session.quasarState;
  }

  get particlesCount() {
    return this.world.particlesPool.activeCount;
  }

  /* CYCLE CONTROL */

  start() {
    if (this.session.quasarState === 0) {
      this.session.quasarState = 1;

      this.engine.initializeData(this.world, this.session);
      this.renderer.setupDrawData(this.world, this.session);

      this.session.jetsTime = 0;

      this._prevTimestamp = performance.now();
      this._animationFrameId = requestAnimationFrame((currentTime) => this.tick(currentTime));
    }
  }

  tick(now: DOMHighResTimeStamp) {
    const generation = this._tickGeneration;

    if (this.session.quasarState !== 1 || generation !== this._tickGeneration) {
      return;
    }

    const deltaTime = now - this._prevTimestamp;
    this._prevTimestamp = now;

    if (deltaTime <= 200) {
      this.engine.process(this.world, this.session);
      this.renderer.render(this.world, this.frameView, this.session);

      if (this.session.jetsTime > 0) {
        this.session.jetsTime--;
      }
    }

    if (this.session.quasarState === 1 && generation === this._tickGeneration) {
      this._animationFrameId = requestAnimationFrame((currentTime) => this.tick(currentTime));
    }
  }

  pause() {
    if (this.session.quasarState === 1) {
      this.session.quasarState = 2;
      this._tickGeneration++;
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = 0;
    }
  }

  resume() {
    if (this.session.quasarState === 2) {
      this.session.quasarState = 1;
      this._prevTimestamp = performance.now();
      this._animationFrameId = requestAnimationFrame((currentTime) => this.tick(currentTime));
    }
  }

  stop() {
    if (this.session.quasarState !== 0) {
      this.session.quasarState = 0;
      this._tickGeneration++;
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = 0;
      this.world.clear();
      this.renderer.render(this.world, this.frameView, this.session);
    }
  }

  restart() {
    this.stop();
    this.start();
  }

  /* TRANSFORMATION */

  rotateX(value: number, updateTransformation = true) {
    const rad = clamp(value * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this.frameView.mRotateX = getRotationX(rad);

    if (updateTransformation) {
      this.updateTransformation();
    }
  }

  rotateY(value: number, updateTransformation = true) {
    const rad = clamp(value * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this.frameView.mRotateY = getRotationY(rad);

    if (updateTransformation) {
      this.updateTransformation();
    }
  }

  rotateZ(value: number, updateTransformation = true) {
    const rad = clamp(value * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this.frameView.mRotateZ = getRotationZ(rad);

    if (updateTransformation) {
      this.updateTransformation();
    }
  }

  forward(value: number) {
    this.frameView.distance = value;

    if (this.session.quasarState === 1) {
      this.renderer.render(this.world, this.frameView, this.session);
    }
  }

  generateJet() {
    if (this.session.jetsTime <= 0) {
      this.session.jetsTime = this.session.modelConfig.jetsTime;
    }
  }

  prepareTransformation(data: ITransformationData) {
    const radX = clamp(data.rotateX * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this.frameView.mRotateX = getRotationX(radX);
    const radY = clamp(data.rotateY * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this.frameView.mRotateY = getRotationY(radY);
    const radZ = clamp(data.rotateZ * DEGR_TO_RAD, 0, PI_MUL_TWO);
    this.frameView.mRotateZ = getRotationZ(radZ);

    this.frameView.distance = data.distance;

    this.frameView.mProjection = getProjectionMatrix(data.width, data.height, (data.width + data.height) * 2);
    this.frameView.mTransform = getTransformationMatrix(this.frameView.mRotateX, this.frameView.mRotateY, this.frameView.mRotateZ, this.frameView.mProjection);
  }

  resizeCanvas(width: number, height: number) {
    this.frameView.width = width;
    this.frameView.height = height;

    this.frameView.mProjection = getProjectionMatrix(width, height, width + height);
    this.renderer.resize(this.frameView);
    this.updateTransformation();
  }

  private updateTransformation() {
    this.frameView.mTransform = getTransformationMatrix(this.frameView.mRotateX, this.frameView.mRotateY, this.frameView.mRotateZ, this.frameView.mProjection);

    if (this.session.quasarState === 2) {
      this.renderer.render(this.world, this.frameView, this.session);
    }
  }

  /* MODEL CONFIG MANAGMENT */

  setModelConfig(config: IQuasarModelConfig) {
    this.session.modelConfig = config;
  }

  dispose() {
    this.stop();
    this.world.freeMemory();
  }
}
