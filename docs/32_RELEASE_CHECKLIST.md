# 32. RELEASE CHECKLIST — QYNX

This checklist must be fully verified and signed off prior to the production release of **QYNX**.

---

## 1. Documentation & Architecture Integrity
- [ ] All core documentation specifications (01 through 27) and supporting files (28 through 32, coding guide) are synchronized and finalized.
- [ ] Zero deprecated names (e.g., "Quantum Experiment Lab" replaced with "Quantum Expo Lab", application brand certified as "QYNX").
- [ ] Zero legacy color tokens (`#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, `#3A506B`) in any active stylesheet or component specification.

## 2. Brand Identity & Visual Design System
- [ ] QYNX Wordmark in `Syne` / `Cabinet Grotesk` with high-contrast `#8A3FFC` dot renders cleanly.
- [ ] Official 10-step QYNX Purple Scale (`#F6F2FF` to `#1C0F30`) is strictly enforced; mathematical notation and state kets use pure White `#FFFFFF`.
- [ ] Surface containment: Restrained, credible UI panels; zero muddy multi-layer glassmorphism blur or distracting neon glow.
- [ ] Zero unprompted ambient particle canvases or looping background noise generators.

## 3. Diagram Visibility Standard Compliance
- [ ] 3-second comprehension rule verified across all 9 Page 1 educational diagrams.
- [ ] Circuit grid wire stroke width $\ge 2\text{px}$ with high-contrast color (`#491D8B` / `#8A3FFC`).
- [ ] Bloch sphere state vector shaft thickness $\ge 0.04$ units (arrow head clearly distinguished).
- [ ] Text contrast $\ge 4.5:1$ against adjacent container backgrounds across all views.

## 4. Quantum Engine & Mathematical Rigor
- [ ] 100% unit test coverage on `src/engine/math/` with floating-point tolerance $\varepsilon = 10^{-10}$.
- [ ] Single-qubit operators ($X, Y, Z, H, S, T$) verify against `31_QUANTUM_VALIDATION_CASES.md`.
- [ ] Multi-qubit tensor products, CNOT, and SWAP verified against 4-dimensional basis $\{|00\rangle, |01\rangle, |10\rangle, |11\rangle\}$.
- [ ] All 4 canonical Bell states ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$) synthesize accurately.
- [ ] Correlated measurement verification passes: measuring Qubit A on Bell state instantaneously projects Qubit B with $100\%$ conditional probability.
- [ ] Born rule probabilities strictly normalize: $\sum_i P(i) = 1.0000000000$.

## 5. Page-by-Page Feature Verification
- [ ] **Page 1: QUANTUM UNIVERSE** — 9 educational topics render cleanly with interactive widgets.
- [ ] **Page 2: QUANTUM GATE VISUALIZER** — 3D Bloch sphere renders with SLERP transition; probability bars update in real time; measurement collapses state and disables gates.
- [ ] **Page 3: QUANTUM EXPO LAB** — Superposition and Bit-Flip protocols sequence smoothly; 1000-shot histogram displays with scientific disclaimer.
- [ ] **Page 4: QUANTUM ENTANGLEMENT SIMULATOR** — Twin-qubit workspace displays without physical wires; Bell state synthesis and correlated collapse work reliably.
- [ ] **Page 5: QUANTUM CIRCUIT BUILDER** — 3-qubit $\times$ 8-step matrix functions via desktop drag-and-drop and mobile tap-to-place; validation engine catches invalid CNOT configurations.

## 6. Accessibility (WCAG 2.1 AA)
- [ ] `#qynx-live-announcer` live region announces state mutations to assistive tech.
- [ ] Keyboard navigation: full Tab traversal, Enter/Space activation, Esc dismisses overlays.
- [ ] Arrow-key grid navigation operational in Circuit Builder.
- [ ] Visible focus indicators (`:focus-visible`): 2px solid `#BE95FF` with 2px offset.
- [ ] `prefers-reduced-motion` media query instantly snaps vectors without transition delay.
- [ ] axe DevTools audit reports 0 critical and 0 serious violations across all routes.

## 7. Performance & Engineering Hygiene
- [ ] Lighthouse score $\ge 90$ across Performance, Accessibility, Best Practices, and SEO.
- [ ] Initial bundle $< 200\text{KB}$ gzipped; Three.js code chunk isolated to `/gate-visualizer`.
- [ ] 3D Canvas uses `frameloop="demand"` and disposes geometry/material buffers on unmount.
- [ ] 10,000-shot measurement sampling executes in $< 5\text{ms}$.
- [ ] Zero memory leaks during prolonged 3D manipulation or repeated circuit execution.

## 8. Deployment & Release Build
- [ ] `npm run build` succeeds cleanly with zero TypeScript errors or ESLint warnings.
- [ ] Preview bundle (`npm run preview`) tested across Chrome, Firefox, Safari, and Edge.
- [ ] Mobile responsive audit verified at 375px, 768px, and 1440px.
- [ ] PWA web manifest (`site.webmanifest`) verified with `#1C0F30` theme color.
- [ ] Console logging and devtools stripped from production bundle.
