import { PI_DIV_TWO } from "./math/math";

export const COLORS =
[
	[0.67, 0.87, 0.3],
	[0.67, 0.87, 0.3]
];

// model constants

export const MODEL_RADIUS_DEF = 800;
export const MODEL_RADIUS_MIN = 400;
export const MODEL_RADIUS_MAX = 1200;
export const MODEL_RADIUS_STEP = 50;

// particles constants

export const QUANTITY_EL_GENERATE = 10;

export const PARTICLE_Z_DISPERSION_DEF = 50;
export const PARTICLE_Z_DISPERSION_MIN = 0;
export const PARTICLE_Z_DISPERSION_MAX = 100;
export const PARTICLE_Z_DISPERSION_STEP = 5;

export const PARTICLE_ANGLE_DISPERSION_DEF = PI_DIV_TWO;

export const PARTICLE_ANGLE_CENTERED_POWER_DEF = 2;
export const PARTICLE_ANGLE_CENTERED_POWER_MIN = 1;
export const PARTICLE_ANGLE_CENTERED_POWER_MAX = 10;
export const PARTICLE_ANGLE_CENTERED_POWER_STEP = 1;

export const PARTICLE_Z_CENTERED_POWER_DEF = 2;
export const PARTICLE_Z_CENTERED_POWER_MIN = 1;
export const PARTICLE_Z_CENTERED_POWER_MAX = 10;
export const PARTICLE_Z_CENTERED_POWER_STEP = 1;

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

// black hole constants

export const BLACK_HOLE_DIAMETER_DEF = 50.0;
export const BLACK_HOLE_DIAMETER_MIN = 20.0;
export const BLACK_HOLE_DIAMETER_MAX = 100.0;
export const BLACK_HOLE_DIAMETER_STEP = 5;

// angles in degrees
export const INIT_ANGLE_X = 256;
export const INIT_ANGLE_Y = 14;
export const INIT_ANGLE_Z = 0;

// jets constants

export const JETS_TIME_DEF = 1000;
export const JETS_TIME_MIN = 500;
export const JETS_TIME_MAX = 1500;
export const JETS_TIME_STEP = 100;

export const JETS_START_X = 5;
export const JETS_EL_GENERATE = 18;

export const JETS_MOVE_ANGLE_DEF = 0.05;
export const JETS_MOVE_ANGLE_MIN = 0.01;
export const JETS_MOVE_ANGLE_MAX = 0.1;
export const JETS_MOVE_ANGLE_STEP = 0.01;

export const JETS_MOVE_RADIUS_DEF = 0.5;
export const JETS_MOVE_RADIUS_MIN = 0.1;
export const JETS_MOVE_RADIUS_MAX = 1.0;
export const JETS_MOVE_RADIUS_STEP = 0.1;

export const JETS_MOVE_Z_DEF = 6.0;
export const JETS_MOVE_Z_MIN = 2.0;
export const JETS_MOVE_Z_MAX = 8.0;
export const JETS_MOVE_Z_STEP = 0.5;