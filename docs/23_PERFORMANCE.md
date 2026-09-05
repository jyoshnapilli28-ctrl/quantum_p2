# PERFORMANCE — SPECIFICATION

---

## 1. Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| First Contentful Paint (FCP) | < 1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | < 2.5s | Lighthouse |
| Interaction to Next Paint (INP) | < 200ms | Lighthouse |
| Cumulative Layout Shift (CLS) | < 0.1 | Lighthouse |
| Initial bundle size (gzipped, excl. lazy) | < 200 KB | Vite bundle analyzer |
| Time to Interactive (TTI) | < 3.5s | Lighthouse |
| Bloch sphere: frame time (60fps) | < 16.6ms | Chrome DevTools |
| Quantum calculation (10k shots) | < 5ms | console.time() |

---

## 2. Code Splitting and Lazy Loading

### 2.1 Route-Level Code Splitting

Each page component is lazy-loaded. Vite handles this automatically with dynamic imports:

```typescript
// src/router.tsx

const QuantumUniverse  = lazy(() => import('./pages/QuantumUniverse'))
const GateVisualizer   = lazy(() => import('./pages/GateVisualizer'))
const ExperimentLab    = lazy(() => import('./pages/ExperimentLab'))
const EntanglementSim  = lazy(() => import('./pages/EntanglementSim'))
const CircuitBuilder   = lazy(() => import('./pages/CircuitBuilder'))
```

Each route has its own JS chunk. Users only download the code for the page they visit.

### 2.2 Three.js Lazy Loading

Three.js is **only loaded** when the user navigates to the Gate Visualizer (`/gate-visualizer`).

The `GateVisualizer.tsx` page component is already lazy-loaded. Three.js is imported inside that component's module, so it is bundled into the Gate Visualizer chunk.

Estimated Three.js chunk size: ~200 KB gzipped (R3F + drei + Three.js core).

### 2.3 @dnd-kit Lazy Loading

`@dnd-kit/core` and `@dnd-kit/sortable` are imported only inside `CircuitBuilder.tsx`, which is a lazy-loaded route. These are bundled into the Circuit Builder chunk.

### 2.4 Chunk Loading Sequence

```
Initial navigation to /:
  Loads: react, react-dom, react-router, zustand, framer-motion, shared components
  Chunk: ~180 KB gzipped

User navigates to /gate-visualizer:
  Loads: GateVisualizer chunk + Three.js chunk
  Additional: ~200–220 KB gzipped

User navigates to /circuit-builder:
  Loads: CircuitBuilder chunk + @dnd-kit chunk
  Additional: ~80 KB gzipped
```

---

## 3. Three.js / Bloch Sphere Performance

### 3.1 Frame Loop Management

Use `frameloop="demand"` on the R3F `Canvas` component:

```tsx
<Canvas frameloop="demand">
  {/* Bloch sphere scene */}
</Canvas>
```

With `frameloop="demand"`, R3F only renders a new frame when `invalidate()` is called. New frames are requested:
- During Bloch sphere animation (SLERP): `invalidate()` called every `requestAnimationFrame` cycle.
- After camera interaction (OrbitControls calls `invalidate()` automatically during damping).
- When the component first mounts.

**Not** during idle (no frame rendered when nothing changes). This eliminates continuous GPU drain.

### 3.2 IntersectionObserver Pause

Pause the Bloch sphere render loop when it scrolls out of view (relevant only on mobile where users scroll past the sphere):

```typescript
const observer = new IntersectionObserver(
  ([entry]) => {
    setIsVisible(entry.isIntersecting)
  },
  { threshold: 0.1 }
)
observer.observe(canvasRef.current)
```

When `isVisible = false`, do not call `invalidate()` and skip animation frames.

### 3.3 Geometry Complexity

| Screen Size | Sphere Segments | Triangle Count |
|------------|----------------|---------------|
| Desktop | 64×64 | ~8,000 |
| Tablet | 48×48 | ~4,500 |
| Mobile | 32×32 | ~2,000 |

All counts are well within WebGL limits (millions of triangles). The Bloch sphere is never a performance bottleneck.

### 3.4 Dispose on Unmount

When the Gate Visualizer route unmounts:

```typescript
useEffect(() => {
  return () => {
    // Dispose all Three.js resources
    sphere.geometry.dispose()
    sphere.material.dispose()
    axes.forEach(a => a.geometry.dispose())
    renderer.dispose()
  }
}, [])
```

Failure to dispose causes memory leaks that compound on repeated navigation.

---

## 4. Particle Background Performance

The QuantumParticles canvas (Page 1 hero) uses a continuous animation loop. Optimize:

1. **Use `requestAnimationFrame`** (not `setInterval`).
2. **Pause when not in viewport** (IntersectionObserver).
3. **Pause when tab is hidden** (`document.addEventListener('visibilitychange', ...)`).
4. **Limit particle count** based on device capability:
   - Desktop: 80 particles
   - Mobile: 40 particles
   - Consider reducing further if `navigator.hardwareConcurrency < 4`
5. **Canvas clearing:** Use `clearRect()` before each frame (do not use `fillRect` for clearing — it's slower).

---

## 5. State Update Performance

### 5.1 Zustand Selector Optimization

Components must subscribe to **only the state they need** using selector functions:

```typescript
// CORRECT: fine-grained selector
const probability0 = useQuantumStore(state => state.gateVisualizer.probabilities.p0)

// WRONG: broad subscription causes unnecessary re-renders
const gateVisualizerState = useQuantumStore(state => state.gateVisualizer)
```

Using broad selectors causes every component subscribed to `gateVisualizer` to re-render on every store update, even if the specific value it renders hasn't changed.

### 5.2 Memoization

Use `React.memo` for components that receive object props and may re-render unnecessarily:

```typescript
export const ProbabilityBar = React.memo(({ label, probability, count }: ProbabilityBarProps) => {
  // ...
})
```

Use `useMemo` for derived data that is expensive to compute:

```typescript
const sortedGateHistory = useMemo(
  () => [...gateHistory].reverse(),
  [gateHistory]
)
```

Do **not** use `useMemo` for cheap operations (string formatting, array slices < 10 items) — the overhead of memoization exceeds the savings.

### 5.3 Quantum Calculations

All quantum calculations are synchronous and fast:
- Single gate application: < 0.1ms
- 10,000 measurement shots: < 5ms
- Circuit execution (4 qubits, 10 gates): < 2ms

These run synchronously on the main thread. **No Web Workers needed.** If future expansion requires more complex noise simulation or larger qubit counts (> 10), reconsider Web Workers at that time.

---

## 6. CSS Performance

### 6.1 Animated Properties

Only animate properties that do not trigger layout recalculation:

**Allowed (GPU-composited):**
- `opacity`
- `transform` (translate, scale, rotate)
- `filter` (for glow effects — use sparingly)

**Avoid animating:**
- `width` / `height` (for probability bars: use `transform: scaleX()` instead)
- `top` / `left` / `right` / `bottom` (use `transform: translate()`)
- `padding` / `margin`
- `border-width`

**Probability bar optimization:**
```css
/* CORRECT: scaleX + transform-origin */
.bar-fill {
  transform-origin: left center;
  transform: scaleX(var(--fill-pct, 0));
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* Where --fill-pct = probability value (0 to 1) set via inline style */
```

### 6.2 `will-change` Usage

Use `will-change` only when a transition is guaranteed to happen frequently:

```css
.bloch-canvas {
  will-change: transform; /* during camera rotation */
}
```

Do **not** apply `will-change` to static elements — it wastes GPU memory.

Remove `will-change` after animation via JavaScript:
```javascript
element.style.willChange = 'auto'
```

### 6.3 backdrop-filter Performance

`backdrop-filter: blur()` is GPU-accelerated but moderately expensive. Rules:
- Use only on `.quantum-panel` elements (justified — this is the glassmorphism effect).
- Do **not** use `backdrop-filter` on more than 8 elements visible simultaneously.
- On very low-power devices, fall back to a solid dark background (detect via `navigator.hardwareConcurrency < 2`).

---

## 7. Asset Loading

### 7.1 Fonts

Fonts are loaded via Google Fonts with `display=swap`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

`display=swap` ensures body text appears immediately in a fallback font, then swaps to Inter with minimal layout shift.

**Preload critical weights:**
```html
<link rel="preload" as="font" type="font/woff2"
  href="https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"
  crossorigin>
```

### 7.2 No Heavy Background Images

All page backgrounds use CSS gradients and Canvas-based particles — no image files. This avoids large background image downloads.

---

## 8. Build Optimization (Vite)

In `vite.config.ts`:

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'state-vendor': ['zustand', 'framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'dnd-vendor': ['@dnd-kit/core', '@dnd-kit/sortable'],
        }
      }
    },
    minify: 'terser',
    sourcemap: false,  // disable in production
  }
})
```

Manual chunks ensure vendor libraries are cached separately from application code. When application code changes, the browser only re-downloads the app chunk — not Three.js or React.

---

## 9. Lighthouse Audit

Run `npx lighthouse` against each page (served from `npm run build && npm run preview`) before each release.

Target scores:
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 90
- SEO: ≥ 85

Run audits on both desktop and mobile simulations (Lighthouse provides both profiles).

---

## 10. Performance Monitoring

During development, use the Chrome Performance panel to:
1. Record a "gate application" user flow on the Gate Visualizer.
2. Verify: no long tasks (> 50ms) on the main thread during interaction.
3. Verify: Bloch sphere animation frame times < 16.6ms.
4. Verify: quantum calculation time < 5ms (visible as a tiny synchronous block).
