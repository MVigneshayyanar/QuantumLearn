'use client';

import React from 'react';
import { CircuitBuilder } from '@/components/circuit-builder/CircuitBuilder';

export default function SimulatorPage() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <CircuitBuilder />
    </div>
  );
}
