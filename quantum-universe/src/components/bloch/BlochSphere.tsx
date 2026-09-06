import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlochScene } from './BlochScene';
import { BlochCoordinates } from '@types/quantum';

interface BlochSphereProps {
  coordinates: BlochCoordinates;
  previousCoordinates: BlochCoordinates | null;
  isAnimating: boolean;
  onAnimationComplete: () => void;
  className?: string;
}

export const BlochSphere: React.FC<BlochSphereProps> = ({
  coordinates,
  previousCoordinates,
  isAnimating,
  onAnimationComplete,
  className = ''
}) => {
  return (
    <div className={className} style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}
        frameloop={isAnimating ? 'always' : 'demand'} // Optimization: stop rendering when idle
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} color="#446983" />
        <pointLight position={[10, 10, 10]} intensity={1} color="#FFFFFF" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#7991A8" />
        
        <Suspense fallback={null}>
          <BlochScene 
            coordinates={coordinates}
            previousCoordinates={previousCoordinates}
            isAnimating={isAnimating}
            onAnimationComplete={onAnimationComplete}
          />
        </Suspense>

        <OrbitControls 
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6.0}
          enableDamping={true}
          dampingFactor={0.08}
          autoRotate={!isAnimating}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
