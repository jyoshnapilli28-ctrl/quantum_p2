# QUANTUM ENGINE — SPECIFICATION — QYNX

---

## 1. Purpose & Guiding Principles

The **Quantum Engine** is the centralized, mathematically rigorous computational core of **QYNX**. It is implemented as a self-contained TypeScript module running client-side within the browser.

### Invariable Architectural Constraints:
- **Zero External Dependencies**: Implemented strictly using standard TypeScript/JavaScript mathematical operations.
- **Pure & Headless**: Never imports React, DOM elements, Three.js, CSS, or state stores.
- **Stateless & Deterministic**: Receives inputs (state vectors, gate matrices, circuits) and returns new state representations or measurement statistics.
- **Single Source of Mathematical Truth**: All five modules across QYNX (`QUANTUM UNIVERSE`, `QUANTUM GATE VISUALIZER`, `QUANTUM EXPO LAB`, `QUANTUM ENTANGLEMENT SIMULATOR`, and `QUANTUM CIRCUIT BUILDER`) route calculations through this single engine.

---

## 2. Module Directory Map

```
src/engine/
├── math/
│   ├── complex.ts          — Complex number arithmetic ({ re, im })
│   ├── matrix.ts           — 2×2 and 4×4 unitary matrix multiplication
│   └── vector.ts           — Inner products, normalization, and tensor products
├── qubit.ts                — Factory initializers for |0⟩, |1⟩, |+⟩, |00⟩
├── gates.ts                — Unitary matrices for X, Y, Z, H, S, T, CNOT, SWAP
├── measurement.ts          — Born rule probabilities, collapse simulation, multi-shot sampling
├── multiQubit.ts           — Kronecker expansions, two-qubit operators, Bell states
├── circuit.ts              — Circuit timeline AST parser and sequential simulation pipeline
└── index.ts                — Unified public API barrel export
```

---

## 3. Public API Contract

Exported from `src/engine/index.ts`:

### 3.1 State Initialization
```typescript
// Single-qubit state creation
export function createZeroState(): StateVector1Q; // Returns [1+0i, 0+0i] (|0⟩)
export function createOneState(): StateVector1Q;  // Returns [0+0i, 1+0i] (|1⟩)
export function createPlusState(): StateVector1Q; // Returns [1/√2+0i, 1/√2+0i] (|+⟩)

// Multi-qubit state creation
export function createTwoQubitZeroState(): StateVector2Q; // Returns |00⟩ (length 4)
export function createMultiQubitZeroState(qubits: number): Complex[]; // Returns |0...0⟩ (length 2^n)
```

### 3.2 Unitary Gate Application
```typescript
// Single-qubit transformation: |ψ'⟩ = U|ψ⟩
export function applyGate(state: StateVector1Q, gate: GateId): StateVector1Q;

// Target specific qubit within multi-qubit register
export function applyGateToQubit(
  state: StateVector2Q,
  gate: GateId,
  targetQubit: 0 | 1
): StateVector2Q;

// Two-qubit entangling gates
export function applyCNOT(
  state: StateVector2Q,
  controlQubit: 0 | 1,
  targetQubit: 0 | 1
): StateVector2Q;

export function applySWAP(state: StateVector2Q): StateVector2Q;
```

### 3.3 Probability & Bloch Coordinate Derivation
```typescript
// Probability distributions
export function getProbabilities1Q(state: StateVector1Q): { p0: number; p1: number };
export function getProbabilities2Q(state: StateVector2Q): Record<'00' | '01' | '10' | '11', number>;

// Bloch sphere mapping (mathematical state vector -> Cartesian coordinates)
export function getBlochCoordinates(state: StateVector1Q): BlochCoordinates;
```

### 3.4 Projective Measurement Simulation
```typescript
// Single-shot projective measurement (with wave-function collapse simulation)
export function measureSingle(state: StateVector1Q): MeasurementOutcome1Q;
export function measureTwoQubit(state: StateVector2Q): MeasurementOutcome2Q;

// Multi-shot statistical sampling (aggregate counts over N shots)
export function measureMultiShot(
  state: StateVector1Q,
  shots: number
): Record<MeasurementOutcome1Q, number>;

export function measureMultiShot2Q(
  state: StateVector2Q,
  shots: number
): Record<MeasurementOutcome2Q, number>;
```

### 3.5 Circuit Simulation Pipeline
```typescript
export function executeCircuit(definition: CircuitDefinition): CircuitResult;
```

---

## 4. Internal Data Representations

### 4.1 Complex Arithmetic (`math/complex.ts`)
```typescript
export interface Complex {
  readonly re: number;
  readonly im: number;
}

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  };
}

export function magnitudeSquared(a: Complex): number {
  return a.re * a.re + a.im * a.im;
}
```

### 4.2 State Vector Normalization
The engine automatically re-normalizes state vectors after matrix operations to prevent floating-point accumulation errors:
$$\text{norm} = \sqrt{\sum_{i=0}^{2^n-1} |\alpha_i|^2}, \quad \alpha_i' = \frac{\alpha_i}{\text{norm}}$$

---

## 5. Error Guarding & Validation

The engine validates mathematical preconditions and returns explicit descriptive outcomes:
- **Dimension Mismatch**: If a two-qubit gate is dispatched to a single-qubit vector, returns an error object without throwing uncaught exceptions.
- **Control Equal to Target**: In `applyCNOT`, if `controlQubit === targetQubit`, execution is halted with an informative diagnostic.
- **Shot Clamping**: Sampling counts are strictly bounded between $1$ and $10,000$ shots to protect UI thread responsiveness.
