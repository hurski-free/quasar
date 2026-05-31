import { JETS_BUFFER_CPU_ID, JETS_BUFFER_GPU_ID, JETS_CPU_VALUES_PER_ELEMENT, JETS_GPU_VALUES_PER_ELEMENT, PARTICLES_BUFFER_CPU_ID, PARTICLES_BUFFER_FLAGS_ID, PARTICLES_BUFFER_GPU_ID, PARTICLES_GPU_VALUES_PER_ELEMENT } from "../buffers.const";
import { BufferSoAPool } from "../buffers/BufferSoAPool";
import type { ICreateWorldConfig, IWorld } from "./IWorld";

export class SoAWorld implements IWorld {
  private _particlesPool: BufferSoAPool;
  private _jetsPool: BufferSoAPool;

  private _particlesCpuData: Float32Array;
  private _particlesGpuData: Float32Array;
  private _particlesFlagsData: Int32Array;

  private _jetsCpuData: Float32Array;
  private _jetsGpuData: Float32Array;

  constructor(cfg: ICreateWorldConfig) {
    this._particlesPool = new BufferSoAPool(cfg.particlesCapacity);
    this._jetsPool = new BufferSoAPool(cfg.jetsCapacity);

    this._particlesPool.createArrayBuffer({
      name: PARTICLES_BUFFER_CPU_ID,
      valuesPerElement: 2,
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

    this._jetsPool.createArrayBuffer({
      name: JETS_BUFFER_CPU_ID,
      valuesPerElement: JETS_CPU_VALUES_PER_ELEMENT,
      typedConstructor: Float32Array,
    });
    this._jetsPool.createArrayBuffer({
      name: JETS_BUFFER_GPU_ID,
      valuesPerElement: JETS_GPU_VALUES_PER_ELEMENT,
      typedConstructor: Float32Array,
    });

    this._particlesCpuData = this.particlesPool.getTypedArray(PARTICLES_BUFFER_CPU_ID);
    this._particlesGpuData = this.particlesPool.getTypedArray(PARTICLES_BUFFER_GPU_ID);
    this._particlesFlagsData = this.particlesPool.getTypedArray(PARTICLES_BUFFER_FLAGS_ID);

    this._jetsCpuData = this._jetsPool.getTypedArray(JETS_BUFFER_CPU_ID);
    this._jetsGpuData = this._jetsPool.getTypedArray(JETS_BUFFER_GPU_ID);
  }

  /**
   * Array[0] CPU DATA [minZ, zStep]
   *
   * Array[1] GPU DATA [polarR, polarAngle, z, diameter, colorR, colorG, colorB]
   *
   * Array[2] GPU DATA [armIndex]
   */
  get particlesPool(): BufferSoAPool {
    return this._particlesPool;
  }

  /**
   * Array[0] CPU DATA [lifetime]
   *
   * Array[1] GPU DATA [polarR, polarAngle, z, diameter, colorR, colorG, colorB]
   */
  get jetsPool(): BufferSoAPool {
    return this._jetsPool;
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

  get jetsCpuData(): Float32Array {
    return this._jetsCpuData;
  }

  get jetsGpuData(): Float32Array {
    return this._jetsGpuData;
  }

  clear(): void {
    this._particlesPool.clearObjects();
    this._jetsPool.clearObjects();
  }

  freeMemory(): void {
    this._particlesPool.freeMemory();
    this._jetsPool.freeMemory();

    (this._particlesCpuData as unknown) = null;
    (this._particlesGpuData as unknown) = null;
    (this._particlesFlagsData as unknown) = null;

    (this._jetsCpuData as unknown) = null;
    (this._jetsGpuData as unknown) = null;
  }
}