# PROJECT ARCHITECTURE — QUANTUM UNIVERSE

---

## 1. Architecture Philosophy

The Quantum Universe application follows a strict **layered architecture** where:
- The **UI layer** handles rendering and user interaction.
- The **Page Controller layer** coordinates per-page logic.
- The **Quantum Engine** performs all mathematical computation.
- The **State Management layer** holds application state and triggers reactive updates.
- The **Visualization layer** reads state and renders visual output.

No layer may bypass a lower layer to access a higher one. UI components do not perform quantum math. The quantum engine does not import UI libraries.

---

## 2. Top-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      QUANTUM UNIVERSE APP                       │
│                                                                 │
│  ┌──────────┐ ┌──────────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Page 1   │ │   Page 2     │ │  Page 3  │ │   Page 4     │  │
│  │ Universe │ │ Gate Visual. │ │ Exp. Lab │ │ Entanglement │  │
│  └──────────┘ └──────────────┘ └──────────┘ └──────────────┘  │
│                                                                 │
│                      ┌──────────┐                              │
│                      │  Page 5  │                              │
│                      │ Circuit  │                              │
│                      │ Builder  │                              │
│                      └──────────┘                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    STATE MANAGEMENT                     │   │
│  │              (Zustand global store)                     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    QUANTUM ENGINE                       │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │   │   Gates  │  │Measurement│  │ Circuits │            │   │
│  │   └──────────┘  └──────────┘  └──────────┘            │   │
│  │   ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │   │  Single  │  │ Multi    │  │ Matrix   │            │   │
│  │   │  Qubit   │  │ Qubit    │  │  Math    │            │   │
│  │   └──────────┘  └──────────┘  └──────────┘            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                  VISUALIZATION LAYER                    │   │
│  │   ┌────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │   │Bloch Sphere│  │ Probability  │  │   Circuit    │  │   │
│  │   │ (Three.js) │  │    Bars      │  │   Diagram    │  │   │
│  │   └────────────┘  └──────────────┘  └──────────────┘  │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Module Boundaries

### 3.1 Quantum Engine (`src/engine/`)

**Exports only pure functions and data structures.** No side effects. No UI imports.

```
src/engine/
├── math/
│   ├── complex.ts          — Complex number operations
│   ├── matrix.ts           — 2x2 and 4x4 matrix multiply
│   └── vector.ts           — State vector normalization, inner product
├── qubit.ts                — Single-qubit state creation and operations
├── gates.ts                — Gate matrix definitions and application
├── measurement.ts          — Probability calculation, random measurement
├── multiQubit.ts           — Tensor products, two-qubit gates
├── circuit.ts              — Circuit data structure and executor
└── index.ts                — Public API barrel export
```

**Permitted imports in this module:** None (zero external dependencies).

### 3.2 State Management (`src/store/`)

Consumes the quantum engine and exposes reactive state to UI components.

```
src/store/
├── quantumStore.ts         — Main Zustand store
├── gateVisualizerSlice.ts  — State slice for Page 2
├── experimentSlice.ts      — State slice for Page 3
├── entanglementSlice.ts    — State slice for Page 4
├── circuitSlice.ts         — State slice for Page 5
└── index.ts                — Unified store export
```

**Permitted imports:** Quantum engine modules only. No React component imports.

### 3.3 UI Layer (`src/components/`, `src/pages/`)

Contains React components. Components read from the store and dispatch actions.

```
src/pages/
├── QuantumUniverse.tsx     — Page 1
├── GateVisualizer.tsx      — Page 2
├── ExperimentLab.tsx       — Page 3
├── EntanglementSim.tsx     — Page 4
└── CircuitBuilder.tsx      — Page 5

src/components/
├── shared/                 — Shared across all pages
│   ├── Navigation.tsx
│   ├── DiracNotation.tsx   — Renders |ψ⟩ notation
│   ├── ProbabilityBar.tsx
│   ├── GateButton.tsx
│   └── QuantumPanel.tsx    — Glass panel wrapper
├── bloch/
│   └── BlochSphere.tsx     — Three.js Bloch sphere container
├── circuit/
│   ├── CircuitGrid.tsx
│   ├── CircuitWire.tsx
│   └── GateToken.tsx
└── experiment/
    ├── ExperimentCard.tsx
    └── StepDisplay.tsx
```

### 3.4 Visualization Layer (`src/visualization/`)

Three.js scenes, canvas-based renderers, SVG diagrams. Reads state; does not write state.

```
src/visualization/
├── bloch/
│   ├── BlochScene.ts       — Three.js scene setup
│   ├── BlochSphere3D.ts    — Sphere mesh, axes, labels
│   ├── StateVector.ts      — Arrow/vector mesh
│   └── BlochAnimator.ts    — State transition animations
├── probability/
│   └── ProbabilityChart.ts — Canvas-based bar chart
├── particles/
│   └── QuantumParticles.ts — Background particle system
└── circuit/
    └── CircuitDiagram.ts   — SVG circuit renderer
```

---

## 4. Data Flow

### 4.1 Gate Application Flow (Page 2 — Gate Visualizer)

```
USER clicks gate button [H]
          │
          ▼
GateVisualizer.tsx dispatches action:
  store.applyGate('H')
          │
          ▼
gateVisualizerSlice.ts handles action:
  1. Reads current state vector from store
  2. Calls: engine.applyGate(currentState, 'H')
  3. engine returns: new state vector
  4. Store updates: currentState, stateHistory, selectedGate
          │
          ▼
React components re-render (subscribed to store):
  - DiracNotation updates label
  - ProbabilityBar updates values
  - BlochSphere receives new state via props
          │
          ▼
BlochAnimator.ts interpolates:
  old state vector position → new state vector position
  (SLERP interpolation over 600ms)
          │
          ▼
Animation complete:
  State labels and probability values settle
  Gate history panel prepends new entry
```

### 4.2 Circuit Execution Flow (Page 5 — Circuit Builder)

```
USER presses [RUN CIRCUIT]
          │
          ▼
CircuitBuilder.tsx reads circuit from store:
  { qubits: 2, gates: [{ wire: 0, col: 0, type: 'H' }, { wire: [0,1], col: 1, type: 'CNOT' }] }
          │
          ▼
circuitSlice.ts calls:
  engine.executeCircuit(circuitDefinition)
          │
          ▼
circuit.ts (engine):
  1. Initialize state vector for N qubits: |00...0⟩
  2. Sort gates by column (left-to-right)
  3. For each gate, apply the corresponding matrix operation
  4. After all gates applied, measure to get result probabilities
          │
          ▼
Return value: { stateVector, probabilities, measurementResults }
          │
          ▼
circuitSlice.ts updates store:
  lastResult, executionState = 'complete'
          │
          ▼
ResultHistogram component re-renders with new probability data
```

### 4.3 Measurement Flow

```
Measurement triggered (button click or experiment step)
          │
          ▼
measurement.ts (engine):
  1. Calculate probability for each basis state from state vector
  2. Generate random number [0, 1)
  3. Walk cumulative probability distribution
  4. Return measured basis state (e.g., '0', '1', '00', '11')
          │
          ▼
Store receives measured outcome
          │
          ▼
UI displays:
  - Collapsed state label
  - Measurement result indicator
  - Probability bars freeze at 0% or 100%
  - (Multi-shot: aggregate counts displayed in histogram)
```

---

## 5. Shared Components

These components are used by **multiple pages** and must be built as shared, reusable, stateless presentational components:

| Component | Used By Pages | Description |
|-----------|--------------|-------------|
| `DiracNotation` | 1, 2, 3, 4, 5 | Renders quantum state in ket notation |
| `ProbabilityBar` | 2, 3, 4, 5 | Animated probability bar with label and percentage |
| `GateButton` | 2, 3, 5 | Clickable gate with label, tooltip, and active state |
| `QuantumPanel` | All | Glass-effect card container |
| `CircuitDiagram` | 4, 5 | SVG circuit line drawing |
| `MeasurementResult` | 2, 3, 4, 5 | Displays single measurement outcome |

---

## 6. Routing

Use React Router v6 with `createBrowserRouter`.

```
/                      → Page 1: Quantum Universe
/gate-visualizer       → Page 2: Gate Visualizer
/experiment-lab        → Page 3: Experiment Lab
/entanglement          → Page 4: Entanglement Simulator
/circuit-builder       → Page 5: Circuit Builder
```

Route transitions use a fade animation (opacity 0 → 1, 300ms).

Each route is **lazy-loaded**. Heavy visualization libraries (Three.js) are only imported when their route is activated.

---

## 7. State Isolation Between Pages

Each page has its own state slice. Navigating away from a page does **not** automatically reset its state — the user's work is preserved within the session.

An explicit **Reset** button on each interactive page resets that page's state slice to initial values.

The quantum engine is **stateless** — all state is held in the Zustand store. The engine only computes and returns new values; it never stores anything.

---

## 8. Error Boundaries

Wrap each page-level component in a React `ErrorBoundary`. If the visualization layer throws (e.g., WebGL context lost), the error boundary renders a fallback panel with a "Reload visualization" button, without crashing the entire app.

---

## 9. Module Dependency Rules (Enforced)

```
UI Components      → Store (read/write) + Visualization
Store              → Quantum Engine (calls only)
Visualization      → Store (read only)
Quantum Engine     → Nothing (zero imports)
```

Violations of these rules break the architectural guarantee. Do not import engine functions directly into React components — always go through the store.

---

## 10. File Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| React components | PascalCase `.tsx` | `BlochSphere.tsx` |
| Engine modules | camelCase `.ts` | `measurement.ts` |
| Store slices | camelCase `.ts` | `gateVisualizerSlice.ts` |
| Visualization classes | PascalCase `.ts` | `BlochScene.ts` |
| CSS modules | camelCase `.module.css` | `blochSphere.module.css` |
| Constants | UPPER_SNAKE_CASE | `GATE_MATRICES` |

---

## 11. Inter-Page Communication

Pages do **not** communicate directly with each other. All cross-page communication happens through the global Zustand store.

Example: If the user completes a Bell-state experiment on Page 3 and navigates to Page 4, Page 4 can read the last experiment result from the store if needed — but only through the store API.

There is no event bus or prop drilling across pages.
