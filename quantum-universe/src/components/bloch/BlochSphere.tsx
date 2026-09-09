import React, { Suspense, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { BlochScene } from '@viz/bloch/BlochScene';
import type { BlochCoordinates } from '@quantum-types/quantum';

interface BlochSphereProps {
  coordinates: BlochCoordinates;
  previousCoordinates: BlochCoordinates | null;
  isAnimating: boolean;
  onAnimationComplete: () => void;
  className?: string;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackCoords: BlochCoordinates;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.warn('WebGL / Bloch Sphere Canvas initialization failed, falling back gracefully:', error, info);
  }

  render() {
    if (this.state.hasError) {
      const { x, y, z } = this.props.fallbackCoords;
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--space-6)',
          textAlign: 'center',
          background: 'var(--color-purple-10, #F6F2FF)',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px dashed var(--border-default, #D4BBFF)',
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--color-purple-20, #E8DAFF)',
            border: '2px solid var(--color-purple-60, #8A3FFC)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 'var(--space-4)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '18px',
            color: 'var(--color-purple-60, #8A3FFC)',
          }}>
            Ψ
          </div>
          <h4 style={{ color: 'var(--text-primary, #181126)', marginBottom: 'var(--space-2)', fontSize: '15px' }}>
            Bloch Sphere (2D State Fallback)
          </h4>
          <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: '13px', maxWidth: '320px', lineHeight: 1.5, marginBottom: 'var(--space-3)' }}>
            Hardware 3D acceleration is not available in this environment. Quantum state vectors remain mathematically active.
          </p>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            background: 'var(--color-white, #FFFFFF)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-default, #D4BBFF)',
            color: 'var(--text-primary, #181126)'
          }}>
            Coordinates: X={x.toFixed(3)}, Y={y.toFixed(3)}, Z={z.toFixed(3)}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
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
      <WebGLErrorBoundary fallbackCoords={coordinates}>
        <Canvas
          camera={{ position: [2.5, 1.5, 2.5], fov: 45 }}
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
      </WebGLErrorBoundary>
    </div>
  );
};
