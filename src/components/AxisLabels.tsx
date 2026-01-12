'use client';

import React from 'react';
import { Text } from '@react-three/drei';

interface AxisLabelsProps {
  size?: number;
  color?: string;
  offset?: number;
}

export function AxisLabels({
  size = 0.15,
  color = '#ffffff',
  offset = 1.5,
}: AxisLabelsProps) {
  return (
    <group>
      {/* Z axis labels (|0> and |1>) */}
      <Text
        position={[0, offset, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        |0⟩
      </Text>
      <Text
        position={[0, -offset, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        |1⟩
      </Text>

      {/* X axis labels (|+> and |->) */}
      <Text
        position={[offset, 0, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        |+⟩
      </Text>
      <Text
        position={[-offset, 0, 0]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        |-⟩
      </Text>

      {/* Y axis labels (|+i> and |-i>) */}
      <Text
        position={[0, 0, offset]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        |+i⟩
      </Text>
      <Text
        position={[0, 0, -offset]}
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        |-i⟩
      </Text>
    </group>
  );
}
