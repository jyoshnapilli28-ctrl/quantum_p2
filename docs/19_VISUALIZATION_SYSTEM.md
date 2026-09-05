# VISUALIZATION SYSTEM — SPECIFICATION

---

## 1. Purpose

This document defines all shared visualization components used across the five pages. All visualizations share the same visual language, color palette, and behavioral patterns.

The visualization layer reads state from the Zustand store. It does not modify state.

---

## 2. Visualization Component Inventory

| Component | Used On Pages | Technology |
|-----------|--------------|-----------|
| BlochSphere | 2 | Three.js / R3F |
| ProbabilityBar | 2, 3, 4, 5 | CSS + React |
| ProbabilityHistogram | 3, 4, 5 | CSS + React |
| CircuitDiagram | 1, 4, 5 | SVG (inline React) |
| DiracNotation | 1, 2, 3, 4, 5 | CSS + React |
| EntanglementConnection | 4 | SVG animation |
| QuantumParticles | 1 (hero) | HTML Canvas |
| GateToken | 4, 5 | SVG + React |
| StateVectorDisplay | 2, 4 | CSS + React |
| QubitIndicator | 1, 3, 4 | SVG + CSS |

---

## 3. ProbabilityBar Component

**File:** `src/components/shared/ProbabilityBar.tsx`

### 3.1 Props

```typescript
interface ProbabilityBarProps {
  label: string;          // e.g., '|0⟩', '|1⟩', '|00⟩'
  probability: number;    // 0.0 to 1.0
  showCount?: boolean;    // whether to show raw count alongside %
  count?: number;         // raw count (for multi-shot results)
  animate?: boolean;      // whether to animate width changes (default: true)
  'aria-label'?: string;
}
```

### 3.2 Render Spec

```
Row layout: flex; align-items: center; gap: 12px

Label:
  font: --font-mono, 14px, --color-arctic
  width: 40px (fixed, right-aligned)
  content: props.label

Bar container:
  flex: 1
  height: 8px
  background: rgba(56,80,106,0.3)
  border-radius: 9999px
  overflow: hidden

Bar fill:
  height: 100%
  width: `${probability * 100}%`
  background: linear-gradient(90deg, #446983, #7991A8)
  border-radius: 9999px
  transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1)
  (if animate=false or prefers-reduced-motion: no transition)

Count (optional):
  font: --font-mono, 12px, --color-arctic
  width: 40px; text-align: right

Percentage:
  font: --font-mono, 14px, --color-white
  width: 48px; text-align: right
  content: formatProbability(probability) → e.g., "50.0%"
```

### 3.3 Zero Probability Display

When probability === 0:
- Bar fill width: 0%
- Percentage: "0.0%"
- Row is NOT hidden — still displayed for completeness

---

## 4. ProbabilityHistogram Component

**File:** `src/components/shared/ProbabilityHistogram.tsx`

Used for multi-shot measurement results across Pages 3, 4, 5.

### 4.1 Props

```typescript
interface ProbabilityHistogramProps {
  title?: string;               // e.g., "Measurement Results"
  shots: number;                // Total shots
  results: Record<string, number>; // { '0': 51, '1': 49 } or { '00': 47, ... }
  totalBasisStates: number;     // 2 for 1 qubit, 4 for 2 qubits, etc.
  showNote?: boolean;           // Show "Results are probabilistic" note
}
```

### 4.2 Render Spec

```
Container: quantum-panel; padding --space-6

Title:
  "MEASUREMENT RESULTS (N shots)"
  font: --font-primary, --text-h3, --color-white
  Subtitle note (optional): --text-label, --color-arctic, opacity 0.7

One ProbabilityBar per basis state (in binary order)

Each bar:
  label = basis state name (|00⟩, etc.)
  probability = count / shots
  count = count
  showCount = true

Bars animate from 0% to final value when the component first renders
(or when shots change)
Animation: 600ms stagger (each bar starts 80ms after the previous)
```

### 4.3 Generating Basis State Order

For N qubits, generate all 2^N binary strings in ascending order:

```
1 qubit: ['0', '1']
2 qubits: ['00', '01', '10', '11']
3 qubits: ['000', '001', '010', '011', '100', '101', '110', '111']
```

Format as Dirac notation: `|00⟩`, etc.

For missing basis states in results (count = 0), show them with 0 count.

---

## 5. CircuitDiagram Component

**File:** `src/components/circuit/CircuitDiagram.tsx`

SVG-based quantum circuit renderer. Used on Pages 1, 4, and 5.

### 5.1 Props

```typescript
interface CircuitDiagramProps {
  qubits: number;           // Number of qubit wires
  gates: GatePlacement[];   // Gate placements
  highlightedColumn?: number; // Column to highlight (for step-by-step)
  highlightedGateId?: string; // Specific gate to highlight
  showMeasurement?: boolean;  // Whether to show M gates at the end
  interactive?: boolean;      // For Page 5 (adds hover/click handlers)
  onGateClick?: (gateId: string) => void;
  onGateRemove?: (gateId: string) => void;
  width?: number;           // SVG width in pixels
}
```

### 5.2 Rendering Algorithm

```
1. Calculate layout:
   column_width = 72px
   row_height = 64px
   label_width = 32px
   measure_column_width = 48px
   total_cols = max(gate columns) + 1 (for measurement)

   SVG width = label_width + (total_cols * column_width) + measure_column_width
   SVG height = qubits * row_height + 20px (padding)

2. Draw qubit wire labels:
   "q0", "q1", etc. at x=0, y=center of each row
   font: --font-mono, 12px, --color-arctic

3. Draw wire lines:
   <line> from label_width to end of SVG
   y = row center for each qubit
   stroke: --color-polar, stroke-width: 2

4. For each gate in gates array:
   Calculate x = label_width + (gate.column * column_width)
   Calculate y = gate.wire (if single) or span between gate.wire[0] and gate.wire[1]

   Draw gate token at (x, y):
     Single-qubit: rect 48×48 centered at (x, wire_y)
     Multi-qubit: control/target symbols connected by vertical line

5. Highlight: if gate matches highlightedGateId or column matches highlightedColumn:
   Apply glow filter (SVG feGaussianBlur + feComposite)
   Change border color to --color-icicle

6. Draw measurement gates (if showMeasurement):
   At x = end of all gates + measure_margin
   "M" box for each qubit wire
```

### 5.3 Gate Token Types (SVG)

**Single-qubit gate:**
```svg
<rect x="{cx-24}" y="{cy-24}" width="48" height="48"
  rx="6" fill="rgba(28,43,56,0.9)"
  stroke="#38506A" stroke-width="1.5"/>
<text x="{cx}" y="{cy+5}"
  text-anchor="middle" dominant-baseline="middle"
  font-family="JetBrains Mono" font-size="14" fill="white">
  {gate.type}
</text>
```

**CNOT control:**
```svg
<circle cx="{cx}" cy="{cy}" r="5" fill="white"/>
```

**CNOT target:**
```svg
<circle cx="{cx}" cy="{cy}" r="12" fill="none" stroke="white" stroke-width="1.5"/>
<line x1="{cx-12}" y1="{cy}" x2="{cx+12}" y2="{cy}" stroke="white" stroke-width="1.5"/>
<line x1="{cx}" y1="{cy-12}" x2="{cx}" y2="{cy+12}" stroke="white" stroke-width="1.5"/>
```

**CNOT vertical connector:**
```svg
<line x1="{cx}" y1="{control_y}" x2="{cx}" y2="{target_y}"
  stroke="#38506A" stroke-width="1.5"/>
```

**Measurement gate:**
```svg
<rect x="{cx-20}" y="{cy-20}" width="40" height="40"
  rx="4" fill="rgba(28,43,56,0.9)" stroke="#38506A" stroke-width="1.5"/>
<text x="{cx}" y="{cy+5}"
  text-anchor="middle" font-family="JetBrains Mono"
  font-size="12" fill="#7991A8">
  M
</text>
```

---

## 6. DiracNotation Component

**File:** `src/components/shared/DiracNotation.tsx`

Renders quantum state in Dirac ket notation with proper typography.

### 6.1 Props

```typescript
interface DiracNotationProps {
  state: string;       // e.g., '|+⟩', '|0⟩', '|00⟩'
  size?: 'sm' | 'md' | 'lg' | 'xl';  // Text size
  animate?: boolean;  // Cross-fade on state change (default: true)
}
```

### 6.2 Size Map

| Size | Font Size | Usage |
|------|-----------|-------|
| sm | 16px | Gate history entries |
| md | 24px | Step display, card labels |
| lg | 32px | State panels |
| xl | 56px | Main state display (Gate Visualizer) |

### 6.3 Render Spec

```
font: --font-mono
color: --color-white
line-height: 1.2

State change animation (if animate=true):
  1. Fade out current (opacity 1→0, 150ms)
  2. Update DOM content
  3. Fade in new (opacity 0→1, 150ms)
  Total: 300ms cross-fade
  On prefers-reduced-motion: instant update, no fade
```

---

## 7. EntanglementConnection Component

**File:** `src/components/shared/EntanglementConnection.tsx`

An SVG arc connecting two qubit panels when they are entangled.

### 7.1 Props

```typescript
interface EntanglementConnectionProps {
  fromRef: React.RefObject<HTMLElement>;  // Qubit A panel ref
  toRef: React.RefObject<HTMLElement>;    // Qubit B panel ref
  visible: boolean;                       // Whether to show the connection
}
```

### 7.2 Render Spec

```
SVG overlaid on the parent layout:
  position: absolute; top: 0; left: 0; width: 100%; height: 100%
  pointer-events: none
  z-index: var(--z-visualization)

Path: quadratic bezier from fromRef center to toRef center
  Control point: midpoint between them, raised by 30px upward

SVG <path>:
  fill: none
  stroke: #446983 (Icicle)
  stroke-width: 2
  stroke-dasharray: 6 4
  opacity: 0.7

  Entrance animation:
    stroke-dashoffset: path.getTotalLength() → 0
    duration: 600ms (draws the line from start to end)
    On prefers-reduced-motion: appear instantly

  Marching ants (while visible):
    stroke-dashoffset: animates from 0 to (dash+gap) × loop
    duration: 1s; repeat: infinite; linear
    On prefers-reduced-motion: static dashed line

  Exit animation: opacity 1→0, 300ms
```

---

## 8. QuantumParticles Component

**File:** `src/visualization/particles/QuantumParticles.ts`

Canvas-based background particle system for Page 1 hero section.

### 8.1 Configuration

```typescript
const PARTICLE_CONFIG = {
  desktop: { count: 80, speed: 0.15, size: { min: 1, max: 2.5 } },
  mobile:  { count: 40, speed: 0.10, size: { min: 1, max: 2.0 } },
  color: [121, 145, 168],    // Arctic --color-arctic RGB
  opacityRange: [0.15, 0.55],
  connectionDistance: 120,   // px — draw faint lines between nearby particles
  connectionOpacityMax: 0.12
}
```

### 8.2 Behavior

Each particle:
- Has a random position, velocity (x and y components), and opacity.
- Drifts slowly in its direction. On reaching canvas edge, wraps to opposite edge.
- Opacity oscillates gently (sine wave, 3–6s period, each particle independently offset).

Connections:
- When two particles are closer than `connectionDistance`, draw a faint line between them.
- Line opacity proportional to `1 - (distance / connectionDistance)`, capped at `connectionOpacityMax`.

**Animation loop:**
- Uses `requestAnimationFrame`.
- On `prefers-reduced-motion: reduce`: cancel animation loop. Particles are static dots (no movement, no connections).
- Pause animation when the section is not in the viewport (IntersectionObserver).

---

## 9. QubitIndicator Component

**File:** `src/components/shared/QubitIndicator.tsx`

A circular SVG indicator showing the "charge" or "state" of a qubit visually.

### 9.1 Props

```typescript
interface QubitIndicatorProps {
  probability0: number;   // 0 to 1 (brightness of |0⟩ side)
  label?: string;         // Optional state label below
  size?: number;          // Circle diameter in px (default: 48)
  glow?: boolean;         // Whether to apply glow effect
}
```

### 9.2 Visual States

| State | Visual |
|-------|--------|
| |0⟩ (p0=1) | Solid filled circle, bright Arctic |
| |1⟩ (p0=0) | Empty circle (outline only), dim Arctic |
| |+⟩ (p0=0.5) | Half-filled circle (left=dark, right=bright) |
| Arbitrary | Gradient fill based on probability |

```
SVG circle:
  radius: size/2
  fill: CSS conic-gradient from dark (|1⟩) to bright (|0⟩) based on probability0
  stroke: --color-polar; stroke-width: 1.5px

Glow (if glow=true):
  filter: drop-shadow(0 0 6px rgba(121,145,168,0.6))
```

---

## 10. Shared Visualization Rules

1. **All visualizations react to the store state.** They never maintain internal state for quantum values.
2. **All visualizations use design tokens.** Never hard-code hex values in visualization files.
3. **All transitions respect `prefers-reduced-motion`.** If the media query is set, replace transitions with instant updates.
4. **Visualizations are never placeholders.** Every component shows real data from the quantum engine.
5. **The Bloch sphere is the only Three.js/WebGL component.** All other visualizations use CSS, SVG, or Canvas.
