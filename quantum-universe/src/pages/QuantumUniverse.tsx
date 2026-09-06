import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EducationalSection } from '../components/quantum-universe/EducationalSection';
import { DiracNotation } from '../components/shared/DiracNotation';
import { ProbabilityBar } from '../components/shared/ProbabilityBar';
import { GateButton } from '../components/shared/GateButton';
import { Icon } from '../components/shared/Icon';
import { applyGate, createZeroState, measureSingle, getProbabilities1Q, applyCNOT, createTwoQubitZeroState, applyGateToQubit, getProbabilities2Q } from '@engine/index';
import { Link } from 'react-router-dom';

export const QuantumUniverse: React.FC = () => {
  // Demo 1 State (Classical Bit vs Qubit)
  const [isBitOne, setIsBitOne] = useState(false);
  const [qubitProb, setQubitProb] = useState(0.5);

  // Demo 2 State (Superposition)
  const [demo2State, setDemo2State] = useState(createZeroState());
  const [demo2Measurement, setDemo2Measurement] = useState<string | null>(null);

  const handleDemo2Gate = () => {
    setDemo2State(applyGate(demo2State, 'H'));
    setDemo2Measurement(null);
  };
  const handleDemo2Measure = () => {
    const { outcome, collapsedState } = measureSingle(demo2State);
    setDemo2Measurement(outcome);
    setDemo2State(collapsedState);
  };

  // Demo 3 State (Measurement Slider)
  const [demo3AlphaSq, setDemo3AlphaSq] = useState(0.85);

  // Demo 4 State (Gates)
  const [demo4State, setDemo4State] = useState(createZeroState());

  // Demo 5 State (Entanglement)
  const [demo5State, setDemo5State] = useState(createTwoQubitZeroState());
  const [demo5Entangled, setDemo5Entangled] = useState(false);
  
  const handleDemo5Create = () => {
    let s = createTwoQubitZeroState();
    s = applyGateToQubit(s, 'H', 0);
    s = applyCNOT(s, 0, 1);
    setDemo5State(s);
    setDemo5Entangled(true);
  };
  const handleDemo5Reset = () => {
    setDemo5State(createTwoQubitZeroState());
    setDemo5Entangled(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-container"
    >
      {/* Hero Section */}
      <div style={{ textAlign: 'center', margin: '15vh 0 20vh 0', position: 'relative', zIndex: 10 }}>
        <h1 className="animate-slide-up" style={{ fontSize: 'var(--text-display)', marginBottom: 'var(--space-6)', letterSpacing: '-1px' }}>
          Welcome to the <span style={{ color: 'var(--color-icicle)' }}>Quantum Universe</span>
        </h1>
        <p className="animate-slide-up" style={{ animationDelay: '100ms', fontSize: 'var(--text-h3)', color: 'var(--color-arctic)', maxWidth: '700px', margin: '0 auto var(--space-12) auto', fontWeight: 400 }}>
          An interactive laboratory to explore the counter-intuitive and powerful principles of quantum computing.
        </p>
        
        <div className="animate-slide-up" style={{ animationDelay: '200ms', display: 'flex', gap: 'var(--space-6)', justifyContent: 'center' }}>
          <Link to="/gate-visualizer" style={{
            padding: 'var(--space-4) var(--space-8)',
            background: 'var(--gradient-gate-button)',
            border: '1px solid var(--color-icicle)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-white)',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 20px rgba(68, 105, 131, 0.4)'
          }}>
            Enter the Lab
          </Link>
          <a href="#learn" style={{
            padding: 'var(--space-4) var(--space-8)',
            background: 'transparent',
            border: '1px solid var(--color-polar)',
            borderRadius: 'var(--radius-lg)',
            color: 'var(--color-white)',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
          }}>
            Learn the Basics
          </a>
        </div>
      </div>

      <div id="learn">
        {/* Section 1: Bits vs Qubits */}
        <EducationalSection
          title="1. Classical Bits vs. Qubits"
          illustrationSrc="/assets/images/illustrations/quantum-universe/sec1-qubit.svg"
          description={
            <>
              <p style={{ marginBottom: '1rem' }}>Classical computers use bits, which must be exactly 0 or exactly 1. There is no in-between.</p>
              <p>Quantum computers use qubits. A qubit can exist in a state of 0, 1, or any probabilistic combination of both simultaneously.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-white)' }}>Classical Bit</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <button 
                    onClick={() => setIsBitOne(!isBitOne)}
                    style={{ padding: '8px 16px', background: 'var(--color-polar)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Toggle Bit
                  </button>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'white' }}>
                    {isBitOne ? '1' : '0'}
                  </span>
                </div>
              </div>
              <div style={{ borderTop: '1px solid var(--color-solstice)', paddingTop: 'var(--space-6)' }}>
                <h4 style={{ marginBottom: 'var(--space-4)', color: 'var(--color-white)' }}>Quantum Bit (Qubit)</h4>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={qubitProb} 
                  onChange={(e) => setQubitProb(parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '1rem' }}
                />
                <ProbabilityBar label="|0⟩" probability={qubitProb} />
                <div style={{ height: '8px' }} />
                <ProbabilityBar label="|1⟩" probability={1 - qubitProb} colorBasis="1" />
              </div>
            </div>
          }
        />

        {/* Section 2: Superposition */}
        <EducationalSection
          title="2. Superposition"
          illustrationSrc="/assets/images/illustrations/quantum-universe/sec2-superposition.svg"
          reversed
          description={
            <>
              <p style={{ marginBottom: '1rem' }}>Superposition is the ability of a quantum system to be in multiple states at the same time until it is measured.</p>
              <p>Applying a Hadamard (H) gate to a |0⟩ state puts it into a perfect 50/50 superposition, denoted as |+⟩.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center' }}>
              <DiracNotation stateLabel={demo2Measurement ? `|${demo2Measurement}⟩` : (demo2State[0].re === 1 ? '|0⟩' : '|+⟩')} size="xl" />
              <div style={{ width: '100%' }}>
                <ProbabilityBar label="|0⟩" probability={getProbabilities1Q(demo2State).p0} />
                <div style={{ height: '8px' }} />
                <ProbabilityBar label="|1⟩" probability={getProbabilities1Q(demo2State).p1} colorBasis="1" />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                <GateButton gateId="H" onClick={handleDemo2Gate} />
                <button 
                  onClick={handleDemo2Measure}
                  style={{ padding: '0 24px', background: 'var(--color-solstice)', border: '1px solid var(--color-icicle)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Measure
                </button>
                <button 
                  onClick={() => { setDemo2State(createZeroState()); setDemo2Measurement(null); }}
                  style={{ padding: '0 16px', background: 'transparent', border: 'none', color: 'var(--color-arctic)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Reset
                </button>
              </div>
            </div>
          }
        />

        {/* Section 3: Measurement */}
        <EducationalSection
          title="3. The Observer Effect (Measurement)"
          illustrationSrc="/assets/images/illustrations/quantum-universe/sec3-measurement.svg"
          description={
            <>
              <p style={{ marginBottom: '1rem' }}>When a quantum state is measured, its superposition collapses into one of the definite classical states (0 or 1).</p>
              <p>The probability of collapsing to 0 or 1 is determined by the state vector's amplitudes. Once measured, the state stays classical until further quantum operations are applied.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <p style={{ color: 'var(--color-arctic)' }}>Adjust the probabilities and imagine rolling a weighted quantum die.</p>
              <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={demo3AlphaSq} 
                  onChange={(e) => setDemo3AlphaSq(parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-white)' }}>P(0) = {Math.round(demo3AlphaSq * 100)}%</span>
                <span style={{ color: 'var(--color-white)' }}>P(1) = {Math.round((1 - demo3AlphaSq) * 100)}%</span>
              </div>
              <button 
                onClick={() => {
                  const result = Math.random() < demo3AlphaSq ? '0' : '1';
                  alert(`State collapsed to |${result}⟩`);
                }}
                style={{ padding: '12px 24px', background: 'var(--gradient-gate-button)', border: '1px solid var(--color-icicle)', color: 'white', borderRadius: '8px', cursor: 'pointer', width: '100%', marginTop: '1rem' }}
              >
                Simulate Measurement
              </button>
            </div>
          }
        />

        {/* Section 4: Quantum Gates */}
        <EducationalSection
          title="4. Quantum Logic Gates"
          illustrationSrc="/assets/images/illustrations/quantum-universe/sec4-gates.svg"
          reversed
          description={
            <>
              <p style={{ marginBottom: '1rem' }}>Classical logic gates (AND, OR, NOT) operate on classical bits.</p>
              <p>Quantum gates are unitary matrices that rotate the state vector around the Bloch sphere without collapsing it.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', alignItems: 'center' }}>
              <DiracNotation stateLabel={
                demo4State[0].re === 1 ? '|0⟩' : 
                demo4State[1].re === 1 ? '|1⟩' : 
                Math.abs(demo4State[0].re - 0.707) < 0.1 && demo4State[1].re > 0 ? '|+⟩' :
                Math.abs(demo4State[0].re - 0.707) < 0.1 && demo4State[1].re < 0 ? '|-⟩' : '|ψ⟩'
              } size="xl" />
              
              <div style={{ width: '100%' }}>
                <ProbabilityBar label="|0⟩" probability={getProbabilities1Q(demo4State).p0} />
                <div style={{ height: '8px' }} />
                <ProbabilityBar label="|1⟩" probability={getProbabilities1Q(demo4State).p1} colorBasis="1" />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
                {(['X', 'Y', 'Z', 'H'] as const).map(gate => (
                  <GateButton key={gate} gateId={gate} onClick={() => setDemo4State(applyGate(demo4State, gate))} />
                ))}
              </div>
              <button 
                  onClick={() => setDemo4State(createZeroState())}
                  style={{ marginTop: '1rem', background: 'transparent', border: 'none', color: 'var(--color-arctic)', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Reset to |0⟩
                </button>
            </div>
          }
        />

        {/* Section 5: Entanglement */}
        <EducationalSection
          title="5. Quantum Entanglement"
          illustrationSrc="/assets/images/illustrations/quantum-universe/sec5-entanglement.svg"
          description={
            <>
              <p style={{ marginBottom: '1rem' }}>When qubits become entangled, their states are mathematically linked. Measuring one instantly determines the state of the other, no matter the distance between them.</p>
              <p>Albert Einstein famously called this "spooky action at a distance."</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--color-arctic)', marginBottom: '0.5rem' }}>Qubit A</h4>
                  <Icon category="core" name="qubit-0" size={48} className={demo5Entangled ? 'animate-pulse' : ''} />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--color-arctic)', marginBottom: '0.5rem' }}>Qubit B</h4>
                  <Icon category="core" name="qubit-1" size={48} className={demo5Entangled ? 'animate-pulse' : ''} />
                </div>
              </div>
              
              {demo5Entangled && (
                <div style={{ textAlign: 'center', color: 'var(--color-icicle)', fontWeight: 'bold' }} className="animate-fade-in">
                  ENTANGLED (Bell State)
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                <button 
                  onClick={handleDemo5Create}
                  disabled={demo5Entangled}
                  style={{ flex: 1, padding: '12px', background: demo5Entangled ? 'var(--color-midnight)' : 'var(--gradient-gate-button)', border: '1px solid var(--color-icicle)', color: demo5Entangled ? 'var(--color-polar)' : 'white', borderRadius: '8px', cursor: demo5Entangled ? 'not-allowed' : 'pointer' }}
                >
                  Create Bell State (H + CNOT)
                </button>
                <button 
                  onClick={handleDemo5Reset}
                  style={{ padding: '12px', background: 'transparent', border: '1px solid var(--color-polar)', color: 'var(--color-white)', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Reset
                </button>
              </div>

              {demo5Entangled && (
                <div className="animate-slide-up">
                  <ProbabilityBar label="|00⟩" probability={getProbabilities2Q(demo5State).p00} />
                  <div style={{ height: '4px' }} />
                  <ProbabilityBar label="|11⟩" probability={getProbabilities2Q(demo5State).p11} colorBasis="1" />
                </div>
              )}
            </div>
          }
        />

        {/* Section 6: Circuits */}
        <EducationalSection
          title="6. Quantum Circuits"
          illustrationSrc="/assets/images/illustrations/quantum-universe/sec6-circuit.svg"
          reversed
          description={
            <>
              <p style={{ marginBottom: '1rem' }}>Algorithms are built by wiring qubits and gates together into quantum circuits.</p>
              <p>Just like sheet music, time flows from left to right. Qubits are initialized on the left, gates are applied in sequence, and measurements are read on the right.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-8)' }}>
               <img src="/assets/images/illustrations/circuit-builder/circuit-canvas-bg.svg" alt="Circuit diagram example" style={{ width: '100%', borderRadius: '8px' }} />
               <Link to="/circuit-builder" style={{
                  padding: 'var(--space-3) var(--space-6)',
                  background: 'var(--color-solstice)',
                  border: '1px solid var(--color-icicle)',
                  borderRadius: 'var(--radius-lg)',
                  color: 'var(--color-white)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}>
                  Try the Circuit Builder →
               </Link>
            </div>
          }
        />
      </div>

    </motion.div>
  );
};
