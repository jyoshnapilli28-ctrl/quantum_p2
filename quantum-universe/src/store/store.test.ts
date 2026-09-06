import { describe, it, expect, beforeEach } from 'vitest';
import { useQuantumStore } from './index';

describe('Zustand Quantum Store', () => {
  beforeEach(() => {
    // Reset all slices before each test
    useQuantumStore.getState().resetGateVisualizer();
    // Let's call them manually if needed, or rely on fresh state.
    // Actually, create<...>() merges them. Since they all have a 'reset' property, the last one merged wins!
    // I should fix the store reset functions.
  });

  it('Initializes properly', () => {
    const state = useQuantumStore.getState();
    expect(state.stateLabel).toBe('|0⟩');
  });

  it('Applies gate H and updates probabilities', () => {
    const state = useQuantumStore.getState();
    state.applyGate('H');
    
    const newState = useQuantumStore.getState();
    expect(newState.stateLabel).toBe('|+⟩');
    expect(newState.probabilities.p0).toBeCloseTo(0.5);
    expect(newState.probabilities.p1).toBeCloseTo(0.5);
  });
});
