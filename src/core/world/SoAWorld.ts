import { PARTICLES_BUFFER_CPU_ID, PARTICLES_BUFFER_FLAGS_ID, PARTICLES_BUFFER_GPU_ID, PARTICLES_GPU_VALUES_PER_ELEMENT } from "../buffers.const";
import { BufferSoAPool } from "../buffers/BufferSoAPool";
import type { ICreateWorldConfig, IWorld } from "./IWorld";

export class SoAWorld implements IWorld {
  private _particlesPool: BufferSoAPool;

  private _particlesCpuData: Float32Array;
  private _particlesGpuData: Float32Array;
  private _particlesFlagsData: Int32Array;

  constructor(cfg: ICreateWorldConfig) {
    this._particlesPool = new BufferSoAPool(cfg.particlesCapacity);

    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_CPU_ID,
      valuesPerElement: 1,
      typedConstructor: Float32Array,
    });
    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_GPU_ID,
      valuesPerElement: PARTICLES_GPU_VALUES_PER_ELEMENT,
      typedConstructor: Float32Array,
    });
    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_FLAGS_ID,
      valuesPerElement: 1,
      typedConstructor: Int32Array,
    });

    this._particlesCpuData = this.particlesPool.getTypedArray(PARTICLES_BUFFER_CPU_ID);
    this._particlesGpuData = this.particlesPool.getTypedArray(PARTICLES_BUFFER_GPU_ID);
    this._particlesFlagsData = this.particlesPool.getTypedArray(PARTICLES_BUFFER_FLAGS_ID);
  }

  /**
   * Array[0] CPU DATA []
   *
   * Array[1] GPU DATA [polarR, polarAngle, z, diameter, colorR, colorG, colorB]
   *
   * Array[2] GPU DATA [armIndex]
   */
  get particlesPool(): BufferSoAPool {
    return this._particlesPool;
  }

  get particlesCpuData(): Float32Array {
    return this._particlesCpuData;
  }

  get particlesGpuData(): Float32Array {
    return this._particlesGpuData;
  }

  get particlesFlagsData(): Int32Array {
    return this._particlesFlagsData;
  }

  clear(): void {
    this._particlesPool.clearObjects();
  }

  freeMemory(): void {
    this._particlesPool.freeMemory();

    (this._particlesCpuData as unknown) = null;
    (this._particlesGpuData as unknown) = null;
    (this._particlesFlagsData as unknown) = null;
  }
}