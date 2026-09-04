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
  CheckCircle2
} from 'lucide-react';
import { BlochSphere3D } from '@/components/bloch-sphere/BlochSphere3D';

export default function HomePage() {
  const { language, setPrimerModalOpen } = useAccessibility();
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
    <div className="space-y-24 py-8">
      {/* Hero Section */}
      <section className="w-full mx-auto px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 border border-primary-200 text-xs font-semibold text-primary-800">
              <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              <span>{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 tracking-tight leading-[1.1]">
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

      {/* 4 Core Algorithm Modules Grid */}
      <section className="w-full mx-auto px-8">
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
        </div>
      </section>

      {/* Accessibility & Inclusive Education Feature Section */}
      <section className="bg-white border-y border-dark-200 py-16">
        <div className="w-full mx-auto px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700">
              Universal Design (WCAG 2.1 AA)
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
