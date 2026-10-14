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
    <div className="space-y-3 text-xs">
      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-white rounded-xl border border-dark-200 px-4 py-2.5 space-y-2 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-black text-dark-900 leading-tight">Stage 6 · Assessment Problems</h2>
              <p className="text-[10px] text-dark-500">Complete all problems to earn 100% Algorithm Mastery</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-dark-600 bg-white border border-dark-200 px-2.5 py-1 rounded-lg shadow-2xs">
              {solvedCount}/{problems.length} solved
            </span>
            <button
              onClick={() => { setSolvedIds(new Set()); checkSolved(); }}
              className="text-dark-400 hover:text-dark-700 p-1 rounded hover:bg-dark-100 transition-colors cursor-pointer"
              title="Refresh progress"
            >
              <RefreshCw className="w-3 h-3" />
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
                isAllSolved ? 'bg-emerald-500' : 'bg-primary-600'
              }`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* â”€â”€ 100% Completion Banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {isAllSolved && (
        <div className="p-3 rounded-2xl border border-amber-300 bg-amber-50 flex items-center gap-3 animate-fadeIn">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <p className="flex-1 text-xs font-bold text-amber-900">You've solved all problems — claim your certificate.</p>
          <button
            type="button"
            onClick={() => {
              markModuleComplete(moduleSlug, 100);
              if (userId) {
                apiReportProgress(userId, moduleSlug, 'completed', { score: 100, stageReached: 6 });
              }
              setShowCertModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold cursor-pointer"
          >
            Claim Certificate
          </button>
        </div>
      )}

      {/* â”€â”€ Problem List Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-white rounded-2xl border border-dark-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-200 bg-dark-50/50 text-dark-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3 w-10 text-center">Q#</th>
                <th className="py-2.5 px-3 w-12 text-center">Status</th>
                <th className="py-2.5 px-4">Problem</th>
                <th className="py-2.5 px-3">Algorithm</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Difficulty</th>
                <th className="py-2.5 px-3 text-center">Qubits</th>
                <th className="py-2.5 px-4 text-right">Action</th>
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
                    <td className="py-2.5 px-3 text-center">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black mx-auto ${
                          isProblemPremium
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-2xs'
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
