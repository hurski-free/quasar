import type { IWebGLProgramConfig } from "../WebGLProgram";

const vertexShader = `#version 300 es
// [polarR, polarAngle, z, diameter]
layout(location = 0) in vec4 a_position;
layout(location = 1) in vec3 a_color;

uniform mat4 u_transform;
uniform float u_distance;

out vec4 v_color;

const vec3 center_color = vec3(0.8, 0.9, 1.0);

void main() {
  // calc position in object
  float x = a_position.x * cos(a_position.y);
  float y = a_position.x * sin(a_position.y);

  gl_Position = u_transform * vec4(x, y, a_position.z, u_distance);
  // gl_PointSize = a_position.w / u_distance;
  gl_PointSize = a_position.w;

  v_color = vec4(a_color, 1.0);
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

export type TJetShaderUniforms = 'u_transform' | 'u_distance' | 'u_light';

export const jetShader: IWebGLProgramConfig<TJetShaderUniforms> = {
  name: 'JET_SHADER',
  vertexShader,
  fragmentShader,
  uniforms: {
    u_transform: true,
    u_distance: true,
    u_light: true,
  },
};