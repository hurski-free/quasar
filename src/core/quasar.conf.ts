import type { vec3 } from "./math/math";
import {
  PARTICLE_MOVE_ANGLE_DEF,
  PARTICLE_MOVE_RADIUS_DEF,
  PARTICLE_MOVE_RADIUS_MAX,
  PARTICLE_MOVE_RADIUS_MIN,
  PARTICLE_MOVE_ANGLE_MIN,
  PARTICLE_MOVE_ANGLE_MAX,
  PARTICLE_MOVE_ANGLE_STEP,
  PARTICLE_MOVE_RADIUS_STEP,
  BLACK_HOLE_DIAMETER_DEF,
  BLACK_HOLE_DIAMETER_MIN,
  BLACK_HOLE_DIAMETER_MAX,
  BLACK_HOLE_DIAMETER_STEP,
  MODEL_RADIUS_DEF,
  MODEL_RADIUS_MIN,
  MODEL_RADIUS_MAX,
  MODEL_RADIUS_STEP,
  PARTICLE_GENERATE_STEP_DEF,
  PARTICLE_GENERATE_STEP_MIN,
  PARTICLE_GENERATE_STEP_MAX,
  PARTICLE_GENERATE_STEP_STEP,
  PARTICLE_ANGLE_DISPERSION_DEF,
  PARTICLE_Z_DISPERSION_DEF,
  PARTICLE_ANGLE_CENTERED_POWER_DEF,
} from "./quasar.const";

export interface IQuasarRangeProperty {
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface IQuasarArmConfig {
  index: number;

  angle: number;
  angleDispersion: number;
  angleCenteredPower: number;
  zDispersion: number;
  /**
   * density of particles inside arm
   */
  particleGenerateStep: number;
  /**
   * color of particles inside arm
   */
  color: vec3;
}

export interface IQuasarModelConfig {
  angleStep: number;
  radiusStep: number;

  modelRadius: number;
  blackHoleDiameter: number;

  arms: IQuasarArmConfig[];
}

const configurationProperties = {
  angleStep: {
    default: PARTICLE_MOVE_ANGLE_DEF,
    min: PARTICLE_MOVE_ANGLE_MIN,
    max: PARTICLE_MOVE_ANGLE_MAX,
    step: PARTICLE_MOVE_ANGLE_STEP,
  } as Readonly<IQuasarRangeProperty>,
  radiusStep: {
    default: PARTICLE_MOVE_RADIUS_DEF,
    min: PARTICLE_MOVE_RADIUS_MIN,
    max: PARTICLE_MOVE_RADIUS_MAX,
    step: PARTICLE_MOVE_RADIUS_STEP,
  } as Readonly<IQuasarRangeProperty>,
  modelRadius: {
    default: MODEL_RADIUS_DEF,
    min: MODEL_RADIUS_MIN,
    max: MODEL_RADIUS_MAX,
    step: MODEL_RADIUS_STEP,
  } as Readonly<IQuasarRangeProperty>,
  blackHoleDiameter: {
    default: BLACK_HOLE_DIAMETER_DEF,
    min: BLACK_HOLE_DIAMETER_MIN,
    max: BLACK_HOLE_DIAMETER_MAX,
    step: BLACK_HOLE_DIAMETER_STEP,
  } as Readonly<IQuasarRangeProperty>,
  arms: {
    default: [
      {
        index: 0,
        angle: 0,
        angleDispersion: PARTICLE_ANGLE_DISPERSION_DEF,
        angleCenteredPower: PARTICLE_ANGLE_CENTERED_POWER_DEF,
        zDispersion: PARTICLE_Z_DISPERSION_DEF,
        particleGenerateStep: PARTICLE_GENERATE_STEP_DEF,
        color: [1, 1, 1] as vec3,
      },
      {
        index: 1,
        angle: Math.PI,
        angleDispersion: PARTICLE_ANGLE_DISPERSION_DEF,
        angleCenteredPower: PARTICLE_ANGLE_CENTERED_POWER_DEF,
        zDispersion: PARTICLE_Z_DISPERSION_DEF,
        particleGenerateStep: PARTICLE_GENERATE_STEP_DEF,
        color: [1, 0.66, 0.18] as vec3,
      },
    ],
    particleGenerateStep: {
      default: PARTICLE_GENERATE_STEP_DEF,
      min: PARTICLE_GENERATE_STEP_MIN,
      max: PARTICLE_GENERATE_STEP_MAX,
      step: PARTICLE_GENERATE_STEP_STEP,
    } satisfies Readonly<IQuasarRangeProperty>,
    angle: {
      default: 0,
      min: 0,
      max: 360,
      step: 1,
    } satisfies Readonly<IQuasarRangeProperty>,
    angleDispersion: {
      default: 0,
      min: 0,
      max: 180,
      step: 1,
    } satisfies Readonly<IQuasarRangeProperty>,
    angleCenteredPower: {
      default: PARTICLE_ANGLE_CENTERED_POWER_DEF,
      min: 1,
      max: 5,
      step: 1,
    } satisfies Readonly<IQuasarRangeProperty>,
    zDispersion: {
      default: 0,
      min: 0,
      max: 100,
      step: 1,
    } satisfies Readonly<IQuasarRangeProperty>,
  },
};

export function getQuasarConfigurationProperties(): Readonly<typeof configurationProperties> {
  return configurationProperties;
}
