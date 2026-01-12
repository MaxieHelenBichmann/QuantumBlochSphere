/**
 * Complex number representation
 */
export interface Complex {
  real: number;
  imag: number;
}

/**
 * Complex amplitude representation of a qubit state
 * |psi> = alpha|0> + beta|1>
 */
export interface ComplexAmplitude {
  alpha: Complex;
  beta: Complex;
}

/**
 * Spherical coordinate representation
 * |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
 */
export interface SphericalCoordinates {
  /** Polar angle [0, PI] - from +Z axis */
  theta: number;
  /** Azimuthal angle [0, 2*PI] - from +X axis in XY plane */
  phi: number;
}

/**
 * Cartesian coordinates for 3D positioning
 */
export interface CartesianCoordinates {
  x: number;
  y: number;
  z: number;
}

/**
 * Quantum state can be specified in either format
 */
export type QuantumState =
  | { type: 'spherical'; coords: SphericalCoordinates }
  | { type: 'amplitudes'; amplitudes: ComplexAmplitude };

/**
 * Animation easing function types
 */
export type EasingFunction = 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Enable/disable animation for state transitions */
  enabled?: boolean;
  /** Duration of state transition in milliseconds */
  duration?: number;
  /** Easing function */
  easing?: EasingFunction;
}

/**
 * Trajectory/history configuration
 */
export interface TrajectoryConfig {
  /** Enable trajectory visualization */
  enabled?: boolean;
  /** Maximum number of points to keep in history */
  maxPoints?: number;
  /** Color of the trajectory line */
  color?: string;
  /** Line width/thickness */
  lineWidth?: number;
  /** Opacity of older points (creates fade effect) */
  fadeOpacity?: boolean;
}

/**
 * Style customization options
 */
export interface BlochSphereStyle {
  /** Sphere wireframe color */
  sphereColor?: string;
  /** Sphere opacity */
  sphereOpacity?: number;
  /** State vector arrow color */
  stateVectorColor?: string;
  /** X-axis color (default: red) */
  xAxisColor?: string;
  /** Y-axis color (default: green) */
  yAxisColor?: string;
  /** Z-axis color (default: blue) */
  zAxisColor?: string;
  /** Label font size */
  labelSize?: number;
  /** Show axis labels (|0>, |1>, etc.) */
  showLabels?: boolean;
  /** Show equator circle */
  showEquator?: boolean;
  /** Show meridian circles */
  showMeridians?: boolean;
  /** Background color (or 'transparent') */
  backgroundColor?: string;
}

/**
 * Camera/view configuration
 */
export interface CameraConfig {
  /** Initial camera position [x, y, z] */
  position?: [number, number, number];
  /** Field of view in degrees */
  fov?: number;
  /** Enable orbit controls (zoom, rotate) */
  enableOrbitControls?: boolean;
  /** Enable zoom */
  enableZoom?: boolean;
  /** Enable pan */
  enablePan?: boolean;
  /** Auto-rotate speed (0 to disable) */
  autoRotateSpeed?: number;
}

/**
 * Callback for state changes
 */
export type OnStateChange = (
  state: SphericalCoordinates,
  cartesian: CartesianCoordinates
) => void;

/**
 * Main BlochSphere component props
 */
export interface BlochSphereProps {
  /** Current quantum state (controlled component) */
  state: QuantumState;

  /** Width of the canvas (CSS value or number in pixels) */
  width?: number | string;
  /** Height of the canvas (CSS value or number in pixels) */
  height?: number | string;
  /** Animation configuration */
  animation?: AnimationConfig;
  /** Trajectory visualization config */
  trajectory?: TrajectoryConfig;
  /** Visual style customization */
  style?: BlochSphereStyle;
  /** Camera and controls configuration */
  camera?: CameraConfig;

  /** Called when state transition completes (after animation) */
  onStateChange?: OnStateChange;
  /** Called when animation starts */
  onAnimationStart?: () => void;
  /** Called when animation ends */
  onAnimationEnd?: () => void;

  /**
   * External history array for trajectory visualization.
   * Use this with onStateChange to maintain history externally.
   */
  history?: SphericalCoordinates[];

  /** CSS class name for the container */
  className?: string;
}
