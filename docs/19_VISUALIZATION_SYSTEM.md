# VISUALIZATION SYSTEM — SPECIFICATION — QYNX

---

## 1. Purpose & Guiding Principles

The **QYNX Visualization System** defines the visual grammar and reusable technical components that visually express quantum states, probability distributions, circuit diagrams, and physical transformations across all five modules.

### The Diagram Visibility & Legibility Rules:
1. **The 3-Second Comprehension Test**: Any diagram or visualization must clearly communicate its input state, active operation, and output state to a first-time user within 3 seconds.
2. **High-Contrast Typography**: Quantum notation ($|0\rangle, |1\rangle, |\psi\rangle$), probability counts, and gate labels must be rendered in `White #FFFFFF` or `Purple 10 #F6F2FF` in `JetBrains Mono` with contrast ratio $\ge 4.5:1$.
3. **Robust Stroke Weights**:
   - Inactive quantum wires and coordinate frames: $\ge 2\text{px}$ in `Purple 70 #6929C4`.
   - Active state vectors and entangling lines: $\ge 3\text{px}$ in `Purple 60 #8A3FFC`.
   - Arrowheads: Clearly defined geometry with minimum span of $8\text{px}$.
4. **Purposeful Restraint**: Visualization viewports prioritize structural clarity over decorative atmospheric effects. No uncontrolled neon glows, blur wash, or gratuitous particle fields.

---

## 2. Reusable Visualization Component Inventory

| Component | Modules Consuming | Technology | Architectural Role |
|:---|:---:|:---|:---|
| **`BlochSphere`** | Page 2 | Three.js (WebGL via R3F) | Dynamic 3D representation of single-qubit state vector $[\theta, \phi]$ |
| **`ProbabilityBar`** | Pages 2, 3, 4, 5 | CSS Modules + React | Linear probability indicator with label, fill, and percentage |
| **`ProbabilityHistogram`** | Pages 3, 4, 5 | CSS + SVG + React | Multi-shot empirical detection chart across all $2^n$ basis states |
| **`CircuitDiagram`** | Pages 1, 4, 5 | SVG (inline React) | Vector-drawn quantum register grid, gate boxes, and control lines |
| **`DiracNotation`** | Pages 1, 2, 3, 4, 5 | CSS Typography | Accessible Dirac ket renderer with cross-fade transition |
| **`EntanglementConnection`**| Page 4 | SVG Vector Arc | Non-classical correlation indicator connecting qubit registers |
| **`GateToken`** | Pages 4, 5 | SVG + HTML | Unitary operator glyph tile with active/selected states |

---

## 3. Component Detailed Specifications

### 3.1 `ProbabilityBar` (`src/components/shared/ProbabilityBar.tsx`)
```
|0⟩  [████████████████████          ]  50.0%
```
- **Track**: Height $10\text{px}$, background `Purple 90 #31135E`, border `1px solid Purple 80 #491D8B`, radius $5\text{px}$.
- **Fill**: Solid `Purple 60 #8A3FFC` with `transform-origin: left` transition ($400\text{ms}$).
- **Ket Label**: `JetBrains Mono` 14px in `Purple 20 #E8DAFF`.
- **Value**: `JetBrains Mono` 14px in `White #FFFFFF` with one decimal place.

### 3.2 `ProbabilityHistogram` (`src/components/shared/ProbabilityHistogram.tsx`)
- Displays all $2^N$ computational basis states in binary order (`00`, `01`, `10`, `11`).
- Empty rows with $0$ counts remain visible to communicate zero-probability destructive interference.
- Container rendered in `Purple 80 #491D8B` panel with $1.5\text{px}$ `Purple 70` border.

### 3.3 `CircuitDiagram` (`src/components/circuit/CircuitDiagram.tsx`)
- Renders horizontal wires in $2\text{px}$ `Purple 70 #6929C4`.
- Gate blocks: $48 \times 48\text{px}$ rectangles in `Purple 80` with $1.5\text{px}$ `Purple 70` border and `White` typography.
- CNOT gates: Control dot in `Purple 60 #8A3FFC`, target crosshair $\oplus$ in `White` on `Purple 80`.
- Measurement meters $[M]$: Box with meter arc indicator in `Purple 40 #BE95FF`.

### 3.4 `DiracNotation` (`src/components/shared/DiracNotation.tsx`)
- Formats arbitrary and common kets ($|0\rangle, |1\rangle, |+\rangle, |-\rangle, |\Phi^+\rangle$).
- Cross-fades state transitions over $200\text{ms}$ (instantaneous when `prefers-reduced-motion` is active).

### 3.5 `EntanglementConnection` (`src/components/shared/EntanglementConnection.tsx`)
- Dynamic SVG path forming a gentle quadratic bezier arc connecting participating qubit registers.
- Rendered in $2\text{px}$ stroke in `Purple 60 #8A3FFC` with subtle dashed styling.
- Clearly annotated as a quantum correlation, explicitly avoiding classical wire or cable metaphors.
