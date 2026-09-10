'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getSkillBaseProblems } from '@/lib/practice-problems';
import { useProgressStore } from '@/lib/state-store';
import { useStudentContext } from '@/lib/student-context';
import { apiReportProgress } from '@/lib/api-helpers';
import {
  CheckCircle2,
  Crown,
  Lock,
  Zap,
  Sparkles,
  Trophy,
  Award,
  ArrowRight,
  ExternalLink,
  BookOpen,
  Target,
  Flame,
  Medal,
  RefreshCw,
  Download,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuantumCertificateModal } from '@/components/certificate/QuantumCertificateModal';

interface SkillBaseStageProps {
  moduleSlug: string;
  moduleTitle?: string;
}

const DIFF_COLORS = {
  Easy:   { bg: 'bg-emerald-50',   border: 'border-emerald-200', text: 'text-emerald-800',   badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  Medium: { bg: 'bg-blue-50',      border: 'border-blue-200',    text: 'text-blue-800',      badge: 'bg-blue-100   text-blue-800   border-blue-300'   },
  Hard:   { bg: 'bg-purple-50',    border: 'border-purple-200',  text: 'text-purple-800',    badge: 'bg-purple-100 text-purple-800 border-purple-300' },
} as const;

const DIFF_ICONS = {
  Easy:   BookOpen,
  Medium: Target,
  Hard:   Flame,
};

function CertificateCard({
  moduleSlug,
  moduleTitle,
  isPremium,
  onUpgrade,
  onOpenCertificate,
}: {
  moduleSlug: string;
  moduleTitle: string;
  isPremium: boolean;
  onUpgrade: () => void;
  onOpenCertificate: () => void;
}) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  if (!isPremium) {
    return (
      <div className="relative rounded-3xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 sm:p-8 text-center space-y-4 overflow-hidden">
        {/* Blurred certificate preview */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <Medal className="w-48 h-48 text-amber-500" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
            <Crown className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-dark-900">Certificate Locked</h4>
            <p className="text-xs text-dark-600 max-w-sm mx-auto leading-relaxed">
              You've mastered all 6 stages! Upgrade to <strong>QLearn Pro</strong> to generate &amp; download your official{' '}
              <em>{moduleTitle}</em> Algorithm Certificate.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onUpgrade}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Unlock Certificate with QLearn Pro</span>
            </button>
            <button
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-amber-300 bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs transition-all cursor-pointer shadow-2xs"
            >
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Preview Received Certificate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 via-white to-yellow-50/60 p-6 sm:p-8 text-center space-y-4 overflow-hidden shadow-md shadow-amber-100">
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative z-10 space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-400/40">
          <Trophy className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Official Quantum Credential</p>
          <h3 className="text-xl font-black text-dark-900">QLearn Quantum Algorithm Mastery</h3>
          <p className="text-sm font-semibold text-dark-700">{moduleTitle}</p>
        </div>

        <div className="border-t border-b border-amber-200 py-3 space-y-0.5">
          <p className="text-xs text-dark-600">
            This certifies completion of all 6 stages including the Skill Base Practice Track.
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">{date}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenCertificate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-200" />
            <span>View &amp; Print Certificate</span>
          </button>
          <button
            onClick={onOpenCertificate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Certificate PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function SkillBaseStage({ moduleSlug, moduleTitle = 'Quantum Algorithm' }: SkillBaseStageProps) {
  const router = useRouter();
  const { markModuleComplete } = useProgressStore();
  const { userId, studentName, isPremium, openSubscriptionModal } = useStudentContext();
  const [showCertModal, setShowCertModal] = useState(false);

  // Get 10 curated problems: 4 Easy + 4 Medium + 2 Hard
  const problems = useMemo(() => getSkillBaseProblems(moduleSlug, { easy: 4, medium: 4, hard: 2 }), [moduleSlug]);

  // Load solved IDs from localStorage (set by /practice/[id] page on ACCEPTED)
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [isAllSolved, setIsAllSolved] = useState(false);
  const [completionReported, setCompletionReported] = useState(false);

  const checkSolved = () => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem('ql_practice_solved') || '[]');
      const set = new Set(stored);
      setSolvedIds(set);
      const allDone = problems.length > 0 && problems.every((p) => set.has(p.id));
      setIsAllSolved(allDone);
      return allDone;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    checkSolved();
    // Poll every 3s so when they return from /practice it auto-refreshes
    const interval = setInterval(checkSolved, 3000);
    return () => clearInterval(interval);
  }, [problems]);

  // Award 100% mastery when all solved
  useEffect(() => {
    if (isAllSolved && !completionReported) {
      setCompletionReported(true);
      markModuleComplete(moduleSlug, 100);
      if (userId) {
        apiReportProgress(userId, moduleSlug, 'completed', { score: 100, stageReached: 6 });
      }
      try {
        confetti({ particleCount: 160, spread: 90, origin: { y: 0.5 }, colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'] });
      } catch {}
    }
  }, [isAllSolved, completionReported]);

  const solvedCount = problems.filter((p) => solvedIds.has(p.id)).length;
  const progressPct = problems.length > 0 ? Math.round((solvedCount / problems.length) * 100) : 0;

  const handleProblemClick = (problemId: string) => {
    // Navigate to practice page; returnTo lets the page know to show a "Back" link
    const returnTarget = `/learn/${moduleSlug}?stage=skill_base`;
    router.push(`/practice/${problemId}?returnTo=${encodeURIComponent(returnTarget)}`);
  };

  // Group by difficulty for display
  const easyProblems   = problems.filter((p) => p.difficulty === 'Easy');
  const mediumProblems = problems.filter((p) => p.difficulty === 'Medium');
  const hardProblems   = problems.filter((p) => p.difficulty === 'Hard');

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-50/80 via-white to-primary-50/60 rounded-3xl border border-primary-200/60 p-5 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-dark-900">Stage 6 · Skill Base &amp; Practice</h2>
              <p className="text-[11px] text-dark-500">Complete all 10 problems to earn 100% Algorithm Mastery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-dark-600 bg-white border border-dark-200 px-3 py-1.5 rounded-xl shadow-xs">
              {solvedCount}/{problems.length} solved
            </span>
            <button
              onClick={() => { setSolvedIds(new Set()); checkSolved(); }}
              className="text-dark-400 hover:text-dark-700 p-1.5 rounded-lg hover:bg-dark-100 transition-colors"
              title="Refresh progress"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-dark-600">
            <span>Overall Progress</span>
            <span className="font-mono">{progressPct}%</span>
          </div>
          <div className="w-full h-3 bg-dark-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                isAllSolved ? 'bg-emerald-500' : 'bg-gradient-to-r from-primary-500 to-indigo-500'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {isAllSolved && (
            <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> All problems solved! 100% Module Mastery achieved.
            </p>
          )}
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg">4 × Easy</span>
          <span className="bg-blue-50 border border-blue-200 text-blue-800 px-2.5 py-1 rounded-lg">4 × Medium</span>
          <span className="bg-purple-50 border border-purple-200 text-purple-800 px-2.5 py-1 rounded-lg">2 × Hard</span>
        </div>
      </div>

      {/* ── 100% Completion Banner ──────────────────────────────────────────── */}
      {isAllSolved && (
        <div className="p-4 rounded-2xl border border-emerald-300 bg-gradient-to-r from-emerald-50 to-teal-50/50 flex items-center gap-3 animate-fadeIn shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-900">🎉 100% Algorithm Mastery Achieved!</h4>
            <p className="text-[11px] text-emerald-700">All 6 stages complete. You've mastered the {moduleTitle} algorithm!</p>
          </div>
        </div>
      )}

      {/* ── Problem groups ──────────────────────────────────────────────────── */}
      {(() => {
        let qCounter = 0;
        return ([
          { label: '🟢 Easy Problems', items: easyProblems, diff: 'Easy' as const },
          { label: '🔵 Medium Problems', items: mediumProblems, diff: 'Medium' as const },
          { label: '🟣 Hard Problems · 👑 Premium', items: hardProblems, diff: 'Hard' as const },
        ]).map(({ label, items, diff }) => {
          if (items.length === 0) return null;
          const colors = DIFF_COLORS[diff];
          const Icon = DIFF_ICONS[diff];
          const isPremiumGroup = diff === 'Hard';
          return (
            <div key={diff} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black text-dark-900 uppercase tracking-wide">{label}</h3>
                <span className="text-[10px] bg-dark-100 text-dark-500 px-2 py-0.5 rounded-full font-semibold">
                  {items.filter(p => solvedIds.has(p.id)).length}/{items.length} done
                </span>
                {isPremiumGroup && (
                  <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded">
                    <Crown className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                    Premium
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((problem) => {
                  qCounter++;
                  const qNum = qCounter;
                  const solved = solvedIds.has(problem.id);
                  const isPremium = isPremiumGroup || problem.isPremium;
                  return (
                    <button
                      key={problem.id}
                      onClick={() => handleProblemClick(problem.id)}
                      className={`group w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer relative overflow-hidden ${
                        solved
                          ? 'border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50 hover:border-emerald-400'
                          : isPremium
                          ? 'border-amber-300 bg-amber-50/30 hover:border-amber-400 hover:bg-amber-50/60 hover:shadow-sm'
                          : `border-dark-200 bg-white hover:${colors.border} hover:${colors.bg} hover:shadow-sm`
                      }`}
                    >
                      {/* Solved overlay glow */}
                      {solved && (
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(16,185,129,0.07)_0%,_transparent_60%)] pointer-events-none" />
                      )}

                      <div className="relative flex items-start gap-3">
                        {/* Q number badge */}
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-black shadow-xs ${
                            solved
                              ? 'bg-emerald-500 text-white'
                              : isPremium
                              ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-amber-500/25'
                              : `${colors.bg} ${colors.border} border ${colors.text}`
                          }`}
                        >
                          {solved ? <CheckCircle2 className="w-4 h-4" /> : `Q${qNum}`}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-xs font-black text-dark-900 leading-tight truncate">
                                {problem.title}
                              </span>
                              {isPremium && (
                                <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold text-amber-800 bg-amber-100/80 border border-amber-300 px-1 py-0.5 rounded shrink-0">
                                  <Crown className="w-2 h-2 text-amber-600 fill-amber-500" />
                                  👑
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                                {diff}
                              </span>
                              {solved ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                                  ✓ Solved
                                </span>
                              ) : (
                                <ExternalLink className="w-3.5 h-3.5 text-dark-400 group-hover:text-dark-700 transition-colors" />
                              )}
                            </div>
                          </div>
                          <p className="text-[11px] text-dark-500 leading-snug line-clamp-2">
                            {problem.description}
                          </p>
                          {!solved && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-primary-600 font-semibold group-hover:gap-1.5 transition-all">
                              <span>Solve now</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        });
      })()}

      {/* ── Certificate Section ─────────────────────────────────────────────── */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-dark-900 uppercase tracking-wide flex items-center gap-2">
            <Medal className="w-4 h-4 text-amber-500" />
            {moduleSlug.includes('grover') ? "Grover's Algorithm Certificate" : 'Algorithm Certificate'}
          </h3>
          <button
            onClick={() => setShowCertModal(true)}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>🏆 Get {moduleSlug.includes('grover') ? 'Grover ' : ''}Certification</span>
          </button>
        </div>
        <CertificateCard
          moduleSlug={moduleSlug}
          moduleTitle={moduleTitle}
          isPremium={isPremium}
          onUpgrade={openSubscriptionModal}
          onOpenCertificate={() => setShowCertModal(false || true)}
        />
      </div>

      {/* ── Pro upsell (if not solved yet and not premium) ─────────────────── */}
      {!isAllSolved && !isPremium && (
        <div className="p-4 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50/80 to-orange-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Crown className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="text-xs font-black text-amber-950">Earn your Certificate with QLearn Pro</h4>
              <p className="text-[11px] text-amber-800">
                Complete all 10 practice problems and unlock a downloadable Algorithm Certificate.
              </p>
            </div>
          </div>
          <button
            onClick={openSubscriptionModal}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs shrink-0 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Upgrade to Pro</span>
          </button>
        </div>
      )}

      {/* ── How it works info box ────────────────────────────────────────────── */}
      <div className="p-4 rounded-2xl bg-dark-50 border border-dark-200 text-xs text-dark-600 space-y-2">
        <p className="font-bold text-dark-800">How Stage 6 works:</p>
        <ul className="space-y-1 list-disc list-inside leading-relaxed">
          <li>Click any problem card to open the <strong>interactive circuit judge</strong> on the Practice page.</li>
          <li>Build the quantum circuit, submit it, and get instant accept/wrong-answer feedback.</li>
          <li>Solved problems are automatically tracked here — no need to refresh manually.</li>
          <li>Solve all 10 to unlock <strong>100% Algorithm Mastery</strong> and your Certificate.</li>
        </ul>
      </div>

      {/* Quantum Algorithm Certificate Modal */}
      <QuantumCertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        moduleSlug={moduleSlug}
        moduleTitle={moduleTitle}
        studentName={studentName || 'Alex Mercer'}
        isCompleted={isAllSolved}
      />
    </div>
  );
}
