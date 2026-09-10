'use client';

import React from 'react';
import { GateType } from '@/lib/types';

export interface GateVisualConfig {
  type: GateType;
  name: string;
  desc: string;
  multi?: boolean;
  bgColor: string;
  textColor: string;
  borderColor?: string;
  renderSymbol: (size?: number) => React.ReactNode;
}

export function PlusCircleIcon({ size = 18, strokeWidth = 2.2 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
      <line x1="12" y1="3" x2="12" y2="21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
      <line x1="3" y1="12" x2="21" y2="12" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

export function CnotPaletteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Control dot on top */}
      <circle cx="12" cy="5.5" r="2.5" fill="currentColor" />
      {/* Vertical bus line */}
      <line x1="12" y1="8" x2="12" y2="18.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Target plus circle on bottom */}
      <circle cx="12" cy="15.5" r="5.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="12" y1="10" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="6.5" y1="15.5" x2="17.5" y2="15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CzPaletteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5.5" r="2.5" fill="currentColor" />
      <line x1="12" y1="8" x2="12" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <text x="12" y="21.5" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="bold" fontFamily="monospace">
        Z
      </text>
    </svg>
  );
}

export function SwapPaletteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Cross */}
      <line x1="8.5" y1="4" x2="15.5" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="15.5" y1="4" x2="8.5" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Vertical double arrow connector */}
      <line x1="12" y1="9" x2="12" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 10.5 L12 8.5 L14 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 13.5 L12 15.5 L14 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom Cross */}
      <line x1="8.5" y1="15" x2="15.5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="15.5" y1="15" x2="8.5" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MeterGaugeIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arc curve */}
      <path
        d="M5 16 A 8.5 8.5 0 0 1 19 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Needle pointer */}
      <line x1="12" y1="17" x2="16.5" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" />
      {/* Tiny Z superscript label */}
      <text x="18" y="8" fill="currentColor" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
        z
      </text>
    </svg>
  );
}

export function ControlDotIcon({ size = 12 }: { size?: number }) {
  return <div style={{ width: size, height: size }} className="rounded-full bg-blue-600 ring-2 ring-white shadow-xs" />;
}

export function TargetPlusIcon({ size = 26 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full border-2 border-blue-600 bg-white flex items-center justify-center text-blue-600 shadow-xs"
    >
      <PlusCircleIcon size={size - 4} strokeWidth={2.4} />
    </div>
  );
}

export function SwapXIcon({ size = 24 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
        <line x1="4" y1="4" x2="20" y2="20" />
        <line x1="20" y1="4" x2="4" y2="20" />
      </svg>
    </div>
  );
}

export const GATE_CONFIGS: Record<GateType, GateVisualConfig> = {
  h: {
    type: 'h',
    name: 'H',
    desc: 'Hadamard: Creates equal superposition (|0⟩ → |+⟩)',
    bgColor: 'bg-[#EF4444]',
    textColor: 'text-white',
    renderSymbol: () => <span className="font-bold font-sans">H</span>
  },
  x: {
    type: 'x',
    name: 'X',
    desc: 'Pauli-X: Bit flip / NOT gate (|0⟩ ↔ |1⟩)',
    bgColor: 'bg-[#2563EB]',
    textColor: 'text-white',
    renderSymbol: (s = 18) => <PlusCircleIcon size={s} />
  },
  cx: {
    type: 'cx',
    name: 'CX',
    desc: 'CNOT: Controlled-NOT entangling gate',
    multi: true,
    bgColor: 'bg-[#2563EB]',
    textColor: 'text-white',
    renderSymbol: (s = 20) => <CnotPaletteIcon size={s} />
  },
  cz: {
    type: 'cz',
    name: 'CZ',
    desc: 'Controlled-Z: Phase flip on |11⟩ state',
    multi: true,
    bgColor: 'bg-[#2563EB]',
    textColor: 'text-white',
    renderSymbol: (s = 20) => <CzPaletteIcon size={s} />
  },
  swap: {
    type: 'swap',
    name: 'SWAP',
    desc: 'SWAP: Exchanges quantum states of two qubits',
    multi: true,
    bgColor: 'bg-[#2563EB]',
    textColor: 'text-white',
    renderSymbol: (s = 20) => <SwapPaletteIcon size={s} />
  },
  z: {
    type: 'z',
    name: 'Z',
    desc: 'Pauli-Z: Relative phase flip (|1⟩ → -|1⟩)',
    bgColor: 'bg-[#BAE6FD]',
    textColor: 'text-[#0369A1]',
    borderColor: 'border-[#7DD3FC]',
    renderSymbol: () => <span className="font-bold font-sans">Z</span>
  },
  s: {
    type: 's',
    name: 'S',
    desc: 'Phase Gate: +90° rotation around Z axis',
    bgColor: 'bg-[#BAE6FD]',
    textColor: 'text-[#0369A1]',
    borderColor: 'border-[#7DD3FC]',
    renderSymbol: () => <span className="font-bold font-sans">S</span>
  },
  t: {
    type: 't',
    name: 'T',
    desc: 'T Gate: +45° (π/4) phase shift',
    bgColor: 'bg-[#BAE6FD]',
    textColor: 'text-[#0369A1]',
    borderColor: 'border-[#7DD3FC]',
    renderSymbol: () => <span className="font-bold font-sans">T</span>
  },
  y: {
    type: 'y',
    name: 'Y',
    desc: 'Pauli-Y: Bit and phase flip (+i)',
    bgColor: 'bg-[#EC4899]',
    textColor: 'text-white',
    renderSymbol: () => <span className="font-bold font-sans">Y</span>
  },
  measure: {
    type: 'measure',
    name: 'M',
    desc: 'Measurement: Collapses qubit into |0⟩ or |1⟩ in Z-basis',
    bgColor: 'bg-[#475569]',
    textColor: 'text-white',
    renderSymbol: (s = 18) => <MeterGaugeIcon size={s} />
  }
};

export const AVAILABLE_GATE_LIST: GateVisualConfig[] = [
  GATE_CONFIGS.h,
  GATE_CONFIGS.x,
  GATE_CONFIGS.cx,
  GATE_CONFIGS.cz,
  GATE_CONFIGS.swap,
  GATE_CONFIGS.z,
  GATE_CONFIGS.s,
  GATE_CONFIGS.t,
  GATE_CONFIGS.y,
  GATE_CONFIGS.measure
];

interface QuantumGateSymbolProps {
  type: GateType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function QuantumGateSymbol({ type, size = 'md', className = '' }: QuantumGateSymbolProps) {
  const config = GATE_CONFIGS[type] || GATE_CONFIGS.h;

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs rounded-md shadow-2xs',
    md: 'w-8 h-8 sm:w-9 sm:h-9 text-sm rounded-lg shadow-xs',
    lg: 'w-10 h-10 text-base rounded-xl shadow-sm'
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22
  }[size];

  const borderClass = config.borderColor ? `border ${config.borderColor}` : '';

  return (
    <div
      className={`flex items-center justify-center font-mono font-bold select-none ${config.bgColor} ${config.textColor} ${sizeClasses} ${borderClass} ${className}`}
      translate="no"
    >
      {config.renderSymbol(iconSizes)}
    </div>
  );
}
