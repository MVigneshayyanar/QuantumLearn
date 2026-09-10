'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { Atom, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  const { language } = useAccessibility();
  const t = translations[language];

  // Hide footer on practice arena & coding workbench
  if (pathname.startsWith('/practice')) {
    return null;
  }

  return (
    <footer className="bg-white border-t border-dark-200 mt-20 text-xs text-dark-600" role="contentinfo">
      <div className="w-full mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 w-fit" aria-label="QLearn - Quantum Computing Learning Platform">
              <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <Atom className="w-4 h-4" />
              </div>
              <span className="font-bold text-dark-900 text-base">{t.nav.brand}</span>
            </Link>
            <p className="text-dark-500 leading-relaxed">
              Free interactive quantum computing education platform with multi-backend simulation (Qiskit, Cirq, PennyLane), real-time 3D Bloch sphere visualization, and Schrödinger AI tutoring.
            </p>
            <address className="not-italic text-dark-400 text-[11px] space-y-0.5">
              <p>© {new Date().getFullYear()} QLearn — qlearn.tech</p>
              <p>Open access quantum education, worldwide.</p>
            </address>
          </div>

          {/* Quantum Algorithm Modules */}
          <nav aria-label="Quantum algorithm modules">
            <h2 className="font-semibold text-dark-900 mb-3 text-xs uppercase tracking-wide">Quantum Algorithm Modules</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/learn/deutsch-jozsa" className="hover:text-primary-600 transition-colors">
                  Deutsch-Jozsa Algorithm — Quantum Parallelism
                </Link>
              </li>
              <li>
                <Link href="/learn/grover" className="hover:text-primary-600 transition-colors">
                  Grover&apos;s Quantum Search — O(√N) Speedup
                </Link>
              </li>
              <li>
                <Link href="/learn/teleportation" className="hover:text-primary-600 transition-colors">
                  Quantum Teleportation — Bell State Protocol
                </Link>
              </li>
              <li>
                <Link href="/learn/superdense-coding" className="hover:text-primary-600 transition-colors">
                  Superdense Coding — 2 Bits via 1 Qubit
                </Link>
              </li>
            </ul>
          </nav>

          {/* Tools and Visualizers */}
          <nav aria-label="Quantum tools and simulators">
            <h2 className="font-semibold text-dark-900 mb-3 text-xs uppercase tracking-wide">Tools & Simulators</h2>
            <ul className="space-y-2">
              <li>
                <Link href="/simulator" className="hover:text-primary-600 transition-colors">
                  Online Quantum Circuit Builder & Simulator
                </Link>
              </li>
              <li>
                <Link href="/bloch-sphere" className="hover:text-primary-600 transition-colors">
                  Interactive 3D Bloch Sphere Visualizer
                </Link>
              </li>
              <li>
                <Link href="/practice" className="hover:text-primary-600 transition-colors">
                  Quantum Computing Practice Problems
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-600 transition-colors font-medium text-primary-700">
                  About QLearn — Platform & Mission
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/MVigneshayyanar/QuantumLearn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 transition-colors inline-flex items-center gap-1"
                >
                  GitHub — Open Source <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </nav>

          {/* Accessibility & Standards */}
          <div>
            <h2 className="font-semibold text-dark-900 mb-3 text-xs uppercase tracking-wide">Accessibility & Standards</h2>
            <div className="space-y-3 text-dark-500">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-50 text-primary-800 border border-primary-200 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0" />
                <span>WCAG 2.1 AA Compliant</span>
              </div>
              <p className="text-xs leading-relaxed">
                Dual-mode explanations (intuitive &amp; Dirac notation), full keyboard navigation, screen reader ARIA, dynamic font scaling, and multilingual support.
              </p>
              <div className="space-y-1 text-[11px] text-dark-400">
                <p>✓ Quantum Simulator — Qiskit, Cirq, PennyLane</p>
                <p>✓ 3D Bloch Sphere — Three.js WebGL</p>
                <p>✓ Schrödinger AI — Socratic hints</p>
                <p>✓ OpenQASM 2.0 &amp; 3.0 export</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Learn quantum computing free at{' '}
            <Link href="/" className="text-primary-700 font-semibold hover:underline">
              qlearn.tech
            </Link>
            {' '}— Deutsch-Jozsa, Grover&apos;s Search, Quantum Teleportation, Superdense Coding.
          </p>
          <p className="flex items-center gap-1 shrink-0">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 mx-0.5" /> for quantum physics education.
          </p>
        </div>
      </div>
    </footer>
  );
}
