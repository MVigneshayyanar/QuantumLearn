import math
from typing import Dict, Any, List, Tuple
from qiskit import QuantumCircuit
from schemas.responses import StepSnapshot
from simulate.engine import simulate_circuit

def build_deutsch_jozsa(params: Dict[str, Any]) -> Tuple[QuantumCircuit, List[StepSnapshot]]:
    """
    Builds the Deutsch-Jozsa algorithm for 2 qubits (1 input, 1 ancilla).
    Oracle types: 'constant_0', 'constant_1', 'balanced_id', 'balanced_not'.
    """
    oracle_type = params.get("oracle_type", "balanced_id").lower()
    qc = QuantumCircuit(2)
    snapshots: List[StepSnapshot] = []
    
    # Step 0: Init
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=0,
        label="Step 0: Initialize Qubits",
        description_simple="We start with 2 qubits: an Input Qubit (Q0) and an Ancilla/Helper Qubit (Q1), both at |0⟩.",
        description_technical="Initial state vector |psi_0> = |q1 q0> = |00>.",
        gate_applied="INIT",
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 1: Prep ancilla to |1>
    qc.x(1)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=1,
        label="Step 1: Prepare Ancilla to |1⟩",
        description_simple="Flip the helper qubit (Q1) to 1 using a Pauli-X (NOT) gate so it is ready to perform phase kickback.",
        description_technical="Apply X on ancilla q1: |psi_1> = (I ⊗ X)|00> = |10>.",
        gate_applied="X",
        qubits_affected=[1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 2: Superposition via H on both qubits
    qc.h(0)
    qc.h(1)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=2,
        label="Step 2: Create Superposition with Hadamards",
        description_simple="Apply Hadamard gates to put Q0 into |+⟩ (50/50 chance of 0 or 1) and Q1 into |-⟩.",
        description_technical="Apply H ⊗ H: |psi_2> = |+> ⊗ |-> = 1/2 (|0>-|1>)(|0>+|1>).",
        gate_applied="H ⊗ H",
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 3: Oracle
    if oracle_type == "constant_0":
        # f(x) = 0: Identity on both
        oracle_label = "Oracle: Constant 0 (f(x) = 0)"
        oracle_simple = "The function always outputs 0. No gates needed — the ancilla phase remains untouched."
        oracle_tech = "Unitary U_f |x>|y> = |x>|y ⊕ 0> = |x>|y>. Matrix is 4x4 Identity I."
        gate_name = "I (Identity)"
    elif oracle_type == "constant_1":
        # f(x) = 1: X on ancilla
        qc.x(1)
        oracle_label = "Oracle: Constant 1 (f(x) = 1)"
        oracle_simple = "The function always outputs 1. A Pauli-X flips the helper qubit."
        oracle_tech = "Unitary U_f |x>|y> = |x>|y ⊕ 1>. Global phase factor (-1) applied to ancilla."
        gate_name = "X (Ancilla)"
    elif oracle_type == "balanced_not":
        # f(x) = NOT x
        qc.x(0)
        qc.cx(0, 1)
        qc.x(0)
        oracle_label = "Oracle: Balanced NOT (f(0)=1, f(1)=0)"
        oracle_simple = "The function inverts the input. Phase kickback selectively flips the phase of |0⟩ on the input."
        oracle_tech = "Unitary U_f applies phase (-1)^(1-x) to input basis states via CNOT with X-basis sandwiching."
        gate_name = "X - CNOT - X"
    else: # "balanced_id"
        # f(x) = x
        qc.cx(0, 1)
        oracle_label = "Oracle: Balanced Identity (f(0)=0, f(1)=1)"
        oracle_simple = "The CNOT gate acts on Q1 when Q0 is 1. Due to Phase Kickback, the negative phase from Q1 kicks back into Q0!"
        oracle_tech = "CNOT |x>|-> = (-1)^(f(x)) |x>|->. Phase kickback encodes f(x) directly into input qubit relative phase."
        gate_name = "CNOT"
        
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=3,
        label=f"Step 3: {oracle_label}",
        description_simple=oracle_simple,
        description_technical=oracle_tech,
        gate_applied=gate_name,
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 4: Interference via Hadamard on Input Qubit
    qc.h(0)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=4,
        label="Step 4: Interference on Input Qubit",
        description_simple="Applying Hadamard to Q0 converts phase differences into detectable 0 or 1 measurements (quantum interference).",
        description_technical="H on q0 converts |+> back to |0> (for constant f) or |-> to |1> (for balanced f).",
        gate_applied="H (Input)",
        qubits_affected=[0],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    return qc, snapshots

def build_grover_search(params: Dict[str, Any]) -> Tuple[QuantumCircuit, List[StepSnapshot]]:
    """
    Builds Grover's Search Algorithm for 2 or 3 qubits.
    Params: num_qubits (2 or 3), marked_state (e.g. '11', '10', '01', '00', or '101').
    """
    num_qubits = int(params.get("num_qubits", 2))
    num_qubits = min(3, max(2, num_qubits))
    marked_state = str(params.get("marked_state", "11" if num_qubits == 2 else "101"))
    if len(marked_state) != num_qubits:
        marked_state = "1" * num_qubits
        
    qc = QuantumCircuit(num_qubits)
    snapshots: List[StepSnapshot] = []
    
    # Step 0: Init
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=0,
        label="Step 0: Initialize Search Space",
        description_simple=f"Start with {num_qubits} qubits initialized to |0⟩. The total search space is 2^{num_qubits} = {2**num_qubits} items.",
        description_technical=f"Initial state |0...0> in {2**num_qubits}-dimensional Hilbert space.",
        gate_applied="INIT",
        qubits_affected=list(range(num_qubits)),
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 1: Equal Superposition
    for i in range(num_qubits):
        qc.h(i)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=1,
        label="Step 1: Equal Superposition (Hadamard Layer)",
        description_simple=f"Hadamard on all qubits gives every one of the {2**num_qubits} possible states an equal probability ({100/(2**num_qubits):.1f}% each).",
        description_technical=f"State |s> = 1/sqrt({2**num_qubits}) sum_(x) |x>. Uniform probability distribution across all basis states.",
        gate_applied="H^(⊗n)",
        qubits_affected=list(range(num_qubits)),
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 2: Phase Oracle (Marks the target state with -1 phase)
    # Configure bit flips to match target
    # In Qiskit, qubit index 0 is rightmost in bitstring
    for i in range(num_qubits):
        bit = marked_state[num_qubits - 1 - i]
        if bit == '0':
            qc.x(i)
            
    if num_qubits == 2:
        qc.cz(0, 1)
    else:
        # 3-qubit multi-controlled Z: H(2) -> CCX(0,1,2) -> H(2)
        qc.h(2)
        qc.ccx(0, 1, 2)
        qc.h(2)
        
    for i in range(num_qubits):
        bit = marked_state[num_qubits - 1 - i]
        if bit == '0':
            qc.x(i)
            
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=2,
        label=f"Step 2: Phase Oracle (Marked State |{marked_state}⟩)",
        description_simple=f"The oracle flips the phase (amplitude sign) of only the target item |{marked_state}⟩ from positive to negative. Probability stays the same, but the phase is inverted!",
        description_technical=f"Oracle unitary U_w = I - 2|w><w|, where |w> = |{marked_state}>. Inverts amplitude of marked state below average.",
        gate_applied=f"Oracle(|{marked_state}⟩)",
        qubits_affected=list(range(num_qubits)),
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 3: Diffusion Operator (Inversion about the mean)
    for i in range(num_qubits):
        qc.h(i)
    for i in range(num_qubits):
        qc.x(i)
        
    if num_qubits == 2:
        qc.cz(0, 1)
    else:
        qc.h(2)
        qc.ccx(0, 1, 2)
        qc.h(2)
        
    for i in range(num_qubits):
        qc.x(i)
    for i in range(num_qubits):
        qc.h(i)
        
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=3,
        label="Step 3: Grover Diffusion (Amplitude Amplification)",
        description_simple=f"The diffusion operator reflects all amplitudes about the average. Because the target item was negative, it is amplified up to near 100%!",
        description_technical=f"Diffusion unitary U_s = 2|s><s| - I. Reflection about the mean state |s> boosts marked amplitude and suppresses non-marked amplitudes.",
        gate_applied="Diffusion (2|s><s| - I)",
        qubits_affected=list(range(num_qubits)),
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    return qc, snapshots

def build_teleportation(params: Dict[str, Any]) -> Tuple[QuantumCircuit, List[StepSnapshot]]:
    """
    Builds Quantum Teleportation of a single qubit state across Alice (q0, q1) and Bob (q2).
    Params: state_prep ('plus', 'one', 't_state', 'custom_theta')
    """
    state_prep = params.get("state_prep", "plus")
    qc = QuantumCircuit(3)
    snapshots: List[StepSnapshot] = []
    
    # Step 0: Init
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=0,
        label="Step 0: Initialize 3 Qubits",
        description_simple="Q0: Alice's unknown message qubit. Q1: Alice's entangled link. Q2: Bob's receiving qubit.",
        description_technical="Initial composite Hilbert space H_A ⊗ H_AB ⊗ H_B = |000>.",
        gate_applied="INIT",
        qubits_affected=[0, 1, 2],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 1: Prepare Alice's secret state on Q0
    if state_prep == "one":
        qc.x(0)
        prep_label = "|1⟩ State"
    elif state_prep == "t_state":
        qc.h(0)
        qc.t(0)
        prep_label = "T-State (H + T)"
    else: # 'plus'
        qc.h(0)
        prep_label = "|+⟩ Superposition (H)"
        
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=1,
        label=f"Step 1: Alice Prepares Secret State ({prep_label})",
        description_simple="Alice encodes the mystery quantum state (|ψ⟩ = α|0⟩ + β|1⟩) onto Qubit 0 that she wants to teleport to Bob.",
        description_technical=f"State preparation on q0: |psi> = alpha |0> + beta |1>. Composite state |psi> ⊗ |00>.",
        gate_applied=f"PREP({prep_label})",
        qubits_affected=[0],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 2: Create Bell Pair between Alice (Q1) and Bob (Q2)
    qc.h(1)
    qc.cx(1, 2)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=2,
        label="Step 2: Create Entangled Bell Pair (Q1 & Q2)",
        description_simple="Hadamard and CNOT entangle Q1 (Alice) and Q2 (Bob) into the Bell state (|00⟩ + |11⟩)/√2. Notice their Bloch vectors become undefined due to entanglement!",
        description_technical="Bell pair generation on q1, q2: |Phi+> = 1/sqrt(2)(|00> + |11>). Total state: |psi> ⊗ |Phi+>.",
        gate_applied="H(1) + CNOT(1->2)",
        qubits_affected=[1, 2],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 3: Alice's Bell Measurement Preparation (CNOT 0->1, H 0)
    qc.cx(0, 1)
    qc.h(0)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=3,
        label="Step 3: Alice Performs Bell Basis Operation",
        description_simple="Alice interacts her message Q0 with her entangled Q1 using CNOT, then passes Q0 through a Hadamard gate.",
        description_technical="CNOT(0->1) followed by H(0) maps Alice's two qubits into the Bell basis for projective measurement.",
        gate_applied="CNOT(0->1) + H(0)",
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 4: Feedforward Classical Corrections on Bob's Q2
    # In full quantum circuit simulation: CX(1, 2) and CZ(0, 2) applies the conditional correction
    qc.cx(1, 2) # X correction if q1 is 1
    qc.cz(0, 2) # Z correction if q0 is 1
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=4,
        label="Step 4: Bob Applies Classical Feedforward Correction",
        description_simple="Alice sends 2 classical bits to Bob. Bob uses these bits to apply X and/or Z gates to Q2, restoring Alice's exact original state onto Q2! Alice's original state on Q0 is destroyed (No-Cloning Theorem).",
        description_technical="Controlled-X from q1 and Controlled-Z from q0 restores Bob's qubit q2 to |psi> = alpha|0> + beta|1> regardless of measurement outcome.",
        gate_applied="CX(1->2) + CZ(0->2)",
        qubits_affected=[2],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    return qc, snapshots

def build_superdense_coding(params: Dict[str, Any]) -> Tuple[QuantumCircuit, List[StepSnapshot]]:
    """
    Builds Superdense Coding algorithm (transmits 2 classical bits '00', '01', '10', '11' using 1 qubit).
    """
    message_bits = str(params.get("message_bits", "10"))
    if message_bits not in ["00", "01", "10", "11"]:
        message_bits = "10"
        
    qc = QuantumCircuit(2)
    snapshots: List[StepSnapshot] = []
    
    # Step 0: Init
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=0,
        label="Step 0: Initialize Alice (Q0) and Bob (Q1)",
        description_simple="Start with two qubits at |00⟩. Alice wants to send 2 classical bits of information using only 1 physical qubit.",
        description_technical="Initial 2-qubit state |00>.",
        gate_applied="INIT",
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 1: Bell Pair
    qc.h(0)
    qc.cx(0, 1)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=1,
        label="Step 1: Create Shared Entanglement (|Φ+⟩)",
        description_simple="A third party or Alice creates an entangled Bell pair (|00⟩ + |11⟩)/√2 and gives Q0 to Alice and Q1 to Bob.",
        description_technical="Bell state |Phi+> = 1/sqrt(2) (|00> + |11>). Qubits 0 and 1 are maximally entangled.",
        gate_applied="H(0) + CNOT(0->1)",
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 2: Alice Encodes 2 Bits on Q0
    if message_bits == "00":
        # I
        encoding_label = "00 (No Gate / Identity)"
        encoding_desc_s = "Alice wants to send '00'. She does nothing (Identity gate)."
        encoding_desc_t = "State remains |Phi+> = (|00> + |11>)/sqrt(2)."
        enc_gate = "I"
    elif message_bits == "01":
        # X
        qc.x(0)
        encoding_label = "01 (Pauli-X Bit Flip)"
        encoding_desc_s = "Alice wants to send '01'. She applies Pauli-X (NOT) to her qubit Q0."
        encoding_desc_t = "X(0) transforms |Phi+> into |Psi+> = (|10> + |01>)/sqrt(2)."
        enc_gate = "X(0)"
    elif message_bits == "10":
        # Z
        qc.z(0)
        encoding_label = "10 (Pauli-Z Phase Flip)"
        encoding_desc_s = "Alice wants to send '10'. She applies Pauli-Z (Phase flip) to her qubit Q0."
        encoding_desc_t = "Z(0) transforms |Phi+> into |Phi-> = (|00> - |11>)/sqrt(2)."
        enc_gate = "Z(0)"
    else: # "11"
        # Z then X (iY)
        qc.x(0)
        qc.z(0)
        encoding_label = "11 (Pauli-X followed by Pauli-Z)"
        encoding_desc_s = "Alice wants to send '11'. She applies both X and Z gates to Q0."
        encoding_desc_t = "Z(0)X(0) transforms |Phi+> into |Psi-> = (|01> - |10>)/sqrt(2)."
        enc_gate = "X(0) + Z(0)"
        
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=2,
        label=f"Step 2: Alice Encodes Message '{message_bits}' ({encoding_label})",
        description_simple=f"{encoding_desc_s} Alice now sends her single qubit Q0 over to Bob!",
        description_technical=encoding_desc_t,
        gate_applied=enc_gate,
        qubits_affected=[0],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    # Step 3: Bob Decodes (CNOT 0->1, H 0)
    qc.cx(0, 1)
    qc.h(0)
    sim = simulate_circuit(qc)
    snapshots.append(StepSnapshot(
        step=3,
        label="Step 3: Bob Decodes Bell State",
        description_simple="Bob takes both qubits (his Q1 and received Q0), applies CNOT and Hadamard to disentangle them into definite classical bit values.",
        description_technical="Bob applies Bell measurement transformation (H ⊗ I) CNOT(0->1), mapping the Bell basis back to standard computational basis.",
        gate_applied="CNOT(0->1) + H(0)",
        qubits_affected=[0, 1],
        statevector=sim["statevector"],
        probabilities=sim["probabilities"],
        bloch_vectors=sim["bloch_vectors"]
    ))
    
    return qc, snapshots

def get_algorithm_simulation(algorithm: str, params: Dict[str, Any], shots: int = 1024) -> Tuple[QuantumCircuit, List[StepSnapshot], Dict[str, Any]]:
    """
    Dispatches named algorithm simulation and returns final circuit, step snapshots, and final simulation stats.
    """
    algo = algorithm.lower().strip()
    if algo == "deutsch_jozsa":
        qc, snapshots = build_deutsch_jozsa(params)
    elif algo == "grover":
        qc, snapshots = build_grover_search(params)
    elif algo == "teleportation":
        qc, snapshots = build_teleportation(params)
    elif algo == "superdense_coding":
        qc, snapshots = build_superdense_coding(params)
    else:
        raise ValueError(f"Unknown algorithm '{algorithm}'. Choose from: deutsch_jozsa, grover, teleportation, superdense_coding")
        
    final_sim = simulate_circuit(qc, shots=shots)
    return qc, snapshots, final_sim
