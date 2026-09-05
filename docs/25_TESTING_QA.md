# TESTING & QA — SPECIFICATION

---

## 1. Testing Philosophy

- **Engine tests are mandatory.** The quantum engine contains the mathematical logic that the entire application depends on. Every engine function must have unit tests before it is used in any page.
- **Tests must be deterministic.** Seed `Math.random` for measurement tests to produce reproducible results.
- **UI tests focus on interaction.** Test that UI actions trigger the correct state changes, not the visual output.
- **No test should import Three.js.** Bloch sphere tests are integration/visual tests only.

---

## 2. Testing Stack

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit test runner (replaces Jest, Vite-native) |
| **@testing-library/react** | React component interaction tests |
| **@testing-library/jest-dom** | DOM assertion matchers |
| **@testing-library/user-event** | Simulated user interactions |

---

## 3. Quantum Engine Unit Tests

### 3.1 Test File Structure

```
src/engine/__tests__/
├── complex.test.ts
├── matrix.test.ts
├── vector.test.ts
├── qubit.test.ts
├── gates.test.ts
├── measurement.test.ts
├── multiQubit.test.ts
└── circuit.test.ts
```

### 3.2 Complex Number Tests (`complex.test.ts`)

```
add({ re:1, im:2 }, { re:3, im:4 }) → { re:4, im:6 }
multiply({ re:1, im:1 }, { re:1, im:1 }) → { re:0, im:2 } (i² = -1)
conjugate({ re:3, im:-2 }) → { re:3, im:2 }
magnitude({ re:3, im:4 }) → 5
magnitudeSquared({ re:3, im:4 }) → 25
multiply(I, I) → { re:-1, im:0 }  (i² = -1)
```

### 3.3 Gate Application Tests (`gates.test.ts`)

All tests must pass with tolerance ε = 1e-10 for floating-point comparison.

```
applyGate([{re:1,im:0},{re:0,im:0}], 'X') 
  → [{re:0,im:0},{re:1,im:0}]   (|0⟩ → |1⟩)

applyGate([{re:0,im:0},{re:1,im:0}], 'X')
  → [{re:1,im:0},{re:0,im:0}]   (|1⟩ → |0⟩)

applyGate([{re:1,im:0},{re:0,im:0}], 'H')
  → [{re:INV_SQRT2,im:0},{re:INV_SQRT2,im:0}]   (|0⟩ → |+⟩)

applyGate([{re:INV_SQRT2,im:0},{re:INV_SQRT2,im:0}], 'H')
  → [{re:1,im:0},{re:0,im:0}]   (|+⟩ → |0⟩, H is self-inverse)

applyGate([{re:1,im:0},{re:0,im:0}], 'Z')
  → [{re:1,im:0},{re:0,im:0}]   (Z|0⟩ = |0⟩, phase is global)

applyGate([{re:0,im:0},{re:1,im:0}], 'Z')
  → [{re:0,im:0},{re:-1,im:0}]  (Z|1⟩ = -|1⟩)

applyGate([{re:1,im:0},{re:0,im:0}], 'S')
  → [{re:1,im:0},{re:0,im:0}]   (S|0⟩ = |0⟩)

applyGate([{re:0,im:0},{re:1,im:0}], 'S')
  → [{re:0,im:0},{re:0,im:1}]   (S|1⟩ = i|1⟩)

applyGate([|0⟩], 'Y') → [|0⟩ × 0, |1⟩ × i]  (Y|0⟩ = i|1⟩)
applyGate([|1⟩], 'Y') → [|0⟩ × (-i)]          (Y|1⟩ = -i|0⟩)

// Self-inverse tests
applyGate(applyGate(state, 'X'), 'X') ≈ state   (X² = I)
applyGate(applyGate(state, 'H'), 'H') ≈ state   (H² = I)
applyGate(applyGate(state, 'Z'), 'Z') ≈ state   (Z² = I)

// Normalization after gate
let result = applyGate(anyState, 'H')
|result[0]|² + |result[1]|² ≈ 1   (always normalized)
```

### 3.4 Probability Tests (`measurement.test.ts`)

```
getProbabilities1Q([{re:1,im:0},{re:0,im:0}]) → { p0:1, p1:0 }
getProbabilities1Q([{re:0,im:0},{re:1,im:0}]) → { p0:0, p1:1 }
getProbabilities1Q([{re:INV_SQRT2,im:0},{re:INV_SQRT2,im:0}]) → { p0:0.5, p1:0.5 }
getProbabilities1Q(state).p0 + getProbabilities1Q(state).p1 ≈ 1  (always sums to 1)
```

### 3.5 Measurement Distribution Test

```
// Seed Math.random for deterministic test
// OR use a statistical test with many shots:

const state = applyGate(createZeroState(), 'H')  // |+⟩
const results = measureMultiShot(state, 10000)

// Statistical test: within 3% of expected
expect(results['0'] / 10000).toBeCloseTo(0.5, 1)  // ±0.5% tolerance
expect(results['1'] / 10000).toBeCloseTo(0.5, 1)
```

### 3.6 Bloch Coordinates Tests

```
getBlochCoordinates(|0⟩) → { x:0, y:0, z:1 }
getBlochCoordinates(|1⟩) → { x:0, y:0, z:-1 }
getBlochCoordinates(|+⟩) → { x:1, y:0, z:0 }
getBlochCoordinates(|-⟩) → { x:-1, y:0, z:0 }
getBlochCoordinates(|i⟩) → { x:0, y:1, z:0 }

// Unit sphere check
let coords = getBlochCoordinates(anyNormalizedState)
x² + y² + z² ≈ 1   (within ε=1e-6)
```

### 3.7 Multi-Qubit Tests

```
tensorProduct(|0⟩, |0⟩) → [1, 0, 0, 0]   (|00⟩)
tensorProduct(|1⟩, |0⟩) → [0, 0, 1, 0]   (|10⟩)

applyCNOT([0,0,1,0] as StateVector2Q, 0, 1)
  → [0,0,0,1]  (|10⟩ → |11⟩)

applyCNOT([1,0,0,0] as StateVector2Q, 0, 1)
  → [1,0,0,0]  (|00⟩ → |00⟩, control=0 so no flip)

// Bell state creation
let twoQ = createTwoQubitZeroState()              // |00⟩
twoQ = applyGateToQubit(twoQ, 'H', 0)             // (|00⟩+|10⟩)/√2
twoQ = applyCNOT(twoQ, 0, 1)                      // (|00⟩+|11⟩)/√2
let probs = getProbabilities2Q(twoQ)
probs.p00 ≈ 0.5
probs.p11 ≈ 0.5
probs.p01 ≈ 0
probs.p10 ≈ 0

isEntangled(twoQ) → true
isEntangled(createTwoQubitZeroState()) → false
```

### 3.8 Circuit Execution Tests

```
// Bell state circuit
const circuit = {
  qubits: 2,
  gates: [
    { id: '1', type: 'H', wire: 0, column: 0 },
    { id: '2', type: 'CNOT', wire: [0, 1], column: 1 }
  ],
  shots: 1000
}
const result = executeCircuit(circuit)
result.probabilities['00'] ≈ 0.5
result.probabilities['11'] ≈ 0.5
result.probabilities['01'] ≈ 0
result.probabilities['10'] ≈ 0
result.error === undefined

// Empty circuit
const emptyCircuit = { qubits: 2, gates: [] }
const emptyResult = executeCircuit(emptyCircuit)
emptyResult.probabilities['00'] ≈ 1.0  (stays in |00⟩)

// Invalid circuit: CNOT same wire
const invalidCircuit = {
  qubits: 2,
  gates: [{ id: '1', type: 'CNOT', wire: [0, 0], column: 0 }]
}
const invalidResult = executeCircuit(invalidCircuit)
invalidResult.error !== undefined
```

---

## 4. Component Tests

### 4.1 Gate Button

```
Test: renders with correct label
Test: calls applyGate with correct gateId on click
Test: shows as disabled when isMeasured=true
Test: does not call applyGate when disabled
Test: shows tooltip on hover (check tooltip content)
Test: keyboard (Enter key) triggers same as click
```

### 4.2 Probability Bar

```
Test: renders label, bar, and percentage correctly
Test: percentage matches probability * 100
Test: bar width style = probability * 100 + '%'
Test: handles probability=0 (0.0% displayed)
Test: handles probability=1 (100.0% displayed)
```

### 4.3 Measure Button

```
Test: calls store.measure() on click
Test: shows as disabled after measurement
Test: is re-enabled after reset
```

### 4.4 Reset Button (each page)

```
Test: calls reset() action on click
Test: store state returns to initial values after reset
```

### 4.5 Circuit Grid (Page 5)

```
Test: gate appears in correct cell after placement
Test: gate is removed on × click
Test: validation error appears for invalid CNOT placement
Test: Run Circuit button is disabled when circuit has errors
Test: results appear after successful circuit execution
```

---

## 5. Integration Tests

### 5.1 Gate Visualizer Flow

```
1. Load GateVisualizer page
2. Assert initial state: |0⟩, p0=100%, p1=0%
3. Click H gate button
4. Assert: state updates to |+⟩, p0=50%, p1=50%
5. Click X gate button
6. Assert: state updates to |-⟩, p0=50%, p1=50%
7. Click Measure button
8. Assert: state is either |0⟩ or |1⟩ (collapsed)
9. Assert: gate buttons disabled
10. Click Reset
11. Assert: state is |0⟩, gate buttons enabled
```

### 5.2 Experiment Lab Flow

```
1. Load ExperimentLab page
2. Select "Superposition" experiment
3. Assert: initial state |0⟩ displayed
4. Click "Run Next Step"
5. Assert: H gate applied, state = |+⟩
6. Click "Run Next Step"
7. Assert: measurement result shown
8. Assert: result is either |0⟩ or |1⟩
9. Click Reset
10. Assert: back to step 1, initial state |0⟩
```

---

## 6. Manual QA Checklist

Run before every release:

### Navigation
- [ ] All 5 pages accessible from navigation bar
- [ ] Active page indicated correctly in nav
- [ ] Mobile hamburger menu opens/closes
- [ ] All nav links navigate correctly
- [ ] Page transitions animate (fade in/out)

### Gate Visualizer
- [ ] Bloch sphere renders (3D, not flat)
- [ ] All 6 gate buttons apply correct transformations
- [ ] Bloch sphere vector moves when gate applied
- [ ] Probability bars update correctly
- [ ] State label updates correctly
- [ ] Measurement collapses state
- [ ] Gate buttons disabled after measurement
- [ ] Reset restores |0⟩
- [ ] Gate history shows correct sequence
- [ ] Camera rotation works (drag)
- [ ] Tooltips appear on hover

### Experiment Lab
- [ ] All 5 experiments selectable
- [ ] Step progress indicator works
- [ ] Run Next Step executes correctly
- [ ] Run All executes all steps with delay
- [ ] Multi-shot measurement shows histogram
- [ ] Shot count stepper works (1, 10, 100, 1000)
- [ ] Reset clears step and state

### Entanglement Simulator
- [ ] H on Qubit A updates state correctly
- [ ] CNOT creates Bell state
- [ ] Entanglement indicator appears after CNOT
- [ ] Visual arc connects qubits when entangled
- [ ] Measurement shows only |00⟩ or |11⟩ (never |01⟩ or |10⟩)
- [ ] Reset clears all state

### Circuit Builder
- [ ] Drag-and-drop gate placement (desktop)
- [ ] Tap-to-place (mobile)
- [ ] Gate removal (× button)
- [ ] CNOT placed correctly (control + target)
- [ ] Invalid CNOT shows error
- [ ] Run Circuit executes
- [ ] Results histogram shows
- [ ] Clear removes all gates
- [ ] Undo (Ctrl+Z) removes last gate

### Accessibility
- [ ] Full keyboard navigation through all pages
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader announces state changes (test with NVDA or VoiceOver)
- [ ] Reduced motion: all animations simplified/removed
- [ ] 200% zoom: no content overflow

### Performance
- [ ] Lighthouse score ≥ 90 (performance) on desktop
- [ ] Lighthouse score ≥ 90 (performance) on mobile simulation
- [ ] No jank during Bloch sphere animation

### Responsive
- [ ] Mobile S (375px): all content visible and usable
- [ ] Tablet (768px): layout correct
- [ ] Desktop (1440px): maximum layout correct

---

## 7. Running Tests

```bash
# Run all unit tests
npm run test

# Run tests in watch mode (during development)
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Build and run Lighthouse audit
npm run build
npm run preview
npx lighthouse http://localhost:4173 --output html --output-path ./lighthouse-report.html
```

Coverage targets (for quantum engine modules):
- `src/engine/`: > 90% line coverage
- `src/store/`: > 70% line coverage
- `src/components/shared/`: > 60% line coverage
