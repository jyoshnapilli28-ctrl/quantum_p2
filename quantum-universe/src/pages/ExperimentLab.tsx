import React, { useEffect } from 'react';
import type { motion, AnimatePresence } from 'framer-motion';
import { useQuantumStore } from '../store';
import { QuantumPanel } from '../components/shared/QuantumPanel';
import { GateButton } from '../components/shared/GateButton';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { MeasurementResult } from '../components/shared/MeasurementResult';
import type { ExperimentDefinition } from '@types/quantum';

export const ExperimentLab: React.FC = () => {
  const {
    availableExperiments,
    activeExperimentId,
    currentStep,
    isComplete,
    stateProbabilities,
    measurementOutcome,
    setActiveExperiment,
    nextStep,
    resetExperiment
  } = useQuantumStore();

  // Reset when unmounting
  useEffect(() => {
    return () => resetExperiment();
  }, [resetExperiment]);

  const activeExp = availableExperiments.find(e => e.id === activeExperimentId);

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
          {availableExperiments.map((exp) => (
            <QuantumPanel 
              key={exp.id}
              variant={activeExperimentId === exp.id ? 'highlight' : 'default'}
              className="cursor-pointer transition-all"
              onClick={() => {
                if (activeExperimentId !== exp.id) setActiveExperiment(exp.id);
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
                  Step {currentStep + 1} / {activeExp.steps.length}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '4px', background: 'var(--color-midnight)', borderRadius: '2px', marginBottom: 'var(--space-8)' }}>
                <motion.div 
                  style={{ height: '100%', background: 'var(--color-icicle)', borderRadius: '2px' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / activeExp.steps.length) * 100}%` }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                >
                  <h3 style={{ marginBottom: 'var(--space-4)' }}>{activeExp.steps[currentStep].title}</h3>
                  <p style={{ color: 'var(--color-arctic)', marginBottom: 'var(--space-8)', fontSize: 'var(--text-body-lg)', lineHeight: 1.6 }}>
                    {activeExp.steps[currentStep].description}
                  </p>

                  <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-polar)' }}>Action</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        {activeExp.steps[currentStep].gateToApply && (
                          <GateButton gateId={activeExp.steps[currentStep].gateToApply!} onClick={() => {}} disabled />
                        )}
                        {activeExp.steps[currentStep].measure && (
                          <div style={{ padding: '8px 16px', background: 'var(--color-solstice)', border: '1px solid var(--color-polar)', borderRadius: '4px', color: 'white' }}>
                            Measure State
                          </div>
                        )}
                        {(!activeExp.steps[currentStep].gateToApply && !activeExp.steps[currentStep].measure) && (
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
                  
                  {isComplete && measurementOutcome && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'auto', marginBottom: 'var(--space-8)' }}>
                      <MeasurementResult outcome={measurementOutcome} />
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
                  onClick={nextStep}
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
