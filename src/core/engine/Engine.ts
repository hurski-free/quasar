import type { Quasar } from "../Quasar";
import type { IEngine } from "./IEngine";

export class Engine implements IEngine {
  private quasarRef!: Quasar;

  process(): void {
    void this.quasarRef;
    // TODO: Implement engine process
  }

  bindMainClass(ref: Quasar): void {
    this.quasarRef = ref;
  }
}