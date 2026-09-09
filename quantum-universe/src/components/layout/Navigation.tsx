import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Quantum Universe' },
    { to: '/gate-visualizer', label: 'Gate Visualizer' },
    { to: '/experiment-lab', label: 'Expo Lab' },
    { to: '/entanglement-simulator', label: 'Entanglement' },
    { to: '/circuit-builder', label: 'Circuit Builder' },
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--color-white, #FFFFFF)',
        borderBottom: '1px solid var(--border-default, #D4BBFF)',
        zIndex: 'var(--z-navigation, 100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-6)',
      }}
    >
      {/* Clean QYNX Logo & Wordmark */}
      <Link
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          textDecoration: 'none',
        }}
      >
        <img
          src="/assets/images/branding/qynx-icon.png"
          alt="QYNX"
          style={{
            width: '28px',
            height: '28px',
            objectFit: 'contain',
            display: 'block',
          }}
        />

        <span
          style={{
            fontFamily: 'var(--font-primary)',
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'var(--text-primary, #181126)',
            letterSpacing: '1px',
          }}
        >
          QYNX
        </span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: 'var(--space-6)' }} className="desktop-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              position: 'relative',
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: isActive ? 600 : 500,
              color: isActive ? 'var(--color-purple-60, #8A3FFC)' : 'var(--text-secondary, #4D3E6B)',
              textDecoration: 'none',
              padding: 'var(--space-2) 0',
              transition: 'color 150ms ease',
            })}
          >
            {({ isActive }) => (
              <>
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: 'var(--color-purple-60, #8A3FFC)',
                      borderRadius: '1px',
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        type="button"
        className="mobile-nav-toggle"
        aria-label="Toggle Navigation Menu"
        style={{
          display: 'none',
          background: 'var(--color-purple-10, #F6F2FF)',
          border: '1px solid var(--border-default, #D4BBFF)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          cursor: 'pointer',
          color: 'var(--text-primary, #181126)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-body-sm)',
        }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? '✕ Close' : '☰ Menu'}
      </button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: '60px',
              left: 0,
              right: 0,
              background: 'var(--color-white, #FFFFFF)',
              borderBottom: '1px solid var(--border-default, #D4BBFF)',
              padding: 'var(--space-4) var(--space-6)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                style={({ isActive }) => ({
                  fontFamily: 'var(--font-primary)',
                  fontSize: 'var(--text-body-sm)',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--color-purple-60, #8A3FFC)' : 'var(--text-secondary, #4D3E6B)',
                  textDecoration: 'none',
                  padding: 'var(--space-2) var(--space-3)',
                  borderLeft: isActive ? '2px solid var(--color-purple-60, #8A3FFC)' : '2px solid transparent',
                  background: isActive ? 'var(--color-purple-20, #E8DAFF)' : 'transparent',
                  borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
