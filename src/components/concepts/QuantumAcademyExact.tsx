'use client';

import React, { useEffect, useRef } from 'react';
import { useAccessibility } from '@/lib/accessibility-context';

export function QuantumAcademyExact() {
  const { theme } = useAccessibility();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Ensure the outer window is pinned at the top immediately without delay
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  const initialThemeRef = useRef(theme);

  // Post theme changes dynamically to the embedded Quantum Academy iframe
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'THEME_CHANGE', theme }, '*');
    }
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <div className={`w-full h-[calc(100vh-6.25rem)] ${isDark ? 'bg-[#0B0F19]' : 'bg-[#fafafa]'} overflow-hidden relative transition-colors duration-200`}>
      <iframe
        ref={iframeRef}
        src={`/quantum-academy-embed.html?v=darktextv16&theme=${initialThemeRef.current}`}
        title="Quantum Academy"
        className={`w-full h-full border-0 block ${isDark ? 'bg-[#0B0F19]' : 'bg-[#fafafa]'}`}
        style={{ colorScheme: isDark ? 'dark' : 'light' }}
        onLoad={() => {
          if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'THEME_CHANGE', theme }, '*');
          }
        }}
      />
    </div>
  );
}
