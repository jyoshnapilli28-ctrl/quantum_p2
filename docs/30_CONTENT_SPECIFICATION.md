# 30. CONTENT SPECIFICATION — QYNX

This document dictates the authoritative educational copy, conceptual progression, and scientific rigor standards for the 5 interactive pages of **QYNX**. The editorial voice is precise, human, credible, and grounded in standard quantum mechanical formalism (bra-ket notation, unitary evolution, Born rule probabilities).

---

## PAGE 1: Quantum Universe (Foundational Educational Hub)

The 9 foundational educational topics must adhere to the 3-second comprehension rule: high-contrast diagrams with concise explanatory prose:

1. **Classical Bit vs. Qubit:**
   - *Core Narrative:* A classical bit is strictly deterministic ($0$ or $1$, low or high voltage). A quantum bit (qubit) is a normalized vector in a two-dimensional complex Hilbert space $\mathbb{C}^2$, allowing continuous phase and amplitude superpositions prior to observation.
2. **Superposition Principle:**
   - *Core Narrative:* A qubit is never "both 0 and 1 at the same time" (a frequent layman misconception). Rather, it resides in a definitive linear combination $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, where complex coefficients $\alpha, \beta \in \mathbb{C}$ satisfy the probability conservation constraint $|\alpha|^2 + |\beta|^2 = 1$.
3. **Bloch Sphere Geometry:**
   - *Core Narrative:* A pure single-qubit state maps uniquely to the surface of a three-dimensional unit sphere $\mathbb{R}^3$. The North pole represents $|0\rangle$, the South pole $|1\rangle$, and equatorial points signify equal-probability superpositions distinguished by relative quantum phase $\phi$.
4. **Quantum Measurement & State Collapse:**
   - *Core Narrative:* Physical observation in the computational basis $\{|0\rangle, |1\rangle\}$ interrupts unitary evolution. According to the Born rule, the system non-reversibly projects into eigenstate $|0\rangle$ with probability $|\alpha|^2$ or $|1\rangle$ with probability $|\beta|^2$.
5. **Unitary Logic Gates:**
   - *Core Narrative:* Quantum logic gates are represented by norm-preserving unitary operators ($U^\dagger U = I$). They perform continuous, reversible geometric rotations of the state vector on the Bloch sphere without extracting intermediate state information.
6. **Entanglement & Non-Locality:**
   - *Core Narrative:* When two or more qubits interact, their composite state vector cannot be factored into independent single-qubit states ($|\psi_{AB}\rangle \neq |\psi_A\rangle \otimes |\psi_B\rangle$). Measurement of one qubit instantaneously determines the state of its entangled partner regardless of spatial separation.
7. **Quantum Circuit Paradigm:**
   - *Core Narrative:* Computation is structured as a discrete network where horizontal wires represent quantum register evolution over time, and matrix operators are sequentially applied from left to right prior to terminal readout.
8. **Decoherence & Environmental Coupling:**
   - *Core Narrative:* Real physical qubits interact with thermal and electromagnetic ambient environments, degrading fragile quantum phases ($T_2$ dephasing) and relaxing excited states to ground equilibrium ($T_1$ relaxation).
9. **Quantum Advantage & Applications:**
   - *Core Narrative:* Exploiting constructive and destructive quantum interference yields super-polynomial speedups for specialized mathematical problems, including integer factorization (Shor's algorithm), database searching (Grover's algorithm), and molecular simulation.

---

## PAGE 2: Quantum Gate Visualizer

### Single-Qubit Operators
- **Pauli-X Gate (Bit-Flip):** $\pi$ rotation around the $X$-axis. Swaps basis states: $X|0\rangle = |1\rangle$ and $X|1\rangle = |0\rangle$.
- **Pauli-Y Gate (Bit & Phase-Flip):** $\pi$ rotation around the $Y$-axis. Maps $Y|0\rangle = i|1\rangle$ and $Y|1\rangle = -i|0\rangle$.
- **Pauli-Z Gate (Phase-Flip):** $\pi$ rotation around the $Z$-axis. Preserves $|0\rangle$ while inverting the sign of $|1\rangle$: $Z|0\rangle = |0\rangle$, $Z|1\rangle = -|1\rangle$.
- **Hadamard Gate (H):** Rotation by $\pi$ around the diagonal $(X+Z)/\sqrt{2}$ axis. Maps computational basis states into symmetric superposition: $H|0\rangle = |+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}$, $H|1\rangle = |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}$.
- **Phase Gate (S):** Rotation by $\pi/2$ around the $Z$-axis. $S|0\rangle = |0\rangle$, $S|1\rangle = i|1\rangle$. Satisfies $S^2 = Z$.
- **$\pi/8$ Gate (T):** Rotation by $\pi/4$ around the $Z$-axis. $T|0\rangle = |0\rangle$, $T|1\rangle = e^{i\pi/4}|1\rangle$. Satisfies $T^2 = S$. Universal computation requires non-Clifford gates like $T$.

---

## PAGE 3: Quantum Expo Lab

### Pre-Configured Educational Protocols
- **Protocol 1: Superposition Synthesis & Sampling**
  - *Sequence:* Initialize $|0\rangle \to$ Apply $H \to$ Inspect $|\psi\rangle = |+\rangle \to$ Multi-shot measurement sampling ($N = 1000$).
  - *Key Takeaway:* Individual single-shot measurements yield unpredictable binary outcomes ($0$ or $1$); aggregate large-sample distributions converge toward the theoretical $50\%$ Born limit.
- **Protocol 2: Deterministic Bit-Flip Protocol**
  - *Sequence:* Initialize $|0\rangle \to$ Apply $X \to$ Inspect $|\psi\rangle = |1\rangle \to$ Multi-shot measurement sampling.
  - *Key Takeaway:* A unitary transformation can act deterministically, proving quantum systems encompass classical logic as a strict subset.

---

## PAGE 4: Quantum Entanglement Simulator

- **Two-Qubit State Space:** Product Hilbert space $\mathbb{C}^4$ with computational basis $\{|00\rangle, |01\rangle, |10\rangle, |11\rangle\}$.
- **Canonical Bell State $|\Phi^+\rangle$:** Synthesized via $H$ on Qubit A followed by $\text{CNOT}$ with control A and target B:
  $$|00\rangle \xrightarrow{H \otimes I} \frac{|00\rangle + |10\rangle}{\sqrt{2}} \xrightarrow{\text{CNOT}} \frac{|00\rangle + |11\rangle}{\sqrt{2}} = |\Phi^+\rangle$$
- **Measurement Correlations:** Evaluating Qubit A projects the entangled wave function. If Qubit A registers $0$, Qubit B is guaranteed to register $0$ with $100\%$ conditional probability ($P(B=0 | A=0) = 1$).

---

## PAGE 5: Quantum Circuit Builder

- **Register Timeline:** Horizontal wires represent discrete qubit channels propagating from left (initialization $|0\rangle$) to right (terminal measurement).
- **Multi-Qubit Operators:** 
  - $\text{CNOT}$ (Controlled-NOT): Flips the target qubit state if and only if the control qubit evaluates to $|1\rangle$.
  - $\text{SWAP}$: Interchanges quantum states between two designated wires ($\text{SWAP}|jk\rangle = |kj\rangle$).
- **Multi-Shot Empirical Verification:** Executing user-constructed circuits evaluates state evolution via pure matrix algebra and samples terminal probabilities over 1,000 simulated shots.
