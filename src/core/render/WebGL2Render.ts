import type { Quasar } from "../Quasar";
import { blackHoleShader } from "../WebGL/shaders/BlackHoleShader";
import { particleShader } from "../WebGL/shaders/ParticleShader";
import { GLProgram } from "../WebGL/WebGLProgram";
import type { IRender } from "./IRender";

export interface IWebGLRenderConfig {
  ctx: WebGL2RenderingContext;
}

export class WebGL2dRender implements IRender {
  private quasarRef!: Quasar;

  private _gl: WebGL2RenderingContext;

  private particlesShader: GLProgram;
  private blackHoleShader: GLProgram;

  private blackHoleBufferData: Float32Array
  private blackHoleVAO: WebGLVertexArrayObject;
  private blackHoleVBO: WebGLBuffer;

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

    
    this.blackHoleBufferData = new Float32Array(3);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, this.blackHoleVBO);
    gl.bufferData(gl.ARRAY_BUFFER, this.blackHoleBufferData.byteLength, gl.DYNAMIC_DRAW);
    
    gl.bindVertexArray(this.blackHoleVAO);

    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    gl.bindVertexArray(null);
  }

  render(): void {
    const gl = this._gl;

    void this.particlesShader;

    const transformation = this.quasarRef.transformation;

    gl.useProgram(this.blackHoleShader.program);

    gl.uniform1f(gl.getUniformLocation(this.blackHoleShader.program, "u_distance"), transformation.distance);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, this.blackHoleVBO);

    gl.bindVertexArray(this.blackHoleVAO);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  resize(width: number, height: number): void {
    this._gl.viewport(0, 0, width, height);
  }

  bindMainClass(ref: Quasar): void {
    this.quasarRef = ref;
  }

  setupDrawData(): void {
    const gl = this._gl;

    this.blackHoleBufferData[2] = this.quasarRef.blackHoleRadius;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.blackHoleVBO);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.blackHoleBufferData.subarray(0, 3));

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }
}