import type { StateVector1Q, StateVector2Q } from \'@types/quantum\';
import { fromReal } from './math/complex';

const ONE = fromReal(1);
const ZERO = fromReal(0);
const INV_SQRT2 = fromReal(1 / Math.SQRT2);

/** |0⟩ = [1, 0]^T */
export function createZeroState(): StateVector1Q {
  return [ONE, ZERO];
}

/** |1⟩ = [0, 1]^T */
export function createOneState(): StateVector1Q {
  return [ZERO, ONE];
}

/** |+⟩ = [1/√2, 1/√2]^T */
export function createPlusState(): StateVector1Q {
  return [INV_SQRT2, INV_SQRT2];
}

/** |-⟩ = [1/√2, -1/√2]^T */
export function createMinusState(): StateVector1Q {
  return [INV_SQRT2, fromReal(-1 / Math.SQRT2)];
}

/** |00⟩ = [1, 0, 0, 0]^T */
export function createTwoQubitZeroState(): StateVector2Q {
  return [ONE, ZERO, ZERO, ZERO];
}
