'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { sphericalToCartesian } from '../utils/quantum-math';

interface StateVectorProps {
  theta: number;
  phi: number;
  color?: string;
  lineWidth?: number;
}

export function StateVector({
  theta,
  phi,
  color = '#ff4444',
  lineWidth = 3,
}: StateVectorProps) {
  const { position, quaternion, arrowEnd } = useMemo(() => {
    const cart = sphericalToCartesian({ theta, phi });
    // In Three.js: we map Bloch sphere (x,y,z) to Three.js (x,z,y) for Y-up convention
    // Actually, let's keep it simple: x->x, y->y, z->z but rotate the camera
    const position = new THREE.Vector3(cart.x, cart.z, cart.y);

    // Calculate rotation to point cone in correct direction
    const direction = position.clone().normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    // Arrow shaft ends slightly before the tip to leave room for the cone
    const arrowLength = 0.92;
    const arrowEnd = position.clone().normalize().multiplyScalar(arrowLength);

    return { position, quaternion, arrowEnd };
  }, [theta, phi]);

  const origin = new THREE.Vector3(0, 0, 0);

  return (
    <group>
      {/* Arrow shaft */}
      <Line points={[origin, arrowEnd]} color={color} lineWidth={lineWidth} />
      {/* Arrow head (cone) */}
      <mesh position={position} quaternion={quaternion}>
        <coneGeometry args={[0.06, 0.15, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}
