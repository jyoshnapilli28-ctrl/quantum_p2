import React, { useState } from 'react';
import type { GateId } from '@types/quantum';
import { motion } from 'framer-motion';
import { animationConfig } from '../../animations/animationConfig';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface GateButtonProps {
  gateId: GateId;
  onClick: (id: GateId) => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
}

export const GateButton: React.FC<GateButtonProps> = ({
  gateId,
  onClick,
  disabled = false,
  selected = false,
  className = ''
}) => {
  const prefersReduced = useReducedMotion();
  const [isActivating, setIsActivating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsActivating(true);
    onClick(gateId);
    setTimeout(() => {
      setIsActivating(false);
    }, animationConfig.durations.gateActivation);
  };

  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '50px',
      height: '50px',
      borderRadius: 'var(--radius-md, 6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-lg)',
      fontWeight: 700,
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      position: 'relative',
      border: '1px solid',
      transition: 'background 120ms ease, border-color 120ms ease',
    };

    if (disabled) {
      base.background = 'var(--color-purple-10, #F6F2FF)';
      base.color = 'var(--color-purple-30, #D4BBFF)';
      base.borderColor = 'var(--color-purple-20, #E8DAFF)';
      return base;
    }

    if (isActivating) {
      base.background = 'var(--color-purple-70, #6929C4)';
      base.color = 'var(--color-white)';
      base.borderColor = 'var(--color-purple-70, #6929C4)';
      base.transform = prefersReduced ? 'none' : 'scale(0.97)';
      return base;
    }

    if (selected) {
      base.background = 'var(--color-purple-60, #8A3FFC)';
      base.color = 'var(--color-white)';
      base.borderColor = 'var(--color-purple-70, #6929C4)';
      base.boxShadow = 'var(--shadow-sm)';
      return base;
    }

    // Default resting state
    base.background = 'var(--color-white, #FFFFFF)';
    base.color = 'var(--text-primary, #181126)';
    base.borderColor = 'var(--border-default, #D4BBFF)';
    return base;
  };

  return (
    <motion.button
      type="button"
      className={`gate-button ${className}`}
      style={getStyles() as any}
      onClick={handleClick}
      whileHover={!disabled && !isActivating && !selected ? {
        backgroundColor: '#E8DAFF',
        borderColor: '#A56EFF',
      } : {}}
      whileTap={!disabled && !prefersReduced ? { scale: 0.96 } : {}}
    >
      {gateId}
    </motion.button>
  );
};
