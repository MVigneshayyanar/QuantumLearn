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
    // 1. Define global init callback before loading script
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              autoDisplay: false,
              includedLanguages: 'en,hi,es,fr,de,zh-CN,ja,ar,pt,ru,bn,ta,te',
              layout: window.google.translate.TranslateElement.InlineLayout?.SIMPLE
            },
            'google_translate_element'
          );
        }
      } catch (err) {
        console.warn('Google Translate initialization:', err);
      }
    };

    // 2. Inject Google Translate script once
    if (!scriptLoadedRef.current && !document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
      scriptLoadedRef.current = true;
    }
  }, []);

  // 3. Reactively trigger translation when platform language changes
  useEffect(() => {
    const applyTranslation = (targetLang: string) => {
      const langCode = targetLang === 'en' ? '' : targetLang;

      // Set cookies for Google Translate
      const domain = window.location.hostname;
      if (!langCode) {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${domain}; path=/;`;
      } else {
        document.cookie = `googtrans=/en/${langCode}; path=/;`;
        document.cookie = `googtrans=/en/${langCode}; domain=${domain}; path=/;`;
      }

      // Trigger the hidden Google Translate dropdown
      const triggerSelect = () => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (select) {
          select.value = langCode || 'en';
          select.dispatchEvent(new Event('change', { bubbles: true }));
          return true;
        }
        return false;
      };

      if (!triggerSelect()) {
        // Poll briefly until the combo is ready
        let attempts = 0;
        const interval = setInterval(() => {
          attempts++;
          if (triggerSelect() || attempts > 20) {
            clearInterval(interval);
          }
        }, 200);
      }
    };

    applyTranslation(language);
  }, [language]);

  return (
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
  );
}
