export interface IRender {
  render(): void;
  resize(width: number, height: number): void;
  bindMainClass(gameRef: unknown): void;
  setupDrawData(): void;
}