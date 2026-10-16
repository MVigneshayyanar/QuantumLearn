'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSizeOption = 'sm' | 'md' | 'lg' | 'xl';
export type ExplanationMode = 'simple' | 'technical';
export type Language = 'en' | 'hi' | 'es' | 'fr' | 'de' | 'ta' | 'te' | 'ja' | 'zh-CN';
export type ThemeMode = 'light' | 'dark';

interface AccessibilityContextType {
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
  explanationMode: ExplanationMode;
  setExplanationMode: (mode: ExplanationMode) => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language, reload?: boolean) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  primerModalOpen: boolean;
  setPrimerModalOpen: (open: boolean) => void;
  announce: (message: string) => void;
  liveAnnouncement: string;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

/**
 * Completely remove googtrans cookies across all domain and path combinations
 * so Google Translate never lingers on a previously selected language.
 */
export function clearGoogleTransCookies() {
  if (typeof window === 'undefined') return;
  const host = window.location.hostname;
  const domainParts = host.split('.');
  const rootDomain = domainParts.length > 1 ? '.' + domainParts.slice(-2).join('.') : host;

  const domains = [
    '',
    host,
    `.${host}`,
    rootDomain,
    `.${rootDomain}`,
    'localhost',
    '.localhost',
    '127.0.0.1',
    '.127.0.0.1'
  ];

  const paths = ['/', '', window.location.pathname];
  for (const domain of domains) {
    for (const path of paths) {
      const dAttr = domain ? `; domain=${domain}` : '';
      const pAttr = path ? `; path=${path}` : '; path=/';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0${pAttr}${dAttr}; SameSite=Lax`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0${pAttr}${dAttr}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0${pAttr}${dAttr}`;
    }
  }

  try {
    sessionStorage.removeItem('googtrans');
    localStorage.removeItem('googtrans');
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const k = sessionStorage.key(i);
      if (k && (k.includes('goog') || k.includes('trans'))) {
        sessionStorage.removeItem(k);
      }
    }
  } catch (e) {}
}

/**
 * Configure googtrans cookies across localhost and live domain variations
 * to ensure full-site translation can read and translate the entire site reliably.
 */
export function setGoogleTransCookie(targetLang: Language) {
  if (typeof window === 'undefined') return;
  const host = window.location.hostname;
  const isLocalhost = host === 'localhost' || host === '127.0.0.1';

  // 1. First clear any previous cookies
  clearGoogleTransCookies();

  // 2. Set new cookies only if foreign language
  if (targetLang && targetLang !== 'en') {
    document.cookie = `googtrans=/en/${targetLang}; path=/; SameSite=Lax;`;
    document.cookie = `googtrans=/auto/${targetLang}; path=/; SameSite=Lax;`;
    if (!isLocalhost) {
      document.cookie = `googtrans=/en/${targetLang}; path=/; domain=${host}; SameSite=Lax;`;
      document.cookie = `googtrans=/auto/${targetLang}; path=/; domain=.${host}; SameSite=Lax;`;
    }
  }
}

/**
 * Immediately restore Google Translate to original English in DOM.
 */
export function restoreGoogleTranslateOriginal() {
  if (typeof window === 'undefined') return;

  clearGoogleTransCookies();

  // 1. Reset .goog-te-combo dropdown to empty ("")
  const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
  if (select) {
    select.value = '';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    select.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // 2. Click restore / show original inside Google Translate iframe if present
  try {
    const iframes = document.querySelectorAll('iframe.goog-te-banner-frame');
    iframes.forEach((iframe: any) => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          const buttons = doc.querySelectorAll('button, a, .goog-close-link');
          buttons.forEach((btn: any) => {
            const txt = (btn.innerText || btn.textContent || '').toLowerCase();
            const id = (btn.id || '').toLowerCase();
            const cls = (btn.className || '').toLowerCase();
            if (
              id.includes('restore') ||
              cls.includes('close') ||
              cls.includes('restore') ||
              txt.includes('original') ||
              txt.includes('restore')
            ) {
              btn.click();
            }
          });
        }
      } catch (e) {}
    });
  } catch (e) {}

  // 3. Click any document-level close or restore links
  const closeBtn = document.querySelector('.goog-close-link, [id*="restore"]') as HTMLElement | null;
  if (closeBtn) closeBtn.click();

  // 4. Reset body positioning
  if (document.body) {
    document.body.style.top = '0px';
    document.body.style.position = 'static';
  }
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSizeOption>('md');
  const [explanationMode, setExplanationModeState] = useState<ExplanationMode>('simple');
  const [reducedMotion, setReducedMotionState] = useState<boolean>(false);
  const [language, setLanguageState] = useState<Language>('en');
  const [highContrast, setHighContrastState] = useState<boolean>(false);
  const [theme, setThemeState] = useState<ThemeMode>('light');
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

      const supportedList: Language[] = ['en', 'hi', 'es', 'fr', 'de', 'ta', 'te', 'ja', 'zh-CN'];
      const urlParams = new URLSearchParams(window.location.search);
      const urlLang = urlParams.get('lang') || urlParams.get('locale');
      if (urlLang && supportedList.includes(urlLang as Language)) {
        setLanguageState(urlLang as Language);
        localStorage.setItem('ql_language', urlLang);
        document.cookie = `NEXT_LOCALE=${urlLang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.lang = urlLang;
        document.documentElement.setAttribute('data-lang', urlLang);
        if (urlLang === 'en') {
          clearGoogleTransCookies();
        } else {
          setGoogleTransCookie(urlLang as Language);
        }
      } else {
        const savedLang = localStorage.getItem('ql_language') as Language;
        if (savedLang && supportedList.includes(savedLang)) {
          setLanguageState(savedLang);
          document.cookie = `NEXT_LOCALE=${savedLang}; path=/; max-age=31536000; SameSite=Lax`;
          document.documentElement.lang = savedLang;
          document.documentElement.setAttribute('data-lang', savedLang);
          if (savedLang === 'en') {
            clearGoogleTransCookies();
          } else {
            setGoogleTransCookie(savedLang);
          }
        }
      }

      // Load initial theme from localStorage (defaults directly to light mode)
      const savedTheme = localStorage.getItem('ql_theme') as ThemeMode | null;
      const initialTheme: ThemeMode = savedTheme === 'dark' ? 'dark' : 'light';
      setThemeState(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Check if user has seen primer onboarding
      const seenPrimer = localStorage.getItem('ql_seen_primer');
      if (!seenPrimer) {
        setPrimerModalOpen(true);
      }
    }
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.setAttribute('data-theme', 'light');
      }
    }
    announce(newTheme === 'dark' ? 'Dark theme enabled' : 'Light theme enabled');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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

  const setLanguage = (lang: Language, reload = false) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ql_language', lang);
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = lang;
      document.documentElement.setAttribute('data-lang', lang);

      if (lang === 'en') {
        clearGoogleTransCookies();
        restoreGoogleTranslateOriginal();
      } else {
        setGoogleTransCookie(lang);
      }

      window.dispatchEvent(new CustomEvent('quanbit:language-change', { detail: { language: lang } }));

      if (reload) {
        const url = new URL(window.location.href);
        if (lang === 'en') {
          // Remove ?lang= or ?locale= params so the page loads in clean native English
          url.searchParams.delete('lang');
          url.searchParams.delete('locale');
          const cleanTarget = url.pathname + (url.search ? url.search : '') + url.hash;
          window.location.href = cleanTarget;
        } else {
          if (url.searchParams.has('lang')) {
            url.searchParams.set('lang', lang);
            window.location.href = url.toString();
          } else if (url.searchParams.has('locale')) {
            url.searchParams.set('locale', lang);
            window.location.href = url.toString();
          } else {
            window.location.reload();
          }
        }
      }
    }
    announce(`Language set to ${lang}`);
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
        theme,
        setTheme,
        toggleTheme,
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

export function useTheme() {
  const { theme, setTheme, toggleTheme } = useAccessibility();
  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark',
  };
}
