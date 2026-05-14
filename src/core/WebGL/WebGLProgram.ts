export interface IWebGLProgramConfig<KEY extends string> {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<KEY, boolean>;
}

const SHADER_TYPE_TO_STR = {
  [35633]: 'VERTEX_SHADER',
  [35632]: 'FRAGMENT_SHADER',
} as Record<number, string>;

export class GLProgram<KEY extends string> {
  private _program: WebGLProgram;
  readonly uniforms: Record<KEY, WebGLUniformLocation>;

  constructor(gl: WebGLRenderingContext, programConfig: IWebGLProgramConfig<KEY>) {
    const vertexShader = this.createShader(gl, programConfig.vertexShader, gl.VERTEX_SHADER, programConfig.name);
    const fragmentShader = this.createShader(gl, programConfig.fragmentShader, gl.FRAGMENT_SHADER, programConfig.name);

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`[${programConfig.name}] Failed to link program: ${info}`);
  }

    this._program = program;
    this.uniforms = {} as Record<KEY, WebGLUniformLocation>;
    let uniformsInitialized = true;

    Object.keys(programConfig.uniforms).forEach(uniform => {
      const uniformLocation = gl.getUniformLocation(program, uniform);
      if (!uniformLocation) {
        console.log(`[${programConfig.name}] Uniform [${uniform}] not found`);
        uniformsInitialized = false;
      } else {
        this.uniforms[uniform as KEY] = uniformLocation;
      }
    });

    if (!uniformsInitialized) {
      gl.deleteProgram(program);
      throw new Error(`[${programConfig.name}] Failed to initialize uniforms`);
    }
  }

  get program() {
    return this._program;
  }

  private createShader(gl: WebGLRenderingContext, shaderSource: string, shaderType: number, pName: string) {
    const shader = gl.createShader(shaderType);

    if (!shader) {
      throw new Error('Failed to create shader');
    }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`[${pName}][${SHADER_TYPE_TO_STR[shaderType]}] Failed to compile shader: ${info}`);
    }

    return shader;
  }
}