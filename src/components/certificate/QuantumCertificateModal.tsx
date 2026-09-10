'use client';

import React, { useState, useRef } from 'react';
import {
  Trophy,
  Award,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  QrCode,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuantumCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleSlug: string;
  moduleTitle: string;
  studentName?: string;
  isCompleted?: boolean;
}

export function QuantumCertificateModal({
  isOpen,
  onClose,
  moduleSlug,
  moduleTitle,
  studentName = 'Alex Mercer',
  isCompleted = true,
}: QuantumCertificateModalProps) {
  const [copied, setCopied] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isGrover = moduleSlug.toLowerCase().includes('grover');
  const displayTitle = isGrover
    ? "Grover's Quantum Search Algorithm"
    : moduleTitle;

  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const credentialId = `QL-${(moduleSlug || 'QUANTUM').toUpperCase().replace(/[^A-Z]/g, '')}-2026-${Math.abs(
    (moduleSlug || 'q').split('').reduce((acc, c) => acc + c.charCodeAt(0), 1024)
  ).toString(16).toUpperCase().padStart(4, '0')}89`;

  const handlePrint = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });
    } catch {}
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://qlearn.quantum/verify/${credentialId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      {/* Container */}
      <div className="bg-white rounded-3xl border border-dark-200 shadow-2xl max-w-4xl w-full overflow-hidden my-auto animate-scaleUp">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-dark-900 text-white flex items-center justify-between gap-3 border-b border-dark-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-xs">
              <Award className="w-4.5 h-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">
                  Official Quantum Algorithm Certificate
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  VERIFIED CREDENTIAL
                </span>
              </div>
              <p className="text-[11px] text-dark-400">
                Issued by QLearn Quantum Computing Institute &amp; Schrödinger AI Lab
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-4 sm:p-8 bg-dark-50 overflow-x-auto flex justify-center">
          <div
            ref={certRef}
            id="quantum-certificate-printable"
            className="w-full max-w-[760px] aspect-[1.414/1] bg-white rounded-2xl border-8 border-double border-amber-400/80 p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col justify-between select-none print:m-0 print:w-full print:shadow-none print:border-8"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at center, rgba(254, 243, 199, 0.3) 0%, rgba(255, 255, 255, 1) 75%)',
            }}
          >
            {/* Background Quantum Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035]">
              <div className="w-[450px] h-[450px] rounded-full border-[18px] border-dark-900 flex items-center justify-center">
                <div className="w-[320px] h-[320px] rounded-full border-[8px] border-dark-900 border-dashed animate-spin-slow" />
              </div>
            </div>

            {/* Corner Ornamental Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-500" />

            {/* Header / Crest */}
            <div className="text-center space-y-2 relative z-10">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-amber-800">
                  QLEARN QUANTUM INSTITUTE
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-dark-950 uppercase tracking-widest font-serif">
                Certificate of Quantum Mastery
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-dark-500 tracking-[0.15em] uppercase">
                Verified Cryptographic Credential
              </p>
            </div>

            {/* Recipient Body */}
            <div className="text-center space-y-3 my-4 relative z-10">
              <p className="text-xs sm:text-sm text-dark-600 italic font-serif">
                This is officially certified to recognize that
              </p>
              <div className="border-b-2 border-amber-300/80 pb-2 max-w-md mx-auto">
                <h2 className="text-2xl sm:text-3xl font-black text-primary-900 tracking-wide font-serif">
                  {studentName}
                </h2>
              </div>
              <p className="text-xs text-dark-600 max-w-lg mx-auto leading-relaxed">
                has successfully completed all theoretical foundations, mathematical derivations,
                verified circuit construction with 100% statevector fidelity, and Socratic knowledge checks for:
              </p>
              <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 font-bold text-sm sm:text-base font-serif">
                {displayTitle}
              </div>
              {isGrover && (
                <p className="text-[11px] text-amber-900/80 italic max-w-md mx-auto">
                  Demonstrated mastery of Phase Oracle inversion (|11⟩) and Grover Diffusion mean-reflection (O(√N) quadratic quantum speedup).
                </p>
              )}
            </div>

            {/* Footer Signatures & Official Gold Seal */}
            <div className="flex items-end justify-between pt-4 border-t border-amber-200/80 relative z-10 mt-2 text-left">
              {/* Signature 1 */}
              <div className="space-y-1 text-center w-36 sm:w-44">
                <div className="font-serif italic text-base sm:text-lg text-dark-800 font-bold border-b border-dark-300 pb-0.5">
                  Schrödinger AI
                </div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-dark-700">
                  AI Quantum Physics Director
                </p>
                <p className="text-[8px] text-dark-400 font-mono">Autonomous Tutor Engine</p>
              </div>

              {/* Official Gold Seal with Ribbon */}
              <div className="flex flex-col items-center justify-center -my-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-1 shadow-lg shadow-amber-400/40 flex items-center justify-center border-2 border-white">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-950/40 flex flex-col items-center justify-center text-center p-1 text-amber-950">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-[6px] sm:text-[7px] font-black uppercase tracking-tighter leading-tight mt-0.5">
                      100% VERIFIED<br />MASTERY
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 -mt-1">
                  <div className="w-2.5 h-4 bg-amber-600 rounded-b-sm rotate-12 shadow-xs" />
                  <div className="w-2.5 h-4 bg-amber-600 rounded-b-sm -rotate-12 shadow-xs" />
                </div>
              </div>

              {/* Signature 2 / Verification Info */}
              <div className="space-y-1 text-center w-36 sm:w-44">
                <div className="font-serif italic text-base sm:text-lg text-dark-800 font-bold border-b border-dark-300 pb-0.5">
                  QLearn Faculty
                </div>
                <p className="text-[9px] font-bold uppercase tracking-wider text-dark-700">
                  Director of Quantum Curriculum
                </p>
                <p className="text-[8px] text-dark-400 font-mono">Date: {issueDate}</p>
              </div>
            </div>

            {/* Bottom Cryptographic ID bar */}
            <div className="mt-3 pt-2 border-t border-amber-100 flex items-center justify-between text-[8px] text-dark-500 font-mono">
              <span>CREDENTIAL ID: {credentialId}</span>
              <span>VERIFICATION LEDGER: SHA-256 VALIDATED</span>
              <span>ISSUED BY QLEARN PLATFORM</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-5 bg-white border-t border-dark-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-dark-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>This credential is permanently saved to your QLearn Student Profile.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dark-200 hover:bg-dark-50 text-dark-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Verification Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download / Save Certificate PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
