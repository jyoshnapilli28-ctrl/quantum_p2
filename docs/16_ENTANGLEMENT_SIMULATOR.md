# PAGE 4 — ENTANGLEMENT SIMULATOR

---

## 1. Purpose

The Entanglement Simulator expands the application from single-qubit to **two-qubit quantum mechanics**. It demonstrates quantum entanglement — the phenomenon where two qubits become correlated such that measuring one instantly determines the state of the other, regardless of the distance between them.

The primary workflow creates a **Bell state** (the maximally entangled two-qubit state) and demonstrates correlated measurement.

---

## 2. Route and Component

```
Route: /entanglement
Component: EntanglementSim.tsx
State slice: entanglementSlice
Engine calls: engine.createTwoQubitZeroState, engine.applyGateToQubit,
             engine.applyCNOT, engine.isEntangled, engine.getProbabilities2Q,
             engine.measureTwoQubit, engine.measureMultiShot2Q
```

---

## 3. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ ENTANGLEMENT SIMULATOR                     [Reset] [Info]        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│         ┌───────────────────────────────────────────┐           │
│         │           CIRCUIT VISUALIZATION           │           │
│         │                                           │           │
│         │  QUBIT A ──── [H] ────●──────── [M]       │           │
│         │                      │                    │           │
│         │  QUBIT B ────────────⊕──────── [M]        │           │
│         │                                           │           │
│         └───────────────────────────────────────────┘           │
│                                                                  │
│    QUBIT A              STATE               QUBIT B             │
│  ┌────────────┐  ┌─────────────────┐  ┌────────────┐           │
│  │            │  │                 │  │            │           │
│  │   STATE    │  │ (|00⟩+|11⟩)/√2 │  │   STATE    │           │
│  │   |0⟩      │  │                 │  │   |0⟩      │           │
│  │            │  │ ⚛ ENTANGLED     │  │            │           │
│  └────────────┘  └─────────────────┘  └────────────┘           │
│                                                                  │
│         WORKFLOW                                                 │
│    [1: Apply H to A]  [2: Apply CNOT]  [3: Measure]             │
│                                                                  │
│         MEASUREMENT RESULTS (100 shots)                          │
│    |00⟩  ████████████████████  49   49.0%                       │
│    |01⟩                         0    0.0%                       │
│    |10⟩                         0    0.0%                       │
│    |11⟩  ███████████████████   51   51.0%                       │
│                                                                  │
│    "Measuring A as |0⟩ guarantees B is |0⟩..."                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 4. Circuit Visualization

The circuit is always shown as a fixed diagram at the top of the page. It represents the Bell state creation circuit.

```
QUBIT A ──── H ────●──────── M
                   │
QUBIT B ───────────⊕──────── M
```

**Specification:**

```
SVG-based circuit diagram using shared CircuitDiagram component
Width: 100%; max-width: 600px; centered

Wire lines: stroke --color-polar, stroke-width 2px
Gate tokens:
  [H]: square box, label "H" (see 10_GATE_SYSTEM.md for gate token styling)
  [●]: CNOT control dot (see 10_GATE_SYSTEM.md)
  [⊕]: CNOT target symbol
  [M]: measurement symbol (meter symbol or box with "M")
  Vertical CNOT connector line: dashed when not yet entangled, solid after CNOT applied

Step highlighting:
  The gate corresponding to the current workflow step is highlighted:
  Gate token: border color changes to --color-icicle, glow effect applied
  Others: standard --color-polar border
```

---

## 5. Qubit State Indicators

Three panels in a row:

```
QUBIT A              STATE               QUBIT B
┌────────────┐  ┌─────────────────┐  ┌────────────┐
│  ⬡ |0⟩    │  │ (|00⟩+|11⟩)/√2  │  │  ⬡ |0⟩    │
└────────────┘  └─────────────────┘  └────────────┘
```

**Qubit A panel:**
```
Container: quantum-panel, flex-column, centered
Icon: hexagonal atom SVG (or circle), color --color-arctic
State label: --font-mono, --text-h3, --color-white
Sub-label: "Qubit A", --text-label, --color-arctic
```

**Combined state panel (center):**
```
Container: quantum-panel, larger; flex-column; centered
State label: full two-qubit state in Dirac notation
  Examples:
    Before entanglement: "|00⟩"
    After H on A: "(|00⟩ + |10⟩) / √2"
    After CNOT: "(|00⟩ + |11⟩) / √2"
  Font: --font-mono, --text-h2 (reduced on mobile)
  
Entanglement indicator:
  When isEntangled = false: not shown
  When isEntangled = true:
    ⚛ ENTANGLED — shown in a chip/badge below the state label
    Badge: background rgba(68,105,131,0.2), border 1px solid --color-icicle
    Icon: atom symbol, --color-icicle
    Text: "ENTANGLED", --text-label, --color-icicle, uppercase
    Enter animation: scale 0→1, opacity 0→1, 300ms spring
```

**Qubit B panel:**
- Same as Qubit A panel (mirrored).

---

## 6. Entanglement Visualization

When the two qubits are entangled (after CNOT applied):

Display a visual connection between the two qubit panels:

```
QUBIT A     ~~~~ entanglement ~~~~     QUBIT B
  ⬡                                      ⬡
   \                                     /
    ───────────●─────────────────────────
```

**Implementation:** An SVG `<path>` or `<line>` drawn beneath the qubit panels, connecting their centers. The path uses a gentle arc (quadratic bezier).

```
Path style:
  stroke: --color-icicle
  stroke-width: 2px
  stroke-dasharray: 6 4 (dashed)
  opacity: 0.7
  Animation: stroke-dashoffset animated (marching ants effect, 1s loop)
  On prefers-reduced-motion: static dashed line, no marching animation
```

The connection appears (fade in, 400ms) when `isEntangled` becomes true.
The connection disappears (fade out) when Reset is clicked.

---

## 7. Workflow Steps

The entanglement workflow is presented as three sequential buttons:

```
[ 1: Initialize ]   [ 2: Apply H → A ]   [ 3: CNOT ]   [ 4: Measure ]
```

**Step 1 — Initialize:**
- Both qubits reset to |0⟩.
- State = |00⟩.
- Dispatches `reset()`.

**Step 2 — Apply H to Qubit A:**
- Applies H to qubit 0 of the two-qubit state.
- Dispatches `applyHadamardToA()`.
- State becomes (|00⟩ + |10⟩)/√2.
- Circuit diagram highlights the H gate on Qubit A.
- Probability panel updates: p00=0.5, p10=0.5.
- `isEntangled` remains false.

**Step 3 — Apply CNOT:**
- Applies CNOT (control=A, target=B).
- Dispatches `applyCNOT()`.
- State becomes (|00⟩ + |11⟩)/√2 (Bell state Φ+).
- `isEntangled` becomes true.
- Entanglement indicator appears.
- Visual connection between qubits appears.
- Circuit diagram highlights CNOT.

**Step 4 — Measure:**
- Uses shot count selector.
- Dispatches `measureMultiShot()` or `measure()` based on shot count.
- Results histogram updates.

**Auto-progression:** "Run All" button executes steps 2, 3, and 4 sequentially with 800ms delay between.

**Button state rules:**
```
Step 2 enabled: always (initializes first if needed)
Step 3 enabled: only after H is applied (appliedSteps includes H step)
Step 4 enabled: only after CNOT is applied
Measure button: disabled until step 3 complete
```

---

## 8. Probability Display

Before measurement, show the four basis state probabilities.

```
STATE PROBABILITIES

|00⟩  ████████████████████  50.0%
|01⟩                         0.0%
|10⟩                         0.0%
|11⟩  ████████████████████  50.0%
```

These update in real-time as the workflow progresses.

After Bell state creation:
```
|00⟩: 50.0%
|11⟩: 50.0%
|01⟩: 0.0%
|10⟩: 0.0%
```

This visual makes the correlation obvious before any measurement.

---

## 9. Measurement Results Histogram

After measuring:

```
MEASUREMENT RESULTS  (100 shots)

|00⟩  ████████████████████  47   47.0%
|01⟩                         0    0.0%
|10⟩                         0    0.0%
|11⟩  █████████████████████  53   53.0%

Note: Displayed values are simulation results and vary with each run.
```

The "Note" text appears as: `--text-label, --color-arctic, opacity: 0.7`, below the histogram.

See `11_MEASUREMENT_SYSTEM.md` Section 5.2 for histogram styling specification.

---

## 10. Shot Count Selector

```
SHOTS
[ ← ] [ 100 ] [ → ]
Presets: 1 | 10 | 100 | 1000
```

Specification: see `11_MEASUREMENT_SYSTEM.md` Section 4.

---

## 11. Explanation Panel

Below the histogram:

**Before entanglement:** "Apply Hadamard to Qubit A, then CNOT to entangle the two qubits."

**After H applied:** "Qubit A is now in superposition. Qubit B is still |0⟩. The qubits are not yet entangled."

**After CNOT (Bell state):** "CNOT has entangled the qubits. The state cannot be written as a product of individual qubit states. Measuring one qubit will instantly determine the other's state."

**After measurement:** "The state collapsed to [|00⟩ or |11⟩]. Notice that both qubits always agree — they are never [|01⟩ or |10⟩]. This is the signature of entanglement."

---

## 12. Mathematical Detail Toggle

A subtle "Show Mathematics" link below the explanation panel:

When toggled on, show the mathematical state vector:
```
STATE VECTOR (amplitude form)

|00⟩: 0.7071 + 0.0000i  (P = 50.00%)
|01⟩: 0.0000 + 0.0000i  (P =  0.00%)
|10⟩: 0.0000 + 0.0000i  (P =  0.00%)
|11⟩: 0.7071 + 0.0000i  (P = 50.00%)
```

Format: `--font-mono, --text-body-sm, --color-arctic`, in a table inside a quantum panel.

This is optional/advanced content. Default: hidden.

---

## 13. Reset

The "Reset" button in the page header:
1. Dispatches `entanglementSlice.reset()`.
2. Both qubit panels show |0⟩.
3. Combined state shows |00⟩.
4. Entanglement indicator disappears.
5. Visual connection between qubits disappears.
6. Probability bars reset (p00=100%, others 0%).
7. Measurement results cleared.
8. Circuit diagram unhighlights all gates.

---

## 14. Responsive Behavior

| Breakpoint | Adaptation |
|-----------|-----------|
| Desktop (>1024px) | Three-column qubit panel (A | State | B); circuit full width |
| Tablet (768–1024px) | Two-column (circuit top, states below); single column qubit panels |
| Mobile (<768px) | Single column: circuit → qubit A → state → qubit B → workflow → results |

On mobile:
- The visual entanglement connection arc becomes a vertical line between the stacked qubit panels.
- Shot count stepper is full-width.

---

## 15. Accessibility

- The entanglement indicator has `role="status"` and announces: "Qubits are now entangled" via `aria-live="polite"`.
- Circuit diagram: `role="img"`, `aria-label="Quantum circuit: Qubit A through Hadamard gate and CNOT control, Qubit B through CNOT target, both measured."`.
- Workflow buttons: `aria-label="Step 2: Apply Hadamard gate to Qubit A"`, etc.
- Measurement result: announced via `aria-live="polite"`: "Measurement results: |00⟩: 47%, |01⟩: 0%, |10⟩: 0%, |11⟩: 53%."
