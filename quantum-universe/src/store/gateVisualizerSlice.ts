import type { StateCreator } from 'zustand';
import type { StateVector1Q, GateId, GateHistoryEntry, Probabilities1Q, BlochCoordinates } from '@quantum-types/quantum';
import { createZeroState, applyGate, getProbabilities1Q, getBlochCoordinates, getStateName, measureSingle } from '@engine/index';

export interface GateVisualizerState {
  currentState: StateVector1Q;
  previousState: StateVector1Q | null;
  probabilities: Probabilities1Q;
  blochCoordinates: BlochCoordinates;
  stateLabel: string;
  gateHistory: GateHistoryEntry[];
  isMeasured: boolean;
  measurementOutcome: '0' | '1' | null;
  isAnimating: boolean;
  
  applyGate: (gateId: GateId) => void;
  measure: () => void;
  resetGateVisualizer: () => void;
  setAnimationComplete: () => void;
}

const initialState = {
  currentState: createZeroState(),
  previousState: null,
  probabilities: { p0: 1, p1: 0 },
  blochCoordinates: { x: 0, y: 0, z: 1 },
  stateLabel: '|0⟩',
  gateHistory: [],
  isMeasured: false,
  measurementOutcome: null as '0' | '1' | null,
  isAnimating: false,
};

export const createGateVisualizerSlice: StateCreator<GateVisualizerState> = (set, get) => ({
  ...initialState,

  applyGate: (gateId: GateId) => {
    if (get().isMeasured || get().isAnimating || gateId === 'CNOT' || gateId === 'SWAP') return;
    
    const prevState = get().currentState;
    const newState = applyGate(prevState, gateId);
    
    set({
      previousState: prevState,
      currentState: newState,
      probabilities: getProbabilities1Q(newState),
      blochCoordinates: getBlochCoordinates(newState),
      stateLabel: getStateName(newState),
      isAnimating: true, // Will be cleared by 3D component when animation finishes
      gateHistory: [
        ...get().gateHistory,
        {
          gate: gateId,
          stateBefore: prevState,
          stateAfter: newState,
          labelBefore: getStateName(prevState),
          labelAfter: getStateName(newState),
          timestamp: Date.now()
        }
      ]
    });
  },

  measure: () => {
    if (get().isMeasured) return;
    
    const prevState = get().currentState;
    const { outcome, collapsedState } = measureSingle(prevState);
    
    set({
      previousState: prevState,
      currentState: collapsedState,
      probabilities: getProbabilities1Q(collapsedState),
      blochCoordinates: getBlochCoordinates(collapsedState),
      stateLabel: `|${outcome}⟩`,
      isMeasured: true,
      measurementOutcome: outcome,
      isAnimating: true
    });
  },

  resetGateVisualizer: () => {
    set(initialState);
  },

  setAnimationComplete: () => {
    set({ isAnimating: false, previousState: null });
  }
});
