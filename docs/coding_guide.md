# CODING GUIDE — QUANTUM UNIVERSE

> **This file is the single source of truth for implementing the Quantum Universe web application.** Any model or developer reading ONLY this file and the `implementation_plan.md` should be able to build the complete project from scratch using the existing assets. No guessing is required.

---

## 0. ABSOLUTE RULES — READ BEFORE WRITING ANY CODE

1. **NEVER use raw hex colors.** Every color is a CSS variable defined in `tokens.css`. Write `var(--color-midnight)`, never `#071018`.
2. **NEVER import engine functions into React components directly.** Components call Store actions. Store actions call the Engine.
3. **NEVER mutate state.** Always return new objects in the Zustand store.
4. **NEVER animate `width`, `height`, `top`, `left`.** Only animate `transform` and `opacity`.
5. **NEVER introduce colors outside the 8-color palette** (see Section 2).
6. **NEVER use Tailwind CSS.** Use CSS Modules + CSS Custom Properties.
7. **The Quantum Engine has ZERO npm dependencies.** Only native TypeScript.
8. **The references/ folder is NEVER used in the application.** Its contents are developer-only.

---

## 1. PROJECT SCAFFOLD

Run these exact commands to create the project:

```bash
npm create vite@latest quantum-universe -- --template react-ts
cd quantum-universe

# Core
npm install react-router-dom zustand framer-motion

# 3D
npm install three @react-three/fiber @react-three/drei

# Drag & Drop
npm install @dnd-kit/core @dnd-kit/sortable

# Dev
npm install -D vitest @testing-library/react @testing-library/jest-dom eslint prettier @types/three
```

After scaffolding, copy the entire existing `assets/` folder into `public/assets/`.

---

## 2. THE COLOR PALETTE — MEMORIZE THIS

Every visual element in the app uses EXACTLY these colors:

```css
:root {
  --color-midnight:   #071018;   /* body/page backgrounds */
  --color-deep-navy:  #0B132B;   /* visualization canvas backgrounds */
  --color-solstice:   #1C2B38;   /* cards, glass panels */
  --color-polar:      #38506A;   /* borders, wires, separators */
  --color-icicle:     #446983;   /* interactive accents, focus rings, selection */
  --color-light-blue: #3A506B;   /* gradient midpoints */
  --color-arctic:     #7991A8;   /* secondary text, subtle highlights */
  --color-white:      #FFFFFF;   /* headings, notation, important values */

  /* Semantic (sparingly used) */
  --color-success:    #4A9B7F;
  --color-warning:    #8A7A4A;
  --color-error:      #8A4A4A;
  --color-state-zero: #7991A8;
  --color-state-one:  #446983;
}
```

---

## 3. COMPLETE FILE TREE TO BUILD

```
quantum-universe/
├── public/
│   ├── favicon.ico                          (generate from quantum-universe-icon.svg)
│   ├── apple-touch-icon.png                 (180x180 from icon SVG)
│   ├── site.webmanifest                     (already exists in assets/)
│   └── assets/                              (COPY entire assets/ folder here)
│       ├── 3d/
│       │   ├── bloch-sphere.gltf
│       │   └── gate-state-presets.json
│       ├── fonts/
│       │   ├── fonts.css                    (@font-face declarations)
│       │   ├── inter-300.woff2
│       │   ├── inter-400.woff2
│       │   ├── inter-500.woff2
│       │   ├── inter-600.woff2
│       │   ├── inter-700.woff2
│       │   ├── jetbrains-mono-400.woff2
│       │   └── jetbrains-mono-500.woff2
│       ├── icons/
│       │   ├── navigation/   (9 SVGs: home, menu, arrow-left/right, chevron-down/right, external-link, info, help-circle)
│       │   ├── quantum/      (17 SVGs: atom, bit, qubit, superposition, measurement, entanglement, etc.)
│       │   ├── gates/        (8 SVGs: gate-H, gate-X, gate-Y, gate-Z, gate-S, gate-T, gate-CNOT, gate-SWAP)
│       │   ├── experiments/  (10 SVGs: flask, experiment, play, reset, check, target, steps, history, result, random)
│       │   ├── circuit/      (12 SVGs: add, remove, trash, copy, download, upload, drag, move, lock, unlock, add-qubit, delete-qubit)
│       │   ├── visualization/ (12 SVGs: chart, probability, activity, rotate-3d, zoom-in/out, fullscreen, minimize, compass, crosshair, layers, state-vector)
│       │   └── ui/           (15 SVGs: search, settings, close, plus, minus, play, pause, refresh, edit, warning, error, more-horizontal/vertical, eye, eye-off)
│       ├── images/
│       │   ├── backgrounds/
│       │   │   ├── global/           (quantum-universe-global-bg.svg, quantum-grid.svg, quantum-particles.svg, quantum-wave.svg)
│       │   │   ├── gate-visualizer/  (gate-visualizer-bg.svg)
│       │   │   ├── experiment-lab/   (experiment-lab-bg.svg)
│       │   │   ├── entanglement/     (entanglement-bg.svg)
│       │   │   └── circuit-builder/  (circuit-builder-bg.svg)
│       │   ├── illustrations/
│       │   │   ├── quantum-universe/ (bit-vs-qubit.svg, superposition.svg, measurement.svg, quantum-gates.svg, entanglement.svg, quantum-circuit.svg)
│       │   │   ├── gate-visualizer/  (x-gate.svg, y-gate.svg, z-gate.svg, h-gate.svg, s-gate.svg, t-gate.svg)
│       │   │   ├── experiment-lab/   (experiment-superposition.svg, experiment-bit-flip.svg, measurement-results.svg)
│       │   │   ├── entanglement/     (entanglement-state.svg, bell-state.svg)
│       │   │   ├── circuit-builder/  (circuit-builder.svg, controlled-gate.svg, circuit-results.svg)
│       │   │   └── system/           (loading-quantum.svg, page-not-found.svg, simulation-error.svg)
│       │   └── branding/
│       │       ├── logo/        (quantum-universe-logo.svg, quantum-universe-mark.svg, quantum-universe-icon.svg)
│       │       └── decorative/  (quantum-orbit.svg)
│       └── references/          (DO NOT USE IN APP — dev reference only)
│
├── src/
│   ├── main.tsx                              (entry point)
│   ├── App.tsx                               (router + layout shell)
│   │
│   ├── types/
│   │   └── quantum.ts                       (ALL TypeScript types — shared globally)
│   │
│   ├── engine/                               (ZERO npm deps — pure math)
│   │   ├── math/
│   │   │   ├── complex.ts                    (Complex number arithmetic)
│   │   │   ├── matrix.ts                     (2x2 and 4x4 matrix-vector multiply)
│   │   │   └── vector.ts                     (normalize, inner product, tensor product)
│   │   ├── qubit.ts                          (createZeroState, createOneState, etc.)
│   │   ├── gates.ts                          (GATE_MATRICES constant + applyGate)
│   │   ├── measurement.ts                    (getProbabilities, measure, getBlochCoordinates)
│   │   ├── multiQubit.ts                     (tensorProduct, applyCNOT, applySWAP, isEntangled)
│   │   ├── circuit.ts                        (executeCircuit orchestrator)
│   │   └── index.ts                          (barrel export of public API)
│   │
│   ├── store/                                (Zustand — calls engine, exposes state)
│   │   ├── quantumStore.ts                   (root store composing slices)
│   │   ├── gateVisualizerSlice.ts            (Page 2 state)
│   │   ├── experimentSlice.ts                (Page 3 state)
│   │   ├── entanglementSlice.ts              (Page 4 state)
│   │   ├── circuitSlice.ts                   (Page 5 state)
│   │   └── index.ts
│   │
│   ├── styles/
│   │   ├── tokens.css                        (ALL CSS custom properties — the design system)
│   │   ├── global.css                        (resets, body, scrollbar, font imports)
│   │   └── animations.css                    (keyframes and shared animation classes)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navigation.tsx + .module.css
│   │   │   └── PageShell.tsx + .module.css
│   │   ├── shared/
│   │   │   ├── QuantumPanel.tsx + .module.css  (glassmorphism card)
│   │   │   ├── DiracNotation.tsx + .module.css (renders |ψ⟩ labels)
│   │   │   ├── ProbabilityBar.tsx + .module.css
│   │   │   ├── GateButton.tsx + .module.css
│   │   │   ├── MeasurementResult.tsx + .module.css
│   │   │   └── Icon.tsx                        (loads SVGs from /assets/icons/)
│   │   ├── bloch/
│   │   │   └── BlochSphere.tsx                (R3F Canvas wrapper)
│   │   ├── circuit/
│   │   │   ├── CircuitGrid.tsx + .module.css
│   │   │   ├── CircuitWire.tsx
│   │   │   └── GateToken.tsx + .module.css
│   │   └── experiment/
│   │       ├── ExperimentCard.tsx + .module.css
│   │       └── StepDisplay.tsx + .module.css
│   │
│   ├── visualization/
│   │   ├── bloch/
│   │   │   ├── BlochScene.ts                  (Three.js scene: sphere, axes, labels)
│   │   │   ├── BlochSphere3D.ts               (mesh + material)
│   │   │   ├── StateVector.ts                 (arrow + glow dot)
│   │   │   └── BlochAnimator.ts               (SLERP interpolation)
│   │   ├── particles/
│   │   │   └── QuantumParticles.ts            (canvas particle system)
│   │   └── circuit/
│   │       └── CircuitDiagram.ts              (SVG circuit renderer)
│   │
│   ├── pages/
│   │   ├── QuantumUniverse.tsx + .module.css   (Page 1: Educational)
│   │   ├── GateVisualizer.tsx + .module.css    (Page 2: Interactive Bloch)
│   │   ├── ExperimentLab.tsx + .module.css     (Page 3: Guided experiments)
│   │   ├── EntanglementSim.tsx + .module.css   (Page 4: Two-qubit)
│   │   ├── CircuitBuilder.tsx + .module.css    (Page 5: Drag-and-drop)
│   │   └── NotFound.tsx + .module.css          (404 page)
│   │
│   └── hooks/
│       ├── useReducedMotion.ts                 (reads prefers-reduced-motion)
│       └── useScrollReveal.ts                  (IntersectionObserver trigger)
│
├── index.html
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 4. BUILD ORDER — FOLLOW THIS EXACT SEQUENCE

### PHASE 1: Foundation (Build First — Everything Depends On This)
```
Step 1:  src/types/quantum.ts
Step 2:  src/styles/tokens.css
Step 3:  src/styles/global.css
Step 4:  src/styles/animations.css
Step 5:  vite.config.ts (path aliases)
Step 6:  index.html (meta, fonts, favicon)
```

### PHASE 2: Quantum Engine (No UI — Pure Math)
```
Step 7:  src/engine/math/complex.ts
Step 8:  src/engine/math/matrix.ts
Step 9:  src/engine/math/vector.ts
Step 10: src/engine/qubit.ts
Step 11: src/engine/gates.ts
Step 12: src/engine/measurement.ts
Step 13: src/engine/multiQubit.ts
Step 14: src/engine/circuit.ts
Step 15: src/engine/index.ts
```

### PHASE 3: State Management
```
Step 16: src/store/gateVisualizerSlice.ts
Step 17: src/store/experimentSlice.ts
Step 18: src/store/entanglementSlice.ts
Step 19: src/store/circuitSlice.ts
Step 20: src/store/quantumStore.ts
Step 21: src/store/index.ts
```

### PHASE 4: Shared Components
```
Step 22: src/hooks/useReducedMotion.ts
Step 23: src/hooks/useScrollReveal.ts
Step 24: src/components/shared/Icon.tsx
Step 25: src/components/shared/QuantumPanel.tsx
Step 26: src/components/shared/DiracNotation.tsx
Step 27: src/components/shared/ProbabilityBar.tsx
Step 28: src/components/shared/GateButton.tsx
Step 29: src/components/shared/MeasurementResult.tsx
Step 30: src/components/layout/Navigation.tsx
Step 31: src/components/layout/PageShell.tsx
```

### PHASE 5: 3D Visualization
```
Step 32: src/visualization/bloch/BlochSphere3D.ts
Step 33: src/visualization/bloch/StateVector.ts
Step 34: src/visualization/bloch/BlochAnimator.ts
Step 35: src/visualization/bloch/BlochScene.ts
Step 36: src/components/bloch/BlochSphere.tsx
Step 37: src/visualization/particles/QuantumParticles.ts
```

### PHASE 6: Pages (Build in Order)
```
Step 38: src/App.tsx (router skeleton)
Step 39: src/main.tsx
Step 40: src/pages/QuantumUniverse.tsx    (Page 1)
Step 41: src/pages/GateVisualizer.tsx     (Page 2)
Step 42: src/pages/ExperimentLab.tsx      (Page 3)
Step 43: src/pages/EntanglementSim.tsx    (Page 4)
Step 44: src/pages/CircuitBuilder.tsx     (Page 5)
Step 45: src/pages/NotFound.tsx           (404)
```

---

## 5. CRITICAL IMPLEMENTATIONS — COPY EXACTLY

### 5.1 tokens.css — THE DESIGN SYSTEM

```css
:root {
  /* ── Colors ── */
  --color-midnight: #071018;
  --color-deep-navy: #0B132B;
  --color-solstice: #1C2B38;
  --color-polar: #38506A;
  --color-icicle: #446983;
  --color-light-blue: #3A506B;
  --color-arctic: #7991A8;
  --color-white: #FFFFFF;
  --color-success: #4A9B7F;
  --color-warning: #8A7A4A;
  --color-error: #8A4A4A;
  --color-state-zero: #7991A8;
  --color-state-one: #446983;

  /* ── Gradients ── */
  --gradient-bg-main: linear-gradient(160deg, #071018 0%, #0B132B 100%);
  --gradient-panel: linear-gradient(135deg, rgba(28,43,56,0.85) 0%, rgba(7,16,24,0.95) 100%);
  --gradient-visualization: linear-gradient(180deg, #0B132B 0%, #071018 100%);
  --gradient-header: linear-gradient(90deg, #071018 0%, #1C2B38 50%, #071018 100%);
  --gradient-accent: linear-gradient(90deg, #446983 0%, #7991A8 100%);
  --gradient-gate-button: linear-gradient(135deg, #1C2B38 0%, #38506A 100%);
  --gradient-gate-button-hover: linear-gradient(135deg, #38506A 0%, #446983 100%);

  /* ── Typography ── */
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-display: 3.5rem;
  --text-h1: 2.5rem;
  --text-h2: 1.75rem;
  --text-h3: 1.25rem;
  --text-body-lg: 1.125rem;
  --text-body: 1rem;
  --text-body-sm: 0.875rem;
  --text-label: 0.75rem;
  --text-mono: 1rem;
  --text-mono-lg: 1.5rem;

  /* ── Spacing (4px grid) ── */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-5: 20px; --space-6: 24px;
  --space-8: 32px; --space-10: 40px; --space-12: 48px;
  --space-16: 64px; --space-20: 80px;

  /* ── Border Radius ── */
  --radius-sm: 4px;  --radius-md: 8px;  --radius-lg: 12px;
  --radius-xl: 16px; --radius-2xl: 24px; --radius-full: 9999px;

  /* ── Z-Index ── */
  --z-base: 0;  --z-visualization: 10; --z-panel: 20;
  --z-controls: 30; --z-navigation: 100; --z-tooltip: 200; --z-overlay: 300;

  /* ── Shadows ── */
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-visualization: 0 0 64px rgba(11,19,43,0.8);

  /* ── Icon Sizes ── */
  --icon-xs: 14px; --icon-sm: 16px; --icon-md: 20px;
  --icon-lg: 24px; --icon-xl: 32px; --icon-2xl: 48px;
}
```

### 5.2 global.css

```css
@import '../../../public/assets/fonts/fonts.css';
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { font-size: 16px; -webkit-font-smoothing: antialiased; }

body {
  font-family: var(--font-primary);
  font-weight: 400;
  line-height: 1.6;
  color: var(--color-arctic);
  background: var(--gradient-bg-main);
  min-height: 100vh;
  overflow-x: hidden;
}

h1, h2, h3, h4 { color: var(--color-white); font-weight: 700; line-height: 1.2; }
h1 { font-size: var(--text-h1); }
h2 { font-size: var(--text-h2); font-weight: 600; }
h3 { font-size: var(--text-h3); font-weight: 600; }

a { color: var(--color-icicle); text-decoration: none; }

:focus-visible {
  outline: 2px solid var(--color-icicle);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

::selection { background: rgba(68, 105, 131, 0.4); color: var(--color-white); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--color-midnight); }
::-webkit-scrollbar-thumb { background: var(--color-polar); border-radius: var(--radius-full); }

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 5.3 TypeScript Types (quantum.ts)

```typescript
// ── Complex Number ──
export interface Complex { re: number; im: number; }

// ── State Vectors ──
export type StateVector1Q = [Complex, Complex];
export type StateVector2Q = [Complex, Complex, Complex, Complex];

// ── Gates ──
export type GateId = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'CNOT' | 'SWAP';
export type Matrix2x2 = [[Complex, Complex], [Complex, Complex]];

// ── Measurement ──
export type MeasurementOutcome1Q = '0' | '1';
export type MeasurementOutcome2Q = '00' | '01' | '10' | '11';
export type ProbabilityMap = Record<string, number>;

// ── Circuit ──
export interface GatePlacement {
  id: string;
  type: GateId;
  wire: number | [number, number];
  column: number;
}
export interface CircuitDefinition { qubits: number; gates: GatePlacement[]; shots?: number; }
export interface CircuitResult {
  finalState: Complex[];
  probabilities: Record<string, number>;
  measurements?: Record<string, number>;
  error?: string;
}

// ── Experiment ──
export interface ExperimentStep {
  description: string;
  action: 'applyGate' | 'measure' | 'reset';
  gate?: GateId;
  targetWire?: number;
}
export interface ExperimentDefinition {
  id: string; title: string; description: string; objective: string;
  initialState: StateVector1Q | StateVector2Q;
  steps: ExperimentStep[];
  expectedOutcome: string; explanation: string;
}

// ── Store ──
export interface GateHistoryEntry {
  gate: GateId;
  stateBefore: StateVector1Q;
  stateAfter: StateVector1Q;
  timestamp: number;
}
```

### 5.4 Gate Matrices (gates.ts)

The exact gate matrices to implement:

```
X = [[{re:0,im:0}, {re:1,im:0}],
     [{re:1,im:0}, {re:0,im:0}]]

Y = [[{re:0,im:0}, {re:0,im:-1}],
     [{re:0,im:1}, {re:0,im:0}]]

Z = [[{re:1,im:0}, {re:0,im:0}],
     [{re:0,im:0}, {re:-1,im:0}]]

H = [[{re:1/√2,im:0}, {re:1/√2,im:0}],
     [{re:1/√2,im:0}, {re:-1/√2,im:0}]]

S = [[{re:1,im:0}, {re:0,im:0}],
     [{re:0,im:0}, {re:0,im:1}]]

T = [[{re:1,im:0}, {re:0,im:0}],
     [{re:0,im:0}, {re:cos(π/4),im:sin(π/4)}]]
       (= {re: 0.7071067811865476, im: 0.7071067811865476})
```

### 5.5 Bloch Sphere Coordinates Formula

```typescript
function getBlochCoordinates(state: StateVector1Q): {x: number, y: number, z: number} {
  const [alpha, beta] = state;
  const magAlpha = Math.sqrt(alpha.re**2 + alpha.im**2);
  const theta = 2 * Math.acos(Math.min(magAlpha, 1)); // clamp for safety
  const magBeta = Math.sqrt(beta.re**2 + beta.im**2);

  let phi = 0;
  if (magBeta > 1e-10) {
    phi = Math.atan2(beta.im, beta.re) - Math.atan2(alpha.im, alpha.re);
  }

  return {
    x: Math.sin(theta) * Math.cos(phi),
    y: Math.sin(theta) * Math.sin(phi),
    z: Math.cos(theta)
  };
}
```

**Three.js mapping** (Y-up in Three.js, Z-up in Bloch math):
```typescript
// In BlochScene.ts, when positioning the state vector:
const threeX = bloch.x;
const threeY = bloch.z;   // Bloch Z → Three.js Y (up)
const threeZ = bloch.y;   // Bloch Y → Three.js Z (depth)
```

### 5.6 Quantum Panel (QuantumPanel.tsx)

```css
.quantumPanel {
  background: var(--gradient-panel);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 80, 106, 0.4);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md), inset 0 1px 0 rgba(121, 145, 168, 0.08);
  padding: var(--space-6);
}
```

### 5.7 Routing Configuration (App.tsx)

```typescript
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const QuantumUniverse = lazy(() => import('./pages/QuantumUniverse'));
const GateVisualizer  = lazy(() => import('./pages/GateVisualizer'));
const ExperimentLab   = lazy(() => import('./pages/ExperimentLab'));
const EntanglementSim = lazy(() => import('./pages/EntanglementSim'));
const CircuitBuilder  = lazy(() => import('./pages/CircuitBuilder'));
const NotFound        = lazy(() => import('./pages/NotFound'));

// Routes:
// /                  → QuantumUniverse
// /gate-visualizer   → GateVisualizer
// /experiment-lab    → ExperimentLab
// /entanglement      → EntanglementSim
// /circuit-builder   → CircuitBuilder
// *                  → NotFound
```

---

## 6. ASSET USAGE CHEAT-SHEET

### Fonts
Import `public/assets/fonts/fonts.css` in `global.css`. Self-hosted, no Google Fonts network request.

### Icons
Load via `<img src="/assets/icons/{category}/{name}.svg" />` or build an `<Icon name="home" category="navigation" />` wrapper component. Apply `currentColor` via CSS `filter` if needed, or inline the SVG.

### Illustrations
Use `<img src="/assets/images/illustrations/{page}/{name}.svg" />` inside page components.

### Backgrounds
Apply via CSS: `background-image: url('/assets/images/backgrounds/{page}/{name}.svg')`.

### 3D Model
Load `bloch-sphere.gltf` via R3F's `useGLTF('/assets/3d/bloch-sphere.gltf')`.
Load `gate-state-presets.json` via standard `fetch()` for target Bloch coordinates.

### Branding
- Logo in navbar: `/assets/images/branding/logo/quantum-universe-logo.svg`
- Favicon: `/assets/images/branding/logo/quantum-universe-icon.svg`
- Decorative footer orbit: `/assets/images/branding/decorative/quantum-orbit.svg`

### System
- Loading spinner: `/assets/images/illustrations/system/loading-quantum.svg`
- 404 page: `/assets/images/illustrations/system/page-not-found.svg`
- Error boundary: `/assets/images/illustrations/system/simulation-error.svg`

---

## 7. DATA FLOW PATTERNS — HOW THINGS CONNECT

### Pattern A: Gate Application (Page 2)
```
User clicks [H] button
  → GateVisualizer.tsx calls store.applyGate('H')
    → gateVisualizerSlice:
      1. previousState = currentState
      2. currentState = engine.applyGate(currentState, 'H')
      3. probabilities = engine.getProbabilities1Q(currentState)
      4. blochCoordinates = engine.getBlochCoordinates(currentState)
      5. stateLabel = engine.getStateName(currentState)
      6. gateHistory.unshift(new entry)
      7. isAnimating = true
  → React re-renders:
    - DiracNotation cross-fades to new label
    - ProbabilityBar transitions width (400ms CSS)
    - BlochSphere SLERP animates vector (600ms)
  → BlochSphere calls onAnimationComplete → isAnimating = false
```

### Pattern B: Measurement
```
User clicks [MEASURE]
  → store.measure()
    → result = engine.measureSingle(currentState)
    → currentState = result === '0' ? createZeroState() : createOneState()
    → isMeasured = true
  → BlochSphere SNAPS (no animation) to pole
  → Gate buttons become disabled
  → "Reset to apply gates." message appears
```

### Pattern C: Circuit Execution (Page 5)
```
User clicks [RUN CIRCUIT]
  → circuitSlice: executionState = 'running'
  → engine.executeCircuit(circuitDefinition)
  → Returns { finalState, probabilities, measurements }
  → circuitSlice: executionState = 'complete', lastResult = result
  → ResultHistogram animates bars with stagger
```

---

## 8. BLOCH SPHERE — THREE.JS IMPLEMENTATION

### Scene
- Camera: PerspectiveCamera, fov 45, position [2.5, 1.5, 2.5]
- Ambient light: color #1C2B38, intensity 0.6
- Directional light: color #7991A8, intensity 1.2, pos [3, 5, 3]
- Fill light: color #446983, intensity 0.4, pos [-2, 2, -2]

### Sphere
- SphereGeometry(1.0, 64, 64)
- MeshPhysicalMaterial: color #0B132B, transparent, opacity 0.35, roughness 0.05, DoubleSide

### Axes
- Z axis: [0,0,-1.4] to [0,0,1.4], color #7991A8
- X and Y axes: same range, color rgba(68,105,131,0.7)

### Labels (using drei Html)
- |0⟩ at [0, 1.5, 0] (Three.js Y-up = Bloch Z-up)
- |1⟩ at [0, -1.5, 0]
- |+⟩ at [1.5, 0, 0]
- |-⟩ at [-1.5, 0, 0]

### State Vector Arrow
- CylinderGeometry shaft, ConeGeometry tip, color #FFFFFF
- PointLight at tip for glow: color #FFFFFF, intensity 0.8, distance 0.6

### Animation
- SLERP from previous to current over 600ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1)
- On measurement: SNAP immediately, no interpolation
- frameloop="demand" — only render during animation

### OrbitControls
- enableDamping: true, dampingFactor: 0.08
- enablePan: false
- minDistance: 2.5, maxDistance: 6.0

---

## 9. NAVIGATION BAR SPEC

```css
.nav {
  position: fixed; top: 0; width: 100%;
  height: 64px;
  background: rgba(7,16,24,0.95);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(56,80,106,0.3);
  z-index: var(--z-navigation);
}
```
- Logo (left): SVG logo + "QUANTUM UNIVERSE" text
- Nav links: Universe | Gate Visualizer | Experiment Lab | Entanglement | Circuit Builder
- Active link: white text + 2px Icicle underline (animated scaleX 0→1)
- Mobile (<768px): hamburger menu, slide-down panel

---

## 10. PAGE-BY-PAGE IMPLEMENTATION SUMMARY

### Page 1: Quantum Universe (`/`)
- Hero: 100vh, particles canvas, heading, CTA
- 6 educational sections with scroll-reveal
- Each section has an illustration SVG + interactive demo + text
- Sections call the quantum engine for real probabilistic behavior
- CTA at bottom linking to pages 2–5

### Page 2: Gate Visualizer (`/gate-visualizer`)
- Two-column: Bloch sphere left, controls right
- Gate buttons: [H] [X] [Y] [Z] [S] [T]
- State label, probability bars, explanation panel, gate history
- This is the PRIMARY interactive visualization page

### Page 3: Experiment Lab (`/experiment-lab`)
- Sidebar: list of predefined experiments
- Workspace: step-by-step progression with probability visualization
- Steps auto-advance with RUN ALL, or manual with NEXT STEP

### Page 4: Entanglement (`/entanglement`)
- Two-qubit visualization with circuit diagram
- Workflow: [Apply H to A] → [Apply CNOT] → [Measure]
- SVG connection arc between qubits with marching-ants animation
- 4-bar probability histogram

### Page 5: Circuit Builder (`/circuit-builder`)
- Sidebar gate palette (drag source)
- Main workspace: grid of qubit wires × time columns
- Drag gates from palette to grid cells
- @dnd-kit handles drag-and-drop
- RUN CIRCUIT button → engine.executeCircuit → histogram results

---

## 11. VALIDATION TEST CASES — VERIFY THESE PASS

After building the engine, run these exact assertions:

```
applyGate(|0⟩, X) === |1⟩         → probabilities: {p0:0, p1:1}
applyGate(|0⟩, H) === |+⟩         → probabilities: {p0:0.5, p1:0.5}
applyGate(|+⟩, H) === |0⟩         → H is self-inverse
applyGate(|0⟩, Z) === |0⟩         → Z does nothing to |0⟩
applyGate(|1⟩, Z) === -|1⟩        → phase flip, same probabilities
getBlochCoordinates(|0⟩) === {x:0, y:0, z:1}
getBlochCoordinates(|1⟩) === {x:0, y:0, z:-1}
getBlochCoordinates(|+⟩) === {x:1, y:0, z:0}
|α|² + |β|² === 1.0 after EVERY gate application

Two-qubit:
applyCNOT(|10⟩) === |11⟩
applyCNOT(|00⟩) === |00⟩
H(q0) then CNOT on |00⟩ → Bell state (|00⟩+|11⟩)/√2
  → probabilities: {p00:0.5, p01:0, p10:0, p11:0.5}
isEntangled(Bell state) === true
isEntangled(|00⟩) === false
```

---

## 12. ACCESSIBILITY REQUIREMENTS

- `prefers-reduced-motion`: disable particle animation, snap Bloch vector, remove scroll reveals
- `:focus-visible` ring: 2px solid var(--color-icicle)
- Bloch sphere canvas: `role="img"`, `aria-label` updates with state
- Gate buttons: `aria-label="Apply Hadamard gate"`
- After gate: `aria-live="polite"` announcement
- All keyboard navigable (Tab, Enter/Space)
- Screen-reader hidden text below canvas with coordinates

---

## 13. RESPONSIVE BREAKPOINTS

```css
/* Desktop: > 1024px — default, two-column layouts */
/* Tablet: 768–1024px */
@media (max-width: 1024px) { /* stack to single column */ }
/* Mobile: < 768px */
@media (max-width: 768px) { /* compact layouts, smaller Bloch sphere */ }
```

Bloch Sphere sizes: 420×420 desktop, 320×320 tablet, 280×280 mobile.

---

## 14. VITE CONFIG

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine': path.resolve(__dirname, 'src/engine'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@viz': path.resolve(__dirname, 'src/visualization'),
      '@types': path.resolve(__dirname, 'src/types'),
    },
  },
});
```

---

## 15. DOCUMENT REFERENCE MAP

If you need deeper specification on any topic, consult these files in `docs/`:

| Topic | File |
|:---|:---|
| Full project overview | `02_MASTER_PROJECT_SPEC.md` |
| Architecture & data flow | `03_PROJECT_ARCHITECTURE.md` |
| All npm packages & versions | `04_TECH_STACK.md` |
| Complete design system | `05_DESIGN_SYSTEM.md` |
| Navigation, tooltips, modals | `06_UI_UX.md` |
| Engine API & module map | `07_QUANTUM_ENGINE.md` |
| All gate matrices & math | `08_QUANTUM_MATHEMATICS.md` |
| Zustand store shape & actions | `09_QUANTUM_STATE_MANAGEMENT.md` |
| Gate definitions & tooltips | `10_GATE_SYSTEM.md` |
| Measurement logic | `11_MEASUREMENT_SYSTEM.md` |
| Tensor products, CNOT, SWAP | `12_MULTI_QUBIT_SYSTEM.md` |
| Page 1 full layout | `13_QUANTUM_UNIVERSE.md` |
| Page 2 full layout | `14_GATE_VISUALIZER.md` |
| Page 3 full layout | `15_EXPERIMENT_LAB.md` |
| Page 4 full layout | `16_ENTANGLEMENT_SIMULATOR.md` |
| Page 5 full layout | `17_CIRCUIT_BUILDER.md` |
| Bloch Sphere 3D scene setup | `18_3D_BLOCH_SPHERE.md` |
| Particles & charts | `19_VISUALIZATION_SYSTEM.md` |
| All animations & cursor | `20_ANIMATION_SYSTEM.md` |
| Responsive breakpoints | `21_RESPONSIVE_DESIGN.md` |
| Accessibility spec | `22_ACCESSIBILITY.md` |
| Performance budgets | `23_PERFORMANCE.md` |
| Error handling | `24_ERROR_HANDLING.md` |
| Test strategy | `25_TESTING_QA.md` |
| Development roadmap | `26_DEVELOPMENT_ROADMAP.md` |
| SEO, caching, deployment | `28_PRODUCTION_READINESS.md` |
| Asset-to-page mapping | `29_ASSET_USAGE_MAP.md` |
| Educational content copy | `30_CONTENT_SPECIFICATION.md` |
| Math test cases | `31_QUANTUM_VALIDATION_CASES.md` |
| Pre-release checklist | `32_RELEASE_CHECKLIST.md` |
