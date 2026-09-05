# QUANTUM MATHEMATICS — SPECIFICATION

---

## 1. Purpose

This document defines the **exact mathematical formulations** used in the Quantum Engine. Every formula in this document must be implemented precisely as written. The engine's correctness depends on faithful implementation of these equations.

This is a **frontend simulator**. The mathematics model ideal, noise-free quantum computation.

---

## 2. Qubit and State Vector

### 2.1 Qubit Definition

A qubit is a two-level quantum system. Its state is described by a state vector in a two-dimensional complex Hilbert space.

General single-qubit state:
```
|ψ⟩ = α|0⟩ + β|1⟩

where:
  α, β ∈ ℂ (complex numbers)
  |α|² + |β|² = 1 (normalization condition)
```

In column vector form:
```
|ψ⟩ = [ α ]
      [ β ]
```

### 2.2 Computational Basis States

```
|0⟩ = [ 1 ]    |1⟩ = [ 0 ]
      [ 0 ]          [ 1 ]
```

Implementation:
```
|0⟩: alpha = { re: 1, im: 0 }, beta = { re: 0, im: 0 }
|1⟩: alpha = { re: 0, im: 0 }, beta = { re: 1, im: 0 }
```

### 2.3 Common Named States

```
|+⟩ = (|0⟩ + |1⟩) / √2 = [ 1/√2 ]
                           [ 1/√2 ]
alpha = { re: 0.7071067811865476, im: 0 }
beta  = { re: 0.7071067811865476, im: 0 }

|-⟩ = (|0⟩ - |1⟩) / √2 = [  1/√2 ]
                           [ -1/√2 ]
alpha = { re:  0.7071067811865476, im: 0 }
beta  = { re: -0.7071067811865476, im: 0 }

|i⟩ = (|0⟩ + i|1⟩) / √2 = [ 1/√2 ]
                            [i/√2  ]
alpha = { re: 0.7071067811865476, im: 0 }
beta  = { re: 0,                  im: 0.7071067811865476 }

|-i⟩ = (|0⟩ - i|1⟩) / √2 = [  1/√2 ]
                              [ -i/√2 ]
alpha = { re: 0.7071067811865476, im: 0 }
beta  = { re: 0,                  im: -0.7071067811865476 }
```

---

## 3. Gate Matrices

All single-qubit gates are 2×2 unitary matrices. Gate application is matrix-vector multiplication.

### 3.1 Pauli-X Gate

```
X = [ 0  1 ]
    [ 1  0 ]

Effect: |0⟩ → |1⟩, |1⟩ → |0⟩
```

### 3.2 Pauli-Y Gate

```
Y = [ 0   -i ]
    [ i    0 ]

where i = √(-1)

Effect: |0⟩ → i|1⟩, |1⟩ → -i|0⟩
```

### 3.3 Pauli-Z Gate

```
Z = [ 1   0 ]
    [ 0  -1 ]

Effect: |0⟩ → |0⟩, |1⟩ → -|1⟩
```

### 3.4 Hadamard Gate

```
H = (1/√2) * [ 1   1 ]
              [ 1  -1 ]

= [ 1/√2   1/√2 ]
  [ 1/√2  -1/√2 ]

Effect: |0⟩ → |+⟩, |1⟩ → |-⟩
```

### 3.5 Phase Gate (S)

```
S = [ 1   0 ]
    [ 0   i ]

Effect: |0⟩ → |0⟩, |1⟩ → i|1⟩
Note: S = √Z (S² = Z)
```

### 3.6 T Gate

```
T = [ 1   0         ]
    [ 0   e^(iπ/4)  ]

= [ 1   0                              ]
  [ 0   cos(π/4) + i*sin(π/4)         ]

= [ 1   0                              ]
  [ 0   (1/√2) + i*(1/√2)            ]

Effect: |0⟩ → |0⟩, |1⟩ → e^(iπ/4)|1⟩
Note: T = √S (T² = S)
```

### 3.7 Identity Gate (for circuit padding)

```
I = [ 1   0 ]
    [ 0   1 ]

Effect: No change to state
```

---

## 4. Gate Application (Matrix-Vector Multiplication)

Given state |ψ⟩ = [α, β]ᵀ and gate matrix M = [[a,b],[c,d]]:

```
M|ψ⟩ = [ a*α + b*β ]
        [ c*α + d*β ]
```

Where multiplication is complex multiplication:
```
(a + ib)(x + iy) = (ax - by) + i(ay + bx)
```

**Implementation in `matrix.ts`:**

```
function applyMatrix2x2(matrix: Matrix2x2, state: StateVector1Q): StateVector1Q:
  [alpha, beta] = state
  [row0, row1] = matrix

  new_alpha = add(multiply(row0[0], alpha), multiply(row0[1], beta))
  new_beta  = add(multiply(row1[0], alpha), multiply(row1[1], beta))

  return [new_alpha, new_beta]
```

After application, always normalize the result (see Section 8).

---

## 5. Probability Calculation

### 5.1 Born Rule

The probability of measuring outcome |k⟩ is the squared magnitude of its amplitude:

```
P(|0⟩) = |α|² = α.re² + α.im²
P(|1⟩) = |β|² = β.re² + β.im²
```

Guarantee: `P(|0⟩) + P(|1⟩) = 1`

**Never** use `Math.sqrt` for probability — use `magnitudeSquared` directly.

### 5.2 Two-Qubit Probabilities

For state vector [c00, c01, c10, c11]:
```
P(|00⟩) = |c00|²
P(|01⟩) = |c01|²
P(|10⟩) = |c10|²
P(|11⟩) = |c11|²
```

---

## 6. Bloch Sphere Mapping

A pure single-qubit state can be written using spherical angles θ and φ:

```
|ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩
```

The Bloch sphere coordinates are:
```
x = sin(θ) * cos(φ)
y = sin(θ) * sin(φ)
z = cos(θ)
```

### Derivation from State Vector [α, β]:

```
Given α = a_r + i*a_i,  β = b_r + i*b_i

Step 1: Ensure normalization: |α|² + |β|² = 1

Step 2: Compute θ
  θ = 2 * arccos(|α|)
  where |α| = sqrt(α.re² + α.im²)
  Note: θ ∈ [0, π]

Step 3: Compute φ
  If |β| < 1e-10 (beta is effectively zero): φ = 0
  Else: φ = atan2(β.im, β.re) - atan2(α.im, α.re)
  Normalize φ to [-π, π] range

Step 4: Compute Cartesian coordinates
  x = sin(θ) * cos(φ)
  y = sin(θ) * sin(φ)
  z = cos(θ)
```

**Verification of known states:**
```
|0⟩: α=1, β=0 → θ=0 → x=0, y=0, z=1    (north pole)
|1⟩: α=0, β=1 → θ=π → x=0, y=0, z=-1   (south pole)
|+⟩: α=1/√2, β=1/√2 → θ=π/2, φ=0 → x=1, y=0, z=0
|-⟩: α=1/√2, β=-1/√2 → θ=π/2, φ=π → x=-1, y=0, z=0
|i⟩: α=1/√2, β=i/√2 → θ=π/2, φ=π/2 → x=0, y=1, z=0
```

---

## 7. Two-Qubit Tensor Product

### 7.1 Tensor Product Definition

For single-qubit states |ψ_A⟩ = [α, β] and |ψ_B⟩ = [γ, δ]:

```
|ψ_A⟩ ⊗ |ψ_B⟩ = [ α*γ ]   = c00|00⟩ + c01|01⟩ + c10|10⟩ + c11|11⟩
                  [ α*δ ]
                  [ β*γ ]
                  [ β*δ ]
```

Index mapping:
```
Index 0 → |00⟩: c00 = α*γ
Index 1 → |01⟩: c01 = α*δ
Index 2 → |10⟩: c10 = β*γ
Index 3 → |11⟩: c11 = β*δ
```

### 7.2 CNOT Gate Matrix

```
CNOT (control=qubit0, target=qubit1):

      |00⟩  |01⟩  |10⟩  |11⟩
|00⟩ [  1    0    0    0  ]
|01⟩ [  0    1    0    0  ]
|10⟩ [  0    0    0    1  ]
|11⟩ [  0    0    1    0  ]
```

Effect: if control qubit is |1⟩, flip the target qubit.
```
|00⟩ → |00⟩
|01⟩ → |01⟩
|10⟩ → |11⟩
|11⟩ → |10⟩
```

**Bell state creation:**
```
Start:  |00⟩
Apply H to qubit 0: (|0⟩+|1⟩)/√2 ⊗ |0⟩ = (|00⟩ + |10⟩)/√2
Apply CNOT: (|00⟩ + |11⟩)/√2

→ State vector: [1/√2, 0, 0, 1/√2]
→ P(|00⟩) = 0.5, P(|11⟩) = 0.5
```

### 7.3 SWAP Gate Matrix

```
SWAP:

      |00⟩  |01⟩  |10⟩  |11⟩
|00⟩ [  1    0    0    0  ]
|01⟩ [  0    0    1    0  ]
|10⟩ [  0    1    0    0  ]
|11⟩ [  0    0    0    1  ]
```

Effect:
```
|00⟩ → |00⟩
|01⟩ → |10⟩
|10⟩ → |01⟩
|11⟩ → |11⟩
```

### 7.4 Single-Qubit Gate in Two-Qubit Space

To apply a single-qubit gate G to qubit 0 of a two-qubit state, compute the 4×4 matrix:
```
G ⊗ I = [ g00*I   g01*I ]  (where I is the 2×2 identity matrix)
        [ g10*I   g11*I ]
```

To apply G to qubit 1:
```
I ⊗ G = [ I*g00   I*g01 ]
        [ I*g10   I*g11 ]
```

The engine must compute these Kronecker products explicitly and apply the resulting 4×4 matrix.

---

## 8. State Normalization

After every gate application, renormalize the state vector to correct floating-point drift.

```
For [alpha, beta]:
  norm = sqrt(magnitudeSquared(alpha) + magnitudeSquared(beta))
  if (norm < 1e-10):
    log warning: "State vector has near-zero norm — resetting to |0⟩"
    return |0⟩
  return [
    { re: alpha.re / norm, im: alpha.im / norm },
    { re: beta.re  / norm, im: beta.im  / norm }
  ]
```

For N-qubit state vectors, sum `magnitudeSquared` over all amplitudes.

---

## 9. Measurement Mathematics

### 9.1 Single Shot Measurement

```
Given state [alpha, beta]:
  p0 = magnitudeSquared(alpha)
  p1 = magnitudeSquared(beta)
  r = Math.random()  // uniform in [0, 1)
  if r < p0: outcome = '0'
  else: outcome = '1'
```

After measurement, the state collapses:
```
If measured '0': new state = |0⟩ = [{ re:1, im:0 }, { re:0, im:0 }]
If measured '1': new state = |1⟩ = [{ re:0, im:0 }, { re:1, im:0 }]
```

The store must update the current state to the collapsed state after measurement.

### 9.2 Multi-Shot Measurement

```
function measureMultiShot(state, shots):
  counts = { '0': 0, '1': 0 }
  for i in range(shots):
    outcome = measureSingle(state)
    counts[outcome]++
  return counts
```

**Important:** The state does not collapse between shots in multi-shot simulation. Each shot measures the **same pre-measurement state independently**. This simulates running the same preparation + measurement experiment multiple times.

### 9.3 Two-Qubit Multi-Shot

```
function measureMultiShot2Q(state, shots):
  counts = { '00': 0, '01': 0, '10': 0, '11': 0 }
  for i in range(shots):
    outcome = measureTwoQubit(state)
    counts[outcome]++
  return counts
```

Two-qubit measurement: use cumulative probability walkthrough:
```
p00 = magnitudeSquared(state[0])
p01 = magnitudeSquared(state[1])
p10 = magnitudeSquared(state[2])
p11 = magnitudeSquared(state[3])
r = Math.random()
if r < p00: return '00'
else if r < p00+p01: return '01'
else if r < p00+p01+p10: return '10'
else: return '11'
```

---

## 10. Schmidt Rank (Entanglement Test)

To test if a two-qubit state [c00, c01, c10, c11] is entangled:

Form the coefficient matrix:
```
M = [ c00  c01 ]
    [ c10  c11 ]
```

The state is **separable** (not entangled) if and only if:
```
c00 * c11 ≈ c01 * c10
```
(where multiplication is complex multiplication, and ≈ means within tolerance 1e-10)

The state is **entangled** if this equality does not hold.

This is equivalent to checking that the Schmidt rank is 1 (separable) vs > 1 (entangled).

---

## 11. Floating-Point Tolerances

| Check | Tolerance |
|-------|-----------|
| Normalization check | ε = 1e-10 |
| Entanglement test | ε = 1e-10 |
| "Effectively zero" amplitude | ε = 1e-10 |
| Bloch sphere φ angle (no beta) | |β| < 1e-10 → φ = 0 |

Use `Math.abs(value) < EPSILON` for all near-zero checks. Never use exact equality on floating-point quantum values.
