import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { MeasurementResult } from '../components/shared/MeasurementResult';
import { getProbabilities1Q } from '@engine/index';
import type { StateVector1Q } from '@quantum-types/quantum';

export const ExperimentLab: React.FC = () => {
  const {
    experiments,
    activeExperimentId,
    currentStepIndex,
    stepStates,
    measurementResults,
    selectExperiment,
    runNextStep,
    resetExperiment
  } = useQuantumStore();

  // Reset when unmounting
  useEffect(() => {
    return () => resetExperiment();
  }, [resetExperiment]);

  const activeExp = experiments.find((e) => e.id === activeExperimentId);
  const totalSteps = activeExp?.steps.length ?? 0;
  const isComplete = totalSteps > 0 && currentStepIndex >= totalSteps - 1;
  const currentStepNum = Math.max(0, currentStepIndex + 1);

  const displayStepIndex = Math.min(Math.max(0, currentStepIndex), totalSteps - 1);
  const activeStep = activeExp?.steps[displayStepIndex];

  const currentState = stepStates.length > 0 
    ? stepStates[stepStates.length - 1] 
    : (activeExp?.initialState as StateVector1Q | undefined);
  const stateProbabilities = currentState ? getProbabilities1Q(currentState) : { p0: 1, p1: 0 };
  const latestMeasurement = measurementResults.length > 0 ? measurementResults[measurementResults.length - 1] : null;

  return (
    <div
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1120px', margin: '0 auto', padding: '0 var(--space-6)' }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)' }}>
          Quantum Expo Lab
        </h1>
        <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body)', margin: 0 }}>
          Execute guided step-by-step quantum protocols to discover how superposition, bit-flips, and projective measurement behave.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-6)' }}>
        {/* Left Column: Experiment Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {experiments.map((exp) => (
            <QuantumPanel 
              key={exp.id}
              variant={activeExperimentId === exp.id ? 'highlight' : 'default'}
              className="cursor-pointer transition-all"
              onClick={() => {
                if (activeExperimentId !== exp.id) selectExperiment(exp.id);
              }}
            >
              <div style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body)' }}>
                  {exp.title}
                </h3>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--text-secondary, #4D3E6B)', lineHeight: 1.5, margin: 0 }}>
                  {exp.description}
                </p>
              </div>
            </QuantumPanel>
          ))}
        </div>

        {/* Right Column: Active Experiment Execution */}
        <QuantumPanel variant="default" hoverable={false} style={{ minHeight: '480px', display: 'flex', flexDirection: 'column', background: 'var(--color-white, #FFFFFF)', border: '1px solid var(--border-default, #D4BBFF)' }}>
          {activeExp ? (
            <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2 style={{ fontSize: 'var(--text-h2)', color: 'var(--text-primary, #181126)', margin: 0 }}>
                  {activeExp.title}
                </h2>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-purple-60, #8A3FFC)', fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
                  Step {currentStepNum} of {totalSteps}
                </div>
              </div>

              {/* Solid Progress Bar */}
              <div style={{ width: '100%', height: '4px', background: 'var(--color-purple-20, #E8DAFF)', borderRadius: '2px', marginBottom: 'var(--space-6)', overflow: 'hidden' }}>
                <motion.div 
                  style={{ height: '100%', background: 'var(--color-purple-60, #8A3FFC)', borderRadius: '2px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <h3 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-h3)' }}>
                    {activeStep ? activeStep.description : 'Ground State Initialization'}
                  </h3>
                  <p style={{ color: 'var(--text-secondary, #4D3E6B)', marginBottom: 'var(--space-5)', fontSize: 'var(--text-body)', lineHeight: 1.5 }}>
                    {activeExp.objective}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '180px' }}>
                      <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)' }}>
                        Quantum Operation
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        {activeStep?.gate && (
                          <GateButton gateId={activeStep.gate} onClick={() => {}} disabled />
                        )}
                        {activeStep?.action === 'measure' && (
                          <div style={{ padding: '6px 14px', background: 'var(--color-purple-20, #E8DAFF)', border: '1px solid var(--border-default, #D4BBFF)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary, #181126)', fontWeight: 600, fontSize: 'var(--text-body-sm)' }}>
                            Projective Measurement
                          </div>
                        )}
                        {(!activeStep?.gate && activeStep?.action !== 'measure') && (
                          <div style={{ color: 'var(--text-secondary, #4D3E6B)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>
                            State Initialized |0⟩
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ flex: 1, borderLeft: '1px solid var(--border-default, #D4BBFF)', paddingLeft: 'var(--space-6)', minWidth: '200px' }}>
                      <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)' }}>
                        State Vector Probabilities
                      </h4>
                      <ProbabilityBar label="|0⟩" probability={stateProbabilities.p0} />
                      <div style={{ height: '6px' }} />
                      <ProbabilityBar label="|1⟩" probability={stateProbabilities.p1} colorBasis="1" />
                    </div>
                  </div>
                  
                  {isComplete && latestMeasurement && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', marginBottom: 'var(--space-4)' }}>
                      <MeasurementResult outcome={latestMeasurement} />
                    </div>
                  )}

                  {isComplete && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: 'var(--space-4)',
                        background: 'rgba(25, 128, 56, 0.08)',
                        border: '1px solid var(--color-success)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: 'var(--space-4)',
                      }}
                    >
                      <h4 style={{ color: 'var(--color-success)', marginBottom: '4px', fontSize: 'var(--text-body-sm)' }}>
                        Result Analysis &amp; Physics Postulate
                      </h4>
                      <p style={{ color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)', lineHeight: 1.5, margin: 0 }}>
                        {activeExp.explanation}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-default, #D4BBFF)' }}>
                <button 
                  type="button"
                  className="qynx-btn qynx-btn-secondary"
                  onClick={resetExperiment}
                  style={{ padding: '8px 18px' }}
                >
                  Restart Experiment
                </button>
                <button 
                  type="button"
                  className="qynx-btn"
                  onClick={runNextStep}
                  disabled={isComplete}
                  style={{ 
                    padding: '8px 24px', 
                    background: isComplete ? 'var(--color-purple-20, #E8DAFF)' : 'var(--color-purple-60, #8A3FFC)', 
                    border: `1px solid ${isComplete ? 'var(--border-default, #D4BBFF)' : 'var(--color-purple-60, #8A3FFC)'}`, 
                    color: isComplete ? 'var(--text-secondary, #4D3E6B)' : 'white', 
                    cursor: isComplete ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isComplete ? 'Protocol Completed' : 'Execute Next Step →'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--text-secondary, #4D3E6B)' }}>
              Select an experiment protocol to begin.
            </div>
          )}
        </QuantumPanel>
      </div>
    </div>
  );
};
