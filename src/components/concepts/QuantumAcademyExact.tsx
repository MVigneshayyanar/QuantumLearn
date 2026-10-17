'use client';

import React, { useEffect } from 'react';

export function QuantumAcademyExact() {
  useEffect(() => {
    // Ensure the outer window is pinned at the top immediately without delay
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="w-full h-[calc(100vh-6.25rem)] bg-[#fafafa] overflow-hidden relative">
      <iframe
        src="/quantum-academy-embed.html?v=noblink10"
        title="Quantum Academy"
        className="w-full h-full border-0 block bg-[#fafafa]"
        style={{ colorScheme: 'light' }}
      />
    </div>
  );
}
