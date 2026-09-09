# 28. PRODUCTION READINESS — QYNX

This document defines the production readiness standards for QYNX. It specifies metadata, performance budgets, caching, compatibility, and release gating criteria. **Do not implement these directly; this is an architectural specification.**

## 1. SEO & Metadata Standards
* **Robots:** `index, follow` on production (`noindex, nofollow` on preview/staging deployments).
* **Canonical URL:** Defined on every route to prevent duplicate content indexing.
* **Sitemap:** Automated `sitemap.xml` indexing all 5 core routes.

## 2. Page Titles & Meta Descriptions
Each route must dynamically set titles and meta tags conforming to the standard template:
* **Global Suffix:** `| QYNX`
* **Page 1:** `Quantum Universe — Fundamentals & Qubits | QYNX`  
  *Description:* Explore foundational quantum mechanics, qubits, and superposition with intuitive interactive visual diagrams.
* **Page 2:** `Quantum Gate Visualizer — 3D Bloch Sphere | QYNX`  
  *Description:* Interactive 3D Bloch sphere visualization simulating single-qubit unitary transformations for X, Y, Z, H, S, and T gates.
* **Page 3:** `Quantum Expo Lab — Structured Protocols | QYNX`  
  *Description:* Execute sequential quantum protocols, observe projective measurement collapse, and analyze multi-shot probability histograms.
* **Page 4:** `Quantum Entanglement Simulator — Bell States | QYNX`  
  *Description:* Synthesize two-qubit entangled Bell states and observe instantaneous non-classical correlation collapse in real time.
* **Page 5:** `Quantum Circuit Builder — Multi-Qubit Simulation | QYNX`  
  *Description:* Construct, validate, and simulate multi-qubit quantum circuits using desktop drag-and-drop or mobile tap-to-place workflows.

## 3. Social & Open Graph Metadata
* **`og:title` & `og:description`:** Dynamically inherit from route metadata.
* **`og:image`:** 1200×630px WebP/PNG preview featuring the high-contrast QYNX Purple aesthetic and Bloch sphere vector.
* **`og:site_name`:** `QYNX`
* **Twitter Cards:** `summary_large_image` format with `twitter:title` and `twitter:image`.

## 4. Web Manifest & Favicon Specification
* **Favicon (`favicon.ico`):** Multi-resolution (16×16, 32×32, 48×48px) ICO.
* **SVG Favicon (`qynx-icon.svg`):** Vector glyph with high-contrast `#8A3FFC` dot for modern browser tabs.
* **Apple Touch Icon (`apple-touch-icon.png`):** 180×180px PNG with `#1C0F30` background.
* **Web Manifest (`site.webmanifest`):**
  * `name`: QYNX — Quantum Computing Simulation
  * `short_name`: QYNX
  * `theme_color`: `#1C0F30` (Purple 100)
  * `background_color`: `#1C0F30` (Purple 100)
  * `display`: `standalone`

## 5. Browser Compatibility & Fallbacks
* Modern evergreen browsers: Chromium (Chrome, Edge, Brave) $\ge$ v100, Firefox $\ge$ v100, Safari (macOS & iOS) $\ge$ v15.4.
* ECMAScript target: ES2022.
* WebGL 2.0 required for 3D Bloch sphere view; provide accessible SVG orthographic 2D fallback for disabled WebGL contexts.

## 6. Performance Budgets
* **First Contentful Paint (FCP):** $< 1.2\text{s}$ on 4G fast network simulation.
* **Largest Contentful Paint (LCP):** $< 2.0\text{s}$ (3D canvas chunk deferred, core UI renders immediately).
* **Cumulative Layout Shift (CLS):** $< 0.05$ (reserved canvas and card aspect ratios).
* **Interaction to Next Paint (INP):** $< 100\text{ms}$ on gate button dispatch and circuit placement.
* **Initial Gzipped JS Bundle:** $< 200\text{KB}$ (Three.js isolated to separate lazy chunk).

## 7. Asset Optimization & Hygiene
* Zero external unminified assets; SVGs optimized via SVGO with precision=2.
* Dynamic import of 3D canvas only when mounting Page 2 (`Quantum Gate Visualizer`).
* Zero ambient particle swarms, canvas noise generators, or CPU-intensive continuous blur loops.

## 8. Caching & HTTP Headers
* **Static Assets:** `Cache-Control: public, max-age=31536000, immutable` on hashed build chunks.
* **HTML Document:** `Cache-Control: no-cache` on `index.html`.
* **Security Headers:** `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`.

## 9. Error Handling & Diagnostics
* Catch-all React Error Boundary displaying structured 3-part diagnostic:
  1. What happened.
  2. Why it occurred.
  3. Actionable remediation button ("Reset Simulation State").
* 404 handler restoring active route to `/` without page refresh.

## 10. Accessibility Standards (WCAG 2.1 AA)
* `prefers-reduced-motion`: Instantly snaps Bloch sphere state vectors without SLERP transition, disables pulse animations.
* Visible focus indicators (`:focus-visible`): 2px solid `#BE95FF` with 2px offset.
* Screen reader live region: `#qynx-live-announcer` triggers on every quantum state mutation.

## 11. Production Release Gates
* Passing Vitest test suite (100% mathematical engine coverage).
* Lighthouse score $\ge 90$ across Performance, Accessibility, Best Practices, and SEO.
* Zero console warnings or errors in minified production build.
