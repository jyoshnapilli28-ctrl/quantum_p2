# FUTURE EXPANSION — SPECIFICATION

---

## 1. Purpose

This document specifies potential features and enhancements that are **out of scope for the initial launch** but are explicitly planned for. Architectural decisions documented here (and in earlier files) were made with these expansions in mind.

All expansion items are categorized by priority:
- **Near-term:** Feasible after the initial release stabilizes (1–3 months post-launch).
- **Mid-term:** Requiring more significant architecture work (3–12 months).
- **Long-term:** Exploratory / research-quality features (12+ months).

---

## 2. Near-Term Expansions

### 2.1 Additional Gate Types

**Current launch gates:** H, X, Y, Z, S, T, CNOT, SWAP.

**Planned additions:**

| Gate | Symbol | Description |
|------|--------|-------------|
| Pauli-X† | X = X (self-adjoint) | Already included |
| Rx(θ) | Rₓ | Arbitrary X rotation |
| Ry(θ) | Rᵧ | Arbitrary Y rotation |
| Rz(θ) | R_z | Arbitrary Z rotation |
| Phase(φ) | P(φ) | General phase gate |
| S† | S† | S dagger (π/2 phase subtraction) |
| T† | T† | T dagger (π/8 phase subtraction) |
| Toffoli | CCX | Three-qubit controlled-controlled-X |
| Fredkin | CSWAP | Three-qubit controlled-SWAP |

**Architecture note:** The engine is designed to accept parametrized gates:
```typescript
// Future extension to GATE_MATRICES:
function getRxMatrix(theta: number): Matrix2x2 {
  return [
    [{ re: Math.cos(theta/2), im: 0 }, { re: 0, im: -Math.sin(theta/2) }],
    [{ re: 0, im: -Math.sin(theta/2) }, { re: Math.cos(theta/2), im: 0 }],
  ]
}
```

The `applyGate` function signature can be extended to accept an optional `params` argument.

**UI addition:** A rotation angle slider for Rx, Ry, Rz gates.

### 2.2 Additional Experiments (Experiment Lab)

| Experiment | Description |
|-----------|-------------|
| Grover's Oracle (2-qubit) | Demonstrate amplitude amplification on 2 qubits |
| Quantum Teleportation | Classical communication + entanglement for state transfer |
| Deutsch's Algorithm | Quantum vs classical function evaluation |
| Bernstein-Vazirani | Hidden string finding with quantum advantage |
| QFT (2-qubit) | Quantum Fourier Transform demonstration |

Each experiment is an `ExperimentDefinition` object — adding them requires no architecture changes.

### 2.3 Additional Bell States

The Entanglement Simulator currently only creates Φ+ (the standard Bell state). Expand to all four Bell states:

| Bell State | Formula |
|-----------|---------|
| Φ+ | (|00⟩ + |11⟩)/√2 |
| Φ− | (|00⟩ − |11⟩)/√2 |
| Ψ+ | (|01⟩ + |10⟩)/√2 |
| Ψ− | (|01⟩ − |10⟩)/√2 |

A selector in the Entanglement Simulator allows choosing which Bell state to create.

### 2.4 Circuit Sharing

Allow users to share circuits via URL:

```
/circuit-builder?circuit=base64encodedCircuit
```

The circuit definition (JSON) is serialized and URL-encoded as a base64 string. When the URL is loaded, the circuit is deserialized and loaded into the editor.

**Security:** Only circuit structure is encoded (no user data). The URL can be copied and shared. No server-side storage needed.

---

## 3. Mid-Term Expansions

### 3.1 Noise Models

Real quantum computers are subject to decoherence and gate errors. Add a noise model to the simulator:

```typescript
interface NoiseModel {
  gateError: number;      // Probability of a depolarizing error per gate (e.g., 0.001)
  measurementError: number; // Probability of a bit-flip on measurement
  decoherenceTime: number;  // T1 in gate steps (amplitude damping)
}
```

With noise enabled:
- Each gate application has a small probability of applying a random error operation (depolarizing channel).
- Measurement has a small probability of returning the wrong outcome.
- Long circuits show increased error with increasing depth.

**UI addition:** A "Noise Level" slider in the Circuit Builder and Experiment Lab (off / low / medium / high presets).

**Architecture note:** The engine's `applyGate` function returns a pure state. Noise requires density matrix representation (`ρ = |ψ⟩⟨ψ|`). This is a significant engine extension (4×4 density matrices for 2 qubits, scaling exponentially). Implement behind a feature flag.

### 3.2 3-Qubit and 4-Qubit Support Everywhere

The circuit builder already supports up to 4 qubits. This expansion brings full 4-qubit support to the Experiment Lab and adds GHZ state demonstrations.

**Engine readiness:** The `applyGateToWire` function with N-qubit Kronecker product is already designed to extend to N qubits. This is primarily a UI and store expansion.

### 3.3 Bloch Sphere Trajectory Visualization

Show the path the state vector traced on the Bloch sphere over the last N gate operations.

```
State trajectory:
  A fading arc drawn on the sphere surface showing the history of state positions.
  Recent positions: high opacity (white)
  Old positions: low opacity (Arctic, fades to invisible after 5 states)
```

**Implementation:** Store the last 10 `BlochCoordinates` values in the store. Render as a `Line2` arc on the sphere surface in `BlochScene.ts`.

### 3.4 Quantum Algorithm Library

A new top-level page or section with explanations and visual demonstrations of full quantum algorithms:

| Algorithm | Status |
|-----------|--------|
| Deutsch-Jozsa | Visualize oracle function evaluation |
| Bernstein-Vazirani | Visualize hidden bit string |
| Simon's Algorithm | Visualize period finding |
| Grover's Search | Visualize amplitude amplification |
| Shor's Algorithm (simplified) | Visualize modular exponentiation concept |

Each algorithm entry:
- Explains what the algorithm does (educational text).
- Shows the quantum circuit (using the existing `CircuitDiagram` component).
- Demonstrates the speedup (comparison with classical complexity).
- Links to the Circuit Builder with the algorithm pre-loaded.

**Architecture note:** This is a new page (`/algorithms`) and does not require engine changes. Circuits are static `CircuitDefinition` objects.

---

## 4. Long-Term Expansions

### 4.1 Multiplayer Mode — Collaborative Circuit Builder

Allow two users to collaboratively build a circuit in real-time using WebSockets.

**Technology:** WebSocket server (Node.js + ws), circuit state broadcast to all connected peers.

**Architecture note:** The circuit definition is the shared state. All operations (addGate, removeGate, setQubits) are sent as messages. The server broadcasts to all peers. Each client applies the operation optimistically and reconciles if needed.

### 4.2 Tutorial Mode with Guided Hints

A step-by-step tutorial mode that overlays contextual hints on the existing pages.

**Implementation:** A `TutorialContext` that tracks the user's progress through a tutorial sequence. Popover/tooltip overlays appear on specific UI elements (e.g., "Click the H gate to create superposition →").

### 4.3 IBM Quantum / Qiskit Runtime Integration

Allow users to run their circuits on **real quantum hardware** via the IBM Quantum API.

**Workflow:**
1. User builds circuit in the Circuit Builder.
2. User authenticates with an IBM Quantum account.
3. Circuit is translated to Qiskit Python code or OpenQASM 2.0.
4. Circuit is submitted to IBM Quantum's queue.
5. Results are displayed in the application alongside the simulation results.
6. User can compare the simulated (ideal) results with the real hardware results.

**Architecture note:** Requires a backend server (or serverless function) to hold the IBM Quantum API key securely. The frontend communicates with this proxy server. The circuit `CircuitDefinition` can be converted to OpenQASM 2.0.

```typescript
// Future: src/engine/export/openqasm.ts
function circuitToOpenQASM(circuit: CircuitDefinition): string {
  let qasm = 'OPENQASM 2.0;\ninclude "qelib1.inc";\n'
  qasm += `qreg q[${circuit.qubits}];\n`
  qasm += `creg c[${circuit.qubits}];\n`
  // ... convert gates to QASM
  return qasm
}
```

### 4.4 Quantum Error Correction Demo

Demonstrate the 3-qubit bit-flip code and 3-qubit phase-flip code as an educational page.

Shows:
- How a qubit error is introduced.
- How syndrome measurement detects the error.
- How the correction gate restores the original state.

---

## 5. Architecture Readiness

The current architecture already accommodates:

| Feature | How It's Ready |
|---------|---------------|
| More gates | `GATE_MATRICES` is an extensible constant; `GateId` type is extensible |
| Parametrized gates | `applyGate` signature can accept `params` argument |
| More qubits | N-qubit Kronecker product designed in `12_MULTI_QUBIT_SYSTEM.md` |
| More experiments | `ExperimentDefinition` is a data structure, easily added to |
| Circuit sharing | `CircuitDefinition` is JSON-serializable |
| Noise models | Separate engine layer, isolated from pure state operations |
| OpenQASM export | `CircuitDefinition` contains all information needed for conversion |

---

## 6. What This Application Is NOT

To prevent scope creep, the following are explicitly excluded from all phases:

| Feature | Reason for Exclusion |
|---------|---------------------|
| Real quantum hardware execution (launch) | Requires backend infrastructure |
| Multi-user accounts / authentication | Out of scope for an educational demo |
| Persistent cloud storage of circuits | Out of scope; use URL sharing instead |
| Continuous variable (CV) quantum mechanics | Different mathematical framework |
| More than 8 qubits (ever) | State vector grows as 2^N; 256 amplitudes at 8 qubits, ~16 KB. At 30 qubits: 1B amplitudes, not browser-feasible |
| Classical circuit simulator | Off-topic |
| Quantum machine learning | Post-long-term scope |

---

## 7. Contact and Contributions

This specification is the canonical reference for building the Quantum Universe application.

To propose new features:
1. Identify which expansion category it falls into (near/mid/long-term).
2. Verify it does not conflict with the architectural rules in `03_PROJECT_ARCHITECTURE.md`.
3. Draft a brief spec update for the relevant documentation file.
4. Confirm that the engine layer changes required are isolated (no changes to existing functions, only additions).
