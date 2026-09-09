# PAGE 2 — QUANTUM GATE VISUALIZER — SPECIFICATION — QYNX

---

## 1. Purpose & Educational Role

**QUANTUM GATE VISUALIZER** is Page 2 of **QYNX**, providing an interactive, mathematically grounded single-qubit simulator. Users apply elementary unitary operators ($X, Y, Z, H, S, T$) and witness immediate, synchronized responses across a real 3D state-driven Bloch Sphere, Dirac state notation, and Born-rule probability distributions.

### Invariant Architectural Principles:
1. **Mathematical Precedence**: Visualization never fabricates quantum coordinates. The shared quantum engine computes the state vector $[\alpha, \beta]^T$; the UI and 3D viewport passively derive and reflect those coordinates.
2. **Real 3D Bloch Sphere**: The Bloch Sphere is an interactive Three.js WebGL visualization. It is never replaced with static images, fake renders, or pre-rendered videos.
3. **Continuous Geodesic Trajectories**: Gate applications animate the state vector along spherical arcs between the initial and target quantum states.
4. **Human-Designed UI**: Structured with restrained surfaces in the QYNX Purple scale, ensuring optimal contrast and scientific legibility.

---

## 2. Route & Component Architecture

```
Route: /gate-visualizer
Component: src/pages/GateVisualizer.tsx
State Slice: src/store/gateVisualizerSlice.ts
Engine Contracts: engine.applyGate, engine.getBlochCoordinates, engine.measureSingle
```

---

## 3. Visual Layout & Information Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│ 02 QUANTUM GATE VISUALIZER                    [ Reset Qubit ] [ Undo ] │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  ┌──────────────────────────────┐  ┌────────────────────────────────┐  │
│  │                              │  │ STATE: |+⟩                     │  │
│  │       3D BLOCH SPHERE        │  │ α = 0.707 + 0.000i             │  │
│  │      (Three.js Canvas)       │  │ β = 0.707 + 0.000i             │  │
│  │                              │  ├────────────────────────────────┤  │
│  │   +Z |0⟩ (North Pole)        │  │ PROBABILITY DISTRIBUTION       │  │
│  │     ▲                        │  │ |0⟩ [████████████      ] 50.0% │  │
│  │     │   ● State Point        │  │ |1⟩ [████████████      ] 50.0% │  │
│  │     └───► +X |+⟩             │  ├────────────────────────────────┤  │
│  │    /                         │  │ UNITARY GATES                  │  │
│  │  ▼ +Y |+i⟩                   │  │ [ H ] [ X ] [ Y ] [ Z ] [S] [T]│  │
│  │                              │  ├────────────────────────────────┤  │
│  │   [ Orbit / Pan Controls ]   │  │ [ TRIGGER MEASUREMENT ]        │  │
│  └──────────────────────────────┘  └────────────────────────────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│  GATE APPLICATION HISTORY                                              │
│  #3  H   |0⟩ ──► |+⟩   (θ: 90.0°, φ: 0.0°)                             │
│  #2  X   |1⟩ ──► |0⟩   (θ: 0.0°,  φ: 0.0°)                             │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. 3D Bloch Sphere Specifications

- **Container Viewport**: Rendered in `Purple 90 #31135E` canvas with `Purple 80` structural border.
- **Surface Mesh**: Transparent sphere with wireframe meridians in `Purple 80` (opacity $0.35$).
- **Equator Ring**: Solid ring outline in `Purple 70 #6929C4`.
- **Orthogonal Axes ($X, Y, Z$)**: $2\text{px}$ lines in `Purple 40 #BE95FF` with crisp pole labels:
  - North Pole ($+Z$): $|0\rangle$ (`White #FFFFFF`).
  - South Pole ($-Z$): $|1\rangle$ (`White #FFFFFF`).
  - Front Axis ($+X$): $|+\rangle$.
  - Back Axis ($-X$): $|-\rangle$.
  - Right Axis ($+Y$): $|+i\rangle$.
  - Left Axis ($-Y$): $|-i\rangle$.
- **State Vector Arrow**: 3D cylinder and cone rendered in `Purple 60 #8A3FFC` with luminous `White` apex point.
- **Camera Controls**: Three.js `OrbitControls` with rotation limits, smooth damping, and touch pinch-to-zoom.

---

## 5. Gate Execution & State Trajectory Lifecycle

When the user selects an elementary unitary gate ($X, Y, Z, H, S, T$):

$$\text{User Click} \longrightarrow \text{Validation} \longrightarrow \text{Engine Matrix Multiply} \longrightarrow \text{Spherical Derivation} \longrightarrow \text{SLERP Trajectory} \longrightarrow \text{UI Settling}$$

1. **Gate Selection**: User clicks `[ H ]`. Button scales to $0.95$ in `Purple 70`.
2. **Engine Execution**: `engine.applyGate(currentState, 'H')` produces new state vector $[1/\sqrt{2}, 1/\sqrt{2}]^T$.
3. **Bloch Coordinate Computation**: `engine.getBlochCoordinates` yields $\theta = \pi/2, \phi = 0 \implies (x=1, y=0, z=0)$.
4. **Trajectory Interpolation**: The 3D state vector animates smoothly along the spherical arc from $(0, 0, 1)$ to $(1, 0, 0)$ over a $600\text{ms}$ duration using Spherical Linear Interpolation (SLERP).
5. **UI Synchronization**: In parallel, Dirac labels transition to $|+\rangle$ and probability bars animate smoothly to $50.0\% / 50.0\%$.

---

## 6. Projective Measurement & Collapse

- Clicking **[ TRIGGER MEASUREMENT ]**:
  1. Invokes `engine.measureSingle(currentState)`.
  2. The state vector instantly snaps to the observed pole ($+Z$ for $|0\rangle$, $-Z$ for $|1\rangle$) without smooth trajectory, reflecting instantaneous wave-function collapse.
  3. Probability bars snap to $100.0\% / 0.0\%$ or $0.0\% / 100.0\%$.
  4. Unitary gate buttons are locked (opacity 0.45) with an inline diagnostic: *"State collapsed. Click Reset Qubit to resume gate operations."*
