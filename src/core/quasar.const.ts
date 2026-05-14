import { PI_MUL_TWO } from "./math/math";

export const COLORS =
[
	[0.67, 0.87, 0.3],
	[0.67, 0.87, 0.3]
];

export const MAX_SIZE = 5.0;
export const MIN_SIZE_MUL = 4;

export const QUANTITY_ARM = 2;
export const QUANTITY_EL_GENERATE = 10;

export const P_Z_DISPERSION = 100;
export const P_MOVE_ANGLE = 0.00026;
export const P_MOVE_X = 0.02;

export const P_D_ALPHA = PI_MUL_TWO / QUANTITY_ARM;
export const P_GEN_OFFSET = P_MOVE_ANGLE / P_MOVE_X;
export const P_GENERATE_STEP = 0.4;
export const P_ADD_STEP = 1 / (P_GENERATE_STEP / P_MOVE_X - 1.1);

export const BLACK_HOLE_SIZE = 60.0;
export const P_MIN_X = 30.0;

// angles in degrees
export const INIT_ANGLE_X = 229.18;
export const INIT_ANGLE_Y = 13.75;
export const INIT_ANGLE_Z = 0;

export const JETS_TIME = 1000;
export const JETS_START_X = 5;
export const JETS_START_Z = BLACK_HOLE_SIZE / 2 + 2;
export const JETS_MAX_Z = 800;

export const JETS_MOVE_Z = 2.9;
export const JETS_MOVE_X = 0.25;
export const JETS_MOVE_A = 0.04;