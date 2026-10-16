'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAccessibility, setGoogleTransCookie } from '@/lib/accessibility-context';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslator() {
  const { language } = useAccessibility();
  const pathname = usePathname();
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // 1. Define global Google Translate initialization callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,es,fr,de,ta,te,ja,zh-CN',
              autoDisplay: false,
              layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE,
            },
            'google_translate_element'
          );
        }
      } catch (err) {
        console.warn('Google Translate initialization notice:', err);
      }
    };

    // 2. Load Google Translate script safely
    if (!scriptLoadedRef.current && !document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  }, []);

  // 3. Reactively trigger translation when platform language changes
  const applyTranslation = (targetLang: string) => {
    const langCode = targetLang === 'en' ? '' : targetLang;

    // Update HTML attributes
    document.documentElement.lang = targetLang;
    document.documentElement.setAttribute('data-lang', targetLang);
    setGoogleTransCookie(targetLang as any);

    // Trigger the Google Translate select dropdown in the DOM
    const triggerSelect = () => {
      const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (select) {
        if (targetLang === 'en') {
          if (select.value !== '') {
            select.value = '';
            select.dispatchEvent(new Event('change', { bubbles: true }));
          }
          // Also try to find restore iframe or button if open
          try {
            const iframe = document.querySelector('iframe.goog-te-banner-frame') as HTMLIFrameElement | null;
            if (iframe && iframe.contentDocument) {
              const closeBtn = iframe.contentDocument.querySelector('.goog-close-link') as HTMLElement | null;
              if (closeBtn) closeBtn.click();
            }
          } catch (e) {}
        } else {
          select.value = langCode;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return true;
      }
      return false;
    };

    if (!triggerSelect()) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (triggerSelect() || attempts > 30) {
          clearInterval(interval);
        }
      }, 100);
    }
  };

  useEffect(() => {
    applyTranslation(language);
  }, [language]);

  // 4. Ensure translation is preserved upon client-side Next.js route navigation
  useEffect(() => {
    if (language !== 'en') {
      const timer = setTimeout(() => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          select.value = language;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [pathname, language]);

  return (
    <>
      {/* Hidden container where Google Translate mounts its widget */}
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="notranslate"
        translate="no"
        style={{
          position: 'fixed',
          bottom: '0px',
          left: '0px',
          opacity: 0,
          width: '0px',
          height: '0px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999,
        }}
      />
      <style jsx global>{`
        /* Hide Google Translate top banner bar and keep layout intact */
        body {
          top: 0px !important;
          position: static !important;
        }
        .goog-te-banner-frame,
        .goog-te-banner-frame.skiptranslate,
        iframe.goog-te-banner-frame {
          display: none !important;
          visibility: hidden !important;
          height: 0px !important;
        }
        .goog-tooltip,
        #goog-gt-tt {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .skiptranslate iframe {
          display: none !important;
        }
      `}</style>
    </>
  );
}
