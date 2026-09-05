# MEASUREMENT SYSTEM — SPECIFICATION

---

## 1. Purpose

This document specifies how quantum measurement is simulated throughout the application. Measurement is a probabilistic operation that collapses the quantum state. The system must accurately simulate Born-rule probability, single-shot measurement, multi-shot measurement, and result visualization.

---

## 2. Core Concept

In quantum mechanics, measuring a qubit in the computational basis:
- Gives outcome `|0⟩` with probability `P(0) = |α|²`
- Gives outcome `|1⟩` with probability `P(1) = |β|²`
- After measurement, the state **collapses** to the measured basis state
- The randomness is simulated using `Math.random()` — a classical pseudo-random approximation

**This is a simulator.** The measurement results are classically random weighted by quantum probabilities, not from physical quantum randomness.

---

## 3. Measurement Functions (Engine Layer)

All measurement functions live in `src/engine/measurement.ts`.

### 3.1 Single-Shot Measurement (1 qubit)

```typescript
function measureSingle(state: StateVector1Q): MeasurementOutcome1Q {
  const p0 = magnitudeSquared(state[0])  // |α|²
  // p1 = 1 - p0, but derived as magnitudeSquared(state[1]) for accuracy
  const r = Math.random()
  return r < p0 ? '0' : '1'
}
```

This function does **not** collapse the state. The store is responsible for updating the state to the collapsed form after calling this function.

**Collapsed states after measurement:**
```
Measured '0': new state = |0⟩ = [{ re:1, im:0 }, { re:0, im:0 }]
Measured '1': new state = |1⟩ = [{ re:0, im:0 }, { re:1, im:0 }]
```

### 3.2 Single-Shot Measurement (2 qubits)

```typescript
function measureTwoQubit(state: StateVector2Q): MeasurementOutcome2Q {
  const p00 = magnitudeSquared(state[0])
  const p01 = magnitudeSquared(state[1])
  const p10 = magnitudeSquared(state[2])
  const p11 = magnitudeSquared(state[3])

  const r = Math.random()
  if (r < p00)            return '00'
  if (r < p00 + p01)      return '01'
  if (r < p00 + p01 + p10) return '10'
  return '11'
}
```

### 3.3 Multi-Shot Measurement (1 qubit)

```typescript
function measureMultiShot(state: StateVector1Q, shots: number): Record<'0'|'1', number> {
  // Clamp shots to valid range
  const clampedShots = Math.max(1, Math.min(shots, 10000))
  const counts = { '0': 0, '1': 0 }

  for (let i = 0; i < clampedShots; i++) {
    const outcome = measureSingle(state)
    counts[outcome]++
  }

  return counts
}
```

**Critical:** The state is **not** collapsed between shots. Each shot independently samples from the same pre-measurement state. This simulates running the same quantum circuit `shots` times and aggregating results.

### 3.4 Multi-Shot Measurement (2 qubits)

```typescript
function measureMultiShot2Q(
  state: StateVector2Q,
  shots: number
): Record<'00'|'01'|'10'|'11', number> {
  const clampedShots = Math.max(1, Math.min(shots, 10000))
  const counts = { '00': 0, '01': 0, '10': 0, '11': 0 }

  for (let i = 0; i < clampedShots; i++) {
    const outcome = measureTwoQubit(state)
    counts[outcome]++
  }

  return counts
}
```

### 3.5 Probability Calculation

```typescript
function getProbabilities1Q(state: StateVector1Q): { p0: number; p1: number } {
  const p0 = magnitudeSquared(state[0])
  const p1 = magnitudeSquared(state[1])
  // Normalize to correct any floating-point drift
  const total = p0 + p1
  return { p0: p0 / total, p1: p1 / total }
}

function getProbabilities2Q(
  state: StateVector2Q
): { p00: number; p01: number; p10: number; p11: number } {
  const raw = state.map(magnitudeSquared)
  const total = raw.reduce((sum, v) => sum + v, 0)
  return {
    p00: raw[0] / total,
    p01: raw[1] / total,
    p10: raw[2] / total,
    p11: raw[3] / total,
  }
}
```

---

## 4. Shot Count

Shot count controls how many times a measurement is repeated in multi-shot mode.

| Mode | Description | Shot Count |
|------|-------------|-----------|
| Single shot | One measurement, state collapses | 1 |
| Multi-shot (default) | Repeated measurements from same initial state | 100 (default) |
| High-precision | More samples, better approximation | Up to 10,000 |

**Default shot count:** 100 (provides a good probability approximation without sluggishness).

**UI controls for shot count:**

```
SHOTS

[  ←  ] [ 100 ] [  →  ]

Presets: 1 | 10 | 100 | 1000 | 10000
```

The shot count selector is a small stepper component on the Experiment Lab and Entanglement Simulator. It is not present on the Gate Visualizer (Gate Visualizer only does single-shot measurement, then shows the collapsed state).

---

## 5. Result Representation

### 5.1 Single-Shot Result Display

```
MEASUREMENT RESULT

━━━━━━━━━━━━━━━━━━━━━━━━

|0⟩    ← Outcome displayed in Dirac notation, large font

State has collapsed.
```

**Specification:**

```
Container: quantum-panel, centered
Result value: --font-mono, --text-display (3.5rem), --color-white
Label "MEASUREMENT RESULT": --text-label, --color-arctic, uppercase, letter-spacing 0.1em
Explanation: --text-body-sm, --color-arctic
Background glow: box-shadow on panel (success color if 0, icicle color if 1)
```

After measurement on the Gate Visualizer:
- The probability bars animate to 100% (for the measured outcome) and 0% (for the other).
- The Bloch sphere vector snaps to the measured pole (north for |0⟩, south for |1⟩).
- The state label updates to |0⟩ or |1⟩.
- Gate buttons become disabled (greyed out). Only Reset is active.

### 5.2 Multi-Shot Result Display (Histogram)

```
MEASUREMENT RESULTS  (1000 shots)

|00⟩  ████████████████████  512   51.2%
|01⟩                             0     0.0%
|10⟩                             0     0.0%
|11⟩  ███████████████████   488   48.8%
```

**Specification:**

```
Container: quantum-panel
Title: "MEASUREMENT RESULTS (N shots)" — --text-h3, --color-white
Subtitle/note: "Results are probabilistic and vary between runs." — --text-body-sm, --color-arctic, italic

Per row:
  display: flex; align-items: center; gap: --space-3; padding: --space-2 0

  State label (|00⟩, etc.):
    --font-mono, --text-body, --color-arctic; width: 48px

  Bar:
    flex: 1; height: 8px
    Bar fill: width = (count / shots) * 100%
    Fill color: --gradient-accent
    Background: rgba(56,80,106,0.3)
    Transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1) on first appearance

  Count:
    --font-mono, --text-body-sm, --color-arctic; width: 48px; text-align: right

  Percentage:
    --font-mono, --text-body-sm, --color-white; width: 52px; text-align: right
```

**Result ordering:** Always display basis states in binary order:
- 1 qubit: |0⟩, |1⟩
- 2 qubits: |00⟩, |01⟩, |10⟩, |11⟩

**Empty result rows:** Rows with 0 count are still shown (with 0% and no bar fill). Do not hide them.

### 5.3 Probability Percentage Formatting

```typescript
function formatProbability(p: number): string {
  if (p === 0) return '0.0%'
  if (p === 1) return '100.0%'
  return `${(p * 100).toFixed(1)}%`
}

function formatCount(count: number): string {
  return count.toString()
}
```

Always show one decimal place. Do not round 50.0% to "50%" — keep the decimal for scientific precision aesthetic.

---

## 6. Measurement State Machine

The measurement state of a qubit follows this state machine:

```
INITIAL: superposition/arbitrary state
         (isMeasured = false)
         │
         ▼
USER CLICKS MEASURE
         │
         ▼
ENGINE: measureSingle(state) → outcome
STORE:  collapse state, set isMeasured = true
         │
         ▼
MEASURED: collapsed state
          (isMeasured = true)
          Gate buttons disabled
          Measure button disabled
          │
          ▼
USER CLICKS RESET
          │
          ▼
Back to INITIAL: |0⟩
(isMeasured = false)
```

When `isMeasured = true`:
- Attempting to apply a gate shows a warning message: "Reset the qubit to apply gates after measurement."
- The gate buttons show as disabled (CSS `opacity: 0.4; pointer-events: none`).

---

## 7. Measurement Disclaimer

The UI must display, near every measurement result, a subtle note:

> *"This simulator uses classical pseudo-random sampling weighted by quantum probability amplitudes. Results approximate but do not replicate true quantum randomness."*

**Display:** `--text-label, --color-arctic, opacity: 0.7`, below the result panel.

This ensures users understand the educational nature of the simulator.

---

## 8. Performance Consideration

For 10,000 shots, `measureMultiShot` runs 10,000 iterations of `Math.random()` and two floating-point comparisons. This is approximately 1–2ms in modern browsers — fast enough to run synchronously.

Do **not** use a Web Worker for measurement calculation. The synchronous approach is fast enough and simpler. If future expansion includes more complex shot simulation (error models, noise), revisit this decision.
