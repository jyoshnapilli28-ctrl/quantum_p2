# DESIGN SYSTEM — QYNX

---

## 1. Product Brand & Design Philosophy

**QYNX** is an educational quantum computing application designed with the precision, restraint, and visual clarity of a high-tier scientific product. It rejects the clichés of AI-generated dashboards — such as dark-blue atmospheric washes, indiscriminate neon glows, heavy glassmorphism blur, floating ambient particles, and decorative circuit traces.

### Core Design Principle:
> **"Design for clarity, credibility, usability, and intentionality before decoration. Content first, interaction second, decoration last."**

### Visual Directives:
- **Restrained Surface Design**: Panels provide structural hierarchy and clear separation without blurry, illegible glass effects.
- **Scientific Credibility**: Clean geometric structures, visible borders, deliberate whitespace, and legible mathematical typography.
- **High-Contrast Legibility**: Every data point, Dirac ket, gate symbol, and diagram arrow must be instantly decipherable.
- **Purposeful Motion**: Animations exist solely to explain quantum state transitions. Zero continuous pulsing or ambient noise.

---

## 2. Brand Identity & Asset Specifications

*(Note: In this phase, brand assets are specified for implementation in later phases without modifying asset files).*

### 2.1 QYNX Wordmark
- **Typography**: Inter Display Bold / JetBrains Mono Medium hybrid aesthetic with balanced kerning.
- **Color**: Primary `White #FFFFFF` with an integrated visual mark in `Purple 60 #8A3FFC`.
- **Scaling**: Minimum rendered height of 24px (desktop navbar) down to 18px (mobile drawer).

### 2.2 QYNX Geometric Logo Mark
- **Concept**: A precision geometric glyph combining an abstract superposition state vector with the orthogonal axes of a quantum reference frame.
- **Color Tokens**: Vector stem in `Purple 60 #8A3FFC`, coordinate bounds in `Purple 40 #BE95FF`, apex state point in `White #FFFFFF`.

### 2.3 Favicon / Application Icon
- **Dimensions**: SVG master scalable to 16×16, 32×32, 180×180 (Apple touch), and 512×512 (PWA).
- **Background**: Solid `Purple 100 #1C0F30`.
- **Foreground**: Clean, bold silhouette of the QYNX logo mark in `Purple 60` and `Purple 10`.

---

## 3. Official QYNX Color Palette

The QYNX design system is built exclusively upon the curated 10-step **Purple Scale** plus pure high-contrast White for readable notation and primary headers.

### 3.1 The 10-Step QYNX Purple Scale

| Token Name | Hex Value | RGB | Core Semantic Role |
|:---|:---|:---|:---|
| **Purple 10** | `#F6F2FF` | 246, 242, 255 | Lightest surfaces, subtle educational callout backgrounds |
| **Purple 20** | `#E8DAFF` | 232, 218, 255 | Light secondary surfaces, highlighted badges, hover states |
| **Purple 30** | `#D4BBFF` | 212, 187, 255 | Soft structural borders, disabled UI states, muted diagram lines |
| **Purple 40** | `#BE95FF` | 190, 149, 255 | Secondary text, muted interactive controls, diagram axes |
| **Purple 50** | `#A56EFF` | 165, 110, 255 | Secondary visual accent, emphasis indicators, hover accents |
| **Purple 60** | `#8A3FFC` | 138, 63, 252 | Primary interactive accent, state vector, active quantum operations |
| **Purple 70** | `#6929C4` | 105, 41, 196 | Strong active states, selected controls, key diagram boundaries |
| **Purple 80** | `#491D8B` | 73, 29, 139 | Dark cards, panel surfaces, navigation bar background |
| **Purple 90** | `#31135E` | 49, 19, 94 | Deep canvas backgrounds, immersive visualization viewports |
| **Purple 100** | `#1C0F30` | 28, 15, 48 | Primary application background, deepest workspace canvas |
| **White** | `#FFFFFF` | 255, 255, 255 | Primary readable text, quantum notation ($|0\rangle, |1\rangle$), key results |

*(Legacy colors `#071018`, `#0B132B`, `#1C2B38`, `#38506A`, `#446983`, `#7991A8`, `#3A506B` are completely deprecated and replaced).*

### 3.2 Semantic Color Mapping

```css
:root {
  /* Application Surfaces */
  --qynx-bg-root:            #1C0F30; /* Purple 100 */
  --qynx-bg-canvas:          #31135E; /* Purple 90 */
  --qynx-surface-panel:      #491D8B; /* Purple 80 */
  --qynx-surface-subtle:     #E8DAFF; /* Purple 20 */
  --qynx-surface-light:      #F6F2FF; /* Purple 10 */

  /* Structural Borders & Lines */
  --qynx-border-strong:      #6929C4; /* Purple 70 */
  --qynx-border-subtle:      #D4BBFF; /* Purple 30 */
  --qynx-wire-inactive:      #6929C4; /* Purple 70 */
  --qynx-wire-active:        #8A3FFC; /* Purple 60 */

  /* Typography & Information */
  --qynx-text-primary:       #FFFFFF; /* White */
  --qynx-text-secondary:     #BE95FF; /* Purple 40 */
  --qynx-text-muted:         #D4BBFF; /* Purple 30 */

  /* Interactive Elements & Accents */
  --qynx-accent-primary:     #8A3FFC; /* Purple 60 */
  --qynx-accent-secondary:   #A56EFF; /* Purple 50 */
  --qynx-control-active:     #6929C4; /* Purple 70 */

  /* Quantum Visualization Specifics */
  --qynx-bloch-sphere:       #491D8B; /* Purple 80 */
  --qynx-bloch-axes:         #BE95FF; /* Purple 40 */
  --qynx-bloch-vector:       #8A3FFC; /* Purple 60 */
  --qynx-bloch-point:        #FFFFFF; /* White */
}
```

---

## 4. Restrained Surface Architecture

QYNX replaces excessive glassmorphism with **Restrained Surface Design**. Frosted glass is used sparingly, ensuring text contrast always exceeds WCAG AA standards.

```css
/* Standard Restrained Panel */
.qynx-panel {
  background-color: rgba(73, 29, 139, 0.75); /* Purple 80 with high opacity */
  border: 1px solid rgba(105, 41, 196, 0.5); /* Purple 70 */
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 20px rgba(28, 15, 48, 0.5);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* Deep Visualization Canvas Container */
.qynx-viewport {
  background-color: #31135E; /* Purple 90 */
  border: 1px solid #491D8B; /* Purple 80 */
  border-radius: var(--radius-xl);
  overflow: hidden;
}
```

---

## 5. Typography & Mathematical Notation

### 5.1 Typefaces
- **Primary Interface Font**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
- **Monospace & Quantum Math**: `'JetBrains Mono', 'Fira Code', monospace`

### 5.2 Type Hierarchy
| Scale Token | Size | Weight | Line Height | Usage |
|:---|:---|:---|:---|:---|
| `--text-display` | 44px (2.75rem) | 700 Bold | 1.15 | Module hero headings |
| `--text-h1` | 32px (2.0rem) | 700 Bold | 1.25 | Primary section headers |
| `--text-h2` | 24px (1.5rem) | 600 SemiBold| 1.3 | Panel & feature titles |
| `--text-h3` | 18px (1.125rem) | 600 SemiBold| 1.4 | Card headers, experiment steps |
| `--text-body` | 16px (1.0rem) | 400 Regular | 1.6 | Educational explanations |
| `--text-body-sm` | 14px (0.875rem)| 400 Regular | 1.5 | Supporting metadata, captions |
| `--text-label` | 12px (0.75rem) | 600 SemiBold| 1.3 | Badges, status tags, axis labels |
| `--text-math` | 16px (1.0rem) | 500 Medium | 1.4 | Dirac kets: $|0\rangle, |1\rangle, |\psi\rangle$ |
| `--text-math-lg` | 24px (1.5rem) | 500 Medium | 1.3 | State readout displays |

### 5.3 Quantum Notation Rules
- All Dirac notations ($|\psi\rangle, |0\rangle, |1\rangle, |+\rangle, |-\rangle$) must render in `JetBrains Mono` and `White #FFFFFF`.
- Complex amplitudes (e.g. $\alpha = 0.707 + 0.000i$) must render in `Purple 10 #F6F2FF` with `Purple 40` for secondary variable labels.

---

## 6. Diagram Legibility & Visibility Standards

Quantum diagrams are precise educational instruments. Every diagram in QYNX must satisfy:

1. **The 3-Second Comprehension Rule**: A first-time user must immediately discern:
   - What the starting state is.
   - What operation is taking place.
   - What the resulting state is.
2. **Minimum Stroke Weights**:
   - Inactive / baseline wires: $\ge 2\text{px}$ (`Purple 70 #6929C4`).
   - Active quantum trajectories / vectors: $\ge 3\text{px}$ (`Purple 60 #8A3FFC`).
   - Arrowheads: Clearly defined triangles with minimum $8\text{px}$ span.
3. **Contrast Requirements**:
   - Mathematical labels against backgrounds: minimum contrast ratio of $4.5:1$ (WCAG AA).
   - Gate tokens against circuit wires: high-contrast fill (`Purple 80`) with sharp border (`Purple 70` or `Purple 50`).
4. **Distinguishable State Glyphs**:
   - Zero state $|0\rangle$ and one state $|1\rangle$ must be distinguished by clear text labels and distinct geometric positioning, never color alone.

---

## 7. Component Specifications

### 7.1 Buttons & Interactive Controls

#### Primary Action Button ("Run Circuit", "Measure State", "Next Step")
- **Default**: Background `Purple 60 #8A3FFC`, Text `White #FFFFFF`, Border `1px solid Purple 50 #A56EFF`.
- **Hover**: Background `Purple 50 #A56EFF`, box-shadow `0 2px 12px rgba(138, 63, 252, 0.4)`.
- **Active / Pressed**: Background `Purple 70 #6929C4`.
- **Disabled**: Background `Purple 80 #491D8B`, Text `Purple 40 #BE95FF`, opacity 0.5.

#### Gate Token Buttons ($X, Y, Z, H, S, T$)
- **Container**: $48 \times 48\text{px}$, border-radius $8\text{px}$.
- **Default**: Fill `Purple 80 #491D8B`, Border `1.5px solid Purple 70 #6929C4`.
- **Symbol**: `White #FFFFFF`, `JetBrains Mono` 16px Bold.
- **Hover**: Border `Purple 50 #A56EFF`, subtle elevation.
- **Selected**: Fill `Purple 70 #6929C4`, Border `Purple 60 #8A3FFC`, outline `2px solid Purple 40`.

### 7.2 High-Contrast Probability Bar
```
|0⟩  [████████████████████          ]  50.0%
|1⟩  [████████████████████          ]  50.0%
```
- **Track**: Height $10\text{px}$, background `Purple 90 #31135E`, border `1px solid Purple 80 #491D8B`, radius $5\text{px}$.
- **Fill**: Solid `Purple 60 #8A3FFC` (primary) or `Purple 50 #A56EFF` (secondary).
- **Label**: `JetBrains Mono` 14px `White #FFFFFF`.
- **Numerical Value**: `JetBrains Mono` 14px `Purple 10 #F6F2FF`.

### 7.3 Circuit Grid & Wires
- **Wires**: Horizontal lines across grid, stroke `Purple 70 #6929C4`, stroke-width $2\text{px}$.
- **Drop Targets**: Circular or rounded-rect docking slots with dashed `Purple 40 #BE95FF` stroke when dragged over.
- **Controlled Gates (CNOT)**: Solid control dot in `Purple 60` connected by vertical line ($2\text{px}$) to target $\oplus$ symbol in `White` on `Purple 80`.

---

## 8. Categorized SVG Icon System

All icons use SVG vectors conforming to the QYNX semantic color tokens:

### 8.1 Icon State Hierarchy
- **Normal / Resting**: `Purple 40 #BE95FF`
- **Hover**: `White #FFFFFF`
- **Active / Selected**: `Purple 60 #8A3FFC`
- **Disabled**: `Purple 30 #D4BBFF` (with `pointer-events: none`)
- **Tile Surface**: `Purple 80 #491D8B` with `Purple 70 #6929C4` border

### 8.2 Icon Categories
1. **Navigation Icons**: `home`, `menu`, `chevron-right`, `chevron-down`, `arrow-left`, `info`.
2. **Quantum Concept Icons**: `bit`, `qubit`, `superposition`, `measurement`, `entanglement`, `circuit`.
3. **Unitary Gate Tiles (48×48px)**: `gate-H`, `gate-X`, `gate-Y`, `gate-Z`, `gate-S`, `gate-T`, `gate-CNOT`, `gate-SWAP`.
4. **Laboratory Icons**: `flask`, `play`, `reset`, `check`, `step-forward`, `shot-counter`.
5. **Circuit Editing Icons**: `add-wire`, `trash`, `drag-handle`, `run-simulation`, `undo`, `redo`.
6. **Visualization & Camera Icons**: `rotate-3d`, `reset-camera`, `zoom-in`, `zoom-out`, `fullscreen`.

---

## 9. 3D Bloch Sphere Visual Specifications

The Bloch Sphere is a dynamic, state-driven 3D WebGL visualization rendered in Three.js:

- **Canvas Background**: Solid `Purple 100 #1C0F30` or `Purple 90 #31135E`.
- **Wireframe Sphere**: Subtle longitude/latitude lines rendered in `Purple 80 #491D8B` (opacity 0.35).
- **Equatorial Plane**: High-contrast disk outline in `Purple 70 #6929C4`.
- **Orthogonal Axes ($X, Y, Z$)**: Stroke in `Purple 40 #BE95FF` with crisp text markers ($+Z = |0\rangle$, $-Z = |1\rangle$, $+X = |+\rangle$, $-X = |-\rangle$).
- **State Vector Arrow**: Rendered as a 3D cylinder/cone in `Purple 60 #8A3FFC` with radius $0.03$ units.
- **Apex State Point**: Luminous sphere at the vector tip rendered in `White #FFFFFF`.
- **Continuous Trajectory**: When a gate is applied, the vector animates smoothly along the spherical geodesic arc without instant jumps.
