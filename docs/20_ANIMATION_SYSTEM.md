# 20. ANIMATION SYSTEM

This document defines the complete animation and micro-interaction system for the **QUANTUM UNIVERSE** web application, ensuring a premium, scientific, and coherent visual experience.

## 1. Animation Philosophy

The animation system must communicate: **PRECISION**, **SCIENCE**, **QUANTUM STATE**, **FLOW**, and **INTERACTION**.

It must **NOT** communicate: GAMING, FLASHINESS, EXCESSIVE NEON, or DISTRACTION.

Every animation must have a purpose. Motion is used to explain quantum state changes and provide user interaction feedback, not for decoration alone.

---

## 2. Global Color Constraints

The animation system (including glows, highlights, and borders) must strictly use the approved palette. **Do not introduce additional colors.**

| Color | Hex | Usage |
| :--- | :--- | :--- |
| **Midnight** | `#071018` | Deepest backgrounds |
| **Deep Navy** | `#0B132B` | Primary backgrounds |
| **Solstice** | `#1C2B38` | Base surfaces |
| **Polar** | `#38506A` | Hover states, borders |
| **Icicle** | `#446983` | Primary interaction glow / selection |
| **Arctic** | `#7991A8` | Secondary highlights / Cursor ring |
| **Light Blue** | `#3A506B` | Subtle accents |
| **White** | `#FFFFFF` | Important highlights / Cursor dot |

---

## 3. Custom Cursor System

A premium, minimal custom cursor replaces the default OS pointer to enhance immersion.

### 3.1 Default State
* **Center Dot:** Small, elegant `White (#FFFFFF)` dot that tracks the pointer precisely without delay.
* **Outer Ring:** Thin `Arctic (#7991A8)` ring with a very soft glow.
* **Movement:** The outer ring smoothly follows the center dot with a slight elastic delay (smooth interpolation/spring physics), feeling lightweight and responsive.

### 3.2 Hover Interactions
When hovering over interactive elements (buttons, cards, quantum gates, navigation links, interactive diagrams, circuit elements):
* **Outer Ring:** Expands slightly.
* **Glow/Border:** Becomes slightly more visible, using `White`, `Arctic`, or `Icicle`.
* **Center Dot:** Remains stable and precise.

### 3.3 Specific Contexts
* **Quantum Gates (`[X]`, `[H]`, etc.):** Cursor expands subtly. Clicking/selecting a gate triggers a soft `Icicle` glow, a subtle scale increase, and a thin highlight ring. It should feel like operating a precision scientific instrument.
* **Circuit Builder (Drag & Drop):** Cursor changes to a "drag" state. The dragged gate follows the cursor smoothly. Valid drop zones receive a subtle highlight; invalid zones receive a neutral visual response (No red error colors—stay within the palette).
* **Bloch Sphere (3D):** Cursor indicates interactive rotation. Hovering over the state vector or state point displays a subtle highlight. Cursor interactions must not interfere with or occlude the 3D visualization. Camera and sphere rotations must use smooth easing.

---

## 4. Global Page Animations

Page-level animations must feel like one coherent system. Avoid excessive or dramatic transitions.

### 4.1 Page Load Sequence
Elements enter sequentially with a subtle fade + upward movement (duration: 400–700ms, smooth easing). Do not animate every single element independently.
1. Background
2. Main heading
3. Supporting content
4. Interactive visualization
5. Controls

### 4.2 Scroll Reveal (Section Entry)
As the user scrolls down, sections gently fade in and move upward.
* **Initial State:** `opacity: 0`, slight downward vertical offset.
* **Final State:** `opacity: 1`, normal position.
* **Feel:** Small movement, sophisticated and subtle.

### 4.3 Component Micro-Interactions
* **Cards (Educational):** Slight elevation, subtle border highlight, very small scale increase, soft background transition (e.g., `Solstice #1C2B38` to `Polar #38506A`). Avoid large transformations.
* **Buttons:** Smooth background transition, subtle border glow, slight movement on hover, clear pressed (`:active`) state. Interaction colors: `Icicle #446983`, `Arctic #7991A8`, `White #FFFFFF`.
* **Quantum State Transitions:** Between important interactive states, use a subtle quantum-inspired transition: small particles + thin wave + soft radial glow. It must communicate "STATE CHANGING" rather than just a generic UI animation.

---

## 5. Page-Specific Micro-Animations

### 5.1 Page 1: Quantum Universe
Subtly animate educational illustrations when they enter the viewport:
* **Bit vs Qubit:** Small state transition visualization.
* **Superposition:** Subtle wave movement.
* **Measurement:** State visualization collapses definitively into a result.
* **Quantum Gates:** Gate block receives a subtle pulse.
* **Entanglement:** Two connected nodes gently pulse together in sync.
* **Quantum Circuit:** A signal travels along the circuit line.

### 5.2 Page 2: Quantum Gate Visualizer
This page features the strongest animation system to emphasize state changes.
* **Sequence:** Gate selected → Quantum calculation → State update → Bloch Sphere movement → Probability update.
* **Bloch Sphere Vector:** The state vector **must smoothly animate (interpolate)** to its new quantum state on the sphere. *Do NOT instantly teleport the vector.* (e.g., applying `H` to `|0⟩` smoothly animates the vector from +Z toward +X).

### 5.3 Page 3: Quantum Experiment Lab
Use guided, sequential step animations.
* **Flow:** STEP 1 (Initial State) → STEP 2 (Apply Gate) → STEP 3 (Measurement) → RESULT. Each step appears progressively.
* **Measurement Results:** Probability bars animate from `0%` → calculation phase → final values (e.g., ~50% / 50%).

### 5.4 Page 4: Entanglement Simulator
Focus on the correlation between Qubit A and Qubit B.
* **Connection Arc:** `Qubit A ●────────● Qubit B`. The connecting line features a subtle traveling light or pulse.
* **State Sync:** After the CNOT gate is applied, show a synchronized state animation between both qubits.
* **Measurement:** Both qubit results must appear simultaneously to emphasize entanglement. Avoid dramatic effects.

### 5.5 Page 5: Circuit Builder
Smooth interaction animations for the drag-and-drop workspace:
* Dragging, placing, and removing gates.
* Connecting controlled gates (e.g., CNOT control and target lines).
* **Run Circuit Sequence:** When "RUN CIRCUIT" is pressed, display a subtle progress/processing animation transitioning through: Circuit → Processing → Quantum Simulation → Measurement → Results.

---

## 6. Performance Requirements

Animations must be highly optimized to ensure 60fps browser performance. The **3D Bloch Sphere** is the highest-priority interactive visualization and must never drop frames due to UI animations.

* **Prefer:** CSS transforms (`translate`, `scale`), CSS `opacity`, GPU-accelerated properties, and `requestAnimationFrame` (for canvas/custom JS).
* **Avoid:** Unnecessary large blur effects, continuous heavy particle simulations, expensive DOM layout animations (e.g., animating `width`/`height`/`top`/`left`), and excessive drop-shadows during movement.

---

## 7. Accessibility (Reduced Motion)

The animation system must respect the user's OS-level motion preferences.

If `prefers-reduced-motion: reduce` is detected:
* Disable cursor trailing/elasticity (cursor tracks instantly).
* Minimize or eliminate page entry/scroll transitions (fade-in only, no vertical offset).
* Remove unnecessary continuous movement (e.g., background particles).
* Preserve important state-change feedback (e.g., probability bars snap instantly to results).

The website must remain fully usable and visually coherent without any animations.
