'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/lib/accessibility-context';
import {
  Compass,
  Sparkles,
  BookOpen,
  Terminal,
  Cpu,
  Award,
  Globe,
  Bot,
  GraduationCap,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  HelpCircle,
  Atom,
  Layers,
  Activity
} from 'lucide-react';
import { MathRenderer } from '@/components/math/MathRenderer';

export default function AboutPage() {
  const { explanationMode } = useAccessibility();
  const [activeTab, setActiveTab] = useState<
    'what-is-quantum' | 'qubit' | 'superposition' | 'entanglement' | 'computing' | 'comparison'
  >('what-is-quantum');

  // Auto-scroll to #quantum-guide when navigated with hash (e.g. from homepage 'More' button)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#quantum-guide') {
      const el = document.getElementById('quantum-guide');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, []);

  return (
    <div className="w-full mx-auto px-8 py-6 space-y-10 animate-fadeIn max-w-7xl">
      {/* Top Hero Banner: The Origin Story */}
      <div className="bg-gradient-to-br from-indigo-950 via-primary-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        {/* Background decorative rings */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Compass className="w-3.5 h-3.5 text-indigo-300" />
            <span>The Story & Mission Behind QLearn</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Why We Created QLearn: Demystifying Quantum Computing for Everyone
          </h1>

          <p className="text-base sm:text-lg text-indigo-100/90 leading-relaxed">
            Quantum computing is often taught as an impenetrable fortress of dense linear algebra, complex numbers, and abstract tensor products. We created QLearn to dismantle that barrier—transforming abstract Hilbert spaces into interactive 3D geometry, hands-on circuit simulation, and personalized Socratic AI tutoring.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#quantum-guide"
              className="px-5 py-2.5 rounded-xl bg-white text-primary-900 font-bold text-sm hover:bg-primary-50 transition-all shadow-md flex items-center gap-2"
            >
              <Atom className="w-4 h-4 text-primary-600" />
              <span>Explore Quantum Masterclass Below</span>
            </a>
            <Link
              href="/bloch-sphere"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 flex items-center gap-2"
            >
              <Globe className="w-4 h-4 text-indigo-300" />
              <span>Explore 3D Bloch Sphere</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Complete Quantum Computing Masterclass (All Concepts Explained) */}
      <section id="quantum-guide" className="bg-white rounded-3xl border border-dark-200 p-6 sm:p-10 shadow-xs space-y-6 scroll-mt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-100 pb-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-xs font-semibold text-primary-800">
              <Atom className="w-3.5 h-3.5 text-primary-600" />
              <span>Complete Quantum Masterclass</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
              All Quantum Concepts Explained
            </h2>
            <p className="text-xs sm:text-sm text-dark-600">
              {explanationMode === 'simple'
                ? 'Currently in Simple Mode: Intuitive real-world analogies without intimidating linear algebra matrices.'
                : 'Currently in Technical / Math Mode: Complete mathematical formulations, Dirac bras/kets, and unitary operator mechanics.'}
            </p>
          </div>

          {/* Mode indicator — toggle is in the global AccessibilityBar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-xs font-medium shrink-0 self-start sm:self-auto">
            <span className="text-dark-500">Explanation:</span>
            <span className="font-bold text-primary-700">
              {explanationMode === 'simple' ? 'Simple Mode' : 'Technical / Math'}
            </span>
          </div>
        </div>

        {/* Topic Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {[
            { id: 'what-is-quantum', label: '1. What is Quantum?', icon: Atom },
            { id: 'qubit', label: '2. Bit vs Qubit', icon: Layers },
            { id: 'superposition', label: '3. Superposition & Collapse', icon: Sparkles },
            { id: 'entanglement', label: '4. Entanglement', icon: Zap },
            { id: 'computing', label: '5. Quantum Computing & Speedup', icon: Cpu },
            { id: 'comparison', label: '6. Classical vs Quantum Matrix', icon: ShieldCheck }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'bg-dark-50 text-dark-700 hover:bg-dark-100 border border-dark-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-primary-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content Panel */}
        <div className="bg-dark-50/50 rounded-2xl border border-dark-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Topic 1: What is Quantum? */}
          {activeTab === 'what-is-quantum' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  <Atom className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">What is "Quantum"?</h3>
                  <p className="text-xs text-dark-500">
                    {explanationMode === 'simple'
                      ? 'Why the microscopic universe behaves like ripples and packets rather than solid billiard balls.'
                      : 'The quantization of physical action, Planck-Einstein energy packets, and state vectors in Hilbert space.'}
                  </p>
                </div>
              </div>

              {explanationMode === 'simple' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  <div className="bg-white p-5 rounded-xl border border-dark-200 space-y-2.5">
                    <span className="font-bold text-primary-900 text-sm block">1. Packets Instead of Streams</span>
                    <p className="text-dark-600 leading-relaxed">
                      Think of energy like cash currency. You can hand someone a $1 bill or a $2 bill, but you can&apos;t give someone $1.341295... without specific coins! In 1900, physicists realized energy behaves the same way: it is traded in discrete packets called <strong>quanta</strong>.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-dark-200 space-y-2.5">
                    <span className="font-bold text-primary-900 text-sm block">2. Ripples on a Pond</span>
                    <p className="text-dark-600 leading-relaxed">
                      If you throw a pebble into water, the ripple spreads out and can pass through two openings at once. Light and tiny particles like electrons do the exact same thing—acting like waves of possibility until someone sets up a detector!
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-dark-200 space-y-2.5">
                    <span className="font-bold text-primary-900 text-sm block">3. Nature Plays With Odds</span>
                    <p className="text-dark-600 leading-relaxed">
                      Classical physics said: &quot;If you know where a ball starts, you know exactly where it will land.&quot; Quantum physics says: &quot;You only know the probability of where it might land.&quot; Nature is fundamentally based on possibilities, not fixed paths!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
                  <div className="bg-white p-5 rounded-xl border border-dark-200 space-y-2.5">
                    <span className="font-bold text-primary-900 text-sm block">1. Planck Energy Quantization</span>
                    <p className="text-dark-600 leading-relaxed">
                      Energy exchange occurs in discrete packets proportional to frequency:
                    </p>
                    <div className="p-2.5 rounded-lg bg-dark-50 font-mono text-center font-bold text-primary-900">
                      <MathRenderer text="$E = h\nu = \hbar\omega$" />
                    </div>
                    <p className="text-dark-500">
                      where <MathRenderer text="$h \approx 6.626 \times 10^{-34} \text{ J}\cdot\text{s}$" /> is Planck&apos;s constant and <MathRenderer text="$\hbar = h / (2\pi)$" />.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-dark-200 space-y-2.5">
                    <span className="font-bold text-primary-900 text-sm block">2. de Broglie Matter Wavelength</span>
                    <p className="text-dark-600 leading-relaxed">
                      Every particle with linear momentum <MathRenderer text="$p$" /> exhibits an associated wavelength:
                    </p>
                    <div className="p-2.5 rounded-lg bg-dark-50 font-mono text-center font-bold text-emerald-900">
                      <MathRenderer text="$\lambda = \frac{h}{p} = \frac{h}{mv}$" />
                    </div>
                    <p className="text-dark-500">
                      Governs constructive and destructive wave interference in quantum scattering and double-slit setups.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-dark-200 space-y-2.5">
                    <span className="font-bold text-primary-900 text-sm block">3. Schrödinger Evolution</span>
                    <p className="text-dark-600 leading-relaxed">
                      Continuous deterministic unitary state propagation in Hilbert space:
                    </p>
                    <div className="p-2.5 rounded-lg bg-dark-50 font-mono text-center font-bold text-purple-900">
                      <MathRenderer text="$i\hbar \frac{\partial |\psi\rangle}{\partial t} = \hat{H}|\psi\rangle$" />
                    </div>
                    <p className="text-dark-500">
                      Measurement probability density is given by Born&apos;s rule <MathRenderer text="$P(x) = |\psi(x)|^2$" />.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Topic 2: Bit vs Qubit */}
          {activeTab === 'qubit' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">Classical Bit vs. Quantum Qubit</h3>
                  <p className="text-xs text-dark-500">
                    {explanationMode === 'simple'
                      ? 'Why a qubit is like pointing on a 3D globe rather than flipping a binary light switch.'
                      : 'Isomorphism between two-level complex Hilbert space S² and the 3D unit Bloch sphere.'}
                  </p>
                </div>
              </div>

              {explanationMode === 'simple' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">The Classical Bit: A Simple Switch</span>
                    <p className="text-dark-600 leading-relaxed">
                      A classical bit is like a standard light bulb in your room: it is either completely OFF (0) or completely ON (1). It cannot be anything else at any given second.
                    </p>
                    <div className="p-3 bg-dark-50 rounded-lg text-center font-mono font-bold text-dark-800">
                      Bit Value = 0 OR 1
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-primary-200 space-y-3">
                    <span className="font-bold text-sm text-primary-950 block">The Qubit: A 3D Globe of Possibility</span>
                    <p className="text-dark-600 leading-relaxed">
                      A qubit is like a globe. The North Pole is 0, and the South Pole is 1. But you can also point anywhere on the equator or across the surface! This means a single qubit can hold a smooth blend of both 0 and 1 until measured.
                    </p>
                    <div className="p-3 bg-primary-50 rounded-lg text-center font-mono font-bold text-primary-900">
                      State = Any Point on the 3D Sphere!
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Classical Bit State Space</span>
                    <p className="text-dark-600 leading-relaxed">
                      Boolean discrete field <MathRenderer text="$\mathbb{Z}_2 = \{0, 1\}$" />. Physical representation is high/low transistor channel voltage, completely deterministic and non-superposable.
                    </p>
                    <div className="p-3 bg-dark-50 rounded-lg text-center font-mono text-dark-800">
                      <MathRenderer text="$s \in \{0, 1\}$" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-primary-200 space-y-3">
                    <span className="font-bold text-sm text-primary-950 block">Qubit Hilbert State Space</span>
                    <p className="text-dark-600 leading-relaxed">
                      Two-dimensional complex vector space <MathRenderer text="$\mathbb{C}^2$" /> with orthonormal basis <MathRenderer text="$\{|0\rangle, |1\rangle\}$" />:
                    </p>
                    <div className="p-3 bg-primary-50 rounded-lg text-center font-mono font-bold text-primary-950">
                      <MathRenderer text="$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle, \quad |\alpha|^2 + |\beta|^2 = 1$" />
                    </div>
                  </div>
                </div>
              )}

              {/* Bloch sphere reference card */}
              <div className="bg-white p-5 rounded-xl border border-dark-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-dark-900 block text-sm">Bloch Sphere Formulation</span>
                  <p className="text-dark-600">
                    <MathRenderer text="$|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$" /> (where <MathRenderer text="$\theta$" /> controls probability and <MathRenderer text="$\phi$" /> controls quantum relative phase).
                  </p>
                </div>
                <Link
                  href="/bloch-sphere"
                  className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Launch 3D Bloch Sphere Explorer</span>
                </Link>
              </div>
            </div>
          )}

          {/* Topic 3: Superposition & Measurement */}
          {activeTab === 'superposition' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">Superposition & Wavefunction Collapse</h3>
                  <p className="text-xs text-dark-500">
                    {explanationMode === 'simple'
                      ? 'The spinning coin analogy and why measurement freezes potential into certainty.'
                      : 'Linear operator superposition, Hadamard transformation, and projective measurement collapse.'}
                  </p>
                </div>
              </div>

              {explanationMode === 'simple' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">The Spinning Coin Metaphor</span>
                    <p className="text-dark-600 leading-relaxed">
                      Place a quarter on a desk. While it rests flat, it is classical: definitely Heads (0) or Tails (1).
                    </p>
                    <p className="text-dark-600 leading-relaxed">
                      Now flick it into a rapid spin. While it spins on the desk, is it Heads or Tails? It is in a <strong>superposition</strong>: a dynamic blend of both possibilities at once!
                    </p>
                    <div className="p-3 bg-indigo-50 rounded-lg text-indigo-900 font-medium">
                      The Hadamard gate (<MathRenderer text="$H$" />) is the &quot;flick&quot; that starts the qubit spinning into an equal 50/50 superposition!
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">The Measurement Collapse</span>
                    <p className="text-dark-600 leading-relaxed">
                      What happens when you slap your hand down on the spinning coin? It instantly stops spinning and collapses into either Heads or Tails.
                    </p>
                    <p className="text-dark-600 leading-relaxed">
                      In quantum computing, measuring a qubit forces its delicate cloud of possibilities to collapse into a single definite result (0 or 1).
                    </p>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 font-medium">
                      ⚠️ Once measured, the quantum phase is destroyed; you now have a normal classical bit.
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Hadamard Transformation Operator</span>
                    <p className="text-dark-600 leading-relaxed">
                      The unitary matrix <MathRenderer text="$H = \frac{1}{\sqrt{2}}\begin{pmatrix}1 & 1\\ 1 & -1\end{pmatrix}$" /> maps computational basis states into maximal superposition:
                    </p>
                    <div className="p-3 bg-primary-50 rounded-lg text-center font-mono font-bold text-primary-950">
                      <MathRenderer text="$H|0\rangle = |+\rangle = \frac{|0\rangle + |1\rangle}{\sqrt{2}}, \quad H|1\rangle = |-\rangle = \frac{|0\rangle - |1\rangle}{\sqrt{2}}$" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Projective Measurement & Born&apos;s Postulate</span>
                    <p className="text-dark-600 leading-relaxed">
                      Given state <MathRenderer text="$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$" />, measurement using projection operator <MathRenderer text="$P_0 = |0\rangle\langle 0|$" /> yields:
                    </p>
                    <div className="p-3 bg-dark-50 rounded-lg text-center font-mono font-bold text-dark-800">
                      <MathRenderer text="$P(0) = \langle\psi|P_0|\psi\rangle = |\alpha|^2, \quad P(1) = \langle\psi|P_1|\psi\rangle = |\beta|^2$" />
                    </div>
                    <p className="text-dark-500">
                      Post-measurement state collapses non-unitarily to <MathRenderer text="$|0\rangle$" /> or <MathRenderer text="$|1\rangle$" />.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Topic 4: Quantum Entanglement */}
          {activeTab === 'entanglement' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">Quantum Entanglement (&quot;Spooky Action&quot;)</h3>
                  <p className="text-xs text-dark-500">
                    {explanationMode === 'simple'
                      ? 'Magic dice and interconnected particles that communicate across the universe.'
                      : 'Non-separable tensor states, Bell inequalities, and quantum information protocols.'}
                  </p>
                </div>
              </div>

              {explanationMode === 'simple' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">The Magic Dice Metaphor</span>
                    <p className="text-dark-600 leading-relaxed">
                      Imagine you have two magical dice. You keep one in your pocket, and give the other to a friend flying to Tokyo.
                    </p>
                    <p className="text-dark-600 leading-relaxed">
                      You roll your die, and it lands on <strong>6</strong>. At that exact instant, without any phone call, WiFi, or laser beam, your friend&apos;s die also turns up <strong>6</strong>!
                    </p>
                    <div className="p-3 bg-purple-50 rounded-lg text-purple-900 font-medium">
                      Einstein was so bothered by this instant connection that he famously nicknamed it &quot;spooky action at a distance&quot;. Yet experiments have proven it is 100% real!
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">What It Enables in Computing</span>
                    <p className="text-dark-600 leading-relaxed">
                      Because entangled qubits share a unified state, operations performed on one qubit instantly influence the whole system.
                    </p>
                    <ul className="space-y-2 text-dark-600">
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold text-primary-600">•</span>
                        <span><strong>Quantum Teleportation:</strong> Transferring an unknown qubit state across distances using an entangled pair and 2 classical bits.</span>
                      </li>
                      <li className="flex items-start gap-1.5">
                        <span className="font-bold text-primary-600">•</span>
                        <span><strong>Superdense Coding:</strong> Sending 2 classical bits of data by physically transmitting only 1 entangled qubit!</span>
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Non-Separability in Tensor Product Space</span>
                    <p className="text-dark-600 leading-relaxed">
                      A composite state in <MathRenderer text="$\mathcal{H}_A \otimes \mathcal{H}_B$" /> is entangled if it cannot be written as <MathRenderer text="$|\psi_A\rangle \otimes |\psi_B\rangle$" />.
                    </p>
                    <div className="p-3 bg-dark-50 rounded-lg text-center font-mono font-bold text-primary-950">
                      <MathRenderer text="$|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$" />
                    </div>
                    <p className="text-dark-500">
                      Reduced density matrix <MathRenderer text="$\rho_A = \text{Tr}_B(|\Phi^+\rangle\langle\Phi^+|) = \frac{1}{2}I$" /> has purity <MathRenderer text="$\text{Tr}(\rho_A^2) = 0.5 < 1.0$" /> (maximally mixed).
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Bell&apos;s Inequality Violation</span>
                    <p className="text-dark-600 leading-relaxed">
                      Local hidden variable theories satisfy Clauser-Horne-Shimony-Holt (CHSH) bound <MathRenderer text="$|S| \le 2$" />. Quantum entangled Bell states achieve Tsirelson&apos;s bound:
                    </p>
                    <div className="p-3 bg-purple-50 rounded-lg text-center font-mono font-bold text-purple-900">
                      <MathRenderer text="$S = 2\sqrt{2} \approx 2.828 > 2$" />
                    </div>
                    <p className="text-dark-500">
                      Conclusively disproves Einstein-Podolsky-Rosen (EPR) local realism.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Topic 5: Quantum Computing & Speedup */}
          {activeTab === 'computing' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">Quantum Computing & Exponential Speedup</h3>
                  <p className="text-xs text-dark-500">
                    {explanationMode === 'simple'
                      ? 'The maze analogy and why quantum computers can solve impossible problems in seconds.'
                      : 'Exponential Hilbert space scaling 2^n, quantum interference, and polynomial algorithm speedups.'}
                  </p>
                </div>
              </div>

              {explanationMode === 'simple' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">The Maze Analogy</span>
                    <p className="text-dark-600 leading-relaxed">
                      Imagine trying to solve a giant labyrinth:
                    </p>
                    <p className="text-dark-600 leading-relaxed">
                      A classical supercomputer is like a mouse. It runs down hallway A, hits a dead end, walks back, tries hallway B, and repeats this billions of times sequentially until it finds the exit.
                    </p>
                    <p className="text-dark-600 leading-relaxed">
                      A quantum computer is like pouring water into the maze. Water floods into <strong>all pathways at the exact same second</strong>, effortlessly finding the exit on its very first attempt!
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Canceling Out Wrong Answers (Interference)</span>
                    <p className="text-dark-600 leading-relaxed">
                      Quantum computers don&apos;t just test all answers blindly. They use <strong>wave interference</strong>:
                    </p>
                    <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-950 space-y-1">
                      <span className="font-bold block">✓ Right Answers Grow:</span>
                      <span>Like two ocean waves meeting and making a giant wave, correct answers amplify each other!</span>
                    </div>
                    <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-rose-950 space-y-1">
                      <span className="font-bold block">✗ Wrong Answers Disappear:</span>
                      <span>Like noise-canceling headphones, wrong answers cancel each other out!</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Exponential State Dimension</span>
                    <p className="text-dark-600 leading-relaxed">
                      An <MathRenderer text="$n$" />-qubit register evolves in a <MathRenderer text="$2^n$" />-dimensional complex Hilbert space:
                    </p>
                    <div className="p-3 bg-dark-50 rounded-lg space-y-1 font-mono">
                      <div className="flex justify-between"><span>n = 10 qubits:</span><span className="font-bold text-primary-700">1,024 amplitudes</span></div>
                      <div className="flex justify-between"><span>n = 50 qubits:</span><span className="font-bold text-emerald-700">1.12 × 10¹⁵ amplitudes (Exceeds Supercomputer RAM)</span></div>
                      <div className="flex justify-between"><span>n = 300 qubits:</span><span className="font-bold text-purple-700">&gt; Total atoms in observable universe</span></div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-dark-200 space-y-3">
                    <span className="font-bold text-sm text-dark-900 block">Phase Kickback & Interference</span>
                    <p className="text-dark-600 leading-relaxed">
                      Unitary operations exploit relative phase <MathRenderer text="$e^{i\phi}$" /> to induce destructive interference on false computational paths and constructive interference on the target eigenvector.
                    </p>
                    <ul className="space-y-1 text-dark-600">
                      <li><strong>Shor&apos;s Algorithm:</strong> Prime factorization in <MathRenderer text="$\mathcal{O}((\log N)^3)$" /> (exponential speedup over classical NFS).</li>
                      <li><strong>Grover&apos;s Search:</strong> Unstructured database query in <MathRenderer text="$\mathcal{O}(\sqrt{N})$" /> (quadratic speedup).</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Topic 6: Classical vs Quantum Comparison Matrix */}
          {activeTab === 'comparison' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-dark-900">Classical vs. Quantum Comparison Matrix</h3>
                  <p className="text-xs text-dark-500">
                    {explanationMode === 'simple'
                      ? 'Simple side-by-side comparison of everyday computers vs quantum computers.'
                      : 'Architectural, mathematical, and algorithmic dimension breakdown.'}
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-dark-200">
                      <th className="p-3.5 font-bold text-dark-900">Dimension</th>
                      <th className="p-3.5 font-bold text-dark-700 bg-dark-50/60">Classical Computer</th>
                      <th className="p-3.5 font-bold text-primary-900 bg-primary-50/60">Quantum Computer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-200 bg-white">
                    <tr>
                      <td className="p-3.5 font-semibold text-dark-900">Basic Information Unit</td>
                      <td className="p-3.5 text-dark-600 bg-dark-50/20">Binary Bit: Either 0 or 1 (light switch)</td>
                      <td className="p-3.5 text-primary-900 font-semibold bg-primary-50/20">Qubit: Continuous superposition <MathRenderer text="$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$" /></td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-dark-900">Information Scaling</td>
                      <td className="p-3.5 text-dark-600 bg-dark-50/20"><MathRenderer text="$n$" /> bits store 1 value at any time</td>
                      <td className="p-3.5 text-primary-900 font-semibold bg-primary-50/20"><MathRenderer text="$n$" /> qubits hold <MathRenderer text="$2^n$" /> values in parallel</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-dark-900">Logic Operations</td>
                      <td className="p-3.5 text-dark-600 bg-dark-50/20">Irreversible Boolean gates (AND, OR, NOT)</td>
                      <td className="p-3.5 text-primary-900 font-semibold bg-primary-50/20">Reversible Unitary rotations (<MathRenderer text="$U^\dagger U = I$" />)</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-dark-900">Processing Method</td>
                      <td className="p-3.5 text-dark-600 bg-dark-50/20">Sequential checking of one path at a time</td>
                      <td className="p-3.5 text-primary-900 font-semibold bg-primary-50/20">Quantum wave interference across all paths simultaneously</td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-semibold text-dark-900">Best Suited For</td>
                      <td className="p-3.5 text-dark-600 bg-dark-50/20">Daily tasks, gaming, web browsing, spreadsheets</td>
                      <td className="p-3.5 text-primary-900 font-semibold bg-primary-50/20">Molecular simulation, chemistry, drug design, cryptography</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Origin Story: The Core Motivation */}
      <section className="bg-white rounded-2xl border border-dark-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-dark-900">The Problem We Solved</h2>
            <p className="text-xs text-dark-500">Bridging the conceptual chasm between physics and intuition</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-dark-700 leading-relaxed pt-2">
          <div className="p-5 rounded-xl bg-dark-50/50 border border-dark-100 space-y-2.5">
            <h3 className="font-bold text-dark-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              The Traditional University Roadblock
            </h3>
            <p>
              Conventional courses introduce quantum computing through <MathRenderer text="$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle$" /> and immediate matrix multiplication. Learners are asked to calculate probabilities <MathRenderer text="$|\alpha|^2 + |\beta|^2 = 1$" /> without ever seeing what superposition actually looks like in space.
            </p>
            <p>
              When algorithms like Deutsch-Jozsa or Grover introduce phase kickback and amplitude amplification, students memorize matrix products rather than understanding the underlying constructive and destructive interference.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-primary-50/40 border border-primary-100 space-y-2.5">
            <h3 className="font-bold text-primary-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-600" />
              The QLearn Interactive Paradigm
            </h3>
            <p>
              We realized that single-qubit quantum gates are literally <strong>3D spatial rotations</strong> on a sphere! By giving users a 3D unit sphere with 6 dynamically projected poles (<MathRenderer text="$\pm Z, \pm X, \pm Y$" />) and real-time sweep arcs, quantum phase angles cease to be abstract complex phases and become tangible coordinates.
            </p>
            <p>
              Coupled with the multi-simulator engine running Qiskit, Cirq, and PennyLane, users don&apos;t just read about algorithms—they build them, verify them, and experience the exponential speedup firsthand.
            </p>
          </div>
        </div>
      </section>

      {/* How to Use QLearn Properly: The 4-Stage Pathway */}
      <section className="space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">User Guide</span>
          <h2 className="text-2xl font-bold text-dark-900">How to Use QLearn Properly (The 4-Stage Pathway)</h2>
          <p className="text-xs sm:text-sm text-dark-600">
            Follow this structured sequence to build true, intuitive quantum mastery from ground principles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-primary-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">1</span>
                <Globe className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-bold text-sm text-dark-900">Stage 1: Geometric Intuition</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Start in the <strong>3D Bloch Sphere Explorer</strong>. Rotate the camera to observe all 6 poles (<MathRenderer text="$|0\rangle, |1\rangle, |+\rangle, |-\rangle, |i\rangle, |-i\rangle$" />). Sweep the polar angle <MathRenderer text="$\theta$" /> and azimuthal phase <MathRenderer text="$\phi$" /> to see how probabilities change.
              </p>
            </div>
            <Link
              href="/bloch-sphere"
              className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 pt-2"
            >
              <span>Launch Bloch Sphere</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-primary-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">2</span>
                <BookOpen className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-bold text-sm text-dark-900">Stage 2: Guided Algorithms</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Work through the 4 core quantum algorithms: <strong>Deutsch-Jozsa</strong>, <strong>Grover&apos;s Search</strong>, <strong>Teleportation</strong>, and <strong>Superdense Coding</strong>. Use the dual-mode toggle (Simple Analogies vs Dirac Rigor) to master each step.
              </p>
            </div>
            <Link
              href="/learn/deutsch-jozsa"
              className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 pt-2"
            >
              <span>Explore Algorithms</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-primary-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">3</span>
                <Terminal className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-bold text-sm text-dark-900">Stage 3: Practice & Circuit Builder</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Enter the <strong>Practice Arena</strong> to place gates on real wire grids. Submit your circuits to verify against multi-simulator backends. When stuck, ask <strong>Schrödinger AI</strong> for non-spoiling Socratic clues.
              </p>
            </div>
            <Link
              href="/practice"
              className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 pt-2"
            >
              <span>Go to Practice Arena</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-primary-300 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center">4</span>
                <Award className="w-4 h-4 text-primary-600" />
              </div>
              <h3 className="font-bold text-sm text-dark-900">Stage 4: Certification & Mastery</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Complete module quizzes and Build-It challenges to boost your Curriculum Mastery to 100%. Claim cryptographically authenticated <strong>Quantum Competency Certificates</strong> signed with your name.
              </p>
            </div>
            <Link
              href="/practice"
              className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 pt-2"
            >
              <span>View Challenges</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Role-Based Instructions */}
      <section className="bg-white rounded-2xl border border-dark-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-dark-900">How Different Users Can Use QLearn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* For Students */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-50 border border-dark-100">
            <div className="flex items-center gap-2 font-bold text-sm text-dark-900">
              <GraduationCap className="w-4 h-4 text-primary-600" />
              <span>For High School & College Students</span>
            </div>
            <ul className="text-xs text-dark-600 space-y-1.5 list-disc pl-4">
              <li>Keep <strong>Explanation Mode set to &quot;Simple&quot;</strong> in the top accessibility bar for plain-language metaphors.</li>
              <li>Use the <strong>&quot;What is a Qubit?&quot; Primer</strong> to grasp state superposition before opening circuit challenges.</li>
              <li>Ask Schrödinger AI questions anytime—it adapts to your learning level.</li>
            </ul>
          </div>

          {/* For Researchers */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-50 border border-dark-100">
            <div className="flex items-center gap-2 font-bold text-sm text-dark-900">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>For Researchers & Engineers</span>
            </div>
            <ul className="text-xs text-dark-600 space-y-1.5 list-disc pl-4">
              <li>Toggle <strong>Explanation Mode to &quot;Technical&quot;</strong> to inspect full Dirac tensor products and state vector matrices.</li>
              <li>Compare execution outputs across IBM Qiskit, Google Cirq, and Xanadu PennyLane simulators in the Multi-Simulator workbench.</li>
              <li>Verify non-local entanglement purity with <MathRenderer text="$\text{Tr}(\rho^2)$" /> diagnostics.</li>
            </ul>
          </div>

          {/* For Instructors */}
          <div className="space-y-2 p-4 rounded-xl bg-dark-50 border border-dark-100">
            <div className="flex items-center gap-2 font-bold text-sm text-dark-900">
              <Users className="w-4 h-4 text-purple-600" />
              <span>For Educators & Instructors</span>
            </div>
            <ul className="text-xs text-dark-600 space-y-1.5 list-disc pl-4">
              <li>Sign in as an Instructor (`instructor@qlearn.com`) to access the <strong>Instructor Dashboard</strong>.</li>
              <li>Map students to your class cohort, seed sample test rosters, and diagnose common misconceptions.</li>
              <li>Monitor real-time completion rates across all curriculum modules.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Core Architectural Highlights */}
      <section className="bg-dark-900 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-400">Engineering & Design</span>
          <h2 className="text-xl sm:text-2xl font-bold">Behind the Platform Technology</h2>
          <p className="text-xs sm:text-sm text-dark-400">
            QLearn combines cutting-edge web rendering with rigorous scientific Python simulation backends.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-700 space-y-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-sm text-white">Three.js 6-Axis 3D Engine</h3>
            <p className="text-xs text-dark-300 leading-relaxed">
              GPU-accelerated WebGL sphere with dynamic 60 FPS 3D-to-2D screen projection, real-time camera tracking, and illuminated polar/azimuthal angle sweep arcs.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-700 space-y-2">
            <Bot className="w-5 h-5 text-primary-400" />
            <h3 className="font-bold text-sm text-white">Schrödinger AI Socratic Coach</h3>
            <p className="text-xs text-dark-300 leading-relaxed">
              Powered by advanced Google Gemini models with domain-specific quantum prompts. Diagnoses physics misconceptions without spoiling gate answers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-800/80 border border-dark-700 space-y-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-sm text-white">Tri-Simulator Verification</h3>
            <p className="text-xs text-dark-300 leading-relaxed">
              Runs quantum circuits across IBM Qiskit, Google Cirq, and Xanadu PennyLane, computing exact statevectors, density matrices, and shot distributions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
