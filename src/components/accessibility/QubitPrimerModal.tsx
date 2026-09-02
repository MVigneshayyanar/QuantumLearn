'use client';

import React from 'react';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { X, Sparkles, Zap, Eye, Share2, CheckCircle2 } from 'lucide-react';

export function QubitPrimerModal() {
  const { primerModalOpen, setPrimerModalOpen, language } = useAccessibility();
  const t = translations[language];

  if (!primerModalOpen) return null;

  const handleClose = () => {
    setPrimerModalOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_seen_primer', 'true');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="primer-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-dark-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-200 flex items-center justify-between bg-gradient-to-r from-primary-50/50 to-white">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Onboarding Primer
            </span>
            <h2 id="primer-modal-title" className="text-xl font-bold text-dark-900">
              {t.primer.title}
            </h2>
            <p className="text-sm text-dark-600 mt-0.5">
              {t.primer.subtitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close primer"
            className="p-2 text-dark-400 hover:text-dark-700 hover:bg-dark-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Step 1: Classical Bit */}
          <div className="p-4 rounded-xl border border-dark-200 bg-dark-50/50 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-dark-200 text-dark-800 flex items-center justify-center shrink-0 font-mono font-bold text-lg">
              0|1
            </div>
            <div>
              <h3 className="font-semibold text-dark-900 text-base">{t.primer.step1Title}</h3>
              <p className="text-sm text-dark-600 mt-1 leading-relaxed">{t.primer.step1Desc}</p>
            </div>
          </div>

          {/* Step 2: Superposition */}
          <div className="p-4 rounded-xl border border-primary-200 bg-primary-50/30 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-primary-900 text-base">{t.primer.step2Title}</h3>
              <p className="text-sm text-dark-700 mt-1 leading-relaxed">{t.primer.step2Desc}</p>
              <div className="mt-2 inline-block px-3 py-1 rounded bg-white border border-primary-200 font-mono text-xs text-primary-800 font-medium">
                |ψ⟩ = α|0⟩ + β|1⟩ &nbsp; (|α|² + |β|² = 1)
              </div>
            </div>
          </div>

          {/* Step 3: Measurement */}
          <div className="p-4 rounded-xl border border-dark-200 bg-dark-50/50 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-dark-800 text-white flex items-center justify-center shrink-0">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-dark-900 text-base">{t.primer.step3Title}</h3>
              <p className="text-sm text-dark-600 mt-1 leading-relaxed">{t.primer.step3Desc}</p>
            </div>
          </div>

          {/* Step 4: Entanglement */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900 text-base">{t.primer.step4Title}</h3>
              <p className="text-sm text-dark-700 mt-1 leading-relaxed">{t.primer.step4Desc}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-200 bg-dark-50/50 flex justify-end">
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4" />
            {t.primer.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}
