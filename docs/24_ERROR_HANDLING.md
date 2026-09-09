# ERROR HANDLING — SPECIFICATION — QYNX

---

## 1. Pedagogical Error Handling Philosophy

In **QYNX**, error handling is treated as an educational opportunity rather than an obstacle. Errors never produce opaque stack traces, cryptic codes, or application crashes.

### The 3-Part Diagnostic Formula:
Every error message and diagnostic banner in QYNX must explicitly convey:
1. **WHAT HAPPENED**: Clear statement of the physical or system limitation.
2. **WHY IT HAPPENED**: Educational explanation grounded in quantum mechanical rules.
3. **WHAT THE USER CAN DO NEXT**: Direct, actionable step to resolve the state.

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠ INVALID MULTI-QUBIT GATE PLACEMENT                                  │
│                                                                        │
│ What Happened: The CNOT gate cannot be placed on a single wire.        │
│ Why: Controlled-NOT requires both an independent control qubit and a   │
│      target qubit to perform conditional state transitions.            │
│ What To Do Next: Add a second qubit wire using [+ Add Qubit] or choose │
│                  a single-qubit gate (H, X, Y, Z, S, T).               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Common Quantum Error Scenarios

| Scenario | What Happened | Why It Happened | What To Do Next |
|:---|:---|:---|:---|
| **Gate After Collapse** | Unitary gate blocked | Measurement irreversibly collapsed the wave function into a definite basis state. | Click **[ Reset Qubit ]** to prepare a fresh $|0\rangle$ state vector. |
| **CNOT Same Wire** | Control and target overlap | A qubit cannot act as a conditional control on its own transformation. | Drag the target or control node to an alternate qubit wire. |
| **Empty Circuit Run** | Simulation aborted | No unitary transformations or operations are placed on the circuit grid. | Select and place at least one gate token onto a qubit wire. |
| **Column Conflict** | Two gates in one slot | A single physical qubit cannot undergo two concurrent transformations at step $t_k$. | Move one of the conflicting gates into an adjacent column slot. |
| **WebGL Failure** | 3D canvas unavailable | The browser or device GPU does not support WebGL2 rendering context. | 2D Dirac notation and probability charts remain fully functional below. |
| **Touch Placement Limit** | Drag-and-drop unresponsive | Mobile touch devices do not support pointer-drag in the circuit builder. | Tap the desired gate in the top palette, then tap the target wire cell. |

---

## 3. UI Styling & Visual Feedback

- **Inline Banners**: Rendered inside `Purple 80 #491D8B` panels with a left accent border in `rgba(220, 60, 60, 0.8)` and text in `Purple 10 #F6F2FF`.
- **Haptic / Motion Feedback**: Invalid interactive attempts trigger a subtle horizontal shake animation ($300\text{ms}$) on the attempted target element.
- **Error Boundaries**: Component-level boundaries prevent canvas exceptions from affecting global navigation or state stores.
