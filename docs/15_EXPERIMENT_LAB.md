# PAGE 3 — EXPERIMENT LAB

---

## 1. Purpose

The Experiment Lab is an **interactive quantum laboratory** where users perform predefined quantum experiments step-by-step. Unlike the Gate Visualizer (which lets users freely apply any gate), the Experiment Lab guides users through structured experiments with explanations at each step.

The page should feel like working in a real quantum research lab — orderly, systematic, and revealing.

---

## 2. Route and Component

```
Route: /experiment-lab
Component: ExperimentLab.tsx
State slice: experimentSlice
Engine calls: engine.applyGate, engine.measureSingle, engine.measureMultiShot, engine.getProbabilities1Q
```

---

## 3. Page Layout

```
┌──────────────────────────────────────────────────────────────────┐
│ EXPERIMENT LAB                                [History]          │
├────────────────┬─────────────────────────────────────────────────┤
│                │                                                  │
│  EXPERIMENTS   │         EXPERIMENT WORKSPACE                     │
│                │                                                  │
│  ● Exp 01      │   EXPERIMENT 01 — Superposition                 │
│  ○ Exp 02      │   Goal: Create a qubit in superposition         │
│  ○ Exp 03      │                                                  │
│  ○ Exp 04      │   ┌──────────┐   ┌──────────┐   ┌──────────┐  │
│  ○ Exp 05      │   │ STEP 1   │ → │ STEP 2   │ → │ STEP 3   │  │
│                │   │ Init |0⟩ │   │ Apply H  │   │ Measure  │  │
│                │   └──────────┘   └──────────┘   └──────────┘  │
│                │                                                  │
│                │   [ RUN NEXT STEP ]    [ RUN ALL ] [ Reset ]    │
│                │                                                  │
│                │   STATE: |+⟩                                    │
│                │   |0⟩ ████████████ 50.0%                       │
│                │   |1⟩ ████████████ 50.0%                       │
│                │                                                  │
│                │   SHOTS [ ← ] [ 100 ] [ → ]                    │
│                │   [ MEASURE ]                                    │
│                │                                                  │
│                │   RESULT                                         │
│                │   |0⟩ ████████████████  51   51.0%             │
│                │   |1⟩ ███████████████   49   49.0%             │
│                │                                                  │
│                │   "The Hadamard gate created superposition..."   │
├────────────────┴─────────────────────────────────────────────────┤
│ EXPERIMENT HISTORY                                               │
└──────────────────────────────────────────────────────────────────┘
```

**Desktop:** Sidebar (experiment list) + main workspace.
**Tablet:** Dropdown experiment selector + workspace.
**Mobile:** Stacked — selector at top, workspace below.

---

## 4. Predefined Experiments (Launch Set)

Five experiments are defined at launch. Each is stored as an `ExperimentDefinition` object (see `09_QUANTUM_STATE_MANAGEMENT.md`).

### Experiment 01 — Superposition

```
Title: "Superposition"
Objective: "Create a qubit in superposition using the Hadamard gate."
Description: "The Hadamard gate transforms a definite state into an equal superposition,
              giving 50% probability for each measurement outcome."
Initial State: |0⟩

Steps:
  Step 1: Initialize
    Action: display
    Description: "Qubit initialized to |0⟩ (certain to measure 0)"
    State: |0⟩

  Step 2: Apply H Gate
    Action: applyGate('H')
    Description: "Apply Hadamard gate — qubit enters superposition"
    State: |+⟩

  Step 3: Measure
    Action: measure
    Description: "Measure the qubit — state collapses to |0⟩ or |1⟩"
    Probability: P(0) = 50%, P(1) = 50%

Expected outcome: Approximately 50% |0⟩ and 50% |1⟩ over many shots.
Explanation: "The Hadamard gate puts the qubit in an equal superposition.
              Each measurement gives a random result — but over many
              measurements, the distribution converges to 50/50."
```

### Experiment 02 — Qubit Flip (X Gate)

```
Title: "Qubit Flip"
Objective: "Flip a qubit from |0⟩ to |1⟩ using the X gate."
Description: "The Pauli-X gate is the quantum equivalent of a classical NOT gate."
Initial State: |0⟩

Steps:
  Step 1: Initialize |0⟩
  Step 2: Apply X Gate → |1⟩
  Step 3: Measure → always |1⟩

Expected outcome: 100% |1⟩
Explanation: "The X gate deterministically flips the qubit state.
              Unlike superposition, this result is certain every time."
```

### Experiment 03 — Phase Demonstration (Z Gate)

```
Title: "Phase Flip"
Objective: "Demonstrate the Z gate's phase effect using Hadamard superposition."
Description: "The Z gate only affects the |1⟩ amplitude's phase —
              it becomes visible when we use H gates around it."
Initial State: |0⟩

Steps:
  Step 1: Initialize |0⟩
  Step 2: Apply H → |+⟩
  Step 3: Apply Z → |-⟩
  Step 4: Apply H → |1⟩
  Step 5: Measure → always |1⟩

Expected outcome: 100% |1⟩
Explanation: "This is a phase kickback pattern. H → Z → H transforms |0⟩
              to |1⟩. The Z gate changed the superposition's phase,
              which H then converted to a definite state flip."
```

### Experiment 04 — Double Application (H²=I)

```
Title: "Hadamard Inverse"
Objective: "Demonstrate that applying H twice returns the qubit to its original state."
Initial State: |0⟩

Steps:
  Step 1: Initialize |0⟩
  Step 2: Apply H → |+⟩
  Step 3: Apply H → |0⟩
  Step 4: Measure → always |0⟩

Expected outcome: 100% |0⟩
Explanation: "The Hadamard gate is its own inverse: H² = I.
              Applying it twice undoes its effect and restores the original state."
```

### Experiment 05 — T Gate Phase Accumulation

```
Title: "Phase Accumulation (T Gates)"
Objective: "Demonstrate how repeated T gate applications rotate the qubit's phase."
Initial State: |0⟩

Steps:
  Step 1: Apply H → |+⟩
  Step 2: Apply T → phase rotation by π/4
  Step 3: Apply T → phase rotation by π/2 (= S effect)
  Step 4: Apply T → phase rotation by 3π/4
  Step 5: Apply T → phase rotation by π (= Z effect)
  Step 6: Apply H → |1⟩
  Step 7: Measure → always |1⟩

Expected outcome: 100% |1⟩
Explanation: "Four T gates accumulate to a Z gate (4 × π/4 = π).
              This demonstrates the T gate's role in building arbitrary rotations."
```

---

## 5. Experiment Selector (Sidebar)

**Desktop:**
```
EXPERIMENTS

● Experiment 01 — Superposition
○ Experiment 02 — Qubit Flip
○ Experiment 03 — Phase Flip
○ Experiment 04 — Hadamard Inverse
○ Experiment 05 — T Gate Phase
```

Active experiment: filled circle indicator (●), font --color-white.
Inactive: open circle (○), font --color-arctic.
Hover: font --color-white, cursor: pointer.

Clicking an experiment:
1. Selects the experiment (dispatches `selectExperiment`).
2. Resets the workspace to that experiment's initial state.
3. If the previous experiment had unsaved progress, no warning — just reset.

**Mobile/Tablet:** A `<select>` dropdown or a horizontally scrollable chip row:

```
[ Superposition ✓ ] [ Qubit Flip ] [ Phase Flip ] ...
```

Active chip has `--color-icicle` background.

---

## 6. Experiment Steps Display

Steps are shown as a horizontal progress indicator:

```
[●STEP 1]  →  [●STEP 2]  →  [○STEP 3]
 Complete      Active        Upcoming
```

**Specification:**

```
Step indicator:
  Circle: 32px, border 2px solid --color-polar
  Completed: filled with --color-icicle, checkmark inside (✓)
  Active: filled with --color-arctic, step number inside
  Upcoming: background --color-midnight

Step label: --font-primary, --text-label, --color-arctic below each circle

Connector line: 1px solid --color-polar (between circles)
```

**Step card (below the progress bar):**

```
┌────────────────────────────────────────┐
│  STEP 2 of 3                           │
│                                        │
│  Apply Hadamard Gate                   │
│                                        │
│  Gate applied: [H]                     │
│  State before: |0⟩                    │
│  State after:  |+⟩                    │
│                                        │
│  "The H gate creates equal            │
│   superposition..."                   │
└────────────────────────────────────────┘
```

The step card updates when `currentStepIndex` changes in the store.

---

## 7. Execution Controls

```
[ RUN NEXT STEP ]    [ RUN ALL ]    [ Reset ]
```

**RUN NEXT STEP:**
- Executes the next step in the sequence.
- Updates state, probability bars, step indicator.
- Shows animated transition between states.
- Button disabled if at last step or no experiment selected.

**RUN ALL:**
- Executes all remaining steps sequentially.
- Each step plays after a 600ms delay.
- Shows steps playing one after another with smooth transitions.
- Button disabled during execution (shows "Running...").

**Reset:**
- Resets to the initial state of the active experiment.
- Returns to Step 1.
- Clears measurement results.

---

## 8. State Display (During Experiment)

Below the controls:

```
CURRENT STATE

|+⟩

PROBABILITY
|0⟩  ████████████████████  50.0%
|1⟩  ████████████████████  50.0%
```

Uses the same shared `DiracNotation` and `ProbabilityBar` components as Page 2.

Updates are animated (400ms bar transitions, 300ms label cross-fade).

---

## 9. Measurement Controls

After the experiment reaches the measurement step:

```
MEASUREMENT SHOTS
[ ← ] [ 100 ] [ → ]
Presets: 1 | 10 | 100 | 1000

[ MEASURE N TIMES ]
```

**Behavior:**
1. Clicking "MEASURE N TIMES" calls `engine.measureMultiShot(experimentState, shotCount)`.
2. Results appear in the result histogram below.
3. Results update every time the user clicks (new random sample each time).

**Single shot mode (shots = 1):**
- The button says "MEASURE (single shot)"
- After measurement: state collapses, probability bars snap to 100%/0%.

**Multi-shot mode (shots > 1):**
- The state does **not** collapse (measurement is sampled from the same pre-measurement state).
- Results histogram shows distribution.

---

## 10. Result Display

```
MEASUREMENT RESULTS  (100 shots)

|0⟩  ████████████████████  51   51.0%
|1⟩  ███████████████████   49   49.0%

Note: Results are probabilistic. Each run may differ.
```

See `11_MEASUREMENT_SYSTEM.md` Section 5.2 for full histogram specification.

Animation: Bars grow from 0% to final value when results first appear (600ms, `ease-out`). Subsequent measurements animate from old value to new value.

---

## 11. Experiment History

Stores a log of completed experiments within the session.

```
EXPERIMENT HISTORY

▼ Superposition (just now)
  Initial: |0⟩ → H → Measured: |0⟩ (out of 100 shots: 51/49)

▼ Qubit Flip (2 minutes ago)
  Initial: |0⟩ → X → Measured: |1⟩ (deterministic)
```

**Specification:**

```
Container: collapsible panel (toggle with History button in header)
Each entry: clickable to expand/collapse

Entry fields:
  - Experiment title and time elapsed (relative: "just now", "5 min ago")
  - Gates applied (as small chip labels)
  - Initial state label
  - Measurement result summary

Clear History button: bottom of history panel
```

**Data stored:**
```typescript
{
  experimentId: string
  experimentTitle: string
  gatesUsed: GateId[]
  initialState: string  // Dirac notation
  result: MeasurementResult | null
  timestamp: number
}
```

**Privacy:** No personal data stored. History is session-only (lost on refresh).

---

## 12. Explanation Panel

Each step has an associated plain-language explanation that appears below the result area.

**Format:**
```
┌─────────────────────────────────────────────────────┐
│  ℹ  "The Hadamard gate put the qubit into equal    │
│     superposition. With 100 measurement shots,     │
│     you can see the 50/50 probability distribution │
│     emerging from the randomness."                 │
└─────────────────────────────────────────────────────┘
```

The explanation updates with each step and measurement result. See `06_UI_UX.md` Section 9 for the panel styling.

---

## 13. Responsive Behavior

| Breakpoint | Adaptation |
|-----------|-----------|
| Desktop (>1024px) | Sidebar (240px) + workspace |
| Tablet (768–1024px) | Dropdown experiment selector; workspace full width |
| Mobile (<768px) | Chip row selector; all workspace sections stacked vertically |

---

## 14. Accessibility

- Experiment selector has `role="listbox"` with each option as `role="option"`.
- Step progress bar has `role="progressbar"`, `aria-valuenow`, `aria-valuemax`.
- After each step, announce to `aria-live="polite"`: "Step N complete. State is now [label]."
- After measurement: announce "Measurement complete. Results: [0]: N%, [1]: M%."
- Shot count stepper: `aria-label="Number of measurement shots"`, `aria-valuenow`.
