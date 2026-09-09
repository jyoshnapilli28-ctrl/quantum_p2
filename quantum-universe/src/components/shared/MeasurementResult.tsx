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
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        background: 'var(--color-purple-20, #E8DAFF)',
        borderRadius: 'var(--radius-md, 6px)',
        border: '1px solid var(--border-default, #D4BBFF)',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--text-primary, #181126)',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-body)',
        fontWeight: 700,
      }}
    >
      Result: |{outcome}⟩
    </motion.div>
  );
};
