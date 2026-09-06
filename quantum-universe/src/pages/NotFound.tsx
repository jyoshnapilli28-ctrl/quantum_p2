import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}
    >
      <img 
        src="/assets/images/illustrations/system/page-not-found.svg?v=2" 
        alt="404 Not Found"
        style={{ width: '400px', maxWidth: '90%', marginBottom: 'var(--space-8)' }}
      />
      
      <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-4)' }}>
        Quantum State Not Found
      </h1>
      
      <p style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-arctic)', maxWidth: '500px', marginBottom: 'var(--space-8)' }}>
        The state you're looking for doesn't exist in this Hilbert space.
      </p>
      
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button style={{
          padding: 'var(--space-4) var(--space-8)',
          background: 'var(--gradient-gate-button)',
          border: '1px solid var(--color-icicle)',
          borderRadius: 'var(--radius-lg)',
          color: 'var(--color-white)',
          fontFamily: 'var(--font-primary)',
          fontSize: 'var(--text-body)',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}>
          Return to the Observable Universe
        </button>
      </Link>
    </motion.div>
  );
};
