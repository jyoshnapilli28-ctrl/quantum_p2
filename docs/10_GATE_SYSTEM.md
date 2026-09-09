# GATE SYSTEM — SPECIFICATION — QYNX

---

## 1. Purpose & Guiding Principles

The **QYNX Gate System** provides the foundational unitary operator suite enabling single-qubit transformations and multi-qubit entangling operations across all five application modules.

### Architectural Invariants:
- **Mathematical Rigor**: All gates are verified unitary operators ($U^\dagger U = I$).
- **Centralized Definition**: Matrices are defined once in `src/engine/gates.ts` and consumed globally.
- **Visual Uniformity**: Gate tokens share a cohesive visual grammar styled with the official QYNX Purple design tokens.

---

## 2. Supported Gate Suite

### 2.1 Single-Qubit Unitary Gates
| Gate ID | Name | Keyboard Shortcut | Circuit Glyphs | Matrix Transformation Summary |
|:---|:---|:---:|:---:|:---|
| **`'X'`** | Pauli-X (NOT) | `X` | `[ X ]` | Bit-flip: $|0\rangle \leftrightarrow |1\rangle$ ($\pi$ rotation about X-axis) |
| **`'Y'`** | Pauli-Y | `Y` | `[ Y ]` | Bit & phase flip: $|0\rangle \to i|1\rangle, |1\rangle \to -i|0\rangle$ |
| **`'Z'`** | Pauli-Z (Phase) | `Z` | `[ Z ]` | Phase-flip: $|0\rangle \to |0\rangle, |1\rangle \to -|1\rangle$ ($\pi$ rotation about Z-axis) |
| **`'H'`** | Hadamard | `H` | `[ H ]` | Superposition creation: $|0\rangle \to |+\rangle, |1\rangle \to |-\rangle$ |
| **`'S'`** | Phase ($S = \sqrt{Z}$) | `S` | `[ S ]` | $\pi/2$ phase rotation: $|1\rangle \to i|1\rangle$ |
| **`'T'`** | T Gate ($T = \sqrt{S}$) | `T` | `[ T ]` | $\pi/4$ phase rotation: $|1\rangle \to e^{i\pi/4}|1\rangle$ |

### 2.2 Two-Qubit Entangling Gates
| Gate ID | Name | Control / Target | Circuit Representation |
|:---|:---|:---|:---|
| **`'CNOT'`** | Controlled-NOT | Control wire $\to$ Target wire | Control dot (`●`) connected to Target sum (`⊕`) |
| **`'SWAP'`** | Qubit Swap | Wire A $\leftrightarrow$ Wire B | Dual cross markers (`×───×`) connected by wire |

---

## 3. Unitary Matrix Definitions (`src/engine/gates.ts`)

All single-qubit operators are $2 \times 2$ matrices with complex entries:

```typescript
// Elementary unitary matrices
export const GATE_MATRICES: Record<GateId, Matrix2x2> = {
  X: [
    [{ re: 0, im: 0 }, { re: 1, im: 0 }],
    [{ re: 1, im: 0 }, { re: 0, im: 0 }]
  ],
  Y: [
    [{ re: 0, im: 0 }, { re: 0, im: -1 }],
    [{ re: 0, im: 1 }, { re: 0, im: 0 }]
  ],
  Z: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: -1, im: 0 }]
  ],
  H: [
    [{ re: 1 / Math.SQRT2, im: 0 }, { re: 1 / Math.SQRT2, im: 0 }],
    [{ re: 1 / Math.SQRT2, im: 0 }, { re: -1 / Math.SQRT2, im: 0 }]
  ],
  S: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: 0, im: 1 }]
  ],
  T: [
    [{ re: 1, im: 0 }, { re: 0, im: 0 }],
    [{ re: 0, im: 0 }, { re: Math.SQRT1_2, im: Math.SQRT1_2 }]
  ]
};
```

---

## 4. Gate UI Specifications & QYNX Visual Tokens

### 4.1 Gate Token Button Anatomy
Gate buttons on Page 2 (`QUANTUM GATE VISUALIZER`), Page 3 (`QUANTUM EXPO LAB`), and Page 5 (`QUANTUM CIRCUIT BUILDER`) adhere to standard QYNX tokens:

- **Dimensions**: $48 \times 48\text{px}$ (compact desktop/tablet), $44 \times 44\text{px}$ (mobile).
- **Default Surface**: Background `Purple 80 #491D8B`, Border `1.5px solid Purple 70 #6929C4`, Radius `8px`.
- **Glyph Typography**: `JetBrains Mono` 16px Bold, color `White #FFFFFF`.
- **Hover State**: Border `Purple 50 #A56EFF`, background elevated to `Purple 70`.
- **Active / Pressed**: Scale down to $0.95$, background `Purple 60 #8A3FFC`.
- **Selected State (Circuit Builder)**: Border `Purple 60 #8A3FFC`, outer focus ring `2px solid Purple 40 #BE95FF`.

### 4.2 Gate History Log (Page 2)
- **Container**: Max height 220px, scrollable, background `Purple 90 #31135E`, border `1px solid Purple 80`.
- **Entries**: Row items with step counter `#n` in `Purple 40`, Gate ID in `Purple 10`, state transition $|0\rangle \to |+\rangle$ in `White`.
- **Empty State**: Text "No gates applied yet. Select an operation above." in `Purple 40`.

---

## 5. Circuit Diagram Gate Rendering (Page 5)

All circuit wire and gate glyphs render via high-contrast SVGs:
1. **Single-Qubit Gate**: Rounded rectangle `<rect>` in `Purple 80` with centered text `<text>` in `White`.
2. **CNOT Operator**:
   - Control wire: Filled circle (`radius: 5px`) in `Purple 60 #8A3FFC`.
   - Vertical bus line: `<line>` in `Purple 60` with $2\text{px}$ stroke width.
   - Target wire: Circle `⊕` in `Purple 80` with $1.5\text{px}$ border and `White` crosshairs.
3. **SWAP Operator**:
   - Both wires terminate with crisp cross markers (`×`) with stroke weight $2.5\text{px}$ in `Purple 60`.
