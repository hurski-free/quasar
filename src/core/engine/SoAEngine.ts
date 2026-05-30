import { PARTICLES_CPU_VALUES_PER_ELEMENT, PARTICLES_FLAGS_VALUES_PER_ELEMENT, PARTICLES_GPU_VALUES_PER_ELEMENT } from "../buffers.const";
import { randomBiased, randomCentered } from "../math/math";
import type { IQuasarArmConfig } from "../quasar.conf";
import { PARTICLE_DIAMETER_MAX_DEF, PARTICLE_DIAMETER_MIN_DEF, QUANTITY_EL_GENERATE } from "../quasar.const";
import type { ImmutableSession } from "../Session";
import type { SoAWorld } from "../world/SoAWorld";
import type { IEngine } from "./IEngine";

export class SoAEngine implements IEngine<SoAWorld>  {
  private respawnIndices: number[] = [];
  private respawnCount: number = 0;

  process(world: SoAWorld, session: ImmutableSession): void {
    this.respawnCount = 0;

    const particlesGpuData = world.particlesGpuData;
    const particlesCpuData = world.particlesCpuData;
    const count = world.particlesPool.activeCount;

    const radiusStep = session.modelConfig.radiusStep;
    const angleStep = session.modelConfig.angleStep;
    const blackHoleRadius = session.modelConfig.blackHoleDiameter / 2;
    const modelRadius = session.modelConfig.modelRadius;

    for (let i = 0; i < count; i++) {
      const base = PARTICLES_GPU_VALUES_PER_ELEMENT * i;
      const cpuBase = PARTICLES_CPU_VALUES_PER_ELEMENT * i;

      if (this.isInsideBlackHole(particlesGpuData, base, blackHoleRadius)) {
        this.respawnIndices[this.respawnCount++] = i;
        continue;
      }

      const polarR = particlesGpuData[base] - radiusStep;

      particlesGpuData[base] = polarR;
      particlesGpuData[base + 1] += angleStep;

      particlesGpuData[base + 2] -= particlesCpuData[cpuBase + 1] * particlesCpuData[cpuBase]; // +zStep
    }

    this.respawnAbsorbedParticles(particlesGpuData, world.particlesCpuData, world.particlesFlagsData, session);
  }

  isInsideBlackHole(particlesGpuData: Float32Array, particleBase: number, blackHoleRadius: number): boolean {
    const x = particlesGpuData[particleBase]; // polarR
    const z = particlesGpuData[particleBase + 2]; // z

    return x * x + z * z < blackHoleRadius * blackHoleRadius; // check sphere
  }

  respawnAbsorbedParticles(gpuData: Float32Array, cpuData: Float32Array, flagsData: Int32Array, session: ImmutableSession) {
    const { modelRadius, arms } = session.modelConfig;

    const radiusStep = session.modelConfig.radiusStep;
    const countStep = modelRadius / radiusStep;
    const blackHoleRadius = session.modelConfig.blackHoleDiameter / 2;

    for (let i = 0; i < this.respawnCount; i++) {
      const particleIndex = this.respawnIndices[i];
      
      const gpuBase = PARTICLES_GPU_VALUES_PER_ELEMENT * particleIndex;
      const cpuBase = PARTICLES_CPU_VALUES_PER_ELEMENT * particleIndex;
      const flagsBase = PARTICLES_FLAGS_VALUES_PER_ELEMENT * particleIndex;
      
      const arm = arms[flagsData[flagsBase]];

      let deltaAngle = randomCentered(-arm.angleDispersion, arm.angleDispersion, arm.angleCenteredPower);
      const angleDispersionK = Math.abs(deltaAngle) / arm.angleDispersion;
      const angleDispersionKInverse = Math.pow(1 - angleDispersionK, 0.75);

      let z = randomCentered(- arm.zDispersion * angleDispersionKInverse, arm.zDispersion * angleDispersionKInverse, arm.zCenteredPower);
      const zDispersionK = Math.abs(z) / arm.zDispersion;

      // far particles via z/angle must be smaller
      let disp = Math.max(angleDispersionK, zDispersionK);

      const size = PARTICLE_DIAMETER_MAX_DEF - (PARTICLE_DIAMETER_MAX_DEF - PARTICLE_DIAMETER_MIN_DEF) * disp;

      //
      if (size < 0.25) {
        continue;
      }

      const minZ = Math.min(Math.abs(randomBiased(0, 0.8, 3) * z), blackHoleRadius * 0.6);
      const zStep = (Math.abs(z) - Math.abs(minZ)) / countStep;

      // let color = vecMulValue(arm.color, disp);
      let color = arm.color;
  
      gpuData[gpuBase] = modelRadius; // polarR
      gpuData[gpuBase + 1] = arm.angle + deltaAngle; // polarAngle
      gpuData[gpuBase + 2] = z;
      gpuData[gpuBase + 3] = size;

      gpuData[gpuBase + 4] = color[0];
      gpuData[gpuBase + 5] = color[1];
      gpuData[gpuBase + 6] = color[2];

      cpuData[cpuBase] = Math.sign(z) * minZ;
      cpuData[cpuBase + 1] = zStep;
    }
  }

  /**
   * generate particles data
   */
  initializeData(world: SoAWorld, session: ImmutableSession): void {
    const blackHoleRadius = session.modelConfig.blackHoleDiameter / 2;
  
    const armsCount = session.modelConfig.arms.length;

    for (let k = 0; k < armsCount; k++) {
      const armConfig = session.modelConfig.arms[k];
      let radius = session.modelConfig.modelRadius;

      while (radius > blackHoleRadius) {
        this.generateParticles(world, session, radius, armConfig);
        radius -= armConfig.particleGenerateStep;
      }
    }
  }

  private generateParticles(world: SoAWorld, session: ImmutableSession, radius: number, arm: IQuasarArmConfig) {
    const particlesPool = world.particlesPool;
    const particlesGpuData = world.particlesGpuData;
    const particlesCpuData = world.particlesCpuData;
    const particlesFlagsData = world.particlesFlagsData;

    const angleStep = session.modelConfig.angleStep;
    const radiusStep = session.modelConfig.radiusStep;
    const modelRadius = session.modelConfig.modelRadius;
    const blackHoleRadius = session.modelConfig.blackHoleDiameter / 2;

    const { angle, color } = arm;
  
    const countStep = (modelRadius - radius) / radiusStep;
    let alphaOffset = angleStep * countStep;
  
    for(let i = 0; i < QUANTITY_EL_GENERATE; i++) {
      let deltaAngle = randomCentered(-arm.angleDispersion, arm.angleDispersion, arm.angleCenteredPower);
      const angleDispersionK = Math.abs(deltaAngle) / arm.angleDispersion;
      const angleDispersionKInverse = Math.pow(1 - angleDispersionK, 0.75);

      let z = randomCentered(- arm.zDispersion * angleDispersionKInverse, arm.zDispersion * angleDispersionKInverse, arm.zCenteredPower);
      const zDispersionK = Math.abs(z) / arm.zDispersion;

      let disp = Math.max(angleDispersionK, zDispersionK);
      const size = PARTICLE_DIAMETER_MAX_DEF - (PARTICLE_DIAMETER_MAX_DEF - PARTICLE_DIAMETER_MIN_DEF) * disp;

      //
      if (size < 0.25) {
        continue;
      }

      const minZ = Math.min(Math.abs(randomBiased(0, 0.8, 3) * z), blackHoleRadius * 0.6);
      const zStep = (Math.abs(z) - Math.abs(minZ)) / (modelRadius / radiusStep);
      const zOffset = Math.sign(z) * zStep * countStep;

      // let color = vecMulValue(arm.color, disp);

      const pId = particlesPool.getNewObject();

      particlesGpuData[pId * 7] = radius;
      particlesGpuData[pId * 7 + 1] = angle + alphaOffset + deltaAngle;
      particlesGpuData[pId * 7 + 2] = z - zOffset;
      particlesGpuData[pId * 7 + 3] = size;

      particlesGpuData[pId * 7 + 4] = color[0];
      particlesGpuData[pId * 7 + 5] = color[1];
      particlesGpuData[pId * 7 + 6] = color[2];

      // absolute maximum for particle 'z' near black hole
      particlesCpuData[pId * 2] = Math.sign(z); // clamp to black hole radius
      particlesCpuData[pId * 2 + 1] = zStep;

      particlesFlagsData[pId] = arm.index;
    }
  }
}