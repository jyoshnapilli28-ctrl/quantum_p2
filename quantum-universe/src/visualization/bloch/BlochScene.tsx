import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BlochSphere3D } from './BlochSphere3D';
import { StateVector } from './StateVector';
import type { BlochCoordinates } from '@types/quantum';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface BlochSceneProps {
  coordinates: BlochCoordinates;
  previousCoordinates: BlochCoordinates | null;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

// Map Three.js Y (up) to Quantum Mechanics Z (up)
// QM: Z is up/down, X is front/back, Y is left/right
// Three: Y is up/down, Z is front/back, X is left/right
const mapCoords = (coords: BlochCoordinates) => new THREE.Vector3(coords.y, coords.z, coords.x);

export const BlochScene: React.FC<BlochSceneProps> = ({
  coordinates,
  previousCoordinates,
  isAnimating,
  onAnimationComplete
}) => {
  const prefersReducedMotion = useReducedMotion();
  const currentVecRef = useRef<THREE.Vector3>(mapCoords(coordinates));
  const progressRef = useRef(1);

  const targetVec = mapCoords(coordinates);
  const startVec = previousCoordinates ? mapCoords(previousCoordinates) : targetVec;

  useEffect(() => {
    if (isAnimating) {
      if (prefersReducedMotion) {
        currentVecRef.current.copy(targetVec);
        onAnimationComplete();
      } else {
        progressRef.current = 0;
      }
    }
  }, [coordinates, isAnimating, prefersReducedMotion]);

  useFrame((_, delta) => {
    if (isAnimating && !prefersReducedMotion) {
      progressRef.current += delta / 0.6; // 600ms duration
      
      if (progressRef.current >= 1) {
        currentVecRef.current.copy(targetVec);
        onAnimationComplete();
      } else {
        // Cubic bezier easing (0.4, 0, 0.2, 1) approximation
        const t = progressRef.current;
        const easeT = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        // Spherical interpolation on unit sphere
        currentVecRef.current.copy(startVec).lerp(targetVec, easeT).normalize();
      }
    }
  });

  return (
    <group>
      <BlochSphere3D />
      
      <StateVector 
        x={currentVecRef.current.x} 
        y={currentVecRef.current.y} 
        z={currentVecRef.current.z} 
      />

      {/* State Labels (Z axis) */}
      <Html position={[0, 1.3, 0]} center style={{ color: 'white', fontFamily: 'var(--font-mono)', userSelect: 'none' }}>
        |0⟩
      </Html>
      <Html position={[0, -1.3, 0]} center style={{ color: 'white', fontFamily: 'var(--font-mono)', userSelect: 'none' }}>
        |1⟩
      </Html>

      {/* X axis */}
      <Html position={[0, 0, 1.3]} center style={{ color: '#446983', fontFamily: 'var(--font-mono)', fontSize: '12px', userSelect: 'none' }}>
        |+⟩ (X)
      </Html>
      <Html position={[0, 0, -1.3]} center style={{ color: '#446983', fontFamily: 'var(--font-mono)', fontSize: '12px', userSelect: 'none' }}>
        |-⟩ (-X)
      </Html>

      {/* Y axis */}
      <Html position={[1.3, 0, 0]} center style={{ color: '#446983', fontFamily: 'var(--font-mono)', fontSize: '12px', userSelect: 'none' }}>
        |i⟩ (Y)
      </Html>
      <Html position={[-1.3, 0, 0]} center style={{ color: '#446983', fontFamily: 'var(--font-mono)', fontSize: '12px', userSelect: 'none' }}>
        |-i⟩ (-Y)
      </Html>
    </group>
  );
};
