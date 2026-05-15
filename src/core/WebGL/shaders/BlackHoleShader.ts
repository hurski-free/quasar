import type { IWebGLProgramConfig } from "../WebGLProgram";

const vertexShader = `#version 300 es
layout(location = 0) in vec3 a_position;

uniform float u_distance;

void main() {
  gl_Position = vec4(a_position.xy, 0.0, 1.0);
  gl_PointSize = a_position.z * 1.3 / u_distance;
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;

out vec4 out_color;

const float MIN_POINT_RADIUS = 0.375;
const float MAX_POINT_RADIUS = 0.5;
const float CORE_RADIUS = MAX_POINT_RADIUS / 1.3;

const vec3 BLACK_HOLE_HALO_COLOR = vec3(0.9921, 0.7647, 0.4941);
// const vec3 BLACK_HOLE_HALO_COLOR = vec3(0.0, 0.0, 0.0);

void main() {
  float dist = length(gl_PointCoord - 0.5);
  float alpha = 1.0;

  if (dist > CORE_RADIUS) {
    alpha -= pow((dist - CORE_RADIUS) / (MAX_POINT_RADIUS - CORE_RADIUS), 0.5);
  } else if (dist > MIN_POINT_RADIUS) {
    // inverse interpolation
    alpha = pow((dist - MIN_POINT_RADIUS) / (MAX_POINT_RADIUS - MIN_POINT_RADIUS), 0.5);
  } else {
    out_color = vec4(0.0, 0.0, 0.0, 1.0);
    return;
  }

  if (alpha < 0.001) discard;

  out_color = vec4(BLACK_HOLE_HALO_COLOR, alpha);
}
`;

export type TBlackHoleShaderUniforms = 'u_distance';

export const blackHoleShader: IWebGLProgramConfig<TBlackHoleShaderUniforms> = {
  name: 'BLACK_HOLE_SHADER',
  vertexShader,
  fragmentShader,
  uniforms: {
    u_distance: true,
  },
};