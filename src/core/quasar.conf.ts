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
} from "./quasar.const";

export interface IQuasarRangeProperty {
  default: number;
  min: number;
  max: number;
  step: number;
}

export interface IQuasarArmConfig {
  particleGenerateStep: number;
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

    ] as IQuasarArmConfig[],
  },
};

export function getQuasarConfigurationProperties(): Readonly<typeof configurationProperties> {
  return configurationProperties;
}
