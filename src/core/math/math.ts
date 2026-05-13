export type vec2 = [number, number];
export type vec3 = [number, number, number];
export type vec4 = [number, number, number, number];

export interface IVec2 {
  x: number;
  y: number;
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

export function getProjectionMatrix(width: number, height: number, depth: number) {
	return [
		2 / width, 0, 0, 0,
		0, 2 / height, 0, 0,
		0, 0, 2 / depth, 0,
		0, 0, 0, 1,
	];
}

export function getRotationX(a: number) {
  const s = Math.sin(a);
  const c = Math.cos(a);

	return [
		1, 0, 0, 0,
		0, c, s, 0,
		0, -s, c, 0,
		0, 0, 0, 1
	];
}

export function getRotationY(a: number) {
  const s = Math.sin(a);
  const c = Math.cos(a);

	return [
		c, 0, -s, 0,
		0, 1, 0, 0,
		s, 0, c, 0,
		0, 0, 0, 1
	];
}

export function getRotationZ(a: number) {
  const s = Math.sin(a);
  const c = Math.cos(a);

	return [
		c, s, 0, 0,
		-s, c, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1
	];
}

export function getTransformationMatrix(mRotateX: number[], mRotateY: number[], mRotateZ: number[], mProjection: number[])
{
	return matrixMulMatrix(matrixMulMatrix(matrixMulMatrix(mRotateZ, mRotateY), mRotateX), mProjection);
}

/* vector operations */

export function vecSumVec(v1: number[], v2: number[]) {
  const l = v1.length;
  const res = [];
	let i = 0;

	while(i < l) {
		res[i] = v1[i] + v2[i];
		i++;
	}

	return res;
}

export function vecMulValue(v: number[], mul: number) {
  const l = v.length;
  const res = [];

	for(let i = 0; i < l; i++)
	{
		res[i] = v[i] * mul;
	}

	return res;
}

export function matrixMulMatrix(m1: number[], m2: number[]) {
  const res = [];

	for(let i = 0; i < 4; i++)
	{
		for(let j = 0; j < 4; j++)
		{
			res[4 * i + j] = 0;

			for(let k = 0; k < 4; k++)
			{
					res[4 * i + j] += m1[4 * i + k] * m2[j + 4 * k];
			}
		}
	}

	return res;
}