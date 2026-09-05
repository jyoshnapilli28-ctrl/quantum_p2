# QUANTUM STATE MANAGEMENT — SPECIFICATION

---

## 1. Purpose

This document defines how quantum state is stored, structured, and updated throughout the application. The state management layer is the bridge between the quantum engine (math) and the UI (React components).

**Technology:** Zustand v4 with TypeScript.

**Rules:**
- State is **read** by UI components via Zustand hooks.
- State is **written** only by store actions (never directly from components).
- Store actions call the quantum engine and update state with the returned result.
- State is **never** mutated in place — always replaced with new objects (immutable updates).
- State does **not** persist across browser refreshes (session-only).

---

## 2. Global Store Structure

```typescript
// src/store/index.ts

interface QuantumUniverseStore {
  gateVisualizer: GateVisualizerState;
  experiment: ExperimentState;
  entanglement: EntanglementState;
  circuit: CircuitState;
  ui: UIState;
}
```

Each slice is defined in its own file and composed into the root store.

---

## 3. Gate Visualizer State Slice

**File:** `src/store/gateVisualizerSlice.ts`

### 3.1 State Shape

```typescript
interface GateVisualizerState {
  // Current qubit state vector
  currentState: StateVector1Q;

  // State before the most recent gate (for animation interpolation)
  previousState: StateVector1Q | null;

  // Calculated probabilities (derived from currentState)
  probabilities: { p0: number; p1: number };

  // Bloch sphere coordinates (derived from currentState)
  blochCoordinates: { x: number; y: number; z: number };

  // Dirac notation label (derived from currentState)
  stateLabel: string;

  // Which gate button is highlighted as selected (not yet applied)
  highlightedGate: GateId | null;

  // History of applied gates (most recent first)
  gateHistory: GateHistoryEntry[];

  // Whether the qubit has been measured (collapsed state)
  isMeasured: boolean;

  // Last measurement outcome, if measured
  measurementOutcome: '0' | '1' | null;

  // Animation flag: true while Bloch sphere is animating
  isAnimating: boolean;
}

interface GateHistoryEntry {
  gate: GateId;
  stateBefore: StateVector1Q;
  stateAfter: StateVector1Q;
  timestamp: number;
}
```

### 3.2 Initial State

```typescript
const initialGateVisualizerState: GateVisualizerState = {
  currentState: engine.createZeroState(),       // |0⟩
  previousState: null,
  probabilities: { p0: 1, p1: 0 },
  blochCoordinates: { x: 0, y: 0, z: 1 },     // |0⟩ = north pole
  stateLabel: '|0⟩',
  highlightedGate: null,
  gateHistory: [],
  isMeasured: false,
  measurementOutcome: null,
  isAnimating: false,
};
```

### 3.3 Actions

```typescript
// Apply a gate to the current state
applyGate: (gate: GateId) => void
// Steps:
//   1. If isMeasured: show error toast, do nothing
//   2. Save currentState as previousState
//   3. Call engine.applyGate(currentState, gate)
//   4. If engine returns null: dispatch error, do nothing
//   5. Update: currentState, probabilities, blochCoordinates, stateLabel
//   6. Prepend to gateHistory
//   7. Set isAnimating = true (Bloch sphere will unset this when done)
//   8. Clear highlightedGate

// Measure the current qubit state
measure: () => void
// Steps:
//   1. If isMeasured: do nothing
//   2. Call engine.measureSingle(currentState)
//   3. Set measurementOutcome
//   4. Set currentState to collapsed state (|0⟩ or |1⟩)
//   5. Set isMeasured = true
//   6. Update probabilities and stateLabel

// Reset to initial state |0⟩
reset: () => void
// Resets all state to initialGateVisualizerState

// Highlight (select) a gate without applying it
setHighlightedGate: (gate: GateId | null) => void
// Only updates highlightedGate field

// Called by BlochSphere component when animation completes
setAnimationComplete: () => void
// Sets isAnimating = false
```

---

## 4. Experiment State Slice

**File:** `src/store/experimentSlice.ts`

### 4.1 State Shape

```typescript
interface ExperimentState {
  // List of available experiments
  availableExperiments: ExperimentDefinition[];

  // Currently selected experiment (null = none selected)
  activeExperiment: ExperimentDefinition | null;

  // Which step of the experiment is currently displayed (0-indexed)
  currentStepIndex: number;

  // Current qubit state during experiment execution
  experimentState: StateVector1Q | StateVector2Q | null;

  // Results of the last measurement
  measurementResult: MeasurementResult | null;

  // Multi-shot results (if experiment uses shot count > 1)
  multiShotResults: Record<string, number> | null;

  // Number of measurement shots for this experiment
  shotCount: number;

  // Execution state
  executionStatus: 'idle' | 'running' | 'complete' | 'error';

  // History of completed experiments
  experimentHistory: ExperimentHistoryEntry[];
}

interface MeasurementResult {
  outcome: string;          // '0', '1', '00', '11', etc.
  probabilities: Record<string, number>;
}

interface ExperimentHistoryEntry {
  experimentId: string;
  experimentTitle: string;
  gatesUsed: GateId[];
  initialState: string;     // Dirac notation label
  result: MeasurementResult | null;
  timestamp: number;
}
```

### 4.2 Actions

```typescript
selectExperiment: (experimentId: string) => void
// Find experiment in availableExperiments
// Set activeExperiment, reset currentStepIndex to 0
// Set experimentState to experiment's initialState
// Clear measurementResult

executeNextStep: () => void
// Advance to currentStepIndex + 1
// Execute the step's action (applyGate or measure)
// Update experimentState
// If step is 'measure': run measureSingle or measureMultiShot
// Update measurementResult or multiShotResults
// If no more steps: set executionStatus = 'complete', append to experimentHistory

runFullExperiment: () => void
// Executes all steps sequentially
// Each step runs after a 600ms delay (for animation timing)
// Cannot be interrupted once started

resetExperiment: () => void
// Reset to the initial state of the activeExperiment
// Clear measurementResult, set currentStepIndex = 0

setShotCount: (shots: number) => void
// Validate: 1 <= shots <= 10000
// Update shotCount

clearHistory: () => void
// Clear experimentHistory array
```

---

## 5. Entanglement State Slice

**File:** `src/store/entanglementSlice.ts`

### 5.1 State Shape

```typescript
interface EntanglementState {
  // Two-qubit state vector
  twoQubitState: StateVector2Q;

  // Individual qubit labels (before entanglement, track separately)
  qubitALabel: string;
  qubitBLabel: string;

  // Derived two-qubit state label
  stateLabel: string;

  // Probabilities for all four basis states
  probabilities: { p00: number; p01: number; p10: number; p11: number };

  // Whether the state is entangled
  isEntangled: boolean;

  // Measurement results (after measurement)
  measurementOutcome: '00' | '01' | '10' | '11' | null;

  // Multi-shot results
  multiShotResults: Record<string, number> | null;

  // Number of shots for measurement
  shotCount: number;

  // Whether measurement has been performed
  isMeasured: boolean;

  // Circuit steps applied so far
  appliedSteps: EntanglementStep[];
}

interface EntanglementStep {
  operation: 'H' | 'CNOT';
  appliedToQubit?: 0 | 1;
  description: string;
}
```

### 5.2 Actions

```typescript
applyHadamardToA: () => void
// Calls engine.applyGateToQubit(twoQubitState, 'H', 0)
// Updates twoQubitState, probabilities, stateLabel
// Appends to appliedSteps

applyCNOT: () => void
// Calls engine.applyCNOT(twoQubitState, 0, 1)
// Updates twoQubitState, probabilities, stateLabel
// Checks engine.isEntangled → updates isEntangled
// Appends to appliedSteps

measure: () => void
// Calls engine.measureTwoQubit(twoQubitState)
// Sets measurementOutcome, isMeasured

measureMultiShot: () => void
// Calls engine.measureMultiShot2Q(twoQubitState, shotCount)
// Sets multiShotResults

reset: () => void
// Resets to |00⟩ initial state

setShotCount: (shots: number) => void
```

---

## 6. Circuit State Slice

**File:** `src/store/circuitSlice.ts`

### 6.1 State Shape

```typescript
interface CircuitState {
  // Circuit definition (the user's current circuit)
  circuit: CircuitDefinition;

  // Currently selected gate in the gate panel
  selectedGate: GateId | null;

  // Execution state
  executionStatus: 'idle' | 'running' | 'complete' | 'error';

  // Last circuit result
  lastResult: CircuitResult | null;

  // Error message if execution fails
  errorMessage: string | null;

  // Number of measurement shots
  shotCount: number;

  // Validation errors (before execution)
  validationErrors: string[];
}
```

### 6.2 Actions

```typescript
addGate: (placement: Omit<GatePlacement, 'id'>) => void
// Assign UUID to id
// Append to circuit.gates
// Run validation, update validationErrors

removeGate: (gateId: string) => void
// Filter gate from circuit.gates
// Run validation

moveGate: (gateId: string, newWire: number, newColumn: number) => void
// Find gate, update wire and column
// Run validation

setSelectedGate: (gate: GateId | null) => void
setQubitCount: (count: number) => void  // 1–4; resets gates that exceed new count

runCircuit: () => void
// Validate circuit first (if invalid: set error, do nothing)
// Set executionStatus = 'running'
// Call engine.executeCircuit(circuit) with shotCount
// Set lastResult
// Set executionStatus = 'complete'

clearCircuit: () => void
// Reset circuit.gates to []
// Clear lastResult

validateCircuit: () => string[]
// Check CNOT/SWAP have two distinct valid wires
// Check no gate column conflicts that would cause ordering ambiguity
// Return array of error messages (empty if valid)
```

---

## 7. UI State Slice

**File:** `src/store/uiState.ts`

```typescript
interface UIState {
  // Which page is active (mirrors React Router current route)
  activePage: 'universe' | 'gate-visualizer' | 'experiment-lab' | 'entanglement' | 'circuit-builder';

  // Mobile nav open/closed
  mobileNavOpen: boolean;

  // Whether tooltips are currently enabled
  tooltipsEnabled: boolean;

  // Global notification/toast message
  notification: { message: string; type: 'info' | 'error' | 'success' } | null;
}
```

---

## 8. Derived State

Some state values are **derived** from others. These should be computed in store actions whenever the source changes, and stored alongside the source values for easy component consumption.

| Derived Value | Source | When Updated |
|--------------|--------|-------------|
| `probabilities` | `currentState` | After every `applyGate` or `measure` |
| `blochCoordinates` | `currentState` | After every `applyGate` |
| `stateLabel` | `currentState` | After every `applyGate` or `measure` |
| `isEntangled` | `twoQubitState` | After `applyHadamardToA` or `applyCNOT` |
| `validationErrors` | `circuit.gates` | After every circuit modification |

**Do not recompute** derived values in React components (e.g., do not call `getProbabilities()` inside a render function). Always read the pre-computed values from the store.

---

## 9. State Reset Behavior

| User Action | What Resets |
|------------|-------------|
| Click "Reset" on Gate Visualizer | `gateVisualizerSlice` only |
| Click "Reset" on Experiment Lab | `experimentSlice` active experiment state only (history preserved) |
| Click "Reset" on Entanglement Simulator | `entanglementSlice` only |
| Click "Clear Circuit" on Circuit Builder | `circuit.gates` and `lastResult` only |
| Navigate to a different page | Nothing resets (state preserved) |
| Browser refresh | Entire store resets (no persistence) |

---

## 10. React Component Integration Pattern

Components subscribe to the store using Zustand's `useStore` hook:

```typescript
// Example: probability bar component reading from gate visualizer slice
const { probabilities, stateLabel } = useQuantumStore(
  (state) => ({
    probabilities: state.gateVisualizer.probabilities,
    stateLabel: state.gateVisualizer.stateLabel,
  })
);
```

Components dispatch actions:
```typescript
const applyGate = useQuantumStore((state) => state.gateVisualizer.applyGate);
// In handler:
applyGate('H');
```

**Rule:** Components must use **selector functions** to subscribe to only the state they need. Never subscribe to the entire store in a component.
