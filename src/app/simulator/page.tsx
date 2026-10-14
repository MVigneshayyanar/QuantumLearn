'use client';

import React from 'react';
import { CircuitBuilder } from '@/components/circuit-builder/CircuitBuilder';

export default function SimulatorPage() {
  return (
    <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-24 md:pb-6">
      <CircuitBuilder />
    </div>
  );
}
