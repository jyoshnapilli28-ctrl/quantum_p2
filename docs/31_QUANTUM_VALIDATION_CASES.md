# 31. QUANTUM VALIDATION CASES

This document provides deterministic mathematical validation cases to ensure the internal Quantum Engine computes states accurately before rendering visual outputs. **Do not implement the engine here; use these cases during QA.**

## Normalization Requirement
For any state vector `|ψ⟩ = α|0⟩ + β|1⟩`, the total probability must always equal 1.
* Validation: `|α|² + |β|² = 1.000` (with floating-point epsilon tolerance of `1e-9`).

## 1. Single Qubit Operations

### The X Gate (Pauli-X / NOT)
* **Input State:** `|0⟩` `[1, 0]`
* **Operation:** Apply X
* **Expected Output State:** `|1⟩` `[0, 1]`
* **Expected Probabilities:** P(0) = 0%, P(1) = 100%
* **Bloch Vector Behavior:** Rotates 180° around the X-axis (From +Z to -Z).

### The Y Gate (Pauli-Y)
* **Input State:** `|0⟩` `[1, 0]`
* **Operation:** Apply Y
* **Expected Output State:** `i|1⟩` `[0, i]`
* **Expected Probabilities:** P(0) = 0%, P(1) = 100%
* **Bloch Vector Behavior:** Rotates 180° around the Y-axis.

### The Z Gate (Pauli-Z / Phase Flip)
* **Input State:** `|0⟩` `[1, 0]`
* **Operation:** Apply Z
* **Expected Output State:** `|0⟩` `[1, 0]` (Global phase ignored)
* **Expected Probabilities:** P(0) = 100%, P(1) = 0%
* **Secondary Case:** `|+⟩` → Apply Z → expected `|-⟩`. (Bloch vector rotates 180° around Z, from +X to -X).

### The H Gate (Hadamard)
* **Input State:** `|0⟩` `[1, 0]`
* **Operation:** Apply H
* **Expected Output State:** `|+⟩` `[1/√2, 1/√2]`
* **Expected Probabilities:** P(0) = 50%, P(1) = 50%
* **Bloch Vector Behavior:** Vector moves from North Pole (+Z) to Equator (+X).

### The S Gate (Phase)
* **Input State:** `|+⟩` `[1/√2, 1/√2]`
* **Operation:** Apply S
* **Expected Output State:** `|R⟩` `[1/√2, i/√2]`
* **Expected Probabilities:** P(0) = 50%, P(1) = 50%
* **Bloch Vector Behavior:** Vector rotates 90° along the equator from +X to +Y.

### The T Gate
* **Input State:** `|+⟩` `[1/√2, 1/√2]`
* **Operation:** Apply T
* **Expected Output State:** `[1/√2, (1+i)/2]`
* **Expected Probabilities:** P(0) = 50%, P(1) = 50%
* **Bloch Vector Behavior:** Vector rotates 45° along the equator from +X toward +Y.

---

## 2. Multi-Qubit Operations

### Tensor Product Initialization
* **Input State:** Q0 in `|0⟩`, Q1 in `|0⟩`
* **Expected Output State:** `|00⟩` `[1, 0, 0, 0]`

### The CNOT Gate (Controlled-NOT)
* **Input State:** `|10⟩` (Q0 is control=1, Q1 is target=0)
* **Operation:** Apply CNOT(control: 0, target: 1)
* **Expected Output State:** `|11⟩` `[0, 0, 0, 1]`

### The SWAP Gate
* **Input State:** `|01⟩`
* **Operation:** Apply SWAP(0, 1)
* **Expected Output State:** `|10⟩`

### Bell State Entanglement (Crucial Test)
* **Input State:** `|00⟩`
* **Operations:**
  1. Apply H to Q0. State becomes `(|00⟩ + |10⟩) / √2`.
  2. Apply CNOT (Control Q0, Target Q1).
* **Expected Output State:** `(|00⟩ + |11⟩) / √2` `[1/√2, 0, 0, 1/√2]`
* **Expected Probabilities:** P(00) = 50%, P(01) = 0%, P(10) = 0%, P(11) = 50%
* **Measurement Expectation:** If measured, the system must collapse to EITHER exactly `|00⟩` or exactly `|11⟩`. If a partial measurement is implemented (measuring only Q0), Q1 must instantaneously collapse to match Q0's result.
