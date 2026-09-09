# MULTI-QUBIT SYSTEM — SPECIFICATION — QYNX

---

## 1. Purpose & Scope

The **QYNX Multi-Qubit System** governs composite state spaces, Kronecker tensor product expansions, entangling gates ($\text{CNOT}$), and state permutation operations ($\text{SWAP}$) powering Page 4 (`QUANTUM ENTANGLEMENT SIMULATOR`) and Page 5 (`QUANTUM CIRCUIT BUILDER`).

---

## 2. Composite Hilbert Spaces & Basis Ordering

For an $N$-qubit register, the state vector $|\psi\rangle$ lives in a $2^N$-dimensional Hilbert space:
$$\mathcal{H}_{2^N} = \bigotimes_{k=0}^{N-1} \mathcal{H}_2$$

### Binary Lexicographical Basis Ordering
- **2 Qubits ($2^2 = 4$ dimensions)**:
  $$|00\rangle = \begin{bmatrix} 1 \\ 0 \\ 0 \\ 0 \end{bmatrix}, \quad |01\rangle = \begin{bmatrix} 0 \\ 1 \\ 0 \\ 0 \end{bmatrix}, \quad |10\rangle = \begin{bmatrix} 0 \\ 0 \\ 1 \\ 0 \end{bmatrix}, \quad |11\rangle = \begin{bmatrix} 0 \\ 0 \\ 0 \\ 1 \end{bmatrix}$$
- **State Vector Format**:
  $$|\psi\rangle = c_{00}|00\rangle + c_{01}|01\rangle + c_{10}|10\rangle + c_{11}|11\rangle = [c_{00}, c_{01}, c_{10}, c_{11}]^T$$

---

## 3. Kronecker Tensor Product Expansion

To apply single-qubit gate $G$ to wire 0 in a 2-qubit register:
$$U = G \otimes I_2 = \begin{bmatrix} g_{00}I_2 & g_{01}I_2 \\ g_{10}I_2 & g_{11}I_2 \end{bmatrix}$$

To apply single-qubit gate $G$ to wire 1 in a 2-qubit register:
$$U = I_2 \otimes G = \begin{bmatrix} g_{00} & g_{01} & 0 & 0 \\ g_{10} & g_{11} & 0 & 0 \\ 0 & 0 & g_{00} & g_{01} \\ 0 & 0 & g_{10} & g_{11} \end{bmatrix}$$

---

## 4. Controlled-NOT (CNOT) & SWAP Operators

### 4.1 CNOT Matrix Representation
With wire 0 as control and wire 1 as target:
$$\text{CNOT}_{0 \to 1} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{bmatrix}$$

With wire 1 as control and wire 0 as target:
$$\text{CNOT}_{1 \to 0} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \end{bmatrix}$$

### 4.2 Canonical Bell State ($|\Phi^+\rangle$)
$$\text{CNOT}_{0 \to 1} (H \otimes I_2)|00\rangle = \text{CNOT}_{0 \to 1} \left(\frac{|00\rangle + |10\rangle}{\sqrt{2}}\right) = \frac{|00\rangle + |11\rangle}{\sqrt{2}} = |\Phi^+\rangle$$

Measurement distribution: $P(00) = 0.5$, $P(11) = 0.5$, $P(01) = 0$, $P(10) = 0$.

### 4.3 SWAP Operator Matrix
$$\text{SWAP} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}$$

---

## 5. Entanglement Verification (Schmidt Rank Test)

A two-qubit state $|\psi\rangle$ is non-separable (entangled) if and only if:
$$\Delta = |c_{00}c_{11} - c_{01}c_{10}| > 10^{-10}$$

When $\Delta > 10^{-10}$, the Entanglement Simulator highlights the active non-local correlation badge styled with `Purple 60 #8A3FFC`.
