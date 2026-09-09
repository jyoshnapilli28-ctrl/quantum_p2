# PERFORMANCE — SPECIFICATION — QYNX

---

## 1. Performance Targets & Budgets

**QYNX** prioritizes high-performance interactive simulation, rapid initial page loads, and consistent 60 FPS 3D rendering.

| Performance Metric | Target Threshold | Validation Tool |
|:---|:---:|:---|
| **First Contentful Paint (FCP)** | $< 1.5\text{s}$ | Google Lighthouse / Core Web Vitals |
| **Largest Contentful Paint (LCP)** | $< 2.5\text{s}$ | Lighthouse |
| **Interaction to Next Paint (INP)** | $< 200\text{ms}$ | Chrome Performance Panel |
| **Cumulative Layout Shift (CLS)** | $< 0.1$ | Lighthouse |
| **Core JS Bundle (gzipped, initial)** | $< 200\text{KB}$ | Vite Rollup Visualizer |
| **Bloch Sphere WebGL Frame Budget** | $< 16.6\text{ms}$ (60 FPS) | Chrome DevTools Frame Profiler |
| **Quantum Engine Simulation (10k shots)** | $< 5\text{ms}$ | Pure TypeScript CPU benchmark |

---

## 2. Eliminating Unnecessary Visual Overhead

By replacing the legacy speculative AI aesthetic (excessive blur, multi-layered glass panels, constant neon glows, continuous particle systems) with **Human-Designed Restrained Surfaces**, QYNX eliminates major GPU and compositing bottlenecks:

1. **Restrained Surface Design**: Panels use opaque or semi-opaque surfaces (`Purple 80 #491D8B`) with crisp borders (`Purple 70 #6929C4`). The expensive CSS property `backdrop-filter: blur()` is restricted to top navigation only and capped at $8\text{px}$.
2. **Zero Continuous Particle Simulators**: Gratuitous background particle fields that continuously drain CPU/GPU threads are removed.
3. **No Uncontrolled Glows**: Replaces multi-layered `box-shadow` neon washes with sharp, single-pixel borders and predictable focus rings.

---

## 3. Code Splitting & Chunk Organization (Vite)

Heavy visual dependencies are isolated and lazy-loaded on demand:

```typescript
// vite.config.ts manual chunk distribution
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-core': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'vendor-motion': ['framer-motion'],
          'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'], // Lazy-loaded on /gate-visualizer
          'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable'],                // Lazy-loaded on /circuit-builder
        }
      }
    }
  }
});
```

---

## 4. 3D WebGL Bloch Sphere Lifecycle & GPU Management

1. **Demand-Driven Rendering**: The Three.js canvas utilizes `frameloop="demand"` via R3F. Frames render strictly during:
   - Active gate application SLERP trajectories ($600\text{ms}$).
   - User mouse/touch camera drag and damping.
   - Initial scene mounting.
   - When idle, rendering is completely suspended ($0\%$ GPU consumption).
2. **Viewport Culling**: An `IntersectionObserver` halts render requests when the 3D viewport is scrolled off-screen.
3. **Strict Memory Disposal**: All Three.js geometry, materials, and textures are explicitly disposed of on route unmount:
   ```typescript
   useEffect(() => {
     return () => {
       sphereGeometry.dispose();
       sphereMaterial.dispose();
       axesGroup.clear();
       renderer.dispose();
     };
   }, []);
   ```

---

## 5. State Selector & Re-render Optimization

Components subscribe strictly to required sub-slices via fine-grained Zustand selectors to prevent cascading re-renders:

```typescript
// Fine-grained subscription (Optimal)
const p0 = useQuantumStore(state => state.gateVisualizer.probabilities.p0);

// Avoid broad slice subscriptions that cause whole-tree re-renders
```
