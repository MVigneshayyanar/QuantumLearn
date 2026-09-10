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
  Loader2
} from 'lucide-react';
import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { MISCONCEPTION_GUIDES } from '@/lib/ai-engine';
import { MisconceptionTag } from '@/lib/types';

// Shape returned by GET /api/students/[id]/summary
interface StudentSummary {
  student: { id: string; name: string; email: string; streakDays: number; lastActiveAt: string };
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
  const { userId, studentName, isIdentified, isInstructor, isAdmin } = useStudentContext();
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
    { subject: 'Superposition', value: conceptMastery.superposition, fullMark: 100 },
    { subject: 'Entanglement', value: conceptMastery.entanglement, fullMark: 100 },
    { subject: 'Phase Kickback', value: conceptMastery.phaseKickback, fullMark: 100 },
    { subject: 'Interference', value: conceptMastery.interference, fullMark: 100 },
    { subject: 'Measurement', value: conceptMastery.measurement, fullMark: 100 },
  ];

  const algorithmModules = [
    {
      slug: 'deutsch-jozsa',
      title: 'Deutsch-Jozsa Algorithm',
      category: 'Quantum Parallelism',
      href: '/learn/deutsch-jozsa'
    },
    {
      slug: 'grover',
      title: "Grover's Search Algorithm",
      category: 'Amplitude Amplification',
      href: '/learn/grover'
    },
    {
      slug: 'teleportation',
      title: 'Quantum Teleportation',
      category: 'Quantum Communication',
      href: '/learn/teleportation'
    },
    {
      slug: 'superdense-coding',
      title: 'Superdense Coding',
      category: 'Quantum Information',
      href: '/learn/superdense-coding'
    }
  ];

  const completedCount = Object.values(completedModules).filter(Boolean).length;

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full mx-auto px-8 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-dark-500 font-medium">Loading your progress...</p>
      </div>
    );
  }

  // Not identified
  if (!isIdentified) {
    return (
      <div className="w-full mx-auto px-8 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-8 h-8 text-amber-500" />
        <p className="text-sm text-dark-600 font-medium">Please identify yourself to view your progress dashboard.</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full mx-auto px-8 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
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
    <div className="w-full mx-auto px-8 py-3 space-y-3.5 animate-fadeIn">
      {/* Dashboard Top Banner */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
            Learner Profile
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900 mt-1.5">
            {studentName ? `${studentName}'s Quantum Journey` : 'Quantum Mastery & Analytics'}
          </h1>
          <p className="text-xs sm:text-sm text-dark-600 mt-0.5">
            Track your understanding across quantum fundamentals, algorithms, and AI diagnostics.
          </p>
        </div>

        {/* Role switcher (Only visible to Instructor or Admin) */}
        {(isInstructor || isAdmin) && (
          <div className="inline-flex rounded-xl border border-dark-200 p-1 bg-dark-50">
            <button
              onClick={() => setRoleView('student')}
              aria-pressed={roleView === 'student'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                roleView === 'student'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-primary-600" />
              <span>Student View</span>
            </button>
            <Link
              href="/instructor"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors text-dark-600 hover:text-dark-900`}
            >
              <Users className="w-3.5 h-3.5 text-primary-600" />
              <span>Educator / Class View</span>
            </Link>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">Daily Streak</span>
            <p className="text-2xl font-bold text-dark-900">{streakDays} Days</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">Completed Modules</span>
            <p className="text-2xl font-bold text-dark-900">{completedCount} / 4</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-dark-500 font-medium">Quiz Accuracy</span>
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
