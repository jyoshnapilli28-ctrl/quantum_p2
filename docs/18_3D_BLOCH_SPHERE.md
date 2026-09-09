# 3D BLOCH SPHERE — SPECIFICATION — QYNX

---

## 1. Purpose & Visual Identity

The **Bloch Sphere** is the central visual instrument of Page 2 (`QUANTUM GATE VISUALIZER`) within **QYNX**. It provides a real interactive 3D WebGL rendering of a single-qubit pure state vector pointing to the surface of a unit sphere ($r = 1$).

### Invariant Design Directives:
1. **Dynamic Mathematical Driver**: The visualization is strictly driven by the engine state vector $[\alpha, \beta]^T$. It is **never** a static graphic, pre-rendered video, or decorative illustration.
2. **QYNX Purple Color Scale**:
   - **Canvas Viewport**: `Purple 90 #31135E` within a `Purple 100 #1C0F30` panel.
   - **Sphere Supporting Surface**: `Purple 80 #491D8B` at $0.35$ opacity.
   - **Equatorial & Meridian Rings**: `Purple 70 #6929C4`.
   - **Orthogonal Axes ($X, Y, Z$)**: $2\text{px}$ lines in `Purple 40 #BE95FF` and `Purple 50 #A56EFF`.
   - **State Vector Arrow**: Rendered in `Purple 60 #8A3FFC` with radius $0.03$.
   - **Apex State Point & Pole Labels**: Crisp `White #FFFFFF`.
3. **Geodesic Trajectory Interpolation**: When a gate is applied, the vector animates continuously along the spherical geodesic path via Spherical Linear Interpolation (SLERP) over $600\text{ms}$.
4. **Instantaneous Measurement Collapse**: When measurement is triggered, the vector snaps immediately to $|0\rangle$ (north pole) or $|1\rangle$ (south pole) without interpolation, visually demonstrating wave-function collapse.

---

## 2. Technical Architecture & Three.js Scene Setup

- **Framework**: Three.js r165+ via `@react-three/fiber` (R3F) and `@react-three/drei`.
- **Canvas Size**: $420 \times 420\text{px}$ (desktop), $320 \times 320\text{px}$ (tablet), $280 \times 280\text{px}$ (mobile).
- **Camera Configuration**:
  - Type: `PerspectiveCamera`, FOV: $45^\circ$.
  - Initial Position: $[2.5, 1.5, 2.5]$, targeting origin $[0, 0, 0]$.
- **Lighting Model**:
  - Ambient: `Purple 80 #491D8B` (intensity $0.6$).
  - Key Directional: `Purple 20 #E8DAFF` (intensity $1.2$) positioned at $[3, 5, 3]$.
  - Fill Directional: `Purple 60 #8A3FFC` (intensity $0.4$) positioned at $[-2, 2, -2]$.

---

## 3. Coordinate System & Axis Alignment

The quantum mathematical coordinate output is mapped to Three.js world space:

$$\text{Math Polar } \theta \in [0, \pi], \quad \text{Azimuthal } \phi \in [0, 2\pi)$$
$$x = \sin\theta \cos\phi, \quad y = \sin\theta \sin\phi, \quad z = \cos\theta$$

### Three.js World Axis Mapping (Y-Up Standard):
- North Pole ($+Z$ / $|0\rangle$): Three.js $[0, 1, 0]$ (pointing vertically UP).
- South Pole ($-Z$ / $|1\rangle$): Three.js $[0, -1, 0]$ (pointing vertically DOWN).
- $+X$ Axis ($|+\rangle$): Three.js $[1, 0, 0]$ (pointing RIGHT/FORWARD).
- $-X$ Axis ($|-\rangle$): Three.js $[-1, 0, 0]$.
- $+Y$ Axis ($|+i\rangle$): Three.js $[0, 0, 1]$.
- $-Y$ Axis ($|-i\rangle$): Three.js $[0, 0, -1]$.

---

## 4. State Vector Animation Pipeline (SLERP)

```typescript
// src/visualization/bloch/TrajectoryAnimator.ts
import * as THREE from 'three';

export function slerpVector(
  from: { x: number; y: number; z: number },
  to: { x: number; y: number; z: number },
  t: number
): { x: number; y: number; z: number } {
  const vFrom = new THREE.Vector3(from.x, from.y, from.z).normalize();
  const vTo = new THREE.Vector3(to.x, to.y, to.z).normalize();

  // Quaternion spherical rotation
  const qFrom = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vFrom);
  const qTo = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), vTo);
  const qCurrent = new THREE.Quaternion().slerpQuaternions(qFrom, qTo, t);

  const currentVector = new THREE.Vector3(0, 1, 0).applyQuaternion(qCurrent);
  return { x: currentVector.x, y: currentVector.y, z: currentVector.z };
}
```

- **Duration**: $600\text{ms}$ with `cubic-bezier(0.4, 0, 0.2, 1)` easing.
- **Render Loop**: Uses `frameloop="demand"` in R3F; renders at 60 FPS only during active state transitions or user orbit interaction, pausing when idle to conserve battery and GPU resources.

---

## 5. WebGL Fallback & Accessibility

- **Fallback**: If WebGL context creation fails:
  - Displays a high-contrast 2D polar projection diagram in `Purple 80`.
  - Accessible explanation: *"3D WebGL visualization unavailable. Numerical state and probability distributions remain fully functional below."*
- **Screen Reader Announcements**:
  - The canvas container specifies `role="img"` with dynamic `aria-label`:
    `"Bloch sphere visualization: state vector at theta 90 degrees, phi 0 degrees, pointing to plus state."`
