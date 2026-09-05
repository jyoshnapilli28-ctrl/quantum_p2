# PAGE 5 — CIRCUIT BUILDER

---

## 1. Purpose

The Circuit Builder is the most advanced interactive page. It gives the user a visual drag-and-drop workspace to construct quantum circuits using multiple qubits and gates, then simulate and visualize the results.

This page is the synthesis of all prior learning: the user applies everything from Pages 1–4 in a freeform builder environment.

---

## 2. Route and Component

```
Route: /circuit-builder
Component: CircuitBuilder.tsx
State slice: circuitSlice
Engine calls: engine.executeCircuit
Libraries: @dnd-kit/core, @dnd-kit/sortable
```

---

## 3. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ CIRCUIT BUILDER               [Clear] [Reset] [Add Qubit]        │
├─────────────────┬────────────────────────────────────────────────┤
│                 │                                                │
│  GATE PANEL     │          CIRCUIT WORKSPACE                     │
│                 │                                                │
│  SINGLE QUBIT   │  q0 ─────[H]─────[●]─────────────── [M]      │
│  [H][X][Y][Z]   │               CNOT│                           │
│  [S][T]         │  q1 ────────────[⊕]─────────────── [M]      │
│                 │                                                │
│  MULTI QUBIT    │  q2 ──────────────────────────────── [M]      │
│  [CNOT][SWAP]   │                                                │
│                 │  [ + Add Row ]                                 │
│                 │                                                │
│  SHOTS          │          VALIDATION                            │
│  [100]          │  ✓ Circuit is valid                           │
│                 │                                                │
│  [RUN CIRCUIT]  │                                                │
│                 ├────────────────────────────────────────────────┤
│                 │          RESULTS                               │
│                 │                                                │
│                 │  MEASUREMENT RESULTS (100 shots)              │
│                 │  |00⟩  ████████████████  49   49.0%           │
│                 │  |01⟩                     0    0.0%           │
│                 │  |10⟩                     0    0.0%           │
│                 │  |11⟩  ████████████████  51   51.0%           │
│                 │                                                │
│                 │  Final state: (|00⟩ + |11⟩)/√2               │
│                 │  Entangled: Yes                               │
└─────────────────┴────────────────────────────────────────────────┘
```

**Desktop (>1024px):** Gate panel (240px sidebar) + circuit workspace (flex-grow).
**Tablet (768–1024px):** Gate panel as collapsible drawer; circuit workspace full width.
**Mobile (<768px):** Gate panel as horizontal scrollable strip at top; circuit workspace below.

---

## 4. Gate Panel

### 4.1 Layout

```
SINGLE QUBIT GATES
[ H ] [ X ] [ Y ] [ Z ]
[ S ] [ T ]

MULTI-QUBIT GATES
[ CNOT ]
[ SWAP  ]

───────────────

SHOTS
[ ← ] [ 100 ] [ → ]

───────────────

[ RUN CIRCUIT  ]
```

### 4.2 Gate Selection (Desktop Drag-and-Drop)

1. User clicks on a gate token in the gate panel — the token shows a "grabbed" visual state (slight scale-up: 1.05, shadow enhancement).
2. User drags the gate token over the circuit grid. The target cell highlights as a drop zone (border glows: `--color-icicle`).
3. On drop: the gate is placed at that grid position.
4. If the drop target is already occupied: the existing gate is displaced to the right by one column.

**DnD library:** `@dnd-kit/core` with `useDraggable` for gate tokens, `useDroppable` for grid cells.

### 4.3 Gate Selection (Mobile — Tap to Select, Tap to Place)

Since drag-and-drop is difficult on mobile:

1. User taps a gate button in the panel — the button shows "selected" state (Icicle highlight).
2. User then taps a circuit grid cell — the gate is placed there.
3. Tapping a different gate replaces the selection.
4. Tapping the same selected gate deselects it.

The selected gate is stored in `circuitSlice.selectedGate`.

### 4.4 Run Circuit Button

```
[ RUN CIRCUIT ]
```

Full width of gate panel. Primary button style. Larger: 48px height.

**States:**

| State | Label | Style |
|-------|-------|-------|
| Default (valid) | "Run Circuit ▶" | Primary button, enabled |
| Default (no gates) | "Run Circuit ▶" | Disabled (opacity 0.4) |
| Default (invalid) | "Fix errors first" | Disabled, error border |
| Running | "Simulating..." + spinner | Disabled |
| Complete | "Run Circuit ▶" | Primary, enabled (re-runnable) |

---

## 5. Circuit Workspace

### 5.1 Circuit Grid

The circuit is a 2D grid:
- **Rows:** One row per qubit (q0, q1, q2, q3 — up to 4 qubits at launch).
- **Columns:** Horizontal positions (1–N) representing time steps. Initially: 6 columns visible, scroll to add more.

```
       Col 1    Col 2    Col 3    Col 4    Col 5    Col 6
q0 ─── [   ] ─── [   ] ─── [   ] ─── [   ] ─── [   ] ─── [M]
q1 ─── [   ] ─── [   ] ─── [   ] ─── [   ] ─── [   ] ─── [M]
q2 ─── [   ] ─── [   ] ─── [   ] ─── [   ] ─── [   ] ─── [M]
```

### 5.2 Grid Cell Specification

```
Cell container:
  width: 64px; height: 64px
  display: flex; align-items: center; justify-content: center
  border-radius: --radius-sm
  border: 1px dashed rgba(56,80,106,0.3) (empty; dashed)
  border: 1px solid --color-polar (filled)

Wire line (horizontal):
  SVG <line> behind cells
  y = center of each row
  stroke: --color-polar; stroke-width: 2px

Drop zone (hover during drag):
  border: 1px solid --color-icicle
  background: rgba(68,105,131,0.1)
  box-shadow: 0 0 8px rgba(68,105,131,0.3)
```

### 5.3 Gate Token (Placed)

See `10_GATE_SYSTEM.md` Section 10 for gate token visual spec.

Additional behaviors for placed gate tokens:
- **Hover:** Show a small "×" remove button in the top-right corner of the token.
- **Click "×":** Remove the gate and dispatch `removeGate(gateId)`.
- **Drag (desktop):** Gate token can be dragged to a new position (dispatches `moveGate`).

### 5.4 Measurement Gate (M)

Each qubit row has a fixed measurement gate at the rightmost column. It cannot be moved or removed.

```
[M] symbol:
  SVG box with a meter arc inside
  stroke: --color-polar
  No label text
```

### 5.5 Multi-Qubit Gate Rendering

**CNOT:**
- Control qubit cell: filled circle (●), `--color-white`, radius 5px.
- Target qubit cell: ⊕ symbol (circle with cross).
- Vertical line: SVG `<line>` from control cell center to target cell center, stroke `--color-polar`.
- Both cells must be in the same column. Column is validated to have no wire conflict.

**SWAP:**
- Two × symbols at each qubit cell in the same column.
- Vertical line connecting them.

### 5.6 Adding and Removing Qubits

**"Add Qubit" button (top right):**
- Adds a new qubit row (max 4).
- New qubit initialized to |0⟩.
- Dispatches `setQubitCount(count + 1)`.

**Removing a qubit:**
- Each qubit wire label (q0, q1, etc.) has a "×" remove button on hover (min qubits: 1).
- Clicking "×" removes that qubit and all its gate placements.
- Dispatches `setQubitCount(count - 1)` and removes affected gates.

---

## 6. Circuit Validation

Validation runs automatically after every circuit modification. Errors are stored in `circuitSlice.validationErrors`.

### 6.1 Validation Rules

| Rule | Error Message |
|------|--------------|
| CNOT control and target are the same wire | "CNOT gate: control and target must be different qubits." |
| Two gates on the same qubit in the same column | "Column N has conflicting gates on qubit M. Move one to a different column." |
| CNOT/SWAP placed on only one wire | "CNOT/SWAP requires exactly two qubit wires." |
| Gate placed on a wire that no longer exists | "Gate [type] on qubit N: qubit N does not exist. Remove the gate." |

### 6.2 Validation Display

```
VALIDATION

✓ Circuit is valid        (--color-success, green tick)
```

or:

```
VALIDATION

⚠ 2 errors:
  • Column 3 has conflicting gates on qubit 1.
  • CNOT on column 5 requires two qubit wires.
```

```
Error display:
  Background: rgba(138,74,74,0.2)
  Border-left: 3px solid --color-error
  Text: --text-body-sm, --color-arctic
  Icon: ⚠ in --color-warning
```

---

## 7. Circuit Execution Workflow

```
USER clicks [ RUN CIRCUIT ]
                │
                ▼
1. Validate circuit: if errors → show error, abort
                │
                ▼ (validation passes)
2. Set executionStatus = 'running'
   Button shows "Simulating..."
   Results panel shows spinner (minimum 300ms display)
                │
                ▼
3. Build CircuitDefinition from store:
   {
     qubits: N,
     gates: [...sorted by column],
     shots: shotCount
   }
                │
                ▼
4. Call engine.executeCircuit(circuitDefinition)
   (synchronous; completes in < 5ms for 1–4 qubits)
                │
                ▼
5. Store result in circuitSlice.lastResult
   Set executionStatus = 'complete'
                │
                ▼
6. Results histogram animates in (slide-up, 400ms)
   Final state label appears
   Entanglement status shown if 2+ qubits
```

---

## 8. Result Visualization

### 8.1 Measurement Histogram

```
MEASUREMENT RESULTS  (100 shots)

|00⟩  ████████████████████  49   49.0%
|01⟩                         0    0.0%
|10⟩                         0    0.0%
|11⟩  ████████████████████  51   51.0%
```

All `2^N` basis states shown in binary order, even with 0 count.

For 3 qubits: 8 states (|000⟩ through |111⟩).
For 4 qubits: 16 states (|0000⟩ through |1111⟩).

See `11_MEASUREMENT_SYSTEM.md` Section 5.2 for full histogram spec.

### 8.2 Final State Summary

```
FINAL STATE

State vector: (|00⟩ + |11⟩) / √2

Entangled: Yes  [⚛]

Dominant outcomes: |00⟩, |11⟩
```

"Dominant outcomes" = basis states with probability > 5%.

### 8.3 Result Empty State

Before running:

```
Press [Run Circuit] to simulate the circuit.
Place gates on the circuit wires first.
```

---

## 9. Predefined Example Circuits

A "Examples" dropdown at the top of the workspace allows loading predefined circuits:

| Example | Description |
|---------|-------------|
| Bell State | H on q0, CNOT q0→q1 |
| GHZ-like | H on q0, CNOT q0→q1, CNOT q0→q2 |
| Simple Superposition | H on q0 only |
| All X | X on all qubits |

Selecting an example loads that circuit into the workspace, replacing the current circuit.

---

## 10. Clear and Reset

**Clear Circuit:**
- Removes all gate placements from the workspace.
- Keeps the qubit count.
- Clears results.

**Reset:**
- Removes all gates AND resets qubit count to 2.
- Clears results.

---

## 11. Responsive Behavior

| Breakpoint | Adaptation |
|-----------|-----------|
| Desktop (>1024px) | Gate panel sidebar (240px) left; circuit workspace right |
| Tablet (768–1024px) | Gate panel as slide-in drawer (toggle with hamburger icon); circuit full width |
| Mobile (<768px) | Horizontal scrollable gate strip at top; circuit workspace scrollable horizontally; tap-to-select gate then tap cell to place |

**Mobile circuit workspace:**
- Horizontal scroll: the circuit grid can extend beyond the viewport width.
- Each cell is minimum 56px × 56px for touch target compliance.
- Wire labels (q0, q1...) are sticky on the left side during horizontal scroll.

---

## 12. Keyboard Interaction

| Key | Action |
|-----|--------|
| Tab | Navigate between gate buttons |
| Enter/Space | Select gate (in gate panel), or place selected gate (on grid cell) |
| Arrow keys | Navigate grid cells |
| Delete/Backspace | Remove gate on focused cell |
| Escape | Deselect current gate |
| Ctrl+Z | Undo last gate placement or removal |
| Ctrl+Enter | Run circuit |

Undo history: last 20 actions.

---

## 13. Accessibility

- Circuit grid uses `role="grid"`, each row is `role="row"`, each cell is `role="gridcell"`.
- Gate tokens in grid have `aria-label="Hadamard gate on qubit 0, column 2"`.
- Empty cells: `aria-label="Empty slot, qubit 1, column 3"`.
- After circuit run: `aria-live="polite"` announces "Circuit simulation complete. Results: [basis state]: [%], ...".
- Gate panel buttons: `aria-label="Drag or click to add Hadamard gate to circuit"`.
- Validation errors: `role="alert"` so they are immediately announced by screen readers.
- Keyboard circuit navigation: full arrow key grid traversal (see `22_ACCESSIBILITY.md`).
