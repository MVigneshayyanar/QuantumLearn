'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAccessibility, FontSizeOption, ExplanationMode, Language } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { Type, Sparkles, BookOpen, Activity, Globe, HelpCircle } from 'lucide-react';

export function AccessibilityBar() {
  const pathname = usePathname();
  const {
    fontSize,
    setFontSize,
    explanationMode,
    setExplanationMode,
    reducedMotion,
    setReducedMotion,
    language,
    setLanguage,
    setPrimerModalOpen
  } = useAccessibility();

  const t = translations[language];

  // Hide top bar on full-screen practice workbench
  if (pathname.startsWith('/practice/') && pathname !== '/practice') {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Accessibility and Learning Preferences"
      className="bg-dark-50 border-b border-dark-200 text-xs text-dark-700 py-1.5 relative z-40"
    >
      <div className="w-full mx-auto px-8 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Explanation Mode Toggle (Core to school vs researcher) */}
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-dark-900 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            {t.a11y.explanationMode}:
          </span>
          <div className="inline-flex rounded-md shadow-sm bg-white p-0.5 border border-dark-200" role="group">
            <button
              type="button"
              onClick={() => setExplanationMode('simple')}
              aria-pressed={explanationMode === 'simple'}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                explanationMode === 'simple'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-700 hover:text-dark-900 hover:bg-dark-100'
              }`}
            >
              {t.a11y.simpleMode}
            </button>
            <button
              type="button"
              onClick={() => setExplanationMode('technical')}
              aria-pressed={explanationMode === 'technical'}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                explanationMode === 'technical'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-700 hover:text-dark-900 hover:bg-dark-100'
              }`}
            >
              {t.a11y.technicalMode}
            </button>
          </div>
        </div>

        {/* Right: Font size, Reduced motion, Language, Qubit Primer */}
        <div className="flex items-center flex-wrap gap-4">
          {/* Font Size Scaling */}
          <div className="flex items-center space-x-1">
            <Type className="w-3.5 h-3.5 text-dark-500" aria-hidden="true" />
            <span className="sr-only">{t.a11y.fontSize}</span>
            <div className="flex items-center space-x-0.5 bg-white border border-dark-200 rounded p-0.5">
              {(['sm', 'md', 'lg', 'xl'] as FontSizeOption[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  aria-pressed={fontSize === size}
                  className={`w-6 h-5 flex items-center justify-center rounded text-[11px] font-medium uppercase ${
                    fontSize === size
                      ? 'bg-dark-900 text-white'
                      : 'text-dark-600 hover:bg-dark-100'
                  }`}
                  title={`Set text size: ${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion Toggle */}
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-pressed={reducedMotion}
            className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
              reducedMotion
                ? 'bg-primary-50 border-primary-300 text-primary-800 font-medium'
                : 'bg-white border-dark-200 text-dark-700 hover:bg-dark-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{t.a11y.reducedMotion}</span>
          </button>

          {/* Language Switcher (EN / ES / FR / DE / HI) */}
          <div className="flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-dark-500" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              aria-label={t.a11y.language}
              className="bg-white border border-dark-200 text-dark-800 rounded px-2 py-0.5 text-xs font-medium cursor-pointer hover:border-dark-400 focus:ring-1 focus:ring-primary-500"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="es">Español (ES)</option>
              <option value="fr">Français (FR)</option>
              <option value="de">Deutsch (DE)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ja">日本語 (Japanese)</option>
              <option value="zh-CN">中文 (Chinese)</option>
            </select>
          </div>

          {/* What is a Qubit Primer button */}
          <button
            type="button"
            onClick={() => setPrimerModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-primary-100 hover:bg-primary-200 text-primary-900 font-semibold transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-primary-700" />
            <span>{t.primer.title.split(':')[1] || 'What is a Qubit?'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
