'use client';

import React from 'react';

interface SphereProps {
  color?: string;
  opacity?: number;
  radius?: number;
}

export function Sphere({
  color = '#4a90d9',
  opacity = 0.3,
  radius = 1,
}: SphereProps) {
  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        wireframe
      />
    </mesh>
  );
}
