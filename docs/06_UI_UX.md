# UI / UX SPECIFICATION — QYNX

---

## 1. Application Identity & Opening Experience

When a user launches **QYNX**, a restrained, professional entrance experience introduces the product brand without overwhelming the user or delaying access to educational tools:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                         ❖ QYNX                              │
│               QUANTUM INTERACTIVE PLATFORM                  │
│                                                             │
│              [ Initializing Quantum Engine... ]             │
└─────────────────────────────────────────────────────────────┘
```

### 1.1 Opening Sequence Specifications
1. **Brand Mark Appearance**: The QYNX geometric logo mark and wordmark render in `White #FFFFFF` with `Purple 60 #8A3FFC` accents against `Purple 100 #1C0F30`.
2. **Restrained Entrance Motion**: 300ms subtle opacity fade with 8px vertical ease-in. Zero bombastic particle vortexes or cinematic cutscenes.
3. **Application Shell Transition**: Direct cross-fade (200ms) into the application layout with Page 1 (`QUANTUM UNIVERSE`) active.
4. **Reduced-Motion Compliance**: When `prefers-reduced-motion: reduce` is detected, the brand introduction is bypassed completely, loading the main application shell immediately.
5. **Instant Fallback**: If browser WebGL initialization takes longer than 150ms, the UI does not block; 2D elements load immediately while 3D viewports initialize asynchronously in the background.

---

## 2. Global Navigation Architecture

A persistent, responsive navigation bar establishes QYNX as **one cohesive application** composed of five sequential modules:

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ ❖ QYNX  │ 01 UNIVERSE │ 02 GATE VISUALIZER │ 03 EXPO LAB │ 04 ENTANGLEMENT │ 05 CIRCUITS │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Navigation Bar Specifications
- **Dimensions**: Height 64px (desktop), 56px (mobile).
- **Background**: `Purple 80 #491D8B` (opaque, restrained surface; `rgba(73, 29, 139, 0.95)` with 8px backdrop blur).
- **Border-Bottom**: 1px solid `Purple 70 #6929C4`.
- **Z-Index**: `var(--z-navigation, 100)` — fixed at top of viewport.

### 2.2 Navigation Item States
- **Module Numbers**: Prefix `01`, `02`, `03`, `04`, `05` rendered in `Purple 40 #BE95FF` font-mono.
- **Default State**: Text in `Purple 20 #E8DAFF`, weight 500, 14px.
- **Hover State**: Text transition to `White #FFFFFF` (150ms ease).
- **Active Module**: `White #FFFFFF` with a 3px solid underline in `Purple 60 #8A3FFC`.
- **Keyboard Focus**: High-contrast outline `2px solid Purple 40` with 2px offset.

### 2.3 Mobile Navigation Drawer (< 768px)
- The header displays the QYNX logo and a standard accessible hamburger icon (`Purple 20`).
- Tapping opens a slide-down or side-drawer menu in `Purple 100 #1C0F30` with `Purple 70` dividers.
- Tap targets have a minimum height of 48px to accommodate finger navigation.
- Active route is indicated by a prominent left border: `4px solid Purple 60`.

---

## 3. The Five Module Journey

The intended learning and operational progression is strictly linear yet flexibly accessible:

$$\text{01 LEARN} \longrightarrow \text{02 VISUALIZE} \longrightarrow \text{03 EXPERIMENT} \longrightarrow \text{04 UNDERSTAND} \longrightarrow \text{05 BUILD}$$

```
[01 QUANTUM UNIVERSE]
Foundational principles: Bits vs Qubits, Superposition, Born rule, Gate definitions.
          │
          ▼
[02 QUANTUM GATE VISUALIZER]
Single-qubit unitary manipulation: X, Y, Z, H, S, T with dynamic 3D Bloch sphere.
          │
          ▼
[03 QUANTUM EXPO LAB]
Structured experimental verification: Superposition & Bit-Flip tests with shot counts.
          │
          ▼
[04 QUANTUM ENTANGLEMENT SIMULATOR]
Two-qubit Bell states (|Φ⁺⟩), non-classical correlations, joint measurement.
          │
          ▼
[05 QUANTUM CIRCUIT BUILDER]
Multi-qubit circuit grid, drag-and-drop & tap-to-place gates, full execution.
```

---

## 4. Interaction Hierarchy & Principles

Every view inside QYNX prioritizes scientific clarity over decorative clutter:

1. **Content First**: High-contrast state notation, readable scientific copy, and visible diagrams.
2. **Interaction Second**: Explicit, tactile controls with visible hover, active, and focus states.
3. **Decoration Last**: Restrained surface borders and shadows provide structural separation without distracting from the data.

### Standard Module Layout Pattern
- **Top Header**: Module index (`02`), Module Title (`QUANTUM GATE VISUALIZER`), and 1-sentence pedagogical objective.
- **Primary Workspace**: Central visual viewport (Bloch sphere, experiment bench, or circuit grid) framed in `Purple 90`.
- **Analytical Readout**: High-contrast state readout ($|\psi\rangle$), amplitude breakdown, and probability bars.
- **Control Strip**: Unitary gate palette, measurement triggers, and reset button.

---

## 5. Diagram Visibility & Readability Standards

In accordance with the QYNX Diagram Visibility Rule:
- **Immediate Comprehension**: Users must understand diagram input, transformation, and output within 3 seconds.
- **High-Contrast Stroke Weights**: All quantum wires and vector trajectories must have a minimum stroke weight of $2\text{px}$ in `Purple 70` or `Purple 60`.
- **Text & Notation**: Dirac kets and numerical values rendered in `JetBrains Mono` and `White #FFFFFF` with minimum contrast ratio of $4.5:1$ against underlying surfaces.
- **Zero Ambiguous Symbols**: Gate symbols ($X, Y, Z, H, S, T, \text{CNOT}, \text{SWAP}$) are rendered with crisp vector geometry inside dedicated high-contrast tiles.

---

## 6. Touch & Mobile Alternative Patterns

Desktop drag-and-drop interactions in Page 5 (`QUANTUM CIRCUIT BUILDER`) are supplemented with a first-class mobile alternative:

| Action | Desktop Pattern | Mobile / Touch Pattern |
|:---|:---|:---|
| **Select Gate** | Click or drag gate token | Tap gate in horizontal carousel to activate selection |
| **Place Gate** | Drag and drop into wire slot | Tap desired target wire & column slot |
| **Inspect Gate** | Hover to view tooltip | Tap gate token to open bottom inspector sheet |
| **Remove Gate** | Drag to trash or press Delete | Tap gate token and select "Remove" from sheet |
| **Bloch Sphere View**| Click + drag to orbit | One-finger swipe to orbit, pinch to zoom |
| **Camera Reset** | Double-click or reset button | Tap floating "Reset View" icon button |

---

## 7. State Feedback & Deterministic Responses

Every user action produces immediate visual and structural feedback within 100ms:

| Trigger | Immediate Response (< 50ms) | Animation Phase (200–600ms) |
|:---|:---|:---|
| **Apply Unitary Gate** | Button depresses to `Purple 70` active state | State vector traces geodesic arc on Bloch sphere; probability bars transition |
| **Trigger Measurement** | Button shows "Measuring..." spinner | Wave-function collapses; probability bar snaps to 0% or 100% |
| **Run Circuit** | "Simulating..." indicator in header | State amplitudes update; statistical histogram populates |
| **Reset State** | Visual flash on state indicator | State vector returns to $|0\rangle$; history resets |
