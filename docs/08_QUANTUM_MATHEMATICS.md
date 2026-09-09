# QUANTUM MATHEMATICS — SPECIFICATION — QYNX

---

## 1. Purpose & Mathematical Scope

This specification defines the **exact mathematical formulations** implemented within the shared Quantum Engine of **QYNX**. The browser simulator performs idealized, noise-free state-vector simulations based on standard linear algebra over the field of complex numbers $\mathbb{C}$.

---

## 2. State Vectors & Normalization

### 2.1 Single-Qubit Representation
A single-qubit state $|\psi\rangle$ is represented as a unit vector in a 2-dimensional Hilbert space $\mathcal{H}_2 \cong \mathbb{C}^2$:

$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle = \begin{bmatrix} \alpha \\ \beta \end{bmatrix}, \quad \alpha, \beta \in \mathbb{C}$$

Subject to the normalization condition:
$$|\alpha|^2 + |\beta|^2 = 1$$

### 2.2 Standard Computational Basis States
$$|0\rangle = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, \quad |1\rangle = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$$

### 2.3 Named Superposition States
- **Plus state $|+\rangle$**: $\frac{1}{\sqrt{2}}(|0\rangle + |1\rangle) = \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix}$
- **Minus state $|-\rangle$**: $\frac{1}{\sqrt{2}}(|0\rangle - |1\rangle) = \begin{bmatrix} 1/\sqrt{2} \\ -1/\sqrt{2} \end{bmatrix}$
- **Phase state $|+i\rangle$**: $\frac{1}{\sqrt{2}}(|0\rangle + i|1\rangle) = \begin{bmatrix} 1/\sqrt{2} \\ i/\sqrt{2} \end{bmatrix}$
- **Phase state $|-i\rangle$**: $\frac{1}{\sqrt{2}}(|0\rangle - i|1\rangle) = \begin{bmatrix} 1/\sqrt{2} \\ -i/\sqrt{2} \end{bmatrix}$

---

## 3. Elementary Unitary Gate Matrices

All quantum gates are represented by unitary matrices $U$ such that $U^\dagger U = I$.

### 3.1 Pauli-X (NOT / Bit-Flip)
$$X = \begin{bmatrix} 0 & 1 \\ 1 & 0 \end{bmatrix}, \quad X|0\rangle = |1\rangle, \quad X|1\rangle = |0\rangle$$

### 3.2 Pauli-Y (Bit-and-Phase Flip)
$$Y = \begin{bmatrix} 0 & -i \\ i & 0 \end{bmatrix}, \quad Y|0\rangle = i|1\rangle, \quad Y|1\rangle = -i|0\rangle$$

### 3.3 Pauli-Z (Phase-Flip)
$$Z = \begin{bmatrix} 1 & 0 \\ 0 & -1 \end{bmatrix}, \quad Z|0\rangle = |0\rangle, \quad Z|1\rangle = -|1\rangle$$

### 3.4 Hadamard ($H$ — Superposition)
$$H = \frac{1}{\sqrt{2}}\begin{bmatrix} 1 & 1 \\ 1 & -1 \end{bmatrix}, \quad H|0\rangle = |+\rangle, \quad H|1\rangle = |-\rangle$$

### 3.5 Phase Gate ($S = \sqrt{Z}$)
$$S = \begin{bmatrix} 1 & 0 \\ 0 & i \end{bmatrix}, \quad S|0\rangle = |0\rangle, \quad S|1\rangle = i|1\rangle$$

### 3.6 T Gate ($T = \sqrt{S}$)
$$T = \begin{bmatrix} 1 & 0 \\ 0 & e^{i\pi/4} \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & \frac{1+i}{\sqrt{2}} \end{bmatrix}$$

---

## 4. Bloch Sphere Spherical Coordinates

Any pure single-qubit state $|\psi\rangle$ can be expressed parameterized by polar angle $\theta \in [0, \pi]$ and azimuthal phase angle $\phi \in [0, 2\pi)$:

$$|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$$

### Extraction Algorithm from State Vector $[\alpha, \beta]^T$:
1. Normalize amplitudes: $|\alpha|^2 + |\beta|^2 = 1$.
2. Compute polar angle: $\theta = 2 \arccos(|\alpha|)$.
3. Compute azimuthal angle:
   $$\text{If } |\beta| < 10^{-10} \implies \phi = 0, \quad \text{Else } \phi = \text{atan2}(\text{Im}(\beta), \text{Re}(\beta)) - \text{atan2}(\text{Im}(\alpha), \text{Re}(\alpha))$$
4. Convert to Cartesian 3D coordinates $(x, y, z)$ on the unit sphere ($r = 1$):
   $$x = \sin\theta \cos\phi, \quad y = \sin\theta \sin\phi, \quad z = \cos\theta$$

---

## 5. Multi-Qubit Systems & Entanglement

### 5.1 Kronecker Tensor Product
For two independent qubits $|\psi_0\rangle = [\alpha_0, \beta_0]^T$ and $|\psi_1\rangle = [\alpha_1, \beta_1]^T$:

$$|\psi\rangle = |\psi_0\rangle \otimes |\psi_1\rangle = \begin{bmatrix} \alpha_0\alpha_1 \\ \alpha_0\beta_1 \\ \beta_0\alpha_1 \\ \beta_0\beta_1 \end{bmatrix} = c_{00}|00\rangle + c_{01}|01\rangle + c_{10}|10\rangle + c_{11}|11\rangle$$

### 5.2 Controlled-NOT (CNOT) Operator
With qubit 0 as control and qubit 1 as target:
$$\text{CNOT} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \\ 0 & 0 & 1 & 0 \end{bmatrix}$$

$$\text{CNOT}|00\rangle = |00\rangle, \quad \text{CNOT}|01\rangle = |01\rangle, \quad \text{CNOT}|10\rangle = |11\rangle, \quad \text{CNOT}|11\rangle = |10\rangle$$

### 5.3 Bell-State Generation ($|\Phi^+\rangle$)
1. Initialize register: $|\psi_0\rangle = |00\rangle$.
2. Apply $H$ to qubit 0: $(H \otimes I)|00\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |10\rangle)$.
3. Apply $\text{CNOT}_{0 \to 1}$: $\text{CNOT}\left(\frac{|00\rangle + |10\rangle}{\sqrt{2}}\right) = \frac{|00\rangle + |11\rangle}{\sqrt{2}} = |\Phi^+\rangle$.

State vector: $[1/\sqrt{2}, 0, 0, 1/\sqrt{2}]^T$. Measurement yields $00$ ($50\%$) and $11$ ($50\%$).

### 5.4 SWAP Gate Operator
$$\text{SWAP} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}, \quad \text{SWAP}|01\rangle = |10\rangle, \quad \text{SWAP}|10\rangle = |01\rangle$$

### 5.5 Schmidt Rank Separability Test
A two-qubit state $|\psi\rangle = \sum_{j,k} c_{jk}|jk\rangle$ is **separable** (not entangled) if and only if the determinant of its coefficient matrix vanishes:
$$c_{00}c_{11} - c_{01}c_{10} \approx 0 \quad (\text{tolerance } \epsilon = 10^{-10})$$
If $|c_{00}c_{11} - c_{01}c_{10}| > 10^{-10}$, the state is non-separable (entangled).

---

## 6. Measurement Statistics & Wave-Function Collapse

### 6.1 Born Rule
The probability $P(k)$ of observing basis state $|k\rangle$ upon measurement is:
$$P(k) = |\langle k | \psi \rangle|^2 = |c_k|^2 = \text{Re}(c_k)^2 + \text{Im}(c_k)^2$$

### 6.2 Single Projective Measurement Collapse
When a measurement is executed on $|\psi\rangle$:
1. Compute cumulative probability interval $I_k = [\sum_{j=0}^{k-1} P(j), \sum_{j=0}^k P(j))$.
2. Draw uniform pseudo-random value $r \in [0, 1)$.
3. Select outcome $m$ such that $r \in I_m$.
4. **State Collapse**: Immediately set the post-measurement state vector to basis ket $|m\rangle$.

### 6.3 Multi-Shot Statistical Sampling
In multi-shot mode (e.g. 100 or 1,000 shots), each shot evaluates the identical pre-measurement probability distribution independently without state degradation, generating an empirical histogram.
