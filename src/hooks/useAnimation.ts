'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SphericalCoordinates, AnimationConfig } from '../types';
import { slerp, easingFunctions } from '../utils/quantum-math';

/**
 * Hook for animating between Bloch sphere states using spherical interpolation.
 *
 * @param targetState - The target spherical coordinates to animate to
 * @param config - Animation configuration (duration, easing, enabled)
 * @param onStart - Callback when animation starts
 * @param onEnd - Callback when animation ends
 * @returns Current interpolated state
 */
export function useAnimation(
  targetState: SphericalCoordinates,
  config: AnimationConfig = {},
  onStart?: () => void,
  onEnd?: () => void
): SphericalCoordinates {
  const { enabled = true, duration = 300, easing = 'easeInOut' } = config;

  const [currentState, setCurrentState] = useState(targetState);
  const animationRef = useRef<number | null>(null);
  const startStateRef = useRef(targetState);
  const startTimeRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);
  const prevTargetRef = useRef(targetState);

  // Check if target actually changed
  const targetChanged =
    prevTargetRef.current.theta !== targetState.theta ||
    prevTargetRef.current.phi !== targetState.phi;

  useEffect(() => {
    // Skip animation on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setCurrentState(targetState);
      prevTargetRef.current = targetState;
      return;
    }

    // Skip if target hasn't changed
    if (!targetChanged) {
      return;
    }

    prevTargetRef.current = targetState;

    // If animation disabled, jump immediately
    if (!enabled) {
      setCurrentState(targetState);
      return;
    }

    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startStateRef.current = currentState;
    startTimeRef.current = null;
    onStart?.();

    const easingFn = easingFunctions[easing];

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easingFn(progress);

      const interpolated = slerp(
        startStateRef.current,
        targetState,
        easedProgress
      );
      setCurrentState(interpolated);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        animationRef.current = null;
        onEnd?.();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetState.theta, targetState.phi, enabled, duration, easing]);

  return currentState;
}

/**
 * Hook to check if an animation is currently in progress
 */
export function useAnimationStatus(
  targetState: SphericalCoordinates,
  currentState: SphericalCoordinates,
  threshold = 0.001
): boolean {
  const thetaDiff = Math.abs(targetState.theta - currentState.theta);
  const phiDiff = Math.abs(targetState.phi - currentState.phi);
  return thetaDiff > threshold || phiDiff > threshold;
}
