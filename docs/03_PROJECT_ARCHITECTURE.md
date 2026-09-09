# PROJECT ARCHITECTURE — QYNX

---

## 1. Architectural Philosophy & Layered Structure

QYNX follows a strict **layered architecture** designed for modularity, scientific fidelity, testability, and seamless performance. The architectural layers are strictly decoupled:

1. **Presentation Layer (`src/components/`, `src/pages/`)**: React components rendering the user interface, handling DOM events, and presenting educational copy and controls.
2. **Page Controller / Orchestration Layer**: Connects UI events to state actions, coordinating multi-step flows without embedding mathematical equations.
3. **State Management Layer (`src/store/`)**: Centralized reactive Zustand store maintaining application state slices, dispatching actions, and maintaining undo/redo history.
4. **Visualization Layer (`src/visualization/`)**: Three.js WebGL rendering (Bloch Sphere), SVG circuit grids, and Canvas chart elements. Passively subscribes to state.
5. **Shared Quantum Engine (`src/engine/`)**: Completely headless, dependency-free mathematical library implementing linear algebra, unitary matrix transformations, tensor products, and projective measurements.

```
┌─────────────────────────────────────────────────────────────────┐
│                          QYNX SHELL                             │
│       Global Navigation, Brand Header, Theme Infrastructure     │
│                                                                 │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │    Page 1    │ │    Page 2    │ │    Page 3    │            │
│  │   QUANTUM    │ │ QUANTUM GATE │ │ QUANTUM EXPO │            │
│  │   UNIVERSE   │ │  VISUALIZER  │ │     LAB      │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│         ┌──────────────┐            ┌──────────────┐            │
│         │    Page 4    │            │    Page 5    │            │
│         │ ENTANGLEMENT │            │   CIRCUIT    │            │
│         │  SIMULATOR   │            │   BUILDER    │            │
│         └──────────────┘            └──────────────┘            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    STATE MANAGEMENT                     │   │
│  │             (Reactive Zustand Store & Slices)           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  SHARED QUANTUM ENGINE                  │   │
│  │   ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │   │
│  │   │Unitary   │  │Projective│  │Circuit Execution      │ │   │
│  │   │Gates     │  │Measure   │  │Pipeline               │ │   │
│  │   └──────────┘  └──────────┘  └───────────────────────┘ │   │
│  │   ┌──────────┐  ┌──────────┐  ┌───────────────────────┐ │   │
│  │   │Single    │  │Multi-Qub.│  │Complex Matrix         │ │   │
│  │   │StateVec  │  │Tensor    │  │Math                   │ │   │
│  │   └──────────┘  └──────────┘  └───────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  VISUALIZATION SYSTEM                   │   │
│  │   ┌────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │   │  3D Bloch  │  │  High-Contr. │  │   Circuit    │    │   │
│  │   │Sphere (r3f)│  │  Prob. Bars  │  │ Grid & Wires │    │   │
│  │   └────────────┘  └──────────────┘  └──────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Module Boundaries & Dependency Invariants

### 2.1 Shared Quantum Engine (`src/engine/`)
Contains zero external dependencies, zero React imports, and zero DOM interactions. Pure functions with deterministic output:

```
src/engine/
├── math/
│   ├── complex.ts          — Complex arithmetic (add, multiply, conjugate, norm)
│   ├── matrix.ts           — Unitary matrix operations & multiplication
│   └── vector.ts           — State vector inner product, norm verification
├── qubit.ts                — Single-qubit state creation [alpha, beta]
├── gates.ts                — Elementary unitary matrices (X, Y, Z, H, S, T)
├── measurement.ts          — Born rule probabilities & collapse sampling
├── multiQubit.ts           — Kronecker tensor products, CNOT, SWAP operators
├── circuit.ts              — Circuit timeline AST and state propagation
└── index.ts                — Unified public API export
```

### 2.2 State Management (`src/store/`)
Translates user interactions into engine calls and exposes immutable state:

```
src/store/
├── quantumStore.ts         — Global Zustand store combining all slices
├── gateVisualizerSlice.ts  — Page 2 single-qubit state & gate history
├── expoLabSlice.ts         — Page 3 guided experiment state & shot records
├── entanglementSlice.ts    — Page 4 two-qubit Bell pair state & correlations
├── circuitSlice.ts         — Page 5 circuit grid, gate placement & results
└── index.ts                — Unified store export
```

### 2.3 UI & Presentation Layer (`src/components/`, `src/pages/`)
Implements human-designed, scientific UI components using the QYNX design tokens:

```
src/pages/
├── QuantumUniverse.tsx     — Page 1: Educational concept hub
├── GateVisualizer.tsx      — Page 2: Single-qubit & 3D Bloch sphere
├── QuantumExpoLab.tsx      — Page 3: Structured guided laboratory
├── EntanglementSim.tsx     — Page 4: Two-qubit entanglement simulator
└── CircuitBuilder.tsx      — Page 5: Visual circuit builder

src/components/
├── shared/                 — Shared UI primitives (QYNX design system)
│   ├── Navigation.tsx      — Global header with 01–05 module links
│   ├── DiracNotation.tsx   — High-contrast Dirac ket notation
│   ├── ProbabilityBar.tsx  — High-contrast probability indicator
│   ├── GateButton.tsx      — Interactive gate token button
│   └── RestrainedCard.tsx  — Human-designed panel container
├── bloch/
│   └── BlochSphere.tsx     — React container for WebGL canvas
├── circuit/
│   ├── CircuitGrid.tsx     — Desktop grid & touch/tap wire matrix
│   ├── CircuitWire.tsx     — Accessible quantum register wire
│   └── GateToken.tsx       — Movable/placeable unitary gate token
└── lab/
    ├── ExperimentCard.tsx  — Laboratory protocol card
    └── ShotDistribution.tsx— Statistical outcome histogram
```

### 2.4 Visualization Layer (`src/visualization/`)
High-performance rendering modules that passively reflect quantum states:

```
src/visualization/
├── bloch/
│   ├── BlochScene.ts       — Three.js scene, lighting, camera controls
│   ├── BlochGeometry.ts    — Sphere wireframe, axes (X, Y, Z), equator
│   ├── StateVectorMesh.ts  — 3D arrow representing state vector
│   └── TrajectoryAnimator.ts— Geodesic SLERP state-to-state interpolation
├── charts/
│   └── DistributionChart.ts— High-contrast canvas outcome distribution
└── diagrams/
    └── SvgCircuitRenderer.ts— High-contrast SVG circuit line renderer
```

---

## 3. Strict Dependency Rules

```
UI Layer          ───▶  State Management (reads state, dispatches actions)
State Management  ───▶  Quantum Engine (computes transformations)
Visualization     ───▶  State Management (reads state only)
Quantum Engine    ───▶  [ZERO IMPORTS] (completely self-contained)
```

**Forbidden Patterns**:
- UI components importing math functions directly to compute states.
- The quantum engine referencing React, Zustand, DOM elements, or Three.js.
- Visualization components mutating the quantum store directly.

---

## 4. End-to-End Data Flows

### 4.1 Gate Application Flow (Page 2 — QUANTUM GATE VISUALIZER)
```
[User Clicks Gate 'H']
          │
          ▼
GateVisualizer.tsx dispatches: store.applyGate('H')
          │
          ▼
gateVisualizerSlice:
  1. Reads currentState: [1+0i, 0+0i] (|0⟩)
  2. Calls engine: applyUnitary(currentState, H_MATRIX)
  3. Receives newState: [1/√2+0i, 1/√2+0i] (|+⟩)
  4. Computes Bloch angles: θ = π/2, φ = 0
  5. Updates store: { currentState: newState, blochAngles: { theta, phi }, history: [...] }
          │
          ▼
React components re-render:
  - DiracNotation updates to: |+⟩ = 0.707|0⟩ + 0.707|1⟩
  - ProbabilityBar animates: P(|0⟩)=50%, P(|1⟩)=50%
          │
          ▼
TrajectoryAnimator.ts:
  - Interpolates state vector from (0, 0, 1) to (1, 0, 0) over 600ms via geodesic arc
```

### 4.2 Circuit Execution Flow (Page 5 — QUANTUM CIRCUIT BUILDER)
```
[User Clicks 'RUN CIRCUIT']
          │
          ▼
CircuitBuilder.tsx dispatches: store.executeCircuit()
          │
          ▼
circuitSlice:
  1. Serializes circuit AST: { qubits: 2, columns: [...] }
  2. Invokes engine.executeCircuitAST(circuitAST)
          │
          ▼
circuit.ts (Engine):
  1. Initializes state vector for n qubits: |00...0⟩ (length 2^n)
  2. Iterates columns left-to-right
  3. Applies Kronecker product expansions for single-qubit gates and CNOT/SWAP operators
  4. Computes theoretical probabilities: P(i) = |amplitude_i|²
  5. Simulates N measurement shots using cumulative distribution sampling
          │
          ▼
Store receives: { finalStateVector, probabilities, shotCounts }
          │
          ▼
DistributionChart renders high-contrast histogram in QYNX Purple scale
```

---

## 5. Routing Architecture

QYNX uses client-side routing with clean URL endpoints and route-level code splitting:

| Path | Module | Code Splitting Chunk |
|:---|:---|:---|
| `/` | Page 1: QUANTUM UNIVERSE | `quantum-universe.chunk.js` |
| `/gate-visualizer` | Page 2: QUANTUM GATE VISUALIZER | `gate-visualizer.chunk.js` (lazy-loads Three.js) |
| `/expo-lab` | Page 3: QUANTUM EXPO LAB | `expo-lab.chunk.js` |
| `/entanglement` | Page 4: QUANTUM ENTANGLEMENT SIMULATOR | `entanglement.chunk.js` |
| `/circuit-builder` | Page 5: QUANTUM CIRCUIT BUILDER | `circuit-builder.chunk.js` |

Route transitions execute a fast, accessible 200ms cross-fade using standard CSS transitions.

---

## 6. Error Boundary & Fallback System

Every module is isolated within a React `ErrorBoundary`. In the event of a WebGL context crash or rendering exception:
- The canvas gracefully degrades to a 2D high-contrast fallback diagram.
- A concise error card provides clear recovery options ("Reset 3D Canvas", "Reload Module").
- The global application shell, navigation, and other pages remain completely functional.
