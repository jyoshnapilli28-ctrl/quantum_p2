# IMPLEMENTATION PLAN — QYNX

> **This is the authoritative step-by-step execution plan.** Follow each phase in sequence. Each phase lists the exact modules to create, the specifications to reference, and the empirical acceptance criteria.

---

## PHASE 1: Project Scaffold & Design Foundation

**Duration estimate:** ~30 minutes

### Step 1.1: Create Vite Project
```bash
npm create vite@latest qynx -- --template react-ts
cd qynx
npm install react-router-dom zustand framer-motion
npm install three @react-three/fiber @react-three/drei
npm install @dnd-kit/core @dnd-kit/sortable
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest-axe @types/three
```

### Step 1.2: Copy Assets
Ensure the application public asset folder contains:
```
public/assets/3d/          → bloch-sphere.gltf, gate-state-presets.json
public/assets/fonts/       → fonts.css, woff2 files
public/assets/icons/       → SVG icons
public/assets/images/      → SVG diagrams & illustrations
public/assets/site.webmanifest
```

### Step 1.3: Configure Vite
Configure path aliases in `vite.config.ts`:
```
@engine → src/engine/    @store → src/store/    @components → src/components/
@pages → src/pages/      @styles → src/styles/  @viz → src/visualization/
@types → src/types/
```
**Reference:** `docs/coding_guide.md`

### Step 1.4: Configure TypeScript
Set `strict: true`, `noImplicitAny: true`, `strictNullChecks: true` in `tsconfig.json`.

### Step 1.5: Create Design System CSS
Author stylesheet foundation:
- `src/styles/tokens.css` — QYNX Purple Scale CSS custom properties (`--color-purple-10` to `--color-purple-100`, `--color-white`, radii, spacing, z-index).
- `src/styles/global.css` — CSS reset, base typography, accessible focus styles, scrollbar styling.

**Reference:** `docs/05_DESIGN_SYSTEM.md`

### Step 1.6: Set Up index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>QYNX — Interactive Quantum Computing Simulation</title>
  <meta name="description" content="An interactive educational quantum computing platform. Explore qubits, quantum gates, entanglement, and build quantum circuits." />
  <meta property="og:title" content="QYNX" />
  <meta property="og:description" content="Interactive quantum computing simulation platform" />
  <meta property="og:type" content="website" />
  <link rel="icon" href="/assets/images/branding/logo/qynx-icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/assets/site.webmanifest" />
  <meta name="theme-color" content="#1C0F30" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

**✅ Phase 1 Acceptance:** `npm run dev` starts successfully. The browser renders the dark canvas (`#1C0F30`) with custom scrollbars and typography loaded.

---

## PHASE 2: Quantum Engine (Zero-Dependency Math)

**Duration estimate:** ~1–2 hours

### Step 2.1: Types
File: `src/types/quantum.ts`
Define: `Complex`, `StateVector1Q`, `StateVector2Q`, `GateId`, `Matrix2x2`, `Matrix4x4`, `MeasurementOutcome1Q`, `MeasurementOutcome2Q`, `GatePlacement`, `CircuitDefinition`, `CircuitResult`, `ExpoProtocolDefinition`.

### Step 2.2: Complex Arithmetic Module
File: `src/engine/math/complex.ts`
Functions: `add`, `subtract`, `multiply`, `conjugate`, `magnitude`, `magnitudeSquared`, `phase`.

### Step 2.3: Matrix Operations Module
File: `src/engine/math/matrix.ts`
Functions: `applyMatrix2x2(matrix, state)` — complex matrix-vector multiplication.

### Step 2.4: Vector Operations Module
File: `src/engine/math/vector.ts`
Functions: `normalize1Q`, `innerProduct1Q`.

### Step 2.5: Qubit State Factory & Bloch Coordinates
File: `src/engine/qubit.ts`
Functions: `createZeroState`, `createOneState`, `createPlusState`, `createMinusState`, `getBlochCoordinates`.

### Step 2.6: Single-Qubit Gate Kernels
File: `src/engine/gates.ts`
Define: `GATE_MATRICES` for $X, Y, Z, H, S, T$.  
Function: `applyGate(state, gateId)`.

### Step 2.7: Measurement & Born Sampling
File: `src/engine/measurement.ts`
Functions: `getProbabilities1Q`, `measureSingle1Q`, `measureMultiShot1Q`.

**✅ Phase 2 Acceptance:** 100% pass rate in Vitest unit tests (`npm run test`). All gates, self-inverses, and normalization invariants pass with tolerance $\varepsilon = 10^{-10}$.

---

## PHASE 3: Two-Qubit Simulation Engine

**Duration estimate:** ~1 hour

File: `src/engine/multiQubit.ts`
Functions:
- `tensorProduct(q0, q1)`: $\mathbb{C}^2 \otimes \mathbb{C}^2 \to \mathbb{C}^4$.
- `applyGateToQubit(twoQubitState, gateId, qubitIndex)`.
- `applyCNOT(twoQubitState, control, target)`.
- `applySWAP(twoQubitState, q0, q1)`.
- `isEntangled(twoQubitState)`: Computes Schmidt rank / concurrence.
- `getProbabilities2Q(twoQubitState)`: $P(00), P(01), P(10), P(11)$.
- `measureTwoQubit(twoQubitState)`.

**✅ Phase 3 Acceptance:** Bell state creation test passes. Applying $H$ to qubit 0 then $\text{CNOT}(0 \to 1)$ produces $(1/\sqrt{2}, 0, 0, 1/\sqrt{2})^T$ with $P(00) = 50\%$, $P(11) = 50\%$, $P(01) = 0\%$, $P(10) = 0\%$.

---

## PHASE 4: Circuit Simulation Engine

**Duration estimate:** ~1 hour

File: `src/engine/circuit.ts`
Functions:
- `validateCircuit(circuit)`: Checks bounds, missing targets, overlapping multi-qubit gates.
- `executeCircuit(circuit)`: Iterates through column slices, applies unitary operations, and samples final measurement shots.

**✅ Phase 4 Acceptance:** Bell state circuit execution generates expected histogram distribution over 1,000 shots within $3\sigma$ standard error.

---

## PHASE 5: Zustand State Management (QynxStore)

**Duration estimate:** ~1 hour

Files in `src/store/`:
- `gateVisualizerSlice.ts` — Page 2 single-qubit state, gate history, measurement collapse.
- `expoLabSlice.ts` — Page 3 protocol selection, step sequencer, multi-shot results.
- `entanglementSlice.ts` — Page 4 twin-qubit state, Bell selector, correlated collapse.
- `circuitSlice.ts` — Page 5 circuit matrix, gate placement, drag-and-drop actions.
- `uiSlice.ts` — Navigation route, announcer messages, modal states.
- `useQynxStore.ts` — Root combined store.

**✅ Phase 5 Acceptance:** Store actions successfully execute without direct component-level math logic.

---

## PHASE 6: Shared Components & UI Primitives

**Duration estimate:** ~1.5 hours

Components in `src/components/shared/`:
- `QuantumPanel.tsx` — Restrained purple surface container with border `#491D8B`.
- `DiracNotation.tsx` — High-contrast bra-ket math display (`#FFFFFF`).
- `ProbabilityBar.tsx` — Accessible Born rule probability meter.
- `GateButton.tsx` — High-contrast gate trigger token.
- `ProbabilityHistogram.tsx` — Multi-shot frequency bar chart.
- `LiveAnnouncer.tsx` — Global screen reader announcer `#qynx-live-announcer`.

**✅ Phase 6 Acceptance:** All components pass WCAG 2.1 AA color contrast audits and satisfy Diagram Visibility Standards.

---

## PHASE 7: Page 1 — Quantum Universe (Educational Hub)

**Duration estimate:** ~2 hours

File: `src/pages/QuantumUniverse/`
- Educational overview covering 9 fundamental quantum concepts.
- High-contrast SVG diagrams adhering to the 3-second comprehension rule.
- Interactive widgets (Bit vs Qubit toggle, Superposition wave, Measurement collapse trigger).

**✅ Phase 7 Acceptance:** All 9 topics render cleanly with responsive layout down to 375px.

---

## PHASE 8: Page 2 — Quantum Gate Visualizer

**Duration estimate:** ~2 hours

File: `src/pages/GateVisualizer/`
- Two-column layout: 3D Bloch sphere (left) + gate controls (right).
- R3F 3D Bloch sphere canvas with geodesic SLERP animation.
- Coordinate mapping invariant enforced: Three.js $Y = \text{Bloch } Z$.
- Gate buttons ($X, Y, Z, H, S, T$), measurement collapse, and state reset.

**✅ Phase 8 Acceptance:** Applying $H$ rotates the vector from North pole to $+X$ equator with smooth SLERP; probability bars update in real time.

---

## PHASE 9: Page 3 — Quantum Expo Lab

**Duration estimate:** ~1.5 hours

File: `src/pages/ExpoLab/`
- Pre-configured protocols (Superposition Protocol, Bit-Flip Protocol).
- Step sequencer ("Run Next Step", "Run All", "Reset").
- Multi-shot histogram with scientific disclaimer.

**✅ Phase 9 Acceptance:** Stepping through Superposition Protocol yields expected $50/50$ histogram distribution on 1,000 shots.

---

## PHASE 10: Page 4 — Quantum Entanglement Simulator

**Duration estimate:** ~1.5 hours

File: `src/pages/EntanglementSimulator/`
- Twin-qubit workspace (Qubit A and Qubit B side-by-side without physical wires).
- Bell state synthesis and correlation explanation card.
- Correlated measurement collapse: measuring A instantly projects B into matching state.

**✅ Phase 10 Acceptance:** Measuring Qubit A on Bell state $|\Phi^+\rangle$ always forces Qubit B to yield identical outcome.

---

## PHASE 11: Page 5 — Quantum Circuit Builder

**Duration estimate:** ~2 hours

File: `src/pages/CircuitBuilder/`
- Gate palette sidebar + 3-qubit $\times$ 8-step matrix workspace.
- Desktop drag-and-drop + accessible mobile tap-to-place alternative.
- Circuit validation with 3-part diagnostic error messages.
- Step-by-step circuit runner and terminal multi-shot histogram.

**✅ Phase 11 Acceptance:** User can assemble a Bell circuit via drag or tap, execute it, and inspect intermediate column state vectors.

---

## PHASE 12: Accessibility, Polish & Release Certification

**Duration estimate:** ~1 hour

- Verify global `#qynx-live-announcer` triggers on state mutations.
- Verify `prefers-reduced-motion` suppresses SLERP transitions and pulses.
- Run Lighthouse audits (score $\ge 90$ across all categories).
- Run full manual QA against `docs/32_RELEASE_CHECKLIST.md`.
