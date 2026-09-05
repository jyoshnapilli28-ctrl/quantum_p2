# ANIMATION SYSTEM — SPECIFICATION

---

## 1. Animation Philosophy

Animations in Quantum Universe serve **one primary purpose:** to communicate state changes meaningfully. An animation that doesn't inform the user about what changed is unnecessary and should be removed.

**Principles:**

1. **Communicate, don't decorate.** Every animation has a specific reason.
2. **Calibrate duration to complexity.** Simple changes: 150–300ms. Complex state transitions: 400–600ms. Never exceed 800ms for interactive animations.
3. **Ease purposefully.** Entering content eases out (decelerates). Exiting content eases in (accelerates). State transitions use symmetric easing.
4. **Respect user preferences.** All motion animations must respond to `prefers-reduced-motion: reduce`.
5. **Performance first.** Only animate `opacity` and `transform` properties in CSS. Never animate `width`, `height`, `top`, `left` (with the exception of progress bars where `scaleX` is used).

---

## 2. Animation Library Assignments

| Context | Library | Reason |
|---------|---------|--------|
| Page transitions | Framer Motion | Clean integration with React Router |
| Gate button press | CSS (`:active` pseudo-class) | Synchronous, no JS delay |
| Probability bar fill | CSS `transition` | GPU-accelerated width animation |
| Panel enter/exit | Framer Motion | `AnimatePresence` handles mounting/unmounting |
| Bloch sphere vector | Three.js `useFrame` + manual SLERP | 3D interpolation |
| Particle background | Canvas `requestAnimationFrame` | Direct control |
| Experiment step highlight | Framer Motion + CSS | Sequential staging |
| Entanglement arc draw | CSS `stroke-dashoffset` animation | SVG-native |
| Results histogram bars | CSS `transition` + Framer Motion stagger | Staggered entry |
| Circuit gate placement | Framer Motion `layout` | Automatic position transition |
| Toast notifications | Framer Motion | Mount/unmount with `AnimatePresence` |

---

## 3. Page Transitions

```
Trigger: React Router route change

Exit animation:
  opacity: 1 → 0
  duration: 200ms
  easing: ease-in

Enter animation:
  opacity: 0 → 1
  duration: 300ms
  easing: ease-out

Total: 500ms (exit and enter sequential; no overlap)
```

**Implementation:**

```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    <Routes location={location}>
      {/* route elements */}
    </Routes>
  </motion.div>
</AnimatePresence>
```

On `prefers-reduced-motion: reduce`: page transitions are instant (duration: 0ms).

---

## 4. Gate Application Animation

When a gate is applied on Page 2 (Gate Visualizer):

### 4.1 Gate Button Press

```
Trigger: mousedown / pointerdown

CSS:
  :active {
    transform: scale(0.95);
    transition: transform 100ms ease-in;
  }
  
  :not(:active) {
    transform: scale(1);
    transition: transform 150ms ease-out;
  }
```

Duration: 100ms press, 150ms release = 250ms total.

### 4.2 Bloch Sphere Vector Animation

```
Trigger: store.applyGate() called, isAnimating set to true

Duration: 600ms
Method: SLERP (see 18_3D_BLOCH_SPHERE.md Section 7)
Easing: cubic-bezier(0.4, 0, 0.2, 1) (Material standard)

Frame-by-frame: updateStateVector(slerp(from, to, t))

On prefers-reduced-motion: snap to final position immediately (duration: 0ms)
```

### 4.3 State Label Update (DiracNotation)

```
Trigger: state vector changed

Step 1: Current label fades out
  opacity: 1 → 0
  duration: 150ms; ease-in

Step 2: New label fades in
  opacity: 0 → 1
  duration: 150ms; ease-out
  delay: 150ms (after step 1 completes)

Total: 300ms
```

### 4.4 Probability Bar Animation

```
Trigger: probabilities object changes in store

CSS transition on bar fill width:
  transition: width 400ms cubic-bezier(0.4, 0, 0.2, 1)
  (or: transition: transform 400ms ... if using scaleX approach)
```

Do not delay this animation. It should start immediately when the new probabilities are received — concurrent with the Bloch sphere animation.

### 4.5 Gate History Entry

```
Trigger: new gate applied

New entry appears at top of history list.
Framer Motion:
  initial: { opacity: 0, x: -16 }
  animate: { opacity: 1, x: 0 }
  transition: { duration: 0.25, ease: 'easeOut' }
```

---

## 5. Measurement Animation

### 5.1 State Collapse

```
Trigger: measure() called

Bloch sphere: instantaneous snap to pole (no SLERP)
  The sudden snap communicates the irreversible nature of measurement.

Probability bars: snap to 100%/0% — no transition
  Same reason: measurement collapse is not gradual.

State label: cross-fade (300ms)
  Shows new collapsed state label.

Measurement result panel:
  Enter animation (Framer Motion):
    initial: { opacity: 0, scale: 0.95 }
    animate: { opacity: 1, scale: 1 }
    transition: { duration: 0.3, type: 'spring', stiffness: 200 }
```

### 5.2 Multi-Shot Result Histogram

```
Trigger: measureMultiShot() returns results

Each bar:
  Enters sequentially with stagger:
  bar 0: delay 0ms
  bar 1: delay 80ms
  bar 2: delay 160ms
  bar 3: delay 240ms

  Each bar:
    initial width: 0%
    animate to: final probability %
    duration: 600ms
    easing: cubic-bezier(0.0, 0, 0.2, 1) (ease-out — fast start, gentle finish)

On subsequent measurements (re-running):
  Bars animate from old width to new width (no stagger on re-run)
  duration: 400ms
```

---

## 6. Experiment Step Animations (Page 3)

### 6.1 Step Progress Indicator

```
When currentStepIndex increments:

Old active step (becomes "complete"):
  Fill circle with --color-icicle: scale 0→1, 300ms
  Checkmark (✓) fades in: opacity 0→1, 200ms after fill

New active step (becomes "active"):
  Text/number color changes: transition 200ms

Connector line (between steps):
  stroke-dashoffset animates from full to 0 (draws the line): 400ms
```

### 6.2 State Update Between Steps

```
Between step N and step N+1:

State label: cross-fade (300ms)
Probability bars: transition (400ms)
Step card: slide in from right
  initial: { opacity: 0, x: 24 }
  animate: { opacity: 1, x: 0 }
  transition: { duration: 0.35, ease: 'easeOut' }
```

### 6.3 Auto-Play (Run All)

Steps execute sequentially. Each step:
1. Start step animation (as above).
2. Wait for animation to complete (400ms).
3. Wait additional 200ms (cognitive pause for user to see result).
4. Proceed to next step.

Total pause between steps: 600ms.

---

## 7. Entanglement Connection Animation (Page 4)

### 7.1 Connection Appears

```
Trigger: isEntangled becomes true (after CNOT applied)

SVG path drawn:
  stroke-dasharray: pathLength pathLength
  stroke-dashoffset: pathLength → 0
  duration: 700ms
  easing: ease-in-out

Simultaneously:
  Entanglement badge enters:
    initial: { opacity: 0, scale: 0.8 }
    animate: { opacity: 1, scale: 1 }
    transition: { type: 'spring', stiffness: 250, delay: 0.4 }
```

### 7.2 Marching Ants (While Entangled)

```
CSS animation:
  @keyframes march {
    to { stroke-dashoffset: -20px; }  /* negative of (dash + gap) */
  }

  path {
    stroke-dasharray: 6 4;
    animation: march 1s linear infinite;
  }
```

On `prefers-reduced-motion`: remove `animation: march`, keep static dashes.

### 7.3 Connection Disappears (Reset)

```
opacity: 1 → 0
duration: 300ms
ease-in
```

---

## 8. Circuit Builder Animations (Page 5)

### 8.1 Gate Placement

```
Trigger: gate dropped onto cell

Gate token appears in cell:
  initial: { opacity: 0, scale: 0.7 }
  animate: { opacity: 1, scale: 1 }
  transition: { duration: 0.2, type: 'spring', stiffness: 300 }
```

### 8.2 Gate Removal

```
Trigger: user clicks × on gate token

Gate token exits:
  exit: { opacity: 0, scale: 0.7 }
  duration: 0.15s
```

### 8.3 Gate Move (Drag)

```
While dragging: gate token scales up slightly (1.05) and adds shadow
  transform: scale(1.05)
  box-shadow: 0 8px 24px rgba(0,0,0,0.4)
  transition: transform 100ms ease-out

On drop: animate to final position via Framer Motion `layout` prop
  transition: { type: 'spring', stiffness: 200, damping: 20 }
```

### 8.4 Run Circuit Result

```
Trigger: execution complete

Result panel enters:
  initial: { opacity: 0, y: 24 }
  animate: { opacity: 1, y: 0 }
  transition: { duration: 0.4, ease: 'easeOut' }

Histogram bars stagger in (see Section 5.2)
```

---

## 9. Scroll-Triggered Entry Animations (Page 1)

For the educational page sections:

```
Trigger: section enters viewport (IntersectionObserver)
  threshold: 0.15 (15% of element visible)
  rootMargin: "0px 0px -50px 0px"

Section container:
  initial: { opacity: 0, y: 20 }
  animate: { opacity: 1, y: 0 }
  transition: { duration: 0.6, ease: 'easeOut' }

Child elements within section (stagger):
  delay: 100ms per element
```

On `prefers-reduced-motion`: No entry animation. All sections visible immediately.

---

## 10. Ambient / Idle Animations

The following have gentle continuous animations **only when not actively interacting:**

| Element | Idle Animation | Duration |
|---------|--------------|---------|
| Quantum Universe hero | Particles drift slowly | ∞ loop |
| Qubit indicator on Page 1 | Opacity pulse (±0.1) | 3s loop |
| Entanglement connection | Marching ants | 1s loop |

**No other elements have continuous idle animation.** Continuous animation on the Bloch sphere, gate buttons, or other interactive elements is explicitly forbidden (performance and attention degradation).

---

## 11. Animation Duration Reference

| Animation | Duration | Easing |
|-----------|---------|--------|
| Page transition (exit) | 200ms | ease-in |
| Page transition (enter) | 300ms | ease-out |
| Gate button press | 100ms | ease-in |
| Gate button release | 150ms | ease-out |
| Bloch sphere SLERP | 600ms | cubic-bezier(0.4, 0, 0.2, 1) |
| State label cross-fade | 300ms (150+150) | ease |
| Probability bar update | 400ms | cubic-bezier(0.4, 0, 0.2, 1) |
| Gate history entry | 250ms | ease-out |
| Measurement result entry | 300ms | spring(200) |
| Histogram bar enter | 600ms | ease-out |
| Histogram bar update | 400ms | ease-out |
| Histogram bar stagger | 80ms per bar | — |
| Experiment step transition | 350ms | ease-out |
| Entanglement arc draw | 700ms | ease-in-out |
| Entanglement badge | 300ms spring | spring(250) |
| Circuit gate place | 200ms spring | spring(300) |
| Circuit gate remove | 150ms | ease-in |
| Scroll section enter | 600ms | ease-out |

---

## 12. Reduced Motion Behavior

When `prefers-reduced-motion: reduce` is detected:

| Animation | Behavior |
|-----------|---------|
| Page transitions | Instant (no fade) |
| Bloch sphere SLERP | Instant snap |
| Probability bars | Instant update (no transition) |
| State label | Instant update |
| Scroll reveals | All sections visible, no stagger |
| Particle background | Static particles, no movement |
| Entanglement arc | Static dashed line (no marching, no draw animation) |
| Histogram bars | Instant full height |
| Gate placement | Instant appear |
| Any idle animation | Stopped |

Detect with:
```typescript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches
```

Pass this as a context value throughout the app to disable animations globally.
