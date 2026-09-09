# PAGE 4 — QUANTUM ENTANGLEMENT SIMULATOR — SPECIFICATION — QYNX

---

## 1. Purpose & Educational Mission

**QUANTUM ENTANGLEMENT SIMULATOR** is Page 4 of **QYNX**, modeling two-qubit quantum states and non-classical correlations. It guides users through the canonical Bell-state preparation protocol ($H + \text{CNOT}$), demonstrating how measurement of one qubit deterministically correlates with the measurement of another.

### Pedagogical Core Standards:
1. **Mathematical State Non-Separability**: Entanglement is presented rigorously as state non-separability ($|\psi_{AB}\rangle \neq |\psi_A\rangle \otimes |\psi_B\rangle$).
2. **Explicit Myth Refutation**: The documentation and interface must clearly emphasize that correlated outcomes are non-classical correlations, explicitly refuting the misconception of physical cables, instantaneous signaling, or faster-than-light radio links between the qubits.
3. **High-Contrast Legibility**: The circuit diagram, correlation indicators, and histogram bars conform to the QYNX Purple scale and Diagram Visibility standards.

---

## 2. Route & Component Architecture

```
Route: /entanglement
Component: src/pages/EntanglementSim.tsx
State Slice: src/store/entanglementSlice.ts
Engine Contracts: engine.createTwoQubitZeroState, engine.applyGateToQubit, engine.applyCNOT, engine.isEntangled, engine.measureMultiShot2Q
```

---

## 3. Visual Layout & Workspace Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ 04 QUANTUM ENTANGLEMENT SIMULATOR                      [ Reset State ] │
├────────────────────────────────────────────────────────────────────────┤
│  CANONICAL BELL-STATE CIRCUIT DIAGRAM                                  │
│                                                                        │
│  q0 (|0⟩) ─────[ H ]─────●───────────────[ M ]                         │
│                          │                                             │
│  q1 (|0⟩) ───────────────⊕───────────────[ M ]                         │
├────────────────────────────────────────────────────────────────────────┤
│  STATE REGISTERS                                                       │
│                                                                        │
│    QUBIT 0               COMPOSITE STATE              QUBIT 1          │
│  ┌──────────┐        ┌─────────────────────┐        ┌──────────┐       │
│  │   |0⟩    │        │  (|00⟩ + |11⟩) / √2 │        │   |0⟩    │       │
│  │ Register │        │  ✦ ENTANGLED STATE  │        │ Register │       │
│  └──────────┘        └─────────────────────┘        └──────────┘       │
├────────────────────────────────────────────────────────────────────────┤
│  GUIDED WORKFLOW                                                       │
│  [ 1: Init |00⟩ ] ──► [ 2: Apply H to q0 ] ──► [ 3: Apply CNOT ]       │
│                                                [ 4: Trigger Measure ]  │
├────────────────────────────────────────────────────────────────────────┤
│  CORRELATED DETECTION OUTCOMES (1,000 Shots)                           │
│  |00⟩ [████████████████████         ]  502 shots (50.2%)               │
│  |01⟩ [                             ]    0 shots ( 0.0%)               │
│  |10⟩ [                             ]    0 shots ( 0.0%)               │
│  |11⟩ [████████████████████         ]  498 shots (49.8%)               │
├────────────────────────────────────────────────────────────────────────┤
│  SCIENTIFIC EXPLANATION                                                │
│  "Applying Hadamard to q0 creates a superposition. CNOT then entangles │
│   q0 and q1 into the Bell state |Φ⁺⟩. When measured, both qubits       │
│   always agree (00 or 11), with zero occurrences of 01 or 10."         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Bell-State Preparation Protocol

$$\text{Step 1: } |00\rangle \xrightarrow{H \text{ on } q_0} \frac{|00\rangle + |10\rangle}{\sqrt{2}} \xrightarrow{\text{CNOT}_{0 \to 1}} \frac{|00\rangle + |11\rangle}{\sqrt{2}} = |\Phi^+\rangle$$

1. **Step 1 (Initialize)**:
   - State initialized to separable ground state $|00\rangle = [1, 0, 0, 0]^T$.
   - Schmidt rank test $\Delta = 0$ (`isEntangled = false`).
2. **Step 2 (Apply $H$ to $q_0$)**:
   - Transforms register to $\frac{1}{\sqrt{2}}|00\rangle + \frac{1}{\sqrt{2}}|10\rangle$.
   - $q_0$ is in superposition; $q_1$ remains unentangled in $|0\rangle$.
3. **Step 3 (Apply $\text{CNOT}_{0 \to 1}$)**:
   - Target wire $q_1$ flips conditioned on $q_0$, generating the entangled Bell state $|\Phi^+\rangle$.
   - Engine evaluates Schmidt rank $\Delta = 0.5 > 10^{-10}$, setting `isEntangled = true`.
   - The central status badge illuminates with a `Purple 60 #8A3FFC` border and tag `✦ ENTANGLED STATE`.
4. **Step 4 (Correlated Measurement)**:
   - Executes multi-shot detection over $100$ or $1,000$ shots.
   - Outputs conform strictly to correlated pairs: $|00\rangle \approx 50\%$ and $|11\rangle \approx 50\%$. The cross-terms $|01\rangle$ and $|10\rangle$ remain strictly at $0.0\%$.

---

## 5. Visual Specifications & Diagram Visibility

- **Circuit Diagram**:
  - Horizontal wires rendered in $2\text{px}$ `Purple 70 #6929C4`.
  - Gate box $[H]$ in `Purple 80` with $1.5\text{px}$ border.
  - CNOT control dot in `Purple 60` with solid vertical connector line to target $\oplus$ glyph.
  - Passes the 3-second comprehension rule by visually distinguishing the control register from the entangling target.
- **Entanglement Link Indicator**:
  - Subtle connecting arc between Qubit 0 and Qubit 1 panels rendered as an SVG path in `Purple 60` with $2\text{px}$ stroke width.
  - Respects `prefers-reduced-motion` by displaying as a static line with no flashing or traveling pulses.
- **Histogram**:
  - Basis bars in `Purple 60 #8A3FFC` on `Purple 90 #31135E` tracks.
  - Numerical readouts in `White #FFFFFF` and `JetBrains Mono`.
