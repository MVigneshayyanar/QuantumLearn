'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Trophy,
  ArrowLeft,
  Loader2,
  BookOpen,
  TrendingUp,
  Flame,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

// Types for API responses
interface ModuleStat {
  moduleSlug: string;
  totalStudents: number;
  completedCount: number;
  inProgressCount: number;
  completionRate: number;
  averageScore: number;
}

interface OverviewData {
  totalStudents: number;
  totalQuizAttempts: number;
  quizAccuracy: number;
  totalPracticeSubmissions: number;
  moduleStats: ModuleStat[];
}

interface MisconceptionAgg {
  tag: string;
  totalCount: number;
  studentCount: number;
  isResolved: number;
}

interface MisconceptionData {
  aggregatedByTag: MisconceptionAgg[];
  byQuestion: Array<{ moduleSlug: string; questionId: string; misconceptionTag: string; count: number }>;
}

interface StudentRow {
  id: string;
  name: string;
  email: string;
  streakDays: number;
  lastActiveAt: string;
  createdAt: string;
  completedModules: number;
  totalModules: number;
  averageScore: number;
  quizAttempts: number;
  activeMisconceptions: number;
}

const MODULE_LABELS: Record<string, string> = {
  'deutsch-jozsa': 'Deutsch-Jozsa',
  'grover': "Grover's Search",
  'teleportation': 'Teleportation',
  'superdense-coding': 'Superdense Coding',
};

export default function InstructorDashboard() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [misconceptions, setMisconceptions] = useState<MisconceptionData | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'misconceptions' | 'students'>('overview');

  const [isSeeding, setIsSeeding] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, miscRes, studentsRes] = await Promise.all([
        fetch('/api/instructor/overview'),
        fetch('/api/instructor/misconceptions'),
        fetch('/api/instructor/students'),
      ]);

      if (!overviewRes.ok || !miscRes.ok || !studentsRes.ok) {
        throw new Error('Failed to load instructor data.');
      }

      const [overviewData, miscData, studentsData] = await Promise.all([
        overviewRes.json(),
        miscRes.json(),
        studentsRes.json(),
      ]);

      setOverview(overviewData);
      setMisconceptions(miscData);
      setStudents(studentsData.students || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSeedCohort = async () => {
    setIsSeeding(true);
    try {
      const res = await fetch('/api/instructor/seed', { method: 'POST' });
      if (res.ok) {
        await fetchAll();
      }
    } catch (e) {
      console.error('Seed error:', e);
    } finally {
      setIsSeeding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full mx-auto px-8 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-dark-500 font-medium">Loading instructor dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto px-8 py-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
        <p className="text-sm text-red-600 font-medium">{error}</p>
      </div>
    );
  }

  const moduleChartData = overview?.moduleStats?.map((m) => ({
    name: MODULE_LABELS[m.moduleSlug] || m.moduleSlug,
    completionRate: m.completionRate,
    avgScore: m.averageScore,
    students: m.totalStudents,
  })) || [];

  const misconceptionChartData = misconceptions?.aggregatedByTag?.slice(0, 8).map((m) => ({
    name: m.tag.replace(/_/g, ' ').substring(0, 20),
    fullName: m.tag,
    count: m.totalCount,
    students: m.studentCount,
  })) || [];

  return (
    <div className="w-full mx-auto px-8 py-3 space-y-3.5 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Link
                href="/dashboard"
                className="flex items-center gap-1 text-xs text-dark-500 hover:text-dark-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Student View
              </Link>
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
              Educator Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 mt-1.5">
              Class Analytics & Insights
            </h1>
            <p className="text-sm text-dark-600 mt-1">
              Real-time view of student progress, quiz performance, and flagged misconceptions in Neon DB.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-3">
            {/* Seed Demo Cohort Button */}
            <button
              onClick={handleSeedCohort}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold text-xs transition-colors shadow-2xs"
              title="Populate database with 5 realistic demo student records for demonstration"
            >
              {isSeeding ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
              )}
              <span>{isSeeding ? 'Seeding...' : 'Seed Demo Cohort'}</span>
            </button>

            {/* Tab Navigation */}
            <div className="inline-flex rounded-xl border border-dark-200 p-1 bg-dark-50">
              {(['overview', 'misconceptions', 'students'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors capitalize ${
                    activeTab === tab
                      ? 'bg-white text-dark-900 shadow-xs'
                      : 'text-dark-600 hover:text-dark-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && overview && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-dark-500 font-medium">Total Students</span>
                <p className="text-2xl font-bold text-dark-900">{overview.totalStudents}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-dark-500 font-medium">Quiz Attempts</span>
                <p className="text-2xl font-bold text-dark-900">{overview.totalQuizAttempts}</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-dark-500 font-medium">Class Accuracy</span>
                <p className="text-2xl font-bold text-dark-900">{overview.quizAccuracy}%</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-dark-500 font-medium">Active Misconceptions</span>
                <p className="text-2xl font-bold text-dark-900">
                  {misconceptions?.aggregatedByTag?.length || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Module Completion Chart */}
          <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-base text-dark-900">Module Completion Rates</h3>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    formatter={(v: any, name: string) => {
                      if (name === 'completionRate') return [`${v}%`, 'Completion Rate'];
                      if (name === 'avgScore') return [`${v}%`, 'Avg Score'];
                      return [v, name];
                    }}
                  />
                  <Bar dataKey="completionRate" name="completionRate" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="avgScore" name="avgScore" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 text-xs text-dark-500">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#4F46E5]" />
                <span>Completion Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-[#10B981]" />
                <span>Average Score</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Misconceptions Tab */}
      {activeTab === 'misconceptions' && misconceptions && (
        <div className="space-y-6">
          {/* Misconception Heatmap Chart */}
          <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-base text-dark-900">Misconception Heatmap</h3>
            </div>

            {misconceptionChartData.length === 0 ? (
              <div className="p-8 text-center bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950">No Misconceptions Logged Yet</h4>
                <p className="text-xs text-emerald-800">
                  Students have not triggered any misconception flags in their quizzes.
                </p>
              </div>
            ) : (
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={misconceptionChartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={150} />
                    <Tooltip
                      formatter={(v: any) => [v, 'Occurrences']}
                      labelFormatter={(label: string) => {
                        const item = misconceptionChartData.find(m => m.name === label);
                        return item?.fullName || label;
                      }}
                    />
                    <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                      {misconceptionChartData.map((_, idx) => (
                        <Cell key={idx} fill={idx < 3 ? '#EF4444' : '#F59E0B'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Per-Question Breakdown */}
          {misconceptions.byQuestion.length > 0 && (
            <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-dark-900">Per-Question Misconception Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-dark-200 text-dark-500 text-left">
                      <th className="py-2 pr-4 font-semibold">Module</th>
                      <th className="py-2 pr-4 font-semibold">Question</th>
                      <th className="py-2 pr-4 font-semibold">Misconception Tag</th>
                      <th className="py-2 font-semibold text-right">Occurrences</th>
                    </tr>
                  </thead>
                  <tbody>
                    {misconceptions.byQuestion.map((q, idx) => (
                      <tr key={idx} className="border-b border-dark-100 hover:bg-dark-50/50">
                        <td className="py-2.5 pr-4 font-medium text-dark-800">
                          {MODULE_LABELS[q.moduleSlug] || q.moduleSlug}
                        </td>
                        <td className="py-2.5 pr-4 font-mono text-dark-600">{q.questionId}</td>
                        <td className="py-2.5 pr-4">
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-[11px]">
                            {q.misconceptionTag}
                          </span>
                        </td>
                        <td className="py-2.5 text-right font-bold text-dark-900">{q.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-3xl border border-dark-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary-600" />
              <h3 className="font-bold text-base text-dark-900">Student Roster</h3>
            </div>
            <span className="text-xs text-dark-500 font-medium">{students.length} students</span>
          </div>

          {students.length === 0 ? (
            <div className="p-8 text-center bg-dark-50 rounded-2xl border border-dark-200 space-y-3">
              <Users className="w-8 h-8 text-dark-400 mx-auto" />
              <h4 className="font-bold text-sm text-dark-700">No Students Yet</h4>
              <p className="text-xs text-dark-500 max-w-sm mx-auto">
                Students will appear here once they identify themselves and begin learning. You can also seed a demo cohort to explore the analytics immediately.
              </p>
              <button
                onClick={handleSeedCohort}
                disabled={isSeeding}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSeeding ? 'Seeding...' : 'Seed Demo Cohort (5 Students)'}</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-dark-200 text-dark-500 text-left">
                    <th className="py-2 pr-4 font-semibold">Name</th>
                    <th className="py-2 pr-4 font-semibold">Email</th>
                    <th className="py-2 pr-4 font-semibold text-center">Modules</th>
                    <th className="py-2 pr-4 font-semibold text-center">Avg Score</th>
                    <th className="py-2 pr-4 font-semibold text-center">Quiz Attempts</th>
                    <th className="py-2 pr-4 font-semibold text-center">Misconceptions</th>
                    <th className="py-2 font-semibold text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.id} className="border-b border-dark-100 hover:bg-dark-50/50">
                      <td className="py-2.5 pr-4 font-medium text-dark-900">{s.name || '—'}</td>
                      <td className="py-2.5 pr-4 text-dark-600">{s.email}</td>
                      <td className="py-2.5 pr-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          s.completedModules === s.totalModules
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-dark-100 text-dark-700'
                        }`}>
                          {s.completedModules}/{s.totalModules}
                        </span>
                      </td>
                      <td className="py-2.5 pr-4 text-center font-bold text-dark-900">
                        {s.averageScore}%
                      </td>
                      <td className="py-2.5 pr-4 text-center text-dark-700">{s.quizAttempts}</td>
                      <td className="py-2.5 pr-4 text-center">
                        {s.activeMisconceptions > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold">
                            <AlertTriangle className="w-3 h-3" />
                            {s.activeMisconceptions}
                          </span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        )}
                      </td>
                      <td className="py-2.5 text-right text-dark-500">
                        {new Date(s.lastActiveAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
