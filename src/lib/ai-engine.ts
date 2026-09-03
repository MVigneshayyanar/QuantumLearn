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
      return `### Schrödinger AI Analysis: ${guide.name}\n\n${guide.hintTechnical}\n\n**Guiding Question:** How does this unitary transformation preserve normalization and unitarity across the tensor product space?`;
    }
  }

  // Circuit Diagnosis for Build It guided modules
  if (
    query.includes("student's circuit gates") ||
    query.includes("build it") ||
    query.includes("observed statevector fidelity") ||
    context.circuitInfo
  ) {
    return generateSocraticCircuitFeedback({
      rawQuery: userQuery,
      explanationMode: mode,
    });
  }

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

/**
 * Generates tailored, stage-by-stage Socratic feedback based on
 * the actual gates placed by the student. Never gives the direct solution.
 */
export function generateSocraticCircuitFeedback(params: {
  moduleSlug?: string;
  userGateList?: string[];
  structuralDiff?: string[];
  fidelity?: number;
  explanationMode?: 'simple' | 'technical';
  rawQuery?: string;
}): string {
  const raw = params.rawQuery || '';
  const rawLower = raw.toLowerCase();

  // Infer module
  let slug = params.moduleSlug || '';
  if (!slug) {
    if (rawLower.includes('grover')) slug = 'grover';
    else if (rawLower.includes('deutsch')) slug = 'deutsch-jozsa';
    else if (rawLower.includes('teleport')) slug = 'teleportation';
    else if (rawLower.includes('superdense')) slug = 'superdense-coding';
  }

  // Parse student gates from raw query if needed
  let userGates = params.userGateList || [];
  if (userGates.length === 0) {
    const match = raw.match(/Student's circuit gates:\s*\[(.*?)\]/i);
    if (match && match[1]) {
      userGates = match[1].split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  const gateStrUpper = userGates.join(' ').toUpperCase();

  // 1. Grover's Search Socratic Analysis
  if (slug === 'grover') {
    const hasHOnQ0 = gateStrUpper.includes('H(Q0)');
    const hasHOnQ1 = gateStrUpper.includes('H(Q1)');
    const hasXOnQ1 = gateStrUpper.includes('X(Q1)');
    const hasCX = gateStrUpper.includes('CX');
    const hasCZ = gateStrUpper.includes('CZ');

    // Case 1: Student placed X on Q1 instead of H (The exact situation shown by the user)
    if (hasHOnQ0 && hasXOnQ1 && !hasHOnQ1) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Let's analyze your circuit initialization:**
You started off well by placing a **Hadamard (H) gate** on Qubit 0, which creates the superposition state $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$.

However, take a close look at **Qubit 1**: you placed an **X gate**.
- Remember that an $X$ gate performs a deterministic bit-flip ($|0\\rangle \\to |1\\rangle$). It does *not* create an equal superposition of possibilities.
- Grover's search must start by putting **all qubits** into an equal superposition so the algorithm can search through $|00\\rangle, |01\\rangle, |10\\rangle, |11\\rangle$ simultaneously.

**Guiding Question:**
*What single-qubit gate can you replace the X gate with on Qubit 1 so that both qubits begin in an equal superposition of $|0\\rangle$ and $|1\\rangle$?*`;
    }

    // Case 2: Missing initialization superposition altogether
    if (!hasHOnQ0 || !hasHOnQ1) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Step 1 — Creating the Search Space:**
Before we can search for a target item, the quantum register must hold an equal superposition across all 4 computational basis states.

**Guiding Question:**
*Which fundamental gate transforms a qubit starting from $|0\\rangle$ into an equal blend of $|0\\rangle$ and $|1\\rangle$? What happens when you apply this gate to both Q0 and Q1 at step 0?*`;
    }

    // Case 3: Superposition exists, but using CNOT instead of CZ for oracle
    if (hasHOnQ0 && hasHOnQ1 && hasCX && !hasCZ) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Look closely at your Oracle implementation:**
Notice that you placed a **CNOT (CX)** gate.
- A CNOT flips the target qubit's bit ($|0\\rangle \\leftrightarrow |1\\rangle$). This alters the computational states themselves rather than marking the target state.
- In Grover's search, the Phase Oracle must perform a **phase inversion** (multiplying the amplitude of the target state $|11\\rangle$ by $-1$), without altering the underlying bit pattern!

**Guiding Question:**
*Which controlled 2-qubit phase gate acts symmetrically to negate the amplitude only when both qubits are $|1\\rangle$?*`;
    }

    // Case 4: Superposition exists, but oracle is missing
    if (hasHOnQ0 && hasHOnQ1 && !hasCZ && !hasCX) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Great job! Uniform superposition is established:**
Both qubits are now in equal superposition: $\\frac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle + |11\\rangle)$.

**Next Step — The Phase Oracle:**
Now the algorithm must "tag" or "mark" the target state $|11\\rangle$ with a negative sign ($-1$ relative phase), while leaving $|00\\rangle, |01\\rangle, |10\\rangle$ untouched.

**Guiding Question:**
*Which 2-qubit controlled gate flips the sign of $|11\\rangle$ without changing any of the other three basis states?*`;
    }

    // Case 5: Oracle is in place, but diffusion operator is missing or incomplete
    if (hasCZ) {
      return `### 💡 Schrödinger AI Socratic Guidance

**The Phase Oracle is working! Now for Amplitude Amplification:**
Your oracle has successfully negated the phase of $|11\\rangle$: $\\frac{1}{2}(|00\\rangle + |01\\rangle + |10\\rangle - |11\\rangle)$.

However, if you measure now, notice that $|-0.5|^2 = 25\\%$. Every state still has the exact same measurement probability!
- We need the **Grover Diffusion Operator (Inversion about the Mean)** to reflect all amplitudes about their average, turning that negative phase into a peak probability near 100%.

**Guiding Question:**
*To reflect about the uniform state $|s\\rangle$, we first rotate back from the superposition basis using Hadamard gates. What sequence of gates inverts about $|00\\rangle$ before rotating back?*`;
    }
  }

  // 2. Deutsch-Jozsa Socratic Analysis
  if (slug === 'deutsch-jozsa') {
    const hasXOnQ1 = gateStrUpper.includes('X(Q1)');
    const hasHOnQ0 = gateStrUpper.includes('H(Q0)');
    const hasHOnQ1 = gateStrUpper.includes('H(Q1)');
    const hasCX = gateStrUpper.includes('CX');

    // Case 1: Missing X on ancilla Q1
    if (!hasXOnQ1) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Examine the Ancilla Qubit (Qubit 1):**
The Deutsch-Jozsa algorithm depends entirely on **Phase Kickback**. Phase kickback only occurs when the target ancilla qubit is in the negative superposition eigenstate $|-\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}}$.

If you only apply a Hadamard gate to $|0\\rangle$, it produces $|+\\rangle$, which has an eigenvalue of $+1$ (no phase kickback will occur!).

**Guiding Question:**
*What gate must you apply to Qubit 1 at step 0 (before the Hadamard gate) so that $H$ transforms it into $|-\\rangle$?*`;
    }

    // Case 2: Missing balanced oracle
    if (hasXOnQ1 && hasHOnQ0 && hasHOnQ1 && !hasCX) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Superposition and Ancilla are ready!**
Both qubits are in superposition, with Qubit 1 in the $|-\\rangle$ state ready for kickback. Now you need to query the balanced function $f(x) = x$.
- A quantum function oracle computes $|x, y\\rangle \\to |x, y \\oplus f(x)\\rangle$.

**Guiding Question:**
*Which 2-qubit gate adds the value of input Qubit 0 into ancilla Qubit 1 modulo 2 ($y \\oplus x$)?*`;
    }

    // Case 3: Missing final Hadamard
    if (hasCX) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Phase Kickback has occurred!**
The oracle has successfully transferred the global function property into the phase of Qubit 0.
However, detectors in a quantum computer only measure in the computational Z basis ($|0\\rangle$ or $|1\\rangle$), not the phase basis ($|+\\rangle$ or $|-\\rangle$).

**Guiding Question:**
*What gate converts phase interference on Qubit 0 back into a deterministic computational measurement of $|1\\rangle$?*`;
    }
  }

  // 3. Teleportation Socratic Analysis
  if (slug === 'teleportation') {
    const hasCX12 = gateStrUpper.includes('CX(Q1,2)') || gateStrUpper.includes('CX(1,2)');
    const hasCX01 = gateStrUpper.includes('CX(Q0,1)') || gateStrUpper.includes('CX(0,1)');

    if (!hasCX12) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Step 1 — Establishing the Quantum Channel:**
Before Alice can teleport her quantum state on Qubit 0, Alice (Q1) and Bob (Q2) must share an entangled resource.

**Guiding Question:**
*What two gates create the maximally entangled Bell state $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$ between Alice's Qubit 1 and Bob's Qubit 2?*`;
    }

    if (hasCX12 && !hasCX01) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Bell pair is established! Now for Bell Measurement:**
Alice holds the unknown message state on Qubit 0 and her half of the Bell pair on Qubit 1. To teleport the information, Alice must perform a joint Bell-basis measurement.

**Guiding Question:**
*To measure in the Bell basis using standard computational detectors, Alice must reverse the Bell state circuit. Which entangling gate couples message Q0 to entangled Q1?*`;
    }
  }

  // 4. Superdense Coding Socratic Analysis
  if (slug === 'superdense-coding') {
    const hasZ = gateStrUpper.includes('Z');
    const hasX = gateStrUpper.includes('X');
    const hasCX = gateStrUpper.includes('CX');

    if (!hasZ || !hasX) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Encoding the Message "11":**
Alice wants to transmit two classical bits: $b_1 b_2 = 11$.
- Applying a $Z$ gate alters the relative phase ($|\\Phi^+\\rangle \\to |\\Phi^-\\rangle$).
- Applying an $X$ gate alters the bit parity ($|\\Phi^+\\rangle \\to |\\Psi^+\\rangle$).

**Guiding Question:**
*What combination of single-qubit gates must Alice apply to Qubit 0 to encode both a bit flip and a phase flip for the message "11"?*`;
    }

    if (hasZ && hasX && !hasCX) {
      return `### 💡 Schrödinger AI Socratic Guidance

**Alice has encoded her qubit! Now Bob must decode:**
Bob receives Alice's qubit and now holds both entangled qubits. To read out the two classical bits deterministically, Bob must decode the Bell state.

**Guiding Question:**
*What two decoding gates (reversing the Bell state preparation) must Bob apply to transform the Bell state back into computational basis states?*`;
    }
  }

  // 5. General Fallback with structural diffs
  const diffNotice = params.structuralDiff?.[0] || 'Check the sequence and types of gates placed';
  return `### 💡 Schrödinger AI Socratic Guidance

**Reviewing your quantum circuit:**
${diffNotice}.

**Guiding Question:**
*Think about the physical transformation required at each step of this algorithm. Does each qubit reach the intended superposition, entanglement, or phase before the next operation?*`;
}
