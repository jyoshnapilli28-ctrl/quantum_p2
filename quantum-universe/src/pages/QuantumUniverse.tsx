import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  // Demo 3 State (Measurement Slider & Simulated Collapse)
  const [demo3AlphaSq, setDemo3AlphaSq] = useState(0.85);
  const [demo3Collapsed, setDemo3Collapsed] = useState<string | null>(null);

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
    <div className="page-container" style={{ maxWidth: '1120px', margin: '0 auto', padding: '0 var(--space-6)' }}>
      {/* Human-Designed Compact Hero Section */}
      <div style={{ textAlign: 'center', margin: '40px auto 48px auto', maxWidth: '780px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', background: 'var(--color-white, #FFFFFF)', border: '1px solid var(--border-default, #D4BBFF)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-3)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-purple-60, #8A3FFC)' }} />
          <span style={{ fontSize: 'var(--text-label)', color: 'var(--text-secondary, #4D3E6B)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
            Quantum Computing Educational Platform
          </span>
        </div>

        <h1 className="animate-slide-up" style={{ fontSize: 'var(--text-display)', marginBottom: 'var(--space-3)', color: 'var(--text-primary, #181126)', letterSpacing: '-0.5px' }}>
          Explore the Quantum Universe
        </h1>

        <p className="animate-slide-up" style={{ fontSize: 'var(--text-body-lg)', color: 'var(--text-secondary, #4D3E6B)', maxWidth: '640px', margin: '0 auto var(--space-6) auto', fontWeight: 400, lineHeight: 1.5 }}>
          An interactive laboratory to learn the foundations of quantum information science, unitary state transformations, and quantum circuit mechanics.
        </p>
        
        <div className="animate-slide-up" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/gate-visualizer"
            className="qynx-btn"
            style={{ padding: '10px 22px' }}
          >
            Launch Gate Visualizer →
          </Link>
          <a
            href="#learn"
            className="qynx-btn qynx-btn-secondary"
            style={{ padding: '10px 22px' }}
          >
            Learn Core Concepts
          </a>
        </div>
      </div>

      <div id="learn" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        {/* Section 1: Bits vs Qubits */}
        <EducationalSection
          title="1. Classical Bits vs. Qubits"
          illustrationSrc="/assets/images/illustrations/quantum-universe/bit-vs-qubit.svg"
          description={
            <>
              <p style={{ marginBottom: '0.75rem' }}>Classical computers store information in bits: binary units evaluating strictly to 0 or 1.</p>
              <p>Quantum computers utilize <strong>qubits</strong>. A qubit exists as a normalized vector |ψ⟩ = α|0⟩ + β|1⟩ in a two-dimensional complex Hilbert space, spanning a continuum of superposition states until measurement.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div>
                <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)' }}>Classical Bit</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <button 
                    className="qynx-btn qynx-btn-secondary"
                    onClick={() => setIsBitOne(!isBitOne)}
                    style={{ padding: '6px 14px', fontSize: 'var(--text-body-sm)' }}
                  >
                    Toggle Bit State
                  </button>
                  <motion.span 
                    key={isBitOne ? '1' : '0'}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', color: 'var(--text-primary, #181126)', fontWeight: 700 }}
                  >
                    {isBitOne ? '1' : '0'}
                  </motion.span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-default, #D4BBFF)', paddingTop: 'var(--space-4)' }}>
                <h4 style={{ marginBottom: 'var(--space-2)', color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)' }}>Quantum Qubit (Continuous Superposition)</h4>
                <input 
                  type="range" min="0" max="1" step="0.01" 
                  value={qubitProb} 
                  onChange={(e) => setQubitProb(parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '0.75rem', accentColor: 'var(--color-purple-60)' }}
                />
                <ProbabilityBar label="|0⟩" probability={qubitProb} />
                <div style={{ height: '6px' }} />
                <ProbabilityBar label="|1⟩" probability={1 - qubitProb} colorBasis="1" />
              </div>
            </div>
          }
        />

        {/* Section 2: Superposition */}
        <EducationalSection
          title="2. Quantum Superposition"
          illustrationSrc="/assets/images/illustrations/quantum-universe/superposition.svg"
          reversed
          description={
            <>
              <p style={{ marginBottom: '0.75rem' }}>Superposition enables a quantum system to hold linear combinations of basis states simultaneously.</p>
              <p>Applying the <strong>Hadamard (H)</strong> gate rotates a basis state |0⟩ into equal probability superposition |+⟩ = (|0⟩ + |1⟩)/√2.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
              <DiracNotation stateLabel={demo2Measurement ? `|${demo2Measurement}⟩` : (demo2State[0].re === 1 ? '|0⟩' : '|+⟩')} size="xl" />
              
              <div style={{ width: '100%' }}>
                <ProbabilityBar label="|0⟩" probability={getProbabilities1Q(demo2State).p0} />
                <div style={{ height: '6px' }} />
                <ProbabilityBar label="|1⟩" probability={getProbabilities1Q(demo2State).p1} colorBasis="1" />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)', alignItems: 'center' }}>
                <GateButton gateId="H" onClick={handleDemo2Gate} />
                <button 
                  className="qynx-btn"
                  onClick={handleDemo2Measure}
                  style={{ padding: '8px 20px' }}
                >
                  Measure Qubit
                </button>
                <button 
                  onClick={() => { setDemo2State(createZeroState()); setDemo2Measurement(null); }}
                  style={{ padding: '6px 12px', background: 'transparent', border: 'none', color: 'var(--color-purple-60, #8A3FFC)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'var(--text-body-sm)' }}
                >
                  Reset
                </button>
              </div>
            </div>
          }
        />

        {/* Section 3: Measurement */}
        <EducationalSection
          title="3. The Measurement Postulate"
          illustrationSrc="/assets/images/illustrations/quantum-universe/measurement.svg"
          description={
            <>
              <p style={{ marginBottom: '0.75rem' }}>According to the Born rule, observing a qubit irreversibly collapses its probability wave into an eigenstate |0⟩ or |1⟩ with probability |α|² and |β|² respectively.</p>
              <p>Once measured, the superposition state is completely collapsed until additional unitary operations are applied.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <p style={{ color: 'var(--text-secondary, #4D3E6B)', fontSize: 'var(--text-body-sm)' }}>Adjust basis amplitude weighting and simulate quantum projection:</p>
              <input 
                type="range" min="0" max="1" step="0.01" 
                value={demo3AlphaSq} 
                onChange={(e) => setDemo3AlphaSq(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-purple-60)' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)' }}>
                <span style={{ color: 'var(--text-primary, #181126)' }}>P(0) = {Math.round(demo3AlphaSq * 100)}%</span>
                <span style={{ color: 'var(--text-primary, #181126)' }}>P(1) = {Math.round((1 - demo3AlphaSq) * 100)}%</span>
              </div>

              <button 
                className="qynx-btn"
                onClick={() => {
                  const outcome = Math.random() < demo3AlphaSq ? '0' : '1';
                  setDemo3Collapsed(outcome);
                }}
                style={{ padding: '10px 20px', width: '100%' }}
              >
                Perform Measurement
              </button>

              <AnimatePresence mode="wait">
                {demo3Collapsed && (
                  <motion.div
                    key={demo3Collapsed}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-purple-20, #E8DAFF)',
                      border: '1px solid var(--border-default, #D4BBFF)',
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-primary, #181126)',
                      fontSize: 'var(--text-body-sm)'
                    }}
                  >
                    State collapsed into eigenstate: <strong>|{demo3Collapsed}⟩</strong>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          }
        />

        {/* Section 4: Quantum Gates */}
        <EducationalSection
          title="4. Quantum Logic Gates"
          illustrationSrc="/assets/images/illustrations/quantum-universe/quantum-gates.svg"
          reversed
          description={
            <>
              <p style={{ marginBottom: '0.75rem' }}>Unlike irreversible classical logic gates, single-qubit quantum gates are norm-preserving unitary operators (U†U = I).</p>
              <p>They execute continuous, deterministic rotations of the state vector across the surface of the Bloch sphere.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', alignItems: 'center' }}>
              <DiracNotation stateLabel={
                demo4State[0].re === 1 ? '|0⟩' : 
                demo4State[1].re === 1 ? '|1⟩' : 
                Math.abs(demo4State[0].re - 0.707) < 0.1 && demo4State[1].re > 0 ? '|+⟩' :
                Math.abs(demo4State[0].re - 0.707) < 0.1 && demo4State[1].re < 0 ? '|-⟩' : '|ψ⟩'
              } size="xl" />
              
              <div style={{ width: '100%' }}>
                <ProbabilityBar label="|0⟩" probability={getProbabilities1Q(demo4State).p0} />
                <div style={{ height: '6px' }} />
                <ProbabilityBar label="|1⟩" probability={getProbabilities1Q(demo4State).p1} colorBasis="1" />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', justifyContent: 'center' }}>
                {(['X', 'Y', 'Z', 'H'] as const).map(gate => (
                  <GateButton key={gate} gateId={gate} onClick={() => setDemo4State(applyGate(demo4State, gate))} />
                ))}
              </div>
              <button 
                onClick={() => setDemo4State(createZeroState())}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-purple-60, #8A3FFC)', cursor: 'pointer', textDecoration: 'underline', fontSize: 'var(--text-body-sm)' }}
              >
                Reset to Ground |0⟩
              </button>
            </div>
          }
        />

        {/* Section 5: Entanglement */}
        <EducationalSection
          title="5. Quantum Entanglement"
          illustrationSrc="/assets/images/illustrations/quantum-universe/entanglement.svg"
          description={
            <>
              <p style={{ marginBottom: '0.75rem' }}>When two qubits become entangled, their joint state cannot be factored independently: |ψ⟩ ≠ |q₀⟩ ⊗ |q₁⟩.</p>
              <p>Measuring one qubit instantly determines the state of the second, confirming non-local correlation.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', position: 'relative' }}>
                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)', marginBottom: '0.25rem' }}>Qubit A</h4>
                  <div style={{ borderRadius: 'var(--radius-md)', padding: '6px', background: 'var(--color-purple-20, #E8DAFF)', border: '1px solid var(--border-default, #D4BBFF)' }}>
                    <Icon category="quantum" name="qubit" size={40} />
                  </div>
                </div>

                {/* Clean Solid Correlation Link Line */}
                {demo5Entangled && (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    style={{
                      height: '2px',
                      flex: 1,
                      maxWidth: '80px',
                      background: 'var(--color-purple-60, #8A3FFC)',
                    }}
                  />
                )}

                <div style={{ textAlign: 'center' }}>
                  <h4 style={{ color: 'var(--text-primary, #181126)', fontSize: 'var(--text-body-sm)', marginBottom: '0.25rem' }}>Qubit B</h4>
                  <div style={{ borderRadius: 'var(--radius-md)', padding: '6px', background: 'var(--color-purple-20, #E8DAFF)', border: '1px solid var(--border-default, #D4BBFF)' }}>
                    <Icon category="quantum" name="two-qubits" size={40} />
                  </div>
                </div>
              </div>
              
              {demo5Entangled && (
                <div style={{ textAlign: 'center', color: 'var(--text-primary, #181126)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-body-sm)', fontWeight: 600 }}>
                  Bell State Active: |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
                </div>
              )}

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button 
                  className="qynx-btn"
                  onClick={handleDemo5Create}
                  disabled={demo5Entangled}
                  style={{ flex: 1 }}
                >
                  Create Bell State (H + CNOT)
                </button>
                <button 
                  onClick={handleDemo5Reset}
                  className="qynx-btn qynx-btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Reset
                </button>
              </div>

              {demo5Entangled && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <ProbabilityBar label="|00⟩" probability={getProbabilities2Q(demo5State).p00} />
                  <ProbabilityBar label="|11⟩" probability={getProbabilities2Q(demo5State).p11} colorBasis="1" />
                </div>
              )}
            </div>
          }
        />

        {/* Section 6: Circuits */}
        <EducationalSection
          title="6. Quantum Circuit Execution"
          illustrationSrc="/assets/images/illustrations/quantum-universe/quantum-circuit.svg"
          reversed
          description={
            <>
              <p style={{ marginBottom: '0.75rem' }}>Quantum algorithms are structured as circuit schematics where time progresses left-to-right along register wires.</p>
              <p>Explore the full interactive editor to assemble multi-qubit routines, place controlled operators, and inspect collapse histograms.</p>
            </>
          }
          interactiveDemo={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-4)' }}>
               <img 
                 src="/assets/images/illustrations/circuit-builder/circuit-builder.svg" 
                 alt="Circuit Canvas" 
                 style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default, #D4BBFF)' }} 
               />
               <Link
                  to="/circuit-builder"
                  className="qynx-btn"
                  style={{ padding: '10px 20px' }}
                >
                  Open Circuit Builder →
               </Link>
            </div>
          }
        />
      </div>
    </div>
  );
};
