import type { StateVector2Q, SingleQubitGateId } from \'@types/quantum\';
import { applyGate, GATE_MATRICES } from './gates';
import { fromReal, multiply, add, subtract, magnitude } from './math/complex';
import { tensorProduct, normalize } from './math/vector';

// Note: A real quantum engine would use 4x4 matrix multiplication for all 2-qubit operations.
// For this educational UI, we implement the specific required multi-qubit logic directly.

/**
 * Apply a single-qubit gate to a specific wire in a 2-qubit state.
 * Since the states in our simulation for the Entanglement page start separable
 * and become entangled, we implement the tensor product application.
 * 
 * In a true simulation, applying U to q0 is (U ⊗ I) * state.
 * Applying U to q1 is (I ⊗ U) * state.
 */
export function applyGateToQubit(state: StateVector2Q, gateId: SingleQubitGateId, targetWire: number): StateVector2Q {
  // We'll decompose the 2Q state, apply the gate, and recombine.
  // This simplistic approach assumes separable states initially or handles the 4 amplitudes explicitly.
  
  // (U ⊗ I) matrix application:
  // [u00  u01] ⊗ [1  0] = [u00  0   u01  0  ]
  // [u10  u11]   [0  1]   [0    u00 0    u01]
  //                       [u10  0   u11  0  ]
  //                       [0    u10 0    u11]

  // For the sake of this specific app (Quantum Universe) which only does specific demos, 
  // we will build a minimal but mathematically correct logic for the 4 amplitudes.
  
  const matrix = GATE_MATRICES[gateId];
  if (!matrix) throw new Error(`Unknown gate: ${gateId}`);
  
  const [[m00, m01], [m10, m11]] = matrix;

  let result: StateVector2Q;

  if (targetWire === 0) {
    // Apply to q0 (more significant qubit in |q0 q1>)
    // new_c00 = m00*c00 + m01*c10
    // new_c01 = m00*c01 + m01*c11
    // new_c10 = m10*c00 + m11*c10
    // new_c11 = m10*c01 + m11*c11
    result = [
      add(multiply(m00, state[0]), multiply(m01, state[2])),
      add(multiply(m00, state[1]), multiply(m01, state[3])),
      add(multiply(m10, state[0]), multiply(m11, state[2])),
      add(multiply(m10, state[1]), multiply(m11, state[3])),
    ];
  } else {
    // Apply to q1
    // new_c00 = m00*c00 + m01*c01
    // new_c01 = m10*c00 + m11*c01
    // new_c10 = m00*c10 + m01*c11
    // new_c11 = m10*c10 + m11*c11
    result = [
      add(multiply(m00, state[0]), multiply(m01, state[1])),
      add(multiply(m10, state[0]), multiply(m11, state[1])),
      add(multiply(m00, state[2]), multiply(m01, state[3])),
      add(multiply(m10, state[2]), multiply(m11, state[3])),
    ];
  }

  return normalize(result) as StateVector2Q;
}

/**
 * Apply a CNOT gate.
 * If control=0, target=1: CNOT |c, t> flips t if c=1.
 * |00> -> |00> (index 0 -> 0)
 * |01> -> |01> (index 1 -> 1)
 * |10> -> |11> (index 2 -> 3)
 * |11> -> |10> (index 3 -> 2)
 */
export function applyCNOT(state: StateVector2Q, controlWire: number, targetWire: number): StateVector2Q {
  let result: StateVector2Q;
  
  if (controlWire === 0 && targetWire === 1) {
    // c00 and c01 stay the same. c10 and c11 swap.
    result = [state[0], state[1], state[3], state[2]];
  } else if (controlWire === 1 && targetWire === 0) {
    // |00> -> |00>
    // |01> -> |11>
    // |10> -> |10>
    // |11> -> |01>
    // Swaps c01 and c11
    result = [state[0], state[3], state[2], state[1]];
  } else {
    throw new Error('Invalid control/target for 2-qubit CNOT');
  }

  return normalize(result) as StateVector2Q;
}

/**
 * Apply a SWAP gate.
 * Swaps |01> and |10> amplitudes (indices 1 and 2).
 */
export function applySWAP(state: StateVector2Q): StateVector2Q {
  const result: StateVector2Q = [state[0], state[2], state[1], state[3]];
  return normalize(result) as StateVector2Q;
}

/**
 * Check if a 2-qubit state is entangled.
 * A state is entangled if c00*c11 != c01*c10
 */
export function isEntangled(state: StateVector2Q): boolean {
  // Det = c00*c11 - c01*c10
  const term1 = multiply(state[0], state[3]);
  const term2 = multiply(state[1], state[2]);
  const det = subtract(term1, term2);
  
  // If magnitude of determinant is significantly greater than 0, it's entangled
  return magnitude(det) > 1e-6;
}
