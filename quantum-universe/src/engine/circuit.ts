import { CircuitDefinition, CircuitResult, StateVector2Q } from '@types/quantum';
import { createZeroState, createTwoQubitZeroState } from './qubit';
import { applyGate } from './gates';
import { applyGateToQubit, applyCNOT, applySWAP } from './multiQubit';
import { measureMultiShot, measureMultiShot2Q, getProbabilities1Q, getProbabilities2Q } from './measurement';

/**
 * Execute a quantum circuit.
 * - Sorts gates by column.
 * - Evaluates state column by column.
 * - Performs measurement at the end.
 */
export function executeCircuit(definition: CircuitDefinition): CircuitResult {
  const { qubits, gates, shots = 1024 } = definition;

  // Initialize state based on qubit count
  // For Quantum Universe, we only support 1 or 2 qubits in the circuit builder
  if (qubits !== 1 && qubits !== 2) {
    return {
      finalState: [],
      probabilities: {},
      error: 'Only 1 and 2 qubit circuits are supported in this simulation.'
    };
  }

  // Deep clone gates and sort them by column
  const sortedGates = [...gates].sort((a, b) => a.column - b.column);

  let state1Q = qubits === 1 ? createZeroState() : undefined;
  let state2Q = qubits === 2 ? createTwoQubitZeroState() : undefined;

  // Apply gates sequentially
  try {
    for (const gate of sortedGates) {
      if (qubits === 1) {
        if (gate.type === 'CNOT' || gate.type === 'SWAP') {
          throw new Error(`Gate ${gate.type} requires 2 qubits.`);
        }
        if (typeof gate.wire !== 'number') {
           throw new Error(`Invalid wire for single qubit gate`);
        }
        state1Q = applyGate(state1Q!, gate.type);
      } else {
        // 2 Qubits
        if (gate.type === 'CNOT') {
          if (!Array.isArray(gate.wire) || gate.wire.length !== 2) {
            throw new Error(`CNOT requires an array of 2 wires [control, target].`);
          }
          state2Q = applyCNOT(state2Q!, gate.wire[0], gate.wire[1]);
        } else if (gate.type === 'SWAP') {
          state2Q = applySWAP(state2Q!);
        } else {
          // Single qubit gate applied to one of the wires
          if (typeof gate.wire !== 'number') {
            throw new Error(`Invalid wire for single qubit gate`);
          }
          state2Q = applyGateToQubit(state2Q!, gate.type, gate.wire);
        }
      }
    }
  } catch (err: any) {
    return {
      finalState: [],
      probabilities: {},
      error: err.message
    };
  }

  // Measurement and Final Probabilities
  let measurements: Record<string, number>;
  let probs: Record<string, number>;

  if (qubits === 1) {
    measurements = measureMultiShot(state1Q!, shots);
    const rawProbs = getProbabilities1Q(state1Q!);
    probs = { '0': rawProbs.p0, '1': rawProbs.p1 };
    return {
      finalState: state1Q!,
      probabilities: probs,
      measurements
    };
  } else {
    measurements = measureMultiShot2Q(state2Q!, shots);
    const rawProbs = getProbabilities2Q(state2Q!);
    probs = { 
      '00': rawProbs.p00, 
      '01': rawProbs.p01, 
      '10': rawProbs.p10, 
      '11': rawProbs.p11 
    };
    return {
      finalState: state2Q!,
      probabilities: probs,
      measurements
    };
  }
}
