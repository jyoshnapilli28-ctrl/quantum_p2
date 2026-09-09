/**
 * QYNX Master Animation Configuration
 * Centralized timing, easings, spring physics, and reduced-motion utilities.
 * All animations throughout the application must reference this single source of truth.
 */

export const animationConfig = {
  // Duration in milliseconds
  durations: {
    micro: 180,           // Micro-interactions (hover, active press)
    button: 180,          // Button transitions
    card: 250,            // Card hover elevation and subtle border highlight
    gateActivation: 320,  // Gate button pulse on click
    stateTransition: 600, // Quantum state mathematical transition
    blochTransition: 600, // Three.js Bloch vector spherical interpolation
    pageReveal: 600,      // Viewport initial entry animation
    pageTransition: 350,  // Route exit/enter cross-fade
    circuitStep: 450,     // Time spent at each circuit column during execution
    scrollReveal: 600,    // IntersectionObserver scroll reveal
    pulse: 1800,          // Ambient quantum correlation pulse cycle
    loadingOrbit: 12000,  // Slow ambient orbital drift
  },

  // Cubic-bezier easing curves and Framer Motion easing arrays
  easings: {
    // Premium deceleration curve for content entry
    smoothOut: [0.16, 1, 0.3, 1] as [number, number, number, number],
    // Balanced S-curve for state transitions and camera moves
    easeInOut: [0.4, 0, 0.2, 1] as [number, number, number, number],
    // Swift snappy response for micro-interactions
    quickOut: [0.22, 1, 0.36, 1] as [number, number, number, number],
    // Linear for steady rotational drift
    linear: 'linear' as const,
  },

  // Physics spring configurations for UI elements
  springs: {
    snappy: { stiffness: 420, damping: 28, mass: 0.8 },
    gentle: { stiffness: 220, damping: 22, mass: 1 },
    bouncyCursor: { stiffness: 350, damping: 25 },
  },

  // Color tokens for animated states (QYNX Purple Scale)
  colors: {
    accentPrimary: '#8A3FFC',   // Purple 60
    accentSecondary: '#BE95FF', // Purple 40
    accentLight: '#E8DAFF',     // Purple 20
    darkSurface: '#31135E',     // Purple 90
    darkCanvas: '#1C0F30',      // Purple 100
    borderMuted: '#491D8B',     // Purple 80
    borderHighlight: '#6929C4', // Purple 70
    white: '#FFFFFF',
  }
} as const;

export type AnimationConfig = typeof animationConfig;
