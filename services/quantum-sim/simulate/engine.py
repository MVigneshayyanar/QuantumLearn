import math
import numpy as np
from typing import List, Dict, Optional, Tuple, Any
import qiskit
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, DensityMatrix, partial_trace

from schemas.responses import ComplexAmplitude, BlochVector, StepSnapshot

PAULI_X = np.array([[0, 1], [1, 0]], dtype=complex)
PAULI_Y = np.array([[0, -1j], [1j, 0]], dtype=complex)
PAULI_Z = np.array([[1, 0], [0, -1]], dtype=complex)

def compute_bloch_coords(rho_2x2: np.ndarray, qubit_idx: int) -> Tuple[Optional[BlochVector], Optional[str]]:
    """
    Computes (x, y, z) Bloch coordinates from a 2x2 reduced density matrix rho.
    If purity < 0.999 (entangled/mixed state), returns None and a physical warning message.
    """
    # Tr(rho^2)
    purity = float(np.real(np.trace(rho_2x2 @ rho_2x2)))
    
    # Calculate expectation values of Pauli matrices
    # rho = 1/2 ( I + x sigma_x + y sigma_y + z sigma_z )
    x = float(np.real(np.trace(rho_2x2 @ PAULI_X)))
    y = float(np.real(np.trace(rho_2x2 @ PAULI_Y)))
    z = float(np.real(np.trace(rho_2x2 @ PAULI_Z)))
    
    radius = math.sqrt(x * x + y * y + z * z)
    
    # Theta (polar angle from +Z [0, pi])
    # z = cos(theta) -> theta = acos(clamp(z / r, -1, 1))
    norm_z = max(-1.0, min(1.0, z / (radius if radius > 1e-7 else 1.0)))
    theta = math.acos(norm_z)
    
    # Phi (azimuthal angle in XY plane [0, 2pi))
    phi = math.atan2(y, x)
    if phi < 0:
        phi += 2 * math.pi
        
    is_pure = (purity >= 0.999) and (radius >= 0.999)
    
    if not is_pure:
        warning = f"qubit {qubit_idx} is entangled with another qubit (purity={purity:.3f}) — single-qubit pure Bloch vector is undefined"
        return None, warning
    
    bloch = BlochVector(
        qubit=qubit_idx,
        x=round(x, 4),
        y=round(y, 4),
        z=round(z, 4),
        theta=round(theta, 4),
        phi=round(phi, 4),
        purity=round(purity, 4),
        is_pure=True
    )
    return bloch, None

def simulate_circuit(qc: QuantumCircuit, shots: int = 1024) -> Dict[str, Any]:
    """
    Simulates a Qiskit QuantumCircuit using Statevector, extracts exact amplitudes,
    probabilities, Bloch vectors (with entanglement detection), and measurement sampling.
    """
    num_qubits = qc.num_qubits
    
    # Simulate exact statevector
    try:
        sv = Statevector.from_instruction(qc)
    except Exception as e:
        # If circuit contains measurements or barriers, create clean unitary subcircuit
        clean_qc = QuantumCircuit(num_qubits)
        for instruction in qc.data:
            if instruction.operation.name not in ["measure", "barrier"]:
                clean_qc.append(instruction.operation, instruction.qubits, instruction.clbits)
        sv = Statevector.from_instruction(clean_qc)
        
    raw_amplitudes = sv.data
    dim = len(raw_amplitudes)
    
    # 1. Format statevector amplitudes
    amplitudes: List[ComplexAmplitude] = []
    for amp in raw_amplitudes:
        re = float(np.real(amp))
        im = float(np.imag(amp))
        mag = float(abs(amp))
        phase = float(np.angle(amp))
        amplitudes.append(ComplexAmplitude(
            re=round(re, 4),
            im=round(im, 4),
            magnitude=round(mag, 4),
            phase=round(phase, 4)
        ))
        
    # 2. Compute probabilities for basis states (|00>, |01>, etc.)
    probabilities: Dict[str, float] = {}
    probs_array = sv.probabilities()
    for idx, p in enumerate(probs_array):
        # Format binary string with num_qubits length, Qiskit order (q_{n-1}...q_0)
        bitstr = format(idx, f"0{num_qubits}b")
        probabilities[bitstr] = round(float(p), 6)
        
    # 3. Simulate measurement counts with shots
    keys = list(probabilities.keys())
    p_vals = [probabilities[k] for k in keys]
    # Normalize probabilities to sum to 1.0 for numpy choice
    p_sum = sum(p_vals)
    if p_sum > 0:
        p_norm = [p / p_sum for p in p_vals]
    else:
        p_norm = [1.0 / len(p_vals)] * len(p_vals)
        
    samples = np.random.choice(keys, size=shots, p=p_norm)
    counts: Dict[str, int] = {}
    for sample in samples:
        counts[sample] = counts.get(sample, 0) + 1
        
    # Ensure all non-zero probability states appear in counts even if 0 samples
    for k in keys:
        if k not in counts:
            counts[k] = 0
            
    # 4. Compute per-qubit reduced density matrix & Bloch vectors
    bloch_vectors: List[Optional[BlochVector]] = []
    warnings: List[str] = []
    
    for q in range(num_qubits):
        if num_qubits == 1:
            rho_k = DensityMatrix(sv).data
        else:
            traced_qubits = [i for i in range(num_qubits) if i != q]
            rho_k = partial_trace(sv, traced_qubits).data
            
        bloch, warn = compute_bloch_coords(rho_k, q)
        bloch_vectors.append(bloch)
        if warn:
            warnings.append(warn)
            
    # 5. ASCII Circuit Diagram
    try:
        circuit_ascii = str(qc.draw(output="text"))
    except Exception:
        circuit_ascii = "QuantumCircuit diagram"
        
    # 6. QASM representation
    try:
        import qiskit.qasm2
        qasm_str = qiskit.qasm2.dumps(qc)
    except Exception:
        try:
            qasm_str = qc.qasm()
        except Exception:
            qasm_str = "// OpenQASM representation"
            
    return {
        "num_qubits": num_qubits,
        "statevector": amplitudes,
        "probabilities": probabilities,
        "measurement_counts": counts,
        "bloch_vectors": bloch_vectors,
        "circuit_diagram_ascii": circuit_ascii,
        "warnings": warnings,
        "qasm": qasm_str
    }
