import React from 'react';
import type { GateId } from \'@types/quantum\';
import { motion } from 'framer-motion';

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
  // Styles for the button
  const getStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '52px',
      height: '52px',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-mono-lg)',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      userSelect: 'none',
      transition: 'all 0.2s ease',
      position: 'relative',
      border: '1px solid',
    };

    if (disabled) {
      base.background = 'var(--color-midnight)';
      base.color = 'var(--color-polar)';
      base.borderColor = 'rgba(56, 80, 106, 0.3)';
      return base;
    }

    if (selected) {
      base.background = 'var(--gradient-gate-button-hover)';
      base.color = 'var(--color-white)';
      base.borderColor = 'var(--color-icicle)';
      base.boxShadow = '0 0 12px rgba(68, 105, 131, 0.5)';
      return base;
    }

    // Default
    base.background = 'var(--gradient-gate-button)';
    base.color = 'var(--color-arctic)';
    base.borderColor = 'rgba(56, 80, 106, 0.5)';
    return base;
  };

  return (
    <motion.button
      className={`gate-button ${className}`}
      style={getStyles()}
      onClick={() => !disabled && onClick(gateId)}
      whileHover={!disabled ? { 
        borderColor: 'var(--color-icicle)',
        color: 'var(--color-white)',
        boxShadow: '0 0 8px rgba(68, 105, 131, 0.3)'
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onMouseEnter={(e) => {
        // We'll use the custom cursor system class later if needed
      }}
    >
      {gateId}
    </motion.button>
  );
};
