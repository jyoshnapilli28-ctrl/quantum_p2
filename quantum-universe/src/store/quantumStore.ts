import { create } from 'zustand';
import { GateVisualizerState, createGateVisualizerSlice } from './gateVisualizerSlice';
import { ExperimentState, createExperimentSlice } from './experimentSlice';
import { EntanglementState, createEntanglementSlice } from './entanglementSlice';
import { CircuitState, createCircuitSlice } from './circuitSlice';

export type QuantumStore = GateVisualizerState & ExperimentState & EntanglementState & CircuitState;

export const useQuantumStore = create<QuantumStore>()((...a) => ({
  ...createGateVisualizerSlice(...a),
  ...createExperimentSlice(...a),
  ...createEntanglementSlice(...a),
  ...createCircuitSlice(...a),
}));
