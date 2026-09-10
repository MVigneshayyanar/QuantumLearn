'use client';

import React, { useState, useRef } from 'react';
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  X,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuantumCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleSlug: string;
  moduleTitle: string;
  studentName?: string;
  isCompleted?: boolean;
  onClaimCertificate?: () => void;
}

export function QuantumCertificateModal({
  isOpen,
  onClose,
  moduleSlug,
  moduleTitle,
  studentName = 'Alex Mercer',
  isCompleted = true,
  onClaimCertificate,
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });
    } catch {}
    window.print();
  };

  const handleCopyLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    navigator.clipboard.writeText(`${origin}/verify/${credentialId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleClaim = () => {
    if (onClaimCertificate) {
      onClaimCertificate();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      {/* Small Popup Dialog Container */}
      <div className="bg-white rounded-2xl border border-dark-200 shadow-2xl max-w-lg w-full overflow-hidden my-auto animate-scaleUp">
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-dark-900 text-white flex items-center justify-between gap-2 border-b border-dark-800">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Award className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs sm:text-sm truncate">
                  {isCompleted ? 'Official Quantum Certificate' : 'Certificate Preview'}
                </h3>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {isCompleted ? 'VERIFIED CREDENTIAL' : 'PREVIEW MODE'}
                </span>
              </div>
              <p className="text-[10px] text-dark-400 truncate">
                QLearn Quantum Computing Institute &amp; Schrödinger AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-200 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              aria-label="Close certificate popup"
              className="w-7 h-7 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area (Compact Popup View) */}
        <div className="p-3 sm:p-4 bg-dark-50/80 flex justify-center">
          <div
            ref={certRef}
            id="quantum-certificate-printable"
            className="w-full bg-white rounded-xl border-4 border-double border-amber-400/80 p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between select-none print:m-0 print:w-full print:max-w-none print:border-8 print:p-10 print:aspect-[1.414/1]"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at center, rgba(254, 243, 199, 0.35) 0%, rgba(255, 255, 255, 1) 75%)',
            }}
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <div className="w-48 h-48 rounded-full border-[12px] border-dark-900 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-[6px] border-dark-900 border-dashed" />
              </div>
            </div>

            {/* Corner Ornamental Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-500" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-500" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-500" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-500" />

            {/* Header / Crest */}
            <div className="text-center space-y-1 relative z-10">
              <div className="flex items-center justify-center gap-1.5 mb-0.5">
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-2xs">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-amber-800">
                  QLEARN QUANTUM INSTITUTE
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-black text-dark-950 uppercase tracking-widest font-serif">
                Certificate of Quantum Mastery
              </h1>
              <p className="text-[8px] sm:text-[9px] font-semibold text-dark-500 tracking-wider uppercase">
                {isCompleted ? 'Official Verified Credential' : 'Course Completion Credential'}
              </p>
            </div>

            {/* Recipient Body */}
            <div className="text-center space-y-2 my-3 relative z-10">
              <p className="text-[10px] text-dark-600 italic font-serif">
                This is officially certified to recognize that
              </p>
              <div className="border-b border-amber-300 pb-1 max-w-xs mx-auto">
                <h2 className="text-base sm:text-lg font-black text-primary-900 tracking-wide font-serif">
                  {studentName}
                </h2>
              </div>
              <p className="text-[10px] text-dark-600 max-w-xs mx-auto leading-relaxed">
                has successfully completed theoretical foundations, circuit construction, and verified mastery for:
              </p>
              <div className="inline-block px-3 py-1 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-950 font-bold text-xs sm:text-sm font-serif">
                {displayTitle}
              </div>
            </div>

            {/* Signatures & Gold Seal */}
            <div className="flex items-end justify-between pt-3 border-t border-amber-200/80 relative z-10 mt-1 text-left">
              {/* Signature 1 */}
              <div className="space-y-0.5 text-center w-24 sm:w-28">
                <div className="font-serif italic text-xs text-dark-800 font-bold border-b border-dark-300 pb-0.5">
                  Schrödinger AI
                </div>
                <p className="text-[7px] font-bold uppercase tracking-wider text-dark-700">
                  Physics Director
                </p>
              </div>

              {/* Center Gold Seal */}
              <div className="flex flex-col items-center justify-center -my-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-yellow-600 p-0.5 shadow-md shadow-amber-400/30 flex items-center justify-center border-2 border-white">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-950/40 flex flex-col items-center justify-center text-center p-0.5 text-amber-950">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[5px] font-black uppercase tracking-tight leading-none mt-0.5">
                      {isCompleted ? 'CLAIMED' : '100% MASTERY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature 2 */}
              <div className="space-y-0.5 text-center w-24 sm:w-28">
                <div className="font-serif italic text-xs text-dark-800 font-bold border-b border-dark-300 pb-0.5">
                  QLearn Faculty
                </div>
                <p className="text-[7px] text-dark-500 font-mono">{issueDate}</p>
              </div>
            </div>

            {/* Bottom Cryptographic ID bar */}
            <div className="mt-2 pt-1.5 border-t border-amber-100 flex items-center justify-between text-[7px] text-dark-500 font-mono">
              <span className="truncate">ID: {credentialId}</span>
              <span className="hidden sm:inline">SHA-256 VALIDATED</span>
              <span>QLEARN</span>
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-3 sm:p-3.5 bg-white border-t border-dark-100 space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-dark-600 min-w-0">
              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${isCompleted ? 'text-emerald-600' : 'text-amber-500'}`} />
              <span className="text-[11px] truncate">
                {isCompleted
                  ? 'Claimed & permanently saved to your Student Profile.'
                  : 'Preview mode. Complete Stage 6 to claim official certificate.'}
              </span>
            </div>

            {!isCompleted && onClaimCertificate && (
              <button
                onClick={handleClaim}
                className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-bold text-[11px] shrink-0 shadow-xs cursor-pointer"
              >
                Claim Now
              </button>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-1 border-t border-dark-50">
            <a
              href={`/verify/${credentialId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dark-200 hover:bg-dark-50 text-dark-800 text-[11px] font-semibold transition-colors cursor-pointer"
              title="Open Public Verification Page"
            >
              <ExternalLink className="w-3 h-3 text-dark-500" />
              <span>Verify Page</span>
            </a>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dark-200 hover:bg-dark-50 text-dark-800 text-[11px] font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-white font-bold text-[11px] shadow-xs cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>{isCompleted ? 'Download / Print PDF' : 'Print Preview'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
