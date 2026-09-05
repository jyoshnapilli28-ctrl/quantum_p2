# MULTI-QUBIT SYSTEM — SPECIFICATION

---

## 1. Purpose

This document specifies the two-qubit (and N-qubit) quantum system used in Pages 4 and 5. It covers tensor products, two-qubit gate operations, the circuit execution model for multiple qubits, and the extension path to more qubits.

---

## 2. Two-Qubit State Space

### 2.1 Basis States

Two qubits span a four-dimensional Hilbert space with computational basis states:

```
|00⟩ = |0⟩_A ⊗ |0⟩_B
|01⟩ = |0⟩_A ⊗ |1⟩_B
|10⟩ = |1⟩_A ⊗ |0⟩_B
|11⟩ = |1⟩_A ⊗ |1⟩_B
```

Index convention (qubit A is the most significant bit):
```
State vector: [c00, c01, c10, c11]
Index 0 → |00⟩
Index 1 → |01⟩
Index 2 → |10⟩
Index 3 → |11⟩
```

### 2.2 Initial State |00⟩

```typescript
function createTwoQubitZeroState(): StateVector2Q {
  return [
    { re: 1, im: 0 },  // c00 = 1
    { re: 0, im: 0 },  // c01 = 0
    { re: 0, im: 0 },  // c10 = 0
    { re: 0, im: 0 },  // c11 = 0
  ]
}
```

---

## 3. Tensor Product

### 3.1 Computing Tensor Product of Two 1-Qubit States

```typescript
function tensorProduct(
  stateA: StateVector1Q,
  stateB: StateVector1Q
): StateVector2Q {
  const [alpha, beta] = stateA   // qubit A
  const [gamma, delta] = stateB  // qubit B

  return [
    multiply(alpha, gamma),  // c00 = α·γ
    multiply(alpha, delta),  // c01 = α·δ
    multiply(beta,  gamma),  // c10 = β·γ
    multiply(beta,  delta),  // c11 = β·δ
  ]
}
```

Used when:
- Initializing a two-qubit system from two independent qubits.
- Testing separability (entanglement detection).

### 3.2 Tensor Product of Gate Matrices (Kronecker Product)

To apply a single-qubit gate G to qubit 0 of a two-qubit system:

```
G ⊗ I₂ = [g₀₀·I   g₀₁·I]
          [g₁₀·I   g₁₁·I]

Expanded as 4×4 matrix:
Row 0: [g₀₀,  0,   g₀₁,  0  ]
Row 1: [0,    g₀₀, 0,    g₀₁]
Row 2: [g₁₀,  0,   g₁₁,  0  ]
Row 3: [0,    g₁₀, 0,    g₁₁]
```

To apply G to qubit 1:
```
I₂ ⊗ G = [g₀₀·G   0    ]
          [0        g₁₁·G]

Expanded as 4×4 matrix:
Row 0: [g₀₀, g₀₁, 0,   0  ]
Row 1: [g₁₀, g₁₁, 0,   0  ]
Row 2: [0,   0,   g₀₀, g₀₁]
Row 3: [0,   0,   g₁₀, g₁₁]
```

The engine computes these 4×4 matrices explicitly and applies them to the state vector.

---

## 4. CNOT Gate

### 4.1 Matrix

```
Control = qubit 0, Target = qubit 1:

      |00⟩  |01⟩  |10⟩  |11⟩
|00⟩ [  1    0    0    0  ]
|01⟩ [  0    1    0    0  ]
|10⟩ [  0    0    0    1  ]
|11⟩ [  0    0    1    0  ]
```

### 4.2 Implementation

```typescript
// CNOT matrix applied to state: newState = CNOT_MATRIX * state
// Result:
// newState[0] = state[0]   (|00⟩ → |00⟩)
// newState[1] = state[1]   (|01⟩ → |01⟩)
// newState[2] = state[3]   (|10⟩ → |11⟩)
// newState[3] = state[2]   (|11⟩ → |10⟩)

function applyCNOT(
  state: StateVector2Q,
  controlQubit: 0 | 1,
  targetQubit: 0 | 1
): StateVector2Q | null {
  if (controlQubit === targetQubit) {
    console.warn('CNOT: control and target must be different qubits')
    return null
  }

  if (controlQubit === 0 && targetQubit === 1) {
    // Standard CNOT: control=0, target=1
    return [state[0], state[1], state[3], state[2]]
  }

  if (controlQubit === 1 && targetQubit === 0) {
    // Reversed CNOT: control=1, target=0
    // Matrix swap is different — apply the reversed CNOT matrix:
    return [state[0], state[3], state[2], state[1]]
  }

  return null
}
```

### 4.3 Bell State Creation Verification

```
Start: |00⟩ = [1, 0, 0, 0]

Apply H to qubit 0:
  state = (I ⊗ I applied to H ⊗ I |00⟩)
  H|0⟩ = [1/√2, 1/√2]
  state after H on qubit 0 = [1/√2, 0, 1/√2, 0]
  (= |00⟩/√2 + |10⟩/√2)

Apply CNOT (control=0, target=1):
  newState[0] = state[0] = 1/√2
  newState[1] = state[1] = 0
  newState[2] = state[3] = 0
  newState[3] = state[2] = 1/√2

Result: [1/√2, 0, 0, 1/√2]
= (|00⟩ + |11⟩)/√2   ← Bell state Φ+

P(|00⟩) = |1/√2|² = 0.5
P(|11⟩) = |1/√2|² = 0.5
P(|01⟩) = P(|10⟩) = 0
```

This is the canonical Bell state used in Page 4.

---

## 5. SWAP Gate

### 5.1 Matrix

```
      |00⟩  |01⟩  |10⟩  |11⟩
|00⟩ [  1    0    0    0  ]
|01⟩ [  0    0    1    0  ]
|10⟩ [  0    1    0    0  ]
|11⟩ [  0    0    0    1  ]
```

### 5.2 Implementation

```typescript
function applySWAP(state: StateVector2Q): StateVector2Q {
  // Swaps |01⟩ and |10⟩ amplitudes
  return [state[0], state[2], state[1], state[3]]
}
```

---

## 6. Applying Single-Qubit Gates to Multi-Qubit States

```typescript
function applyGateToQubit(
  state: StateVector2Q,
  gate: GateId,
  targetQubit: 0 | 1
): StateVector2Q | null {
  const M = GATE_MATRICES[gate]
  if (!M) return null

  // Build 4×4 Kronecker product matrix
  const expanded: Matrix4x4 = targetQubit === 0
    ? kronecker(M, IDENTITY_2x2)   // G ⊗ I
    : kronecker(IDENTITY_2x2, M)   // I ⊗ G

  // Apply 4×4 matrix to 4-component state vector
  const newState = applyMatrix4x4(expanded, state)

  return normalizeState2Q(newState)
}
```

---

## 7. N-Qubit Extension (Future-Proofing)

At launch, the application supports up to 2 qubits in Pages 4 and 5. The Circuit Builder supports up to 4 qubits.

### 7.1 N-Qubit State Vector

For N qubits, the state vector has `2^N` complex amplitudes.

```typescript
type StateVectorNQ = Complex[]  // length = 2^N
```

### 7.2 N-Qubit Tensor Product (General)

```typescript
function kroneckerN(matrices: Matrix2x2[]): ComplexMatrix {
  // Start with the first matrix
  // Sequentially apply Kronecker product with each subsequent matrix
  // Result: a 2^N × 2^N matrix
}
```

### 7.3 Gate Application for N Qubits

For a single-qubit gate G applied to wire k in an N-qubit circuit:

```
Full matrix = I ⊗ ... ⊗ G ⊗ ... ⊗ I
              (N matrices in tensor product, G is at position k)
```

This approach scales correctly for 3 and 4 qubits.

At launch, implement explicitly for N=1 and N=2 with the option to generalize to N=4 for the Circuit Builder.

---

## 8. Entanglement Detection

```typescript
function isEntangled(state: StateVector2Q): boolean {
  const [c00, c01, c10, c11] = state
  // Separable iff c00*c11 = c01*c10 (complex equality)
  const left  = multiply(c00, c11)
  const right = multiply(c01, c10)
  const diffRe = Math.abs(left.re - right.re)
  const diffIm = Math.abs(left.im - right.im)
  const EPSILON = 1e-10
  return diffRe > EPSILON || diffIm > EPSILON
}
```

Used by:
- The Entanglement Simulator to show/hide the entanglement indicator.
- The Circuit Builder to label the output state.

---

## 9. Circuit Execution for N Qubits

### 9.1 Circuit Execution Algorithm

```
function executeCircuit(definition: CircuitDefinition): CircuitResult:
  // 1. Initialize: zero state for N qubits
  state = createZeroStateNQ(definition.qubits)

  // 2. Group gates by column, sort columns ascending
  columns = groupBy(definition.gates, 'column')
  sortedColumns = sort(columns.keys())

  // 3. For each column:
  for col in sortedColumns:
    gates_in_col = columns[col]

    // Validate: no two gates on the same column share a wire
    if hasWireConflict(gates_in_col): return error

    // Apply each gate in the column
    for gate in gates_in_col:
      if isSingleQubitGate(gate):
        state = applyGateToWire(state, gate.type, gate.wire, definition.qubits)
      else if gate.type === 'CNOT':
        state = applyCNOTtoNQubit(state, gate.wire[0], gate.wire[1], definition.qubits)
      else if gate.type === 'SWAP':
        state = applySWAPtoNQubit(state, gate.wire[0], gate.wire[1], definition.qubits)

  // 4. Calculate final probabilities
  probabilities = getProbabilitiesNQ(state)

  // 5. If shots > 1: measure multiple times
  measurements = measureMultiShotNQ(state, definition.shots ?? 1)

  return { finalState: state, probabilities, measurements }
```

### 9.2 Wire Conflict Validation

Two gates in the same column conflict if:
- They share any wire (e.g., two single-qubit gates on wire 0 in column 3).
- A multi-qubit gate's control/target wire overlaps with a single-qubit gate's wire.

The circuit validator catches these before execution and returns error messages.

---

## 10. State Vector Size at Launch

| Qubits | State Vector Length | Memory Per State |
|--------|--------------------|--------------------|
| 1 | 2 complex numbers | ~32 bytes |
| 2 | 4 complex numbers | ~64 bytes |
| 3 | 8 complex numbers | ~128 bytes |
| 4 | 16 complex numbers | ~256 bytes |

All state vectors are well within memory limits. No performance concern at 1–4 qubits.
