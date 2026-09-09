import React, { useEffect } from 'react';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { Icon } from '../components/shared/Icon';

export const EntanglementSimulator: React.FC = () => {
  const {
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

  const steps = [
    { key: 'START', label: '1. Initial |00⟩', active: workflowStep === 'START' },
    { key: 'H_APPLIED', label: '2. Apply H to Qubit A', active: workflowStep === 'H_APPLIED' },
    { key: 'CNOT_APPLIED', label: '3. Apply CNOT (A➔B)', active: workflowStep === 'CNOT_APPLIED' },
    { key: 'MEASURED', label: '4. Measurement', active: workflowStep === 'MEASURED' }
  ];

  return (
    <div
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1120px', margin: '0 auto', padding: '0 var(--space-6)' }}
    >
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)' }}>
          Entanglement Simulator
        </h1>
        <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body)', margin: 0 }}>
          Investigate non-local state correlation and Bell state creation. When two qubits become entangled, the state of one is directly correlated to the other.
        </p>
      </div>

      {/* Workflow Step Pipeline */}
      <QuantumPanel variant="default">
        <div style={{ padding: 'var(--space-4) var(--space-6)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-purple-60, #8A3FFC)' }} />
            <h3 style={{ color: 'var(--text-primary, #181126)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
              Bell State Circuit (Φ⁺) Progression
            </h3>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            {steps.map((step, idx) => (
              <React.Fragment key={step.key}>
                <div
                  style={{
                    padding: '6px 14px',
                    background: step.active
                      ? 'var(--color-purple-60, #8A3FFC)'
                      : 'var(--color-purple-20, #E8DAFF)',
                    border: `1px solid ${step.active ? 'var(--color-purple-60, #8A3FFC)' : 'var(--border-default, #D4BBFF)'}`,
                    borderRadius: 'var(--radius-sm, 4px)',
                    color: step.active ? 'var(--color-white)' : 'var(--text-secondary, #4D3E6B)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 'var(--text-body-sm)',
                    fontWeight: step.active ? 600 : 400,
                  }}
                >
                  {step.label}
                </div>
                {idx < steps.length - 1 && (
                  <span style={{ color: 'var(--color-purple-60, #8A3FFC)', userSelect: 'none', margin: '0 2px' }}>➔</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </QuantumPanel>

      {/* Twin Qubits Display */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Qubit A */}
        <QuantumPanel
          variant="default"
          style={{
            borderColor: isEntangled ? 'var(--color-purple-60, #8A3FFC)' : undefined,
          }}
        >
          <div style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary, #181126)', margin: 0 }}>
                Qubit A (Control)
              </h2>
              {measurementResult && (
                <div
                  style={{
                    color: 'var(--text-primary, #181126)',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--color-purple-20, #E8DAFF)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default, #D4BBFF)',
                    fontWeight: 600,
                    fontSize: 'var(--text-body-sm)'
                  }}
                >
                  Outcome: |{measurementResult[0]}⟩
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                marginBottom: 'var(--space-5)',
              }}
            >
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  background: 'var(--color-purple-20, #E8DAFF)',
                  border: '1px solid var(--border-default, #D4BBFF)',
                  marginBottom: '8px'
                }}
              >
                <Icon
                  category="quantum"
                  name={
                    measurementResult
                      ? (measurementResult[0] === '0' ? 'qubit-0' : 'qubit-1')
                      : workflowStep === 'CNOT_APPLIED'
                      ? 'qubit-entangled'
                      : workflowStep === 'H_APPLIED'
                      ? 'qubit-superposition'
                      : 'qubit-0'
                  }
                  size={52}
                  alt="Qubit A state visualization"
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-secondary, #4D3E6B)'
                }}
              >
                {workflowStep === 'START' && '|0⟩ (Ground State)'}
                {workflowStep === 'H_APPLIED' && '(|0⟩ + |1⟩)/√2 (Superposition)'}
                {workflowStep === 'CNOT_APPLIED' && 'Entangled Bell State'}
                {workflowStep === 'MEASURED' && `Collapsed to |${measurementResult?.[0]}⟩`}
              </span>
            </div>

            <button
              onClick={applyHToA}
              disabled={workflowStep !== 'START'}
              className="qynx-btn"
              style={{
                width: '100%',
                padding: '10px',
                background: workflowStep === 'START' ? 'var(--btn-primary-bg, #8A3FFC)' : 'var(--color-purple-20, #E8DAFF)',
                borderColor: workflowStep === 'START' ? 'var(--btn-primary-bg, #8A3FFC)' : 'var(--border-default, #D4BBFF)',
                color: workflowStep === 'START' ? 'var(--color-white)' : 'var(--text-secondary, #4D3E6B)',
              }}
            >
              Step 1: Apply Hadamard (H)
            </button>
          </div>
        </QuantumPanel>

        {/* Qubit B */}
        <QuantumPanel
          variant="default"
          style={{
            borderColor: isEntangled ? 'var(--color-purple-60, #8A3FFC)' : undefined,
          }}
        >
          <div style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h2 style={{ fontSize: 'var(--text-h3)', color: 'var(--text-primary, #181126)', margin: 0 }}>
                Qubit B (Target)
              </h2>
              {measurementResult && (
                <div
                  style={{
                    color: 'var(--text-primary, #181126)',
                    fontFamily: 'var(--font-mono)',
                    background: 'var(--color-purple-20, #E8DAFF)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-default, #D4BBFF)',
                    fontWeight: 600,
                    fontSize: 'var(--text-body-sm)'
                  }}
                >
                  Outcome: |{measurementResult[1]}⟩
                </div>
              )}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '120px',
                marginBottom: 'var(--space-5)',
              }}
            >
              <div
                style={{
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  background: 'var(--color-purple-20, #E8DAFF)',
                  border: '1px solid var(--border-default, #D4BBFF)',
                  marginBottom: '8px'
                }}
              >
                <Icon
                  category="quantum"
                  name={
                    measurementResult
                      ? (measurementResult[1] === '0' ? 'qubit-0' : 'qubit-1')
                      : workflowStep === 'CNOT_APPLIED'
                      ? 'qubit-entangled'
                      : 'qubit-0'
                  }
                  size={52}
                  alt="Qubit B state visualization"
                />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-secondary, #4D3E6B)'
                }}
              >
                {workflowStep === 'START' && '|0⟩ (Ground State)'}
                {workflowStep === 'H_APPLIED' && '|0⟩ (Awaiting Control)'}
                {workflowStep === 'CNOT_APPLIED' && 'Entangled Bell State'}
                {workflowStep === 'MEASURED' && `Collapsed to |${measurementResult?.[1]}⟩`}
              </span>
            </div>

            <button
              onClick={applyCNOT}
              disabled={workflowStep !== 'H_APPLIED'}
              className="qynx-btn"
              style={{
                width: '100%',
                padding: '10px',
                background: workflowStep === 'H_APPLIED' ? 'var(--btn-primary-bg, #8A3FFC)' : 'var(--color-purple-20, #E8DAFF)',
                borderColor: workflowStep === 'H_APPLIED' ? 'var(--btn-primary-bg, #8A3FFC)' : 'var(--border-default, #D4BBFF)',
                color: workflowStep === 'H_APPLIED' ? 'var(--color-white)' : 'var(--text-secondary, #4D3E6B)',
              }}
            >
              Step 2: Apply CNOT (A ➔ B)
            </button>
          </div>
        </QuantumPanel>
      </div>

      {/* Joint System Analysis */}
      <QuantumPanel variant="default">
        <div style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
            <div>
              <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary, #181126)', margin: '0 0 2px 0' }}>
                Joint System Analysis
              </h2>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary, #4D3E6B)' }}>
                {isEntangled ? '|Ψ⟩ = 1/√2 (|00⟩ + |11⟩)' : 'Independent Composite State'}
              </span>
            </div>

            {isEntangled ? (
              <div
                style={{
                  padding: '4px 12px',
                  background: 'var(--color-purple-20, #E8DAFF)',
                  border: '1px solid var(--color-purple-60, #8A3FFC)',
                  color: 'var(--color-purple-60, #8A3FFC)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 600,
                }}
              >
                Bell State |Φ⁺⟩ Active
              </div>
            ) : measurementResult ? (
              <div
                style={{
                  padding: '4px 12px',
                  background: 'rgba(25, 128, 56, 0.08)',
                  border: '1px solid var(--color-success)',
                  color: 'var(--color-success)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: 600
                }}
              >
                Collapsed to |{measurementResult[0]}{measurementResult[1]}⟩
              </div>
            ) : (
              <div
                style={{
                  padding: '4px 12px',
                  background: 'var(--color-purple-20, #E8DAFF)',
                  border: '1px solid var(--border-default, #D4BBFF)',
                  color: 'var(--text-secondary, #4D3E6B)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-body-sm)'
                }}
              >
                Separable State
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body-sm)', lineHeight: 1.5, margin: 0 }}>
                {isEntangled
                  ? 'The qubits are in maximum coherence. Measuring Qubit A instantly projects Qubit B into the identical outcome (50% |00⟩, 50% |11⟩).'
                  : 'Prepare the Bell state: Apply Hadamard (H) to create superposition on A, then CNOT to entangle the target wire.'}
              </p>

              <button
                onClick={measure}
                disabled={workflowStep !== 'CNOT_APPLIED'}
                className="qynx-btn"
                style={{
                  padding: '11px 20px',
                  background: workflowStep === 'CNOT_APPLIED' ? 'var(--btn-primary-bg, #8A3FFC)' : 'var(--color-purple-20, #E8DAFF)',
                  borderColor: workflowStep === 'CNOT_APPLIED' ? 'var(--btn-primary-bg, #8A3FFC)' : 'var(--border-default, #D4BBFF)',
                  color: workflowStep === 'CNOT_APPLIED' ? 'var(--color-white)' : 'var(--text-secondary, #4D3E6B)',
                  fontWeight: 600,
                }}
              >
                Step 3: Measure Both Qubits
              </button>

              <button
                onClick={resetEntanglement}
                className="qynx-btn qynx-btn-secondary"
                style={{
                  padding: '8px 16px',
                  marginTop: 'auto'
                }}
              >
                Reset Entanglement
              </button>
            </div>

            <div>
              <h3 style={{ color: 'var(--text-primary, #181126)', marginBottom: 'var(--space-3)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Two-Qubit Basis Probabilities
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <ProbabilityBar label="|00⟩" probability={probabilities4.p00} colorBasis="0" />
                <ProbabilityBar label="|01⟩" probability={probabilities4.p01} colorBasis="1" />
                <ProbabilityBar label="|10⟩" probability={probabilities4.p10} colorBasis="1" />
                <ProbabilityBar label="|11⟩" probability={probabilities4.p11} colorBasis="0" />
              </div>
            </div>
          </div>
        </div>
      </QuantumPanel>
    </div>
  );
};
