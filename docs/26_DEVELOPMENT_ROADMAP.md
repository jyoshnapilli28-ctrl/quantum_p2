# DEVELOPMENT ROADMAP — QUANTUM UNIVERSE

---

## 1. Overview

This roadmap defines the **recommended implementation sequence** for building the Quantum Universe application. Phases are ordered to maximize developer productivity and minimize rework.

Key principle: **Build the quantum engine first, then the UI on top of it.** Never build a page's UI before its underlying engine and store slice are complete and tested.

---

## 2. Phase Dependency Map

```
Phase 1: Foundation
     │
     ▼
Phase 2: Educational Page (no engine needed)
     │
     ▼
Phase 3: Single-Qubit Engine
     │
     ├──────────────────┐
     ▼                  ▼
Phase 4: Gate         Phase 5: Experiment
Visualizer            Lab
     │                  │
     └────────┬─────────┘
              │
              ▼
Phase 6: Two-Qubit Engine
              │
     ┌────────┴────────┐
     ▼                 ▼
Phase 7: Entangle.   Phase 8: Circuit
Simulator            Builder
     │                  │
     └────────┬─────────┘
              │
              ▼
Phase 9: Animation & 3D Polish
              │
              ▼
Phase 10: Responsive Optimization
              │
              ▼
Phase 11: Accessibility
              │
              ▼
Phase 12: Performance Testing
              │
              ▼
Phase 13: Final QA & Release
```

---

## 3. Phase 1 — Project Foundation and Design System

**Duration:** 3–5 days
**Depends on:** Nothing

### Deliverables

- [ ] Vite + React + TypeScript project scaffolded
- [ ] React Router v6 configured with 5 routes (lazy-loaded)
- [ ] Zustand store initialized (empty slices, no logic yet)
- [ ] `src/styles/tokens.css` with all CSS custom properties
- [ ] `src/styles/global.css` with base styles (body, typography, scrollbar)
- [ ] Google Fonts loaded (Inter + JetBrains Mono)
- [ ] Navigation component built and styled (desktop + mobile hamburger)
- [ ] Page layout shell (navigation + content area padding)
- [ ] Page transition animation (Framer Motion AnimatePresence)
- [ ] 404 page
- [ ] ESLint + Prettier configured
- [ ] Vitest configured

### Key Design System Tasks

- [ ] `.quantum-panel` glass component CSS class
- [ ] Button variants (primary, gate, icon)
- [ ] Color tokens verified for contrast ratios

**Done when:** Navigation works across all 5 placeholder page routes. Design system is visually correct.

---

## 4. Phase 2 — Quantum Universe Educational Page

**Duration:** 5–7 days
**Depends on:** Phase 1

### Deliverables

- [ ] `QuantumUniverse.tsx` page with all 6 sections
- [ ] Hero section with particle background (`QuantumParticles` canvas)
- [ ] Section 1: Classical Bit vs Qubit (toggle interaction, no engine)
- [ ] Section 2: Superposition (uses engine for real measurement)
- [ ] Section 3: Measurement (slider + 10-shot measurement, uses engine)
- [ ] Section 4: Quantum Gates (gate matrix display, mini qubit demo, uses engine)
- [ ] Section 5: Entanglement (H+CNOT demo, uses engine partially)
- [ ] Section 6: Quantum Circuits (static SVG circuit diagram, step-through)
- [ ] Scroll-triggered entry animations (IntersectionObserver + Framer Motion)
- [ ] Bottom CTA section
- [ ] Responsive layout for all breakpoints
- [ ] `QubitIndicator` component

**Note on engine dependency:** Sections 2, 3, 4, and 5 use the quantum engine for real probabilistic simulation. If the engine is not ready, use a simplified placeholder (hardcoded probability values) to unblock visual development. Replace with real engine calls in Phase 3.

**Done when:** All 6 sections render correctly on desktop and mobile with working interactions.

---

## 5. Phase 3 — Single-Qubit Quantum Engine

**Duration:** 3–5 days
**Depends on:** Phase 1

### Deliverables

- [ ] `src/engine/math/complex.ts` — all complex arithmetic functions
- [ ] `src/engine/math/matrix.ts` — 2×2 matrix-vector multiply
- [ ] `src/engine/math/vector.ts` — normalize, inner product
- [ ] `src/engine/qubit.ts` — state creation functions
- [ ] `src/engine/gates.ts` — GATE_MATRICES constant + applyGate
- [ ] `src/engine/measurement.ts` — probabilities, measureSingle, measureMultiShot, getBlochCoordinates
- [ ] `src/types/quantum.ts` — all TypeScript types
- [ ] `src/engine/index.ts` — barrel export
- [ ] Unit tests for all engine modules (> 90% coverage)
- [ ] `gateVisualizerSlice.ts` — store slice for Page 2
- [ ] Connect Page 2's placeholder calls to real engine

**Done when:** All unit tests pass. `applyGate`, `measureSingle`, and `getBlochCoordinates` return mathematically correct values.

---

## 6. Phase 4 — Gate Visualizer

**Duration:** 7–10 days
**Depends on:** Phase 3

### Deliverables

- [ ] `GateVisualizer.tsx` page layout
- [ ] `GatePanel` component (6 gate buttons with tooltips)
- [ ] `DiracNotation` component (cross-fade animation)
- [ ] `ProbabilityBar` component (animated width)
- [ ] `GateHistory` panel
- [ ] Measure button with post-measurement state behavior
- [ ] Explanation panel (contextual text based on last gate)
- [ ] Reset button
- [ ] **3D Bloch Sphere (Three.js + R3F):**
  - [ ] `BlochScene.ts` — Three.js scene, camera, lighting
  - [ ] `BlochSphere3D.ts` — sphere mesh, axes, labels, meridians
  - [ ] `StateVector.ts` — arrow mesh
  - [ ] `BlochAnimator.ts` — SLERP animation
  - [ ] `BlochSphere.tsx` — React wrapper, frameloop="demand"
  - [ ] WebGL fallback
  - [ ] OrbitControls with limits
- [ ] `BlochSphere.tsx` connected to store coordinates
- [ ] Animation complete callback → store.setAnimationComplete()
- [ ] Gate buttons disable during animation and after measurement
- [ ] Full ARIA labels and live region announcements
- [ ] Responsive layout (desktop 2-col → tablet → mobile)

**Done when:** Applying all 6 gates produces correct Bloch sphere movement, state label, and probability updates. The Bloch sphere SLERP animation is smooth. All gate buttons, measure, and reset function correctly.

---

## 7. Phase 5 — Experiment Lab

**Duration:** 5–7 days
**Depends on:** Phase 3

### Deliverables

- [ ] `experimentSlice.ts` — store slice with all 5 experiment definitions
- [ ] `ExperimentLab.tsx` page layout
- [ ] Experiment selector (sidebar on desktop, dropdown on tablet, chips on mobile)
- [ ] Step progress indicator component
- [ ] Step card (description, gate applied, before/after state)
- [ ] Run Next Step logic (sequential gate application)
- [ ] Run All logic (auto-execution with 600ms delay)
- [ ] State display (DiracNotation + ProbabilityBar — reused from Phase 4)
- [ ] Shot count stepper component
- [ ] Multi-shot measurement histogram (`ProbabilityHistogram` component)
- [ ] Experiment history panel
- [ ] Explanation panel
- [ ] Reset button
- [ ] Responsive layout

**Done when:** All 5 experiments run correctly, step-by-step and auto. Multi-shot measurement produces correct distributions.

---

## 8. Phase 6 — Two-Qubit Quantum Engine

**Duration:** 3–4 days
**Depends on:** Phase 3

### Deliverables

- [ ] `src/engine/multiQubit.ts`:
  - [ ] `tensorProduct`
  - [ ] `applyGateToQubit` (with Kronecker expansion to 4×4)
  - [ ] `applyCNOT` (standard + reversed)
  - [ ] `applySWAP`
  - [ ] `isEntangled`
  - [ ] `getProbabilities2Q`
  - [ ] `measureTwoQubit`
  - [ ] `measureMultiShot2Q`
  - [ ] `createTwoQubitZeroState`
- [ ] `src/engine/math/matrix.ts` updated for 4×4 operations
- [ ] Unit tests for all multi-qubit functions
- [ ] Bell state creation test (verify 50%/50% distribution)
- [ ] `entanglementSlice.ts` — store slice for Page 4

**Done when:** All multi-qubit unit tests pass. Bell state creation produces exactly [1/√2, 0, 0, 1/√2].

---

## 9. Phase 7 — Entanglement Simulator

**Duration:** 4–6 days
**Depends on:** Phase 6

### Deliverables

- [ ] `EntanglementSim.tsx` page layout
- [ ] Circuit diagram (SVG via `CircuitDiagram` component)
- [ ] Qubit A / State / Qubit B panel layout
- [ ] `EntanglementConnection` component (animated arc)
- [ ] Entanglement indicator badge
- [ ] Workflow buttons (H → CNOT → Measure)
- [ ] Four-state probability display (|00⟩, |01⟩, |10⟩, |11⟩)
- [ ] `ProbabilityHistogram` component (reused from Phase 5)
- [ ] Shot count stepper
- [ ] Mathematical detail toggle (state vector table)
- [ ] Explanation panel
- [ ] Reset button
- [ ] Responsive layout (desktop 3-col → mobile single-col with vertical arc)

**Done when:** Full Bell state workflow executes, entanglement arc animates, measurement always shows |00⟩ or |11⟩ only.

---

## 10. Phase 8 — Circuit Builder

**Duration:** 8–12 days
**Depends on:** Phase 6

### Deliverables

- [ ] `src/engine/circuit.ts`:
  - [ ] `CircuitDefinition` type
  - [ ] `validateCircuit`
  - [ ] `executeCircuit`
- [ ] `circuitSlice.ts` — store slice with all circuit actions
- [ ] `CircuitBuilder.tsx` page layout
- [ ] Gate Panel sidebar with gate selection
- [ ] `CircuitGrid.tsx` — grid of cells
- [ ] `CircuitWire.tsx` — wire row with label
- [ ] `GateToken.tsx` — draggable/placeable gate
- [ ] **Drag-and-drop (desktop):** @dnd-kit integration
  - [ ] DndContext wrapper
  - [ ] Draggable gate tokens in gate panel
  - [ ] Droppable grid cells
  - [ ] Drop handler → dispatch addGate
- [ ] **Tap-to-place (mobile):** selected gate + tap cell
- [ ] Gate removal (× button on hover)
- [ ] Gate move (drag placed gate to new position)
- [ ] Multi-qubit gate rendering (CNOT vertical connector, SWAP ×)
- [ ] Add/remove qubit row
- [ ] Circuit validation panel
- [ ] Run Circuit button (execute + spinner + results)
- [ ] Results histogram (reused component)
- [ ] Final state summary (entanglement indicator)
- [ ] Predefined example circuits dropdown
- [ ] Clear and Reset buttons
- [ ] Undo (Ctrl+Z, 20-action history)
- [ ] Keyboard grid navigation (arrow keys, Enter, Delete)
- [ ] Responsive layout (sidebar → drawer → strip)

**Done when:** User can build a Bell-state circuit by drag-and-drop, run it, and see 50%/50% |00⟩/|11⟩ results.

---

## 11. Phase 9 — Animation and 3D Polish

**Duration:** 4–6 days
**Depends on:** Phases 4–8

### Deliverables

- [ ] Verify all animation durations match `20_ANIMATION_SYSTEM.md`
- [ ] Implement scroll-triggered section animations (Page 1)
- [ ] Polish Bloch sphere lighting and material
- [ ] Add glow state point (point light at state vector tip)
- [ ] Add equator/meridian lines to Bloch sphere
- [ ] Polish entanglement marching ants animation
- [ ] Stagger histogram bar animations
- [ ] Circuit gate placement spring animation
- [ ] Experiment step progress animation (progress line draw)
- [ ] Toast notification animation
- [ ] Add `prefers-reduced-motion` support for all animations (verify against checklist in `20_ANIMATION_SYSTEM.md`)

**Done when:** All animations from `20_ANIMATION_SYSTEM.md` are implemented and the `prefers-reduced-motion` flag correctly disables/simplifies all of them.

---

## 12. Phase 10 — Responsive Optimization

**Duration:** 3–5 days
**Depends on:** Phases 1–9

### Deliverables

- [ ] Test all 5 pages at 375px (iPhone SE), 768px, 1024px, 1440px
- [ ] Mobile navigation (hamburger menu) verified
- [ ] Bloch sphere responsive sizing
- [ ] Circuit builder tap-to-place on mobile verified
- [ ] Gate panel horizontal scroll on mobile
- [ ] Experiment Lab chip selector on mobile
- [ ] Entanglement Simulator vertical arc on mobile
- [ ] All touch targets meet 48px minimum
- [ ] SVG circuit diagram horizontal scroll

**Done when:** All 5 pages pass the responsive manual QA checklist in `25_TESTING_QA.md`.

---

## 13. Phase 11 — Accessibility

**Duration:** 3–4 days
**Depends on:** Phase 10

### Deliverables

- [ ] ARIA labels on all interactive elements
- [ ] `#quantum-announcer` live region wired to all state changes
- [ ] Keyboard navigation through all 5 pages (Tab, arrow keys, Enter)
- [ ] Circuit grid keyboard navigation (arrow keys, Delete, Ctrl+Z)
- [ ] `:focus-visible` styles on all focusable elements
- [ ] Screen reader test with NVDA + Chrome
- [ ] Color contrast verification for all text combinations
- [ ] Semantic HTML audit (headings hierarchy, nav, main, section)
- [ ] `aria-disabled` on disabled gate buttons
- [ ] `prefers-reduced-motion` media query in CSS

**Done when:** axe DevTools reports 0 critical and 0 serious issues on all 5 pages.

---

## 14. Phase 12 — Performance Testing

**Duration:** 2–3 days
**Depends on:** Phase 11

### Deliverables

- [ ] Lighthouse audit on all 5 pages (desktop + mobile simulation)
- [ ] Performance score ≥ 90 on all pages
- [ ] Verify initial bundle size < 200 KB gzipped (using Vite bundle analyzer)
- [ ] Verify Three.js chunk size is only loaded on /gate-visualizer
- [ ] Verify frame time < 16.6ms during Bloch sphere animation (Chrome DevTools Performance)
- [ ] Verify 10k measurement shots < 5ms
- [ ] Verify no layout shift during probability bar animations

**Done when:** All Lighthouse scores ≥ 90 on all pages.

---

## 15. Phase 13 — Final QA and Release

**Duration:** 2–3 days
**Depends on:** Phase 12

### Deliverables

- [ ] Full manual QA checklist from `25_TESTING_QA.md`
- [ ] Cross-browser test: Chrome, Firefox, Safari, Edge
- [ ] Cross-device test: desktop, tablet, iPhone, Android
- [ ] All unit tests pass (`npm run test`)
- [ ] No console errors or warnings in production build
- [ ] `npm run build` succeeds without errors
- [ ] Production build served from `npm run preview` verified
- [ ] Final bundle size and chunk report reviewed
- [ ] Documentation review: all 27 docs files consistent with implementation

---

## 16. Phase Summary Table

| Phase | Focus | Duration | Depends On |
|-------|-------|---------|-----------|
| 1 | Foundation | 3–5d | — |
| 2 | Educational page | 5–7d | 1 |
| 3 | Single-qubit engine | 3–5d | 1 |
| 4 | Gate Visualizer | 7–10d | 3 |
| 5 | Experiment Lab | 5–7d | 3 |
| 6 | Two-qubit engine | 3–4d | 3 |
| 7 | Entanglement Simulator | 4–6d | 6 |
| 8 | Circuit Builder | 8–12d | 6 |
| 9 | Animations + 3D polish | 4–6d | 4–8 |
| 10 | Responsive | 3–5d | 1–9 |
| 11 | Accessibility | 3–4d | 10 |
| 12 | Performance | 2–3d | 11 |
| 13 | Final QA | 2–3d | 12 |
| **Total** | | **56–83 days** | |
