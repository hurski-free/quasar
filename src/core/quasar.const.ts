import { PI_DIV_TWO, PI_MUL_TWO } from "./math/math";

export const COLORS =
[
	[0.67, 0.87, 0.3],
	[0.67, 0.87, 0.3]
];

export const MODEL_RADIUS_DEF = 800;
export const MODEL_RADIUS_MIN = 400;
export const MODEL_RADIUS_MAX = 1200;
export const MODEL_RADIUS_STEP = 50;

export const QUANTITY_ARM = 2;
export const QUANTITY_EL_GENERATE = 10;

export const PARTICLE_Z_DISPERSION_DEF = 25;
export const PARTICLE_ANGLE_DISPERSION_DEF = PI_DIV_TWO;
export const PARTICLE_ANGLE_CENTERED_POWER_DEF = 2;

export const PARTICLE_GENERATE_STEP_DEF = 0.05;
export const PARTICLE_GENERATE_STEP_MIN = 0.005;
export const PARTICLE_GENERATE_STEP_MAX = 0.5;
export const PARTICLE_GENERATE_STEP_STEP = 0.005;

export const PARTICLE_MOVE_ANGLE_DEF = 0.00025;
export const PARTICLE_MOVE_ANGLE_MIN = 0.00005;
export const PARTICLE_MOVE_ANGLE_MAX = 0.001;
export const PARTICLE_MOVE_ANGLE_STEP = 0.00005;

export const PARTICLE_MOVE_RADIUS_DEF = 0.02;
export const PARTICLE_MOVE_RADIUS_MIN = 0.001;
export const PARTICLE_MOVE_RADIUS_MAX = 0.1;
export const PARTICLE_MOVE_RADIUS_STEP = 0.001;

export const PARTICLE_DIAMETER_MIN_DEF = 1.0;
export const PARTICLE_DIAMETER_MIN_MIN = 0.5;
export const PARTICLE_DIAMETER_MIN_MAX = 2.0;
export const PARTICLE_DIAMETER_MIN_STEP = 0.25;

export const PARTICLE_DIAMETER_MAX_DEF = 3.0;
export const PARTICLE_DIAMETER_MAX_MIN = 2.0;
export const PARTICLE_DIAMETER_MAX_MAX = 4.0;
export const PARTICLE_DIAMETER_MAX_STEP = 0.25;

export const PARTICLE_D_ALPHA = PI_MUL_TWO / QUANTITY_ARM;
export const PARTICLE_GEN_OFFSET = PARTICLE_MOVE_ANGLE_DEF / PARTICLE_MOVE_RADIUS_DEF;
export const PARTICLE_GENERATE_STEP = 0.4;
export const PARTICLE_ADD_STEP = 1 / (PARTICLE_GENERATE_STEP / PARTICLE_MOVE_RADIUS_DEF - 1.1);

export const BLACK_HOLE_DIAMETER_DEF = 50.0;
export const BLACK_HOLE_DIAMETER_MIN = 20.0;
export const BLACK_HOLE_DIAMETER_MAX = 100.0;
export const BLACK_HOLE_DIAMETER_STEP = 5;

// angles in degrees
export const INIT_ANGLE_X = 229.18;
export const INIT_ANGLE_Y = 13.75;
export const INIT_ANGLE_Z = 0;

export const JETS_TIME = 1000;
export const JETS_START_X = 5;
export const JETS_START_Z = BLACK_HOLE_DIAMETER_DEF / 2 + 2;
export const JETS_MAX_Z = 800;

export const JETS_MOVE_Z = 2.9;
export const JETS_MOVE_X = 0.25;
export const JETS_MOVE_A = 0.04;