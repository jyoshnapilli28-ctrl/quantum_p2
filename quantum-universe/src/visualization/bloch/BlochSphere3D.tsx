import React from 'react';
import { Sphere, Line, Torus } from '@react-three/drei';

export const BlochSphere3D: React.FC = () => {
  return (
    <group>
      {/* Main Glass Sphere */}
      <Sphere args={[1.0, 64, 64]}>
        <meshPhysicalMaterial
          color="#0B132B" // Deep Navy
          transparent
          opacity={0.35}
          roughness={0.05}
          transmission={0.5}
          thickness={0.5}
        />
      </Sphere>

      {/* Meridians (Great Circles) */}
      <Torus args={[1.0, 0.005, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#38506A" transparent opacity={0.4} /> {/* Polar */}
      </Torus>
      <Torus args={[1.0, 0.005, 16, 100]} rotation={[0, Math.PI / 2, 0]}>
        <meshBasicMaterial color="#38506A" transparent opacity={0.4} />
      </Torus>
      <Torus args={[1.0, 0.005, 16, 100]} rotation={[0, 0, Math.PI / 2]}>
        <meshBasicMaterial color="#38506A" transparent opacity={0.4} />
      </Torus>

      {/* Axes */}
      {/* Z-Axis (Up/Down) - Arctic #7991A8 */}
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#7991A8" lineWidth={1} />
      
      {/* X-Axis - Icicle #446983 (Dimmer) */}
      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#446983" lineWidth={1} transparent opacity={0.6} />
      
      {/* Y-Axis (Depth) - Icicle */}
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#446983" lineWidth={1} transparent opacity={0.6} />
    </group>
  );
};
