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

  // Quiz Mistake & Review Coaching
  if (
    query.includes('got this question wrong') ||
    query.includes('knowledge check') ||
    query.includes('quiz') ||
    query.includes('why this is incorrect') ||
    query.includes('my answer:')
  ) {
    if (query.includes('evaluation') || query.includes('evaluations') || query.includes('how many')) {
      return mode === 'simple'
        ? `Let's clear this up! 💡\n\nIn classical computing, checking if a function is constant or balanced requires evaluating both $f(0)$ and $f(1)$ — that's **2 separate evaluations**.\n\nHowever, the **Deutsch-Jozsa algorithm** uses quantum superposition to evaluate all possible inputs simultaneously! Quantum interference then reveals whether the function is constant or balanced in **exactly 1 quantum evaluation**.\n\n🎯 *Try it again:* When you retry the question, remember this single-query speedup!`
        : `### Quantum Query Complexity Analysis\n\nClassically, determining whether $f: \\{0,1\\} \\to \\{0,1\\}$ is constant or balanced requires evaluating $f(0)$ and $f(1)$, requiring $\\Omega(2)$ queries in the worst case.\n\nThe Deutsch-Jozsa algorithm exploits quantum parallelism: applying $H^{\\otimes n}$ creates a uniform superposition over all inputs, and the phase oracle embeds $f(x)$ into relative phases. A final Hadamard transform results in amplitude $\\frac{1}{2}\\sum_x (-1)^{f(x)}$, which evaluates the global property deterministically with **exactly 1 oracle query** ($O(1)$ query complexity).`;
    }

    if (query.includes('ancilla') || query.includes('helper') || query.includes('|-⟩') || query.includes('|->')) {
      return mode === 'simple'
        ? `Here's the secret to the helper qubit! 🔑\n\nWhen the ancilla is in the $|-\\rangle = (|0\\rangle - |1\\rangle)/\\sqrt{2}$ state, applying the CNOT gate doesn't just change the ancilla — it causes a **negative phase $(-1)^{f(x)}$ to kick back** into the input control qubit!\n\nWithout initializing the ancilla into $|-\\rangle$, phase kickback would not occur, and interference couldn't happen.\n\n🎯 *Retry Tip:* Look for the answer describing how the negative sign $(-1)$ is transferred or kicked back to the control qubit!`
        : `### Phase Kickback Mechanics\n\nThe ancilla qubit is prepared in $|-\\rangle = H|1\\rangle = \\frac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle)$. Applying the oracle unitary $U_f|x\\rangle|y\\rangle = |x\\rangle|y \\oplus f(x)\\rangle$ yields:\n$$U_f|x\\rangle|-\\rangle = (-1)^{f(x)}|x\\rangle|-\\rangle$$\nBecause $|-\\rangle$ is an eigenstate of the Pauli $X$ gate with eigenvalue $-1$, the function evaluation $f(x)$ kicks back as a global/relative phase $(-1)^{f(x)}$ onto the control register $|x\\rangle$.`;
    }

    if (query.includes('interference') || query.includes('hadamard on input') || query.includes('yields |0>')) {
      return mode === 'simple'
        ? `Let's look at what the final Hadamard gate does! 🌈\n\nAfter phase kickback, the input qubit holds the phase information. The final Hadamard gate creates **quantum interference**:\n- If the function is **constant**, the amplitudes add up constructively at $|0\\rangle$ (100% chance).\n- If the function is **balanced**, the amplitudes cancel out at $|0\\rangle$ and constructively interfere at $|1\\rangle$ (100% chance).\n\n🎯 *Retry Tip:* If you measure $|0\\rangle$, the function is guaranteed to be **constant**; if $|1\\rangle$, it is **balanced**!`
        : `### Constructive & Destructive Interference\n\nThe post-oracle state is $\\frac{1}{\\sqrt{2}}\\left[(-1)^{f(0)}|0\\rangle + (-1)^{f(1)}|1\\rangle\\right]$.\nApplying a final Hadamard yields:\n$$H \\left(\\frac{(-1)^{f(0)}|0\\rangle + (-1)^{f(1)}|1\\rangle}{\\sqrt{2}}\\right) = \\frac{(-1)^{f(0)}+(-1)^{f(1)}}{2}|0\\rangle + \\frac{(-1)^{f(0)}-(-1)^{f(1)}}{2}|1\\rangle$$\n- For constant functions ($f(0)=f(1)$), destructive interference zeroes out $|1\\rangle$, yielding $|0\\rangle$ with probability 1.\n- For balanced functions ($f(0) \\neq f(1)$), destructive interference zeroes out $|0\\rangle$, yielding $|1\\rangle$ with probability 1.`;
    }
  }

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

    if (hasHOnQ0 && hasXOnQ1 && !hasHOnQ1) {
      return `• **Step Done:** Hadamard (H) gate placed on Qubit 0.
• **Next Step:** Replace the X gate on Qubit 1 with a **Hadamard (H) gate**.
• **Quick Clue:** Grover requires both qubits to start in an equal superposition $|+\\rangle$, whereas X creates a deterministic $|1\\rangle$.`;
    }

    if (!hasHOnQ0 || !hasHOnQ1) {
      return `• **Step Done:** Circuit started.
• **Next Step:** Place **Hadamard (H) gates** on both Q0 and Q1 to create uniform 4-state superposition.
• **Quick Clue:** What single-qubit gate transforms $|0\\rangle$ into an equal blend of $|0\\rangle$ and $|1\\rangle$?`;
    }

    if (hasHOnQ0 && hasHOnQ1 && hasCX && !hasCZ) {
      return `• **Step Done:** Uniform superposition established.
• **Next Step:** Replace CNOT with a **Controlled-Z (CZ)** gate on Q0 and Q1 for the phase oracle.
• **Quick Clue:** The Phase Oracle must negate the amplitude of target state $|11\\rangle$ without flipping bit values.`;
    }

    if (hasHOnQ0 && hasHOnQ1 && !hasCZ && !hasCX) {
      return `• **Step Done:** Uniform 4-state superposition established on Q0 and Q1.
• **Next Step:** Place a **Controlled-Z (CZ)** gate between Q0 and Q1 to mark target $|11\\rangle$.
• **Quick Clue:** Which controlled gate flips the sign of $|11\\rangle$ while leaving other states untouched?`;
    }

    if (hasCZ) {
      return `• **Step Done:** Phase oracle marked $|11\\rangle$ with negative phase.
• **Next Step:** Assemble the **Diffusion Operator** (H on Q0 & Q1, reflection, and final H).
• **Quick Clue:** Diffusion inverts amplitudes about the mean, amplifying $|11\\rangle$ toward 100% probability.`;
    }
  }

  // 2. Deutsch-Jozsa Socratic Analysis
  if (slug === 'deutsch-jozsa') {
    const hasXOnQ1 = gateStrUpper.includes('X(Q1)');
    const hasHOnQ0 = gateStrUpper.includes('H(Q0)');
    const hasHOnQ1 = gateStrUpper.includes('H(Q1)');
    const hasCX = gateStrUpper.includes('CX');

    if (!hasXOnQ1) {
      return `• **Step Done:** Circuit started.
• **Next Step:** Apply an **X gate** to Ancilla Qubit 1 to initialize it to $|1\\rangle$.
• **Quick Clue:** Phase kickback requires ancilla Q1 to start in $|1\\rangle$ so that the subsequent Hadamard puts it in $|-\\rangle$.`;
    }

    if (hasXOnQ1 && (!hasHOnQ0 || !hasHOnQ1)) {
      return `• **Step Done:** Ancilla Q1 initialized with **X gate** ($|1\\rangle$). Excellent first step!
• **Next Step:** Place **Hadamard (H) gates** on both Q0 and Q1 to create superposition.
• **Quick Clue:** Both input Q0 and ancilla Q1 must enter the oracle in superposition ($|+, -\\rangle$) for phase kickback.`;
    }

    if (hasXOnQ1 && hasHOnQ0 && hasHOnQ1 && !hasCX) {
      return `• **Step Done:** Ancilla initialized and superposition established on both qubits.
• **Next Step:** Place a **CNOT gate** (Control: Q0, Target: Q1) to evaluate the balanced oracle $f(x) = x$.
• **Quick Clue:** Which 2-qubit gate adds input Q0 into ancilla Q1 modulo 2 ($y \\oplus x$)?`;
    }

    if (hasCX) {
      return `• **Step Done:** Phase kickback completed across the oracle.
• **Next Step:** Place a final **Hadamard (H) gate** on Qubit 0.
• **Quick Clue:** Detectors measure in the Z basis; the final H converts kickback phase interference into a deterministic $|1\\rangle$ bit.`;
    }
  }

  // 3. Teleportation Socratic Analysis
  if (slug === 'teleportation') {
    const hasCX12 = gateStrUpper.includes('CX(Q1,2)') || gateStrUpper.includes('CX(1,2)');
    const hasCX01 = gateStrUpper.includes('CX(Q0,1)') || gateStrUpper.includes('CX(0,1)');

    if (!hasCX12) {
      return `• **Step Done:** Message state prepared.
• **Next Step:** Create an entangled Bell pair between Alice (Q1) and Bob (Q2) using **H(Q1)** and **CX(Q1, Q2)**.
• **Quick Clue:** Teleportation requires shared entanglement before Alice can measure and transmit.`;
    }

    if (hasCX12 && !hasCX01) {
      return `• **Step Done:** Entangled Bell pair established between Alice and Bob.
• **Next Step:** Perform Bell measurement: apply **CNOT (Control: Q0, Target: Q1)** followed by **H(Q0)**.
• **Quick Clue:** Coupling message Q0 to entangled Q1 enables joint Bell-basis projection.`;
    }
  }

  // 4. Superdense Coding Socratic Analysis
  if (slug === 'superdense-coding') {
    const hasZ = gateStrUpper.includes('Z');
    const hasX = gateStrUpper.includes('X');
    const hasCX = gateStrUpper.includes('CX');

    if (!hasZ || !hasX) {
      return `• **Step Done:** Shared Bell pair prepared.
• **Next Step:** Apply **Z** and **X gates** on Alice's Qubit 0 to encode the two classical bits '11'.
• **Quick Clue:** Z flips phase ($|\\Phi^+\\rangle \\to |\\Phi^-\\rangle$) and X flips bit ($|\\Phi^-\\rangle \\to |\\Psi^-\\rangle$).`;
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
