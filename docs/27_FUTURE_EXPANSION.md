# QYNX — FUTURE EXPANSION SPECIFICATION

---

## 1. Purpose

This document outlines architectural roadmaps and candidate features that are **explicitly out of scope for the MVP launch** of QYNX, but have informed the current modular system design. 

The QYNX core architecture (zero-dependency math engine, Zustand state store, and decoupled visualization layer) ensures that these future extensions can be integrated incrementally without refactoring the foundational single- and multi-qubit simulation pipelines.

Expansion initiatives are categorized across three chronological horizons:
- **Near-Term (1–3 months post-MVP):** Parametrized gates, additional Quantum Expo Lab protocols, URL circuit serialization.
- **Mid-Term (3–12 months post-MVP):** Quantum noise models (density matrix channels), state trajectory curves, algorithm explorer.
- **Long-Term (12+ months post-MVP):** Hardware execution via IBM Quantum / Qiskit, collaborative real-time circuit builder, quantum error correction protocols.

---

## 2. Near-Term Expansions

### 2.1 Parametrized Single-Qubit Rotations & Extended Gates

**Current Launch Gates:** $X, Y, Z, H, S, T, \text{CNOT}, \text{SWAP}$.

**Planned Additions:**

| Gate | Symbol | Unitary Definition / Description |
|------|--------|----------------------------------|
| $R_x(\theta)$ | $R_x$ | $\cos(\theta/2)I - i\sin(\theta/2)X$ (arbitrary $X$-axis rotation) |
| $R_y(\theta)$ | $R_y$ | $\cos(\theta/2)I - i\sin(\theta/2)Y$ (arbitrary $Y$-axis rotation) |
| $R_z(\theta)$ | $R_z$ | $\cos(\theta/2)I - i\sin(\theta/2)Z$ (arbitrary $Z$-axis rotation) |
| Phase($\phi$) | $P(\phi)$ | $\begin{pmatrix} 1 & 0 \\ 0 & e^{i\phi} \end{pmatrix}$ (arbitrary relative phase shift) |
| $S^\dagger$ | $S^\dagger$ | Phase subtraction ($-\pi/2$ around $Z$) |
| $T^\dagger$ | $T^\dagger$ | Phase subtraction ($-\pi/4$ around $Z$) |
| Toffoli (CCX) | CCX | 3-qubit controlled-controlled-NOT |
| Fredkin (CSWAP) | CSWAP | 3-qubit controlled-SWAP |

**Engine Extension Pattern:**
```typescript
// Parameterized gate kernel extension in src/engine/gates/rotation.ts:
export function getRxMatrix(theta: number): Matrix2x2 {
  const half = theta / 2
  return [
    [{ re: Math.cos(half), im: 0 }, { re: 0, im: -Math.sin(half) }],
    [{ re: 0, im: -Math.sin(half) }, { re: Math.cos(half), im: 0 }],
  ]
}
```

### 2.2 Additional Quantum Expo Lab Protocols

The Quantum Expo Lab protocol sequencer is designed as a data-driven configuration list (`ExpoProtocolDefinition[]`). Future protocols can be registered without UI code changes:

| Protocol Name | Target Concept | Steps / Gates |
|---------------|----------------|---------------|
| **Deutsch Algorithm** | Quantum function evaluation advantage | $|01\rangle \to H^{\otimes 2} \to U_f \to H \otimes I \to$ Measure |
| **Quantum Teleportation** | State transfer via entanglement & classical bits | Bell pair creation, Bell basis measurement, conditional Pauli corrections |
| **Grover Iteration (2-Qubit)** | Amplitude amplification oracle | Equal superposition $\to$ Phase oracle $\to$ Diffusion operator |
| **Bernstein-Vazirani** | Single-query hidden bit string discovery | $H^{\otimes n} \to U_s \to H^{\otimes n} \to$ Deterministic measurement |
| **Quantum Fourier Transform (QFT)** | Phase estimation foundation | Controlled phase rotations + Hadamard cascade |

### 2.3 URL-Encoded Circuit Sharing

Enable instant, backend-free circuit sharing via URL hash/query parameter:

```
https://qynx.app/circuit-builder?circuit=eJzT09PPL0pVSMvMy0xRMDQ2MzcwMjY1MDUwNjKzMAQAOWAG8A==
```

- **Serialization:** Circuit JSON schema is compressed via `pako` (zlib/deflate) and encoded into URL-safe base64.
- **Privacy & Safety:** Client-side only; no user accounts or persistent server storage required. Strict schema validation guards against malformed payloads.

---

## 3. Mid-Term Expansions

### 3.1 Open Quantum Systems & Environmental Noise Simulation

Physical NISQ hardware suffers from decoherence and gate infidelities. Adding realistic noise enables students to observe quantum state degradation:

```typescript
export interface QuantumNoiseModel {
  depolarizingProbability: number // Probability of random X/Y/Z error per gate
  amplitudeDampingGamma: number   // Energy dissipation (T1 decay towards |0⟩)
  phaseDampingLambda: number       // Phase randomization without energy loss (T2 dephasing)
  readoutErrorRate: number        // Classical bit-flip probability during measurement
}
```

*Architectural Impact:* Pure state vectors $|\psi\rangle \in \mathbb{C}^N$ are replaced by density operators $\rho \in \mathbb{C}^{N \times N}$ ($\rho = \sum_i p_i |\psi_i\rangle\langle\psi_i|$), simulated using Kraus operators:
$$\rho_{k+1} = \sum_m E_m \rho_k E_m^\dagger$$

### 3.2 Bloch Sphere State Trajectories

Render continuous trace lines on the 3D Bloch sphere illustrating the trajectory traced by the state vector across sequential gate applications:
- **Recent Vectors:** High-contrast white (`#FFFFFF`) path.
- **Historical Trail:** Gradient fade to QYNX Purple 40 (`#BE95FF`) and Purple 80 (`#491D8B`), dissipating after 5 steps.
- **Rendering:** Three.js `Line2` mesh or particle ribbon on the unit sphere surface.

### 3.3 Interactive Quantum Algorithm Explorer

A dedicated educational portal breaking down complete algorithms into step-by-step interactive stages with real-time complexity comparisons:
- Classical runtime $\mathcal{O}(N)$ vs. Quantum runtime $\mathcal{O}(\sqrt{N})$ interactive visual graphs.
- Direct "Open in QYNX Circuit Builder" button pre-populating the full circuit matrix.

---

## 4. Long-Term Expansions

### 4.1 Real Quantum Hardware Execution (IBM Quantum / Qiskit)

Allow advanced users to dispatch QYNX circuits to physical superconducting transmon processors:
1. Export circuit to standard **OpenQASM 2.0 / 3.0**:
   ```qasm
   OPENQASM 2.0;
   include "qelib1.inc";
   qreg q[2];
   creg c[2];
   h q[0];
   cx q[0], q[1];
   measure q -> c;
   ```
2. Proxy through an authenticated cloud worker to IBM Quantum API.
3. Overlay noisy physical device execution histograms side-by-side with QYNX theoretical Born rule distributions.

### 4.2 Real-Time Collaborative Circuit Canvas

Multiplayer circuit authoring powered by WebSockets / WebRTC:
- Shared state synchronization via CRDTs (Conflict-Free Replicated Data Types, e.g., Yjs).
- Collaborative cursor tracking showing colleague edits on the 8-step circuit grid.

### 4.3 Quantum Error Correction (QEC) Interactive Playground

Interactive demonstrations of quantum code syndrome extraction:
- 3-Qubit Bit-Flip Code ($|0\rangle_L = |000\rangle, |1\rangle_L = |111\rangle$).
- 3-Qubit Phase-Flip Code using Hadamard basis transformation.
- Surface Code planar lattice visualization for error syndrome decoding.

---

## 5. Architectural Readiness Matrix

| Feature | Engine Preparedness | Store Preparedness | UI Preparedness |
|---------|---------------------|--------------------|-----------------|
| Parametrized Gates ($R_x, R_y, R_z$) | High (Matrix functions support arbitrary $\theta$) | High (Action accepts numeric payload) | Medium (Requires slider UI component) |
| Extended Expo Protocols | Complete (Data-driven array structure) | Complete (Generic protocol runner) | Complete (Generic step sequencer UI) |
| URL Circuit Sharing | Complete (Circuit schema JSON-serializable) | Complete (`loadCircuit` action) | Low (Needs URL param parser hook) |
| Noise Models | Low (Requires density matrix refactor) | Medium (Noise toggles in UI store) | Medium (Noise slider controls) |
| OpenQASM Export | High (Direct string transformation module) | Complete (Circuit definition readable) | Low (Modal with copy-to-clipboard) |
| Real Hardware API | Low (Requires backend proxy / API key vault) | Low (Async job queue management) | Medium (Job status notification panel) |

---

## 6. What QYNX Is Explicitly NOT

To safeguard product focus, technical excellence, and browser performance, the following are strictly excluded from QYNX:

1. **Not a Heavy Industrial Quantum Compiler:** QYNX does not perform topological quantum routing, hardware transpilation, or pulse-level microwave scheduling.
2. **Not a High-Qubit State Simulator:** State vector dimension scales as $2^N$. QYNX caps simulation at 3–4 qubits in browser memory. It will never simulate 30+ qubits (which requires petabytes of supercomputing RAM).
3. **Not a Cryptographic Breaking Tool:** QYNX does not execute 4096-bit RSA factorization; Shor's algorithm demonstrations are strictly conceptual on tiny toy integers (e.g., factoring 15).
4. **Not a Classical Circuit Simulator:** QYNX does not model classical logic gates (AND, OR, NAND) or transistor physics.
5. **Not a Dark-Pattern Commercial Tool:** No intrusive telemetry, no mandatory cloud logins for basic simulation, and no artificial paywalls for educational access.
