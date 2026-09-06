import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { MeasurementResult } from '../components/shared/MeasurementResult';
import { getProbabilities1Q } from '@engine/index';
import type { StateVector1Q } from '@types/quantum';

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}
    >
      <div>
        <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)' }}>Experiment Lab</h1>
        <p style={{ color: 'var(--color-arctic)' }}>Run predefined quantum experiments step-by-step to understand complex phenomena.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)' }}>
        {/* Left Column: Experiment Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
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
                <h3 style={{ marginBottom: 'var(--space-2)' }}>{exp.title}</h3>
                <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-arctic)' }}>{exp.description}</p>
              </div>
            </QuantumPanel>
          ))}
        </div>

        {/* Right Column: Active Experiment Execution */}
        <QuantumPanel variant="deep" style={{ minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
          {activeExp ? (
            <div style={{ padding: 'var(--space-8)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
                <h2>{activeExp.title}</h2>
                <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-icicle)' }}>
                  Step {currentStepNum} / {totalSteps}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '4px', background: 'var(--color-midnight)', borderRadius: '2px', marginBottom: 'var(--space-8)' }}>
                <motion.div 
                  style={{ height: '100%', background: 'var(--color-icicle)', borderRadius: '2px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStepIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>
                    {activeStep ? activeStep.description : 'Initial State'}
                  </h3>
                  <p style={{ color: 'var(--color-arctic)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-body-lg)', lineHeight: 1.6 }}>
                    {activeExp.objective}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-polar)' }}>Action</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        {activeStep?.gate && (
                          <GateButton gateId={activeStep.gate} onClick={() => {}} disabled />
                        )}
                        {activeStep?.action === 'measure' && (
                          <div style={{ padding: '8px 16px', background: 'var(--color-solstice)', border: '1px solid var(--color-polar)', borderRadius: '4px', color: 'white' }}>
                            Measure State
                          </div>
                        )}
                        {(!activeStep?.gate && activeStep?.action !== 'measure') && (
                          <div style={{ color: 'var(--color-arctic)' }}>Initial Preparation</div>
                        )}
                      </div>
                    </div>

                    <div style={{ flex: 1, borderLeft: '1px solid var(--color-solstice)', paddingLeft: 'var(--space-8)' }}>
                      <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-polar)' }}>Current State Probabilities</h4>
                      <ProbabilityBar label="|0⟩" probability={stateProbabilities.p0} />
                      <div style={{ height: '8px' }} />
                      <ProbabilityBar label="|1⟩" probability={stateProbabilities.p1} colorBasis="1" />
                    </div>
                  </div>
                  
                  {isComplete && latestMeasurement && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', marginBottom: 'var(--space-8)' }}>
                      <MeasurementResult outcome={latestMeasurement} />
                    </div>
                  )}

                  {isComplete && (
                    <div style={{ padding: 'var(--space-4)', background: 'rgba(74, 155, 127, 0.1)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-4)' }}>
                      <h4 style={{ color: 'var(--color-success)', marginBottom: '4px' }}>Result & Explanation</h4>
                      <p style={{ color: 'var(--color-arctic)', fontSize: 'var(--text-body-sm)' }}>{activeExp.explanation}</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-solstice)' }}>
                <button 
                  onClick={resetExperiment}
                  style={{ padding: '12px 24px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'var(--color-white)', borderRadius: 'var(--radius-lg)', cursor: 'pointer' }}
                >
                  Restart Experiment
                </button>
                <button 
                  onClick={runNextStep}
                  disabled={isComplete}
                  style={{ 
                    padding: '12px 32px', 
                    background: isComplete ? 'var(--color-midnight)' : 'var(--gradient-gate-button)', 
                    border: isComplete ? '1px solid var(--color-polar)' : '1px solid var(--color-icicle)', 
                    color: isComplete ? 'var(--color-polar)' : 'white', 
                    borderRadius: 'var(--radius-lg)', 
                    cursor: isComplete ? 'not-allowed' : 'pointer',
                    fontWeight: 600
                  }}
                >
                  {isComplete ? 'Experiment Complete' : 'Execute Step →'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'var(--color-arctic)' }}>
              Select an experiment to begin.
            </div>
          )}
        </QuantumPanel>
      </div>
    </motion.div>
  );
};
