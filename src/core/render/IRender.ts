import type { ImmutableFrameView } from "../FrameView";
import type { ImmutableSession } from "../Session";
import type { World } from "../world";

export interface IRender<W extends World> {
  render(world: W, frameView: ImmutableFrameView, session: ImmutableSession): void;
  resize(frameView: ImmutableFrameView): void;
  /**
   * Helper method to setup buffers for drawing
   */
  setupDrawData(world: W, session: ImmutableSession): void;
}