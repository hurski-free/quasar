import {
  PARTICLE_MOVE_ANGLE_DEF,
  PARTICLE_MOVE_RADIUS_DEF,
  PARTICLE_MOVE_RADIUS_MAX,
  PARTICLE_MOVE_RADIUS_MIN,
  PARTICLE_MOVE_ANGLE_MIN,
  PARTICLE_MOVE_ANGLE_MAX,
  PARTICLE_MOVE_ANGLE_STEP,
  PARTICLE_MOVE_RADIUS_STEP,
} from "./quasar.const";

export interface IQuasarRangeProperty {
  default: number;
  min: number;
  max: number;
  step: number;
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
};

export function getQuasarConfigurationProperties(): Readonly<typeof configurationProperties> {
  return configurationProperties;
}