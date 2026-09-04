'use client';

import { useEffect, useRef } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
  }
}

export function GoogleTranslator() {
  const { language } = useAccessibility();
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // 1. Define global initialization callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
              includedLanguages: 'en,hi,es,fr,de,zh-CN,ja,ta,te',
              layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE
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
  useEffect(() => {
    const applyTranslation = (targetLang: string) => {
      const langCode = targetLang === 'en' ? '' : targetLang;

      // Update HTML attribute
      document.documentElement.lang = targetLang;
      document.documentElement.setAttribute('data-lang', targetLang);

      // Set cookie for Google Translate (without invalid localhost domain)
      if (!langCode) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + window.location.hostname + ';';
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/auto/${langCode}; path=/;`;
      }

      // Trigger the Google Translate dropdown in the DOM
      const triggerSelect = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          if (select.value !== (langCode || 'en')) {
            select.value = langCode || 'en';
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
          if (triggerSelect() || attempts > 25) {
            clearInterval(interval);
          }
        }, 150);
      }
    };

    applyTranslation(language);
  }, [language]);

  return (
    <>
      <div
        id="google_translate_element"
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
          visibility: 'hidden',
          pointerEvents: 'none'
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
        .goog-tooltip {
          display: none !important;
        }
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
      `}</style>
    </>
  );
}
