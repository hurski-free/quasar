export interface IFrameView {
  width: number;
  height: number;

  /**
   * Distance to the camera
   */
  distance: number;

  /**
   * Rotation matrix around X axis
   */
  mRotateX: number[];
  /**
   * Rotation matrix around Y axis
   */
  mRotateY: number[];
  /**
   * Rotation matrix around Z axis
   */
  mRotateZ: number[];
  /**
   * Projection matrix
   */
  mProjection: number[];
  
  /**
   * Final transformation matrix
   */
  mTransform: number[];
}

export type ImmutableFrameView = Readonly<IFrameView>;

export interface ITransformationData {
  readonly rotateX: number;
  readonly rotateY: number;
  readonly rotateZ: number;
  readonly distance: number;
  readonly width: number;
  readonly height: number;
}