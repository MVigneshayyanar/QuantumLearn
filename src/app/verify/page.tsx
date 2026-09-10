'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Search, Award, ArrowRight, CheckCircle2 } from 'lucide-react';

const SAMPLE_CREDENTIALS = [
  { id: 'QL-DEUTSCHJOZSA-2026-094489', title: 'Deutsch-Jozsa Algorithm' },
  { id: 'QL-TELEPORTATION-2026-093C89', title: 'Quantum Teleportation' },
  { id: 'QL-GROVER-2026-081089', title: "Grover's Quantum Search" },
];

export default function VerifyIndexPage() {
  const router = useRouter();
  const [credentialId, setCredentialId] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentialId.trim()) {
      router.push(`/verify/${encodeURIComponent(credentialId.trim().toUpperCase())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-50 via-white to-dark-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
            QLearn Cryptographic Ledger
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-dark-900 tracking-tight">
            Verify Quantum Credential
          </h1>
          <p className="text-sm text-dark-600 max-w-md mx-auto">
            Validate the authenticity and cryptographic proof of completion for any official QLearn Quantum Algorithm Certificate.
          </p>
        </div>

        {/* Search Input Box */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-dark-200 p-2 shadow-md flex items-center gap-2">
          <Search className="w-5 h-5 text-dark-400 ml-3 shrink-0" />
          <input
            type="text"
            value={credentialId}
            onChange={(e) => setCredentialId(e.target.value)}
            placeholder="Enter Credential ID (e.g. QL-DEUTSCHJOZSA-2026-094489)"
            className="flex-1 px-2 py-2 text-sm text-dark-900 placeholder:text-dark-400 focus:outline-hidden font-mono uppercase"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Verify
          </button>
        </form>

        {/* Quick Test Samples */}
        <div className="bg-white rounded-2xl border border-dark-200 p-5 text-left space-y-3 shadow-2xs">
          <h3 className="text-xs font-bold text-dark-700 uppercase tracking-wider">
            Sample Valid Credentials
          </h3>
          <div className="space-y-2">
            {SAMPLE_CREDENTIALS.map((c) => (
              <Link
                key={c.id}
                href={`/verify/${c.id}`}
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-dark-50 border border-transparent hover:border-dark-200 transition-all text-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="font-bold text-dark-900 block group-hover:text-primary-600">
                      {c.title}
                    </span>
                    <span className="font-mono text-[11px] text-dark-400">{c.id}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-dark-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
