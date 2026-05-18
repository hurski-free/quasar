import type { ImmutableSession } from "../Session";
import type { World } from "../world";

export interface IEngine<W extends World>  {
  process(world: W, session: ImmutableSession): void;

  /**
   * generate initial data for the world
   */
  initializeData(world: W, session: ImmutableSession): void;
}