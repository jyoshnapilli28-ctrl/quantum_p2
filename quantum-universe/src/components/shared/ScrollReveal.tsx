import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

interface ScrollRevealProps {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  threshold = 0.15,
  className = '',
  style = {}
}) => {
  const ref = useScrollReveal(threshold);

  return (
    <div ref={ref} className={`scroll-reveal-container ${className}`} style={style}>
      {children}
    </div>
  );
};
