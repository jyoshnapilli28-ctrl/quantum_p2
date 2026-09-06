import { Complex } from '@types/quantum';
import * as C from './complex';

/**
 * Normalize a state vector so that the sum of the squared magnitudes is 1.
 */
export function normalize<T extends Complex[]>(state: T): T {
  let sumSq = 0;
  for (const c of state) {
    sumSq += C.magnitudeSquared(c);
  }

  // If the state is exactly zero (shouldn't happen in valid quantum states), return as is
  if (sumSq === 0) return state;

  const norm = Math.sqrt(sumSq);
  
  return state.map(c => ({
    re: c.re / norm,
    im: c.im / norm
  })) as T;
}

/**
 * Compute the inner product <a|b> of two vectors.
 */
export function innerProduct(a: Complex[], b: Complex[]): Complex {
  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }

  let result = { re: 0, im: 0 };
  for (let i = 0; i < a.length; i++) {
    const aConj = C.conjugate(a[i]);
    const term = C.multiply(aConj, b[i]);
    result = C.add(result, term);
  }

  return result;
}

/**
 * Compute the tensor product |a> ⊗ |b> of two vectors.
 */
export function tensorProduct(a: Complex[], b: Complex[]): Complex[] {
  const result: Complex[] = [];

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      result.push(C.multiply(a[i], b[j]));
    }
  }

  return result;
}
