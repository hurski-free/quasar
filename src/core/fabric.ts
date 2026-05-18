import { PARTICLES_BUFFER_CAPACITY } from "./buffers.const";
import { SoAEngine } from "./engine/SoAEngine";
import type { IFrameView } from "./FrameView";
import { Quasar } from "./Quasar";
import type { IRender } from "./render/IRender";
import { SoAWebGL2Render } from "./render/SoAWebGL2Render";
import type { ISession } from "./Session";
import type { ICreateWorldConfig } from "./world/IWorld";
import { SoAWorld } from "./world/SoAWorld";

// TODO: add aos with workers
type GameMode = 'webgl2-soa';

function createSoAQuasar(worldCfg: ICreateWorldConfig, renderer: IRender<SoAWorld>, frameView: IFrameView, session: ISession) {
  return new Quasar(
    new SoAWorld(worldCfg),
    new SoAEngine(),
    renderer,
    frameView,
    session,
  );
}

export function createQuasar(mode: GameMode, ctx: WebGL2RenderingContext) {
  if (!(ctx instanceof CanvasRenderingContext2D || ctx instanceof WebGL2RenderingContext)) {
    throw new Error('ctx must be a CanvasRenderingContext2D or WebGL2RenderingContext');
  }

  const frameView = {
    width: ctx.canvas.width,
    height: ctx.canvas.height,
    distance: 0,
    mRotateX: [],
    mRotateY: [],
    mRotateZ: [],
    mProjection: [],
    mTransform: [],
  } as IFrameView;

  const gameSession = {
    quasarState: 0,
    modelConfig: {
      angleStep: 0,
      radiusStep: 0,
      modelRadius: 0,
      blackHoleDiameter: 0,
      arms: [],
    },
  } satisfies ISession;

  switch (mode) {
    case 'webgl2-soa':
      if (!(ctx instanceof WebGL2RenderingContext)) {
        throw new Error('ctx must be a WebGL2RenderingContext');
      }
      const soaWebgl2Renderer = new SoAWebGL2Render({
        ctx,
      });

      return createSoAQuasar({
        particlesCapacity: PARTICLES_BUFFER_CAPACITY,
      }, soaWebgl2Renderer, frameView, gameSession);
  }

  throw new Error(`Unknown game mode: ${mode}`);
}