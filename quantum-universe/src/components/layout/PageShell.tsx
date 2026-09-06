import React from 'react';
import { Navigation } from './Navigation';
import { motion } from 'framer-motion';

interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          flex: 1,
          marginTop: '64px', // Offset for fixed nav
          padding: 'var(--space-8) var(--space-6)',
          width: '100%',
          maxWidth: '1280px',
          margin: '64px auto 0 auto', // Center horizontally
        }}
      >
        {children}
      </motion.main>
    </div>
  );
};
