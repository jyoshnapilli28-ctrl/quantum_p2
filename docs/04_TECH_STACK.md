# TECH STACK — QYNX

---

## 1. Technology Selection Principles

- **Precision & Reliability**: Select tools that are battle-tested, maintainable, and appropriate for scientific simulation.
- **Zero Engine Dependencies**: The shared quantum engine is strictly written in vanilla TypeScript/JavaScript with zero third-party dependencies.
- **Selective Heavy Tooling**: Heavy WebGL dependencies (Three.js) are isolated and lazy-loaded on the `/gate-visualizer` route.
- **Restrained Scientific Design**: Style with CSS Modules and CSS Custom Properties adhering to the QYNX Purple design system without fragile utility abstractions.

---

## 2. Complete Technology Stack

### 2.1 Core Framework & Runtime
| Tool | Version | Purpose | Architectural Rationale |
|:---|:---|:---|:---|
| **React** | 18.x | Component Presentation Layer | Declarative rendering, functional hooks, concurrent mode compatibility |
| **TypeScript** | 5.x | End-to-End Type Safety | Strict typing prevents numerical anomalies in state vectors and matrix transformations |
| **Vite** | 5.x | Build System & Dev Server | Fast HMR, ES module chunking, and efficient tree-shaking |

### 2.2 Routing
| Tool | Version | Purpose |
|:---|:---|:---|
| **React Router** | 6.x | Client-side routing across the five QYNX modules |

```typescript
// Route Configuration in src/App.tsx
const routes = [
  { path: '/', component: lazy(() => import('@pages/QuantumUniverse')) },
  { path: '/gate-visualizer', component: lazy(() => import('@pages/GateVisualizer')) },
  { path: '/expo-lab', component: lazy(() => import('@pages/QuantumExpoLab')) },
  { path: '/entanglement', component: lazy(() => import('@pages/EntanglementSim')) },
  { path: '/circuit-builder', component: lazy(() => import('@pages/CircuitBuilder')) },
];
```

### 2.3 State Management
| Tool | Version | Purpose |
|:---|:---|:---|
| **Zustand** | 4.x | Reactive global state store |

- `gateVisualizerSlice`: Single-qubit state vector, Bloch coordinates, gate history.
- `expoLabSlice`: Guided experiment state, step sequencing, shot counts, distribution tallies.
- `entanglementSlice`: Two-qubit state, Bell-pair creation, joint measurement counts.
- `circuitSlice`: Wire matrix, gate placement AST, simulation outputs.

### 2.4 3D Visualization & Graphics
| Tool | Version | Purpose |
|:---|:---|:---|
| **Three.js** | r165+ | 3D WebGL Bloch Sphere rendering |
| **@react-three/fiber** | 8.x | Declarative Three.js scene tree in React |
| **@react-three/drei** | 9.x | OrbitControls and canvas helper utilities |

*Note: Three.js is code-split and only loaded upon visiting `/gate-visualizer`.*

### 2.5 Animation & Motion
| Tool | Version | Purpose |
|:---|:---|:---|
| **Framer Motion** | 11.x | State-change transitions, probability bar animations, modal dialogs |

*All animations respect the system `prefers-reduced-motion` setting.*

### 2.6 Interactive Circuit Construction
| Tool | Version | Purpose |
|:---|:---|:---|
| **@dnd-kit/core** | 6.x | Accessible drag-and-drop for circuit gate placement |
| **@dnd-kit/sortable** | 8.x | Sequential gate reordering |

*Includes touch and keyboard alternatives (tap-to-select and tap-to-place) for mobile and assistive devices.*

### 2.7 Styling Architecture
| Tool | Purpose |
|:---|:---|
| **CSS Modules** | Scoped component styling |
| **CSS Custom Properties** | Global design tokens (`src/styles/tokens.css`) implementing the QYNX Purple scale |
| **Google Fonts** | Inter (UI and body copy) + JetBrains Mono (Dirac notation & mathematical equations) |

*Avoid generic utility frameworks (e.g., Tailwind) to maintain strict control over restrained surfaces, scientific contrast, and custom SVG styling.*

---

## 3. Layer Dependency Matrix

```
Layer                  Imports From
──────────────────────────────────────────────────────────────────
UI Components          ← Zustand Store, Shared Visualization Primitives
Store Slices           ← Shared Quantum Engine only
Quantum Engine         ← [ZERO IMPORTS - Pure TypeScript/Math]
Visualization System   ← Store (read-only), Three.js, Canvas/SVG APIs
Styles / Tokens        ← Global CSS Variables (--qynx-purple-*)
```

---

## 4. TypeScript Core Contracts (`src/types/quantum.ts`)

```typescript
// Complex number { re, im }
export interface Complex {
  readonly re: number;
  readonly im: number;
}

// Single-qubit state vector [alpha, beta]
export type StateVector1Q = readonly [Complex, Complex];

// Two-qubit state vector [c00, c01, c10, c11]
export type StateVector2Q = readonly [Complex, Complex, Complex, Complex];

// Supported elementary gates
export type GateId = 'X' | 'Y' | 'Z' | 'H' | 'S' | 'T' | 'CNOT' | 'SWAP';

// Bloch sphere spherical coordinates
export interface BlochCoordinates {
  readonly theta: number; // Polar angle [0, π]
  readonly phi: number;   // Azimuthal angle [0, 2π)
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

// Measurement outcomes
export type MeasurementOutcome1Q = '0' | '1';
export type MeasurementOutcome2Q = '00' | '01' | '10' | '11';

// Circuit gate AST placement
export interface GatePlacement {
  readonly id: string;
  readonly type: GateId;
  readonly wire: number | readonly [number, number];
  readonly column: number;
}

// Complete circuit definition
export interface CircuitDefinition {
  readonly qubits: number;
  readonly gates: readonly GatePlacement[];
}

// Guided experiment definition
export interface ExperimentDefinition {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly initialKet: string;
  readonly targetGate: GateId;
  readonly expectedProbability: Record<string, number>;
  readonly explanation: string;
}
```
