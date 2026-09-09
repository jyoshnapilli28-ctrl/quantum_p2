import type { StateCreator } from 'zustand';
import type { StateVector2Q, Probabilities2Q, MeasurementOutcome2Q } from '@quantum-types/quantum';
import { createTwoQubitZeroState, applyGateToQubit, applyCNOT, measureTwoQubit, getProbabilities2Q, isEntangled } from '@engine/index';

export type WorkflowStep = 'START' | 'H_APPLIED' | 'CNOT_APPLIED' | 'MEASURED';

export interface EntanglementState {
  twoQubitState: StateVector2Q;
  isEntangled: boolean;
  probabilities4: Probabilities2Q;
  measurementResult: MeasurementOutcome2Q | null;
  workflowStep: WorkflowStep;

  applyHToA: () => void;
  applyCNOT: () => void;
  measure: () => void;
  resetEntanglement: () => void;
}

const initialState = {
  twoQubitState: createTwoQubitZeroState(),
  isEntangled: false,
  probabilities4: { p00: 1, p01: 0, p10: 0, p11: 0 },
  measurementResult: null,
  workflowStep: 'START' as WorkflowStep,
};

export const createEntanglementSlice: StateCreator<EntanglementState> = (set, get) => ({
  ...initialState,

  applyHToA: () => {
    if (get().workflowStep !== 'START') return;
    
    const newState = applyGateToQubit(get().twoQubitState, 'H', 0); // Apply H to q0 (Wire A)
    
    set({
      twoQubitState: newState,
      probabilities4: getProbabilities2Q(newState),
      isEntangled: isEntangled(newState), // False
      workflowStep: 'H_APPLIED'
    });
  },

  applyCNOT: () => {
    if (get().workflowStep !== 'H_APPLIED') return;
    
    const newState = applyCNOT(get().twoQubitState, 0, 1); // Control=q0, Target=q1
    
    set({
      twoQubitState: newState,
      probabilities4: getProbabilities2Q(newState),
      isEntangled: isEntangled(newState), // True
      workflowStep: 'CNOT_APPLIED'
    });
  },

  measure: () => {
    if (get().workflowStep !== 'CNOT_APPLIED') return;
    
    const { outcome, collapsedState } = measureTwoQubit(get().twoQubitState);
    
    set({
      twoQubitState: collapsedState,
      probabilities4: getProbabilities2Q(collapsedState),
      isEntangled: false, // Collapsed state is no longer entangled
      measurementResult: outcome,
      workflowStep: 'MEASURED'
    });
  },

  resetEntanglement: () => {
    set(initialState);
  }
});
