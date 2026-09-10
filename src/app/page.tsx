'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { useAITutorStore } from '@/lib/state-store';
import {
  Atom,
  Cpu,
  Globe,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Bot,
  Layers,
  Zap,
  Play,
  CheckCircle2,
  Info,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';
import { MathRenderer } from '@/components/math/MathRenderer';

export default function HomePage() {
  const { language, explanationMode, setPrimerModalOpen } = useAccessibility();
  const { setIsOpen: setAITutorOpen } = useAITutorStore();
  const t = translations[language];

  // Quick live demo states for the hero section
  const [heroGate, setHeroGate] = useState<'0' | 'plus' | 'one' | 'bell'>('plus');

  const getHeroBloch = () => {
    if (heroGate === '0') {
      return { qubit: 0, x: 0, y: 0, z: 1, theta: 0, phi: 0, purity: 1, is_pure: true };
    } else if (heroGate === 'plus') {
      return { qubit: 0, x: 1, y: 0, z: 0, theta: Math.PI / 2, phi: 0, purity: 1, is_pure: true };
    } else if (heroGate === 'one') {
      return { qubit: 0, x: 0, y: 0, z: -1, theta: Math.PI, phi: 0, purity: 1, is_pure: true };
    } else {
      // Bell state -> Entangled (null bloch)
      return null;
    }
  };

  const algorithmCards = [
    {
      slug: 'deutsch-jozsa',
      title: t.algorithms.deutschJozsa.title,
      category: t.algorithms.deutschJozsa.category,
      summary: t.algorithms.deutschJozsa.summary,
      qubits: t.algorithms.deutschJozsa.qubits,
      speedup: t.algorithms.deutschJozsa.speedup,
      href: '/learn/deutsch-jozsa',
      tagColor: 'bg-primary-50 text-primary-700 border-primary-100'
    },
    {
      slug: 'grover',
      title: t.algorithms.grover.title,
      category: t.algorithms.grover.category,
      summary: t.algorithms.grover.summary,
      qubits: t.algorithms.grover.qubits,
      speedup: t.algorithms.grover.speedup,
      href: '/learn/grover',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-100'
    },
    {
      slug: 'teleportation',
      title: t.algorithms.teleportation.title,
      category: t.algorithms.teleportation.category,
      summary: t.algorithms.teleportation.summary,
      qubits: t.algorithms.teleportation.qubits,
      speedup: t.algorithms.teleportation.speedup,
      href: '/learn/teleportation',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-100'
    },
    {
      slug: 'superdense-coding',
      title: t.algorithms.superdenseCoding.title,
      category: t.algorithms.superdenseCoding.category,
      summary: t.algorithms.superdenseCoding.summary,
      qubits: t.algorithms.superdenseCoding.qubits,
      speedup: t.algorithms.superdenseCoding.speedup,
      href: '/learn/superdense-coding',
      tagColor: 'bg-violet-50 text-violet-700 border-violet-100'
    }
  ];

  return (
    <div className="space-y-12 sm:space-y-16 py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="w-full pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-xs font-semibold text-primary-800">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[42px] xl:text-5xl font-extrabold text-dark-900 tracking-tight leading-[1.15]">
              {t.hero.title}
            </h1>

            <p className="text-base sm:text-lg text-dark-600 leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/learn/deutsch-jozsa"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm shadow-card hover:shadow-card-hover transition-all"
              >
                <span>{t.hero.startLearning}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/simulator"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-dark-50 border border-dark-200 text-dark-800 font-semibold text-sm shadow-subtle transition-all"
              >
                <Cpu className="w-4 h-4 text-primary-600" />
                <span>{t.hero.openBuilder}</span>
              </Link>
              <a
                href="#what-is-quantum"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-semibold text-sm shadow-subtle transition-all cursor-pointer group"
              >
                <Info className="w-4 h-4 text-indigo-600" />
                <span>What is Quantum?</span>
                <ChevronDown className="w-4 h-4 text-indigo-600 group-hover:translate-y-0.5 transition-transform" />
              </a>
            </div>

            {/* Quick stats pills */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dark-200 max-w-lg text-xs">
              <div>
                <span className="font-bold text-dark-900 text-sm block">Multi-Simulator</span>
                <span className="text-dark-500">Qiskit · Cirq · PennyLane</span>
              </div>
              <div>
                <span className="font-bold text-dark-900 text-sm block">Three.js 3D</span>
                <span className="text-dark-500">{t.hero.statsBloch}</span>
              </div>
              <div>
                <span className="font-bold text-dark-900 text-sm block">Schrödinger AI</span>
                <span className="text-dark-500">{t.hero.statsAI}</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Live Interactive Bloch Sphere Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-sm bg-white rounded-3xl border border-dark-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-dark-900 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-primary-600" />
                  Live 3D State Sandbox
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary-50 text-primary-700">
                  Interactive
                </span>
              </div>

              {/* 3D Visualizer */}
              <BlochSphere3D
                bloch={getHeroBloch()}
                qubitIndex={0}
                warning={heroGate === 'bell' ? 'Qubit is entangled in Bell State (|00⟩ + |11⟩)/√2 — single-qubit Bloch vector is undefined' : undefined}
                size={240}
              />

              {/* Quick state selector buttons */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[11px] text-dark-500 font-medium block">Test quantum state transformation:</span>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setHeroGate('0')}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors ${
                      heroGate === '0' ? 'bg-primary-600 text-white border-primary-600' : 'bg-dark-50 border-dark-200 text-dark-800'
                    }`}
                  >
                    |0⟩
                  </button>
                  <button
                    onClick={() => setHeroGate('plus')}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors ${
                      heroGate === 'plus' ? 'bg-primary-600 text-white border-primary-600' : 'bg-dark-50 border-dark-200 text-dark-800'
                    }`}
                  >
                    |+⟩ (H)
                  </button>
                  <button
                    onClick={() => setHeroGate('one')}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors ${
                      heroGate === 'one' ? 'bg-primary-600 text-white border-primary-600' : 'bg-dark-50 border-dark-200 text-dark-800'
                    }`}
                  >
                    |1⟩ (X)
                  </button>
                  <button
                    onClick={() => setHeroGate('bell')}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-colors ${
                      heroGate === 'bell' ? 'bg-amber-600 text-white border-amber-600' : 'bg-dark-50 border-dark-200 text-dark-800'
                    }`}
                  >
                    Bell (CX)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Quantum? Focused Educational Section */}
      <section id="what-is-quantum" className="w-full scroll-mt-6">
        <div className="bg-white rounded-3xl border border-dark-200 p-5 sm:p-8 lg:p-10 shadow-card space-y-6">
          {/* Header with Explanation Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-100 pb-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-semibold text-indigo-800">
                <Atom className="w-3.5 h-3.5 text-indigo-600" />
                <span>Quantum Physics 101</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-dark-900 tracking-tight">
                What is Quantum?
              </h2>
              <p className="text-xs sm:text-sm text-dark-600">
                {explanationMode === 'simple'
                  ? 'The physics of the ultra-small, where particles act like waves and possibilities stay open until you look.'
                  : 'The fundamental physical framework governing subatomic matter, quantization of energy, and probability amplitudes in Hilbert space.'}
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

          {/* Dynamic Content based on explanationMode */}
          {explanationMode === 'simple' ? (
            /* Simple Mode: Intuitive Analogies */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs animate-fadeIn">
              <div className="bg-dark-50/70 p-5 rounded-2xl border border-dark-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-dark-900 text-sm">Energy in Tiny Packets ("Quanta")</h3>
                <p className="text-dark-600 leading-relaxed">
                  In everyday life, energy seems like a continuous stream of water from a tap. But in 1900, physicists discovered that energy actually travels only in indivisible, tiny drops called <strong>quanta</strong> (like coins or individual marbles). You can have 1 drop or 2 drops, but never half a drop!
                </p>
              </div>

              <div className="bg-dark-50/70 p-5 rounded-2xl border border-dark-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-dark-900 text-sm">Particles Are Also Waves</h3>
                <p className="text-dark-600 leading-relaxed">
                  A baseball in your hand is always in one exact spot. But tiny quantum particles (like electrons and photons) spread out like ripples across a pond! They have the potential to be in multiple places at once until an instrument or human measures them.
                </p>
              </div>

              <div className="bg-dark-50/70 p-5 rounded-2xl border border-dark-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-dark-900 text-sm">Why It Changes Computing</h3>
                <p className="text-dark-600 leading-relaxed">
                  Classical computers use regular light switches called <strong>bits</strong> (strictly 0 or 1). Quantum computers use <strong>qubits</strong>, which can be a blend of both. This lets them test millions of possibilities simultaneously to solve problems classical supercomputers never could!
                </p>
              </div>
            </div>
          ) : (
            /* Technical / Math Mode: Rigorous Physics Formulations */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs animate-fadeIn">
              <div className="bg-dark-50/70 p-5 rounded-2xl border border-dark-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-bold text-dark-900 text-sm">Planck's Energy Quantization</h3>
                <p className="text-dark-600 leading-relaxed">
                  Formulated by Max Planck (1900) to resolve the black-body ultraviolet catastrophe. Energy exchange occurs in discrete integer multiples of the quantum:
                </p>
                <div className="p-2.5 rounded-xl bg-white border border-dark-200 font-mono text-center font-bold text-primary-900">
                  <MathRenderer text="$E = h\nu = \hbar\omega$" />
                </div>
                <p className="text-dark-500">
                  where <MathRenderer text="$h \approx 6.626 \times 10^{-34} \text{ J}\cdot\text{s}$" /> is Planck's constant and <MathRenderer text="$\hbar = h / (2\pi)$" />.
                </p>
              </div>

              <div className="bg-dark-50/70 p-5 rounded-2xl border border-dark-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-bold text-dark-900 text-sm">de Broglie Wave-Particle Duality</h3>
                <p className="text-dark-600 leading-relaxed">
                  de Broglie relation (1924) establishing matter waves. Every particle with momentum <MathRenderer text="$p$" /> exhibits an associated wavelength:
                </p>
                <div className="p-2.5 rounded-xl bg-white border border-dark-200 font-mono text-center font-bold text-emerald-900">
                  <MathRenderer text="$\lambda = \frac{h}{p} = \frac{h}{mv}$" />
                </div>
                <p className="text-dark-500">
                  Confirmed through double-slit interference experiments using electrons and fullerenes.
                </p>
              </div>

              <div className="bg-dark-50/70 p-5 rounded-2xl border border-dark-200 space-y-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-bold text-dark-900 text-sm">Schrödinger Equation & Born Rule</h3>
                <p className="text-dark-600 leading-relaxed">
                  Quantum systems evolve deterministically in complex Hilbert space <MathRenderer text="$\mathcal{H}$" /> via unitary generators:
                </p>
                <div className="p-2.5 rounded-xl bg-white border border-dark-200 font-mono text-center font-bold text-purple-900">
                  <MathRenderer text="$i\hbar \frac{\partial |\psi\rangle}{\partial t} = \hat{H}|\psi\rangle$" />
                </div>
                <p className="text-dark-500">
                  Measurement collapses <MathRenderer text="$|\psi\rangle$" /> into eigenstate <MathRenderer text="$|i\rangle$" /> with probability <MathRenderer text="$P(i) = |\langle i|\psi\rangle|^2$" />.
                </p>
              </div>
            </div>
          )}

          {/* Action Banner: More Button going to /about */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-primary-50 via-indigo-50 to-white border border-primary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-primary-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-600" />
                Want to learn all the quantum concepts in detail?
              </h3>
              <p className="text-xs text-dark-600">
                Explore Qubits, Superposition, Entanglement, Quantum Speedup, and the Classical vs Quantum Comparison Matrix with full explanations in our About guide.
              </p>
            </div>
            <Link
              href="/about#quantum-guide"
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all shrink-0 self-start sm:self-auto group"
            >
              <span>Explore Complete Guide in About</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Core Algorithm Modules Grid */}
      <section className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
              Curriculum Roadmap
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 mt-2 tracking-tight">
              4 Guided Quantum Algorithm Modules
            </h2>
            <p className="text-sm text-dark-600 mt-1">
              Each module follows our structured Intuition → Math → Circuit → Simulation → Quiz flow.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {algorithmCards.map((algo) => (
            <div
              key={algo.slug}
              className="bg-white rounded-3xl border border-dark-200 p-8 shadow-xs hover:shadow-card hover:border-primary-300 transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${algo.tagColor}`}>
                    {algo.category}
                  </span>
                  <div className="flex items-center gap-2 text-xs font-mono text-dark-500">
                    <span>{algo.qubits}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{algo.speedup}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-dark-900">{algo.title}</h3>
                <p className="text-sm text-dark-600 leading-relaxed">{algo.summary}</p>
              </div>

              <div className="pt-4 border-t border-dark-100 flex items-center justify-between">
                <span className="text-xs text-dark-500">4-Stage Guided Pedagogy</span>
                <Link
                  href={algo.href}
                  className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <span>Launch Module</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {/* Adding More Soon card */}
          <div className="bg-gradient-to-br from-dark-50 to-indigo-50/50 rounded-3xl border border-dashed border-primary-200 p-8 shadow-xs flex flex-col justify-between space-y-6 opacity-90">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-3 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-100">
                  Coming Soon
                </span>
                <span className="text-xs font-mono text-dark-400">In Development</span>
              </div>

              <h3 className="text-xl font-bold text-dark-700">More Quantum Algorithms</h3>
              <p className="text-sm text-dark-500 leading-relaxed">
                We are actively building more algorithm modules with the same 6-stage pedagogy (Intuition → Math → Circuit → Build It → Quiz → Assessment).
              </p>

              <div className="flex flex-wrap gap-2 pt-1">
                {["Shor's Algorithm", "Quantum Phase Estimation", "VQE", "Quantum Fourier Transform"].map((name) => (
                  <span key={name} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-dark-200 text-xs text-dark-600 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" />
                    {name}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-dark-100 flex items-center justify-between">
              <span className="text-xs text-dark-400 italic">Adding more soon…</span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
                <span>🚀</span>
                <span>Stay tuned</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Accessibility & Inclusive Education Feature Section */}
      <section className="bg-white border-y border-dark-200 py-12 sm:py-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
              Adaptive Quantum Education
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
              Designed for School Students to Researchers
            </h2>
            <p className="text-sm text-dark-600">
              Toggle between intuitive plain-language analogies and mathematical Dirac notation across every module.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-dark-200 bg-dark-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-dark-900">Dual Explanation Engine</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Seamlessly switch between High-School intuitive metaphors and university-level Dirac tensor product formalisms with one click.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-dark-200 bg-dark-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-dark-900">Keyboard & Screen Reader Accessible</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Full arrow-key circuit editing, hotkeys (H, X, Z, C), live region quantum state announcements, and dynamic font scaling.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-dark-200 bg-dark-50/40 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-dark-900">Schrödinger Misconception AI</h3>
              <p className="text-xs text-dark-600 leading-relaxed">
                Analyzes quiz mistakes to diagnose physics misconceptions (e.g. classical probability vs superposition) and guides learning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
