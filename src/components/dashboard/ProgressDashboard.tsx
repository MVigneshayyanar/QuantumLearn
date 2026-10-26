'use client';

import React, { useState, useEffect } from 'react';
import { useStudentContext } from '@/lib/student-context';
import { useAITutorStore } from '@/lib/state-store';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import Link from 'next/link';
import {
  Trophy,
  Flame,
  CheckCircle2,
  BookOpen,
  Sparkles,
  AlertTriangle,
  Bot,
  Layers,
  ArrowRight,
  BarChart3,
  Users,
  UserCheck,
  Loader2,
  Crown,
  Clock,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { MISCONCEPTION_GUIDES } from '@/lib/ai-engine';
import { MisconceptionTag } from '@/lib/types';
import { getPlanExpiryInfo } from '@/lib/subscription-utils';

// Shape returned by GET /api/students/[id]/summary
interface StudentSummary {
  student: {
    id: string;
    name: string;
    email: string;
    streakDays: number;
    isPremium?: boolean;
    planType?: string;
    premiumExpiresAt?: string | null;
    lastActiveAt: string;
  };
  completedModules: Record<string, boolean>;
  moduleScores: Record<string, number>;
  moduleStages: Record<string, number>; // stageReached (1–6) per module
  conceptMastery: {
    superposition: number;
    entanglement: number;
    phaseKickback: number;
    interference: number;
    measurement: number;
  };
  quizStats: { total: number; correct: number; accuracy: number };
  misconceptions: Array<{ tag: string; count: number; isResolved: boolean }>;
  recentQuizAttempts: Array<{
    moduleSlug: string;
    questionId: string;
    isCorrect: boolean;
    misconceptionTag: string | null;
    createdAt: string;
  }>;
}

export function ProgressDashboard() {
  const {
    userId,
    studentName,
    isIdentified,
    isInstructor,
    isAdmin,
    isPremium,
    planType,
    premiumExpiresAt,
    openSubscriptionModal
  } = useStudentContext();
  const { askTutor } = useAITutorStore();
  const { language, explanationMode } = useAccessibility();
  const t = translations[language];

  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleView, setRoleView] = useState<'student' | 'educator'>('student');

  // Fetch from DB on mount
  useEffect(() => {
    if (!userId) {
      setSummary(null);
      setIsLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/students/${userId}/summary`);
        if (!res.ok) {
          throw new Error(`Failed to load progress (HTTP ${res.status})`);
        }
        const data: StudentSummary = await res.json();
        setSummary(data);
      } catch (err: any) {
        console.warn('[ProgressDashboard] Failed to fetch summary:', err);
        setError(err?.message || 'Failed to load your progress data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [userId]);

  // Derived data from summary
  const completedModules = summary?.completedModules || {};
  const moduleScores = summary?.moduleScores || {};
  const moduleStages = summary?.moduleStages || {}; // stageReached per module
  const streakDays = summary?.student?.streakDays || 1;
  const conceptMastery = summary?.conceptMastery || {
    superposition: 0,
    entanglement: 0,
    phaseKickback: 0,
    interference: 0,
    measurement: 0,
  };
  const flaggedMisconceptions = summary?.misconceptions?.filter(m => !m.isResolved) || [];

  // Stage labels for the 6-stage model
  const STAGE_LABELS = ['Intuition', 'Math', 'Circuit', 'Build It', 'Quiz', 'Skill Base'];

  const radarData = [
    { subject: t.dashboard.superposition || 'Superposition', value: conceptMastery.superposition, fullMark: 100 },
    { subject: t.dashboard.entanglement || 'Entanglement', value: conceptMastery.entanglement, fullMark: 100 },
    { subject: t.dashboard.phaseKickback || 'Phase Kickback', value: conceptMastery.phaseKickback, fullMark: 100 },
    { subject: t.dashboard.interference || 'Interference', value: conceptMastery.interference, fullMark: 100 },
    { subject: t.dashboard.measurement || 'Measurement', value: conceptMastery.measurement, fullMark: 100 },
  ];

  const algorithmModules = [
    {
      slug: 'deutsch-jozsa',
      title: t.algorithms.deutschJozsa.title,
      category: t.algorithms.deutschJozsa.category,
      href: '/learn/deutsch-jozsa'
    },
    {
      slug: 'grover',
      title: t.algorithms.grover.title,
      category: t.algorithms.grover.category,
      href: '/learn/grover'
    },
    {
      slug: 'teleportation',
      title: t.algorithms.teleportation.title,
      category: t.algorithms.teleportation.category,
      href: '/learn/teleportation'
    },
    {
      slug: 'superdense-coding',
      title: t.algorithms.superdenseCoding.title,
      category: t.algorithms.superdenseCoding.category,
      href: '/learn/superdense-coding'
    },
    {
      slug: 'qft',
      title: t.algorithms?.qft?.title || 'Quantum Fourier Transform (QFT)',
      category: t.algorithms?.qft?.category || 'Frequency Domain',
      href: '/learn/qft'
    },
    {
      slug: 'quantum-phase-estimation',
      title: t.algorithms?.quantumPhaseEstimation?.title || 'Quantum Phase Estimation',
      category: t.algorithms?.quantumPhaseEstimation?.category || 'Eigenvalue Extraction',
      href: '/learn/quantum-phase-estimation'
    },
    {
      slug: 'shor',
      title: t.algorithms?.shor?.title || "Shor's Factoring Algorithm",
      category: t.algorithms?.shor?.category || 'Number Theory & Cryptography',
      href: '/learn/shor'
    },
    {
      slug: 'vqe',
      title: t.algorithms?.vqe?.title || 'Variational Quantum Eigensolver (VQE)',
      category: t.algorithms?.vqe?.category || 'Quantum Chemistry & NISQ',
      href: '/learn/vqe'
    }
  ];

  const completedCount = Object.values(completedModules).filter(Boolean).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-dark-500 font-medium">Loading your progress...</p>
      </div>
    );
  }

  // Not identified
  if (!isIdentified) {
    return (
      <div className="w-full mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
        <p className="text-sm text-dark-600 font-medium">Please identify yourself to view your progress dashboard.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-600 font-medium">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-24 md:pb-6 space-y-3.5 animate-fadeIn">
      {/* Unified Dashboard Header & Plan Banner */}
      {(() => {
        const effectiveExpiry = summary?.student?.premiumExpiresAt || premiumExpiresAt;
        const expiry = getPlanExpiryInfo(effectiveExpiry);
        const currentPlan = summary?.student?.planType || planType;

        return (
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Left: Learner Profile & Subtitle */}
            <div className="flex-1 min-w-[280px]">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/60">
                  Learner Profile
                </span>
                {isPremium && !isAdmin && !isInstructor && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60">
                    <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                    <span>QuanBit Pro</span>
                  </span>
                )}
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-dark-900 dark:text-white mt-1">
                {studentName ? `${studentName} — ${t?.dashboard?.title || 'Quantum Learning Dashboard'}` : (t?.dashboard?.title || 'Quantum Mastery & Analytics')}
              </h1>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5 line-clamp-1">
                {t?.dashboard?.subtitle || 'Track your concept mastery, daily study streak, algorithm progress, and targeted AI recommendations.'}
              </p>
            </div>

            {/* Right: Plan Expiry Badge, CTA, and Role Switcher */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* If user is Pro */}
              {isPremium && !isAdmin && !isInstructor && (
                <>
                  {expiry && (
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      expiry.isUrgent
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700 animate-pulse'
                        : 'bg-amber-50/80 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-700/70'
                    }`}>
                      {expiry.isUrgent ? (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                      )}
                      <span>{expiry.badgeText}</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={openSubscriptionModal}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    Manage Plan
                  </button>
                </>
              )}

              {/* If Free student */}
              {!isPremium && !isAdmin && !isInstructor && (
                <button
                  type="button"
                  onClick={openSubscriptionModal}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-[0.98]"
                >
                  <Crown className="w-3.5 h-3.5 fill-amber-200 text-amber-100" />
                  <span>Upgrade to Pro</span>
                </button>
              )}

              {/* Role switcher (Only visible to Instructor or Admin) */}
              {(isInstructor || isAdmin) && (
                <div className="inline-flex rounded-xl border border-dark-200 dark:border-dark-700 p-1 bg-dark-50 dark:bg-dark-800">
                  <button
                    onClick={() => setRoleView('student')}
                    aria-pressed={roleView === 'student'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      roleView === 'student'
                        ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-xs'
                        : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    <span>Student View</span>
                  </button>
                  <Link
                    href="/instructor"
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white`}
                  >
                    <Users className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                    <span>Educator View</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">{t.dashboard.streak || 'Daily Streak'}</span>
            <p className="text-2xl font-bold text-dark-900">{streakDays} Days</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">{t.dashboard.completedModules || 'Completed Modules'}</span>
            <p className="text-2xl font-bold text-dark-900">{completedCount} / 4</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">{t.dashboard.quizAccuracy || 'Quiz Accuracy'}</span>
            <p className="text-2xl font-bold text-dark-900">
              {summary?.quizStats?.accuracy || 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Concept Mastery Radar & Misconception Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Concept Mastery Radar Map */}
        <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-base text-dark-900">Concept Mastery Map</h3>
            </div>
            <span className="text-xs text-dark-500 font-medium">Physics Competencies</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#374151', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#9CA3AF" tick={{ fontSize: 10 }} />
                <Radar name="Mastery" dataKey="value" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Flagged Misconceptions & AI Diagnostics */}
        <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-base text-dark-900">AI Diagnostic Misconceptions</h3>
            </div>
            <span className="text-xs text-dark-500 font-medium">{flaggedMisconceptions.length} Active</span>
          </div>

          {flaggedMisconceptions.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-950">No Conceptual Gaps Flagged!</h4>
              <p className="text-xs text-emerald-800">
                You have demonstrated clean physical reasoning across all quizzes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedMisconceptions.map((item) => {
                const guide = MISCONCEPTION_GUIDES[item.tag as MisconceptionTag];
                const humanTitle =
                  guide?.name ||
                  item.tag
                    .split('_')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                    .join(' ');
                return (
                  <div
                    key={item.tag}
                    className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <span className="font-bold text-amber-950 block text-sm">{humanTitle}</span>
                      <span className="text-amber-800 text-[11px] block">
                        Flagged {item.count} time(s) during quizzes
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        askTutor(
                          `I'd like to work through my flagged misconception on "${humanTitle}". Could you help guide my thinking?`,
                          { explanationMode, activeMisconception: item.tag, language }
                        );
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0 cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>Review with AI</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Modules Progress Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-dark-900">Algorithm Curricula Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {algorithmModules.map((mod) => {
            const isDone = Boolean(completedModules[mod.slug]);
            const stageReached = moduleStages[mod.slug] || 0;
            // Each stage represents 16.67% of the curriculum (100% / 6 stages).
            // A stage is only completed when the student finishes it.
            // When a student is ON Stage 6, they have completed stages 1–5 (83.3%).
            // Stage 6 is the final practice stage and is ONLY marked complete (100%) when all practice problems are solved (isDone is true).
            const completedStagesCount = isDone
              ? 6
              : Math.min(5, Math.max(0, stageReached - 1));
            const stagePct = isDone ? 100 : Math.round((completedStagesCount / 6) * 100);
            const currentStageName = isDone
              ? 'Completed'
              : stageReached > 0
              ? STAGE_LABELS[stageReached - 1]
              : 'Not started';
            return (
              <div
                key={mod.slug}
                className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                      {mod.category}
                    </span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        100% Mastered
                      </span>
                    ) : stageReached > 0 ? (
                      <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                        Stage {stageReached}/6 In Progress · {stagePct}%
                      </span>
                    ) : (
                      <span className="text-xs text-dark-400 font-medium">Not started</span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-dark-900">{mod.title}</h4>
                </div>

                {/* 6-Stage Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-dark-500">
                    <span>
                      {isDone
                        ? 'All 6 Stages Completed'
                        : stageReached > 0
                        ? `Current: Stage ${stageReached} (${currentStageName})`
                        : 'Begin Stage 1'}
                    </span>
                    <span className="font-mono">{stagePct}% complete</span>
                  </div>
                  {/* Segmented 6-stage track */}
                  <div className="grid grid-cols-6 gap-0.5">
                    {STAGE_LABELS.map((label, idx) => {
                      const stageNum = idx + 1;
                      const isCompleted = isDone || stageNum <= completedStagesCount;
                      const isCurrent = !isDone && stageNum === stageReached;
                      return (
                        <div
                          key={label}
                          title={`Stage ${stageNum}: ${label} ${isCompleted ? '(Completed)' : isCurrent ? '(In Progress)' : ''}`}
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCompleted
                              ? isDone
                                ? 'bg-emerald-500'
                                : 'bg-primary-500'
                              : isCurrent
                              ? 'bg-primary-200 border-2 border-primary-500'
                              : 'bg-dark-150 border border-dark-200'
                          }`}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[9px] text-dark-400 font-medium">
                    {STAGE_LABELS.map((l, idx) => (
                      <span
                        key={l}
                        className={
                          isDone || idx < completedStagesCount
                            ? 'text-primary-600 font-bold'
                            : idx === stageReached - 1
                            ? 'text-primary-500 font-bold underline'
                            : ''
                        }
                      >
                        {idx + 1}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-dark-100">
                  <span className="text-[10px] text-dark-400">6 stages · 16.7% each · Stage 6 = certificate</span>
                  <Link
                    href={mod.href}
                    className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span>{isDone ? 'Review' : stageReached > 0 ? 'Continue' : 'Start'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
