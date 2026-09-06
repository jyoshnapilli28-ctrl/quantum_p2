import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { SingleQubitGateId } from '@types/quantum';
import { Icon } from '../components/shared/Icon';

export const CircuitBuilder: React.FC = () => {
  const {
    wires,
    maxGatesPerWire,
    finalProbabilities,
    addSingleQubitGate,
    addCNOT,
    removeQubit,
    clear,
    resetCircuit
  } = useQuantumStore();

  const [selectedGate, setSelectedGate] = useState<SingleQubitGateId | 'CNOT' | null>(null);
  const [cnotControl, setCnotControl] = useState<number | null>(null);

  const availableSingleGates: SingleQubitGateId[] = ['H', 'X', 'Y', 'Z', 'S', 'T'];

  const handleSlotClick = (wireIdx: number, posIdx: number) => {
    if (!selectedGate) return;

    if (selectedGate === 'CNOT') {
      if (cnotControl === null) {
        setCnotControl(wireIdx);
      } else {
        if (cnotControl !== wireIdx) {
          addCNOT(cnotControl, wireIdx, posIdx);
        }
        setCnotControl(null);
        setSelectedGate(null);
      }
    } else {
      addSingleQubitGate(selectedGate, wireIdx, posIdx);
      setSelectedGate(null); // Deselect after placing
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
        <p style={{ color: 'var(--color-arctic)' }}>Design your own quantum algorithm. Select a gate, then click on a wire to place it.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: 'var(--space-8)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          {/* Toolbox */}
          <QuantumPanel>
            <div style={{ padding: 'var(--space-4) var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <h3 style={{ color: 'var(--color-white)', margin: 0 }}>Toolbox</h3>
              <div style={{ width: '1px', height: '24px', background: 'var(--color-solstice)' }} />
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {availableSingleGates.map(gate => (
                  <GateButton 
                    key={gate} 
                    gateId={gate} 
                    onClick={() => { setSelectedGate(gate); setCnotControl(null); }} 
                    selected={selectedGate === gate} 
                  />
                ))}
                <div style={{ width: '1px', height: '52px', background: 'var(--color-solstice)', margin: '0 var(--space-2)' }} />
                <button
                  onClick={() => { setSelectedGate('CNOT'); setCnotControl(null); }}
                  style={{
                    padding: '0 16px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedGate === 'CNOT' ? 'var(--gradient-gate-button-hover)' : 'var(--gradient-gate-button)',
                    border: `1px solid ${selectedGate === 'CNOT' ? 'var(--color-icicle)' : 'rgba(56,80,106,0.5)'}`,
                    color: selectedGate === 'CNOT' ? 'white' : 'var(--color-arctic)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {cnotControl !== null ? 'Select Target' : 'CNOT'}
                </button>
              </div>
            </div>
          </QuantumPanel>

          {/* Circuit Canvas */}
          <QuantumPanel variant="deep" style={{ overflowX: 'auto' }}>
            <div style={{ padding: 'var(--space-8)', minWidth: 'max-content' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', position: 'relative' }}>
                {wires.map((wire, wIdx) => (
                  <div key={wIdx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', position: 'relative' }}>
                    {/* Qubit Label */}
                    <div style={{ width: '40px', textAlign: 'center', fontFamily: 'var(--font-mono)', color: 'var(--color-white)', fontSize: '18px' }}>
                      |0⟩
                    </div>
                    
                    {/* Wire Line */}
                    <div style={{ position: 'absolute', left: '56px', right: 0, height: '2px', background: 'var(--color-solstice)', zIndex: 0 }} />

                    {/* Slots */}
                    <div style={{ display: 'flex', gap: '16px', zIndex: 1, paddingLeft: '16px' }}>
                      {Array.from({ length: maxGatesPerWire }).map((_, pIdx) => {
                        const operation = wire.operations.find(op => op.position === pIdx);
                        
                        return (
                          <div 
                            key={pIdx}
                            onClick={() => handleSlotClick(wIdx, pIdx)}
                            style={{
                              width: '52px',
                              height: '52px',
                              background: operation ? 'transparent' : 'rgba(7, 16, 24, 0.5)',
                              border: operation ? 'none' : '1px dashed var(--color-polar)',
                              borderRadius: 'var(--radius-md)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: selectedGate && !operation ? 'pointer' : 'default',
                              position: 'relative'
                            }}
                          >
                            {operation && operation.type === 'SINGLE' && (
                              <GateButton gateId={operation.gateId as SingleQubitGateId} onClick={() => {}} />
                            )}
                            {operation && operation.type === 'CNOT' && (
                              <div style={{
                                width: '32px', height: '32px', borderRadius: '50%', 
                                background: operation.controlWire === wIdx ? 'var(--color-icicle)' : 'var(--gradient-gate-button)',
                                border: '2px solid var(--color-icicle)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                {operation.targetWire === wIdx ? (
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

                {/* Draw CNOT vertical lines (simplified visual) */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
                  {wires.map((wire, wIdx) => 
                    wire.operations.filter(op => op.type === 'CNOT' && op.controlWire === wIdx).map((op, i) => {
                      const x = 56 + 16 + (op.position * (52 + 16)) + 26; // Center of the slot
                      const y1 = wIdx * (52 + 40) + 26;
                      const y2 = op.targetWire! * (52 + 40) + 26;
                      return (
                        <line key={`${wIdx}-${i}`} x1={x} y1={y1} x2={x} y2={y2} stroke="var(--color-icicle)" strokeWidth="2" />
                      );
                    })
                  )}
                </svg>

              </div>
            </div>
            
            <div style={{ padding: 'var(--space-4) var(--space-8)', borderTop: '1px solid var(--color-solstice)', display: 'flex', gap: 'var(--space-4)' }}>
              <button onClick={clear} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>Clear Circuit</button>
            </div>
          </QuantumPanel>
        </div>

        {/* Results Panel */}
        <QuantumPanel className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Final State</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {Object.entries(finalProbabilities).map(([state, prob]) => (
                <ProbabilityBar key={state} label={`|${state}⟩`} probability={prob} colorBasis={state.split('').filter(c => c==='1').length % 2 === 0 ? '0' : '1'} />
              ))}
            </div>
          </div>
        </QuantumPanel>
      </div>
    </motion.div>
  );
};
