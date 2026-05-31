export interface IWorld {
  clear(): void;
  freeMemory(): void;
}

export interface ICreateWorldConfig {
  particlesCapacity: number;
  jetsCapacity: number;
}