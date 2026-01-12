import { describe, it, expect } from 'vitest';
import {
  amplitudesToSpherical,
  sphericalToAmplitudes,
  sphericalToCartesian,
  cartesianToSpherical,
  slerp,
  commonStates,
} from './quantum-math';

describe('quantum-math utilities', () => {
  describe('amplitudesToSpherical', () => {
    it('converts |0> state correctly', () => {
      const result = amplitudesToSpherical({
        alpha: { real: 1, imag: 0 },
        beta: { real: 0, imag: 0 },
      });
      expect(result.theta).toBeCloseTo(0);
    });

    it('converts |1> state correctly', () => {
      const result = amplitudesToSpherical({
        alpha: { real: 0, imag: 0 },
        beta: { real: 1, imag: 0 },
      });
      expect(result.theta).toBeCloseTo(Math.PI);
    });

    it('converts |+> state correctly', () => {
      const sqrt2inv = 1 / Math.sqrt(2);
      const result = amplitudesToSpherical({
        alpha: { real: sqrt2inv, imag: 0 },
        beta: { real: sqrt2inv, imag: 0 },
      });
      expect(result.theta).toBeCloseTo(Math.PI / 2);
      expect(result.phi).toBeCloseTo(0);
    });

    it('converts |-> state correctly', () => {
      const sqrt2inv = 1 / Math.sqrt(2);
      const result = amplitudesToSpherical({
        alpha: { real: sqrt2inv, imag: 0 },
        beta: { real: -sqrt2inv, imag: 0 },
      });
      expect(result.theta).toBeCloseTo(Math.PI / 2);
      expect(result.phi).toBeCloseTo(Math.PI);
    });

    it('converts |+i> state correctly', () => {
      const sqrt2inv = 1 / Math.sqrt(2);
      const result = amplitudesToSpherical({
        alpha: { real: sqrt2inv, imag: 0 },
        beta: { real: 0, imag: sqrt2inv },
      });
      expect(result.theta).toBeCloseTo(Math.PI / 2);
      expect(result.phi).toBeCloseTo(Math.PI / 2);
    });

    it('handles unnormalized states', () => {
      const result = amplitudesToSpherical({
        alpha: { real: 2, imag: 0 },
        beta: { real: 0, imag: 0 },
      });
      expect(result.theta).toBeCloseTo(0);
    });

    it('handles zero vector gracefully', () => {
      const result = amplitudesToSpherical({
        alpha: { real: 0, imag: 0 },
        beta: { real: 0, imag: 0 },
      });
      expect(result.theta).toBe(0);
      expect(result.phi).toBe(0);
    });
  });

  describe('sphericalToAmplitudes', () => {
    it('converts |0> state correctly', () => {
      const result = sphericalToAmplitudes({ theta: 0, phi: 0 });
      expect(result.alpha.real).toBeCloseTo(1);
      expect(result.alpha.imag).toBeCloseTo(0);
      expect(result.beta.real).toBeCloseTo(0);
      expect(result.beta.imag).toBeCloseTo(0);
    });

    it('converts |1> state correctly', () => {
      const result = sphericalToAmplitudes({ theta: Math.PI, phi: 0 });
      expect(result.alpha.real).toBeCloseTo(0);
      expect(result.beta.real).toBeCloseTo(1);
    });

    it('roundtrips with amplitudesToSpherical', () => {
      const original = { theta: Math.PI / 3, phi: Math.PI / 4 };
      const amplitudes = sphericalToAmplitudes(original);
      const result = amplitudesToSpherical(amplitudes);
      expect(result.theta).toBeCloseTo(original.theta);
      expect(result.phi).toBeCloseTo(original.phi);
    });
  });

  describe('sphericalToCartesian', () => {
    it('converts |0> (north pole) correctly', () => {
      const result = sphericalToCartesian({ theta: 0, phi: 0 });
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
      expect(result.z).toBeCloseTo(1);
    });

    it('converts |1> (south pole) correctly', () => {
      const result = sphericalToCartesian({ theta: Math.PI, phi: 0 });
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
      expect(result.z).toBeCloseTo(-1);
    });

    it('converts |+> (positive X) correctly', () => {
      const result = sphericalToCartesian({ theta: Math.PI / 2, phi: 0 });
      expect(result.x).toBeCloseTo(1);
      expect(result.y).toBeCloseTo(0);
      expect(result.z).toBeCloseTo(0);
    });

    it('converts |+i> (positive Y) correctly', () => {
      const result = sphericalToCartesian({ theta: Math.PI / 2, phi: Math.PI / 2 });
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(1);
      expect(result.z).toBeCloseTo(0);
    });

    it('produces unit vectors', () => {
      const coords = { theta: Math.PI / 3, phi: Math.PI / 5 };
      const result = sphericalToCartesian(coords);
      const magnitude = Math.sqrt(result.x ** 2 + result.y ** 2 + result.z ** 2);
      expect(magnitude).toBeCloseTo(1);
    });
  });

  describe('cartesianToSpherical', () => {
    it('converts north pole correctly', () => {
      const result = cartesianToSpherical({ x: 0, y: 0, z: 1 });
      expect(result.theta).toBeCloseTo(0);
    });

    it('converts south pole correctly', () => {
      const result = cartesianToSpherical({ x: 0, y: 0, z: -1 });
      expect(result.theta).toBeCloseTo(Math.PI);
    });

    it('roundtrips with sphericalToCartesian', () => {
      const original = { theta: Math.PI / 4, phi: Math.PI / 3 };
      const cartesian = sphericalToCartesian(original);
      const result = cartesianToSpherical(cartesian);
      expect(result.theta).toBeCloseTo(original.theta);
      expect(result.phi).toBeCloseTo(original.phi);
    });

    it('handles zero vector', () => {
      const result = cartesianToSpherical({ x: 0, y: 0, z: 0 });
      expect(result.theta).toBe(0);
      expect(result.phi).toBe(0);
    });
  });

  describe('slerp', () => {
    it('returns start at t=0', () => {
      const start = { theta: 0, phi: 0 };
      const end = { theta: Math.PI, phi: 0 };
      const result = slerp(start, end, 0);
      expect(result.theta).toBeCloseTo(start.theta);
    });

    it('returns end at t=1', () => {
      const start = { theta: 0, phi: 0 };
      const end = { theta: Math.PI, phi: 0 };
      const result = slerp(start, end, 1);
      expect(result.theta).toBeCloseTo(end.theta);
    });

    it('returns midpoint at t=0.5', () => {
      const start = { theta: 0, phi: 0 };
      const end = { theta: Math.PI, phi: 0 };
      const result = slerp(start, end, 0.5);
      expect(result.theta).toBeCloseTo(Math.PI / 2);
    });

    it('handles identical points', () => {
      const point = { theta: Math.PI / 4, phi: Math.PI / 4 };
      const result = slerp(point, point, 0.5);
      expect(result.theta).toBeCloseTo(point.theta);
      expect(result.phi).toBeCloseTo(point.phi);
    });

    it('produces points on the sphere surface', () => {
      const start = { theta: Math.PI / 4, phi: 0 };
      const end = { theta: Math.PI / 2, phi: Math.PI / 2 };

      for (let t = 0; t <= 1; t += 0.1) {
        const result = slerp(start, end, t);
        const cart = sphericalToCartesian(result);
        const magnitude = Math.sqrt(cart.x ** 2 + cart.y ** 2 + cart.z ** 2);
        expect(magnitude).toBeCloseTo(1);
      }
    });
  });

  describe('commonStates', () => {
    it('has correct |0> state', () => {
      const cart = sphericalToCartesian(commonStates.zero);
      expect(cart.z).toBeCloseTo(1);
    });

    it('has correct |1> state', () => {
      const cart = sphericalToCartesian(commonStates.one);
      expect(cart.z).toBeCloseTo(-1);
    });

    it('has correct |+> state', () => {
      const cart = sphericalToCartesian(commonStates.plus);
      expect(cart.x).toBeCloseTo(1);
    });

    it('has correct |-> state', () => {
      const cart = sphericalToCartesian(commonStates.minus);
      expect(cart.x).toBeCloseTo(-1);
    });

    it('has correct |+i> state', () => {
      const cart = sphericalToCartesian(commonStates.plusI);
      expect(cart.y).toBeCloseTo(1);
    });

    it('has correct |-i> state', () => {
      const cart = sphericalToCartesian(commonStates.minusI);
      expect(cart.y).toBeCloseTo(-1);
    });
  });
});
