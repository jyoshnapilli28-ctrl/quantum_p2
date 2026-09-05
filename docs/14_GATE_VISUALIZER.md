# PAGE 2 — GATE VISUALIZER

---

## 1. Purpose

The Gate Visualizer is an **interactive single-qubit quantum simulator**. The user selects quantum gates and immediately sees how the qubit state changes on a real 3D Bloch sphere, state label, and probability bars.

This page is the primary demonstration of single-qubit quantum computation.

---

## 2. Route and Component

```
Route: /gate-visualizer
Component: GateVisualizer.tsx
State slice: gateVisualizerSlice
Engine calls: engine.applyGate, engine.measureSingle, engine.getBlochCoordinates
```

---

## 3. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ GATE VISUALIZER                  [Reset] [History Toggle]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐  ┌──────────────────────────────┐  │
│  │                         │  │                              │  │
│  │     3D BLOCH SPHERE     │  │   STATE: |+⟩                │  │
│  │                         │  │                              │  │
│  │   (WebGL / Three.js)    │  │   PROBABILITY               │  │
│  │                         │  │   |0⟩ ████████████ 50.0%   │  │
│  │                         │  │   |1⟩ ████████████ 50.0%   │  │
│  │                         │  │                              │  │
│  └─────────────────────────┘  │   GATES                     │  │
│                                │   [H] [X] [Y] [Z] [S] [T]  │  │
│                                │                              │  │
│                                │   [MEASURE]                 │  │
│                                │                              │  │
│                                │   EXPLANATION               │  │
│                                │   "The H gate created       │  │
│                                │    superposition..."        │  │
│                                └──────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│  GATE HISTORY                                                    │
│  #3  H   |0⟩ → |+⟩                                             │
│  #2  X   |1⟩ → |0⟩                                             │
└──────────────────────────────────────────────────────────────────┘
```

**Desktop (>1024px):** Two-column layout: Bloch sphere left, controls right.
**Tablet (768–1024px):** Bloch sphere full width top; controls below.
**Mobile (<768px):** Single column; Bloch sphere at reduced size (280×280px); controls below.

---

## 4. 3D Bloch Sphere

See `18_3D_BLOCH_SPHERE.md` for the complete specification of the Bloch sphere component.

**Summary of requirements for this page:**

- The Bloch sphere renders the current qubit state as a 3D normalized vector (the state point sits on the sphere surface).
- When a gate is applied, the state vector smoothly animates (SLERP interpolation) from the previous state to the new state over 600ms.
- The Bloch sphere canvas occupies a fixed area: 420×420px on desktop, 320×320px on tablet, 280×280px on mobile.
- The user can rotate the camera (click+drag on desktop, swipe on mobile).
- The Bloch sphere is enclosed in a `.quantum-panel--deep` glass panel.
- If WebGL is unavailable, show the fallback state: "3D visualization not available. See state and probabilities below."

**Bloch sphere connection to state:**

```typescript
// GateVisualizer.tsx receives:
const { blochCoordinates, isAnimating, previousState, currentState } = useQuantumStore(...)

// Pass to BlochSphere:
<BlochSphere
  coordinates={blochCoordinates}
  previousCoordinates={previousCoordinates}
  isAnimating={isAnimating}
  onAnimationComplete={() => store.setAnimationComplete()}
/>
```

---

## 5. State Display Panel

### 5.1 State Label

Displays the current quantum state in Dirac notation.

```
┌──────────────────────┐
│  STATE               │
│                      │
│  |+⟩                 │
└──────────────────────┘
```

**Specification:**

```
Label "STATE": --text-label, --color-arctic, uppercase, letter-spacing 0.1em
State value "|+⟩": --font-mono, --text-display (3.5rem), --color-white, centered
Container: quantum-panel; padding --space-6
```

When state updates after gate application:
1. The old label fades out (`opacity 1→0`, 150ms).
2. The new label fades in (`opacity 0→1`, 150ms after fade-out completes).

**State name lookup table** (from engine's `getStateName`):

| State Vector | Label |
|-------------|-------|
| [1, 0] | |0⟩ |
| [0, 1] | |1⟩ |
| [1/√2, 1/√2] | |+⟩ |
| [1/√2, -1/√2] | |-⟩ |
| [1/√2, i/√2] | |i⟩ |
| [1/√2, -i/√2] | |-i⟩ |
| other | α|0⟩ + β|1⟩ |

For the generic case, format α and β as rounded 2-decimal complex numbers.

### 5.2 Probability Bars

```
PROBABILITY

|0⟩  ████████████████████  50.0%
|1⟩  ████████████████████  50.0%
```

Uses the shared `ProbabilityBar` component (see `05_DESIGN_SYSTEM.md` Section 9).

Data source: `store.gateVisualizer.probabilities.p0` and `.p1`.

The bar widths animate smoothly (400ms transition) whenever probabilities change.

---

## 6. Gate Panel

**Position:** Below the probability bars.

**Specification:**
```
GATES

[ H ] [ X ] [ Y ] [ Z ] [ S ] [ T ]
```

- Uses the shared `GateButton` component.
- Gate order: H, X, Y, Z, S, T (always in this order).
- Each button has a tooltip on hover (see `06_UI_UX.md` Section 7).
- Clicking a gate:
  1. The button shows active press state (scale: 0.95, 100ms).
  2. If `isMeasured = true`: show warning, do not apply gate.
  3. Otherwise: dispatch `store.applyGate(gateId)`.
  4. The Bloch sphere begins animating.
- When `isMeasured = true`: all gate buttons are visually disabled.

**Keyboard:** Each gate button is focusable via Tab. Enter or Space applies the gate.

---

## 7. Measure Button

```
[ MEASURE ]
```

**Specification:**

```
Width: full width of the control panel
Style: Primary button (see 05_DESIGN_SYSTEM.md)
```

**Behavior:**
1. Clicking "MEASURE":
   - If `isMeasured = true`: button is disabled, no action.
   - Otherwise: dispatch `store.measure()`.
   - The measurement outcome is shown (see `11_MEASUREMENT_SYSTEM.md` Section 5.1).
   - Gate buttons become disabled.
   - Bloch sphere vector snaps to north pole (|0⟩) or south pole (|1⟩), no smooth animation — measurement collapse should feel instantaneous.
   - State label updates.
   - Probability bars snap to 100%/0% or 0%/100%.

**State after measurement:**
```
STATE

|0⟩                  (or |1⟩)

Measured. Reset to apply gates.
```

The reset reminder text: `--font-primary, --text-body-sm, --color-arctic`.

---

## 8. Explanation Panel

Below the Measure button, show a contextual plain-language explanation.

**Initial:** "Select a gate to transform the qubit."

**After H applied to |0⟩:** "The Hadamard gate created superposition. The qubit now has a 50% chance of being measured as |0⟩ or |1⟩."

**After X applied:** "The Pauli-X gate flipped the qubit. It acts like a classical NOT gate."

**After Z applied to |+⟩:** "The Pauli-Z gate flipped the phase. |+⟩ became |-⟩. On the Bloch sphere, the vector moved to the opposite X-axis side."

**After measurement:** "The quantum state collapsed. The qubit is now definitively [|0⟩ or |1⟩] and cannot be further manipulated without reset."

**Specification:**
```
Container: quantum-panel at lower opacity (rgba(28,43,56,0.5))
Border-left: 3px solid rgba(68,105,131,0.6)
Font: --font-primary, --text-body-sm, --color-arctic
Update animation: cross-fade (opacity 1→0→1) over 300ms when explanation changes
```

---

## 9. Gate History Panel

See `10_GATE_SYSTEM.md` Section 7 for full specification.

**Position:** Below the control panel (full width of page, collapsed by default).

Toggle with a "History ▼" button in the page header.

**Behavior on mobile:** History panel is always below the controls (not toggled).

---

## 10. Reset Button

**Position:** Top right of page header.

**Label:** "Reset" with a refresh icon.

**Behavior:**
1. Resets `gateVisualizerSlice` to initial state (|0⟩, empty history).
2. Bloch sphere vector snaps to north pole.
3. State label shows |0⟩.
4. Probability bars: p0=100%, p1=0%.
5. All gate buttons re-enabled.
6. History panel cleared.

---

## 11. Complete Gate Application Animation Sequence

```
USER clicks gate button [H]
         │
         ▼ (immediate, < 16ms)
Button press state (scale: 0.95, 100ms)
         │
         ▼ (synchronous)
store.applyGate('H') called
  1. Capture previousState
  2. Calculate newState = engine.applyGate(currentState, 'H')
  3. Calculate newBlochCoordinates = engine.getBlochCoordinates(newState)
  4. Update store: currentState, blochCoordinates, probabilities, stateLabel
  5. Append to gateHistory
  6. Set isAnimating = true
         │
         ▼ (React re-render, < 16ms)
React components update:
  - DiracNotation: starts cross-fade to new label
  - ProbabilityBar: starts width transition (400ms)
  - GateHistory: prepends new entry
  - BlochSphere: receives new coordinates, starts SLERP animation (600ms)
  - ExplanationPanel: starts cross-fade to new explanation (300ms)
         │
         ▼ (at 600ms)
BlochSphere animation completes
  - Calls store.setAnimationComplete()
  - isAnimating = false
         │
         ▼ (all done)
All visual elements settled at new state
```

---

## 12. Interaction Rules

| Condition | Gate Buttons | Measure Button | Reset Button |
|-----------|-------------|----------------|-------------|
| Normal | Enabled | Enabled | Enabled |
| `isAnimating = true` | Disabled (pointer-events: none) | Disabled | Disabled |
| `isMeasured = true` | Disabled | Disabled | Enabled |

Disabling during animation prevents the user from applying multiple gates while the Bloch sphere is still moving, which would produce incorrect intermediate states.

---

## 13. Performance Considerations

- Three.js is lazy-loaded when this route activates.
- The Bloch sphere renders at 60fps only during animations. When idle, pause the render loop.
- Use `IntersectionObserver` to pause Three.js rendering when the Bloch sphere is scrolled out of view.
- Probability bar CSS transitions are GPU-accelerated (use `transform: scaleX()` rather than `width` for the bar fill if performance is a concern).

---

## 14. Accessibility

- The Bloch sphere canvas has `role="img"` and `aria-label` that updates with the state: `aria-label="Bloch sphere showing qubit state |+⟩. X: 1.0, Y: 0.0, Z: 0.0"`.
- Gate buttons: `aria-label="Apply Hadamard gate"`.
- Measure button: `aria-label="Measure the qubit state"`.
- After gate application, announce to screen readers via `aria-live="polite"`: "Gate [H] applied. New state: |+⟩. Probability of 0: 50%. Probability of 1: 50%."
- All controls navigable by keyboard (Tab, Enter/Space).
