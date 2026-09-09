# PAGE 3 — QUANTUM EXPO LAB — SPECIFICATION — QYNX

---

## 1. Purpose & Scientific Mission

**QUANTUM EXPO LAB** is Page 3 of **QYNX**, providing a structured, interactive laboratory environment for empirical quantum experimentation. Moving beyond freeform gate exploration, users execute calibrated protocols with clear hypotheses, progressive step execution, multi-shot statistical verification, and empirical state resets.

### Invariant Pedagogical Standards:
1. **Separation of State Probability vs. Single Outcome**: The interface explicitly distinguishes the theoretical probability distribution ($P(|0\rangle) = |\alpha|^2, P(|1\rangle) = |\beta|^2$) from single-shot projective collapse and multi-shot statistical approximations.
2. **Scientific Laboratory Interface**: Structured into objective briefs, apparatus preparation, unitary execution, measurement detection, and empirical analysis.
3. **QYNX Design Alignment**: Built with restrained surfaces in the QYNX Purple scale (`Purple 80` card surfaces, `Purple 70` structural borders, `Purple 60` action emphasis) with high-contrast `White` data typography.

---

## 2. Route & Component Architecture

```
Route: /expo-lab (with /experiment-lab fallback redirect)
Component: src/pages/QuantumExpoLab.tsx
State Slice: src/store/expoLabSlice.ts
Engine Contracts: engine.applyGate, engine.measureSingle, engine.measureMultiShot, engine.getProbabilities1Q
```

---

## 3. Visual Layout & Workspace Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ 03 QUANTUM EXPO LAB                             [ Experiment History ] │
├─────────────────┬──────────────────────────────────────────────────────┤
│  LAB EXPERIMENTS│                 EXPERIMENTAL WORKSPACE               │
│                 │                                                      │
│  ● 01 Superpos. │  EXPERIMENT 01 — SUPERPOSITION                       │
│  ○ 02 Bit-Flip  │  Objective: Form equal superposition and verify Born │
│  ○ 03 Phase-Flip│             probabilities through empirical shots.   │
│  ○ 04 H² = I    ├──────────────────────────────────────────────────────┤
│  ○ 05 T-Rot.    │  STEP PROGRESSION                                    │
│                 │  [● 1. Init |0⟩] ──► [● 2. Apply H] ──► [○ 3. Measure]│
│                 ├──────────────────────────────────────────────────────┤
│                 │  [ RUN NEXT STEP ]   [ EXECUTE ALL ]   [ RESET LAB ] │
│                 ├──────────────────────────────────────────────────────┤
│                 │  CURRENT STATE VECTOR                                │
│                 │  |+⟩ = 0.707|0⟩ + 0.707|1⟩                           │
│                 │  Theoretical: P(|0⟩) = 50.0%  |  P(|1⟩) = 50.0%      │
│                 ├──────────────────────────────────────────────────────┤
│                 │  STATISTICAL DETECTION (SHOT SAMPLING)               │
│                 │  Shots: [ 100 ] (Presets: 1 | 100 | 1000 | 10000)    │
│                 │  [ SAMPLE N SHOTS ]                                  │
│                 │                                                      │
│                 │  |0⟩ [████████████████      ]  51 shots (51.0%)      │
│                 │  |1⟩ [███████████████       ]  49 shots (49.0%)      │
│                 ├──────────────────────────────────────────────────────┤
│                 │  SCIENTIFIC EXPLANATION                              │
│                 │  "Applying the Hadamard gate transforms the basis ket│
│                 │   into an equal superposition. Each shot collapses   │
│                 │   probabilistically; aggregating samples reveals the │
│                 │   underlying 50/50 probability distribution."        │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---

## 4. Core Laboratory Experiments

### 4.1 Experiment 01 — Superposition Verification
- **Objective**: Prepare $|0\rangle$, apply Hadamard ($H$), and confirm $50\%/50\%$ probability convergence.
- **Protocol**:
  1. *Step 1 (Initialize)*: State initialized to ground state $|0\rangle$. $P(|0\rangle) = 100.0\%$.
  2. *Step 2 (Unitary Operation)*: Apply $H$ gate $\to |+\rangle = \frac{1}{\sqrt{2}}(|0\rangle + |1\rangle)$.
  3. *Step 3 (Detection)*: Execute sampling over $100$ or $1,000$ shots.
- **Key Pedagogical Lesson**: A single shot yields either a definite $0$ or $1$. Repeated shots are required to reveal the underlying superposition amplitude balance.

### 4.2 Experiment 02 — Bit-Flip Verification (Pauli-X)
- **Objective**: Execute a deterministic state transition from $|0\rangle$ to $|1\rangle$ using the Pauli-X operator.
- **Protocol**:
  1. *Step 1 (Initialize)*: State set to $|0\rangle$.
  2. *Step 2 (Unitary Operation)*: Apply $X$ gate $\to |1\rangle$.
  3. *Step 3 (Detection)*: Sample $1,000$ shots $\to 100.0\% |1\rangle$ ($0\% |0\rangle$).
- **Key Pedagogical Lesson**: Quantum computation includes deterministic classical operations as a subset of unitary transformations.

### 4.3 Experiment 03 — Phase-Flip in Superposition (Z Gate)
- **Objective**: Demonstrate phase modulation on $|+\rangle \to |-\rangle$, and convert back via $H$ to verify deterministic inversion to $|1\rangle$.
- **Protocol**: $|0\rangle \xrightarrow{H} |+\rangle \xrightarrow{Z} |-\rangle \xrightarrow{H} |1\rangle$.

### 4.4 Experiment 04 — Hadamard Involutory Identity ($H^2 = I$)
- **Objective**: Demonstrate that applying $H$ twice restores the initial state vector with mathematical precision.
- **Protocol**: $|0\rangle \xrightarrow{H} |+\rangle \xrightarrow{H} |0\rangle$.

### 4.5 Experiment 05 — Phase Accumulation ($T^4 = Z$)
- **Objective**: Sequentially apply four $T$ gates ($\pi/4$ rotation each) to accumulate a $\pi$ phase shift equivalent to a $Z$ gate.

---

## 5. Controls & Statistical Sampling Mechanics

1. **Step Sequencer**:
   - `RUN NEXT STEP`: Executes the next designated operation with a $400\text{ms}$ smooth animation.
   - `EXECUTE ALL`: Runs the entire protocol with a $600\text{ms}$ delay between steps.
   - `RESET LAB`: Resets the workspace to Step 1 and reinstates the $|0\rangle$ state vector.
2. **Shot Stepper**:
   - Allows users to test $N = 1$ (single-shot collapse), $100$, $1,000$, and $10,000$ shots.
   - Results histogram dynamically displays empirical shot counts and percentages in `White` on `Purple 60` bars.
