import { random } from "../math/math";
import type { IQuasarArmConfig } from "../quasar.conf";
import { PARTICLE_DIAMETER_MAX_DEF, PARTICLE_DIAMETER_MIN_DEF, QUANTITY_EL_GENERATE } from "../quasar.const";
import type { ImmutableSession } from "../Session";
import type { SoAWorld } from "../world/SoAWorld";
import type { IEngine } from "./IEngine";

export class SoAEngine implements IEngine<SoAWorld>  {
  process(world: SoAWorld, session: ImmutableSession): void {
    const particlesGpuData = world.particlesGpuData;
    const count = world.particlesPool.activeCount;

    const radiusStep = session.modelConfig.radiusStep;
    const angleStep = session.modelConfig.angleStep;
    const blackHoleRadius = session.modelConfig.blackHoleDiameter / 2;
    const modelRadius = session.modelConfig.modelRadius;

    for (let i = 0; i < count; i++) {
      const base = i * 7;
      const polarR = particlesGpuData[base] - radiusStep;

      particlesGpuData[base] = polarR;
      particlesGpuData[base + 1] += angleStep;

      if (polarR < blackHoleRadius) {
        particlesGpuData[base] = modelRadius;
      }
    }
  }

  /**
   * TODO: Implement particle move to start
   */
  // moveParticleToStart(pId: number) {
  //   this.particlesGpuData[pId * 7] = this.modelRadius;
  // }

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
    const particlesFlagsData = world.particlesFlagsData;

    const angleStep = session.modelConfig.angleStep;
    const radiusStep = session.modelConfig.radiusStep;
    const modelRadius = session.modelConfig.modelRadius;
    const blackHoleDiameter = session.modelConfig.blackHoleDiameter;

    let angle = arm.angle;
    let deltaColor = [0, 0, 0];
  
    let alphaOffset = angleStep / radiusStep * (modelRadius - radius);
  
    for(let i = 0; i < QUANTITY_EL_GENERATE; i++) {
      let deltaAngle = random(-arm.angleDispersion, arm.angleDispersion);
      let z = random(- blackHoleDiameter, blackHoleDiameter);
      let disp = Math.abs(deltaAngle) / arm.angleDispersion;

      const size = PARTICLE_DIAMETER_MAX_DEF - (PARTICLE_DIAMETER_MAX_DEF - PARTICLE_DIAMETER_MIN_DEF) * disp;

      //
      if (size < 0.25) {
        console.log('disp', disp);
        continue;
      }

      deltaColor[0] = disp;

      // let color = vecMulValue(arm.color, disp);
      let color = arm.color;

      const pId = particlesPool.getNewObject();

      particlesGpuData[pId * 7] = radius;
      particlesGpuData[pId * 7 + 1] = angle + alphaOffset + deltaAngle;
      particlesGpuData[pId * 7 + 2] = z;
      particlesGpuData[pId * 7 + 3] = size;

      particlesGpuData[pId * 7 + 4] = color[0];
      particlesGpuData[pId * 7 + 5] = color[1];
      particlesGpuData[pId * 7 + 6] = color[2];

      particlesFlagsData[pId] = arm.index;
    }
  }
}