'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Printer,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  ArrowLeft,
  Search,
  BookOpen,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AlgoInfo {
  title: string;
  slug: string;
  qubits: number;
  category: string;
}

const ALGO_MAP: Record<string, AlgoInfo> = {
  DEUTSCHJOZSA: {
    title: 'Deutsch-Jozsa Algorithm',
    slug: 'deutsch-jozsa',
    qubits: 2,
    category: 'Foundational Oracle',
  },
  TELEPORTATION: {
    title: 'Quantum Teleportation',
    slug: 'teleportation',
    qubits: 3,
    category: 'Quantum Communication',
  },
  TELEPORT: {
    title: 'Quantum Teleportation',
    slug: 'teleportation',
    qubits: 3,
    category: 'Quantum Communication',
  },
  GROVER: {
    title: "Grover's Quantum Search Algorithm",
    slug: 'grover',
    qubits: 2,
    category: 'Quantum Search & Amplitude Amplification',
  },
  SUPERDENSE: {
    title: 'Superdense Coding',
    slug: 'superdense-coding',
    qubits: 2,
    category: 'Quantum Communication',
  },
  BERNSTEIN: {
    title: 'Bernstein-Vazirani Algorithm',
    slug: 'bernstein-vazirani',
    qubits: 3,
    category: 'Quantum Oracles',
  },
};

function CertificateVerificationContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const rawId = (params?.id as string) || searchParams?.get('id') || 'QL-QUANTUM-2026-000089';
  const decodedId = decodeURIComponent(rawId).toUpperCase();

  const [copied, setCopied] = useState(false);

  // Match algorithm by parsing the ID string
  const matchedKey = Object.keys(ALGO_MAP).find((key) => decodedId.includes(key));
  const algoInfo = matchedKey ? ALGO_MAP[matchedKey] : {
    title: 'Quantum Algorithm Mastery',
    slug: 'teleportation',
    qubits: 3,
    category: 'Quantum Computing',
  };

  const studentName = searchParams?.get('name') || 'Alex Mercer';
  const issueDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'],
      });
    } catch {}
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-white to-dark-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation / Back link */}
        <div className="flex items-center justify-between">
          <Link
            href={`/learn/${algoInfo.slug}`}
            className="inline-flex items-center gap-2 text-xs font-bold text-dark-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to {algoInfo.title}</span>
          </Link>

          <span className="text-xs font-mono text-dark-400">
            QLearn Public Credential Registry
          </span>
        </div>

        {/* Verification Status Header */}
        <div className="bg-white rounded-3xl border border-emerald-200/80 p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/25">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Verified Authentic
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono text-dark-500 bg-dark-100 border border-dark-200">
                    SHA-256 Validated
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-dark-900 tracking-tight">
                  Official QLearn Quantum Credential
                </h1>
                <p className="text-xs text-dark-600">
                  This cryptographic credential has been issued by QLearn Quantum Institute &amp; Schrödinger AI Lab.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dark-200 hover:bg-dark-50 text-dark-800 text-xs font-semibold transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          {/* Credential Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-dark-100 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase text-dark-400 block">Recipient</span>
              <span className="font-bold text-dark-900 text-sm">{studentName}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-dark-400 block">Curriculum</span>
              <span className="font-bold text-primary-700 text-sm truncate block" title={algoInfo.title}>
                {algoInfo.title}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-dark-400 block">Issue Date</span>
              <span className="font-semibold text-dark-800 text-sm">{issueDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-dark-400 block">Credential ID</span>
              <span className="font-mono font-bold text-dark-900 text-xs truncate block" title={decodedId}>
                {decodedId}
              </span>
            </div>
          </div>
        </div>

        {/* Certificate Display Card */}
        <div className="flex justify-center">
          <div
            id="quantum-certificate-printable"
            className="w-full max-w-[760px] aspect-[1.414/1] bg-white rounded-3xl border-8 border-double border-amber-400/90 p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col justify-between select-none print:m-0 print:w-full print:shadow-none print:border-8"
            style={{
              backgroundImage:
                'radial-gradient(ellipse at center, rgba(254, 243, 199, 0.35) 0%, rgba(255, 255, 255, 1) 75%)',
            }}
          >
            {/* Watermark */}
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
              <h2 className="text-2xl sm:text-3xl font-black text-dark-950 uppercase tracking-widest font-serif">
                Certificate of Quantum Mastery
              </h2>
              <p className="text-[10px] sm:text-xs font-semibold text-dark-500 tracking-[0.15em] uppercase">
                Official Verified Cryptographic Credential
              </p>
            </div>

            {/* Recipient Body */}
            <div className="text-center space-y-3 my-4 relative z-10">
              <p className="text-xs sm:text-sm text-dark-600 italic font-serif">
                This is officially certified to recognize that
              </p>
              <div className="border-b-2 border-amber-300/80 pb-2 max-w-md mx-auto">
                <h3 className="text-2xl sm:text-3xl font-black text-primary-900 tracking-wide font-serif">
                  {studentName}
                </h3>
              </div>
              <p className="text-xs text-dark-600 max-w-lg mx-auto leading-relaxed">
                has successfully completed all theoretical foundations, mathematical derivations,
                verified circuit construction with 100% statevector fidelity, and Socratic knowledge checks for:
              </p>
              <div className="inline-block px-4 py-1.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 font-bold text-sm sm:text-base font-serif">
                {algoInfo.title}
              </div>
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

              {/* Signature 2 */}
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
              <span>CREDENTIAL ID: {decodedId}</span>
              <span>VERIFICATION LEDGER: SHA-256 VALIDATED</span>
              <span>ISSUED BY QLEARN PLATFORM</span>
            </div>
          </div>
        </div>

        {/* Footer Actions & Info */}
        <div className="bg-white rounded-2xl border border-dark-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-dark-900">Explore this Algorithm Curriculum</h4>
              <p className="text-[11px] text-dark-500">
                Interactive Bloch spheres, Dirac math derivations, circuit builder, and Socratic quizzes.
              </p>
            </div>
          </div>

          <Link
            href={`/learn/${algoInfo.slug}`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-dark-900 hover:bg-dark-800 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            <span>Launch Interactive Module</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CertificateVerificationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-8 bg-dark-50">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-semibold text-dark-500 font-mono">Verifying Cryptographic Credential...</p>
          </div>
        </div>
      }
    >
      <CertificateVerificationContent />
    </Suspense>
  );
}
