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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fadeIn p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white dark:bg-dark-900 rounded-3xl border border-amber-200/90 dark:border-amber-600/40 shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-amber-400/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={closeSubscriptionModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Fixed Header */}
        <div className="shrink-0 p-5 sm:p-6 pb-2 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/30 mb-2">
            <Crown className="w-6 h-6" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 text-[10px] font-bold mb-1">
            <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            <span>QLearn Pro Membership</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-dark-900 dark:text-white tracking-tight leading-tight">
            Unlock the Full Quantum Experience
          </h2>
          <p className="text-xs text-dark-500 dark:text-dark-400 max-w-sm mx-auto mt-1">
            Master enterprise quantum algorithms, solve advanced research challenges, and get certified.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-2 space-y-3.5">
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-2 p-1 bg-dark-100 dark:bg-dark-800/90 rounded-2xl text-xs font-semibold max-w-xs mx-auto border border-dark-200/50 dark:border-dark-700/70">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-xs'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`flex-1 py-1.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-amber-500 text-white shadow-xs font-bold'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-md font-bold">
                Save 30%
              </span>
            </button>
          </div>

          {/* Pricing Card */}
          <div className="p-3.5 sm:p-4 rounded-2xl border-2 border-amber-400 dark:border-amber-500/50 bg-gradient-to-b from-amber-50/70 to-white dark:from-amber-950/40 dark:to-dark-800/90 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                {billingCycle === 'annual' ? 'Annual Plan' : 'Monthly Plan'}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl sm:text-3xl font-black text-dark-900 dark:text-white">
                  {billingCycle === 'annual' ? '$99' : '$12'}
                </span>
                <span className="text-xs text-dark-500 dark:text-dark-400 font-medium">
                  {billingCycle === 'annual' ? '/ year ($8.25/mo)' : '/ month'}
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-700/60 shadow-2xs">
                {billingCycle === 'annual' ? '7-Day Free Trial' : 'Cancel Anytime'}
              </span>
            </div>
          </div>

          {/* Perks list */}
          <div className="space-y-1.5">
            {perks.map((p, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-xl hover:bg-dark-50/80 dark:hover:bg-dark-800/60 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 border border-amber-200 dark:border-amber-700/60">
                  <p.icon className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-dark-900 dark:text-white">{p.title}</h4>
                  <p className="text-[11px] text-dark-500 dark:text-dark-400 leading-tight mt-0.5">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fixed Footer / Actions */}
        <div className="shrink-0 p-4 sm:p-5 pt-3 border-t border-dark-100 dark:border-dark-800 bg-white/70 dark:bg-dark-900/80 backdrop-blur-xs space-y-2">
          {!isPremium ? (
            <>
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isProcessing}
                className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{isProcessing ? 'Activating Pro...' : 'Activate QLearn Pro (1-Click Demo)'}</span>
              </button>
              <p className="text-[10px] text-center text-dark-400 dark:text-dark-500">
                Instant trial demo activation • Zero credit card required for evaluation
              </p>
            </>
          ) : (
            <div className="space-y-1.5 text-center">
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>You currently have active QLearn Pro status!</span>
              </div>
              <button
                type="button"
                onClick={handleDowngrade}
                className="text-xs text-dark-500 dark:text-dark-400 hover:text-red-600 dark:hover:text-red-400 transition-colors underline cursor-pointer"
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
