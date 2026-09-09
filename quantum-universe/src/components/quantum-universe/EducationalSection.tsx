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
        gap: 'var(--space-10, 40px)',
        marginBottom: 'var(--space-12, 48px)',
        alignItems: 'center',
        opacity: 0,
        transform: 'translateY(16px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
      className="scroll-reveal-container"
    >
      <div style={{ order: reversed ? 2 : 1 }}>
        <h2 style={{ marginBottom: 'var(--space-4)', fontSize: 'var(--text-h2)', color: 'var(--text-primary, #181126)' }}>
          {title}
        </h2>
        
        <div style={{ fontSize: 'var(--text-body)', color: 'var(--text-secondary, #4D3E6B)', marginBottom: 'var(--space-6)', lineHeight: 1.6 }}>
          {description}
        </div>

        <QuantumPanel variant="deep">
          <div style={{ padding: 'var(--space-5)' }}>
            {interactiveDemo}
          </div>
        </QuantumPanel>
      </div>

      <div style={{ order: reversed ? 1 : 2, display: 'flex', justifyContent: 'center' }}>
        <img 
          src={illustrationSrc} 
          alt={title} 
          style={{ width: '100%', maxWidth: '380px', display: 'block' }}
        />
      </div>

      <style>{`
        .scroll-reveal-container.revealed {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        @media (max-width: 768px) {
          .scroll-reveal-container {
            grid-template-columns: 1fr !important;
            gap: var(--space-6) !important;
          }
          .scroll-reveal-container > div:nth-child(2) {
            order: -1 !important;
          }
        }
      `}</style>
    </div>
  );
};
