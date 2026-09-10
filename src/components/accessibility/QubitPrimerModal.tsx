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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-dark-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] shadow-2xl border border-dark-200 flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-dark-100 flex items-center justify-between bg-gradient-to-r from-primary-50/60 to-white shrink-0">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary-100 text-primary-800 mb-1">
              <Sparkles className="w-3 h-3" />
              Onboarding Primer
            </span>
            <h2 id="primer-modal-title" className="text-base sm:text-lg font-bold text-dark-900 leading-tight">
              {t.primer.title}
            </h2>
            <p className="text-xs text-dark-500 mt-0.5">
              {t.primer.subtitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close primer"
            className="p-1.5 text-dark-400 hover:text-dark-700 hover:bg-dark-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-2.5 overflow-y-auto flex-1 text-xs">
          {/* Step 1: Classical Bit */}
          <div className="p-3 rounded-xl border border-dark-200 bg-dark-50/60 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-dark-200 text-dark-800 flex items-center justify-center shrink-0 font-mono font-bold text-xs">
              0|1
            </div>
            <div>
              <h3 className="font-bold text-dark-900 text-xs sm:text-sm">{t.primer.step1Title}</h3>
              <p className="text-xs text-dark-600 mt-0.5 leading-relaxed">{t.primer.step1Desc}</p>
            </div>
          </div>

          {/* Step 2: Superposition */}
          <div className="p-3 rounded-xl border border-primary-200 bg-primary-50/40 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-primary-600 text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-primary-900 text-xs sm:text-sm">{t.primer.step2Title}</h3>
              <p className="text-xs text-dark-700 mt-0.5 leading-relaxed">{t.primer.step2Desc}</p>
              <div className="mt-1.5 inline-block px-2.5 py-0.5 rounded bg-white border border-primary-200 font-mono text-[11px] text-primary-800 font-medium shadow-2xs">
                |ψ⟩ = α|0⟩ + β|1⟩ &nbsp; (|α|² + |β|² = 1)
              </div>
            </div>
          </div>

          {/* Step 3: Measurement */}
          <div className="p-3 rounded-xl border border-dark-200 bg-dark-50/60 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-dark-800 text-white flex items-center justify-center shrink-0">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-dark-900 text-xs sm:text-sm">{t.primer.step3Title}</h3>
              <p className="text-xs text-dark-600 mt-0.5 leading-relaxed">{t.primer.step3Desc}</p>
            </div>
          </div>

          {/* Step 4: Entanglement */}
          <div className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 flex gap-3 items-start">
            <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-xs sm:text-sm">{t.primer.step4Title}</h3>
              <p className="text-xs text-dark-700 mt-0.5 leading-relaxed">{t.primer.step4Desc}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-dark-100 bg-dark-50/60 flex justify-end shrink-0">
          <button
            onClick={handleClose}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.primer.gotIt}
          </button>
        </div>
      </div>
    </div>
  );
}
