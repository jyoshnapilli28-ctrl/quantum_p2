# RESPONSIVE DESIGN — SPECIFICATION — QYNX

---

## 1. Breakpoint System & Architectural Strategy

**QYNX** guarantees full operational fidelity, diagram legibility, and interactive simulation across mobile, tablet, and desktop viewports.

| Breakpoint Token | Viewport Span | Device Class | Layout & Interaction Strategy |
|:---|:---|:---|:---|
| **`mobile-s`** | $< 480\text{px}$ | Small Mobile | Single-column stack, tap-to-place circuit grid, compact 3D viewport ($280\text{px}$) |
| **`mobile-l`** | $480–767\text{px}$ | Standard Mobile | Single column, scrollable horizontal gate strip, sticky wire labels |
| **`tablet`** | $768–1023\text{px}$ | Tablet / iPad | Two-column collapsible drawer layouts, touch-enabled 3D OrbitControls |
| **`laptop`** | $1024–1439\text{px}$| Laptop Display | Full multi-column split, desktop drag-and-drop circuit matrix |
| **`desktop`** | $\ge 1440\text{px}$ | Large Desktop | Spacious layouts, maximum canvas dimensions ($420 \times 420\text{px}$) |

---

## 2. Global Navigation Across Form Factors

- **Desktop & Laptop ($\ge 1024\text{px}$)**: Full persistent header ($64\text{px}$ height) in `Purple 80 #491D8B` displaying QYNX logo and all five module links (`01 UNIVERSE` through `05 CIRCUITS`).
- **Tablet ($768–1023\text{px}$)**: Retains horizontal navigation with abbreviated labels (`02 GATES`, `03 EXPO`, `04 ENTANGLE`).
- **Mobile ($< 768\text{px}$)**: Collapses module links into an accessible slide-down drawer with $48\text{px}$ minimum tap targets and a `Purple 60` left border indicator on the active route.

---

## 3. Module-by-Module Responsive Specifications

### 3.1 Page 1: QUANTUM UNIVERSE
- **Desktop**: Two-column layout for concept sections (diagram left, educational copy right).
- **Mobile**: Stacks diagrams above explanatory text. Diagrams scale dynamically to $100\%$ container width while maintaining the 3-second comprehension rule.

### 3.2 Page 2: QUANTUM GATE VISUALIZER
- **Desktop**: Two-column layout ($55\%$ 3D canvas viewport, $45\%$ state readout and controls).
- **Tablet**: Centered $320 \times 320\text{px}$ Bloch sphere viewport with stacked controls below.
- **Mobile**:
  - Bloch Sphere canvas scales to $280 \times 280\text{px}$.
  - Gate selection switches to a horizontal scrollable row of $48 \times 48\text{px}$ buttons.
  - On ultra-compact screens ($< 360\text{px}$), the 3D canvas can be toggled via "Show 3D View" to prioritize probability bars and gate buttons.

### 3.3 Page 3: QUANTUM EXPO LAB
- **Desktop**: Dedicated left sidebar ($240\text{px}$) for protocol selection, expansive central bench for step progression.
- **Mobile**: Protocol selection becomes a scrollable horizontal chip carousel; step cards and shot sampling histograms stack vertically.

### 3.4 Page 4: QUANTUM ENTANGLEMENT SIMULATOR
- **Desktop**: Three-column register display (Qubit 0 | Bell State $|\Phi^+\rangle$ | Qubit 1) with an overhead horizontal correlation arc.
- **Mobile**: Registers stack vertically; the correlation arc adapts into a vertical dashed line in `Purple 60` connecting Qubit 0 to Qubit 1.

### 3.5 Page 5: QUANTUM CIRCUIT BUILDER
- **Desktop**: Left gate palette with native HTML5/Pointer drag-and-drop onto the wire grid.
- **Mobile**:
  - **No Drag-and-Drop**: Switched to accessible **Tap-to-Select and Tap-to-Place**.
  - Gate palette renders as a sticky horizontal top toolbar.
  - Qubit wire matrix scrolls horizontally with sticky left wire labels (`q0`, `q1`).
  - Grid cell size: $56 \times 56\text{px}$ minimum touch target.
  - Tapping a placed gate opens a bottom action sheet with "Move" and "Remove" options.

---

## 4. Minimum Touch Target Compliance

Every interactive element conforms to mobile accessibility standards (minimum $44 \times 44\text{px}$, recommended $48 \times 48\text{px}$):
- Gate token buttons: $48 \times 48\text{px}$ (mobile: $48 \times 48\text{px}$).
- Circuit grid cells: $56 \times 56\text{px}$.
- Navigation drawer menu links: Height $48\text{px}$, full viewport width.
- Stepper decrement/increment buttons: $44 \times 44\text{px}$.
