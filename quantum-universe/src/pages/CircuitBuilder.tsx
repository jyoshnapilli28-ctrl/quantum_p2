import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import type { SingleQubitGateId } from '@types/quantum';

const MAX_COLUMNS = 6;

export const CircuitBuilder: React.FC = () => {
  const {
    circuitDefinition,
    executionState,
    lastResult,
    addGate,
    removeGate,
    runCircuit,
    clear,
    addQubit,
    removeQubit
  } = useQuantumStore();

  const [selectedGate, setSelectedGate] = useState<SingleQubitGateId | 'CNOT' | null>(null);
  const [cnotControl, setCnotControl] = useState<number | null>(null);

  const availableSingleGates: SingleQubitGateId[] = ['H', 'X', 'Y', 'Z', 'S', 'T'];
  const numQubits = circuitDefinition.qubits;
  const gates = circuitDefinition.gates;

  const handleSlotClick = (wireIdx: number, colIdx: number) => {
    // Check if slot has a gate
    const existingGate = gates.find((g) => {
      if (g.column !== colIdx) return false;
      if (typeof g.wire === 'number') return g.wire === wireIdx;
      if (Array.isArray(g.wire)) return g.wire.includes(wireIdx);
      return false;
    });

    if (existingGate) {
      removeGate(existingGate.id);
      return;
    }

    if (!selectedGate) return;

    if (selectedGate === 'CNOT') {
      if (cnotControl === null) {
        setCnotControl(wireIdx);
      } else {
        if (cnotControl !== wireIdx) {
          addGate({
            id: `cnot-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            gate: 'CNOT',
            wire: [cnotControl, wireIdx],
            column: colIdx
          });
        }
        setCnotControl(null);
        setSelectedGate(null);
      }
    } else {
      addGate({
        id: `gate-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        gate: selectedGate,
        wire: wireIdx,
        column: colIdx
      });
      setSelectedGate(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)' }}>Circuit Builder</h1>
        <p style={{ color: 'var(--color-arctic)' }}>
          Design your quantum circuit. Select a gate and click on a wire slot to place it. Click placed gates to remove them.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-8)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Toolbox */}
          <QuantumPanel>
            <div style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexWrap: 'wrap' }}>
              <h3 style={{ color: 'var(--color-white)', margin: 0 }}>Toolbox</h3>
              <div style={{ width: '1px', height: '24px', background: 'var(--color-solstice)' }} />
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                {availableSingleGates.map((gate) => (
                  <GateButton 
                    key={gate} 
                    gateId={gate} 
                    onClick={() => { setSelectedGate(gate); setCnotControl(null); }} 
                    selected={selectedGate === gate} 
                  />
                ))}
                <div style={{ width: '1px', height: '40px', background: 'var(--color-solstice)', margin: '0 var(--space-2)' }} />
                <button
                  onClick={() => { setSelectedGate(selectedGate === 'CNOT' ? null : 'CNOT'); setCnotControl(null); }}
                  style={{
                    padding: '0 16px',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedGate === 'CNOT' ? 'var(--gradient-gate-button-hover)' : 'var(--gradient-gate-button)',
                    border: `1px solid ${selectedGate === 'CNOT' ? 'var(--color-icicle)' : 'rgba(56,80,106,0.5)'}`,
                    color: selectedGate === 'CNOT' ? 'white' : 'var(--color-arctic)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cnotControl !== null ? 'Select Target Wire' : 'CNOT'}
                </button>
              </div>
            </div>
          </QuantumPanel>

          {/* Circuit Canvas */}
          <QuantumPanel variant="deep" style={{ overflowX: 'auto' }}>
            <div style={{ padding: 'var(--space-8)', minWidth: 'max-content' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '48px', position: 'relative' }}>
                {Array.from({ length: numQubits }).map((_, wIdx) => (
                  <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', position: 'relative' }}>
                    {/* Qubit Label */}
                    <div style={{ width: '48px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-white)', fontSize: '18px' }}>
                      q[{wIdx}] |0⟩
                    </div>
                    
                    {/* Wire Line */}
                    <div style={{ position: 'absolute', left: '68px', right: 0, height: '2px', background: 'var(--color-polar)', zIndex: 0 }} />

                    {/* Slots */}
                    <div style={{ display: 'flex', gap: '16px', zIndex: 1, paddingLeft: '16px' }}>
                      {Array.from({ length: MAX_COLUMNS }).map((_, colIdx) => {
                        const gate = gates.find((g) => {
                          if (g.column !== colIdx) return false;
                          if (typeof g.wire === 'number') return g.wire === wIdx;
                          if (Array.isArray(g.wire)) return g.wire.includes(wIdx);
                          return false;
                        });
                        
                        return (
                          <div 
                            key={colIdx}
                            onClick={() => handleSlotClick(wIdx, colIdx)}
                            style={{
                              width: '52px',
                              height: '52px',
                              background: gate ? 'var(--color-solstice)' : 'rgba(7, 16, 24, 0.7)',
                              border: gate ? '1px solid var(--color-icicle)' : '1px dashed var(--color-polar)',
                              borderRadius: 'var(--radius-md)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              position: 'relative'
                            }}
                          >
                            {gate && typeof gate.wire === 'number' && (
                              <GateButton gateId={gate.gate} onClick={() => removeGate(gate.id)} />
                            )}
                            {gate && Array.isArray(gate.wire) && (
                              <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', 
                                background: gate.wire[0] === wIdx ? 'var(--color-icicle)' : 'var(--gradient-gate-button)',
                                border: '2px solid var(--color-icicle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                {gate.wire[1] === wIdx ? (
                                  <span style={{ color: 'white', fontSize: '24px', lineHeight: '1px' }}>⊕</span>
                                ) : (
                                  <span style={{ width: '12px', height: '12px', background: 'white', borderRadius: '50%' }} />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Draw CNOT vertical lines */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                  {gates.filter((g) => Array.isArray(g.wire)).map((g) => {
                    const [controlWire, targetWire] = g.wire as [number, number];
                    const x = 68 + 16 + (g.column * (52 + 16)) + 26;
                    const y1 = controlWire * (52 + 48) + 26;
                    const y2 = targetWire * (52 + 48) + 26;
                    return (
                      <line key={g.id} x1={x} y1={y1} x2={x} y2={y2} stroke="var(--color-icicle)" strokeWidth="2" />
                    );
                  })}
                </svg>

              </div>
            </div>
            
            <div style={{ padding: 'var(--space-4) var(--space-8)', borderTop: '1px solid var(--color-solstice)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={runCircuit} 
                disabled={executionState === 'RUNNING'}
                style={{ 
                  padding: '10px 24px', 
                  background: 'var(--gradient-accent)', 
                  border: 'none', 
                  color: 'var(--color-midnight)', 
                  borderRadius: 'var(--radius-md)', 
                  fontWeight: 700, 
                  cursor: executionState === 'RUNNING' ? 'not-allowed' : 'pointer' 
                }}
              >
                {executionState === 'RUNNING' ? 'Simulating...' : 'Run Simulation'}
              </button>
              <button 
                onClick={clear} 
                style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
              >
                Clear Gates
              </button>
              {numQubits < 2 && (
                <button 
                  onClick={addQubit} 
                  style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                  + Add Qubit
                </button>
              )}
              {numQubits > 1 && (
                <button 
                  onClick={removeQubit} 
                  style={{ padding: '10px 16px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
                >
                  - Remove Qubit
                </button>
              )}
            </div>
          </QuantumPanel>
        </div>

        {/* Results Panel */}
        <QuantumPanel className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Circuit Probabilities</h3>
            
            {lastResult && lastResult.probabilities ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {Object.entries(lastResult.probabilities).map(([state, prob]) => (
                  <ProbabilityBar 
                    key={state} 
                    label={`|${state}⟩`} 
                    probability={prob} 
                    colorBasis={state.split('').filter((c) => c === '1').length % 2 === 0 ? '0' : '1'} 
                  />
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--color-arctic)', fontSize: 'var(--text-body-sm)' }}>
                Place gates on the circuit and click <strong>Run Simulation</strong> to compute quantum state probabilities.
              </p>
            )}

            {lastResult?.error && (
              <p style={{ color: 'var(--color-error)', marginTop: 'var(--space-4)', fontSize: 'var(--text-body-sm)' }}>
                {lastResult.error}
              </p>
            )}
          </div>
        </QuantumPanel>
      </div>
    </motion.div>
  );
};
