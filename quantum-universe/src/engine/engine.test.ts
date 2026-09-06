import { describe, it, expect } from 'vitest';
import { 
  createZeroState, applyGate, getBlochCoordinates, 
  getProbabilities1Q, getStateName,
  createTwoQubitZeroState, applyGateToQubit, applyCNOT, getProbabilities2Q
} from './index';

describe('Quantum Engine Validation Cases', () => {
  it('applyGate(|0⟩, "X") returns |1⟩', () => {
    let state = createZeroState();
    state = applyGate(state, 'X');
    expect(getStateName(state)).toBe('|1⟩');
    expect(getProbabilities1Q(state)).toEqual({ p0: 0, p1: 1 });
  });

  it('applyGate(|0⟩, "H") returns |+⟩ with probabilities 50/50', () => {
    let state = createZeroState();
    state = applyGate(state, 'H');
    expect(getStateName(state)).toBe('|+⟩');
    
    const probs = getProbabilities1Q(state);
    expect(probs.p0).toBeCloseTo(0.5);
    expect(probs.p1).toBeCloseTo(0.5);
  });

  it('getBlochCoordinates(|0⟩) returns {x:0, y:0, z:1}', () => {
    const coords = getBlochCoordinates(createZeroState());
    expect(coords.x).toBeCloseTo(0);
    expect(coords.y).toBeCloseTo(0);
    expect(coords.z).toBeCloseTo(1);
  });

  it('Bell state creation works: H→CNOT→(|00⟩+|11⟩)/√2', () => {
    let state = createTwoQubitZeroState();
    state = applyGateToQubit(state, 'H', 0); // Apply H to q0
    state = applyCNOT(state, 0, 1);          // CNOT q0(control) -> q1(target)
    
    // Probabilities should be 0.5 for |00> and |11>
    const probs = getProbabilities2Q(state);
    expect(probs.p00).toBeCloseTo(0.5);
    expect(probs.p01).toBeCloseTo(0);
    expect(probs.p10).toBeCloseTo(0);
    expect(probs.p11).toBeCloseTo(0.5);
  });
});
