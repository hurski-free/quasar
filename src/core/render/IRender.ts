export interface IRender {
  render(): void;
  resize(width: number, height: number): void;
  bindMainClass(mainClass: unknown): void;
  setupDrawData(): void;
}