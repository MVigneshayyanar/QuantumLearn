import { QuizQuestion, MisconceptionTag } from './types';

export const MISCONCEPTION_GUIDES: Record<MisconceptionTag, {
  name: string;
  flaw: string;
  socraticPrompt: string;
  hintSimple: string;
  hintTechnical: string;
}> = {
  SUPERPOSITION_VS_CLASSICAL_PROB: {
    name: "Superposition vs Classical Probability",
    flaw: "Thinking a qubit in superposition is simply in a hidden 0 or 1 state like a flipped coin under a cup.",
    socraticPrompt: "Guide the student to see that amplitudes can cancel each other out (interference), which classical probabilities (always positive numbers) can never do.",
    hintSimple: "If a coin is hidden under a cup, it is already heads or tails. But a qubit is truly both at once, and its possibilities can cancel each other out!",
    hintTechnical: "Classical mixtures obey convex sums of probabilities sum(p_i = 1, p_i >= 0). Quantum superpositions involve complex probability amplitudes (alpha |0> + beta |1>) that exhibit constructive and destructive quantum interference."
  },
  ENTANGLEMENT_COMMUNICATION: {
    name: "Entanglement for Faster-Than-Light Signaling",
    flaw: "Believing that measuring an entangled qubit transmits instantaneous data faster than light to the other observer.",
    socraticPrompt: "Ask the student what the receiving observer actually sees without classical communication — each single qubit measurement appears completely random 50/50!",
    hintSimple: "Even though entangled qubits match instantly, Bob only sees random 50/50 noise until Alice sends her classical bits explaining what to compare.",
    hintTechnical: "The No-Signaling Theorem proves that partial trace of any subsystem rho_B = Tr_A(rho_AB) is invariant under local unitary operations or projective measurements performed on subsystem A."
  },
  PHASE_KICKBACK_MISUNDERSTANDING: {
    name: "Phase Kickback Mechanics",
    flaw: "Assuming the control qubit only affects the target qubit and remains completely unaltered itself.",
    socraticPrompt: "Guide the student to write the action of CNOT on |+>|-> and observe how the eigenvalue (-1) transfers onto the control qubit.",
    hintSimple: "In CNOT, when the helper qubit is in |-⟩, applying the gate causes the negative sign to 'kick back' upward into the control qubit!",
    hintTechnical: "CNOT |x>|-> = CNOT |x> 1/sqrt(2)(|0>-|1>) = 1/sqrt(2)(|x>|x> - |x>|x ⊕ 1>) = (-1)^x |x>|->."
  },
  NO_CLONING_VIOLATION: {
    name: "No-Cloning Theorem in Teleportation",
    flaw: "Thinking quantum teleportation makes a duplicate/copy of the original qubit state.",
    socraticPrompt: "Ask what happens to Alice's original qubit when she performs her Bell-basis measurement.",
    hintSimple: "Teleportation is a *move*, not a *copy*! Alice's original state is destroyed upon measurement to protect the No-Cloning Theorem.",
    hintTechnical: "By the No-Cloning Theorem (Wootters & Zurek 1982), no unitary operator U can clone an arbitrary unknown quantum state |psi>. In teleportation, Alice's measurement collapses the original state into classical bits."
  },
  MEASUREMENT_COLLAPSE: {
    name: "Measurement Irreversibility & Collapse",
    flaw: "Assuming that after measuring a qubit, it continues oscillating in its original superposition.",
    socraticPrompt: "Prompt the user to explain why repeated measurements on a collapsed qubit always yield the same result.",
    hintSimple: "Once you measure a qubit, the superposition is permanently gone! The qubit is now firmly locked into |0⟩ or |1⟩.",
    hintTechnical: "Measurement corresponds to projection operator P_k = |k><k|. The post-measurement state is P_k |psi> / sqrt(<psi|P_k|psi>), collapsing the statevector."
  },
  DEUTSCH_ORACLE_QUERY: {
    name: "Deutsch-Jozsa Single Query Speedup",
    flaw: "Believing we must calculate f(0) and f(1) separately to compare them.",
    socraticPrompt: "Ask how quantum parallelism and interference evaluate global function properties without checking individual inputs.",
    hintSimple: "Quantum computers don't need to check f(0) and f(1) one-by-one. Superposition tests all inputs at once, and interference reveals whether they match in 1 step!",
    hintTechnical: "The Deutsch-Jozsa algorithm evaluates the global property sum_x (-1)^(f(x)) via constructive/destructive interference in O(1) query complexity versus classical Omega(2^(n-1)+1)."
  },
  GROVER_AMPLITUDE_MEAN: {
    name: "Grover Inversion About the Mean",
    flaw: "Assuming Grover's algorithm just directly boosts the marked state without needing the diffusion step.",
    socraticPrompt: "Ask what the oracle alone does (only flips the sign) and why the diffusion operator is required to translate negative phase into increased probability.",
    hintSimple: "The oracle only makes the target state negative. The diffusion operator reflects all states around the average, pulling the negative one high above all others!",
    hintTechnical: "The Oracle U_w = I - 2|w><w| marks the target with a -1 relative phase without altering probability magnitude. The Diffusion operator U_s = 2|s><s| - I reflects amplitudes across the mean <alpha>, amplifying |w>."
  },
  SUPERDENSE_BIT_CAPACITY: {
    name: "Superdense Coding Capacity",
    flaw: "Assuming superdense coding transmits infinite classical bits in one qubit.",
    socraticPrompt: "Ask how many orthogonal Bell states exist in a 2-qubit Hilbert space.",
    hintSimple: "With 2 entangled qubits, there are exactly 4 distinct Bell states (|Φ+⟩, |Φ-⟩, |Ψ+⟩, |Ψ-⟩), which encode exactly 2 classical bits (00, 01, 10, 11).",
    hintTechnical: "Holevo's Bound limits the accessible classical information of an unentangled qubit to 1 bit. Prior entanglement doubles this capacity to log2(dim(H_A ⊗ H_B)) = 2 classical bits per transmitted qubit."
  }
};

export function generateSocraticResponse(
  userQuery: string,
  context: {
    page?: string;
    explanationMode?: 'simple' | 'technical';
    activeMisconception?: string | null;
    circuitInfo?: string;
  }
): string {
  const mode = context.explanationMode || 'simple';
  const query = userQuery.toLowerCase();

  // Check if query is about a misconception
  if (context.activeMisconception && MISCONCEPTION_GUIDES[context.activeMisconception as MisconceptionTag]) {
    const guide = MISCONCEPTION_GUIDES[context.activeMisconception as MisconceptionTag];
    if (mode === 'simple') {
      return `Let's break down this idea together! 🌟\n\n**${guide.name}**\n\n${guide.hintSimple}\n\n*Think about this:* If you perform an experiment, what do you think would happen to the state immediately after you look at it?`;
    } else {
      return `### Socratic Analysis: ${guide.name}\n\n${guide.hintTechnical}\n\n**Guiding Question:** How does this unitary transformation preserve normalization and unitarity across the tensor product space?`;
    }
  }

  // Common quantum topics
  if (query.includes('hadamard') || query.includes('h gate') || query.includes('superposition')) {
    if (mode === 'simple') {
      return `Great question! Think of the **Hadamard (H) gate** like a fair coin spinner. \n\nWhen you start with a definite |0⟩ (heads) and apply H, it puts the qubit into an equal blend of 0 and 1: $(|0\\rangle + |1\\rangle)/\\sqrt{2}$. \n\n*Here's a puzzle for you:* What happens if you apply a second Hadamard gate right after the first? Does it make it more random, or return to |0⟩?`;
    } else {
      return `The **Hadamard operator** $H$ is a single-qubit unitary that transforms computational basis states into transversal conjugate bases:\n\n$$H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$\n\nNotice that $H^2 = I$. Applying $H|0\\rangle = |+\\rangle$ and $H|1\\rangle = |-\\rangle$.\n\nHow does this linear combination enable quantum interference when recombined?`;
    }
  }

  if (query.includes('bloch') || query.includes('sphere')) {
    if (mode === 'simple') {
      return `The **Bloch Sphere** is a 3D globe representing all possible states of a single qubit!\n\n- The **North Pole** is $|0\\rangle$.\n- The **South Pole** is $|1\\rangle$.\n- The **Equator** contains equal superpositions like $|+\\rangle$ and $|-\\rangle$.\n\n*Key insight:* When two qubits become entangled, single-qubit Bloch vectors disappear because the state belongs to the pair, not an individual!`;
    } else {
      return `Any single-qubit pure state can be parameterized on the unit 2-sphere $S^2$ as:\n\n$$|\\psi\\rangle = \\cos(\\theta/2)|0\\rangle + e^{i\\phi}\\sin(\\theta/2)|1\\rangle$$\n\nwhere $\\theta \\in [0, \\pi]$ and $\\phi \\in [0, 2\\pi)$. For mixed states, the Bloch vector $\\vec{r} = (\\langle\\sigma_x\\rangle, \\langle\\sigma_y\\rangle, \\langle\\sigma_z\\rangle)$ lies inside the unit ball ($|\\vec{r}| < 1$), with purity $\\text{Tr}(\\rho^2) = \\frac{1+|\\vec{r}|^2}{2}$.`;
    }
  }

  if (query.includes('teleport') || query.includes('teleportation')) {
    return mode === 'simple'
      ? `Quantum Teleportation uses **entanglement** and **2 classical bits** to beam a state across space.\n\n*Why doesn't it violate the cosmic speed limit (speed of light)?* Because Bob cannot read the state until Alice calls him with her classical measurement results!`
      : `Quantum Teleportation achieves the exact channel isometry $\\mathcal{N}: \\mathcal{H}_A \\to \\mathcal{H}_B$ by consuming 1 e-bit ($|\\Phi^+\\rangle$) and 2 classical bits (c-bits). The No-Cloning theorem holds because the projective Bell-basis measurement on $\\mathcal{H}_A \\otimes \\mathcal{H}_{A'}$ destroys the original state density matrix.`;
  }

  if (query.includes('grover')) {
    return mode === 'simple'
      ? `Grover's algorithm is like searching a deck of cards! Instead of flipping each card one by one ($N$ tries), Grover only needs $\\approx \\sqrt{N}$ steps.\n\nIt works in two magical steps:\n1. **The Oracle:** flips the sign of the target card.\n2. **The Diffusion Operator:** reflects all cards about the average, boosting the target amplitude high above the others!`
      : `Grover's search performs amplitude amplification in a 2D subspace spanned by the uniform superposition $|s\\rangle$ and the marked target $|w\\rangle$. Each Grover iteration $G = (2|s\\rangle\\langle s| - I)(I - 2|w\\rangle\\langle w|)$ rotates the statevector by angle $2\\theta$ where $\\sin\\theta = 1/\\sqrt{N}$, achieving optimal query complexity $\\mathcal{O}(\\sqrt{N})$.`;
  }

  // Default Socratic fallback
  return mode === 'simple'
    ? `That is an insightful observation! In quantum computing, states can combine, cancel each other out, or become linked across space. \n\nWhat specific part of the circuit or algorithm are you curious about right now? Would you like to test a gate or try a practice quiz question?`
    : `In this configuration, the quantum register evolves unitarily under the tensor product of applied gates $U = U_k \\dots U_1$. \n\nWhich observable or projection would you like to evaluate on the final statevector?`;
}
