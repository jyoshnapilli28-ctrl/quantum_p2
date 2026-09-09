import React, { useState } from 'react';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { animationConfig } from '../animations/animationConfig';
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
  const [executingCol, setExecutingCol] = useState<number | null>(null);

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
            type: 'CNOT',
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
        type: selectedGate,
        wire: wireIdx,
        column: colIdx
      });
      setSelectedGate(null);
    }
  };

  const handleRunSimulation = async () => {
    if (executionState === 'RUNNING') return;

    // Sequential column sweep indicator
    for (let c = 0; c < MAX_COLUMNS; c++) {
      setExecutingCol(c);
      await new Promise((r) => setTimeout(r, animationConfig.durations.circuitStep));
    }

    setExecutingCol(null);
    await runCircuit();
  };

  return (
    <div
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1120px', margin: '0 auto', padding: '0 var(--space-6)' }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)' }}>
          Circuit Builder
        </h1>
        <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body)', margin: 0 }}>
          Design custom multi-qubit circuits. Place logic operators on register wires, execute step-by-step routines, and inspect measurement probability vectors.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Toolbox */}
          <QuantumPanel>
            <div style={{ padding: 'var(--space-4) var(--space-5)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-purple-60, #8A3FFC)' }} />
                <h3 style={{ color: 'var(--text-primary, #181126)', margin: 0, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Gate Palette
                </h3>
              </div>
              <div style={{ width: '1px', height: '24px', background: 'var(--border-default, #D4BBFF)' }} />
              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
                {availableSingleGates.map((gate) => (
                  <GateButton 
                    key={gate} 
                    gateId={gate} 
                    onClick={() => { setSelectedGate(gate); setCnotControl(null); }} 
                    selected={selectedGate === gate} 
                  />
                ))}
                <div style={{ width: '1px', height: '36px', background: 'var(--border-default, #D4BBFF)', margin: '0 var(--space-2)' }} />
                <button
                  onClick={() => { setSelectedGate(selectedGate === 'CNOT' ? null : 'CNOT'); setCnotControl(null); }}
                  className="qynx-btn"
                  style={{
                    padding: '0 14px',
                    height: '42px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedGate === 'CNOT' ? 'var(--color-purple-60, #8A3FFC)' : 'var(--color-white, #FFFFFF)',
                    border: `1px solid ${selectedGate === 'CNOT' ? 'var(--color-purple-60, #8A3FFC)' : 'var(--border-default, #D4BBFF)'}`,
                    color: selectedGate === 'CNOT' ? 'var(--color-white)' : 'var(--text-primary, #181126)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                  }}
                >
                  {cnotControl !== null ? 'Select Target Wire' : 'CNOT'}
                </button>
              </div>
            </div>
          </QuantumPanel>

          {/* Circuit Canvas */}
          <QuantumPanel variant="default" style={{ overflowX: 'auto', background: 'var(--color-white, #FFFFFF)', border: '1px solid var(--border-default, #D4BBFF)' }}>
            <div style={{ padding: 'var(--space-6)', minWidth: 'max-content' }}>
              {/* Column Indicators */}
              <div style={{ display: 'flex', marginLeft: '84px', gap: '14px', marginBottom: '8px' }}>
                {Array.from({ length: MAX_COLUMNS }).map((_, cIdx) => (
                  <div
                    key={cIdx}
                    style={{
                      width: '48px',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: executingCol === cIdx ? 'var(--color-purple-60, #8A3FFC)' : 'var(--text-secondary, #4D3E6B)',
                      fontWeight: executingCol === cIdx ? 700 : 500,
                    }}
                  >
                    col {cIdx}
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative' }}>
                {Array.from({ length: numQubits }).map((_, wIdx) => (
                  <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', position: 'relative' }}>
                    {/* Qubit Label */}
                    <div
                      style={{
                        width: '64px',
                        textAlign: 'left',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-primary, #181126)',
                        fontSize: '14px',
                        fontWeight: 600
                      }}
                    >
                      q[{wIdx}] |0⟩
                    </div>
                    
                    {/* Background Wire Line (Dark Technical Line) */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '76px',
                        right: 0,
                        height: '2px',
                        background: 'var(--color-purple-80, #491D8B)',
                        zIndex: 0
                      }}
                    />

                    {/* Active Column Highlight Line */}
                    {executingCol !== null && (
                      <div
                        style={{
                          position: 'absolute',
                          left: '76px',
                          width: `${(executingCol + 1) * (48 + 14)}px`,
                          height: '2px',
                          background: 'var(--color-purple-60, #8A3FFC)',
                          zIndex: 1,
                          transition: 'width 200ms ease-out'
                        }}
                      />
                    )}

                    {/* Slots */}
                    <div style={{ display: 'flex', gap: '14px', zIndex: 2, paddingLeft: '6px' }}>
                      {Array.from({ length: MAX_COLUMNS }).map((_, colIdx) => {
                        const gate = gates.find((g) => {
                          if (g.column !== colIdx) return false;
                          if (typeof g.wire === 'number') return g.wire === wIdx;
                          if (Array.isArray(g.wire)) return g.wire.includes(wIdx);
                          return false;
                        });

                        const isColumnExecuting = executingCol === colIdx;
                        
                        return (
                          <div 
                            key={colIdx}
                            onClick={() => handleSlotClick(wIdx, colIdx)}
                            style={{
                              width: '48px',
                              height: '48px',
                              background: gate
                                ? 'var(--color-purple-20, #E8DAFF)'
                                : isColumnExecuting
                                ? 'var(--color-purple-20, #E8DAFF)'
                                : 'var(--color-purple-10, #F6F2FF)',
                              border: gate
                                ? `1.5px solid ${isColumnExecuting ? 'var(--color-purple-70, #6929C4)' : 'var(--color-purple-60, #8A3FFC)'}`
                                : `1px dashed ${isColumnExecuting ? 'var(--color-purple-60, #8A3FFC)' : 'var(--border-default, #D4BBFF)'}`,
                              borderRadius: 'var(--radius-md, 6px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              position: 'relative',
                            }}
                          >
                            {gate && typeof gate.wire === 'number' && (
                              <GateButton 
                                gateId={gate.type as SingleQubitGateId} 
                                onClick={() => removeGate(gate.id)} 
                              />
                            )}
                            {gate && Array.isArray(gate.wire) && (
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%', 
                                background: gate.wire[0] === wIdx ? 'var(--color-purple-60, #8A3FFC)' : 'var(--color-white, #FFFFFF)',
                                border: '1.5px solid var(--color-purple-60, #8A3FFC)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                                {gate.wire[1] === wIdx ? (
                                  <span style={{ color: 'var(--color-purple-60, #8A3FFC)', fontSize: '20px', lineHeight: '1px' }}>⊕</span>
                                ) : (
                                  <span style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Draw CNOT vertical lines with SVG */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                  {gates.filter((g) => Array.isArray(g.wire)).map((g) => {
                    const [controlWire, targetWire] = g.wire as [number, number];
                    const x = 76 + 6 + (g.column * (48 + 14)) + 24;
                    const y1 = controlWire * (48 + 40) + 24;
                    const y2 = targetWire * (48 + 40) + 24;
                    const isExecuting = executingCol === g.column;
                    return (
                      <line
                        key={g.id}
                        x1={x}
                        y1={y1}
                        x2={x}
                        y2={y2}
                        stroke={isExecuting ? 'var(--color-purple-70, #6929C4)' : 'var(--color-purple-60, #8A3FFC)'}
                        strokeWidth="2"
                      />
                    );
                  })}
                </svg>

              </div>
            </div>
            
            {/* Action Bar */}
            <div style={{ padding: 'var(--space-3) var(--space-6)', borderTop: '1px solid var(--border-default, #D4BBFF)', display: 'flex', gap: 'var(--space-3)', alignItems: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={handleRunSimulation} 
                disabled={executionState === 'RUNNING' || executingCol !== null}
                className="qynx-btn"
                style={{ 
                  padding: '9px 22px', 
                  background: 'var(--btn-primary-bg, #8A3FFC)', 
                  border: '1px solid var(--btn-primary-bg, #8A3FFC)', 
                  color: 'var(--color-white)', 
                  fontWeight: 600, 
                  cursor: executionState === 'RUNNING' || executingCol !== null ? 'not-allowed' : 'pointer',
                }}
              >
                {executingCol !== null ? `Executing Col ${executingCol}...` : executionState === 'RUNNING' ? 'Simulating...' : 'Run Simulation'}
              </button>
              <button 
                onClick={clear} 
                className="qynx-btn qynx-btn-secondary"
                style={{ padding: '8px 14px' }}
              >
                Clear Gates
              </button>
              {numQubits < 2 && (
                <button 
                  onClick={addQubit} 
                  className="qynx-btn qynx-btn-secondary"
                  style={{ padding: '8px 14px' }}
                >
                  + Add Qubit
                </button>
              )}
              {numQubits > 1 && (
                <button 
                  onClick={removeQubit} 
                  className="qynx-btn qynx-btn-secondary"
                  style={{ padding: '8px 14px' }}
                >
                  - Remove Qubit
                </button>
              )}
            </div>
          </QuantumPanel>
        </div>

        {/* Results Panel */}
        <QuantumPanel>
          <div style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--space-4)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-purple-60, #8A3FFC)' }} />
              <h3 style={{ margin: 0, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-primary, #181126)' }}>
                Measurement Outcome
              </h3>
            </div>
            
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
              <div style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body-sm)', lineHeight: 1.5 }}>
                <p style={{ margin: '0 0 var(--space-2) 0' }}>
                  Select gates from the palette and click on register wire slots.
                </p>
                <p style={{ margin: 0 }}>
                  Click <strong>Run Simulation</strong> to compute outcome probabilities.
                </p>
              </div>
            )}

            {lastResult?.error && (
              <p style={{ color: 'var(--color-error)', marginTop: 'var(--space-3)', fontSize: 'var(--text-body-sm)' }}>
                {lastResult.error}
              </p>
            )}
          </div>
        </QuantumPanel>
      </div>
    </div>
  );
};
