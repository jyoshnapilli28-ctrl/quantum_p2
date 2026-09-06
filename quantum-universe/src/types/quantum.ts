// ═══════════════════════════════════════════════════════════
// QUANTUM UNIVERSE — Shared Type Definitions
// ═══════════════════════════════════════════════════════════
// ALL modules import types from here.
// NEVER redefine these types locally in other files.

// ── Complex Number ──────────────────────────────────────
export interface Complex {
  re: number;
  im: number;
}

// ── State Vectors ───────────────────────────────────────
/** Single-qubit state: α|0⟩ + β|1⟩ */
export type StateVector1Q = [Complex, Complex];

/** Two-qubit state: c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩ */
export type StateVector2Q = [Complex, Complex, Complex, Complex];

// ── Matrix Types ────────────────────────────────────────
/** 2×2 complex matrix (single-qubit gates) */
export type Matrix2x2 = [[Complex, Complex], [Complex, Complex]];

/** 4×4 complex matrix (two-qubit gates) */
export type Matrix4x4 = [
  [Complex, Complex, Complex, Complex],
  [Complex, Complex, Complex, Complex],
  [Complex, Complex, Complex, Complex],
  [Complex, Complex, Complex, Complex],
];

// ── Gate Identifiers ────────────────────────────────────
export type SingleQubitGateId = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T';
export type MultiQubitGateId = 'CNOT' | 'SWAP';
export type GateId = SingleQubitGateId | MultiQubitGateId;

// ── Measurement ─────────────────────────────────────────
export type MeasurementOutcome1Q = '0' | '1';
export type MeasurementOutcome2Q = '00' | '01' | '10' | '11';
export type ProbabilityMap = Record<string, number>;

// ── Circuit Builder ─────────────────────────────────────
export interface GatePlacement {
  id: string;
  type: GateId;
  wire: number | [number, number]; // single or multi-qubit target
  column: number;                  // left-to-right execution order
}

export interface CircuitDefinition {
  qubits: number;
  gates: GatePlacement[];
  shots?: number; // default 1
}

export interface CircuitResult {
  finalState: Complex[];
  probabilities: Record<string, number>;
  measurements?: Record<string, number>;
  error?: string;
}

// ── Experiment Lab ──────────────────────────────────────
export interface ExperimentStep {
  description: string;
  action: 'applyGate' | 'measure' | 'reset';
  gate?: GateId;
  targetWire?: number;
}

export interface ExperimentDefinition {
  id: string;
  title: string;
  description: string;
  objective: string;
  initialState: StateVector1Q | StateVector2Q;
  steps: ExperimentStep[];
  expectedOutcome: string;
  explanation: string;
}

// ── Store Types ─────────────────────────────────────────
export interface GateHistoryEntry {
  gate: GateId;
  stateBefore: StateVector1Q;
  stateAfter: StateVector1Q;
  labelBefore: string;
  labelAfter: string;
  timestamp: number;
}

export interface Probabilities1Q {
  p0: number;
  p1: number;
}

export interface Probabilities2Q {
  p00: number;
  p01: number;
  p10: number;
  p11: number;
}

export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
}
