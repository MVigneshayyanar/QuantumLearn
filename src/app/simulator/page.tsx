'use client';

import React from 'react';
import { CircuitBuilder } from '@/components/circuit-builder/CircuitBuilder';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { Cpu, Info } from 'lucide-react';

export default function SimulatorPage() {
  const { language } = useAccessibility();
  const t = translations[language];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="bg-white rounded-3xl border border-dark-200 p-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-primary-600" />
            Simulator Workbench
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-dark-100 text-dark-700">
            Qiskit 2.5
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 tracking-tight">
          {t.simulator.title}
        </h1>
        <p className="text-sm text-dark-600 mt-1 max-w-3xl leading-relaxed">
          {t.simulator.subtitle}
        </p>
      </div>

      {/* Main Interactive Builder */}
      <CircuitBuilder />
    </div>
  );
}
