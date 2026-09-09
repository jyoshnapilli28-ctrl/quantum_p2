# CODING GUIDE — QYNX

> **This file is the single source of truth for implementing the QYNX quantum simulation platform.** Any engineer or model reading ONLY this file and the accompanying architecture documentation will be able to implement the complete project cleanly.

---

## 0. ABSOLUTE RULES — READ BEFORE WRITING ANY CODE

1. **NEVER use raw hex colors or legacy blue tokens.** Every color is a CSS variable defined in `tokens.css`. Use the official **QYNX Purple Scale** (`var(--color-purple-100)` through `var(--color-purple-10)` and `var(--color-white)`). Never use legacy `#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, or `#3A506B`.
2. **NEVER import engine math functions into React UI components directly.** React components invoke Zustand Store actions. Store actions invoke pure functions from the Engine.
3. **NEVER mutate state in place.** Always return fresh immutable objects or arrays in Zustand slices and engine calculations.
4. **NEVER animate layout properties (`width`, `height`, `top`, `left`).** Animate only hardware-accelerated properties (`transform`, `opacity`).
5. **NEVER use Tailwind CSS.** Use CSS Modules (`*.module.css`) combined with root CSS custom properties.
6. **The Quantum Engine has ZERO external dependencies.** It is built exclusively from native TypeScript (pure complex arithmetic, matrix operations, and Born sampling).
7. **Adhere to the QYNX Diagram Visibility Standard.** All SVG wire lines must have a stroke width $\ge 2\text{px}$, vectors $\ge 3\text{px}$, and text contrast $\ge 4.5:1$ against the dark canvas. Every diagram must satisfy the 3-second comprehension rule.
8. **No ambient noise or CPU particle loops.** Ambient background particles, heavy continuous blur loops, and distracting decorative glows are strictly forbidden. UI decoration must never distract from scientific didactic utility.

---

## 1. PROJECT DEPENDENCIES & INITIALIZATION

```bash
# Initialize Vite with React + TypeScript
npm create vite@latest qynx -- --template react-ts
cd qynx

# Core UI & State
npm install react-router-dom zustand framer-motion

# 3D Bloch Sphere
npm install three @react-three/fiber @react-three/drei

# Drag & Drop Grid Interaction
npm install @dnd-kit/core @dnd-kit/sortable

# Dev Dependencies & QA
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event vitest-axe eslint prettier @types/three
```

---

## 2. THE QYNX COLOR TOKENS (tokens.css)

```css
:root {
  /* ── QYNX Purple Scale ── */
  --color-purple-10:  #F6F2FF; /* Lightest tint / highlight accents */
  --color-purple-20:  #E8DAFF; /* Soft lavender borders / tags */
  --color-purple-30:  #D4BBFF; /* Secondary text / muted notation */
  --color-purple-40:  #BE95FF; /* Interactive hover / focus rings */
  --color-purple-50:  #A56EFF; /* Primary accent / gate badges */
  --color-purple-60:  #8A3FFC; /* Brand core / active wires & vectors */
  --color-purple-70:  #6929C4; /* Selected borders / active states */
  --color-purple-80:  #491D8B; /* Card borders / grid lines */
  --color-purple-90:  #31135E; /* Panel & card surfaces */
  --color-purple-100: #1C0F30; /* Root canvas background */

  /* ── High-Contrast Text ── */
  --color-white:      #FFFFFF; /* Headings, bra-ket notation, important metrics */

  /* ── Functional Semantics ── */
  --color-success:    #42BE65; /* Circuit validation pass */
  --color-warning:    #F1C21B; /* Non-fatal warnings / state caution */
  --color-error:      #FA4D56; /* Validation failure / invalid gate */

  /* ── Gradients ── */
  --gradient-bg-main:    linear-gradient(180deg, #1C0F30 0%, #150A26 100%);
  --gradient-panel:      linear-gradient(135deg, rgba(49, 19, 94, 0.7) 0%, rgba(28, 15, 48, 0.9) 100%);
  --gradient-accent:     linear-gradient(90deg, #8A3FFC 0%, #BE95FF 100%);
  --gradient-gate-card:  linear-gradient(135deg, #31135E 0%, #491D8B 100%);

  /* ── Typography ── */
  --font-display: 'Syne', 'Cabinet Grotesk', system-ui, sans-serif;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;

  /* ── Type Scale ── */
  --text-display: 3.5rem;
  --text-h1:      2.25rem;
  --text-h2:      1.75rem;
  --text-h3:      1.25rem;
  --text-body:    1.0rem;
  --text-body-sm: 0.875rem;
  --text-caption: 0.75rem;
  --text-mono:    0.9375rem;

  /* ── Spacing (4px grid) ── */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;
  --space-12: 48px; --space-16: 64px;

  /* ── Borders & Radii ── */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* ── Shadows & Z-Index ── */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 24px rgba(138, 63, 252, 0.25);
  --z-canvas: 10;
  --z-panel: 20;
  --z-navigation: 100;
  --z-announcer: 1000;
}
```

---

## 3. PROJECT DIRECTORY ARCHITECTURE

```
src/
├── engine/                      # Zero-dependency quantum simulation core
│   ├── math/
│   │   ├── complex.ts           # Pure complex arithmetic
│   │   ├── matrix.ts            # Matrix multiplication & unitarity
│   │   └── vector.ts            # Norms & inner products
│   ├── qubit.ts                 # StateVector1Q & Bloch mapping
│   ├── gates.ts                 # 8 unitary matrices (X, Y, Z, H, S, T, CNOT, SWAP)
│   ├── measurement.ts           # Born rule probabilities & state collapse
│   ├── multiQubit.ts            # 2-qubit tensor product & Bell states
│   └── circuit.ts               # Multi-wire gate execution & validation
├── store/                       # Zustand state management
│   ├── useQynxStore.ts          # Root combined store
│   ├── gateVisualizerSlice.ts   # Page 2 state
│   ├── expoLabSlice.ts          # Page 3 state
│   ├── entanglementSlice.ts     # Page 4 state
│   ├── circuitSlice.ts          # Page 5 state
│   └── uiSlice.ts               # Navigation & modal state
├── components/                  # Reusable UI components
│   ├── canvas/
│   │   └── BlochSphere.tsx      # R3F 3D Bloch sphere
│   ├── shared/
│   │   ├── QuantumPanel.tsx     # Restrained purple card surface
│   │   ├── DiracNotation.tsx    # MathJax / bra-ket renderer
│   │   ├── ProbabilityBar.tsx   # Accessible probability meter
│   │   ├── GateButton.tsx       # Gate trigger token
│   │   └── Histogram.tsx        # Multi-shot measurement chart
│   └── layout/
│       ├── Header.tsx           # Navigation bar (01–05)
│       └── LiveAnnouncer.tsx    # Screen reader live region
├── pages/
│   ├── QuantumUniverse/         # Page 1: Foundational Educational Hub
│   ├── GateVisualizer/          # Page 2: Single-Qubit 3D Simulator
│   ├── ExpoLab/                 # Page 3: Quantum Expo Lab Sequencer
│   ├── EntanglementSimulator/   # Page 4: Bell State Simulator
│   └── CircuitBuilder/          # Page 5: Interactive Circuit Builder
└── styles/
    ├── tokens.css               # QYNX Purple Scale variables
    └── global.css               # CSS reset & base typography
```

---

## 4. ESSENTIAL ENGINE IMPLEMENTATIONS

### 4.1 Complex Arithmetic (`src/engine/math/complex.ts`)

```typescript
export interface Complex {
  re: number
  im: number
}

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im }
}

export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re
  }
}

export function conjugate(c: Complex): Complex {
  return { re: c.re, im: -c.im }
}

export function magnitudeSquared(c: Complex): number {
  return c.re * c.re + c.im * c.im
}

export function magnitude(c: Complex): number {
  return Math.sqrt(magnitudeSquared(c))
}
```

### 4.2 Single-Qubit State & Bloch Coordinates (`src/engine/qubit.ts`)

```typescript
import { Complex, magnitudeSquared } from './math/complex'

export type StateVector1Q = [Complex, Complex]

export interface BlochCoordinates {
  x: number
  y: number
  z: number
}

export function createZeroState(): StateVector1Q {
  return [{ re: 1, im: 0 }, { re: 0, im: 0 }]
}

export function getBlochCoordinates(state: StateVector1Q): BlochCoordinates {
  const [alpha, beta] = state
  // x = 2 * Re(alpha* * beta)
  const x = 2 * (alpha.re * beta.re + alpha.im * beta.im)
  // y = 2 * Im(alpha* * beta)
  const y = 2 * (alpha.re * beta.im - alpha.im * beta.re)
  // z = |alpha|² - |beta|²
  const z = magnitudeSquared(alpha) - magnitudeSquared(beta)

  return { x, y, z }
}
```

### 4.3 Three.js Coordinate Alignment Invariant

The mathematical Bloch sphere defines $Z$ pointing to the North pole ($|0\rangle = [0, 0, 1]$). Three.js uses a $Y$-up coordinate system by default. In the 3D canvas mapping:

$$\text{three\_x} = \text{bloch\_x}, \quad \text{three\_y} = \text{bloch\_z}, \quad \text{three\_z} = \text{bloch\_y}$$

---

## 5. ACCESSIBILITY & LIVE ANNOUNCER SPECIFICATION

Every state mutation must notify screen readers via a persistent live announcer component:

```tsx
// src/components/layout/LiveAnnouncer.tsx
import React from 'react'
import { useQynxStore } from '../../store/useQynxStore'

export const LiveAnnouncer: React.FC = () => {
  const announcement = useQynxStore((state) => state.ui.announcement)

  return (
    <div
      id="qynx-live-announcer"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}
    >
      {announcement}
    </div>
  )
}
```

---

## 6. DOCUMENTATION REFERENCE MAP

For in-depth mathematical derivations and design system specs, consult:

| Topic | Primary Documentation File |
|-------|----------------------------|
| Master Project Specification | `docs/02_MASTER_PROJECT_SPEC.md` |
| System Architecture & Layer Isolation | `docs/03_PROJECT_ARCHITECTURE.md` |
| QYNX Purple Scale & Typography | `docs/05_DESIGN_SYSTEM.md` |
| Mathematical Engine Contracts | `docs/07_QUANTUM_ENGINE.md` |
| Unitary Matrices & Formalisms | `docs/08_QUANTUM_MATHEMATICS.md` |
| Page 1: Educational Hub | `docs/13_QUANTUM_UNIVERSE.md` |
| Page 2: Gate Visualizer & Bloch Sphere | `docs/14_GATE_VISUALIZER.md` |
| Page 3: Quantum Expo Lab | `docs/15_EXPERIMENT_LAB.md` |
| Page 4: Entanglement Simulator | `docs/16_ENTANGLEMENT_SIMULATOR.md` |
| Page 5: Circuit Builder | `docs/17_CIRCUIT_BUILDER.md` |
| 3D Bloch Sphere Implementation | `docs/18_3D_BLOCH_SPHERE.md` |
| Testing & QA Suite | `docs/25_TESTING_QA.md` |
| 18-Phase Roadmap | `docs/26_DEVELOPMENT_ROADMAP.md` |
