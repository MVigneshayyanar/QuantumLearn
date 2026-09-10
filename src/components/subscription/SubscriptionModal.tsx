'use client';

import React, { useState } from 'react';
import { useStudentContext } from '@/lib/student-context';
import {
  Crown,
  CheckCircle2,
  Sparkles,
  X,
  Zap,
  ShieldCheck,
  Award,
  Cpu,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function SubscriptionModal() {
  const {
    showSubscriptionModal,
    closeSubscriptionModal,
    isPremium,
    upgradeToPremium,
    downgradeToFree
  } = useStudentContext();

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!showSubscriptionModal) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    setTimeout(() => {
      upgradeToPremium();
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899']
        });
      } catch {}
    }, 600);
  };

  const handleDowngrade = () => {
    downgradeToFree();
    closeSubscriptionModal();
  };

  const perks = [
    {
      icon: Crown,
      title: 'Full Access to All Premium Questions',
      description: 'Industry-grade, research-level multi-qubit questions and full mathematical derivations.'
    },
    {
      icon: Bot,
      title: 'Priority Unlimited Schrödinger AI',
      description: 'No query throttling, in-depth circuit debugging, and instant conceptual hints.'
    },
    {
      icon: Award,
      title: 'Certified Quantum Algorithm Mastery',
      description: 'Verified digital credential upon achieving 100% skill completion across all modules.'
    },
    {
      icon: Cpu,
      title: 'Cloud High-Fidelity Multi-Backend',
      description: 'Run deep Qiskit, Cirq, and PennyLane simulations with higher qubit counts.'
    }
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn p-4 overflow-y-auto">
      <div className="relative bg-white rounded-3xl border border-amber-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 space-y-6 my-8">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeSubscriptionModal}
          className="absolute top-5 right-5 p-2 rounded-xl text-dark-400 hover:text-dark-700 hover:bg-dark-100 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Crown className="w-7 h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-bold mb-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>QLearn Pro Membership</span>
            </div>
            <h2 className="text-2xl font-black text-dark-900 tracking-tight">
              Unlock the Full Quantum Experience
            </h2>
            <p className="text-xs text-dark-500 max-w-sm mx-auto">
              Master enterprise quantum algorithms, solve advanced research challenges, and get certified.
            </p>
          </div>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex items-center justify-center gap-2 p-1 bg-dark-100 rounded-2xl text-xs font-semibold max-w-xs mx-auto">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`flex-1 py-1.5 px-3 rounded-xl transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-dark-900 shadow-xs'
                : 'text-dark-600 hover:text-dark-900'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('annual')}
            className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-dark-600 hover:text-dark-900'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-md font-bold">
              Save 30%
            </span>
          </button>
        </div>

        {/* Pricing Card */}
        <div className="p-4 rounded-2xl border-2 border-amber-400 bg-gradient-to-b from-amber-50/70 to-white flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              {billingCycle === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-dark-900">
                {billingCycle === 'annual' ? '$99' : '$12'}
              </span>
              <span className="text-xs text-dark-500 font-medium">
                {billingCycle === 'annual' ? '/ year ($8.25/mo)' : '/ month'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-300">
              {billingCycle === 'annual' ? '7-Day Free Trial' : 'Cancel Anytime'}
            </span>
          </div>
        </div>

        {/* Perks list */}
        <div className="space-y-2.5">
          {perks.map((p, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-dark-50/80 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200">
                <p.icon className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-dark-900">{p.title}</h4>
                <p className="text-[11px] text-dark-500 leading-tight mt-0.5">{p.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-dark-100">
          {!isPremium ? (
            <>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isProcessing ? 'Activating Pro...' : 'Activate QLearn Pro (1-Click Demo)'}</span>
              </button>
              <p className="text-[10px] text-center text-dark-400">
                Instant trial demo activation • Zero credit card required for evaluation
              </p>
            </>
          ) : (
            <div className="space-y-2 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>You currently have active QLearn Pro status!</span>
              </div>
              <button
                type="button"
                onClick={handleDowngrade}
                className="text-xs text-dark-500 hover:text-red-600 transition-colors underline"
              >
                Switch back to Free tier (for testing)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
