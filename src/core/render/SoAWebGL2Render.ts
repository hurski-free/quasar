import { PARTICLES_BUFFER_GPU_ID } from "../buffers.const";
import type { ImmutableFrameView } from "../FrameView";
import type { ImmutableSession } from "../Session";
import { blackHoleShader, type TBlackHoleShaderUniforms } from "../WebGL/shaders/BlackHoleShader";
import { particleShader, type TParticleShaderUniforms } from "../WebGL/shaders/ParticleShader";
import { GLProgram } from "../WebGL/WebGLProgram";
import type { SoAWorld } from "../world/SoAWorld";
import type { IRender } from "./IRender";

export interface IWebGLRenderConfig {
  ctx: WebGL2RenderingContext;
}

export class SoAWebGL2Render implements IRender<SoAWorld> {
  private _gl: WebGL2RenderingContext;

  private particlesShader: GLProgram<TParticleShaderUniforms>;
  private blackHoleShader: GLProgram<TBlackHoleShaderUniforms>;

  private blackHoleBufferData: Float32Array;
  private blackHoleVAO: WebGLVertexArrayObject;
  private blackHoleVBO: WebGLBuffer;

  private particlesBufferData!: Float32Array;
  private particlesVAO: WebGLVertexArrayObject;
  private particlesVBO: WebGLBuffer;

  constructor(cfg: IWebGLRenderConfig) {
    this._gl = cfg.ctx;

    const gl = this._gl;

    this.particlesShader = new GLProgram(gl, particleShader);
    this.blackHoleShader = new GLProgram(gl, blackHoleShader);

    // WEBGL setup
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    this.blackHoleVAO = gl.createVertexArray();
    this.blackHoleVBO = gl.createBuffer();

    this.particlesVAO = gl.createVertexArray();
    this.particlesVBO = gl.createBuffer();

    this.blackHoleBufferData = new Float32Array(3);
    
    // bind black hole attributes

    gl.bindVertexArray(this.blackHoleVAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.blackHoleVBO);
    gl.bufferData(gl.ARRAY_BUFFER, this.blackHoleBufferData.byteLength, gl.DYNAMIC_DRAW);
    
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  render(world: SoAWorld, frameView: ImmutableFrameView, session: ImmutableSession): void {
    const gl = this._gl;

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw particles
    
    if (world.particlesPool.activeCount > 0) {
      gl.useProgram(this.particlesShader.program);
      gl.uniform1f(this.particlesShader.uniforms.u_light, 1.0);
      gl.uniformMatrix4fv(this.particlesShader.uniforms.u_transform, false, frameView.mTransform);
      gl.uniform1f(this.particlesShader.uniforms.u_distance, frameView.distance);
      gl.uniform1f(this.particlesShader.uniforms.u_radius, session.modelConfig.modelRadius);

      gl.bindVertexArray(this.particlesVAO);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesVBO);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.particlesBufferData.subarray(0, world.particlesPool.activeCount * 7));

      gl.drawArrays(gl.POINTS, 0, world.particlesPool.activeCount);
    }

    // Draw black hole
    
    gl.useProgram(this.blackHoleShader.program);
    gl.uniform1f(this.blackHoleShader.uniforms.u_distance, frameView.distance);
    
    gl.bindVertexArray(this.blackHoleVAO);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.blackHoleVBO);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  resize(frameView: ImmutableFrameView): void {
    this._gl.viewport(0, 0, frameView.width, frameView.height);
  }

  setupDrawData(world: SoAWorld, session: ImmutableSession): void {
    const gl = this._gl;

    this.blackHoleBufferData[2] = session.modelConfig.blackHoleDiameter;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.blackHoleVBO);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.blackHoleBufferData.subarray(0, 3));

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    this.particlesBufferData = world.particlesPool.getTypedArray(PARTICLES_BUFFER_GPU_ID);

    if (world.particlesPool.activeCount > 0) {
      gl.bindVertexArray(this.particlesVAO);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.particlesVBO);
      gl.bufferData(gl.ARRAY_BUFFER, Float32Array.BYTES_PER_ELEMENT * 7 * world.particlesPool.activeCount, gl.DYNAMIC_DRAW);

      gl.vertexAttribPointer(0, 4, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, 0);
      gl.enableVertexAttribArray(0);
  
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 7, Float32Array.BYTES_PER_ELEMENT * 4);
      gl.enableVertexAttribArray(1);
  
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
  }
}