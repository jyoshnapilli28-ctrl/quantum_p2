# PAGE 1 — QUANTUM UNIVERSE (Educational Page)

---

## 1. Purpose

The Quantum Universe page is the **educational foundation** of the application. It introduces users to quantum computing concepts through immersive animated diagrams and interactive demonstrations.

Users do not run simulations on this page. They **learn** the concepts that they will then apply on Pages 2–5.

The page must feel like entering a futuristic quantum environment — not reading a textbook. Each section uses visual storytelling: animated diagrams, interactive state indicators, and atmospheric design.

---

## 2. Page Structure

```
Route: /
Component: QuantumUniverse.tsx

LAYOUT:
┌──────────────────────────────────────────┐
│         NAVIGATION (fixed)               │
├──────────────────────────────────────────┤
│              HERO SECTION                │
├──────────────────────────────────────────┤
│     SECTION 1: Classical Bit vs Qubit    │
├──────────────────────────────────────────┤
│         SECTION 2: Superposition         │
├──────────────────────────────────────────┤
│         SECTION 3: Measurement           │
├──────────────────────────────────────────┤
│         SECTION 4: Quantum Gates         │
├──────────────────────────────────────────┤
│         SECTION 5: Entanglement          │
├──────────────────────────────────────────┤
│       SECTION 6: Quantum Circuits        │
├──────────────────────────────────────────┤
│            EXPLORE CTA                   │
└──────────────────────────────────────────┘
```

---

## 3. Hero Section

**Purpose:** Establish the immersive, premium atmosphere immediately on page load.

**Layout:**
```
[particle background]
┌──────────────────────────────────────────────┐
│                                              │
│         ⬡  QUANTUM UNIVERSE                 │
│                                              │
│   Explore the fundamental principles that    │
│   power the next era of computing.           │
│                                              │
│   [ Begin the Journey ↓ ]                   │
│                                              │
└──────────────────────────────────────────────┘
```

**Specification:**

```
Height: 100vh (full viewport height)
Background: --gradient-bg-main with particle canvas overlay

Heading "QUANTUM UNIVERSE":
  font: --font-primary, --text-display (3.5rem), weight 700, --color-white
  letter-spacing: -0.02em
  Enter animation: fade-up from y:30px, opacity:0→1, 800ms, delay 200ms

Subheading:
  font: --font-primary, --text-body-lg (1.125rem), weight 400, --color-arctic
  max-width: 480px; margin: 0 auto
  Enter animation: same pattern, delay 500ms

CTA Button "Begin the Journey ↓":
  Primary button style (see 05_DESIGN_SYSTEM.md)
  On click: smooth scroll to Section 1
  Enter animation: same pattern, delay 800ms

Particle Background:
  Canvas element, positioned absolute, full hero height
  See 19_VISUALIZATION_SYSTEM.md for particle specification
  Particles: small blue-white dots (--color-arctic at 30–60% opacity)
  Motion: slow random drift (very subtle, 0.1–0.3 px/frame)
  Particle count: 80 on desktop, 40 on mobile
  On prefers-reduced-motion: particles freeze (no motion)
```

---

## 4. Section 1 — Classical Bit vs Qubit

**Learning Objective:** Understand the fundamental difference between a classical bit (0 or 1) and a qubit (superposition of 0 and 1).

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                CLASSICAL BIT vs QUBIT                    │
│                                                          │
│  Classical Bit          Qubit                            │
│  ┌─────────────┐        ┌─────────────────────────┐     │
│  │  [0] or [1] │        │ α|0⟩ + β|1⟩             │     │
│  │  (certain)  │        │ (superposition)          │     │
│  └─────────────┘        └─────────────────────────┘     │
│                                                          │
│  [INTERACTIVE TOGGLE]                                    │
│   Click to flip bit        Animate qubit state           │
│                                                          │
│  A classical bit is always either 0 or 1. A qubit can    │
│  exist in a superposition of both states simultaneously. │
└──────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**

- **Classical bit:** An animated toggle switch. Clicking it flips between 0 and 1 with a snap animation. Visual: rectangular LED indicator, dark when 0, bright Icicle glow when 1.
- **Qubit:** A circular state indicator that slowly cycles through a gradient between |0⟩ and |1⟩ to visually suggest superposition. The indicator displays "α|0⟩ + β|1⟩" beneath it in monospace.
- Clicking the qubit indicator shows a tooltip: "A qubit's state is described by two complex numbers α and β, where |α|² + |β|² = 1."

**Animation:**
- Classical bit toggle: immediate snap with a brief glow flash (200ms)
- Qubit indicator: continuous slow pulse animation (3s loop, subtle brightness oscillation). On `prefers-reduced-motion`: no pulsing, static display.

**Connects to:** Page 2 (Gate Visualizer) — after this section, the user understands what a qubit is.

**Responsive:** Two-column layout on desktop (classical | qubit side by side). Single column on mobile (classical first, qubit below).

---

## 5. Section 2 — Superposition

**Learning Objective:** Understand that a qubit can be in superposition: a combination of |0⟩ and |1⟩ until measured.

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                      SUPERPOSITION                       │
│                                                          │
│   Before Measurement        After Measurement            │
│                                                          │
│       ◐ QUBIT                    ● |0⟩  or  ○ |1⟩        │
│   α|0⟩ + β|1⟩              50%         50%               │
│                                                          │
│   [ APPLY H GATE ]  [ MEASURE ]                          │
│                                                          │
│   Probability: |0⟩ ████████ 50%   |1⟩ ████████ 50%      │
│                                                          │
│   "The Hadamard gate puts the qubit into equal           │
│    superposition. Measurement collapses it to |0⟩ or |1⟩│
│    with equal probability."                              │
└──────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**

1. Initially, the qubit shows |0⟩. The "APPLY H GATE" button is active.
2. Clicking "APPLY H GATE":
   - The qubit indicator transitions from solid to split-half (◐ visual).
   - The probability bars animate from 100%/0% to 50%/50%.
   - The state label changes from "|0⟩" to "|+⟩".
   - The "MEASURE" button activates.
3. Clicking "MEASURE":
   - The qubit randomly collapses to |0⟩ or |1⟩ (run a single `measureSingle` call).
   - The split indicator snaps to solid (bright or dim).
   - Probability bars snap to 100%/0% or 0%/100%.
   - State label updates.
4. A "Reset" button appears. Clicking it restores the initial |0⟩ state.

**This section uses the quantum engine.** Call `engine.applyGate([1,0], 'H')` and `engine.measureSingle()` for real probabilistic behavior.

**Animation:**
- H gate application: 400ms smooth probability bar transition.
- Measurement collapse: quick 150ms snap.
- State indicator morph: 400ms blend.

**Connects to:** Pages 2, 3.

---

## 6. Section 3 — Measurement

**Learning Objective:** Understand that quantum measurement is probabilistic and collapses the state.

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                      MEASUREMENT                         │
│                                                          │
│   Quantum state:  α|0⟩ + β|1⟩                           │
│                         │                                │
│                      MEASURE                             │
│                    ┌────┴────┐                            │
│                    ▼         ▼                           │
│           |α|² = 70%      |β|² = 30%                    │
│             |0⟩               |1⟩                        │
│                                                          │
│   [ ADJUST α ] ───────●────────                          │
│                0              1                          │
│                                                          │
│   [ MEASURE 10 TIMES ]                                   │
│   Results:  |0⟩ : 7 times  |1⟩ : 3 times                │
└──────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**

1. A slider adjusts the qubit's |α|² value (and automatically updates |β|² = 1 - |α|²). The slider ranges from 0 to 1 in 0.01 steps.
   - As the slider moves, the probability bars update in real-time.
   - The state label updates (for common values: |0⟩ at 100%, |1⟩ at 0%, |+⟩ at 50%).
2. Clicking "MEASURE 10 TIMES" runs 10 measurements and shows the results as a tally (|0⟩: N times, |1⟩: M times).
3. Results appear with a brief counting animation (incrementing numbers).

**Slider Specification:**
```
Range input: 0 to 1, step 0.01
Width: 100%; max-width: 320px
Track: height 4px, background --color-polar
Fill (0 to thumb): background --gradient-accent
Thumb: 16px circle, background --color-white, border 2px solid --color-icicle
```

**Connects to:** Pages 2, 3, 4, 5.

---

## 7. Section 4 — Quantum Gates

**Learning Objective:** Understand that quantum gates are unitary operations that transform qubit states.

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                    QUANTUM GATES                         │
│                                                          │
│   [ H ] [ X ] [ Z ]    ← Select a gate                  │
│                                                          │
│   State: |0⟩  →  [ H ]  →  |+⟩                          │
│                                                          │
│   Gate: Hadamard (H)                                     │
│   Effect: Creates equal superposition                    │
│   Matrix:  1/√2 [1  1]                                   │
│                 [1 -1]                                   │
│                                                          │
│   [ Apply to |0⟩ ] [ Apply to |1⟩ ]                      │
└──────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**

1. Three gate buttons displayed: H, X, Z (the three most intuitive gates for introduction).
2. Selecting a gate shows:
   - Gate name and description in a panel.
   - Its matrix representation (formatted as a visual table, not raw text).
   - Example transformations: "H|0⟩ = |+⟩" and "H|1⟩ = |-⟩".
3. "Apply to |0⟩" and "Apply to |1⟩" buttons apply the selected gate to a mini qubit display.
4. The mini qubit display shows a simple visual representation of the state (not the full Bloch sphere — use a simple circular indicator).

**Gate Matrix Display:**
```
Formatted as an HTML table with styling:
  border: thin --color-polar lines
  text: --font-mono, centered
  font-size: --text-body-sm
  background: rgba(28,43,56,0.5)
  border-radius: --radius-sm
  padding: --space-2
```

**Connects to:** Page 2 (Gate Visualizer).

---

## 8. Section 5 — Entanglement

**Learning Objective:** Understand quantum entanglement — that two qubits can become correlated such that measuring one instantly determines the other's state.

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                    ENTANGLEMENT                          │
│                                                          │
│   Qubit A ──H──●────M       Qubit B ──────X────M        │
│                │                           │             │
│             CNOT                      Correlated         │
│                                                          │
│   State: (|00⟩ + |11⟩)/√2                               │
│                                                          │
│   [ CREATE BELL STATE ]                                  │
│                                                          │
│   After Measurement:                                     │
│   A=|0⟩ → B=|0⟩  always                                │
│   A=|1⟩ → B=|1⟩  always                                │
│                                                          │
│   [ MEASURE ]  Result: A=|1⟩ B=|1⟩                      │
└──────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**

1. "CREATE BELL STATE" button applies the H+CNOT sequence to produce the Bell state.
   - Animated dashed lines connect the two qubit circles, glowing when entangled.
2. "MEASURE" button measures the Bell state and always shows |00⟩ or |11⟩.
3. Repeated measurements demonstrate the correlation.

**Entanglement Visual:**
- Before entanglement: two separate qubit circles, no connection.
- After entanglement: an animated arc or glowing dashed line connects them.
- On `prefers-reduced-motion`: static connection line, no glow animation.

**Connects to:** Page 4 (Entanglement Simulator).

---

## 9. Section 6 — Quantum Circuits

**Learning Objective:** Understand that quantum circuits are sequences of gates applied to qubits.

**Visual Layout:**
```
┌──────────────────────────────────────────────────────────┐
│                   QUANTUM CIRCUITS                       │
│                                                          │
│   A quantum circuit is a sequence of quantum gates       │
│   applied to one or more qubits.                         │
│                                                          │
│   Example:                                               │
│   q0 ───── H ─────●──────── M                           │
│                   │                                      │
│   q1 ─────────────X──────── M                           │
│                                                          │
│   ↑ Interactive. Click to step through.                  │
│                                                          │
│   Step 1: H creates superposition on q0                  │
│   Step 2: CNOT entangles q0 and q1                       │
│   Step 3: Measure both qubits                            │
│                                                          │
│   [ → Next Step ] [ Reset ]                              │
│                                                          │
│   [ GO TO CIRCUIT BUILDER → ]                            │
└──────────────────────────────────────────────────────────┘
```

**Interactive Behavior:**

1. "Next Step" steps through the circuit: H is highlighted, then CNOT, then Measure.
2. As each gate highlights, the step description below updates.
3. The circuit diagram is an SVG built with the same `CircuitDiagram` shared component.
4. "GO TO CIRCUIT BUILDER →" is a prominent CTA that navigates to Page 5.

**Connects to:** Page 5 (Circuit Builder).

---

## 10. Bottom CTA Section

After Section 6, display a full-width call-to-action section:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│         Ready to explore the quantum realm?              │
│                                                          │
│  [Gate Visualizer] [Experiment Lab] [Circuit Builder]    │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

Each button uses the primary button style and navigates to the respective page.

---

## 11. Responsive Behavior

| Breakpoint | Adaptation |
|-----------|-----------|
| Desktop (>1024px) | Two-column layout in sections 1, 2, 4 (visual left, text right) |
| Tablet (768–1024px) | One-column layout; visualizations full-width |
| Mobile (<768px) | One-column; animations simplified; particle count reduced to 40 |

---

## 12. Scroll Behavior

Sections fade in when they enter the viewport. Use `IntersectionObserver` to trigger enter animations.

Each section entry animation:
- `opacity: 0 → 1`
- `transform: translateY(20px) → translateY(0)`
- Duration: 600ms, `ease-out` easing
- Stagger delay for elements within a section: 100ms between items

On `prefers-reduced-motion`: no scroll animations; all sections visible immediately.

---

## 13. Accessibility

- Section headings use `<h2>` tags.
- Interactive diagrams have `role="img"` and `aria-label` describing what they show.
- Buttons have descriptive `aria-label` values.
- Slider has `aria-label="Probability of measuring |0⟩"` and `aria-valuemin`, `aria-valuemax`, `aria-valuenow`.
- Animations respect `prefers-reduced-motion`.
- Color is never the only differentiator for state (text labels always present).
