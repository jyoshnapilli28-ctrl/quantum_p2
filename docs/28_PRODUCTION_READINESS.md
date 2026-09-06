# 28. PRODUCTION READINESS

This document defines the final production readiness requirements for Quantum Universe. It covers metadata, optimizations, compatibility, and final release constraints. **Do not implement these directly; this is a specification.**

## 1. SEO Requirements
* **Robots:** `index, follow` (unless staging, which should be `noindex, nofollow`).
* **Canonical URL:** Must be defined on every page to prevent duplicate content indexing.
* **Sitemap:** Provide an `sitemap.xml` listing the 5 core application routes.

## 2. Page Titles & Meta Descriptions
Each route must have dynamic titles and meta tags.
* **Global suffix:** `| Quantum Universe`
* **Page 1:** `Introduction to Quantum Computing` | *Description:* Explore the fundamentals of quantum mechanics, qubits, and superposition in an interactive 3D universe.
* **Page 2:** `Quantum Gate Visualizer` | *Description:* Interactive 3D Bloch sphere visualization of X, Y, Z, H, S, and T quantum gates.
* **Page 3:** `Quantum Experimental Lab` | *Description:* Run interactive quantum experiments and observe wave-function collapse and measurement.
* **Page 4:** `Quantum Entanglement Simulator` | *Description:* Simulate multi-qubit entanglement and visualize Bell states in real-time.
* **Page 5:** `Quantum Circuit Builder` | *Description:* Drag and drop quantum logic gates to build, run, and simulate custom quantum circuits.

## 3. Open Graph Requirements
* **`og:title` & `og:description`:** Inherit from page metadata.
* **`og:image`:** A highly optimized (1200x630px) WebP/JPEG representing the Bloch Sphere or Quantum Grid.
* **`og:type`:** `website`
* **Twitter Cards:** `summary_large_image` format.

## 4. Favicon & Web Manifest Requirements
* **Favicon (`favicon.ico`):** For legacy browsers, minimum 32x32px.
* **Apple Touch Icon (`apple-touch-icon.png`):** 180x180px PNG for iOS home screen shortcuts.
* **SVG Favicon:** Provide `quantum-universe-icon.svg` for modern browsers.
* **Web Manifest (`site.webmanifest`):**
  * `name`: Quantum Universe
  * `short_name`: Quantum
  * `theme_color`: `#071018` (Midnight)
  * `background_color`: `#0B132B` (Deep Navy)
  * `display`: `standalone`

## 5. Browser Compatibility
* Support modern Chromium browsers (Chrome, Edge), Firefox, and Safari (macOS/iOS).
* ES2022+ features allowed; build system must transpile correctly.
* WebGL 2.0 required for the 3D Bloch Sphere. Provide a graceful degradation/fallback message if WebGL is disabled.

## 6. Performance Budgets
* **First Contentful Paint (FCP):** < 1.2s
* **Largest Contentful Paint (LCP):** < 2.5s (Critical: Ensure the 3D canvas or primary illustration loads quickly).
* **Cumulative Layout Shift (CLS):** < 0.1
* **Interaction to Next Paint (INP):** < 200ms (Crucial for circuit builder and gate buttons).
* **Bundle Size:** Initial JS payload < 300KB (Gzipped). Defer non-critical routes.

## 7. Asset Optimization
* **GLTF Optimization:** Compress `bloch-sphere.gltf` using `gltf-pipeline` or Draco compression. Textures (if any) must be KTX2 or optimized WebP.
* **SVG Optimization:** Run SVGO on all 83 icons and 32 illustrations to strip unnecessary metadata and group SVG nodes.
* **Loading Strategy:**
  * Eagerly load core brand SVGs (logo, global-bg).
  * Lazy load specific page illustrations (e.g., `circuit-builder.svg`) using intersection observers or route-level code splitting.

## 8. Caching & Deployment
* **Static Assets:** Apply long-term caching (`Cache-Control: max-age=31536000, immutable`) to `assets/` via content hashing (handled by Vite).
* **HTML:** Apply `Cache-Control: no-cache` to `index.html`.
* **Environment Constraints:** `NODE_ENV=production` must enforce minification, stripping of dev-only React warnings, and production Zustand devtools disabling.

## 9. Error Handling Requirements
* **Global Error Boundary:** Catch unhandled React exceptions and display `simulation-error.svg` with a friendly "Quantum State Collapsed" message.
* **404 Handling:** A catch-all route displaying `page-not-found.svg` with an option to reset the wave function (return home).

## 10. Accessibility & Reduced Motion
* `prefers-reduced-motion`: Must disable particle backgrounds, snap Bloch Sphere movements to final states instantly, and disable page transition crossfades.
* Focus rings (`:focus-visible`) must use `Icicle (#446983)` and never be disabled.
* Screen reader labels on all 83 interactive icons (especially Quantum gates).

## 11. Final Release Requirements
* Passing Lighthouse scores (>90 in all categories).
* Validated quantum math outputs across all 5 pages.
* No console errors or warnings in production mode.
