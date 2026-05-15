import { PARTICLES_BUFFER_CPU_ID, PARTICLES_BUFFER_FLAGS_ID, PARTICLES_BUFFER_GPU_ID } from "../buffers.const";
import { PI_DIV_TWO, PI_MUL_TWO, random, vecMulValue, vecSumVec } from "../math/math";
import type { Quasar } from "../Quasar";
import { COLORS, PARTICLE_D_ALPHA, PARTICLE_DIAMETER_MAX_DEF, PARTICLE_DIAMETER_MIN_DEF, QUANTITY_ARM, QUANTITY_EL_GENERATE } from "../quasar.const";
import type { IEngine } from "./IEngine";

export class Engine implements IEngine {
  private quasarRef!: Quasar;

  private angleStep: number = 0;
  private radiusStep: number = 0;
  private modelRadius: number = 0;
  private blackHoleRadius: number = 0;

  private particlesCpuData!: Float32Array;
  private particlesGpuData!: Float32Array;
  private particlesFlagsData!: Int32Array;

  process(): void {
    void this.particlesCpuData;
    void this.particlesFlagsData;

    const data = this.particlesGpuData;
    const count = this.quasarRef.particlesPool.activeCount;
    const radiusStep = this.radiusStep;
    const angleStep = this.angleStep;
    const blackHoleRadius = this.blackHoleRadius;
    const modelRadius = this.modelRadius;

    for (let i = 0; i < count; i++) {
      const base = i * 7;
      const polarR = data[base] - radiusStep;
      data[base] = polarR;
      data[base + 1] += angleStep;

      if (polarR < blackHoleRadius) {
        data[base] = modelRadius;
      }
    }
  }

  /**
   * TODO: Implement particle move to start
   */
  moveParticleToStart(pId: number) {
    this.particlesGpuData[pId * 7] = this.modelRadius;
  }

  bindMainClass(ref: Quasar): void {
    this.quasarRef = ref;
  }

  /**
   * generate particles data
   */
  initializeData(): void {
    const config = this.quasarRef.modelConfig;

    this.angleStep = config.angleStep;
    this.radiusStep = config.radiusStep;
    this.modelRadius = config.modelRadius;
    this.blackHoleRadius = config.blackHoleDiameter / 2;

    this.particlesCpuData = this.quasarRef.particlesPool.getTypedArray(PARTICLES_BUFFER_CPU_ID);
    this.particlesGpuData = this.quasarRef.particlesPool.getTypedArray(PARTICLES_BUFFER_GPU_ID);
    this.particlesFlagsData = this.quasarRef.particlesPool.getTypedArray(PARTICLES_BUFFER_FLAGS_ID);

    let radius = this.modelRadius;
  
    while (radius > this.blackHoleRadius) {
      this.generateParticles(radius);
      radius -= this.radiusStep;
    }

  }

  private generateParticles(radius: number) {
    const particlesPool = this.quasarRef.particlesPool;

    let angle = PI_MUL_TWO;
    let deltaColor = [0, 0, 0];
  
    let alphaOffset = this.angleStep / this.radiusStep * (this.modelRadius - radius);
  
    for(let k = 0; k < QUANTITY_ARM; k++) {
      for(let i = 0; i < QUANTITY_EL_GENERATE; i++) {
        const pId = particlesPool.getNewObject();

        let deltaAngle = random(-PI_DIV_TWO, PI_DIV_TWO);
        let z = random(-this.blackHoleRadius * 2, this.blackHoleRadius * 2);
        let disp = Math.abs(deltaAngle) / Math.PI * 3 + Math.abs(z) / this.blackHoleRadius;
  
        const size = PARTICLE_DIAMETER_MAX_DEF - PARTICLE_DIAMETER_MIN_DEF * disp;
  
        deltaColor[0] = disp;
  
        let color = vecMulValue(vecSumVec(COLORS[k], deltaColor), 2.0 - disp);
        // let color = COLORS[k];

        this.particlesGpuData[pId * 7] = radius;
        this.particlesGpuData[pId * 7 + 1] = angle + alphaOffset + deltaAngle;
        this.particlesGpuData[pId * 7 + 2] = z;
        this.particlesGpuData[pId * 7 + 3] = size;

        this.particlesGpuData[pId * 7 + 4] = color[0];
        this.particlesGpuData[pId * 7 + 5] = color[1];
        this.particlesGpuData[pId * 7 + 6] = color[2];
      }
  
      angle -= PARTICLE_D_ALPHA;
    }
  }
}