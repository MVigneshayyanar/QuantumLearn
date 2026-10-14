'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAccessibility, ExplanationMode, Language } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { Sparkles, BookOpen, Activity, Globe, HelpCircle } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function AccessibilityBar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const {
    explanationMode,
    setExplanationMode,
    reducedMotion,
    setReducedMotion,
    language,
    setLanguage,
    setPrimerModalOpen
  } = useAccessibility();

  const t = translations[language];

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    if (newLang === language) return;
    setLanguage(newLang);

    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (select) {
      select.value = newLang === 'en' ? '' : newLang;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    setTimeout(() => {
      window.location.reload();
    }, 120);
  };

  // Hide top bar on full-screen practice workbench
  if (pathname.startsWith('/practice/') && pathname !== '/practice') {
    return null;
  }
  return (
    <div
      role="region"
      aria-label="Accessibility and Learning Preferences"
      className={isHomePage
        ? 'bg-dark-50 dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 text-xs text-dark-700 dark:text-dark-300 py-1.5 relative z-40'
        : 'max-h-0 overflow-hidden opacity-0 pointer-events-none py-0 transition-[max-height,opacity] duration-200 group-hover/nav-shell:max-h-20 group-hover/nav-shell:opacity-100 group-hover/nav-shell:pointer-events-auto group-focus-within/nav-shell:max-h-20 group-focus-within/nav-shell:opacity-100 group-focus-within/nav-shell:pointer-events-auto bg-dark-50 dark:bg-dark-900 border-b border-dark-200 dark:border-dark-800 text-xs text-dark-700 dark:text-dark-300 relative z-40'}
    >
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left: Explanation Mode Toggle (Core to school vs researcher) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="font-semibold text-dark-900 dark:text-white flex items-center gap-1 text-[11px] sm:text-xs">
            <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
            <span className="hidden xs:inline">{t.a11y.explanationMode}:</span>
          </span>
          <div className="inline-flex rounded-md shadow-sm bg-white dark:bg-dark-800 p-0.5 border border-dark-200 dark:border-dark-700" role="group">
            <button
              type="button"
              onClick={() => setExplanationMode('simple')}
              aria-pressed={explanationMode === 'simple'}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[11px] sm:text-xs font-medium transition-colors ${
                explanationMode === 'simple'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700'
              }`}
            >
              {t.a11y.simpleMode}
            </button>
            <button
              type="button"
              onClick={() => setExplanationMode('technical')}
              aria-pressed={explanationMode === 'technical'}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[11px] sm:text-xs font-medium transition-colors ${
                explanationMode === 'technical'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-100 dark:hover:bg-dark-700'
              }`}
            >
              {t.a11y.technicalMode}
            </button>
          </div>
        </div>

        {/* Right: Reduced motion, Language, Qubit Primer */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-4">
          {/* Reduced Motion Toggle */}
          <button
            type="button"
            onClick={() => setReducedMotion(!reducedMotion)}
            aria-pressed={reducedMotion}
            className={`flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border text-[11px] sm:text-xs transition-colors ${
              reducedMotion
                ? 'bg-primary-50 dark:bg-primary-950/70 border-primary-300 dark:border-primary-700 text-primary-800 dark:text-primary-300 font-medium'
                : 'bg-white dark:bg-dark-800 border-dark-200 dark:border-dark-700 text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.a11y.reducedMotion}</span>
            <span className="sm:hidden">Motion</span>
          </button>

          {/* Theme Toggle Button (Light/Dark) */}
          <ThemeToggle variant="bar" />

          {/* Language Switcher (EN / ES / FR / DE / HI / TA / TE / JA / ZH) */}
          <div className="flex items-center space-x-1 notranslate" translate="no">
            <Globe className="w-3.5 h-3.5 text-dark-500 dark:text-dark-400 shrink-0" />
            <select
              value={language}
              onChange={handleLanguageChange}
              aria-label={t.a11y.language}
              className="bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-700 text-dark-800 dark:text-dark-200 rounded px-1.5 py-0.5 text-[11px] sm:text-xs font-medium cursor-pointer hover:border-dark-400 focus:ring-1 focus:ring-primary-500 notranslate"
              translate="no"
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
            className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded bg-primary-100 dark:bg-primary-950/70 hover:bg-primary-200 dark:hover:bg-primary-900/80 text-primary-900 dark:text-primary-300 border border-transparent dark:border-primary-800/60 font-semibold text-[11px] sm:text-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-primary-700 dark:text-primary-400 shrink-0" />
            <span className="hidden sm:inline">{t.primer.title.split(':')[1] || 'What is a Qubit?'}</span>
            <span className="sm:hidden">Primer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
