import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { Icon } from '../components/shared/Icon';

export const EntanglementSimulator: React.FC = () => {
  const {
    twoQubitState,
    isEntangled,
    probabilities4,
    measurementResult,
    workflowStep,
    applyHToA,
    applyCNOT,
    measure,
    resetEntanglement
  } = useQuantumStore();

  useEffect(() => {
    return () => resetEntanglement();
  }, [resetEntanglement]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)' }}>Entanglement Simulator</h1>
        <p style={{ color: 'var(--color-arctic)' }}>Explore the spooky action at a distance between two qubits.</p>
      </div>

      {/* Circuit & Workflow Diagram */}
      <QuantumPanel variant="deep" className="animate-slide-up">
        <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
          <h3 style={{ color: 'var(--color-arctic)', marginBottom: 'var(--space-4)' }}>Bell State Circuit (Φ⁺)</h3>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-6)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-lg)', color: 'var(--color-white)', flexWrap: 'wrap' }}>
            <div style={{ padding: '8px 16px', background: workflowStep === 'START' ? 'rgba(68, 105, 131, 0.4)' : 'var(--color-solstice)', border: `1px solid ${workflowStep === 'START' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, borderRadius: 'var(--radius-md)' }}>
              1. Initial |00⟩
            </div>
            <span style={{ color: 'var(--color-polar)' }}>➔</span>
            <div style={{ padding: '8px 16px', background: workflowStep === 'H_APPLIED' ? 'rgba(68, 105, 131, 0.4)' : 'var(--color-solstice)', border: `1px solid ${workflowStep === 'H_APPLIED' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, borderRadius: 'var(--radius-md)' }}>
              2. Apply H to Qubit A
            </div>
            <span style={{ color: 'var(--color-polar)' }}>➔</span>
            <div style={{ padding: '8px 16px', background: workflowStep === 'CNOT_APPLIED' ? 'rgba(68, 105, 131, 0.4)' : 'var(--color-solstice)', border: `1px solid ${workflowStep === 'CNOT_APPLIED' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, borderRadius: 'var(--radius-md)' }}>
              3. Apply CNOT (A➔B)
            </div>
            <span style={{ color: 'var(--color-polar)' }}>➔</span>
            <div style={{ padding: '8px 16px', background: workflowStep === 'MEASURED' ? 'rgba(68, 105, 131, 0.4)' : 'var(--color-solstice)', border: `1px solid ${workflowStep === 'MEASURED' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, borderRadius: 'var(--radius-md)' }}>
              4. Measurement
            </div>
          </div>
        </div>
      </QuantumPanel>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
        {/* Qubit A */}
        <QuantumPanel variant={measurementResult ? 'flat' : 'default'} className="animate-slide-up">
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2>Qubit A (Control)</h2>
              {measurementResult && (
                <div style={{ color: 'var(--color-icicle)', fontFamily: 'var(--font-mono)' }}>
                  Outcome: |{measurementResult[0]}⟩
                </div>
              )}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
              <Icon category="core" name="qubit-0" size={64} className={isEntangled ? 'animate-pulse' : ''} />
            </div>

            <button 
              onClick={applyHToA}
              disabled={workflowStep !== 'START'}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: workflowStep === 'START' ? 'var(--gradient-gate-button)' : 'var(--color-midnight)', 
                border: `1px solid ${workflowStep === 'START' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, 
                color: workflowStep === 'START' ? 'white' : 'var(--color-polar)', 
                borderRadius: 'var(--radius-md)', 
                cursor: workflowStep === 'START' ? 'pointer' : 'not-allowed',
                fontWeight: 600
              }}
            >
              Step 1: Apply Hadamard (H)
            </button>
          </div>
        </QuantumPanel>

        {/* Qubit B */}
        <QuantumPanel variant={measurementResult ? 'flat' : 'default'} className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2>Qubit B (Target)</h2>
              {measurementResult && (
                <div style={{ color: 'var(--color-icicle)', fontFamily: 'var(--font-mono)' }}>
                  Outcome: |{measurementResult[1]}⟩
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
              <Icon category="core" name="qubit-1" size={64} className={isEntangled ? 'animate-pulse' : ''} />
            </div>

            <button 
              onClick={applyCNOT}
              disabled={workflowStep !== 'H_APPLIED'}
              style={{ 
                width: '100%', 
                padding: '12px', 
                background: workflowStep === 'H_APPLIED' ? 'var(--gradient-gate-button)' : 'var(--color-midnight)', 
                border: `1px solid ${workflowStep === 'H_APPLIED' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, 
                color: workflowStep === 'H_APPLIED' ? 'white' : 'var(--color-polar)', 
                borderRadius: 'var(--radius-md)', 
                cursor: workflowStep === 'H_APPLIED' ? 'pointer' : 'not-allowed',
                fontWeight: 600
              }}
            >
              Step 2: Apply CNOT (A ➔ B)
            </button>
          </div>
        </QuantumPanel>
      </div>

      {/* Joint System Controls and Analysis */}
      <QuantumPanel variant="deep" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h2>Joint System Analysis</h2>
            {isEntangled ? (
              <div style={{ padding: '4px 12px', background: 'rgba(74, 155, 127, 0.2)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: '12px', fontSize: 'var(--text-body-sm)', fontWeight: 600 }}>
                ⚛ ENTANGLED SYSTEM (Bell State |Φ⁺⟩)
              </div>
            ) : (
              <div style={{ padding: '4px 12px', background: 'rgba(121, 145, 168, 0.1)', color: 'var(--color-arctic)', borderRadius: '12px', fontSize: 'var(--text-body-sm)' }}>
                SEPARABLE STATE
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-12)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ color: 'var(--color-arctic)', fontSize: 'var(--text-body-sm)', marginBottom: 'var(--space-4)' }}>
                {isEntangled
                  ? 'The qubits are maximally entangled. Measuring one immediately collapses the other into the identical state (either 00 or 11).'
                  : 'Follow the steps to prepare the Bell state: (|00⟩ + |11⟩) / √2.'}
              </p>

              <button 
                onClick={measure}
                disabled={workflowStep !== 'CNOT_APPLIED'}
                style={{ 
                  padding: '12px', 
                  background: workflowStep === 'CNOT_APPLIED' ? 'var(--gradient-accent)' : 'var(--color-midnight)', 
                  border: `1px solid ${workflowStep === 'CNOT_APPLIED' ? 'var(--color-icicle)' : 'var(--color-polar)'}`, 
                  color: workflowStep === 'CNOT_APPLIED' ? 'var(--color-midnight)' : 'var(--color-polar)', 
                  borderRadius: 'var(--radius-md)', 
                  cursor: workflowStep === 'CNOT_APPLIED' ? 'pointer' : 'not-allowed', 
                  fontWeight: 700 
                }}
              >
                Step 3: Measure Both Qubits
              </button>

              <button 
                onClick={resetEntanglement}
                style={{ padding: '12px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginTop: 'auto' }}
              >
                Reset Entanglement
              </button>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-polar)', marginBottom: 'var(--space-6)' }}>Two-Qubit Probabilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <ProbabilityBar label="|00⟩" probability={probabilities4.p00} />
                <ProbabilityBar label="|01⟩" probability={probabilities4.p01} colorBasis="1" />
                <ProbabilityBar label="|10⟩" probability={probabilities4.p10} colorBasis="1" />
                <ProbabilityBar label="|11⟩" probability={probabilities4.p11} />
              </div>
            </div>
          </div>
        </div>
      </QuantumPanel>
    </motion.div>
  );
};
