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
    // 1. Define global initialization callback
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
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

  // 3. Reactively trigger translation when platform language or route changes
  useEffect(() => {
    const applyTranslation = (targetLang: string) => {
      const langCode = targetLang === 'en' ? '' : targetLang;

      // Update HTML attributes
      document.documentElement.lang = targetLang;
      document.documentElement.setAttribute('data-lang', targetLang);

      // Set cookie across localhost and live domain variations
      setGoogleTransCookie(targetLang as any);

      // Trigger the Google Translate select dropdown in the DOM
      const triggerSelect = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          const currentVal = select.value || '';
          const desiredVal = langCode || '';
          if (currentVal !== desiredVal) {
            select.value = desiredVal;
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
        }, 120);
      }
    };

    applyTranslation(language);
  }, [language, pathname]);

  return (
    <>
      {/* Container must be present in layout with positive bounds for Google Translate to inject combo */}
      <div
        id="google_translate_element"
        aria-hidden="true"
        className="notranslate"
        translate="no"
        style={{
          position: 'fixed',
          bottom: '0px',
          left: '0px',
          opacity: 0.001,
          width: '10px',
          height: '10px',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: -9999
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
