'use client';

import React, { useEffect } from 'react';

export function QuantumAcademyExact() {
  useEffect(() => {
    // Ensure the outer window is pinned at the top so navigation headers are fully visible
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[calc(100vh-6.25rem)] bg-[#fafafa] overflow-hidden relative">
      <iframe
        src="/quantum-academy-embed.html?v=topfix6"
        title="Quantum Academy"
        className="w-full h-full border-0 block"
      />
    </div>
  );
}
