# PAGE 5 — QUANTUM CIRCUIT BUILDER — SPECIFICATION — QYNX

---

## 1. Purpose & Functional Mission

**QUANTUM CIRCUIT BUILDER** is Page 5 of **QYNX**, functioning as the culminating interactive laboratory. It empowers users to synthesize and apply quantum computing principles by interactively constructing, validating, and executing multi-qubit quantum circuits.

### Core Architectural Standards:
1. **Full Unitary Gate Palette**: Supports single-qubit gates ($H, X, Y, Z, S, T$) and multi-qubit entangling/swap gates ($\text{CNOT}, \text{SWAP}$).
2. **Dual Interaction Modes**:
   - **Desktop Drag-and-Drop**: Built using `@dnd-kit/core` with tactile drop-target highlights.
   - **Accessible Mobile / Touch Pattern**: Tap-to-select from gate palette, followed by tap-to-place onto designated wire grid cells.
3. **Automated Validation**: Real-time checking for control/target collisions and column ordering before engine execution.
4. **QYNX Design Alignment**: Clean, restrained surfaces in the QYNX Purple scale (`Purple 80` tokens, `Purple 70` wires, `Purple 60` action buttons, `White` high-contrast symbols).

---

## 2. Route & Component Architecture

```
Route: /circuit-builder
Component: src/pages/CircuitBuilder.tsx
State Slice: src/store/circuitSlice.ts
Engine Contracts: engine.executeCircuit, engine.getProbabilitiesNQ, engine.measureMultiShotNQ
```

---

## 3. Visual Layout & Workspace Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│ 05 QUANTUM CIRCUIT BUILDER             [ + Add Qubit ] [ Clear Circuit ]│
├─────────────────┬──────────────────────────────────────────────────────┤
│  GATE PALETTE   │                 CIRCUIT WORKSPACE                    │
│                 │                                                      │
│  SINGLE QUBIT   │  q0 (|0⟩) ───[ H ]───●─────────────────── [ M ]      │
│  [H] [X] [Y]    │                      │                               │
│  [Z] [S] [T]    │  q1 (|0⟩) ───────────⊕─────────────────── [ M ]      │
│                 │                                                      │
│  MULTI QUBIT    │  q2 (|0⟩) ─────────────────────────────── [ M ]      │
│  [ CNOT ]       ├──────────────────────────────────────────────────────┤
│  [ SWAP ]       │  VALIDATION: ✓ Circuit configuration is valid.       │
│                 ├──────────────────────────────────────────────────────┤
│  SHOT COUNT     │  SIMULATION RESULTS (1,000 Shots)                    │
│  [ 1000 ]       │  |000⟩ [███████████████████      ] 504 shots (50.4%) │
│                 │  |001⟩ [                         ]   0 shots ( 0.0%) │
│  [ RUN CIRCUIT ]│  |010⟩ [                         ]   0 shots ( 0.0%) │
│                 │  |110⟩ [███████████████████      ] 496 shots (49.6%) │
│                 │  (All 2^n basis outcomes displayed in binary order)   │
└─────────────────┴──────────────────────────────────────────────────────┘
```

---

## 4. Dual Interaction Workflows

### 4.1 Desktop Drag-and-Drop Pattern
1. User clicks and drags a gate token from the palette.
2. The token scales to $1.05$ with an elevated shadow in `rgba(28, 15, 48, 0.6)`.
3. Eligible grid slots illuminate with dashed `Purple 40 #BE95FF` borders.
4. Dropping places the gate and triggers instant AST recompilation and validation.

### 4.2 Mobile & Touch Alternative Pattern (Tap-to-Select, Tap-to-Place)
Because drag-and-drop can be error-prone on smaller touchscreens:
1. **Tap Gate**: Tapping a gate in the palette marks it as active (`selectedGate`), highlighting it with a `2px solid Purple 40` border.
2. **Tap Slot**: Tapping any vacant cell on the circuit wire matrix immediately places the selected gate.
3. **Inspector Sheet**: Tapping an already placed gate opens a bottom drawer with options to "Move", "Invert Target/Control", or "Remove Gate".

---

## 5. Circuit Grid & Diagram Visibility

- **Qubit Register Wires**: Horizontal lines across each row rendered with $2\text{px}$ stroke in `Purple 70 #6929C4`.
- **Placed Gate Tokens**: $48 \times 48\text{px}$ tiles with `Purple 80 #491D8B` fill, $1.5\text{px}$ `Purple 70` border, and centered `White` text in `JetBrains Mono`.
- **CNOT Entangler**:
  - Control dot: Filled circle ($r = 5\text{px}$) in `Purple 60 #8A3FFC`.
  - Vertical connection wire: $2\text{px}$ stroke in `Purple 60`.
  - Target symbol: Circle with inner cross $\oplus$ in `White` on `Purple 80`.
- **SWAP Operator**:
  - Twin cross markers ($\times$) on participating wires connected by vertical line in `Purple 60`.

---

## 6. Circuit Validation Engine

Before execution, the circuit is validated against physical rules:
1. **Control / Target Collision**: A CNOT operator cannot have the same wire for both control and target.
2. **Column Concurrency**: A single wire cannot host multiple concurrent gates within the same column slot.
3. **Orphan Multi-Qubit Operators**: CNOT and SWAP gates must specify both valid participating wires.

If invalid, the **[ RUN CIRCUIT ]** action is disabled and displays an inline warning banner in `Purple 40` on `rgba(138, 41, 41, 0.3)`.

---

## 7. Execution & Result Histogram

Clicking **[ RUN CIRCUIT ]**:
1. Translates the grid AST into chronological unitary matrix transformations executed by `engine.executeCircuit`.
2. Computes the exact final complex state vector $|\psi_{\text{final}}\rangle$.
3. Samples $N$ measurement shots using cumulative probability intervals.
4. Renders the resulting distribution histogram across all $2^N$ basis states in `Purple 60` with exact counts and single-decimal percentages (`50.4%`).
