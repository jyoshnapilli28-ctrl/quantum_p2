# 3D BLOCH SPHERE — SPECIFICATION

---

## 1. Purpose

The Bloch sphere is the **primary visual identity** of the Quantum Gate Visualizer (Page 2). It is a real interactive 3D visualization implemented with Three.js via React Three Fiber.

The Bloch sphere represents the state of a single qubit as a vector pointing from the center of a unit sphere to a point on its surface. Different quantum states correspond to different directions.

---

## 2. Visual Design Direction

The Bloch sphere must **not** look like a basic wireframe sphere.

Target aesthetic:
```
FROSTED GLASS + 3D SCIENTIFIC VISUALIZATION + DEEP BLUE ATMOSPHERE
```

**Required visual properties:**
- Soft blue atmospheric lighting (ambient + directional)
- Translucent/glass-like spherical surface (partially transparent, shows depth)
- Smooth 3D shading (physically-based material, not flat)
- Thin quantum axes (X, Y, Z lines through the sphere)
- Clean coordinate labels (|0⟩, |1⟩, +X, -X, +Y, -Y)
- Visible state vector (a glowing arrow from center to state point)
- Glowing state point (sphere or dot at the tip of the state vector)
- Subtle latitude/longitude guide circles (meridians and equator)
- Controlled reflections (minimal, not distracting)
- Soft gradient on the sphere surface

---

## 3. Technical Implementation

**Library stack:**
- Three.js r165+
- @react-three/fiber v8 (React renderer for Three.js)
- @react-three/drei v9 (helpers: OrbitControls, Text, Html, Line)

**Component:** `src/visualization/bloch/BlochScene.ts` (Three.js scene setup) + `src/components/bloch/BlochSphere.tsx` (React wrapper)

---

## 4. Scene Setup

### 4.1 Canvas and Camera

```
Canvas:
  background: transparent (CSS background of parent panel applies)
  size: 420×420px (desktop), 320×320px (tablet), 280×280px (mobile)
  antialias: true
  dpr: [1, 2] (device pixel ratio, capped at 2 for performance)

Camera:
  type: PerspectiveCamera
  fov: 45
  initial position: [2.5, 1.5, 2.5] (offset from Z axis for good default view)
  near: 0.1
  far: 100
  lookAt: [0, 0, 0] (sphere center)
```

### 4.2 Lighting

```
Ambient light:
  color: #1C2B38 (Solstice — cool blue ambient)
  intensity: 0.6

Directional light 1 (primary):
  color: #7991A8 (Arctic — soft blue-white)
  intensity: 1.2
  position: [3, 5, 3]

Directional light 2 (fill):
  color: #446983 (Icicle)
  intensity: 0.4
  position: [-2, 2, -2]

Point light (accent, bottom):
  color: #0B132B (Deep Navy)
  intensity: 0.3
  position: [0, -3, 0]
```

This lighting creates the atmospheric blue-tinted scientific visualization look.

### 4.3 Controls

```
OrbitControls (from @react-three/drei):
  enableDamping: true
  dampingFactor: 0.08
  enablePan: false             (prevent panning — only rotate/zoom)
  enableZoom: true
  zoomSpeed: 0.5
  minDistance: 2.5             (prevent zooming inside sphere)
  maxDistance: 6.0             (prevent zooming too far out)
  autoRotate: false            (no auto-rotation — user-controlled)
  rotateSpeed: 0.5
```

On mobile (touch): OrbitControls handles touch events automatically (pinch to zoom, swipe to rotate).

---

## 5. Sphere Geometry and Material

### 5.1 Main Sphere

```
Geometry: SphereGeometry
  radius: 1.0
  widthSegments: 64      (smooth surface)
  heightSegments: 64

Material: MeshPhysicalMaterial
  color: #0B132B          (Deep Navy base)
  transparent: true
  opacity: 0.35           (translucent glass look)
  metalness: 0.1
  roughness: 0.05         (very smooth/glass-like)
  envMapIntensity: 0.8
  side: DoubleSide        (render both inner and outer surface)
  depthWrite: false       (correct transparency sorting)
```

### 5.2 Equator and Meridian Lines

Three great circles on the sphere surface:

```
XY equator (horizontal circle):
  Radius: 1.001 (slightly above sphere surface)
  Color: rgba(56, 80, 106, 0.5) (Polar, semi-transparent)
  Line width: 1px (CSS-equivalent in Three.js: use Line2 or LineSegments)
  Segments: 128 (smooth arc)

XZ meridian (vertical circle in XZ plane):
  Same style

YZ meridian (vertical circle in YZ plane):
  Same style
```

All three circles fade in/out smoothly (opacity animation, 500ms) when the camera reaches certain angles that would make them confusing.

### 5.3 Axes

Three axes through the sphere:

```
Z axis (|0⟩ at top, |1⟩ at bottom):
  Line from [0, 0, -1.4] to [0, 0, 1.4] (extending beyond sphere)
  Color: --color-arctic (#7991A8)
  Thickness: 1px (Line2)

X axis:
  Line from [-1.4, 0, 0] to [1.4, 0, 0]
  Color: rgba(68, 105, 131, 0.7) (Icicle, slightly dimmer)

Y axis:
  Line from [0, -1.4, 0] to [0, 1.4, 0]
  Color: rgba(68, 105, 131, 0.7)
```

### 5.4 Axis Labels

Labels at the sphere poles and equatorial points:

```
|0⟩  at [0, 0, 1.5]   (Z+ pole, top)
|1⟩  at [0, 0, -1.5]  (Z- pole, bottom)
|+⟩  at [1.5, 0, 0]   (X+ axis)
|-⟩  at [-1.5, 0, 0]  (X- axis)
|i⟩  at [0, 1.5, 0]   (Y+ axis)
|-i⟩ at [0, -1.5, 0]  (Y- axis)
```

Implementation: Use `Html` from @react-three/drei for labels (renders as CSS-positioned HTML elements in 3D space, always face the camera).

```
Label style:
  font: --font-mono, 12px, --color-arctic
  pointer-events: none
  user-select: none
  background: rgba(7,16,24,0.6)
  padding: 2px 4px
  border-radius: 3px
```

---

## 6. State Vector

The state vector is an arrow from the sphere center [0,0,0] to the current Bloch coordinates [x, y, z].

### 6.1 Vector Arrow

```
Shaft:
  Geometry: CylinderGeometry
    radiusTop: 0    (points)
    radiusBottom: 0.025
    height: length * 0.85 (85% of vector length, leaving room for arrowhead)
  Material: MeshBasicMaterial
    color: #FFFFFF (white)
    opacity: 0.9
  Position: at midpoint of vector

Arrowhead:
  Geometry: ConeGeometry
    radius: 0.06
    height: 0.15
  Material: MeshBasicMaterial
    color: #FFFFFF
  Position: at vector endpoint [x, y, z]
  Rotation: pointing in direction of vector
```

### 6.2 State Point (Glow Dot)

At the tip of the state vector, a glowing point:

```
Geometry: SphereGeometry(0.05, 16, 16)
Material: MeshBasicMaterial
  color: #FFFFFF
  transparent: false

Point light at state position:
  color: #FFFFFF
  intensity: 0.8
  distance: 0.6
  (creates soft glow around the state point)
```

---

## 7. State Vector Animation

When a gate is applied, the vector must **smoothly animate** from the previous Bloch coordinates to the new Bloch coordinates.

### 7.1 Animation Method: SLERP

Use **Spherical Linear Interpolation (SLERP)** to interpolate the state vector direction on the sphere surface.

```typescript
// In BlochAnimator.ts

function slerpVector(
  from: { x: number; y: number; z: number },
  to: { x: number; y: number; z: number },
  t: number  // t ∈ [0, 1]
): { x: number; y: number; z: number } {
  // Convert to THREE.Vector3
  const fromV = new THREE.Vector3(from.x, from.y, from.z).normalize()
  const toV   = new THREE.Vector3(to.x,   to.y,   to.z).normalize()

  // SLERP
  const result = fromV.clone().lerp(toV, t).normalize()

  return { x: result.x, y: result.y, z: result.z }
}
```

### 7.2 Animation Timeline

```
Duration: 600ms
Easing: cubic-bezier(0.4, 0, 0.2, 1) (Material Design "standard" easing)
FPS: 60 (requestAnimationFrame loop within Three.js renderer)

At t=0: vector at previousBlochCoordinates
At t=1: vector at newBlochCoordinates

At each animation frame:
  t = elapsed / 600
  t = easeInOut(t)
  current = slerpVector(from, to, t)
  update arrow shaft position and rotation
  update glow dot position
```

### 7.3 Animation Complete Callback

When animation reaches t=1:
- `BlochSphere.tsx` calls `onAnimationComplete()` prop
- Store sets `isAnimating = false`
- Gate buttons re-enable

### 7.4 Animation Rules

1. **Never interrupt a running animation.** Gate buttons are disabled during animation.
2. **Measurement collapse:** Does NOT animate. The vector snaps immediately to north or south pole. This communicates the abrupt nature of quantum measurement.
3. **Reset:** Does NOT animate. Snaps immediately to |0⟩ north pole.

---

## 8. Coordinate System Mapping

The Bloch sphere uses the following Three.js coordinate mapping:

```
|0⟩ = North Pole → Three.js: [x: 0, y: 0, z: 1]  (up)
|1⟩ = South Pole → Three.js: [x: 0, y: 0, z: -1] (down)
|+⟩ = +X         → Three.js: [x: 1, y: 0, z: 0]
|-⟩ = -X         → Three.js: [x: -1, y: 0, z: 0]
|i⟩ = +Y         → Three.js: [x: 0, y: 1, z: 0]
|-i⟩= -Y         → Three.js: [x: 0, y: -1, z: 0]
```

The quantum Bloch sphere formula uses θ (polar angle from Z+) and φ (azimuthal angle from X+). The Three.js representation maps:

```
Quantum (x, y, z) → Three.js (x, z, y) or matching convention.
```

**Important:** Verify that `getBlochCoordinates()` output maps correctly to the Three.js scene axes. The |0⟩ state vector must point UP in the rendered scene.

From `08_QUANTUM_MATHEMATICS.md`:
```
|0⟩: z=1, x=0, y=0  → Three.js y-up convention: position [0, 1, 0]
|1⟩: z=-1, x=0, y=0 → Three.js: position [0, -1, 0]
|+⟩: x=1, y=0, z=0  → Three.js: position [1, 0, 0]
```

Reconcile: The engine returns {x, y, z} in the mathematical Bloch convention. Map to Three.js as:
```
three_x = bloch_x
three_y = bloch_z    (Z-up in math = Y-up in Three.js standard)
three_z = bloch_y
```

Apply this mapping in `BlochScene.ts` before using the coordinates.

---

## 9. Performance Optimization

- **Pause render loop when idle:** Use `frameloop="demand"` on the R3F `Canvas` component. Request a new frame only when the state changes or animation is running.
- **Reduce segment counts on mobile:** On viewports < 768px: reduce sphere widthSegments from 64 to 32.
- **No continuous ambient animation when idle:** Do NOT add slowly rotating decorative elements or continuous particle effects around the Bloch sphere. Static when idle.
- **LOD (Level of Detail):** Not needed at this scale. A single 64-segment sphere is well within WebGL limits.
- **Dispose properly:** When the Gate Visualizer route unmounts, dispose of the Three.js renderer, geometry, and materials to prevent memory leaks.

```typescript
// In BlochSphere.tsx useEffect cleanup:
return () => {
  renderer.dispose()
  geometry.dispose()
  material.dispose()
}
```

---

## 10. WebGL Fallback

If WebGL is not available:

```
<div className="bloch-fallback" role="img" aria-label="Bloch sphere not available">
  <p>3D visualization requires WebGL.</p>
  <p>The state and probabilities below are still fully functional.</p>
</div>
```

The rest of the Gate Visualizer (state label, probability bars, gate buttons) must function correctly without the Bloch sphere.

Detect WebGL support:
```typescript
function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}
```

---

## 11. Accessibility

```
<Canvas aria-label="Interactive 3D Bloch sphere visualization">
```

The Canvas `aria-label` is updated whenever the state changes:
```
"Bloch sphere: qubit state |+⟩. Vector pointing toward +X axis (superposition)."
```

Below the Canvas, always render a visually hidden (but screen-reader accessible) text description:
```html
<p className="sr-only">
  Current qubit state: {stateLabel}.
  Bloch sphere coordinates: X={x.toFixed(2)}, Y={y.toFixed(2)}, Z={z.toFixed(2)}.
</p>
```

---

## 12. Mobile Responsiveness

| Screen | Canvas Size | Sphere Segments | OrbitControls |
|--------|------------|-----------------|---------------|
| Desktop >1024px | 420×420px | 64 | Full (rotate, zoom) |
| Tablet 768–1024px | 320×320px | 48 | Full |
| Mobile <768px | 280×280px | 32 | Simplified (swipe to rotate, pinch to zoom) |

On very small screens (< 360px), the Bloch sphere is hidden by default and replaced by a "Show 3D View" toggle button. This prioritizes the probability bars and gate controls.
