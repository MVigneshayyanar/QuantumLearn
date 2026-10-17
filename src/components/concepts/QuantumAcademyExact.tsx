'use client';

import React from 'react';

export function QuantumAcademyExact() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-black overflow-hidden relative">
      <iframe
        src="/quantum-academy-embed.html"
        title="Quantum Academy"
        className="w-full h-full border-0 block"
      />
    </div>
  );
}
