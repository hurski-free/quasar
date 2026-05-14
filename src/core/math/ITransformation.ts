export interface ITransformation {
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

export interface ITransformationData {
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  distance: number;
  width: number;
  height: number;
}