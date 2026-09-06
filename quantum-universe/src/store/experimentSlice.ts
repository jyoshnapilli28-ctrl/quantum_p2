import type { StateCreator } from 'zustand';
import type { StateVector1Q, StateVector2Q, ExperimentDefinition, ExperimentStep } from '@types/quantum';
import { createZeroState, createTwoQubitZeroState, applyGate, measureSingle, getProbabilities1Q, getProbabilities2Q } from '@engine/index';

// We define the 5 experiments based on the specification
const EXPERIMENTS: ExperimentDefinition[] = [
  {
    id: 'superposition',
    title: 'Superposition',
    description: 'Create a state where a qubit is simultaneously 0 and 1.',
    objective: 'Observe a 50/50 probability distribution.',
    initialState: createZeroState(),
    steps: [
      { action: 'applyGate', gate: 'H', description: 'Apply Hadamard Gate (H)' },
      { action: 'measure', description: 'Measure Qubit' }
    ],
    expectedOutcome: '50% chance of |0⟩, 50% chance of |1⟩',
    explanation: 'The Hadamard gate creates an equal superposition of |0⟩ and |1⟩.'
  },
  {
    id: 'bit-flip',
    title: 'Bit Flip',
    description: 'Flip a qubit from |0⟩ to |1⟩.',
    objective: 'Change the state deterministically.',
    initialState: createZeroState(),
    steps: [
      { action: 'applyGate', gate: 'X', description: 'Apply Pauli-X Gate (X)' },
      { action: 'measure', description: 'Measure Qubit' }
    ],
    expectedOutcome: '100% chance of |1⟩',
    explanation: 'The X gate acts like a classical NOT gate.'
  },
  {
    id: 'phase-flip',
    title: 'Phase Flip',
    description: 'Change the phase of a superposition state.',
    objective: 'Observe that phase does not affect measurement probabilities.',
    initialState: applyGate(createZeroState(), 'H'), // Starts in |+>
    steps: [
      { action: 'applyGate', gate: 'Z', description: 'Apply Pauli-Z Gate (Z)' },
      { action: 'measure', description: 'Measure Qubit' }
    ],
    expectedOutcome: '50% chance of |0⟩, 50% chance of |1⟩',
    explanation: 'The Z gate changes |+⟩ to |-⟩. The probabilities remain 50/50, but the interference pattern in a larger circuit would change.'
  },
  {
    id: 'double-hadamard',
    title: 'Double Hadamard',
    description: 'Apply two Hadamard gates in sequence.',
    objective: 'Observe quantum interference bringing the state back to |0⟩.',
    initialState: createZeroState(),
    steps: [
      { action: 'applyGate', gate: 'H', description: 'Apply Hadamard Gate (H)' },
      { action: 'applyGate', gate: 'H', description: 'Apply Hadamard Gate (H)' },
      { action: 'measure', description: 'Measure Qubit' }
    ],
    expectedOutcome: '100% chance of |0⟩',
    explanation: 'The Hadamard gate is its own inverse. H * H = I.'
  },
  {
    id: 'random-state',
    title: 'Random State',
    description: 'Create an uneven superposition.',
    objective: 'Observe probabilities other than 50/50.',
    initialState: createZeroState(),
    steps: [
      { action: 'applyGate', gate: 'H', description: 'Apply Hadamard Gate (H)' },
      { action: 'applyGate', gate: 'T', description: 'Apply T Gate (T)' },
      { action: 'applyGate', gate: 'H', description: 'Apply Hadamard Gate (H)' },
      { action: 'measure', description: 'Measure Qubit' }
    ],
    expectedOutcome: 'Roughly 85% chance of |0⟩, 15% chance of |1⟩',
    explanation: 'Combining H and T gates rotates the state vector to a non-orthogonal axis, creating uneven probabilities.'
  }
];

export interface ExperimentState {
  experiments: ExperimentDefinition[];
  activeExperimentId: string;
  currentStepIndex: number;
  stepStates: StateVector1Q[]; // State after each completed step
  measurementResults: string[];
  isRunning: boolean;
  
  selectExperiment: (id: string) => void;
  runNextStep: () => void;
  runAll: () => void;
  resetExperiment: () => void;
}

const initialState = {
  experiments: EXPERIMENTS,
  activeExperimentId: EXPERIMENTS[0].id,
  currentStepIndex: -1,
  stepStates: [],
  measurementResults: [],
  isRunning: false,
};

export const createExperimentSlice: StateCreator<ExperimentState> = (set, get) => ({
  ...initialState,

  selectExperiment: (id: string) => {
    set({
      ...initialState,
      activeExperimentId: id,
    });
  },

  runNextStep: () => {
    const { activeExperimentId, experiments, currentStepIndex, stepStates, measurementResults } = get();
    const experiment = experiments.find(e => e.id === activeExperimentId);
    if (!experiment) return;

    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex >= experiment.steps.length) return;

    const step = experiment.steps[nextStepIndex];
    let currentState = stepStates.length > 0 
      ? stepStates[stepStates.length - 1] 
      : experiment.initialState as StateVector1Q;
    
    let result = null;

    if (step.action === 'applyGate' && step.gate) {
      currentState = applyGate(currentState, step.gate as any);
    } else if (step.action === 'measure') {
      const measurement = measureSingle(currentState);
      currentState = measurement.collapsedState;
      result = measurement.outcome;
    }

    set({
      currentStepIndex: nextStepIndex,
      stepStates: [...stepStates, currentState],
      measurementResults: result ? [...measurementResults, result] : measurementResults
    });
  },

  runAll: async () => {
    set({ isRunning: true });
    
    const { activeExperimentId, experiments } = get();
    const experiment = experiments.find(e => e.id === activeExperimentId);
    if (!experiment) {
      set({ isRunning: false });
      return;
    }

    // Reset first
    get().resetExperiment();

    // Run steps with a small delay for visual effect
    for (let i = 0; i < experiment.steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      get().runNextStep();
    }

    set({ isRunning: false });
  },

  resetExperiment: () => {
    set({
      currentStepIndex: -1,
      stepStates: [],
      measurementResults: [],
      isRunning: false,
    });
  }
});
