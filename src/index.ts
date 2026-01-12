// Main component export
export { BlochSphere } from './BlochSphere';

// Type exports
export type {
  BlochSphereProps,
  QuantumState,
  SphericalCoordinates,
  CartesianCoordinates,
  ComplexAmplitude,
  Complex,
  AnimationConfig,
  TrajectoryConfig,
  BlochSphereStyle,
  CameraConfig,
  EasingFunction,
  OnStateChange,
} from './types';

// Utility exports for advanced usage
export {
  amplitudesToSpherical,
  sphericalToAmplitudes,
  sphericalToCartesian,
  cartesianToSpherical,
  slerp,
  commonStates,
} from './utils/quantum-math';

// Hook exports for custom implementations
export { useAnimation, useAnimationStatus } from './hooks';
