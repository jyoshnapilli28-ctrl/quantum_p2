# QUANTUM STATE MANAGEMENT — SPECIFICATION — QYNX

---

## 1. Architectural Purpose & Data Flow

State management in **QYNX** provides a reactive, predictable, unidirectional bridge between user interactions, the shared quantum engine, and the visualization layer.

**Technology**: Zustand v4 with TypeScript strict mode.

### Strict Unidirectional Flow:
$$\text{User Action} \longrightarrow \text{Zustand Dispatch} \longrightarrow \text{Shared Engine Calculation} \longrightarrow \text{Immutable Store Update} \longrightarrow \text{Reactive Component Render}$$

### Fundamental Rules:
1. **Immutable State**: State is never mutated in place; actions always construct new state objects.
2. **Mathematical Decoupling**: Components never perform quantum calculations; they invoke store actions that consult the pure mathematical engine.
3. **Session Lifetime**: State is held in-memory and preserved across route transitions within the session, but is not persisted across hard page refreshes.

---

## 2. Root Store Architecture

```typescript
// src/store/index.ts

export interface QynxStore {
  gateVisualizer: GateVisualizerState;
  expoLab: ExpoLabState;
  entanglement: EntanglementState;
  circuit: CircuitState;
  ui: UIState;
}
```

---

## 3. Slice Specifications

### 3.1 Gate Visualizer Slice (`src/store/gateVisualizerSlice.ts`)
Controls Page 2 (`QUANTUM GATE VISUALIZER`):
- `currentState: StateVector1Q`: Current single-qubit vector $[\alpha, \beta]^T$.
- `previousState: StateVector1Q | null`: Prior state for geodesic trajectory interpolation.
- `probabilities: { p0: number; p1: number }`: Real-time Born rule probabilities.
- `blochCoordinates: BlochCoordinates`: Derived spherical/Cartesian coordinates $(x, y, z)$.
- `stateLabel: string`: Dirac notation string ($|0\rangle, |+\rangle, \text{etc.}$).
- `gateHistory: GateHistoryEntry[]`: Chronological record of applied gates with timestamps.
- `isMeasured: boolean`: Flag indicating projective wave-function collapse.
- `isAnimating: boolean`: Active state lock during 3D vector transitions.

### 3.2 Expo Lab Slice (`src/store/expoLabSlice.ts`)
Controls Page 3 (`QUANTUM EXPO LAB`):
- `activeExperimentId: string`: Identifier for active experiment (e.g. `'superposition'`, `'bit-flip'`).
- `currentStepIndex: number`: Progress marker in guided laboratory protocol.
- `labState: StateVector1Q`: Current quantum state under test.
- `shotCount: number`: Configured measurement shots ($1 \le N \le 10,000$).
- `statisticalResults: Record<string, number>`: Empirical histogram tallies.
- `status: 'ready' | 'running' | 'completed'`: Step sequencer status.

### 3.3 Entanglement Slice (`src/store/entanglementSlice.ts`)
Controls Page 4 (`QUANTUM ENTANGLEMENT SIMULATOR`):
- `twoQubitState: StateVector2Q`: Four-element complex state vector $[c_{00}, c_{01}, c_{10}, c_{11}]^T$.
- `isEntangled: boolean`: Result of Schmidt rank determinant evaluation.
- `measurementOutcome: '00' | '11' | null`: Correlated outcome of simultaneous projective measurement.
- `correlationDistribution: Record<'00'|'01'|'10'|'11', number>`: Statistical sampling counts.

### 3.4 Circuit Slice (`src/store/circuitSlice.ts`)
Controls Page 5 (`QUANTUM CIRCUIT BUILDER`):
- `circuit: CircuitDefinition`: Register wire count (1–4) and column gate placement AST.
- `selectedToolGate: GateId | null`: Active gate selected for placement.
- `simulationStatus: 'idle' | 'simulating' | 'completed' | 'error'`: Execution lifecycle.
- `resultDistribution: Record<string, number>`: Probability map across all $2^n$ basis states.

### 3.5 UI Slice (`src/store/uiState.ts`)
Controls application-wide presentation and navigation states:
- `activeModule: 'universe' | 'gate-visualizer' | 'expo-lab' | 'entanglement' | 'circuit-builder'`.
- `openingExperienceComplete: boolean`: Whether the brand intro has concluded.
- `mobileNavOpen: boolean`: Drawer state for mobile viewports.
- `reducedMotion: boolean`: Synchronized with `window.matchMedia('(prefers-reduced-motion: reduce)')`.

---

## 4. Reset & Isolation Contracts

| Trigger | Scope of Reset | Preserved Context |
|:---|:---|:---|
| "Reset Qubit" (Page 2) | Resets `currentState` to $|0\rangle$, clears history | Navigation & UI preferences |
| "Reset Lab" (Page 3) | Resets active experiment step to 0 and state to $|0\rangle$ | Historical completion badges |
| "Reset Entanglement" (Page 4) | Resets two-qubit state to $|00\rangle$ | Current shot count configuration |
| "Clear Circuit" (Page 5) | Clears all gate tokens from circuit grid | Qubit wire register count |
| Route Navigation (01–05) | **Zero state reset**: User progress in each slice is fully preserved | All active workspace states |
| Browser Reload | Complete session reset to default initial state | None (session-only) |
