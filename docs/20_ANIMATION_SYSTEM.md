# 20. ANIMATION SYSTEM — SPECIFICATION — QYNX

---

## 1. Animation Philosophy & Guiding Principles

The **QYNX Animation System** governs all transitions, state changes, and micro-interactions across the application. Motion is employed strictly as an educational and explanatory instrument designed to answer one question:

> **"What changed in the quantum system?"**

### Core Motion Principles:
- **Precision & Purpose**: Animations visualize mathematical transformations (state vector rotations, wave-function collapses, entangling correlations).
- **Zero Decorative Gimmicks**: Prohibits ambient particle clouds, continuous pulsing halos, full-screen neon sweeps, and gaming-style HUD effects.
- **Scientific Credibility**: Easing and timing reflect physical determinism and smooth unitary rotations ($U$).
- **Performance First**: Motion is GPU-accelerated (`transform`, `opacity`) ensuring a locked 60 FPS without taxing WebGL rendering.

---

## 2. Official QYNX Color Tokens in Motion

All animation highlights, glows, and surface transitions strictly adhere to the QYNX Purple palette:

| Token | Hex Value | Motion & Transition Role |
|:---|:---|:---|
| **Purple 100** | `#1C0F30` | Root background resting state |
| **Purple 90** | `#31135E` | Visualization canvas resting state |
| **Purple 80** | `#491D8B` | Interactive panel base surface |
| **Purple 70** | `#6929C4` | Active control press and structural boundary transitions |
| **Purple 60** | `#8A3FFC` | Primary state change accent, state vector path, measurement highlight |
| **Purple 50** | `#A56EFF` | Hover transitions and secondary emphasis indicators |
| **Purple 40** | `#BE95FF` | Muted supporting axes and cursor ring indicators |
| **White** | `#FFFFFF` | Collapsed state flash, state vector apex point, primary Dirac readouts |

---

## 3. Global Motion Timings & Curves

| Animation Class | Duration | Timing Function | Usage |
|:---|:---|:---|:---|
| **Micro-Interaction** | 100–150ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Button press, gate token hover/active states |
| **State Collapse** | 150ms | `cubic-bezier(0, 0, 0.2, 1)` | Projective measurement wave-function snap |
| **Label Cross-Fade** | 200–300ms | `ease-in-out` | Dirac notation and mathematical readouts |
| **Probability Transition**| 400ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Linear probability bar adjustments |
| **Bloch SLERP Trajectory**| 600ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Unitary geodesic arc on 3D Bloch sphere |
| **Module Cross-Fade** | 200–300ms | `ease-out` | Route transitions between modules 01–05 |

---

## 4. Module-Specific Motion Specifications

### 4.1 Page 1: QUANTUM UNIVERSE
- **Section Entry**: Subtle vertical settle (`8px` upward translateY with opacity $0 \to 1$) triggered via `IntersectionObserver`.
- **Bits vs. Qubits**: Toggle snap ($150\text{ms}$) for classical switch vs. smooth continuous circular rotation for qubit state vector.
- **Wave Interference**: Restrained sinusoidal amplitude modulation explaining constructive/destructive interference.

### 4.2 Page 2: QUANTUM GATE VISUALIZER
- **State Vector Geodesic Arc**: When a gate ($X, Y, Z, H, S, T$) is dispatched, the state vector animates along the spherical geodesic path via SLERP ($600\text{ms}$).
- **Instant Collapse**: Upon measurement, the vector snaps instantaneously to north pole ($|0\rangle$) or south pole ($|1\rangle$).
- **Locking**: Gate buttons are disabled during active vector animation to prevent frame drops or invalid intermediate computations.

### 4.3 Page 3: QUANTUM EXPO LAB
- **Step Sequencing**: Progressive advancement: Step 1 $\to$ Step 2 $\to$ Step 3 with sequential element entry.
- **Sampling Histogram**: Bars expand smoothly from zero to their empirical tally over $400\text{ms}$.

### 4.4 Page 4: QUANTUM ENTANGLEMENT SIMULATOR
- **Entanglement Link**: Subtle SVG dashed arc illuminates in `Purple 60 #8A3FFC` upon CNOT application.
- **Correlated Collapse**: Simultaneous appearance of joint measurement outcomes ($|00\rangle$ or $|11\rangle$) without staggered delays, visually reinforcing non-local correlation.

### 4.5 Page 5: QUANTUM CIRCUIT BUILDER
- **Drop Docking**: Placed gate tokens settle cleanly into wire slots with a subtle $100\text{ms}$ scale settlement.
- **Execution Pipeline**: Visual progress scan line sweeps across circuit columns from left to right during simulation.

---

## 5. Accessibility & Reduced-Motion (`prefers-reduced-motion`)

When `prefers-reduced-motion: reduce` is enabled in the user's OS:
- **Instant Updates**: Bloch sphere vector teleports immediately to the target coordinate without SLERP interpolation.
- **Static Diagrams**: Background particle drift, dashed marching-ants effects, and pulse animations are completely disabled.
- **Zero Viewport Shifts**: Page transitions and scroll reveals occur via simple instantaneous opacity changes with zero vertical translation.
- **Full Operational Integrity**: All calculations, state updates, and measurement functions operate identically.
