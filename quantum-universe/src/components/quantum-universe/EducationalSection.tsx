import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { QuantumPanel } from '../shared/QuantumPanel';

interface EducationalSectionProps {
  title: string;
  illustrationSrc: string;
  description: React.ReactNode;
  interactiveDemo: React.ReactNode;
  reversed?: boolean;
}

export const EducationalSection: React.FC<EducationalSectionProps> = ({
  title,
  illustrationSrc,
  description,
  interactiveDemo,
  reversed = false
}) => {
  const ref = useScrollReveal();

  return (
    <div 
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-12)',
        marginBottom: 'var(--space-20)',
        alignItems: 'center',
        opacity: 0, // Hidden until revealed
        transform: 'translateY(20px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
      className="scroll-reveal-container"
    >
      <div style={{ order: reversed ? 2 : 1 }}>
        <h2 style={{ marginBottom: 'var(--space-6)', fontSize: 'var(--text-h2)' }}>
          {title}
        </h2>
        
        <div style={{ fontSize: 'var(--text-body-lg)', color: 'var(--color-arctic)', marginBottom: 'var(--space-8)' }}>
          {description}
        </div>

        <QuantumPanel variant="deep" className="p-6">
          <div style={{ padding: 'var(--space-6)' }}>
            {interactiveDemo}
          </div>
        </QuantumPanel>
      </div>

      <div style={{ order: reversed ? 1 : 2, display: 'flex', justifyContent: 'center' }}>
        <img 
          src={illustrationSrc} 
          alt={title} 
          style={{ width: '100%', maxWidth: '400px', filter: 'drop-shadow(var(--shadow-visualization))' }}
        />
      </div>

      {/* Internal style for the scroll reveal class */}
      <style>{`
        .scroll-reveal-container.revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media (max-width: 768px) {
          .scroll-reveal-container {
            grid-template-columns: 1fr !important;
          }
          .scroll-reveal-container > div:nth-child(2) {
            order: -1 !important; /* Image always on top on mobile */
          }
        }
      `}</style>
    </div>
  );
};
