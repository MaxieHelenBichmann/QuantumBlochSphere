'use client';

import React from 'react';
import { Text } from '@react-three/drei';
import type { AxisLabelSet } from '../types';

interface AxisLabelsProps {
  size?: number;
  color?: string;
  offset?: number;
  labels?: AxisLabelSet;
}

export function AxisLabels({
  size = 0.15,
  color = '#ffffff',
  offset = 1.5,
  labels,
}: AxisLabelsProps) {
  const zPos = labels?.zPositive ?? '|0⟩';
  const zNeg = labels?.zNegative ?? '|1⟩';
  const xPos = labels?.xPositive ?? '|+⟩';
  const xNeg = labels?.xNegative ?? '|-⟩';
  const yPos = labels?.yPositive ?? '|+i⟩';
  const yNeg = labels?.yNegative ?? '|-i⟩';

  return (
    <group>
      {/* Z axis labels */}
      <Text
        position={[0, offset, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {zPos}
      </Text>
      <Text
        position={[0, -offset, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {zNeg}
      </Text>

      {/* X axis labels */}
      <Text
        position={[offset, 0, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {xPos}
      </Text>
      <Text
        position={[-offset, 0, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {xNeg}
      </Text>

      {/* Y axis labels */}
      <Text
        position={[0, 0, offset]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {yPos}
      </Text>
      <Text
        position={[0, 0, -offset]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {yNeg}
      </Text>
    </group>
  );
}
