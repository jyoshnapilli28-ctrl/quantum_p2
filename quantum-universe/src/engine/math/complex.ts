import type { Complex } from '@quantum-types/quantum';

/** Create a complex number from real and imaginary parts */
export function fromReal(re: number): Complex {
  return { re, im: 0 };
}

export function fromImaginary(im: number): Complex {
  return { re: 0, im };
}

/** Add two complex numbers */
export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

/** Subtract two complex numbers (a - b) */
export function subtract(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

/** Multiply two complex numbers: (a+bi)(c+di) = (ac-bd) + (ad+bc)i */
export function multiply(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

/** Get the complex conjugate: a - bi */
export function conjugate(a: Complex): Complex {
  return { re: a.re, im: -a.im };
}

/** Get the magnitude squared: a^2 + b^2 */
export function magnitudeSquared(a: Complex): number {
  return a.re * a.re + a.im * a.im;
}

/** Get the magnitude: sqrt(a^2 + b^2) */
export function magnitude(a: Complex): number {
  return Math.sqrt(magnitudeSquared(a));
}
