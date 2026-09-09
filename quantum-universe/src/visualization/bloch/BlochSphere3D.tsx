import React from 'react';
import { Sphere, Line, Torus } from '@react-three/drei';

export const BlochSphere3D: React.FC = () => {
  return (
    <group>
      {/* Main Transparent Sphere */}
      <Sphere args={[1.0, 48, 48]}>
        <meshStandardMaterial
          color="#D4BBFF"
          transparent
          opacity={0.2}
          roughness={0.4}
          metalness={0.05}
        />
      </Sphere>

      {/* Meridians (Great Circles) */}
      <Torus args={[1.0, 0.004, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#BE95FF" transparent opacity={0.5} />
      </Torus>
      <Torus args={[1.0, 0.004, 16, 80]} rotation={[0, Math.PI / 2, 0]}>
        <meshBasicMaterial color="#BE95FF" transparent opacity={0.5} />
      </Torus>
      <Torus args={[1.0, 0.004, 16, 80]} rotation={[0, 0, Math.PI / 2]}>
        <meshBasicMaterial color="#BE95FF" transparent opacity={0.5} />
      </Torus>

      {/* Axes */}
      {/* Z-Axis (Vertical |0⟩ and |1⟩) */}
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#31135E" lineWidth={2} />
      
      {/* X-Axis */}
      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#6929C4" lineWidth={1.5} transparent opacity={0.7} />
      
      {/* Y-Axis */}
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#8A3FFC" lineWidth={1.5} transparent opacity={0.7} />
    </group>
  );
};
