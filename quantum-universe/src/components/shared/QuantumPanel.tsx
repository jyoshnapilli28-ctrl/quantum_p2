import React from 'react';

type PanelVariant = 'default' | 'deep' | 'highlight' | 'flat';

interface QuantumPanelProps {
  children: React.ReactNode;
  variant?: PanelVariant;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hoverable?: boolean;
}

export const QuantumPanel: React.FC<QuantumPanelProps> = ({ 
  children, 
  variant = 'default', 
  className = '',
  style,
  onClick,
  hoverable = true,
}) => {
  const getStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      borderRadius: 'var(--radius-lg, 8px)',
      position: 'relative',
    };

    switch (variant) {
      case 'default':
        styles.background = 'var(--surface-card, #FFFFFF)';
        styles.border = '1px solid var(--border-default, #D4BBFF)';
        styles.boxShadow = 'var(--shadow-sm)';
        break;
      case 'deep':
        styles.background = 'var(--surface-card-subtle, #F6F2FF)';
        styles.border = '1px solid var(--border-subtle, #E8DAFF)';
        styles.boxShadow = 'none';
        break;
      case 'highlight':
        styles.background = 'var(--surface-card-highlight, #E8DAFF)';
        styles.border = '1.5px solid var(--color-purple-60, #8A3FFC)';
        styles.boxShadow = 'var(--shadow-sm)';
        break;
      case 'flat':
        styles.background = 'var(--surface-card-subtle, #F6F2FF)';
        styles.border = '1px solid var(--border-default, #D4BBFF)';
        styles.boxShadow = 'none';
        break;
    }

    return styles;
  };

  const hoverClass = hoverable && (variant === 'default' || variant === 'highlight') ? 'qynx-card' : '';

  return (
    <div 
      className={`quantum-panel ${hoverClass} ${className}`} 
      style={{ ...getStyles(), ...style }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
