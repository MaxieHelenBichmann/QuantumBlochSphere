'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { SphericalCoordinates } from '../types';
import { sphericalToCartesian } from '../utils/quantum-math';

interface TrajectoryProps {
  points: SphericalCoordinates[];
  color?: string;
  lineWidth?: number;
  fadeOpacity?: boolean;
  maxPoints?: number;
}

export function Trajectory({
  points,
  color = '#ff6b6b',
  lineWidth = 2,
  fadeOpacity = false,
  maxPoints = 100,
}: TrajectoryProps) {
  const linePoints = useMemo(() => {
    const recentPoints = points.slice(-maxPoints);
    return recentPoints.map((coords) => {
      const cart = sphericalToCartesian(coords);
      // Map to Three.js coordinate system (Y-up)
      return new THREE.Vector3(cart.x, cart.z, cart.y);
    });
  }, [points, maxPoints]);

  if (linePoints.length < 2) return null;

  return (
    <Line
      points={linePoints}
      color={color}
      lineWidth={lineWidth}
      opacity={fadeOpacity ? 0.7 : 1}
      transparent={fadeOpacity}
    />
  );
}
