# 31. QUANTUM VALIDATION CASES — QYNX

This document defines the authoritative, deterministic validation cases utilized to verify the **QYNX Quantum Engine** before UI rendering or visual animation dispatch. All calculations must pass with a floating-point tolerance $\varepsilon = 10^{-10}$.

---

## 0. Fundamental Invariant: State Vector Normalization

For any single-qubit state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, the total probability must strictly equal unity:
$$|\alpha|^2 + |\beta|^2 = 1.0000000000 \pm 10^{-10}$$

For any two-qubit state $|\psi\rangle = c_{00}|00\rangle + c_{01}|01\rangle + c_{10}|10\rangle + c_{11}|11\rangle$:
$$\sum_{j,k \in \{0,1\}} |c_{jk}|^2 = 1.0000000000 \pm 10^{-10}$$

---

## 1. Single-Qubit Unitary Transformations

### 1.1 Pauli-X Gate (Bit-Flip / Quantum NOT)
* **Initial State:** $|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$
* **Operator:** $X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix}$
* **Transformed State:** $|1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$
* **Born Probabilities:** $P(0) = 0.0\%$, $P(1) = 100.0\%$
* **Bloch Coordinates:** $\vec{r} = (0, 0, 1) \to \vec{r}' = (0, 0, -1)$ ($180^\circ$ rotation about $X$).

### 1.2 Pauli-Y Gate (Bit & Phase-Flip)
* **Initial State:** $|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$
* **Operator:** $Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix}$
* **Transformed State:** $i|1\rangle = \begin{pmatrix} 0 \\ i \end{pmatrix}$
* **Born Probabilities:** $P(0) = 0.0\%$, $P(1) = 100.0\%$
* **Bloch Coordinates:** $\vec{r} = (0, 0, 1) \to \vec{r}' = (0, 0, -1)$ ($180^\circ$ rotation about $Y$).

### 1.3 Pauli-Z Gate (Phase-Flip)
* **Initial State:** $|+\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}$
* **Operator:** $Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}$
* **Transformed State:** $|-\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ -1 \end{pmatrix}$
* **Born Probabilities:** $P(0) = 50.0\%$, $P(1) = 50.0\%$
* **Bloch Coordinates:** $\vec{r} = (1, 0, 0) \to \vec{r}' = (-1, 0, 0)$ ($180^\circ$ rotation about $Z$).

### 1.4 Hadamard Gate (H)
* **Initial State:** $|0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$
* **Operator:** $H = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix}$
* **Transformed State:** $|+\rangle = \begin{pmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{pmatrix}$
* **Born Probabilities:** $P(0) = 50.0\%$, $P(1) = 50.0\%$
* **Bloch Coordinates:** $\vec{r} = (0, 0, 1) \to \vec{r}' = (1, 0, 0)$ (North pole to Equator $+X$).

### 1.5 Phase Gate (S)
* **Initial State:** $|+\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}$
* **Operator:** $S = \begin{pmatrix} 1 & 0 \\ 0 & i \end{pmatrix}$
* **Transformed State:** $|R\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ i \end{pmatrix}$
* **Born Probabilities:** $P(0) = 50.0\%$, $P(1) = 50.0\%$
* **Bloch Coordinates:** $\vec{r} = (1, 0, 0) \to \vec{r}' = (0, 1, 0)$ ($90^\circ$ equatorial rotation toward $+Y$).

### 1.6 $\pi/8$ Gate (T)
* **Initial State:** $|+\rangle = \frac{1}{\sqrt{2}}\begin{pmatrix} 1 \\ 1 \end{pmatrix}$
* **Operator:** $T = \begin{pmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{pmatrix} = \begin{pmatrix} 1 & 0 \\ 0 & \frac{1+i}{\sqrt{2}} \end{pmatrix}$
* **Transformed State:** $|\psi\rangle = \begin{pmatrix} 1/\sqrt{2} \\ (1+i)/2 \end{pmatrix}$
* **Born Probabilities:** $P(0) = 50.0\%$, $P(1) = 50.0\%$
* **Bloch Coordinates:** $\vec{r} = (1, 0, 0) \to \vec{r}' = (1/\sqrt{2}, 1/\sqrt{2}, 0) \approx (0.7071, 0.7071, 0)$.

---

## 2. Multi-Qubit Operations & Bell State Synthesis

### 2.1 Kronecker Tensor Product Basis
* Input: Qubit $A = |1\rangle = \begin{pmatrix} 0 \\ 1 \end{pmatrix}$, Qubit $B = |0\rangle = \begin{pmatrix} 1 \\ 0 \end{pmatrix}$
* Compound State: $|10\rangle = |1\rangle \otimes |0\rangle = \begin{pmatrix} 0 \\ 0 \\ 1 \\ 0 \end{pmatrix}$

### 2.2 Controlled-NOT Gate ($\text{CNOT}$)
* Input State: $|10\rangle = (0, 0, 1, 0)^T$ (Control Wire $0 = 1$, Target Wire $1 = 0$)
* Operation: $\text{CNOT}_{0,1}$
* Expected State: $|11\rangle = (0, 0, 0, 1)^T$
* Control $= 0$ Test: $\text{CNOT}_{0,1}|01\rangle = |01\rangle$ (Unchanged).

### 2.3 SWAP Gate
* Input State: $|10\rangle = (0, 0, 1, 0)^T$
* Operation: $\text{SWAP}_{0,1}$
* Expected State: $|01\rangle = (0, 1, 0, 0)^T$

### 2.4 Complete Bell State Basis Synthesis

#### Bell State $|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$
* Sequence: $|00\rangle \xrightarrow{H_0} \frac{|00\rangle + |10\rangle}{\sqrt{2}} \xrightarrow{\text{CNOT}_{0,1}} \frac{|00\rangle + |11\rangle}{\sqrt{2}}$
* Probabilities: $P(00) = 50.0\%$, $P(11) = 50.0\%$, $P(01) = 0.0\%$, $P(10) = 0.0\%$.

#### Bell State $|\Phi^-\rangle = \frac{|00\rangle - |11\rangle}{\sqrt{2}}$
* Sequence: $|00\rangle \xrightarrow{X_0} |10\rangle \xrightarrow{H_0} \frac{|00\rangle - |10\rangle}{\sqrt{2}} \xrightarrow{\text{CNOT}_{0,1}} \frac{|00\rangle - |11\rangle}{\sqrt{2}}$
* Probabilities: $P(00) = 50.0\%$, $P(11) = 50.0\%$, $P(01) = 0.0\%$, $P(10) = 0.0\%$.

#### Bell State $|\Psi^+\rangle = \frac{|01\rangle + |10\rangle}{\sqrt{2}}$
* Sequence: $|00\rangle \xrightarrow{X_1} |01\rangle \xrightarrow{H_0} \frac{|01\rangle + |11\rangle}{\sqrt{2}} \xrightarrow{\text{CNOT}_{0,1}} \frac{|01\rangle + |10\rangle}{\sqrt{2}}$
* Probabilities: $P(01) = 50.0\%$, $P(10) = 50.0\%$, $P(00) = 0.0\%$, $P(11) = 0.0\%$.

#### Bell State $|\Psi^-\rangle = \frac{|01\rangle - |10\rangle}{\sqrt{2}}$
* Sequence: $|00\rangle \xrightarrow{X_0 X_1} |11\rangle \xrightarrow{H_0} \frac{|01\rangle - |11\rangle}{\sqrt{2}} \xrightarrow{\text{CNOT}_{0,1}} \frac{|01\rangle - |10\rangle}{\sqrt{2}}$
* Probabilities: $P(01) = 50.0\%$, $P(10) = 50.0\%$, $P(00) = 0.0\%$, $P(11) = 0.0\%$.

### 2.5 Correlated Measurement Verification
* When measuring Qubit $A$ on $|\Phi^+\rangle$:
  * Outcome $A = 0 \implies$ Post-measurement state collapses to $|00\rangle$ with $P(B=0) = 1.0$.
  * Outcome $A = 1 \implies$ Post-measurement state collapses to $|11\rangle$ with $P(B=1) = 1.0$.
  * Out-of-basis joint states $|01\rangle$ and $|10\rangle$ are forbidden ($P = 0$).
