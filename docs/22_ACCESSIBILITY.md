# ACCESSIBILITY — SPECIFICATION — QYNX

---

## 1. Standard Compliance Target

**QYNX** targets strict **WCAG 2.1 Level AA** compliance across all five modules.

### Core Accessibility Mandate:
> **"Never rely solely on color intensity, visual position, or dynamic animation to communicate quantum information."**
Every quantum state change, measurement outcome, and circuit modification must be accompanied by semantic HTML, high-contrast visual text, and programmatic ARIA live region announcements.

---

## 2. Color Contrast in the QYNX Purple Scale

All text and critical UI elements meet or exceed WCAG 2.1 AA requirements ($4.5:1$ for body copy, $3:1$ for large text $\ge 24\text{px}$ and graphical controls):

| Foreground Token | Hex | Background Surface | Surface Hex | Contrast Ratio | WCAG Compliance |
|:---|:---:|:---|:---:|:---:|:---:|
| **White** | `#FFFFFF` | **Purple 100** (Root canvas) | `#1C0F30` | **17.5 : 1** | Pass AAA |
| **Purple 10** | `#F6F2FF` | **Purple 100** (Root canvas) | `#1C0F30` | **15.9 : 1** | Pass AAA |
| **Purple 20** | `#E8DAFF` | **Purple 100** (Root canvas) | `#1C0F30` | **13.5 : 1** | Pass AAA |
| **Purple 40** | `#BE95FF` | **Purple 100** (Root canvas) | `#1C0F30` | **7.8 : 1** | Pass AAA |
| **White** | `#FFFFFF` | **Purple 80** (Panel surface) | `#491D8B` | **9.8 : 1** | Pass AAA |
| **Purple 10** | `#F6F2FF` | **Purple 80** (Panel surface) | `#491D8B` | **8.9 : 1** | Pass AAA |
| **Purple 40** | `#BE95FF` | **Purple 80** (Panel surface) | `#491D8B` | **4.5 : 1** | Pass AA |
| **White** | `#FFFFFF` | **Purple 60** (Active button) | `#8A3FFC` | **4.6 : 1** | Pass AA |

---

## 3. Keyboard Navigation & Focus Architecture

Every interactive control in QYNX is fully operable via standard keyboard interactions with prominent visual focus indicators:

```css
:focus-visible {
  outline: 2px solid var(--qynx-border-strong, #BE95FF);
  outline-offset: 2px;
  border-radius: var(--radius-sm, 4px);
}

:focus:not(:focus-visible) {
  outline: none;
}
```

### Keyboard Matrix:
- **Navigation Links**: `Tab` to cycle, `Enter` to navigate.
- **Unitary Gate Buttons**: `Tab` to focus ($X, Y, Z, H, S, T$), `Enter` or `Space` to apply.
- **Circuit Grid (Page 5)**:
  - `Arrow Keys`: Traverses grid cells (Up/Down across qubit wires, Left/Right across time steps).
  - `Enter` / `Space`: Places the currently selected gate token into the focused cell.
  - `Delete` / `Backspace`: Removes the gate from the focused cell.
  - `Ctrl + Z`: Reverts the last circuit modification.
  - `Ctrl + Enter`: Dispatches circuit execution.
- **Shot Stepper (Pages 3, 4, 5)**: `Arrow Left` (decrement) / `Arrow Right` (increment).

---

## 4. Screen Reader Support & ARIA Live Regions

### 4.1 Persistent Live Announcer
A single persistent polite live region communicates dynamic quantum computations:

```html
<div
  id="qynx-live-announcer"
  class="sr-only"
  aria-live="polite"
  aria-atomic="true"
>
  <!-- Programmatically updated on state changes -->
</div>
```

### 4.2 Dynamic Announcement Protocols
- **Gate Application**: `"Hadamard gate applied to qubit. State is now |+⟩. Probability of zero: 50.0 percent, probability of one: 50.0 percent."`
- **Measurement Collapse**: `"Measurement triggered. Quantum state collapsed to basis ket |0⟩."`
- **Entanglement Detection**: `"Two-qubit Bell state created. Qubits are now maximally entangled."`
- **Circuit Execution**: `"Circuit simulation complete across 1000 shots. Dominant outcomes: basis 00 at 50.4 percent, basis 11 at 49.6 percent."`

### 4.3 Non-Visual Descriptions for Visualizations
- **3D Bloch Sphere**: Provides a visually hidden element updating in real time:
  ```html
  <p class="sr-only">
    Bloch sphere representation: Qubit in state |+⟩. State vector points toward positive X axis on the equator.
    Polar angle theta: 90 degrees. Azimuthal angle phi: 0 degrees.
  </p>
  ```
- **Circuit Diagram**: Detailed `aria-label` describing the full wire and gate sequence.

---

## 5. Motion Preferences (`prefers-reduced-motion`)

When `prefers-reduced-motion: reduce` is enabled:
- The QYNX brand opening sequence is bypassed immediately.
- The 3D Bloch sphere vector snaps directly to new coordinates without SLERP interpolation.
- Probability bar transitions update synchronously without CSS animation.
- All SVG marching-ant loops and background canvas particle drift are frozen.
