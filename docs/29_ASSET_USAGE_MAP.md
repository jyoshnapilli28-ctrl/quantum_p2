# 29. ASSET USAGE MAP — QYNX

This document maps all production graphical assets (3D models, SVGs, Typography) to their designated application pages and dictates usage permissions, caching, and rendering constraints.

## Shared & Global Brand Assets

These assets are universal across QYNX and cached globally across route transitions.

| Asset Identifier | Format / Category | Intended Purpose | Interactivity | Animation Policy | Duplication Constraint |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `bloch-sphere.gltf` | 3D (WebGL / GLTF) | Central 3D Bloch sphere | Yes (Orbit/Drag) | Yes (SLERP state transitions) | **STRICT: Load once; share geometry** |
| `Syne-*.woff2` / `CabinetGrotesk-*.woff2` | Web Font | Display wordmark & headings | No | No | Cached globally |
| `Inter-*.woff2` | Web Font | UI controls & body typography | No | No | Cached globally |
| `JetBrainsMono-*.woff2` | Web Font | Mathematical Dirac notation & code | No | No | Cached globally |
| `qynx-logo.svg` | Vector Branding | Main navigation bar wordmark | Interactive link | Subtle hover opacity transition | Header component only |
| `qynx-icon.svg` | Vector Branding | Favicon & shortcut icon | No | No | System-level |
| `qynx-global-bg.svg` | Vector Background | Canvas subtle background texture | No | Static (Zero motion) | Single root backdrop |
| `gate-state-presets.json` | JSON Data | Target coordinates & matrix maps | No | N/A | Pure data import |

## PAGE 1: Quantum Universe (Educational Hub)

| Asset Identifier | Format / Category | Concept Represented | Interactivity | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `bit-vs-qubit.svg` | High-Contrast Diagram | Classical Bit (0/1) vs. Qubit ($|\psi\rangle$) | Interactive toggle | Purposeful state reveal |
| `superposition.svg` | High-Contrast Diagram | Probability distribution $|\alpha|^2 + |\beta|^2 = 1$ | Interactive slider | Wave amplitude shift |
| `measurement.svg` | High-Contrast Diagram | Wavefunction collapse into $|0\rangle$ or $|1\rangle$ | Click trigger | Instant collapse snap |
| `quantum-gates.svg` | High-Contrast Diagram | Unitary matrix transformation rotations | Click trigger | Axis rotation |
| `entanglement.svg` | High-Contrast Diagram | Correlated twin-qubit state (no cables) | Click trigger | Correlated pulse |
| `quantum-circuit.svg` | High-Contrast Diagram | Multi-wire quantum circuit timeline | Step-through | Timeline signal sweep |

## PAGE 2: Quantum Gate Visualizer

| Asset Identifier | Format / Category | Concept Represented | Interactivity | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `x-gate.svg` through `t-gate.svg` | Interactive Gate Tokens | $X, Y, Z, H, S, T$ gate operator badges | Click / Keyboard | Focus ring & active press |
| `bloch-axes.svg` | Orthographic Fallback | 2D projection for WebGL-disabled clients | Click | 2D vector rotation |

## PAGE 3: Quantum Expo Lab

| Asset Identifier | Format / Category | Concept Represented | Interactivity | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `protocol-superposition.svg` | Protocol Diagram | $|0\rangle \xrightarrow{H} |+\rangle \to$ Measure | Step buttons | Sequencer step highlight |
| `protocol-bit-flip.svg` | Protocol Diagram | $|0\rangle \xrightarrow{X} |1\rangle \to$ Measure | Step buttons | Sequencer step highlight |
| `histogram-bars.svg` | SVG Chart Template | Multi-shot outcome frequency bar container | Dynamic DOM | Smooth bar width fill |

## PAGE 4: Quantum Entanglement Simulator

| Asset Identifier | Format / Category | Concept Represented | Interactivity | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `qubit-pair-card.svg` | UI Frame | Independent Qubit A and Qubit B cards | State selection | Correlation status border |
| `bell-state-indicator.svg`| Status Badge | Active Bell state ($|\Phi^+\rangle, |\Phi^-\rangle, |\Psi^+\rangle, |\Psi^-\rangle$) | Click | Subtle glow pulse |

## PAGE 5: Quantum Circuit Builder

| Asset Identifier | Format / Category | Concept Represented | Interactivity | Animation Allowed? |
| :--- | :--- | :--- | :--- | :--- |
| `circuit-grid.svg` | SVG Matrix Frame | 3-qubit wire lines with step columns | Drag / Drop / Tap | Active drop target highlight |
| `cnot-connection.svg` | Connector Glyphs | Control bullet ($\bullet$) and Target XOR ($\oplus$) | Dynamic placement | SVG path stroke draw |
| `swap-connection.svg` | Connector Glyphs | Cross markers ($\times$) on swap endpoints | Dynamic placement | SVG path stroke draw |

## Architectural Asset Constraints

1. **Diagram Visibility Standard Compliance:** All SVG lines, wire paths, and arrows must maintain a minimum stroke width of $2\text{px}$ (wires) or $3\text{px}$ (vectors) with high contrast against `#1C0F30` canvas.
2. **Dynamic Theming via CSS Custom Properties:** All SVG icons and diagrams must utilize `currentColor` or CSS custom properties (e.g., `var(--color-purple-60)`) rather than hardcoded hex fills.
3. **Memory Management & Singletons:** The 3D Bloch sphere mesh and material instances must be managed as singletons. Unmounting the view must pause the animation loop without dumping the shared geometry cache.
4. **No Ambient Noise or Distracting Swarms:** Atmospheric background drift, ambient particle canvases, and unprompted looping glows are strictly forbidden. All visuals must serve direct didactic utility.
