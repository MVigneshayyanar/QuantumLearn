'use client';

import React, { useState } from 'react';
import { useProgressStore, useAITutorStore } from '@/lib/state-store';
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
  UserCheck
} from 'lucide-react';
import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

export function ProgressDashboard() {
  const {
    completedModules,
    moduleScores,
    streakDays,
    conceptMastery,
    flaggedMisconceptions
  } = useProgressStore();

  const { setIsOpen: setAITutorOpen, addMessage, setActiveMisconception } = useAITutorStore();
  const { language } = useAccessibility();
  const t = translations[language];

  const [roleView, setRoleView] = useState<'student' | 'educator'>('student');

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
  const flaggedList = Object.entries(flaggedMisconceptions);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      {/* Dashboard Top Banner */}
      <div className="bg-white rounded-3xl border border-dark-200 p-8 shadow-xs flex flex-wrap items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
            Learner Profile
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-dark-900 mt-2">
            Quantum Mastery & Analytics
          </h1>
          <p className="text-sm text-dark-600 mt-1">
            Track your understanding across quantum fundamentals, algorithms, and AI diagnostics.
          </p>
        </div>

        {/* Role switcher (Student vs Educator) */}
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
          <button
            onClick={() => setRoleView('educator')}
            aria-pressed={roleView === 'educator'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              roleView === 'educator'
                ? 'bg-white text-dark-900 shadow-xs'
                : 'text-dark-600 hover:text-dark-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-primary-600" />
            <span>Educator / Class View</span>
          </button>
        </div>
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
            <span className="text-xs text-dark-500 font-medium">Average Mastery</span>
            <p className="text-2xl font-bold text-dark-900">
              {Math.round(
                Object.values(conceptMastery).reduce((a, b) => a + b, 0) / 5
              )}%
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
            <span className="text-xs text-dark-500 font-medium">{flaggedList.length} Active</span>
          </div>

          {flaggedList.length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-950">No Conceptual Gaps Flagged!</h4>
              <p className="text-xs text-emerald-800">
                You have demonstrated clean physical reasoning across all quizzes.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedList.map(([tag, count]) => (
                <div
                  key={tag}
                  className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-amber-950 block">{tag}</span>
                    <span className="text-amber-800 text-[11px]">Flagged {count} time(s) during quizzes</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveMisconception(tag);
                      addMessage({
                        role: 'user',
                        content: `I'd like to work through my flagged misconception on "${tag}". Could you help guide my thinking?`
                      });
                      setAITutorOpen(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Review with AI</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Algorithm Modules Progress Cards */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-dark-900">Algorithm Curricula Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {algorithmModules.map((mod) => {
            const isDone = completedModules[mod.slug];
            const score = moduleScores[mod.slug] || 0;
            return (
              <div
                key={mod.slug}
                className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-primary-300 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700">
                      {mod.category}
                    </span>
                    {isDone ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completed ({score}%)
                      </span>
                    ) : (
                      <span className="text-xs text-dark-500 font-medium">In Progress</span>
                    )}
                  </div>
                  <h4 className="font-bold text-base text-dark-900">{mod.title}</h4>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-dark-100">
                  <span className="text-xs text-dark-500">4 Stages: Intuition, Math, Circuit, Quiz</span>
                  <Link
                    href={mod.href}
                    className="flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    <span>{isDone ? 'Review Module' : 'Continue Module'}</span>
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
