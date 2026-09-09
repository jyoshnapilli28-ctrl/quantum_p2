# MEASUREMENT SYSTEM — SPECIFICATION — QYNX

---

## 1. Purpose & Core Physics

The **QYNX Measurement System** models the non-deterministic collapse of quantum state vectors under projective measurement in the computational basis, accurately demonstrating the Born rule, wave-function collapse, and empirical shot statistics.

### Key Pedagogical Invariants:
1. **Classical Simulation vs. Quantum Randomness**: Classical pseudo-random algorithms (`Math.random()`) weight state selection based on exact quantum amplitude probabilities ($P(k) = |c_k|^2$).
2. **State Collapse**: Single-shot measurement irreversibly projects the state vector onto the observed basis state ($|0\rangle, |1\rangle, |00\rangle, \text{etc.}$).
3. **Multi-Shot Independence**: Multi-shot simulation (e.g., 100 to 10,000 shots) independently samples from the pre-measurement superposition without in-between collapse, constructing an accurate empirical distribution.

---

## 2. Measurement Engine Implementation (`src/engine/measurement.ts`)

```typescript
// Single-qubit projective measurement
export function measureSingle(state: StateVector1Q): MeasurementOutcome1Q {
  const p0 = magnitudeSquared(state[0]);
  return Math.random() < p0 ? '0' : '1';
}

// Two-qubit projective measurement
export function measureTwoQubit(state: StateVector2Q): MeasurementOutcome2Q {
  const p00 = magnitudeSquared(state[0]);
  const p01 = magnitudeSquared(state[1]);
  const p10 = magnitudeSquared(state[2]);
  const r = Math.random();

  if (r < p00) return '00';
  if (r < p00 + p01) return '01';
  if (r < p00 + p01 + p10) return '10';
  return '11';
}

// Multi-shot statistical sampling
export function measureMultiShot(
  state: StateVector1Q,
  shots: number
): Record<'0' | '1', number> {
  const clampedShots = Math.max(1, Math.min(shots, 10000));
  const counts = { '0': 0, '1': 0 };

  for (let i = 0; i < clampedShots; i++) {
    const outcome = measureSingle(state);
    counts[outcome]++;
  }

  return counts;
}
```

---

## 3. UI Display & QYNX Purple Tokens

### 3.1 Single-Shot Result Display (Pages 2 & 3)
```
┌────────────────────────────────────────┐
│ MEASUREMENT OUTCOME                    │
│                                        │
│                 |1⟩                    │
│                                        │
│ State collapsed. Reset to apply gates. │
└────────────────────────────────────────┘
```
- **Panel Container**: Surface `Purple 80 #491D8B`, border `1px solid Purple 70 #6929C4`, radius `12px`.
- **Outcome Typography**: `JetBrains Mono` 48px Bold, color `White #FFFFFF`.
- **Status Explanation**: `Inter` 14px, color `Purple 40 #BE95FF`.
- **Interactive State**: Once measured, gate buttons are visually disabled (opacity 0.45), highlighting the primary "Reset Qubit" action (`Purple 60`).

### 3.2 Multi-Shot Histogram Display (Pages 3, 4, and 5)
```
|00⟩  [████████████████████          ]  514   51.4%
|01⟩  [                              ]    0    0.0%
|10⟩  [                              ]    0    0.0%
|11⟩  [███████████████████           ]  486   48.6%
```
- **Container**: `Purple 80 #491D8B` panel with `Purple 70` structural dividing lines.
- **Basis Label**: `JetBrains Mono` 14px in `Purple 20 #E8DAFF`.
- **Bar Track**: Background `Purple 90 #31135E`, height 10px, radius 5px.
- **Bar Fill**: Solid `Purple 60 #8A3FFC` transitioning smoothly over 400ms.
- **Shot Tally & Percentage**: `JetBrains Mono` 14px in `White #FFFFFF` with fixed single decimal place precision (`51.4%`).

---

## 4. Scientific Disclaimer Requirement

To maintain academic transparency, all measurement panels feature this standard caption:
> *"QYNX is an educational browser simulator. Measurements use classical pseudo-random sampling weighted by Born-rule quantum amplitudes."*
- **Styling**: `Inter` 12px italic, color `Purple 40 #BE95FF`, opacity 0.85.
