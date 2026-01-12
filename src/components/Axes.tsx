'use client';

import React from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface AxesProps {
  xColor?: string;
  yColor?: string;
  zColor?: string;
  length?: number;
  lineWidth?: number;
}

export function Axes({
  xColor = '#ff0000',
  yColor = '#00ff00',
  zColor = '#0000ff',
  length = 1.3,
  lineWidth = 1.5,
}: AxesProps) {
  const origin = new THREE.Vector3(0, 0, 0);

  return (
    <group>
      {/* X axis (red) */}
      <Line
        points={[
          new THREE.Vector3(-length, 0, 0),
          new THREE.Vector3(length, 0, 0),
        ]}
        color={xColor}
        lineWidth={lineWidth}
      />

      {/* Y axis (green) - Note: in Three.js Y is up, but we use Z for Bloch sphere */}
      <Line
        points={[
          new THREE.Vector3(0, -length, 0),
          new THREE.Vector3(0, length, 0),
        ]}
        color={yColor}
        lineWidth={lineWidth}
      />

      {/* Z axis (blue) */}
      <Line
        points={[
          new THREE.Vector3(0, 0, -length),
          new THREE.Vector3(0, 0, length),
        ]}
        color={zColor}
        lineWidth={lineWidth}
      />
    </group>
  );
}
