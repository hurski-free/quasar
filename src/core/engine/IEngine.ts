export interface IEngine {
  process(): void;
  bindMainClass(mainClass: unknown): void;
  initializeData(): void;
}