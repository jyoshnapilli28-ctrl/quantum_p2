import {
  StateVector1Q,
  StateVector2Q,
  Probabilities1Q,
  Probabilities2Q,
  BlochCoordinates,
  MeasurementOutcome1Q,
  MeasurementOutcome2Q
} from '@types/quantum';
import { magnitudeSquared, multiply, conjugate } from './math/complex';
import { createZeroState, createOneState, createTwoQubitZeroState } from './qubit';

// ── 1. Probability Calculation ──────────────────────────────────────────────

/** Get probabilities of |0⟩ and |1⟩ for a single qubit state */
export function getProbabilities1Q(state: StateVector1Q): Probabilities1Q {
  return {
    p0: magnitudeSquared(state[0]),
    p1: magnitudeSquared(state[1])
  };
}

/** Get probabilities for a two-qubit state */
export function getProbabilities2Q(state: StateVector2Q): Probabilities2Q {
  return {
    p00: magnitudeSquared(state[0]),
    p01: magnitudeSquared(state[1]),
    p10: magnitudeSquared(state[2]),
    p11: magnitudeSquared(state[3])
  };
}

// ── 2. Measurement (State Collapse) ─────────────────────────────────────────

/**
 * Perform a single shot measurement on a 1-qubit state.
 * Returns the outcome and the collapsed state vector.
 */
export function measureSingle(state: StateVector1Q): { outcome: MeasurementOutcome1Q, collapsedState: StateVector1Q } {
  const { p0 } = getProbabilities1Q(state);
  const rand = Math.random();
  
  if (rand < p0) {
    return { outcome: '0', collapsedState: createZeroState() };
  } else {
    return { outcome: '1', collapsedState: createOneState() };
  }
}

/**
 * Perform a single shot measurement on a 2-qubit state.
 */
export function measureTwoQubit(state: StateVector2Q): { outcome: MeasurementOutcome2Q, collapsedState: StateVector2Q } {
  const { p00, p01, p10 } = getProbabilities2Q(state);
  const rand = Math.random();
  
  // To strictly collapse to the basis state, we would return a fresh state vector
  // based on the outcome. For brevity, assuming basis collapse.
  if (rand < p00) {
    return { outcome: '00', collapsedState: [ {re: 1, im: 0}, {re: 0, im: 0}, {re: 0, im: 0}, {re: 0, im: 0} ] };
  } else if (rand < p00 + p01) {
    return { outcome: '01', collapsedState: [ {re: 0, im: 0}, {re: 1, im: 0}, {re: 0, im: 0}, {re: 0, im: 0} ] };
  } else if (rand < p00 + p01 + p10) {
    return { outcome: '10', collapsedState: [ {re: 0, im: 0}, {re: 0, im: 0}, {re: 1, im: 0}, {re: 0, im: 0} ] };
  } else {
    return { outcome: '11', collapsedState: [ {re: 0, im: 0}, {re: 0, im: 0}, {re: 0, im: 0}, {re: 1, im: 0} ] };
  }
}

/**
 * Perform N shots of measurement without collapsing the state.
 */
export function measureMultiShot(state: StateVector1Q, shots: number): Record<string, number> {
  const { p0 } = getProbabilities1Q(state);
  let count0 = 0;
  for (let i = 0; i < shots; i++) {
    if (Math.random() < p0) count0++;
  }
  return {
    '0': count0,
    '1': shots - count0
  };
}

export function measureMultiShot2Q(state: StateVector2Q, shots: number): Record<string, number> {
  const { p00, p01, p10 } = getProbabilities2Q(state);
  const counts = { '00': 0, '01': 0, '10': 0, '11': 0 };
  
  for (let i = 0; i < shots; i++) {
    const rand = Math.random();
    if (rand < p00) counts['00']++;
    else if (rand < p00 + p01) counts['01']++;
    else if (rand < p00 + p01 + p10) counts['10']++;
    else counts['11']++;
  }
  return counts;
}

// ── 3. Visualization & Helpers ──────────────────────────────────────────────

/**
 * Convert a state vector to (x, y, z) coordinates on the Bloch Sphere.
 * state = [alpha, beta] = [a+bi, c+di]
 * x = 2 * (ac + bd)
 * y = 2 * (ad - bc)
 * z = |alpha|^2 - |beta|^2
 */
export function getBlochCoordinates(state: StateVector1Q): BlochCoordinates {
  const [alpha, beta] = state;
  const { re: a, im: b } = alpha;
  const { re: c, im: d } = beta;

  const x = 2 * (a * c + b * d);
  const y = 2 * (a * d - b * c);
  const z = magnitudeSquared(alpha) - magnitudeSquared(beta);

  return { x, y, z };
}

/**
 * Try to identify a common state vector and return its string representation (e.g., "|+⟩").
 */
export function getStateName(state: StateVector1Q): string {
  const epsilon = 1e-6;
  const { x, y, z } = getBlochCoordinates(state);

  if (Math.abs(z - 1) < epsilon) return '|0⟩';
  if (Math.abs(z + 1) < epsilon) return '|1⟩';
  if (Math.abs(x - 1) < epsilon) return '|+⟩';
  if (Math.abs(x + 1) < epsilon) return '|-⟩';
  if (Math.abs(y - 1) < epsilon) return '|i⟩';
  if (Math.abs(y + 1) < epsilon) return '|-i⟩';

  return '|ψ⟩';
}
