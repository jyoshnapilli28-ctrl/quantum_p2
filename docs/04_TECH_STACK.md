# TECH STACK — QUANTUM UNIVERSE

---

## 1. Technology Selection Principles

- Choose tools that are **well-maintained, widely adopted, and appropriate for the task**.
- Avoid over-engineering: no tool should be added unless it provides a clear, necessary benefit.
- Prefer **composition over heavy frameworks** where possible.
- The quantum engine must have **zero external dependencies** — only native JavaScript/TypeScript.
- 3D rendering requires a library (Three.js) — this is the one justified heavy dependency.

---

## 2. Complete Tech Stack

### 2.1 Core Framework

| Tool | Version | Purpose |
|------|---------|---------|
| **React** | 18.x | Component-based UI framework |
| **TypeScript** | 5.x | Type safety across engine, store, and UI |
| **Vite** | 5.x | Build tool and dev server (fast HMR) |

**Why React:** Component architecture maps cleanly to the visualization-heavy, state-reactive nature of the application. Hooks allow clean integration with Zustand.

**Why TypeScript:** The quantum engine deals with complex numbers, matrices, and state vectors. Strict typing prevents subtle bugs in mathematical operations.

**Why Vite:** Fast development iteration, built-in code splitting, and excellent TypeScript support. No Create React App overhead.

---

### 2.2 Routing

| Tool | Version | Purpose |
|------|---------|---------|
| **React Router** | 6.x | Client-side routing for five pages |

Use `createBrowserRouter` with lazy-loaded route components.

```
Route configuration:
/                   → lazy(() => import('./pages/QuantumUniverse'))
/gate-visualizer    → lazy(() => import('./pages/GateVisualizer'))
/experiment-lab     → lazy(() => import('./pages/ExperimentLab'))
/entanglement       → lazy(() => import('./pages/EntanglementSim'))
/circuit-builder    → lazy(() => import('./pages/CircuitBuilder'))
```

---

### 2.3 State Management

| Tool | Version | Purpose |
|------|---------|---------|
| **Zustand** | 4.x | Lightweight reactive global state |

**Why Zustand over Redux:** Redux is excessive for this application. Zustand provides reactive state with minimal boilerplate, direct store access from anywhere, and excellent TypeScript support. The quantum engine state (state vectors, gate history, experiment results) fits naturally into Zustand slices.

Store slices:
- `gateVisualizerSlice` — current qubit state, gate history, selected gate
- `experimentSlice` — active experiment, step index, measurement results
- `entanglementSlice` — two-qubit state, entanglement status, measurement results
- `circuitSlice` — circuit definition, execution state, results

---

### 2.4 3D Visualization

| Tool | Version | Purpose |
|------|---------|---------|
| **Three.js** | r165+ | 3D Bloch sphere rendering |
| **@react-three/fiber** | 8.x | React renderer for Three.js |
| **@react-three/drei** | 9.x | Three.js helpers (OrbitControls, Text3D, etc.) |

**Why Three.js:** The Bloch sphere requires a real 3D WebGL visualization with smooth camera interaction and state vector animation. Three.js is the industry standard for browser 3D.

**Why React Three Fiber (R3F):** Integrates Three.js cleanly into the React component tree, enabling React state to drive 3D scene updates without manual scene management.

**Lazy loading:** Three.js is only loaded when the `/gate-visualizer` route is activated. It must not inflate the initial page bundle.

---

### 2.5 Animation

| Tool | Version | Purpose |
|------|---------|---------|
| **Framer Motion** | 11.x | React component animations, page transitions |
| **GSAP** (optional) | 3.x | Complex timeline animations if Framer Motion is insufficient |

**Primary:** Use Framer Motion for:
- Page transition fades
- Gate button press animations
- Probability bar value animations
- Panel entry/exit animations
- Experiment step transitions

**Secondary (if needed):** Use GSAP for:
- Bloch sphere vector interpolation timelines (if Three.js TWEEN is insufficient)
- Complex multi-step animation sequences in the circuit builder

Do **not** use both GSAP and Framer Motion for the same element. Keep animation responsibility clear per component.

---

### 2.6 SVG / Canvas

| Tool | Purpose |
|------|---------|
| **Native SVG** (inline React) | Circuit diagrams, qubit wires, 2D gate tokens |
| **HTML Canvas** (via `useRef`) | Probability bar charts, particle background |

Do not use a charting library (Chart.js, D3) for probability bars — the bars are simple enough to implement with CSS or Canvas without the overhead of a full chart library.

---

### 2.7 Drag and Drop (Circuit Builder)

| Tool | Version | Purpose |
|------|---------|---------|
| **@dnd-kit/core** | 6.x | Drag-and-drop for circuit gate placement |
| **@dnd-kit/sortable** | 8.x | Sortable gate positions |

**Why dnd-kit over react-dnd:** dnd-kit is actively maintained, has excellent accessibility support, and works well with touch devices (important for mobile circuit building).

---

### 2.8 Styling

| Tool | Purpose |
|------|---------|
| **CSS Modules** | Component-scoped styles |
| **CSS Custom Properties** | Design tokens (colors, spacing, radii) |
| **Google Fonts (Inter + JetBrains Mono)** | Typography |

Do **not** use Tailwind CSS for this project. The glassmorphism, atmospheric gradients, and custom quantum-visualization styles require precise custom CSS that Tailwind's utility classes would make harder to maintain and read.

CSS Custom Properties are defined once in `src/styles/tokens.css` and imported globally. All components use the token variable names, not raw hex values.

---

### 2.9 Mathematical Utilities

| Tool | Purpose |
|------|---------|
| **Native JavaScript Math** | All quantum calculations |
| **Custom complex.ts module** | Complex number arithmetic |
| **Custom matrix.ts module** | 2×2 and 4×4 matrix operations |

Do **not** use mathjs, numeric.js, or any external math library. Quantum computing at 1–5 qubits requires only basic complex arithmetic that is straightforward to implement correctly in TypeScript. External math libraries add weight and abstraction.

---

### 2.10 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** (with TypeScript plugin) | Code quality |
| **Prettier** | Code formatting |
| **Vitest** | Unit tests for quantum engine |
| **@testing-library/react** | UI component tests |

---

## 3. Project Setup Commands

```bash
# Create project
npm create vite@latest quantum-universe -- --template react-ts

# Install core dependencies
npm install react-router-dom zustand framer-motion @dnd-kit/core @dnd-kit/sortable

# Install 3D visualization
npm install three @react-three/fiber @react-three/drei

# Install dev tools
npm install -D vitest @testing-library/react @testing-library/jest-dom eslint prettier

# Start dev server
npm run dev
```

---

## 4. Layer Dependency Matrix

```
Layer                  Imports From
─────────────────────────────────────────────────────
UI Components          ← Store, Visualization Layer
Store Slices           ← Quantum Engine only
Quantum Engine         ← Nothing (zero deps)
Visualization Layer    ← Store (read), Three.js, Canvas API
CSS/Styles             ← Design tokens (CSS vars)
```

---

## 5. Bundle Size Strategy

| Module | Loading Strategy | Justification |
|--------|-----------------|---------------|
| React, Zustand | Eager (main bundle) | Core framework, always needed |
| React Router | Eager | Routing active from first render |
| Framer Motion | Eager | Used on all pages |
| Three.js + R3F | Lazy (Gate Visualizer route) | Heavy; only needed for one page |
| @dnd-kit | Lazy (Circuit Builder route) | Only needed for one page |
| Page components | Lazy (per route) | Code split per page |

Target initial bundle size (excluding lazy chunks): **< 200 KB gzipped**.

---

## 6. TypeScript Configuration Requirements

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "exactOptionalPropertyTypes": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

Strict mode is **required**. The quantum engine uses complex number operations where implicit `any` types would hide critical bugs.

---

## 7. Path Aliases (vite.config.ts)

```
@engine     → src/engine/
@store      → src/store/
@components → src/components/
@pages      → src/pages/
@styles     → src/styles/
@viz        → src/visualization/
@types      → src/types/
```

---

## 8. TypeScript Type Definitions

Create a shared types file: `src/types/quantum.ts`

Key types to define:

```typescript
// Complex number
type Complex = { re: number; im: number }

// Single-qubit state vector [alpha, beta]
type StateVector1Q = [Complex, Complex]

// Two-qubit state vector [c00, c01, c10, c11]
type StateVector2Q = [Complex, Complex, Complex, Complex]

// Gate identifier
type GateId = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'CNOT' | 'SWAP'

// Measurement outcome (single)
type MeasurementOutcome1Q = '0' | '1'
type MeasurementOutcome2Q = '00' | '01' | '10' | '11'

// Probability map
type ProbabilityMap = Record<string, number>

// Circuit gate placement
type GatePlacement = {
  id: string;
  type: GateId;
  wire: number | [number, number]; // single or multi-qubit
  column: number;
}

// Complete circuit definition
type CircuitDefinition = {
  qubits: number;
  gates: GatePlacement[];
}

// Experiment step
type ExperimentStep = {
  description: string;
  action: 'applyGate' | 'measure' | 'reset';
  gate?: GateId;
  targetWire?: number;
}

// Experiment definition
type ExperimentDefinition = {
  id: string;
  title: string;
  description: string;
  objective: string;
  initialState: StateVector1Q | StateVector2Q;
  steps: ExperimentStep[];
  expectedOutcome: string;
  explanation: string;
}
```

All modules import types from `@types/quantum.ts` — never redefine types locally.
