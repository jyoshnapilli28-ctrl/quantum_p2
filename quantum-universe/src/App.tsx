import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { PageShell } from './components/layout/PageShell';
import { QuantumPanel } from './components/shared/QuantumPanel';
import { DiracNotation } from './components/shared/DiracNotation';
import { ProbabilityBar } from './components/shared/ProbabilityBar';
import { GateButton } from './components/shared/GateButton';
import { MeasurementResult } from './components/shared/MeasurementResult';
import { BlochSphere } from './components/bloch/BlochSphere';
import { QuantumParticles } from './visualization/particles/QuantumParticles';

function App() {
  return (
    <BrowserRouter>
      <PageShell>
        <QuantumParticles />
        <h1 className="animate-fade-in" style={{ marginBottom: 'var(--space-8)' }}>
          Shared Components Test
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
          {/* Default Panel */}
          <QuantumPanel className="animate-slide-up">
            <div style={{ padding: 'var(--space-6)' }}>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Quantum Panel (Default)</h2>
              <p>This panel uses the standard glassmorphism gradient and blur.</p>
              
              <div style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)' }}>
                <GateButton gateId="H" onClick={() => {}} />
                <GateButton gateId="X" onClick={() => {}} selected />
                <GateButton gateId="Y" onClick={() => {}} disabled />
              </div>
            </div>
          </QuantumPanel>

          {/* Deep Panel */}
          <QuantumPanel variant="deep" className="animate-slide-up" style={{ animationDelay: '100ms', height: '400px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ marginBottom: 'var(--space-4)' }}>Visualization Area (Deep)</h2>
              
              <div style={{ flex: 1, position: 'relative' }}>
                <BlochSphere 
                  coordinates={{ x: 1, y: 0, z: 0 }} 
                  previousCoordinates={{ x: 0, y: 0, z: 1 }}
                  isAnimating={true}
                  onAnimationComplete={() => console.log('Animation Done')}
                />
              </div>
              
              <div style={{ marginTop: 'var(--space-6)' }}>
                <ProbabilityBar label="|0⟩" probability={0.5} />
                <div style={{ height: 'var(--space-4)' }} />
                <ProbabilityBar label="|1⟩" probability={0.5} colorBasis="1" />
              </div>
            </div>
          </QuantumPanel>
          
          <MeasurementResult outcome="0" />
        </div>
      </PageShell>
    </BrowserRouter>
  );
}

export default App;
