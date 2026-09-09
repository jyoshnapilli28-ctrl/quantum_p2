# QYNX — Project Documentation

> **A modular, interactive, educational quantum-computing web application.**

---

## Overview

**QYNX** is an educational and interactive quantum-computing web application built with a human-designed, scientifically credible, and modern interface. It guides users progressively from basic quantum concepts through single-qubit manipulations, laboratory experiments, and multi-qubit entanglement, up to visual quantum circuit construction.

The application is a **frontend quantum simulator** driven by a single shared quantum engine executing in the client browser. It does not connect to real quantum hardware, but models state vectors, matrix transformations, and measurement collapses with mathematical fidelity.

The learning progression across the application is:
$$\text{LEARN} \longrightarrow \text{VISUALIZE} \longrightarrow \text{EXPERIMENT} \longrightarrow \text{UNDERSTAND} \longrightarrow \text{BUILD} \longrightarrow \text{SIMULATE}$$

---

## The Five Connected Modules

QYNX is composed of five interconnected modules within **one unified application**:

1. **Page 1 — QUANTUM UNIVERSE**: Foundational educational hub explaining core quantum principles (Bits vs Qubits, Superposition, Measurement, Gates, Entanglement, Circuits) with clear visual diagrams.
2. **Page 2 — QUANTUM GATE VISUALIZER**: Single-qubit exploration featuring elementary unitary gates ($X, Y, Z, H, S, T$), state probability distributions, and a dynamic 3D state-driven Bloch Sphere.
3. **Page 3 — QUANTUM EXPO LAB**: Structured interactive laboratory experiments (Superposition and Bit-Flip experiments) demonstrating single measurements, repeated shots, and state resets.
4. **Page 4 — QUANTUM ENTANGLEMENT SIMULATOR**: Two-qubit Bell-state simulation ($H + \text{CNOT}$) highlighting non-classical correlations and measurement statistics without implying physical signal wires.
5. **Page 5 — QUANTUM CIRCUIT BUILDER**: Interactive multi-qubit circuit constructor supporting $H, X, Y, Z, S, T, \text{CNOT}, \text{SWAP}$, state-vector simulation, desktop drag-and-drop, and accessible mobile tap-to-place workflows.

---

## Documentation Map

This `docs/` folder contains the **complete specification** required to build the entire application. All 27 core files are implementation-ready and maintain strict cross-document consistency.

### Foundation Documents

| File | Purpose |
|------|---------|
| `02_MASTER_PROJECT_SPEC.md` | Master product vision, branding, UI/UX principles, five modules, and requirements |
| `03_PROJECT_ARCHITECTURE.md` | Modular system architecture, separation of concerns, shared state & engine contracts |
| `04_TECH_STACK.md` | Framework, styling, 3D WebGL/Three.js, SVG, and simulation tooling |
| `05_DESIGN_SYSTEM.md` | QYNX Purple color scale, typography, restrained surfaces, diagram visibility standards |
| `06_UI_UX.md` | QYNX opening experience, global navigation (01–05), user flows, and mobile interactions |

### Quantum Engine Documents

| File | Purpose |
|------|---------|
| `07_QUANTUM_ENGINE.md` | Shared engine architecture, state representations, execution pipeline |
| `08_QUANTUM_MATHEMATICS.md` | Complex amplitudes, unitary matrices, tensor products, normalization, Bell states |
| `09_QUANTUM_STATE_MANAGEMENT.md` | Centralized state store, unidirectional flow, reactive visualization updates |
| `10_GATE_SYSTEM.md` | Gate definitions ($X, Y, Z, H, S, T, \text{CNOT}, \text{SWAP}$), matrix representations, visual styling |
| `11_MEASUREMENT_SYSTEM.md` | Single-shot wave-function collapse, repeated sampling (shots), probability distributions |
| `12_MULTI_QUBIT_SYSTEM.md` | Two-qubit state vectors, tensor products, entangling gates ($\text{CNOT}, \text{SWAP}$), Bell pairs |

### Page Specifications

| File | Module / Page |
|------|---------------|
| `13_QUANTUM_UNIVERSE.md` | Page 1 — QUANTUM UNIVERSE (Foundational educational concepts) |
| `14_GATE_VISUALIZER.md` | Page 2 — QUANTUM GATE VISUALIZER (Single-qubit gates & 3D Bloch sphere) |
| `15_EXPERIMENT_LAB.md` | Page 3 — QUANTUM EXPO LAB (Interactive superposition & bit-flip lab) |
| `16_ENTANGLEMENT_SIMULATOR.md` | Page 4 — QUANTUM ENTANGLEMENT SIMULATOR (Bell states & correlated measurement) |
| `17_CIRCUIT_BUILDER.md` | Page 5 — QUANTUM CIRCUIT BUILDER (Visual circuit constructor & simulation) |

### Visualization & Animation

| File | Purpose |
|------|---------|
| `18_3D_BLOCH_SPHERE.md` | Real interactive 3D Bloch Sphere, continuous vector trajectory animations |
| `19_VISUALIZATION_SYSTEM.md` | High-contrast diagrams, 3-second comprehension rule, probability bars, circuit grids |
| `20_ANIMATION_SYSTEM.md` | Purposeful state-change motion, reduced-motion compliance, zero gratuitous visual noise |

### Quality, Engineering & Operations

| File | Purpose |
|------|---------|
| `21_RESPONSIVE_DESIGN.md` | Desktop, tablet, and mobile layouts; touch/tap alternatives to drag-and-drop |
| `22_ACCESSIBILITY.md` | WCAG AA contrast, keyboard navigation, screen-reader quantum state descriptions |
| `23_PERFORMANCE.md` | 60 FPS WebGL rendering, canvas lifecycle, bundle optimization, memory management |
| `24_ERROR_HANDLING.md` | Beginner-friendly errors: What Happened, Why It Happened, What To Do Next |
| `25_TESTING_QA.md` | Unit/integration testing, quantum math assertions, visual diagram legibility QA |
| `26_DEVELOPMENT_ROADMAP.md` | 18-phase implementation roadmap from design system to final release |
| `27_FUTURE_EXPANSION.md` | Post-MVP exploration (Grover, Deutsch-Jozsa, QFT, noise models, Qiskit export) |

---

## Key Architectural Rules

1. **One Application, Five Modules**: QYNX is a cohesive application. The five pages share branding, navigation, design tokens, and state infrastructure.
2. **One Shared Quantum Engine**: All quantum operations, matrix multiplications, tensor products, and measurements are handled by a single engine module — never duplicated per page.
3. **Strict Separation of Concerns**: UI components $\leftrightarrow$ Visualization rendering $\leftrightarrow$ State management $\leftrightarrow$ Mathematical engine are decoupled layers.
4. **Human-Designed, Credible UI**: Content first, interaction second, decoration last. No gratuitous AI-glow, heavy neon, or blurry glassmorphism.
5. **Diagram Legibility Standard**: Every diagram must pass the 3-second comprehension rule with high contrast, legible math notation, visible arrows, and appropriate stroke weights.
6. **State-Driven Visualization**: Visual representations (like the 3D Bloch Sphere vector) are directly calculated from the underlying quantum state vector; the UI never fabricates quantum coordinates.

---

## Official QYNX Color Scale

The active design system uses the curated 10-step **QYNX Purple** scale:

| Token | Hex Value | Semantic Role |
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

*(Legacy blue palette tokens `#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, `#3A506B` are deprecated and replaced across all active design specifications).*

---

## Recommended Implementation Sequence

For engineering teams embarking on implementation:

```
26_DEVELOPMENT_ROADMAP.md   → Understand the 18-phase build sequence
02_MASTER_PROJECT_SPEC.md   → Product vision, branding & principles
05_DESIGN_SYSTEM.md         → Build QYNX design tokens & component styles
07_QUANTUM_ENGINE.md        → Build the shared math engine
08_QUANTUM_MATHEMATICS.md   → Verify complex numbers, matrices, & tensor math
10_GATE_SYSTEM.md           → Implement unitary operators & gates
11_MEASUREMENT_SYSTEM.md    → Implement projective measurement & sampling
09_QUANTUM_STATE_MANAGEMENT → Wire reactive state store & slices
13_QUANTUM_UNIVERSE.md      → Build Page 1 educational foundations
14_GATE_VISUALIZER.md       → Build Page 2 single-qubit visualizer
18_3D_BLOCH_SPHERE.md       → Integrate 3D Three.js Bloch Sphere
15_EXPERIMENT_LAB.md        → Build Page 3 Quantum Expo Lab
16_ENTANGLEMENT_SIMULATOR.md→ Build Page 4 Entanglement simulator
17_CIRCUIT_BUILDER.md       → Build Page 5 Quantum Circuit Builder
21–25 (Quality & QA docs)   → Execute responsive, accessibility, & quantum test suites
```

---

*Last updated: September 2026 | Version: 2.0.0 — QYNX Rebranded | Status: Documentation Specification Complete*
