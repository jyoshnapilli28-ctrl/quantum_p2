import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAssetUrl } from '../utils/assetPath';

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
        minHeight: '50vh',
        textAlign: 'center',
        padding: 'var(--space-8)'
      }}
    >
      <img 
        src={getAssetUrl('assets/images/illustrations/system/page-not-found.svg?v=2')} 
        alt="404 Not Found"
        style={{ width: '320px', maxWidth: '85%', marginBottom: 'var(--space-6)', display: 'block' }}
      />
      
      <h1 style={{ fontSize: 'var(--text-h1)', marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)' }}>
        State Not Found
      </h1>
      
      <p style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary, #4D3E6B)', maxWidth: '440px', marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
        The state you requested does not exist in this Hilbert space.
      </p>
      
      <Link to="/" className="qynx-btn" style={{ padding: '10px 24px' }}>
        Return to Overview
      </Link>
    </motion.div>
  );
};
