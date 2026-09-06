import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { Icon } from '../components/shared/Icon';

export const EntanglementSimulator: React.FC = () => {
  const {
    probabilities2Q,
    isEntangled,
    measurementOutcomeA,
    measurementOutcomeB,
    applyGateA,
    applyGateB,
    applyCNOT,
    measureA,
    measureB,
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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
        {/* Qubit A */}
        <QuantumPanel variant={measurementOutcomeA ? 'flat' : 'default'} className="animate-slide-up">
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2>Qubit A</h2>
              {measurementOutcomeA && <div style={{ color: 'var(--color-icicle)', fontFamily: 'var(--font-mono)' }}>Measured: |{measurementOutcomeA}⟩</div>}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
              <Icon category="core" name="qubit-0" size={64} className={isEntangled && !measurementOutcomeA ? 'animate-pulse' : ''} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {(['H', 'X', 'Y', 'Z'] as const).map(gate => (
                <GateButton key={gate} gateId={gate} onClick={() => applyGateA(gate)} disabled={measurementOutcomeA !== null} />
              ))}
            </div>

            <button 
              onClick={measureA}
              disabled={measurementOutcomeA !== null}
              style={{ width: '100%', padding: '12px', background: measurementOutcomeA ? 'var(--color-midnight)' : 'var(--color-solstice)', border: `1px solid ${measurementOutcomeA ? 'var(--color-polar)' : 'var(--color-icicle)'}`, color: 'white', borderRadius: 'var(--radius-md)', cursor: measurementOutcomeA ? 'not-allowed' : 'pointer' }}
            >
              Measure Qubit A
            </button>
          </div>
        </QuantumPanel>

        {/* Qubit B */}
        <QuantumPanel variant={measurementOutcomeB ? 'flat' : 'default'} className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h2>Qubit B</h2>
              {measurementOutcomeB && <div style={{ color: 'var(--color-icicle)', fontFamily: 'var(--font-mono)' }}>Measured: |{measurementOutcomeB}⟩</div>}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-6)' }}>
              <Icon category="core" name="qubit-1" size={64} className={isEntangled && !measurementOutcomeB ? 'animate-pulse' : ''} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              {(['H', 'X', 'Y', 'Z'] as const).map(gate => (
                <GateButton key={gate} gateId={gate} onClick={() => applyGateB(gate)} disabled={measurementOutcomeB !== null} />
              ))}
            </div>

            <button 
              onClick={measureB}
              disabled={measurementOutcomeB !== null}
              style={{ width: '100%', padding: '12px', background: measurementOutcomeB ? 'var(--color-midnight)' : 'var(--color-solstice)', border: `1px solid ${measurementOutcomeB ? 'var(--color-polar)' : 'var(--color-icicle)'}`, color: 'white', borderRadius: 'var(--radius-md)', cursor: measurementOutcomeB ? 'not-allowed' : 'pointer' }}
            >
              Measure Qubit B
            </button>
          </div>
        </QuantumPanel>
      </div>

      {/* Joint System Controls and Analysis */}
      <QuantumPanel variant="deep" className="animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div style={{ padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h2>Joint System Analysis</h2>
            {isEntangled && <div style={{ padding: '4px 12px', background: 'rgba(68, 105, 131, 0.2)', color: 'var(--color-icicle)', borderRadius: '12px', fontSize: 'var(--text-body-sm)' }}>ENTANGLED SYSTEM</div>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-12)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <h3 style={{ color: 'var(--color-polar)' }}>Multi-Qubit Operations</h3>
              <p style={{ color: 'var(--color-arctic)', fontSize: 'var(--text-body-sm)', marginBottom: 'var(--space-4)' }}>
                Apply a CNOT gate (Control: A, Target: B) to entangle the qubits if A is in superposition.
              </p>
              <button 
                onClick={applyCNOT}
                disabled={measurementOutcomeA !== null || measurementOutcomeB !== null}
                style={{ padding: '12px', background: 'var(--gradient-gate-button)', border: '1px solid var(--color-icicle)', color: 'white', borderRadius: 'var(--radius-md)', cursor: (measurementOutcomeA !== null || measurementOutcomeB !== null) ? 'not-allowed' : 'pointer', fontWeight: 600 }}
              >
                Apply CNOT (A → B)
              </button>

              <button 
                onClick={resetEntanglement}
                style={{ padding: '12px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'var(--color-white)', borderRadius: 'var(--radius-md)', cursor: 'pointer', marginTop: 'auto' }}
              >
                Reset System
              </button>
            </div>

            <div>
              <h3 style={{ color: 'var(--color-polar)', marginBottom: 'var(--space-6)' }}>System Probabilities</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <ProbabilityBar label="|00⟩" probability={probabilities2Q.p00} />
                <ProbabilityBar label="|01⟩" probability={probabilities2Q.p01} colorBasis="1" />
                <ProbabilityBar label="|10⟩" probability={probabilities2Q.p10} colorBasis="1" />
                <ProbabilityBar label="|11⟩" probability={probabilities2Q.p11} />
              </div>
            </div>
          </div>
        </div>
      </QuantumPanel>
    </motion.div>
  );
};
