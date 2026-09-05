# QUANTUM ENGINE — SPECIFICATION

---

## 1. Purpose

The Quantum Engine is the **mathematical core** of the Quantum Universe application. It is a self-contained TypeScript module that performs all quantum computing calculations.

**Critical rules:**
- The engine has **zero external dependencies** (no npm packages).
- The engine **never imports** any React, DOM, or UI library.
- The engine is **stateless** — it receives inputs and returns outputs. It does not store anything.
- The UI and state management layers **call** the engine; the engine does not call back.

Every quantum operation across all five pages is routed through this engine.

---

## 2. Engine Module Map

```
src/engine/
├── math/
│   ├── complex.ts          — Complex number type and arithmetic
│   ├── matrix.ts           — Matrix multiplication and operations
│   └── vector.ts           — State vector utilities
├── qubit.ts                — Single-qubit state initialization
├── gates.ts                — Gate matrix definitions and single application
├── measurement.ts          — Probability and measurement simulation
├── multiQubit.ts           — Two-qubit operations and tensor products
├── circuit.ts              — Circuit definition structure and executor
└── index.ts                — Public API barrel export
```

---

## 3. Public API

The engine's public API (exported from `index.ts`) consists of these functions:

### 3.1 State Creation

```typescript
createZeroState(): StateVector1Q
// Returns: [{ re: 1, im: 0 }, { re: 0, im: 0 }]
// Represents |0⟩

createOneState(): StateVector1Q
// Returns: [{ re: 0, im: 0 }, { re: 1, im: 0 }]
// Represents |1⟩

createPlusState(): StateVector1Q
// Returns: [{ re: 1/√2, im: 0 }, { re: 1/√2, im: 0 }]
// Represents |+⟩

createTwoQubitZeroState(): StateVector2Q
// Returns tensor product |00⟩
// [{ re:1, im:0 }, { re:0, im:0 }, { re:0, im:0 }, { re:0, im:0 }]
```

### 3.2 Gate Application

```typescript
applyGate(state: StateVector1Q, gate: GateId): StateVector1Q
// Applies a single-qubit gate matrix to the state vector
// Returns the new state vector
// Does not mutate the input state

applyGateToQubit(state: StateVector2Q, gate: GateId, targetQubit: 0 | 1): StateVector2Q
// Applies a single-qubit gate to one qubit within a two-qubit state
// Returns the new two-qubit state vector

applyCNOT(state: StateVector2Q, controlQubit: 0 | 1, targetQubit: 0 | 1): StateVector2Q
// Applies CNOT gate to a two-qubit state
// controlQubit and targetQubit must be different

applySWAP(state: StateVector2Q): StateVector2Q
// Swaps the two qubits in a two-qubit state
```

### 3.3 Probability Calculation

```typescript
getProbabilities1Q(state: StateVector1Q): { p0: number; p1: number }
// Returns: { p0: |alpha|², p1: |beta|² }
// p0 + p1 === 1 (guaranteed)

getProbabilities2Q(state: StateVector2Q): { p00: number; p01: number; p10: number; p11: number }
// Returns probabilities for all four basis states
// Sum === 1 (guaranteed)

getBlochCoordinates(state: StateVector1Q): { x: number; y: number; z: number }
// Maps the state vector to a point on the unit Bloch sphere
// Returns: { x, y, z } with x²+y²+z² <= 1
```

### 3.4 Measurement

```typescript
measureSingle(state: StateVector1Q): MeasurementOutcome1Q
// Performs one projective measurement
// Returns '0' or '1' based on weighted random selection
// Uses: Math.random() < p0 → '0'; else → '1'

measureTwoQubit(state: StateVector2Q): MeasurementOutcome2Q
// Performs one projective measurement on the two-qubit state
// Returns '00', '01', '10', or '11'

measureMultiShot(state: StateVector1Q, shots: number): Record<MeasurementOutcome1Q, number>
// Repeats measureSingle(state) `shots` times
// Returns: { '0': countZero, '1': countOne }

measureMultiShot2Q(state: StateVector2Q, shots: number): Record<MeasurementOutcome2Q, number>
// Repeats measureTwoQubit(state) `shots` times
// Returns: { '00': n, '01': n, '10': n, '11': n }
```

### 3.5 Circuit Execution

```typescript
executeCircuit(definition: CircuitDefinition): CircuitResult
// Executes a complete circuit definition
// Returns: { finalState, probabilities, measurements }
// See circuit.ts for CircuitDefinition type
```

### 3.6 State Information

```typescript
getStateName(state: StateVector1Q): string
// Returns the Dirac notation name of common states:
//   |0⟩, |1⟩, |+⟩, |-⟩, |i⟩, |-i⟩
// For arbitrary states, returns a formatted string like 'α|0⟩ + β|1⟩'

isEntangled(state: StateVector2Q): boolean
// Returns true if the two-qubit state cannot be written as a tensor product
// Uses Schmidt rank test
```

---

## 4. Data Structures

### 4.1 Complex Number

```typescript
// src/engine/math/complex.ts

interface Complex {
  re: number;  // Real part
  im: number;  // Imaginary part
}

// Operations:
add(a: Complex, b: Complex): Complex
subtract(a: Complex, b: Complex): Complex
multiply(a: Complex, b: Complex): Complex
conjugate(a: Complex): Complex
magnitude(a: Complex): number          // sqrt(re² + im²)
magnitudeSquared(a: Complex): number   // re² + im² (no sqrt, use for probabilities)
fromReal(r: number): Complex           // { re: r, im: 0 }
fromImaginary(i: number): Complex      // { re: 0, im: i }
```

### 4.2 State Vectors

```typescript
// src/types/quantum.ts

// Single-qubit state: α|0⟩ + β|1⟩
type StateVector1Q = [Complex, Complex]
// Index 0: amplitude for |0⟩ (alpha)
// Index 1: amplitude for |1⟩ (beta)
// Constraint: |alpha|² + |beta|² = 1

// Two-qubit state: c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩
type StateVector2Q = [Complex, Complex, Complex, Complex]
// Index 0: amplitude for |00⟩
// Index 1: amplitude for |01⟩
// Index 2: amplitude for |10⟩
// Index 3: amplitude for |11⟩
// Constraint: sum of all |cij|² = 1
```

### 4.3 Gate Matrix

```typescript
// 2×2 complex matrix
type Matrix2x2 = [[Complex, Complex], [Complex, Complex]]
// Application: newState = Matrix * oldState (matrix-vector product)

// 4×4 complex matrix (for two-qubit gates)
type Matrix4x4 = /* 4 rows × 4 columns of Complex */
```

### 4.4 Circuit Definition

```typescript
interface CircuitDefinition {
  qubits: number;           // Number of qubits (1–4 at launch)
  gates: GatePlacement[];   // Ordered list of gate placements
  shots?: number;           // Number of measurement shots (default: 1)
}

interface GatePlacement {
  id: string;               // Unique identifier (UUID)
  type: GateId;             // 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T' | 'CNOT' | 'SWAP'
  wire: number | [number, number];  // Target wire(s)
  column: number;           // Column position (left-to-right execution order)
}

interface CircuitResult {
  finalState: Complex[];    // Final state vector (length 2^qubits)
  probabilities: Record<string, number>;  // Basis state → probability
  measurements?: Record<string, number>;  // Basis state → count (if shots > 1)
  error?: string;           // Error message if circuit is invalid
}
```

---

## 5. Error Handling in the Engine

The engine validates inputs before computation and returns `null` or an error object rather than throwing.

| Error Condition | Engine Response |
|----------------|----------------|
| Gate applied to wrong qubit count | Return null, log warning |
| CNOT where control === target | Return null, log warning |
| Invalid gate ID string | Return null, log warning |
| State vector not normalized | Auto-normalize with console.warn |
| Zero-length state vector | Return null, log error |
| shots < 1 | Clamp to 1, log warning |
| shots > 10000 | Clamp to 10000, log warning |

The store layer must check for null returns and dispatch an error action to the UI.

---

## 6. Normalization

The engine always normalizes state vectors after gate application to prevent floating-point drift.

Normalization formula:
```
For [alpha, beta]:
  norm = sqrt(|alpha|² + |beta|²)
  alpha_normalized = alpha / norm
  beta_normalized = beta / norm
```

This is applied internally in `applyGate`. The caller does not need to normalize manually.

---

## 7. Engine Testing Requirements

Every engine function must have unit tests covering:

| Function | Test Cases |
|---------|-----------|
| `applyGate(|0⟩, 'X')` | Returns |1⟩ |
| `applyGate(|0⟩, 'H')` | Returns |+⟩ with equal amplitudes |
| `applyGate(|+⟩, 'H')` | Returns |0⟩ (H is self-inverse) |
| `applyGate(|0⟩, 'Z')` | Returns |0⟩ unchanged |
| `applyGate(|1⟩, 'Z')` | Returns |1⟩ with negated phase |
| `getProbabilities1Q` | p0 + p1 always === 1 |
| `measureMultiShot` | Distribution converges to theory for large shots |
| `applyCNOT(|10⟩)` | Returns |11⟩ (flips target when control = 1) |
| `applyCNOT(|00⟩)` | Returns |00⟩ (no flip when control = 0) |
| `getBlochCoordinates(|0⟩)` | Returns { x:0, y:0, z:1 } |
| `getBlochCoordinates(|1⟩)` | Returns { x:0, y:0, z:-1 } |
| `getBlochCoordinates(|+⟩)` | Returns { x:1, y:0, z:0 } |
| `isEntangled` (Bell state) | Returns true |
| `isEntangled` (product state) | Returns false |

Run tests with: `npm run test`

See `25_TESTING_QA.md` for full test strategy.

---

## 8. Extension Guidelines

To add a new gate in the future:

1. Add the gate's 2×2 matrix to `gates.ts` under the `GATE_MATRICES` constant.
2. Add the gate ID to the `GateId` type in `src/types/quantum.ts`.
3. Add a tooltip entry in `06_UI_UX.md`'s tooltip table.
4. Add gate button to the relevant page's gate panel.
5. Write unit tests.

No other files need modification for a standard single-qubit gate addition.

---

## 9. Engine File Responsibility Summary

| File | Responsibility |
|------|---------------|
| `complex.ts` | Complex number type and arithmetic (add, multiply, conjugate, magnitude) |
| `matrix.ts` | 2×2 and 4×4 matrix-vector multiply; matrix-matrix multiply |
| `vector.ts` | State vector normalization; inner product; tensor product of two state vectors |
| `qubit.ts` | Factory functions for |0⟩, |1⟩, |+⟩, |-⟩; multi-qubit initial states |
| `gates.ts` | GATE_MATRICES constant; `applyGate` function; gate validation |
| `measurement.ts` | `getProbabilities`, `measureSingle`, `measureMultiShot`, `getBlochCoordinates` |
| `multiQubit.ts` | `tensorProduct`; `applyGateToQubit`; `applyCNOT`; `applySWAP`; `isEntangled` |
| `circuit.ts` | `CircuitDefinition` type; circuit validator; `executeCircuit` orchestrator |
| `index.ts` | Re-exports all public functions; nothing else |
