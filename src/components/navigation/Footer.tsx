'use client';

import React from 'react';
import Link from 'next/link';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { Atom, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const { language } = useAccessibility();
  const t = translations[language];

  return (
    <footer className="bg-white border-t border-dark-200 mt-20 text-xs text-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center">
                <Atom className="w-4 h-4" />
              </div>
              <span className="font-bold text-dark-900 text-base">{t.nav.brand}</span>
            </div>
            <p className="text-dark-500 leading-relaxed">
              Interactive Quantum Algorithm Learning Platform powered by real Qiskit simulation and Socratic AI.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 mb-3">Algorithms</h4>
            <ul className="space-y-2">
              <li><Link href="/learn/deutsch-jozsa" className="hover:text-primary-600 transition-colors">Deutsch-Jozsa</Link></li>
              <li><Link href="/learn/grover" className="hover:text-primary-600 transition-colors">Grover&apos;s Search</Link></li>
              <li><Link href="/learn/teleportation" className="hover:text-primary-600 transition-colors">Quantum Teleportation</Link></li>
              <li><Link href="/learn/superdense-coding" className="hover:text-primary-600 transition-colors">Superdense Coding</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 mb-3">Tools & Visualizers</h4>
            <ul className="space-y-2">
              <li><Link href="/simulator" className="hover:text-primary-600 transition-colors">Quantum Circuit Builder</Link></li>
              <li><Link href="/bloch-sphere" className="hover:text-primary-600 transition-colors">3D Bloch Sphere Explorer</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary-600 transition-colors">Concept Mastery Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-dark-900 mb-3">Accessibility & Standards</h4>
            <div className="space-y-2 text-dark-500">
              <div className="flex items-center gap-1.5 text-primary-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>WCAG 2.1 AA Compliant</span>
              </div>
              <p>Dual-mode simplified/technical explanations, full keyboard navigation, and screen reader ARIA support.</p>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} QuantumLearn. Built for quantum learners worldwide.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for quantum physics education.
          </p>
        </div>
      </div>
    </footer>
  );
}
