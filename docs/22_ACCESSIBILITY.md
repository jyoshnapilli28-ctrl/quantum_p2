# ACCESSIBILITY — SPECIFICATION

---

## 1. Standard

The application targets **WCAG 2.1 Level AA** compliance throughout.

Core principle: **Never rely solely on color, animation, or visual position to communicate information.** Every quantum state change must also be communicated through text and/or ARIA announcements.

---

## 2. Color Contrast

All text must meet minimum contrast ratios against their backgrounds.

| Foreground | Background | Ratio | Passes |
|-----------|-----------|-------|--------|
| White `#FFFFFF` | Midnight `#071018` | 17.7:1 | ✓ AAA |
| Arctic `#7991A8` | Midnight `#071018` | 5.1:1 | ✓ AA |
| Arctic `#7991A8` | Solstice `#1C2B38` | 4.6:1 | ✓ AA |
| Icicle `#446983` | Midnight `#071018` | 4.7:1 | ✓ AA |
| White `#FFFFFF` | Solstice `#1C2B38` | 9.3:1 | ✓ AAA |
| White `#FFFFFF` | Deep Navy `#0B132B` | 16.2:1 | ✓ AAA |

**Rules:**
- Body text (Arctic): minimum 4.5:1 ✓ 
- Large text (White headings ≥ 24px): minimum 3:1 ✓
- Interactive element labels: minimum 4.5:1 ✓
- Never place Arctic text on Polar background — verify contrast before use.

---

## 3. Keyboard Navigation

Every interactive element must be reachable and operable by keyboard alone.

### 3.1 Tab Order

Tab order follows the natural visual reading order:
1. Navigation bar links (left to right)
2. Page hero CTA (if present)
3. Primary interactive controls (gate buttons, experiment selector, etc.)
4. Secondary controls (measure, run, reset)
5. History toggle
6. Footer links (if any)

Use `tabIndex="0"` for custom interactive elements (SVG gates, qubit indicators). Never use `tabIndex` values greater than 0.

### 3.2 Focus Indicator

All focusable elements must display a visible focus ring:

```css
:focus-visible {
  outline: 2px solid var(--color-icicle);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* Remove focus ring for mouse users */
:focus:not(:focus-visible) {
  outline: none;
}
```

The focus ring must be clearly visible against the dark background. `--color-icicle` (#446983) on `--color-midnight` (#071018): contrast ratio 4.7:1 ✓.

### 3.3 Gate Panel Keyboard

```
Tab     → Focus gate buttons in order: H, X, Y, Z, S, T (then CNOT, SWAP if present)
Enter   → Apply the focused gate (same as click)
Space   → Apply the focused gate (same as click)
Escape  → Blur / deselect gate
```

After applying a gate:
- Focus remains on the same gate button.
- The ARIA live region announces the result.

### 3.4 Circuit Grid Keyboard (Page 5)

```
Tab          → Focus the circuit grid
Arrow Up     → Move focus one row up (one qubit up)
Arrow Down   → Move focus one row down
Arrow Left   → Move focus one column left
Arrow Right  → Move focus one column right
Enter/Space  → Place selected gate at current cell (if selectedGate is set)
              OR activate/select the gate token at this cell
Delete       → Remove gate from current cell
Escape       → Deselect selected gate
Ctrl+Z       → Undo last circuit action
Ctrl+Enter   → Run circuit
```

The focused cell displays a visible focus outline (`2px solid --color-icicle`).

### 3.5 Measurement Shot Stepper

```
Tab         → Focus the shot count display
Arrow Left  → Decrease shots (same as ← button)
Arrow Right → Increase shots (same as → button)
Home        → Set to minimum (1)
End         → Set to maximum (10000)
```

### 3.6 Experiment Selector (Page 3 Sidebar)

```
Tab         → Focus experiment list
Arrow Up/Down → Navigate experiments
Enter/Space → Select focused experiment
```

---

## 4. ARIA Roles and Labels

### 4.1 Navigation

```html
<nav aria-label="Main navigation">
  <ul role="list">
    <li>
      <a href="/" aria-current="page">Quantum Universe</a>
    </li>
    <!-- ... -->
  </ul>
</nav>
```

Use `aria-current="page"` on the active navigation link.

### 4.2 Gate Buttons

```html
<button
  aria-label="Apply Hadamard gate"
  aria-pressed="false"
  aria-disabled="false"
  title="Hadamard Gate: Creates superposition"
>
  H
</button>
```

When gate is disabled (`isMeasured = true`):
```html
<button aria-disabled="true" aria-label="Apply Hadamard gate (disabled — qubit is measured)">
```

Do not use `disabled` attribute alone (removes from tab order). Use `aria-disabled="true"` + `pointer-events: none` to keep button focusable and announce its disabled state.

### 4.3 Bloch Sphere

```html
<canvas
  role="img"
  aria-label="Bloch sphere showing qubit state |+⟩. Vector pointing toward +X axis."
>
</canvas>

<!-- Visually hidden description (always present) -->
<p class="sr-only" aria-live="polite">
  Bloch sphere state: |+⟩. Coordinates: X=1.00, Y=0.00, Z=0.00.
</p>
```

### 4.4 Probability Bars

Each bar row:
```html
<div role="group" aria-label="Probability of measuring |0⟩">
  <span aria-hidden="true">|0⟩</span>
  <div
    role="meter"
    aria-valuenow="50"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-label="50.0% probability of measuring |0⟩"
  >
    <!-- visual bar -->
  </div>
  <span aria-hidden="true">50.0%</span>
</div>
```

### 4.5 Circuit Grid

```html
<div
  role="grid"
  aria-label="Quantum circuit workspace, 2 qubits, 6 columns"
>
  <div role="row" aria-label="Qubit 0">
    <div role="gridcell" aria-label="Qubit 0, column 1: Hadamard gate">
      <!-- gate token -->
    </div>
    <div role="gridcell" aria-label="Qubit 0, column 2: empty">
    </div>
    <!-- ... -->
  </div>
</div>
```

### 4.6 ARIA Live Regions

One persistent ARIA live region for quantum state announcements:

```html
<div
  aria-live="polite"
  aria-atomic="true"
  class="sr-only"
  id="quantum-announcer"
>
  <!-- Updated programmatically on every state change -->
</div>
```

This element updates whenever:
- A gate is applied: "Hadamard gate applied. New state: |+⟩. Probability of |0⟩: 50.0%, |1⟩: 50.0%."
- A measurement is taken: "Measurement complete. Outcome: |0⟩. State has collapsed."
- Multi-shot results: "Measurement results (100 shots): |0⟩ 51 times (51.0%), |1⟩ 49 times (49.0%)."
- Entanglement detected: "Qubits are now entangled. Bell state created."
- Circuit run complete: "Circuit simulation complete. Results: |00⟩ 49.0%, |11⟩ 51.0%."

### 4.7 Validation Errors (Page 5)

```html
<div role="alert" aria-live="assertive">
  <ul>
    <li>CNOT gate: control and target must be different qubits.</li>
  </ul>
</div>
```

Use `role="alert"` (implicitly `aria-live="assertive"`) for validation errors — these require immediate attention.

---

## 5. Semantic HTML

Use semantic HTML elements throughout:

| Element | Usage |
|---------|-------|
| `<nav>` | Main navigation |
| `<main>` | Page main content area |
| `<section>` | Educational sections (Page 1) |
| `<article>` | Experiment cards |
| `<header>` | Page section headers |
| `<h1>` | One per page: page title |
| `<h2>` | Section headings |
| `<h3>` | Sub-section headings / panel headings |
| `<ul>/<li>` | Experiment history, gate history |
| `<button>` | All clickable actions (never `<div>` for buttons) |
| `<a>` | Navigation links, CTA links |
| `<table>` | Gate matrix display (if tabular) |

Never use a `<div>` or `<span>` as an interactive element without adding appropriate `role`, `tabIndex`, and keyboard handlers.

---

## 6. Non-Visual Descriptions for Quantum Visualizations

The Bloch sphere and circuit diagrams are primarily visual. Provide text alternatives for users who cannot see them.

### Bloch Sphere Description

Generate a dynamic description based on coordinates:

```typescript
function describeBlochState(label: string, coords: BlochCoords): string {
  if (label === '|0⟩') return 'Qubit in state |0⟩. Vector points to the north pole.'
  if (label === '|1⟩') return 'Qubit in state |1⟩. Vector points to the south pole.'
  if (label === '|+⟩') return 'Qubit in superposition state |+⟩. Vector points along +X axis. 50% chance of measuring 0 or 1.'
  if (label === '|-⟩') return 'Qubit in state |-⟩. Vector points along -X axis.'
  return `Qubit in state ${label}. Bloch coordinates: X=${coords.x.toFixed(2)}, Y=${coords.y.toFixed(2)}, Z=${coords.z.toFixed(2)}.`
}
```

### Circuit Diagram Description

```typescript
function describeCircuit(circuit: CircuitDefinition): string {
  const gateDescriptions = circuit.gates
    .sort((a, b) => a.column - b.column)
    .map(g => `${g.type} gate on qubit ${typeof g.wire === 'number' ? g.wire : g.wire.join(' and ')}`)
    .join(', then ')
  return `Quantum circuit with ${circuit.qubits} qubits: ${gateDescriptions}.`
}
```

Place this description in an `aria-describedby` element associated with the SVG.

---

## 7. Reduced Motion

Detect and respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Additionally, in JavaScript:
```typescript
const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches
```

Pass `reducedMotion` as a React context value. Components check this before starting animations.

See `20_ANIMATION_SYSTEM.md` Section 12 for the full reduced-motion animation table.

---

## 8. Screen Reader Support

### 8.1 Visually Hidden Helper Class

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

Use `.sr-only` for:
- Bloch sphere state description
- Quantum announcer live region
- Step-by-step state descriptions in experiments

### 8.2 Dynamic Content

All dynamically updated content (state changes, measurement results, step transitions) must be announced via the `#quantum-announcer` ARIA live region.

---

## 9. Forms and Inputs

| Element | Accessibility Requirement |
|---------|--------------------------|
| Shot count stepper | `role="spinbutton"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label` |
| Probability slider (Page 1) | `<input type="range">` with `aria-label`, `aria-valuenow` |
| Experiment selector dropdown | `<select>` with `<label>` |
| Hamburger toggle | `<button>` with `aria-expanded`, `aria-controls` |
| History toggle | `<button>` with `aria-expanded` |

---

## 10. Image Alternatives

If any informational images are used:

- Decorative images: `alt=""` (empty alt, so screen readers skip them).
- Informational diagrams: descriptive `alt` text.
- SVG icons used as buttons: `aria-label` on the `<button>` wrapper.
- Reference images in `assets/references/`: never rendered in the UI.

---

## 11. Testing Checklist

Before release, verify with these tools:

- [ ] **axe DevTools** browser extension — automated accessibility scan on each page.
- [ ] **NVDA + Chrome** (Windows) — full keyboard navigation test.
- [ ] **VoiceOver + Safari** (macOS/iOS) — verify live region announcements.
- [ ] **Keyboard-only navigation test** — navigate all 5 pages without using a mouse.
- [ ] **Zoom to 200%** — verify no content is cut off or overlapping.
- [ ] **High contrast mode** (Windows) — verify UI remains usable.
- [ ] **Color blindness simulation** (Colour Blindness browser extension) — verify state is distinguishable without color alone.
