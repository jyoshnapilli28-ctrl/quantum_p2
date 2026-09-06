import React from 'react';

type PanelVariant = 'default' | 'deep' | 'highlight' | 'flat';

interface QuantumPanelProps {
  children: React.ReactNode;
  variant?: PanelVariant;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const QuantumPanel: React.FC<QuantumPanelProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  style,
  onClick
}) => {
  // Inline styles using CSS variables defined in tokens.css.
  // For simplicity, we'll use inline styles using CSS variables defined in tokens.css.
  
  const getStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      borderRadius: 'var(--radius-xl)',
      transition: 'all 0.3s ease',
    };

    switch (variant) {
      case 'default':
        styles.background = 'var(--gradient-panel)';
        styles.border = '1px solid rgba(121, 145, 168, 0.1)'; // Arctic 10%
        styles.backdropFilter = 'blur(16px)';
        styles.WebkitBackdropFilter = 'blur(16px)';
        styles.boxShadow = 'var(--shadow-md)';
        break;
      case 'deep':
        styles.background = 'var(--gradient-visualization)';
        styles.border = '1px solid rgba(28, 43, 56, 0.5)'; // Solstice 50%
        styles.boxShadow = 'inset 0 4px 24px rgba(7, 16, 24, 0.5)'; // Inner shadow
        break;
      case 'highlight':
        styles.background = 'var(--gradient-panel)';
        styles.border = '1px solid var(--color-icicle)';
        styles.backdropFilter = 'blur(16px)';
        styles.WebkitBackdropFilter = 'blur(16px)';
        styles.boxShadow = '0 0 16px rgba(68, 105, 131, 0.3)'; // Icicle glow
        break;
      case 'flat':
        styles.background = 'var(--color-solstice)';
        styles.border = '1px solid transparent';
        break;
    }

    return styles;
  };

  return (
    <div 
      className={`quantum-panel ${className}`} 
      style={{ ...getStyles(), ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
