import type { IWebGLProgramConfig } from "../WebGLProgram";

const vertexShader = `#version 300 es
// [radius, angle, z, size]
layout(location = 0) in vec4 a_position;
layout(location = 1) in vec3 a_color;

uniform mat4 u_transform;
uniform float u_distance;
uniform float u_max_h;

out vec4 v_color;

void main() {
  // calc position in object
  float x = a_position.x * cos(a_position.y);
  float y = a_position.x * sin(a_position.y);

  gl_Position = u_transform * vec4(x, y, a_position.z, u_distance);

  gl_PointSize = a_position.w * 2.0 / u_distance;

  float z = a_position.z;

  if(a_position.y < 0.0) {
    z = -a_position.z;
  }

  v_color = vec4(a_color, 1.0) * (1.0 - pow(z / u_max_h, 3.0));
}
`;

export const fragmentShader = `#version 300 es
precision mediump float;

uniform float u_light;

in vec4 v_color;
out vec4 out_color;

void main() {
  if(length(gl_PointCoord - 0.5) > 0.5) {
    discard;
  }

  out_color = v_color * u_light;
}
`;

export type TParticleShaderUniforms = 'u_transform' | 'u_distance' | 'u_max_h' | 'u_light';

export const particleShader: IWebGLProgramConfig<TParticleShaderUniforms> = {
  name: 'PARTICLE_SHADER',
  vertexShader,
  fragmentShader,
  uniforms: {
    u_transform: true,
    u_distance: true,
    u_max_h: true,
    u_light: true,
  },
};