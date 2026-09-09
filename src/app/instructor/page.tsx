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
  Sparkles,
  ShieldAlert,
  Bot,
  UserPlus,
  HelpCircle,
  X,
  Search,
  Filter,
  UserCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useStudentContext } from '@/lib/student-context';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

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
  practiceSubmissions: number;
  activeMisconceptions: number;
  misconceptionList?: Array<{ misconceptionTag: string; occurrenceCount: number; isResolved: boolean }>;
  moduleProgress?: Array<{ moduleSlug: string; isCompleted: boolean; masteryScore: number; stageReached: number }>;
  isMapped: boolean;
  aiUsageCount: number;
  solvesWithHelp: number;
  solvesWithoutHelp: number;
  totalSuccessfulSolves: number;
  percentWithoutHelp: number;
  percentWithHelp: number;
}

const MODULE_LABELS: Record<string, string> = {
  'deutsch-jozsa': 'Deutsch-Jozsa',
  'grover': "Grover's Search",
  'teleportation': 'Teleportation',
  'superdense-coding': 'Superdense Coding',
};

export default function InstructorDashboard() {
  const { isInstructor, isAdmin, openLoginModal, isLoading: isAuthLoading } = useStudentContext();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [misconceptions, setMisconceptions] = useState<MisconceptionData | null>(null);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'misconceptions' | 'students'>('overview');

  // Student roster filtering & scope
  const [scope, setScope] = useState<'mapped' | 'all'>('mapped');
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentRow | null>(null);

  // Map / Add Student Modal
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [mappingData, setMappingData] = useState<{ mappedStudents: any[]; availableStudents: any[] } | null>(null);
  const [isLoadingMapping, setIsLoadingMapping] = useState(false);
  const [mappingTab, setMappingTab] = useState<'select' | 'new'>('select');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPassword, setNewStudentPassword] = useState('');
  const [mappingMsg, setMappingMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const [isSeeding, setIsSeeding] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, miscRes, studentsRes] = await Promise.all([
        fetch('/api/instructor/overview'),
        fetch('/api/instructor/misconceptions'),
        fetch(`/api/instructor/students?scope=${scope}`),
      ]);

      if (!overviewRes.ok || !miscRes.ok || !studentsRes.ok) {
        if (overviewRes.status === 403 || miscRes.status === 403 || studentsRes.status === 403) {
          throw new Error('Instructor access authorization failed. Please sign in as an instructor.');
        }
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
    if (isAuthLoading) return;
    if (isInstructor) {
      fetchAll();
    } else {
      setIsLoading(false);
    }
  }, [isInstructor, isAuthLoading, scope]);

  const loadMappingData = async () => {
    setIsLoadingMapping(true);
    setMappingMsg(null);
    try {
      const res = await fetch('/api/instructor/mapping');
      if (res.ok) {
        const data = await res.json();
        setMappingData(data);
      }
    } catch (e) {
      console.error('Error fetching mapping:', e);
    } finally {
      setIsLoadingMapping(false);
    }
  };

  const handleOpenMappingModal = () => {
    setShowMappingModal(true);
    loadMappingData();
  };

  const handleMapStudent = async (studentId: string) => {
    setMappingMsg(null);
    try {
      const res = await fetch('/api/instructor/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (res.ok) {
        setMappingMsg({ text: 'Student mapped to your class successfully!' });
        await loadMappingData();
        await fetchAll();
      } else {
        setMappingMsg({ text: data.error || 'Failed to map student', isError: true });
      }
    } catch (e: any) {
      setMappingMsg({ text: e.message || 'Mapping error', isError: true });
    }
  };

  const handleCreateAndMapStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setMappingMsg(null);
    try {
      const res = await fetch('/api/instructor/mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          email: newStudentEmail,
          password: newStudentPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMappingMsg({ text: 'New student created and added to your class!' });
        setNewStudentName('');
        setNewStudentEmail('');
        setNewStudentPassword('');
        await loadMappingData();
        await fetchAll();
      } else {
        setMappingMsg({ text: data.error || 'Failed to create student', isError: true });
      }
    } catch (e: any) {
      setMappingMsg({ text: e.message || 'Failed to create student', isError: true });
    }
  };

  const handleUnmapStudent = async (studentId: string) => {
    try {
      const res = await fetch(`/api/instructor/mapping?studentId=${studentId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        await loadMappingData();
        await fetchAll();
      }
    } catch (e) {
      console.error('Failed to unmap:', e);
    }
  };

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

  if (isAuthLoading || (isLoading && isInstructor)) {
    return (
      <div className="w-full mx-auto px-8 py-16 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-dark-500 font-medium">Loading instructor dashboard & student diagnostics...</p>
      </div>
    );
  }

  // Explicit Access Denied Screen
  if (!isInstructor) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center border border-amber-200 shadow-xs">
          <ShieldAlert className="w-8 h-8 text-amber-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-dark-900">Instructor Access Required</h1>
          <p className="text-sm text-dark-600 max-w-md mx-auto">
            This dashboard is restricted to verified instructors and teaching assistants (`instructor@qlearn.com`). Please sign in with an instructor-authorized account to view class analytics and student diagnostics.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openLoginModal()}
            className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            Sign In as Instructor
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-dark-200 hover:bg-dark-50 text-dark-700 font-semibold text-sm transition-colors"
          >
            Return to Home
          </Link>
        </div>
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

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

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
    <div className="w-full mx-auto px-6 sm:px-8 py-4 space-y-4 animate-fadeIn">
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
              {isAdmin && (
                <>
                  <span className="text-dark-300">•</span>
                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    <span>Admin Console</span>
                  </Link>
                </>
              )}
            </div>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
              Educator Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 mt-1.5">
              Class Analytics & Diagnostics
            </h1>
            <p className="text-xs sm:text-sm text-dark-600 mt-0.5">
              Real-time analytics on student performance, problem solves (self vs AI-assisted), and conceptual misconceptions.
            </p>
          </div>

          <div className="flex items-center flex-wrap gap-2.5">
            {/* Map / Add Student Button */}
            <button
              onClick={handleOpenMappingModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-all shadow-xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>Map / Add Students</span>
            </button>

            {/* Seed Cohort Button */}
            <button
              onClick={handleSeedCohort}
              disabled={isSeeding}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary-200 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold text-xs transition-colors shadow-2xs"
              title="Populate database with 5 demo students"
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
                  {tab === 'students' ? `Students (${students.length})` : tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">Students Enrolled</span>
            <p className="text-xl font-bold text-dark-900">{overview?.totalStudents || 0}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">Quiz Accuracy</span>
            <p className="text-xl font-bold text-dark-900">{overview?.quizAccuracy || 0}%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">AI Invocations</span>
            <p className="text-xl font-bold text-dark-900">
              {students.reduce((acc, s) => acc + s.aiUsageCount, 0)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">Total Quiz Attempts</span>
            <p className="text-xl font-bold text-dark-900">{overview?.totalQuizAttempts || 0}</p>
          </div>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-600" />
                <h3 className="font-bold text-base text-dark-900">Module Completion Rates</h3>
              </div>
              <span className="text-xs text-dark-500 font-medium">% of enrolled students</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moduleChartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} />
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Completion Rate']} />
                  <Bar dataKey="completionRate" fill="#4F46E5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-base text-dark-900">Top Misconceptions</h3>
              </div>
              <span className="text-xs text-dark-500 font-medium">Flagged occurrences</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={misconceptionChartData} layout="vertical" margin={{ top: 5, right: 30, left: 30, bottom: 5 }}>
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" radius={[0, 4, 4, 0]}>
                    {misconceptionChartData.map((_, idx) => (
                      <Cell key={idx} fill={idx < 3 ? '#EF4444' : '#F59E0B'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* MISCONCEPTIONS TAB */}
      {activeTab === 'misconceptions' && misconceptions && (
        <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-dark-900">Per-Question Misconception Details</h3>
            <span className="text-xs text-dark-500">{misconceptions.byQuestion.length} questions flagged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dark-200 text-dark-500 text-left">
                  <th className="py-2.5 pr-4 font-semibold">Module</th>
                  <th className="py-2.5 pr-4 font-semibold">Question ID</th>
                  <th className="py-2.5 pr-4 font-semibold">Misconception Tag</th>
                  <th className="py-2.5 font-semibold text-right">Occurrences</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {misconceptions.byQuestion.map((q, idx) => (
                  <tr key={idx} className="hover:bg-dark-50/50">
                    <td className="py-2.5 pr-4 font-medium text-dark-800">
                      {MODULE_LABELS[q.moduleSlug] || q.moduleSlug}
                    </td>
                    <td className="py-2.5 pr-4 font-mono text-dark-600">{q.questionId}</td>
                    <td className="py-2.5 pr-4">
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-mono text-[11px] border border-amber-200">
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

      {/* STUDENTS ROSTER TAB */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-600" />
                <h3 className="font-bold text-base text-dark-900">Student Roster & AI Analytics</h3>
              </div>

              {/* Mapped vs All Filter Toggle */}
              <div className="inline-flex rounded-xl border border-dark-200 p-0.5 bg-dark-50 text-xs font-semibold">
                <button
                  onClick={() => setScope('mapped')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    scope === 'mapped' ? 'bg-white text-primary-700 shadow-2xs' : 'text-dark-600 hover:text-dark-900'
                  }`}
                >
                  My Mapped Cohort
                </button>
                <button
                  onClick={() => setScope('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors ${
                    scope === 'all' ? 'bg-white text-primary-700 shadow-2xs' : 'text-dark-600 hover:text-dark-900'
                  }`}
                >
                  All Students
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-dark-200 text-xs text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <button
                onClick={handleOpenMappingModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold border border-primary-200 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add / Map</span>
              </button>
            </div>
          </div>

          {filteredStudents.length === 0 ? (
            <div className="p-8 text-center bg-dark-50 rounded-2xl border border-dark-200 space-y-3">
              <Users className="w-8 h-8 text-dark-400 mx-auto" />
              <h4 className="font-bold text-sm text-dark-700">No Students in this View</h4>
              <p className="text-xs text-dark-500 max-w-sm mx-auto">
                {scope === 'mapped'
                  ? 'You do not have any students mapped to your class yet. Click "Add / Map" to assign existing students or create new student accounts.'
                  : 'No student accounts found. Click "Seed Demo Cohort" to populate test data.'}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={handleOpenMappingModal}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Map Students Now</span>
                </button>
                <button
                  onClick={handleSeedCohort}
                  disabled={isSeeding}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dark-200 hover:bg-dark-100 text-dark-700 font-semibold text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                  <span>Seed Demo Cohort</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-dark-200 text-dark-500 text-left">
                    <th className="py-2.5 pr-4 font-semibold">Student</th>
                    <th className="py-2.5 pr-4 font-semibold">Email</th>
                    <th className="py-2.5 pr-4 font-semibold text-center">AI Invocations</th>
                    <th className="py-2.5 pr-4 font-semibold text-center">Solve Breakdown (Self vs AI)</th>
                    <th className="py-2.5 pr-4 font-semibold text-center">Modules</th>
                    <th className="py-2.5 pr-4 font-semibold text-center">Avg Score</th>
                    <th className="py-2.5 pr-4 font-semibold text-center">Misconceptions</th>
                    <th className="py-2.5 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-dark-50/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedStudent(s)}
                    >
                      <td className="py-3 pr-4 font-bold text-dark-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[11px]">
                          {s.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span>{s.name}</span>
                          {s.isMapped && (
                            <span className="ml-1.5 text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                              Mapped
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 pr-4 text-dark-600 font-mono text-[11px]">{s.email}</td>

                      {/* AI Invocations Count */}
                      <td className="py-3 pr-4 text-center">
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Bot className="w-3.5 h-3.5 text-amber-600" />
                          <span>{s.aiUsageCount}</span>
                        </span>
                      </td>

                      {/* Solve Breakdown Percentage */}
                      <td className="py-3 pr-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1 w-32">
                          <div className="flex justify-between w-full text-[10px] font-semibold text-dark-600">
                            <span className="text-emerald-700">{s.percentWithoutHelp}% Self</span>
                            <span className="text-indigo-700">{s.percentWithHelp}% AI</span>
                          </div>
                          <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden flex">
                            <div
                              style={{ width: `${s.percentWithoutHelp}%` }}
                              className="bg-emerald-500 h-full"
                              title={`${s.percentWithoutHelp}% Independent solves`}
                            />
                            <div
                              style={{ width: `${s.percentWithHelp}%` }}
                              className="bg-indigo-500 h-full"
                              title={`${s.percentWithHelp}% AI assisted solves`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 pr-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-dark-100 text-dark-700 text-[11px] font-semibold">
                          {s.completedModules}/{s.totalModules}
                        </span>
                      </td>

                      <td className="py-3 pr-4 text-center font-bold text-dark-900">
                        {s.averageScore}%
                      </td>

                      <td className="py-3 pr-4 text-center">
                        {s.activeMisconceptions > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                            <AlertTriangle className="w-3 h-3" />
                            {s.activeMisconceptions}
                          </span>
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                        )}
                      </td>

                      <td className="py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStudent(s);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-700 text-[11px] font-bold border border-primary-200 transition-colors"
                        >
                          Deep Dive
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* STUDENT DEEP-DIVE MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative bg-white rounded-3xl border border-dark-200 shadow-2xl w-full max-w-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedStudent(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-dark-400 hover:text-dark-700 hover:bg-dark-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-lg font-bold shadow-md shadow-primary-500/20">
                {selectedStudent.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-bold text-dark-900">{selectedStudent.name}</h2>
                <p className="text-xs text-dark-500 font-mono">{selectedStudent.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                    🔥 {selectedStudent.streakDays} Day Streak
                  </span>
                  <span className="text-[10px] text-dark-400">
                    Joined {new Date(selectedStudent.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Usage & Problem Solving Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-dark-50 to-primary-50/30 border border-dark-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary-600" />
                  <h3 className="text-xs font-bold text-dark-900 uppercase tracking-wider">
                    AI Assistance & Problem-Solving Ratio
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-primary-700">
                  {selectedStudent.aiUsageCount} Total AI Invocations
                </span>
              </div>

              {/* Progress visual bar */}
              <div className="space-y-1.5">
                <div className="w-full h-4 bg-dark-200 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${selectedStudent.percentWithoutHelp}%` }}
                    className="bg-emerald-500 h-full transition-all"
                  />
                  <div
                    style={{ width: `${selectedStudent.percentWithHelp}%` }}
                    className="bg-indigo-500 h-full transition-all"
                  />
                </div>

                <div className="flex justify-between items-center text-xs font-semibold pt-1">
                  <span className="text-emerald-800 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    Independent (Without Help): {selectedStudent.percentWithoutHelp}% ({selectedStudent.solvesWithoutHelp} solves)
                  </span>
                  <span className="text-indigo-800 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
                    AI-Assisted (With Help): {selectedStudent.percentWithHelp}% ({selectedStudent.solvesWithHelp} solves)
                  </span>
                </div>
              </div>
            </div>

            {/* Modules Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-dark-700 uppercase tracking-wider">Curriculum Mastery</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {Object.entries(MODULE_LABELS).map(([slug, label]) => {
                  const mod = selectedStudent.moduleProgress?.find((m) => m.moduleSlug === slug);
                  const isDone = mod?.isCompleted || false;
                  const score = mod?.masteryScore || 0;
                  return (
                    <div key={slug} className="p-3 rounded-xl border border-dark-200 bg-white space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-dark-900">{label}</span>
                        {isDone ? (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            Done ({Math.round(score)}%)
                          </span>
                        ) : (
                          <span className="text-[10px] text-dark-400">In Progress</span>
                        )}
                      </div>
                      <div className="w-full bg-dark-100 h-1.5 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${score}%` }}
                          className={`h-full ${isDone ? 'bg-emerald-500' : 'bg-primary-500'}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Flagged Misconceptions */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-dark-700 uppercase tracking-wider">
                Flagged Misconceptions ({selectedStudent.activeMisconceptions})
              </h3>
              {(!selectedStudent.misconceptionList || selectedStudent.misconceptionList.length === 0) ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Clean conceptual reasoning. No active misconceptions flagged for this student!</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {selectedStudent.misconceptionList.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-mono font-bold text-amber-900">{m.misconceptionTag}</span>
                      <span className="text-amber-700 text-[11px]">Flagged {m.occurrenceCount}x</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-dark-100 flex items-center justify-between">
              {selectedStudent.isMapped ? (
                <button
                  onClick={() => {
                    handleUnmapStudent(selectedStudent.id);
                    setSelectedStudent(null);
                  }}
                  className="px-3 py-1.5 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-semibold"
                >
                  Unmap from Class
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleMapStudent(selectedStudent.id);
                    setSelectedStudent(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold"
                >
                  Map to My Class
                </button>
              )}

              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-2 rounded-xl bg-dark-900 text-white font-semibold text-xs hover:bg-dark-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAP / ADD STUDENT MODAL */}
      {showMappingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative bg-white rounded-3xl border border-dark-200 shadow-2xl w-full max-w-xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <button
              onClick={() => {
                setShowMappingModal(false);
                setMappingMsg(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-dark-400 hover:text-dark-700 hover:bg-dark-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                Class Cohort Management
              </span>
              <h2 className="text-lg font-bold text-dark-900 mt-1">Map Students to Your Class</h2>
              <p className="text-xs text-dark-500">
                Assign students to view their full performance statistics, AI usage metrics, and progress.
              </p>
            </div>

            {/* Notification alert */}
            {mappingMsg && (
              <div
                className={`p-3 rounded-xl text-xs font-medium ${
                  mappingMsg.isError
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                }`}
              >
                {mappingMsg.text}
              </div>
            )}

            {/* Tabs: Select Existing vs Create New */}
            <div className="flex rounded-xl bg-dark-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMappingTab('select')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mappingTab === 'select' ? 'bg-white text-dark-900 shadow-xs' : 'text-dark-600 hover:text-dark-900'
                }`}
              >
                Select Existing Students ({mappingData?.availableStudents?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setMappingTab('new')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  mappingTab === 'new' ? 'bg-white text-dark-900 shadow-xs' : 'text-dark-600 hover:text-dark-900'
                }`}
              >
                Enroll New Student
              </button>
            </div>

            {/* Tab Content */}
            {mappingTab === 'select' ? (
              <div className="flex-1 overflow-y-auto divide-y divide-dark-100 pr-1 space-y-1">
                {isLoadingMapping ? (
                  <div className="py-8 text-center text-dark-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    <span>Loading available students...</span>
                  </div>
                ) : !mappingData?.availableStudents || mappingData.availableStudents.length === 0 ? (
                  <div className="p-6 text-center text-dark-500 space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto" />
                    <p className="font-semibold text-xs text-dark-800">All registered students are already mapped!</p>
                    <p className="text-[11px] text-dark-400">You can enroll a new student using the "Enroll New Student" tab above.</p>
                  </div>
                ) : (
                  mappingData.availableStudents.map((st) => (
                    <div
                      key={st.id}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-dark-50 rounded-xl transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-dark-900">{st.name}</p>
                        <p className="text-[11px] text-dark-500 font-mono">{st.email}</p>
                      </div>
                      <button
                        onClick={() => handleMapStudent(st.id)}
                        className="px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors shadow-2xs"
                      >
                        + Add to Class
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <form onSubmit={handleCreateAndMapStudent} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-dark-700 block">Student Full Name</label>
                  <input
                    type="text"
                    required
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="e.g. Richard Feynman"
                    className="w-full px-3.5 py-2 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-dark-700 block">Student Email</label>
                  <input
                    type="email"
                    required
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full px-3.5 py-2 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-dark-700 block">Password</label>
                  <input
                    type="password"
                    required
                    value={newStudentPassword}
                    onChange={(e) => setNewStudentPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Create & Map to Class
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-dark-100 text-right">
              <button
                onClick={() => {
                  setShowMappingModal(false);
                  setMappingMsg(null);
                }}
                className="px-4 py-2 rounded-xl bg-dark-900 text-white font-semibold text-xs hover:bg-dark-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
