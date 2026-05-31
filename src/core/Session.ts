import type { IQuasarModelConfig } from "./quasar.conf";

/**
 * States:
 * 
 * 0 - wait for start
 *
 * 1 - running
 *
 * 2 - paused
 */
export type TQuasarState = 0 | 1 | 2;

export interface ISession {
  quasarState: TQuasarState;
  modelConfig: IQuasarModelConfig;

  jetsTime: number;
}

export type ImmutableSession = Readonly<ISession>;
