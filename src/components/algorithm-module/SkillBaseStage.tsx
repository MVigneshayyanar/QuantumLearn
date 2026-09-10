'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ALGORITHM_OPTIONS } from '@/lib/practice-problems';
import { ASSESSMENT_PROBLEMS } from '@/lib/assessment-problems';
import { useProgressStore } from '@/lib/state-store';
import { useStudentContext } from '@/lib/student-context';
import { apiReportProgress } from '@/lib/api-helpers';
import { MathRenderer } from '@/components/math/MathRenderer';
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
  Search,
  RotateCcw,
  Filter,
  Clock,
  Circle,
  ShieldCheck,
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

function CertificateCard({
  moduleSlug,
  moduleTitle,
  isPremium,
  isAllSolved = false,
  onUpgrade,
  onOpenCertificate,
}: {
  moduleSlug: string;
  moduleTitle: string;
  isPremium: boolean;
  isAllSolved?: boolean;
  onUpgrade: () => void;
  onOpenCertificate: () => void;
}) {
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const isUnlocked = isPremium || isAllSolved;

  if (!isUnlocked) {
    return (
      <div className="relative rounded-3xl border-2 border-dashed border-amber-300 bg-gradient-to-br from-amber-50 via-white to-orange-50/40 p-6 sm:p-8 text-center space-y-4 overflow-hidden">
        {/* Blurred certificate preview */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <Medal className="w-48 h-48 text-amber-500" />
        </div>
        <div className="relative z-10 space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-md shadow-amber-500/30">
            <Award className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-black text-dark-900">Certificate In Progress</h4>
            <p className="text-xs text-dark-600 max-w-sm mx-auto leading-relaxed">
              Complete the assessment questions to claim and download your verified{' '}
              <em>{moduleTitle}</em> Quantum Algorithm Certificate.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-white" />
              <span>Preview Certificate</span>
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
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-400/40">
          <Award className="w-8 h-8 text-white" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Official Quantum Credential · Claimed</p>
          <h3 className="text-xl font-black text-dark-900">QLearn Quantum Algorithm Mastery</h3>
          <p className="text-sm font-semibold text-dark-700">{moduleTitle}</p>
        </div>

        <div className="border-t border-b border-amber-200 py-3 space-y-0.5">
          <p className="text-xs text-dark-600">
            This certifies completion of all 6 stages including the Assessment Track.
          </p>
          <p className="text-[11px] text-amber-700 font-semibold">{date}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenCertificate}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4 text-white" />
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

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Get 10 curated problems
  const problems = useMemo(() => ASSESSMENT_PROBLEMS, []);

  // Load solved and attempted IDs from localStorage
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [attemptedIds, setAttemptedIds] = useState<Set<string>>(new Set());
  const [isAllSolved, setIsAllSolved] = useState(false);
  const [completionReported, setCompletionReported] = useState(false);

  const checkSolved = () => {
    try {
      const storedSolved: string[] = JSON.parse(localStorage.getItem('ql_practice_solved') || '[]');
      const storedAttempted: string[] = JSON.parse(localStorage.getItem('ql_practice_attempted') || '[]');
      const solvedSet = new Set(storedSolved);
      const attemptedSet = new Set(storedAttempted);
      setSolvedIds(solvedSet);
      setAttemptedIds(attemptedSet);
      const allDone = problems.length > 0 && problems.every((p) => solvedSet.has(p.id));
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
    const returnTarget = `/learn/${moduleSlug}?stage=skill_base`;
    router.push(`/practice/${problemId}?returnTo=${encodeURIComponent(returnTarget)}`);
  };

  const getStatus = (id: string) => {
    if (solvedIds.has(id)) return 'SOLVED';
    if (attemptedIds.has(id)) return 'ATTEMPTED';
    return 'UNSOLVED';
  };

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
              <h2 className="text-sm font-black text-dark-900">Stage 6 · Assessment</h2>
              <p className="text-[11px] text-dark-500">Complete all 10 assessment questions to earn 100% Algorithm Mastery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-dark-600 bg-white border border-dark-200 px-3 py-1.5 rounded-xl shadow-xs">
              {solvedCount}/{problems.length} solved
            </span>
            <button
              onClick={() => { setSolvedIds(new Set()); checkSolved(); }}
              className="text-dark-400 hover:text-dark-700 p-1.5 rounded-lg hover:bg-dark-100 transition-colors cursor-pointer"
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

      {/* ── Problem List Table ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-dark-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-200 bg-dark-50/50 text-dark-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-3 w-10 text-center">Q#</th>
                <th className="py-3.5 px-3 w-12 text-center">Status</th>
                <th className="py-3.5 px-5">Problem</th>
                <th className="py-3.5 px-4">Algorithm</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Difficulty</th>
                <th className="py-3.5 px-4 text-center">Qubits</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {problems.map((prob, probIdx) => {
                const status = getStatus(prob.id);
                const isProblemPremium = prob.isPremium || prob.difficulty === 'Hard';
                const displayNum = probIdx + 1;
                return (
                  <tr
                    key={prob.id}
                    onClick={() => handleProblemClick(prob.id)}
                    className={`hover:bg-dark-50/60 transition-colors group cursor-pointer ${
                      isProblemPremium ? 'bg-amber-50/30' : ''
                    }`}
                  >
                    {/* Question Number */}
                    <td className="py-4 px-3 text-center">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black mx-auto ${
                          isProblemPremium
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-xs shadow-amber-500/25'
                            : 'bg-dark-100 text-dark-700'
                        }`}
                      >
                        {displayNum}
                      </div>
                    </td>

                    {/* Status Icon */}
                    <td className="py-4 px-3 text-center">
                      {status === 'SOLVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : status === 'ATTEMPTED' ? (
                        <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-dark-300 mx-auto" />
                      )}
                    </td>

                    {/* Title & Description + Premium Badge */}
                    <td className="py-4 px-5">
                      <div className="block group-hover:text-primary-600 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-dark-900 group-hover:text-primary-600">
                            <MathRenderer text={prob.title} />
                          </span>
                          {isProblemPremium && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded shrink-0">
                              <Crown className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                              Premium
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-dark-500 mt-0.5 line-clamp-1">
                          <MathRenderer text={prob.description} />
                        </div>
                      </div>
                    </td>

                    {/* Algorithm Badge(s) */}
                    <td className="py-4 px-4 text-dark-700">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {prob.algorithms?.map((alg) => {
                          const meta = ALGORITHM_OPTIONS.find((a) => a.slug === alg);
                          const label = meta ? meta.shortLabel : alg;
                          return (
                            <span
                              key={alg}
                              className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary-50 text-primary-700 border border-primary-100 whitespace-nowrap"
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-dark-700 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-dark-100 text-dark-700 text-[11px] whitespace-nowrap">
                        {prob.category}
                      </span>
                    </td>

                    {/* Difficulty Badge */}
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${
                          prob.difficulty === 'Easy'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prob.difficulty === 'Medium'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Qubits */}
                    <td className="py-4 px-4 text-center font-mono font-medium text-dark-600">
                      {prob.numQubits}Q
                    </td>

                    {/* Solve Button */}
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProblemClick(prob.id);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs cursor-pointer ${
                          status === 'SOLVED'
                            ? 'bg-dark-100 hover:bg-dark-200 text-dark-800'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                      >
                        <span>{status === 'SOLVED' ? 'Review' : 'Solve'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
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
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{isAllSolved ? 'View Certificate' : 'Certificate Status'}</span>
          </button>
        </div>
        <CertificateCard
          moduleSlug={moduleSlug}
          moduleTitle={moduleTitle}
          isPremium={isPremium}
          isAllSolved={isAllSolved}
          onUpgrade={openSubscriptionModal}
          onOpenCertificate={() => setShowCertModal(true)}
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
        <p className="font-bold text-dark-800">How Assessment works:</p>
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
        onClaimCertificate={() => {
          markModuleComplete(moduleSlug, 100);
          if (userId) {
            apiReportProgress(userId, moduleSlug, 'completed', { score: 100, stageReached: 6 });
          }
          try {
            confetti({ particleCount: 120, spread: 75, origin: { y: 0.5 }, colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899'] });
          } catch {}
        }}
      />
    </div>
  );
}
