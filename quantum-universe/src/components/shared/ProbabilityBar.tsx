import React from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface ProbabilityBarProps {
  label: string;
  probability: number; // 0 to 1
  colorBasis?: '0' | '1'; // Dictates fill color
  className?: string;
}

export const ProbabilityBar: React.FC<ProbabilityBarProps> = ({
  label,
  probability,
  colorBasis = '0',
  className = ''
}) => {
  const prefersReduced = useReducedMotion();
  const percentage = Math.round(probability * 100);

  const fillGradient = colorBasis === '0' 
    ? 'linear-gradient(90deg, var(--color-polar) 0%, var(--color-arctic) 100%)'
    : 'linear-gradient(90deg, var(--color-solstice) 0%, var(--color-icicle) 100%)';

  return (
    <div 
      className={`probability-bar-container ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', width: '100%' }}
    >
      <div 
        style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-arctic)',
          width: '28px'
        }}
      >
        {label}
      </div>

      <div 
        style={{
          flex: 1,
          height: '12px',
          background: 'var(--color-midnight)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(56, 80, 106, 0.3)'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            background: fillGradient,
            borderRadius: 'var(--radius-full)',
            transformOrigin: 'left',
            transform: `scaleX(${probability})`,
            transition: prefersReduced ? 'none' : 'transform 400ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>

      <div 
        style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: 'var(--text-body-sm)',
          color: 'var(--color-white)',
          width: '40px',
          textAlign: 'right'
        }}
      >
        {percentage}%
      </div>
    </div>
  );
};
