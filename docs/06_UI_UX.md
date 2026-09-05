# UI / UX SPECIFICATION — QUANTUM UNIVERSE

---

## 1. Navigation

### 1.1 Top Navigation Bar

The navigation bar is **persistent** across all five pages. It does not re-render on page transition — only the active page indicator updates.

**Layout:**
```
┌──────────────────────────────────────────────────────────────────────────┐
│  ⬡ QUANTUM UNIVERSE │ Universe │ Gate Visualizer │ Experiment │ Entangle │ Circuit │
└──────────────────────────────────────────────────────────────────────────┘
```

**Specification:**

```
Height: 64px (desktop), 56px (mobile)
Background: rgba(7,16,24,0.95) with backdrop-filter: blur(16px)
Border-bottom: 1px solid rgba(56,80,106,0.3)
Position: fixed; top: 0; width: 100%; z-index: var(--z-navigation)
```

**Logo (left side):**
- SVG hexagon atom icon
- Text: "QUANTUM UNIVERSE" in `--font-primary`, weight 600, `--color-white`
- Clicking the logo navigates to `/` (Page 1)

**Nav items:**
- Labels: "Universe", "Gate Visualizer", "Experiment Lab", "Entanglement", "Circuit Builder"
- Font: `--font-primary`, weight 500, `--text-body-sm`
- Default color: `--color-arctic`
- Hover color: `--color-white`; hover transition: 150ms
- Active (current page): `--color-white` with a 2px underline in `--color-icicle`; underline animated with `scaleX` from 0 to 1 on mount

**Mobile collapse (< 768px):**
- Nav items hidden behind a hamburger icon (three horizontal lines, `--color-arctic`)
- Tap hamburger → slide-down menu from top (height: auto, background: `rgba(7,16,24,0.98)`)
- Each menu item is a full-width tap target (min-height: 48px)
- Active page shown with left border: `3px solid --color-icicle`
- Tapping a menu item navigates and closes the menu

### 1.2 Page Transition

When navigating between pages:
1. Current page fades out: `opacity 1 → 0`, duration 200ms.
2. Route changes.
3. New page fades in: `opacity 0 → 1`, duration 300ms.

Use Framer Motion `AnimatePresence` on the router outlet.

No slide, scale, or complex transition — only opacity. This ensures quantum visualizations re-initialize cleanly.

---

## 2. Page Layout Structure

Each page uses the same layout shell:

```
┌──────────────────────────────────────┐
│          NAVIGATION (fixed)          │
├──────────────────────────────────────┤
│                                      │
│          PAGE HERO SECTION           │  (optional: page title, subtitle)
│                                      │
├──────────────────────────────────────┤
│                                      │
│          MAIN CONTENT AREA           │
│                                      │
└──────────────────────────────────────┘
```

Content area starts at 64px from the top (navigation height). No horizontal overflow.

**Max content width:** 1280px, centered with `margin: 0 auto`.

**Page padding:**
- Desktop: `--space-8` (32px) horizontal
- Tablet: `--space-6` (24px) horizontal
- Mobile: `--space-4` (16px) horizontal

---

## 3. User Journey

### First-Visit Flow

```
User arrives at /
         ↓
Page 1: Quantum Universe
         ↓
Reads "Classical Bit vs Qubit" section
         ↓
Scrolls through all six educational sections
         ↓
Sees [Go to Gate Visualizer] CTA button
         ↓
Navigates to /gate-visualizer
         ↓
Applies H gate → sees Bloch sphere move
         ↓
Reads tooltip: "Superposition: equal probability of |0⟩ and |1⟩"
         ↓
Navigates to /experiment-lab
         ↓
Runs "Superposition" experiment
         ↓
...and so on
```

### Returning User Flow

User navigates directly to a specific page. Their last session state is preserved (within the same browser session). If state is empty, the page shows the initial zero state with a subtle "welcome back" hint.

---

## 4. Interaction Hierarchy

Every page's interactive elements are organized in this priority order:

1. **Primary action** — the most important thing the user can do (e.g., "Apply Gate", "Run Circuit", "Measure")
2. **Quantum visualization** — the visual output of the primary action
3. **State information** — current quantum state label and probability values
4. **Secondary controls** — gate selection, experiment selection, qubit count
5. **Tertiary controls** — reset, history, settings

Primary action buttons must be visually dominant (larger, centrally placed, or clearly highlighted).

---

## 5. Loading States

### 5.1 Initial Page Load

When a page component is lazy-loaded for the first time:
- Show a centered loading indicator: a pulsing hexagonal atom SVG animation
- Background: `--color-midnight`
- Duration: until the chunk and any async data resolves
- Do not show a blank white flash

### 5.2 Three.js Loading (Bloch Sphere)

When the Gate Visualizer loads Three.js for the first time:
- Bloch sphere canvas shows: "Initializing 3D visualization..." in `--color-arctic`
- A single rotating Polar-colored ring indicates loading
- Three.js is not heavy once cached; this state should last < 1 second on broadband

### 5.3 Circuit Execution

When "Run Circuit" is pressed:
- The result panel shows a brief "Simulating..." state with a quantum-themed spinner (orbiting dots)
- Duration: < 50ms (calculation is instant); spinner is purely UX — minimum 300ms display
- Results appear after the spinner with a slide-up animation

### 5.4 Experiment Execution

Each step plays sequentially with a 600ms delay between steps. During execution:
- The "Execute" button is disabled and shows "Running..."
- Steps animate in sequence with visual highlighting
- User cannot press gate buttons during experiment execution

---

## 6. Empty States

| Scenario | Display |
|----------|---------|
| Gate history (no gates applied) | "No gates applied yet. Select a gate to begin." |
| Experiment history (no experiments run) | "Your experiment history will appear here." |
| Circuit grid (no gates placed) | Dashed wire lines with subtle "Drag gates here" label |
| Measurement result (not yet measured) | "Press Measure to collapse the quantum state." |

Empty states use `--color-arctic` text, `--text-body-sm`, centered in the container.

---

## 7. Tooltips

Gate buttons display tooltips on hover (desktop) and on tap-hold (mobile).

**Tooltip content per gate:**

| Gate | Tooltip |
|------|---------|
| X | "Pauli-X (NOT) Gate: Flips |0⟩ to |1⟩ and vice versa. Analogous to a classical NOT gate." |
| Y | "Pauli-Y Gate: Applies a rotation of π around the Y-axis. Combines bit-flip and phase-flip." |
| Z | "Pauli-Z Gate: Flips the phase of |1⟩. |0⟩ is unchanged; |1⟩ gains a -1 phase factor." |
| H | "Hadamard Gate: Creates superposition. |0⟩ becomes (|0⟩ + |1⟩)/√2 (equal probability of 0 and 1)." |
| S | "Phase Gate (S): Adds a 90° phase rotation (i) to |1⟩. Also called √Z gate." |
| T | "T Gate: Adds a 45° phase rotation (π/4) to |1⟩. Important for universal quantum computation." |
| CNOT | "Controlled-NOT Gate: Flips the target qubit if the control qubit is |1⟩. Creates entanglement." |
| SWAP | "SWAP Gate: Exchanges the states of two qubits." |

**Tooltip style:**
```
Background: rgba(28,43,56,0.95)
Border: 1px solid rgba(56,80,106,0.5)
Border-radius: --radius-md
Padding: --space-3 --space-4
Max-width: 280px
Font: --font-primary, --text-body-sm, --color-arctic
Heading: --color-white, --text-label, uppercase
Arrow: CSS triangle pointing to the trigger element
z-index: var(--z-tooltip)
Animation: fade in 150ms
```

---

## 8. Error States

### 8.1 Gate Validation Error

Context: User tries to apply CNOT to a single-qubit circuit.

Display:
- The gate button shakes (horizontal keyframe animation, 400ms)
- A red-tinted inline message appears below the gate panel: "CNOT requires two qubits. Add a second qubit to the circuit."
- Message auto-dismisses after 4 seconds

### 8.2 WebGL Not Supported

Context: User's browser does not support WebGL for Bloch sphere.

Display:
- Bloch sphere canvas shows: "3D visualization requires WebGL support. Your browser may not support it."
- Below that: "Mathematical state and probability information are fully available below."
- The rest of the Gate Visualizer (probability bars, state notation, gate history) functions normally

### 8.3 Quantum Engine Error

Context: An unexpected error in quantum calculation (should not happen, but guarded).

Display:
- Error boundary catches the error
- Panel shows: "An error occurred in the quantum simulation. Please reset and try again."
- Reset button visible
- Error details logged to console (not shown to user)

---

## 9. Educational Explanations

On the Gate Visualizer and Experiment Lab, every state change must be accompanied by a brief explanation in plain language.

**Explanation panel specification:**

```
Position: Below the state visualization, above the gate history
Background: rgba(28,43,56,0.5) (slightly lighter than deep panels)
Border-left: 3px solid rgba(68,105,131,0.6)
Padding: --space-4
Border-radius: --radius-md
Font: --font-primary, --text-body-sm, --color-arctic
```

**Example explanations:**

- After applying H to |0⟩: "The Hadamard gate put the qubit in superposition. It now has an equal 50% chance of being measured as |0⟩ or |1⟩."
- After measuring a qubit: "The quantum state has collapsed. The qubit is now definitively |0⟩ and will remain so until reset."
- After CNOT in entanglement: "CNOT has entangled the two qubits. Measuring one qubit will instantly determine the other's state."

---

## 10. Keyboard Navigation

All interactive elements are reachable via Tab key. Tab order follows visual reading order (top-left to bottom-right).

| Element | Keyboard Behavior |
|---------|------------------|
| Navigation links | Tab to focus, Enter to navigate |
| Gate buttons | Tab to focus, Enter or Space to apply gate |
| Run Circuit | Tab to focus, Enter to execute |
| Measure button | Tab to focus, Enter to measure |
| Reset button | Tab to focus, Enter to reset |
| Experiment selector | Tab to focus, Arrow keys to cycle, Enter to select |
| Circuit grid cells | Arrow keys to navigate grid, Enter to place selected gate, Delete to remove gate |
| Bloch sphere | Tab to focus container; no keyboard camera control required |

See `22_ACCESSIBILITY.md` for full keyboard specification.

---

## 11. Mobile Interaction

### Touch-Specific Patterns

| Feature | Desktop Behavior | Mobile Behavior |
|---------|-----------------|-----------------|
| Gate buttons | Click to apply | Tap to apply |
| Gate tooltips | Hover to show | Tap-hold 500ms to show; tap outside to dismiss |
| Bloch sphere camera | Click+drag to rotate | Pinch to zoom, swipe to rotate |
| Circuit gate placement | Drag-and-drop | Tap gate in panel to select, tap grid cell to place |
| Experiment steps | Auto-plays | Tap "Next Step" button for manual control |

### Mobile-Specific UI

- Gate panel becomes a horizontally scrollable row of gate buttons (no wrapping)
- Probability bars are full-width (single column)
- Bloch sphere viewport is reduced to 280×280px on small screens
- Circuit builder uses a simplified tap-to-place interaction instead of drag-and-drop

---

## 12. Feedback Principles

Every user action must result in immediate visual feedback:

| Action | Immediate Feedback | Delayed Feedback |
|--------|-------------------|-----------------|
| Click gate button | Button depresses (scale 0.95, 100ms) | Bloch sphere animates (600ms) |
| Click Measure | Button disabled, spinner | Result appears |
| Place circuit gate | Gate token appears at grid position | — |
| Remove circuit gate | Gate token disappears | — |
| Click Reset | Brief flash, state resets | — |
| Run Circuit | Button shows "Running..." | Results histogram appears |

Feedback must never be delayed by more than 100ms from the interaction. If calculation takes time, show immediate loading state.
