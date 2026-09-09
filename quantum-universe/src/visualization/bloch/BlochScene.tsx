import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { BlochSphere3D } from './BlochSphere3D';
import { StateVector } from './StateVector';
import type { BlochCoordinates } from '@types/quantum';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { animationConfig } from '../../animations/animationConfig';

interface BlochSceneProps {
  coordinates: BlochCoordinates;
  previousCoordinates: BlochCoordinates | null;
  isAnimating: boolean;
  onAnimationComplete: () => void;
}

// Map Quantum Mechanics coordinates to Three.js (Y-up convention):
// QM: Z is vertical (|0> up, |1> down), X is front, Y is lateral
// Three.js: Y is up (+Y = +Z_qm), X is lateral, Z is front
const mapCoords = (coords: BlochCoordinates) => new THREE.Vector3(coords.x, coords.z, coords.y);

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
  const durationSec = animationConfig.durations.blochTransition / 1000;

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
      progressRef.current += delta / durationSec;
      
      if (progressRef.current >= 1) {
        currentVecRef.current.copy(targetVec);
        onAnimationComplete();
      } else {
        // Smooth S-curve easing: 3*t^2 - 2*t^3 (smoothstep)
        const t = progressRef.current;
        const easeT = t * t * (3 - 2 * t);
        
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

      {/* State Labels (Z axis - North/South poles) */}
      <Html position={[0, 1.25, 0]} center style={{ color: '#181126', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '15px', userSelect: 'none', background: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '4px', border: '1px solid #D4BBFF' }}>
        |0⟩
      </Html>
      <Html position={[0, -1.25, 0]} center style={{ color: '#181126', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '15px', userSelect: 'none', background: 'rgba(255,255,255,0.9)', padding: '1px 6px', borderRadius: '4px', border: '1px solid #D4BBFF' }}>
        |1⟩
      </Html>

      {/* X axis */}
      <Html position={[1.25, 0, 0]} center style={{ color: '#6929C4', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, userSelect: 'none', background: 'rgba(255,255,255,0.85)', padding: '1px 5px', borderRadius: '3px', border: '1px solid #E8DAFF' }}>
        |+⟩ (X)
      </Html>
      <Html position={[-1.25, 0, 0]} center style={{ color: '#6929C4', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, userSelect: 'none', background: 'rgba(255,255,255,0.85)', padding: '1px 5px', borderRadius: '3px', border: '1px solid #E8DAFF' }}>
        |-⟩ (-X)
      </Html>

      {/* Y axis */}
      <Html position={[0, 0, 1.25]} center style={{ color: '#8A3FFC', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, userSelect: 'none', background: 'rgba(255,255,255,0.85)', padding: '1px 5px', borderRadius: '3px', border: '1px solid #E8DAFF' }}>
        |i⟩ (Y)
      </Html>
      <Html position={[0, 0, -1.25]} center style={{ color: '#8A3FFC', fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, userSelect: 'none', background: 'rgba(255,255,255,0.85)', padding: '1px 5px', borderRadius: '3px', border: '1px solid #E8DAFF' }}>
        |-i⟩ (-Y)
      </Html>
    </group>
  );
};
