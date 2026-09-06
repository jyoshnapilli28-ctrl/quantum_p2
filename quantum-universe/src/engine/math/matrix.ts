import type { Complex, Matrix2x2, StateVector1Q } from '@types/quantum';
import * as C from './complex';

/**
 * Apply a 2x2 complex matrix to a single-qubit state vector.
 * [ m00  m01 ] [ α ] = [ m00*α + m01*β ]
 * [ m10  m11 ] [ β ]   [ m10*α + m11*β ]
 */
export function applyMatrix2x2(matrix: Matrix2x2, state: StateVector1Q): StateVector1Q {
  const [alpha, beta] = state;
  const [[m00, m01], [m10, m11]] = matrix;

  const newAlpha = C.add(C.multiply(m00, alpha), C.multiply(m01, beta));
  const newBeta = C.add(C.multiply(m10, alpha), C.multiply(m11, beta));

  return [newAlpha, newBeta];
}
