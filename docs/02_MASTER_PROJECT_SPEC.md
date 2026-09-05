# MASTER PROJECT SPECIFICATION — QUANTUM UNIVERSE

---

## 1. Project Vision

Quantum Universe is an interactive, educational, browser-based quantum computing simulator. It teaches fundamental quantum computing concepts through immersive 3D visualizations, guided experiments, and a hands-on quantum circuit builder.

The application does **not** connect to real quantum hardware. It is a **frontend simulator** — all quantum mathematics are computed in JavaScript inside the user's browser.

The experience should feel like:
> *"An interactive quantum laboratory from the future — not an ordinary educational website with a dark theme."*

---

## 2. Goals

### Primary Goals
- Teach quantum computing concepts visually and interactively.
- Make abstract quantum mechanics intuitive through animation and simulation.
- Provide a hands-on circuit-building experience for beginners and intermediates.
- Maintain scientific accuracy at the level of a correct mathematical simulator.

### Secondary Goals
- Serve as a showcase of advanced frontend visualization techniques.
- Demonstrate best practices in modular, maintainable frontend architecture.
- Be extensible so future quantum algorithms and gates can be added with minimal refactoring.

---

## 3. Target Users

| User Type | Description |
|-----------|-------------|
| **Beginner** | No quantum computing knowledge; learns through the educational Page 1 first |
| **Student** | University-level; uses experiment lab and gate visualizer to reinforce classroom learning |
| **Developer** | Curious about quantum computing; uses the circuit builder to explore algorithms |
| **Educator** | Uses the app as a classroom demonstration tool |

---

## 4. Application Structure

The application consists of **five interconnected pages**. They share a common navigation header, a common quantum engine, shared state management, and a unified design system.

```
QUANTUM UNIVERSE APPLICATION
│
├── Page 1: Quantum Universe      (Educational Foundation)
├── Page 2: Gate Visualizer       (Single-Qubit Simulation)
├── Page 3: Experiment Lab        (Guided Experiments)
├── Page 4: Entanglement Simulator(Two-Qubit Simulation)
└── Page 5: Circuit Builder       (Visual Circuit Editor)
```

---

## 5. Core Features by Page

### Page 1 — Quantum Universe
- Six educational sections: Classical Bit vs Qubit, Superposition, Measurement, Quantum Gates, Entanglement, Quantum Circuits.
- Animated and interactive diagrams for each concept.
- Deep-links to interactive pages for hands-on continuation.
- Ambient particle background with quantum-field aesthetic.

### Page 2 — Gate Visualizer
- Interactive 3D Bloch sphere (real WebGL/Three.js sphere).
- Gate buttons: X, Y, Z, H, S, T.
- State vector visualization with Dirac notation.
- Probability bars for |0⟩ and |1⟩.
- Gate application history panel.
- Animated state transitions.

### Page 3 — Experiment Lab
- Predefined quantum experiments (minimum 5 at launch).
- Step-by-step animated experiment execution.
- Repeated measurement shot simulation.
- Result visualization with distribution bars.
- Experiment history log.

### Page 4 — Entanglement Simulator
- Two-qubit state space simulation.
- Bell-state creation workflow (H on qubit A, CNOT).
- Animated entanglement visualization.
- Correlated measurement results: |00⟩ and |11⟩ distribution.
- Two-qubit circuit display.

### Page 5 — Circuit Builder
- Drag-and-drop gate placement on qubit wires.
- Gates: H, X, Y, Z, S, T, CNOT, SWAP.
- Up to 4 qubits at launch.
- Circuit validation before execution.
- Run button triggers quantum engine simulation.
- Measurement result histogram.

---

## 6. Technical Architecture Summary

```
┌─────────────────────────────────────────────┐
│               USER INTERFACE                │
│   (React components, pages, navigation)     │
├─────────────────────────────────────────────┤
│           PAGE CONTROLLERS                  │
│   (per-page logic, event coordination)      │
├─────────────────────────────────────────────┤
│            QUANTUM ENGINE                   │
│   (state vectors, gates, measurement)       │
├─────────────────────────────────────────────┤
│         STATE MANAGEMENT LAYER              │
│   (Zustand store, reactive updates)         │
├─────────────────────────────────────────────┤
│          VISUALIZATION LAYER                │
│   (Bloch sphere, probability bars, SVG)     │
└─────────────────────────────────────────────┘
```

The quantum engine is **completely independent** of the UI. It receives gate commands and returns new states. It does not import React or any UI library.

---

## 7. Quantum Engine Responsibilities

The shared quantum engine handles:
- Single-qubit state vectors: `[alpha, beta]` where alpha and beta are complex numbers.
- Multi-qubit state vectors: tensor product expansion.
- Gate matrix multiplication.
- Probability calculation: `|alpha|²` and `|beta|²`.
- Measurement simulation: weighted random outcome.
- Multi-shot measurement aggregation.
- CNOT and SWAP gate operations.
- Circuit execution (sequence of gate operations).

See `07_QUANTUM_ENGINE.md` for full specification.

---

## 8. Navigation

The application uses a **persistent top navigation bar** visible on all pages.

Navigation items:
```
[QUANTUM UNIVERSE] [GATE VISUALIZER] [EXPERIMENT LAB] [ENTANGLEMENT] [CIRCUIT BUILDER]
```

- Active page is highlighted with Icicle (`#446983`) underline.
- Clicking a nav item performs a client-side route transition with a fade animation.
- On mobile, the navigation collapses into a hamburger menu.

---

## 9. Visual Identity

- **Primary background:** Midnight `#071018`
- **Panel surfaces:** Solstice `#1C2B38` with low-opacity glass effect
- **Border/wire color:** Polar `#38506A`
- **Secondary text:** Arctic `#7991A8`
- **Interactive accent:** Icicle `#446983`
- **Visualization background:** Deep Navy `#0B132B`
- **Primary text / results:** White `#FFFFFF`
- **Typography:** Inter (Google Fonts) — weights 300, 400, 500, 600, 700
- **Monospace (quantum notation):** JetBrains Mono

The design avoids:
- Generic neon cyberpunk aesthetics.
- Excessive purple, green, or pink gradients.
- Heavy, image-based backgrounds.

The design uses:
- CSS-based atmospheric depth and gradients.
- Glassmorphism panels with `backdrop-filter: blur`.
- Controlled glow (`box-shadow` with low-spread blue).
- Fine particle effects (canvas-based, minimal).

---

## 10. Interaction Philosophy

Every interaction must follow this principle:

> **The user must always understand: WHAT is happening, WHY it is happening, WHAT changed, and WHAT the result means.**

Rules:
1. Animate state transitions — never jump instantly.
2. Label every quantum state in Dirac notation.
3. Show probability values numerically in addition to graphically.
4. Provide tooltip or inline explanation for every gate.
5. Gate application steps must be visually sequential, not simultaneous.

---

## 11. Responsive Strategy

| Breakpoint | Label | Key Adaptations |
|-----------|-------|-----------------|
| < 480px | Mobile S | Single column, tap-based gate selection |
| 480–768px | Mobile L | Single column, simplified 3D viewport |
| 768–1024px | Tablet | Two-column layout, reduced 3D complexity |
| 1024–1440px | Laptop | Full layout, all features active |
| > 1440px | Desktop | Spacious layout, maximum visualization size |

See `21_RESPONSIVE_DESIGN.md` for full specification.

---

## 12. Performance Strategy

- Use `requestAnimationFrame` loops only when actively animating.
- Pause 3D rendering when the Bloch sphere is not in view (`IntersectionObserver`).
- Lazy-load page components (code splitting per route).
- Defer Three.js loading until the Gate Visualizer route is activated.
- Target: First Contentful Paint < 1.5s, Interaction to Next Paint < 200ms.

See `23_PERFORMANCE.md` for full specification.

---

## 13. Accessibility

- Full keyboard navigation across all interactive elements.
- ARIA labels on all buttons, visualizations, and results.
- Color contrast ratio: minimum 4.5:1 for body text, 3:1 for large text.
- `prefers-reduced-motion` support — all animations pause or simplify.
- Non-visual descriptions for all quantum visualizations.

See `22_ACCESSIBILITY.md` for full specification.

---

## 14. Development Phases

```
Phase 1:  Project foundation, design system, routing
Phase 2:  Quantum Universe educational page
Phase 3:  Single-qubit quantum engine (math)
Phase 4:  Gate Visualizer (with Bloch sphere)
Phase 5:  Experiment Lab
Phase 6:  Two-qubit quantum engine
Phase 7:  Entanglement Simulator
Phase 8:  Circuit Builder
Phase 9:  Animation polish and 3D effects
Phase 10: Responsive optimization
Phase 11: Accessibility
Phase 12: Performance testing
Phase 13: Final QA and bug fixes
```

See `26_DEVELOPMENT_ROADMAP.md` for full phase breakdown with dependencies.

---

## 15. Future Expansion (Post-MVP)

The architecture must support — without major refactoring — the addition of:
- Additional quantum gates (Rx, Ry, Rz, Toffoli, Fredkin)
- Grover's algorithm visualization
- Deutsch-Jozsa algorithm
- Quantum Fourier Transform visualization
- Noise simulation models
- Multi-shot experiment results (up to 10,000 shots)
- Circuit export (JSON, Qiskit-style pseudocode)
- Custom experiment creation
- Educational challenges and scoring

See `27_FUTURE_EXPANSION.md` for full roadmap.

---

## 16. Critical Rules (Summary)

| Rule | Description |
|------|-------------|
| R1 | Five pages belong to one application, not five separate apps |
| R2 | Quantum mathematics are never duplicated across pages |
| R3 | All pages consume the same shared quantum engine |
| R4 | Quantum calculations are separated from UI components |
| R5 | Gate Visualizer and Experiment Lab reuse the same gate logic |
| R6 | Entanglement Simulator and Circuit Builder reuse the same multi-qubit engine |
| R7 | Circuit Builder sends circuit representations to the engine — the engine executes them |
| R8 | Visualizations subscribe to state and react automatically |
| R9 | Animations represent state transitions, not decoration |
| R10 | Always distinguish simulation from real quantum hardware |

---

*See individual specification files for detailed implementation guidance.*
