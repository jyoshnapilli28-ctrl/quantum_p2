import { create } from 'zustand';
import type { GateVisualizerState } from './gateVisualizerSlice';
import { createGateVisualizerSlice } from './gateVisualizerSlice';
import type { ExperimentState } from './experimentSlice';
import { createExperimentSlice } from './experimentSlice';
import type { EntanglementState } from './entanglementSlice';
import { createEntanglementSlice } from './entanglementSlice';
import type { CircuitState } from './circuitSlice';
import { createCircuitSlice } from './circuitSlice';

export type QuantumStore = GateVisualizerState & ExperimentState & EntanglementState & CircuitState;

export const useQuantumStore = create<QuantumStore>()((...a) => ({
  ...createGateVisualizerSlice(...a),
  ...createExperimentSlice(...a),
  ...createEntanglementSlice(...a),
  ...createCircuitSlice(...a),
}));
