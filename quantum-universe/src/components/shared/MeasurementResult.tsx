import React from 'react';
import { motion } from 'framer-motion';

interface MeasurementResultProps {
  outcome: string | null;
  className?: string;
}

export const MeasurementResult: React.FC<MeasurementResultProps> = ({ outcome, className = '' }) => {
  if (!outcome) return null;

  return (
    <motion.div
      className={`measurement-result ${className}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-4) var(--space-6)',
        background: 'var(--gradient-accent)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-icicle)',
        boxShadow: 'var(--shadow-md)',
        color: 'var(--color-white)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-h3)',
        fontWeight: 700,
      }}
    >
      Result: |{outcome}⟩
    </motion.div>
  );
};
