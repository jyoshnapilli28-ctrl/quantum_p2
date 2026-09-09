import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useInterpolatedNumber } from '../../hooks/useInterpolatedNumber';
import { animationConfig } from '../../animations/animationConfig';

interface ProbabilityBarProps {
  label: string;
  probability: number; // 0 to 1
  colorBasis?: '0' | '1';
  className?: string;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  label,
  probability,
  colorBasis = '0',
  className = ''
}) => {
  const prefersReduced = useReducedMotion();
  const clampedProb = Math.max(0, Math.min(1, probability));
  
  // Smooth numeric counter
  const interpolatedPercentage = useInterpolatedNumber(
    clampedProb * 100,
    animationConfig.durations.stateTransition
  );

  // Solid bar fill color
  const barColor = colorBasis === '0'
    ? 'var(--color-purple-60, #8A3FFC)'
    : 'var(--color-purple-50, #A56EFF)';

  return (
    <div
      className={`probability-bar-container ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%' }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--text-primary, #181126)',
          width: '36px',
          fontWeight: 600,
        }}
      >
        {label}
      </div>

      <div
        style={{
          flex: 1,
          height: '10px',
          background: 'var(--color-purple-20, #E8DAFF)',
          borderRadius: 'var(--radius-sm, 4px)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid var(--border-default, #D4BBFF)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: barColor,
            borderRadius: '2px',
            transformOrigin: 'left',
            transform: `scaleX(${clampedProb})`,
            transition: prefersReduced
              ? 'none'
              : `transform ${animationConfig.durations.stateTransition}ms cubic-bezier(0.16, 1, 0.3, 1)`,
            willChange: 'transform',
          }}
        />
      </div>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-body-sm)',
          color: 'var(--text-primary, #181126)',
          fontWeight: 600,
          width: '52px',
          textAlign: 'right',
        }}
      >
        {interpolatedPercentage.toFixed(1)}%
      </div>
    </div>
  );
};
