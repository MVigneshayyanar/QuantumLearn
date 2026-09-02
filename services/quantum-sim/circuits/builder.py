from typing import List, Tuple, Optional
from qiskit import QuantumCircuit
from schemas.requests import GateOperation, CustomCircuitRequest
from schemas.responses import StepSnapshot
from simulate.engine import simulate_circuit

SUPPORTED_GATES = {"h", "x", "y", "z", "s", "t", "cx", "cz", "swap", "measure"}

def build_circuit_from_request(req: CustomCircuitRequest) -> Tuple[QuantumCircuit, List[StepSnapshot]]:
    """
    Constructs a Qiskit QuantumCircuit from a CustomCircuitRequest.
    Validates gate types and qubit indices.
    Extracts step-by-step statevector snapshots as each step executes.
    """
    num_qubits = req.num_qubits
    qc = QuantumCircuit(num_qubits)
    
    # Sort gates by step, then by primary qubit
    sorted_gates = sorted(req.gates, key=lambda g: (g.step, g.qubits[0] if g.qubits else 0))
    
    # Track step snapshots
    step_snapshots: List[StepSnapshot] = []
    
    # Initial state snapshot (Step 0 / before gates: |00...0>)
    initial_sim = simulate_circuit(qc)
    step_snapshots.append(StepSnapshot(
        step=0,
        label="Initial State: All qubits in |0⟩",
        description_simple="Circuit starts with every qubit reset to the classical zero state |0⟩.",
        description_technical="Initial statevector |psi_0> = |0...0> in Hilbert space H^(2^n).",
        gate_applied="INIT",
        qubits_affected=list(range(num_qubits)),
        statevector=initial_sim["statevector"],
        probabilities=initial_sim["probabilities"],
        bloch_vectors=initial_sim["bloch_vectors"]
    ))
    
    current_step_idx = 1
    for gate in sorted_gates:
        gate_type = gate.type.lower()
        if gate_type not in SUPPORTED_GATES:
            raise ValueError(f"Unsupported gate type '{gate.type}'. Supported gates: {sorted(list(SUPPORTED_GATES))}")
            
        for q in gate.qubits:
            if q < 0 or q >= num_qubits:
                raise IndexError(f"Qubit index {q} is out of bounds for a {num_qubits}-qubit circuit (valid: 0 to {num_qubits-1}).")
                
        if gate_type == "h":
            qc.h(gate.qubits[0])
            label = f"Hadamard gate applied to Qubit {gate.qubits[0]}"
            desc_s = f"Qubit {gate.qubits[0]} is placed into an equal superposition of 0 and 1."
            desc_t = f"Applies H matrix 1/sqrt(2)[[1,1],[1,-1]] to qubit {gate.qubits[0]}."
        elif gate_type == "x":
            qc.x(gate.qubits[0])
            label = f"Pauli-X (NOT) gate applied to Qubit {gate.qubits[0]}"
            desc_s = f"Qubit {gate.qubits[0]} state is flipped (0 becomes 1, 1 becomes 0)."
            desc_t = f"Applies bit-flip sigma_x [[0,1],[1,0]] to qubit {gate.qubits[0]}."
        elif gate_type == "y":
            qc.y(gate.qubits[0])
            label = f"Pauli-Y gate applied to Qubit {gate.qubits[0]}"
            desc_s = f"Bit-flip and phase shift applied to Qubit {gate.qubits[0]}."
            desc_t = f"Applies sigma_y [[0,-i],[i,0]] to qubit {gate.qubits[0]}."
        elif gate_type == "z":
            qc.z(gate.qubits[0])
            label = f"Pauli-Z (Phase Flip) gate applied to Qubit {gate.qubits[0]}"
            desc_s = f"Adds a negative sign (phase flip) to the |1⟩ component of Qubit {gate.qubits[0]}."
            desc_t = f"Applies phase-flip sigma_z [[1,0],[0,-1]] to qubit {gate.qubits[0]}."
        elif gate_type == "s":
            qc.s(gate.qubits[0])
            label = f"Phase (S) gate applied to Qubit {gate.qubits[0]}"
            desc_s = f"Rotates Qubit {gate.qubits[0]} phase by 90 degrees (+pi/2)."
            desc_t = f"Applies diag(1, i) = sqrt(Z) to qubit {gate.qubits[0]}."
        elif gate_type == "t":
            qc.t(gate.qubits[0])
            label = f"T (pi/8) gate applied to Qubit {gate.qubits[0]}"
            desc_s = f"Rotates Qubit {gate.qubits[0]} phase by 45 degrees (+pi/4)."
            desc_t = f"Applies diag(1, exp(i*pi/4)) = sqrt(S) to qubit {gate.qubits[0]}."
        elif gate_type == "cx":
            if len(gate.qubits) < 2:
                raise ValueError("CNOT (cx) gate requires exactly 2 qubits: [control, target]")
            qc.cx(gate.qubits[0], gate.qubits[1])
            label = f"CNOT gate (Control: Q{gate.qubits[0]}, Target: Q{gate.qubits[1]})"
            desc_s = f"Flips Qubit {gate.qubits[1]} only if Qubit {gate.qubits[0]} is 1. Can create quantum entanglement!"
            desc_t = f"Applies 2-qubit controlled-NOT unitary |0><0|⊗I + |1><1|⊗X."
        elif gate_type == "cz":
            if len(gate.qubits) < 2:
                raise ValueError("Controlled-Z (cz) gate requires exactly 2 qubits: [control, target]")
            qc.cz(gate.qubits[0], gate.qubits[1])
            label = f"CZ gate (Control: Q{gate.qubits[0]}, Target: Q{gate.qubits[1]})"
            desc_s = f"Inverts phase of |11⟩ state across Q{gate.qubits[0]} and Q{gate.qubits[1]}."
            desc_t = f"Applies controlled-Z unitary diag(1, 1, 1, -1)."
        elif gate_type == "swap":
            if len(gate.qubits) < 2:
                raise ValueError("SWAP gate requires exactly 2 qubits: [qubitA, qubitB]")
            qc.swap(gate.qubits[0], gate.qubits[1])
            label = f"SWAP gate (Q{gate.qubits[0]} <-> Q{gate.qubits[1]})"
            desc_s = f"Exchanges the quantum states of Qubit {gate.qubits[0]} and Qubit {gate.qubits[1]}."
            desc_t = f"Applies unitary swap operator |00><00| + |01><10| + |10><01| + |11><11|."
        elif gate_type == "measure":
            # Statevector tracks unitary evolution, measurement is simulated in shots
            label = f"Measurement on Qubit {gate.qubits[0]}"
            desc_s = f"Measures Qubit {gate.qubits[0]}, collapsing its superposition into a definite classical bit."
            desc_t = "Projective measurement in standard computational Z-basis {|0>, |1>}."
            
        step_sim = simulate_circuit(qc)
        step_snapshots.append(StepSnapshot(
            step=current_step_idx,
            label=label,
            description_simple=desc_s,
            description_technical=desc_t,
            gate_applied=gate_type.upper(),
            qubits_affected=gate.qubits,
            statevector=step_sim["statevector"],
            probabilities=step_sim["probabilities"],
            bloch_vectors=step_sim["bloch_vectors"]
        ))
        current_step_idx += 1
        
    return qc, step_snapshots
