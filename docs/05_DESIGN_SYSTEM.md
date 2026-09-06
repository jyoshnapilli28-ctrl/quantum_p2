# DESIGN SYSTEM — QUANTUM UNIVERSE

---

## 1. Design Philosophy

The Quantum Universe design must feel like:

> *"A precision scientific instrument from the future — calm, deep, and technically immersive."*

**Avoid:**
- Generic cyberpunk neon aesthetics (excessive purple, green, pink)
- Random rainbow gradients
- Cluttered or busy layouts
- Over-decorated backgrounds that reduce readability

**Embrace:**
- Deep blue atmospheric depth
- Controlled glow (subtle, not flashy)
- Glassmorphism panels (translucent, blurred, layered)
- Scientific data displays
- Quiet animations that communicate meaning
- Whitespace and breathing room

---

## 2. Color Palette

### 2.1 Primary Palette

| Token Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `--color-midnight` | `#071018` | 7, 16, 24 | Main page background |
| `--color-solstice` | `#1C2B38` | 28, 43, 56 | Cards, glass panels |
| `--color-polar` | `#38506A` | 56, 80, 106 | Borders, wires, separators |
| `--color-arctic` | `#7991A8` | 121, 145, 168 | Secondary text, subtle highlights |
| `--color-icicle` | `#446983` | 68, 105, 131 | Interactive elements, accents |

### 2.2 Secondary Palette

| Token Name | Hex | RGB | Usage |
|------------|-----|-----|-------|
| `--color-deep-navy` | `#0B132B` | 11, 19, 43 | Visualization backgrounds, Bloch sphere env |
| `--color-white` | `#FFFFFF` | 255, 255, 255 | Primary headings, results, notation |
| `--color-light-blue` | `#3A506B` | 58, 80, 107 | Gradient midpoints |

### 2.3 Semantic Colors

| Token Name | Value | Usage |
|------------|-------|-------|
| `--color-success` | `#4A9B7F` | Successful measurement, experiment complete |
| `--color-warning` | `#8A7A4A` | Circuit validation warning |
| `--color-error` | `#8A4A4A` | Invalid gate placement, engine error |
| `--color-state-zero` | `#7991A8` | |0⟩ state indicator |
| `--color-state-one` | `#446983` | |1⟩ state indicator |

### 2.4 Color Usage Rules

**`--color-midnight` (#071018)**
- Main page background (`background-color` of `body` and all page root elements)
- Navigation bar background
- Deep section backgrounds
- Simulation workspace background

**`--color-solstice` (#1C2B38)**
- Cards (`background-color` of `.quantum-panel`)
- Glass panel base color
- Experiment step containers
- Circuit workspace background

**`--color-polar` (#38506A)**
- All border colors (`border-color`)
- Inactive control borders
- Circuit wire lines (SVG `stroke`)
- Table/grid dividers
- Scrollbar track

**`--color-arctic` (#7991A8)**
- Secondary body text
- Input placeholder text
- Subtle visualization elements
- Atmospheric lighting accents
- Step counter labels

**`--color-icicle` (#446983)**
- Interactive element backgrounds (buttons, gate tokens)
- Selected state indicator
- Focused element ring
- Active gate highlight
- Gradient endpoints

**`--color-deep-navy` (#0B132B)**
- Bloch sphere environment background
- High-contrast visualization panels
- Circuit simulation workspace

**`--color-white` (#FFFFFF)**
- Primary headings (`h1`, `h2`)
- Quantum notation (|ψ⟩, |0⟩, |1⟩)
- Measurement result values
- Important numerical outputs
- Do **not** use for body text — use `--color-arctic` instead

---

## 3. Gradient System

All gradients use only approved palette colors.

| Token | Definition | Usage |
|-------|-----------|-------|
| `--gradient-bg-main` | `linear-gradient(160deg, #071018 0%, #0B132B 100%)` | Page background |
| `--gradient-panel` | `linear-gradient(135deg, rgba(28,43,56,0.85) 0%, rgba(7,16,24,0.95) 100%)` | Glass panels |
| `--gradient-visualization` | `linear-gradient(180deg, #0B132B 0%, #071018 100%)` | Bloch sphere canvas bg |
| `--gradient-header` | `linear-gradient(90deg, #071018 0%, #1C2B38 50%, #071018 100%)` | Section header bg |
| `--gradient-accent` | `linear-gradient(90deg, #446983 0%, #7991A8 100%)` | Probability bar fill |
| `--gradient-gate-button` | `linear-gradient(135deg, #1C2B38 0%, #38506A 100%)` | Gate button background |
| `--gradient-gate-button-hover` | `linear-gradient(135deg, #38506A 0%, #446983 100%)` | Gate button hover state |

---

## 4. Typography

### 4.1 Font Families

```css
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
```

Load from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### 4.2 Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-display` | 3.5rem (56px) | 700 | 1.1 | Page hero titles |
| `--text-h1` | 2.5rem (40px) | 700 | 1.2 | Page section headings |
| `--text-h2` | 1.75rem (28px) | 600 | 1.3 | Sub-section headings |
| `--text-h3` | 1.25rem (20px) | 600 | 1.4 | Panel headings |
| `--text-body-lg` | 1.125rem (18px) | 400 | 1.6 | Educational text |
| `--text-body` | 1rem (16px) | 400 | 1.6 | General body text |
| `--text-body-sm` | 0.875rem (14px) | 400 | 1.5 | Supporting text, captions |
| `--text-label` | 0.75rem (12px) | 500 | 1.4 | Labels, badges |
| `--text-mono` | 1rem (16px) | 400 | 1.5 | Dirac notation, code, values |
| `--text-mono-lg` | 1.5rem (24px) | 500 | 1.3 | Large state notation (|ψ⟩) |

### 4.3 Typography Rules

- Headings: `--color-white`
- Body text: `--color-arctic` (never pure white for paragraphs — reduces eye strain)
- Quantum notation (|0⟩, |1⟩, |+⟩): `--font-mono`, `--color-white`
- Probability percentages: `--font-mono`, `--color-white`, size `--text-body`
- Gate labels: `--font-mono`, `--color-white`, size `--text-label` (uppercase)

---

## 5. Spacing System

Based on a 4px grid:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Minimal gap, icon padding |
| `--space-2` | 8px | Internal element spacing |
| `--space-3` | 12px | Small component gap |
| `--space-4` | 16px | Default element spacing |
| `--space-5` | 20px | Component gap |
| `--space-6` | 24px | Section element gap |
| `--space-8` | 32px | Large section spacing |
| `--space-10` | 40px | Page section gap |
| `--space-12` | 48px | Major section gap |
| `--space-16` | 64px | Page-level spacing |
| `--space-20` | 80px | Hero/display spacing |

---

## 6. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 4px | Small elements (badges, chips) |
| `--radius-md` | 8px | Buttons, inputs |
| `--radius-lg` | 12px | Cards, panels |
| `--radius-xl` | 16px | Large panels |
| `--radius-2xl` | 24px | Modal containers |
| `--radius-full` | 9999px | Pill badges, state dots |

---

## 7. Glass Panel Component

All content panels use a consistent glass effect.

**CSS definition for `.quantum-panel`:**

```css
.quantum-panel {
  background: linear-gradient(
    135deg,
    rgba(28, 43, 56, 0.85) 0%,
    rgba(7, 16, 24, 0.95) 100%
  );
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(56, 80, 106, 0.4);
  border-radius: var(--radius-xl);
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(121, 145, 168, 0.08);
}
```

**Variations:**

- `.quantum-panel--deep` — uses `--color-deep-navy` base (for visualization areas)
- `.quantum-panel--highlight` — adds a subtle Icicle border glow when active
- `.quantum-panel--flat` — no backdrop blur (performance-sensitive contexts)

---

## 8. Button System

### 8.1 Primary Button

Used for: "Run Circuit", "Measure", "Execute Experiment"

```
Background: --gradient-gate-button
Border: 1px solid --color-polar
Text: --color-white, --font-primary, 500 weight, --text-body
Border radius: --radius-md
Padding: --space-3 --space-6
Min-width: 120px
```

**States:**

| State | Background | Border | Text |
|-------|-----------|--------|------|
| Default | `#1C2B38` → `#38506A` gradient | `#38506A` | White |
| Hover | `#38506A` → `#446983` gradient | `#446983` | White |
| Active (press) | `#446983` | `#7991A8` | White |
| Disabled | `rgba(28,43,56,0.4)` | `rgba(56,80,106,0.3)` | `#38506A` |
| Loading | Same as Default + spinner | Same | Same |

Hover transition: `all 200ms ease`.

### 8.2 Gate Button

Used for: X, Y, Z, H, S, T gate selectors.

```
Background: rgba(28,43,56,0.8)
Border: 1px solid rgba(56,80,106,0.6)
Text: --color-white, --font-mono, 500 weight, --text-label, uppercase
Border radius: --radius-md
Padding: --space-3 --space-4
Min-width: 52px; height: 52px
```

**States:**

| State | Background | Border | Glow |
|-------|-----------|--------|------|
| Default | `rgba(28,43,56,0.8)` | `rgba(56,80,106,0.6)` | None |
| Hover | `rgba(56,80,106,0.5)` | `rgba(68,105,131,0.8)` | `0 0 8px rgba(68,105,131,0.3)` |
| Active/Selected | `rgba(68,105,131,0.3)` | `#446983` | `0 0 12px rgba(68,105,131,0.5)` |
| Disabled | `rgba(28,43,56,0.3)` | `rgba(56,80,106,0.2)` | None |

### 8.3 Icon Button

Used for: Reset, History toggle, Camera reset.

```
Background: transparent
Border: 1px solid rgba(56,80,106,0.4)
Color: --color-arctic
Border radius: --radius-md
Size: 36px × 36px
```

---

## 9. Probability Bar Component

The probability bar appears on Pages 2, 3, 4, and 5.

**Layout:**

```
|0⟩  ████████████████████  50.0%
|1⟩  ████████████████████  50.0%
```

**Specification:**

```
Container:
  width: 100%
  display: flex; flex-direction: column; gap: --space-2

Row:
  display: flex; align-items: center; gap: --space-3

Label (|0⟩, |1⟩):
  width: 32px
  font: --font-mono, --text-body-sm, --color-arctic

Bar track:
  flex: 1
  height: 8px
  background: rgba(56,80,106,0.3)
  border-radius: --radius-full
  overflow: hidden

Bar fill:
  height: 100%
  background: --gradient-accent
  border-radius: --radius-full
  transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1)
  — Initial width corresponds to current probability percentage

Percentage value:
  width: 48px; text-align: right
  font: --font-mono, --text-body-sm, --color-white
```

When `prefers-reduced-motion: reduce`, the `transition` is removed and the bar width updates instantly.

---

## 10. Quantum State Indicator

Displays the current quantum state in Dirac notation.

**Layout:**

```
STATE
┌────────────────┐
│      |+⟩       │
└────────────────┘
```

**Specification:**

```
Container: quantum-panel
Text: --font-mono, --text-mono-lg, --color-white, centered
Label "STATE": --text-label, --color-arctic, letter-spacing 0.1em
```

When state updates, the text transitions with a subtle opacity fade (200ms).

---

## 11. Circuit Wire and Gate Token

Used in Pages 4 and 5.

**Wire:**
```
SVG <line>
stroke: --color-polar (#38506A)
stroke-width: 2px
stroke-dasharray: none (solid)
```

**Gate Token (single qubit):**
```
SVG <rect>
width: 48px; height: 48px
fill: rgba(28,43,56,0.9)
stroke: --color-polar
stroke-width: 1.5px
rx: 6px (--radius-md)

Gate label (SVG <text>):
font: --font-mono, 14px, --color-white, centered
```

**Gate Token (selected/hover):**
```
stroke: --color-icicle
fill: rgba(68,105,131,0.2)
filter: drop-shadow(0 0 6px rgba(68,105,131,0.4))
```

---

## 12. Glow Effects

Use glow only for meaningful state communication. Not for decoration.

| Context | CSS `box-shadow` or `filter` |
|---------|------------------------------|
| Active gate button | `box-shadow: 0 0 12px rgba(68,105,131,0.5)` |
| Bloch sphere state point | `filter: drop-shadow(0 0 8px rgba(121,145,168,0.8))` |
| Entanglement connection | `filter: drop-shadow(0 0 6px rgba(68,105,131,0.6))` |
| Measurement result | `box-shadow: 0 0 16px rgba(74,155,127,0.4)` (success) |
| Panel focus | `box-shadow: 0 0 0 2px rgba(68,105,131,0.6)` |

Glow intensity must never exceed these values. No full-saturation neon.

---

## 13. Focus States (Accessibility)

Every focusable element must have a visible focus ring:

```css
:focus-visible {
  outline: 2px solid var(--color-icicle);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

Do not use `:focus` (triggers on mouse click). Use `:focus-visible` only.

---

## 14. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default stacking context |
| `--z-visualization` | 10 | 3D canvas, particle backgrounds |
| `--z-panel` | 20 | Glass panels, cards |
| `--z-controls` | 30 | Gate buttons, sliders |
| `--z-navigation` | 100 | Top navigation bar |
| `--z-tooltip` | 200 | Tooltips |
| `--z-overlay` | 300 | Modal overlays |

---

## 15. Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.3)` | Small cards |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.4)` | Main panels |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.5)` | Large containers |
| `--shadow-visualization` | `0 0 64px rgba(11,19,43,0.8)` | Around visualization areas |

---

## 16. Asset Reference Structure

```
assets/
├── references/            ← Design reference only; not shown in UI
│   ├── color-palette.jpeg
│   └── bloch-sphere-reference.jpeg
├── icons/                 ← SVG icons (gate symbols, UI icons)
├── images/                ← Educational diagrams (WebP, optimized)
├── 3d/                    ← 3D model files if needed
└── fonts/                 ← Local font fallbacks
```

The `references/` folder is for developer reference only. Its contents must never be displayed in the finished application.

---

## 17. CSS Custom Properties Master File

All tokens are defined in `src/styles/tokens.css` and imported into `src/styles/global.css`:

```css
:root {
  /* Colors */
  --color-midnight: #071018;
  --color-solstice: #1C2B38;
  --color-polar: #38506A;
  --color-arctic: #7991A8;
  --color-icicle: #446983;
  --color-deep-navy: #0B132B;
  --color-white: #FFFFFF;
  --color-light-blue: #3A506B;
  --color-success: #4A9B7F;
  --color-warning: #8A7A4A;
  --color-error: #8A4A4A;

  /* Gradients */
  --gradient-bg-main: linear-gradient(160deg, #071018 0%, #0B132B 100%);
  /* ... */

  /* Typography */
  --font-primary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  /* ... */

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  /* ... */

  /* Z-Index */
  --z-navigation: 100;
  /* ... */

  /* Shadows */
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  /* ... */
}
```

**Rule:** Never use raw hex values inside component CSS files. Always reference tokens.

---

## 11. Icon System

All icons are SVG. All icons follow the approved color system. No random or external colors are used.

### 11.1 Icon Color Hierarchy

| State | Color Token | Hex | Use |
|-------|------------|-----|-----|
| Normal | `--color-arctic` | `#7991A8` | Default resting state |
| Hover | `--color-white` | `#FFFFFF` | Mouse/touch hover |
| Active | `--color-icicle` | `#446983` | Currently active/selected page |
| Selected | `--color-white` + icicle glow | `#FFFFFF` | Item is selected |
| Disabled | `--color-polar` | `#38506A` | Non-interactive state |
| Background | `--color-solstice` | `#1C2B38` | Icon tile/button background |

Apply these transitions in CSS:
```css
.icon { color: var(--color-arctic); transition: color 150ms ease; }
.icon:hover { color: var(--color-white); }
.icon.active { color: var(--color-icicle); }
.icon:disabled, .icon[aria-disabled="true"] { color: var(--color-polar); pointer-events: none; }
```

### 11.2 Icon Sizes

| Token | Size | Usage |
|-------|------|-------|
| `--icon-xs` | 14px | Inline within text |
| `--icon-sm` | 16px | Compact controls |
| `--icon-md` | 20px | Standard controls (default) |
| `--icon-lg` | 24px | Primary actions |
| `--icon-xl` | 32px | Feature icons, section headers |
| `--icon-2xl` | 48px | Gate tiles |

### 11.3 Icon Categories and Files

All icon files are located in `assets/icons/`. Each category is a subfolder.

---

#### `assets/icons/navigation/`

Used in the navigation bar and page routing.

| File | Icon | Default Color |
|------|------|--------------|
| `home.svg` | House outline | `#7991A8` |
| `menu.svg` | Hamburger (3 lines) | `#7991A8` |
| `arrow-right.svg` | Right arrow | `#7991A8` |
| `arrow-left.svg` | Left arrow | `#7991A8` |
| `chevron-down.svg` | Downward chevron | `#7991A8` |
| `chevron-right.svg` | Rightward chevron | `#7991A8` |
| `external-link.svg` | Arrow out of box | `#7991A8` |
| `info.svg` | Circle with i | `#7991A8` |
| `help-circle.svg` | Circle with ? | `#7991A8` |

Hover state: `#FFFFFF` | Active state: `#446983`

---

#### `assets/icons/quantum/`

Used across all pages for quantum concept representation.

| File | Icon | Default Color |
|------|------|--------------|
| `bit.svg` | Binary 0\|1 rectangle | `#446983` |
| `qubit.svg` | Orbital sphere with nucleus | `#446983` |
| `atom.svg` | Atom with three elliptical orbits | `#446983` |
| `superposition.svg` | Overlapping sine waves | `#446983` |
| `measurement.svg` | Meter/gauge dial | `#446983` |
| `entanglement.svg` | Two linked circles | `#446983` |
| `quantum-circuit.svg` | Wire + gate + controlled gate | `#446983` |
| `quantum-wave.svg` | Continuous sine wave | `#446983` |
| `quantum-math.svg` | |ψ⟩ = α|0⟩+β|1⟩ text tile | `#446983` |
| `network.svg` | Triangle network nodes | `#7991A8` |
| `nodes.svg` | 4-corner connected nodes | `#7991A8` |
| `link.svg` | Chain link (entanglement) | `#446983` |
| `connection.svg` | Two circles with dashed line | `#446983` |
| `two-qubits.svg` | Two orbital spheres | `#446983` |
| `correlation.svg` | Diagonal connected circles | `#446983` |
| `infinity.svg` | ∞ symbol | `#446983` |
| `pulse.svg` | Heartbeat / quantum pulse line | `#446983` |

Important: Use `#FFFFFF` for active entanglement states. Use `#7991A8` for secondary indicators.

---

#### `assets/icons/gates/`

Quantum gate tile icons. Consistent 48×48px design.

**Gate tile anatomy:**
```
┌──────────────────────────────┐
│  Background:  #1C2B38        │
│  Border:      #38506A 1.5px  │
│  Corner radius: 6px          │
│  Symbol:      #FFFFFF bold   │
└──────────────────────────────┘
```

| File | Gate | Symbol | Notes |
|------|------|--------|-------|
| `gate-H.svg` | Hadamard | **H** | White bold monospace |
| `gate-X.svg` | Pauli-X | **X** | White bold monospace |
| `gate-Y.svg` | Pauli-Y | **Y** | White bold monospace |
| `gate-Z.svg` | Pauli-Z | **Z** | White bold monospace |
| `gate-S.svg` | Phase S | **S** | White bold monospace |
| `gate-T.svg` | T gate | **T** | White bold monospace |
| `gate-CNOT.svg` | Controlled-NOT | ●─⊕ | Control dot + target circle |
| `gate-SWAP.svg` | SWAP | × | Two crossing lines |

Gate tile hover: border color → `#446983`, background → slightly lighter.  
Gate tile selected: border → `#446983` with glow `box-shadow: 0 0 8px rgba(68,105,131,0.6)`.

---

#### `assets/icons/experiments/`

Used in the Experiment Lab page.

| File | Icon | Default Color |
|------|------|--------------|
| `flask.svg` | Laboratory flask | `#446983` |
| `experiment.svg` | Flask with bubbles | `#446983` |
| `play.svg` | Filled play triangle | `#446983` |
| `reset.svg` | Circular reset arrow | `#446983` |
| `check.svg` | Checkmark | `#4A9B7F` (success) |
| `target.svg` | Concentric circles target | `#446983` |
| `steps.svg` | Staircase steps | `#446983` |
| `history.svg` | Clock with reset arrow | `#7991A8` |
| `result.svg` | Bar chart | `#446983` |
| `random.svg` | Shuffle arrows | `#446983` |

Active state: `#FFFFFF` | Secondary: `#7991A8`

---

#### `assets/icons/circuit/`

Used in the Circuit Builder page.

| File | Icon | Default Color |
|------|------|--------------|
| `add.svg` | Plus | `#7991A8` |
| `remove.svg` | Minus | `#7991A8` |
| `trash.svg` | Trash can | `#7991A8` |
| `copy.svg` | Copy rectangles | `#7991A8` |
| `download.svg` | Down arrow to line | `#7991A8` |
| `upload.svg` | Up arrow from line | `#7991A8` |
| `drag.svg` | 6-dot drag handle | `#7991A8` |
| `move.svg` | 4-directional cross | `#7991A8` |
| `lock.svg` | Padlock closed | `#446983` |
| `unlock.svg` | Padlock open | `#7991A8` |
| `add-qubit.svg` | Wire + plus | `#7991A8` |
| `delete-qubit.svg` | Wire + × | `#7991A8` |

Hover: `#FFFFFF` | Active: `#446983`

---

#### `assets/icons/visualization/`

Used in the Bloch sphere controls and visualization panels.

| File | Icon | Default Color |
|------|------|--------------|
| `chart.svg` | Bar chart | `#7991A8` |
| `probability.svg` | Ascending bars | `#7991A8` |
| `activity.svg` | Heartbeat/pulse line | `#7991A8` |
| `rotate-3d.svg` | Rotating arrows | `#7991A8` |
| `zoom-in.svg` | Magnifier + plus | `#7991A8` |
| `zoom-out.svg` | Magnifier + minus | `#7991A8` |
| `fullscreen.svg` | Expand corners | `#7991A8` |
| `minimize.svg` | Collapse corners | `#7991A8` |
| `compass.svg` | Compass rose | `#7991A8` |
| `crosshair.svg` | Crosshair circle | `#7991A8` |
| `layers.svg` | Stacked layers | `#7991A8` |
| `state-vector.svg` | Arrow on sphere | `#7991A8` |

Bloch sphere camera controls primarily use `#7991A8`. Active camera mode: `#FFFFFF`.

---

#### `assets/icons/ui/`

General purpose UI icons used across all pages.

| File | Icon | Default Color |
|------|------|--------------|
| `search.svg` | Magnifier | `#7991A8` |
| `settings.svg` | Gear | `#7991A8` |
| `close.svg` | × | `#7991A8` |
| `plus.svg` | + | `#7991A8` |
| `minus.svg` | − | `#7991A8` |
| `play.svg` | ▶ filled | `#446983` |
| `pause.svg` | ‖ filled | `#7991A8` |
| `refresh.svg` | Circular arrows | `#7991A8` |
| `edit.svg` | Pencil | `#7991A8` |
| `warning.svg` | Triangle ! | `#8A7A4A` |
| `error.svg` | Circle ! | `#8A4A4A` |
| `more-horizontal.svg` | ⋯ | `#7991A8` |
| `more-vertical.svg` | ⋮ | `#7991A8` |
| `eye.svg` | Open eye | `#7991A8` |
| `eye-off.svg` | Crossed eye | `#7991A8` |

### 11.4 Quantum State Notation Display

Quantum state labels are rendered as **text/math elements**, not as image icons.

| State | Display | Color |
|-------|---------|-------|
| Ground state | \|0⟩ | `#FFFFFF` |
| Excited state | \|1⟩ | `#FFFFFF` |
| Plus state | \|+⟩ | `#FFFFFF` |
| Minus state | \|−⟩ | `#FFFFFF` |
| General state | \|ψ⟩ | `#FFFFFF` |
| Supporting labels | "State:", "Probability:" | `#7991A8` |

Font for state notation: `'JetBrains Mono', monospace` at appropriate size.

### 11.5 SVG Conventions

All project SVG icons must follow these conventions:

```
viewBox:           "0 0 24 24" (standard) or "0 0 48 48" (gate tiles)
width/height:      Set in SVG to default size; override via CSS
stroke-width:      1.5px (standard icons)
stroke-linecap:    round
stroke-linejoin:   round
fill:              none (unless icon uses filled shapes)
Default stroke:    #7991A8 or #446983 per category
```

Never use `fill="currentColor"` without confirming the parent element sets the correct CSS `color` value.

---

## 12. Asset Directory Structure

```
assets/
│
├── references/               ← Design reference images (do not use in final app)
│   ├── color-palette.jpeg    ← Official color palette visual reference
│   └── bloch-sphere-reference.jpeg  ← Bloch sphere visual direction reference
│
├── fonts/                    ← Self-hosted web fonts (woff2 format)
│   ├── fonts.css             ← @font-face declarations
│   ├── inter-300.woff2       ← Inter Light
│   ├── inter-400.woff2       ← Inter Regular
│   ├── inter-500.woff2       ← Inter Medium
│   ├── inter-600.woff2       ← Inter SemiBold
│   ├── inter-700.woff2       ← Inter Bold
│   ├── jetbrains-mono-400.woff2  ← JetBrains Mono Regular
│   └── jetbrains-mono-500.woff2  ← JetBrains Mono Medium
│
├── icons/                    ← SVG icon library
│   ├── navigation/           ← Nav bar icons (home, menu, arrows, chevrons)
│   ├── quantum/              ← Quantum concept icons (qubit, entanglement, etc.)
│   ├── gates/                ← Gate tile icons (H, X, Y, Z, S, T, CNOT, SWAP)
│   ├── experiments/          ← Experiment Lab icons (flask, play, reset, etc.)
│   ├── circuit/              ← Circuit Builder icons (add, trash, drag, etc.)
│   ├── visualization/        ← Bloch sphere and chart icons
│   └── ui/                   ← General purpose UI icons
│
├── images/                   ← Static raster images for the application
│
└── 3d/                       ← 3D model files or GLTF assets (if needed)
```

**Important:** The files in `assets/references/` are visual direction references only. They must never be displayed directly in the application UI as quantum visualizations. The Bloch sphere must always be rendered dynamically using Three.js/WebGL.

