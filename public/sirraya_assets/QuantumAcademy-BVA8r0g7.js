const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Lazy-Bf2ibZzi.js","assets/three-DJLfiW-l.js","assets/react-KfUPlHYY.js"])))=>i.map(i=>d[i]);
import{j as e,_ as G}from "/sirraya_assets/three-DJLfiW-l.js";import{r as o}from "/sirraya_assets/react-KfUPlHYY.js";import{r as L,g as K}from "/sirraya_assets/render-BlSAk7Cl.js";/* empty css                  */const N=String.raw,V={id:"calibration-benchmarking",order:19.7,part:"NISQ & Beyond",title:"Calibration and Benchmarking: Measuring a Qubit You Cannot See",summary:"Spectroscopy, Rabi, Ramsey, echo, T₁, readout and randomized benchmarking: the experiments every lab runs, with their fits, error bars and failure modes.",minutes:50,objectives:["You can explain what each calibration experiment measures and which physical parameter its fit returns.","You can distinguish white from quasi-static dephasing by comparing a Ramsey and a Hahn-echo measurement.","You can state what randomized benchmarking does and does not tell you, and why it is insensitive to state-preparation and measurement errors.","You can read a fit result critically: error bars, χ²/dof, unconstrained parameters and window choice.","You can say where the simulators in this course can be trusted, using the model cards and the validation page."],blocks:[{t:"md",text:N`## Why calibration is half of quantum computing

A transmon's frequency drifts by kilohertz within hours, a laser's intensity wanders by per cent, a quantum dot's resonance moves when a charge hops nearby. Before any circuit runs, a controller must **find** each qubit, **tune** its pulses and **measure** how good they are. The gate fidelities in the previous lesson are the *output* of these procedures.

All of them follow the same pattern: prepare a state, let it evolve for a controlled parameter (time, frequency, amplitude), measure many times, and fit a model. Each point is a binomial estimate, so the uncertainty of a probability $p$ from $N$ shots is $\sqrt{p(1-p)/N}$, and every fitted parameter inherits an error bar from the curvature of the weighted least-squares cost:

$$\chi^2(\theta)=\sum_i \frac{\bigl(y_i-m(x_i;\theta)\bigr)^2}{\sigma_i^2},\qquad \mathrm{cov}(\theta)\approx\bigl(J^{\mathsf T}W J\bigr)^{-1}\,\max(1,\chi^2_\nu),$$

with $J$ the Jacobian of the model. A fit whose reduced $\chi^2_\nu$ is far above 1 is telling you the *model* is wrong, no matter how small the error bars look.`},{t:"md",text:N`## The standard experiments

**Spectroscopy** scans the drive frequency. For a long, weak tone the steady state of the Bloch equations gives a Lorentzian with power broadening,

$$P_1(\Delta)=\frac12\,\frac{s}{1+\Delta^2T_2^2+s},\qquad s=\Omega^2T_1T_2,\qquad \text{HWHM}=\frac{\sqrt{1+s}}{2\pi T_2}.$$

Long-lived qubits (ions, atoms, spins) are instead probed with a short $\pi$ pulse, because quasi-static noise would wash a steady-state line out; the line is then Fourier-limited.

**Rabi oscillation** at fixed amplitude: $P_1(t)=\tfrac{\Omega^2}{W^2}\tfrac12\bigl[1-e^{-t/\tau}\cos(Wt)\bigr]$ with $W=\sqrt{\Omega^2+\delta^2}$. It sets the $\pi$-pulse length, and the contrast $\Omega^2/W^2$ tells you how far off resonance you are.

**T₁** is an exponential decay after a $\pi$ pulse. **Ramsey** ($\pi/2$ – wait – $\pi/2$) measures the free-induction decay with an intentional detuning, so the fringe frequency is the frequency error and the envelope is $T_2^*$. **Hahn echo** inserts a $\pi$ pulse in the middle and refocuses any frequency offset that is constant during the sequence.

The two dephasing mechanisms leave different fingerprints. White noise and $T_1$ give an exponential coherence $e^{-t/T_2}$ with $1/T_2=1/2T_1+1/T_\phi$. A static (shot-to-shot) frequency spread $\sigma$ gives a *Gaussian* envelope $e^{-(2\pi\sigma t)^2/2}$. Ramsey sees both; echo removes the Gaussian part, so $T_{2,\mathrm{echo}}\gg T_2^*$ is the signature of slow noise.`},{t:"widget",name:"char-lab",props:{platform:"sc",experiment:"spec01"},caption:"Superconducting device with hidden parameters. Find the line, set the drive to it, run Rabi and Ramsey, then reveal the truth and see whether the deviations are within about two error bars."},{t:"callout",kind:"tip",title:"A good order of operations",text:"Spectroscopy (find f₀₁) → Rabi (find the π time) → Ramsey (refine f₀₁ and read T₂*) → T₁ and echo → readout optimisation → randomized benchmarking. Each step needs the previous one: a detuned drive lowers Rabi contrast, which lowers every later signal."},{t:"md",text:N`## Readout has an optimum

Dispersive, fluorescence and charge-sensor readouts all separate two Gaussian blobs whose distance grows as $\sqrt{t}$ with integration time. The assignment error from overlap falls as $\tfrac12\mathrm{erfc}(\Delta/2\sqrt2)$, but the excited state decays during the window, adding roughly $t/2T_1$. The sum has a minimum, and this is why fast amplifiers (parametric amplifiers, low-noise cryogenic electronics) improve fidelity: they move the minimum to shorter times.`},{t:"md",text:N`## Randomized benchmarking

Apply $m$ random single-qubit Cliffords followed by the one Clifford that undoes them, and measure the probability of finding the qubit back in $\lvert 0\rangle$. Averaging over sequences twirls the noise into a depolarizing channel, so the decay is exactly exponential,

$$F(m)=A\,p^m+B,\qquad r_{\mathrm{Clifford}}=\frac{1-p}{2}.$$

State-preparation and measurement errors only change $A$ and $B$, so $p$ is robust against them, which is why RB became the standard. With the usual decomposition (1.875 physical gates per Clifford on average) the error per physical gate is $r/1.875$. A coherence-limited device has $r\approx n_g t_g\left(\tfrac1{3T_2}+\tfrac1{6T_1}\right)$; any excess is control error. In the lab the twirled value $p=(2e^{-t/T_2}+e^{-t/T_1})/3$ per Clifford is the hidden truth that the fit must recover.

RB gives an average error, not its cause, and it says nothing about coherent errors that add up in a specific circuit. Interleaved RB, gate-set tomography and cycle benchmarking answer finer questions.

**Two-qubit RB.** The same protocol on the full two-qubit Clifford group (11,520 elements) gives $r=\tfrac34(1-p)$ per Clifford. An average Clifford contains about 1.5 entangling gates and 8.25 single-qubit gates, so $r/1.5$ is only an upper bound on the entangling-gate error. For gate-independent noise the decay is exactly $A p^m+B$ with $p=(\operatorname{tr}\Lambda_u-1)/15$, where $\Lambda_u$ is the unital part of the noise's Pauli transfer matrix. The validation panel checks this against an exact average over all 11,520 Cliffords.

**Leakage.** A transmon has more than two levels, and a gate can push population into $\lvert2\rangle$. Ordinary RB just sees an extra error. Measuring the $\lvert2\rangle$ population during RB and fitting $p_L(m)=p_\infty(1-\lambda^m)$ gives the leakage rate $L_\uparrow=p_\infty(1-\lambda)$ and the seepage rate $L_\downarrow=(1-p_\infty)(1-\lambda)$ per Clifford, with $\lambda=1-L_\uparrow-L_\downarrow$. In the lab the DRAG part of the leakage is computed by the same transmon pulse simulation as the Hardware Lab, so shortening the gate or switching DRAG off shows up as a larger $L_\uparrow$ in the benchmark, exactly as in the pulse-level picture.`},{t:"widget",name:"char-lab",props:{platform:"spin",experiment:"ramsey"},caption:"Silicon spin device. Compare Ramsey T₂* with the echo time: quasi-static noise from the nuclear and charge environment makes them differ by an order of magnitude."},{t:"md",text:N`## Two qubits: phases, crosstalk and entanglement

Single-qubit numbers say little about a processor; the entangling gate decides. Three measurements are standard.

**CZ conditional phase.** Run Ramsey on the target with the control in $\lvert0\rangle$ and in $\lvert1\rangle$. The two fringes are shifted by the conditional phase $\varphi$, which grows linearly with the entangling pulse length, $\varphi=\varphi_0+2\pi\kappa t$ (the offset $\varphi_0$ comes from the ramps). The pulse is tuned to the length where $\varphi=\pi$.

**Static ZZ.** Even with the gate off, a residual coupling shifts the target frequency by $\zeta$ depending on the neighbour's state. Measured as the frequency difference of the two Ramsey fringes, it limits how long qubits can idle and motivates tunable couplers and echo sequences.

**Bell fidelity from parity.** Populations give $P_{00}+P_{11}$, but a classical mixture of $\lvert00\rangle$ and $\lvert11\rangle$ has the same populations. Rotating both qubits by $\varphi$ and measuring parity gives $P_{\mathrm{even}}=\tfrac12[1+C\cos(2\varphi+\varphi_0)]$; the contrast $C$ measures the coherence, and $F=\tfrac12(P_{00}+P_{11}+C)$. Readout errors must be corrected with a measured confusion matrix first.`},{t:"md",text:N`## How far can you trust the simulators in this course?

Every model in the Hardware Lab has a **model card** (equations, parameters with their provenance, what is left out, where it is valid) and a **validation** panel that re-computes known results live: the $\sqrt2$ enhancement of the $1\leftrightarrow2$ transition, the $2\sqrt2\,g$ avoided crossing, the $7\pi/4\Omega\tau$ Rydberg decay error, the $1/V^2$ blockade scaling, the closed phase-space loops of the Mølmer–Sørensen gate, the Hong–Ou–Mandel dip and more. These checks found a real bug while the lab was being built (a pulse-edge integration error in the neutral-atom gate), which is exactly what they are for.

Two honest limits remain. The headline circuit fidelity uses typical per-gate noise floors rather than a particular device, and the characterization lab draws its hidden parameters from typical ranges. Use them to learn what the numbers mean and how a measurement can fool you, not to predict what a specific chip will do.`}],quiz:[{q:"In a Ramsey experiment the coherence decays as a Gaussian, while a Hahn echo gives a much longer exponential decay. What does this indicate?",options:["The qubit has a very short $T_1$","Slow, quasi-static frequency noise dominates the dephasing","The readout is saturated","The drive is resonant with the $1\\leftrightarrow2$ transition"],answer:1,explain:"A frequency offset that is constant during one shot but random between shots produces a Gaussian envelope in Ramsey. The echo π pulse refocuses it, leaving only the fast (white) noise and $T_1$."},{q:"Why is randomized benchmarking insensitive to state-preparation and measurement (SPAM) errors?",options:["It uses entangled states","SPAM errors only change the prefactor and offset of the exponential, not its decay rate","It measures each qubit many times","It discards bad sequences"],answer:1,explain:"The survival probability is $A p^m + B$. Imperfect preparation and readout rescale $A$ and shift $B$, but the depolarizing parameter $p$ comes from how fast the signal decays with sequence length."},{q:"A fit returns reduced $\\chi^2 = 6$ with very small error bars. What should you conclude?",options:["The parameters are extremely well determined","The model does not describe the data, so the error bars cannot be trusted","You need fewer shots","The qubit is leaking"],answer:1,explain:"Error bars come from the curvature of the cost function assuming the model is right. A $\\chi^2_\\nu$ far above 1 means systematic misfit; change the model or the window before quoting any uncertainty."},{q:"Increasing the integration time of a dispersive readout beyond the optimum makes the assignment error rise again because…",options:["the amplifier saturates","the excited state decays during the measurement","the two Gaussian blobs move closer together","the resonator frequency drifts"],answer:1,explain:"The separation of the blobs keeps growing as $\\sqrt t$, but a qubit prepared in |1⟩ relaxes to |0⟩ during the window, adding an error of about $t/2T_1$."}],takeaways:["Every calibration is prepare, evolve, measure, fit; the fit gives a number and an uncertainty, and both matter.","Ramsey versus echo separates slow from fast noise; Rabi contrast reveals detuning; spectroscopy finds the line.","Randomized benchmarking reports an SPAM-robust average error per Clifford; compare it with the coherence limit to see how much is control error.","The simulators here are validated against analytic results and carry model cards, but they are teaching models with typical parameters, not device specifications."]},J=Object.freeze(Object.defineProperty({__proto__:null,lesson:V},Symbol.toStringTag,{value:"Module"})),m=String.raw,Q="```",ee={id:"circuit-model",order:10,part:"Circuits & Algorithms",title:"The Circuit Model: Building Quantum Programs",summary:"A quantum program is a sequence of unitary gates on a register of qubits followed by measurement; a few recurring patterns (superposition, phase kickback, interference) turn that simple model into algorithms.",minutes:25,objectives:["You can read a circuit diagram and write the matrix it implements, remembering that the matrix product runs right to left.","You can explain why a small gate set such as H, T and CNOT is universal, and why T gates dominate the cost of fault-tolerant programs.","You can work through phase kickback and show that H-CNOT-H on two qubits equals a CNOT with control and target swapped.","You can distinguish bit oracles from phase oracles, and explain why uncomputation is needed.","You can prove the no-cloning theorem and measure a circuit by width, depth and gate count."],blocks:[{t:"md",text:m`## Reading a circuit diagram

A **quantum circuit** is a picture of a program. The rules for reading it are few:

- Each horizontal line is a **wire**, and each wire is one qubit. It is a bookkeeping device for "this qubit, as time passes", not a physical cable.
- **Time runs from left to right.** A box on a wire is a gate acting on that qubit at that moment.
- A gate drawn on several wires at once (a dot joined to a $\oplus$ for CNOT, for example) acts on those qubits together.
- A meter symbol at the end is a **measurement**: the qubit is read in the computational basis and becomes an ordinary classical bit.
- By convention, every qubit starts in $\lvert 0\rangle$, and qubit 0 is the top wire and the leftmost bit of a bitstring: $\lvert 01\rangle$ means qubit 0 is 0 and qubit 1 is 1.

Everything between the start and the measurements is **unitary**: reversible, norm-preserving, and with no randomness at all. The only random step is the measurement, which samples a bitstring with probability $\lvert\text{amplitude}\rvert^2$. So a quantum program is "deterministic evolution of a state vector, then one random readout".`},{t:"widget",name:"composer",props:{preset:"bell"},caption:"The Bell circuit: H on qubit 0, then CNOT from qubit 0 to qubit 1. Step through it one gate at a time and watch the state vector change. After the Hadamard the state is (|00> + |10>)/sqrt2; after the CNOT it is (|00> + |11>)/sqrt2. Run the measurement and notice you only ever see 00 or 11."},{t:"md",text:m`### A circuit is a product of unitaries

Each gate on $n$ qubits is a $2^n\times 2^n$ unitary matrix (a gate on one qubit is extended with the identity on the others). Applying gate $A$ and then gate $B$ to a state gives $B(A\lvert\psi\rangle)$. Matrices act on the vector from the left, so the **first gate in the diagram is the rightmost matrix**:

$$\text{diagram: } \lvert\psi\rangle\xrightarrow{A}\xrightarrow{B}\quad\Longleftrightarrow\quad U = B\,A .$$

This reversal trips up almost every newcomer, and it matters because matrices usually do not commute.

**Worked example.** Take one qubit starting in $\lvert 0\rangle$ and compare "H then Z" with "Z then H".

- H then Z: $U=ZH$, so $ZH\lvert 0\rangle=Z\lvert +\rangle=\lvert -\rangle=\tfrac1{\sqrt2}(\lvert 0\rangle-\lvert 1\rangle)$.
- Z then H: $U=HZ$, so $HZ\lvert 0\rangle=H\lvert 0\rangle=\lvert +\rangle=\tfrac1{\sqrt2}(\lvert 0\rangle+\lvert 1\rangle)$.

Different circuits, different states, and measuring in the Z basis is the same 50/50 coin in both cases, so only a later gate (or an X-basis measurement) can tell them apart. That is a small taste of why phases matter so much in the rest of this course.`},{t:"callout",kind:"math",title:"Parallel versus sequential",text:m`Gates on different wires at the same time combine with the tensor product: $A$ on qubit 0 and $B$ on qubit 1 together is $A\otimes B$. Gates one after another combine with the ordinary matrix product, in reverse diagram order. A circuit is therefore built from just two operations, $\otimes$ for side by side and $\cdot$ for one after another.`},{t:"md",text:m`## Universality: a few gates are enough

Do we need a different physical gate for every computation? No. A finite gate set is **universal** if products of its gates can approximate any unitary on any number of qubits to any desired accuracy $\epsilon$. Two facts are worth remembering.

1. **Single-qubit gates plus CNOT are universal.** Any $n$-qubit unitary can be decomposed exactly into arbitrary single-qubit rotations and CNOTs. The decomposition may be exponentially long, but that is the general case; the useful algorithms have short circuits.
2. **A finite set suffices too.** The set $\{H, T, \text{CNOT}\}$, with $T=\mathrm{diag}(1,e^{i\pi/4})$, generates a dense set of unitaries, so it can approximate everything. The **Solovay-Kitaev theorem** says the approximation is cheap: reaching accuracy $\epsilon$ for a single-qubit gate takes only $O(\log^{c}(1/\epsilon))$ gates from the set, a polynomial in $\log(1/\epsilon)$, with $c$ a small constant. Intuitively you refine an approximation recursively: each level of recursion corrects the error of the previous one, shrinking it quickly. Dedicated synthesis methods do even better, needing roughly $3\log_2(1/\epsilon)$ T gates for a Z rotation.

### Clifford gates and the special role of T

The **Clifford gates** $H$, $S=\mathrm{diag}(1,i)$ and CNOT form a closed family. Circuits made only of them, starting from basis states, can be simulated on an ordinary computer in polynomial time (the Gottesman-Knill theorem), even though they can produce entanglement. They are not enough for quantum advantage. Adding **one** non-Clifford gate, the $T$ gate, completes the set.

This is why $T$ is the expensive gate. In error-corrected machines (a later lesson), Clifford gates are comparatively cheap to protect, while $T$ must be built from specially prepared "magic states" that are distilled through many rounds of error detection. In many fault-tolerant estimates the T count, not the total gate count, sets the cost of a program. Compilers therefore work hard to reduce it.`},{t:"widget",name:"gate-explorer",caption:"Pick H, S and T in turn. Check each matrix is unitary, and see that T is a rotation by pi/4 about the z axis, half of S, which is half of Z. Then see how H turns a z-rotation into an x-rotation. Combinations of just these rotations can steer a qubit anywhere on the sphere, which is the geometric picture behind universality."},{t:"callout",kind:"history",title:"Where the circuit model came from",text:m`Early quantum computation was described with Turing machines. David Deutsch's 1989 paper introduced the circuit model, which turned out to be much easier to reason about, and Andrew Yao showed in 1993 that the two models are equivalent in power. Today nearly all algorithms and hardware are described with circuits.`},{t:"md",text:m`## The three-step recipe of quantum algorithms

Most quantum algorithms, from Deutsch-Jozsa to Grover to phase estimation, share one skeleton.

1. **Superposition.** Put the input register in a uniform superposition (usually with Hadamards) so that a single circuit run touches every input $x$ at once.
2. **Phase marking (kickback).** Apply a gate that depends on the data, so each $x$ picks up a phase or a label that encodes information, such as $(-1)^{f(x)}$.
3. **Interference.** Apply a second basis change (often more Hadamards, or a Fourier transform) so that amplitudes of unwanted answers cancel and the amplitudes of wanted answers add.

The important caution is that step 1 is **not** the useful part. A quantum computer does not "try all answers and show you the right one": measuring a uniform superposition returns one random input. All the value lies in steps 2 and 3, arranging the phases so that interference concentrates probability on useful outcomes. Steps 2 and 3 in turn rely on one mechanism, which we look at now.

### Phase kickback

Normally we say the control qubit of a controlled gate decides whether the target changes. Quantum mechanics adds a twist: if the target is an **eigenstate** of the gate, the target does not change at all, and the eigenvalue is "kicked back" as a phase onto the control.

**Controlled-U.** Suppose $U\lvert u\rangle=e^{i\varphi}\lvert u\rangle$. The controlled-$U$ gate does nothing if the control is $\lvert 0\rangle$ and applies $U$ if it is $\lvert 1\rangle$, so for a basis control $x\in\{0,1\}$:

$$\lvert x\rangle\lvert u\rangle\;\longmapsto\;e^{i\varphi x}\lvert x\rangle\lvert u\rangle .$$

By linearity, a control in $\lvert +\rangle$ gives

$$\tfrac1{\sqrt2}(\lvert 0\rangle+\lvert 1\rangle)\lvert u\rangle\;\longmapsto\;\tfrac1{\sqrt2}(\lvert 0\rangle+e^{i\varphi}\lvert 1\rangle)\lvert u\rangle .$$

The target is untouched, and the control has acquired a relative phase $\varphi$. This is the heart of phase estimation.

**Worked example with CNOT.** The target of a CNOT applies $X$, and $\lvert -\rangle$ is an eigenstate of $X$ with eigenvalue $-1$, because $X\lvert -\rangle=\tfrac1{\sqrt2}(\lvert 1\rangle-\lvert 0\rangle)=-\lvert -\rangle$. So $\varphi=\pi$ and

$$\text{CNOT}\,\lvert x\rangle\lvert -\rangle=(-1)^x\lvert x\rangle\lvert -\rangle .$$

Feed in the control $\lvert +\rangle$: the result is $\lvert -\rangle\lvert -\rangle$. The control flipped from $\lvert +\rangle$ to $\lvert -\rangle$ even though CNOT is supposedly "control to target". In the X basis the roles have swapped: the former target is now the one that controls.`},{t:"callout",kind:"warn",title:"Kickback is not magic, and not a violation of anything",text:m`Kickback does not send information backwards in time or break causality. It is simply the observation that whether a qubit is "control" or "target" depends on the basis you look in. The CNOT truth table in the Z basis is one description of a unitary; its action in the X basis is another description of the same unitary.`},{t:"md",text:m`### H-CNOT-H is a reversed CNOT

Surround a CNOT (control qubit 0, target qubit 1) with Hadamards on both qubits. Since $H X H=Z$ and $H Z H=X$, a short calculation on the four basis states gives

$$(H\otimes H)\,\text{CNOT}_{0\to 1}\,(H\otimes H)=\text{CNOT}_{1\to 0}.$$

Check one case. Start with $\lvert 0\rangle\lvert 1\rangle$ and apply the three steps in diagram order. First $H\otimes H$ gives $\lvert +\rangle\lvert -\rangle$. The CNOT, by the kickback example, gives $\lvert -\rangle\lvert -\rangle$. The final $H\otimes H$ gives $\lvert 1\rangle\lvert 1\rangle$. A CNOT with control qubit 1 (which holds $\lvert 1\rangle$) and target qubit 0 maps $\lvert 0\rangle\lvert 1\rangle\to\lvert 1\rangle\lvert 1\rangle$, in agreement. The same trick turns CNOT into a **CZ** gate by putting Hadamards on only the target, which is why hardware that natively provides one often gets the other cheaply.`},{t:"widget",name:"composer",props:{preset:"blank",qubits:3},caption:"Exercise. Build a 3-qubit GHZ state: H on qubit 0, then CNOT from 0 to 1, then CNOT from 1 to 2. Predict first that measuring gives 000 and 111 each half the time and never anything else. Then try the other order of the two CNOTs, and a version where you insert an extra H-H pair, to see how the output changes or does not."},{t:"md",text:m`## Oracles: functions as gates

Many algorithms ask about a classical function $f:\{0,1\}^n\to\{0,1\}$ that is given as a black box, an **oracle**. A quantum circuit cannot overwrite its input (that would not be reversible), so the oracle is defined to *add* the answer to an output qubit:

$$U_f\lvert x\rangle\lvert y\rangle=\lvert x\rangle\lvert y\oplus f(x)\rangle .$$

This **bit oracle** is unitary for any $f$, because applying it twice returns $y\oplus f(x)\oplus f(x)=y$. It is its own inverse.

Now set the output qubit to $\lvert -\rangle$. If $f(x)=0$ nothing changes. If $f(x)=1$ the output is flipped, but $X\lvert -\rangle=-\lvert -\rangle$, so only a sign appears. Combining the two cases:

$$U_f\lvert x\rangle\lvert -\rangle=(-1)^{f(x)}\lvert x\rangle\lvert -\rangle .$$

This is phase kickback again, and it yields the **phase oracle** $\lvert x\rangle\mapsto(-1)^{f(x)}\lvert x\rangle$ acting on the input alone, with the helper qubit left unchanged. The phase oracle is the version used in the next lesson, [Deutsch-Jozsa and Bernstein-Vazirani](/lesson/dj-bv), and in [Grover's search](/lesson/grover).

### Uncomputation

Computing $f$ usually needs scratch qubits (ancillas) holding intermediate values $g(x)$. If you leave them, the state becomes $\sum_x\lvert x\rangle\lvert g(x)\rangle$. For different $x$ the junk registers can be orthogonal, and then amplitudes for different $x$ can never interfere, because interference requires the terms to end in the **same** final state. The garbage has effectively measured the input.

The fix is **uncomputation**: copy the answer out (a CNOT onto the output qubit), then run the computation backwards to return the ancillas to $\lvert 0\rangle$. Since every step is reversible, this is always possible, at the price of roughly doubling the gate count.

## No-cloning: why you cannot just copy a qubit

A classical program freely copies variables. A quantum program cannot copy an unknown state.

**Theorem.** No unitary $U$ satisfies $U\lvert\psi\rangle\lvert 0\rangle=\lvert\psi\rangle\lvert\psi\rangle$ for all $\lvert\psi\rangle$.

**Proof.** Suppose it did, for two states $\lvert\phi\rangle$ and $\lvert\psi\rangle$. Taking the inner product of the two output equations, and using that unitaries preserve inner products, gives $\langle\phi\vert\psi\rangle=\langle\phi\vert\psi\rangle^2$. So the overlap is 0 or 1: only identical or orthogonal states can be copied by the same machine. For $\lvert 0\rangle$ and $\lvert +\rangle$ the overlap is $1/\sqrt2$, a contradiction. $\blacksquare$

What it rules out: duplicating arbitrary data, "backing up" a qubit mid-computation, reading an unknown state repeatedly to learn it, and sending signals using clones of an entangled half. What it does **not** rule out: CNOT copies basis states ($\lvert x\rangle\lvert 0\rangle\to\lvert x\rangle\lvert x\rangle$), you can re-prepare any state you know, and teleportation moves a state to a new qubit while destroying the original. Applying CNOT to $\lvert +\rangle\lvert 0\rangle$ makes a Bell pair, not two copies of $\lvert +\rangle$.`},{t:"widget",name:"composer",props:{preset:"swap-test"},caption:"The swap test compares two states without learning either of them. An ancilla in |+> controls a swap, then is measured in the X basis; the probability of reading 0 is (1 + |<a|b>|^2)/2. Identical states always give 0, orthogonal states give 0 only half the time. It estimates an overlap from many runs, and does not violate no-cloning because nothing is copied."},{t:"md",text:m`## Counting the cost: width, depth, gate count

Three numbers describe the size of a circuit.

- **Width**: the number of qubits (including ancillas).
- **Gate count**: the total number of gates, often with two-qubit gates counted separately because they are far noisier than single-qubit gates.
- **Depth**: the number of layers if every gate that can run in parallel does. It is the length of the longest chain of dependent gates.

The Bell circuit has width 2, gate count 2 and depth 2. Three Hadamards on three different qubits have gate count 3 but depth 1.

**Why depth matters.** Today's devices are noisy. If each gate fails with probability $p$, a circuit of $G$ gates succeeds with probability about $(1-p)^G\approx e^{-pG}$. With two-qubit error $p=0.1\%$ and $G=1000$ such gates, that is $0.999^{1000}\approx 0.37$, and at $G=5000$ it drops under 1%. Separately, qubits lose their quantum information on a timescale $T_2$, so a circuit whose total running time (depth times gate time) is much longer than $T_2$ is mostly noise. Good compilers therefore minimise depth and two-qubit gates first.

## From diagram to hardware: QASM and transpilation

Circuits are stored as text. The most common format is **OpenQASM**. The Bell circuit with measurement, in OpenQASM 2.0:

${Q}
OPENQASM 2.0;
include "qelib1.inc";
qreg q[2];      // two qubits, both start in |0>
creg c[2];      // two classical bits
h q[0];         // Hadamard on qubit 0
cx q[0],q[1];   // CNOT, control 0, target 1
measure q[0] -> c[0];
measure q[1] -> c[1];
${Q}

Each line is one gate, in time order. (OpenQASM 3 writes the declarations as qubit[2] q; and bit[2] c; and adds loops and classical control, but gates read the same.)

Real hardware does not implement H or CNOT directly. Each device has a **native gate set**, for instance single-qubit rotations about z together with a square-root-of-X gate, and one two-qubit gate such as CZ or ECR. It also has limited **connectivity**: only certain pairs of qubits can interact. **Transpilation** is the compiler pass that rewrites your circuit into native gates and adds SWAPs (each equal to three CNOTs) to bring distant qubits together, then optimises. For example, up to an irrelevant global phase,

$$H=R_z(\tfrac\pi2)\,\sqrt{X}\,R_z(\tfrac\pi2),$$

and $\text{CNOT}=(I\otimes H)\,\text{CZ}\,(I\otimes H)$. Transpilation can change depth and gate count substantially, so the circuit you draw is not the circuit that runs.`},{t:"widget",name:"bloch",props:{start:"zero",tools:["gates","measure"]},caption:"Try the identity H, then Z, then H on |0>. You end at |1>, because HZH = X. The Hadamard converts a phase flip into a bit flip, which is the same idea that lets kickback turn a phase on the control into a visible change after the final Hadamard."},{t:"md",text:m`## Common misconceptions

- **"The diagram order is the matrix order."** It is the reverse: first gate, rightmost matrix.
- **"Wires carry the qubits between places."** Wires are time lines; qubits usually stay put on the chip.
- **"Superposition means trying every answer."** Measuring gives one random answer. Algorithms work by making wrong answers cancel.
- **"The control qubit is never changed."** In the Z basis it looks that way; in other bases the control can be the one that changes (kickback).
- **"More qubits means a better computer."** Without low error and shallow circuits, extra width cannot be used.

Next, we put these ingredients to work in [Deutsch-Jozsa and Bernstein-Vazirani](/lesson/dj-bv), the smallest examples of the superposition, kickback and interference recipe, and then in [Grover's algorithm](/lesson/grover).`}],quiz:[{q:"A circuit applies gate A first and then gate B to one qubit. Which matrix represents the whole circuit?",options:["$AB$","$BA$","$A\\otimes B$","$A+B$"],answer:1,explain:"Matrices act on the state vector from the left, so the first gate applied is the rightmost factor: $U=BA$. The tensor product $A\\otimes B$ is for gates acting side by side on different qubits."},{q:"A CNOT has its target in $\\lvert -\\rangle$ and its control in $\\lvert +\\rangle$. What is the output?",options:["$\\lvert +\\rangle\\lvert -\\rangle$ (unchanged)","$\\lvert -\\rangle\\lvert -\\rangle$","$\\lvert +\\rangle\\lvert +\\rangle$","A Bell state"],answer:1,explain:"$\\lvert -\\rangle$ is an eigenstate of $X$ with eigenvalue $-1$, so CNOT maps $\\lvert x\\rangle\\lvert -\\rangle$ to $(-1)^x\\lvert x\\rangle\\lvert -\\rangle$. The control $(\\lvert 0\\rangle+\\lvert 1\\rangle)/\\sqrt2$ becomes $(\\lvert 0\\rangle-\\lvert 1\\rangle)/\\sqrt2=\\lvert -\\rangle$. The state stays a product state, so it is not a Bell state."},{q:"Why do fault-tolerant quantum computers treat the T gate as the expensive one?",options:["T is not unitary, so it needs extra hardware","T can only be applied to one qubit at a time","Clifford gates are cheap to protect, but T needs distilled magic states","T is the only gate that creates entanglement"],answer:2,explain:"T is unitary and acts on one qubit. It is expensive because it lies outside the Clifford group, so protecting it needs magic-state distillation, which uses many physical qubits and time. Entanglement can be made with Clifford gates alone (H and CNOT)."},{q:"Why must an oracle circuit uncompute its scratch qubits before the interference step?",options:["Leftover junk registers can hold information about $x$, which destroys interference between different inputs","Scratch qubits would otherwise be measured automatically","Unitary circuits are required to end with every qubit in $\\lvert 0\\rangle$","It makes the circuit shallower"],answer:0,explain:"If the ancilla ends in a state $\\lvert g(x)\\rangle$ that depends on $x$, different inputs end in different orthogonal states and cannot interfere, as if $x$ had been measured. Running the computation backwards resets the ancillas. It actually adds gates, so it does not make the circuit shallower."},{q:"Each two-qubit gate on a device fails independently with probability 0.1%. Roughly how likely is a 1000-gate circuit to run with no error?",options:["About 99%","About 90%","About 37%","About 0.1%"],answer:2,explain:"The success probability is $(1-0.001)^{1000}\\approx e^{-1}\\approx 0.37$. This is why depth and two-qubit gate count are the figures of merit on noisy hardware."}],takeaways:["A circuit is wires (qubits) read left to right; its matrix is the product of gate matrices in reverse diagram order, with a tensor product for gates in parallel.","Single-qubit gates plus CNOT are universal, and a finite set like H, T, CNOT approximates any unitary efficiently (Solovay-Kitaev); T is the costly non-Clifford ingredient.","Quantum algorithms follow superposition, phase marking via kickback, then interference; superposition alone gives nothing useful.","Phase kickback means an eigenstate target hands its eigenvalue to the control as a phase; H-CNOT-H reverses a CNOT, and the phase oracle comes from a bit oracle with target in $\\lvert -\\rangle$.","No-cloning forbids copying unknown states; depth, width and gate count measure circuit cost, and transpilation turns your circuit into native gates, which changes those numbers."]},te=Object.freeze(Object.defineProperty({__proto__:null,lesson:ee},Symbol.toStringTag,{value:"Module"})),v=String.raw,Z="```",ae={id:"complex-vectors",order:2,part:"Foundations",title:"Complex Numbers & Vectors",summary:"Build the number system and the geometry of vectors that quantum states live in, and see why phase is the hidden ingredient of interference.",minutes:30,objectives:["You can convert complex numbers between rectangular and polar form and use Euler's formula.","You can compute the conjugate, modulus and phase of a complex number and multiply complex numbers geometrically.","You can compute inner products and norms of complex vectors and test for orthogonality and normalisation.","You can explain why phases are invisible in single amplitudes but decisive when amplitudes combine."],blocks:[{t:"md",text:v`## Why complex numbers?

Quantum states are described by lists of **complex numbers**. This is not an arbitrary choice of notation: experiments (interference patterns, spin measurements in different directions) cannot be explained with ordinary probabilities, and the simplest mathematics that works uses complex amplitudes. In this lesson we build everything we need, starting from nothing.

### The imaginary unit

The equation $x^2 = -1$ has no real solution. We invent a symbol $i$ with the property
$$i^2 = -1.$$
A **complex number** is $z = a + bi$ with $a, b$ real. We call $a = \mathrm{Re}(z)$ the real part and $b = \mathrm{Im}(z)$ the imaginary part. Arithmetic works as with polynomials, replacing $i^2$ by $-1$:
$$(1+2i)(3-i) = 3 - i + 6i - 2i^2 = 3 + 5i + 2 = 5 + 5i.$$

Every complex number is a point in a plane: $z = a + bi$ sits at horizontal coordinate $a$ and vertical coordinate $b$. This is the **complex plane**, and it is the single most useful picture in this lesson.

### Conjugate and modulus

The **complex conjugate** flips the sign of the imaginary part: $\overline{a+bi} = a - bi$ (written $z^*$ in physics: we will use $z^*$ from now on). It reflects the point across the horizontal axis. The key product:
$$z\,z^* = (a+bi)(a-bi) = a^2 + b^2,$$
which is a non-negative real number. Its square root is the **modulus** (length, absolute value) $|z| = \sqrt{a^2+b^2}$, the distance from the origin. So $|z|^2 = z^* z$. Remember this identity: probabilities in quantum mechanics are always of the form $|{\rm amplitude}|^2$.`},{t:"md",text:v`## Polar form and Euler's formula

A point can be located by distance and angle instead of by horizontal and vertical offsets. Write $r = |z|$ and let $\varphi$ be the angle from the positive real axis (the **phase** or **argument**, $\varphi = \arg z$). Then
$$z = r(\cos\varphi + i\sin\varphi).$$
Euler's formula packages the bracket into an exponential:
$$e^{i\varphi} = \cos\varphi + i\sin\varphi, \qquad\text{so}\qquad z = r\,e^{i\varphi}.$$
Why is this believable? Both sides satisfy $f' = i f$ with $f(0)=1$, and the Taylor series of $\cos$ and $\sin$ combine exactly into the series of the exponential with an $i$ inserted. Special cases worth memorising:

$$e^{i0}=1,\quad e^{i\pi/2}=i,\quad e^{i\pi}=-1,\quad e^{i3\pi/2}=-i,\quad e^{2\pi i}=1.$$

A number $e^{i\varphi}$ has modulus exactly 1: $|e^{i\varphi}|^2 = \cos^2\varphi+\sin^2\varphi = 1$. These "pure phase factors" live on the **unit circle** and will be the quantum gates' favourite tool.

### Multiplication is rotation plus scaling

In polar form, multiplication is easy:
$$r_1e^{i\varphi_1}\cdot r_2e^{i\varphi_2} = r_1r_2\,e^{i(\varphi_1+\varphi_2)}.$$
**Moduli multiply, phases add.** Multiplying by $e^{i\theta}$ therefore rotates a point by $\theta$ about the origin without changing its length. Multiplying by $i$ is a rotation by $90^\circ$. Division uses the conjugate: $1/z = z^*/|z|^2$, and for a unit-modulus number $1/e^{i\varphi} = e^{-i\varphi} = (e^{i\varphi})^*$.`},{t:"widget",name:"complex-plane",caption:"Drag the point to see rectangular and polar coordinates update together. Then multiply two numbers: check that the moduli multiply and the phases add. Finally set the modulus to 1 and sweep the angle: Euler's formula traces the unit circle. Try reaching -1 (angle 180 degrees)."},{t:"callout",kind:"math",title:"Worked example",text:v`Take $z = 1 + i$. Then $|z| = \sqrt{2}$ and $\varphi = \arctan(1/1) = \pi/4$, so $z = \sqrt2\,e^{i\pi/4}$. Compute $z^2$ both ways. Rectangular: $(1+i)^2 = 1 + 2i + i^2 = 2i$. Polar: $(\sqrt2)^2 e^{i\pi/2} = 2i$. They agree. Now $z/|z| = (1+i)/\sqrt2 = e^{i\pi/4}$, a phase factor, which you will meet again as the T-gate's phase.`},{t:"md",text:v`## Vectors: lists of numbers with geometry

A **vector** is an ordered list of numbers. In $\mathbb{R}^2$ a vector $\begin{pmatrix}x\\y\end{pmatrix}$ is an arrow in the plane. Vectors can be added componentwise and scaled by numbers. In quantum computing the numbers are complex, and the space of $n$-component complex vectors is called $\mathbb{C}^n$. A qubit lives in $\mathbb{C}^2$:
$$\begin{pmatrix}\alpha\\ \beta\end{pmatrix}, \qquad \alpha,\beta\in\mathbb{C}.$$

### Inner product, norm and orthogonality

For real vectors, the **dot product** $u\cdot v = u_1v_1+u_2v_2$ measures how aligned two arrows are. For complex vectors we must conjugate the first one:
$$\langle u | v\rangle = u_1^* v_1 + u_2^* v_2.$$
The notation $\langle u|v\rangle$ is the **inner product**; it is a single complex number. (Lesson 3 explains where the angle brackets come from.) The conjugate is essential because it makes the "length squared" non-negative:
$$\langle v|v\rangle = |v_1|^2+|v_2|^2 \ge 0.$$
The **norm** is $\|v\| = \sqrt{\langle v|v\rangle}$. A vector is **normalised** (a unit vector) when $\|v\|=1$. Quantum states are always unit vectors, because the squared magnitudes of amplitudes are probabilities that must sum to 1.

Two vectors are **orthogonal** when $\langle u|v\rangle = 0$: in physical terms, perfectly distinguishable states. A set of mutually orthogonal unit vectors is **orthonormal**. The standard basis
$$e_0=\begin{pmatrix}1\\0\end{pmatrix},\quad e_1=\begin{pmatrix}0\\1\end{pmatrix}$$
is orthonormal, and so is the "Hadamard basis"
$$h_+=\tfrac{1}{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix},\quad h_-=\tfrac{1}{\sqrt2}\begin{pmatrix}1\\-1\end{pmatrix}.$$
Check: $\langle h_+|h_-\rangle = \tfrac12(1\cdot1 + 1\cdot(-1)) = 0$ and $\langle h_+|h_+\rangle = \tfrac12(1+1)=1$. Any vector can be written in any orthonormal basis; its coordinates are inner products: $v = \langle h_+|v\rangle h_+ + \langle h_-|v\rangle h_-$.`},{t:"callout",kind:"math",title:"Worked example: a complex inner product",text:v`Let $u = \tfrac{1}{\sqrt2}\begin{pmatrix}1\\ i\end{pmatrix}$ and $v=\tfrac{1}{\sqrt2}\begin{pmatrix}1\\ -i\end{pmatrix}$. Norm of $u$: $\tfrac12(|1|^2+|i|^2)=1$, so it is normalised. Inner product: $\langle u|v\rangle = \tfrac12(1^*\cdot1 + i^*\cdot(-i)) = \tfrac12(1 + (-i)(-i)) = \tfrac12(1 + i^2) = 0$. So $u,v$ are orthogonal even though neither is real. Had we forgotten the conjugate, we would have computed $\tfrac12(1 + i\cdot(-i)) = \tfrac12(1+1)=1$: wrong. These two vectors will reappear as the "Y-basis" states $|{+i}\rangle, |{-i}\rangle$ in Lesson 5.`},{t:"md",text:v`## Why phases matter

Here is the idea that separates quantum from classical probability. Suppose a qubit's amplitude for outcome "1" can be reached by two routes with amplitudes $a_1$ and $a_2$. The total amplitude is $a_1+a_2$ and the probability is $|a_1+a_2|^2$, not $|a_1|^2+|a_2|^2$. Write $a_1 = \tfrac12$ and $a_2=\tfrac12 e^{i\varphi}$. Then
$$|a_1+a_2|^2 = \tfrac14\,|1+e^{i\varphi}|^2 = \tfrac14(2+2\cos\varphi)=\tfrac12(1+\cos\varphi).$$
For $\varphi=0$ the routes reinforce (probability 1); for $\varphi=\pi$ they cancel exactly (probability 0). The phase $\varphi$ is invisible if you look at either route alone ($|a_1|^2$ and $|a_2|^2$ do not depend on it), but it controls the combined result. This is exactly what you will see in the double-slit and Mach–Zehnder widgets in Lesson 4.

### Global versus relative phase

Multiplying an entire vector by $e^{i\gamma}$ leaves every $|{\rm amplitude}|^2$ unchanged, and, as we will see in Lesson 5, cannot be detected by any measurement. This is **global phase**, and it is physically meaningless. The phase *between* components, the **relative phase**, is meaningful: $\frac{1}{\sqrt2}(1,1)$ and $\frac{1}{\sqrt2}(1,-1)$ differ only in relative phase, yet they are orthogonal, perfectly distinguishable states.`},{t:"callout",kind:"warn",title:"Common pitfalls",text:v`(1) Phase is not "just a sign": signs are phases of $0$ or $\pi$, but any angle is allowed. (2) Conjugating *both* vectors, or neither, in the inner product breaks positivity: always conjugate the left one. (3) $|z|^2$ is $z^*z$, **not** $z^2$ (e.g. $|i|^2=1$ but $i^2=-1$). (4) Never treat amplitudes as probabilities: amplitudes can be negative or complex, probabilities cannot.`},{t:"md",text:v`## A preview: roots of unity

One family of complex numbers will return in Lesson 14 (the quantum Fourier transform). The solutions of $z^N = 1$ are the $N$ **roots of unity**
$$\omega_N^k = e^{2\pi i k/N},\qquad k=0,1,\dots,N-1,$$
which sit at equally spaced points on the unit circle. For $N=4$ they are $1, i, -1, -i$; for $N=8$ the first step is $e^{i\pi/4} = (1+i)/\sqrt2$. Because $|\omega_N^k|=1$, multiplying by one of them only rotates. They obey a beautiful cancellation: $\sum_{k=0}^{N-1}\omega_N^{jk}=0$ unless $j$ is a multiple of $N$. Check for $N=4$, $j=1$: $1+i-1-i=0$. This is destructive interference in its purest form, and it is the engine behind Fourier transforms and Shor's algorithm.

Notice also how the ideas of this lesson fit together: complex numbers give amplitudes with phase, the inner product gives probabilities, and orthonormal bases give the different "questions" we can ask of a state. In Lesson 3 we will add the missing piece, operations that map unit vectors to unit vectors, called unitary matrices.`},{t:"md",text:v`## Try it in code

NumPy handles complex numbers natively (using ${"`1j`"} for $i$). Note that ${"`np.vdot`"} conjugates its first argument, exactly the physicist's inner product.

${Z}python
import numpy as np

z = 1 + 1j
print(abs(z), np.angle(z), z**2)          # 1.414..., 0.785..., 2j
print(np.exp(1j*np.pi))                   # -1 (up to rounding)

u = np.array([1,  1j]) / np.sqrt(2)
v = np.array([1, -1j]) / np.sqrt(2)
print(np.vdot(u, v))                      # ~0  (orthogonal)
print(np.vdot(u, u).real)                 # 1.0 (normalised)

# phase matters when amplitudes combine
for phi in (0, np.pi/2, np.pi):
    a = 0.5 + 0.5*np.exp(1j*phi)
    print(round(phi,2), abs(a)**2)         # 1.0, 0.5, 0.0
${Z}

Run it and compare the last three numbers with $\tfrac12(1+\cos\varphi)$. You are now equipped for Lesson 3, where lists of numbers become matrices and quantum operations.`}],quiz:[{q:"What is the modulus squared |z|^2 of z = 3 - 4i, and how is it computed?",options:["z^2 = -7 - 24i","25, computed as z*z with z* = 3 + 4i","7, from 3 + (-4)","-25, since i^2 = -1"],answer:1,explain:"|z|^2 = z* z = (3+4i)(3-4i) = 9 + 16 = 25. It is always a non-negative real number and differs from z^2, which is complex."},{q:"You multiply z1 = 2e^{i pi/6} by z2 = 3e^{i pi/3}. What is the result?",options:["6 e^{i pi/2}","5 e^{i pi/2}","6 e^{i pi/18}","5 e^{i pi/6}"],answer:0,explain:"Moduli multiply (2 x 3 = 6) and phases add (pi/6 + pi/3 = pi/2). So the product is 6e^{i pi/2} = 6i."},{q:"The inner product <u|v> conjugates the first vector. Why is that necessary?",options:["So that <v|v> = sum of |v_k|^2 is a non-negative real number that defines length.","Because complex numbers cannot be multiplied otherwise.","To make all inner products equal to 1.","It is only a notational convention with no consequences."],answer:0,explain:"Without the conjugate, <v|v> could be complex or negative (for v = (1, i) it would give 1 + i^2 = 0), so it could not define a length or a probability. The conjugate guarantees positivity."},{q:"Two amplitudes 1/2 and (1/2)e^{i phi} lead to the same outcome. For which phi is the outcome probability zero?",options:["phi = 0","phi = pi/2","phi = pi","phi = 2 pi"],answer:2,explain:"Total amplitude is (1/2)(1 + e^{i phi}), with probability (1+cos phi)/2. At phi = pi, e^{i pi} = -1 and the two routes cancel exactly (destructive interference). At 0 or 2 pi they add fully."},{q:"Which pair of statements about phase is correct?",options:["Global phase and relative phase are both physically measurable.","Neither is ever measurable.","Global phase is unobservable; relative phase between components is observable through interference.","Relative phase is unobservable; global phase is observable."],answer:2,explain:"Multiplying everything by e^{i gamma} changes no probability. A relative phase between components changes how they interfere, so it changes measurement statistics after suitable gates."}],takeaways:["A complex number is a point in a plane: z = a + bi = r e^{i phi}, with |z|^2 = z* z.","Multiplying complex numbers multiplies moduli and adds phases; multiplying by e^{i theta} is a rotation.","The inner product <u|v> conjugates the left vector, giving lengths, orthogonality and coordinates in any orthonormal basis.","Quantum states are unit vectors in C^n; probabilities are squared moduli of amplitudes.","Relative phases control interference; global phase is unobservable."]},ie=Object.freeze(Object.defineProperty({__proto__:null,lesson:ae},Symbol.toStringTag,{value:"Module"})),x=String.raw,re={id:"complexity-roadmap",order:20,part:"NISQ & Beyond",title:"Complexity, Advantage and Your Roadmap",summary:'What "quantum advantage" really means, where speedups are proven, where they are hype, and exactly what to learn next.',minutes:28,objectives:["You can place BQP among P, NP and BPP and say what is and is not known.",'You can separate exponential, quadratic and "no known" speedups, and name an example of each.',"You can read a quantum-advantage claim critically using a four-question checklist.","You can describe the road from noisy devices to fault-tolerant machines and where near-term value is plausible.","You know concrete next steps for your own learning at beginner, intermediate and advanced level."],blocks:[{t:"md",text:x`## Complexity in plain words

Complexity theory asks: **how does the cost of solving a problem grow with its size $n$?** Cost is counted in elementary steps. A problem is called *tractable* if the cost grows like a polynomial ($n^2$, $n^3$) and *intractable* if it grows exponentially ($2^n$).

The classes you will meet most often:

- **P**: problems a classical computer solves in polynomial time (sorting, shortest paths, multiplying numbers).
- **NP**: problems whose proposed answer can be *checked* in polynomial time (factoring, Sudoku, travelling salesman decisions). Every problem in P is in NP. Whether P = NP is still open.
- **BPP**: problems a classical computer with random coins solves in polynomial time with small error probability. Widely believed to equal P.
- **BQP**: problems a quantum computer solves in polynomial time with error probability at most $1/3$ (repeat to shrink it).

The known relationships are

$$\text{P} \subseteq \text{BPP} \subseteq \text{BQP} \subseteq \text{PSPACE}.$$

That is nearly all that has been *proved*. Whether BQP is strictly larger than BPP is open, just like P vs NP. Every statement of the form "quantum computers are faster at X" is therefore either a proof in a restricted model (such as black-box queries), a conditional claim ("if factoring is hard classically…"), or an empirical observation.

### What BQP is not

A very common misconception is that quantum computers "solve NP-complete problems by trying every answer at once". There is **no evidence** that BQP contains NP-complete problems, and strong evidence in the query model that it does not: Grover search is optimal, so the best generic quantum attack on a brute-force problem is a *square-root* saving, not a collapse of exponential to polynomial.

Picture it as overlapping regions: BQP contains P and BPP, contains some problems believed outside P (factoring, discrete logarithms), and is believed *not* to contain NP-complete problems. Factoring sits in a gap: it is in NP, apparently not NP-complete, and quantum computers solve it in polynomial time.`},{t:"widget",name:"speedup-chart",caption:"Three speed-up shapes. Factoring: super-polynomial to polynomial (Shor). Search: quadratic (Grover). Simulation: the original motivation. Note the log scale on the vertical axis."},{t:"md",text:x`## The landscape of speedups

It helps to sort every claimed quantum speedup into one of three buckets.

### Exponential (or super-polynomial) speedups

- **Simulating quantum systems** (molecules, materials, nuclear physics). A system of $n$ qubits needs $2^n$ amplitudes classically, but only $n$ qubits quantumly. This is the most natural advantage, argued by Feynman in 1981.
- **Factoring and discrete logarithms** (Shor, 1994): see the Shor lesson.
- **Structured problems** such as hidden-subgroup problems and certain algebraic tasks.
- **Linear-algebra routines (HHL and relatives)** solve certain linear systems in time polylogarithmic in the matrix size. The caveats are severe: you must load the data into amplitudes (which can cost as much as the speedup saves), the matrix must be sparse and well-conditioned, and you only get a *summary* of the solution, not the vector. Several once-promising "quantum machine learning" speedups were later matched by *dequantized* classical algorithms (Ewin Tang, 2018 onward).

### Quadratic speedups

- **Grover search**: $N \to \sqrt{N}$ queries, provably optimal.
- **Amplitude estimation**: error $\epsilon$ in $1/\epsilon$ instead of $1/\epsilon^2$ samples, which speeds up Monte Carlo methods.
- **Quantum walks**: quadratic gains for many graph and search problems.

A quadratic speedup sounds small but can matter enormously: $2^{128} \to 2^{64}$ is the difference between impossible and conceivable. However, quantum gates are much slower and costlier (error-corrected) than classical ones, so a quadratic gain only wins for very large problems.

### No known speedup

Most of the problems people hope to speed up: general NP-hard optimisation, generic machine learning, sorting, database lookup with classical data. For these, "quantum" may still help through heuristics, but there is no theorem.`},{t:"callout",kind:"warn",title:"Constants matter",text:x`Asymptotic speedups hide the cost of error correction. A fault-tolerant quantum operation can cost thousands of physical gates and is far slower than a classical one. Break-even problem sizes can be enormous, so "provable speedup" does not automatically mean "practical advantage".`},{t:"md",text:x`## Advantage experiments

Since 2019 several groups have run **random circuit sampling** and **boson sampling** experiments: tasks designed so that classical simulation is as hard as possible while a noisy quantum device can still run them. The claim in each case is "this device performed a computation that would take a classical supercomputer an absurdly long time".

A balanced reading:

1. These experiments are real physics achievements. They show that large, entangled, noisy devices can be controlled well enough to leave classical brute-force methods far behind.
2. The tasks were chosen *because* they favour quantum hardware. They have **no known practical use**.
3. Classical researchers have repeatedly found smarter simulation methods (tensor networks, exploiting noise) that cut the estimated classical cost dramatically, so claimed gaps have narrowed and been argued back and forth.
4. Noise is the central issue: the output of a noisy device has low fidelity, and verifying it is itself hard.

Treat "supremacy" experiments as milestones on the engineering road, not as evidence that useful applications have arrived.

### A critical-reading checklist

When you see a headline, ask four questions:

1. **What exactly is the problem**, and does anyone need its answer?
2. **What is the classical baseline?** The *best known* classical algorithm, run on good hardware, or a straw man?
3. **What are the error bars?** Fidelity, number of shots, how the answer was verified.
4. **How does it scale?** One data point proves little; the question is how both quantum and classical costs grow with size.`},{t:"widget",name:"qaoa",caption:"QAOA on a small MaxCut instance: heuristic, p = 1. Note how the landscape has a clear best (γ, β) but the approximation ratio is not 1. Whether such heuristics beat classical solvers at scale is an open empirical question."},{t:"md",text:x`## Quantum machine learning, honestly

Quantum machine learning (QML) is a broad label for three different ideas:

- **Quantum algorithms for classical data** (HHL-style). Hindered by data loading and dequantization, as above.
- **Quantum models** (variational circuits, quantum kernels) run on classical data. These are *heuristics*. Training can suffer from **barren plateaus**: for random deep circuits, gradients vanish exponentially in the number of qubits, which makes optimisation impossible.
- **Quantum data** (learning properties of states produced by quantum experiments). Here proven advantages exist in some settings, because classical machines cannot even read the data efficiently.

**Quantum reservoir computing** fits an interesting niche: the quantum system is *not trained at all*. Its natural dynamics provide a rich nonlinear feature map, and only a linear readout is learned, which sidesteps barren plateaus. It is a natural fit for noisy devices because noise can even act as useful "fading memory". Whether it beats classical reservoirs at scale is still being explored.`},{t:"widget",name:"reservoir",caption:"Quantum reservoir computing, simulated exactly with density matrices. Compare it against a classical echo-state network with the same number of features."},{t:"md",text:x`## The fault-tolerance roadmap

Most people describe three eras:

1. **NISQ** (noisy intermediate-scale quantum, the term is due to Preskill): tens to a few thousand physical qubits, no error correction, circuits limited to modest depth. Useful as a research platform; practical advantage unproven.
2. **Early fault-tolerant**: a small number of *logical* qubits protected by error-correcting codes, enough for modest but valuable chemistry or simulation workloads.
3. **Large-scale fault-tolerant**: thousands of logical qubits and billions of gates, which is what Shor on RSA-sized numbers or high-accuracy chemistry needs.

The central equation of fault tolerance is the **threshold theorem**: if each physical operation fails with probability below a threshold (roughly $10^{-2}$ for the surface code, in typical models), then adding more physical qubits suppresses the logical error rate *exponentially*, roughly

$$p_L \approx A\left(\frac{p}{p_{\text{th}}}\right)^{(d+1)/2},$$

where $d$ is the code distance. Cost: a rough order of magnitude is hundreds to a thousand physical qubits per logical qubit at current error rates, and non-Clifford gates such as $T$ need expensive *magic-state distillation*. Recent experiments have shown logical error rates falling as the code distance grows, the first clear evidence the approach works in practice. Roadmaps from the major hardware companies target useful fault-tolerant machines late this decade or in the next, but timelines have always been uncertain, so check current announcements rather than trusting any single date.`},{t:"widget",name:"qec",caption:"Below threshold, bigger codes win exponentially; above it, they hurt. This is the whole logic of fault tolerance in one chart."},{t:"md",text:x`## Where near-term value is plausible

- **Chemistry and materials**: ground-state energies (VQE and, later, phase estimation) for catalysts, batteries, nitrogen fixation. Likely first area for real value, probably requiring early fault tolerance.
- **Quantum sensing and communication**: already commercially real (clocks, magnetometers, QKD links), though not "computing".
- **Optimisation heuristics**: speculative; must beat strong classical solvers, which is hard.
- **Cryptography**: the urgent consequence is *defensive*: migrate to post-quantum cryptography now, because encrypted data can be harvested today and decrypted later.

### Try it: variational chemistry

The VQE widget minimises the energy of the hydrogen molecule with a one-parameter circuit. It is tiny, but it is exactly the loop that larger NISQ chemistry experiments run.`},{t:"widget",name:"vqe",caption:"VQE on H₂: the classical optimiser (Adam) tunes one angle until the energy reaches the exact ground state."},{t:"md",text:x`## Your roadmap

You have now covered the full arc: complex numbers and linear algebra, the qubit and the Bloch sphere, gates, multi-qubit systems and entanglement, measurement and noise, the circuit model, the great algorithms (Deutsch–Jozsa, Grover, QFT/QPE, Shor), variational and reservoir methods, error correction, hardware and cryptography, and the complexity-theoretic picture. That is a genuine foundation. Here is what to do with it.

### If you are a beginner

- Redo the **Bloch puzzles** and the **Circuit Composer** until you can predict the output *before* you run a circuit. Intuition for interference is the skill that transfers.
- Write the Bell, GHZ, teleportation and Grover circuits from memory.
- Read *Quantum Computer Science* by Mermin, or work through IBM Quantum Learning.

### If you are intermediate

- Install a framework (Qiskit, Cirq or PennyLane) and reproduce every circuit from this course in code. Run them on a simulator, then on real hardware, and compare against the noise lab.
- Work through *Nielsen & Chuang* chapters 1–6 with exercises.
- Implement a small VQE or QAOA with a classical optimiser of your choice.

### If you are advanced

- Read *Preskill's lecture notes* on error correction and fault tolerance, then the surface-code literature.
- Study complexity: oracle separations, BQP vs the polynomial hierarchy, dequantization.
- Pick a research frontier: compilation, error mitigation, quantum chemistry resource estimates, quantum reservoir computing.

## A last word

Quantum computing rewards patience. The field is genuinely deep and genuinely early; hype will rise and fall, but the mathematics you have learned here does not change. Use the **Circuit Composer** and **Playground** to keep experimenting, the **Glossary** and **Cheat sheet** when you forget a formula, and the **Resources** tab for what to read next. Welcome to the field.`}],quiz:[{q:"Which statement about BQP is currently **proved**?",options:["BQP contains all of NP.","P ⊆ BPP ⊆ BQP ⊆ PSPACE.","BQP is strictly larger than BPP.","BQP equals P."],answer:1,explain:"Only the containments are proved. Whether BQP is strictly larger than BPP is open, and there is no evidence BQP contains NP."},{q:"Grover search gives which kind of speedup for unstructured search over $N$ items?",options:["Exponential","Quadratic","Logarithmic","None"],answer:1,explain:"Grover needs about $\\sqrt{N}$ queries instead of about $N$, and the BBBV theorem proves no quantum algorithm can do better in the black-box model."},{q:'Why can a "provable" quantum speedup still fail to be practically useful?',options:["Quantum computers cannot run algorithms with polynomial cost.","Error-corrected quantum operations are far slower and costlier, so break-even sizes can be huge.","Asymptotic analysis is invalid for quantum algorithms.","Quantum speedups only exist for very small inputs."],answer:1,explain:"Asymptotic scaling ignores constants. Fault-tolerant operations cost thousands of physical gates each, so a quadratic or even polynomial advantage may need enormous problem sizes to pay off."},{q:"Which question belongs on a critical-reading checklist for a quantum-advantage headline?",options:["How many qubits does the press release mention?","What is the best known classical baseline, and how do the two costs scale?","Which company announced it?","Does the device operate at low temperature?"],answer:1,explain:"A claim is only meaningful against the best classical method, with error bars and scaling. Qubit count, brand and temperature say little on their own."},{q:"What does the threshold theorem say?",options:["Quantum computers can never be made fault tolerant.","If physical error rates are below a threshold, increasing code size suppresses logical errors exponentially.","Noise is irrelevant below 50%.","Error correction always needs exactly three qubits."],answer:1,explain:"Below threshold, adding redundancy (larger code distance) drives the logical error rate down exponentially; above it, more redundancy makes things worse."}],takeaways:['Only $\\text{P} \\subseteq \\text{BPP} \\subseteq \\text{BQP} \\subseteq \\text{PSPACE}$ is proved; BQP vs NP is believed to be "no containment".',"Speedups come in three kinds: exponential (simulation, Shor), quadratic (Grover) and none known for most NP-hard problems.","Always ask: what problem, what baseline, what error bars, what scaling?","Fault tolerance works below a threshold error rate, at the cost of hundreds of physical qubits per logical qubit.","Your next step: code the circuits in Qiskit/Cirq/PennyLane and keep experimenting in the Composer."]},ne=Object.freeze(Object.defineProperty({__proto__:null,lesson:re},Symbol.toStringTag,{value:"Module"})),E="```",se={id:"dj-bv",order:12,part:"Circuits & Algorithms",title:"Deutsch–Jozsa & Bernstein–Vazirani",summary:"The first quantum algorithms: learn a hidden property of a black-box function with a single query, and understand exactly what that does and does not prove.",minutes:30,objectives:["You can explain the oracle (black-box) model and count algorithms by the number of queries they make.","You can run Deutsch's one-qubit algorithm by hand and explain it with phase kickback.","You can derive that the amplitude of $|0\\ldots0\\rangle$ in Deutsch–Jozsa is $\\pm1$ for constant functions and $0$ for balanced ones.","You can derive why Bernstein–Vazirani returns the secret string $s$ with certainty after one query.","You can state honestly what these speedups mean: they are oracle-relative and, for Deutsch–Jozsa, only against deterministic classical algorithms."],blocks:[{t:"md",text:String.raw`## The oracle model: counting questions, not steps

Most of this course measures cost in gates. The algorithms in this lesson use a different, cleaner yardstick: **queries**. We imagine a black box (an **oracle**) that computes a function $f$ which we may only learn about by feeding it inputs. The cost of an algorithm is the number of times it calls the box. Everything else is free for the purposes of the comparison.

This is useful because it lets us *prove* separations, which is rare in complexity theory. Proving that a problem needs a million steps on a classical computer is usually out of reach; proving that it needs a million **queries** is sometimes easy.

### How a quantum computer calls an oracle

A classical function $f:\{0,1\}^n\to\{0,1\}$ is usually not reversible, so we cannot apply it directly as a quantum gate. The standard trick is to keep the input and write the answer into an extra **ancilla** (helper) qubit by XOR:

$$U_f\,|x\rangle|y\rangle = |x\rangle|y\oplus f(x)\rangle .$$

Here $x$ is an $n$-bit string, $y$ is one bit, and $\oplus$ is addition modulo 2. $U_f$ is a permutation of basis states, hence unitary. Because it is linear, feeding it a superposition of inputs returns a superposition of outputs. **This does not mean we can read all values of $f$.** One run gives a single measurement outcome, and the interesting question is whether interference can concentrate the amplitude on an answer that depends on *all* of $f$ at once.

### The problem class

All three algorithms are **promise problems**: we are told $f$ has a special structure and must identify which one.

| Problem | Promise | Goal | Best deterministic classical | Quantum |
|---|---|---|---|---|
| Deutsch ($n=1$) | any $f:\{0,1\}\to\{0,1\}$ | constant or balanced? | 2 queries | 1 |
| Deutsch–Jozsa | $f$ constant or balanced | which one? | $2^{n-1}+1$ | 1 |
| Bernstein–Vazirani | $f(x)=s\cdot x \bmod 2$ | find $s$ | $n$ | 1 |

*Balanced* means $f(x)=0$ for exactly half of the $2^n$ inputs and $1$ for the other half. The dot product is $s\cdot x=s_1x_1\oplus\cdots\oplus s_nx_n$.`},{t:"md",text:String.raw`## Phase kickback: the one trick behind everything

Set the ancilla to the state $|-\rangle=(|0\rangle-|1\rangle)/\sqrt2$ (that is, $H|1\rangle$). Apply $U_f$ to $|x\rangle|-\rangle$:

$$U_f|x\rangle|-\rangle=\frac{1}{\sqrt2}\big(|x\rangle|f(x)\rangle-|x\rangle|1\oplus f(x)\rangle\big)=(-1)^{f(x)}\,|x\rangle|-\rangle .$$

Check both cases. If $f(x)=0$ the bracket is $|0\rangle-|1\rangle$, unchanged. If $f(x)=1$ the bracket is $|1\rangle-|0\rangle=-(|0\rangle-|1\rangle)$, a minus sign. So the ancilla is untouched, and the value $f(x)$ has been **kicked back** into the sign (phase) in front of $|x\rangle$. By linearity, for any superposition $\sum_x a_x|x\rangle$ of inputs,

$$U_f\Big(\sum_x a_x|x\rangle\Big)|-\rangle=\Big(\sum_x (-1)^{f(x)}a_x|x\rangle\Big)|-\rangle .$$

The oracle is now a **phase oracle**: it multiplies each amplitude by $\pm1$ according to $f$. A global look at $f$ is stored in relative signs, which are invisible to direct measurement but visible to interference. The algorithms below differ only in the final interference step. (Lesson 10 introduced this; it returns in Grover's algorithm next.)

### Deutsch's problem by hand

Take a single input bit. There are four functions: $f_{00}$ and $f_{11}$ are constant (always 0, always 1); $f_{01}(x)=x$ and $f_{10}(x)=1\oplus x$ are balanced. Classically you must query both inputs to compare $f(0)$ with $f(1)$. The quantum circuit uses **one** call:

1. Start in $|0\rangle|1\rangle$.
2. Apply $H$ to both qubits: $|+\rangle|-\rangle$.
3. Apply $U_f$. By kickback the first qubit becomes $\tfrac1{\sqrt2}\big((-1)^{f(0)}|0\rangle+(-1)^{f(1)}|1\rangle\big)$.
4. Apply $H$ to the first qubit. Factoring out $(-1)^{f(0)}$, the state is $\tfrac1{\sqrt2}\big(|0\rangle+(-1)^{f(0)\oplus f(1)}|1\rangle\big)$ before $H$, i.e. $|+\rangle$ if $f$ is constant and $|-\rangle$ if balanced. After $H$ it is $|0\rangle$ or $|1\rangle$.
5. Measure the first qubit: $0$ means constant, $1$ means balanced, with certainty.

The quantity that was computed, $f(0)\oplus f(1)$, is a *global* property of $f$. The oracle never reveals either value individually.`},{t:"widget",name:"composer",props:{preset:"deutsch"},caption:"Load the Deutsch preset. Run it, then read the measurement probabilities of the first qubit. Now swap the oracle between a constant one (identity or a bare X on the ancilla) and a balanced one (CNOT from the input to the ancilla): the input qubit should read 0 with probability 1 for constant and 1 with probability 1 for balanced. The result is never 50/50."},{t:"md",text:String.raw`## Deutsch–Jozsa: derivation for $n$ qubits

Now let $f:\{0,1\}^n\to\{0,1\}$ be either constant or balanced. Let $N=2^n$. The circuit uses $n$ input qubits in $|0\ldots0\rangle$ and one ancilla in $|1\rangle$:

1. Apply $H^{\otimes n}$ to the inputs and $H$ to the ancilla. Since $H|0\rangle=|+\rangle$, the input register becomes the uniform superposition $\frac1{\sqrt N}\sum_x|x\rangle$ and the ancilla is $|-\rangle$.
2. Call the oracle once. By kickback the input register is $\frac1{\sqrt N}\sum_x(-1)^{f(x)}|x\rangle$.
3. Apply $H^{\otimes n}$ again and measure the inputs.

We need the **Hadamard transform** of a basis state: $H^{\otimes n}|x\rangle=\frac1{\sqrt N}\sum_y(-1)^{x\cdot y}|y\rangle$, where $x\cdot y=\bigoplus_i x_iy_i$. (Each qubit contributes a factor $(-1)^{x_iy_i}$, and these multiply.) Therefore the final state is

$$\frac1N\sum_y\Big[\sum_x(-1)^{f(x)+x\cdot y}\Big]|y\rangle .$$

The bracket divided by $N$ is the amplitude of $|y\rangle$. Look at $y=0\ldots0$, where $x\cdot y=0$ for all $x$:

$$a_{0\ldots0}=\frac1N\sum_x(-1)^{f(x)} .$$

- **Constant $f$:** every term equals $(-1)^{f(0)}$, so $a_{0\ldots0}=\pm1$. The measurement gives $0\ldots0$ with probability **1**.
- **Balanced $f$:** half the terms are $+1$, half are $-1$, so $a_{0\ldots0}=0$. The measurement can **never** return $0\ldots0$.

So: measure the inputs; if every bit is $0$, $f$ is constant, otherwise balanced. One query, no error.

### The classical comparison, stated carefully

A **deterministic** classical algorithm that must always be right needs $2^{n-1}+1$ queries in the worst case: after $2^{n-1}$ identical answers the function could still be balanced. That is exponentially more than $1$.

But a **randomised** classical algorithm that may err with small probability does far better. Query $k$ random inputs and answer "constant" only if all answers agree. A constant function is never misjudged, and a balanced function fools you with probability $2^{1-k}$. Thirty queries give error below $10^{-9}$, regardless of $n$. So against realistic classical competition, Deutsch–Jozsa shows **no** meaningful quantum advantage.`},{t:"callout",kind:"warn",title:"What Deutsch–Jozsa does and does not show",text:String.raw`It shows an exponential separation between exact quantum and exact deterministic classical query algorithms (in the oracle model). It does **not** show that quantum computers solve a useful problem faster, and it is not a speedup over randomised classical algorithms. Its value is historical and conceptual: it was the first proof that quantum queries can beat classical ones at all, and it exposes the interference mechanism that Simon's, Shor's and Grover's algorithms refine.`},{t:"widget",name:"composer",props:{preset:"dj-const"},caption:"Run the dj-const preset (3 input qubits plus an ancilla, constant oracle). Read the probabilities of the three input qubits: |000> should have probability 1. Then open dj-bal (balanced oracle) and run it: |000> should have probability exactly 0, and the weight lands on some other string. Inspect the circuit to see which gates make the oracle balanced."},{t:"md",text:String.raw`## Bernstein–Vazirani: reading a secret string in one shot

Now promise that $f(x)=s\cdot x \bmod 2$ for an unknown secret $s\in\{0,1\}^n$. Each query to a classical oracle returns one bit. Querying $x=100\ldots0$ returns $s_1$, querying $010\ldots0$ returns $s_2$, and so on. Classically you need $n$ queries, and since each query yields at most one bit of information about the $n$-bit secret, even **randomised** classical algorithms need $n$ queries. This is a real, though only linear, query separation.

The quantum circuit is *literally the same circuit* as Deutsch–Jozsa, with an oracle that implements $s\cdot x$ (a CNOT from input qubit $i$ to the ancilla for every $i$ with $s_i=1$). The derivation above gives amplitudes

$$a_y=\frac1N\sum_x(-1)^{s\cdot x+x\cdot y}=\frac1N\sum_x(-1)^{(s\oplus y)\cdot x}.$$

The sum $\sum_x(-1)^{t\cdot x}$ equals $N$ if $t=0\ldots0$ and $0$ otherwise. (If some $t_i=1$, flipping bit $x_i$ toggles the sign, so terms cancel in pairs.) Hence $a_y=1$ when $y=s$ and $0$ otherwise: the measurement returns the secret $s$ with probability $1$.

### Worked example: $s=101$

Here $f(x)=x_1\oplus x_3$, so the oracle is two CNOTs, from qubits 1 and 3 onto the ancilla. After the first layer of Hadamards and the oracle, the input register holds $\frac1{\sqrt8}\sum_x(-1)^{x_1\oplus x_3}|x\rangle$. This state factorises as $|-\rangle\otimes|+\rangle\otimes|-\rangle$ because the sign depends only on bits 1 and 3. A Hadamard maps $|-\rangle\to|1\rangle$ and $|+\rangle\to|0\rangle$, so the output is $|1\rangle|0\rangle|1\rangle$. We read $s=101$ directly.`},{t:"widget",name:"composer",props:{preset:"bv"},caption:"Run the bv preset and read off the measured 3-bit string: it is the secret s encoded in the oracle. Count which input qubits have a CNOT to the ancilla; those positions are the 1s of s. Edit the oracle by adding or removing a CNOT and watch the output string change in exactly that bit, still with probability 1."},{t:"md",text:String.raw`## Reading the fine print, and a short simulation

**Query complexity is not total cost.** The single oracle call hides the work of building $U_f$ as gates. For an arbitrary function given as a lookup table that cost is exponential. The comparison is only fair when $f$ is a circuit whose size is itself small, as in Bernstein–Vazirani, where it is at most $n$ CNOTs. Also, the quantum algorithm uses $n+1$ qubits and $O(n)$ extra gates (the Hadamard layers), so in the gate model it runs in time $O(n)$ plus the oracle.

**A pattern of separations.** The list is: Deutsch–Jozsa (exact, exponential vs deterministic only), Bernstein–Vazirani (linear, but also vs randomised), Simon's problem (1994; exponential vs even randomised classical algorithms, in the oracle model) and then Shor's algorithm, which grew out of Simon's idea. Each one reuses the same recipe: *superpose, query with phase kickback, interfere with a Fourier-type transform (here the Hadamard transform), measure.*

**What to remember about "all inputs at once".** The state after step 1 holds all $2^n$ inputs in superposition, but it would be wrong to say the algorithm "evaluates $f$ on every input and picks the answer". Measuring right after the oracle returns a random $x$ and tells you only $f(x)$ (hidden in a sign, not even that). The algorithm works because the final Hadamards turn a *global sum* over signs into the amplitude of a single outcome.

Here is a NumPy check of Bernstein–Vazirani, with the oracle as a sign vector. (In Qiskit, bitstrings print little-endian, so qubit 0 is the rightmost character; here we use ordinary big-endian indices.)

${E}python
import numpy as np
n, s = 3, 0b101
N = 2**n
H1 = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
Hn = H1
for _ in range(n - 1):
    Hn = np.kron(Hn, H1)

parity = lambda v: bin(v).count("1") % 2
phase = np.array([(-1) ** parity(s & x) for x in range(N)])  # (-1)^{s.x}
psi = Hn @ (phase * (Hn @ np.eye(N)[0]))                      # H, oracle, H
print(np.round(abs(psi) ** 2, 3))    # all weight on index 5 = 101
${E}

The output is a vector with a single $1$ at index 5, matching $s=101$.`}],quiz:[{q:String.raw`In Deutsch's algorithm the first qubit is measured and reads 1. What do you conclude?`,options:[String.raw`$f$ is constant`,String.raw`$f$ is balanced, i.e. $f(0)\neq f(1)$`,String.raw`$f(0)=1$`,String.raw`The result is random and tells us nothing`],answer:1,explain:String.raw`Before the last Hadamard the qubit is $|+\rangle$ if $f(0)\oplus f(1)=0$ and $|-\rangle$ if it is $1$. The Hadamard maps these to $|0\rangle$ and $|1\rangle$ deterministically. Reading 1 therefore means $f(0)\neq f(1)$, which is balanced for one bit. It does not reveal $f(0)$ individually.`},{q:String.raw`In Deutsch–Jozsa on $n$ qubits, the amplitude of $|0\ldots0\rangle$ at the end is $\frac1N\sum_x(-1)^{f(x)}$. If $f$ is balanced, what is the probability of measuring all zeros?`,options:["1",String.raw`$1/2$`,String.raw`$1/2^n$`,"0"],answer:3,explain:String.raw`A balanced function has exactly $N/2$ inputs with $f=0$ and $N/2$ with $f=1$, so the signs cancel exactly and the amplitude is $0$. Measuring all zeros is impossible, which is why a single run is conclusive.`},{q:String.raw`Why is it misleading to say Deutsch–Jozsa shows a quantum speedup over classical computers in general?`,options:[String.raw`The algorithm sometimes gives wrong answers`,String.raw`A randomised classical algorithm solves it with a constant number of queries and tiny error, so the exponential gap is only against deterministic exact algorithms`,String.raw`It requires more than $n$ qubits`,String.raw`Oracles cannot be implemented`],answer:1,explain:String.raw`Querying a few random inputs separates constant from balanced with error $2^{1-k}$ after $k$ queries, independent of $n$. The exponential separation holds only against deterministic zero-error classical algorithms in the oracle model.`},{q:String.raw`In Bernstein–Vazirani with $f(x)=s\cdot x$, the final amplitude of $|y\rangle$ is $\frac1N\sum_x(-1)^{(s\oplus y)\cdot x}$. For which $y$ is it nonzero?`,options:[String.raw`Only $y=s$`,String.raw`Only $y=0\ldots0$`,String.raw`All $y$ equally`,String.raw`Exactly the $y$ with the same parity as $s$`],answer:0,explain:String.raw`If $s\oplus y\neq 0$ the signs cancel in pairs and the sum is $0$. If $y=s$ every term is $+1$ and the amplitude is $1$. So the output is exactly the secret string.`},{q:String.raw`What is the role of the ancilla prepared in $|-\rangle$?`,options:[String.raw`It stores a copy of the input`,String.raw`It makes the oracle write $f(x)$ as a sign $(-1)^{f(x)}$ in front of $|x\rangle$ (phase kickback) while staying unchanged`,String.raw`It measures the output`,String.raw`It provides the randomness for the algorithm`],answer:1,explain:String.raw`$|-\rangle$ is an eigenstate of $X$ with eigenvalue $-1$, so XOR-ing $f(x)$ into it just multiplies by $(-1)^{f(x)}$. The ancilla returns to $|-\rangle$ and the oracle acts as a phase oracle on the inputs.`}],takeaways:["In the oracle model we count queries; separations there can be proved, but they are relative to the black box.","Phase kickback with the ancilla in |−⟩ turns the XOR oracle into a sign (−1)^{f(x)} on each basis state.","Deutsch–Jozsa: one query decides constant vs balanced, because the amplitude of |0…0⟩ is (1/N)Σ(−1)^{f(x)}; it beats only deterministic classical algorithms.","Bernstein–Vazirani: one query returns the secret s exactly, versus n queries even for randomised classical algorithms.","The shared recipe (superpose, query, Fourier-type interference, measure) is the template for Simon, Shor and Grover."]},oe=Object.freeze(Object.defineProperty({__proto__:null,lesson:se},Symbol.toStringTag,{value:"Module"})),le=t=>"```python\n"+t+"\n```",he={id:"entanglement",order:8,part:"The Qubit",title:"Entanglement, Bell States & CHSH",summary:"Entangled qubits show correlations that no local classical mechanism can reproduce; the CHSH inequality turns that claim into an experiment with a classical limit of 2 and a quantum limit of 2 sqrt 2.",minutes:40,objectives:["You can write the four Bell states, produce each from |00> with H and CNOT, and predict their measurement correlations in the Z and X bases.","You can prove the no-cloning theorem and explain why it does not contradict classical copying of basis states.","You can state the CHSH game, show that the best classical strategy wins 75% of the time, and derive the quantum strategy winning cos^2(pi/8), about 85%.","You can explain why entanglement cannot be used to send messages faster than light, and state what monogamy of entanglement means."],blocks:[{t:"md",text:String.raw`## Bell states

The four **Bell states** are the standard examples of maximally entangled two-qubit states:

$$|\Phi^\pm\rangle=\tfrac1{\sqrt2}(|00\rangle\pm|11\rangle),\qquad |\Psi^\pm\rangle=\tfrac1{\sqrt2}(|01\rangle\pm|10\rangle).$$

They form an orthonormal basis of the two-qubit space (the **Bell basis**). All four are made from $|00\rangle$ by a Hadamard on qubit 0 and a CNOT (giving $|\Phi^+\rangle$), preceded by $X$ and/or $Z$ gates on the inputs to reach the others: $X$ on qubit 1 first gives $|\Psi^+\rangle$, $Z$ on qubit 0 first gives $|\Phi^-\rangle$, and both give $|\Psi^-\rangle$.

### What is special about them

Measure both qubits of $|\Phi^+\rangle$ in the $Z$ basis. Each outcome alone is a fair coin (probability 1/2 each), but the two outcomes **always agree**: 00 or 11, never 01 or 10. Nothing strange yet; two gloves in two boxes behave similarly (open one, learn the other).

The strangeness shows up when you also measure in other bases. $|\Phi^+\rangle$ can be rewritten in the $X$ basis:

$$|\Phi^+\rangle=\tfrac1{\sqrt2}(|{+}{+}\rangle+|{-}{-}\rangle),$$

so measuring *both* qubits along $x$ also gives perfectly correlated results. More generally, for measurement directions in the $x$-$z$ plane at angles $a$ and $b$ from the $z$ axis, with outcomes $\pm1$, the correlation is

$$E(a,b)=\langle A(a)\otimes A(b)\rangle=\cos(a-b),\qquad A(\theta)=\cos\theta\,Z+\sin\theta\,X.$$

**Derivation.** Expand $A(a)\otimes A(b)=\cos a\cos b\,Z\!\otimes\! Z+\sin a\sin b\,X\!\otimes\! X+\cos a\sin b\,Z\!\otimes\! X+\sin a\cos b\,X\!\otimes\! Z$. For $|\Phi^+\rangle$ we have $\langle ZZ\rangle=\langle XX\rangle=1$ and $\langle ZX\rangle=\langle XZ\rangle=0$, giving $\cos a\cos b+\sin a\sin b=\cos(a-b)$.

So the correlation depends only on the *angle between* the two detectors, and it is perfect when they are aligned. A glove-in-a-box model can reproduce the aligned case but, as Bell showed, not the full cosine curve at once.`},{t:"md",text:String.raw`## No-cloning: you cannot copy an unknown state

Classical data can be copied freely. Quantum states cannot.

**Theorem (no-cloning, Wootters-Zurek-Dieks 1982).** There is no unitary $U$ and fixed blank state $|s\rangle$ such that $U|\psi\rangle|s\rangle=|\psi\rangle|\psi\rangle$ for *all* states $|\psi\rangle$.

**Proof.** Suppose such a $U$ exists and take two states $|\phi\rangle,|\psi\rangle$. Then $U|\phi\rangle|s\rangle=|\phi\rangle|\phi\rangle$ and $U|\psi\rangle|s\rangle=|\psi\rangle|\psi\rangle$. Unitaries preserve inner products, so taking the inner product of the two equations gives

$$\langle\phi|\psi\rangle\langle s|s\rangle=\langle\phi|\psi\rangle^2.$$

Since $\langle s|s\rangle=1$, we get $\langle\phi|\psi\rangle=\langle\phi|\psi\rangle^2$, so $\langle\phi|\psi\rangle\in\{0,1\}$. That means any two states that a cloner can copy are either identical or orthogonal. A machine that clones *every* state would need this for non-orthogonal pairs such as $|0\rangle$ and $|+\rangle$ (overlap $1/\sqrt2$), a contradiction. $\blacksquare$

**What it does and does not say.**

- You *can* copy known states by preparing them again, and you *can* copy basis states (CNOT does $|x\rangle|0\rangle\to|x\rangle|x\rangle$). You cannot copy an *unknown* state, or one of a set of non-orthogonal possibilities.
- It is a feature, not a bug: quantum key distribution is secure because an eavesdropper cannot clone the qubits in transit, and the proof also implies (via linearity) that no measurement can reveal an unknown state without disturbing it.
- Do not confuse cloning with **teleportation**, which *moves* a state and destroys the original (Teleportation lesson).
- Applying CNOT to $|+\rangle|0\rangle$ yields the Bell state $|\Phi^+\rangle$, not $|+\rangle|+\rangle$: the "copy" is a correlation, not a second independent state.`},{t:"widget",name:"tensor-lab",caption:"Enter the four Bell states in turn, for example (1,0,0,-1)/sqrt2 for the minus Phi state. Confirm each has maximal concurrence (1). Then tilt the amplitudes slowly toward a product state such as (1,0,0,0) and watch the entanglement measure fall smoothly from 1 to 0, so entanglement comes in degrees, not just on or off."},{t:"md",text:String.raw`## Bell's inequality and the CHSH game

In 1935 Einstein, Podolsky and Rosen argued that quantum mechanics must be incomplete: if measuring one half of an entangled pair instantly fixes the outcome of the other, there must be pre-existing "hidden" values. In 1964 John Bell showed that this is a *testable* question. The cleanest version is due to Clauser, Horne, Shimony and Holt (CHSH, 1969).

### The game

Alice and Bob are far apart and cannot communicate. A referee sends Alice a random bit $x$ and Bob a random bit $y$. They reply with bits $a$ and $b$. They **win** if

$$a\oplus b=x\wedge y,$$

that is, they must answer the *same* unless both inputs are 1, in which case they must answer *differently*.

**Classical limit.** Any local strategy, even one using shared randomness, is a mixture of deterministic strategies $a=f(x)$, $b=g(y)$. Winning on all four input pairs would require $f(0)=g(0)$, $f(0)=g(1)$, $f(1)=g(0)$ and $f(1)\neq g(1)$; chain the first three to get $f(1)=g(1)$, a contradiction. So at least one pair is lost, and the best classical win probability is $3/4$. Always answering 0 achieves it.

### Correlator form

Encode answers as $\pm1$ and let $E(x,y)$ be the average of the product of answers. Then

$$S=E(0,0)-E(0,1)+E(1,0)+E(1,1)$$

(measurement settings $a,a'$ for Alice and $b,b'$ for Bob). For deterministic $\pm1$ values $A,A',B,B'$,

$$S=A(B-B')+A'(B+B').$$

One of $B-B'$ and $B+B'$ is 0 and the other is $\pm2$, so $|S|=2$. Averaging over hidden variables keeps $|S|\le2$. This is the **CHSH inequality**: any local hidden-variable theory obeys $|S|\le 2$. The win probability is $\tfrac12+\tfrac S8$, so $S=2$ is 75%.`},{t:"md",text:String.raw`## The quantum violation and Tsirelson's bound

Use $|\Phi^+\rangle$ and the correlation $E(a,b)=\cos(a-b)$ derived earlier. Choose the detector angles

$$a=0,\quad a'=\tfrac\pi2,\quad b=\tfrac\pi4,\quad b'=\tfrac{3\pi}4.$$

Then

$$E(a,b)=\cos\tfrac\pi4=\tfrac1{\sqrt2},\; E(a,b')=\cos\tfrac{3\pi}4=-\tfrac1{\sqrt2},\; E(a',b)=\cos\tfrac\pi4=\tfrac1{\sqrt2},\; E(a',b')=\cos\tfrac\pi4=\tfrac1{\sqrt2},$$

so

$$S=\tfrac1{\sqrt2}+\tfrac1{\sqrt2}+\tfrac1{\sqrt2}+\tfrac1{\sqrt2}=2\sqrt2\approx2.828>2.$$

The win probability is $\tfrac12+\tfrac{2\sqrt2}8=\cos^2\tfrac\pi8\approx0.854$, compared with $0.75$ classically. Where do these angles come from? Alice's two settings should be perpendicular, Bob's two settings should be perpendicular, and each of Bob's should bisect Alice's pair; then every term of $S$ has the same magnitude, $\cos45^\circ$, and the signs line up.

**Tsirelson's bound.** No quantum strategy beats $2\sqrt2$. Proof sketch: let $A,A',B,B'$ be $\pm1$-valued observables (squares equal $I$) with Alice's commuting with Bob's. Expanding, $S^2=4I-[A,A'][B,B']$. Each commutator has operator norm at most 2, so $\|S^2\|\le 4+4=8$ and $|S|\le2\sqrt2$. Quantum theory therefore sits strictly between the classical bound 2 and the algebraic maximum 4 (reached by hypothetical "PR boxes"), a fact that still intrigues foundations researchers.

### Why this matters, and caveats

Experiments (Aspect 1982, then loophole-free tests in 2015 and later) observe $S\approx2.4$ to $2.8$, violating the bound. This rules out *local* hidden variables; it does not rule out all hidden variables (Bohmian mechanics is non-local), and it does not show anything travels faster than light, as the next section explains. The 2022 Nobel Prize in Physics went to Aspect, Clauser and Zeilinger for this line of work.`},{t:"widget",name:"chsh",caption:"Set Alice angles to 0 and 90 degrees and Bob angles to 45 and 135 degrees, then run many rounds. Observe S approach 2.83 and the win rate approach 85%. Now move the angles around: find settings where S falls below 2 (no violation), and confirm that no setting you try ever exceeds 2.83. Compare with the classical strategy bound of 2 shown for reference."},{t:"callout",kind:"history",title:"From philosophy to laboratory",text:String.raw`Einstein called the correlations "spooky action at a distance" and hoped hidden variables would restore a classical picture. Bell (1964) showed the question was experimentally decidable, Clauser and Freedman ran the first test in 1972, Aspect closed the setting-choice loophole in 1982, and in 2015 several groups (Delft, NIST, Vienna) closed the detection and locality loopholes simultaneously. The experimental verdict: nature violates Bell inequalities.`},{t:"md",text:String.raw`## No signalling, GHZ states and monogamy

### Entanglement cannot send messages

If Alice's measurement choice instantly changed Bob's result, could they communicate? No. Bob's own statistics are described by the **reduced state** of his qubit. For any Bell state, Bob's qubit is the maximally mixed state $I/2$ (we derive this by partial trace in the next lesson): a fair coin, whatever Alice does or does not measure, and in whichever basis. The correlation appears only when the two *lists* of results are brought together over an ordinary channel. This is the **no-communication theorem**: shared entanglement does not allow signalling. It is also why Bell violation is consistent with relativity.

### GHZ states

With three qubits, $|\mathrm{GHZ}\rangle=\tfrac1{\sqrt2}(|000\rangle+|111\rangle)$ is made by $H$ on qubit 0 followed by CNOTs from qubit 0 to qubits 1 and 2. It is the "all or nothing" state: all three read 0 or all three read 1. Measuring one qubit in $Z$ collapses the others; measuring in $X$ gives results whose product is fixed ($XXX$ has eigenvalue $+1$ on this state). GHZ states give even starker contradictions with local hidden variables, with no inequality needed (the Greenberger-Horne-Zeilinger argument).

### Monogamy

Entanglement cannot be shared freely. If qubits A and B are in a *maximally* entangled pure state, then neither is entangled with a third qubit C; the pair is uncorrelated with anything else. Quantitatively, for three qubits the Coffman-Kundu-Wootters inequality says $C_{AB}^2+C_{AC}^2\le 4\det\rho_A$ (a bound involving the concurrence $C$ and the reduced state $\rho_A$). In GHZ, tracing out one qubit leaves *classical* correlation, no entanglement between the remaining two. Monogamy underlies quantum cryptography security and the physics of black holes.

`+le(`from qiskit import QuantumCircuit
ghz = QuantumCircuit(3)
ghz.h(0); ghz.cx(0, 1); ghz.cx(0, 2)
# Qiskit is little-endian, but GHZ results '000' and '111' read the same either way.`)},{t:"widget",name:"composer",props:{preset:"ghz"},caption:"Run the GHZ preset: only 000 and 111 appear, each at 50%. Then delete the second CNOT and see 00 and 11 on the first two qubits while qubit 2 stays 0. Add an H on all three qubits after the GHZ preparation and read the result: only even-parity strings (000, 011, 101, 110) occur, a signature of the GHZ phase relationship."}],quiz:[{q:String.raw`Which gate sequence applied to $|00\rangle$ produces $|\Psi^-\rangle=\tfrac1{\sqrt2}(|01\rangle-|10\rangle)$?`,options:["X on both qubits is not needed; use X on qubit 1, Z on qubit 0, then H on qubit 0 and CNOT (control 0, target 1)","H on qubit 0 and CNOT only","Z on both qubits then CNOT","SWAP on |00>"],answer:0,explain:String.raw`Preparing $|01\rangle$ then applying $Z$ on qubit 0 and then $H$, CNOT gives $|\Psi^-\rangle$: $|01\rangle\xrightarrow{Z\otimes I}|01\rangle$ with $Z$ acting before $H$ yields the minus sign after $H$. H plus CNOT alone makes $|\Phi^+\rangle$; Z on $|00\rangle$ does nothing and SWAP leaves $|00\rangle$ alone.`},{q:"In the no-cloning proof, what step forces the overlap of two clonable states to be 0 or 1?",options:["Unitarity preserves inner products, giving <phi|psi> = <phi|psi>^2","The blank state must be |0>","Measurement collapses the state","Cloning is impossible for superpositions of three or more states"],answer:0,explain:String.raw`Taking the inner product before and after $U$ gives $\langle\phi|\psi\rangle=\langle\phi|\psi\rangle^2$, whose only solutions are 0 and 1. The choice of blank state and measurement play no role.`},{q:"What is the maximum CHSH value allowed by any local hidden-variable theory, and by quantum mechanics?",options:["2 and 2 sqrt 2 (about 2.83)","1 and 2","2 and 4","2 sqrt 2 and 4"],answer:0,explain:String.raw`Local models satisfy $|S|\le2$. Quantum mechanics reaches $2\sqrt2$ (Tsirelson). The value 4 is the algebraic maximum, attained only by hypothetical non-quantum "PR boxes".`},{q:"Alice measures her half of an entangled pair and sees 0. Why can Bob not tell from his own results alone whether she measured?",options:["His reduced state is the maximally mixed state I/2 either way, so his outcomes are fair coins regardless of what Alice does","Because Bob always gets 0","Because light is faster than the measurement","Because entanglement only appears after both qubits are measured together"],answer:0,explain:String.raw`Bob's local statistics are fixed by his reduced density matrix, which for a Bell state is $I/2$. Correlations show up only when Alice's and Bob's records are compared through a classical channel.`},{q:String.raw`The best classical strategy wins the CHSH game with probability 3/4. If the CHSH value is $S$, what is the winning probability?`,options:[String.raw`$\tfrac12+\tfrac S8$, which is about 0.854 for $S=2\sqrt2$`,String.raw`$S/4$, which is 0.707 for $S=2\sqrt2$`,String.raw`$S/2$`,String.raw`$\tfrac12+\tfrac S4$`],answer:0,explain:String.raw`Each of the four input pairs is equally likely and contributes $(1\pm E)/2$ to the win probability, so $P=\tfrac12+\tfrac S8$. At $S=2$ this is $0.75$ and at $S=2\sqrt2$ it equals $\cos^2(\pi/8)\approx0.854$.`}],takeaways:["Bell states are the four maximally entangled two-qubit states; each is made from |00> by X/Z, H and CNOT.","No-cloning follows from unitarity preserving inner products: unknown states cannot be copied, which also underlies quantum cryptography.","CHSH: any local hidden-variable theory has |S| <= 2 (win 75%); entangled qubits at angles 0, 90, 45, 135 degrees reach 2 sqrt 2 (win cos^2(pi/8), 85%), and Tsirelson showed this is the quantum maximum.","Entanglement cannot signal: each party alone sees fair coins (reduced state I/2) and the correlation appears only on comparing records.","GHZ states extend entanglement to three or more qubits; entanglement is monogamous and cannot be shared without limit."]},ce=Object.freeze(Object.defineProperty({__proto__:null,lesson:he},Symbol.toStringTag,{value:"Module"})),ue={id:"error-correction",order:18,part:"NISQ & Beyond",title:"Error Correction & Fault Tolerance",summary:"Protect fragile quantum information by spreading it over many qubits and measuring only the errors, never the data.",minutes:45,objectives:["You can explain why copying is impossible and why continuous errors still become correctable.","You can work through the 3-qubit bit-flip code: encode, apply an error, read the syndrome, correct.","You can describe the phase-flip code and how the Shor 9-qubit code combines both.","You can read a stabilizer and a [[n,k,d]] label, and say how many errors a distance-d code corrects.","You can state the threshold theorem, the surface-code scaling formula, and honestly summarise experimental status."],blocks:[{t:"md",text:String.raw`## Why quantum error correction looks impossible, and why it is not

Classical computers fight noise by **redundancy**: store a bit three times and take a majority vote. Quantum information seems to rule this out for three reasons:

1. **No-cloning.** You cannot copy an unknown state, so $|\psi\rangle\mapsto|\psi\rangle|\psi\rangle|\psi\rangle$ is forbidden.
2. **Measurement destroys superposition.** Looking at the qubits to check for errors would collapse the very state we want to protect.
3. **Errors are continuous.** A qubit can drift by a tiny rotation angle, and there are infinitely many possible small errors. How can finitely many checks fix a continuum?

All three have an answer, and together they are one of the great ideas of the 1990s (Shor 1995, Steane 1996, and others).

**Against 1:** we do not copy the state; we *encode* it into an entangled state of many qubits, for example $\alpha|0\rangle+\beta|1\rangle\mapsto\alpha|000\rangle+\beta|111\rangle$. This is not three copies (that would be $(\alpha|0\rangle+\beta|1\rangle)^{\otimes3}$); it is a joint state that spreads the amplitudes.

**Against 2:** we measure only **parities** (for example "do qubits 1 and 2 agree?"), which reveal *where an error happened* but nothing about $\alpha$ and $\beta$. Information about the error without information about the data is exactly what we need.

**Against 3:** this is the deepest point. Any single-qubit error operator can be written as a combination of $I,X,Y,Z$:

$$E=e_0 I+e_1X+e_2Y+e_3Z .$$

When we measure a syndrome, the state is *projected* onto one of the branches, so the continuous error collapses to either "nothing happened" or "a definite Pauli happened". A code that corrects $X$ and $Z$ errors on each qubit (and hence $Y=iXZ$) therefore corrects *every* single-qubit error. This is called **digitisation of errors**. Measurement turns analog noise into discrete, correctable events.

There is a fourth challenge specific to practice: the correction circuits themselves are noisy. Making that work is called **fault tolerance**, discussed later in this lesson.`},{t:"md",text:String.raw`## The 3-qubit bit-flip code

Start with just one kind of error: a **bit flip** $X$ that swaps $|0\rangle\leftrightarrow|1\rangle$, occurring on each qubit independently with probability $p$.

**Encode.** Given $|\psi\rangle=\alpha|0\rangle+\beta|1\rangle$ on qubit 1 and two ancillas in $|0\rangle$, apply CNOT from qubit 1 to qubit 2 and from qubit 1 to qubit 3. Using big-endian order (qubit 1 leftmost):

$$|\psi_L\rangle=\alpha|000\rangle+\beta|111\rangle .$$

The two basis states of the **logical qubit** are $|0_L\rangle=|000\rangle$ and $|1_L\rangle=|111\rangle$.

**Syndrome measurement.** Measure the two commuting observables $Z_1Z_2$ and $Z_2Z_3$. $Z_1Z_2$ has eigenvalue $+1$ if qubits 1 and 2 agree and $-1$ if they differ. On the code space both are $+1$. Here is what each single flip does:

| Error | $Z_1Z_2$ | $Z_2Z_3$ | Fix |
|---|---|---|---|
| none | $+1$ | $+1$ | nothing |
| $X_1$ | $-1$ | $+1$ | apply $X_1$ |
| $X_2$ | $-1$ | $-1$ | apply $X_2$ |
| $X_3$ | $+1$ | $-1$ | apply $X_3$ |

Check one case: after $X_1$ the state is $\alpha|100\rangle+\beta|011\rangle$. Qubits 1,2 disagree in *both* terms, and qubits 2,3 agree in both terms, so the syndrome is $(-1,+1)$ with certainty, and it is **the same for both branches**, so measuring it does not reveal or disturb $\alpha,\beta$. Applying $X_1$ restores $\alpha|000\rangle+\beta|111\rangle$ exactly.

**Does it help?** The code fails when two or more qubits flip (the decoder then "corrects" the wrong one, which completes a logical flip). With independent flips of probability $p$:

$$p_L=3p^2(1-p)+p^3\approx 3p^2 .$$

For $p=0.01$, $p_L\approx3\times10^{-4}$: thirty times better. The code helps only if $3p^2<p$, i.e. $p<1/3$ (for this idealised noise model with perfect syndrome extraction). Note that this code does nothing about phase errors, and in fact makes them *three times more likely* to hit something, since there are three qubits that can phase-flip.`},{t:"widget",name:"qec",caption:"Try it: set the physical error rate p to 0.01 and run the Monte Carlo. Compare the logical error rate with the 3p^2 prediction. Then sweep p upward and find the crossover where the logical rate stops being lower than the physical rate (near p = 0.5 for the idealised model with majority-vote decoding, or lower if the widget includes imperfect syndromes)."},{t:"widget",name:"composer",props:{preset:"bitflip"},caption:"Try it: this is the 3-qubit bit-flip code as a circuit. Read the encoding CNOTs, then add an X gate on one data qubit between encoding and correction and watch the output. Move the X to a different qubit and confirm the code repairs each one. Then try two X gates at once and see it fail."},{t:"md",text:String.raw`## Phase flips and the Shor 9-qubit code

Quantum states have a second kind of error: a **phase flip** $Z$, which sends $\alpha|0\rangle+\beta|1\rangle\mapsto\alpha|0\rangle-\beta|1\rangle$. In the Hadamard basis $|\pm\rangle=(|0\rangle\pm|1\rangle)/\sqrt2$, a $Z$ acts as a flip $|+\rangle\leftrightarrow|-\rangle$. So the phase-flip code is the bit-flip code in disguise:

$$|0_L\rangle=|{+}{+}{+}\rangle,\qquad |1_L\rangle=|{-}{-}{-}\rangle,$$

obtained by encoding as before and then applying $H$ to every qubit. The syndromes are $X_1X_2$ and $X_2X_3$.

In 1995 Peter Shor combined the two. **Concatenate**: encode the qubit with the phase-flip code, then encode *each* of the three resulting qubits with the bit-flip code. That uses nine qubits:

$$|0_L\rangle=\tfrac{1}{2\sqrt2}(|000\rangle+|111\rangle)^{\otimes3},\qquad |1_L\rangle=\tfrac{1}{2\sqrt2}(|000\rangle-|111\rangle)^{\otimes3}.$$

The inner bit-flip codes fix any $X$ error within a block of three. The outer code compares the *signs* of the blocks to detect a $Z$ error on any one qubit (a $Z$ on any qubit of a block flips that block's sign). A $Y=iXZ$ error is fixed by doing both. By digitisation of errors, the Shor code corrects **any** arbitrary error on a single qubit.

### Stabilizers: a compact language

Writing out states quickly gets unwieldy. The **stabilizer formalism** (Gottesman, 1996) describes a code by a set of commuting Pauli operators $S_1,\dots,S_{n-k}$ (the *stabilizers*), and defines the code space as the states with $S_j|\psi\rangle=+|\psi\rangle$ for all $j$. For the bit-flip code the stabilizers are $Z_1Z_2$ and $Z_2Z_3$. Measuring them gives the syndrome.

Why does this work? If a Pauli error $E$ **anticommutes** with a stabilizer $S$ (that is $ES=-SE$), then $S(E|\psi\rangle)=-E S|\psi\rangle=-E|\psi\rangle$, so the measurement returns $-1$, flagging the error. If every stabilizer commutes with $E$ and $E$ is not itself a logical operator, the error is invisible but harmless or it is a logical error.

A code is labelled $[[n,k,d]]$: $n$ physical qubits encode $k$ logical qubits with **distance** $d$, the weight of the smallest Pauli error that acts nontrivially on the code space without being detected. A distance-$d$ code corrects up to $t=\lfloor(d-1)/2\rfloor$ arbitrary errors. The Shor code is $[[9,1,3]]$; Steane's CSS code is $[[7,1,3]]$; the smallest code protecting against arbitrary single-qubit errors is the five-qubit $[[5,1,3]]$ code. The simple 3-qubit bit-flip code has $d=3$ against $X$ errors but $d=1$ against $Z$ errors, so by the full definition it is not a $d=3$ quantum code.`},{t:"callout",kind:"history",title:'From "impossible" to a theorem in two years',text:String.raw`In 1994, many physicists believed decoherence made large quantum computation hopeless. Shor's 1995 nine-qubit code and Steane's 1996 code showed correction was possible in principle; the threshold theorem (Aharonov and Ben-Or; Knill, Laflamme and Zurek; Kitaev, 1996-97) showed that *arbitrarily long* computation is possible if hardware errors are below a constant. That turned quantum computing from a thought experiment into an engineering problem.`},{t:"md",text:String.raw`## Thresholds, the surface code and the cost of being reliable

Concatenating codes repeatedly gives the **threshold theorem**: *if the physical error rate per operation is below a constant threshold $p_{\rm th}$ (and noise obeys reasonable assumptions, such as being local and not too correlated), then a quantum computation of arbitrary length can be performed with error as small as desired, at a cost that grows only polylogarithmically in the computation size.* This is a proven theorem, but the value of $p_{\rm th}$ depends on the code and noise model, and the assumptions are physical claims that experiments must keep checking.

### The surface code

Today's leading candidate is the **surface code** (Kitaev; Bravyi and Kitaev; Fowler and collaborators). Data qubits sit on a 2D grid; neighbouring measurement qubits repeatedly check four-body stabilizers of the form $XXXX$ and $ZZZZ$. Only nearest-neighbour interactions on a flat chip are needed, which suits superconducting hardware. A distance-$d$ patch uses about $d^2$ data qubits and about $d^2-1$ measurement qubits, so roughly $2d^2$ physical qubits per logical qubit.

Below threshold, the logical error rate per round falls exponentially with distance:

$$p_L\approx A\left(\frac{p}{p_{\rm th}}\right)^{\lfloor (d+1)/2\rfloor},$$

where $p$ is the physical error rate, $p_{\rm th}\approx1\%$ for common circuit-level noise models, and $A$ is a constant of order one. Worked example with $p=0.1\%$ ($p/p_{\rm th}=0.1$) and $A\approx1$: $d=3$ gives about $10^{-2}$, $d=5$ gives $10^{-3}$, $d=7$ gives $10^{-4}$, and $d=25$ about $10^{-13}$. Each increase of $d$ by 2 divides the error by the factor $\Lambda=p_{\rm th}/p=10$, while the qubit count grows only as $d^2$. If $p>p_{\rm th}$ the opposite occurs: larger codes are *worse*.

Hence the often-quoted estimate that a useful algorithm needing, say, $10^3$ logical qubits at $p_L\sim10^{-12}$ would need on the order of millions of physical qubits (the figure depends strongly on assumptions about algorithm and hardware, so treat it as an order of magnitude).

### Logical gates and magic states

Encoding is only half of the job; we must compute on encoded data without exposing it. Many codes have **transversal** gates (apply the gate qubit-by-qubit, so one fault cannot spread). The **Eastin-Knill theorem** says no code can implement a *universal* gate set transversally. In the surface code, Clifford gates ($H$, $S$, CNOT) are relatively cheap, but the $T$ gate is not. The standard solution is **magic state distillation** (Bravyi and Kitaev, 2005): prepare many noisy copies of the state $T|+\rangle$, and run a small error-correcting protocol that distils a few high-fidelity ones, then consume them to apply $T$ gates by teleportation. Distillation factories are expected to dominate qubit overhead in early fault-tolerant machines, and reducing their cost is a major research direction.`},{t:"md",text:String.raw`## Status: what has actually been shown

Be careful to separate what is proven, demonstrated and merely hoped.

**Proven:** the threshold theorem, the existence of codes with the properties above, and the exponential suppression formula under assumed noise models.

**Demonstrated (experimentally):** error detection and correction on small codes in ion traps, superconducting qubits and others over the past decade. In 2024 and 2025 Google Quantum AI reported **below-threshold** operation of a surface code on superconducting chips: as the code distance was increased through $d=3,5,7$, the logical error rate per cycle *decreased*, by a factor of roughly two for each step, and the logical memory outlived its best physical qubit. Other groups, including those using trapped ions and neutral atoms, have reported logical-qubit experiments with small codes and some logical gates. Details change quickly, so consult current papers for exact numbers.

**Not yet shown:** a large-scale machine running long algorithms on many logical qubits, with a logical error rate low enough for cryptanalysis or chemistry. The gap between "a memory that beats its physical qubits" and "thousands of logical qubits computing for billions of steps" is large: it needs better physical error rates, fast real-time decoding, magic-state factories, and scale-up in qubit count by several orders of magnitude.

Other code families, such as **quantum low-density parity-check (qLDPC) codes**, aim to cut the overhead dramatically by encoding many logical qubits in one block, but need long-range connectivity that some platforms (neutral atoms, ions) can offer more naturally than a flat chip. This is an active, not a settled, area.

The next lesson looks at those hardware platforms and how their native error rates compare.`}],quiz:[{q:"In the 3-qubit bit-flip code, the syndrome (Z1Z2, Z2Z3) = (-1, -1) means:",options:["No error occurred.","A bit flip occurred on qubit 2.","A bit flip occurred on qubit 1.","A phase flip occurred."],answer:1,explain:"X on qubit 2 breaks agreement between qubits 1,2 and also between 2,3, so both parities are -1. X on qubit 1 gives (-1,+1) and X on qubit 3 gives (+1,-1). The code cannot see phase flips at all."},{q:"Why can measuring the syndrome not destroy the encoded superposition?",options:["Because syndromes are measured on a different copy of the state.","Because the syndrome values are identical for the |000> and |111> branches, so they carry information about the error but none about alpha and beta.","Because the measurement is done very quickly.","Because quantum measurements never disturb a state."],answer:1,explain:"Z1Z2 and Z2Z3 have the same eigenvalue on both basis states of the code space (after a given error), so the measurement does not distinguish them and the relative amplitude and phase survive."},{q:"A distance-5 code corrects how many arbitrary errors, and what happens to the surface-code logical error rate when p is above threshold?",options:["5 errors; it improves with larger d.","2 errors; it gets worse with larger d.","2 errors; it improves with larger d.","4 errors; it is unchanged by d."],answer:1,explain:"t = floor((d-1)/2) = 2. In p_L ~ A (p/p_th)^((d+1)/2) a base greater than 1 grows with the exponent, so above threshold bigger codes add more faulty operations than they fix."},{q:"With p/p_th = 0.1 and A = 1, roughly what logical error rate does the scaling formula give for d = 7?",options:["10^-1","10^-2","10^-4","10^-7"],answer:2,explain:"The exponent is (7+1)/2 = 4, so p_L ~ (0.1)^4 = 10^-4. Each increase of d by 2 multiplies the error by another factor of 0.1."},{q:"Why are magic states needed in surface-code architectures?",options:["Because the CNOT gate cannot be done on the surface code.","Because the Eastin–Knill theorem forbids a universal transversal gate set, and non-Clifford gates like T need distilled magic states.","Because magic states correct phase errors.","Because without them the code distance is 1."],answer:1,explain:"Clifford operations are cheap in the surface code but do not make a universal set, and no code can implement a universal set transversally. T gates are applied by consuming distilled magic states."}],takeaways:["QEC works by encoding into entanglement (not copying) and measuring syndromes (parities) that locate errors without revealing the data.","Measuring a syndrome collapses continuous errors into discrete Pauli errors, so correcting X and Z on single qubits corrects every single-qubit error.","The 3-qubit bit-flip code gives p_L ~ 3p^2; Shor combined it with a phase-flip code into a [[9,1,3]] code; stabilizers and [[n,k,d]] give the general language.","Threshold theorem: below a constant error rate, arbitrarily long computation is possible; surface code gives p_L ~ A (p/p_th)^((d+1)/2) with p_th around 1%.","Below-threshold surface-code memories have been reported experimentally, but scale, speed and magic-state overhead mean large fault-tolerant machines remain future work."]},de=Object.freeze(Object.defineProperty({__proto__:null,lesson:ue},Symbol.toStringTag,{value:"Module"})),A=String.raw,me={id:"gates-to-pulses",order:19.5,part:"NISQ & Beyond",title:"From Gates to Pulses: How Hardware Computes",summary:"Follow one circuit down the stack: logical gates, native gates, control pulses, and the physics of the qubits themselves, on five different hardware platforms.",minutes:35,objectives:["You can explain why a circuit must be compiled to the native gates of a specific device, and why virtual Z rotations are free.","You can describe, for superconducting, trapped-ion, neutral-atom, silicon-spin and photonic qubits, which physical interaction creates entanglement.","You can read a pulse schedule: what the drive, flux, laser and gate-voltage channels do and how long they take.","You can name the dominant error mechanism of each platform and the control trick used against it (DRAG, closed phase-space loops, blockade, adiabatic exchange, heralding).","You can look at coherence time and gate time together and judge how many operations fit before noise wins."],blocks:[{t:"md",text:A`## The stack between your circuit and the qubit

When you drag a CNOT into the composer, nothing in a real machine "applies a CNOT". Three translations happen first.

1. **Logical circuit.** The algorithm in the gates we have used so far: $H$, $T$, CNOT, and so on.
2. **Native gates.** Every device can only do a few operations natively. A compiler rewrites the circuit using only those. The result is equal to the original up to an unobservable global phase.
3. **Pulses.** Each native gate is a short, shaped burst of microwaves, laser light, gate voltage or heater power, generated by room-temperature electronics. The pulse sets the Hamiltonian $H(t)$ and the qubit evolves as $U = \mathcal{T}\exp\!\left(-i\int H(t)\,dt\right)$.

Only then do the physical qubits do something, and everything about speed and error lives in the third step. The Hardware Lab tab shows all three at once, tied to one time cursor. This lesson explains what you are looking at.

### Why native gate sets differ

A transmon is driven by microwaves resonant with its $0 \leftrightarrow 1$ transition, so the natural single-qubit gates are rotations about axes in the $xy$-plane: $X_{90}$ ($\sqrt{X}$) and $X_{180}$. A rotation about $z$ is different. You do not apply a pulse at all; you simply redefine the phase of every later drive. This **virtual Z** gate takes zero time and has zero error. With it, any single-qubit gate costs at most two $X_{90}$ pulses, via the identity

$$U_3(\theta,\phi,\lambda) = R_z(\phi+\pi)\,\sqrt{X}\,R_z(\theta+\pi)\,\sqrt{X}\,R_z(\lambda).$$

The Hadamard is cheaper still: $H = R_z(\pi/2)\,\sqrt{X}\,R_z(\pi/2)$, one real pulse and two free frame changes. Trapped ions, atoms and spins can rotate about any axis in the $xy$-plane directly (by choosing the drive phase), so they use $R(\theta,\varphi)$ plus virtual $R_z$. Photonic circuits use interferometers: a Mach–Zehnder cell with internal phase $\theta$ is exactly $R_y(\theta)$.

The two-qubit gate is where platforms really diverge, and it is the most error-prone operation on every one of them.`},{t:"md",text:A`## Superconducting qubits: speed, microwaves and a third level

A transmon is a nonlinear oscillator. If it were a perfect harmonic oscillator its levels would be equally spaced and a pulse resonant with $0 \to 1$ would also drive $1 \to 2$, $2 \to 3$ and so on. The Josephson junction adds an **anharmonicity** $\alpha \approx -200$ to $-340$ MHz so the $1 \to 2$ transition sits at $f_{01} + \alpha$. A short pulse, however, has a wide spectrum. A 25 ns Gaussian has frequency content out to tens of MHz and a few percent of its power can reach the $1 \to 2$ line, putting population in $\lvert 2 \rangle$: **leakage**, an error outside the qubit space.

### DRAG

The fix is to add a second quadrature proportional to the derivative of the first, $\Omega_Q = \beta\,\dot\Omega_I/\alpha$. With $\beta = -1$ the leading-order leakage amplitude cancels, which shows up as a notch in the pulse spectrum exactly at $-\alpha$. In the lab you can switch between Gaussian and DRAG and watch both the spectrum and the $\lvert 2\rangle$ population. Leakage drops by orders of magnitude, and the single-qubit gate fidelity is limited by $T_1$, $T_2$ and electronics noise.

### Flux-pulse CZ

Two transmons are coupled with strength $g$. If you tune one of them with a flux pulse so that $\lvert 11 \rangle$ meets $\lvert 02 \rangle$ at an avoided crossing, the two states hybridise with coupling $\sqrt{2}\,g$. Waiting for one full oscillation brings the population back to $\lvert 11 \rangle$ but with a **minus sign**; $\lvert 01 \rangle$ and $\lvert 10 \rangle$ pick up no such phase. That is a controlled-Z. The pulse is shaped with smooth ramps (about 10 ns in the lab) so that it stays adiabatic with respect to the states you do not want to excite. Total time: a few tens of nanoseconds.

### Readout

A resonator coupled to the qubit shifts its frequency by $\pm\chi$ depending on the qubit state. A microwave probe returns a signal whose phase and amplitude differ, and an amplifier chain turns it into a point in the IQ plane. Integrating longer separates the two blobs (signal-to-noise grows like $\sqrt{\tau}$) but gives the qubit more time to decay. Readout takes the better part of a microsecond, which is 20 to 40 times longer than a gate.`},{t:"widget",name:"hardware-lab",props:{defer:!0,platform:"sc",program:"bell"},caption:"Superconducting qubits: the Bell circuit as logical gates, native X90/CZ gates, the microwave and flux pulses, and the qubit states while they play. Try DRAG vs Gaussian in section B, and slide the cursor through the CZ."},{t:"md",text:A`## Trapped ions: the best qubits, the slowest gates

An ion is an atom with one electron removed, held in a radio-frequency Paul trap. Its qubit is a pair of hyperfine levels with a transition frequency of 12.6 GHz (for Yb⁺-like clock states). Every ion of the same isotope is identical, which is why trapped-ion fidelities are the best of any platform.

### The Mølmer–Sørensen gate

Ions in a chain share collective motion (phonon modes). The entangling gate uses this. A bichromatic laser drives a spin-dependent force that displaces the motional mode in a direction set by the spins' $S_x = \sigma_x^{(1)}+\sigma_x^{(2)}$ eigenvalue. The Hamiltonian is, in the interaction picture,

$$H = \lambda\, S_x \left(a\,e^{i\delta t} + a^\dagger e^{-i\delta t}\right).$$

Each spin configuration moves around a **circle in phase space**. After $T = 2\pi/\delta$ every circle is closed, so the motion is back where it started and decoupled from the spins, but each configuration has accumulated a geometric phase proportional to the area of its loop. Choosing $\lambda = \delta/4$ makes the phase on $\lvert\!\pm\!\pm\rangle$ equal to $\pi/2$ relative to the others, which is exactly $e^{-i\frac{\pi}{4}XX}$.

Two facts make this gate robust. First, the final state is **independent of the initial motional temperature** to leading order: the loop area does not depend on where in phase space it starts. Second, it is **sensitive to laser power and to timing**, in two different ways. A power error leaves every loop closed (they close at $T=2\pi/\delta$ for any $\lambda$) but changes the enclosed area, so the gate angle becomes $\theta=\tfrac{\pi}{4}(1+\epsilon)^2$ instead of $\pi/4$: a pure over- or under-rotation. A timing or detuning error stops the loop before it closes and leaves the spins entangled with the motion. Try both in the lab: raise $\bar n$ and nothing happens; change the power by 10 per cent and the fidelity falls as $\cos^2(\theta-\pi/4)$.

### Timescales

Single-qubit rotations take microseconds, the MS gate tens to hundreds of microseconds, and fluorescence detection about 100 to 400 µs. This is roughly a thousand times slower than superconducting qubits, but coherence times of seconds more than compensate.`},{t:"widget",name:"hardware-lab",props:{defer:!0,platform:"ion",program:"bell"},caption:"Trapped ions: the compiler turns CZ into MS(π/4) plus single-ion rotations. Open section C to see the phase-space loops close, then break them with the error sliders."},{t:"md",text:A`## Neutral atoms: Rydberg blockade

Neutral atoms are held by focused laser beams (optical tweezers). In the ground-state manifold two atoms barely interact, which is great for coherence and terrible for two-qubit gates. So the gate briefly lifts an atom into a **Rydberg state** with a very large principal quantum number $n$ (typically 50 to 80). Rydberg atoms are enormous, with dipole moments scaling like $n^2$, and two nearby ones interact strongly, shifting the doubly excited state $\lvert rr \rangle$ by $V$ (tens to hundreds of MHz).

If $V \gg \Omega$, where $\Omega$ is the laser Rabi frequency, the doubly excited state cannot be reached: this is the **blockade**. Two atoms in $\lvert 11 \rangle$ then oscillate to the symmetric single-excitation state at the *enhanced* frequency $\sqrt{2}\,\Omega$, a signature you can measure and the lab plots next to a free atom for comparison.

### The Jaksch CZ

A sequence of three pulses on the Rydberg transition does the job: a $\pi$ pulse on the control, a $2\pi$ pulse on the target, then a $\pi$ pulse on the control. Walk through the four inputs. $\lvert 00 \rangle$ never touches a laser. If only the target is $\lvert 1 \rangle$, its $2\pi$ pulse flips the sign of the state. If only the control is $\lvert 1 \rangle$, it goes up and back down with a minus sign from the two $\pi$ pulses. If both are $\lvert 1 \rangle$, the control is in $\lvert r \rangle$ during the target's $2\pi$ pulse and the blockade stops it, so only the control's $\pi$–$\pi$ sign survives. The result is $\mathrm{diag}(1,-1,-1,-1)$, which is a CZ up to single-qubit Z rotations that the compiler absorbs for free.

Real devices use optimised pulses, but the physics and the errors are the same: Rydberg decay during the gate, imperfect blockade when $V$ is not much larger than $\Omega$, laser noise and Doppler shifts. A readout is a fluorescence image that takes milliseconds, which is the price of the platform's flexible, large arrays.`},{t:"widget",name:"hardware-lab",props:{defer:!0,platform:"atom",program:"cz"},caption:"Neutral atoms: three Rydberg pulses implement the CZ. Notice the population leaving the qubit space in section C while the control atom sits in the Rydberg state."},{t:"md",text:A`## Silicon spin qubits: exchange between neighbours

A single electron trapped in a silicon quantum dot has a spin that serves as a qubit, split by a magnetic field. A microwave burst (ESR) or an oscillating electric field in a magnetic-field gradient (EDSR) rotates it. Entanglement comes from the **exchange interaction**: when the barrier between two dots is lowered by a gate voltage, the electron wavefunctions overlap and the energy depends on whether the spins are parallel, $J\,(\mathbf{S}_1\cdot\mathbf{S}_2 - \tfrac14)$.

The ratio of $J$ to the Zeeman energy difference $\Delta E_z$ between the dots decides what you get.

- For $J \ll \Delta E_z$ the two antiparallel states have different energies, so exchange cannot swap them. It only shifts their energy, and $\int J\,dt = \pi$ gives a **CZ**.
- For $J \gg \Delta E_z$ the antiparallel states are degenerate and exchange swaps them: a SWAP or $\sqrt{\text{SWAP}}$.

You can see both regimes in the chevron map of the Silicon spin tab. Smooth pulse shapes keep the CZ adiabatic. The strengths of this platform are size (qubits about 100 nm across) and compatibility with semiconductor manufacturing. Its weaknesses are fabrication variability and charge noise, which makes $J$ and $\Delta E_z$ fluctuate.`},{t:"md",text:A`## Photonic qubits: no decoherence, but loss

In a dual-rail encoding a single photon is in waveguide 0 or waveguide 1. Beam splitters and phase shifters realise every single-qubit gate **exactly**: two 50/50 splitters around a phase $\theta$ form a Mach–Zehnder interferometer equal to $R_y(\theta)$. A thermo-optic phase shifter heats the waveguide, so $\varphi \propto V^2$ and the voltage needed grows like $\sqrt{\varphi}$.

Photons do not interact, so a two-qubit gate must be built from interference plus measurement. With three beam splitters of transmissivity $1/3$ and post-selecting on the right detector pattern, the Ralph / Hofmann–Takeuchi scheme performs a CZ with success probability $1/9$: all four inputs have amplitude of magnitude $1/3$, and the $\lvert 11 \rangle$ amplitude carries a minus sign from Hong–Ou–Mandel interference. Practical architectures instead build large entangled **resource states** using fusion measurements that succeed with probability 50 per cent, or 75 per cent and more with ancilla photons, and use multiplexing to make failures harmless.

The dominant error is therefore **photon loss** rather than dephasing. A 0.5 dB loss per component sounds small, but a path of 40 components keeps only about 60 per cent of single photons and the survival probability of a three-photon process is the cube of that. That is why integrated photonics focuses on ultra-low-loss components and detectors with efficiency above 90 per cent.`},{t:"md",text:A`## Reading the numbers together

Because platforms differ by factors of a thousand in speed and by many orders in coherence, neither number alone tells you much. What matters is how many operations fit in a coherence time and how good each one is.

| Platform | Typical two-qubit gate | Coherence | Operations per $T_2$ (order of magnitude) |
|---|---|---|---|
| Superconducting | 30–100 ns | 0.1–1 ms | $10^3$–$10^4$ |
| Trapped ions | 30–200 µs | seconds | $10^4$–$10^5$ |
| Neutral atoms | 0.2–1 µs | ms to s | $10^3$–$10^6$ |
| Silicon spin | 50–300 ns | 20 µs–ms | $10^2$–$10^4$ |
| Photonic | ns–µs, probabilistic | no storage decay | limited by loss |

These are typical published ranges and they change quickly as devices improve, so treat them as orientation rather than as specifications. The Hardware Lab lets you exaggerate decoherence by factors of 10, 100 and 1000 to see how quickly a circuit degrades once gate time approaches coherence time.

### What to do with the Hardware Lab

Pick the Bell circuit, press play and watch the three sections move together. Then try these experiments.

1. On superconducting qubits, drag the cursor through the CZ and observe the populations in the $\lvert 11\rangle$ and $\lvert 02\rangle$ levels, then optimise the hold time.
2. On ions, change the laser power by 10 per cent and watch the loops stay closed while the gate angle changes; then shorten the gate time and watch them fail to close.
3. On atoms, reduce the blockade strength until $V \approx \Omega$.
4. On silicon, compare a Hann pulse with a square pulse of the same area.
5. On photons, set $\eta$ away from $1/3$ and see which amplitudes lose their equality.

### One program, five machines

Below the lab sits a comparison panel. Load Grover's search, Bernstein–Vazirani or the two-qubit QFT and it compiles the *same* circuit for every platform and reports program time (on a log scale), time compared with coherence, estimated fidelity, and whether the final measurement matches the ideal answer. Trapped ions are the slowest by three orders of magnitude yet often the most accurate. Superconducting circuits finish in well under a microsecond but have the least spare coherence. Photonic circuits are fast and have no decoherence, but each CZ only succeeds with probability $1/9$, so a two-CZ program fires in about 1.2 per cent of attempts. No platform wins on every column, and that is the point.`}],quiz:[{q:"Why can a superconducting processor apply an arbitrary $R_z$ gate with zero time and zero error?",options:["Because $R_z$ commutes with every other gate","Because it is implemented by updating the phase reference of later microwave pulses in software","Because the qubit is cooled to a state where $z$ rotations act trivially","Because $R_z$ is replaced by a SWAP gate"],answer:1,explain:"A z rotation is a change of the rotating reference frame. Instead of playing a pulse, the controller adds the angle to the phase of all subsequent drive pulses, which costs no time and adds no gate error."},{q:"What does the DRAG quadrature $\\Omega_Q = \\beta\\,\\dot\\Omega_I/\\alpha$ with $\\beta=-1$ do?",options:["It speeds up the gate by a factor of two","It cancels the leading-order drive of the $1 \\leftrightarrow 2$ transition, suppressing leakage","It removes the need for a calibration of the amplitude","It makes the pulse longer so the spectrum is narrower"],answer:1,explain:"The derivative quadrature creates a notch in the pulse spectrum at the frequency of the $1 \\leftrightarrow 2$ transition, so population is not driven into the third level."},{q:"In the Mølmer–Sørensen gate, which change has the largest effect on gate fidelity?",options:["Raising the initial thermal phonon number $\\bar n$ from 0 to 2","Stopping the gate 10 per cent early so the phase-space loops no longer close","Moving the ions slightly closer together","Using a different hyperfine clock state"],answer:1,explain:"The geometric phase is independent of the initial motional state to leading order, but a loop that does not close leaves residual spin–motion entanglement, which is an error that grows with the timing mistake. (A pure power error keeps the loops closed and only changes the gate angle.)"},{q:"In the Jaksch Rydberg CZ, why is the target atom unable to complete its $2\\pi$ pulse when the control is in $\\lvert 1 \\rangle$?",options:["The target atom has already decayed","The control atom sits in the Rydberg state and the blockade shifts the target's Rydberg level far out of resonance","The $2\\pi$ pulse is too short","The control atom absorbs all the laser light"],answer:1,explain:"With the control excited, the doubly-excited state is shifted by $V \\gg \\Omega$, so the target cannot be excited and acquires no phase from its own $2\\pi$ rotation."},{q:"For silicon spin qubits, which condition gives a CZ instead of a SWAP when the exchange $J$ is pulsed?",options:["$J \\gg \\Delta E_z$","$J \\ll \\Delta E_z$ with $\\int J\\,dt = \\pi$","$J = 0$","$J$ negative"],answer:1,explain:"When the Zeeman difference dominates, exchange cannot flip the antiparallel states; it only shifts their energy, so the accumulated phase of $\\pi$ makes a controlled-Z."},{q:"What is the dominant error source for linear-optics photonic qubits?",options:["Amplitude damping with a short $T_1$","Photon loss in components and detectors","Spin–orbit coupling","Leakage to a third level"],answer:1,explain:"Photons keep their state for a very long time but are absorbed or scattered; loss per component multiplies along the path, which is why every architecture is built around low-loss parts and heralded, multiplexed operations."}],takeaways:["A circuit is compiled to native gates, then to pulses; the compiled circuit equals the logical one up to global phase.","Virtual Z rotations are frame updates: zero time, zero error, and they make single-qubit gates cheap on microwave-driven platforms.","Each platform entangles differently: flux-tuned avoided crossing, spin-dependent motional force, Rydberg blockade, exchange coupling, or interference plus heralding.","The honest figure of merit is operations per coherence time together with gate fidelity, not either number alone."]},pe=Object.freeze(Object.defineProperty({__proto__:null,lesson:me},Symbol.toStringTag,{value:"Module"})),k=String.raw,O="```",ge={id:"grover",order:13,part:"Circuits & Algorithms",title:"Grover's Search: Amplitude Amplification",summary:"Grover's algorithm finds a marked item among N using about (pi/4) sqrt N oracle queries by rotating the state, step by step, toward the answer: a provably optimal quadratic speed-up.",minutes:28,objectives:["You can state the unstructured search problem in the query model and the classical cost (N/2 on average, N in the worst case).","You can build the uniform superposition, the phase-flip oracle and the diffusion operator, and run the N = 4 example by hand to find the answer in one iteration.","You can explain Grover's algorithm as a rotation by 2 theta in a two-dimensional plane, compute the success probability sin^2((2k+1) theta), and pick the number of iterations.","You can explain why too many iterations hurts, and how the count changes with M marked items.","You can state what Grover does and does not offer: BBBV optimality, oracle cost, and the practical implications such as doubling symmetric key lengths."],blocks:[{t:"md",text:k`## The problem: finding a needle with no map

Suppose there are $N$ boxes and exactly one hides a prize. You may open boxes one at a time, and nothing tells you where the prize is. This is **unstructured search**. The data is not sorted and has no pattern you can exploit, so the only way to learn anything is to check.

In the **query model** we count how many times we ask a black box (the **oracle**) a question of the form "is item $x$ the one?" The oracle answers $f(x)=1$ if $x$ is marked and $f(x)=0$ otherwise. Everything else the algorithm does is free; we only count queries.

Classically the best you can do is check boxes in some order. On average you find the prize after about $N/2$ checks, and in the worst case you need $N$ (or $N-1$, since the last box is then certain). Randomising the order does not help. The cost grows linearly with $N$.

**Grover's algorithm** (Lov Grover, 1996) finds the marked item with high probability using only about $\tfrac\pi4\sqrt N$ queries. For a million items that is roughly 785 queries instead of 500,000 on average. It is a **quadratic speed-up**: not exponential, but real, and surprisingly general.

Here, an "item" is an $n$-bit string, so $N=2^n$. A search over $n=20$ bits means a million candidates, and each candidate is a computational basis state $\lvert x\rangle$.

### Step 1: the uniform superposition

Start with $\lvert 0\rangle^{\otimes n}$ and apply a Hadamard to every qubit. You get the equal superposition of all items,

$$\lvert s\rangle=H^{\otimes n}\lvert 0\ldots0\rangle=\frac1{\sqrt N}\sum_{x=0}^{N-1}\lvert x\rangle.$$

Every item has amplitude $1/\sqrt N$, so measuring now gives each item with probability $1/N$: pure guessing. The goal is to shift amplitude from the wrong items onto the marked item $w$, without ever looking at which one it is.

### Step 2: the oracle as a phase flip

A reversible oracle normally computes $\lvert x\rangle\lvert y\rangle\mapsto\lvert x\rangle\lvert y\oplus f(x)\rangle$. If the second qubit is prepared in $\lvert -\rangle$, the answer is written into the *phase* instead (this "phase kickback" trick appeared in the Deutsch-Jozsa lesson):

$$O\lvert x\rangle=(-1)^{f(x)}\lvert x\rangle,\qquad O=I-2\lvert w\rangle\langle w\rvert.$$

The oracle flips the sign of the marked item and does nothing else. Measuring right after $O$ would reveal nothing, because amplitudes' *signs* are invisible to a measurement. The trick is to convert that hidden sign into a visible size difference.`},{t:"md",text:k`## The diffusion operator: inversion about the mean

The second ingredient is the **diffusion operator**

$$D=2\lvert s\rangle\langle s\rvert-I.$$

Its action on any state with amplitudes $a_x$ is remarkably simple. Let $\bar a=\tfrac1N\sum_x a_x$ be the average amplitude. Then $D$ sends

$$a_x\;\longmapsto\;2\bar a-a_x,$$

reflecting every amplitude about the mean. Amplitudes far below the mean jump far above it.

**Why?** $\langle s\rvert\psi\rangle=\tfrac1{\sqrt N}\sum_x a_x=\sqrt N\,\bar a$, so $2\lvert s\rangle\langle s\rvert\psi\rangle$ has every component equal to $2\sqrt N\bar a/\sqrt N=2\bar a$, and subtracting $\lvert\psi\rangle$ gives $2\bar a-a_x$.

One **Grover iteration** is $G=D\,O$: flip the marked sign, then invert about the mean.

### Worked example: N = 4, the answer in one step

Let $n=2$ and suppose the marked item is $w=\lvert 10\rangle$. List amplitudes in the order $00,01,10,11$.

1. After the Hadamards: $(\tfrac12,\tfrac12,\tfrac12,\tfrac12)$. Each outcome has probability $1/4$.
2. After the oracle: $(\tfrac12,\tfrac12,-\tfrac12,\tfrac12)$. Probabilities are still all $1/4$.
3. The mean is $\bar a=\tfrac14(\tfrac12+\tfrac12-\tfrac12+\tfrac12)=\tfrac14$.
4. Inversion about the mean, $a\mapsto 2\cdot\tfrac14-a=\tfrac12-a$, gives $(0,0,1,0)$.

The state is exactly $\lvert 10\rangle$. One oracle query found it with certainty, while a classical search of four boxes needs 2.25 checks on average and up to 3 in the worst case. $N=4$ is special (it is the one case where the rotation angle lands exactly on the target), but it shows the mechanism clearly: the negative amplitude drags the mean down just slightly, yet the reflection exaggerates the gap into everything.`},{t:"widget",name:"grover-viz",props:{qubits:2},caption:"With 2 qubits (N = 4), pick a marked item and step once. All the amplitude lands on the marked state and the success probability reads 100%. Step again and watch it fall: the algorithm overshoots, which is the first hint that Grover must be stopped at the right moment."},{t:"md",text:k`## The geometry: a rotation in a plane

Why does this work for every $N$, and when should we stop? The picture is a rotation.

The whole algorithm lives in a two-dimensional plane. Define the normalised "wrong" state

$$\lvert s'\rangle=\frac1{\sqrt{N-1}}\sum_{x\neq w}\lvert x\rangle,$$

which is orthogonal to $\lvert w\rangle$. The uniform state splits as

$$\lvert s\rangle=\sin\theta\,\lvert w\rangle+\cos\theta\,\lvert s'\rangle,\qquad \sin\theta=\frac1{\sqrt N}.$$

So $\lvert s\rangle$ sits at a small angle $\theta$ above the $\lvert s'\rangle$ axis. We want to reach the $\lvert w\rangle$ axis, a quarter turn away.

### Two reflections make a rotation

- The oracle $O=I-2\lvert w\rangle\langle w\rvert$ flips the $\lvert w\rangle$ component: it **reflects** the plane about the $\lvert s'\rangle$ axis.
- The diffusion $D=2\lvert s\rangle\langle s\rvert-I$ keeps the component along $\lvert s\rangle$ and flips the perpendicular one: it **reflects about the $\lvert s\rangle$ line**.

Two reflections in lines that meet at an angle $\theta$ compose to a rotation by $2\theta$. So each Grover iteration turns the state by $2\theta$ toward $\lvert w\rangle$. After $k$ iterations the angle from the $\lvert s'\rangle$ axis is $(2k+1)\theta$, and

$$G^k\lvert s\rangle=\sin\!\big((2k+1)\theta\big)\lvert w\rangle+\cos\!\big((2k+1)\theta\big)\lvert s'\rangle,$$

$$P_\text{success}(k)=\sin^2\!\big((2k+1)\theta\big).$$

(If you prefer, check the N = 4 example: $\sin\theta=\tfrac12$ gives $\theta=30^\circ$, and $k=1$ gives $\sin^2 90^\circ=1$.)

### How many iterations?

We want $(2k+1)\theta\approx\pi/2$, so $k\approx\dfrac{\pi}{4\theta}-\dfrac12$. For large $N$, $\theta\approx1/\sqrt N$, hence

$$k_\text{opt}\approx\frac\pi4\sqrt N.$$

This is where the square root comes from: each step rotates by about $2/\sqrt N$, and it takes about $\sqrt N$ such steps to turn through a quarter circle.

### Worked example: N = 8

$\theta=\arcsin(1/\sqrt8)\approx20.7^\circ$. Then

| $k$ | angle $(2k+1)\theta$ | success probability |
|---|---|---|
| 0 | $20.7^\circ$ | 0.125 |
| 1 | $62.1^\circ$ | 0.781 |
| 2 | $103.5^\circ$ | 0.945 |
| 3 | $144.9^\circ$ | 0.330 |

The best choice is $k=2$, with success probability $\sin^2(103.5^\circ)\approx0.945$. A classical search of 8 boxes needs 4.5 checks on average, while Grover uses 2 queries for about 94.5% success. Notice that $k=2$ already slightly *overshoots* $90^\circ$; that is the best an integer number of steps can do.`},{t:"widget",name:"grover-viz",props:{qubits:3},caption:"Now N = 8. Step through k = 0, 1, 2, 3, 4 and compare the amplitude bars and the success curve with the table above: 12.5%, 78%, 94.5%, then a fall to 33%, then almost zero at k = 4. Verify that the peak sits at k = 2."},{t:"callout",kind:"warn",title:"Overshoot: more iterations is not better",text:k`Grover's algorithm is a rotation, not a convergence. Past the optimum the state keeps turning *away* from $\lvert w\rangle$ and the success probability falls again, reaching nearly zero at $k\approx\tfrac\pi2\sqrt N$ before climbing back. Running "a few extra iterations to be safe" can wreck the answer. You must know (or estimate) how many marked items there are.`},{t:"md",text:k`## More than one marked item

Suppose $M$ items are marked. Let $\lvert w\rangle$ now be the uniform superposition of marked items, and $\lvert s'\rangle$ that of unmarked ones. Everything above survives with a new angle:

$$\sin\theta=\sqrt{\frac MN},\qquad k_\text{opt}\approx\frac\pi4\sqrt{\frac NM}.$$

More solutions means a larger starting angle and fewer steps, as you would expect: a search with many winners is easier. Two cautions:

- **You need to know $M$.** If you do not, running the wrong number of iterations can overshoot. Remedies are *quantum counting* (which uses phase estimation, next lesson), or running with randomly chosen iteration counts that grow geometrically, which still finds a solution in $O(\sqrt{N/M})$ expected queries.
- **When $M\ge N/2$** the starting angle is already $45^\circ$ or more, and iterating makes things worse. In that regime you would simply measure the uniform state, or add an extra unmarked qubit to shrink the fraction.

A quick check: for $N=4$ and $M=1$ we found $\theta=30^\circ$ and one iteration. For $N=4$ and $M=2$, $\theta=45^\circ$ and $k=0$ is already optimal in the sense that the uniform state succeeds with probability $\tfrac12$ and one iteration would give $\sin^2135^\circ=\tfrac12$ again.

## Building the circuit

The oracle depends on the problem, but the diffusion operator is the same every time. Using $H^{\otimes n}$ to map $\lvert s\rangle$ to $\lvert 0\ldots0\rangle$,

$$D=H^{\otimes n}\,(2\lvert 0\rangle\langle 0\rvert-I)\,H^{\otimes n}.$$

The middle factor flips the sign of every state except $\lvert 0\ldots0\rangle$. Up to an irrelevant global minus sign, that is: apply $X$ to all qubits, apply a multi-controlled $Z$ (which flips the sign of $\lvert 1\ldots1\rangle$), apply $X$ to all qubits again. Reading the circuit left to right, one iteration is

$$\text{oracle}\;\to\;H^{\otimes n}\;\to\;X^{\otimes n}\;\to\;\text{MCZ}\;\to\;X^{\otimes n}\;\to\;H^{\otimes n}.$$

The oracle itself can be built from the same ingredients. To mark the bit string $w$, conjugate a multi-controlled $Z$ by $X$ gates on exactly those qubits where $w$ has a 0. For two qubits and $w=11$ the oracle is just a controlled-$Z$, and the whole algorithm is the 2-qubit circuit below. With big-endian ordering (qubit 0 is the leftmost bit), the output reads $11$ with probability 1.

${O}
H(0) H(1)          # uniform superposition
CZ(0,1)            # oracle: marks |11>
H(0) H(1)          # begin diffusion
X(0) X(1)
CZ(0,1)
X(0) X(1)
H(0) H(1)          # end diffusion
${O}`},{t:"widget",name:"composer",props:{preset:"grover2"},caption:"Run the 2-qubit Grover preset and confirm the output is a single bar at 11 with probability 1. Then try removing the diffusion block: the output returns to a uniform distribution, showing that the oracle alone changes nothing visible."},{t:"widget",name:"composer",props:{preset:"grover3"},caption:"The 3-qubit preset runs the optimal two iterations. Check the marked outcome appears with probability close to 0.945, matching sin^2(5 theta). Add a third iteration and watch it drop to about 0.33."},{t:"callout",kind:"math",title:"Why the reflection picture is exact",text:k`Write $\lvert\psi_k\rangle=\sin\phi_k\lvert w\rangle+\cos\phi_k\lvert s'\rangle$. The oracle sends $\phi\to-\phi$ and the diffusion reflects about the line at angle $\theta$, sending $\phi\to2\theta-\phi$. Composing, $\phi\to2\theta-(-\phi)=\phi+2\theta$. Starting from $\phi_0=\theta$ gives $\phi_k=(2k+1)\theta$ exactly, for every $N$; there is no approximation except in the large-$N$ simplification $\theta\approx1/\sqrt N$.`},{t:"md",text:k`## Why it cannot be beaten, and what Grover is not

### Optimality

**Theorem (Bennett, Bernstein, Brassard, Vazirani, 1997).** Any quantum algorithm that finds a marked item among $N$ with constant success probability needs $\Omega(\sqrt N)$ oracle queries.

The intuition: each query can change the state only a little. The amplitude of the marked item can grow by an amount proportional to the current amplitude on the unmarked part divided by $\sqrt N$ in effect, so reaching probability near 1 takes order $\sqrt N$ steps. Grover's $\tfrac\pi4\sqrt N$ is within a constant of the bound (later work showed the constant $\pi/4$ is exactly optimal). So for *unstructured* search, quadratic is the end of the road. No cleverer circuit will give exponential gains.

### Common misconceptions

- **"Grover makes databases faster."** No. A real database has structure (sorted keys, indices) that classical algorithms already exploit: a sorted list is searched in $\log N$ steps. Also, loading $N$ classical records into a quantum register costs time proportional to $N$ unless a hypothetical quantum memory exists, which wipes out the gain.
- **"It tries all answers at once and picks the right one."** The superposition holds all candidates, but measuring gives a random one. The algorithm works only because interference steers amplitude, and that takes $\sqrt N$ rounds.
- **"The oracle is free."** In the query model it is, but in practice the oracle is a circuit that checks a candidate (for example, hashes it and compares). Its depth multiplies the total cost, and it must be implemented reversibly.
- **"A quadratic speed-up is huge."** Often it is not, once overheads are counted. Grover's iterations are strictly sequential: running them across many machines gives much weaker savings than in the classical case (with $P$ machines the quantum time falls only as $\sqrt P$ rather than $P$). Early fault-tolerant devices are slow, so for moderate $N$ a fast classical computer can still win.

### Where it matters

- **Amplitude amplification.** The same rotation trick works whenever you have any algorithm that succeeds with probability $p$: rather than repeating it $1/p$ times, amplify its success amplitude in about $1/\sqrt p$ rounds. This is a building block inside many other quantum algorithms, such as collision finding and quantum counting.
- **Search-type problems.** Satisfiability and constraint problems, where candidate solutions are easy to check but hard to find, gain a square-root factor over brute force (though better classical heuristics often exist).
- **Cryptography.** Brute-forcing a $k$-bit symmetric key costs about $2^k$ classical trials but about $2^{k/2}$ Grover iterations. A 128-bit key therefore offers roughly 64-bit security against a quantum attacker, and 256-bit keys retain about 128 bits. The standard advice is simply to **double the key length** (use AES-256). Compare this with RSA, which Shor's algorithm breaks outright.

### Practical outlook

Even $2^{64}$ sequential iterations, each with a deep AES circuit, is beyond what any foreseeable machine could do, and it requires error correction (the QEC lesson) so that billions of operations run reliably. Grover is therefore a long-term, fault-tolerant algorithm; its role today is in teaching, in resource estimates, and in shaping security policy.`},{t:"widget",name:"speedup-chart",caption:"Compare the linear classical curve with the square-root curve for Grover, and with the exponential gap for Shor. Grover bends the curve, but does not change its family: polynomial stays polynomial."},{t:"callout",kind:"tip",title:"Where to next",text:k`The circuit tools used here come from the Circuit Model lesson (multi-controlled gates, conjugation by $X$). Quantum counting, which estimates $M$, relies on phase estimation, which is built on the quantum Fourier transform in the QFT and Phase Estimation lesson that follows.`}],quiz:[{q:String.raw`For $N=16$ items and one marked item, $\theta=\arcsin(1/4)\approx14.5^\circ$. About how many Grover iterations maximise the success probability?`,options:["1","3","8","16"],answer:1,explain:String.raw`We want $(2k+1)\theta$ close to $90^\circ$, so $k\approx 90/(2\cdot14.5)-\tfrac12\approx2.6$, which rounds to 3. Then $\sin^2(7\cdot14.5^\circ)\approx0.96$. The estimate $\tfrac\pi4\sqrt{16}\approx3.1$ agrees.`},{q:"In the N = 4 worked example, after the oracle the amplitudes are (1/2, 1/2, -1/2, 1/2). What does inversion about the mean do?",options:["Nothing, because the probabilities are unchanged","It maps the mean 1/4 to itself and each amplitude a to 1/2 - a, giving (0, 0, 1, 0)","It measures the state","It flips every amplitude's sign"],answer:1,explain:String.raw`The mean is $1/4$, so each amplitude goes to $2\cdot\tfrac14-a=\tfrac12-a$. The three positive amplitudes become 0 and the negative one becomes 1. Probabilities were equal before the diffusion, but amplitudes (with signs) are what the diffusion acts on.`},{q:"What happens if you run far more Grover iterations than the optimum?",options:["The success probability keeps increasing towards 1","The success probability stays at its maximum","The state rotates past the marked item and the success probability falls, oscillating","The algorithm becomes classical"],answer:2,explain:String.raw`Each iteration rotates by a fixed angle $2\theta$ and $P=\sin^2((2k+1)\theta)$ is periodic in $k$. After passing $90^\circ$ it declines. For $N=8$, $k=2$ gives 0.945 but $k=3$ gives about 0.33.`},{q:"With M marked items among N (M much smaller than N), how does the optimal iteration count scale?",options:[String.raw`$\tfrac\pi4\sqrt{N/M}$`,String.raw`$\tfrac\pi4\sqrt{N}\cdot M$`,String.raw`$N/M$`,String.raw`$\tfrac\pi4\sqrt{M/N}$`],answer:0,explain:String.raw`Now $\sin\theta=\sqrt{M/N}$, so $\theta$ is larger by a factor $\sqrt M$ and fewer rotations are needed: $k\approx\pi/(4\theta)\approx\tfrac\pi4\sqrt{N/M}$.`},{q:"Why does Grover search motivate doubling symmetric key lengths, and why does it not break AES-256 outright?",options:["It gives an exponential speed-up, so every key length is broken","It gives only a quadratic speed-up, so a k-bit key drops to about k/2 bits of security; 256-bit keys keep about 128 bits","It only works on public-key schemes","It reveals keys instantly with a single query"],answer:1,explain:String.raw`Grover needs about $2^{k/2}$ iterations for a $k$-bit key, and the BBBV theorem says no quantum algorithm can do much better for unstructured search. So the fix is to double $k$. The exponential break is Shor's algorithm against RSA, not Grover against symmetric ciphers.`}],takeaways:["Unstructured search costs about N/2 queries classically; Grover finds the item in about (pi/4) sqrt N queries.","One iteration is an oracle phase flip (I - 2|w><w|) followed by inversion about the mean (2|s><s| - I); together they rotate the state by 2 theta, with sin theta = 1/sqrt N.","Success probability is sin^2((2k+1) theta): stop at k near (pi/4) sqrt(N/M), because extra iterations overshoot and reduce it.","The speed-up is exactly quadratic and provably optimal (BBBV); it is not a database speed-up and the oracle cost counts.","Amplitude amplification generalises the idea, and for cryptography the practical response is to double symmetric key lengths."]},$e=Object.freeze(Object.defineProperty({__proto__:null,lesson:ge},Symbol.toStringTag,{value:"Module"})),T=String.raw,be={id:"hardware-crypto",order:19,part:"NISQ & Beyond",title:"Hardware Platforms and Quantum Cryptography",summary:"Quantum computers can be built from circuits, ions, atoms, photons and spins, each with honest trade-offs; and quantum physics can also protect secrets, through BB84 key distribution, though most organisations will rely on post-quantum cryptography instead.",minutes:28,objectives:["You can state the five DiVincenzo criteria in plain words and use them to judge any proposed qubit technology.","You can compare superconducting, trapped-ion, neutral-atom, photonic, spin and topological platforms by speed, fidelity, connectivity and scaling challenges.","You can explain T1, T2, gate fidelity, SPAM error and why physical qubit counts are not the whole story.","You can run BB84 by hand, including sifting, and show that an intercept-resend eavesdropper causes a 25% error rate.","You can explain the limits of QKD and why post-quantum cryptography (ML-KEM, ML-DSA, SLH-DSA) is the mainstream defence."],blocks:[{t:"md",text:T`## What does a quantum computer need?

Almost anything with two distinguishable states can be called a qubit: a current direction in a loop, the spin of an electron, the polarisation of a photon. The hard part is not finding a two-level system; it is finding one you can *control precisely* while keeping the outside world from *measuring it by accident*. In 2000 David DiVincenzo wrote down five requirements, which are still the best checklist.

1. **A scalable set of well-defined qubits.** You need many identical, individually addressable two-level systems, and a path to far more of them.
2. **Initialisation.** You must be able to reset every qubit to a known state such as $\lvert 0\rangle$, reliably and quickly.
3. **A universal set of gates.** You need single-qubit rotations plus at least one entangling two-qubit gate (for instance CNOT or CZ), enough to build any circuit.
4. **Qubit-specific measurement.** You must be able to read each qubit out, with few errors.
5. **Long coherence compared with gate time.** The qubit must keep its quantum state for many gate operations. This is the criterion that kills most candidates.

There is a built-in tension. To control a qubit you must couple it to something (a microwave line, a laser). But every coupling is also a channel through which noise leaks in. All platforms are compromises between *easy to control* and *easy to isolate*.

### The metrics you will meet

- **T1 (relaxation time):** how long an excited state $\lvert 1\rangle$ survives before decaying to $\lvert 0\rangle$. Think of it as the qubit losing energy.
- **T2 (dephasing time):** how long the *phase* of a superposition is preserved. Always $T_2\le 2T_1$, and often much shorter. This is the same physics as in the noise lesson.
- **Gate fidelity:** the average probability that a gate does what it should. A two-qubit fidelity of 99.5% means roughly one error in 200 gates.
- **SPAM error:** state preparation and measurement error, the errors at the beginning and end of a circuit, independent of the gates in between.
- **Connectivity:** which pairs of qubits can interact directly. Missing links must be bridged with SWAP gates, each of which costs fidelity.
- **Quantum volume:** a single benchmark number (introduced by IBM) that rewards qubit count, fidelity and connectivity together, by asking for the largest square random circuit the machine can run successfully. It is reported as $2^n$.

A useful rule of thumb is the **gate budget**: coherence time divided by gate time. A qubit with $T_2=100\ \mu\text{s}$ and 50 ns gates allows about $2000$ operations before decoherence dominates, while a qubit with $T_2$ of seconds and 100 microsecond gates allows tens of thousands. Fast is not automatically better; the ratio and the fidelity matter.`},{t:"md",text:T`## A tour of the platforms

Every number below is a ballpark that changes quickly, so treat it as a *scale*, not a record. Check the current roadmaps and published benchmarks of each vendor before quoting anything.

### Superconducting transmons (IBM, Google, and others)

A transmon is a tiny electrical circuit patterned on a chip, cooled in a dilution refrigerator to about 10 millikelvin, colder than outer space, so that it behaves as an artificial atom with two usable energy levels. Microwave pulses drive the gates.

- **Strengths:** very fast gates (roughly 10 to 100 ns), lithographic fabrication that borrows from the chip industry, and the largest early investment.
- **Weaknesses:** coherence (T1 often of the order of 100 microseconds, with progress ongoing), fixed nearest-neighbour connectivity on the chip, fabrication variability between qubits, and the sheer wiring and cooling challenge of reaching millions of qubits.

### Trapped ions (Quantinuum, IonQ, and others)

Individual charged atoms are suspended in electromagnetic fields in a vacuum and manipulated with lasers or microwaves. Every ion of one species is *identical*, because nature made them.

- **Strengths:** the highest gate fidelities reported on any platform (two-qubit fidelity at or above 99.9% in leading systems), long coherence, and effectively all-to-all connectivity because ions can be shuttled or share vibrational modes.
- **Weaknesses:** gates are slow (tens of microseconds to milliseconds), so circuits run slower in wall-clock time, and packing very many ions into one trap, or linking several traps, is an engineering frontier.

### Neutral atoms in optical tweezers (QuEra, Atom Computing, Pasqal, and others)

Focused laser beams hold arrays of uncharged atoms. Entangling gates use temporary excitation to high-lying Rydberg states, in which nearby atoms interact strongly.

- **Strengths:** arrays of hundreds to thousands of atoms, geometry that can be rearranged on the fly, and rapid recent progress on error-corrected demonstrations.
- **Weaknesses:** atoms can be lost during a run, gate speed and repetition rate are modest, and mid-circuit measurement and fast reloading are still maturing.

### Photonics (PsiQuantum, Xanadu, and others)

Information is carried by light: which path a photon takes, or the state of a squeezed light field. Photons barely interact with the environment, and many components work at or near room temperature (detectors and sources often need cooling).

- **Strengths:** natural for networking and communication, compatible with existing fibre and semiconductor foundries, and good coherence by nature.
- **Weaknesses:** **photon loss** is the dominant problem, photons do not interact with each other unless you engineer it, and entangling gates are probabilistic. Photonic designs therefore use special resource states and error correction from the start.

### Spin qubits in silicon

The spin of a single electron (or a nucleus) trapped in a silicon device is the qubit. This is the smallest qubit of all, and shares manufacturing with conventional transistors. The challenge is uniformity, control wiring and long-range coupling. It is promising but behind the leaders in scale of demonstration.

### Topological qubits (Microsoft)

The idea is to encode information non-locally in exotic quasiparticles so that errors are suppressed by the physics itself. If it works, overhead would shrink dramatically. At the time of writing the status is **early and contested**: claims of the underlying quasiparticles have been debated in the research community. Treat it as a high-risk, high-reward research direction rather than a product.

There is no settled winner. Different platforms may win for different tasks, and hybrid architectures (for example, photonic links between matter-qubit modules) are an active research direction.`},{t:"widget",name:"noise-lab",caption:'Pick T1 and T2 values and watch the Bloch vector shrink toward the pole or toward the z axis. Then scale both by 10 and notice how many "gates" fit into the same decay. The ratio of coherence to gate time, not the raw time, is the figure of merit.'},{t:"callout",kind:"warn",title:"Qubit counts are not the whole story",text:T`A headline qubit number says little without fidelity, connectivity and the ability to correct errors. A machine with fewer, better, well-connected qubits can outperform a larger noisy one. Also distinguish **physical qubits** (the actual devices, noisy) from **logical qubits** (error-corrected, built from many physical ones). Depending on the code and the physical error rate, one logical qubit may need from tens to thousands of physical qubits. Useful algorithms such as Shor's need logical qubits, as the Error Correction and Shor lessons explain.`},{t:"md",text:T`## Quantum key distribution: the idea

So far we have asked what quantum hardware could *break*. Now we ask what it can *protect*. Two parties, Alice and Bob, want a shared secret random key. If it is as long as the message and used once, the **one-time pad** (XOR the message with the key) is provably unbreakable. The only problem is distributing the key. **Quantum key distribution (QKD)** uses quantum states for exactly that, and its security rests on physics, specifically the no-cloning theorem and the disturbance caused by measurement, rather than on the difficulty of a maths problem.

### BB84 step by step

Charles Bennett and Gilles Brassard proposed BB84 in 1984. Alice uses two bases, $Z$ (states $\lvert 0\rangle,\lvert 1\rangle$) and $X$ (states $\lvert +\rangle,\lvert -\rangle$). These bases are *mutually unbiased*: a state from one basis, measured in the other, gives a fair coin.

1. For each round Alice picks a random bit $k$ and a random basis, and sends the corresponding qubit. For example, bit 1 in basis $X$ is $\lvert -\rangle$.
2. Bob picks his own random basis and measures. If his basis matches hers he gets $k$ exactly (noise aside). If not, he gets a random bit.
3. Over a public (but authenticated) channel they announce their *bases*, never the bits. They keep only the rounds with matching bases. This is **sifting**, and it keeps about half the rounds.
4. They publicly compare a random sample of the sifted bits. The fraction that disagree is the **quantum bit error rate (QBER)**. If it is too high, they abort.
5. They run **error correction** (exchanging parity information to make the remaining strings identical) and then **privacy amplification** (hashing the string down to a shorter one, which squeezes out whatever partial information Eve might hold).

**Worked example.** Alice sends 1000 qubits. About 500 survive sifting. They sacrifice 100 of these to estimate QBER, leaving about 400 raw key bits, which then shrink further during error correction and privacy amplification to a shorter final key.

| Round | Alice bit | Alice basis | Bob basis | Bob result | Kept? |
|---|---|---|---|---|---|
| 1 | 0 | Z | Z | 0 | yes |
| 2 | 1 | X | Z | random | no |
| 3 | 1 | Z | Z | 1 | yes |
| 4 | 0 | X | X | 0 | yes |`},{t:"widget",name:"bb84",caption:"Run BB84 with the eavesdropper switched off. Watch the sifted key: Alice and Bob agree on every kept bit, and about half the rounds are discarded. This is the baseline, a QBER close to zero (apart from any channel noise you add)."},{t:"md",text:T`## Why Eve is caught

Suppose an eavesdropper, Eve, sits on the fibre. The no-cloning theorem says she cannot copy a qubit whose basis she does not know, so she must *measure* it. Then she resends a fresh qubit to Bob. This is the **intercept-resend attack**.

Eve does not know Alice's basis, so she guesses. Compute the error that Bob sees *in the sifted key*, that is, only in rounds where Alice and Bob used the same basis:

- With probability $1/2$ Eve guesses the **right basis**. She learns the bit, resends it correctly, and Bob sees no error.
- With probability $1/2$ Eve guesses the **wrong basis**. Her result is a coin flip, and she resends a state in the wrong basis. Bob, measuring in Alice's basis, now gets a random outcome: wrong with probability $1/2$.

$$\text{QBER}=\tfrac12\cdot 0+\tfrac12\cdot\tfrac12=\tfrac14=25\%.$$

Every sifted bit therefore has a 25% chance of exposing Eve. If Alice and Bob compare $n$ bits, the probability they *miss* her is $(3/4)^n$. For $n=20$ that is about $0.3\%$; for $n=100$ it is about $3\times10^{-13}$.

Eve could attack more cleverly, for example by measuring only a fraction of the qubits, trading information for detectability, or by using weak, collective measurements. The general principle remains: **information gain implies disturbance**. Security proofs bound Eve's information in terms of the observed QBER.

### The roughly 11% threshold

Real channels have noise even without Eve, and Alice and Bob cannot tell noise from eavesdropping, so they assume the worst: all errors come from Eve. The asymptotic secret-key fraction, for the standard analysis with one-way classical post-processing, is

$$r = 1 - 2\,h(Q),\qquad h(Q) = -Q\log_2 Q-(1-Q)\log_2(1-Q).$$

One factor $h(Q)$ is the cost of error correction; the other bounds Eve's information, for which privacy amplification must pay. At $Q=0.11$ we get $h(Q)\approx0.5$ and so $r\approx0$. Beyond about 11% QBER no secret key can be extracted by this method; below it, a positive fraction survives. Finite-size effects, imperfect devices and practical sources make real thresholds tighter.`},{t:"widget",name:"bb84",caption:"Now switch the eavesdropper on. Run a few hundred rounds and read off the QBER: it should hover near 25%, far above the 11% abort threshold, so Alice and Bob discard the key. Try a short run of only 10 rounds and see how sometimes Eve is lucky: small samples give weak detection, matching the (3/4)^n formula."},{t:"callout",kind:"math",title:"Check the threshold yourself",text:T`Evaluate $h(0.11)$: $-0.11\log_2 0.11\approx 0.11\times3.18=0.350$ and $-0.89\log_2 0.89\approx0.89\times0.168=0.150$, so $h\approx0.50$ and $1-2h\approx0$. At $Q=0.05$, $h\approx0.286$, giving $r\approx0.43$: about 43% of sifted bits can become secret key. Remember sifting already halved the raw rounds.`},{t:"md",text:T`## E91: entanglement version, and a test of honesty

In 1991 Artur Ekert proposed a protocol based on entangled pairs. A source sends one qubit of each pair to Alice and one to Bob. Each measures in a randomly chosen basis. When bases match, results are perfectly correlated and become key bits. On the other rounds, where bases differ, they compute the **CHSH value** $S$ from the entanglement lesson. If $S$ is close to $2\sqrt2$, the pair really is entangled, and by *monogamy* no third party can share correlations with it. If an eavesdropper has tampered with things, $S$ falls toward the classical bound 2.

The elegant consequence is **device-independent** security: if the CHSH test is passed, the key is secure even if you do not trust the inner workings of the devices. This is much harder to implement (it needs loophole-free Bell tests and very high detection efficiency), so practical systems mostly use BB84-type protocols, but the idea is deeply important.

### Quantum random numbers

A related use of quantum mechanics is **quantum random number generation**. Measuring $\lvert +\rangle$ in the $Z$ basis gives a bit that is, according to theory, genuinely unpredictable, as opposed to the deterministic output of a pseudo-random generator. Commercial devices exist, typically using photon arrival times or detection at a beam splitter. They still need engineering care, because biased detectors or electronic noise can spoil the randomness, and the output is usually post-processed (extracted) before use.`},{t:"widget",name:"chsh",caption:"Use settings 0, 90 degrees for Alice and 45, 135 degrees for Bob. Check that S is near 2.83. Now imagine an eavesdropper degrading the pairs: weakening the correlations lowers S, and once it drops to 2 or below the entanglement certificate fails and the key must be discarded."},{t:"md",text:T`## QKD in the real world, and the alternative

### Limits of QKD

- **Distance and rate.** Photons are lost in fibre, and you cannot amplify a qubit without breaking no-cloning. Practical fibre links reach hundreds of kilometres at low key rates, and satellite links have extended this experimentally. Longer terrestrial chains use **trusted nodes**, intermediate stations that decrypt and re-encrypt keys. These nodes must be physically secure, which weakens the "security from physics alone" claim. Quantum repeaters would fix this but remain a research goal.
- **Authentication is needed.** The classical channel must be authenticated or Eve could impersonate Bob. This needs a short pre-shared secret or a classical signature scheme. QKD *expands* a secret, it does not create trust from nothing.
- **Implementation side channels.** The proofs apply to ideal devices. Real lasers can leak information, and detectors can be blinded or manipulated. Several published attacks on commercial systems exploited such flaws. Defences exist (including measurement-device-independent protocols), but they add complexity.
- **Specialised hardware.** QKD requires dedicated fibre or free-space optics, and it secures a *link*, not an arbitrary internet connection. It also gives you keys, not signatures or general-purpose encryption.

### Post-quantum cryptography

The other response to Shor's algorithm is purely classical. **Post-quantum cryptography (PQC)** designs algorithms that run on ordinary computers but are believed to resist both classical and quantum attacks, relying on problems with no known quantum shortcut. After a multi-year public competition, NIST published its first standards in August 2024:

- **ML-KEM** (FIPS 203, derived from CRYSTALS-Kyber): a lattice-based key-encapsulation mechanism for establishing shared keys.
- **ML-DSA** (FIPS 204, from CRYSTALS-Dilithium): a lattice-based digital signature scheme.
- **SLH-DSA** (FIPS 205, from SPHINCS+): a signature scheme built only from hash functions, a conservative backup whose security rests on very minimal assumptions.

Further algorithms have been selected or are under evaluation, so follow NIST's current guidance.

### Why most organisations choose PQC

PQC is software: it runs on existing networks and devices, handles signatures as well as key exchange, and scales across the internet with no dedicated fibre. Agencies such as the NSA and the UK's NCSC have favoured PQC for general use and regarded QKD as having niche value. The real urgency is **harvest now, decrypt later**: an adversary can record encrypted traffic today and decrypt it once a large quantum computer exists, so long-lived secrets need protection *before* such a machine arrives.

### Misconceptions

- *"QKD encrypts my data."* It only distributes keys; a separate cipher then does the encryption.
- *"QKD is unconditionally secure."* The protocol is, under ideal assumptions. Real systems are only as secure as their hardware and authentication.
- *"PQC is quantum."* It is not. It is ordinary mathematics, hardened against quantum attacks.
- *"PQC has been proven secure."* It rests on unproven hardness assumptions, like most of today's cryptography; this is why diversity (lattices and hashes) is valuable.

The two approaches are therefore complementary rather than rivals, but PQC does the heavy lifting. Next, the final lesson in the course takes a step back to ask what quantum computers will and will not be good for, and how the field is likely to develop.`}],quiz:[{q:"Which DiVincenzo criterion fails for a qubit whose coherence time is much shorter than its gate time?",options:["Initialisation into a known state","Long coherence compared with gate time","Qubit-specific measurement","A universal set of gates exists in principle"],answer:1,explain:"Coherence must outlast many gate operations. If the state decays in less time than one gate takes, no useful circuit can run, even if you can initialise, measure and (in principle) perform universal gates."},{q:"Which pairing of platform and typical trait is most accurate?",options:["Trapped ions: very fast gates but poor fidelity","Superconducting transmons: fast gates and fixed nearest-neighbour connectivity","Photonics: all-to-all connectivity with negligible loss","Neutral atoms: must be cooled to 10 mK in a dilution refrigerator"],answer:1,explain:"Transmons run gates in tens of nanoseconds but sit on a chip with fixed links. Ions have excellent fidelity but slow gates; photonic systems struggle mainly with loss; neutral atoms are laser-trapped and do not need a dilution refrigerator."},{q:String.raw`In BB84 with an intercept-resend eavesdropper who guesses bases at random, what QBER appears in the sifted key?`,options:[String.raw`$0\%$, because Eve resends the bit she measured`,String.raw`$12.5\%$`,String.raw`$25\%$`,String.raw`$50\%$`],answer:2,explain:String.raw`Eve picks the wrong basis half the time. In those cases Bob's result is a fair coin, wrong half the time, giving $\tfrac12\cdot\tfrac12=\tfrac14$. When she guesses right she introduces no error.`},{q:"Alice and Bob measure a QBER of 15% over a long run. What should they conclude using the standard asymptotic analysis?",options:["They can still extract a long key by using more privacy amplification","No secret key can be extracted by this method, so they should abort","The channel is perfect and Eve is absent","They should discard only the bits where bases differ"],answer:1,explain:String.raw`The key fraction $1-2h(Q)$ is negative above $Q\approx11\%$, since $h(0.15)\approx0.61$. They cannot tell noise from eavesdropping, so they must assume Eve caused every error and abort.`},{q:"Why do most organisations prefer post-quantum cryptography to QKD for protecting data against future quantum computers?",options:["PQC is proven unbreakable and QKD is not","QKD cannot work at all in practice","PQC is software that runs on existing networks, supports signatures, and needs no dedicated optical links or trusted nodes","PQC uses quantum entanglement but is cheaper"],answer:2,explain:"PQC is deployable over the ordinary internet by updating software, and covers both key exchange and signatures. QKD needs special hardware, authentication and often trusted nodes. Neither is absolutely proven: PQC relies on hardness assumptions, and QKD on ideal devices."}],takeaways:["DiVincenzo: scalable qubits, initialisation, universal gates, measurement, and coherence that outlasts the gates; the last is usually the hardest.","Every platform trades something: transmons are fast but fixed-wired, ions are precise but slow, atoms scale but are slow to cycle, photons are robust but lossy.","Physical qubit counts mislead; fidelity, connectivity and the physical-to-logical overhead decide what a machine can do. Verify current numbers from vendors.","BB84 sifts to matching bases and detects Eve through disturbance: intercept-resend causes 25% QBER, and about 11% QBER is the abort threshold.","QKD has real limits (distance, trusted nodes, authentication, side channels), so most organisations deploy post-quantum cryptography (ML-KEM, ML-DSA, SLH-DSA) instead."]},fe=Object.freeze(Object.defineProperty({__proto__:null,lesson:be},Symbol.toStringTag,{value:"Module"})),b=String.raw,W="```",ye={id:"linear-algebra",order:3,part:"Foundations",title:"Matrices, Unitaries & Tensor Products",summary:"Matrices as transformations, the special roles of Hermitian and unitary matrices, Dirac notation, and the Kronecker product that glues qubits together.",minutes:35,objectives:["You can multiply matrices and apply them to vectors, and interpret a matrix as a transformation.","You can compute adjoints and test whether a matrix is Hermitian or unitary.","You can read and write Dirac notation: kets, bras, inner and outer products, projectors.","You can find eigenvalues and eigenvectors of simple 2x2 matrices and say what they mean physically.","You can compute the tensor (Kronecker) product of vectors and matrices."],blocks:[{t:"md",text:b`## Matrices are transformations

In Lesson 2 we met vectors in $\mathbb{C}^n$. A **matrix** is a rectangular array of numbers that *acts* on vectors to produce new vectors. For a $2\times2$ matrix $M$ and a vector $v$,
$$Mv=\begin{pmatrix}a&b\\c&d\end{pmatrix}\begin{pmatrix}v_1\\v_2\end{pmatrix}=\begin{pmatrix}a v_1+b v_2\\ c v_1+d v_2\end{pmatrix}.$$
Read each output entry as "row dotted with vector". Two facts make matrices the right language:

- **Linearity.** $M(\alpha u+\beta v)=\alpha Mu+\beta Mv$. Knowing what $M$ does to a basis tells you what it does to everything: the **columns** of $M$ are the images of the basis vectors $e_0, e_1$.
- **Composition is multiplication.** Doing $A$ then $B$ is the single matrix $BA$ (note the order: the first operation is on the right, next to the vector). Matrix multiplication is generally **not commutative**: $AB\neq BA$ in general. This non-commutativity is physical, not a nuisance: it is why the order of quantum gates matters.

Example: the NOT matrix $X=\begin{pmatrix}0&1\\1&0\end{pmatrix}$ swaps components: $X(1,0)^T=(0,1)^T$. In quantum terms it maps $|0\rangle$ to $|1\rangle$ and back. The Hadamard matrix $H=\tfrac1{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$ maps $(1,0)^T$ to $\tfrac1{\sqrt2}(1,1)^T$, an equal superposition.

### Adjoint (conjugate transpose)

The **adjoint** $M^\dagger$ ("M dagger") is obtained by transposing and conjugating every entry:
$$\begin{pmatrix}a&b\\c&d\end{pmatrix}^\dagger=\begin{pmatrix}a^*&c^*\\b^*&d^*\end{pmatrix}.$$
It is the matrix analogue of the complex conjugate and satisfies $(AB)^\dagger=B^\dagger A^\dagger$ and $\langle u|Mv\rangle=\langle M^\dagger u|v\rangle$. Two families of matrices defined using it dominate quantum computing.`},{t:"md",text:b`## Hermitian and unitary matrices

### Hermitian: observables

A matrix is **Hermitian** if $A^\dagger=A$. Examples are $X$, $Z$, and $Y=\begin{pmatrix}0&-i\\i&0\end{pmatrix}$ (the three **Pauli matrices**, together with the identity $I$). Hermitian matrices have two crucial properties: their **eigenvalues are real**, and their eigenvectors for different eigenvalues are **orthogonal**. In quantum mechanics they represent measurable quantities (observables), and the eigenvalues are the possible measurement results.

### Unitary: reversible operations

A matrix is **unitary** if
$$U^\dagger U=UU^\dagger=I.$$
Equivalently, $U^{-1}=U^\dagger$, and equivalently the columns of $U$ form an orthonormal basis. The decisive property: unitaries **preserve inner products and lengths**,
$$\langle Uu|Uv\rangle=\langle u|U^\dagger U|v\rangle=\langle u|v\rangle,$$
so a unit vector stays a unit vector (probabilities keep summing to 1) and orthogonal states stay orthogonal. Quantum evolution (closed systems) and therefore every quantum gate is unitary. Every unitary is invertible, so quantum gates are **reversible**: you can always undo a gate with its adjoint.`},{t:"callout",kind:"math",title:"Worked example: is H unitary?",text:b`$H^\dagger=H$ (it is real and symmetric), so $H^\dagger H=H^2=\tfrac12\begin{pmatrix}1&1\\1&-1\end{pmatrix}\begin{pmatrix}1&1\\1&-1\end{pmatrix}=\tfrac12\begin{pmatrix}2&0\\0&2\end{pmatrix}=I.$ Yes: $H$ is both Hermitian and unitary, and it is its own inverse, which is why applying it twice undoes it (Lesson 1). Counter-example: $M=\begin{pmatrix}1&1\\0&1\end{pmatrix}$ has columns $(1,0)$ and $(1,1)$, which are not orthogonal, so $M$ is not unitary; applying it to $(0,1)$ gives $(1,1)$, whose length is $\sqrt2$, not 1. It would break probability conservation, so it cannot be a quantum gate.`},{t:"widget",name:"gate-explorer",caption:"Select H, then X, then T in turn. For each, read the matrix and the unitarity check: U-dagger times U should equal the identity. Watch the animation on the Bloch sphere (introduced properly in Lesson 5). Which gates are Hermitian (equal to their own conjugate transpose), and which are not? T is unitary but not Hermitian."},{t:"md",text:b`## Eigenvalues and eigenvectors

An **eigenvector** of $A$ is a non-zero vector that $A$ only rescales: $Av=\lambda v$. The number $\lambda$ is the **eigenvalue**. To find them, solve $\det(A-\lambda I)=0$. For $X$:
$$\det\begin{pmatrix}-\lambda&1\\1&-\lambda\end{pmatrix}=\lambda^2-1=0\;\Rightarrow\;\lambda=\pm1.$$
For $\lambda=+1$: $(x,y)$ with $y=x$, giving $\tfrac1{\sqrt2}(1,1)$. For $\lambda=-1$: $\tfrac1{\sqrt2}(1,-1)$. So the eigenvectors of $X$ are exactly the Hadamard-basis vectors $h_\pm$ of Lesson 2, which in Lesson 5 we will name $|+\rangle$ and $|-\rangle$. Likewise $Z=\mathrm{diag}(1,-1)$ has eigenvectors $e_0,e_1$ with eigenvalues $+1,-1$.

Facts to remember:

- Hermitian matrices: eigenvalues are real; eigenvectors can be chosen orthonormal. (Spectral theorem: $A=\sum_k\lambda_k P_k$.)
- Unitary matrices: eigenvalues have modulus 1, so they are phases $e^{i\theta}$. This is the seed of **phase estimation** (Lesson 14), which reads out such phases.

Eigenvectors answer the question "which states does this operation leave unchanged up to a phase?" and, for a Hermitian observable, "which states give a definite measurement result?"`},{t:"md",text:b`## Dirac notation, carefully

Physicists write vectors in a compact notation invented by Paul Dirac. It looks odd for a few minutes and then it is hard to live without.

- A **ket** $|v\rangle$ is just a column vector. $|0\rangle=\begin{pmatrix}1\\0\end{pmatrix}$ and $|1\rangle=\begin{pmatrix}0\\1\end{pmatrix}$ are the standard basis; the label is a name, not a number you can add. 
- A **bra** $\langle v|$ is the conjugate transpose of the ket: a *row* vector. $\langle0|=(1\;\,0)$. 
- The bracket (**inner product**) $\langle u|v\rangle$, a bra meeting a ket, is a number: $\langle0|0\rangle=1$, $\langle0|1\rangle=0$.
- The **outer product** $|u\rangle\langle v|$, a ket meeting a bra, is a **matrix**:
$$|0\rangle\langle0|=\begin{pmatrix}1\\0\end{pmatrix}(1\;\,0)=\begin{pmatrix}1&0\\0&0\end{pmatrix},\qquad |0\rangle\langle1|=\begin{pmatrix}0&1\\0&0\end{pmatrix}.$$

Because $|u\rangle\langle v|$ acts as $|w\rangle\mapsto\langle v|w\rangle\,|u\rangle$, we can build any operator from outer products. For example
$$X=|0\rangle\langle1|+|1\rangle\langle0|,\qquad Z=|0\rangle\langle0|-|1\rangle\langle1|.$$
The operator $P_v=|v\rangle\langle v|$ for a unit vector $|v\rangle$ is a **projector**: $P_v^2=P_v$, and it keeps only the component along $|v\rangle$. For any orthonormal basis the **completeness relation** holds:
$$|0\rangle\langle0|+|1\rangle\langle1|=I,$$
and inserting it lets us expand any state: $|\psi\rangle=I|\psi\rangle=\langle0|\psi\rangle|0\rangle+\langle1|\psi\rangle|1\rangle$. Finally, $\langle\psi|A|\psi\rangle$ is the **expectation value** of $A$ in state $|\psi\rangle$, the average result of measuring the observable $A$ (made precise in Lesson 9).`},{t:"callout",kind:"tip",title:"Reading Dirac notation",text:b`Read right to left like matrix products. $\langle\phi|A|\psi\rangle$ means "apply $A$ to $\psi$, then take the inner product with $\phi$". The quantity $|\langle\phi|\psi\rangle|^2$ is the probability of finding $\phi$ when $\psi$ is measured in a basis containing $\phi$. Bras and kets of the same label are adjoints of each other: $(|v\rangle)^\dagger=\langle v|$ and $(\alpha|v\rangle)^\dagger=\alpha^*\langle v|$.`},{t:"md",text:b`## The tensor (Kronecker) product

How do we describe two qubits? We combine their vector spaces with the **tensor product** $\otimes$. For vectors $u=(u_1,u_2)^T$ and $v=(v_1,v_2)^T$,
$$u\otimes v=\begin{pmatrix}u_1v\\u_2v\end{pmatrix}=\begin{pmatrix}u_1v_1\\u_1v_2\\u_2v_1\\u_2v_2\end{pmatrix}.$$
Each entry of the first vector scales a full copy of the second. With big-endian ordering (the first qubit leftmost), the four basis states are
$$|00\rangle=\begin{pmatrix}1\\0\\0\\0\end{pmatrix},\;|01\rangle=\begin{pmatrix}0\\1\\0\\0\end{pmatrix},\;|10\rangle=\begin{pmatrix}0\\0\\1\\0\end{pmatrix},\;|11\rangle=\begin{pmatrix}0\\0\\0\\1\end{pmatrix},$$
and $|01\rangle$ is shorthand for $|0\rangle\otimes|1\rangle$. For matrices, $A\otimes B$ replaces each entry $a_{jk}$ of $A$ by the block $a_{jk}B$:
$$A\otimes B=\begin{pmatrix}a_{11}B&a_{12}B\\a_{21}B&a_{22}B\end{pmatrix}.$$
The key rule is the **mixed-product property**: $(A\otimes B)(u\otimes v)=Au\otimes Bv$. Applying $A$ to the first qubit and $B$ to the second is the single matrix $A\otimes B$.`},{t:"callout",kind:"math",title:"Worked example: X on qubit 0 of two qubits",text:b`Applying NOT to the first qubit and nothing to the second is $X\otimes I$:
$$X\otimes I=\begin{pmatrix}0\cdot I&1\cdot I\\1\cdot I&0\cdot I\end{pmatrix}=\begin{pmatrix}0&0&1&0\\0&0&0&1\\1&0&0&0\\0&1&0&0\end{pmatrix}.$$
Apply it to $|01\rangle=(0,1,0,0)^T$: the result is $(0,0,0,1)^T=|11\rangle$. The first qubit flipped, the second untouched, as expected. Another: $X\otimes Z=\begin{pmatrix}0&Z\\Z&0\end{pmatrix}$, a $4\times4$ matrix with entries $\pm1$. Sizes multiply: $n$ qubits need $2^n$-dimensional vectors and $2^n\times2^n$ matrices.`},{t:"callout",kind:"warn",title:"Not every vector is a product",text:b`Every vector of the form $u\otimes v$ is called a **product state**, but most vectors in $\mathbb{C}^4$ are not products. Try to write $\tfrac1{\sqrt2}(1,0,0,1)^T$ as $(u_1v_1,u_1v_2,u_2v_1,u_2v_2)$: you would need $u_1v_2=0$ and $u_2v_1=0$ while $u_1v_1\neq0$ and $u_2v_2\neq0$, which is impossible. That vector is the entangled Bell state, the topic of Lesson 8. The tensor product space is bigger than the set of products; the extra vectors are entangled states.`},{t:"md",text:b`## In code

${W}python
import numpy as np

X = np.array([[0, 1], [1, 0]], dtype=complex)
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)
I = np.eye(2)

def is_unitary(U):
    return np.allclose(U.conj().T @ U, np.eye(len(U)))

print(is_unitary(H), is_unitary(np.array([[1, 1], [0, 1]])))   # True False

vals, vecs = np.linalg.eigh(X)       # eigh is for Hermitian matrices
print(vals)                          # [-1.  1.]

XI = np.kron(X, I)                   # X on the first qubit (big-endian)
ket01 = np.kron([1, 0], [0, 1])
print(XI @ ket01)                    # [0 0 0 1] = |11>
${W}

Try changing the Kronecker order to ${"`np.kron(I, X)`"}: it acts on the *second* qubit. Qiskit's own internal ordering is little-endian (the opposite), which is a classic source of bugs. In this course the first qubit is always leftmost.

You now have the whole mathematical toolkit: vectors, inner products, unitary matrices, eigenvectors, Dirac notation and tensor products. Lesson 4 supplies the physics that explains *why* quantum states are unit vectors and evolution is unitary, and Lesson 5 puts the toolkit to work on a single qubit.`}],quiz:[{q:"Which property of a unitary matrix U makes it a legitimate quantum operation?",options:["U is symmetric.","U preserves inner products and lengths, so probabilities still sum to 1 and the operation is reversible.","All entries of U are real.","U has determinant zero."],answer:1,explain:"Unitarity (U-dagger U = I) means <Uu|Uv> = <u|v>. Unit vectors stay unit vectors and the operation can be undone by U-dagger. Symmetry and realness are not required (Y and T are unitary with complex entries), and a singular matrix would not be reversible."},{q:"What is the outer product |0><1| as a matrix?",options:["[[0,1],[0,0]]","[[0,0],[1,0]]","The number 0","[[1,0],[0,1]]"],answer:0,explain:"The ket (1,0)^T times the bra (0, 1) gives a matrix with a single 1 in row 0, column 1. It maps |1> to |0> and kills |0>. Contrast with <0|1> = 0, a number."},{q:"The eigenvalues of the Pauli X matrix and its eigenvectors are:",options:["+1 and -1 with eigenvectors |0> and |1>","+1 and -1 with eigenvectors (|0>+|1>)/sqrt2 and (|0>-|1>)/sqrt2","0 and 1 with eigenvectors (|0>+|1>)/sqrt2 and (|0>-|1>)/sqrt2","+i and -i with eigenvectors |0> and |1>"],answer:1,explain:"det(X - lambda I) = lambda^2 - 1 gives lambda = +-1. X(1,1) = (1,1) and X(1,-1) = -(1,-1). The eigenvectors |0> and |1> belong to Z, not X."},{q:"What is (X tensor I) applied to |10>, with big-endian order (first qubit leftmost)?",options:["|11>","|00>","|10>","|01>"],answer:1,explain:"X acts on the first qubit only, flipping it from 1 to 0 and leaving the second as 0, giving |00>. Applying X to the second qubit would instead require I tensor X and give |11>."},{q:"Why is the vector (1,0,0,1)/sqrt2 in C^4 not a tensor product u tensor v of two single-qubit vectors?",options:["Because it is not normalised.","Because a product would need u1 v2 = 0 and u2 v1 = 0 while u1 v1 and u2 v2 are non-zero, which is impossible; it is entangled.","Because tensor products only exist for real vectors.","Because it has more than one non-zero entry."],answer:1,explain:"A product state has entries (u1v1, u1v2, u2v1, u2v2). Non-zero first and last entries force u1, v1, u2, v2 all non-zero, so the middle entries cannot vanish. Many products have several non-zero entries; this particular pattern is the Bell state."}],takeaways:["Matrices are linear transformations; the columns are the images of the basis vectors, and gate order is right-to-left multiplication.","Hermitian matrices (A-dagger = A) represent observables with real eigenvalues; unitary matrices (U-dagger U = I) represent reversible evolution and gates.","Dirac notation: ket = column, bra = conjugate row, <u|v> is a number, |u><v| is a matrix, |v><v| is a projector.","The tensor product builds multi-qubit spaces: dimension 2^n, big-endian order, and A tensor B acts on separate qubits.","Most vectors in a tensor-product space are not products; the rest are entangled states."]},we=Object.freeze(Object.defineProperty({__proto__:null,lesson:ye},Symbol.toStringTag,{value:"Module"})),B=String.raw,ve={id:"measurement-noise",order:9,part:"The Qubit",title:"Measurement, Mixed States and Noise",summary:"Measurement turns amplitudes into statistics, ignorance and entanglement turn pure states into mixed ones, and noise is what happens when a qubit quietly entangles with its surroundings.",minutes:25,objectives:["You can apply the Born rule in the Z, X and Y bases, describe collapse, and estimate the Bloch vector from measurement counts including the 1/sqrt(N) shot noise.","You can write a density matrix, compute its trace and purity, and explain why a 50/50 mixture of |0> and |1> is different from the superposition |+>.","You can compute a reduced density matrix by partial trace and show that either half of a Bell pair is maximally mixed.","You can describe amplitude damping, dephasing, depolarizing and flip noise with Kraus operators and as shrinkings of the Bloch ball, and state why T2 <= 2 T1."],blocks:[{t:"md",text:B`## Measurement: from amplitudes to statistics

So far a qubit has been a state vector $\lvert\psi\rangle=\alpha\lvert 0\rangle+\beta\lvert 1\rangle$ with $\lvert\alpha\rvert^2+\lvert\beta\rvert^2=1$. You never get to look at $\alpha$ and $\beta$ directly. What a lab gives you is a click: a $0$ or a $1$. The **Born rule** connects the two:

$$P(0)=\lvert\langle 0\vert\psi\rangle\rvert^2=\lvert\alpha\rvert^2,\qquad P(1)=\lvert\langle 1\vert\psi\rangle\rvert^2=\lvert\beta\rvert^2.$$

Amplitudes are the bookkeeping; probabilities are what you can observe. After the click, the state is no longer $\lvert\psi\rangle$. It is $\lvert 0\rangle$ or $\lvert 1\rangle$ to match the outcome. This is **projective measurement** and the update is called **collapse**. The immediate consequence is that measuring again gives the same answer with certainty: the second measurement finds a state that is already an eigenstate.

### Measuring in another basis

Nothing makes the $Z$ basis special. To measure in the basis $\{\lvert +\rangle,\lvert -\rangle\}$ you compute overlaps with those vectors instead (in hardware you apply $H$ first and then measure in $Z$). For $\lvert\psi\rangle=\alpha\lvert 0\rangle+\beta\lvert 1\rangle$,

$$P(\pm)=\left\lvert\frac{\alpha\pm\beta}{\sqrt2}\right\rvert^2,\qquad P(\pm i)=\left\lvert\frac{\alpha\mp i\beta}{\sqrt2}\right\rvert^2,$$

where $\lvert\pm i\rangle=(\lvert 0\rangle\pm i\lvert 1\rangle)/\sqrt2$ is the $Y$ basis.

**Worked example.** Take $\lvert\psi\rangle=0.6\lvert 0\rangle+0.8i\lvert 1\rangle$. Check normalisation: $0.36+0.64=1$.

- $Z$ basis: $P(0)=0.36$, $P(1)=0.64$. The factor $i$ is invisible here.
- $X$ basis: $P(+)=\lvert 0.6+0.8i\rvert^2/2=1/2$, so $P(-)=1/2$.
- $Y$ basis: $P(+i)=\lvert 0.6-i(0.8i)\rvert^2/2=\lvert 1.4\rvert^2/2=0.98$ and $P(-i)=0.02$.

The state looks like a coin flip in $X$, a 36/64 bias in $Z$, and almost a certainty in $Y$. The relative **phase** $i$ is real information, but you only see it by measuring in a basis that is sensitive to it.

### Expectation values and the Bloch vector

Label the two outcomes of a Pauli measurement $+1$ and $-1$. The average outcome is the **expectation value**, for instance $\langle Z\rangle=P(0)-P(1)$. In the example,

$$\langle Z\rangle=0.36-0.64=-0.28,\qquad \langle X\rangle=0.5-0.5=0,\qquad \langle Y\rangle=0.98-0.02=0.96.$$

These three numbers are exactly the Bloch vector $\vec r=(x,y,z)=(0,\,0.96,\,-0.28)$, and its length is $\sqrt{0.9216+0.0784}=1$, as it must be for a pure state. So a Bloch vector is not abstract: it is the triple of averages you would see if you could measure the same state again and again in three bases. Since you cannot clone an unknown state, you instead **prepare it many times**, measure each copy once, and tally. This is called **state tomography**.

### Shot noise

Each single run gives a $\pm1$ with variance $1-\langle Z\rangle^2$. Averaging $N$ independent runs (shots) gives an estimate whose standard error is

$$\sigma=\sqrt{\frac{1-\langle Z\rangle^2}{N}}\;\le\;\frac1{\sqrt N}.$$

To pin down an expectation value to $\pm0.01$ in the worst case you need about $N=10^4$ shots; to gain one more digit you need a hundred times more. This $1/\sqrt N$ cost is not a flaw in the hardware. It is built into the statistics of sampling, and it is why quantum algorithms that need precise expectation values (like VQE later in the course) are expensive to run.`},{t:"widget",name:"bloch",props:{start:"plusi",tools:["gates","angles","measure"]},caption:"Start from the plus-i state and measure it many times in each basis. The three tallies, rescaled to the range -1 to 1, are the x, y and z coordinates. Repeat with only 20 shots and then 2000 and watch the scatter shrink roughly as 1/sqrt(N). Then rotate the state with a gate and predict the new tallies before measuring."},{t:"callout",kind:"warn",title:"Misconception: measurement reveals a hidden value",text:B`It is tempting to read $P(0)=0.36$ as "the qubit secretly was 0 in 36% of cases and we just found out which". The Bell and CHSH results from the last lesson rule that picture out. The outcome is not read off a pre-existing label. Also, one measurement of an unknown state gives you one bit and destroys the rest; you cannot recover $\alpha$ and $\beta$ from a single shot.`},{t:"md",text:B`## Pure versus mixed: superposition is not ignorance

Suppose a machine prepares $\lvert 0\rangle$ half the time and $\lvert 1\rangle$ the other half, and does not tell you which. Is your qubit now "in a superposition of 0 and 1"? No. A superposition $(\lvert 0\rangle+\lvert 1\rangle)/\sqrt2$ is one definite quantum state. The machine's output is a **mixture**: a probability distribution over definite states, representing your ignorance of which was prepared.

To handle both with one tool we use the **density matrix**. For a pure state, $\rho=\lvert\psi\rangle\langle\psi\rvert$. For an ensemble where state $\lvert\psi_i\rangle$ occurs with probability $p_i$,

$$\rho=\sum_i p_i\,\lvert\psi_i\rangle\langle\psi_i\rvert.$$

Every density matrix is Hermitian, has non-negative eigenvalues, and satisfies $\mathrm{tr}\,\rho=1$. The outcome probabilities of any measurement are $P=\mathrm{tr}(\Pi\rho)$ for the projector $\Pi$, and expectation values are $\langle O\rangle=\mathrm{tr}(O\rho)$.

### Purity and the Bloch ball

The **purity** is $\mathrm{tr}\,\rho^2$. It equals $1$ for a pure state and is smaller for a mixed one; for a qubit the minimum is $1/2$. Every qubit density matrix can be written

$$\rho=\tfrac12\left(I+x\,X+y\,Y+z\,Z\right)=\frac12\begin{pmatrix}1+z & x-iy\\ x+iy & 1-z\end{pmatrix},\qquad \mathrm{tr}\,\rho^2=\frac{1+\lvert\vec r\rvert^2}{2}.$$

This matches the convention $x=2\,\mathrm{Re}\,\rho_{01}$, $y=-2\,\mathrm{Im}\,\rho_{01}$, $z=\rho_{00}-\rho_{11}$. Pure states have $\lvert\vec r\rvert=1$ and live on the surface of the Bloch sphere. Mixed states have $\lvert\vec r\rvert<1$ and live **inside** the ball. The centre is the **maximally mixed state** $I/2$, with $\vec r=0$ and purity $1/2$.

### Worked example: mixture versus superposition

Compare two preparations.

$$\rho_{\rm mix}=\tfrac12\lvert 0\rangle\langle 0\rvert+\tfrac12\lvert 1\rangle\langle 1\rvert=\begin{pmatrix}\tfrac12&0\\0&\tfrac12\end{pmatrix}=\frac I2,\qquad \rho_{+}=\lvert +\rangle\langle +\rvert=\begin{pmatrix}\tfrac12&\tfrac12\\ \tfrac12&\tfrac12\end{pmatrix}.$$

Their diagonals agree, so a $Z$ measurement cannot tell them apart: both give 50/50. The difference sits in the **off-diagonal** entries, called **coherences**. Measure in the $X$ basis: for $\rho_+$ you get $+$ with certainty ($\langle X\rangle=1$), while for $I/2$ you get $\pm$ with equal probability ($\langle X\rangle=\mathrm{tr}(XI/2)=0$). Purities are $\mathrm{tr}\,\rho_+^2=1$ and $\mathrm{tr}\,\rho_{\rm mix}^2=1/2$.

A subtle point: a 50/50 mixture of $\lvert +\rangle$ and $\lvert -\rangle$ also equals $I/2$. Many different ensembles give the same $\rho$, and since $\rho$ fixes every measurement statistic, they are physically indistinguishable. The density matrix is the real state; the ensemble is just one story that produces it.

### Reduced states and partial trace

Here is the second, deeper source of mixedness. Take the Bell state $\lvert\Phi^+\rangle=(\lvert 00\rangle+\lvert 11\rangle)/\sqrt2$. The pair is in a perfectly pure state. What describes qubit $A$ alone? We **trace out** $B$:

$$\rho_A=\mathrm{tr}_B\,\rho_{AB}=\sum_{b\in\{0,1\}}(I\otimes\langle b\rvert)\,\rho_{AB}\,(I\otimes\lvert b\rangle).$$

Expand $\rho_{AB}=\tfrac12\left(\lvert 00\rangle\langle 00\rvert+\lvert 00\rangle\langle 11\rvert+\lvert 11\rangle\langle 00\rvert+\lvert 11\rangle\langle 11\rvert\right)$. The cross terms contain $\lvert 0\rangle\langle 1\rvert$ on $B$, which has zero trace, so they vanish. What survives is

$$\rho_A=\tfrac12\lvert 0\rangle\langle 0\rvert+\tfrac12\lvert 1\rangle\langle 1\rvert=\frac I2.$$

The whole is pure (purity 1) yet each part is maximally mixed (purity $1/2$). Knowing everything about the pair means knowing nothing about either half. This is the precise statement behind the no-signalling remark in the entanglement lesson: whatever Alice does, Bob's qubit stays $I/2$, a fair coin in every basis.`},{t:"widget",name:"composer",props:{preset:"bell",compact:!0},caption:"Run the Bell preset and look at each qubit alone: 50/50 in the Z basis, and (after adding an H before measuring) 50/50 in the X basis too, so qubit 0 on its own is I/2. Yet the joint outcomes are only 00 and 11. All the information is in the correlations, none in the parts."},{t:"callout",kind:"note",title:"Two kinds of mixedness",text:B`A **proper mixture** reflects classical ignorance about which pure state was prepared. An **improper mixture** arises when the system is part of a larger entangled pure state, as with the Bell pair. They have the same density matrix and give identical statistics for any measurement on the system alone, so from inside the system you cannot tell which kind you have. That is why decoherence, discussed next, can be understood as ordinary unitary physics on a bigger system.`},{t:"md",text:B`## Noise: a qubit that leaks into its surroundings

No qubit is isolated. A superconducting circuit couples to stray electromagnetic modes, an ion to fluctuating fields. Treat the environment $E$ as extra qubits. Even if the combined system evolves unitarily, the qubit alone does not: the two become entangled, and by the previous section the qubit's reduced state becomes mixed. **Decoherence** is exactly this. Mathematically, noise is a **quantum channel**

$$\rho\;\mapsto\;\mathcal E(\rho)=\sum_k K_k\,\rho\,K_k^\dagger,\qquad \sum_k K_k^\dagger K_k=I,$$

where the $K_k$ are **Kraus operators**. One term is a unitary; several terms means the environment could have recorded several different things.

### Bit flip, phase flip, depolarizing

The simplest channels are random Pauli errors. **Bit flip** with probability $p$ has $K_0=\sqrt{1-p}\,I$ and $K_1=\sqrt p\,X$. **Phase flip** uses $Z$ instead of $X$. On the Bloch ball they are squeezes:

- Bit flip: $(x,y,z)\mapsto(x,\,(1-2p)y,\,(1-2p)z)$, the ball shrinks toward the $x$ axis.
- Phase flip: $(x,y,z)\mapsto((1-2p)x,\,(1-2p)y,\,z)$, the ball shrinks toward the $z$ axis.
- **Depolarizing**: with probability $p$ the qubit is replaced by $I/2$, so $\rho\mapsto(1-p)\rho+p\,I/2$ and $\vec r\mapsto(1-p)\vec r$. The ball shrinks uniformly toward the centre.

### Amplitude damping and T1

Real qubits lose energy. If $\lvert 1\rangle$ is the excited state, it decays to $\lvert 0\rangle$ with probability $\gamma=1-e^{-t/T_1}$. The Kraus operators are

$$K_0=\begin{pmatrix}1&0\\0&\sqrt{1-\gamma}\end{pmatrix},\qquad K_1=\begin{pmatrix}0&\sqrt\gamma\\0&0\end{pmatrix}.$$

$K_1$ is the "jump" $\lvert 1\rangle\to\lvert 0\rangle$; $K_0$ is the "no jump" branch, which still gently reduces the weight on $\lvert 1\rangle$. Check completeness: $K_0^\dagger K_0+K_1^\dagger K_1=\mathrm{diag}(1,\,1-\gamma+\gamma)=I$.

**Worked example.** Send $\lvert +\rangle$, with $\rho=\tfrac12\begin{pmatrix}1&1\\1&1\end{pmatrix}$, through amplitude damping.

$$K_0\rho K_0^\dagger=\tfrac12\begin{pmatrix}1&\sqrt{1-\gamma}\\ \sqrt{1-\gamma}&1-\gamma\end{pmatrix},\qquad K_1\rho K_1^\dagger=\tfrac12\begin{pmatrix}\gamma&0\\0&0\end{pmatrix}.$$

Adding them, $\rho'=\tfrac12\begin{pmatrix}1+\gamma&\sqrt{1-\gamma}\\ \sqrt{1-\gamma}&1-\gamma\end{pmatrix}$. Reading off the Bloch vector: $x=\sqrt{1-\gamma}$, $y=0$, $z=\gamma$. For $\gamma=0.19$ this is $(0.9,\,0,\,0.19)$, with length $\sqrt{0.846}<1$. The vector has slid toward the north pole ($\lvert 0\rangle$, the ground state) and shortened. As $\gamma\to1$ every state ends at $(0,0,1)$. Unlike the other channels, amplitude damping does not fix the centre of the ball; it pulls everything to the pole.

### Dephasing and T2

**Dephasing** destroys coherence without moving populations. It multiplies the off-diagonal entries by a factor $e^{-t/T_\varphi}$ and leaves the diagonal alone, so the ball is squeezed onto the $z$ axis, like the phase flip. It turns $\lvert +\rangle$ into $I/2$ over time while a state like $\lvert 0\rangle$ is untouched. Physically it is a random drift in the relative phase between $\lvert 0\rangle$ and $\lvert 1\rangle$.

Coherences decay from both mechanisms. Amplitude damping alone shrinks them by $e^{-t/2T_1}$ (as in the factor $\sqrt{1-\gamma}$ above), and dephasing adds its own rate:

$$\frac1{T_2}=\frac1{2T_1}+\frac1{T_\varphi}\quad\Longrightarrow\quad T_2\le 2T_1.$$

Since $1/T_\varphi\ge0$, coherence can never outlive twice the energy-relaxation time. $T_2=2T_1$ is the best case, with no pure dephasing at all.`},{t:"widget",name:"noise-lab",caption:"Prepare the plus state and turn on T1 only: the Bloch vector slides toward the north pole and shortens. Reset, turn on pure dephasing only: it shrinks toward the z axis but never changes z. Then try depolarizing: uniform shrinking. Check that you can never make the effective T2 longer than 2 T1."},{t:"callout",kind:"math",title:"Why noise cannot be undone by a gate",text:B`Unitary gates preserve purity, so they rotate the Bloch ball rigidly. A noise channel shrinks it, and no unitary on the qubit can expand it again. That is why the problem is hard, and why the next lesson, error correction (see the lesson with id error-correction), spreads information over many qubits and uses extra measurements to detect which error occurred without measuring the encoded state itself.`},{t:"md",text:B`## Putting it together

Three ideas have been described in turn, but they are one story. A pure state gives definite statistics for the observable it is an eigenstate of and random ones for others. A mixed state is a convex combination of those, with the Bloch vector inside the ball. And noise moves a state from the surface towards the interior, because the environment learns a little about it, which is the same as the qubit becoming entangled with something you cannot see.

Practical consequences for the rest of the course:

- **Circuit depth is a budget.** If a gate takes $t_g$ and coherence lasts $T_2$, you have roughly $T_2/t_g$ operations before the state is mostly noise. Qubit quality is the ratio, not either number alone.
- **Measurement itself is noisy.** Real readout sometimes reports the wrong bit, and the shot noise calculated above is added on top.
- **Mixed states are not failures.** Reservoir computing and noise-aware algorithms use density matrices on purpose, and $I/2$ is simply what one half of an entangled pair looks like.

### Common misconceptions

1. *"A mixed state is a superposition."* No: a superposition has coherences and purity 1; a mixture has lost them.
2. *"Collapse is decoherence."* Related but different. Collapse is the update after you record an outcome. Decoherence happens without anyone looking, and leaves a mixture rather than a single outcome.
3. *"Noise only flips bits."* Phase errors are just as damaging and are invisible to a $Z$ measurement of the raw state. Quantum codes must handle both.
4. *"More shots remove noise."* More shots remove sampling error, not the physical noise in the state or the gates.`}],quiz:[{q:String.raw`A qubit is in the state $0.6\lvert 0\rangle+0.8i\lvert 1\rangle$. If you measure it in the $X$ basis, what is the probability of the outcome $+$?`,options:["0.5, because |0.6 + 0.8i|^2 / 2 = 1/2","0.36, the probability of outcome 0 in the Z basis","0.98, because the state is close to a Y eigenstate so X is also very biased","0.64, the probability of outcome 1 in the Z basis"],answer:0,explain:String.raw`$P(+)=\lvert\alpha+\beta\rvert^2/2=\lvert 0.6+0.8i\rvert^2/2=1/2$. The $Z$ probabilities do not determine the $X$ probabilities, because the relative phase matters. The 0.98 value belongs to the $Y$ basis, where this state is nearly an eigenstate.`},{q:"What measurement most simply distinguishes a 50/50 mixture of |0> and |1> from the pure state |+>?",options:["Measuring in the Z basis: the mixture gives 50/50 and |+> gives a definite result","Measuring in the X basis: |+> always gives + while the mixture gives + and - equally often","No measurement can distinguish them, since both give 50/50 in the Z basis","Measuring in any basis gives the same statistics, because both have the same trace"],answer:1,explain:String.raw`In $Z$ both give 50/50, so that basis cannot tell them apart. In $X$ the pure state $\lvert +\rangle$ gives $+$ every time ($\langle X\rangle=1$), while $I/2$ gives $\langle X\rangle=0$. The difference lives in the off-diagonal coherences.`},{q:"Why is one qubit of a Bell pair described by the maximally mixed state I/2 even though the pair is in a pure state?",options:["Because the pair secretly was in 00 or 11 all along","Because noise from the environment has already acted on the pair","Because tracing out the partner removes the cross terms between 00 and 11, leaving equal weight on 0 and 1 with no coherence","Because measurement collapsed the qubit to a random value"],answer:2,explain:String.raw`The cross terms $\lvert 00\rangle\langle 11\rvert$ and its conjugate contain $\lvert 0\rangle\langle 1\rvert$ on the traced-out qubit, whose trace is zero. Only $\tfrac12(\lvert 0\rangle\langle 0\rvert+\lvert 1\rangle\langle 1\rvert)=I/2$ survives. No noise or collapse is involved: it is purely a consequence of entanglement.`},{q:"A qubit has T1 = 50 microseconds. Which value of T2 is physically impossible?",options:["30 microseconds","80 microseconds","100 microseconds","120 microseconds"],answer:3,explain:String.raw`Since $1/T_2=1/(2T_1)+1/T_\varphi$ with $1/T_\varphi\ge0$, we have $T_2\le2T_1=100\,\mu$s. Any value up to and including 100 is allowed; 120 would require negative dephasing rate.`},{q:String.raw`Roughly how many shots are needed to estimate $\langle Z\rangle$ to a standard error of 0.01 in the worst case?`,options:["About 100","About 1,000","About 10,000","About 100,000,000"],answer:2,explain:String.raw`The standard error is at most $1/\sqrt N$. Setting $1/\sqrt N=0.01$ gives $N=10^4$. Each extra decimal digit of precision costs a factor of 100 more shots.`}],takeaways:["Born rule: probabilities are squared overlaps; measurement collapses the state, and repeating the same measurement gives the same result.","The Bloch vector is (<X>, <Y>, <Z>), recoverable from statistics over many prepared copies with shot noise of order 1/sqrt(N).","A density matrix rho = sum p_i |psi_i><psi_i| covers mixtures; purity tr rho^2 is 1 for pure states and 1/2 for the maximally mixed state I/2 at the centre of the Bloch ball.","A mixture is not a superposition: |+> and I/2 agree in Z but differ in X, because of the off-diagonal coherences.","Noise channels (Kraus form) shrink the Bloch ball: T1 pulls it toward |0>, dephasing squeezes onto the z axis, depolarizing shrinks it uniformly, and T2 <= 2 T1."]},qe=Object.freeze(Object.defineProperty({__proto__:null,lesson:ve},Symbol.toStringTag,{value:"Module"})),M=t=>"```python\n"+t+"\n```",xe={id:"multi-qubit",order:7,part:"The Qubit",title:"Many Qubits & Tensor Products",summary:"Put qubits together with the tensor product, watch the state space double with every added qubit, and meet CNOT, CZ, SWAP and Toffoli, the gates that make qubits interact.",minutes:35,objectives:["You can form the tensor (Kronecker) product of two qubit states and write the result as a 4-component vector in the order |00>, |01>, |10>, |11>.","You can explain why n qubits need 2^n complex amplitudes and compute the memory needed to store them.","You can write the matrices of CNOT, CZ, SWAP, Toffoli and a general controlled-U, and build gates such as H on one qubit of a register with Kronecker products.","You can test whether a two-qubit state is a product state or entangled using the determinant-like condition a00*a11 = a01*a10."],blocks:[{t:"md",text:String.raw`## From one qubit to many

One qubit lives in a two-dimensional space. How do we describe two? Classically the answer is easy: two bits have four possible values, 00, 01, 10, 11. Quantum mechanics keeps that list but promotes each entry to an **amplitude**. A two-qubit state is

$$|\psi\rangle = a_{00}|00\rangle + a_{01}|01\rangle + a_{10}|10\rangle + a_{11}|11\rangle,\qquad \sum |a_{xy}|^2 = 1,$$

where $a_{xy}$ is a complex number and $|a_{xy}|^2$ is the probability of reading the bit string $xy$ when both qubits are measured. We write it as a column vector $(a_{00},a_{01},a_{10},a_{11})^T$.

**Ordering convention.** In this course we use **big-endian** order: in $|q_0 q_1 q_2\rangle$ the *leftmost* bit is qubit 0, the top wire of a circuit diagram. So $|10\rangle$ means "qubit 0 is 1, qubit 1 is 0". Be warned: Qiskit uses the opposite, **little-endian** convention (qubit 0 is the *rightmost* bit of a printed bit string), so a Qiskit result such as "01" means qubit 0 is 1. Whenever you compare our matrices with Qiskit output, reverse the bit strings.

### The tensor product

If qubit A is in state $|a\rangle = a_0|0\rangle + a_1|1\rangle$ and qubit B is independently in $|b\rangle = b_0|0\rangle + b_1|1\rangle$, the joint state is the **tensor product**

$$|a\rangle\otimes|b\rangle = \begin{pmatrix}a_0\\a_1\end{pmatrix}\otimes\begin{pmatrix}b_0\\b_1\end{pmatrix} = \begin{pmatrix}a_0 b_0\\ a_0 b_1\\ a_1 b_0\\ a_1 b_1\end{pmatrix}.$$

The rule: copy the second vector once for each entry of the first, scaled by that entry. This is just "probabilities of independent events multiply", upgraded to amplitudes. We abbreviate $|a\rangle\otimes|b\rangle$ as $|a\rangle|b\rangle$ or $|ab\rangle$.

**Worked example.** Take $|+\rangle = (|0\rangle+|1\rangle)/\sqrt2$ on qubit 0 and $|0\rangle$ on qubit 1. Then $|+\rangle|0\rangle = \tfrac1{\sqrt2}(1,0,1,0)^T = \tfrac{1}{\sqrt2}(|00\rangle+|10\rangle)$. Measuring gives 00 or 10 with probability 1/2 each, and qubit 1 is always 0, exactly as expected from independent qubits.`},{t:"md",text:String.raw`## The exponential state space

Each added qubit doubles the number of amplitudes, so $n$ qubits need $2^n$ complex numbers. A double-precision complex number takes 16 bytes (two 8-byte floats), so storing the full state on a classical computer costs $2^n\times16$ bytes:

| Qubits $n$ | Amplitudes $2^n$ | Memory ($2^n \times 16$ B) |
|---|---|---|
| 10 | 1,024 | 16 KiB |
| 20 | about 1.05 million | 16 MiB |
| 30 | about 1.07 billion | 16 GiB (about 17.2 GB) |
| 40 | about 1.10 trillion | 16 TiB (about 17.6 TB) |
| 50 | about 1.13 quadrillion | 16 PiB (about 18 PB) |

That is why a laptop can simulate roughly 28 to 30 qubits and the largest supercomputers somewhere in the 45 to 50 range for generic circuits. Each extra qubit doubles the memory *and* the work per gate.

### What this does and does not mean

This growth is the reason quantum computers are interesting, and also the reason people say misleading things about them. Be careful:

- **Misconception: "a quantum computer tries all $2^n$ answers at once and picks the right one."** The state *holds* $2^n$ amplitudes, but a measurement returns only a single $n$-bit string. To exploit the amplitudes, an algorithm must make wrong answers interfere destructively and the right ones constructively before measuring. That is hard, and only certain problems allow it.
- **Misconception: "$n$ qubits store $2^n$ bits of information."** By Holevo's theorem, $n$ qubits can deliver at most $n$ classical bits to a reader. The exponential is in the *description*, not the readable output.
- Not every state needs exponentially many numbers. A product of $n$ single-qubit states needs only $2n$ complex numbers. The exponential cost comes from **entanglement**, the subject of the next lesson and the thing that tensor-product structure alone cannot hide.`},{t:"widget",name:"tensor-lab",caption:'Start with both qubits in simple states (for example |+> on qubit 0 and |0> on qubit 1) and confirm the four amplitudes match the tensor-product rule. Then edit the four amplitudes directly to (1,0,0,1)/sqrt2. Observe that the "product" indicator turns off and an entanglement measure (Schmidt rank 2, concurrence 1) appears: no choice of two single-qubit states reproduces it.'},{t:"md",text:String.raw`## Product states versus entangled states

A two-qubit state is a **product state** if it can be written $|a\rangle\otimes|b\rangle$. Expanding the product above shows that the amplitudes then satisfy $a_{00}a_{11} = a_0b_0\,a_1b_1 = a_{01}a_{10}$. The converse is also true, so:

$$|\psi\rangle \text{ is a product state} \iff a_{00}\,a_{11} - a_{01}\,a_{10} = 0.$$

The quantity $C = 2\,|a_{00}a_{11}-a_{01}a_{10}|$ is the **concurrence**, a standard measure of two-qubit entanglement for pure states: 0 for products, 1 for maximally entangled states.

**Worked example.** Consider $|\Phi^+\rangle = (|00\rangle+|11\rangle)/\sqrt2$. Here $a_{00}=a_{11}=1/\sqrt2$ and $a_{01}=a_{10}=0$, so $a_{00}a_{11}-a_{01}a_{10} = 1/2 \neq 0$: entangled, with $C=1$. Check directly that it cannot factor: a product would need $a_0b_1 = 0$ and $a_1b_0=0$ (to kill the middle terms), forcing $a_0b_0=0$ or $a_1b_1=0$, which contradicts both being non-zero.

Compare $(|00\rangle+|01\rangle+|10\rangle+|11\rangle)/2$: here $\tfrac14-\tfrac14=0$, and indeed it equals $|+\rangle|+\rangle$.

Entanglement is not a rare curiosity. Most states in a $2^n$-dimensional space are highly entangled; product states are a vanishingly thin slice. Entangled states are also the ones with *correlations that no classical story can explain*, which we quantify in the next lesson.`},{t:"md",text:String.raw`## Gates on several qubits: Kronecker products

The tensor product also builds operators. If $A$ acts on qubit 0 and $B$ on qubit 1, the combined gate is the **Kronecker product** $A\otimes B$, defined so that $(A\otimes B)(|a\rangle\otimes|b\rangle) = A|a\rangle\otimes B|b\rangle$. As a block matrix,

$$A\otimes B=\begin{pmatrix}A_{00}B & A_{01}B\\ A_{10}B & A_{11}B\end{pmatrix}.$$

To apply a one-qubit gate to *one wire* of a register you tensor it with identities on the others, in wire order. For two qubits:

$$H\otimes I=\tfrac1{\sqrt2}\begin{pmatrix}1&0&1&0\\0&1&0&1\\1&0&-1&0\\0&1&0&-1\end{pmatrix},\qquad I\otimes X=\begin{pmatrix}0&1&0&0\\1&0&0&0\\0&0&0&1\\0&0&1&0\end{pmatrix}.$$

$H\otimes I$ acts on qubit 0 (top wire); $I\otimes X$ flips qubit 1. Gates on different wires at the same time are simply their Kronecker product, and they commute. Applying $H\otimes H$ to $|00\rangle$ gives $|+\rangle|+\rangle$, the uniform superposition of all four strings; for $n$ qubits $H^{\otimes n}|0\ldots0\rangle = 2^{-n/2}\sum_x|x\rangle$, the starting point of nearly every algorithm.

**Key fact:** operators of the form $A\otimes B$ can never create entanglement from a product state. To entangle qubits, a gate must act on them *jointly* and not be a Kronecker product. That is the job of controlled gates.

`+M(`import numpy as np
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)
I = np.eye(2)
ket0 = np.array([1, 0])
state = np.kron(ket0, ket0)          # |00>, qubit 0 is the LEFT factor
HI = np.kron(H, I)                   # H on qubit 0 only
print(HI @ state)                    # [0.707, 0, 0.707, 0] = (|00>+|10>)/sqrt2`)},{t:"md",text:String.raw`## Controlled gates: CNOT, CZ, SWAP, Toffoli

The **CNOT** (controlled-NOT) flips the target qubit if and only if the control is $|1\rangle$. With qubit 0 as control and qubit 1 as target, it permutes basis states $|00\rangle\to|00\rangle$, $|01\rangle\to|01\rangle$, $|10\rangle\to|11\rangle$, $|11\rangle\to|10\rangle$:

$$\mathrm{CNOT}=\begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end{pmatrix}=|0\rangle\langle0|\otimes I+|1\rangle\langle1|\otimes X.$$

The second form says "do nothing if the control is 0, apply $X$ if it is 1", where $|0\rangle\langle0|$ and $|1\rangle\langle1|$ are projectors onto the control's basis states. Replace $X$ by any unitary $U$ and you get the **controlled-$U$**: $|0\rangle\langle0|\otimes I+|1\rangle\langle1|\otimes U$.

Three more you must know:

$$\mathrm{CZ}=\mathrm{diag}(1,1,1,-1),\qquad \mathrm{SWAP}=\begin{pmatrix}1&0&0&0\\0&0&1&0\\0&1&0&0\\0&0&0&1\end{pmatrix}.$$

- **CZ** puts a $-1$ on $|11\rangle$ only. It is *symmetric*: control and target are interchangeable. Also $\mathrm{CNOT}=(I\otimes H)\,\mathrm{CZ}\,(I\otimes H)$, because $HZH=X$.
- **SWAP** exchanges the two qubits. It equals three CNOTs with alternating control: $\mathrm{CNOT}_{01}\mathrm{CNOT}_{10}\mathrm{CNOT}_{01}$.
- **Toffoli** (CCNOT) has two controls and flips the target only on $|110\rangle\leftrightarrow|111\rangle$. It is an $8\times8$ identity matrix with the last two rows swapped. It is a reversible AND gate and is universal for classical reversible computing.

**Misconception:** "CNOT copies the control onto the target." It copies *basis-state* values: $|x\rangle|0\rangle\mapsto|x\rangle|x\rangle$. But for a superposition control it does not create two copies of the state; it creates entanglement (next section, and the no-cloning theorem in the next lesson).`},{t:"md",text:String.raw`## Making a Bell state, by hand

Start from $|00\rangle$, apply $H$ on qubit 0, then CNOT with qubit 0 as control:

$$|00\rangle\xrightarrow{H\otimes I}\tfrac1{\sqrt2}(|00\rangle+|10\rangle)\xrightarrow{\mathrm{CNOT}}\tfrac1{\sqrt2}(|00\rangle+|11\rangle)=|\Phi^+\rangle.$$

In matrix terms the circuit is $\mathrm{CNOT}\cdot(H\otimes I)$, with the first gate applied *rightmost*. The CNOT sent $|10\rangle$ to $|11\rangle$ and left $|00\rangle$ alone: the target now *knows* the control's value on each branch, so neither qubit has a state of its own, yet the pair does. Measuring either qubit gives a fair coin; the two results always agree.

`+M(`from qiskit import QuantumCircuit
qc = QuantumCircuit(2)
qc.h(0)          # H on qubit 0
qc.cx(0, 1)      # control 0, target 1
# Qiskit is little-endian: bit strings print as 'q1 q0'.
# For this symmetric state the counts are only '00' and '11' either way.`)},{t:"widget",name:"composer",props:{preset:"bell"},caption:"Run the Bell preset and read the output probabilities: 50% for 00 and 50% for 11, 0% for 01 and 10. Step through the circuit if there is a stepper and watch the state vector after H (two non-zero amplitudes) and after CNOT. Then remove the H gate and observe that CNOT alone on |00> does nothing visible; entanglement needs superposition at the control. Finally put an X on qubit 1 before the CNOT and see which two outcomes appear (01 and 10)."},{t:"callout",kind:"math",title:"Controlled gates and phase kickback",text:String.raw`Because a controlled-$U$ applies $U$ only on the $|1\rangle$ branch, if the target is an eigenvector, $U|u\rangle=e^{i\varphi}|u\rangle$, then $\mathrm{C}U\,|c\rangle|u\rangle = (c_0|0\rangle + c_1e^{i\varphi}|1\rangle)|u\rangle$. The phase lands on the *control* qubit and the target is unchanged. This "kickback" is the engine behind phase estimation, Deutsch-Jozsa and many other algorithms, and we use it in the Circuit Model lesson.`},{t:"md",text:String.raw`## Bookkeeping for larger registers

For three qubits the state is an 8-vector indexed by $|q_0q_1q_2\rangle$ read as a binary number, so $|101\rangle$ is index 5. A gate on qubit $k$ is $I^{\otimes k}\otimes U\otimes I^{\otimes (n-k-1)}$, with $k$ counted from 0 at the top (big-endian). A CNOT whose control and target are *not* adjacent is built from the projector form: for control qubit 0 and target qubit 2,

$$|0\rangle\langle0|\otimes I\otimes I+|1\rangle\langle1|\otimes I\otimes X.$$

The general recipe is: write "what happens when the control is 0" plus "what happens when it is 1", each as a Kronecker product. Simulators never build these huge matrices; they update the $2^n$ amplitudes in place by pairing indices that differ in the target bit. Still, the Kronecker form is how you check circuits by hand.

**A useful sanity check on any product of gates:** the result must be unitary, so every column has norm 1 and different columns are orthogonal. If you compute a $4\times4$ circuit matrix and a column does not have norm 1, you have made an arithmetic slip.

In the next lesson we study what the entangled states made here can and cannot do, including a test (the CHSH experiment) that rules out every classical explanation of their correlations.`}],quiz:[{q:String.raw`What is $|1\rangle\otimes|+\rangle$ as a column vector in the order $|00\rangle,|01\rangle,|10\rangle,|11\rangle$ (qubit 0 left)?`,options:[String.raw`$\tfrac1{\sqrt2}(0,0,1,1)^T$`,String.raw`$\tfrac1{\sqrt2}(0,1,0,1)^T$`,String.raw`$\tfrac1{\sqrt2}(1,1,0,0)^T$`,String.raw`$\tfrac1{\sqrt2}(1,0,1,0)^T$`],answer:0,explain:String.raw`The first factor is $(0,1)^T$, so the result is $0\cdot|+\rangle$ followed by $1\cdot|+\rangle$, i.e. $(0,0,\tfrac1{\sqrt2},\tfrac1{\sqrt2})^T$. Qubit 0 is definitely 1 and qubit 1 is a fair coin. The option $(0,1,0,1)$ would be $|+\rangle|1\rangle$, the factors in the opposite order.`},{q:"How much memory does a full state vector of 40 qubits need if each complex amplitude takes 16 bytes?",options:["About 16 TiB (2^40 x 16 bytes = 2^44 bytes)","About 40 x 16 = 640 bytes","About 16 GiB","About 16 PiB"],answer:0,explain:String.raw`There are $2^{40}$ amplitudes and $2^{40}\times 2^4=2^{44}$ bytes, which is 16 tebibytes. The 640-byte answer wrongly assumes memory grows linearly in $n$; 16 GiB corresponds to 30 qubits and 16 PiB to 50.`},{q:String.raw`Which of these two-qubit states is entangled?`,options:[String.raw`$\tfrac1{\sqrt2}(|01\rangle+|10\rangle)$`,String.raw`$\tfrac12(|00\rangle+|01\rangle+|10\rangle+|11\rangle)$`,String.raw`$\tfrac1{\sqrt2}(|00\rangle+|10\rangle)$`,String.raw`$|11\rangle$`],answer:0,explain:String.raw`Use $a_{00}a_{11}-a_{01}a_{10}$. For $(|01\rangle+|10\rangle)/\sqrt2$ it equals $0-\tfrac12\ne0$, so it is entangled. The second equals $|+\rangle|+\rangle$, the third is $|+\rangle|0\rangle$ and the fourth is a basis state; all give 0.`},{q:String.raw`Why does $H\otimes I$ followed by $X\otimes Z$ never entangle two initially unentangled qubits?`,options:["Any operator of the form A tensor B maps product states to product states","Because H and X are Pauli gates","Because only measurements can create entanglement","Because they act at the same time"],answer:0,explain:String.raw`$(A\otimes B)(|a\rangle|b\rangle)=A|a\rangle\otimes B|b\rangle$ is again a product. Entangling requires a gate that is not a Kronecker product, such as CNOT or CZ. Measurement is not needed, and H is not even a Pauli gate.`},{q:String.raw`What does the Toffoli gate do to $|110\rangle$ and $|100\rangle$ (controls on qubits 0 and 1)?`,options:[String.raw`$|110\rangle\to|111\rangle$, and $|100\rangle$ is unchanged`,String.raw`$|110\rangle$ is unchanged and $|100\rangle\to|101\rangle$`,String.raw`Both are flipped on the last bit`,String.raw`$|110\rangle\to|001\rangle$`],answer:0,explain:String.raw`The target (qubit 2) flips only if both controls are 1. $|110\rangle$ has both controls set so it becomes $|111\rangle$; $|100\rangle$ has only one control set so nothing happens.`}],takeaways:["Multi-qubit states are tensor products in big-endian order: |q0 q1 q2>, with amplitudes in binary-counting order.","n qubits need 2^n complex amplitudes (16 bytes each): 16 GiB at n=30, 16 TiB at n=40, 16 PiB at n=50. But a measurement returns only n bits.","A tensor product of gates (A tensor B) cannot entangle; controlled gates such as CNOT, CZ and Toffoli can.","CNOT = |0><0| tensor I + |1><1| tensor X; CZ is symmetric; SWAP = three CNOTs; Toffoli is a reversible AND.","A two-qubit state is a product iff a00*a11 = a01*a10; the Bell state (|00>+|11>)/sqrt2 fails this test, so it is entangled."]},ke=Object.freeze(Object.defineProperty({__proto__:null,lesson:xe},Symbol.toStringTag,{value:"Module"})),f=String.raw,Te={id:"physics-intro",order:4,part:"Foundations",title:"The Physics: Waves, Photons & Spin",summary:"See three experiments that break classical intuition, then distil them into the four postulates that every quantum computer obeys.",minutes:35,objectives:["You can explain how classical waves interfere and why adding amplitudes (not probabilities) produces fringes.","You can describe what the double-slit and Mach-Zehnder experiments show about single particles.","You can predict the outcomes of sequential Stern-Gerlach measurements in Z, X and Y bases.","You can state the four postulates of quantum mechanics (state, evolution, measurement, composite systems) in plain words.","You can explain why a two-outcome quantum system is a qubit and how U = e^{-iHt/hbar} produces gates."],blocks:[{t:"md",text:f`## Why start with physics?

A quantum computer is not magic and it is not a faster classical computer. It is a physical device whose components obey rules that differ from everyday experience, and algorithms exploit those rules. Before we define qubits and gates, we need to see where the rules come from. We do this with three experiments, then compress what they teach us into four short postulates. After that, the rest of the course is mathematics and engineering built on those postulates.

### Classical waves and interference

Throw two stones into a pond. Where the ripples overlap, the water height is the **sum** of the two wave heights. A wave of wavelength $\lambda$ can be written as an oscillation with an amplitude and a phase:
$$\psi(x) = A\cos(kx - \varphi), \qquad k = \frac{2\pi}{\lambda}.$$
Here $A$ is the **amplitude** (how big the oscillation is), $k$ is the wave number, and $\varphi$ is the **phase** (where in its cycle the wave is). When two waves meet, their amplitudes add. If the crests line up (phase difference $0$) the sum is twice as large: **constructive interference**. If a crest meets a trough (phase difference $\pi$) the sum is zero: **destructive interference**.

What we perceive, however, is **intensity**, the energy carried, which is proportional to the amplitude **squared**. For two equal waves with phase difference $\delta$, the combined intensity is
$$I = |A + Ae^{i\delta}|^2 = 2A^2\,(1+\cos\delta).$$
This is not $A^2 + A^2$. The extra term $2A^2\cos\delta$ is the **interference term**, and it can be positive or negative. Hold on to this formula: it is the same arithmetic you met in Lesson 2, and it is the mathematical heart of every quantum algorithm.

Waves are spread out and continuous. Particles, such as a bullet, are lumps that go through exactly one hole. The big surprise of the early twentieth century was that light and matter show **both** behaviours.`},{t:"md",text:f`## The double-slit experiment

Shine light through a screen with two narrow, closely spaced slits onto a detector screen. You see bright and dark **fringes**: the signature of waves from the two slits adding with a path-dependent phase. If the slits are separated by $d$ and the screen is at distance $L$, bright fringes occur approximately where
$$d\sin\theta = m\lambda, \qquad m = 0, \pm 1, \pm 2, \dots$$
so the fringe spacing on the screen is about $\lambda L / d$. Narrower slit separation or longer wavelength gives wider fringes.

Now the quantum twist. Turn the source down until only **one particle at a time** (a photon, an electron, even a large molecule) is in flight. Each particle lands at a single, point-like spot on the detector: a click, not a smear. At first the spots look random. But after thousands of detections, the fringe pattern emerges from the accumulated dots. Each particle behaved as a wave passing through *both* slits (its amplitude has two contributions that interfere), yet it was detected as a particle at one place.

Two lessons follow. First, the pattern is **probabilistic**: quantum theory predicts the probability of a click at each position, given by the squared magnitude of the summed amplitudes. Second, if you place a detector at the slits to learn *which* slit the particle took, the fringes vanish. Obtaining which-path information forces the two routes to behave as alternatives that add as probabilities, with no interference term.`},{t:"widget",name:"double-slit",caption:"Fire particles one at a time and watch the dots build up. First, run until the fringes appear. Then reduce the slit separation: the fringes should widen. Increase the wavelength: they widen again. Notice that no single dot reveals the pattern; only the statistics do."},{t:"callout",kind:"warn",title:'Misconception: "the particle splits in half"',text:f`The detector never registers half a particle. Every click is a whole photon or electron. What spreads out is the **amplitude** (the mathematical object that determines probabilities), not the particle's mass or charge. Also, "it goes through both slits" is a verbal picture of the maths; the safest statement is that the interference pattern requires adding amplitudes for both routes whenever the routes are not distinguished by anything in the universe.`},{t:"md",text:f`## The Mach-Zehnder interferometer

The double slit is hard to treat as a clean two-state system, so quantum computing prefers a cleaner cousin: the **Mach-Zehnder interferometer**. A single photon enters a **beam splitter** (a half-silvered mirror) which sends it along an upper or lower path with equal amplitude. The two paths can be given a relative phase $\phi$ by a small piece of glass (a **phase shifter**). A second beam splitter recombines the paths, and two detectors, call them $D_0$ and $D_1$, watch the two outputs.

Model the photon's path as a two-component vector: amplitude on the upper path and amplitude on the lower path. The beam splitter acts like the matrix $H = \tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$ (a Hadamard, which you will meet again in Lesson 6) and the phase shifter like $\mathrm{diag}(1, e^{i\phi})$. Starting in the upper path $(1,0)^T$:

1. After the first splitter: $\tfrac{1}{\sqrt2}(1,\,1)^T$.
2. After the phase shifter: $\tfrac{1}{\sqrt2}(1,\,e^{i\phi})^T$.
3. After the second splitter: $\tfrac12\,(1+e^{i\phi},\; 1-e^{i\phi})^T$.

The detector probabilities are the squared magnitudes:
$$P(D_0) = \tfrac14|1+e^{i\phi}|^2 = \cos^2\!\tfrac{\phi}{2}, \qquad P(D_1) = \sin^2\!\tfrac{\phi}{2}.$$
For $\phi = 0$ the photon *always* reaches $D_0$; for $\phi=\pi$ it *always* reaches $D_1$. Yet each beam splitter alone sends the photon to either side with probability one half. A classical coin-flip model (50/50 at the first splitter, 50/50 at the second) would predict 50/50 at the end regardless of $\phi$. The difference is the interference term, and it is what a quantum algorithm engineers.`},{t:"widget",name:"mach-zehnder",caption:"Send single photons through and sweep the phase shifter. At phase 0 all photons exit one port; at pi they all exit the other. Find the phase where the ports are 50/50. Then block one arm (if the control is offered) and note that the detector counts become 50/50 for every phase: the interference needed both paths."},{t:"md",text:f`## Stern-Gerlach: spin one-half

Our third experiment reveals the system that most directly becomes a qubit. Electrons and many atoms carry an intrinsic angular momentum called **spin**. Send a beam of silver atoms through a magnet whose field gradient points along the $z$ axis (the **Stern-Gerlach** apparatus). Classically you would expect a continuous smear, because the atoms' tiny magnets point in all directions. Instead the beam splits into exactly **two** spots: spin "up" and spin "down" along $z$, with measured values $\pm\hbar/2$ ($\hbar$ is the reduced Planck constant, the natural unit of angular momentum).

Rotate the magnet to measure along $x$ or $y$: again exactly two outcomes. Now chain measurements:

- Measure $Z$, keep the "up" atoms, measure $Z$ again: always up. The measurement is repeatable.
- Measure $Z$, keep "up", then measure $X$: 50% right, 50% left.
- Measure $Z$ (keep up), then $X$ (keep right), then $Z$ again: **50/50 again**. The $X$ measurement erased the earlier $Z$ information.

No classical bag of hidden properties "$z = +$, $x = +$" can explain the last result, because measuring $x$ would not disturb a $z$ value that was really there. Quantum mechanics says the properties $Z$ and $X$ are **incompatible**: a state with a definite $Z$ value is an equal superposition of definite $X$ values, and vice versa. The same holds for $Y$. Two outcomes, three mutually incompatible questions: this is a qubit.`},{t:"widget",name:"stern-gerlach",caption:"Build the chain Z, then X, then Z. Predict the final splitting before you run it, then check: it should be 50/50. Now try Z, Z, Z (always the same) and Z, then Y, then X. Which sequences have deterministic outcomes and which are random? Write down the rule you discover."},{t:"md",text:f`## The four postulates, in plain words

Everything the experiments taught us is captured by four rules. They are the complete "rulebook" for quantum computing; the rest is consequences.

**1. State.** An isolated system is described by a **unit vector** $|\psi\rangle$ in a complex vector space (a Hilbert space). For a two-outcome system the space is $\mathbb{C}^2$ and $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ with $|\alpha|^2+|\beta|^2 = 1$. Vectors that differ only by an overall phase $e^{i\gamma}$ are the same physical state.

**2. Evolution.** An isolated system changes by a **unitary** transformation: $|\psi'\rangle = U|\psi\rangle$ with $U^\dagger U = I$. Unitaries preserve length (so probabilities still add to 1) and are reversible. Continuous time evolution follows the **Schrödinger equation**
$$i\hbar\,\frac{d}{dt}|\psi(t)\rangle = H\,|\psi(t)\rangle,$$
where $H$ is the **Hamiltonian**, a Hermitian matrix representing the system's energy. For constant $H$ the solution is
$$|\psi(t)\rangle = U(t)|\psi(0)\rangle, \qquad U(t) = e^{-iHt/\hbar}.$$
Since $H$ is Hermitian, $U$ is unitary. This is the origin of quantum gates: choose a Hamiltonian and a duration, get a unitary.

**3. Measurement (Born rule).** Measuring in an orthonormal basis $\{|b_k\rangle\}$ gives outcome $k$ with probability $p_k = |\langle b_k|\psi\rangle|^2$, and the state afterwards is $|b_k\rangle$ ("collapse"). Measurement is the one irreversible, non-unitary step.

**4. Composite systems.** The state space of two systems is the **tensor product** of their spaces. Two qubits live in $\mathbb{C}^2\otimes\mathbb{C}^2 = \mathbb{C}^4$, $n$ qubits in $\mathbb{C}^{2^n}$. Some states of the pair are **entangled**: they cannot be written as a state of one times a state of the other. Lessons 7 and 8 develop this.`},{t:"callout",kind:"math",title:"Worked example: Schrödinger evolution gives a rotation",text:f`Take $H = \tfrac{\hbar\omega}{2}Z$ with $Z=\mathrm{diag}(1,-1)$, the energy of a spin in a magnetic field. Then $U(t) = e^{-i\omega t Z/2} = \mathrm{diag}(e^{-i\omega t/2},\,e^{+i\omega t/2})$. Start in $|+\rangle = \tfrac{1}{\sqrt2}(|0\rangle+|1\rangle)$. After time $t$:
$$|\psi(t)\rangle = \tfrac{1}{\sqrt2}\big(e^{-i\omega t/2}|0\rangle + e^{i\omega t/2}|1\rangle\big) = e^{-i\omega t/2}\,\tfrac{1}{\sqrt2}\big(|0\rangle + e^{i\omega t}|1\rangle\big).$$
The prefactor is an unobservable global phase. The relative phase $\omega t$ grows linearly: the state precesses around the $z$ axis at angular frequency $\omega$. Choosing $\omega t = \pi$ turns $|+\rangle$ into $|-\rangle$. That is a gate (the Z gate up to a global phase) produced by "waiting". Lesson 5 draws this as a rotation on the Bloch sphere.`},{t:"md",text:f`## Uncertainty, complementarity, and why qubits

The Stern-Gerlach chain is an example of **complementarity**: some questions cannot simultaneously have definite answers. The mathematical statement is the **uncertainty relation** for two observables $A$ and $B$:
$$\Delta A\,\Delta B \;\ge\; \tfrac12\,\big|\langle\psi|[A,B]|\psi\rangle\big|,$$
where $\Delta A$ is the standard deviation of outcomes over many identically prepared systems and $[A,B]=AB-BA$ is the commutator. For spin, $[X,Y]=2iZ$ and similar cyclic relations: Pauli operators do not commute, so no state has sharp values for all three. Note what this is **not**: it is not about clumsy measuring devices disturbing the system. It is a property of the state itself and of the mathematics of incompatible questions.

### From physics to qubits

Many physical systems have two relevant states: a photon's polarisation or path, an electron's spin, the two lowest energy levels of a superconducting circuit or a trapped ion. Whenever we can control and read out such a pair, the postulates say its state is a unit vector in $\mathbb{C}^2$, its operations are $2\times2$ unitaries, and its readout follows the Born rule. We call this abstraction a **qubit**. Algorithms are written for the abstraction; engineers worry about which physical system implements it (Lesson 19).

What did the experiments buy us? **Superposition** (amplitudes on several alternatives), **interference** (phases decide how amplitudes add), **incompatible measurements** (complementarity), and, with several systems, **entanglement**. Quantum algorithms choreograph amplitudes so that wrong answers cancel and right answers reinforce. Next lesson we study the single qubit in detail.`},{t:"callout",kind:"history",title:"A short history",text:f`Young's double-slit experiment (1801) established light as a wave. Planck (1900) and Einstein (1905) introduced quanta of light. Stern and Gerlach performed their experiment in 1922, before spin was even understood; the electron's spin was proposed in 1925. The Schrödinger equation appeared in 1926, Born's probability interpretation the same year, and Heisenberg's uncertainty principle in 1927. Single-electron double-slit interference, accumulated dot by dot, was first demonstrated in the 1970s and 1989.`},{t:"md",text:f`## Try it in code

You can reproduce the Mach-Zehnder result in a few lines of NumPy. The final lines also verify that ${"`e^{-iHt}`"} is unitary for a Hermitian $H$ (using ${"`scipy`"}'s matrix exponential, with $\hbar=1$).

${"```"}python
import numpy as np
from scipy.linalg import expm

H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)      # beam splitter

def mz(phi):
    P = np.diag([1, np.exp(1j * phi)])             # phase shifter
    out = H @ P @ H @ np.array([1, 0])
    return np.abs(out) ** 2                        # [P(D0), P(D1)]

for phi in (0, np.pi / 2, np.pi):
    print(round(phi, 2), mz(phi).round(3))        # [1,0], [.5,.5], [0,1]

# Schrodinger evolution: U = exp(-i H t) with hbar = 1
Z = np.diag([1.0, -1.0])
U = expm(-1j * (np.pi / 2) * Z)                    # omega*t = pi
print(np.allclose(U.conj().T @ U, np.eye(2)))      # True: unitary
${"```"}

Try changing the phase to see $\cos^2(\phi/2)$ appear, and confirm the Born rule by comparing with the formula above.`}],quiz:[{q:"Two equal-amplitude waves reach a detector with phase difference pi. What is the combined intensity, and why?",options:["Twice the single-wave intensity, because intensities add.","Zero, because the amplitudes cancel before squaring.","Four times the single-wave intensity, because amplitudes double.","Half the single-wave intensity, because the energy is shared."],answer:1,explain:"Amplitudes add first: A + A e^{i pi} = 0, and intensity is the squared magnitude of the total amplitude. Adding intensities instead would be the classical-probability mistake that hides interference."},{q:"In the Mach-Zehnder interferometer each beam splitter alone gives 50/50 outcomes. With phase 0 the photon exits one fixed port with certainty. What explains this?",options:["Hidden variables decide the path before the first splitter.","The photon is absorbed and re-emitted with a fixed direction.","The amplitudes of the two paths are added with a phase before squaring, and for phase 0 they cancel at one output and reinforce at the other.","The second beam splitter measures the photon and forces it to one port."],answer:2,explain:"Both routes contribute amplitudes to each output port. The sum (1+e^{i phi})/2 gives probability cos^2(phi/2), which is 1 at phi=0. A classical coin-flip model predicts 50/50 for every phase."},{q:"Silver atoms are measured Z (keep up), then X (keep right), then Z again. What is the final Z statistics?",options:["Always up, since they were up originally.","Always down.","50% up, 50% down: the X measurement erased the earlier Z information.","Undefined; the atoms are destroyed by the second measurement."],answer:2,explain:"Z and X are incompatible. A state with definite X is an equal superposition of Z-up and Z-down, so the final Z measurement is 50/50 regardless of the earlier Z result."},{q:"Which statement about Schrödinger evolution is correct?",options:["Evolution under a Hermitian Hamiltonian H for time t is U = e^{-iHt/hbar}, which is unitary and so preserves total probability.","Evolution randomly collapses the state in the energy basis.","Evolution can map a unit vector to a vector of length 2 if H is large.","Evolution is irreversible because probabilities are lost over time."],answer:0,explain:"H Hermitian implies e^{-iHt/hbar} is unitary: it preserves norms and can be inverted by running time backwards. Collapse belongs to the measurement postulate, not to evolution."},{q:"The uncertainty relation for spin components says that no state has sharp Z, X and Y values at once. What is the best description of this?",options:["A limitation of clumsy instruments that better technology could remove.","A property of quantum states: the corresponding operators do not commute, so the questions are complementary.","A statement that spin has no definite magnitude.","A rule that applies only to photons and not to electrons."],answer:1,explain:"The Pauli operators have non-zero commutators, so the uncertainty bound is non-zero for suitable states. It is built into the theory, not caused by measurement apparatus quality."}],takeaways:["Quantum amplitudes add before squaring, so phase differences produce interference that classical probabilities cannot.","Single particles in the double-slit and Mach-Zehnder experiments build up fringes from random clicks; which-path information destroys them.","Spin-1/2 gives two outcomes along any axis, but Z, X and Y are incompatible: measuring one erases the others.","The postulates: states are unit vectors, isolated evolution is unitary (U = e^{-iHt/hbar}), measurement follows the Born rule, composite systems use tensor products.","Any controllable two-level system obeying these postulates is a qubit."]},_e=Object.freeze(Object.defineProperty({__proto__:null,lesson:Te},Symbol.toStringTag,{value:"Module"})),p=String.raw,Se={id:"qft-qpe",order:14,part:"Circuits & Algorithms",title:"Quantum Fourier Transform and Phase Estimation",summary:"The quantum Fourier transform turns hidden periodicity into measurable peaks using only O(n^2) gates, and phase estimation uses it to read an eigenvalue of any unitary off as a binary fraction.",minutes:30,objectives:["You can write the QFT on N = 2^n states, show it is unitary, and compute the explicit 4 x 4 matrix.","You can explain why a periodic input with period r gives peaks at multiples of N/r, and why the QFT is a subroutine rather than a faster way to get a spectrum.","You can describe the QFT circuit (Hadamards, controlled-phase gates, swaps) and count its O(n^2) gates.","You can run quantum phase estimation on paper for an exactly representable phase such as 3/8, and state what happens when the phase is not representable or the input is a superposition of eigenstates."],blocks:[{t:"md",text:p`## The Fourier transform as a change of basis

Suppose you hear a chord. Your ear does not report the pressure at each instant; it reports *which frequencies are present*. The **discrete Fourier transform** (DFT) is the mathematical version of that: it takes a list of $N$ numbers describing a signal in time and re-expresses the same information as $N$ numbers describing it in frequency.

The key objects are the $N$-th **roots of unity**. Let

$$\omega=e^{2\pi i/N}.$$

On the complex plane these are $N$ points evenly spaced around the unit circle, and $\omega^N=1$. Powers $\omega^{k}$ step around the circle in equal angles of $2\pi/N$. If complex exponentials still feel unfamiliar, spend a minute with the widget below before reading on.`},{t:"widget",name:"complex-plane",caption:"Put a point on the unit circle at angle 2 pi / 8 (this is omega for N = 8). Multiply it by itself repeatedly and watch it hop around the circle in equal steps, landing back on 1 after eight multiplications. Every phase in this lesson is one of these hops."},{t:"md",text:p`### The quantum version

The **quantum Fourier transform** acts on the computational basis states $\lvert x\rangle$, $x=0,1,\dots,N-1$, as

$$\mathrm{QFT}\,\lvert x\rangle=\frac1{\sqrt N}\sum_{y=0}^{N-1}\omega^{xy}\,\lvert y\rangle,$$

and extends linearly to superpositions. In words: a definite "time" $x$ becomes an equal-weight superposition of all "frequencies" $y$, with the phase of frequency $y$ equal to $\omega^{xy}$, that is, $x y$ steps around the circle.

**It is unitary.** Check that two different outputs are orthogonal:

$$\langle x'\rvert\mathrm{QFT}^\dagger\,\mathrm{QFT}\lvert x\rangle=\frac1N\sum_{y}\omega^{(x-x')y}.$$

If $x=x'$ every term is 1 and the sum is $N/N=1$. If $x\neq x'$ the terms are the powers of a root of unity different from 1, which add up to zero (equal arrows around a circle cancel). So the columns are orthonormal, and the QFT is a legitimate quantum gate, merely a **change of basis** from the "position" basis to the "frequency" basis.

### A worked example: N = 4

Here $\omega=e^{2\pi i/4}=i$. The entry in row $y$, column $x$ is $\omega^{xy}/\sqrt4=i^{xy}/2$:

$$F_4=\frac12\begin{pmatrix}1&1&1&1\\1&i&-1&-i\\1&-1&1&-1\\1&-i&-1&i\end{pmatrix}.$$

Column 1 says $\mathrm{QFT}\lvert 1\rangle=\tfrac12(\lvert0\rangle+i\lvert1\rangle-\lvert2\rangle-i\lvert3\rangle)$: all four outcomes are equally likely, but the phases rotate by a quarter turn each step. Column 0 is $\tfrac12(\lvert0\rangle+\lvert1\rangle+\lvert2\rangle+\lvert3\rangle)$, the state that every qubit in $\lvert +\rangle$ would give. Note that $F_4$ is symmetric but *not* Hermitian; its inverse is its complex conjugate (all the $i$ become $-i$).`},{t:"md",text:p`## Intuition: frequency detection

Why is this useful? Because the QFT concentrates a **periodic** input into sharp peaks.

Take $N=4$ and the input $\tfrac1{\sqrt2}(\lvert0\rangle+\lvert2\rangle)$, which has period $r=2$ (it repeats every second basis state). Add columns 0 and 2 of $F_4$:

$$\tfrac1{\sqrt2}\cdot\tfrac12\bigl[(1,1,1,1)+(1,-1,1,-1)\bigr]=\tfrac1{2\sqrt2}(2,0,2,0)=\tfrac1{\sqrt2}(\lvert0\rangle+\lvert2\rangle).$$

The odd outcomes cancel exactly (destructive interference) and only $y=0$ and $y=2$ survive, each with probability $1/2$. The surviving values are multiples of $N/r=2$.

This is general. If the input is an equal superposition of every $r$-th basis state, $\lvert x_0\rangle+\lvert x_0+r\rangle+\lvert x_0+2r\rangle+\cdots$, the output is an equal superposition of the **multiples of $N/r$**: $y=0,\ N/r,\ 2N/r,\dots$. Shifting the start $x_0$ only changes phases, not which $y$ appear, so the peak positions do not depend on where the pattern begins. A *short* period in $x$ gives *widely spaced* peaks in $y$, and a long period gives closely spaced ones, exactly as with sound waves.`},{t:"widget",name:"qft-viz",caption:"Pick a period and an offset for the input. Compare the input bars with the output bars: the output is non-zero only at multiples of N / period. Slide the offset and notice that the peak positions do not move; only the phase arrows on the wheel rotate."},{t:"callout",kind:"note",title:"What this does not say",text:p`Peaks at multiples of $N/r$ are exact only when $r$ divides $N$. If it does not, the peaks smear into bumps centred near multiples of $N/r$; the Shor lesson shows how to cope with this. Also, a *single basis state* $\lvert x\rangle$ has a QFT with all probabilities equal to $1/N$: all of the information is in the phases, which a measurement cannot see directly.`},{t:"md",text:p`## The circuit: product form and O(n^2) gates

Let $N=2^n$ and write $x=x_1x_2\dots x_n$ in binary, with $x_1$ the most significant bit (this course's big-endian convention). Use the binary-fraction notation $0.x_j x_{j+1}\cdots x_n=\sum_{m\ge0}x_{j+m}\,2^{-(m+1)}$. Expanding $\omega^{xy}$ bit by bit over $y=y_1\dots y_n$ shows the QFT output is a **product state**, with no entanglement at all:

$$\mathrm{QFT}\lvert x_1\dots x_n\rangle=\frac1{\sqrt{2^n}}\bigotimes_{k=1}^{n}\bigl(\lvert0\rangle+e^{2\pi i\,0.x_{n-k+1}\cdots x_n}\lvert1\rangle\bigr).$$

The first output qubit carries the phase $e^{2\pi i\,0.x_n}$ (just the *last* bit of the input, so it is $\pm1$), the next carries $e^{2\pi i\,0.x_{n-1}x_n}$, and the last carries $e^{2\pi i\,0.x_1x_2\cdots x_n}=e^{2\pi i x/2^n}$, the full number. Each qubit holds a finer and finer fraction of a turn.

### Building it

For the qubit that must end up with $0.x_1x_2\cdots$:

1. Apply $H$ to it, producing $(\lvert0\rangle+e^{2\pi i\,0.x_1}\lvert1\rangle)/\sqrt2$, since $e^{i\pi x_1}=(-1)^{x_1}$.
2. Apply a **controlled-phase gate** $R_2$ controlled by $x_2$, then $R_3$ controlled by $x_3$, and so on, where
$$R_k=\begin{pmatrix}1&0\\0&e^{2\pi i/2^k}\end{pmatrix}.$$
Each one adds one more binary digit to the phase.

Repeat for the next qubit with one fewer controlled gate, and so on. The qubits come out in reversed order, so finish with about $n/2$ **swaps**. Total: $n$ Hadamards, $n(n-1)/2$ controlled phases, and a few swaps, which is $O(n^2)$ gates.

A classical fast Fourier transform on $N=2^n$ numbers costs $O(N\log N)=O(n\,2^n)$ operations. The quantum circuit is *exponentially* shorter in the number of gates. Tiny rotations $R_k$ with large $k$ can even be dropped with little error, which is how approximate QFTs save more.

We will use the circuit in two places below; try it directly first.`},{t:"widget",name:"composer",props:{preset:"qft3"},caption:"This is the three-qubit QFT. Locate the Hadamards, the controlled-phase gates with angles pi/2 and pi/4, and the closing swap. Change the input by adding X gates at the start and run: for every input the three output probabilities are all 1/8, but the phase pattern differs, which is the part you cannot see in a histogram."},{t:"callout",kind:"warn",title:"An honest caveat: it is not a faster FFT",text:p`The comparison with the FFT is misleading if taken at face value. The QFT produces $2^n$ amplitudes, but a measurement returns **one** $n$-bit string, so you cannot read the spectrum out. Loading classical data into the input amplitudes would itself cost about $2^n$ steps. The QFT is valuable only as a **subroutine** inside an algorithm whose input is already a quantum state with hidden structure and whose answer is a property such as a period or a phase. That is exactly the role it plays in phase estimation and Shor's algorithm.`},{t:"md",text:p`## Phase kickback, recapped

You met this in the Deutsch-Jozsa lesson. Suppose $U\lvert u\rangle=e^{2\pi i\varphi}\lvert u\rangle$, so $\lvert u\rangle$ is an **eigenvector** of $U$ and its **eigenvalue** is a pure phase (every unitary has eigenvalues of this form, with $\varphi\in[0,1)$). Prepare a control qubit in $\lvert+\rangle$ and apply controlled-$U$:

$$\tfrac1{\sqrt2}(\lvert0\rangle+\lvert1\rangle)\lvert u\rangle\ \longrightarrow\ \tfrac1{\sqrt2}(\lvert0\rangle+e^{2\pi i\varphi}\lvert1\rangle)\lvert u\rangle.$$

The target is untouched (an eigenvector only picks up a phase), but that phase is "kicked back" onto the control, where it becomes a *relative* phase. The control now records $\varphi$ as an angle on its Bloch sphere's equator. Quantum phase estimation is nothing more than a clever way of reading that angle to many bits of precision.

## Quantum phase estimation (QPE)

**The task.** Given a circuit for $U$ and an eigenvector $\lvert u\rangle$, find $\varphi$ in $U\lvert u\rangle=e^{2\pi i\varphi}\lvert u\rangle$.

**The circuit.** Use a *counting register* of $t$ qubits (all starting in $\lvert0\rangle$) plus a register holding $\lvert u\rangle$.

1. Apply $H$ to every counting qubit.
2. Counting qubit $j$ (qubit 0 is the leftmost, most significant) controls $U^{2^{t-1-j}}$ on the target register.
3. Apply the **inverse** QFT to the counting register.
4. Measure the counting register and read the integer $m$; the estimate is $\varphi\approx m/2^t$.

**Why it works.** After steps 1 and 2 the counting register is

$$\frac1{\sqrt{2^t}}\sum_{k=0}^{2^t-1}e^{2\pi i\varphi k}\lvert k\rangle,$$

because the counting qubit controlling $U^{2^s}$ picks up $e^{2\pi i\varphi 2^s}$ whenever its bit is 1, and the phases for all bits add. If $2^t\varphi=m$ is an integer, this is exactly $\mathrm{QFT}\lvert m\rangle$: each qubit carries the phase of a different binary prefix of $\varphi$, matching the product form above. The inverse QFT therefore returns $\lvert m\rangle$ **with certainty**.`},{t:"md",text:p`### Worked example: φ = 3/8 with three counting qubits

Take $t=3$, so $2^t\varphi=3$, and expect the answer $m=3=011$. The control qubits get

- qubit 0 (controls $U^4$): phase $e^{2\pi i\cdot4\cdot3/8}=e^{3\pi i}=-1$, so it holds $\lvert-\rangle=(\lvert0\rangle-\lvert1\rangle)/\sqrt2$;
- qubit 1 (controls $U^2$): phase $e^{2\pi i\cdot6/8}=e^{3\pi i/2}=-i$, so it holds $(\lvert0\rangle-i\lvert1\rangle)/\sqrt2$;
- qubit 2 (controls $U$): phase $e^{2\pi i\cdot3/8}=e^{3\pi i/4}$.

Compare with the product form for $x=3=011$: the first qubit should carry $0.1=\tfrac12$ (phase $-1$, yes), the second $0.11=\tfrac34$ (phase $e^{3\pi i/2}=-i$, yes), the third $0.011=\tfrac38$ (yes). So the register is precisely $\mathrm{QFT}\lvert011\rangle$, the inverse QFT undoes it, and the measurement reads $011$ with probability 1. The binary expansion $3/8=0.011_2$ appears directly on the screen.`},{t:"widget",name:"composer",props:{preset:"qpe"},caption:"Run the phase-estimation preset and read the counting register: a single bit string with probability 1, which is the binary fraction of the phase. Then change the phase gate that plays the role of U (try a value that is not a multiple of 1/8 for three counting qubits) and see the single bar split into several."},{t:"md",text:p`## Precision, and when the phase is not exactly representable

Most phases are not exact multiples of $1/2^t$. Write $2^t\varphi=m+2^t\delta$ where $m/2^t$ is the closest representable value and $\lvert\delta\rvert\le 1/2^{t+1}$. A direct calculation gives the probability of measuring outcome $k$:

$$P(k)=\left|\frac1{2^t}\sum_{j=0}^{2^t-1}e^{2\pi i j(\varphi-k/2^t)}\right|^2=\frac{\sin^2\!\bigl(\pi(2^t\varphi-k)\bigr)}{2^{2t}\sin^2\!\bigl(\pi(\varphi-k/2^t)\bigr)}.$$

The distribution is a sharp peak around the true value, falling off like a diffraction pattern (it is the same mathematics as a single slit). Concretely:

- **Worst case.** When $\varphi$ sits exactly midway between two representable values, each neighbour is measured with probability $4/\pi^2\approx40.5\%$, so together the two nearest values come up with probability $8/\pi^2\approx81\%$.
- **Typical case.** For $t=3$ and $\varphi=0.3$ ($2^t\varphi=2.4$) the formula gives $P(2)\approx58\%$ and $P(3)\approx26\%$, the other outcomes sharing the remaining 16%.

The nearest-neighbour guarantee is $m/2^t$ within $1/2^t$ of the truth with probability at least $8/\pi^2$. To get $n$ correct bits with failure probability at most $\varepsilon$, use about $t=n+\lceil\log_2(2+1/(2\varepsilon))\rceil$ counting qubits. Each *extra* qubit doubles the resolution and pushes the failure probability down exponentially, at the price of doubling the largest power $U^{2^{t-1}}$.

### The hidden cost

Controlled-$U^{2^j}$ looks free in a diagram. For a general $U$, though, building $U^{2^{t-1}}$ costs about $2^{t-1}$ applications of $U$, so precision of $t$ bits costs about $2^t$ applications overall. This is the **Heisenberg limit**: error shrinks as $1/\text{(number of uses of }U)$, versus $1/\sqrt{\text{uses}}$ for naive repeated sampling. When $U$ has structure (for instance modular multiplication in Shor's algorithm) powers can be computed far more cheaply by repeated squaring.

### What if the input is not an eigenvector?

Phase estimation is linear. Write the target input as $\sum_j c_j\lvert u_j\rangle$, a superposition of eigenvectors with phases $\varphi_j$. Then the measurement returns an estimate of $\varphi_j$ with probability $\lvert c_j\rvert^2$, and the target register collapses to the matching $\lvert u_j\rangle$. You do not average the phases; you get **one** of them at random. This is a feature, not a bug: you can often start from an easy state that overlaps with the eigenvector you want. In quantum chemistry, a decent approximation to the ground state has large overlap $\lvert c_0\rvert^2$ with the true ground state, so QPE returns the ground-state energy with probability about $\lvert c_0\rvert^2$. In Shor's algorithm the simple state $\lvert1\rangle$ is an equal superposition of all the eigenvectors of modular multiplication.`},{t:"widget",name:"qft-viz",props:{},caption:"Now use the same widget for the measurement side of phase estimation. Choose a frequency that fits the register exactly and see one tall bar; then choose one that falls between two grid points and watch the spike spread over its neighbours with a central peak and decaying side lobes, just like the 81% worst-case estimate above."},{t:"callout",kind:"math",title:"A common misconception",text:p`"The register collapses to $\varphi$." No: it collapses to an integer $m$, and $m/2^t$ is only an *estimate* of $\varphi$. Reading $011$ does not prove the phase is exactly $3/8$; it says the phase is within about $1/2^t$ of $3/8$ (with high probability). Likewise the target register is not "measured" along the way: its eigenvector state is left intact, which is why QPE can be repeated or used as a subroutine.`},{t:"md",text:p`## Where this leads

- **Shor's algorithm.** Apply QPE to the unitary $U\lvert y\rangle=\lvert ay\bmod N\rangle$. Its eigenphases are multiples $s/r$, where $r$ is the multiplicative order of $a$. Reading $s/r$ as a fraction reveals $r$, which in turn factors $N$. This **order finding** is the core of the Shor lesson.
- **Quantum chemistry.** Take $U=e^{-iHt}$ for a molecular Hamiltonian $H$. Its eigenphases are energies, so QPE reads off the ground-state energy to chemical precision. The variational methods of the NISQ lessons are the near-term cousin of this long-term approach.
- **HHL and linear systems.** To solve $A\mathbf x=\mathbf b$, phase estimation of $e^{iAt}$ finds the eigenvalues of $A$, which are then inverted. The same caveat as for the QFT applies: reading out the whole solution is expensive, so this works only if you want a *property* of $\mathbf x$.
- **Relation to Grover.** Amplitude estimation, the Grover lesson's generalisation, is just QPE applied to the Grover iterate, whose eigenphases encode the fraction of marked items and give a quadratic speedup in counting.

QFT and QPE are the bridge from "interesting circuits" to "algorithms with provable exponential advantages", and they set up everything that follows.`}],quiz:[{q:String.raw`For $N=4$ (so $\omega=i$), what is $\mathrm{QFT}\lvert1\rangle$?`,options:[String.raw`$\tfrac12(\lvert0\rangle+i\lvert1\rangle-\lvert2\rangle-i\lvert3\rangle)$`,String.raw`$\tfrac12(\lvert0\rangle+\lvert1\rangle+\lvert2\rangle+\lvert3\rangle)$`,String.raw`$\tfrac12(\lvert0\rangle-\lvert1\rangle+\lvert2\rangle-\lvert3\rangle)$`,String.raw`$\lvert1\rangle$`],answer:0,explain:String.raw`The coefficient of $\lvert y\rangle$ is $\omega^{1\cdot y}/2=i^y/2$, giving $1,i,-1,-i$ over 2. The all-plus state is $\mathrm{QFT}\lvert0\rangle$, the alternating signs are $\mathrm{QFT}\lvert2\rangle$, and the QFT never leaves a basis state unchanged except by coincidence (it spreads it evenly).`},{q:"Why does the QFT not give an exponential speedup for computing the spectrum of a classical data set?",options:["The QFT needs more gates than the FFT needs operations","A measurement returns only one sample of the output, and loading the data into amplitudes is itself costly, so the spectrum cannot be read out","The QFT is not unitary","The QFT only works for N = 4"],answer:1,explain:"The circuit is genuinely exponentially shorter, but its output is a quantum state of 2^n amplitudes. Measuring yields a single bit string, and preparing the input from classical data takes time comparable to the data size. The QFT helps when the input is already a quantum state and you only want a global property such as a period."},{q:String.raw`In phase estimation with $t=3$ counting qubits, the eigenvalue is $e^{2\pi i\varphi}$ with $\varphi=5/8$. What does the counting register read?`,options:["011 with probability 1","101 with probability 1","110 with probability 1","A random 3-bit string with equal probabilities"],answer:1,explain:String.raw`Since $2^3\varphi=5$ is an integer, the register after the controlled-$U$ gates is exactly $\mathrm{QFT}\lvert5\rangle$, and the inverse QFT returns $\lvert5\rangle=\lvert101\rangle$ deterministically. Indeed $5/8=0.101_2$.`},{q:String.raw`When $\varphi$ is not a multiple of $1/2^t$, what does phase estimation guarantee?`,options:["The outcome is always exactly the nearest representable value","The outcome is uniformly random",String.raw`One of the two nearest representable values $m/2^t$ is measured with probability at least $8/\pi^2\approx81\%$, and adding counting qubits boosts the accuracy and confidence`,"The algorithm fails and returns nothing"],answer:2,explain:String.raw`The outcome distribution is a diffraction-like peak. In the worst case, with $\varphi$ exactly halfway between two grid values, each is measured with probability $4/\pi^2\approx40\%$, so together at least $8/\pi^2\approx81\%$. Extra counting qubits both refine the grid and shrink the chance of a bad outcome.`},{q:String.raw`The input to the target register is $\sqrt{0.7}\lvert u_1\rangle+\sqrt{0.3}\lvert u_2\rangle$, with eigenphases $\varphi_1$ and $\varphi_2$ (each exactly representable). What does one run of QPE give?`,options:[String.raw`The average phase $0.7\varphi_1+0.3\varphi_2$`,String.raw`$\varphi_1$ with probability 0.7 and $\varphi_2$ with probability 0.3, and the target collapses to the matching eigenvector`,"Always the larger of the two phases","Nothing useful, because the input must be an eigenvector"],answer:1,explain:String.raw`QPE is linear, so each eigencomponent is processed independently and the measurement picks one with probability $\lvert c_j\rvert^2$. The result is a sample of one eigenphase, not an average, and the target register is left in the corresponding eigenvector.`}],takeaways:[String.raw`The QFT is the DFT as a unitary change of basis: $\lvert x\rangle\to N^{-1/2}\sum_y\omega^{xy}\lvert y\rangle$ with $\omega=e^{2\pi i/N}$, and a period-$r$ input gives peaks at multiples of $N/r$.`,"The QFT circuit uses Hadamards, controlled-phase gates R_k and swaps: O(n^2) gates compared with O(n 2^n) for the classical FFT, but you cannot read out all the amplitudes, so it is a subroutine.","Phase kickback moves an eigenvalue phase onto a control qubit; QPE uses controlled-U^(2^j), then the inverse QFT, to turn that phase into a binary fraction in the counting register.",String.raw`With t counting qubits an exactly representable phase is read perfectly (3/8 gives 011); otherwise the nearest two values come up with probability at least $8/\pi^2\approx81\%$, and more qubits improve precision.`,"A superposition of eigenvectors yields one eigenphase at random with probability |c_j|^2; this underlies Shor order finding, chemistry energy estimation and HHL."]},Ae=Object.freeze(Object.defineProperty({__proto__:null,lesson:Se},Symbol.toStringTag,{value:"Module"})),y=String.raw,Be={id:"qubit-bloch",order:5,part:"The Qubit",title:"The Qubit & the Bloch Sphere",summary:"Describe one qubit as a normalised 2-vector, draw every pure state as a point on a sphere, and learn exactly what a measurement can and cannot tell you.",minutes:35,objectives:["You can write a qubit state as alpha|0> + beta|1> and check normalisation.","You can distinguish global phase (unobservable) from relative phase (observable).","You can convert between the amplitudes and the Bloch angles theta and phi, and locate the six cardinal states.","You can compute measurement probabilities in the Z, X and Y bases using the Born rule.","You can explain why a qubit does not hold infinite classical information."],blocks:[{t:"md",text:y`## From bit to qubit

A classical **bit** is either $0$ or $1$. A **qubit** is a quantum system with two perfectly distinguishable states, which we label $|0\rangle$ and $|1\rangle$ (read "ket zero" and "ket one"). Mathematically these are the standard basis vectors of $\mathbb{C}^2$:
$$|0\rangle = \begin{pmatrix}1\\0\end{pmatrix}, \qquad |1\rangle = \begin{pmatrix}0\\1\end{pmatrix}.$$
By the state postulate from Lesson 4, a general qubit state is a **superposition**
$$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle = \begin{pmatrix}\alpha\\ \beta\end{pmatrix}, \qquad \alpha,\beta\in\mathbb{C},\quad |\alpha|^2+|\beta|^2 = 1.$$
The numbers $\alpha$ and $\beta$ are **amplitudes**. The normalisation condition expresses that the probabilities of the two outcomes sum to one. If we measure in the $\{|0\rangle,|1\rangle\}$ basis (the **computational basis**), the **Born rule** gives
$$P(0) = |\langle 0|\psi\rangle|^2 = |\alpha|^2, \qquad P(1) = |\langle 1|\psi\rangle|^2 = |\beta|^2,$$
and afterwards the state is $|0\rangle$ or $|1\rangle$ accordingly.

### Two important superpositions

The states
$$|+\rangle = \tfrac{1}{\sqrt2}(|0\rangle+|1\rangle), \qquad |-\rangle = \tfrac{1}{\sqrt2}(|0\rangle-|1\rangle)$$
both give 50/50 outcomes in the computational basis, yet they are orthogonal: $\langle +|-\rangle = \tfrac12(1-1)=0$. They differ only in the **sign** of the second amplitude. This tells us that amplitudes carry information that probabilities of a single measurement hide.

### What a superposition is not

It is **not** "the qubit is secretly $0$ or $1$ and we do not know which". That would be classical ignorance, and it cannot explain interference (Lesson 4). It is also not "$0$ and $1$ simultaneously" in any sense a classical bit could be. The honest statement: $|+\rangle$ is a definite, fully specified state; it is the state with a *definite* answer to the question "is it $+$ or $-$?" (always $+$), and an *indefinite* answer to "is it $0$ or $1$?".`},{t:"md",text:y`## Phase: global versus relative

Amplitudes are complex, so we can write each in polar form, $\alpha = |\alpha|e^{i\delta_0}$ and $\beta = |\beta|e^{i\delta_1}$. Two kinds of phase appear.

**Global phase.** Multiply the whole state by $e^{i\gamma}$: $|\psi\rangle \to e^{i\gamma}|\psi\rangle$. Every Born-rule probability $|\langle b|\psi\rangle|^2$ is unchanged, for every basis and after every unitary gate, because $|e^{i\gamma}|=1$ and unitaries are linear. Two vectors differing by a global phase are the **same physical state**. Example: $-|+\rangle$ and $|+\rangle$ are identical.

**Relative phase.** The phase *difference* $\varphi = \delta_1-\delta_0$ between the components. It matters: $|+\rangle$ and $|-\rangle$ have relative phase $0$ and $\pi$ and are perfectly distinguishable by a measurement in the $X$ basis. Using the global freedom to make the first amplitude real and non-negative, every qubit state can be written as
$$\boxed{|\psi\rangle = \cos\tfrac{\theta}{2}\,|0\rangle + e^{i\varphi}\sin\tfrac{\theta}{2}\,|1\rangle}, \qquad 0\le\theta\le\pi,\quad 0\le\varphi<2\pi.$$
Check normalisation: $\cos^2\tfrac\theta2+\sin^2\tfrac\theta2 = 1$. Two real numbers, $\theta$ and $\varphi$, specify a qubit state: a complex vector has four real parameters, normalisation removes one, and the global phase removes another, leaving two.

### Why half-angles?

The factor $\tfrac{\theta}{2}$ looks odd. It is chosen so that $\theta$ is a *geometric angle on a sphere*, as we see next. The price is that orthogonal quantum states (such as $|0\rangle$ and $|1\rangle$) sit at opposite poles, $180^\circ$ apart on the sphere, while their vectors in $\mathbb{C}^2$ are $90^\circ$ apart in the sense of the inner product: sphere angle is twice the Hilbert-space angle.`},{t:"md",text:y`## The Bloch sphere

Interpret $(\theta,\varphi)$ as polar and azimuthal angles on a unit sphere. The point
$$\vec r = (x,y,z) = (\sin\theta\cos\varphi,\; \sin\theta\sin\varphi,\; \cos\theta)$$
is the **Bloch vector** of $|\psi\rangle$, and the sphere of all such points is the **Bloch sphere**. Every pure qubit state corresponds to exactly one point on the surface (up to global phase), and every surface point is a state. The Bloch vector components are the expectation values of the Pauli matrices: $x=\langle X\rangle$, $y=\langle Y\rangle$, $z=\langle Z\rangle$.

### The six cardinal states

| State | Bloch point | $\theta,\varphi$ |
|---|---|---|
| $\lvert 0\rangle$ | $+z$ (north pole) | $0,\ -$ |
| $\lvert 1\rangle$ | $-z$ (south pole) | $\pi,\ -$ |
| $\lvert +\rangle=\tfrac{1}{\sqrt2}(\lvert 0\rangle+\lvert 1\rangle)$ | $+x$ | $\pi/2,\ 0$ |
| $\lvert -\rangle=\tfrac{1}{\sqrt2}(\lvert 0\rangle-\lvert 1\rangle)$ | $-x$ | $\pi/2,\ \pi$ |
| $\lvert{+i}\rangle=\tfrac{1}{\sqrt2}(\lvert 0\rangle+i\lvert 1\rangle)$ | $+y$ | $\pi/2,\ \pi/2$ |
| $\lvert{-i}\rangle=\tfrac{1}{\sqrt2}(\lvert 0\rangle-i\lvert 1\rangle)$ | $-y$ | $\pi/2,\ 3\pi/2$ |

Orthogonal states are **antipodal** (opposite points). The three axes are the eigenbases of the Pauli operators $Z$, $X$, $Y$. The equator ($\theta=\pi/2$) holds the equal superpositions, differing only in relative phase $\varphi$; the latitude encodes the *balance* between $|0\rangle$ and $|1\rangle$, and the longitude encodes their relative phase.`},{t:"widget",name:"bloch",props:{start:"zero",tools:["angles"]},caption:"Drag the theta and phi sliders. Set theta to 90 degrees and sweep phi from 0 to 360: you should circle the equator and pass through |+>, |+i>, |->, |-i>. Then set theta back to 0: what happens to phi? (Observe that at the poles phi has no effect, because the |1> amplitude is zero.)"},{t:"callout",kind:"math",title:"Worked example: from angles to amplitudes",text:y`Take $\theta = \pi/3$ ($60^\circ$) and $\varphi=\pi/2$. Then $\cos(\theta/2)=\cos 30^\circ = \tfrac{\sqrt3}{2}$ and $\sin(\theta/2)=\tfrac12$, so
$$|\psi\rangle = \tfrac{\sqrt3}{2}|0\rangle + \tfrac{i}{2}|1\rangle.$$
Bloch vector: $(\sin60^\circ\cos90^\circ,\ \sin60^\circ\sin90^\circ,\ \cos60^\circ) = (0,\ \tfrac{\sqrt3}{2},\ \tfrac12)$. In the computational basis, $P(0)=\tfrac34$ and $P(1)=\tfrac14$. Check against geometry: $P(0)=\tfrac{1+z}{2}=\tfrac{1+1/2}{2}=\tfrac34$. ✓.`},{t:"md",text:y`## Measuring in different bases

The Born rule applies to **any** orthonormal basis, and the Bloch sphere makes the answer geometric. Suppose we measure along a direction $\hat n$ on the sphere, meaning in the orthonormal basis formed by the states at $+\hat n$ and $-\hat n$. Then
$$P(+\hat n) = \frac{1+\hat n\cdot\vec r}{2}, \qquad P(-\hat n) = \frac{1-\hat n\cdot\vec r}{2}.$$
The probability is determined by the angle $\gamma$ between $\hat n$ and the state's Bloch vector: $P(+\hat n)=\cos^2(\gamma/2)$. Concretely:

- **Z basis** ($\hat n=\hat z$): $P(0)=(1+z)/2$. Only the height of the point matters.
- **X basis** ($\hat n=\hat x$): $P(+)=(1+x)/2$.
- **Y basis** ($\hat n=\hat y$): $P(+i)=(1+y)/2$.

Verify with the example above, $\vec r=(0,\tfrac{\sqrt3}{2},\tfrac12)$: $P(+i) = \tfrac12(1+\tfrac{\sqrt3}{2})=\tfrac{2+\sqrt3}{4}\approx 0.933$. Direct calculation: $\langle +i|\psi\rangle = \tfrac{1}{\sqrt2}\big(\tfrac{\sqrt3}{2} + (-i)(\tfrac i2)\big)=\tfrac{1}{\sqrt2}\cdot\tfrac{\sqrt3+1}{2}$, whose squared modulus is $\tfrac{(\sqrt3+1)^2}{8}=\tfrac{2+\sqrt3}{4}$. ✓

### Measurement is a projection with a cost

After the measurement along $\hat n$ the state **jumps** to the outcome's cardinal point, and the original $(\theta,\varphi)$ are lost. One measurement of one copy yields a single bit. To estimate the state you must prepare many identical copies and measure in at least three directions to estimate $x$, $y$ and $z$ (this is **state tomography**). With $N$ copies the statistical error in each component shrinks only like $1/\sqrt N$.`},{t:"widget",name:"bloch",props:{start:"plus",tools:["measure"]},caption:"Start at |+>. Measure in the Z basis a few dozen times: you should see roughly 50/50 and the state jumps to |0> or |1>. Then switch to the X basis from |+>: every result is +. Which basis gives you certainty and which gives randomness? Compare with P = (1 + n.r)/2."},{t:"widget",name:"bloch",props:{start:"zero",tools:["gates","angles","measure"]},caption:"Free play with all tools. Apply H, then S, then H to |0> and read off the final Bloch point. Predict first: H sends +z to +x, S rotates 90 degrees about z so +x goes to +y, and H sends +y to -y. Check whether the sphere agrees and whether probabilities match (1+n.r)/2."},{t:"callout",kind:"tip",title:"Reading the sphere",text:y`Two quick rules: (1) **height = $Z$ information**, probability of $0$ is $(1+z)/2$; (2) **azimuth = relative phase**, invisible to a Z measurement but visible after a gate that rotates the equator toward the poles (this is exactly what the Hadamard does).`},{t:"md",text:y`## Gates as rotations, and a puzzle

Because unitaries preserve norms and phases only up to global factors, every single-qubit gate acts on the Bloch sphere as a **rigid rotation** of the whole sphere. $X$, $Y$, $Z$ are half-turns about their axes; $H$ is a half-turn about the axis halfway between $x$ and $z$; $S$ is a quarter turn about $z$. Lesson 6 develops this fully. For now, treat the sphere as a map and gates as moves, and try to reach a target with as few moves as possible.`},{t:"widget",name:"bloch-challenge",caption:"Reach each target state using the fewest gates. Think in terms of rotations: which axis and angle do you need? Notice that some targets need a relative-phase gate (S or T) while others need only H and X. Compare your gate count with the shortest solution the puzzle reports."},{t:"md",text:y`## Qubit versus bit: the honest comparison

Since a qubit state needs two **continuous** real parameters $(\theta,\varphi)$, it is tempting to say a qubit "stores infinite information". That is a **misconception**, and it is worth understanding precisely why.

**What is true.** Describing a general qubit state to arbitrary precision requires infinitely many classical bits. A quantum computer manipulating $n$ qubits evolves a state with $2^n$ complex amplitudes, which a classical simulator must track explicitly. This is why simulating many qubits classically is hard.

**What is false.** You cannot *read out* those amplitudes. A measurement of one qubit returns exactly one bit. **Holevo's theorem** (1973) makes this rigorous: from $n$ qubits you can extract at most $n$ classical bits of information, no matter how cleverly you encode and measure. Also, by the **no-cloning theorem** you cannot copy an unknown state to estimate it more cheaply, and measuring disturbs it.

So a qubit is not a bit with infinite memory. The value of qubits lies elsewhere: amplitudes can be **manipulated coherently** by gates, interfering with each other, before a final measurement extracts a small, useful answer. Algorithms succeed only when the interference pattern is designed so that the single bit-string we read out is the answer we want.

### Comparison

| | Bit | Qubit |
|---|---|---|
| States | 0 or 1 | Any point on the Bloch sphere |
| Readout | Non-destructive, repeatable | One bit, disturbs state (collapse) |
| Copying | Free | Impossible for unknown states |
| Max extractable information | 1 bit | 1 bit (Holevo) |
| Operations | Reversible or not | Always unitary (reversible) until measured |`},{t:"callout",kind:"warn",title:"Mixed states and the ball",text:y`Points *inside* the Bloch ball (radius less than 1) describe **mixed states**: probabilistic mixtures or qubits entangled with something else. Noise shrinks the Bloch vector towards the centre; Lesson 9 shows this. In this lesson we meet only **pure** states, which lie on the surface.`},{t:"md",text:y`## Try it in code

Qiskit labels qubits in **little-endian** order (qubit 0 is the rightmost bit in printed bit-strings); this course writes states big-endian, $|q_0q_1q_2\rangle$. For a single qubit the distinction does not arise. Here is the Bloch-vector computation in NumPy:

${"```"}python
import numpy as np

def bloch_vector(psi):
    a, b = psi
    return np.array([
        2 * np.real(np.conj(a) * b),      # <X>
        2 * np.imag(np.conj(a) * b),      # <Y>
        abs(a)**2 - abs(b)**2,            # <Z>
    ])

psi = np.array([np.sqrt(3)/2, 1j/2])      # theta=pi/3, phi=pi/2
print(bloch_vector(psi))                  # [0, 0.866, 0.5]
print((1 + bloch_vector(psi)[2]) / 2)     # P(0) = 0.75

# global phase changes nothing
print(bloch_vector(np.exp(0.7j) * psi))   # same vector
${"```"}

In Qiskit, ${"`Statevector([a, b])`"} followed by ${'`.draw("bloch")`'} draws the same sphere. Run the global-phase line and convince yourself that the Bloch vector, our complete description of a pure qubit up to unobservable phase, does not change.`}],quiz:[{q:"A qubit is in the state (3/5)|0> + (4/5)|1>. What is the probability of measuring 1 in the computational basis?",options:["3/5","4/5","9/25","16/25"],answer:3,explain:"The Born rule gives P(1) = |beta|^2 = (4/5)^2 = 16/25. The amplitudes themselves are not probabilities; check 9/25 + 16/25 = 1."},{q:"Which pair of states differ only by a global phase, and are therefore physically identical?",options:["|+> and |->","|0> and e^{i pi/3}|0>","|0> and |1>","(|0>+|1>)/sqrt2 and (|0>+i|1>)/sqrt2"],answer:1,explain:"Multiplying an entire state by e^{i gamma} changes no measurement statistics. |+> vs |-> and |+> vs |+i> differ in relative phase (different Bloch points), so they are distinguishable."},{q:"Where on the Bloch sphere is the state (|0> - i|1>)/sqrt2 (theta = pi/2, phi = 3 pi/2)?",options:["At the point +y","At the point -y","At the point -x","At the south pole"],answer:1,explain:"x = sin(theta)cos(phi) = 0, y = sin(theta)sin(phi) = sin(3 pi/2) = -1, z = cos(theta) = 0. This is |-i>, the point -y."},{q:"A pure qubit state has Bloch vector component z = 1/2 (and some unspecified x, y on the sphere surface). What is the probability of outcome 0 in the Z basis?",options:["1/2","1/4","3/4","1"],answer:2,explain:"P(0) = (1 + z)/2 = (1 + 1/2)/2 = 3/4, regardless of the azimuth phi. Only the height of the point matters for a Z measurement."},{q:"Why can a qubit not be used to store and retrieve an unlimited amount of classical information, even though its state has continuous parameters?",options:["Because the Bloch sphere has finite radius.","Because of Holevo's bound: n qubits yield at most n classical bits on readout, and measurement collapses the state.","Because qubits can only ever be in the states |0> or |1>.","Because quantum computers use probabilities, which are not real numbers."],answer:1,explain:"The continuous amplitudes are not directly accessible. Any measurement returns discrete outcomes, and Holevo's theorem bounds the extractable information by the number of qubits. Quantum advantage comes from interference, not storage."}],takeaways:["A qubit state is a unit vector alpha|0> + beta|1> in C^2; P(0) = |alpha|^2 and P(1) = |beta|^2.","Global phase is unobservable; relative phase is physical. Every pure state is cos(theta/2)|0> + e^{i phi} sin(theta/2)|1>.","Pure states are points on the Bloch sphere: orthogonal states are antipodal, phi is longitude, and P(+n) = (1 + n.r)/2.","Measurement in any basis gives one bit and collapses the state; learning the full state needs many copies.","A qubit holds at most one extractable classical bit (Holevo); its power lies in coherent interference of amplitudes."]},Ne=Object.freeze(Object.defineProperty({__proto__:null,lesson:Be},Symbol.toStringTag,{value:"Module"})),Ie={id:"reservoir",order:17,part:"NISQ & Beyond",title:"Quantum Reservoir Computing & QML",summary:"Let a fixed, un-trained quantum system churn on your data, then train only a cheap linear readout, and learn where quantum machine learning honestly stands.",minutes:40,objectives:["You can explain how a classical reservoir (echo state network) works and why only the readout is trained.","You can describe the Fujii–Nakajima quantum reservoir: input on one qubit, Ising evolution, observable readout.","You can derive the ridge-regression readout weights in closed form and say what the regulariser does.","You can define fading memory and memory capacity, and read both off the reservoir widget.","You can state honestly what is and is not known about quantum machine learning advantages."],blocks:[{t:"md",text:String.raw`## Training is the expensive part, so avoid it

In the previous lesson we trained a quantum circuit by looping between quantum and classical computers. That loop is costly: every gradient step needs many circuit runs, and noisy hardware makes landscapes hard. **Reservoir computing** takes a radically lazier route: *do not train the dynamical system at all.*

The idea comes from classical machine learning, where it is known as an **echo state network** (ESN) or liquid state machine. Picture a pond. Drop a stone in (the input) and ripples spread, reflect and mix. The pattern on the surface at any moment is a rich, nonlinear echo of recent stones. You do not need to understand the water; you only need a camera and a way to read the pattern.

Formally, a classical reservoir is a state vector $\vec x_t\in\mathbb{R}^N$ updated by a **fixed random** map

$$\vec x_{t+1}=\tanh\!\big(W\vec x_t+\vec w_{\rm in}\,u_t\big),$$

where $u_t$ is the scalar input at time $t$, $W$ is a random $N\times N$ matrix and $\vec w_{\rm in}$ a random input vector. Neither is ever trained. Only a **linear readout** is learned:

$$\hat y_t=\vec w_{\rm out}\cdot\vec x_t .$$

Because the readout is linear, training is a convex least-squares problem with a closed-form answer, with no backpropagation through time, no barren plateaus, and no local minima. The reservoir's job is just to map a one-dimensional history $u_t,u_{t-1},\dots$ into a high-dimensional feature vector in which the target becomes *linearly* separable, the same trick that kernel methods use.

Two properties make a reservoir useful. **Nonlinearity** lets it compute nonlinear functions of the input. **Fading memory** (the *echo state property*) means the state depends on recent inputs but forgets the distant past, so that the initial state is eventually irrelevant. If memory never fades the system is chaotic and the readout cannot find stable structure; if it fades instantly there is no memory to exploit. The sweet spot is "the edge of chaos".`},{t:"md",text:String.raw`## Why a quantum system makes a good reservoir

How many features can a reservoir offer a linear readout? A classical ESN with $N$ nodes offers $N$ numbers. Now consider $n$ qubits. Their joint state lives in a $2^n$-dimensional Hilbert space and is described by a density matrix $\rho$ with $4^n-1$ independent real parameters. The measurable quantities, such as the Pauli expectation values $\langle Z_i\rangle$ and $\langle Z_iZ_j\rangle$, are **linear in $\rho$**, while $\rho$ itself evolves by a unitary that mixes inputs in a very non-trivial way. With only $n=10$ qubits there are over a million independent Pauli observables available in principle, and the dynamics already generates complicated nonlinear functions of the input history through repeated re-encoding.

This is the pitch: *exponentially many features for a linear number of physical qubits.* Keep two honest caveats in mind from the start:

- Each feature must be **estimated from measurements**, so its precision is limited by shot noise ($\sim 1/\sqrt{N_{\rm shots}}$). Having $4^n$ available observables is not the same as being able to use them all.
- Nothing here is a proven speedup. The claim is *plausible expressive richness*, which is empirical.

### The Fujii–Nakajima construction

In 2017 Keisuke Fujii and Kohei Nakajima proposed a concrete model; the widget below implements the same recipe. Take $n$ qubits with a fixed **transverse-field Ising Hamiltonian** with random couplings $J_{ij}$:

$$H=\sum_{i<j}J_{ij}\,X_iX_j+h\sum_{i}Z_i ,$$

where $X_i,Z_i$ are Pauli operators on qubit $i$ and $h$ sets the field strength. One time step has three parts:

1. **Input.** Discard qubit 1 and replace it with a fresh qubit in a state encoding the input $s_t\in[0,1]$, for instance $|\psi_{s}\rangle=\sqrt{1-s_t}\,|0\rangle+\sqrt{s_t}\,|1\rangle$. The other qubits keep their state, so the reservoir **remembers** through them.
2. **Evolve.** Apply $U=e^{-iH\tau}$ for a fixed duration $\tau$: $\rho\mapsto U\rho U^\dagger$.
3. **Read out.** Record the expectation values $\langle Z_i\rangle$ and $\langle Z_iZ_j\rangle$ as the feature vector $\vec x_t$.

Because the replaced qubit is traced out and refreshed, the map is dissipative from the reservoir's viewpoint: information from the old qubit-1 state leaks into the others, then is overwritten. That is what produces fading memory without any explicit noise. Evolution is unitary on the whole system, so the quantum part is "easy to do, hard to simulate" once $n$ is large, which is why a physical device could in principle beat a classical computer at hosting such a reservoir.`},{t:"widget",name:"reservoir",caption:"Try it: run the sine-prediction task with the default settings and compare the quantum reservoir curve with the classical echo-state network of similar size. Note the test error each reports. Then increase the number of qubits by one or two and see whether the error falls."},{t:"md",text:String.raw`## Training the readout: ridge regression in closed form

Suppose we collect the feature vectors from $T$ time steps into a matrix $X\in\mathbb{R}^{T\times M}$ (row $t$ is $\vec x_t$ with a constant $1$ appended for a bias) and the targets into a vector $\vec y\in\mathbb{R}^{T}$. We want weights $\vec w$ minimising squared error **plus a penalty** on their size:

$$L(\vec w)=\|X\vec w-\vec y\|^2+\lambda\|\vec w\|^2 ,\qquad \lambda>0 .$$

Set the gradient to zero. $\nabla L=2X^{T}(X\vec w-\vec y)+2\lambda \vec w=0$ gives the **normal equations**

$$\vec w=\big(X^{T}X+\lambda I\big)^{-1}X^{T}\vec y .$$

That is the whole of training: one matrix inversion of size $M\times M$. The term $\lambda I$ matters. Features from the reservoir are strongly correlated, so $X^TX$ is nearly singular; without $\lambda$ the weights would blow up and *fit the noise*. Larger $\lambda$ trades a little bias for much lower variance. You choose $\lambda$ on held-out data, never on the training data.

### Two standard tasks

**Sine (or other signal) prediction.** Feed $s_t$ and ask the readout to output $s_{t+1}$ or a nonlinear function of the recent past. A sine wave is easy but exposes whether the reservoir has enough memory of phase; adding noise or harmonics makes it harder.

**Memory capacity.** Feed random inputs $s_t$ and train a separate readout to reproduce $s_{t-k}$, the input from $k$ steps ago. Let $r_k^2$ be the squared correlation between the reproduced and true delayed input on test data. The **memory capacity** is

$$\mathrm{MC}=\sum_{k=1}^{\infty} r_k^{2}.$$

It counts, roughly, how many past inputs the reservoir retains. For a linear readout it is bounded above by the number of independent features $M$, so adding qubits (more features) is the only route to more memory.

A second quantity, **nonlinear capacity**, measures reconstruction of products like $s_{t-1}s_{t-2}$. Good reservoirs trade linear memory against nonlinearity, since the total is bounded.`},{t:"callout",kind:"math",title:"Why the bound MC <= M",text:String.raw`Each delayed-input target $s_{t-k}$ can only be recovered if it lies in the span of the $M$ feature signals. Distinct delays are (for i.i.d. random input) mutually orthogonal functions, and at most $M$ orthogonal directions fit in an $M$-dimensional span, so the sum of squared correlations cannot exceed $M$.`},{t:"widget",name:"reservoir",caption:"Try it: switch the task to memory capacity. Read the capacity versus delay k plot: it should be near 1 for small k and fall towards 0 for large k. Now vary the evolution time or the field h: does the memory get longer or shorter? Find a setting where the quantum reservoir has more memory than the classical one, and one where it has less."},{t:"md",text:String.raw`## Tuning, noise and the shot-cost problem

The knobs that matter, and what to expect:

- **Evolution time $\tau$.** Too short and the input qubit barely couples to the others, so memory is poor. Too long and the dynamics scrambles information so thoroughly that the features become hard to read linearly (and finite shots wipe out the small differences).
- **Coupling disorder and field $h$.** The Ising model with transverse field is *non-integrable* for generic couplings, so it thermalises and scrambles. Too strong a field freezes dynamics into something close to localised, which hurts nonlinearity. Intermediate settings work best, the quantum analogue of the "edge of chaos".
- **Size $n$.** More qubits give more features and more memory, up to the point where readout noise dominates.

### Noise: bug or feature?

On real hardware, decoherence is not always bad news for a reservoir. Mild damping *helps* establish the echo state property because it makes old information fade. Several experimental and numerical studies report that reservoir performance degrades gracefully with noise rather than collapsing, in contrast to algorithms such as Shor's which need exact interference. But noise does not create information, and past a point it removes the nonlinear structure the reservoir lives on.

### The real obstacle: measuring features

In the simulation the widget uses exact density-matrix expectation values, i.e. infinitely many shots. A physical experiment has three problems:

1. **Shot noise.** Estimating each $\langle Z_iZ_j\rangle$ to precision $\epsilon$ needs $\sim1/\epsilon^2$ repetitions.
2. **Measurement disturbs the reservoir.** Reading out $\langle Z_i\rangle$ collapses the state, which destroys the memory held in the other qubits. Workarounds are *weak* measurements or running many independent copies of the whole input history, repeating the experiment once for each time step. Both multiply the cost.
3. **Number of features.** $\sim n^2$ two-body observables are cheap; the exponentially many higher-order ones are not.

In short, the Hilbert space is exponentially large but the **readout channel is narrow**. Whether quantum reservoirs deliver a practical advantage over equally sized classical ones remains an open, actively researched question.

Try this thought experiment with the circuit composer: a reservoir step is just "reset one qubit to a data-dependent state, apply a fixed entangling block, measure". Below, the Bell preset gives you the smallest entangling block to experiment with.`},{t:"widget",name:"composer",props:{preset:"bell",compact:!0},caption:"Try it: the CNOT creates correlation between the two qubits, so information put on one qubit shows up in ZZ statistics. Change the first qubit with an X or an H before the CNOT and watch how the output probabilities change. This mixing of input into joint observables is exactly what the reservoir exploits."},{t:"md",text:String.raw`## The wider landscape of quantum machine learning

Reservoir computing is one corner of **quantum machine learning (QML)**. The main families:

- **Quantum kernels.** Map data $x$ to a quantum state $|\phi(x)\rangle$ and define the kernel $k(x,x')=|\langle\phi(x)|\phi(x')\rangle|^2$, estimated on hardware (for example with the swap test or Hadamard test); then use a classical support vector machine. Reservoir features are essentially a kernel in disguise. Provable separations exist, but for contrived, cryptography-inspired datasets built from the discrete logarithm problem.
- **Quantum neural networks / variational classifiers.** The parameterised circuits of the last lesson, trained on labelled data. These inherit barren plateaus and shot-noise costs.
- **Data re-uploading.** Interleave data-encoding gates with trainable gates, repeating the data several times. A single qubit with enough layers can act as a universal function approximator (Pérez-Salinas and co-authors, 2020). It shows that expressivity is available; it does not show that quantum beats classical.
- **Quantum linear-algebra-based methods** (HHL-style) promised exponential speedups, but they require loading data into amplitudes and reading results out, which can erase the gain.

### Dequantization and honesty

In 2018 Ewin Tang gave a classical algorithm for recommendation systems that matches the earlier quantum algorithm up to polynomial factors, *assuming the classical side gets comparable sampling access to the data*. Several other "exponential" QML speedups were later dequantized in the same way. The lesson is not that quantum ML is dead; it is that **speedup claims must be compared against the best classical algorithm with equivalent input assumptions**, and that data loading and readout are first-class costs.

A fair summary of the status today: there is no accepted demonstration that QML beats classical ML on a practically relevant task. Plausible niches are data that is itself quantum (for example outputs of a quantum sensor or simulation), where classical learners must first pay for expensive tomography, and **learning properties of quantum states**, where rigorous separations exist for some settings. Treat any headline claiming otherwise with healthy scepticism.`},{t:"callout",kind:"tip",title:"Reservoir computing in one sentence",text:String.raw`Reservoir computing is "use a complicated system you do not need to control as a feature generator, and train only $\vec w=(X^TX+\lambda I)^{-1}X^T\vec y$". Everything else in the lesson is about how to choose and measure that system.`},{t:"widget",name:"reservoir",caption:"Try it: increase the number of qubits and then add noise or reduce the readout set if the widget allows. Which one matters more for the test error: a bigger reservoir or a cleaner readout? Check whether a small quantum reservoir can match a classical network with more nodes."}],quiz:[{q:"In reservoir computing, which part of the system is trained?",options:["Only the linear readout weights.","The couplings of the reservoir and the readout together.","Only the input encoding.","Nothing; weights are fixed by the physics."],answer:0,explain:"The reservoir dynamics (random weights or a fixed Hamiltonian) stay fixed. Only the linear readout is fitted, which is a convex least-squares problem with a closed-form solution."},{q:"Why does ridge regression add the term lambda * I to X^T X?",options:["It makes the matrix non-Hermitian.","It stabilises the inversion when features are strongly correlated and reduces overfitting to noise.","It increases the number of features.","It guarantees zero training error."],answer:1,explain:"Reservoir features are highly correlated, so X^T X is nearly singular and unregularised weights blow up. The lambda penalty shrinks the weights, trading small bias for much lower variance. Training error actually rises slightly."},{q:"In the Fujii–Nakajima reservoir, how does the reservoir keep a memory of past inputs?",options:["It stores them in classical RAM.","The input qubit is replaced each step, but earlier information has been spread by the evolution into the other qubits, which are not reset.","It never resets any qubit, so all history is kept exactly forever.","It repeats the whole history through the circuit every step."],answer:1,explain:"Each step overwrites one qubit, but unitary evolution has already mixed that qubit with the rest, so past inputs survive in correlations and gradually fade as they are overwritten. That is the fading-memory property."},{q:"Which statement is most accurate about the advantage of quantum reservoirs?",options:["It is proven that they beat any classical reservoir of equal size.","They offer exponentially many potential features, but shot noise and measurement back-action limit how many can be used, and a practical advantage is unproven.","They are useless because quantum states cannot be measured.","They require full error correction to function."],answer:1,explain:"The Hilbert space is huge, but each feature must be estimated from repeated measurements, and measurement can disturb the state. Evidence for advantage is numerical and empirical, not a proof, and the readout bottleneck is central."},{q:'What did "dequantization" (Tang, 2018 and later) show?',options:["That all quantum algorithms can be simulated classically.","That some proposed exponential QML speedups can be matched, up to polynomial factors, by classical algorithms given comparable data-access assumptions.","That quantum computers cannot be used for machine learning.","That data loading is free on quantum computers."],answer:1,explain:"Dequantization removes particular claimed speedups, mainly those relying on low-rank structure and amplitude-encoded data, by giving the classical algorithm matching sampling access. Other quantum algorithms, such as Shor, are unaffected."}],takeaways:["A reservoir is a fixed, un-trained dynamical system; only a linear readout is trained, in closed form: w = (X^T X + lambda I)^{-1} X^T y.","The quantum version feeds data into one qubit of an Ising-type system, evolves it, and reads Pauli expectations such as <Z_i> and <Z_iZ_j> as features.","Useful reservoirs need fading memory and nonlinearity; memory capacity measures how many past inputs can be recovered, bounded by the number of features.","Exponentially many potential features do not mean usable features: shot noise and measurement back-action are the central practical bottlenecks.","QML advantage claims need a comparison with the best classical method under equal data-access assumptions; dequantization shows why, and no broad practical advantage is established."]},He=Object.freeze(Object.defineProperty({__proto__:null,lesson:Ie},Symbol.toStringTag,{value:"Module"})),w=String.raw,Ce={id:"shor",order:15,part:"Circuits & Algorithms",title:"Shor's Algorithm: Factoring with Quantum Period Finding",summary:"Factoring a large number reduces to finding the period of a modular exponential, and a quantum computer can find that period efficiently with phase estimation, which is why the algorithm threatens today's public-key cryptography.",minutes:30,objectives:["You can explain why RSA relies on the hardness of factoring and why the best known classical algorithm is sub-exponential but not polynomial.","You can reduce factoring to order finding and carry out the number theory by hand for N = 15 and a = 7.","You can describe the quantum subroutine: controlled modular multiplications, phase estimation of U_a, and continued fractions to recover the period.","You can state honestly what has been demonstrated so far, what resources a cryptographically relevant run needs, and what Shor does not break."],blocks:[{t:"md",text:w`## Why anyone cares about factoring

Multiplying two large primes is easy: a laptop multiplies two 1024-bit primes in microseconds. Going backwards, given only the 2048-bit product $N=pq$, and recovering $p$ and $q$, is believed to be hard. The **RSA** cryptosystem builds its security on exactly this gap. Your public key contains $N$; your private key needs the factors. Anyone who can factor $N$ can compute your private key.

"Hard" has a precise meaning here. The best known classical method, the **general number field sieve**, runs in time roughly

$$\exp\!\Big(c\,(\ln N)^{1/3}(\ln\ln N)^{2/3}\Big),$$

which is **sub-exponential** in the number of digits but still far from polynomial. It is fast enough that an 829-bit number (RSA-250) was factored in 2020 using a very large computing effort, yet each additional bit makes the job noticeably harder. A 2048-bit modulus is far out of reach.

In 1994 Peter Shor showed that a quantum computer could factor an $n$-bit number in time polynomial in $n$. That is not a small improvement; it moves factoring from "infeasible" to "feasible, given a large enough fault-tolerant machine". The same idea also solves the discrete logarithm problem, which breaks elliptic-curve cryptography too.

This lesson builds on phase estimation from the previous lesson (**qft-qpe**). If any step there felt hazy, revisit it first, because Shor's algorithm is phase estimation applied to a cleverly chosen unitary.`},{t:"md",text:w`## Step 1: factoring is really order finding

The surprising part is that the *quantum* computer is not asked to factor anything. It is asked a different question, and ordinary number theory does the rest.

Pick a number $a$ with $1<a<N$ and $\gcd(a,N)=1$. (If the gcd is bigger than 1 you have already found a factor, so you are done.) Consider the sequence

$$a^0,\ a^1,\ a^2,\ a^3,\ \dots \pmod N.$$

Because there are only finitely many residues, the sequence must repeat. The smallest $r>0$ with $a^r\equiv 1 \pmod N$ is called the **order** (or period) of $a$ modulo $N$.

### From the order to the factors

Suppose $r$ is **even**. Then $a^r-1\equiv 0 \pmod N$ can be factored as a difference of squares:

$$\big(a^{r/2}-1\big)\big(a^{r/2}+1\big)\equiv 0 \pmod N.$$

So $N$ divides the product, but $N$ does not divide $a^{r/2}-1$ (otherwise $r/2$ would be a smaller period). If also $a^{r/2}\not\equiv -1 \pmod N$, then $N$ does not divide $a^{r/2}+1$ either. Therefore $N$ must share a nontrivial factor with each of the two terms, and

$$\gcd\!\big(a^{r/2}-1,\,N\big)\quad\text{and}\quad\gcd\!\big(a^{r/2}+1,\,N\big)$$

are nontrivial factors of $N$. Computing a gcd is fast (Euclid's algorithm), so everything except finding $r$ is cheap.

### Worked example: N = 15, a = 7

Compute powers of 7 modulo 15:

$$7^1=7,\quad 7^2=49\equiv 4,\quad 7^3=28\equiv 13,\quad 7^4=91\equiv 1 \pmod{15}.$$

The sequence is $7,4,13,1,7,4,13,1,\dots$ so the order is $r=4$. It is even, and $a^{r/2}=7^2\equiv 4\not\equiv -1\equiv 14$. So the recipe applies:

$$\gcd(7^2-1,\,15)=\gcd(48,15)=3,\qquad \gcd(7^2+1,\,15)=\gcd(50,15)=5.$$

Indeed $15=3\times 5$.

### When does it fail?

Not every $a$ works. Try $a=4$: the sequence is $4,1$, so $r=2$, but $a^{r/2}=4$ gives $\gcd(3,15)=3$ and $\gcd(5,15)=5$, which does work here, while $a=14$ has $r=2$ and $14\equiv-1$, which fails. The two failure modes are an **odd** $r$, or $a^{r/2}\equiv-1$. For an odd $N$ with at least two distinct prime factors that is not a prime power, a random choice of $a$ succeeds with probability **at least $1/2$**. If you fail, pick another $a$; a handful of tries is enough.`},{t:"callout",kind:"note",title:"Where is the speedup?",text:w`Everything above is classical and fast except one step: finding the order $r$. Classically, finding $r$ seems as hard as factoring. Quantum mechanics enters only to find $r$, using interference over all exponents at once.`},{t:"widget",name:"shor",caption:"Run the N = 15 simulation with a = 7 and then try other values of a such as 2, 4, 8, 11, 13 and 14. For each, compare the period you read off with the table of powers by hand, and notice which choices of a fail (odd period, or a^(r/2) = -1) and which give the factors 3 and 5."},{t:"md",text:w`## Step 2: the quantum part

### The unitary whose phases hide r

Define the operation on an $n$-bit register

$$U_a\,\lvert y\rangle=\lvert ay \bmod N\rangle\qquad(0\le y<N),$$

and let it act as the identity if $y\ge N$. Since $\gcd(a,N)=1$, multiplication by $a$ just permutes the residues, so $U_a$ is a permutation matrix and therefore unitary.

Applying $U_a$ repeatedly from $\lvert 1\rangle$ gives $\lvert a^k \bmod N\rangle$, which cycles with period $r$. Define, for $s=0,1,\dots,r-1$,

$$\lvert u_s\rangle=\frac1{\sqrt r}\sum_{k=0}^{r-1}e^{-2\pi i sk/r}\,\lvert a^k \bmod N\rangle.$$

A short check shows $U_a\lvert u_s\rangle=e^{2\pi i s/r}\lvert u_s\rangle$: the eigenvalues are the $r$-th roots of unity, and their phases are $\varphi=s/r$. That is exactly the kind of thing phase estimation measures.

Better still, adding up all the eigenstates cancels every phase except $k=0$:

$$\frac1{\sqrt r}\sum_{s=0}^{r-1}\lvert u_s\rangle=\lvert 1\rangle.$$

We cannot prepare an individual $\lvert u_s\rangle$ without knowing $r$, but we can easily prepare $\lvert 1\rangle$. Feeding $\lvert 1\rangle$ into phase estimation is the same as feeding in a uniform superposition of the $\lvert u_s\rangle$, and the measurement returns an estimate of $s/r$ for a **random** $s$.

### The circuit

1. Prepare a $t$-qubit control register in $\lvert 0\rangle^{\otimes t}$ and apply Hadamards to get a uniform superposition over $x=0,\dots,2^t-1$.
2. Prepare the target register in $\lvert 1\rangle$.
3. For control qubit $j$, apply a **controlled** $U_a^{2^j}$. In practice $a^{2^j}\bmod N$ is computed classically, and each controlled operation is a controlled modular multiplication by that constant. Together these implement **modular exponentiation**, $\lvert x\rangle\lvert 1\rangle\to\lvert x\rangle\lvert a^x \bmod N\rangle$.
4. Apply the inverse quantum Fourier transform to the control register and measure it, obtaining an integer $y$.

Choose $t\approx 2n$ (so that $2^t\gtrsim N^2$). The result satisfies $y/2^t\approx s/r$ for a random $s$.`},{t:"widget",name:"qft-viz",caption:"Feed in a periodic input and watch the transform concentrate its weight on a few sharp peaks spaced by the number of samples divided by the period. Shor reads the period off those peaks. Try periods that divide the length exactly and then ones that do not, and see how the peaks smear."},{t:"md",text:w`## Step 3: reading r from the measurement

### Worked example: N = 15, a = 7, t = 8

Here $2^t=256$ and $r=4$, so the peaks are exact: $y/256=s/4$ for $s=0,1,2,3$. The four possible outcomes are $y\in\{0,64,128,192\}$, each with probability $1/4$.

- Suppose we measure $y=64$. Then $64/256=1/4$. In lowest terms the denominator is 4, so we guess $r=4$. Check: $7^4\equiv1 \pmod{15}$. Success.
- Suppose we measure $y=192$. Then $192/256=3/4$, denominator 4 again, so $r=4$.
- If we measure $y=128$, we get $1/2$ and the denominator 2 gives the candidate $r=2$. But $7^2\equiv 4\neq 1$, so the check fails. We rerun, or try multiples of the candidate: $2\times 2=4$ works.
- If we measure $y=0$, we learn nothing ($s=0$). Rerun.

So each run succeeds with probability about $1/2$ in this tiny case, and a few repetitions find $r$.

### The general case: continued fractions

For general $N$ the period $r$ rarely divides $2^t$, so $y/2^t$ is only *close* to $s/r$. With $t\approx2n$ bits we have

$$\Big|\frac{y}{2^t}-\frac sr\Big|\le\frac1{2^{t+1}}<\frac1{2r^2},$$

and a classical theorem says that any fraction this close to $y/2^t$ with denominator below $N$ must appear among the **continued fraction convergents** of $y/2^t$. We compute those convergents (a quick Euclid-like procedure), test each denominator as a candidate $r$ by checking $a^r\equiv 1 \pmod N$, and keep the first one that works. If $s$ and $r$ happen to share a factor we recover only a divisor of $r$; repeating the run, or combining results, fixes this.

### Common misconceptions

- **"A quantum computer tries all factors at once."** No. It does not test divisors in parallel and read out the winner. It builds a superposition whose *interference pattern* encodes a period, and a Fourier transform makes that pattern measurable. Measurement still gives a single random outcome.
- **"Shor's algorithm always works."** It is probabilistic. Both the choice of $a$ and the measurement can fail, but a success is easily verified by multiplying the factors, so you just repeat.
- **"The quantum computer does the whole job."** The quantum part only finds the period. Choosing $a$, continued fractions and the gcd are classical.`},{t:"callout",kind:"history",title:"Shor, 1994",text:w`Peter Shor announced the algorithm at a time when many physicists doubted that quantum computers would ever be useful. It converted the field from a curiosity into a funded research programme, and ultimately into the post-quantum cryptography effort that is under way today.`},{t:"md",text:w`## What it would take: resources

For an $n$-bit modulus the circuit needs a few $n$ **logical** qubits. Careful constructions use about $2n+3$ logical qubits (Beauregard's circuit), and with more modern tricks somewhat fewer or somewhat more depending on the time-space trade-off. The gate count with schoolbook arithmetic grows as $O(n^3)$, and asymptotically better multiplication brings it near $O(n^2\log n)$. For $n=2048$, this is billions of gates, none of which may fail.

Today's physical qubits make errors around $10^{-3}$ per operation, nowhere near good enough, so the algorithm must run on **error-corrected** logical qubits. Each logical qubit then costs hundreds to thousands of physical qubits. The influential 2019 estimate by Gidney and Ekera found that breaking RSA-2048 would need about **20 million** noisy physical qubits running for around **8 hours**, under assumptions such as a physical error rate of $10^{-3}$ and a particular surface-code architecture. Later work has pushed the estimate down, with Gidney reporting in 2025 a design with under a million noisy qubits running for under a week.

Treat all of these numbers as **estimates that keep changing**. They depend on assumed error rates, error-correction schemes, connectivity and speed, and algorithm improvements keep reducing them. The reliable conclusion is not any one figure but the direction: the requirement is large, yet no longer astronomically so.`},{t:"widget",name:"speedup-chart",caption:"Compare how the cost of factoring grows with the number of bits on a classical computer using the number field sieve versus Shor on a quantum computer. The classical curve climbs faster and faster, while the quantum curve stays polynomial. Remember that this plot ignores the large constant factor from error correction, which pushes the practical crossover far to the right."},{t:"callout",kind:"warn",title:"What has actually been demonstrated",text:w`Experiments have factored $15$ (first by NMR in 2001) and $21$ (with photons in 2012) and a few other tiny numbers on small machines. Some demonstrations used compiled shortcuts that quietly relied on knowing the answer, such as removing gates that only make sense once you know the period, so they did not run the full algorithm. Nobody has factored a number that a classical computer could not factor trivially. Treat the headlines accordingly.`},{t:"widget",name:"shor",caption:"Return to the simulator and focus on how the measured outcomes cluster. Run it many times for a = 7 and check that the observed outcomes land on 0, 64, 128 and 192 in roughly equal numbers, and that the continued-fraction step turns the good ones into r = 4."},{t:"md",text:w`## Impact: cryptography after Shor

### Post-quantum cryptography

Shor's algorithm breaks RSA, Diffie-Hellman and elliptic-curve cryptography, which together protect most key exchange and digital signatures on the internet. The response is **post-quantum cryptography**: classical algorithms, running on ordinary computers, based on problems with no known quantum shortcut such as lattice problems. In 2024 NIST published its first standards: **ML-KEM** (key encapsulation, FIPS 203), **ML-DSA** (signatures, FIPS 204) and **SLH-DSA** (hash-based signatures, FIPS 205). Migration is a large engineering effort, and it is under way now.

### Harvest now, decrypt later

An adversary does not need a quantum computer today. They can record encrypted traffic now and decrypt it later when a machine exists. Anything that must stay secret for decades, such as medical or state records, is therefore at risk *already*, which is why migration should start well before a working machine arrives. This idea comes back in the next lesson on quantum hardware and cryptography (**hardware-crypto**).

### What Shor does not break

- **Symmetric encryption** such as AES. The best known quantum attack is Grover search, which gives only a quadratic speedup: a $k$-bit key is searched in about $2^{k/2}$ steps. Moving to 256-bit keys restores comfortable security, and Grover's serial nature makes it even less practical than the raw count suggests.
- **Cryptographic hash functions** such as SHA-256, which are similarly affected only by generic square-root-type speedups.
- **Everything else you do on a computer.** Shor is no general-purpose speedup. It exploits the special periodic structure of modular exponentiation.`},{t:"callout",kind:"tip",title:"Try it yourself",text:w`Pick $N=21$ and $a=2$. Write the powers of 2 modulo 21 until you return to 1, read off $r$, and compute the two gcds by hand. Then check your factors.`}],quiz:[{q:"For N = 15 and a = 7 the order is r = 4. What factors does the classical post-processing produce?",options:["gcd(48,15)=3 and gcd(50,15)=5","gcd(7,15)=1 and gcd(4,15)=1","gcd(7^4,15)=1 and gcd(7^4+1,15)=2","It produces no factors because r is even"],answer:0,explain:"With r = 4 we use a^(r/2) = 7^2 = 49. Then gcd(49-1, 15) = gcd(48,15) = 3 and gcd(49+1, 15) = gcd(50,15) = 5. An even r is exactly what the method needs, and 49 is congruent to 4, not to -1 mod 15."},{q:"Which statement best describes the role of the quantum computer in Shor's algorithm?",options:["It tests every possible divisor in parallel","It finds the period of a^x mod N using phase estimation, and the factors follow classically","It computes the gcd faster than Euclid's algorithm","It stores the whole sequence of powers of a in one qubit"],answer:1,explain:"Only the order-finding step is quantum. Interference during phase estimation concentrates probability near multiples of 2^t/r. Choosing a, running continued fractions and taking gcds are all fast classical steps."},{q:"In the N = 15, a = 7, t = 8 example, you measure y = 192. What is the recovered period?",options:["r = 2","r = 3","r = 4","r = 192"],answer:2,explain:"192/256 reduces to 3/4, whose denominator is 4. A check confirms 7^4 = 1 mod 15, so r = 4. The numerator 3 is the random value of s, which is not needed."},{q:"Why is preparing the target register in |1> enough for phase estimation of U_a?",options:["|1> is an eigenstate of U_a with eigenvalue 1","|1> is an equal-weight superposition of the eigenstates |u_s>, so the measurement returns s/r for a random s","Because U_a leaves |1> unchanged","Because the QFT removes the need for eigenstates"],answer:1,explain:"The eigenstates |u_s> depend on r, which we do not know, so we cannot prepare them. But their uniform sum is |1>, so phase estimation yields a random phase s/r. U_a does not leave |1> unchanged, since it sends it to |a mod N>."},{q:"Which of these is NOT broken by Shor's algorithm?",options:["RSA-2048 key exchange","Elliptic-curve signatures","AES-256 encryption (attacked only by Grover, roughly a square-root speedup)","Diffie-Hellman over a prime field"],answer:2,explain:"Shor solves factoring and discrete logarithms, which covers RSA, Diffie-Hellman and elliptic curves. AES has no such algebraic structure to exploit; Grover search only halves the effective key length in bits, so 256-bit keys remain secure."}],takeaways:["RSA is secure only because factoring is believed hard; the best classical algorithm (number field sieve) is sub-exponential, Shor is polynomial.","Factoring reduces to order finding: if r is even and a^(r/2) is not -1 mod N, then gcd(a^(r/2) +/- 1, N) gives factors, and a random a works with probability at least 1/2.","The quantum step is phase estimation of the modular multiplication unitary U_a, with eigenphases s/r; continued fractions turn the measured y/2^t into r.","A cryptographically relevant run needs error-corrected hardware; published estimates (about 20 million noisy qubits in 2019, below a million in 2025) keep changing, while demonstrations so far remain tiny.","Post-quantum standards (ML-KEM, ML-DSA, SLH-DSA) answer Shor and the harvest-now-decrypt-later threat, while symmetric crypto and hashes are only weakened quadratically."]},Pe=Object.freeze(Object.defineProperty({__proto__:null,lesson:Ce},Symbol.toStringTag,{value:"Module"})),ze=t=>"```python\n"+t+"\n```",je={id:"single-gates",order:6,part:"The Qubit",title:"Single-Qubit Gates",summary:"Every operation on one qubit is a rotation of the Bloch sphere; learn the alphabet of X, Y, Z, H, S, T and the rotation gates that generate them.",minutes:30,objectives:["You can write down the matrices of X, Y, Z, H, S, T and their inverses and say what each does to the Bloch sphere.","You can build the rotation gates Rx, Ry, Rz from the formula exp(-i θ σ / 2) and apply them to a state by hand.","You can explain why every single-qubit unitary is a rotation (up to global phase) and decompose one with the Z-Y-Z Euler form U(θ, φ, λ).","You can prove simple gate identities such as HZH = X and tell a global phase from a relative phase."],blocks:[{t:"md",text:String.raw`## Gates are rotations you can steer

In [The Qubit & the Bloch Sphere] you learned that a pure qubit state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$ is a point on a sphere. In the Matrices, Unitaries & Tensor Products lesson you learned that the only reversible, probability-preserving operations on a vector are **unitary matrices**: $U^\dagger U = I$. This lesson joins the two ideas.

A **quantum gate** on one qubit is a $2\times 2$ unitary matrix $U$. It sends $|\psi\rangle \mapsto U|\psi\rangle$, and because $U$ preserves the length of the vector, the output is again a valid qubit state. The geometric payoff is simple and worth stating up front:

> Every single-qubit gate, up to an unobservable global phase, is a **rotation of the Bloch sphere** about some axis by some angle.

That is why single-qubit gates are easy to visualise and why they are so well behaved. The two-qubit story in the next lessons is where the real complexity (and power) arrives, but you cannot read a circuit diagram without fluency here.

### The Pauli gates

Three gates, named after Wolfgang Pauli, are the foundation. In the computational basis:

$$X = \begin{pmatrix} 0 & 1 \\ 1 & 0 \end{pmatrix},\quad Y = \begin{pmatrix} 0 & -i \\ i & 0 \end{pmatrix},\quad Z = \begin{pmatrix} 1 & 0 \\ 0 & -1 \end{pmatrix}.$$

- **X** is the quantum NOT: $X|0\rangle = |1\rangle$, $X|1\rangle = |0\rangle$. On the sphere it is a rotation by $\pi$ about the $x$-axis.
- **Z** leaves $|0\rangle$ alone and multiplies $|1\rangle$ by $-1$: $Z(\alpha|0\rangle+\beta|1\rangle)=\alpha|0\rangle-\beta|1\rangle$. It is a rotation by $\pi$ about the $z$-axis, so it swaps $|+\rangle \leftrightarrow |-\rangle$. It is called the **phase flip**.
- **Y** $= iXZ$ combines both: $Y|0\rangle = i|1\rangle$, $Y|1\rangle=-i|0\rangle$. A rotation by $\pi$ about the $y$-axis.

They square to the identity ($X^2=Y^2=Z^2=I$), they **anticommute** ($XZ=-ZX$ and so on), and they obey the cyclic rule $XY = iZ,\; YZ = iX,\; ZX = iY$. Every $2\times2$ matrix can be written $aI + bX + cY + dZ$, which is why the Paulis double as a basis for operators, observables, and (in the Measurement lesson) density matrices.`},{t:"widget",name:"gate-explorer",caption:'Select X, then Y, then Z. For each, read the matrix, confirm the "unitary" check passes, and watch the animated rotation: the axis is the Pauli letter and the angle is 180 degrees. Then select H and note that its axis is tilted halfway between x and z.'},{t:"md",text:String.raw`## Hadamard, phase and T

The **Hadamard gate** is the workhorse that turns classical-looking basis states into superpositions:

$$H = \frac{1}{\sqrt 2}\begin{pmatrix} 1 & 1 \\ 1 & -1 \end{pmatrix},\qquad H|0\rangle = |+\rangle = \tfrac{|0\rangle+|1\rangle}{\sqrt2},\quad H|1\rangle = |-\rangle = \tfrac{|0\rangle-|1\rangle}{\sqrt2}.$$

It is its own inverse ($H^2=I$) and it swaps the roles of the $z$ and $x$ axes: it is a rotation by $\pi$ about the axis $(\hat x+\hat z)/\sqrt2$. Because it interchanges the $Z$ and $X$ bases, it conjugates one Pauli into the other:

$$HZH = X,\qquad HXH = Z,\qquad HYH = -Y.$$

**Proof of HZH = X.** Compute $ZH = \tfrac1{\sqrt2}\begin{pmatrix}1&1\\-1&1\end{pmatrix}$ and then $H(ZH) = \tfrac12\begin{pmatrix}1&1\\1&-1\end{pmatrix}\begin{pmatrix}1&1\\-1&1\end{pmatrix}= \tfrac12\begin{pmatrix}0&2\\2&0\end{pmatrix}=X$. Intuitively: "change to the $X$ basis, flip the phase, change back" is the same as bit-flipping.

### Phase gates S and T

The **phase gates** are diagonal. They leave $|0\rangle$ alone and add a phase to $|1\rangle$:

$$S=\begin{pmatrix}1&0\\0&i\end{pmatrix},\qquad T=\begin{pmatrix}1&0\\0&e^{i\pi/4}\end{pmatrix},\qquad P(\varphi)=\begin{pmatrix}1&0\\0&e^{i\varphi}\end{pmatrix}.$$

They are rotations about the $z$-axis by $\pi/2$ ($S$) and $\pi/4$ ($T$), related by $T^2=S$, $S^2=Z$. Their inverses $S^\dagger = \mathrm{diag}(1,-i)$ and $T^\dagger=\mathrm{diag}(1,e^{-i\pi/4})$ rotate the other way. Apply $S$ to $|+\rangle$ and you get $\tfrac{1}{\sqrt2}(|0\rangle + i|1\rangle)=|{+i}\rangle$, a quarter-turn around the equator from $|+\rangle$ to $|{+i}\rangle$.

Another useful identity: $S X S^\dagger = Y$, so $S$ turns the $X$ axis into the $Y$ axis. Together, $H$ and $S$ can reach the six "cardinal" states $|0\rangle,|1\rangle,|\pm\rangle,|\pm i\rangle$ from $|0\rangle$. The $T$ gate looks like a minor tweak, but it is special: in the Circuit Model lesson you will see that adding $T$ to $H$, $S$ and CNOT is what lifts a classically simulable gate family to universal quantum computation.

The **square root of X**, $\sqrt X = \tfrac12\begin{pmatrix}1+i&1-i\\1-i&1+i\end{pmatrix}$, satisfies $(\sqrt X)^2=X$; it is a quarter-turn about $x$ (up to phase) and is a native gate on several superconducting devices.`},{t:"widget",name:"bloch",props:{start:"zero",tools:["gates","measure"]},caption:"Start at |0>. Press H, then S, then H again, and read the Bloch vector after each step. Predict first: S moves |+> to |+i> (a quarter turn on the equator), and H then maps |+i> to a state on the y-z plane. Then try T, T, T, T and confirm four T gates equal Z."},{t:"md",text:String.raw`## Rotation gates: the continuous family

The discrete gates above are special points of three continuous families. For a unit axis $\hat n=(n_x,n_y,n_z)$ and angle $\theta$, the **rotation gate** is

$$R_{\hat n}(\theta) = e^{-i\theta\,\hat n\cdot\vec\sigma/2} = \cos\tfrac\theta2\, I - i\sin\tfrac\theta2\,(n_xX+n_yY+n_zZ),$$

where $\vec\sigma=(X,Y,Z)$. The second equality holds because $(\hat n\cdot\vec\sigma)^2=I$, exactly as $e^{i\phi}=\cos\phi+i\sin\phi$ works for a quantity that squares to $-1$. For the three coordinate axes:

$$R_x(\theta)=\begin{pmatrix}\cos\frac\theta2&-i\sin\frac\theta2\\-i\sin\frac\theta2&\cos\frac\theta2\end{pmatrix},\quad R_y(\theta)=\begin{pmatrix}\cos\frac\theta2&-\sin\frac\theta2\\\sin\frac\theta2&\cos\frac\theta2\end{pmatrix},\quad R_z(\theta)=\begin{pmatrix}e^{-i\theta/2}&0\\0&e^{i\theta/2}\end{pmatrix}.$$

**Why the half-angle?** The state vector turns by $\theta/2$ while the Bloch vector turns by $\theta$, because the Bloch sphere uses *doubled* angles (recall $|\psi\rangle=\cos\frac\vartheta2|0\rangle+e^{i\varphi}\sin\frac\vartheta2|1\rangle$). A side effect: $R_x(2\pi)=-I$. A full $360^\circ$ rotation multiplies the state by $-1$, which is a global phase and therefore invisible, but this is the same sign that distinguishes spin-1/2 particles in physics.

**Worked example.** Apply $R_y(\pi/2)$ to $|0\rangle$:

$$R_y(\tfrac\pi2)|0\rangle=\begin{pmatrix}\cos\frac\pi4\\\sin\frac\pi4\end{pmatrix}=\tfrac1{\sqrt2}\begin{pmatrix}1\\1\end{pmatrix}=|+\rangle.$$

The north pole rotates $90^\circ$ about $y$ and lands on $+x$. The same call with $\theta=\pi$ gives $R_y(\pi)|0\rangle=|1\rangle$, and indeed $R_y(\pi)=-iY$: the Pauli gates are $\pi$ rotations *up to a global phase* (factor $-i$). Likewise $S$ and $R_z(\pi/2)$ differ only by the phase $e^{i\pi/4}$, and in general $P(\varphi)=e^{i\varphi/2}R_z(\varphi)$.`},{t:"callout",kind:"math",title:"Global phase versus relative phase",text:String.raw`Multiplying the whole state by $e^{i\gamma}$ changes nothing observable: every probability $|\langle m|\psi\rangle|^2$ is unchanged, and so is the Bloch vector. So $U$ and $e^{i\gamma}U$ are physically the same gate, and we write "$=$" loosely (or "$\simeq$"). A **relative** phase between $|0\rangle$ and $|1\rangle$ is different: $|+\rangle$ and $|-\rangle$ differ only by one relative sign, yet they are perfectly distinguishable by measuring in the $X$ basis. Rule of thumb: if the phase can be pulled out of *every* amplitude, it is global; if it multiplies only some terms, it is relative and it matters. Global phase becomes physically relevant only when the gate is *controlled* (next lesson), because then it turns into a relative phase between control branches.`},{t:"md",text:String.raw`## Any single-qubit gate is a rotation

Here is the central structural fact. Any $2\times2$ unitary can be written

$$U = e^{i\gamma}\,R_{\hat n}(\alpha) = e^{i\gamma}\left(\cos\tfrac\alpha2\,I - i\sin\tfrac\alpha2\,\hat n\cdot\vec\sigma\right)$$

for some real $\gamma$, angle $\alpha$ and axis $\hat n$. The reason is dimension counting: a $2\times 2$ unitary has four real parameters; one is the global phase $\gamma$, leaving three, which is exactly the number needed to specify an axis (two numbers) and an angle (one). Mathematicians say $SU(2)$ maps onto the rotation group $SO(3)$ two-to-one.

Consequently, to fully control one qubit you only need rotations about two perpendicular axes. The **Euler decomposition** says every rotation is a product of three rotations about alternating axes, here $z$-$y$-$z$:

$$U = e^{i\gamma}\,R_z(\varphi)\,R_y(\theta)\,R_z(\lambda).$$

Hardware and software typically bundle this into the general gate, which Qiskit calls $U(\theta,\varphi,\lambda)$:

$$U(\theta,\varphi,\lambda)=\begin{pmatrix}\cos\frac\theta2&-e^{i\lambda}\sin\frac\theta2\\e^{i\varphi}\sin\frac\theta2&e^{i(\varphi+\lambda)}\cos\frac\theta2\end{pmatrix}=e^{i(\varphi+\lambda)/2}R_z(\varphi)R_y(\theta)R_z(\lambda).$$

You can verify the equality by multiplying the three matrices: the top-left entry is $e^{-i(\varphi+\lambda)/2}\cos\frac\theta2$, and multiplying by the global phase $e^{i(\varphi+\lambda)/2}$ leaves $\cos\frac\theta2$. A few special cases: $U(\pi/2,0,\pi)=H$, $U(\pi,0,\pi)=X$, $U(0,0,\lambda)=P(\lambda)$.

How to read $U(\theta,\varphi,\lambda)$ geometrically (rightmost acts first): $R_z(\lambda)$ spins the state about the pole, $R_y(\theta)$ tips it down by $\theta$ from the north pole, and $R_z(\varphi)$ spins it again. Starting from $|0\rangle$ the first spin does nothing, so $U|0\rangle$ lands at polar angle $\theta$ and azimuth $\varphi$: that is why the three-angle parametrisation covers every point of the sphere.`},{t:"md",text:String.raw`### The same ideas in code

The following NumPy snippet builds the gates, checks unitarity, verifies $HZH=X$, and checks the Euler form numerically up to global phase.

`+ze(`import numpy as np

X = np.array([[0, 1], [1, 0]], dtype=complex)
Z = np.array([[1, 0], [0, -1]], dtype=complex)
H = np.array([[1, 1], [1, -1]], dtype=complex) / np.sqrt(2)

def Ry(t): return np.array([[np.cos(t/2), -np.sin(t/2)], [np.sin(t/2), np.cos(t/2)]], dtype=complex)
def Rz(t): return np.diag([np.exp(-1j*t/2), np.exp(1j*t/2)])

def U(theta, phi, lam):
    return np.array([[np.cos(theta/2), -np.exp(1j*lam)*np.sin(theta/2)],
                     [np.exp(1j*phi)*np.sin(theta/2), np.exp(1j*(phi+lam))*np.cos(theta/2)]])

print(np.allclose(H @ Z @ H, X))                  # True
print(np.allclose(H.conj().T @ H, np.eye(2)))      # unitary: True
t, p, l = 0.7, 1.2, -0.4
euler = np.exp(1j*(p+l)/2) * Rz(p) @ Ry(t) @ Rz(l)
print(np.allclose(euler, U(t, p, l)))              # True
print(Ry(np.pi/2) @ np.array([1, 0]))              # [0.707, 0.707] = |+>`)+`

`+String.raw`In Qiskit the same gates are \`h\`, \`s\`, \`t\`, \`rx\`, \`ry\`, \`rz\` and \`u\` on a \`QuantumCircuit\`; for one qubit there are no ordering subtleties (the little-endian issue appears with several qubits, in the next lesson).`.replace(/\\`/g,"`")},{t:"widget",name:"bloch-challenge",caption:"Solve a few puzzles. Strategy: work backwards from the target. Any target on the equator is reachable with H then a phase gate (S, T or a rotation about z); a state on the y-z plane often needs an Rx. Try to beat the par gate count; note that Z-rotations never move you off a latitude line, so you need an X- or Y-type gate to change latitude."},{t:"md",text:String.raw`## Building a toolkit and reading gate sequences

Because gates are matrices, a sequence of gates is a **product of matrices**, with the *last* gate on the *left*. The circuit "apply $H$, then $S$, then $H$" is the matrix $HSH$. This order reversal trips up almost every beginner, so memorise it: circuits read left to right, matrices multiply right to left.

Some identities worth keeping in your head (all follow from rotation geometry or direct multiplication):

| Identity | Meaning |
|---|---|
| $X^2=Y^2=Z^2=H^2=I$ | self-inverse gates |
| $XY=iZ$, $YZ=iX$, $ZX=iY$ | Pauli algebra |
| $HZH=X$, $HXH=Z$, $HYH=-Y$ | $H$ swaps the $x$ and $z$ axes |
| $SXS^\dagger=Y$ | $S$ turns the $x$ axis into $y$ |
| $T^2=S$, $S^2=Z$ | phase gates are fractions of $Z$ |
| $R_n(\alpha)R_n(\beta)=R_n(\alpha+\beta)$ | same-axis rotations add |
| $HSH = e^{i\pi/4}\,R_x(\pi/2)$ | conjugating a $z$ rotation by $H$ gives an $x$ rotation |

The last two rows illustrate a general principle: if $V$ is any unitary, then $V R_{\hat n}(\theta) V^\dagger = R_{\hat n'}(\theta)$ where $\hat n'$ is $\hat n$ rotated by $V$. Conjugation changes the axis but not the angle. Compilers exploit this constantly.

### Common misconceptions

- **"Gates are measurements."** No. A gate is reversible: you can always undo it with $U^\dagger$. Measurement is not (see the Measurement lesson).
- **"Z does nothing because it only changes a sign."** On $|0\rangle$ it indeed does nothing observable, but on $|+\rangle$ it produces $|-\rangle$, a different, distinguishable state. Phase is a real physical resource; interference algorithms are built on it.
- **"The Bloch sphere rotates the state by half the angle."** It is the other way round: the sphere rotation is $\theta$, the amplitude angle is $\theta/2$.

Finish by experimenting freely in the composer. A single-qubit circuit is just a sequence of rotations, and the final readout shows the same probabilities you can predict from the Bloch vector.`},{t:"widget",name:"composer",props:{preset:"blank",qubits:1},caption:"Place H, then T, then H on the single wire and look at the output probabilities. Predict P(1) = sin^2(pi/8), about 0.146: HTH is a rotation by pi/4 about x, so |0> is tipped 45 degrees. Now replace T with S and Z in turn and watch P(1) grow to 0.5 and 1."}],quiz:[{q:String.raw`Which description of the gate $Z$ on the Bloch sphere is correct?`,options:["A rotation by 180 degrees about the z-axis, which leaves |0> and |1> fixed but swaps |+> and |->","A rotation by 180 degrees about the x-axis, which swaps |0> and |1>","A reflection through the equator, which maps |0> to |1>","A rotation by 90 degrees about the z-axis"],answer:0,explain:String.raw`$Z=\mathrm{diag}(1,-1)$ fixes the poles and sends $|+\rangle\to|-\rangle$; that is a half-turn about $z$ (up to the global phase $i$). The half-turn about $x$ is $X$, and the quarter-turn about $z$ is $S$.`},{q:String.raw`What is $H\,X\,H$?`,options:[String.raw`$Z$`,String.raw`$X$`,String.raw`$-Z$`,String.raw`$Y$`],answer:0,explain:String.raw`$H$ exchanges the $x$ and $z$ axes, so conjugating $X$ by $H$ gives $Z$ (and $HZH=X$). Check by multiplication: $H X H=\tfrac12\begin{pmatrix}1&1\\1&-1\end{pmatrix}\begin{pmatrix}1&-1\\1&1\end{pmatrix}\cdot$ evaluates to $\mathrm{diag}(1,-1)=Z$. Only $HYH$ picks up a minus sign.`},{q:String.raw`A circuit applies $H$, then $S$, then $H$ to $|0\rangle$. Which matrix describes the whole circuit?`,options:[String.raw`$HSH$ (last gate on the left; here it happens to be symmetric)`,String.raw`$SHS$`,String.raw`$H+S+H$`,String.raw`$HHS$`],answer:0,explain:String.raw`Gates multiply as matrices in reverse order of application. Applying $H$, $S$, $H$ gives $H\cdot S\cdot H$ acting on the state. Sums of matrices are not unitary in general, and $HHS=S$ would skip two of the operations' effects.`},{q:String.raw`Why is $R_z(2\pi)=-I$ not a problem for a physical qubit?`,options:["Because -I is a global phase, which changes no measurement probability","Because rotation angles are only defined modulo pi","Because R_z(2 pi) is not unitary","Because the Bloch vector is flipped, but this is corrected by the next gate"],answer:0,explain:String.raw`$-I$ multiplies every amplitude by $-1$, so all probabilities and the Bloch vector are unchanged. The Bloch vector returns exactly to where it started after a $2\pi$ rotation; only the (unobservable) overall sign of the state vector differs.`},{q:String.raw`Why do three real parameters suffice to describe any single-qubit gate up to global phase?`,options:["A 2x2 unitary has 4 real parameters; removing the global phase leaves 3, which is the number of parameters of a 3D rotation (axis plus angle)","Because there are only three Pauli matrices, so only three gates exist","Because the Bloch sphere has three coordinates x, y, z, so each gate sets one coordinate","Because every gate can be written as a product of exactly three H gates"],answer:0,explain:String.raw`Dimension counting plus the $SU(2)\to SO(3)$ correspondence: any unitary is $e^{i\gamma}R_{\hat n}(\alpha)$, and a rotation has two parameters for the axis and one for the angle. Equivalently, $R_z(\varphi)R_y(\theta)R_z(\lambda)$ has exactly three angles.`}],takeaways:["A single-qubit gate is a 2x2 unitary; up to global phase it is a rotation of the Bloch sphere.","X, Y, Z are half-turns about their axes; H swaps the x and z axes; S and T are z-rotations by 90 and 45 degrees.","R_n(theta) = exp(-i theta n.sigma / 2); the state turns by theta/2 while the Bloch vector turns by theta.","Every single-qubit gate decomposes as Rz(phi) Ry(theta) Rz(lambda) times a global phase, i.e. U(theta, phi, lambda).","Circuits read left to right, but their matrices multiply right to left; global phase is invisible, relative phase is not."]},Qe=Object.freeze(Object.defineProperty({__proto__:null,lesson:je},Symbol.toStringTag,{value:"Module"})),X="```",Ze={id:"teleportation",order:11,part:"Circuits & Algorithms",title:"Quantum Teleportation and Superdense Coding",summary:"Move an unknown qubit state between two places using one shared Bell pair and two classical bits, and learn why nothing travels faster than light.",minutes:25,objectives:["You can state the teleportation protocol and say what each of the three qubits does at every step.","You can derive, by hand, that Bob's qubit ends up as X^{m1} Z^{m0} applied to the original state, and why the corrections undo it.","You can explain why teleportation needs classical communication and therefore cannot signal faster than light.","You can account for the resources used by teleportation and by its dual, superdense coding.","You can describe entanglement swapping and why it is the building block of quantum repeaters."],blocks:[{t:"md",text:String.raw`## The problem: moving a state you cannot read

Suppose Alice holds a qubit in an unknown state $|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$, with complex amplitudes satisfying $|\alpha|^2+|\beta|^2=1$. She wants Bob, far away, to end up holding a qubit in exactly that state. Three obvious strategies all fail:

- **Copy it and send the copy.** The no-cloning theorem forbids a device that copies an arbitrary unknown state.
- **Measure it and send the result.** A single measurement returns one classical bit and destroys the superposition. From one bit you cannot reconstruct two continuous parameters ($\alpha$ and $\beta$, equivalently a point on the Bloch sphere).
- **Physically ship the qubit.** Possible in principle, but the qubit may be fragile and the channel noisy.

Teleportation (Bennett, Brassard, Crépeau, Jozsa, Peres and Wootters, 1993) is a fourth option. It uses a pre-shared entangled pair plus two ordinary classical bits. The qubit itself never crosses the gap. What crosses is classical information, and the state is *reassembled* at Bob's end while being *destroyed* at Alice's end, which is consistent with no-cloning.

### The cast

We use three qubits, written in big-endian order $|q_0 q_1 q_2\rangle$:

| Qubit | Held by | Role |
|---|---|---|
| $q_0$ | Alice | the unknown state $|\psi\rangle$ to be sent |
| $q_1$ | Alice | her half of a Bell pair |
| $q_2$ | Bob | his half of the same Bell pair |

The Bell pair is $|\Phi^+\rangle = (|00\rangle + |11\rangle)/\sqrt{2}$ on $q_1 q_2$. It was created earlier, when the two parties were together or by a source in the middle, and then separated.

The whole protocol is: (1) Alice entangles $q_0$ with $q_1$ using a CNOT and a Hadamard, which amounts to a **Bell-basis measurement**; (2) she measures both qubits and gets two classical bits $m_0 m_1$; (3) she sends those bits to Bob; (4) Bob applies a correction chosen by the bits. The next section shows that the algebra makes this work.`},{t:"md",text:String.raw`## The algebra, step by step

**Initial state.** The product of $|\psi\rangle$ and the Bell pair is

$$|\Psi_0\rangle = \frac{1}{\sqrt2}\big(\alpha|000\rangle + \alpha|011\rangle + \beta|100\rangle + \beta|111\rangle\big).$$

**Step 1: CNOT with control $q_0$ and target $q_1$.** It flips the second bit whenever the first is 1, so $|100\rangle\to|110\rangle$ and $|111\rangle\to|101\rangle$:

$$|\Psi_1\rangle = \frac{1}{\sqrt2}\big(\alpha|000\rangle + \alpha|011\rangle + \beta|110\rangle + \beta|101\rangle\big).$$

**Step 2: Hadamard on $q_0$.** Using $H|0\rangle=(|0\rangle+|1\rangle)/\sqrt2$ and $H|1\rangle=(|0\rangle-|1\rangle)/\sqrt2$, a factor $1/\sqrt2$ is picked up and the state becomes

$$|\Psi_2\rangle = \tfrac12\Big[\alpha(|0\rangle+|1\rangle)|00\rangle + \alpha(|0\rangle+|1\rangle)|11\rangle + \beta(|0\rangle-|1\rangle)|10\rangle + \beta(|0\rangle-|1\rangle)|01\rangle\Big].$$

**Step 3: regroup by Alice's two qubits.** Collect all terms sharing the same $q_0q_1$ value (the last ket is $q_2$):

- $q_0q_1 = 00$: $\alpha|0\rangle + \beta|1\rangle = |\psi\rangle$
- $q_0q_1 = 01$: $\alpha|1\rangle + \beta|0\rangle = X|\psi\rangle$
- $q_0q_1 = 10$: $\alpha|0\rangle - \beta|1\rangle = Z|\psi\rangle$
- $q_0q_1 = 11$: $\alpha|1\rangle - \beta|0\rangle = XZ|\psi\rangle$

so that

$$|\Psi_2\rangle = \tfrac12\Big[|00\rangle|\psi\rangle + |01\rangle X|\psi\rangle + |10\rangle Z|\psi\rangle + |11\rangle XZ|\psi\rangle\Big] = \tfrac12\sum_{m_0,m_1}|m_0 m_1\rangle\, X^{m_1}Z^{m_0}|\psi\rangle .$$

This single line is the heart of the protocol. Every one of Alice's four outcomes has probability $|1/2|^2 = 1/4$, **independent of $\alpha,\beta$**. Bob's qubit, conditioned on her outcome, holds $|\psi\rangle$ up to a known Pauli.

**Step 4: measure and correct.** Alice measures $q_0$ and $q_1$ in the computational basis, obtaining $m_0$ and $m_1$, and tells Bob. Bob applies $X^{m_1}$ and then $Z^{m_0}$ (both are self-inverse and $ZX$ undoes $XZ$ up to a global phase $-1$), finishing with exactly $\alpha|0\rangle+\beta|1\rangle$.

### Deferred measurement version

In a circuit that must run on a simulator without mid-circuit measurement, we replace "measure, then classically controlled correction" by **quantum-controlled** corrections: a CNOT from $q_1$ to $q_2$ (the $X^{m_1}$ fix) and a CZ from $q_0$ to $q_2$ (the $Z^{m_0}$ fix). By the principle of deferred measurement the statistics are the same, and at the end $q_2$ is in state $|\psi\rangle$ with $q_0,q_1$ in a uniformly random product of $|0\rangle,|1\rangle$ (after measuring them, if you wish). That is the version in the composer below.`},{t:"widget",name:"composer",props:{preset:"teleport"},caption:"Run the teleport preset. Look at the final state of qubit 2 (the last one): it should carry the same Bloch vector you prepared on qubit 0 at the start. Then change the initial rotation on qubit 0 to a different angle and confirm that q2 still matches. Qubits 0 and 1 end up uncorrelated with the message."},{t:"callout",kind:"warn",title:'Common misconception: "teleportation is faster than light"',text:String.raw`Before Alice's classical message arrives, Bob's qubit is in the state $\tfrac12 I$ (the maximally mixed state). To see this, average over Alice's four equally likely outcomes: the mixture of $|\psi\rangle$, $X|\psi\rangle$, $Z|\psi\rangle$ and $XZ|\psi\rangle$ is exactly $I/2$ for every $|\psi\rangle$. Bob's local statistics therefore contain **no information** about $\alpha,\beta$ until the two classical bits arrive, and those travel at or below the speed of light. The entanglement is a resource, not a message channel.`},{t:"md",text:String.raw`## Why classical bits are unavoidable, and what is being spent

It is worth being precise about three facts.

**1. The state is destroyed at the sender.** After Alice's measurement, $q_0$ and $q_1$ are in a definite basis state. No copy of $|\psi\rangle$ remains with her, so no-cloning is respected. "Teleportation" is move, not copy.

**2. Two classical bits are necessary.** If Bob could recover $|\psi\rangle$ with no communication, then Alice's choice of $|\psi\rangle$ would instantly influence Bob's reduced state, which would allow signalling and violate relativity (and, quantum mechanically, the no-communication theorem). The four possible Pauli errors on Bob's side are only distinguishable by Alice's two bits. Conversely, two bits are *sufficient*, which is notable: a point on the Bloch sphere takes infinitely many bits to specify exactly, yet two bits plus a Bell pair suffice to move it.

**3. Resource accounting.**

| Resource | Teleportation of 1 qubit |
|---|---|
| Entanglement | 1 Bell pair (1 "ebit"), consumed |
| Classical communication | 2 bits, Alice to Bob |
| Local operations | 1 CNOT, 1 Hadamard, 2 measurements, up to 2 Pauli gates |
| Quantum channel | none during the protocol |

Teleporting a state does not require knowing it, so it can be used to move half of an entangled pair, a qubit that is part of a larger computation, or a state that is itself unknown to everyone. In fault-tolerant architectures teleportation is also the mechanism behind **gate teleportation**: certain hard gates (such as the $T$ gate) are applied by consuming a specially prepared resource state and then performing a Pauli-type correction.

### Entanglement swapping and repeaters

Teleportation works for any qubit, including one that is itself half of an entangled pair. Suppose Alice-Bob share a pair $A_1 B_1$ and Bob-Carol share a pair $B_2 C_1$. If Bob performs a **Bell measurement** on $B_1B_2$ and tells Alice and Carol the result, then $A_1$ and $C_1$ become entangled even though they never interacted. This is *entanglement swapping*. In **quantum repeaters**, short links of low loss are entangled first and then swapped to build a long-distance Bell pair, avoiding the exponential photon loss of a single long fibre. Together with purification and error correction, this is the plan for a quantum internet.`},{t:"md",text:String.raw`## Superdense coding: the dual protocol

Teleportation turns **one shared ebit + 2 classical bits** into **1 qubit** sent. Superdense coding (Bennett and Wiesner, 1992) does the opposite: **one shared ebit + 1 qubit sent** conveys **2 classical bits**.

**Setup.** Alice and Bob share $|\Phi^+\rangle = (|00\rangle+|11\rangle)/\sqrt2$; Alice holds the first qubit.

**Encoding.** To send two bits $ab$, Alice applies a Pauli to her qubit only:

| Bits $ab$ | Alice applies | Resulting joint state |
|---|---|---|
| 00 | $I$ | $(|00\rangle+|11\rangle)/\sqrt2$ |
| 01 | $X$ | $(|10\rangle+|01\rangle)/\sqrt2$ |
| 10 | $Z$ | $(|00\rangle-|11\rangle)/\sqrt2$ |
| 11 | $ZX$ | $(|01\rangle-|10\rangle)/\sqrt2$ |

These are the four Bell states, which are mutually orthogonal, hence perfectly distinguishable. Alice sends her qubit to Bob.

**Decoding.** Bob applies CNOT (control = Alice's qubit, target = his) followed by $H$ on the first qubit. Check the case $ab=01$: the state $(|10\rangle+|01\rangle)/\sqrt2$ maps under CNOT to $(|11\rangle+|01\rangle)/\sqrt2 = \frac{|0\rangle+|1\rangle}{\sqrt2}|1\rangle$, and $H$ then gives $|01\rangle$. In general Bob reads out exactly $|ab\rangle$.

**Honesty check.** This does not beat Holevo's bound: a single qubit *alone* can carry at most one classical bit. The extra bit is paid for by the pre-shared ebit, which had to be distributed earlier (using a qubit's worth of transmission). Total qubits transmitted over the whole process is still one per two bits only if the entanglement is counted as pre-existing infrastructure. The protocol is nevertheless a clean demonstration that entanglement is a communication resource, and teleportation and superdense coding are two sides of a single inequality: 1 ebit $\simeq$ 1 qubit $-$ 2 cbits and the converse.`},{t:"widget",name:"composer",props:{preset:"superdense"},caption:"Open the superdense preset. Alice's encoding gate(s) sit between the Bell-pair creation and the decoding CNOT+H. Try deleting them (message 00), then add X (01), Z (10), or both (11). In each case the measured result should be deterministic and equal the message bits."},{t:"md",text:String.raw`## Writing it in code, and what to remember

Here is the deferred-measurement teleportation circuit in Qiskit. Qiskit orders bits **little-endian** (qubit 0 is the rightmost character in printed bitstrings), but the circuit below is described by qubit index, so only the *printed* labels differ from this lesson's convention.

${X}python
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

qc = QuantumCircuit(3)
qc.ry(1.1, 0)        # prepare some unknown-to-Bob state on q0
qc.ry(0.0, 0)        # (keep as a placeholder; edit the angle above)
qc.h(1); qc.cx(1, 2) # Bell pair on q1,q2
qc.cx(0, 1); qc.h(0) # Alice's Bell-basis rotation
qc.cx(1, 2)          # X correction (controlled by m1)
qc.cz(0, 2)          # Z correction (controlled by m0)

# Bob's reduced state on q2 should equal Ry(1.1)|0>
rho2 = Statevector(qc).probabilities([2])
print(rho2)          # approx [cos^2(0.55), sin^2(0.55)]
${X}

The first rotation is applied twice only in the sense that the second line is a no-op placeholder; the substantive point is that the result on $q_2$ matches the prepared state for any angle.

### What you should take away

- Teleportation consumes **1 ebit and 2 classical bits** to move **1 qubit**; superdense coding consumes **1 ebit and 1 qubit** to move **2 classical bits**.
- The key identity is $|\Psi_2\rangle = \tfrac12\sum_{m_0m_1}|m_0m_1\rangle X^{m_1}Z^{m_0}|\psi\rangle$.
- Outcomes are uniformly random, so Bob learns nothing until the classical message arrives, which is why there is no faster-than-light signalling.
- It is a **protocol you can run today**: photonic experiments have teleported over more than a hundred kilometres of fibre and between ground stations and a satellite; superconducting and ion-trap machines use it as a primitive.
- Next, we will use circuits like these as building blocks for algorithms, starting with the first quantum speedup in the oracle model.`}],quiz:[{q:"In the teleportation algebra, Alice measures $m_0 m_1 = 10$. What must Bob apply to recover $|\\psi\\rangle$?",options:["Nothing, the state is already correct","X","Z","Z followed by X (i.e. both)"],answer:2,explain:"The $10$ branch holds $Z|\\psi\\rangle = \\alpha|0\\rangle-\\beta|1\\rangle$ on Bob's qubit (the formula is $X^{m_1}Z^{m_0}$ with $m_1=0$, $m_0=1$). Applying $Z$ undoes it because $Z^2=I$."},{q:"Why does teleportation not allow faster-than-light communication?",options:["Because the entangled pair is destroyed before the qubit arrives","Because before the two classical bits arrive, Bob's qubit is maximally mixed regardless of the state Alice is sending","Because quantum states can only travel at light speed through fibre","Because Alice's measurement outcome is always 00"],answer:1,explain:"Averaged over Alice's four equally likely outcomes, Bob's state is $I/2$ for every input. Only the classical message, which travels no faster than light, lets him undo the random Pauli."},{q:"What does teleporting one unknown qubit consume?",options:["One Bell pair and two classical bits","Two Bell pairs and one classical bit","One Bell pair and no classical communication","Two classical bits and a copy of the state"],answer:0,explain:"One shared ebit plus two classical bits. No communication at all would permit signalling, and copying the state is forbidden by no-cloning."},{q:"In superdense coding, Alice applies Z to her half of $|\\Phi^+\\rangle$ and sends it to Bob, who runs CNOT then H. What does Bob read?",options:["00","01","10","11"],answer:2,explain:"Z on the first qubit gives $(|00\\rangle-|11\\rangle)/\\sqrt2$. CNOT turns it into $(|0\\rangle-|1\\rangle)|0\\rangle/\\sqrt2$, and H on the first qubit gives $|10\\rangle$, i.e. the bits 10."},{q:"What does entanglement swapping achieve?",options:["It copies an entangled pair to a third party","A Bell measurement on two qubits from different pairs entangles the two qubits that never interacted","It converts classical bits into entanglement","It reverses the effect of decoherence"],answer:1,explain:"Measuring the middle qubits in the Bell basis projects the two outer qubits into a Bell state (up to a known Pauli). Chaining this builds long-distance entanglement in quantum repeaters."}],takeaways:["Teleportation moves an unknown qubit state using 1 Bell pair + 2 classical bits; the original is destroyed, so no-cloning holds.","The core identity: after CNOT and H, Bob holds X^{m1} Z^{m0}|ψ⟩ with all four outcomes equally likely.","No faster-than-light signalling: without the classical bits, Bob's qubit is maximally mixed.","Superdense coding is the dual: 1 ebit + 1 qubit sent carries 2 classical bits, via four orthogonal Bell states.","Entanglement swapping chains short Bell pairs into long ones and underlies quantum repeaters."]},Ee=Object.freeze(Object.defineProperty({__proto__:null,lesson:Ze},Symbol.toStringTag,{value:"Module"})),C="```",Oe={id:"variational",order:16,part:"NISQ & Beyond",title:"Variational Algorithms: VQE and QAOA",summary:"Use a short quantum circuit as a tunable function and let a classical optimiser steer it toward the lowest energy or the best cut.",minutes:40,objectives:['You can explain what "NISQ" means and why hybrid quantum-classical loops were proposed for it.',"You can write an expectation value as a sum of Pauli-term measurements and say how each Pauli is measured.","You can prove the variational principle and derive the parameter-shift rule for a rotation gate.","You can describe how VQE estimates the H2 ground-state energy and how QAOA encodes MaxCut.","You can state honestly what is known and unknown about variational advantage, including barren plateaus."],blocks:[{t:"md",text:String.raw`## The NISQ era and the hybrid idea

In 2018 John Preskill coined the term **NISQ**: *Noisy Intermediate-Scale Quantum*. "Intermediate-scale" means tens to a few thousand qubits. "Noisy" means each gate has an error rate of roughly $10^{-3}$ or worse, and there is no error correction (that is the subject of the next-but-one lesson). With noise like that, you cannot run a circuit with millions of gates, so Shor's algorithm at cryptographic size is out of reach. The question that motivated variational algorithms was: *what can a short, shallow circuit do that is useful?*

The answer proposed was a **hybrid loop**:

1. A classical computer picks a vector of numbers $\vec\theta = (\theta_1,\dots,\theta_m)$.
2. The quantum computer prepares a state $|\psi(\vec\theta)\rangle = U(\vec\theta)|0\ldots0\rangle$ using a short **parameterised circuit** (an *ansatz*, German for "approach"), then measures something.
3. From the measurement statistics the classical computer estimates a **cost** $C(\vec\theta)$, and an ordinary optimiser (gradient descent, COBYLA, Adam, ...) proposes a better $\vec\theta$.
4. Repeat until the cost stops improving.

The quantum device does only what it is good at, producing a hard-to-simulate state, while the classical computer does the bookkeeping. Because each circuit is short, the hope is that noise stays tolerable.

### Expectation values from Pauli measurements

The cost is nearly always the expected value of an observable $H$ (a Hermitian matrix):

$$E(\vec\theta)=\langle\psi(\vec\theta)|H|\psi(\vec\theta)\rangle .$$

Any $n$-qubit observable can be written as a weighted sum of **Pauli strings** $P_k$ (tensor products of $I, X, Y, Z$):

$$H=\sum_k c_k P_k \quad\Rightarrow\quad E=\sum_k c_k\,\langle P_k\rangle .$$

Each $\langle P_k\rangle$ is estimated separately. A $Z$-type string is read directly from computational-basis counts: the value is $+1$ for even parity of the measured bits on the qubits it acts on, and $-1$ for odd parity. To measure $X$ on a qubit, apply a Hadamard first; to measure $Y$, apply $S^\dagger$ then $H$. With $N$ repetitions ("shots") the statistical error on $\langle P_k\rangle$ is about $1/\sqrt{N}$. This **shot noise** is a real cost: halving the error costs four times the shots.`},{t:"md",text:String.raw`## Why minimising works: the variational principle

Let $H$ have eigenvalues $E_0\le E_1\le\dots$ with orthonormal eigenvectors $|E_k\rangle$. Any state can be expanded as $|\psi\rangle=\sum_k a_k|E_k\rangle$ with $\sum_k|a_k|^2=1$. Then

$$\langle\psi|H|\psi\rangle=\sum_k |a_k|^2E_k\;\ge\;E_0\sum_k|a_k|^2=E_0 .$$

So **every** trial state has energy at least the ground energy, with equality only if $|\psi\rangle$ is a ground state. Minimising $E(\vec\theta)$ can therefore never undershoot the truth; the only risk is stopping above it, either because the ansatz cannot represent the ground state or because the optimiser gets stuck in a local minimum.

### A worked one-qubit example

Take $H = Z + 0.5\,X$ and the ansatz $|\psi(\theta)\rangle = R_y(\theta)|0\rangle=\cos\tfrac\theta2|0\rangle+\sin\tfrac\theta2|1\rangle$. Then $\langle Z\rangle=\cos\theta$ and $\langle X\rangle=\sin\theta$, so

$$E(\theta)=\cos\theta+0.5\sin\theta .$$

The minimum over $\theta$ is $-\sqrt{1+0.25}\approx-1.118$, reached where $\tan\theta=0.5/1$ shifted into the third quadrant (about $\theta\approx 3.61$ rad). The exact eigenvalues of $H$ are $\pm\sqrt{1+0.5^2}=\pm1.118$, so this ansatz is *exact*, because a real rotation about $Y$ reaches every real qubit state. In general ansätze are not that lucky.

### The parameter-shift rule

How does the quantum computer supply gradients? Suppose $\theta$ enters through a gate $e^{-i\theta P/2}$ where $P^2=I$ (any Pauli rotation). Then $E(\theta)$ is a trigonometric polynomial of degree one:

$$E(\theta)=A\cos\theta+B\sin\theta+C .$$

Directly: $E(\theta+\tfrac\pi2)-E(\theta-\tfrac\pi2)=(-A\sin\theta+B\cos\theta)-(A\sin\theta-B\cos\theta)=2\,(-A\sin\theta+B\cos\theta)=2E'(\theta)$. Hence

$$\frac{\partial E}{\partial\theta}=\frac12\Big[E\big(\theta+\tfrac\pi2\big)-E\big(\theta-\tfrac\pi2\big)\Big].$$

Check on our example at $\theta=0$: $E(\pi/2)=0.5$, $E(-\pi/2)=-0.5$, so the rule gives $\tfrac12(0.5+0.5)=0.5$, and the derivative of $\cos\theta+0.5\sin\theta$ at $0$ is indeed $0.5$. The rule is **exact** (not a finite-difference approximation) and uses two ordinary circuit evaluations per parameter, which is why it works on hardware where you cannot "look inside" the state.

${C}python
import numpy as np
def E(t): return np.cos(t) + 0.5*np.sin(t)          # <Z> + 0.5<X> for Ry(t)|0>
grad = lambda t: 0.5*(E(t+np.pi/2) - E(t-np.pi/2))   # parameter-shift
print(grad(0.0))   # 0.5, equal to the analytic derivative
${C}`},{t:"widget",name:"vqe",caption:"Run the optimiser from several starting angles. Watch the energy fall toward the dashed exact ground-state line and never cross below it, which is the variational principle in action. Compare the gradient the widget reports with the 1/2[E(θ+π/2) − E(θ−π/2)] formula."},{t:"md",text:String.raw`## VQE for the hydrogen molecule

The **Variational Quantum Eigensolver** (Peruzzo et al. 2014) applies this loop to a molecular Hamiltonian. For H$_2$ in a minimal basis, the electronic problem has four spin-orbitals. After the standard *fermion-to-qubit mapping* (Jordan-Wigner or parity) and exploiting symmetries, it shrinks to **two qubits** with a Hamiltonian of the form

$$H=g_0 I + g_1 Z_0 + g_2 Z_1 + g_3 Z_0Z_1 + g_4 X_0X_1 + g_5 Y_0Y_1 .$$

The six coefficients $g_k$ are real numbers computed classically from molecular integrals; they depend on the bond length and on the mapping, so we do not quote them here. At the equilibrium bond length (about $0.74$ Angstrom) the exact ground-state energy including nuclear repulsion is about $-1.137$ Hartree. For two qubits one can diagonalise $H$ by hand, so H$_2$ is a *teaching* problem, not a place where quantum computers help.

The ansatz in the widget is a single-parameter rotation on a Hartree-Fock reference state, built from the idea that the ground state is mostly $|01\rangle$ with a small admixture of $|10\rangle$, a superposition of the two ways to place the electron pair:

$$|\psi(\theta)\rangle=\cos\tfrac\theta2\,|01\rangle-\sin\tfrac\theta2\,|10\rangle .$$

Each of the five non-trivial Pauli terms is measured in its own basis; the energy is the weighted sum; parameter-shift gives $dE/d\theta$; the optimiser updates $\theta$. Realistic molecules need ansätze with dozens to thousands of parameters (UCCSD, hardware-efficient, ADAPT-VQE), and the number of Pauli terms grows roughly as the fourth power of the number of orbitals, so the measurement cost becomes the bottleneck.

### Choosing an ansatz

There is a genuine trade-off. A **chemistry-inspired** ansatz (such as unitary coupled cluster) respects symmetries but gives deep circuits. A **hardware-efficient** ansatz uses whatever gates the device does natively, so it is shallow, but it may not contain the ground state and is more prone to the trainability problems discussed below.`},{t:"callout",kind:"warn",title:"Chemical accuracy is a high bar",text:String.raw`Chemists want energies accurate to about $1.6\times10^{-3}$ Hartree ("chemical accuracy"), because reaction rates depend exponentially on energy differences. Reaching this on hardware requires beating both shot noise and gate noise. Error-mitigation techniques (zero-noise extrapolation, probabilistic error cancellation, symmetry verification) help but add yet more shots, and no VQE experiment so far has produced a molecular result that classical methods could not also obtain.`},{t:"md",text:String.raw`## QAOA: optimisation as a variational circuit

The **Quantum Approximate Optimisation Algorithm** (Farhi, Goldstone, Gutmann 2014) uses a *fixed, problem-shaped* ansatz instead of a free-form one. Take **MaxCut**: given a graph, colour each vertex 0 or 1 to maximise the number of edges whose endpoints differ. Encode vertex colour as a qubit, and the cut size as a diagonal observable

$$C=\sum_{(i,j)\in E}\tfrac12\big(I-Z_iZ_j\big).$$

An edge contributes $1$ when $Z_iZ_j=-1$ (different bits) and $0$ otherwise. QAOA with $p$ layers prepares

$$|\gamma,\beta\rangle=\prod_{\ell=1}^{p}\Big[e^{-i\beta_\ell B}\,e^{-i\gamma_\ell C}\Big]\;|+\rangle^{\otimes n},\qquad B=\sum_i X_i .$$

The **cost unitary** $e^{-i\gamma C}$ imprints a phase on each bitstring according to its cut value (it is a product of two-qubit $ZZ$ rotations, one per edge). The **mixer** $e^{-i\beta B}$ moves amplitude between neighbouring bitstrings so that phase differences become probability differences, the same interference idea as in Grover's algorithm. The $2p$ angles are tuned by the classical loop to maximise $\langle C\rangle$.

### Worked example: the triangle

A triangle has 3 edges, and no colouring cuts all three, so the maximum cut is 2. A uniformly random colouring cuts each edge with probability $1/2$, so $\langle C\rangle=1.5$, an approximation ratio of $0.75$. At $p=1$ the landscape $\langle C\rangle(\gamma,\beta)$ is a smooth, periodic surface with a few peaks; the best peak exceeds $1.5$ and approaches $2$.

For general 3-regular graphs, $p=1$ QAOA is proven to guarantee an approximation ratio of at least about $0.69$, whereas the classical Goemans-Williamson algorithm guarantees about $0.878$. Larger $p$ improves quality in principle, at the cost of deeper circuits and a harder optimisation.`},{t:"widget",name:"qaoa",caption:"Look at the (γ, β) heat map: bright regions give a larger expected cut. Click or drag to a bright spot and compare the expected cut to the random-guess value (half the edges). Then find the maximum cut by eye on the graph and see how close QAOA at p = 1 gets."},{t:"md",text:String.raw`## Barren plateaus and the honest status

Variational algorithms look attractive, but several serious obstacles are known.

**Barren plateaus.** McClean et al. (2018) showed that for sufficiently random, deep parameterised circuits on $n$ qubits, the variance of any gradient component shrinks *exponentially* in $n$. The landscape becomes almost perfectly flat, so you would need exponentially many shots just to see which way is downhill. Later work showed that barren plateaus also arise from global cost functions, from too much entanglement, and from hardware noise itself. Mitigations exist: local cost functions, shallow structured ansätze, smart initialisation, and layer-by-layer training. A sobering corollary from recent research is that many ansatz families that provably *avoid* barren plateaus also appear to be classically simulable, so avoiding the flat landscape may remove the room for quantum advantage.

**Local minima and measurement cost.** The optimisation is non-convex, noisy, and each function evaluation costs thousands of shots.

**What is not known.** There is, as of today, **no proof** that VQE or QAOA beats the best classical algorithms on any practically relevant problem. For MaxCut in particular, good classical heuristics are very strong. These algorithms are heuristics: they may work, they may not, and the community is actively testing them. Their value today is largely as a test-bed for hybrid programming, noise mitigation, and benchmarking, and as a candidate for the early fault-tolerant era, where deeper circuits become possible.

### Try it in code

${C}python
# PennyLane (recent versions): the same toy problem with automatic parameter-shift
import pennylane as qml
from pennylane import numpy as np

dev = qml.device("default.qubit", wires=1)

@qml.qnode(dev, diff_method="parameter-shift")
def energy(theta):
    qml.RY(theta, wires=0)
    return qml.expval(qml.Z(0) + 0.5 * qml.X(0))

theta = np.array(0.0, requires_grad=True)
opt = qml.GradientDescentOptimizer(stepsize=0.4)
for _ in range(60):
    theta = opt.step(energy, theta)
print(energy(theta))   # about -1.118
${C}

The same pattern, circuit then expectation value then optimiser, is the skeleton of every variational algorithm, from VQE to quantum neural networks.`}],quiz:[{q:"Why can a VQE energy estimate never fall below the true ground-state energy (ignoring statistical noise)?",options:["Because the optimiser is designed to stop at the ground state.","Because for any normalised state, the energy is a weighted average of eigenvalues, which cannot be smaller than the smallest eigenvalue.","Because quantum circuits only produce states with positive energy.","Because the Pauli measurements are rounded to the nearest eigenvalue."],answer:1,explain:"Expanding in the eigenbasis gives sum_k |a_k|^2 E_k, a convex combination of eigenvalues, hence at least E_0. This is the variational principle. With finite shots the estimate can fluctuate below E_0 by chance, but its true expectation cannot."},{q:"For a gate exp(-i θ P / 2) with P a Pauli, the parameter-shift rule gives dE/dθ equal to:",options:["[E(θ + ε) − E(θ)] / ε with ε very small","E(θ + π) − E(θ)","(1/2)[E(θ + π/2) − E(θ − π/2)]","E(θ + π/2) + E(θ − π/2)"],answer:2,explain:"Because E(θ) = A cos θ + B sin θ + C, the shifted difference equals exactly twice the derivative. It is not a small-step approximation, so it is robust to shot noise in a way finite differences with tiny ε are not."},{q:"How is the expectation value of the Pauli string X on a qubit measured on hardware that only measures in the Z basis?",options:["Apply a Hadamard before the Z measurement.","Apply a T gate after the Z measurement.","It cannot be measured.","Apply a CNOT to an ancilla qubit and discard it."],answer:0,explain:"H maps the X eigenbasis to the Z eigenbasis, so measuring Z after H samples X outcomes. For Y one applies S-dagger and then H."},{q:"In QAOA for MaxCut, what is the role of the mixer exp(-iβB) with B = sum of X_i?",options:["It computes the cut value of each bitstring.","It moves amplitude between bitstrings so the phases from the cost unitary turn into measurable probability differences.","It corrects hardware errors.","It chooses which graph is being solved."],answer:1,explain:"The cost unitary only changes phases, which do not affect Z-basis probabilities. The mixer rotates between bitstrings so those phases interfere constructively on good cuts, similar to the diffusion step in Grover search."},{q:"Which statement about the status of variational algorithms is most accurate?",options:["VQE has been proven to solve chemistry problems exponentially faster than classical methods.","They are heuristics: barren plateaus and shot costs are serious obstacles, and no practical advantage has been proven.","They require full error correction to run at all.","QAOA at p = 1 provably beats all classical MaxCut algorithms."],answer:1,explain:"Variational methods are promising heuristics for shallow noisy circuits, but there is no proof of advantage on useful problems; for 3-regular MaxCut, p = 1 QAOA guarantees a lower ratio than the classical Goemans-Williamson bound."}],takeaways:["NISQ devices are noisy and mid-sized, so variational algorithms keep circuits short and push optimisation onto a classical computer.","Energy is a sum of Pauli expectation values, each measured in its own basis; shot noise scales as 1/sqrt(N).","The variational principle guarantees that the estimate never goes below the true ground energy.","The parameter-shift rule gives exact gradients from two circuit evaluations per parameter.",'QAOA alternates cost and mixer unitaries for MaxCut; barren plateaus and the absence of a proven advantage keep VQE/QAOA firmly in the "promising heuristic" category.']},We=Object.freeze(Object.defineProperty({__proto__:null,lesson:Oe},Symbol.toStringTag,{value:"Module"})),_=String.raw,R="```",Me={id:"welcome",order:1,part:"Foundations",title:"Welcome: What Quantum Computing Is (and Isn't)",summary:"A clear-eyed tour of what quantum computers are, where they genuinely help, where the hype goes wrong, and how this course will take you from zero to confident.",minutes:20,objectives:["You can explain in plain language what a quantum computer is and how it differs from a classical one.",'You can name the problem families where quantum speedups are real (simulation, factoring, structured search) and say why "tries every answer at once" is wrong.','You can read a speedup curve and distinguish quadratic, exponential and "no speedup" scenarios.',"You can describe the four-part structure of this course and how to use the interactive widgets."],blocks:[{t:"md",text:_`## Why this course exists

Quantum computing is one of the few fields where a serious scientific idea, a large amount of money, and a lot of nonsense all live in the same place. You have probably heard that quantum computers "try every possibility at once", that they will "break all encryption tomorrow", or that they are "just faster supercomputers". All three statements are wrong, and one goal of this course is to make you immune to them.

The good news is that the real story is more interesting than the hype. A quantum computer is a machine that stores information in the states of quantum systems and processes it with operations that obey the laws of quantum mechanics. Those laws allow a kind of bookkeeping, **amplitudes**, that is richer than the probabilities used by classical randomised computers. Amplitudes can be negative or complex, and they can cancel each other out. Almost all of quantum computing is the art of arranging that cancellation so wrong answers wash out and right answers survive.

### The promise of this course

**You need no prerequisites.** If you can follow high-school algebra, we will build the rest: complex numbers, vectors, matrices, and just enough physics. If you are a software engineer, a student, or a researcher switching fields, you will find the same ladder: every idea is introduced by intuition first, then precise mathematics, then a worked numerical example, then something you can poke at in a widget. By the end you should be able to read a quantum-computing paper's introduction, write and simulate circuits, and judge claims critically.`},{t:"md",text:_`## What a quantum computer is

A classical computer works with **bits**: each bit is definitely 0 or definitely 1. A quantum computer works with **qubits**. A qubit is any two-level quantum system (an electron's spin, a photon's polarisation, the lowest two energy levels of a tiny superconducting circuit) that we can control and measure precisely.

Three ingredients distinguish it from a classical machine:

1. **Superposition.** A qubit's state is not just 0 or 1 but a weighted combination $\alpha|0\rangle + \beta|1\rangle$, where $\alpha$ and $\beta$ are complex numbers called amplitudes. We will define every symbol properly in later lessons; for now, read it as "a recipe saying how much of 0 and how much of 1".
2. **Interference.** Amplitudes add like waves. Two routes to the same outcome can reinforce (constructive interference) or cancel (destructive interference).
3. **Entanglement.** Several qubits can share a joint state that cannot be described qubit by qubit. The description of $n$ qubits needs $2^n$ amplitudes.

Measurement then converts the quantum state into an ordinary classical bit string, and it does so *randomly*, with probabilities given by the squared magnitudes of the amplitudes (the Born rule, Lesson 5).

### Not a faster laptop

A quantum computer is not a general speed-up for everything. Your email, your spreadsheet and your video game will never run better on one. It is a **special-purpose accelerator** for particular mathematical structures, closer in spirit to a GPU than to a new CPU, except that the structures it helps with are exotic and the machine itself needs extreme engineering (near absolute-zero temperatures for superconducting devices, vacuum chambers and lasers for trapped ions, and so on).`},{t:"callout",kind:"warn",title:'Misconception: "it tries all answers at once"',text:_`A register of $n$ qubits can be put in a superposition over all $2^n$ bit strings. But when you measure, you see **one** random bit string. If you did nothing clever, you would learn nothing more than from a coin flip. A useful algorithm must choreograph interference so that the amplitude of the *correct* answer is large at the end. That is hard, and it is why only a modest number of quantum algorithms exist with proven advantages.`},{t:"md",text:_`## Where quantum computers genuinely help

Here is the honest list, ordered roughly from most to least certain.

**1. Simulating quantum systems.** This was the original motivation, proposed by Richard Feynman in the early 1980s: nature is quantum, and simulating a quantum system of $n$ particles on a classical computer needs memory growing like $2^n$. A quantum computer simulates it natively. Applications: chemistry (catalysts, batteries, drug binding), materials science, nuclear and particle physics. This is widely believed to be the first area of real practical value.

**2. Factoring and discrete logarithms.** Peter Shor's 1994 algorithm factors an integer in time polynomial in the number of digits. The best known classical algorithms are super-polynomial. This is the reason the world is migrating to "post-quantum" cryptography. Running it at cryptographically relevant sizes needs a large fault-tolerant machine, which does not exist yet (Lessons 15, 18, 19).

**3. Unstructured search.** Lov Grover's 1996 algorithm finds a marked item among $N$ using about $\sqrt{N}$ queries instead of about $N$. This is a **quadratic** speedup, and it is provably the best possible for the unstructured problem. Quadratic is real but modest: after accounting for the slower clock speeds and error-correction overhead of quantum hardware, it needs very large problems to pay off.

**4. Optimisation and machine learning: proceed with caution.** Many claims here are unproven or have been matched by improved classical ("dequantised") algorithms. Variational methods (Lesson 16) and quantum machine learning (Lesson 17) are active research, not established advantages.

**5. Everything else: no speedup.** Sorting, databases, web servers, spreadsheets, and the training of today's large neural networks are not expected to benefit.`},{t:"widget",name:"speedup-chart",caption:"Switch between the curves. Compare Grover-type (quadratic) with Shor-type (superpolynomial) scaling. Notice how a quadratic speedup, unlike an exponential one, can be erased by a large constant slowdown for small problem sizes. Find the crossover point."},{t:"callout",kind:"history",title:"A very short history",text:_`Feynman (1981) and Deutsch (1985) argued that quantum mechanics suggests a new model of computation. Shor (1994) showed that this model solves a problem of enormous practical interest. Grover followed in 1996, and quantum error-correcting codes were discovered in 1995 to 1996 (Shor, Steane), showing that noise is not a fatal obstacle in principle. Experimental milestones followed with trapped ions, superconducting circuits, photons and neutral atoms. In 2019 Google reported a "quantum supremacy" experiment on a contrived sampling task; classical researchers later narrowed the gap considerably. The lesson: demonstrations of difficulty are not the same as useful applications.`},{t:"md",text:_`## The ladder: how this course is organised

The course has twenty lessons in four parts. Each lesson builds on the previous ones, so we recommend going in order the first time.

| Part | Lessons | What you will gain |
|---|---|---|
| **Foundations** | 1 Welcome, 2 Complex Numbers & Vectors, 3 Matrices, Unitaries & Tensor Products, 4 The Physics | All the mathematics and physical intuition you need, from scratch |
| **The Qubit** | 5 The Qubit & the Bloch Sphere, 6 Single-Qubit Gates, 7 Many Qubits, 8 Entanglement & CHSH, 9 Measurement, Density Matrices & Noise | A complete, precise picture of the basic building block, and the first genuinely non-classical effects |
| **Circuits & Algorithms** | 10 Circuit Model & Universality, 11 Teleportation & Superdense Coding, 12 Deutsch–Jozsa & Bernstein–Vazirani, 13 Grover, 14 QFT & Phase Estimation, 15 Shor | The canonical algorithms, built and simulated step by step |
| **NISQ & Beyond** | 16 Variational Algorithms, 17 Reservoir Computing & QML, 18 Error Correction, 19 Hardware & Cryptography, 20 Complexity & Your Roadmap | Today's noisy devices, the road to fault tolerance, and where to go next |

"NISQ" stands for *noisy intermediate-scale quantum*, John Preskill's term for today's devices: tens to thousands of imperfect qubits with no full error correction.

### How to use the interactive widgets

Almost every lesson embeds live simulators. They are not decoration: they are where intuition forms. In each widget block, the caption tells you what to try. Our rule of thumb is **predict first, then click**: before you press a gate button or move a slider, say out loud what you expect, then check. When your prediction fails, you have found the most valuable thing in the lesson.

You will meet the Bloch sphere (a 3D picture of a qubit), a gate explorer, a full circuit composer, and specialised labs for entanglement, noise, Grover, Fourier transforms, Shor, and more. All simulations run on classical hardware in your browser, which is perfectly fine for the small systems we study. This is itself a lesson: simulating $n$ qubits costs $2^n$ numbers, which is exactly why a real quantum computer would be interesting.`},{t:"callout",kind:"tip",title:"Conventions used throughout",text:_`Qubits are written left to right as $|q_0 q_1 q_2\rangle$ (the first qubit is leftmost, "big-endian"). Python snippets use NumPy or Qiskit. Mathematical symbols are defined at first use, and a glossary collects them. If a formula looks scary, read the sentence before and after it: the words always carry the idea.`},{t:"md",text:_`## A first taste in code

Here is the smallest possible quantum program, a qubit put into an equal superposition and measured, simulated with plain NumPy. Do not worry about the notation yet; Lessons 2 and 3 explain every symbol.

${R}python
import numpy as np

zero = np.array([1, 0], dtype=complex)           # the state |0>
H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)     # the Hadamard gate
psi = H @ zero                                   # equal superposition
probs = np.abs(psi) ** 2                         # Born rule
print(psi, probs)                                # [0.707+0j 0.707+0j] [0.5 0.5]
print(np.random.choice([0, 1], size=10, p=probs))
${R}

Every run prints a different random list of zeros and ones. Applying $H$ again would bring the qubit back to $|0\rangle$ with certainty. That is interference: the two "paths" of amplitude cancel for outcome 1. A classical coin that has been flipped cannot be un-flipped by flipping again; the quantum qubit can. Keep that contrast in mind: it is the seed of everything else in the course.

## Self-assessment: where do you stand?

Be honest; there are no wrong answers.

- **Can you multiply two 2x2 matrices?** If not, no problem: Lesson 3 covers it.
- **Do you know what $i=\sqrt{-1}$ does?** Lesson 2 builds complex numbers from scratch.
- **Have you seen a vector inner product?** Lesson 2 again.
- **Do you know any quantum physics?** None needed; Lesson 4 gives only what we use.
- **Can you read a little Python?** Helpful, never required.

If you answered "no" to everything, you are exactly the intended reader. If you answered "yes" to most, skim Lessons 2 to 4 and linger on the widgets. Either way, the next lesson starts with a number you have probably been told does not exist.`}],quiz:[{q:"A register of n qubits is placed in an equal superposition of all 2^n bit strings and then measured with no further processing. What do you learn?",options:["The answers to all 2^n computations simultaneously.","One uniformly random n-bit string, no more informative than random coin flips.","The single best answer, because the quantum computer picks it automatically.","Nothing, because measurement always destroys qubits."],answer:1,explain:"Measurement returns a single classical outcome, sampled with probability equal to the squared amplitude. With no interference engineered beforehand, that is just a random string. Useful algorithms use interference to boost the probability of the right answer first."},{q:"Which statement best matches what is known about Grover search?",options:["It solves NP-complete problems in polynomial time.","It gives an exponential speedup for unstructured search.","It gives a quadratic speedup (about sqrt(N) queries), which is optimal for unstructured search.","It gives no speedup at all, only a different style of computation."],answer:2,explain:"Grover needs about sqrt(N) queries versus about N classically, and a lower bound shows no quantum algorithm can do better for the unstructured problem. Quadratic is useful but far from exponential."},{q:"Which application is considered the most natural, earliest-payoff use of quantum computers?",options:["Speeding up web search and database lookups.","Simulating quantum systems such as molecules and materials.","Training every deep neural network faster.","Replacing classical hard drives with qubits."],answer:1,explain:"Simulating quantum systems is the original motivation (Feynman) because classical memory grows like 2^n with the number of particles, while a quantum device represents the state natively. The other options have no established advantage."},{q:"Why can a quadratic speedup fail to beat a classical machine on moderately sized problems?",options:["Quadratic speedups are mathematically impossible on real hardware.","Quantum gates are slower and error correction adds large constant overheads, which can outweigh a sqrt(N) advantage until N is very large.","Classical computers also use qubits internally.","Because quantum computers cannot read classical data at all."],answer:1,explain:"Asymptotic speedup says nothing about constants. Slower gate times and error-correction overhead can make a quadratic advantage matter only for very large instances, which is why exponential speedups (simulation, factoring) are the more compelling targets."},{q:"In the NumPy snippet, applying the Hadamard gate twice returns |0> with certainty. What does this illustrate?",options:["That qubits are secretly just fair coins.","Interference: amplitudes for outcome 1 cancel on the second application.","That measurement is not random.","That the Hadamard gate is not reversible."],answer:1,explain:"A classical random flip cannot be undone by another random flip. The Hadamard gate manipulates amplitudes, which can cancel; the two contributions to outcome 1 have opposite signs and sum to zero."}],takeaways:["A qubit stores amplitudes, not hidden classical values; measurement yields one random classical outcome.",'Quantum advantage comes from interference, not from "trying everything at once".',"Proven or strongly believed advantages: quantum simulation, factoring (Shor), and quadratic speedup for unstructured search (Grover).","Claims about optimisation and machine learning are unproven; always ask what the best classical baseline is.","This course goes foundations, then the qubit, then algorithms, then NISQ and error correction, with no prerequisites."]},Xe=Object.freeze(Object.defineProperty({__proto__:null,lesson:Me},Symbol.toStringTag,{value:"Module"})),Re=Object.assign({"./calibration-benchmarking.ts":J,"./circuit-model.ts":te,"./complex-vectors.ts":ie,"./complexity-roadmap.ts":ne,"./dj-bv.ts":oe,"./entanglement.ts":ce,"./error-correction.ts":de,"./gates-to-pulses.ts":pe,"./grover.ts":$e,"./hardware-crypto.ts":fe,"./linear-algebra.ts":we,"./measurement-noise.ts":qe,"./multi-qubit.ts":ke,"./physics-intro.ts":_e,"./qft-qpe.ts":Ae,"./qubit-bloch.ts":Ne,"./reservoir.ts":He,"./shor.ts":Pe,"./single-gates.ts":Qe,"./teleportation.ts":Ee,"./variational.ts":We,"./welcome.ts":Xe}),g=Object.values(Re).map(t=>t.lesson).filter(t=>!!t&&typeof t.id=="string").sort((t,a)=>t.order-a.order),Fe=["Foundations","The Qubit","Circuits & Algorithms","NISQ & Beyond"],P=t=>g.find(a=>a.id===t),Ye=[{term:"Amplitude",see:"complex-vectors",def:String.raw`A complex number attached to a basis state in a superposition. Its squared magnitude is the probability of that outcome: $p_i = |\alpha_i|^2$, and the amplitudes of a normalised state satisfy $\sum_i |\alpha_i|^2 = 1$.`},{term:"Amplitude amplification",see:"grover",def:String.raw`A generalisation of Grover search that repeatedly reflects about the "good" subspace and about the initial state to rotate amplitude toward marked answers. If a single try succeeds with probability $p$, about $O(1/\sqrt{p})$ rounds suffice, versus $O(1/p)$ classical repetitions.`},{term:"Ansatz",see:"variational",def:String.raw`The parameterised circuit family chosen in a variational algorithm to prepare trial states. Its structure (depth, entangling pattern, parameter count) determines both how expressive the search is and how trainable it is.`},{term:"Barren plateau",see:"variational",def:String.raw`A region of parameter space where cost-function gradients vanish exponentially with the number of qubits, so training stalls. It typically arises for deep, highly random ansätze or global cost functions.`},{term:"Basis",see:"linear-algebra",def:String.raw`A set of linearly independent vectors in which every state of the space can be written uniquely. For qubits, an orthonormal basis is a pair of perfectly distinguishable states, such as $|0\rangle,|1\rangle$ or $|+\rangle,|-\rangle$.`},{term:"BB84",see:"hardware-crypto",def:String.raw`The first quantum key distribution protocol, proposed by Bennett and Brassard in 1984. Alice sends qubits prepared in randomly chosen Z or X bases, Bob measures in random bases, and they keep only the rounds where the bases matched.`},{term:"Bell inequality",see:"entanglement",def:String.raw`A bound on correlations that any local hidden-variable theory must satisfy. Quantum mechanics predicts, and experiments confirm, violations of such bounds, showing that nature cannot be described by pre-existing local values for measurement outcomes.`},{term:"Bell state",see:"entanglement",def:String.raw`One of four maximally entangled two-qubit states, for example $|\Phi^+\rangle = (|00\rangle+|11\rangle)/\sqrt{2}$. Together they form an orthonormal basis of two qubits and are made by a Hadamard followed by a CNOT.`},{term:"Bernstein–Vazirani algorithm",see:"dj-bv",def:String.raw`A quantum algorithm that finds a hidden bit string $s$ defining $f(x)=s\cdot x \bmod 2$ using a single oracle query. Classically $n$ queries are needed.`},{term:"Bloch sphere",see:"qubit-bloch",def:String.raw`A geometric picture of a single qubit in which every pure state is a point on the surface of a unit sphere. The state $\cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$ sits at polar angle $\theta$ and azimuth $\phi$; mixed states lie inside.`},{term:"Born rule",see:"measurement-noise",def:String.raw`The rule that gives measurement probabilities from the state. Measuring $|\psi\rangle$ in an orthonormal basis $\{|i\rangle\}$ yields outcome $i$ with probability $|\langle i|\psi\rangle|^2$.`},{term:"BPP",see:"complexity-roadmap",def:String.raw`Bounded-error probabilistic polynomial time: problems a classical randomised algorithm solves in polynomial time with error probability at most $1/3$. It is the usual model of efficient classical computation.`},{term:"BQP",see:"complexity-roadmap",def:String.raw`Bounded-error quantum polynomial time: problems a quantum computer solves in polynomial time with error probability at most $1/3$. It contains BPP, and factoring is in BQP but is not known to be in BPP.`},{term:"Circuit model",see:"circuit-model",def:String.raw`The standard picture of quantum computation: qubits are prepared in a known state, acted on by a sequence of gates drawn from a fixed set, and finally measured. Time flows left to right and each horizontal wire is one qubit.`},{term:"CHSH inequality",see:"entanglement",def:String.raw`A Bell-type inequality built from four correlation measurements, $S = E(a,b)+E(a,b')+E(a',b)-E(a',b')$. Local hidden-variable models obey $|S|\le 2$, while quantum states can reach $2\sqrt{2}$.`},{term:"Clifford group",see:"circuit-model",def:String.raw`The set of unitaries generated by H, S and CNOT, which map Pauli operators to Pauli operators under conjugation. Clifford circuits can be simulated efficiently on a classical computer (Gottesman–Knill theorem), so they need non-Clifford gates like T for universality.`},{term:"CNOT",see:"multi-qubit",def:String.raw`The controlled-NOT gate: it flips the target qubit if and only if the control qubit is $|1\rangle$, so $|a,b\rangle \mapsto |a, a\oplus b\rangle$. With single-qubit gates it makes a universal set and is the standard way to create entanglement.`},{term:"Computational basis",see:"qubit-bloch",def:String.raw`The basis of states $|0\rangle$ and $|1\rangle$ (the eigenstates of Pauli Z), extended to $n$ qubits as the $2^n$ bit strings. Hardware readout is almost always done in this basis.`},{term:"Contextuality",see:"complexity-roadmap",def:String.raw`The property that the outcome of a measurement cannot be assigned independently of which compatible measurements are made alongside it. The Kochen–Specker theorem shows this rules out non-contextual hidden-variable models, and it is a candidate resource for quantum computational advantage.`},{term:"Continued fractions",see:"shor",def:String.raw`An expansion of a real number as $a_0 + 1/(a_1 + 1/(a_2+\dots))$ whose truncations give the best rational approximations. Shor's algorithm uses it to recover the period $r$ from a measured value close to $kQ/r$.`},{term:"Controlled gate",see:"multi-qubit",def:String.raw`A gate that applies a unitary $U$ to a target register only when one or more control qubits are in $|1\rangle$. In matrix form it is $|0\rangle\langle 0|\otimes I + |1\rangle\langle 1|\otimes U$.`},{term:"Cirq",see:"hardware-crypto",def:String.raw`An open-source Python framework from Google for writing, simulating and running quantum circuits, with a focus on near-term hardware constraints such as device topology and noise.`},{term:"Code distance",see:"error-correction",def:String.raw`The minimum number of physical-qubit errors that can turn one logical state into another without being detected. A code of distance $d$ can correct up to $\lfloor (d-1)/2 \rfloor$ arbitrary errors.`},{term:"Coupling map",see:"hardware-crypto",def:String.raw`The graph of which pairs of physical qubits on a device can interact directly through a two-qubit gate. Circuits must be rewritten to respect it during transpilation.`},{term:"CZ",see:"multi-qubit",def:String.raw`The controlled-Z gate, which multiplies the state by $-1$ only when both qubits are $|1\rangle$. It is symmetric between the two qubits and equals a CNOT conjugated by Hadamards on the target.`},{term:"Decoherence",see:"measurement-noise",def:String.raw`The loss of quantum behaviour caused by uncontrolled interaction between a qubit and its environment. It turns superpositions into statistical mixtures and is the main obstacle to long computations.`},{term:"Density matrix",see:"measurement-noise",def:String.raw`A matrix $\rho$ that describes a quantum state, pure or mixed, as a statistical ensemble: $\rho = \sum_k p_k |\psi_k\rangle\langle\psi_k|$. It is Hermitian, positive semidefinite and has trace 1, and measurement probabilities are $\mathrm{Tr}(\rho P)$.`},{term:"Depolarizing channel",see:"measurement-noise",def:String.raw`A noise model that, with probability $p$, replaces the qubit with the maximally mixed state $I/2$ and otherwise leaves it alone. On the Bloch sphere it shrinks the Bloch vector uniformly toward the centre.`},{term:"Deutsch–Jozsa algorithm",see:"dj-bv",def:String.raw`A quantum algorithm that decides whether a promised constant-or-balanced function on $n$ bits is constant using one oracle query. Deterministic classical algorithms need $2^{n-1}+1$ queries in the worst case.`},{term:"DiVincenzo criteria",see:"hardware-crypto",def:String.raw`Five requirements for a physical quantum computer: scalable well-characterised qubits, initialisation to a simple state, long coherence times, a universal gate set, and qubit-specific measurement. Two more cover interconversion of stationary and flying qubits for communication.`},{term:"Double-slit experiment",see:"physics-intro",def:String.raw`An experiment in which single particles sent at two slits build up an interference pattern, even one at a time. The pattern disappears if which-slit information is recorded, illustrating wave–particle duality and superposition.`},{term:"Echo state property",see:"reservoir",def:String.raw`A condition on a reservoir that its state is eventually determined by the recent input history alone, independent of the initial state. It ensures the dynamics are stable and forget their start-up transient.`},{term:"Eigenvalue",see:"linear-algebra",def:String.raw`A scalar $\lambda$ such that $A v = \lambda v$ for some nonzero vector $v$ (the eigenvector). For a measured observable, the eigenvalues are the possible measurement results.`},{term:"Eigenvector",see:"linear-algebra",def:String.raw`A nonzero vector $v$ that a linear operator only rescales: $Av=\lambda v$. Measuring an observable on one of its eigenvectors gives the corresponding eigenvalue with certainty.`},{term:"Entanglement",see:"entanglement",def:String.raw`A correlation between parts of a quantum system that cannot be described by assigning a state to each part separately. Formally, a pure state of two systems is entangled if it is not a tensor product $|\psi\rangle_A\otimes|\phi\rangle_B$.`},{term:"Error mitigation",see:"variational",def:String.raw`A family of techniques that reduce the effect of noise on measured results by post-processing many noisy runs, without the qubit overhead of full error correction. Examples are zero-noise extrapolation and probabilistic error cancellation, usually at the cost of extra shots.`},{term:"Fading memory",see:"reservoir",def:String.raw`The property that the influence of past inputs on a system's present state decays over time. A reservoir computer needs it so that outputs depend mostly on recent history.`},{term:"Fidelity",see:"measurement-noise",def:String.raw`A measure of how close two quantum states are. For a pure target $|\psi\rangle$ and state $\rho$ it is $F = \langle\psi|\rho|\psi\rangle$, equal to 1 for identical states and 0 for orthogonal ones.`},{term:"Fredkin gate",see:"multi-qubit",def:String.raw`The controlled-SWAP gate, a three-qubit gate that swaps two target qubits when the control is $|1\rangle$. It is reversible and universal for classical computation, and is used in the swap test.`},{term:"GHZ state",see:"entanglement",def:String.raw`The $n$-qubit entangled state $(|0\ldots0\rangle + |1\ldots1\rangle)/\sqrt{2}$, named after Greenberger, Horne and Zeilinger. Measuring any one qubit in the computational basis fixes all the others.`},{term:"Global phase",see:"qubit-bloch",def:String.raw`An overall factor $e^{i\gamma}$ multiplying a whole state. It changes no measurement probability and no Bloch-sphere position, so states differing by it are physically identical.`},{term:"Grover search",see:"grover",def:String.raw`A quantum algorithm that finds a marked item among $N$ unsorted candidates using about $\frac{\pi}{4}\sqrt{N}$ oracle queries, a quadratic speed-up over the $\Theta(N)$ classical cost. It alternates an oracle phase flip with inversion about the mean.`},{term:"Hadamard basis",see:"qubit-bloch",def:String.raw`Another name for the X basis, formed by $|+\rangle=(|0\rangle+|1\rangle)/\sqrt{2}$ and $|-\rangle=(|0\rangle-|1\rangle)/\sqrt{2}$. The Hadamard gate converts between it and the computational basis.`},{term:"Hadamard gate",see:"single-gates",def:String.raw`The single-qubit gate $H=\tfrac{1}{\sqrt2}\begin{pmatrix}1&1\\1&-1\end{pmatrix}$ that maps $|0\rangle\to|+\rangle$ and $|1\rangle\to|-\rangle$. It swaps the X and Z axes of the Bloch sphere and creates uniform superpositions.`},{term:"Hamiltonian",see:"physics-intro",def:String.raw`The operator representing the total energy of a system; it generates time evolution through the Schrödinger equation. Its eigenvalues are the allowed energies, and the lowest is the ground-state energy.`},{term:"Harvest now, decrypt later",see:"hardware-crypto",def:String.raw`An attack strategy in which an adversary records encrypted traffic today in order to decrypt it once a large quantum computer exists. It makes data with a long confidentiality lifetime vulnerable before such machines are built.`},{term:"Heisenberg uncertainty principle",see:"physics-intro",def:String.raw`A limit on how sharply two non-commuting observables can be simultaneously defined, for example $\Delta x\,\Delta p \ge \hbar/2$. It is a property of quantum states, not of measurement clumsiness.`},{term:"Hermitian",see:"linear-algebra",def:String.raw`Describes a matrix equal to its conjugate transpose, $A=A^\dagger$. Hermitian operators have real eigenvalues and orthogonal eigenvectors, which is why they represent observables.`},{term:"HHL algorithm",see:"complexity-roadmap",def:String.raw`A quantum algorithm by Harrow, Hassidim and Lloyd that prepares a state proportional to the solution of a sparse linear system $Ax=b$. It can be exponentially faster in the system size, but needs fast state loading, good conditioning, and returns only a quantum state rather than the full vector.`},{term:"Fault tolerance",see:"error-correction",def:String.raw`The design of quantum circuits so that individual component failures do not spread into uncorrectable errors. Together with error-correcting codes it allows arbitrarily long computations when error rates are below a threshold.`},{term:"Kraus operators",see:"measurement-noise",def:String.raw`A set of matrices $\{K_i\}$ with $\sum_i K_i^\dagger K_i = I$ that describes a noisy quantum operation as $\rho\mapsto\sum_i K_i\rho K_i^\dagger$. They are the standard way to write decoherence channels.`},{term:"Logical qubit",see:"error-correction",def:String.raw`A qubit encoded redundantly in many physical qubits so that errors can be detected and corrected. Its error rate can be far below that of the underlying hardware if the code is large enough and the physical error rate is low enough.`},{term:"Mach–Zehnder interferometer",see:"physics-intro",def:String.raw`An optical setup with two beam splitters and two paths, where the output port depends on the relative phase between the paths. For a single photon it is a clean physical model of a Hadamard, a phase shift, and another Hadamard.`},{term:"Magic state",see:"error-correction",def:String.raw`A special non-stabilizer state, such as $T|+\rangle$, that can be consumed to implement a non-Clifford gate in a fault-tolerant circuit. Producing high-quality magic states by distillation is expected to dominate the cost of large quantum computations.`},{term:"Measurement",see:"measurement-noise",def:String.raw`The process of extracting a classical result from a quantum system. The outcome is random with probabilities given by the Born rule, and the state afterwards is changed (collapsed) to be consistent with the result.`},{term:"Mixed state",see:"measurement-noise",def:String.raw`A state that represents classical uncertainty about which pure state a system is in, or entanglement with an unobserved system. It has a density matrix with $\mathrm{Tr}(\rho^2)<1$ and lies inside the Bloch sphere.`},{term:"NISQ",see:"variational",def:String.raw`Noisy Intermediate-Scale Quantum, a term coined by John Preskill for devices with tens to thousands of qubits and no full error correction. Algorithms for this era must tolerate noise and use shallow circuits.`},{term:"No-cloning theorem",see:"teleportation",def:String.raw`No physical process can copy an arbitrary unknown quantum state. It follows from the linearity of quantum mechanics and underlies both the security of quantum cryptography and the need for teleportation.`},{term:"NP",see:"complexity-roadmap",def:String.raw`The class of decision problems whose yes-answers have certificates checkable in polynomial time. Quantum computers are not believed to be able to solve NP-complete problems efficiently.`},{term:"Neutral atom qubit",see:"hardware-crypto",def:String.raw`A qubit stored in internal states of an uncharged atom held in an optical tweezer. Entangling gates use strong, short-range interactions between atoms excited to Rydberg states, and large reconfigurable arrays are possible.`},{term:"Observable",see:"measurement-noise",def:String.raw`A measurable physical quantity, represented by a Hermitian operator. Its eigenvalues are the possible outcomes, and its expectation value in state $|\psi\rangle$ is $\langle\psi|O|\psi\rangle$.`},{term:"OpenQASM",see:"circuit-model",def:String.raw`A text-based quantum assembly language for describing circuits, originally developed at IBM. It is widely used to exchange circuits between tools and to submit jobs to hardware.`},{term:"Oracle",see:"dj-bv",def:String.raw`A black-box unitary that encodes a function, typically $U_f|x\rangle|y\rangle = |x\rangle|y\oplus f(x)\rangle$. Algorithms are compared by how many times they must call it, which is called query complexity.`},{term:"Order finding",see:"shor",def:String.raw`The problem of finding the smallest $r>0$ with $a^r \equiv 1 \pmod N$. It is the quantum core of Shor's algorithm and is solved by phase estimation on the modular-multiplication unitary.`},{term:"Parameter-shift rule",see:"variational",def:String.raw`A way to compute exact gradients of a circuit's expectation value by running it at two shifted parameter values. For a gate $e^{-i\theta P/2}$ with Pauli $P$, $\partial_\theta \langle O\rangle = \tfrac12\left[\langle O\rangle_{\theta+\pi/2}-\langle O\rangle_{\theta-\pi/2}\right]$.`},{term:"Partial trace",see:"measurement-noise",def:String.raw`The operation that discards one subsystem of a composite state, giving the reduced density matrix of what remains: $\rho_A=\mathrm{Tr}_B\,\rho_{AB}$. Tracing out half of an entangled pair leaves a mixed state.`},{term:"Pauli matrices",see:"single-gates",def:String.raw`The three Hermitian, unitary $2\times2$ matrices $X$, $Y$ and $Z$ that, together with the identity, span all single-qubit operators. They satisfy $XY=iZ$ and anticommute pairwise.`},{term:"Phase gate",see:"single-gates",def:String.raw`A single-qubit gate $P(\varphi)=\mathrm{diag}(1,e^{i\varphi})$ that leaves $|0\rangle$ unchanged and multiplies $|1\rangle$ by a phase. Z, S and T are the cases $\varphi=\pi,\pi/2,\pi/4$.`},{term:"Phase kickback",see:"dj-bv",def:String.raw`The effect where a controlled operation on an eigenstate leaves the target unchanged but multiplies the control by the eigenvalue. It turns a bit-flip oracle into a phase oracle and powers quantum phase estimation.`},{term:"Photonic qubit",see:"hardware-crypto",def:String.raw`A qubit encoded in a degree of freedom of a single photon such as polarisation, path or time bin. Photons suffer little decoherence and travel well, which suits communication, but they interact weakly so two-qubit gates are hard.`},{term:"PennyLane",see:"variational",def:String.raw`An open-source Python library for quantum machine learning and variational algorithms that supports automatic differentiation through quantum circuits and many hardware back-ends.`},{term:"Post-quantum cryptography",see:"hardware-crypto",def:String.raw`Classical cryptographic schemes designed to resist attacks by quantum computers, based on problems such as lattices or hash functions that are not known to be easy for them. They run on ordinary hardware, unlike quantum key distribution.`},{term:"Projective measurement",see:"measurement-noise",def:String.raw`A measurement described by orthogonal projectors $P_i$ summing to the identity. Outcome $i$ occurs with probability $\langle\psi|P_i|\psi\rangle$ and leaves the state $P_i|\psi\rangle$ renormalised.`},{term:"Purity",see:"measurement-noise",def:String.raw`The quantity $\mathrm{Tr}(\rho^2)$, which equals 1 for pure states and $1/d$ for the maximally mixed state of dimension $d$. It measures how mixed a state is.`},{term:"QAOA",see:"variational",def:String.raw`The Quantum Approximate Optimization Algorithm of Farhi, Goldstone and Gutmann. It alternates $p$ layers of a problem-Hamiltonian phase rotation and a mixing rotation, with angles tuned classically to make low-cost bit strings likely.`},{term:"QBER",see:"hardware-crypto",def:String.raw`The quantum bit error rate: the fraction of sifted key bits on which the two parties disagree. A high value in a protocol such as BB84 signals noise or eavesdropping, and above a threshold no secure key can be distilled.`},{term:"QKD",see:"hardware-crypto",def:String.raw`Quantum key distribution: a method for two parties to establish a shared secret key whose security rests on quantum mechanics, because eavesdropping disturbs the transmitted states. It still needs an authenticated classical channel.`},{term:"QMA",see:"complexity-roadmap",def:String.raw`Quantum Merlin–Arthur: the quantum analogue of NP, where a quantum verifier checks a quantum proof state in polynomial time. The local Hamiltonian problem is QMA-complete.`},{term:"Qiskit",see:"hardware-crypto",def:String.raw`An open-source Python software development kit from IBM for building circuits, transpiling them, simulating them and running them on quantum hardware.`},{term:"Quantum advantage",see:"complexity-roadmap",def:String.raw`A demonstration that a quantum device solves some task faster or better than the best known classical method. The term "quantum supremacy" is used for the same milestone on tasks chosen mainly for being hard to simulate.`},{term:"Quantum error correction",see:"error-correction",def:String.raw`Encoding quantum information redundantly across many physical qubits so errors can be detected through syndrome measurements and undone without measuring the data itself. It evades the no-cloning obstacle by using entangled encodings rather than copies.`},{term:"Quantum Fourier transform",see:"qft-qpe",def:String.raw`The unitary $|x\rangle \mapsto N^{-1/2}\sum_y e^{2\pi i xy/N}|y\rangle$, the quantum analogue of the discrete Fourier transform. It can be implemented with $O(n^2)$ gates on $n$ qubits, versus $O(n2^n)$ operations for the classical FFT on $2^n$ points.`},{term:"Quantum kernel",see:"variational",def:String.raw`A similarity function $k(x,x')=|\langle\phi(x)|\phi(x')\rangle|^2$ between data points embedded as quantum states. It is estimated on a quantum device and fed to a classical kernel method such as a support vector machine.`},{term:"Quantum reservoir computing",see:"reservoir",def:String.raw`A machine-learning scheme in which input data drives a fixed, complex quantum system and only a simple classical readout layer is trained on measured observables. It avoids training the quantum part, which sidesteps gradient problems such as barren plateaus.`},{term:"Quantum simulation",see:"complexity-roadmap",def:String.raw`Using a controllable quantum system to reproduce the behaviour of another quantum system, such as a molecule or material. It was Feynman's original motivation for quantum computers and is expected to be one of their first useful applications.`},{term:"Quantum supremacy",see:"complexity-roadmap",def:String.raw`The point at which a quantum device performs a computation that no classical computer can do in feasible time, regardless of usefulness. Google's 2019 random-circuit-sampling experiment claimed it, a claim that classical simulation has since challenged.`},{term:"Quantum volume",see:"hardware-crypto",def:String.raw`A single-number benchmark from IBM that captures the largest random square circuit (equal width and depth) a device can run successfully. It combines qubit count, connectivity and gate error into one figure of merit, $2^n$.`},{term:"Quantum walk",see:"complexity-roadmap",def:String.raw`The quantum analogue of a random walk, in which a walker in superposition evolves unitarily over a graph. Interference makes it spread ballistically on a line and underlies several quantum speed-ups, including search on graphs.`},{term:"Qubit",see:"qubit-bloch",def:String.raw`The basic unit of quantum information: a two-level quantum system whose state is $\alpha|0\rangle+\beta|1\rangle$ with $|\alpha|^2+|\beta|^2=1$. Unlike a bit it can be in a superposition, but a measurement still returns only 0 or 1.`},{term:"Rabi oscillation",see:"hardware-crypto",def:String.raw`The periodic swapping of population between two levels of a system driven by a resonant field. Varying the pulse length rotates the qubit around the Bloch sphere and is how single-qubit gates are calibrated.`},{term:"Ramsey experiment",see:"hardware-crypto",def:String.raw`A sequence of two $\pi/2$ pulses separated by a free-evolution time that measures the qubit's frequency and its dephasing time $T_2^*$. The fringes' decay shows how fast phase information is lost.`},{term:"Readout error",see:"measurement-noise",def:String.raw`The probability that a measurement reports the wrong bit, for instance returning 0 for a qubit that was in $|1\rangle$. It is often characterised by a confusion matrix and can be partly corrected in post-processing.`},{term:"Relative phase",see:"qubit-bloch",def:String.raw`The phase difference between components of a superposition, such as $\phi$ in $(|0\rangle+e^{i\phi}|1\rangle)/\sqrt2$. Unlike global phase it is physical: it sets the azimuth on the Bloch sphere and drives interference.`},{term:"Rotation gates (Rx, Ry, Rz)",see:"single-gates",def:String.raw`The single-qubit gates $R_n(\theta)=e^{-i\theta\sigma_n/2}$ that rotate the Bloch vector by angle $\theta$ about the X, Y or Z axis. Any single-qubit unitary is a product of such rotations, up to a global phase.`},{term:"S gate",see:"single-gates",def:String.raw`The phase gate $S=\mathrm{diag}(1,i)$, a quarter-turn about the Z axis of the Bloch sphere. It satisfies $S^2=Z$ and is a Clifford gate.`},{term:"Schrödinger equation",see:"physics-intro",def:String.raw`The equation $i\hbar\,\partial_t|\psi\rangle = H|\psi\rangle$ that governs how an isolated quantum state evolves. For a time-independent Hamiltonian its solution is the unitary $U(t)=e^{-iHt/\hbar}$.`},{term:"Shor algorithm",see:"shor",def:String.raw`A quantum algorithm for integer factoring that runs in time polynomial in $\log N$. It reduces factoring to order finding and solves that with the quantum Fourier transform, breaking RSA if large enough machines exist.`},{term:"Shots",see:"measurement-noise",def:String.raw`The number of times a circuit is run and measured to gather statistics. Estimating a probability to accuracy $\varepsilon$ takes on the order of $1/\varepsilon^2$ shots.`},{term:"Simon algorithm",see:"dj-bv",def:String.raw`A quantum algorithm that finds the hidden XOR mask $s$ of a function with $f(x)=f(x\oplus s)$ in $O(n)$ queries, where classical algorithms need exponentially many. It was the inspiration for Shor's algorithm.`},{term:"Solovay–Kitaev theorem",see:"circuit-model",def:String.raw`A result that any single-qubit gate can be approximated to accuracy $\varepsilon$ using only $O(\log^c(1/\varepsilon))$ gates from a finite universal set (with $c\approx 2$ to $4$). It shows that using a finite gate set costs only polylogarithmic overhead.`},{term:"Spin qubit",see:"hardware-crypto",def:String.raw`A qubit encoded in the spin of an electron or nucleus, for example in a silicon quantum dot or a diamond defect. It benefits from small size and compatibility with semiconductor fabrication.`},{term:"Stabilizer",see:"error-correction",def:String.raw`A Pauli operator that leaves a code state unchanged (eigenvalue $+1$). A stabilizer code is defined by a commuting group of such operators, and measuring them reveals errors without disturbing the encoded information.`},{term:"Stern–Gerlach experiment",see:"physics-intro",def:String.raw`A 1922 experiment in which silver atoms passing through an inhomogeneous magnetic field split into two discrete beams. It revealed that spin is quantised, and sequences of such measurements along different axes show that spin components are incompatible.`},{term:"Superdense coding",see:"teleportation",def:String.raw`A protocol that sends two classical bits by transmitting one qubit, using a pre-shared Bell pair. The sender applies one of $I,X,Z,XZ$ to her half and the receiver performs a Bell measurement.`},{term:"Superposition",see:"qubit-bloch",def:String.raw`A state that is a weighted sum of basis states, such as $\alpha|0\rangle+\beta|1\rangle$. It is not a classical mixture, since the complex weights can interfere constructively or destructively.`},{term:"SWAP gate",see:"multi-qubit",def:String.raw`A two-qubit gate that exchanges the states of the two qubits, $|a,b\rangle\mapsto|b,a\rangle$. It can be built from three CNOTs.`},{term:"SWAP overhead",see:"hardware-crypto",def:String.raw`The extra SWAP gates a compiler must insert to bring non-adjacent qubits together on a device with limited connectivity. Each SWAP costs three CNOTs, so poor connectivity can multiply circuit depth and error.`},{term:"Syndrome",see:"error-correction",def:String.raw`The pattern of stabilizer measurement results that indicates which error, if any, has occurred. A decoder uses it to choose a correction without learning the encoded data.`},{term:"T1 time",see:"measurement-noise",def:String.raw`The energy-relaxation time: the characteristic time for an excited qubit in $|1\rangle$ to decay to $|0\rangle$, with population decaying as $e^{-t/T_1}$. It limits how long a qubit can store information.`},{term:"T2 time",see:"measurement-noise",def:String.raw`The dephasing (coherence) time over which the phase relationship in a superposition is lost, with coherence decaying as $e^{-t/T_2}$. It always satisfies $T_2\le 2T_1$.`},{term:"T gate",see:"single-gates",def:String.raw`The phase gate $T=\mathrm{diag}(1,e^{i\pi/4})$, an eighth-turn about Z with $T^2=S$. It is not a Clifford gate and, added to the Clifford gates, gives a universal set.`},{term:"Teleportation",see:"teleportation",def:String.raw`A protocol that transfers an unknown qubit state to a distant party using a shared Bell pair, a Bell measurement and two classical bits. The original is destroyed in the process, so no cloning occurs and nothing travels faster than light.`},{term:"Tensor product",see:"multi-qubit",def:String.raw`The operation $\otimes$ that combines separate systems into one joint system, so $n$ qubits have a $2^n$-dimensional state space. States of the form $|a\rangle\otimes|b\rangle$ are called product states; everything else is entangled.`},{term:"Threshold theorem",see:"error-correction",def:String.raw`The result that if the error rate per physical operation is below a constant threshold, quantum computations of any length can be performed reliably with only polylogarithmic overhead. Estimated thresholds for the surface code are around $1\%$.`},{term:"Toffoli gate",see:"multi-qubit",def:String.raw`The controlled-controlled-NOT, which flips a target qubit only if both controls are $|1\rangle$. It is universal for reversible classical computation and appears in oracles and arithmetic circuits.`},{term:"Topological qubit",see:"hardware-crypto",def:String.raw`A proposed qubit that stores information non-locally in the global properties of exotic quasiparticles such as anyons, so that local noise cannot easily corrupt it. Experimental realisation of such qubits remains an active area of research.`},{term:"Transmon",see:"hardware-crypto",def:String.raw`The most common superconducting qubit: a Josephson-junction circuit shunted by a large capacitor, which makes it insensitive to charge noise. Its two lowest energy levels, typically near 5 GHz, serve as the qubit and are controlled with microwave pulses.`},{term:"Transpilation",see:"hardware-crypto",def:String.raw`The compilation step that rewrites a circuit into the native gates and connectivity of a specific device, while optimising depth and gate count. It includes qubit mapping and routing with SWAPs.`},{term:"Trapped ion qubit",see:"hardware-crypto",def:String.raw`A qubit stored in internal electronic states of an atomic ion confined by electromagnetic fields and manipulated with lasers or microwaves. Trapped ions have long coherence times and high gate fidelities, but gates are comparatively slow.`},{term:"Trotterization",see:"complexity-roadmap",def:String.raw`An approximation of time evolution under a Hamiltonian $H=\sum_k H_k$ by repeating short steps, $e^{-iHt}\approx\left(\prod_k e^{-iH_k t/n}\right)^n$. The error shrinks as the number of steps $n$ grows, at the price of deeper circuits.`},{term:"Tsirelson bound",see:"entanglement",def:String.raw`The maximum value, $2\sqrt{2}$, that the CHSH expression can take in quantum mechanics. It lies between the local-hidden-variable limit of 2 and the algebraic maximum of 4 allowed by no-signalling alone.`},{term:"Unitary",see:"linear-algebra",def:String.raw`A matrix $U$ with $U^\dagger U=I$, so it preserves lengths and inner products. Every closed-system quantum evolution and every quantum gate is unitary, which makes it reversible.`},{term:"U3 gate",see:"single-gates",def:String.raw`A general single-qubit gate with three angles, $U(\theta,\phi,\lambda)$, that can produce any single-qubit unitary up to a global phase. It is equivalent to $R_z(\phi)R_y(\theta)R_z(\lambda)$ up to a global phase.`},{term:"Universal gate set",see:"circuit-model",def:String.raw`A set of gates from which any unitary can be approximated to arbitrary accuracy. A standard example is {H, T, CNOT}; the Solovay–Kitaev theorem says the approximation is efficient.`},{term:"Variational quantum eigensolver (VQE)",see:"variational",def:String.raw`A hybrid algorithm that estimates a Hamiltonian's ground-state energy by preparing a parameterised state on a quantum device and having a classical optimiser lower the measured energy. By the variational principle, the energy is always an upper bound on the true ground energy.`},{term:"W state",see:"entanglement",def:String.raw`The three-qubit entangled state $(|001\rangle+|010\rangle+|100\rangle)/\sqrt3$, with a single excitation shared among all qubits. Unlike GHZ, it stays entangled when one qubit is lost.`},{term:"X gate",see:"single-gates",def:String.raw`The Pauli-X (NOT) gate $\begin{pmatrix}0&1\\1&0\end{pmatrix}$ that swaps $|0\rangle$ and $|1\rangle$. On the Bloch sphere it is a half-turn about the X axis.`},{term:"Y gate",see:"single-gates",def:String.raw`The Pauli-Y gate $\begin{pmatrix}0&-i\\i&0\end{pmatrix}$, a half-turn about the Y axis that maps $|0\rangle\mapsto i|1\rangle$ and $|1\rangle\mapsto -i|0\rangle$. It equals $iXZ$.`},{term:"Z gate",see:"single-gates",def:String.raw`The Pauli-Z gate $\mathrm{diag}(1,-1)$ that leaves $|0\rangle$ alone and flips the sign of $|1\rangle$. On the Bloch sphere it is a half-turn about the Z axis, turning $|+\rangle$ into $|-\rangle$.`},{term:"Zero-noise extrapolation (ZNE)",see:"variational",def:String.raw`An error-mitigation technique that deliberately amplifies noise (for example by gate folding), measures an observable at several noise levels, and extrapolates back to the zero-noise value.`},{term:"Probabilistic error cancellation (PEC)",see:"variational",def:String.raw`An error-mitigation technique that represents the ideal operation as a quasi-probabilistic combination of noisy operations and samples from it. It gives unbiased estimates but the sampling cost grows exponentially with circuit size.`},{term:"Surface code",see:"error-correction",def:String.raw`A leading quantum error-correcting code that places qubits on a 2D grid and measures local X-type and Z-type stabilizers. It has a high threshold (around $1\%$) and needs only nearest-neighbour interactions, but uses many physical qubits per logical qubit.`},{term:"Cryostat (dilution refrigerator)",see:"hardware-crypto",def:String.raw`A cooling system that reaches temperatures of roughly 10 millikelvin by circulating a helium-3/helium-4 mixture. Superconducting and spin qubits run inside it so that thermal noise does not swamp their tiny energy scales.`},{term:"Query complexity",see:"dj-bv",def:String.raw`The number of calls an algorithm makes to an oracle, regardless of other computation. It is used to prove clean separations such as Grover's $O(\sqrt N)$ against the classical $\Omega(N)$.`},{term:"Quantum phase estimation (QPE)",see:"qft-qpe",def:String.raw`An algorithm that estimates the eigenphase $\varphi$ in $U|u\rangle=e^{2\pi i\varphi}|u\rangle$ to $n$ bits of precision. It uses $n$ control qubits, controlled powers of $U$, and an inverse quantum Fourier transform.`},{term:"Pure state",see:"qubit-bloch",def:String.raw`A state described by a single state vector $|\psi\rangle$, with full knowledge of the preparation. On the Bloch sphere it lies on the surface, and its density matrix is $|\psi\rangle\langle\psi|$.`},{term:"Unitary evolution",see:"physics-intro",def:String.raw`The reversible, norm-preserving change of a closed quantum state, $|\psi\rangle\mapsto U|\psi\rangle$. Measurement is the only step in the standard circuit model that is not unitary.`},{term:"Phase",see:"qubit-bloch",def:String.raw`The angle $\varphi$ in a complex amplitude $re^{i\varphi}$. It cannot be seen in a single measurement but controls interference, which is the source of quantum speed-ups.`},{term:"Hilbert space",see:"linear-algebra",def:String.raw`A complex vector space with an inner product, in which quantum states live. A system of $n$ qubits has the Hilbert space $\mathbb{C}^{2^n}$.`},{term:"Bra–ket notation",see:"complex-vectors",def:String.raw`Dirac's notation in which $|\psi\rangle$ is a column vector and $\langle\psi|$ its conjugate transpose. The inner product is written $\langle\phi|\psi\rangle$ and the outer product $|\psi\rangle\langle\phi|$.`},{term:"Bit flip and phase flip",see:"error-correction",def:String.raw`The two basic qubit errors, applying X or Z respectively. Together with Y they span all single-qubit errors, so a code that corrects X and Z errors corrects any error on a qubit.`},{term:"Expectation value",see:"measurement-noise",def:String.raw`The average result of measuring an observable many times on identical states, $\langle O\rangle=\langle\psi|O|\psi\rangle=\mathrm{Tr}(\rho O)$. Variational algorithms estimate it from repeated shots.`},{term:"Gottesman–Knill theorem",see:"error-correction",def:String.raw`A theorem stating that circuits made only of stabilizer states, Clifford gates and Pauli measurements can be simulated efficiently on a classical computer. Entanglement alone is therefore not enough for quantum speed-up.`},{term:"Reversible computation",see:"circuit-model",def:String.raw`Computation in which every step can be undone, so no information is erased. Quantum gates are reversible, so classical functions must be embedded in oracles such as $|x,y\rangle\mapsto|x,y\oplus f(x)\rangle$.`},{term:"Hybrid quantum-classical algorithm",see:"variational",def:String.raw`An algorithm that splits work between a quantum processor, which prepares and measures states, and a classical computer, which processes results and updates parameters. VQE and QAOA are standard examples.`},{term:"Dephasing",see:"measurement-noise",def:String.raw`Noise that randomises the relative phase of a superposition without changing populations. On the Bloch sphere it shrinks the vector's X and Y components toward the Z axis, and it is characterised by $T_2$.`},{term:"Amplitude damping",see:"measurement-noise",def:String.raw`A noise channel modelling energy loss, in which $|1\rangle$ decays to $|0\rangle$ with some probability. It is the Kraus-operator description of $T_1$ relaxation.`},{term:"Gate fidelity",see:"measurement-noise",def:String.raw`A measure of how closely a physical gate implements its ideal unitary, averaged over input states. Current best two-qubit gate fidelities on leading platforms exceed 99%.`},{term:"Swap test",see:"circuit-model",def:String.raw`A circuit using a Hadamard, a controlled-SWAP and a second Hadamard on an ancilla qubit to estimate the overlap of two states. The ancilla reads 0 with probability $\tfrac12 + \tfrac12|\langle\phi|\psi\rangle|^2$.`},{term:"Ancilla",see:"circuit-model",def:String.raw`An auxiliary qubit used as workspace, for example to hold syndrome results, to implement phase kickback, or to build a gate from simpler ones. Ancillas are usually returned to a known state at the end.`},{term:"Wave function collapse",see:"measurement-noise",def:String.raw`The update rule by which a measured state is replaced with the eigenstate matching the observed result. Whether it is a physical process is debated across interpretations, but it correctly predicts repeated-measurement statistics.`},{term:"Schmidt decomposition",see:"entanglement",def:String.raw`A way of writing any bipartite pure state as $\sum_i \lambda_i |a_i\rangle|b_i\rangle$ with orthonormal sets and nonnegative $\lambda_i$. The state is entangled exactly when more than one $\lambda_i$ is nonzero.`},{term:"Entanglement entropy",see:"entanglement",def:String.raw`The von Neumann entropy $S(\rho_A)=-\mathrm{Tr}(\rho_A\log_2\rho_A)$ of one half of a pure bipartite state. It is zero for product states and one bit for a Bell pair.`},{term:"Bell measurement",see:"teleportation",def:String.raw`A joint measurement of two qubits in the Bell basis, done by a CNOT, a Hadamard and computational-basis readout. It is the key step in teleportation and superdense decoding.`},{term:"Quantum teleportation resource count",see:"teleportation",def:String.raw`Teleporting one qubit consumes one Bell pair and sends two classical bits. Neither resource alone can carry the state, so classical communication is essential.`},{term:"Variational principle",see:"variational",def:String.raw`The fact that for any state $|\psi\rangle$ the energy $\langle\psi|H|\psi\rangle$ is at least the ground-state energy $E_0$. It justifies minimising a measured energy to approach the ground state.`},{term:"Pauli string",see:"variational",def:String.raw`A tensor product of Pauli matrices and identities acting on many qubits, such as $X\otimes I\otimes Z$. Hamiltonians are usually decomposed into weighted sums of Pauli strings so their expectation values can be measured.`},{term:"Jordan–Wigner transformation",see:"variational",def:String.raw`A mapping that rewrites fermionic creation and annihilation operators as strings of Pauli operators on qubits. It lets molecular Hamiltonians be simulated on a qubit-based device.`},{term:"Grover diffusion operator",see:"grover",def:String.raw`The reflection $2|s\rangle\langle s|-I$ about the uniform superposition $|s\rangle$, often called inversion about the mean. Combined with the oracle's phase flip, it rotates the state toward the marked item by a fixed angle each iteration.`},{term:"Period finding",see:"shor",def:String.raw`The task of finding the hidden period $r$ of a function with $f(x)=f(x+r)$. Quantum computers solve it efficiently with the quantum Fourier transform, while no efficient classical method is known for the functions used in Shor's algorithm.`},{term:"RSA",see:"hardware-crypto",def:String.raw`A public-key cryptosystem whose security rests on the difficulty of factoring a product of two large primes. Shor's algorithm would break it on a large fault-tolerant quantum computer.`},{term:"Reservoir computing",see:"reservoir",def:String.raw`A machine-learning approach in which a fixed, randomly connected dynamical system (the reservoir) maps inputs into a high-dimensional state, and only a linear readout is trained. It is well suited to time-series tasks.`}],F=[...Ye].sort((t,a)=>t.term.toLowerCase().localeCompare(a.term.toLowerCase())),Ue=[{title:"Pauli & single-qubit gates",items:[{label:"Identity I",tex:String.raw`I=\begin{bmatrix}1&0\\0&1\end{bmatrix}`},{label:"Pauli X (NOT)",tex:String.raw`X=\begin{bmatrix}0&1\\1&0\end{bmatrix}`,note:"Bit flip: |0> <-> |1>."},{label:"Pauli Y",tex:String.raw`Y=\begin{bmatrix}0&-i\\i&0\end{bmatrix}`},{label:"Pauli Z",tex:String.raw`Z=\begin{bmatrix}1&0\\0&-1\end{bmatrix}`,note:"Phase flip."},{label:"Hadamard H",tex:String.raw`H=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}`,note:"Swaps the Z and X bases."},{label:"Phase S",tex:String.raw`S=\begin{bmatrix}1&0\\0&i\end{bmatrix}=\sqrt{Z}`},{label:"T gate",tex:String.raw`T=\begin{bmatrix}1&0\\0&e^{i\pi/4}\end{bmatrix}=\sqrt{S}`},{label:"S dagger",tex:String.raw`S^\dagger=\begin{bmatrix}1&0\\0&-i\end{bmatrix}`},{label:"T dagger",tex:String.raw`T^\dagger=\begin{bmatrix}1&0\\0&e^{-i\pi/4}\end{bmatrix}`},{label:"Square root of X",tex:String.raw`\sqrt{X}=\frac{1}{2}\begin{bmatrix}1+i&1-i\\1-i&1+i\end{bmatrix}`},{label:"Rx(θ)",tex:String.raw`R_x(\theta)=e^{-i\theta X/2}=\begin{bmatrix}\cos\frac\theta2&-i\sin\frac\theta2\\-i\sin\frac\theta2&\cos\frac\theta2\end{bmatrix}`},{label:"Ry(θ)",tex:String.raw`R_y(\theta)=e^{-i\theta Y/2}=\begin{bmatrix}\cos\frac\theta2&-\sin\frac\theta2\\\sin\frac\theta2&\cos\frac\theta2\end{bmatrix}`},{label:"Rz(θ)",tex:String.raw`R_z(\theta)=e^{-i\theta Z/2}=\begin{bmatrix}e^{-i\theta/2}&0\\0&e^{i\theta/2}\end{bmatrix}`},{label:"Phase gate P(φ)",tex:String.raw`P(\varphi)=\begin{bmatrix}1&0\\0&e^{i\varphi}\end{bmatrix}`,note:"Z = P(π), S = P(π/2), T = P(π/4)."},{label:"General U(θ,φ,λ)",tex:String.raw`U(\theta,\varphi,\lambda)=\begin{bmatrix}\cos\frac\theta2&-e^{i\lambda}\sin\frac\theta2\\e^{i\varphi}\sin\frac\theta2&e^{i(\varphi+\lambda)}\cos\frac\theta2\end{bmatrix}`,note:"Any single-qubit unitary up to global phase."}]},{title:"Two- and three-qubit gates",items:[{label:"CNOT (control first)",tex:String.raw`\mathrm{CNOT}=\begin{bmatrix}1&0&0&0\\0&1&0&0\\0&0&0&1\\0&0&1&0\end{bmatrix}`,note:String.raw`|a,b> -> |a, a xor b>.`},{label:"CZ",tex:String.raw`\mathrm{CZ}=\mathrm{diag}(1,1,1,-1)`,note:"Symmetric in its two qubits."},{label:"SWAP",tex:String.raw`\mathrm{SWAP}=\begin{bmatrix}1&0&0&0\\0&0&1&0\\0&1&0&0\\0&0&0&1\end{bmatrix}`},{label:"iSWAP",tex:String.raw`\mathrm{iSWAP}=\begin{bmatrix}1&0&0&0\\0&0&i&0\\0&i&0&0\\0&0&0&1\end{bmatrix}`},{label:"Controlled phase CP(φ)",tex:String.raw`\mathrm{CP}(\varphi)=\mathrm{diag}(1,1,1,e^{i\varphi})`},{label:"Controlled Rz",tex:String.raw`\mathrm{CR}_z(\theta)=\mathrm{diag}(1,1,e^{-i\theta/2},e^{i\theta/2})`},{label:"Toffoli (CCNOT)",tex:String.raw`|a,b,c\rangle\mapsto|a,b,c\oplus ab\rangle`,note:"Flips the target only when both controls are 1; universal for classical reversible logic."},{label:"Fredkin (CSWAP)",tex:String.raw`|0,b,c\rangle\mapsto|0,b,c\rangle,\quad |1,b,c\rangle\mapsto|1,c,b\rangle`,note:"Swaps the two targets when the control is 1."}]},{title:"States",items:[{label:"|0>",tex:String.raw`|0\rangle=\begin{bmatrix}1\\0\end{bmatrix}`},{label:"|1>",tex:String.raw`|1\rangle=\begin{bmatrix}0\\1\end{bmatrix}`},{label:"|+>",tex:String.raw`|+\rangle=\frac{|0\rangle+|1\rangle}{\sqrt2}`},{label:"|−>",tex:String.raw`|-\rangle=\frac{|0\rangle-|1\rangle}{\sqrt2}`},{label:"|+i>",tex:String.raw`|{+i}\rangle=\frac{|0\rangle+i|1\rangle}{\sqrt2}`},{label:"|−i>",tex:String.raw`|{-i}\rangle=\frac{|0\rangle-i|1\rangle}{\sqrt2}`},{label:"Bell state Φ+",tex:String.raw`|\Phi^+\rangle=\frac{|00\rangle+|11\rangle}{\sqrt2}`},{label:"Bell state Φ−",tex:String.raw`|\Phi^-\rangle=\frac{|00\rangle-|11\rangle}{\sqrt2}`},{label:"Bell state Ψ+",tex:String.raw`|\Psi^+\rangle=\frac{|01\rangle+|10\rangle}{\sqrt2}`},{label:"Bell state Ψ−",tex:String.raw`|\Psi^-\rangle=\frac{|01\rangle-|10\rangle}{\sqrt2}`,note:"The singlet."},{label:"GHZ state",tex:String.raw`|\mathrm{GHZ}_n\rangle=\frac{|0\rangle^{\otimes n}+|1\rangle^{\otimes n}}{\sqrt2}`},{label:"W state (n=3)",tex:String.raw`|W\rangle=\frac{|001\rangle+|010\rangle+|100\rangle}{\sqrt3}`}]},{title:"Identities",items:[{label:"HZH = X",tex:String.raw`HZH=X`},{label:"HXH = Z",tex:String.raw`HXH=Z`},{label:"HYH = −Y",tex:String.raw`HYH=-Y`},{label:"XY = iZ",tex:String.raw`XY=iZ,\quad YZ=iX,\quad ZX=iY`},{label:"S² = Z",tex:String.raw`S^2=Z`},{label:"T² = S",tex:String.raw`T^2=S`},{label:"Reversed CNOT",tex:String.raw`(H\otimes H)\,\mathrm{CNOT}_{1\to2}\,(H\otimes H)=\mathrm{CNOT}_{2\to1}`,note:"Control and target swap roles."},{label:"CZ from CNOT and H",tex:String.raw`\mathrm{CZ}=(I\otimes H)\,\mathrm{CNOT}\,(I\otimes H)`},{label:"Pauli commutators",tex:String.raw`[X,Y]=2iZ,\quad [Y,Z]=2iX,\quad [Z,X]=2iY`,note:"Distinct Paulis anticommute: {X,Y}=0."},{label:"Pauli squares",tex:String.raw`X^2=Y^2=Z^2=I`},{label:"Rotation about axis n",tex:String.raw`e^{-i\theta\,\hat n\cdot\vec\sigma/2}=\cos\frac\theta2\,I-i\sin\frac\theta2\,(n_xX+n_yY+n_zZ)`,note:String.raw`n is a unit vector.`}]},{title:"Measurement & probability",items:[{label:"Born rule",tex:String.raw`p(i)=|\langle i|\psi\rangle|^2`,note:"Probability of outcome i in an orthonormal basis."},{label:"Expectation value",tex:String.raw`\langle A\rangle=\langle\psi|A|\psi\rangle=\mathrm{Tr}(\rho A)`},{label:"Collapse",tex:String.raw`|\psi\rangle\to\frac{P_i|\psi\rangle}{\sqrt{\langle\psi|P_i|\psi\rangle}}`,note:"P_i is the projector onto outcome i."},{label:"Density matrix",tex:String.raw`\rho=\sum_k p_k|\psi_k\rangle\langle\psi_k|,\quad \rho\ge0,\ \mathrm{Tr}\rho=1`},{label:"Purity",tex:String.raw`\gamma=\mathrm{Tr}(\rho^2)\in[1/d,\,1]`,note:"Equals 1 exactly for pure states."},{label:"Bloch vector from ρ",tex:String.raw`\rho=\frac{1}{2}\left(I+\vec r\cdot\vec\sigma\right),\quad r_k=\mathrm{Tr}(\rho\,\sigma_k),\quad |\vec r|\le1`}]},{title:"Algorithms at a glance",items:[{label:"Deutsch–Jozsa",tex:String.raw`1\ \text{query (quantum) vs } 2^{n-1}+1\ \text{(classical, deterministic)}`},{label:"Bernstein–Vazirani",tex:String.raw`1\ \text{query (quantum) vs } n\ \text{(classical)}`},{label:"Grover search",tex:String.raw`O(\sqrt{N})\ \text{queries; about } \tfrac{\pi}{4}\sqrt{N/M}\ \text{iterations for } M\ \text{marked items}`},{label:"QFT",tex:String.raw`O(n^2)\ \text{gates on } n\ \text{qubits (vs } O(n2^n)\ \text{for the classical FFT)}`},{label:"Phase estimation",tex:String.raw`n\ \text{bits of phase using } O(2^n)\ \text{controlled-}U\ \text{applications plus an inverse QFT}`},{label:"Shor factoring",tex:String.raw`O\!\left((\log N)^3\right)\ \text{gates, versus sub-exponential classical (number field sieve)}`}]},{title:"Constants",items:[{label:"Reduced Planck constant ħ",tex:String.raw`\hbar=1.054\,571\,817\times10^{-34}\ \mathrm{J\,s}`},{label:"Planck constant h",tex:String.raw`h=2\pi\hbar=6.626\,070\,15\times10^{-34}\ \mathrm{J\,s}`,note:"Exact in the 2019 SI."},{label:"Boltzmann constant k_B",tex:String.raw`k_B=1.380\,649\times10^{-23}\ \mathrm{J/K}`,note:"Exact in the 2019 SI."}]}],Le=[{title:"Quantum Computation and Quantum Information",by:"Michael A. Nielsen & Isaac L. Chuang",kind:"book",level:"intermediate",why:"The standard graduate-level reference; covers the circuit model, algorithms, error correction and information theory."},{title:"Quantum Computer Science: An Introduction",by:"N. David Mermin",kind:"book",level:"beginner",why:"A short, clear and rigorous introduction aimed at computer scientists with little physics background."},{title:"Quantum Computing Since Democritus",by:"Scott Aaronson",kind:"book",level:"beginner",why:"Witty, idea-driven tour of computability, complexity and quantum mechanics."},{title:"An Introduction to Quantum Computing",by:"Phillip Kaye, Raymond Laflamme & Michele Mosca",kind:"book",level:"intermediate",why:"A compact textbook with careful derivations of the major algorithms."},{title:"Quantum Mechanics: The Theoretical Minimum",by:"Leonard Susskind & Art Friedman",kind:"book",level:"beginner",why:"Gentle introduction to the mathematics of quantum mechanics for self-learners."},{title:"The Theory of Quantum Information",by:"John Watrous",kind:"book",level:"advanced",why:"Rigorous mathematical treatment of quantum states, channels and entanglement.",url:"https://cs.uwaterloo.ca/~watrous/TQI/"},{title:"Quantum Information Theory",by:"Mark M. Wilde",kind:"book",level:"advanced",why:"Comprehensive treatment of entropy, channel capacities and coding theorems."},{title:"Quantum Computing: An Applied Approach",by:"Jack D. Hidary",kind:"book",level:"intermediate",why:"Code-oriented introduction that connects the theory to programming exercises."},{title:"Physics 219 Lecture Notes: Quantum Information and Computation",by:"John Preskill",kind:"notes",level:"advanced",why:"Caltech notes with deep coverage of error correction, fault tolerance and quantum information.",url:"https://theory.caltech.edu/~preskill/ph219/"},{title:"Introduction to Quantum Information Science (lecture notes)",by:"Scott Aaronson",kind:"notes",level:"intermediate",why:"University of Texas course notes that build the subject from the ground up with a complexity-theory viewpoint."},{title:"Quantum Mechanics and Quantum Computation (CS 191)",by:"Umesh Vazirani",kind:"course",level:"beginner",why:"Berkeley lectures, also released online, that start from scratch and reach Shor and quantum complexity."},{title:"IBM Quantum Learning",by:"IBM Quantum",kind:"course",level:"beginner",why:"Free interactive courses on quantum basics, algorithms and Qiskit, with runnable code.",url:"https://quantum.cloud.ibm.com/learning"},{title:"Quantum Country",by:"Andy Matuschak & Michael Nielsen",kind:"course",level:"beginner",why:"An essay-style introduction with embedded spaced-repetition prompts so the material sticks.",url:"https://quantum.country"},{title:"PennyLane Codebook",by:"Xanadu",kind:"course",level:"beginner",why:"Interactive problem sets that teach quantum computing by writing code.",url:"https://codebook.xanadu.ai"},{title:"PennyLane Demos",by:"Xanadu",kind:"course",level:"intermediate",why:"Worked tutorials on variational circuits, quantum machine learning and chemistry.",url:"https://pennylane.ai/qml"},{title:"Qiskit",by:"IBM Quantum",kind:"software",level:"beginner",why:"Widely used Python SDK for building circuits, simulating them and running on real hardware."},{title:"Cirq",by:"Google Quantum AI",kind:"software",level:"intermediate",why:"Python framework suited to NISQ circuits and hardware-aware programming; well documented.",url:"https://quantumai.google/cirq"},{title:"PennyLane",by:"Xanadu",kind:"software",level:"intermediate",why:"Differentiable programming library for variational algorithms and hybrid quantum-classical models.",url:"https://pennylane.ai"},{title:"Quirk",by:"Craig Gidney",kind:"software",level:"beginner",why:"Drag-and-drop browser circuit simulator that shows amplitudes and Bloch spheres live.",url:"https://algassert.com/quirk"},{title:"QuTiP: Quantum Toolbox in Python",by:"QuTiP developers",kind:"software",level:"advanced",why:"Simulation of open quantum systems, master equations and dynamics.",url:"https://qutip.org"},{title:"Stim: A fast stabilizer circuit simulator",by:"Craig Gidney",kind:"paper",level:"advanced",why:"Describes the Clifford simulator widely used to study quantum error-correcting codes.",url:"https://arxiv.org/abs/2103.02202"},{title:"Simulating Physics with Computers",by:"Richard P. Feynman (1982)",kind:"paper",level:"intermediate",why:"The talk that motivated quantum computers as a way to simulate quantum systems."},{title:"Quantum theory, the Church-Turing principle and the universal quantum computer",by:"David Deutsch (1985)",kind:"paper",level:"advanced",why:"Introduced the universal quantum computer and the first quantum speedup example."},{title:"Quantum Cryptography: Public Key Distribution and Coin Tossing",by:"Charles H. Bennett & Gilles Brassard (1984)",kind:"paper",level:"intermediate",why:"The original BB84 key distribution protocol."},{title:"Algorithms for Quantum Computation: Discrete Logarithms and Factoring",by:"Peter W. Shor (1994)",kind:"paper",level:"advanced",why:"The paper presenting polynomial-time quantum algorithms for factoring and discrete logarithms."},{title:"Polynomial-Time Algorithms for Prime Factorization and Discrete Logarithms on a Quantum Computer",by:"Peter W. Shor (SIAM J. Comput., 1997)",kind:"paper",level:"advanced",why:"Journal version of Shor's algorithm with full details.",url:"https://arxiv.org/abs/quant-ph/9508027"},{title:"A Fast Quantum Mechanical Algorithm for Database Search",by:"Lov K. Grover (1996)",kind:"paper",level:"intermediate",why:"Introduced the square-root speedup for unstructured search.",url:"https://arxiv.org/abs/quant-ph/9605043"},{title:"Quantum Measurements and the Abelian Stabilizer Problem",by:"Alexei Kitaev (1995)",kind:"paper",level:"advanced",why:"Introduced the phase-estimation approach underlying Shor-type algorithms.",url:"https://arxiv.org/abs/quant-ph/9511026"},{title:"Quantum Algorithm for Linear Systems of Equations",by:"Aram Harrow, Avinatan Hassidim & Seth Lloyd (2009)",kind:"paper",level:"advanced",why:"The HHL algorithm, a key example of promised exponential speedups and their caveats.",url:"https://arxiv.org/abs/0811.3171"},{title:"Stabilizer Codes and Quantum Error Correction",by:"Daniel Gottesman (1997 thesis)",kind:"paper",level:"advanced",why:"Foundational account of the stabilizer formalism and the Gottesman-Knill theorem.",url:"https://arxiv.org/abs/quant-ph/9705052"},{title:"Surface codes: Towards practical large-scale quantum computation",by:"Austin G. Fowler et al. (2012)",kind:"paper",level:"advanced",why:"Standard reference for the surface code and its resource costs.",url:"https://arxiv.org/abs/1208.0928"},{title:"Quantum Computing in the NISQ era and beyond",by:"John Preskill (2018)",kind:"paper",level:"intermediate",why:'Coined "NISQ" and gave a sober view of what near-term devices can do.',url:"https://arxiv.org/abs/1801.00862"},{title:"Quantum supremacy using a programmable superconducting processor",by:"Frank Arute et al. (2019)",kind:"paper",level:"intermediate",why:"Google's Sycamore random-circuit-sampling experiment.",url:"https://doi.org/10.1038/s41586-019-1666-5"},{title:"How to factor 2048 bit RSA integers in 8 hours using 20 million noisy qubits",by:"Craig Gidney & Martin Ekera (2019)",kind:"paper",level:"advanced",why:"Concrete resource estimate for breaking RSA-2048 with surface-code hardware.",url:"https://arxiv.org/abs/1905.09749"},{title:"A variational eigenvalue solver on a photonic quantum processor",by:"Alberto Peruzzo et al. (2014)",kind:"paper",level:"intermediate",why:"The first demonstration of the variational quantum eigensolver (VQE).",url:"https://arxiv.org/abs/1304.3061"},{title:"A Quantum Approximate Optimization Algorithm",by:"Edward Farhi, Jeffrey Goldstone & Sam Gutmann (2014)",kind:"paper",level:"advanced",why:"Introduced QAOA for combinatorial optimization.",url:"https://arxiv.org/abs/1411.4028"},{title:"Variational Quantum Algorithms",by:"M. Cerezo et al. (2021)",kind:"paper",level:"intermediate",why:"Review of VQAs covering ansatz design, optimization and barren plateaus.",url:"https://arxiv.org/abs/2012.09265"},{title:"Harnessing disordered-ensemble quantum dynamics for machine learning",by:"Keisuke Fujii & Kohei Nakajima (2017)",kind:"paper",level:"advanced",why:"Proposed quantum reservoir computing using the dynamics of a disordered quantum system."},{title:"Quantum Computing Stack Exchange",by:"Community",kind:"community",level:"beginner",why:"Active Q&A site where specific conceptual and coding questions get detailed answers.",url:"https://quantumcomputing.stackexchange.com"},{title:"Unitary Fund",by:"Unitary Fund",kind:"community",level:"intermediate",why:"Non-profit supporting open-source quantum software, with a community and project grants.",url:"https://unitary.fund"}],I=o.lazy(()=>G(()=>import("/sirraya_assets/Lazy-Bf2ibZzi.js"),__vite__mapDeps([0,1,2]))),D="sirraya.quantum.v1",De=()=>{var t,a;try{const r=JSON.parse(localStorage.getItem(D)??"null");if(r&&Array.isArray(r.done))return{done:r.done,quiz:r.quiz??{},current:r.current??((t=g[0])==null?void 0:t.id)}}catch{}return{done:[],quiz:{},current:(a=g[0])==null?void 0:a.id}},Ge=t=>{try{localStorage.setItem(D,JSON.stringify(t))}catch{}},Ke=[{id:"learn",label:"Learn"},{id:"composer",label:"Circuit Composer"},{id:"hardware",label:"Hardware Lab"},{id:"characterization",label:"Characterization"},{id:"playground",label:"Playground"},{id:"glossary",label:"Glossary"},{id:"cheatsheet",label:"Cheat sheet"},{id:"resources",label:"Resources"}],Y=[{name:"hardware-lab",title:"Hardware lab"},{name:"char-lab",title:"Characterization lab"},{name:"bloch",title:"Bloch sphere"},{name:"gate-explorer",title:"Gate explorer"},{name:"bloch-challenge",title:"Bloch puzzles"},{name:"tensor-lab",title:"Tensor / entanglement lab"},{name:"chsh",title:"CHSH / Bell test"},{name:"noise-lab",title:"Noise lab"},{name:"grover-viz",title:"Grover search"},{name:"qft-viz",title:"Quantum Fourier transform"},{name:"shor",title:"Shor’s algorithm"},{name:"vqe",title:"VQE (H₂)"},{name:"qaoa",title:"QAOA MaxCut"},{name:"reservoir",title:"Quantum reservoir"},{name:"bb84",title:"BB84 key distribution"},{name:"qec",title:"Error correction"},{name:"double-slit",title:"Double slit"},{name:"mach-zehnder",title:"Mach–Zehnder"},{name:"stern-gerlach",title:"Stern–Gerlach"},{name:"complex-plane",title:"Complex plane"},{name:"speedup-chart",title:"Speed-up curves"}];function U({text:t}){const[a,r]=o.useState("");return o.useEffect(()=>{let i=!0;return L(t).then(n=>i&&r(n)),()=>{i=!1}},[t]),e.jsx("div",{className:"qa-prose",dangerouslySetInnerHTML:{__html:a}})}const Ve={note:"ℹ️ Note",tip:"💡 Tip",warn:"⚠️ Careful",math:"∑ Math",history:"📜 History"};function Je({name:t,props:a,caption:r}){return e.jsxs("figure",{className:"qa-fig",children:[e.jsx("div",{className:"qa-fig-bar",children:e.jsxs("span",{children:["● Interactive · ",t.replace(/-/g," ")]})}),e.jsx(o.Suspense,{fallback:e.jsx("div",{className:"qa-loading",children:"Loading simulator…"}),children:e.jsx(I,{name:t,props:a})}),r&&e.jsx("figcaption",{children:r})]})}function et({b:t}){return t.t==="md"?e.jsx(U,{text:t.text}):t.t==="callout"?e.jsxs("aside",{className:"qa-callout "+t.kind,children:[e.jsx("b",{children:t.title??Ve[t.kind]}),e.jsx(U,{text:t.text})]}):e.jsx(Je,{name:t.name,props:t.props,caption:t.caption})}function tt({lesson:t,onScore:a}){const[r,i]=o.useState({}),n=Object.keys(r).length,q=t.quiz.reduce((h,c,u)=>h+(r[u]===c.answer?1:0),0);return o.useEffect(()=>{i({})},[t.id]),o.useEffect(()=>{n===t.quiz.length&&a(q/t.quiz.length)},[n]),e.jsxs("section",{className:"qa-quiz","aria-label":"Check your understanding",children:[e.jsx("h3",{children:"Check your understanding"}),t.quiz.map((h,c)=>{const u=r[c];return e.jsxs("div",{className:"qa-q",children:[e.jsxs("p",{children:[e.jsxs("b",{children:[c+1,"."]})," ",e.jsx(H,{text:h.q})]}),h.options.map((S,s)=>{const d=u===void 0?"":s===h.answer?" right":s===u?" wrong":" dim";return e.jsxs("button",{disabled:u!==void 0,className:"qa-opt"+d,onClick:()=>i({...r,[c]:s}),children:[e.jsx("span",{children:String.fromCharCode(65+s)}),e.jsx(H,{text:S})]},s)}),u!==void 0&&e.jsxs("div",{className:"qa-explain "+(u===h.answer?"good":"bad"),children:[e.jsx("b",{children:u===h.answer?"Correct. ":"Not quite. "}),e.jsx(H,{text:h.explain})]})]},c)}),n===t.quiz.length&&e.jsxs("div",{className:"qa-banner good",children:["Score: ",q,"/",t.quiz.length]})]})}function H({text:t}){const[a,r]=o.useState("");return o.useEffect(()=>{let i=!0;return L(t).then(n=>i&&r(n.replace(/^<p>|<\/p>\s*$/g,""))),()=>{i=!1}},[t]),e.jsx("span",{className:"qa-inline",dangerouslySetInnerHTML:{__html:a}})}function at({lesson:t,prog:a,setProg:r,go:i}){const n=g.findIndex(s=>s.id===t.id),q=g[n-1],h=g[n+1],c=a.done.includes(t.id),u=o.useRef(null);o.useEffect(()=>{var s,d;(s=u.current)==null||s.scrollIntoView({block:"start"}),(d=document.querySelector(".qa-main"))==null||d.scrollTo({top:0})},[t.id]);const S=()=>r({...a,done:c?a.done.filter(s=>s!==t.id):[...a.done,t.id]});return e.jsxs("article",{className:"qa-lesson",ref:u,children:[e.jsxs("header",{children:[e.jsxs("div",{className:"qa-kicker",children:[t.part," · Lesson ",t.order," · ",t.minutes," min"]}),e.jsx("h1",{children:t.title}),e.jsx("p",{className:"qa-lead",children:t.summary}),e.jsxs("div",{className:"qa-obj",children:[e.jsx("b",{children:"After this lesson you can…"}),e.jsx("ul",{children:t.objectives.map((s,d)=>e.jsx("li",{children:s},d))})]})]}),t.blocks.map((s,d)=>e.jsx(et,{b:s},t.id+d)),e.jsx(tt,{lesson:t,onScore:s=>r({...a,quiz:{...a.quiz,[t.id]:s}})}),e.jsxs("section",{className:"qa-take",children:[e.jsx("h3",{children:"Key takeaways"}),e.jsx("ul",{children:t.takeaways.map((s,d)=>e.jsx("li",{children:e.jsx(H,{text:s})},d))})]}),e.jsxs("footer",{className:"qa-nav",children:[q?e.jsxs("button",{onClick:()=>i(q.id),children:["← ",q.title]}):e.jsx("span",{}),e.jsx("button",{className:"qa-complete"+(c?" on":""),onClick:S,children:c?"✓ Completed":"Mark as complete"}),h?e.jsxs("button",{className:"primary",onClick:()=>{c||r({...a,done:[...a.done,t.id]}),i(h.id)},children:[h.title," →"]}):e.jsx("span",{})]})]})}function it({go:t}){const[a,r]=o.useState(""),i=o.useMemo(()=>F.filter(n=>(n.term+" "+n.def).toLowerCase().includes(a.toLowerCase())),[a]);return e.jsxs("div",{className:"qa-page",children:[e.jsx("h1",{children:"Glossary"}),e.jsxs("p",{className:"qa-lead",children:[F.length," terms, in plain language."]}),e.jsx("input",{className:"qa-search",placeholder:"Search terms…",value:a,onChange:n=>r(n.target.value),"aria-label":"Search glossary"}),e.jsx("dl",{className:"qa-gloss",children:i.map(n=>e.jsxs("div",{children:[e.jsx("dt",{children:n.term}),e.jsxs("dd",{children:[e.jsx(H,{text:n.def}),n.see&&P(n.see)&&e.jsxs("button",{className:"qa-link",onClick:()=>t(n.see),children:[" → ",P(n.see).title]})]})]},n.term))}),!i.length&&e.jsx("p",{className:"qa-hint",children:"No matches."})]})}const rt=({tex:t})=>e.jsx("span",{dangerouslySetInnerHTML:{__html:K.renderToString(t,{throwOnError:!1,displayMode:!1})}});function nt(){return e.jsxs("div",{className:"qa-page",children:[e.jsx("h1",{children:"Cheat sheet"}),e.jsx("p",{className:"qa-lead",children:"Every gate, identity and formula in one place. Big-endian convention: qubit 0 is the leftmost bit."}),Ue.map(t=>e.jsxs("section",{children:[e.jsx("h2",{children:t.title}),e.jsx("div",{className:"qa-cheat",children:t.items.map(a=>e.jsxs("div",{className:"qa-card",children:[e.jsx("b",{children:a.label}),e.jsx("div",{className:"tex",children:e.jsx(rt,{tex:a.tex})}),a.note&&e.jsx("p",{children:a.note})]},a.label))})]},t.title))]})}function st(){const[t,a]=o.useState("all"),r=Le.filter(i=>t==="all"||i.level===t);return e.jsxs("div",{className:"qa-page",children:[e.jsx("h1",{children:"Where to go next"}),e.jsx("p",{className:"qa-lead",children:"Curated books, courses, notes, software and communities."}),e.jsx("div",{className:"qa-btnrow",children:["all","beginner","intermediate","advanced"].map(i=>e.jsx("button",{className:"qa-btn sm"+(t===i?" on":""),onClick:()=>a(i),children:i},i))}),e.jsx("div",{className:"qa-cheat",children:r.map(i=>e.jsxs("div",{className:"qa-card",children:[e.jsxs("span",{className:"qa-pill",children:[i.kind," · ",i.level]}),e.jsx("b",{children:i.url?e.jsxs("a",{href:i.url,target:"_blank",rel:"noopener noreferrer",children:[i.title," ↗"]}):i.title}),e.jsx("p",{children:i.by}),e.jsx("p",{children:i.why})]},i.title))})]})}function ut(){var z;const[t,a]=o.useState("learn"),[r,i]=o.useState(De),[n,q]=o.useState("bloch"),[h,c]=o.useState(!1),u=o.useCallback(l=>{i(l),Ge(l)},[]),S=P(r.current)??g[0],s=l=>{u({...r,current:l}),a("learn"),c(!1)},d=g.length?Math.round(r.done.filter(l=>P(l)).length/g.length*100):0;return e.jsxs("div",{className:"qa","data-testid":"quantum-academy",children:[e.jsxs("div",{className:"qa-top",children:[e.jsxs("div",{className:"qa-brand",children:[e.jsx("span",{className:"qa-logo",children:"⟩"}),e.jsx("b",{children:"Quantum Academy"}),e.jsx("span",{className:"qa-ring",title:`${d}% complete`,children:e.jsx("i",{style:{width:`${d}%`}})}),e.jsxs("small",{children:[d,"%"]})]}),e.jsx("nav",{className:"qa-tabs main","aria-label":"Academy sections",children:Ke.map(l=>e.jsx("button",{className:t===l.id?"on":"",onClick:()=>a(l.id),children:l.label},l.id))}),e.jsx("button",{className:"qa-menubtn",onClick:()=>c(!h),"aria-label":"Curriculum",children:"☰"})]}),e.jsxs("div",{className:"qa-body",children:[e.jsx("aside",{className:"qa-side"+(h?" open":""),"aria-label":"Curriculum",children:Fe.map(l=>{const j=g.filter($=>$.part===l);return j.length?e.jsxs("div",{className:"qa-part",children:[e.jsx("h4",{children:l}),j.map($=>e.jsxs("button",{className:"qa-item"+(t==="learn"&&$.id===S.id?" on":""),onClick:()=>s($.id),children:[e.jsx("span",{className:"qa-dot"+(r.done.includes($.id)?" done":""),children:r.done.includes($.id)?"✓":g.indexOf($)+1}),e.jsx("span",{children:$.title}),e.jsxs("small",{children:[$.minutes,"m"]})]},$.id))]},l):null})}),e.jsxs("main",{className:"qa-main",children:[t==="learn"&&S&&e.jsx(at,{lesson:S,prog:r,setProg:u,go:s}),t==="composer"&&e.jsxs("div",{className:"qa-page wide",children:[e.jsx("h1",{children:"Circuit Composer"}),e.jsx("p",{className:"qa-lead",children:"Build circuits, step through them, inspect every qubit on a 3D Bloch sphere, add noise, and export OpenQASM."}),e.jsx(o.Suspense,{fallback:e.jsx("div",{className:"qa-loading",children:"Loading…"}),children:e.jsx(I,{name:"composer",props:{preset:"bell"}})})]}),t==="hardware"&&e.jsxs("div",{className:"qa-page wide",children:[e.jsx("h1",{children:"Hardware Lab"}),e.jsx("p",{className:"qa-lead",children:"One program, three synchronized views — the algorithm and its native-gate compilation, the control-electronics pulses that execute it, and the physics of the qubits while it runs — for five hardware platforms."}),e.jsx(o.Suspense,{fallback:e.jsx("div",{className:"qa-loading",children:"Loading…"}),children:e.jsx(I,{name:"hardware-lab"})})]}),t==="characterization"&&e.jsxs("div",{className:"qa-page wide",children:[e.jsx("h1",{children:"Characterization Lab"}),e.jsx("p",{className:"qa-lead",children:"Calibrate a device you cannot see. Run the experiments every hardware group runs — spectroscopy, Rabi, Ramsey, echo, T₁, readout and randomized benchmarking — read the fits and their error bars, then reveal the hidden truth to check yourself."}),e.jsx(o.Suspense,{fallback:e.jsx("div",{className:"qa-loading",children:"Loading…"}),children:e.jsx(I,{name:"char-lab"})})]}),t==="playground"&&e.jsxs("div",{className:"qa-page wide",children:[e.jsx("h1",{children:"Playground"}),e.jsx("div",{className:"qa-pgchips",children:Y.map(l=>e.jsx("button",{className:"qa-btn sm"+(n===l.name?" on":""),onClick:()=>q(l.name),children:l.title},l.name))}),e.jsx(o.Suspense,{fallback:e.jsx("div",{className:"qa-loading",children:"Loading…"}),children:e.jsx(I,{name:n,props:(z=Y.find(l=>l.name===n))==null?void 0:z.props},n)})]}),t==="glossary"&&e.jsx(it,{go:s}),t==="cheatsheet"&&e.jsx(nt,{}),t==="resources"&&e.jsx(st,{})]})]})]})}export{ut as default};
