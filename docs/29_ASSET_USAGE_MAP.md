# 29. ASSET USAGE MAP

This document maps all production graphical assets (3D, SVGs, Fonts) to their intended application pages and explicitly dictates usage permissions.

## Shared / Global Assets
These assets are used across the entire application and can be loaded universally.

| Filename | Category | Purpose | Interactive | Animation Allowed? | Duplication Prohibited? |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bloch-sphere.gltf` | 3D | Central 3D render | Yes (Rotate/Zoom) | Yes (SLERP updates) | **YES. Load once.** |
| `Inter-*.woff2` | Font | Primary typography | No | No | YES |
| `JetBrainsMono-*.woff2` | Font | Math/Code blocks | No | No | YES |
| `quantum-universe-logo.svg` | Branding | Main navigation bar | No | Yes (Hover glow) | No (Reusable) |
| `quantum-universe-icon.svg` | Branding | Favicon / App Icon | No | No | No |
| `quantum-orbit.svg` | Branding | Decorative footer | No | Yes (Slow spin) | No |
| `quantum-universe-global-bg.svg`| Background | Core app backdrop | No | No | YES |
| `quantum-grid.svg` | Background | Overlay pattern | No | Yes (Parallax) | No |
| `quantum-particles.svg` | Background | Overlay element | No | Yes (Drift) | No |
| `quantum-wave.svg` | Background | Header decoration | No | Yes (Sine shift) | No |

## PAGE 1: Quantum Universe
| Filename | Category | Purpose | Interactive | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `bit-vs-qubit.svg` | Illustration | Intro concept visual | No | Yes (Scroll reveal) |
| `superposition.svg` | Illustration | Probability visual | No | Yes (Subtle wave) |
| `measurement.svg` | Illustration | Collapse visual | No | Yes (Collapse state) |
| `quantum-gates.svg` | Illustration | Logic concept visual | No | Yes (Pulse) |
| `entanglement.svg` | Illustration | Node connection | No | Yes (Sync pulse) |
| `quantum-circuit.svg` | Illustration | Wireframe visual | No | Yes (Signal flow) |

## PAGE 2: Quantum Gate Visualizer
| Filename | Category | Purpose | Interactive | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `x-gate.svg`, `y-gate.svg` etc. | Illustration | Detailed gate cards | Yes (Clickable) | Yes (Hover scale) |
| `gate-visualizer-bg.svg` | Background | Section environment | No | No |
| `gate-state-presets.json` | 3D Data | Target coordinates | N/A | N/A |

## PAGE 3: Quantum Experimental Lab
| Filename | Category | Purpose | Interactive | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `experiment-superposition.svg` | Illustration | Stage 1 Concept | No | Yes (Scroll reveal) |
| `experiment-bit-flip.svg` | Illustration | Stage 2 Concept | No | Yes (Scroll reveal) |
| `measurement-results.svg` | Illustration | Histogram base | No | Yes (Bars fill) |
| `experiment-lab-bg.svg` | Background | Section environment | No | No |

## PAGE 4: Quantum Entanglement Simulator
| Filename | Category | Purpose | Interactive | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `entanglement-state.svg` | Illustration | Connection visual | No | Yes (Marching ants) |
| `bell-state.svg` | Illustration | Correlated output | No | Yes (Sync pulse) |
| `entanglement-bg.svg` | Background | Section environment | No | No |

## PAGE 5: Quantum Circuit Builder
| Filename | Category | Purpose | Interactive | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `circuit-builder.svg` | Illustration | Palette mockup | No | No |
| `controlled-gate.svg` | Illustration | CNOT connection | No | Yes (Path draw) |
| `circuit-results.svg` | Illustration | Histogram base | No | Yes (Bars fill) |
| `circuit-builder-bg.svg` | Background | Linear workspace | No | No |

## General Rules
* **Icons:** The 83 icons in `assets/icons/` are strictly reusable. SVGs should be implemented as React components (e.g., via SVGR) to allow fill color manipulation via CSS variables (`currentColor`).
* **Backgrounds:** Must be implemented via CSS `background-image` or an absolute positioned `<img>` with `pointer-events: none` and `z-index: -1`.
* **Prohibited Duplication:** The 3D Bloch Sphere GLTF file must only be downloaded **once** per session. Multiple instances of the sphere must reuse the same loaded geometry and material in memory.
