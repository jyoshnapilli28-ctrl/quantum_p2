import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { animationConfig } from '../animations/animationConfig';

/**
 * Smoothly interpolates a numeric value from its current state to a target value using RAF.
 * E.g., probability percentage 20% -> 50% smoothly counts up/down over duration.
 */
export function useInterpolatedNumber(
  targetValue: number,
  duration: number = animationConfig.durations.stateTransition
): number {
  const prefersReduced = useReducedMotion();
  const [currentValue, setCurrentValue] = useState(targetValue);
  const animRef = useRef<number | null>(null);
  const startValRef = useRef(targetValue);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setCurrentValue(targetValue);
      startValRef.current = targetValue;
      return;
    }

    const startVal = currentValue;
    startValRef.current = startVal;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth cubic-bezier ease out: 1 - Math.pow(1 - progress, 3)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = startVal + (targetValue - startVal) * easeProgress;

      setCurrentValue(nextVal);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentValue(targetValue);
        startValRef.current = targetValue;
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetValue, duration, prefersReduced]);

  return currentValue;
}
