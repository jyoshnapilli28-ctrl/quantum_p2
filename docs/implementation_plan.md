# IMPLEMENTATION PLAN — QUANTUM UNIVERSE

> **This is the step-by-step execution plan.** Follow each phase in order. Do not skip phases. Each phase lists exactly what to create, the spec file to reference, and the acceptance criteria.

---

## PHASE 1: Project Scaffold & Design Foundation

**Duration estimate:** ~30 minutes

### Step 1.1: Create Vite Project
```bash
npm create vite@latest quantum-universe -- --template react-ts
cd quantum-universe
npm install react-router-dom zustand framer-motion
npm install three @react-three/fiber @react-three/drei
npm install @dnd-kit/core @dnd-kit/sortable
npm install -D vitest @testing-library/react @testing-library/jest-dom @types/three
```

### Step 1.2: Copy Assets
Copy the entire existing `assets/` folder into `public/assets/`. The structure:
```
public/assets/3d/          → bloch-sphere.gltf, gate-state-presets.json
public/assets/fonts/        → fonts.css, 7 woff2 files
public/assets/icons/        → 83 SVGs across 7 categories
public/assets/images/       → 35 SVGs (illustrations, backgrounds, branding, system)
public/assets/site.webmanifest
```
**DO NOT copy `assets/references/` into the production build.**

### Step 1.3: Configure Vite
Create `vite.config.ts` with path aliases:
```
@engine → src/engine/    @store → src/store/    @components → src/components/
@pages → src/pages/      @styles → src/styles/  @viz → src/visualization/
@types → src/types/
```
**Reference:** `coding_guide.md` Section 14

### Step 1.4: Configure TypeScript
Set `strict: true`, `noImplicitAny: true`, `strictNullChecks: true` in `tsconfig.json`.
**Reference:** `04_TECH_STACK.md` Section 6

### Step 1.5: Create Design System CSS
Create these 3 files:
- `src/styles/tokens.css` — ALL CSS custom properties (colors, gradients, typography, spacing, radii, z-index, shadows)
- `src/styles/global.css` — Reset, body styles, scrollbar, font import, reduced-motion
- `src/styles/animations.css` — Shared keyframes (fade-in, slide-up, pulse)

**Reference:** `coding_guide.md` Section 5.1 and 5.2, `05_DESIGN_SYSTEM.md`

### Step 1.6: Set Up index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Quantum Universe — Interactive Quantum Computing</title>
  <meta name="description" content="An interactive educational quantum computing laboratory. Explore qubits, quantum gates, entanglement, and build quantum circuits." />
  <meta property="og:title" content="Quantum Universe" />
  <meta property="og:description" content="Interactive quantum computing laboratory" />
  <meta property="og:type" content="website" />
  <link rel="icon" href="/assets/images/branding/logo/quantum-universe-icon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/assets/site.webmanifest" />
  <meta name="theme-color" content="#071018" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

**✅ Phase 1 Acceptance:** `npm run dev` starts successfully. The browser shows a blank page with the correct dark background gradient (`#071018` → `#0B132B`), custom scrollbar, and Inter font loaded.

---

## PHASE 2: Quantum Engine (Pure Math — No UI)

**Duration estimate:** ~1–2 hours

### Step 2.1: Create Types
File: `src/types/quantum.ts`
Define: `Complex`, `StateVector1Q`, `StateVector2Q`, `GateId`, `Matrix2x2`, `MeasurementOutcome1Q`, `MeasurementOutcome2Q`, `GatePlacement`, `CircuitDefinition`, `CircuitResult`, `ExperimentStep`, `ExperimentDefinition`, `GateHistoryEntry`.
**Reference:** `coding_guide.md` Section 5.3, `04_TECH_STACK.md` Section 8

### Step 2.2: Complex Number Module
File: `src/engine/math/complex.ts`
Functions: `add`, `subtract`, `multiply`, `conjugate`, `magnitude`, `magnitudeSquared`, `fromReal`, `fromImaginary`
**Reference:** `07_QUANTUM_ENGINE.md` Section 4.1

### Step 2.3: Matrix Module
File: `src/engine/math/matrix.ts`
Functions: `applyMatrix2x2(matrix, state)` — complex matrix-vector multiply
**Reference:** `08_QUANTUM_MATHEMATICS.md` Section 4

### Step 2.4: Vector Module
File: `src/engine/math/vector.ts`
Functions: `normalize`, `innerProduct`, `tensorProduct`
**Reference:** `08_QUANTUM_MATHEMATICS.md` Section 8 (normalization)

### Step 2.5: Qubit Module
File: `src/engine/qubit.ts`
Functions: `createZeroState`, `createOneState`, `createPlusState`, `createTwoQubitZeroState`
**Reference:** `07_QUANTUM_ENGINE.md` Section 3.1

### Step 2.6: Gates Module
File: `src/engine/gates.ts`
- Constant `GATE_MATRICES`: exact matrices for X, Y, Z, H, S, T
- Function `applyGate(state, gateId)`: lookup matrix, apply, normalize, return
**Reference:** `coding_guide.md` Section 5.4, `08_QUANTUM_MATHEMATICS.md` Section 3

### Step 2.7: Measurement Module
File: `src/engine/measurement.ts`
Functions: `getProbabilities1Q`, `getProbabilities2Q`, `getBlochCoordinates`, `measureSingle`, `measureTwoQubit`, `measureMultiShot`, `measureMultiShot2Q`, `getStateName`
**Reference:** `coding_guide.md` Section 5.5, `08_QUANTUM_MATHEMATICS.md` Section 5–6

### Step 2.8: Multi-Qubit Module
File: `src/engine/multiQubit.ts`
Functions: `applyGateToQubit`, `applyCNOT`, `applySWAP`, `isEntangled`
**Reference:** `12_MULTI_QUBIT_SYSTEM.md`

### Step 2.9: Circuit Module
File: `src/engine/circuit.ts`
Function: `executeCircuit(definition)` — initializes state, sorts gates by column, applies sequentially, measures
**Reference:** `07_QUANTUM_ENGINE.md` Section 3.5

### Step 2.10: Barrel Export
File: `src/engine/index.ts` — re-export all public functions

**✅ Phase 2 Acceptance:** Run ALL test cases from `31_QUANTUM_VALIDATION_CASES.md`. Every single assertion must pass:
- `applyGate(|0⟩, 'X')` returns `|1⟩`
- `applyGate(|0⟩, 'H')` returns `|+⟩` with probabilities 50/50
- `getBlochCoordinates(|0⟩)` returns `{x:0, y:0, z:1}`
- Bell state creation works: H→CNOT→`(|00⟩+|11⟩)/√2`
- Normalization holds after every operation

---

## PHASE 3: Zustand State Management

**Duration estimate:** ~45 minutes

### Step 3.1: Gate Visualizer Slice
File: `src/store/gateVisualizerSlice.ts`
State: `currentState`, `previousState`, `probabilities`, `blochCoordinates`, `stateLabel`, `highlightedGate`, `gateHistory`, `isMeasured`, `measurementOutcome`, `isAnimating`
Actions: `applyGate(gateId)`, `measure()`, `reset()`, `setAnimationComplete()`
**Reference:** `09_QUANTUM_STATE_MANAGEMENT.md` Section 3

### Step 3.2: Experiment Slice
File: `src/store/experimentSlice.ts`
State: `experiments[]`, `activeExperimentId`, `currentStepIndex`, `stepStates[]`, `measurementResults`, `isRunning`
Actions: `selectExperiment(id)`, `runNextStep()`, `runAll()`, `reset()`
**Reference:** `09_QUANTUM_STATE_MANAGEMENT.md` Section 4

### Step 3.3: Entanglement Slice
File: `src/store/entanglementSlice.ts`
State: `twoQubitState`, `isEntangled`, `probabilities4`, `measurementResult`, `workflowStep`
Actions: `applyHToA()`, `applyCNOT()`, `measure()`, `reset()`
**Reference:** `09_QUANTUM_STATE_MANAGEMENT.md` Section 5

### Step 3.4: Circuit Slice
File: `src/store/circuitSlice.ts`
State: `circuitDefinition`, `gates[]`, `numQubits`, `executionState`, `lastResult`, `shots`
Actions: `addGate(placement)`, `removeGate(id)`, `moveGate(id, col, wire)`, `addQubit()`, `removeQubit()`, `runCircuit()`, `clear()`, `reset()`
**Reference:** `09_QUANTUM_STATE_MANAGEMENT.md` Section 6

### Step 3.5: Root Store
File: `src/store/quantumStore.ts` — compose all slices using Zustand `create`
File: `src/store/index.ts` — export `useQuantumStore` hook

**✅ Phase 3 Acceptance:** Import the store in a test component. Call `store.applyGate('H')` and verify the store's `stateLabel` updates to `|+⟩` and `probabilities` updates to `{p0: 0.5, p1: 0.5}`.

---

## PHASE 4: Shared Components

**Duration estimate:** ~1 hour

### Step 4.1: Hooks
- `src/hooks/useReducedMotion.ts` — returns `boolean` from `window.matchMedia('(prefers-reduced-motion: reduce)')`
- `src/hooks/useScrollReveal.ts` — returns a ref, uses `IntersectionObserver` (threshold: 0.15) to add a `revealed` class

### Step 4.2: Icon Component
`src/components/shared/Icon.tsx` — renders `<img src={/assets/icons/${category}/${name}.svg} />` with configurable `size`, `className`, `alt`.

### Step 4.3: QuantumPanel
`src/components/shared/QuantumPanel.tsx` — glassmorphism wrapper div. Variants: `default`, `deep` (for visualization areas), `highlight` (with Icicle border glow), `flat` (no blur).
**Reference:** `05_DESIGN_SYSTEM.md` Section 7

### Step 4.4: DiracNotation
`src/components/shared/DiracNotation.tsx` — renders the state label (e.g. `|+⟩`) in JetBrains Mono, white, with cross-fade animation (300ms) when the label changes.
**Reference:** `14_GATE_VISUALIZER.md` Section 5.1

### Step 4.5: ProbabilityBar
`src/components/shared/ProbabilityBar.tsx` — horizontal bar with label (`|0⟩`), fill gradient, and percentage. Fill width transitions via CSS `transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1)` using `scaleX`.
**Reference:** `05_DESIGN_SYSTEM.md` Section 9

### Step 4.6: GateButton
`src/components/shared/GateButton.tsx` — 52×52px button with gate label in monospace. States: default, hover (border→Icicle, glow), active/selected (Icicle glow), disabled. Press animation: scale(0.95) on :active.
**Reference:** `05_DESIGN_SYSTEM.md` Section 8.2

### Step 4.7: MeasurementResult
`src/components/shared/MeasurementResult.tsx` — displays a single measurement outcome with spring animation entry.

### Step 4.8: Navigation
`src/components/layout/Navigation.tsx` — fixed top bar (64px), logo left, nav links, mobile hamburger. Active link: white + 2px Icicle underline.
**Reference:** `06_UI_UX.md` Section 1

### Step 4.9: PageShell
`src/components/layout/PageShell.tsx` — wraps each page with navigation + content area (paddingTop: 64px, maxWidth: 1280px, centered).

**✅ Phase 4 Acceptance:** Render the Navigation component and QuantumPanel in the browser. Navigation links are visible, styled correctly, and the glass panel has the correct gradient, blur, and border.

---

## PHASE 5: 3D Bloch Sphere Visualization

**Duration estimate:** ~1–2 hours

### Step 5.1: BlochSphere3D
`src/visualization/bloch/BlochSphere3D.ts`
- SphereGeometry(1.0, 64, 64)
- MeshPhysicalMaterial: color #0B132B, transparent, opacity 0.35, roughness 0.05
- 3 great circle meridians (XY, XZ, YZ) in Polar color, semi-transparent
- 3 axis lines (Z=Arctic, X/Y=Icicle dimmer)
**Reference:** `18_3D_BLOCH_SPHERE.md` Sections 4–5

### Step 5.2: StateVector
`src/visualization/bloch/StateVector.ts`
- Arrow: CylinderGeometry shaft + ConeGeometry tip, white
- Glow dot: SphereGeometry(0.05) + PointLight at tip
**Reference:** `18_3D_BLOCH_SPHERE.md` Section 6

### Step 5.3: BlochAnimator
`src/visualization/bloch/BlochAnimator.ts`
- SLERP interpolation from previousCoords to currentCoords
- Duration: 600ms, easing: cubic-bezier(0.4, 0, 0.2, 1)
- On measurement: SNAP instantly, no interpolation
**Reference:** `18_3D_BLOCH_SPHERE.md` Section 7

### Step 5.4: BlochScene
`src/visualization/bloch/BlochScene.ts` — assembles sphere, axes, labels, vector, controls

### Step 5.5: BlochSphere Component
`src/components/bloch/BlochSphere.tsx` — R3F Canvas wrapper
- Props: `coordinates`, `previousCoordinates`, `isAnimating`, `onAnimationComplete`
- OrbitControls: damping 0.08, no pan, zoom 2.5–6.0
- Labels via drei `Html`: |0⟩, |1⟩, |+⟩, |-⟩, |i⟩, |-i⟩
- frameloop="demand" — render only during animation
- WebGL fallback if unavailable

### Step 5.6: QuantumParticles
`src/visualization/particles/QuantumParticles.ts`
- Canvas-based particle system for Page 1 hero
- 80 particles desktop, 40 mobile
- Arctic color at 30–60% opacity, slow drift
- Static on prefers-reduced-motion
**Reference:** `19_VISUALIZATION_SYSTEM.md`

**✅ Phase 5 Acceptance:** Navigate to `/gate-visualizer`. The Bloch sphere renders with the translucent glass look, axes visible, |0⟩ label at top, state vector pointing up. Click+drag rotates the camera smoothly.

---

## PHASE 6: Application Shell & Routing

**Duration estimate:** ~20 minutes

### Step 6.1: App.tsx
- `createBrowserRouter` with 6 routes (5 pages + 404 catch-all)
- All page components lazy-loaded
- Framer Motion `AnimatePresence mode="wait"` on route outlet
- Page transitions: opacity fade, 300ms

### Step 6.2: main.tsx
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
);
```

**✅ Phase 6 Acceptance:** All 5 nav links work. Route transitions fade smoothly. 404 page shows for invalid URLs.

---

## PHASE 7: Page 1 — Quantum Universe (Educational)

**Duration estimate:** ~1.5 hours

### What to build:
- Hero section: full viewport, particle canvas, heading, CTA
- 6 educational sections (scrollable), each with:
  - Heading
  - Illustration SVG (from `/assets/images/illustrations/quantum-universe/`)
  - Interactive demo (uses real quantum engine calls)
  - Explanatory text
- Bottom CTA section linking to Pages 2–5
- Scroll-reveal animations on each section

### Key interactions:
- Section 1: Bit toggle (snap) vs Qubit indicator (pulse)
- Section 2: Apply H → Measure (real engine call)
- Section 3: Probability slider → multi-shot measurement
- Section 4: Gate selector showing matrix + transformation
- Section 5: Create Bell State → Measure (correlated)
- Section 6: Step-through circuit diagram

**Reference:** `13_QUANTUM_UNIVERSE.md` (FULL specification)

**✅ Acceptance:** All 6 sections render. Scroll reveals work. Interactive demos produce correct quantum results.

---

## PHASE 8: Page 2 — Gate Visualizer

**Duration estimate:** ~1.5 hours

### What to build:
- Two-column: Bloch sphere (left) + control panel (right)
- Gate buttons: [H] [X] [Y] [Z] [S] [T]
- State label (DiracNotation), probability bars
- Measure button, explanation panel, gate history
- Full animation sequence: gate press → engine calc → Bloch SLERP → probability transition

### Data flow:
```
Click gate → store.applyGate() → engine calculates → store updates →
React re-renders → Bloch animates (SLERP 600ms) → bars transition (400ms) → done
```

**Reference:** `14_GATE_VISUALIZER.md` (FULL specification)

**✅ Acceptance:** Click H on fresh |0⟩. Vector smoothly arcs from north pole to +X equator. State shows |+⟩. Bars show 50/50. Click Measure. Vector snaps to a pole. Gates disable.

---

## PHASE 9: Page 3 — Experiment Lab

**Duration estimate:** ~1 hour

### What to build:
- Sidebar: list of 5 predefined experiments
- Workspace: step indicator, state display, probability bars, measurement histogram
- Controls: RUN NEXT STEP, RUN ALL, Reset

### Predefined experiments:
1. **Superposition** — Init |0⟩ → H → Measure
2. **Bit Flip** — Init |0⟩ → X → Measure
3. **Phase Flip** — Init |+⟩ → Z → Measure
4. **Double Hadamard** — Init |0⟩ → H → H → Measure (back to |0⟩)
5. **Random State** — Init |0⟩ → H → T → H → Measure

**Reference:** `15_EXPERIMENT_LAB.md` (FULL specification)

**✅ Acceptance:** Select "Superposition". Click through steps. After H, bars show 50/50. After Measure, result is 0 or 1 with 100%.

---

## PHASE 10: Page 4 — Entanglement Simulator

**Duration estimate:** ~1 hour

### What to build:
- Circuit visualization (SVG): two qubit wires with H and CNOT gates
- Two qubit state cards (A and B)
- Central state display with entanglement badge
- Workflow buttons: [Apply H to A] → [Apply CNOT] → [Measure]
- 4-bar probability histogram
- SVG connection arc with marching-ants animation

### Data flow:
```
[Apply H to A] → applyGateToQubit(state, 'H', 0) → superposition
[Apply CNOT]   → applyCNOT(state, 0, 1) → Bell state, isEntangled=true
[Measure]      → measureTwoQubit → always |00⟩ or |11⟩
```

**Reference:** `16_ENTANGLEMENT_SIMULATOR.md` (FULL specification)

**✅ Acceptance:** Complete workflow. After CNOT, "ENTANGLED" badge appears. Histogram shows ~50% |00⟩ and ~50% |11⟩. |01⟩ and |10⟩ are always 0%.

---

## PHASE 11: Page 5 — Circuit Builder

**Duration estimate:** ~2 hours (most complex page)

### What to build:
- Gate palette sidebar (drag source): [H][X][Y][Z][S][T] + [CNOT][SWAP]
- Circuit grid workspace: N qubit wires × M time columns
- Drag-and-drop via @dnd-kit
- Add/remove qubit buttons
- RUN CIRCUIT button → engine.executeCircuit → result histogram
- Circuit validation (check for overlapping gates, invalid CNOT)

### Drag and drop:
```
DndContext (from @dnd-kit/core)
  GatePalette (Draggable sources)
  CircuitGrid (Droppable targets — each cell is a drop zone)
```

**Reference:** `17_CIRCUIT_BUILDER.md` (FULL specification)

**✅ Acceptance:** Drag H to q0 column 0. Drag CNOT to q0/q1 column 1. Click RUN CIRCUIT. Histogram shows Bell state distribution.

---

## PHASE 12: 404 Page

File: `src/pages/NotFound.tsx`
- Display `/assets/images/illustrations/system/page-not-found.svg`
- Heading: "Quantum State Not Found"
- Subtext: "The state you're looking for doesn't exist in this Hilbert space."
- Button: "Return to the Observable Universe" → navigates to `/`

**✅ Acceptance:** Navigate to `/nonexistent`. 404 page renders with SVG and home button.

---

## PHASE 13: Custom Cursor & Micro-Interactions

**Duration estimate:** ~30 minutes

### What to build:
- Custom cursor: white center dot + Arctic outer ring with elastic follow delay
- Hover expansion on interactive elements
- Gate hover: subtle Icicle glow
- Circuit drag state cursor
- Bloch sphere rotation cursor indicator

**Reference:** `20_ANIMATION_SYSTEM.md` Section 3

**✅ Acceptance:** Move mouse. Outer ring follows with delay. Hover a gate button — ring expands. `prefers-reduced-motion` disables the delay.

---

## PHASE 14: Polish & Production

**Duration estimate:** ~30 minutes

### Tasks:
1. Verify ALL scroll-reveal animations work on Page 1
2. Verify probability bar transitions are GPU-accelerated (transform, not width)
3. Test `prefers-reduced-motion` globally — particles freeze, Bloch snaps, no scroll animations
4. Verify lazy loading: Three.js only loads on `/gate-visualizer`
5. Run Lighthouse audit: target >90 in all categories
6. Verify all 83 icons render correctly
7. Verify mobile navigation hamburger menu
8. Verify Bloch sphere on mobile (280×280, touch rotate/zoom)
9. Test circuit builder drag-and-drop on touch devices

**Reference:** `32_RELEASE_CHECKLIST.md`

---

## CRITICAL REMINDERS

### Things That WILL Break If You Get Them Wrong:
1. **Complex number multiply:** `(a+bi)(c+di) = (ac-bd) + (ad+bc)i` — NOT `(ac+bd)`
2. **Bloch coordinate mapping:** Bloch Z (up) = Three.js Y (up). Swap Y↔Z.
3. **CNOT matrix:** It's a 4×4 matrix acting on the 2-qubit state vector, NOT two separate 2×2 applications.
4. **Tensor product order:** |q0⟩ ⊗ |q1⟩, where q0 is the MORE significant qubit (index 0 = leftmost wire).
5. **Normalization drift:** Always normalize after EVERY gate application. Floating-point errors accumulate.
6. **Measurement collapse:** After measuring, the state vector MUST be set to the collapsed basis state. Don't keep the superposition.
7. **CSS import order:** `tokens.css` must be imported BEFORE `global.css`.
8. **Asset paths:** In Vite, public assets are accessed as `/assets/...` (root-relative), not `./public/assets/...`.

### Things That Are Already Done (Don't Rebuild):
- All 83 SVG icons ✓
- All 35 SVG illustrations and backgrounds ✓
- 3 system SVGs (loading, 404, error) ✓
- Bloch sphere GLTF model ✓
- Gate state presets JSON ✓
- 7 self-hosted font files + fonts.css ✓
- site.webmanifest ✓
- All 32 documentation files ✓
