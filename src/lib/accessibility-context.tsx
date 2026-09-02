'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl';
export type ExplanationMode = 'simple' | 'technical';
export type Language = 'en' | 'hi';

interface AccessibilityContextType {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  explanationMode: ExplanationMode;
  setExplanationMode: (mode: ExplanationMode) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  primerModalOpen: boolean;
  setPrimerModalOpen: (open: boolean) => void;
  announce: (message: string) => void;
  liveAnnouncement: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('md');
  const [explanationMode, setExplanationModeState] = useState<ExplanationMode>('simple');
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [primerModalOpen, setPrimerModalOpen] = useState<boolean>(false);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedFontSize = localStorage.getItem('ql_font_size') as FontSizeOption;
      if (savedFontSize) setFontSizeState(savedFontSize);

      const savedMode = localStorage.getItem('ql_explanation_mode') as ExplanationMode;
      if (savedMode) setExplanationModeState(savedMode);

      const savedMotion = localStorage.getItem('ql_reduced_motion');
      if (savedMotion !== null) setReducedMotionState(savedMotion === 'true');

      const savedLang = localStorage.getItem('ql_language') as Language;
      if (savedLang) setLanguageState(savedLang);

      // Check if user has seen primer onboarding
      const seenPrimer = localStorage.getItem('ql_seen_primer');
      if (!seenPrimer) {
        setPrimerModalOpen(true);
      }
    }
  }, []);

  const setFontSize = (size: FontSizeOption) => {
    setFontSizeState(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_font_size', size);
      document.documentElement.setAttribute('data-font-size', size);
    }
    announce(`Font size changed to ${size}`);
  };

  const setExplanationMode = (mode: ExplanationMode) => {
    setExplanationModeState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_explanation_mode', mode);
    }
    announce(`Explanation mode switched to ${mode === 'simple' ? 'Simple / High School' : 'Technical / Mathematical'}`);
  };

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_reduced_motion', String(val));
      if (val) {
        document.documentElement.classList.add('reduce-motion');
      } else {
        document.documentElement.classList.remove('reduce-motion');
      }
    }
    announce(`Reduced motion ${val ? 'enabled' : 'disabled'}`);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_language', lang);
    }
    announce(`Language set to ${lang === 'en' ? 'English' : 'Hindi (हिन्दी)'}`);
  };

  const setHighContrast = (val: boolean) => {
    setHighContrastState(val);
    if (typeof window !== 'undefined') {
      if (val) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
    }
  };

  const announce = (message: string) => {
    setLiveAnnouncement(message);
    // Clear after 3 seconds so subsequent identical messages re-announce
    setTimeout(() => setLiveAnnouncement(''), 3000);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        explanationMode,
        setExplanationMode,
        reducedMotion,
        setReducedMotion,
        language,
        setLanguage,
        highContrast,
        setHighContrast,
        primerModalOpen,
        setPrimerModalOpen,
        announce,
        liveAnnouncement,
      }}
    >
      {/* Screen Reader Live Region for WCAG AA compliance */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="a11y-announcer"
      >
        {liveAnnouncement}
      </div>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
