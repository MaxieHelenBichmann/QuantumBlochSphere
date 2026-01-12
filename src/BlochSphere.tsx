'use client';

import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type {
  BlochSphereProps,
  SphericalCoordinates,
  BlochSphereStyle,
  CameraConfig,
} from './types';
import {
  Sphere,
  Axes,
  StateVector,
  AxisLabels,
  EquatorCircle,
  Trajectory,
} from './components';
import { useAnimation } from './hooks/useAnimation';
import {
  amplitudesToSpherical,
  sphericalToCartesian,
} from './utils/quantum-math';

const defaultStyle: Required<BlochSphereStyle> = {
  sphereColor: '#4a90d9',
  sphereOpacity: 0.3,
  stateVectorColor: '#ff4444',
  xAxisColor: '#ff0000',
  yAxisColor: '#00ff00',
  zAxisColor: '#0000ff',
  labelSize: 0.15,
  showLabels: true,
  showEquator: true,
  showMeridians: false,
  backgroundColor: 'transparent',
};

const defaultCamera: Required<CameraConfig> = {
  position: [2.5, 2.5, 2.5],
  fov: 50,
  enableOrbitControls: true,
  enableZoom: true,
  enablePan: false,
  autoRotateSpeed: 0,
};

export function BlochSphere({
  state,
  width = 400,
  height = 400,
  animation = {},
  trajectory = {},
  style = {},
  camera = {},
  onStateChange,
  onAnimationStart,
  onAnimationEnd,
  history = [],
  className,
}: BlochSphereProps) {
  const prevStateRef = useRef<SphericalCoordinates | null>(null);

  // Convert state to spherical if needed
  const targetSpherical = useMemo<SphericalCoordinates>(() => {
    if (state.type === 'spherical') {
      return state.coords;
    }
    return amplitudesToSpherical(state.amplitudes);
  }, [state]);

  // Animate state transitions
  const currentSpherical = useAnimation(
    targetSpherical,
    animation,
    onAnimationStart,
    onAnimationEnd
  );

  // Notify parent of state changes (only when animation completes or state changes)
  useEffect(() => {
    if (onStateChange) {
      // Check if state actually changed
      if (
        prevStateRef.current &&
        prevStateRef.current.theta === currentSpherical.theta &&
        prevStateRef.current.phi === currentSpherical.phi
      ) {
        return;
      }
      prevStateRef.current = currentSpherical;
      const cartesian = sphericalToCartesian(currentSpherical);
      onStateChange(currentSpherical, cartesian);
    }
  }, [currentSpherical, onStateChange]);

  // Merge styles with defaults
  const mergedStyle = { ...defaultStyle, ...style };
  const mergedCamera = { ...defaultCamera, ...camera };

  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: mergedStyle.backgroundColor,
      }}
    >
      <Canvas
        camera={{
          position: mergedCamera.position,
          fov: mergedCamera.fov,
        }}
        style={{ background: mergedStyle.backgroundColor }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        {/* Bloch Sphere Components */}
        <Sphere
          color={mergedStyle.sphereColor}
          opacity={mergedStyle.sphereOpacity}
        />

        <Axes
          xColor={mergedStyle.xAxisColor}
          yColor={mergedStyle.yAxisColor}
          zColor={mergedStyle.zAxisColor}
        />

        {mergedStyle.showEquator && (
          <EquatorCircle showMeridians={mergedStyle.showMeridians} />
        )}

        {mergedStyle.showLabels && (
          <AxisLabels size={mergedStyle.labelSize} />
        )}

        <StateVector
          theta={currentSpherical.theta}
          phi={currentSpherical.phi}
          color={mergedStyle.stateVectorColor}
        />

        {trajectory.enabled && history.length > 1 && (
          <Trajectory
            points={history}
            color={trajectory.color || '#ff6b6b'}
            lineWidth={trajectory.lineWidth || 2}
            fadeOpacity={trajectory.fadeOpacity || false}
            maxPoints={trajectory.maxPoints || 100}
          />
        )}

        {/* Camera Controls */}
        {mergedCamera.enableOrbitControls && (
          <OrbitControls
            enableZoom={mergedCamera.enableZoom}
            enablePan={mergedCamera.enablePan}
            autoRotate={mergedCamera.autoRotateSpeed > 0}
            autoRotateSpeed={mergedCamera.autoRotateSpeed}
          />
        )}
      </Canvas>
    </div>
  );
}
