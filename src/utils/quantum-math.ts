import type {
  ComplexAmplitude,
  SphericalCoordinates,
  CartesianCoordinates,
  EasingFunction,
} from '../types';

/**
 * Convert complex amplitudes to spherical coordinates on the Bloch sphere.
 * |psi> = alpha|0> + beta|1>
 * |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
 */
export function amplitudesToSpherical(
  amp: ComplexAmplitude
): SphericalCoordinates {
  const { alpha, beta } = amp;

  // Calculate magnitudes
  const alphaMag = Math.sqrt(alpha.real ** 2 + alpha.imag ** 2);
  const betaMag = Math.sqrt(beta.real ** 2 + beta.imag ** 2);

  // Normalize (handle edge case where state isn't normalized)
  const norm = Math.sqrt(alphaMag ** 2 + betaMag ** 2);

  if (norm === 0) {
    // Default to |0> state if zero vector
    return { theta: 0, phi: 0 };
  }

  const normAlphaMag = alphaMag / norm;

  // theta = 2 * arccos(|alpha|)
  // Clamp to prevent numerical errors with arccos
  const theta = 2 * Math.acos(Math.min(1, Math.max(0, normAlphaMag)));

  // phi = arg(beta) - arg(alpha)
  const alphaPhase = Math.atan2(alpha.imag, alpha.real);
  const betaPhase = Math.atan2(beta.imag, beta.real);
  let phi = betaPhase - alphaPhase;

  // Normalize phi to [0, 2*PI)
  while (phi < 0) phi += 2 * Math.PI;
  while (phi >= 2 * Math.PI) phi -= 2 * Math.PI;

  return { theta, phi };
}

/**
 * Convert spherical coordinates to complex amplitudes.
 * |psi> = cos(theta/2)|0> + e^(i*phi)*sin(theta/2)|1>
 */
export function sphericalToAmplitudes(
  coords: SphericalCoordinates
): ComplexAmplitude {
  const { theta, phi } = coords;

  const cosHalfTheta = Math.cos(theta / 2);
  const sinHalfTheta = Math.sin(theta / 2);

  return {
    alpha: { real: cosHalfTheta, imag: 0 },
    beta: {
      real: sinHalfTheta * Math.cos(phi),
      imag: sinHalfTheta * Math.sin(phi),
    },
  };
}

/**
 * Convert spherical coordinates to Cartesian coordinates.
 * Uses standard Bloch sphere convention:
 * - Z axis: |0> at top (z=1), |1> at bottom (z=-1)
 * - X axis: |+> at x=1, |-> at x=-1
 * - Y axis: |+i> at y=1, |-i> at y=-1
 */
export function sphericalToCartesian(
  coords: SphericalCoordinates
): CartesianCoordinates {
  const { theta, phi } = coords;
  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta),
  };
}

/**
 * Convert Cartesian coordinates back to spherical.
 */
export function cartesianToSpherical(
  cart: CartesianCoordinates
): SphericalCoordinates {
  const r = Math.sqrt(cart.x ** 2 + cart.y ** 2 + cart.z ** 2);

  if (r === 0) {
    return { theta: 0, phi: 0 };
  }

  const theta = Math.acos(Math.min(1, Math.max(-1, cart.z / r)));
  let phi = Math.atan2(cart.y, cart.x);

  // Normalize phi to [0, 2*PI)
  while (phi < 0) phi += 2 * Math.PI;

  return { theta, phi };
}

/**
 * Spherical linear interpolation (SLERP) for smooth animations.
 * Interpolates along the great circle on the sphere surface.
 */
export function slerp(
  start: SphericalCoordinates,
  end: SphericalCoordinates,
  t: number
): SphericalCoordinates {
  // Convert to Cartesian for proper slerp
  const startCart = sphericalToCartesian(start);
  const endCart = sphericalToCartesian(end);

  // Calculate dot product (cosine of angle between vectors)
  const dot =
    startCart.x * endCart.x + startCart.y * endCart.y + startCart.z * endCart.z;
  const clampedDot = Math.max(-1, Math.min(1, dot));
  const omega = Math.acos(clampedDot);

  // If vectors are nearly identical or opposite, use linear interpolation
  if (Math.abs(omega) < 0.0001) {
    return {
      theta: start.theta + t * (end.theta - start.theta),
      phi: start.phi + t * (end.phi - start.phi),
    };
  }

  const sinOmega = Math.sin(omega);
  const a = Math.sin((1 - t) * omega) / sinOmega;
  const b = Math.sin(t * omega) / sinOmega;

  const resultCart: CartesianCoordinates = {
    x: a * startCart.x + b * endCart.x,
    y: a * startCart.y + b * endCart.y,
    z: a * startCart.z + b * endCart.z,
  };

  return cartesianToSpherical(resultCart);
}

/**
 * Easing functions for animation
 */
export const easingFunctions: Record<EasingFunction, (t: number) => number> = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

/**
 * Common quantum states as spherical coordinates
 */
export const commonStates = {
  /** |0> - North pole */
  zero: { theta: 0, phi: 0 } as SphericalCoordinates,
  /** |1> - South pole */
  one: { theta: Math.PI, phi: 0 } as SphericalCoordinates,
  /** |+> = (|0> + |1>)/sqrt(2) - Positive X */
  plus: { theta: Math.PI / 2, phi: 0 } as SphericalCoordinates,
  /** |-> = (|0> - |1>)/sqrt(2) - Negative X */
  minus: { theta: Math.PI / 2, phi: Math.PI } as SphericalCoordinates,
  /** |+i> = (|0> + i|1>)/sqrt(2) - Positive Y */
  plusI: { theta: Math.PI / 2, phi: Math.PI / 2 } as SphericalCoordinates,
  /** |-i> = (|0> - i|1>)/sqrt(2) - Negative Y */
  minusI: {
    theta: Math.PI / 2,
    phi: (3 * Math.PI) / 2,
  } as SphericalCoordinates,
};
