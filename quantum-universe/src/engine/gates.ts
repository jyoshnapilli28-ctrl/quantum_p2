import type { StateVector1Q, SingleQubitGateId, Matrix2x2 } from \'@types/quantum\';
import { fromReal, fromImaginary } from './math/complex';
import { applyMatrix2x2 } from './math/matrix';
import { normalize } from './math/vector';

const INV_SQRT2 = 1 / Math.SQRT2;

export const GATE_MATRICES: Record<SingleQubitGateId, Matrix2x2> = {
  'X': [
    [fromReal(0), fromReal(1)],
    [fromReal(1), fromReal(0)]
  ],
  'Y': [
    [fromReal(0), fromImaginary(-1)],
    [fromImaginary(1), fromReal(0)]
  ],
  'Z': [
    [fromReal(1), fromReal(0)],
    [fromReal(0), fromReal(-1)]
  ],
  'H': [
    [fromReal(INV_SQRT2), fromReal(INV_SQRT2)],
    [fromReal(INV_SQRT2), fromReal(-INV_SQRT2)]
  ],
  'S': [
    [fromReal(1), fromReal(0)],
    [fromReal(0), fromImaginary(1)]
  ],
  'T': [
    [fromReal(1), fromReal(0)],
    [fromReal(INV_SQRT2), fromImaginary(INV_SQRT2)] // e^(i*pi/4) = cos(pi/4) + i*sin(pi/4) = 1/sqrt(2) + i/sqrt(2)
  ]
};

/**
 * Apply a single qubit gate to a state vector.
 * Note: always normalize after to prevent floating point drift.
 */
export function applyGate(state: StateVector1Q, gateId: SingleQubitGateId): StateVector1Q {
  const matrix = GATE_MATRICES[gateId];
  if (!matrix) {
    throw new Error(`Unknown single qubit gate: ${gateId}`);
  }
  const result = applyMatrix2x2(matrix, state);
  return normalize(result) as StateVector1Q;
}
