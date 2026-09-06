import React from 'react';
import type { motion } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { BlochSphere } from '../components/bloch/BlochSphere';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { DiracNotation } from '../components/shared/DiracNotation';
import { MeasurementResult } from '../components/shared/MeasurementResult';
import type { SingleQubitGateId } from '@types/quantum';
import { Icon } from '../components/shared/Icon';

export const GateVisualizer: React.FC = () => {
  const {
    stateLabel,
    probabilities,
    blochCoordinates,
    previousState,
    isAnimating,
    isMeasured,
    measurementOutcome,
    gateHistory,
    applyGate,
    measure,
    resetGateVisualizer,
    setAnimationComplete
  } = useQuantumStore();

  const prevCoords = previousState ? require('@engine/index').getBlochCoordinates(previousState) : null;
  const availableGates: SingleQubitGateId[] = ['H', 'X', 'Y', 'Z', 'S', 'T'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
      style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-8)' }}
    >
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)' }}>Gate Visualizer</h1>
        <p style={{ color: 'var(--color-arctic)' }}>Watch how quantum gates manipulate a qubit's state vector on the Bloch sphere in real-time.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-8)' }}>
        {/* Left Column: Bloch Sphere */}
        <QuantumPanel variant="deep" className="animate-slide-up" style={{ height: '600px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
            <DiracNotation stateLabel={stateLabel} size="xl" />
          </div>
          <div style={{ flex: 1, position: 'relative' }}>
            <BlochSphere
              coordinates={blochCoordinates}
              previousCoordinates={prevCoords}
              isAnimating={isAnimating}
              onAnimationComplete={setAnimationComplete}
            />
          </div>
          {isMeasured && (
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10 }}>
              <MeasurementResult outcome={measurementOutcome} />
            </div>
          )}
        </QuantumPanel>

        {/* Right Column: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <QuantumPanel className="animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Apply Gates</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', justifyItems: 'center' }}>
                {availableGates.map(gate => (
                  <GateButton 
                    key={gate} 
                    gateId={gate} 
                    onClick={() => applyGate(gate)} 
                    disabled={isAnimating || isMeasured}
                  />
                ))}
              </div>
            </div>
          </QuantumPanel>

          <QuantumPanel className="animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Measurement Probabilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <ProbabilityBar label="|0⟩" probability={probabilities.p0} />
                <ProbabilityBar label="|1⟩" probability={probabilities.p1} colorBasis="1" />
              </div>
              <button 
                onClick={measure}
                disabled={isAnimating || isMeasured}
                style={{ 
                  marginTop: 'var(--space-6)', 
                  width: '100%', 
                  padding: '12px', 
                  background: (isAnimating || isMeasured) ? 'var(--color-midnight)' : 'var(--gradient-gate-button)',
                  border: `1px solid ${(isAnimating || isMeasured) ? 'rgba(56,80,106,0.3)' : 'var(--color-icicle)'}`,
                  color: (isAnimating || isMeasured) ? 'var(--color-polar)' : 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: (isAnimating || isMeasured) ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.3s ease'
                }}
              >
                Measure Qubit
              </button>
            </div>
          </QuantumPanel>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
             <button 
                onClick={resetGateVisualizer}
                disabled={isAnimating}
                style={{ 
                  padding: '12px 24px', 
                  background: 'transparent',
                  border: '1px solid var(--color-polar)',
                  color: 'var(--color-white)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.5 : 1
                }}
              >
                Reset System
              </button>
          </div>
        </div>
      </div>
      
      {/* Gate History */}
      {gateHistory.length > 0 && (
        <QuantumPanel className="animate-slide-up" style={{ animationDelay: '300ms', marginTop: 'var(--space-8)' }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Operation History</h3>
            <div style={{ display: 'flex', gap: 'var(--space-4)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
              {gateHistory.map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 'max-content' }}>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>{entry.labelBefore}</div>
                  <div style={{ color: 'var(--color-icicle)' }}>→</div>
                  <GateButton gateId={entry.gate} onClick={() => {}} disabled />
                  <div style={{ color: 'var(--color-icicle)' }}>→</div>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>{entry.labelAfter}</div>
                  
                  {idx < gateHistory.length - 1 && (
                    <div style={{ margin: '0 var(--space-4)', color: 'var(--color-polar)' }}>|</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </QuantumPanel>
      )}
    </motion.div>
  );
};
