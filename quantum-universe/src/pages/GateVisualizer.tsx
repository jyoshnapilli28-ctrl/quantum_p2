import React from 'react';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { BlochSphere } from '../components/bloch/BlochSphere';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { DiracNotation } from '../components/shared/DiracNotation';
import { MeasurementResult } from '../components/shared/MeasurementResult';
import type { SingleQubitGateId } from '@quantum-types/quantum';
import { getBlochCoordinates } from '@engine/index';

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

  const prevCoords = previousState ? getBlochCoordinates(previousState) : null;
  const availableGates: SingleQubitGateId[] = ['H', 'X', 'Y', 'Z', 'S', 'T'];

  return (
    <div
      className="page-container"
      style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-6)', maxWidth: '1120px', margin: '0 auto', padding: '0 var(--space-6)' }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)' }}>
          Quantum Gate Visualizer
        </h1>
        <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body)', margin: 0 }}>
          Observe how single-qubit unitary gates rotate the state vector on the Bloch sphere and deterministically shift measurement probabilities.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Left Column: 3D Bloch Sphere */}
        <QuantumPanel variant="default" hoverable={false} style={{ height: '540px', display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--color-white, #FFFFFF)', border: '1px solid var(--border-default, #D4BBFF)' }}>
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

        {/* Right Column: Gate Controls & Probability */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Gate Selection Matrix */}
          <QuantumPanel>
            <div style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-h3)' }}>
                Unitary Gate Selection
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-3)', justifyItems: 'center' }}>
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

          {/* Probability Distribution */}
          <QuantumPanel>
            <div style={{ padding: 'var(--space-5)' }}>
              <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-h3)' }}>
                Measurement Probabilities
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <ProbabilityBar label="|0⟩" probability={probabilities.p0} />
                <ProbabilityBar label="|1⟩" probability={probabilities.p1} colorBasis="1" />
              </div>
              <button 
                type="button"
                className="qynx-btn"
                onClick={measure}
                disabled={isAnimating || isMeasured}
                style={{ 
                  marginTop: 'var(--space-5)', 
                  width: '100%', 
                  padding: '11px',
                  background: (isAnimating || isMeasured) ? 'var(--color-purple-20, #E8DAFF)' : 'var(--color-purple-60, #8A3FFC)',
                  border: `1px solid ${(isAnimating || isMeasured) ? 'var(--border-default, #D4BBFF)' : 'var(--color-purple-60, #8A3FFC)'}`,
                  color: (isAnimating || isMeasured) ? 'var(--text-secondary, #4D3E6B)' : 'var(--color-white)',
                  cursor: (isAnimating || isMeasured) ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                {isMeasured ? 'Qubit Measured' : 'Measure Qubit'}
              </button>
            </div>
          </QuantumPanel>

          {/* Reset System */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
             <button 
                type="button"
                className="qynx-btn qynx-btn-secondary"
                onClick={resetGateVisualizer}
                disabled={isAnimating}
                style={{ 
                  padding: '8px 18px', 
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  opacity: isAnimating ? 0.5 : 1
                }}
              >
                Reset System State
              </button>
          </div>
        </div>
      </div>
      
      {/* Operation History */}
      {gateHistory.length > 0 && (
        <QuantumPanel style={{ marginTop: 'var(--space-2)' }}>
          <div style={{ padding: 'var(--space-5)' }}>
            <h3 style={{ marginBottom: 'var(--space-3)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-h3)' }}>
              Operation History
            </h3>
            <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
              {gateHistory.map((entry, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minWidth: 'max-content' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)' }}>
                    {entry.labelBefore}
                  </div>
                  <div style={{ color: 'var(--color-purple-60, #8A3FFC)' }}>→</div>
                  <GateButton gateId={entry.gate} onClick={() => {}} disabled />
                  <div style={{ color: 'var(--color-purple-60, #8A3FFC)' }}>→</div>
                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)' }}>
                    {entry.labelAfter}
                  </div>
                  
                  {idx < gateHistory.length - 1 && (
                    <div style={{ margin: '0 var(--space-3)', color: 'var(--border-default, #D4BBFF)' }}>|</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </QuantumPanel>
      )}
    </div>
  );
};
