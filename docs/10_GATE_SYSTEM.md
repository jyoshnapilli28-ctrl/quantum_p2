# GATE SYSTEM — SPECIFICATION

---

## 1. Purpose

This document specifies the gate system: gate definitions, matrix representations, application logic, validation, UI integration, and extensibility rules.

Gates are the fundamental operations in quantum computing. The gate system must be:
- **Mathematically correct** for all supported gates.
- **Extensible** — adding a new gate requires only adding its matrix to `GATE_MATRICES` and its ID to the `GateId` type.
- **Separated** from UI — gate logic lives in `src/engine/gates.ts` only.

---

## 2. Supported Gates at Launch

### Single-Qubit Gates

| Gate ID | Name | Keyboard | Circuit Symbol |
|---------|------|----------|----------------|
| `'X'` | Pauli-X (NOT) | X | [X] |
| `'Y'` | Pauli-Y | Y | [Y] |
| `'Z'` | Pauli-Z | Z | [Z] |
| `'H'` | Hadamard | H | [H] |
| `'S'` | Phase (S) | S | [S] |
| `'T'` | T Gate | T | [T] |

### Two-Qubit Gates

| Gate ID | Name | Circuit Symbol |
|---------|------|----------------|
| `'CNOT'` | Controlled-NOT | ●──X |
| `'SWAP'` | SWAP | ×──× |

---

## 3. Gate Matrix Definitions

Defined in `src/engine/gates.ts` as a constant `GATE_MATRICES`.

All entries are `Matrix2x2` (for single-qubit gates) using the `Complex` type.

```typescript
// Shorthand helpers used in definitions:
const ONE: Complex    = { re: 1, im: 0 }
const ZERO: Complex   = { re: 0, im: 0 }
const NEG_ONE: Complex = { re: -1, im: 0 }
const I: Complex      = { re: 0, im: 1 }
const NEG_I: Complex  = { re: 0, im: -1 }
const INV_SQRT2 = 1 / Math.SQRT2  // ≈ 0.7071067811865476
const H_ELEM: Complex = { re: INV_SQRT2, im: 0 }
const H_NEG:  Complex = { re: -INV_SQRT2, im: 0 }
const T_RE = INV_SQRT2  // cos(π/4)
const T_IM = INV_SQRT2  // sin(π/4)

GATE_MATRICES = {
  X: [
    [ZERO, ONE  ],
    [ONE,  ZERO ]
  ],

  Y: [
    [ZERO,   NEG_I],
    [I,      ZERO ]
  ],

  Z: [
    [ONE,  ZERO   ],
    [ZERO, NEG_ONE]
  ],

  H: [
    [H_ELEM, H_ELEM],
    [H_ELEM, H_NEG ]
  ],

  S: [
    [ONE,  ZERO],
    [ZERO, I   ]
  ],

  T: [
    [ONE,  ZERO                    ],
    [ZERO, { re: T_RE, im: T_IM } ]
  ],

  I: [
    [ONE,  ZERO],
    [ZERO, ONE ]
  ]
}
```

Two-qubit gates (CNOT, SWAP) are defined as `Matrix4x4` in `multiQubit.ts`. See `12_MULTI_QUBIT_SYSTEM.md`.

---

## 4. Gate Application Function

```typescript
// src/engine/gates.ts

function applyGate(state: StateVector1Q, gateId: GateId): StateVector1Q | null {
  // 1. Validate: gateId must exist in GATE_MATRICES
  const matrix = GATE_MATRICES[gateId]
  if (!matrix) {
    console.warn(`Unknown gate: ${gateId}`)
    return null
  }

  // 2. Apply matrix: newState = matrix * state
  const newState = applyMatrix2x2(matrix, state)

  // 3. Normalize: correct floating-point drift
  const normalized = normalizeState1Q(newState)

  return normalized
}
```

---

## 5. Gate Behavior Reference

### X Gate (Pauli-X / NOT Gate)

- **Effect:** Flips the qubit. Equivalent to a classical NOT gate.
- **Input → Output:**
  - |0⟩ → |1⟩
  - |1⟩ → |0⟩
  - |+⟩ → |+⟩ (X is its own inverse along the X axis)
  - |-⟩ → -|-⟩ (acquires a global phase, visually |−⟩)
- **Bloch Sphere:** Rotation by π around the X-axis.
- **Self-inverse:** Yes. X² = I.

### Y Gate (Pauli-Y)

- **Effect:** Combines a bit-flip and a phase-flip.
- **Input → Output:**
  - |0⟩ → i|1⟩
  - |1⟩ → -i|0⟩
- **Bloch Sphere:** Rotation by π around the Y-axis.
- **Self-inverse:** Yes. Y² = I.

### Z Gate (Pauli-Z)

- **Effect:** Leaves |0⟩ unchanged; multiplies |1⟩ by -1.
- **Input → Output:**
  - |0⟩ → |0⟩
  - |1⟩ → -|1⟩
  - |+⟩ → |-⟩
  - |-⟩ → |+⟩
- **Bloch Sphere:** Rotation by π around the Z-axis.
- **Self-inverse:** Yes. Z² = I.

### H Gate (Hadamard)

- **Effect:** Creates superposition from basis states.
- **Input → Output:**
  - |0⟩ → |+⟩ = (|0⟩ + |1⟩)/√2
  - |1⟩ → |-⟩ = (|0⟩ - |1⟩)/√2
  - |+⟩ → |0⟩
  - |-⟩ → |1⟩
- **Bloch Sphere:** Rotation by π around the axis halfway between X and Z.
- **Self-inverse:** Yes. H² = I.

### S Gate (Phase Gate)

- **Effect:** Adds a 90° phase to |1⟩.
- **Input → Output:**
  - |0⟩ → |0⟩
  - |1⟩ → i|1⟩
  - |+⟩ → |i⟩ = (|0⟩ + i|1⟩)/√2
- **Bloch Sphere:** Rotation by π/2 around the Z-axis.
- **Self-inverse:** No. S† = S³.

### T Gate

- **Effect:** Adds a 45° phase to |1⟩. Critical for universal quantum computation.
- **Input → Output:**
  - |0⟩ → |0⟩
  - |1⟩ → e^(iπ/4)|1⟩
- **Bloch Sphere:** Rotation by π/4 around the Z-axis.
- **Self-inverse:** No. T† = T⁷.

---

## 6. Gate Panel UI Specification

The gate panel appears on Pages 2, 3, and 5. It must be implemented as a shared `GatePanel` component.

```
GATES

[ H ] [ X ] [ Y ] [ Z ] [ S ] [ T ]

(Page 5 also shows:)
[ CNOT ] [ SWAP ]
```

**Specification:**

```
Panel heading: "GATES" — --text-label, letter-spacing 0.15em, --color-arctic

Gate button grid:
  display: flex; flex-wrap: wrap; gap: --space-2

Each button: see 05_DESIGN_SYSTEM.md Section 8.2 (Gate Button)

Button content:
  - Gate symbol (e.g., "H", "X") — --font-mono, --text-body-sm
  - No icon needed

On hover:
  - Show tooltip (see 06_UI_UX.md Section 7)

On click (Gate Visualizer / Experiment Lab):
  - Dispatch applyGate(gateId) to store

On click (Circuit Builder gate panel):
  - Set selectedGate in circuitSlice
  - Gate button shows "selected" visual state
  - Next grid cell click places the gate
```

**Gate order in panel (always in this order):**

Pages 2 & 3: H, X, Y, Z, S, T

Page 5: H, X, Y, Z, S, T (row 1); CNOT, SWAP (row 2)

---

## 7. Gate History Panel (Gate Visualizer)

After each gate is applied, an entry is appended to the gate history panel.

**Location:** Below or to the right of the probability display (desktop), below all controls (mobile).

**Entry format:**

```
#3  H   |0⟩ → |+⟩
#2  X   |1⟩ → |0⟩
#1  X   |0⟩ → |1⟩
```

**Specification:**

```
Container:
  max-height: 200px; overflow-y: auto
  scrollbar-color: --color-polar transparent (custom thin scrollbar)

Entry:
  display: flex; gap: --space-3; padding: --space-2 --space-3
  border-bottom: 1px solid rgba(56,80,106,0.2)

  Step number (#n): --font-mono, --text-label, --color-arctic; width: 24px
  Gate name: --font-mono, --text-label, --color-white; width: 24px
  State transition: --font-mono, --text-body-sm, --color-arctic

  Most recent entry has slightly brighter text (--color-white for all fields)
```

**Empty state:**

```
"No gates applied yet."
--text-body-sm, --color-arctic, italic, centered
```

---

## 8. Gate Validation Rules

| Gate | Valid Context | Invalid Context |
|------|--------------|----------------|
| X, Y, Z, H, S, T | Any single-qubit wire | On multi-qubit gate row |
| CNOT | Two distinct wires in two-qubit circuit | Single-qubit circuit; same wire for control and target |
| SWAP | Two distinct wires in two-qubit circuit | Single-qubit circuit |

When an invalid placement is attempted:
1. The gate button shakes (horizontal keyframe, 400ms).
2. A validation error message appears below the gate panel.
3. The circuit state is not modified.

---

## 9. Extensibility Rules

To add a new single-qubit gate (e.g., Rx(θ)):

1. Add the parameterized matrix to `GATE_MATRICES` in `gates.ts`.
2. Add the gate ID to the `GateId` union type in `src/types/quantum.ts`.
3. If the gate is parameterized, add a `gateParameters` field to `GatePlacement` in the circuit type.
4. Add a tooltip entry in `06_UI_UX.md`.
5. Add a gate button to the relevant page's gate panel.
6. Add unit tests.
7. Update this document.

**No other files need modification** for a standard gate addition. This is the extensibility guarantee.

---

## 10. Gate Rendering in Circuit Diagram

**Single-qubit gate token:**

```
┌───┐
│ H │
└───┘
```

Rendered as an SVG `<rect>` with a centered `<text>` element.

**CNOT gate:**

```
Control qubit: ─── ● ───   (filled circle, radius 6px, color --color-white)
                   │        (vertical line connecting control to target)
Target qubit:  ─── ⊕ ───  (SVG circle with X inside: ⊕)
```

The vertical connecting line: `SVG <line>`, stroke `--color-polar`, 1.5px.

The control dot: `SVG <circle>`, fill `--color-white`, radius 5px.

The target (⊕): `SVG <circle>` with `<line>` horizontal and `<line>` vertical inside, stroke `--color-white`.

**SWAP gate:**

```
Wire 0: ─── × ───   (X symbol at intersection)
             │
Wire 1: ─── × ───
```

Both × symbols: SVG paths drawing an X, stroke `--color-white`, 2px.
