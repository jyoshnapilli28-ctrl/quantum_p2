# QYNX — DEVELOPMENT ROADMAP

---

## 1. Overview

This roadmap defines the **authoritative 18-phase implementation sequence** for engineering the QYNX quantum simulation and educational platform. Phases are structured to maximize engineering velocity, enforce mathematical rigor early, and eliminate visual or architectural rework.

Core Architectural Invariant: **Quantum engine first, state store second, UI third.** Never construct a page's visual components before its underlying mathematical engine functions and Zustand store slice are verified by deterministic unit tests.

---

## 2. Phase Dependency Graph

```
Phase 1: Project Foundation & Build System
     │
     ▼
Phase 2: QYNX Design System & Purple Tokens
     │
     ▼
Phase 3: Quantum Mathematics & Complex Arithmetic
     │
     ▼
Phase 4: Single-Qubit Engine & Gate Kernels
     │
     ├──────────────────────────┐
     ▼                          ▼
Phase 5: Page 1 —           Phase 6: Page 2 —
Quantum Universe Hub        Gate Visualizer
(Educational Sections)          │
     │                          ▼
     │                      Phase 7: 3D Bloch Sphere
     │                      (Three.js / R3F SLERP)
     │                          │
     └──────────┬───────────────┘
                │
                ▼
Phase 8: Page 3 — Quantum Expo Lab
(Experiment Protocols & Sequencer)
                │
                ▼
Phase 9: Multi-Qubit Engine & Tensor Products
                │
     ┌──────────┴───────────────┐
     ▼                          ▼
Phase 10: Page 4 —          Phase 11: Page 5 —
Entanglement Simulator      Circuit Builder
(Bell States & Correlation) (Grid, Drag/Tap, Simulation)
     │                          │
     └──────────┬───────────────┘
                │
                ▼
Phase 12: Diagram Visibility & Visualization Polish
                │
                ▼
Phase 13: Purposeful Animation Polish (60 FPS & Reduced-Motion)
                │
                ▼
Phase 14: Responsive Optimization (Mobile Tap Alternatives)
                │
                ▼
Phase 15: WCAG 2.1 AA Accessibility & Announcer (#qynx-live-announcer)
                │
                ▼
Phase 16: Performance Optimization & WebGL Demand Rendering
                │
                ▼
Phase 17: Comprehensive Testing & Mathematical QA
                │
                ▼
Phase 18: Final Release Certification
```

---

## 3. Master 18-Phase Implementation Specification

| Phase | Phase Name | Duration | Primary Deliverables | Verification Gate |
|-------|------------|----------|----------------------|-------------------|
| **Phase 1** | Project Foundation | 3–4 days | Vite + React 18 + TS setup, Zustand store shell, React Router v6, Vitest setup | Route switching across 5 placeholder pages, clean build |
| **Phase 2** | Design System | 2–3 days | QYNX Purple Scale CSS variables (`tokens.css`), typography (Syne, Inter, JetBrains Mono), button & card components | Contrast audit passes WCAG AA, zero legacy blue tokens |
| **Phase 3** | Quantum Mathematics | 2–3 days | `complex.ts`, `matrix.ts`, `vector.ts`, inner/outer products, Hermiticity check | 100% unit test coverage with tolerance $\varepsilon = 10^{-10}$ |
| **Phase 4** | Single-Qubit Engine | 3–4 days | State vector initialization, $X, Y, Z, H, S, T$ gate matrix multiplication, Born rule | Self-inverse tests pass ($H^2=I$, $X^2=I$), normalization invariant |
| **Phase 5** | Page 1: Quantum Universe | 4–6 days | 9 educational topics, interactive comparison cards, high-contrast SVG diagrams | All 9 topics readable within 3 seconds, responsive at 375px |
| **Phase 6** | Page 2: Gate Visualizer | 5–7 days | `gateVisualizerSlice.ts`, gate toolbar, Dirac bra-ket renderer, Born probability bars | Applying gates updates probabilities and state label in real time |
| **Phase 7** | 3D Bloch Sphere | 4–6 days | Three.js + R3F canvas, geodesic SLERP vector transition, coordinate mapping ($Z$-up) | Smooth 60 FPS rotation, `frameloop="demand"`, no WebGL leaks |
| **Phase 8** | Page 3: Quantum Expo Lab | 4–6 days | Superposition & Bit-Flip protocols, step sequencer, multi-shot histogram | 1000-shot run yields expected distribution ($50\% \pm 3\%$) |
| **Phase 9** | Multi-Qubit Engine | 3–4 days | Kronecker tensor product, 4×4 unitary expansion, CNOT, SWAP, Schmidt rank | Bell state synthesis generates canonical $|\Phi^+\rangle$ state |
| **Phase 10** | Page 4: Entanglement Simulator | 4–6 days | 2-qubit workspace, Bell state selector, correlated measurement collapse | Measuring Qubit A instantly collapses Qubit B without lag |
| **Phase 11** | Page 5: Circuit Builder | 7–10 days | 3-qubit $\times$ 8-step matrix, drag-and-drop + mobile tap-to-place, wire engine | Bell circuit execution yields $50\%$ $|00\rangle$ / $50\%$ $|11\rangle$ |
| **Phase 12** | Diagram & Visual Polish | 3–4 days | Enforcement of 3-second comprehension rule, wire stroke $\ge 2\text{px}$, vector $\ge 3\text{px}$ | All diagrams clearly legible against `#1C0F30` background |
| **Phase 13** | Animation Polish | 2–3 days | Framer Motion orchestration, SLERP curves, `prefers-reduced-motion` compliance | Zero disorientation; animations disabled when reduced motion set |
| **Phase 14** | Responsive Optimization | 3–4 days | Mobile tap-to-place testing, sticky wire headers, horizontal scroll containers | Usable across iPhone SE (375px), iPad (768px), desktop (1440px) |
| **Phase 15** | Accessibility (A11y) | 3–4 days | `#qynx-live-announcer`, keyboard grid navigation, ARIA roles and labels | axe DevTools reports 0 critical / serious issues; NVDA reads states |
| **Phase 16** | Performance Optimization | 2–3 days | Bundle code-splitting, WebGL context disposal, sub-5ms 10k shot sampling | Lighthouse Performance score $\ge 90$ across mobile & desktop |
| **Phase 17** | Testing & QA | 3–5 days | Vitest unit suite, component integration tests, Bell state regression checks | All engine and store tests pass; zero console errors |
| **Phase 18** | Release Certification | 2–3 days | Final production build verification, cross-browser audits, documentation sign-off | Production bundle serves cleanly on preview with 0 defects |

---

## 4. Phase Detail Specifications

### Phase 1: Project Foundation & Build System
- Initialize Vite project with React 18 and strict TypeScript configuration.
- Configure path aliases (`@/engine`, `@/components`, `@/store`, `@/styles`, `@/types`).
- Set up React Router v6 with lazy route splitting for `/`, `/gate-visualizer`, `/expo-lab`, `/entanglement`, `/circuit-builder`.
- Initialize root Zustand store (`QynxStore`).
- Configure Vitest test runner with `@testing-library/react` and `vitest-axe`.

### Phase 2: QYNX Design System & Purple Tokens
- Define official QYNX Purple Scale CSS custom properties in `src/styles/tokens.css`:
  - Purple 10 (`#F6F2FF`) through Purple 100 (`#1C0F30`).
  - High-contrast text White (`#FFFFFF`) and Muted Purple (`#D4BBFF`).
- Establish typographic tokens with Google Fonts (`Syne` / `Cabinet Grotesk` headings, `Inter` body, `JetBrains Mono` code/math).
- Build foundational UI components: `QuantumPanel` (restrained surface without excessive blur), `Button`, `IconButton`, `Badge`.
- Eliminate all legacy blue hex codes (`#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, `#3A506B`).

### Phase 3: Quantum Mathematics & Complex Arithmetic
- Implement pure TypeScript complex number library (`src/engine/math/complex.ts`): addition, multiplication, conjugate, magnitude, phase angle.
- Implement matrix operations (`src/engine/math/matrix.ts`): matrix-vector multiply, 2×2 and 4×4 adjoint, unitarity verification.
- Implement vector operations (`src/engine/math/vector.ts`): Euclidean norm, inner product, normalization.
- Author exhaustive unit tests in `src/engine/__tests__/complex.test.ts` and `matrix.test.ts`.

### Phase 4: Single-Qubit Engine & Gate Kernels
- Implement `StateVector1Q` type and state factory functions: `createZeroState()`, `createOneState()`, `createPlusState()`, `createMinusState()`.
- Implement gate application kernel supporting $X, Y, Z, H, S, T$ unitary operators.
- Implement projective measurement and Born probability calculator ($P(0) = |\alpha|^2, P(1) = |\beta|^2$).
- Implement Bloch sphere coordinate extraction ($x = 2\text{Re}(\alpha^*\beta), y = 2\text{Im}(\alpha^*\beta), z = |\alpha|^2 - |\beta|^2$).
- Author unit tests for all single-qubit gates and self-inverse involutions ($H^2=I$, $X^2=I$).

### Phase 5: Page 1 — Quantum Universe Hub
- Construct educational overview covering 9 fundamental quantum concepts:
  1. Classical Bit vs. Qubit
  2. Superposition Principle
  3. Bloch Sphere Representation
  4. Quantum Measurement & Wavefunction Collapse
  5. Quantum Logic Gates
  6. Quantum Entanglement & Non-Locality
  7. Quantum Circuit Model
  8. Quantum Decoherence & Environmental Noise
  9. Real-World Applications & Cryptographic Quantum Advantage
- Incorporate interactive comparison widgets and high-contrast SVG diagrams adhering to the 3-second comprehension rule.

### Phase 6: Page 2 — Quantum Gate Visualizer
- Implement `gateVisualizerSlice.ts` to manage active state vector, gate history, and measurement status.
- Build gate toolbar with responsive buttons and keyboard accelerators.
- Build `DiracNotation` readout displaying dynamic bra-ket expansion: $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$.
- Build `ProbabilityBar` components with animated percentages and accessible ARIA attributes.
- Implement projective measurement action that disables further unitary operations until user clicks "Reset".

### Phase 7: 3D Bloch Sphere Visualization
- Implement Three.js scene wrapped in React Three Fiber (`src/components/canvas/BlochSphere.tsx`).
- Map mathematical $Z$-up Bloch coordinates to Three.js $Y$-up coordinate space (`three_x = bloch_x`, `three_y = bloch_z`, `three_z = bloch_y`).
- Implement spherical geodesic SLERP animation between previous and next state vectors.
- Configure `frameloop="demand"` to conserve GPU cycles when vector is stationary.
- Provide a clean WebGL fallback diagram for environments without WebGL support.

### Phase 8: Page 3 — Quantum Expo Lab
- Implement `expoLabSlice.ts` supporting structured step-by-step experimentation protocols.
- Author Superposition Protocol (State $|0\rangle \to H \to |+\rangle \to$ Measure) and Bit-Flip Protocol ($|0\rangle \to X \to |1\rangle \to$ Measure).
- Build step sequencer controls ("Run Next Step", "Run All", "Reset").
- Build `ProbabilityHistogram` component displaying multi-shot measurement distributions ($N = 10, 100, 1000, 10000$ shots).
- Display scientific disclaimer clarifying that multi-shot results reflect classical pseudo-random sampling of theoretical Born probabilities.

### Phase 9: Multi-Qubit Engine & Tensor Products
- Implement Kronecker tensor product for 2-qubit state space ($\mathbb{C}^2 \otimes \mathbb{C}^2 \cong \mathbb{C}^4$).
- Implement multi-qubit gate application: single-qubit gate on wire $k$ expanded via $I \otimes \dots \otimes U \otimes \dots \otimes I$.
- Implement 2-qubit entangling gates: Controlled-NOT ($\text{CNOT}$) and $\text{SWAP}$.
- Implement Bell state synthesis functions for all 4 canonical states ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$).
- Implement entanglement verification via von Neumann entropy of reduced density matrix or Schmidt rank.

### Phase 10: Page 4 — Quantum Entanglement Simulator
- Implement `entanglementSlice.ts` to manage 2-qubit entangled pairs.
- Construct twin-qubit workspace displaying Qubit A and Qubit B side-by-side in high-contrast card panels (no physical connecting wires or cables).
- Build Bell state selector buttons and manual protocol triggers ($H$ on A, $\text{CNOT}$ with control A and target B).
- Display dynamic non-classical correlation explanation and 4-outcome probability distribution ($P(00), P(01), P(10), P(11)$).
- Wire correlated measurement collapse: measuring Qubit A immediately projects Qubit B into the corresponding paired state.

### Phase 11: Page 5 — Quantum Circuit Builder
- Implement `circuitSlice.ts` to manage an $N$-qubit $\times$ $M$-column quantum gate matrix ($N \le 3$, $M \le 8$).
- Build desktop drag-and-drop circuit interface using `@dnd-kit`.
- Build accessible mobile tap-to-place alternative: tap gate card from palette, then tap target wire slot.
- Implement circuit validation engine: detect missing targets, prevent overlapping multi-qubit operations, validate wire indices.
- Implement step-by-step circuit execution engine with intermediate state vector inspection and final multi-shot histogram output.

### Phase 12: Diagram Visibility & Visual Polish
- Audit all SVG and canvas diagrams to ensure compliance with the **QYNX Diagram Visibility Standard**:
  - Circuit wire stroke $\ge 2\text{px}$, stroke color `#491D8B` or `#8A3FFC`.
  - State vector stroke $\ge 3\text{px}$, arrow head radius $\ge 0.09$ Three.js units.
  - Text contrast $\ge 4.5:1$ against surface backgrounds; non-text graphical elements $\ge 3:1$.
- Review all icons and illustrations to ensure clean, human-designed aesthetics without AI tropes, unnecessary particle swarms, or muddy glassmorphism.

### Phase 13: Purposeful Animation Polish
- Implement consistent timing curves across UI transitions: state vector SLERP (400ms), probability bar fill (350ms), step advancement (250ms).
- Ensure animations answer the foundational user question: *"What changed and why?"*
- Implement `@media (prefers-reduced-motion: reduce)` overrides to instantly snap states without transition lag.
- Profile Framer Motion transitions to guarantee 60 FPS performance on mid-tier hardware.

### Phase 14: Responsive Optimization
- Validate layout stability across breakpoints: Mobile Small (375px), Mobile Standard (390px), Tablet (768px), Desktop (1024px), Widescreen (1440px).
- Implement horizontal scrolling with sticky wire headers on Page 5 Circuit Builder.
- Ensure all interactive touch targets meet the $48\times 48\text{px}$ minimum size standard.
- Verify mobile chip selector for Quantum Expo Lab protocols.

### Phase 15: Accessibility (WCAG 2.1 AA)
- Wire global `#qynx-live-announcer` live region to state mutations (e.g., *"Hadamard gate applied: state is now ket plus with equal 50 percent probabilities"*).
- Implement complete keyboard navigation: Tab order traversal, Enter/Space activation, Esc modal dismissal.
- Implement arrow-key grid navigation for Circuit Builder cells.
- Audit semantic markup (single `<h1>` per page, descriptive landmarks, `aria-expanded`, `aria-selected`).

### Phase 16: Performance Optimization
- Configure Vite manual code chunks: separate Three.js/R3F bundle loaded only when navigating to `/gate-visualizer`.
- Optimize Born rule multi-shot sampling algorithms to complete 10,000 shots in under 5ms.
- Verify Three.js geometry and material disposal on component unmount to prevent WebGL memory leaks.
- Run Lighthouse performance audits to ensure score $\ge 90$ across mobile and desktop profiles.

### Phase 17: Comprehensive Testing & QA
- Execute Vitest test suite covering mathematical engine, Zustand store slices, and UI integration flows.
- Verify all 8 quantum gates, Bell state distributions, and circuit error cases.
- Run automated `axe-core` accessibility audit across all 5 routes.
- Perform cross-browser testing across Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge.

### Phase 18: Final Release Certification
- Build production distribution bundle (`npm run build`) with zero TypeScript errors or ESLint warnings.
- Verify production preview (`npm run preview`) against master requirements.
- Ensure all documentation files in `docs/` are 100% synchronized with the architecture, color palette, and module naming.
- Certify final delivery of QYNX platform specifications.
