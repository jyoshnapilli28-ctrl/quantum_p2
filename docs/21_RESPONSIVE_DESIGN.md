# RESPONSIVE DESIGN — SPECIFICATION

---

## 1. Breakpoints

| Token | Range | Label | Strategy |
|-------|-------|-------|----------|
| `mobile-s` | < 480px | Mobile S | Essential-only UI; tap-based interaction |
| `mobile-l` | 480–767px | Mobile L | Single column; simplified visualizations |
| `tablet` | 768–1023px | Tablet | Two-column where possible; touch-friendly |
| `laptop` | 1024–1439px | Laptop | Full layout; all features |
| `desktop` | ≥ 1440px | Desktop | Spacious layout; maximum visualization size |

CSS custom properties for breakpoints:
```css
/* Use in media queries */
@media (max-width: 767px) { /* mobile */ }
@media (min-width: 768px) and (max-width: 1023px) { /* tablet */ }
@media (min-width: 1024px) and (max-width: 1439px) { /* laptop */ }
@media (min-width: 1440px) { /* desktop */ }
```

---

## 2. Navigation Responsive Behavior

### Desktop (≥ 1024px)
- Full horizontal nav bar with all five page labels visible.
- Logo on left, nav items on right.
- Height: 64px.

### Tablet (768–1023px)
- Full horizontal nav bar, same as desktop.
- Labels may use abbreviated text if needed (e.g., "Gate Viz" instead of "Gate Visualizer").

### Mobile (< 768px)
- Logo only visible.
- Hamburger icon (three horizontal bars) on right.
- Tapping hamburger: slide-down menu from top.
- Menu items: full-width tap targets (min-height: 48px).
- Active page: left border `3px solid --color-icicle`.
- Tapping a menu item: navigates and closes menu.

---

## 3. Page 1 — Quantum Universe (Responsive)

### Desktop
- Hero: full viewport height, centered content.
- Sections: two-column layout (visual diagram left, text/explanation right) for Sections 1, 2, 4.
- Sections 3, 5, 6: full-width layout.

### Tablet
- Hero: full viewport height, centered.
- Sections: single column (diagrams above text).
- Diagrams: 100% width, max-width 500px, centered.

### Mobile
- Hero: min-height: 100svh (small viewport height unit).
- All sections: single column.
- Hero particle count: 40.
- Diagrams: 100% width.
- CTA buttons: full width.
- Educational gate matrix display: horizontally scrollable if too wide.

---

## 4. Page 2 — Gate Visualizer (Responsive)

### Desktop (≥ 1024px)
```
┌─────────────────────────────┬───────────────────────────┐
│  Bloch Sphere (420×420px)   │  Controls Panel           │
│                             │  - State label             │
│                             │  - Probability bars        │
│                             │  - Gate buttons            │
│                             │  - Measure button          │
│                             │  - Explanation             │
└─────────────────────────────┴───────────────────────────┘
```
Two columns: 50/50 or 55/45 split.

### Tablet (768–1023px)
```
┌────────────────────────────────────┐
│   Bloch Sphere (320×320px)         │
│          centered                  │
├────────────────────────────────────┤
│   State label                      │
│   Probability bars                 │
│   Gate buttons (horizontal row)    │
│   Measure button                   │
│   Explanation                      │
└────────────────────────────────────┘
```
Single column; Bloch sphere full width, centered.

### Mobile (< 768px)
```
┌────────────────────────────────────┐
│   Bloch Sphere (280×280px)         │  ← Reduced size; center
│                                    │
├────────────────────────────────────┤
│   STATE: |+⟩                       │
│   |0⟩ ██████████ 50.0%            │
│   |1⟩ ██████████ 50.0%            │
├────────────────────────────────────┤
│   [H] [X] [Y] [Z] [S] [T]         │  ← Scrollable row
├────────────────────────────────────┤
│   [MEASURE]  (full width)          │
├────────────────────────────────────┤
│   Explanation panel                │
└────────────────────────────────────┘
```

Gate buttons on mobile: horizontal flex row, `overflow-x: auto`, each button min-width: 52px.

**Very small (< 360px):**
- Bloch sphere hidden by default.
- "Show 3D Bloch Sphere" toggle button shown (collapsed by default).
- All functional controls visible.

---

## 5. Page 3 — Experiment Lab (Responsive)

### Desktop
```
┌───────────────┬─────────────────────────────────────────┐
│  Experiment   │  Workspace                              │
│  Sidebar      │                                         │
│  (240px)      │  Step progress + state + results        │
└───────────────┴─────────────────────────────────────────┘
```

### Tablet
- Experiment selector: dropdown `<select>` or chip row at top.
- Workspace: full width.

### Mobile
- Experiment selector: horizontal chip row (scrollable).
- All workspace sections stacked vertically.
- Step progress bar: horizontal scrollable if > 3 steps visible.
- Shot count stepper: full width.
- Histogram bars: full width.

---

## 6. Page 4 — Entanglement Simulator (Responsive)

### Desktop
```
┌─────────────────────────────────────────────────────────┐
│              Circuit diagram (full width)               │
├───────────────┬───────────────────────┬─────────────────┤
│  Qubit A      │  Combined State       │  Qubit B        │
│  Panel        │  + Entangle Indicator │  Panel          │
├───────────────┴───────────────────────┴─────────────────┤
│  Workflow buttons (horizontal)                          │
├─────────────────────────────────────────────────────────┤
│  Probability + Results histogram                        │
└─────────────────────────────────────────────────────────┘
```

### Tablet
- Circuit diagram: full width, horizontally scrollable if long.
- Three-column qubit panels: preserved (flex may wrap to 1-column-per-row if too narrow).

### Mobile
```
Single column:
1. Circuit diagram (horizontally scrollable SVG)
2. Qubit A panel
3. Combined state + entanglement indicator
4. Qubit B panel
5. Entanglement visual: vertical dashed line between A and B panels
6. Workflow buttons: 2×2 grid
7. Shot count + Measure
8. Histogram
9. Explanation
```

The entanglement arc (Page 4 desktop: horizontal arc between left and right panels) becomes a **vertical dashed line** on mobile between the stacked A and B panels.

---

## 7. Page 5 — Circuit Builder (Responsive)

### Desktop
```
┌──────────────────┬──────────────────────────────────────┐
│  Gate Panel      │  Circuit Workspace                   │
│  (240px)         │  (scrollable horizontally)           │
│                  │                                      │
│  [H][X][Y][Z]    │  q0 ─── [H] ─── [●] ─── [M]        │
│  [S][T]          │               CNOT│                  │
│  [CNOT][SWAP]    │  q1 ─── [  ] ─── [⊕] ─── [M]       │
│                  │                                      │
│  SHOTS [100]     │  [+ Add Row]                         │
│  [RUN CIRCUIT]   │                                      │
└──────────────────┴──────────────────────────────────────┘
```

### Tablet
- Gate panel: collapsible side drawer (toggles with a "Gates ☰" button).
- When drawer is closed: circuit workspace is full width.
- "Run Circuit" button moves to a fixed floating button bar at the bottom.

```
Fixed bottom bar:
  [Open Gates]  ...  [Clear]  [Run Circuit]
  height: 56px
  background: rgba(7,16,24,0.98)
  border-top: 1px solid --color-polar
```

### Mobile (< 768px)

**Gate Panel → Horizontal Strip at Top:**
```
┌─────────────────────────────────────────────┐
│  [H] [X] [Y] [Z] [S] [T] [CNOT] [SWAP]    │ ← Scrollable horizontal
└─────────────────────────────────────────────┘
```
- Each button: 52×52px tap target.
- Selected gate shows Icicle highlight.

**Circuit Workspace:**
```
q0 ─── [   ] ─── [   ] ─── [   ] ─── [M]   ← Horizontally scrollable
q1 ─── [   ] ─── [   ] ─── [   ] ─── [M]
```
- Qubit labels (q0, q1) sticky on the left.
- Cells: 56×56px.

**Interaction (Mobile — Tap-to-Place):**
1. User taps gate from horizontal strip → gate selected (highlighted).
2. User taps an empty cell on the circuit grid → gate placed.
3. User taps a placed gate → remove button appears below → tap to remove.

**No drag-and-drop on mobile.** Use tap-select-place interaction only.

**Fixed bottom bar:**
```
[Clear]  [+Qubit]  [Run Circuit]
```

**Gate removal on mobile:** Tapping a placed gate opens a small action menu:
```
┌──────────────────┐
│ ● Remove [H]     │
│ ○ Cancel         │
└──────────────────┘
```

---

## 8. Touch Target Requirements

All interactive elements must meet minimum touch target size:

| Element | Minimum Size |
|---------|-------------|
| Gate buttons | 48×48px |
| Circuit grid cells (mobile) | 56×56px |
| Navigation items (mobile menu) | 48px height, full width |
| Remove "×" button on gate token | 24×24px |
| Hamburger menu icon | 44×44px |
| Measure button | 48px height |
| Shot count stepper buttons | 40×40px |

---

## 9. Typography Responsive Adjustments

| Token | Desktop | Mobile |
|-------|---------|--------|
| `--text-display` | 3.5rem | 2.25rem |
| `--text-h1` | 2.5rem | 1.75rem |
| `--text-h2` | 1.75rem | 1.375rem |
| `--text-h3` | 1.25rem | 1.125rem |
| DiracNotation xl | 3.5rem | 2.25rem |
| DiracNotation lg | 2rem | 1.5rem |

---

## 10. Images and SVG Responsiveness

- All SVG diagrams use `viewBox` and `width: 100%` — they scale to their container.
- The circuit diagram SVG: `overflow-x: scroll` when its computed width exceeds the viewport.
- No raster images in the core UI (only CSS gradients and SVG).

---

## 11. Print Styles

Not required at launch. No print stylesheets needed.

---

## 12. Viewport Meta

Ensure the viewport meta tag is set in `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

Use `100svh` (small viewport height) for the hero section to avoid mobile browser chrome issues with `100vh`.
