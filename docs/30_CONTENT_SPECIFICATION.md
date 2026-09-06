# 30. CONTENT SPECIFICATION

This document dictates the educational copy and conceptual flow for the 5 interactive pages of Quantum Universe. The tone must remain scientifically accurate, concise, and accessible to a curious audience.

## PAGE 1: Quantum Universe (Introduction)
* **Classical Bit vs Qubit:** A classical bit represents deterministic states—exactly 0 or exactly 1. A quantum bit (qubit) exists as a state vector in a complex vector space, allowing it to explore continuous probabilities.
* **Superposition:** The defining feature of quantum mechanics. A qubit isn't "both 0 and 1 at the same time"; rather, it exists in a linear combination of states until measured. Mathematically: `|ψ⟩ = α|0⟩ + β|1⟩`.
* **Measurement:** The act of observing a quantum system forces it to collapse into a single classical state (0 or 1). The probability of landing on a specific state is determined by the square of its amplitude (`|α|²` or `|β|²`).
* **Quantum Gates:** Unlike classical logic gates (AND, OR), quantum gates are reversible, unitary matrices that rotate a qubit's state vector around the Bloch sphere without collapsing it.
* **Entanglement:** When multiple qubits interact, their states become mathematically inseparable. Measuring one qubit instantaneously determines the state of the other, regardless of distance.
* **Quantum Circuits:** A sequence of quantum gates applied to wires (qubits), culminating in a measurement layer to extract classical data.

## PAGE 2: Quantum Gate Visualizer
* **X Gate (Pauli-X):** The quantum equivalent of a classical NOT gate. It rotates the state by π radians around the X-axis, flipping `|0⟩` to `|1⟩` and vice versa.
* **Y Gate (Pauli-Y):** Rotates the state by π around the Y-axis. It introduces a complex phase, mapping `|0⟩` to `i|1⟩`.
* **Z Gate (Pauli-Z):** A phase-flip gate. It leaves `|0⟩` unchanged but flips the sign of `|1⟩`, rotating the state by π around the Z-axis.
* **H Gate (Hadamard):** Creates superposition. It maps the computational basis states (`|0⟩`, `|1⟩`) to the equatorial superposition states (`|+⟩`, `|-⟩`), rotating around the X+Z diagonal.
* **S Gate (Phase):** A rotation of π/2 around the Z-axis. It is the square root of the Z gate and introduces a 90-degree phase shift.
* **T Gate:** A rotation of π/4 around the Z-axis. The square root of the S gate, essential for universal quantum computation.
* **Bloch Sphere & Visualization:** The Bloch sphere is a geometric representation of a pure state qubit. The north pole is `|0⟩`, the south pole is `|1⟩`, and the equator represents equal superpositions with varying phases.

## PAGE 3: Quantum Experimental Lab
* **Experiment Definitions:** Pre-configured scenarios demonstrating core quantum concepts (e.g., "The Coin Flip", "Phase Kickback").
* **Experiment Steps:** Users progress linearly. 1) Initialization 2) Gate Application 3) Evolution 4) Measurement.
* **State Changes:** Textual and visual tracking of the state vector `[α, β]` as it passes through the experiment.
* **Measurement & Results:** A visualization of the probabilistic outcome, reinforcing that quantum experiments require multi-shot execution to approximate the true probability distribution.

## PAGE 4: Quantum Entanglement Simulator
* **Two-Qubit States:** Moving beyond a single Bloch sphere. The state space expands to four dimensions (`|00⟩, |01⟩, |10⟩, |11⟩`).
* **Creating Entanglement:** Apply an H gate to Qubit 0 (creating superposition), followed by a CNOT gate controlled by Qubit 0 targeting Qubit 1.
* **The Bell State:** The resulting state `(|00⟩ + |11⟩) / √2`. The qubits are now perfectly correlated.
* **Correlated Measurement:** When Qubit 0 is measured as `0`, Qubit 1 will definitively be `0`. If Qubit 0 is `1`, Qubit 1 is definitively `1`.

## PAGE 5: Quantum Circuit Builder
* **Circuit Grid & Wires:** Horizontal lines represent individual qubits initializing at `|0⟩` and evolving through time from left to right.
* **Gate Placement:** Users construct arbitrary unitary matrices by placing single-qubit gates (X, H, Z, etc.) onto the wires.
* **Controlled Gates:** The CNOT (Controlled-NOT) gate flips the target qubit ONLY if the control qubit is in the state `|1⟩`. It creates entanglement.
* **SWAP Gate:** Exchanges the states of two qubits.
* **Execution & Results:** The mathematical engine calculates the final tensor product of the circuit and simulates multi-shot measurement to generate a classical probability histogram.
