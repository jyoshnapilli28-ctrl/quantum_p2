# ERROR HANDLING — SPECIFICATION

---

## 1. Error Handling Philosophy

- **Errors should never crash the entire application.** Use React error boundaries to contain failures to the affected component or page.
- **Every error must show the user a clear, actionable message.** Never expose raw error messages or stack traces to the user.
- **Recovery must always be offered.** Every error state includes a way out (reset, reload, retry).
- **The quantum engine returns null or error objects** — it does not throw. The store and UI handle null returns defensively.

---

## 2. Error Categories

| Category | Source | Severity |
|----------|--------|----------|
| Engine validation error | Quantum engine returns null | Low (user-correctable) |
| WebGL context error | Three.js fails to initialize | Medium (graceful fallback) |
| Circuit execution error | Invalid circuit definition | Low (user-correctable) |
| State corruption | Unexpected store value | High (requires reset) |
| Network error | Font loading, etc. | Low (fallback fonts apply) |
| Route error | Invalid URL | Low (redirect to home) |
| React rendering error | Component throws | High (error boundary) |

---

## 3. React Error Boundaries

### 3.1 Page-Level Error Boundary

Every page component is wrapped in an error boundary. If the page throws an uncaught error, the boundary catches it and renders a recovery UI.

```
Boundary wraps: GateVisualizer, ExperimentLab, EntanglementSim, CircuitBuilder
Does NOT need to wrap: QuantumUniverse (static educational content, low risk)
```

**Fallback UI:**

```
┌──────────────────────────────────────────────────┐
│                                                  │
│   ⚠  Something went wrong                        │
│                                                  │
│   The quantum simulation encountered an error.   │
│   Your other pages are unaffected.               │
│                                                  │
│   [ Reset Page ]   [ Go to Home ]                │
│                                                  │
└──────────────────────────────────────────────────┘
```

"Reset Page": calls `window.location.reload()` for the current route.
"Go to Home": navigates to `/`.

### 3.2 Bloch Sphere Error Boundary

A smaller boundary wraps only the Three.js canvas. If Three.js fails (WebGL context lost, out-of-memory), the boundary catches it and shows the WebGL fallback (see `18_3D_BLOCH_SPHERE.md` Section 10).

The rest of the Gate Visualizer (probability bars, gate buttons, state label) continues to function normally.

---

## 4. Engine Error Handling

### 4.1 Null Return Handling

Every call to the quantum engine in the store layer must handle `null` returns:

```typescript
const newState = engine.applyGate(currentState, gate)

if (newState === null) {
  // Engine returned null: invalid input or internal error
  set({ errorMessage: `Failed to apply gate ${gate}. Please reset.` })
  return  // Do not update the quantum state
}

// Apply the new state
set({ currentState: newState, /* ... */ })
```

### 4.2 Error Message Display

When a store action detects an engine error, it sets an `errorMessage` field.

UI components subscribe to `errorMessage` and display a toast notification:

```
Toast notification:
  Position: bottom-right corner (desktop), bottom-full-width (mobile)
  Background: rgba(138,74,74,0.95)
  Border: 1px solid #8A4A4A (--color-error)
  Text: --font-primary, --text-body-sm, --color-white
  Icon: ⚠ warning symbol
  Auto-dismiss: 5 seconds
  Dismiss button: × in top-right corner

Animation (enter):
  initial: { opacity: 0, y: 16 }
  animate: { opacity: 1, y: 0 }
  transition: 250ms ease-out

Animation (exit):
  opacity: 1 → 0
  duration: 200ms
```

### 4.3 Recovery from Engine Errors

Engine errors (null returns) do not crash the application. The state remains unchanged. The user can:
1. Read the error message.
2. Click "Reset" to restore the initial state.
3. Continue using the application.

---

## 5. Gate Validation Errors (Page 5 — Circuit Builder)

Circuit validation errors are user-correctable and shown inline (not as toasts).

See `17_CIRCUIT_BUILDER.md` Section 6.2 for validation display.

**Examples:**

| Error | Message |
|-------|---------|
| CNOT same wire | "CNOT: control and target must be on different qubit wires." |
| Wire conflict | "Column 3 has two gates on qubit 1. Move one to a different column." |
| Empty circuit | "Add at least one gate before running." |

All messages: `--text-body-sm, --color-error`, shown in validation panel.

---

## 6. Measurement Errors

| Scenario | Error | Response |
|----------|-------|---------|
| Measure after collapse | Attempted measure of already-measured state | Ignored; gate button shows as disabled |
| Shots out of range | shots < 1 or > 10000 | Clamped to valid range with console.warn |
| State vector zero norm | Unexpected zero-length vector | Reset to |0⟩ with warning message |

---

## 7. WebGL Errors

### 7.1 WebGL Not Available

Detection at mount time (see `18_3D_BLOCH_SPHERE.md` Section 10).

If WebGL is unavailable:
- Show fallback text in the Bloch sphere canvas area.
- All other Gate Visualizer features remain active.
- No error toast (this is a graceful fallback, not an unexpected error).

### 7.2 WebGL Context Lost

`three.js` can lose the WebGL context due to device GPU reset, memory pressure, or tab switching on low-end devices.

Handle the `webglcontextlost` event on the canvas:

```typescript
canvasElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault()
  setWebGLState('lost')
})

canvasElement.addEventListener('webglcontextrestored', () => {
  setWebGLState('active')
  // Re-initialize Three.js scene
})
```

When context is lost:
- Show in the canvas area: "3D visualization temporarily unavailable. Attempting to restore..."
- If restored: reinitialize the scene and resume.
- If not restored after 10s: show the permanent fallback.

---

## 8. Routing Errors

### 8.1 Unknown Route (404)

If a user navigates to an unknown URL:

```
Route: /* (catch-all)

Render:
  404 — Page Not Found

  This route doesn't exist in Quantum Universe.

  [ Go to Home ]
```

Style: matches the application design system. Simple panel on dark background.

### 8.2 Router Error Boundary

React Router v6 has built-in error boundary support via `errorElement` on routes:

```typescript
{
  path: '*',
  element: <NotFoundPage />,
}
```

---

## 9. Font Loading Failure

If Google Fonts fails to load (network unavailable), the CSS `font-display: swap` ensures:
- System sans-serif used immediately (`-apple-system, BlinkMacSystemFont, sans-serif`).
- App remains fully functional.
- No error message shown (font fallback is transparent to users).

---

## 10. Console Error Policy

- Do **not** display stack traces or technical error details to users.
- Do **log** engine warnings (`console.warn`) for invalid inputs.
- Do **log** engine errors (`console.error`) for unexpected failures.
- Do **not** log user interaction events (no analytics in scope at launch).

Error levels:
```
console.warn: recoverable issues (invalid gate, state renormalized)
console.error: unexpected failures (state vector zero norm, unknown gate ID)
```

---

## 11. Error State Summary

| Error | User Sees | Recovery |
|-------|-----------|---------|
| Invalid gate applied | Toast: "Gate [X] failed to apply." | Auto-dismiss; reset available |
| Measured qubit → apply gate | Gate button disabled; inline warning | Reset button |
| CNOT on single qubit | Gate button shakes; inline message | No action needed; message auto-hides |
| Circuit validation fail | Inline validation error panel | Fix errors and retry |
| Empty circuit → run | Run button disabled; empty state message | Add gates |
| WebGL unavailable | Graceful fallback text in sphere canvas | Continue without 3D |
| WebGL context lost | "Restoring..." message | Auto-restore or fallback |
| Page component crash | Error boundary fallback | Reset Page / Go Home |
| Unknown URL | 404 page | Go to Home |
