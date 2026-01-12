'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface EquatorCircleProps {
  color?: string;
  lineWidth?: number;
  segments?: number;
  showMeridians?: boolean;
}

export function EquatorCircle({
  color = '#666666',
  lineWidth = 1,
  segments = 64,
  showMeridians = false,
}: EquatorCircleProps) {
  const { equatorPoints, meridianXZPoints, meridianYZPoints } = useMemo(() => {
    const equator: THREE.Vector3[] = [];
    const meridianXZ: THREE.Vector3[] = [];
    const meridianYZ: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;

      // Equator (XZ plane in Three.js, which is XY plane in Bloch sphere)
      equator.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));

      // Meridian in XY plane (Three.js)
      meridianXZ.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));

      // Meridian in YZ plane (Three.js)
      meridianYZ.push(new THREE.Vector3(0, Math.sin(angle), Math.cos(angle)));
    }

    return {
      equatorPoints: equator,
      meridianXZPoints: meridianXZ,
      meridianYZPoints: meridianYZ,
    };
  }, [segments]);

  return (
    <group>
      {/* Equator circle */}
      <Line points={equatorPoints} color={color} lineWidth={lineWidth} />

      {/* Optional meridian circles */}
      {showMeridians && (
        <>
          <Line
            points={meridianXZPoints}
            color={color}
            lineWidth={lineWidth}
            opacity={0.5}
            transparent
          />
          <Line
            points={meridianYZPoints}
            color={color}
            lineWidth={lineWidth}
            opacity={0.5}
            transparent
          />
        </>
      )}
    </group>
  );
}
