# MASTER PROJECT SPECIFICATION — QYNX

---

## 1. Project Vision & Identity

**QYNX** is an educational, interactive, browser-based quantum computing application designed with a realistic, human-crafted, and scientifically credible product experience. It guides users progressively from basic quantum phenomena to interactive state manipulation, structured laboratory experiments, two-qubit entanglement, and visual quantum circuit construction.

The application is a **frontend quantum simulator** running entirely in the client browser. It models state vectors, unitary operators, tensor products, and projective measurements using rigorous linear algebra in JavaScript/TypeScript. It does not connect to physical quantum hardware, but faithfully reproduces ideal quantum mechanical behavior.

The pedagogical progression across QYNX is:
$$\text{LEARN} \longrightarrow \text{VISUALIZE} \longrightarrow \text{EXPERIMENT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{BUILD} \longrightarrow \text{SIMULATE}$$

### Brand Hierarchy
- **Application Brand**: **QYNX**
- **Page 1**: **QUANTUM UNIVERSE** (Foundational Education)
- **Page 2**: **QUANTUM GATE VISUALIZER** (Single-Qubit State & 3D Bloch Sphere)
- **Page 3**: **QUANTUM EXPO LAB** (Structured Guided Experiments)
- **Page 4**: **QUANTUM ENTANGLEMENT SIMULATOR** (Two-Qubit Non-Classical Correlations)
- **Page 5**: **QUANTUM CIRCUIT BUILDER** (Visual Circuit Construction & Simulation)

---

## 2. Product Design Philosophy: Human-Designed & Realistic

QYNX rejects the stereotypical "AI-generated sci-fi dashboard" aesthetic characterized by dark-blue neon wash, excessive blur, oversized glass cards, and meaningless ambient particle clouds. Instead, it adheres to rigorous product-design standards:

> **"Design for clarity, credibility, usability, and intentionality before decoration. Content first, interaction second, decoration last."**

### Explicit Prohibitions:
- **No excessive glassmorphism**: Frosted glass must not be applied indiscriminately. Use restrained surface contrast (`Purple 80` with clean borders).
- **No excessive glow or neon wash**: Avoid uncontrolled `box-shadow` or neon halos that obscure text and data.
- **No decorative circuit tracings**: Do not scatter random circuit lines or pseudo-quantum glyphs across the interface.
- **No meaningless floating particles**: Ambient motion must not compete with educational diagrams or 3D viewports.
- **No oversized typography without hierarchy**: Maintain structured scale ratios suited to scientific data presentation.

### Required Product Standards:
- **Strong Information Hierarchy**: Prominent titles, clear subtitles, high-contrast readable mathematical labels.
- **Restrained Surface Design**: Surfaces provide structural depth and separation without compromising legibility.
- **Diagram Visibility Standard**: Every diagram must be understandable within 3 seconds. Text and arrows must have strong contrast against their backgrounds.
- **Predictable Controls**: Buttons, sliders, switches, and gate tiles have obvious interactive affordances.

---

## 3. QYNX Opening Experience

When a user first opens QYNX, a restrained, professional brand introduction establishes application identity:

1. **Brand Mark Presentation**: Clean presentation of the QYNX wordmark and geometric logo mark rendered in `Purple 10` and `Purple 60`.
2. **Restrained Entrance Animation**: Subtle opacity fade-in (300ms) with a gentle vertical settlement (8px translateY), avoiding bombastic cinematic sequences.
3. **Application Transition**: Smooth cross-fade directly into the active route (`Page 1: QUANTUM UNIVERSE` by default).
4. **Accessibility & Reduced Motion**: If `prefers-reduced-motion: reduce` is enabled, the entrance animation is bypassed immediately.
5. **Fallback Behavior**: In environments with slow network or WebGL initialization, the brand shell renders instantly with zero blocking delay.

---

## 4. Application Structure & Module Progression

QYNX consists of **five connected modules within one unified application shell**:

```
QYNX APPLICATION SHELL
│
├── 01 QUANTUM UNIVERSE              (Foundational Educational Hub)
├── 02 QUANTUM GATE VISUALIZER       (Single-Qubit Unitary Gates & 3D Bloch Sphere)
├── 03 QUANTUM EXPO LAB              (Structured Laboratory Experiments)
├── 04 QUANTUM ENTANGLEMENT SIMULATOR(Two-Qubit Bell States & Non-Classical Correlations)
└── 05 QUANTUM CIRCUIT BUILDER       (Multi-Qubit Circuit Constructor & Execution)
```

---

## 5. Module Specifications

### Page 1 — QUANTUM UNIVERSE
The educational bedrock of QYNX. Answers "What is quantum computing?" through structured progressive disclosure across nine core topics:
1. **What is Quantum Computing?**: Foundational paradigm shift from classical bits to quantum superpositions.
2. **What are Bits?**: Binary state representations ($0$ or $1$) in classical computing.
3. **Bits vs. Qubits**: Mathematical and visual comparison between discrete switches and continuum state vectors.
4. **What is Superposition?**: Linear combinations $\alpha|0\rangle + \beta|1\rangle$ and amplitude normalization $|\alpha|^2 + |\beta|^2 = 1$.
5. **What is Measurement?**: Wave-function collapse, Born rule probabilities, and observer effect.
6. **What are Quantum Gates?**: Unitary matrix transformations preserving state normalization.
7. **Types of Quantum Gates**: Single-qubit Pauli gates ($X, Y, Z$), Hadamard ($H$), phase gates ($S, T$), and multi-qubit gates.
8. **What is Entanglement?**: Non-separable multi-qubit states and non-local correlations.
9. **What are Quantum Circuits?**: Wire grids, gate timelines, and measurement stages.

All concepts feature clear, high-contrast SVG diagrams adhering to the Diagram Visibility Rule.

### Page 2 — QUANTUM GATE VISUALIZER
Interactive single-qubit simulator driven by the shared quantum engine:
- **Unitary Gate Palette**: $X, Y, Z, H, S, T$.
- **Real 3D Bloch Sphere**: Dynamic Three.js visualization representing state vector $[\theta, \phi]$.
- **Continuous Trajectory Animation**: Applying a gate animates the state vector along the geodesic arc on the sphere surface.
- **Mathematical Readout**: Dirac notation readout ($|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$), complex amplitude components, and exact probabilities ($P(|0\rangle), P(|1\rangle)$).
- **Gate Application History**: Step-by-step audit log with undo/redo capabilities.

### Page 3 — QUANTUM EXPO LAB
A guided scientific laboratory providing structured experiments:
- **Superposition Experiment**: Apply $H$ to $|0\rangle \to |+\rangle$, examine $50\%/50\%$ probabilities, run single shots vs. 1,000 shots.
- **Bit-Flip Experiment**: Apply $X$ to $|0\rangle \to |1\rangle$, verify deterministic transition, and test reset behavior.
- **Step-by-Step Workflow**: Objective $\to$ Starting State $\to$ User Action $\to$ Unitary Execution $\to$ Measurement $\to$ Explanation.
- **Distinction Between State & Outcome**: Explicitly separates theoretical state probability from probabilistic single-shot outcomes.

### Page 4 — QUANTUM ENTANGLEMENT SIMULATOR
Two-qubit interactive entanglement laboratory:
- **Bell-State Generation**: Create $|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$ using $H$ on $q_0$ followed by $\text{CNOT}(q_0 \to q_1)$.
- **Correlated Measurement**: Measure both qubits; demonstrate that outcomes are always identical ($00$ or $11$, each with $50\%$ probability) with zero occurrences of $01$ or $10$.
- **Pedagogical Integrity**: Explains entanglement as mathematical state non-separability, explicitly refuting misconceptions of physical transmission cables or classical radio signals.

### Page 5 — QUANTUM CIRCUIT BUILDER
Visual quantum algorithm workspace:
- **Qubit Register**: Up to 4 qubit wires ($q_0$ through $q_3$) initialized to $|0\rangle$.
- **Supported Gates**: $H, X, Y, Z, S, T, \text{CNOT}, \text{SWAP}$.
- **Dual Interaction Patterns**: Desktop drag-and-drop onto circuit grid + accessible mobile tap-to-select and tap-to-place workflows.
- **Circuit Simulation**: Compiles circuit into unitary transformation sequence executed by the shared quantum engine.
- **Measurement Distribution**: Aggregated histogram displaying probabilities across all $2^n$ computational basis states.

---

## 6. Official QYNX Color System

All active UI surfaces, borders, text, diagrams, and visualizations use the official **QYNX Purple** scale:

| Token | Hex Value | Primary Semantic Usage |
|:---|:---|:---|
| **Purple 10** | `#F6F2FF` | Lightest surfaces, subtle educational callout backgrounds |
| **Purple 20** | `#E8DAFF` | Light secondary surfaces, highlighted badges |
| **Purple 30** | `#D4BBFF` | Soft borders, diagram structural lines, disabled elements |
| **Purple 40** | `#BE95FF` | Secondary text, muted interactive controls, supporting axes |
| **Purple 50** | `#A56EFF` | Secondary visual accent, emphasis indicators |
| **Purple 60** | `#8A3FFC` | Primary interactive accent, state vector, active quantum operations |
| **Purple 70** | `#6929C4` | Strong active states, selected controls, key diagram boundaries |
| **Purple 80** | `#491D8B` | Dark cards, panel surfaces, navigation containers |
| **Purple 90** | `#31135E` | Deep canvas backgrounds, immersive visualization viewports |
| **Purple 100** | `#1C0F30` | Primary application background, deepest workspace canvas |
| **White** | `#FFFFFF` | Primary readable text, quantum notation ($|0\rangle, |1\rangle$), key results |

*(Legacy tokens `#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, `#3A506B` are completely replaced).*

---

## 7. Diagram Legibility & Visibility Standards

Quantum diagrams are scientific learning tools, not decorative illustrations. All SVG and canvas diagrams must satisfy:
1. **The 3-Second Rule**: A user must grasp the core relationship (input state $\to$ operator $\to$ output state) within 3 seconds.
2. **High Contrast Ratios**: All mathematical labels and state vectors must maintain at least 4.5:1 contrast against their immediate surface.
3. **Stroke Weight & Arrow Visibility**: Wire lines $\ge 2\text{px}$ (`Purple 40`), active state paths $\ge 3\text{px}$ (`Purple 60`), arrowheads prominent and unambiguously oriented.
4. **Symbol Distinction**: Gate symbols ($X, H, \text{CNOT}$) must be instantly distinguishable through distinct glyph geometry, not subtle color variations alone.

---

## 8. Technical Architecture & Shared Engine

```
┌─────────────────────────────────────────────────────────────┐
│                    QYNX PRESENTATION LAYER                  │
│       React Components, Unified Shell, Global Navigation    │
├─────────────────────────────────────────────────────────────┤
│                    VISUALIZATION SYSTEM                     │
│    3D Bloch Sphere (Three.js), Circuit Canvas, SVG Diagrams │
├─────────────────────────────────────────────────────────────┤
│                   STATE MANAGEMENT LAYER                    │
│    Zustand Store, Unidirectional Dispatch, Slices          │
├─────────────────────────────────────────────────────────────┤
│                    SHARED QUANTUM ENGINE                    │
│   Complex Math, Unitary Matrices, Tensor Products, born Rule│
└─────────────────────────────────────────────────────────────┘
```

- **Strict Isolation**: The Quantum Engine contains pure TypeScript/JavaScript mathematical functions. It has zero dependencies on React, Three.js, or DOM APIs.
- **Single Source of Truth**: All five modules consume the same engine. When a gate is applied in the Circuit Builder, it invokes the exact same matrix multiplication routine used by the Gate Visualizer.

---

## 9. Global Navigation Specification

A persistent, responsive navigation bar anchors the QYNX application:

```
[ QYNX ❖ ]   [01 QUANTUM UNIVERSE] [02 GATE VISUALIZER] [03 EXPO LAB] [04 ENTANGLEMENT] [05 CIRCUIT BUILDER]
```

- **Active Indicator**: High-contrast `Purple 60` bottom bar (3px) and `White` text.
- **Hover Affordance**: Subtle transition to `Purple 20` text on `Purple 80` background.
- **Mobile View**: Collapses gracefully into a full-height slide-out drawer with 44px minimum tap targets.
- **Keyboard Navigation**: Full `Tab`, `ArrowKey`, and `Enter`/`Space` support with visible focus rings (`Purple 40`).

---

## 10. Development Roadmap Summary (Phases 1–18)

1. **Phase 1**: Documentation Revision (Rebranding, Design System, Diagrams).
2. **Phase 2**: QYNX Design System Definition (Tokens, Purple Scale, UI Components).
3. **Phase 3**: Quantum Mathematics Validation (Complex Numbers, Linear Algebra).
4. **Phase 4**: Shared Quantum Engine Validation (Unitary Ops, Tensor Products).
5. **Phase 5**: QYNX Application Shell & Branding Implementation.
6. **Phase 6**: Page 1 — Quantum Universe Implementation.
7. **Phase 7**: Page 2 — Quantum Gate Visualizer Implementation.
8. **Phase 8**: 3D Bloch Sphere Component & Dynamic Animation.
9. **Phase 9**: Page 3 — Quantum Expo Lab Implementation.
10. **Phase 10**: Page 4 — Quantum Entanglement Simulator Implementation.
11. **Phase 11**: Page 5 — Quantum Circuit Builder Implementation.
12. **Phase 12**: Visualization QA (Diagram Legibility & 3-Second Rule).
13. **Phase 13**: Animation QA (State-Driven Transitions & Reduced Motion).
14. **Phase 14**: Responsive Design QA (Mobile, Tablet, Desktop).
15. **Phase 15**: Accessibility QA (WCAG 2.1 AA, Screen Reader, Focus).
16. **Phase 16**: Performance QA (WebGL 60 FPS, Bundle Optimization).
17. **Phase 17**: Quantum Simulation Correctness QA (Mathematical Assertions).
18. **Phase 18**: Final Product Polish & Production Readiness.

---

## 11. Architectural Integrity Invariants

| Invariant | Rule |
|:---|:---|
| **I1** | QYNX is one cohesive product; individual pages are modules, not standalone apps. |
| **I2** | Quantum calculations are never executed inside React components or visualization loops. |
| **I3** | Visualizations passively subscribe to state updates; they never fabricate or mutate quantum states. |
| **I4** | The Bloch Sphere vector position is mathematically derived from the complex state vector $[\alpha, \beta]$. |
| **I5** | The application explicitly communicates that it is a mathematical simulation, not physical quantum hardware. |
