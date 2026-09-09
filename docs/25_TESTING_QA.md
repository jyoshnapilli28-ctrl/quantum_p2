# QYNX — TESTING & QA SPECIFICATION

---

## 1. Testing Philosophy

The QYNX testing strategy is anchored in scientific rigor, mathematical determinism, and accessible, human-designed UI verification:

- **Mathematical Engine Tests Are Mandatory:** The core quantum engine (`src/engine/`) houses the mathematical foundation for state vectors, complex arithmetic, unitary matrix transformations, tensor products, and projective measurement. Every engine function must have 100% mathematical unit test coverage before UI integration.
- **Deterministic Simulation:** Tests must be strictly deterministic. Multi-shot measurement tests either mock or seed `Math.random` to produce reproducible results, or perform rigorous statistical tests over large sample sizes ($N \ge 10{,}000$) within established standard error bounds ($3\sigma$).
- **UI Tests Focus on User Flows and State Invariants:** UI component tests assert that user actions (gate clicks, drag-and-drop, mobile tap-to-place, step sequencing) produce exact state updates and trigger appropriate accessible announcements without visual breakage.
- **Diagram Legibility & Contrast Auditing:** Tests verify that all SVG diagrams, probability bars, Bloch sphere projections, and circuit grids comply with the **QYNX Diagram Visibility Standard** and WCAG AA contrast thresholds against the QYNX Purple Scale.
- **Zero Three.js Dependency in Engine Tests:** Quantum engine tests are completely isolated pure TypeScript functions. Three.js/R3F visual rendering tests are segregated into integration tests or manual visual QA checklists.

---

## 2. Testing Stack

| Tool | Purpose | Version / Notes |
|------|---------|-----------------|
| **Vitest** | Fast, Vite-native unit test runner | Replaces Jest; direct ESM and TypeScript support |
| **@testing-library/react** | React component interaction testing | User-centric DOM testing |
| **@testing-library/jest-dom** | Semantic DOM assertion matchers | `toBeInTheDocument()`, `toBeDisabled()`, etc. |
| **@testing-library/user-event** | Realistic browser event dispatch | Dispatches hover, click, drag, keyboard events |
| **axe-core / vitest-axe** | Automated accessibility auditing | Enforces WCAG 2.1 AA compliance across all views |

---

## 3. Quantum Engine Unit Tests

### 3.1 Test Directory Structure

```
src/engine/__tests__/
├── complex.test.ts          # Complex arithmetic, conjugate, magnitude, phase
├── matrix.test.ts           # 2x2, 4x4 matrix multiplication, Hermiticity, unitarity
├── vector.test.ts           # Inner product, normalization, tensor products
├── qubit.test.ts            # StateVector1Q initialization, Bloch coordinate mapping
├── gates.test.ts            # X, Y, Z, H, S, T, CNOT, SWAP unitary verification
├── measurement.test.ts      # Born rule probabilities, state collapse, multi-shot sampling
├── multiQubit.test.ts       # 2-qubit states, Bell state synthesis, entanglement detection
└── circuit.test.ts          # Multi-wire circuit execution, validation, step simulation
```

### 3.2 Complex Arithmetic Tests (`complex.test.ts`)

Floating-point equality tolerance $\varepsilon = 10^{-10}$.

```typescript
import { add, multiply, conjugate, magnitude, magnitudeSquared, phase, Complex } from '../math/complex'

describe('Complex Arithmetic', () => {
  const I: Complex = { re: 0, im: 1 }

  it('adds complex numbers correctly', () => {
    expect(add({ re: 1, im: 2 }, { re: 3, im: 4 })).toEqual({ re: 4, im: 6 })
  })

  it('multiplies complex numbers correctly', () => {
    // (1 + i)(1 + i) = 1 + 2i - 1 = 2i
    expect(multiply({ re: 1, im: 1 }, { re: 1, im: 1 })).toEqual({ re: 0, im: 2 })
    // i² = -1
    expect(multiply(I, I)).toEqual({ re: -1, im: 0 })
  })

  it('computes complex conjugate', () => {
    expect(conjugate({ re: 3, im: -2 })).toEqual({ re: 3, im: 2 })
    expect(conjugate({ re: 0, im: 1 })).toEqual({ re: 0, im: -1 })
  })

  it('computes magnitude and magnitude squared', () => {
    expect(magnitude({ re: 3, im: 4 })).toBeCloseTo(5, 10)
    expect(magnitudeSquared({ re: 3, im: 4 })).toBeCloseTo(25, 10)
  })

  it('computes phase angle', () => {
    expect(phase({ re: 1, im: 0 })).toBeCloseTo(0, 10)
    expect(phase({ re: 0, im: 1 })).toBeCloseTo(Math.PI / 2, 10)
    expect(phase({ re: -1, im: 0 })).toBeCloseTo(Math.PI, 10)
  })
})
```

### 3.3 Gate Application & Unitary Tests (`gates.test.ts`)

Tests verify all 8 standard QYNX gates: $X, Y, Z, H, S, T, \text{CNOT}, \text{SWAP}$.

```typescript
import { applyGate, GATES } from '../gates'
import { createZeroState } from '../qubit'

const INV_SQRT2 = 1 / Math.SQRT2

describe('Single Qubit Gates', () => {
  // Pauli-X (Bit flip)
  it('applies Pauli-X gate (|0⟩ -> |1⟩, |1⟩ -> |0⟩)', () => {
    const s0 = createZeroState() // [1, 0]
    const s1 = applyGate(s0, 'X')
    expect(s1[0].re).toBeCloseTo(0, 10)
    expect(s1[1].re).toBeCloseTo(1, 10)

    const s0Returned = applyGate(s1, 'X')
    expect(s0Returned[0].re).toBeCloseTo(1, 10)
    expect(s0Returned[1].re).toBeCloseTo(0, 10)
  })

  // Pauli-Y (Bit + phase flip)
  it('applies Pauli-Y gate (Y|0⟩ = i|1⟩, Y|1⟩ = -i|0⟩)', () => {
    const s0 = createZeroState()
    const s1 = applyGate(s0, 'Y')
    expect(s1[0].re).toBeCloseTo(0, 10)
    expect(s1[0].im).toBeCloseTo(0, 10)
    expect(s1[1].re).toBeCloseTo(0, 10)
    expect(s1[1].im).toBeCloseTo(1, 10) // i|1⟩

    const s2 = applyGate(s1, 'Y')
    // Y(i|1⟩) = i(-i|0⟩) = |0⟩
    expect(s2[0].re).toBeCloseTo(1, 10)
    expect(s2[0].im).toBeCloseTo(0, 10)
  })

  // Pauli-Z (Phase flip)
  it('applies Pauli-Z gate (Z|0⟩ = |0⟩, Z|1⟩ = -|1⟩)', () => {
    const s0 = createZeroState()
    const sZ0 = applyGate(s0, 'Z')
    expect(sZ0[0].re).toBeCloseTo(1, 10)
    expect(sZ0[1].re).toBeCloseTo(0, 10)

    const s1 = applyGate(s0, 'X')
    const sZ1 = applyGate(s1, 'Z')
    expect(sZ1[0].re).toBeCloseTo(0, 10)
    expect(sZ1[1].re).toBeCloseTo(-1, 10) // -|1⟩
  })

  // Hadamard
  it('applies Hadamard gate (|0⟩ -> |+⟩, |+⟩ -> |0⟩)', () => {
    const s0 = createZeroState()
    const sPlus = applyGate(s0, 'H')
    expect(sPlus[0].re).toBeCloseTo(INV_SQRT2, 10)
    expect(sPlus[1].re).toBeCloseTo(INV_SQRT2, 10)

    const sBack = applyGate(sPlus, 'H')
    expect(sBack[0].re).toBeCloseTo(1, 10)
    expect(sBack[1].re).toBeCloseTo(0, 10)
  })

  // Phase Gate S
  it('applies S gate (S|0⟩ = |0⟩, S|1⟩ = i|1⟩, S² = Z)', () => {
    const s1 = applyGate(createZeroState(), 'X')
    const sPhase = applyGate(s1, 'S')
    expect(sPhase[1].re).toBeCloseTo(0, 10)
    expect(sPhase[1].im).toBeCloseTo(1, 10) // i|1⟩

    const sDouble = applyGate(sPhase, 'S')
    expect(sDouble[1].re).toBeCloseTo(-1, 10) // -|1⟩ (equivalent to Z)
  })

  // T Gate (π/8 gate)
  it('applies T gate (T|1⟩ = e^(iπ/4)|1⟩, T² = S)', () => {
    const s1 = applyGate(createZeroState(), 'X')
    const sT = applyGate(s1, 'T')
    expect(sT[1].re).toBeCloseTo(INV_SQRT2, 10)
    expect(sT[1].im).toBeCloseTo(INV_SQRT2, 10)

    const sTSquared = applyGate(sT, 'T')
    expect(sTSquared[1].re).toBeCloseTo(0, 10)
    expect(sTSquared[1].im).toBeCloseTo(1, 10) // i|1⟩ (equivalent to S)
  })

  // Unitary Involutions (X² = I, Y² = I, Z² = I, H² = I)
  it('verifies self-inverse involutions', () => {
    const state = applyGate(createZeroState(), 'H')
    for (const gate of ['X', 'Y', 'Z', 'H'] as const) {
      const twice = applyGate(applyGate(state, gate), gate)
      expect(twice[0].re).toBeCloseTo(state[0].re, 8)
      expect(twice[0].im).toBeCloseTo(state[0].im, 8)
      expect(twice[1].re).toBeCloseTo(state[1].re, 8)
      expect(twice[1].im).toBeCloseTo(state[1].im, 8)
    }
  })
})
```

### 3.4 Multi-Qubit & Bell State Tests (`multiQubit.test.ts`)

Tests verify Kronecker expansion, CNOT, SWAP, and the generation of all four canonical Bell states:

```typescript
import {
  createTwoQubitZeroState,
  applyGateToQubit,
  applyCNOT,
  applySWAP,
  getProbabilities2Q,
  isEntangled
} from '../multiQubit'

describe('Multi-Qubit System & Bell States', () => {
  it('generates |Φ⁺⟩ Bell state: 1/√2 (|00⟩ + |11⟩)', () => {
    let s = createTwoQubitZeroState() // |00⟩
    s = applyGateToQubit(s, 'H', 0)    // (|00⟩ + |10⟩)/√2
    s = applyCNOT(s, 0, 1)             // (|00⟩ + |11⟩)/√2

    const probs = getProbabilities2Q(s)
    expect(probs.p00).toBeCloseTo(0.5, 10)
    expect(probs.p11).toBeCloseTo(0.5, 10)
    expect(probs.p01).toBeCloseTo(0.0, 10)
    expect(probs.p10).toBeCloseTo(0.0, 10)
    expect(isEntangled(s)).toBe(true)
  })

  it('generates |Φ⁻⟩ Bell state: 1/√2 (|00⟩ - |11⟩)', () => {
    let s = createTwoQubitZeroState()
    s = applyGateToQubit(s, 'X', 0)
    s = applyGateToQubit(s, 'H', 0)
    s = applyCNOT(s, 0, 1)

    const probs = getProbabilities2Q(s)
    expect(probs.p00).toBeCloseTo(0.5, 10)
    expect(probs.p11).toBeCloseTo(0.5, 10)
    expect(isEntangled(s)).toBe(true)
  })

  it('generates |Ψ⁺⟩ Bell state: 1/√2 (|01⟩ + |10⟩)', () => {
    let s = createTwoQubitZeroState()
    s = applyGateToQubit(s, 'X', 1)
    s = applyGateToQubit(s, 'H', 0)
    s = applyCNOT(s, 0, 1)

    const probs = getProbabilities2Q(s)
    expect(probs.p01).toBeCloseTo(0.5, 10)
    expect(probs.p10).toBeCloseTo(0.5, 10)
    expect(probs.p00).toBeCloseTo(0.0, 10)
    expect(probs.p11).toBeCloseTo(0.0, 10)
    expect(isEntangled(s)).toBe(true)
  })

  it('generates |Ψ⁻⟩ Bell state: 1/√2 (|01⟩ - |10⟩)', () => {
    let s = createTwoQubitZeroState()
    s = applyGateToQubit(s, 'X', 0)
    s = applyGateToQubit(s, 'X', 1)
    s = applyGateToQubit(s, 'H', 0)
    s = applyCNOT(s, 0, 1)

    const probs = getProbabilities2Q(s)
    expect(probs.p01).toBeCloseTo(0.5, 10)
    expect(probs.p10).toBeCloseTo(0.5, 10)
    expect(isEntangled(s)).toBe(true)
  })

  it('correctly executes SWAP gate', () => {
    let s = createTwoQubitZeroState()
    s = applyGateToQubit(s, 'X', 0) // |10⟩
    s = applySWAP(s, 0, 1)          // |01⟩

    const probs = getProbabilities2Q(s)
    expect(probs.p01).toBeCloseTo(1.0, 10)
    expect(probs.p10).toBeCloseTo(0.0, 10)
  })
})
```

### 3.5 Bloch Sphere Mapping Tests (`qubit.test.ts`)

```typescript
import { getBlochCoordinates, createZeroState, applyGate } from '../qubit'

describe('Bloch Sphere Coordinate Conversion', () => {
  it('maps standard eigenstates to unit sphere Cartesian coordinates', () => {
    const s0 = createZeroState()
    expect(getBlochCoordinates(s0)).toEqual({ x: 0, y: 0, z: 1 })

    const s1 = applyGate(s0, 'X')
    expect(getBlochCoordinates(s1)).toEqual({ x: 0, y: 0, z: -1 })

    const sPlus = applyGate(s0, 'H')
    const coordsPlus = getBlochCoordinates(sPlus)
    expect(coordsPlus.x).toBeCloseTo(1, 8)
    expect(coordsPlus.y).toBeCloseTo(0, 8)
    expect(coordsPlus.z).toBeCloseTo(0, 8)

    const sMinus = applyGate(s1, 'H')
    const coordsMinus = getBlochCoordinates(sMinus)
    expect(coordsMinus.x).toBeCloseTo(-1, 8)
    expect(coordsMinus.y).toBeCloseTo(0, 8)
    expect(coordsMinus.z).toBeCloseTo(0, 8)
  })

  it('preserves unit radius x² + y² + z² = 1 for any pure state', () => {
    let s = createZeroState()
    s = applyGate(s, 'H')
    s = applyGate(s, 'T')
    s = applyGate(s, 'X')
    const { x, y, z } = getBlochCoordinates(s)
    expect(x * x + y * y + z * z).toBeCloseTo(1.0, 8)
  })
})
```

---

## 4. Diagram Visibility & Contrast QA

To prevent illegible UI designs, automated and manual checks enforce the **QYNX Diagram Visibility Standard**:

| Test Target | Rule / Constraint | Verification Method | Pass Criteria |
|-------------|-------------------|---------------------|---------------|
| Circuit Grid Wires | Stroke $\ge 2\text{px}$, `#491D8B` or `#8A3FFC` | Automated CSS / SVG attribute test | `stroke-width >= 2`, contrast $\ge 3:1$ against `#1C0F30` |
| Bloch State Vector | Stroke $\ge 3\text{px}$, arrow head distinct | Visual inspection & WebGL mesh spec | Shaft thickness $\ge 0.04$ units, head radius $\ge 0.09$ units |
| Text Notation & Labels | Bra-ket labels $\ge 14\text{px}$, `#FFFFFF` | axe-core + CSS style assertion | Contrast ratio $\ge 4.5:1$ against adjacent container |
| Probability Bars | Bar height $\ge 8\text{px}$, fill `#8A3FFC` | DOM inspector test | Visible percentage label in White `#FFFFFF` |
| Tap Targets | Gate cards, buttons, grid cells $\ge 48\times 48\text{px}$ | `@testing-library/react` bounding box | `width >= 48 && height >= 48` on mobile viewports |

---

## 5. UI Component & Flow Integration Tests

### 5.1 Quantum Gate Visualizer Flow (`src/pages/GateVisualizer/__tests__/flow.test.tsx`)

```typescript
describe('Quantum Gate Visualizer Integration Flow', () => {
  it('executes H -> X -> Measure -> Reset sequence with correct UI state', async () => {
    render(<GateVisualizer />)

    // Initial state: |0⟩, 100% / 0%
    expect(screen.getByTestId('state-ket-label')).toHaveTextContent('|0⟩')
    expect(screen.getByTestId('prob-0-pct')).toHaveTextContent('100.0%')
    expect(screen.getByTestId('prob-1-pct')).toHaveTextContent('0.0%')

    // Apply H
    const hBtn = screen.getByRole('button', { name: /hadamard/i })
    await userEvent.click(hBtn)
    expect(screen.getByTestId('state-ket-label')).toHaveTextContent('|+⟩')
    expect(screen.getByTestId('prob-0-pct')).toHaveTextContent('50.0%')
    expect(screen.getByTestId('prob-1-pct')).toHaveTextContent('50.0%')

    // Apply X
    const xBtn = screen.getByRole('button', { name: /pauli-x/i })
    await userEvent.click(xBtn)
    expect(screen.getByTestId('state-ket-label')).toHaveTextContent('|-⟩')

    // Measure
    const measureBtn = screen.getByRole('button', { name: /measure/i })
    await userEvent.click(measureBtn)

    // Verify collapse to |0⟩ or |1⟩
    const finalLabel = screen.getByTestId('state-ket-label').textContent
    expect(['|0⟩', '|1⟩']).toContain(finalLabel)
    expect(hBtn).toBeDisabled()
    expect(xBtn).toBeDisabled()

    // Reset
    const resetBtn = screen.getByRole('button', { name: /reset state/i })
    await userEvent.click(resetBtn)
    expect(screen.getByTestId('state-ket-label')).toHaveTextContent('|0⟩')
    expect(hBtn).toBeEnabled()
  })
})
```

### 5.2 Quantum Expo Lab Flow (`src/pages/ExpoLab/__tests__/expoFlow.test.tsx`)

```typescript
describe('Quantum Expo Lab Step Sequencer', () => {
  it('steps through Superposition Protocol and records multi-shot measurement', async () => {
    render(<ExpoLab />)

    // Select Superposition experiment
    const expSelect = screen.getByRole('button', { name: /superposition protocol/i })
    await userEvent.click(expSelect)

    // Step 0: State is |0⟩
    expect(screen.getByTestId('expo-current-step')).toHaveTextContent('Step 0')

    // Step 1: Apply H gate
    await userEvent.click(screen.getByRole('button', { name: /run next step/i }))
    expect(screen.getByTestId('expo-current-step')).toHaveTextContent('Step 1')
    expect(screen.getByTestId('expo-state-display')).toHaveTextContent('|+⟩')

    // Step 2: Multi-shot sampling (1000 shots)
    await userEvent.click(screen.getByRole('button', { name: /run next step/i }))
    expect(screen.getByTestId('expo-histogram')).toBeInTheDocument()
    expect(screen.getByTestId('shot-count-0')).toHaveTextContent(/^[4-5]\d{2}$/) // ~500
    expect(screen.getByTestId('shot-count-1')).toHaveTextContent(/^[4-5]\d{2}$/) // ~500
  })
})
```

---

## 6. Manual QA Checklist

### 6.1 Brand Identity & Layout Verification
- [ ] Header wordmark displays **QYNX** in `Cabinet Grotesk` or `Syne` with `#8A3FFC` dot.
- [ ] Navigation tabs 01–05 are numbered and labeled with exact names:
  - `01. Quantum Universe`
  - `02. Gate Visualizer`
  - `03. Quantum Expo Lab`
  - `04. Entanglement Simulator`
  - `05. Circuit Builder`
- [ ] No legacy blue tokens (`#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, `#3A506B`) appear anywhere in DOM or computed styles.
- [ ] Dark canvas uses strict QYNX Purple Scale (`#1C0F30` background, `#31135E` cards, `#491D8B` borders).
- [ ] High-contrast mathematical text and state kets use pure White `#FFFFFF`.

### 6.2 Quantum Gate Visualizer (Page 2)
- [ ] 3D Bloch sphere renders with clear equator and meridian circles (visible without squinting).
- [ ] Arrow shaft thickness is $\ge 3\text{px}$, arrow head clearly distinguished.
- [ ] Drag-to-rotate camera functions smoothly without hitching.
- [ ] Gate applications trigger SLERP animation along the geodesic surface.
- [ ] Probability bars smoothly interpolate to exact Born probabilities.
- [ ] Measurement disables gates and shows projective collapse notification.
- [ ] Live announcer alerts assistive technology: *"State measured: collapsed to ket 0"*.

### 6.3 Quantum Expo Lab (Page 3)
- [ ] Superposition and Bit-Flip experiments are accessible via protocol selector.
- [ ] Step-by-step sequencer updates the visual circuit line and state readout concurrently.
- [ ] Multi-shot histograms render clear bars in `#8A3FFC` with white labels.
- [ ] Clear scientific disclaimer banner displays on measurement results.

### 6.4 Quantum Entanglement Simulator (Page 4)
- [ ] Qubit A and Qubit B displayed in clean card containers without physical wires/cables.
- [ ] Applying H on A then CNOT creates Bell state $|\Phi^+\rangle$.
- [ ] Entangled badge lights up with `#BE95FF` pulse.
- [ ] Measuring Qubit A immediately updates Qubit B's correlated outcome.
- [ ] Non-classical correlation explanation card renders with readable math notation.

### 6.5 Quantum Circuit Builder (Page 5)
- [ ] Desktop drag-and-drop from gate palette onto 3-qubit $\times$ 8-step matrix functions reliably.
- [ ] Mobile alternative: tapping a gate selects it, tapping a grid slot places it without dragging.
- [ ] Invalid multi-wire operations (e.g., CNOT control and target on same wire) display 3-part diagnostic error.
- [ ] Run Circuit simulates state evolution and renders measurement outcome probabilities.
- [ ] Step-by-step scrubber allows scrubbing through intermediate column state vectors.

### 6.6 Accessibility & Performance Audits
- [ ] Lighthouse Performance score $\ge 90$ on desktop and mobile.
- [ ] Lighthouse Accessibility score = 100.
- [ ] All interactive elements pass WCAG 2.1 AA color contrast ($\ge 4.5:1$ text, $\ge 3:1$ graphics).
- [ ] Keyboard navigation: Tab traversal, Enter/Space activation, Esc dismisses modals.
- [ ] Screen reader announcer `#qynx-live-announcer` triggers on every quantum state mutation.
- [ ] `prefers-reduced-motion` suppresses SLERP transitions and pulses.

---

## 7. Test Execution Commands

```bash
# Run full engine and component test suite
npm run test

# Run tests in watch mode during development
npm run test:watch

# Generate comprehensive test coverage report
npm run test:coverage

# Run automated axe accessibility audit
npm run test:a11y

# Production build and Lighthouse preview audit
npm run build
npm run preview
npx lighthouse http://localhost:4173 --output html --output-path ./artifacts/lighthouse-report.html
```

### Coverage Thresholds (Strict Engine Requirements)

| Code Area | Statements | Branches | Functions | Lines |
|-----------|------------|----------|-----------|-------|
| `src/engine/math/` | 100% | 98% | 100% | 100% |
| `src/engine/gates/` | 100% | 95% | 100% | 100% |
| `src/engine/qubit/` | 100% | 95% | 100% | 100% |
| `src/engine/circuit/` | 95% | 90% | 95% | 95% |
| `src/store/` | 90% | 85% | 90% | 90% |
| `src/components/shared/` | 85% | 80% | 85% | 85% |
