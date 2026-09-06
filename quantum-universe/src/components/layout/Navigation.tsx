import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Icon } from '../shared/Icon';

export const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Quantum Universe' },
    { to: '/gate-visualizer', label: 'Gate Visualizer' },
    { to: '/experiment-lab', label: 'Experiment Lab' },
    { to: '/entanglement-simulator', label: 'Entanglement Simulator' },
    { to: '/circuit-builder', label: 'Circuit Builder' },
  ];

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      background: 'var(--gradient-header)',
      borderBottom: '1px solid rgba(28, 43, 56, 0.8)', // Solstice 80%
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      zIndex: 'var(--z-navigation)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-6)',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Icon category="core" name="qubit-0" size={32} />
        <span style={{ 
          fontFamily: 'var(--font-primary)', 
          fontWeight: 700, 
          fontSize: 'var(--text-body-lg)',
          color: 'var(--color-white)',
          letterSpacing: '1px'
        }}>
          QUANTUM UNIVERSE
        </span>
      </Link>

      {/* Desktop Links */}
      <div style={{ display: 'flex', gap: 'var(--space-6)' }} className="desktop-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              fontFamily: 'var(--font-primary)',
              fontSize: 'var(--text-body-sm)',
              fontWeight: 500,
              color: isActive ? 'var(--color-white)' : 'var(--color-arctic)',
              textDecoration: 'none',
              padding: 'var(--space-2) 0',
              borderBottom: isActive ? '2px solid var(--color-icicle)' : '2px solid transparent',
              transition: 'all 0.3s ease',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Mobile Menu Toggle (simplified for now, ideally would use an icon) */}
      <div 
        className="mobile-nav-toggle"
        style={{ display: 'none', cursor: 'pointer', color: 'var(--color-white)' }}
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        Menu
      </div>

      {/* Adding a quick inline style for media query handling */}
      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
      `}</style>
    </nav>
  );
};
