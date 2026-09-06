import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface DiracNotationProps {
  stateLabel: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const DiracNotation: React.FC<DiracNotationProps> = ({ 
  stateLabel, 
  className = '',
  size = 'md' 
}) => {
  const getFontSize = () => {
    switch (size) {
      case 'sm': return 'var(--text-body-sm)';
      case 'md': return 'var(--text-mono)';
      case 'lg': return 'var(--text-mono-lg)';
      case 'xl': return 'var(--text-h2)';
      default: return 'var(--text-mono)';
    }
  };

  return (
    <div 
      className={`dirac-notation ${className}`}
      style={{
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-white)',
        fontSize: getFontSize(),
        fontWeight: 600,
        display: 'inline-block',
        position: 'relative',
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={stateLabel}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'inline-block' }}
        >
          {stateLabel}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
