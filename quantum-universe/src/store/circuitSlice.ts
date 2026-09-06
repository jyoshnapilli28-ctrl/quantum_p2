import { StateCreator } from 'zustand';
import { CircuitDefinition, GatePlacement, CircuitResult, GateId } from '@types/quantum';
import { executeCircuit } from '@engine/index';

export type ExecutionState = 'IDLE' | 'RUNNING' | 'COMPLETED' | 'ERROR';

export interface CircuitState {
  circuitDefinition: CircuitDefinition;
  executionState: ExecutionState;
  lastResult: CircuitResult | null;
  
  addGate: (placement: GatePlacement) => void;
  removeGate: (id: string) => void;
  moveGate: (id: string, newColumn: number, newWire: number | [number, number]) => void;
  addQubit: () => void;
  removeQubit: () => void;
  runCircuit: () => void;
  clear: () => void;
  resetCircuit: () => void;
}

const initialState = {
  circuitDefinition: {
    qubits: 2, // Start with 2 qubits
    gates: [],
    shots: 1024
  },
  executionState: 'IDLE' as ExecutionState,
  lastResult: null,
};

export const createCircuitSlice: StateCreator<CircuitState> = (set, get) => ({
  ...initialState,

  addGate: (placement: GatePlacement) => {
    // Validate overlap
    const existing = get().circuitDefinition.gates.find(g => 
      g.column === placement.column && 
      (g.wire === placement.wire || 
       (Array.isArray(g.wire) && (g.wire.includes(placement.wire as number))) ||
       (Array.isArray(placement.wire) && (placement.wire.includes(g.wire as number)))
      )
    );

    if (existing) return; // Ignore if cell is occupied

    set(state => ({
      circuitDefinition: {
        ...state.circuitDefinition,
        gates: [...state.circuitDefinition.gates, placement]
      },
      executionState: 'IDLE',
      lastResult: null
    }));
  },

  removeGate: (id: string) => {
    set(state => ({
      circuitDefinition: {
        ...state.circuitDefinition,
        gates: state.circuitDefinition.gates.filter(g => g.id !== id)
      },
      executionState: 'IDLE',
      lastResult: null
    }));
  },

  moveGate: (id: string, newColumn: number, newWire: number | [number, number]) => {
    set(state => ({
      circuitDefinition: {
        ...state.circuitDefinition,
        gates: state.circuitDefinition.gates.map(g => 
          g.id === id ? { ...g, column: newColumn, wire: newWire } : g
        )
      },
      executionState: 'IDLE',
      lastResult: null
    }));
  },

  addQubit: () => {
    const { qubits } = get().circuitDefinition;
    if (qubits >= 5) return; // Limit for UI performance, though engine currently supports 2 max
    
    set(state => ({
      circuitDefinition: {
        ...state.circuitDefinition,
        qubits: state.circuitDefinition.qubits + 1
      },
      executionState: 'IDLE',
      lastResult: null
    }));
  },

  removeQubit: () => {
    const { qubits, gates } = get().circuitDefinition;
    if (qubits <= 1) return;

    // Remove any gates that were on the removed wire
    const wireToRemove = qubits - 1;
    const remainingGates = gates.filter(g => {
      if (typeof g.wire === 'number') return g.wire !== wireToRemove;
      if (Array.isArray(g.wire)) return !g.wire.includes(wireToRemove);
      return true;
    });

    set(state => ({
      circuitDefinition: {
        ...state.circuitDefinition,
        qubits: state.circuitDefinition.qubits - 1,
        gates: remainingGates
      },
      executionState: 'IDLE',
      lastResult: null
    }));
  },

  runCircuit: async () => {
    set({ executionState: 'RUNNING' });
    
    // Slight delay to allow UI to show running state
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const result = executeCircuit(get().circuitDefinition);
    
    if (result.error) {
      set({ executionState: 'ERROR', lastResult: result });
    } else {
      set({ executionState: 'COMPLETED', lastResult: result });
    }
  },

  clear: () => {
    set(state => ({
      circuitDefinition: {
        ...state.circuitDefinition,
        gates: []
      },
      executionState: 'IDLE',
      lastResult: null
    }));
  },

  resetCircuit: () => {
    set(initialState);
  }
});
