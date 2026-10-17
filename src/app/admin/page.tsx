'use client';

import React, { useState, useEffect } from 'react';
import { useStudentContext } from '@/lib/student-context';
import Link from 'next/link';
import {
  ShieldCheck,
  UserPlus,
  Users,
  GraduationCap,
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Bot,
  Flame,
  LayoutDashboard,
  ExternalLink,
  BookOpen,
  History,
  Clock,
  Filter,
  RefreshCw,
  CheckCircle,
  HelpCircle,
  UserCheck,
  Crown,
  Calendar,
  Edit3
} from 'lucide-react';
import { getPlanExpiryInfo } from '@/lib/subscription-utils';

export interface AdminHistoryItem {
  id: string;
  timestamp: string;
  category: 'learning' | 'auth';
  type: 'quiz_attempt' | 'practice_submission' | 'ai_interaction' | 'user_registration' | 'user_login';
  userName: string;
  userEmail: string;
  role: string;
  title: string;
  details: string;
  badge: {
    label: string;
    variant: 'emerald' | 'indigo' | 'amber' | 'blue' | 'purple';
  };
}

interface InstructorData {
  id: string;
  name: string;
  email: string;
  isPremium?: boolean;
  planType?: string;
  premiumExpiresAt?: string | null;
  createdAt: string;
  lastActiveAt: string;
  assignedStudentCount: number;
  assignedStudents: Array<{ id: string; name: string; email: string }>;
}

interface StudentData {
  id: string;
  name: string;
  email: string;
  streakDays: number;
  isPremium?: boolean;
  planType?: string;
  premiumExpiresAt?: string | null;
  createdAt: string;
  lastActiveAt: string;
  assignedInstructors: Array<{ id: string; name: string; email: string }>;
  isAssigned: boolean;
  activityCount: number;
  aiInteractionCount: number;
}

export default function AdminPortalPage() {
  const { isAdmin, isInstructor, openLoginModal, isLoading: isAuthLoading } = useStudentContext();

  const [instructors, setInstructors] = useState<InstructorData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [totalMappings, setTotalMappings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // History Log State (on-demand database history, zero live polling)
  const [historyItems, setHistoryItems] = useState<AdminHistoryItem[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<'all' | 'learning' | 'auth'>('all');

  const [activeTab, setActiveTab] = useState<'instructors' | 'students' | 'history'>('instructors');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<'instructor' | 'student' | null>(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formInstructorId, setFormInstructorId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // Subscription Edit Modal for Students & Instructors
  const [editingUserSub, setEditingUserSub] = useState<{ id: string; name: string; email: string; isPremium?: boolean; planType?: string; premiumExpiresAt?: string | null } | null>(null);
  const [subPlanType, setSubPlanType] = useState<string>('FREE');
  const [subExpiresAt, setSubExpiresAt] = useState<string>('');
  const [subModalError, setSubModalError] = useState<string | null>(null);
  const [subModalSuccess, setSubModalSuccess] = useState<string | null>(null);
  const [isUpdatingSub, setIsUpdatingSub] = useState(false);

  // Mapping Modal
  const [mappingInstructor, setMappingInstructor] = useState<InstructorData | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (!res.ok) {
        throw new Error('Failed to load administrative user directory.');
      }
      const data = await res.json();
      setInstructors(data.instructors || []);
      setStudents(data.students || []);
      setTotalMappings(data.totalMappings || 0);
    } catch (err: any) {
      setError(err?.message || 'Error fetching users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch('/api/admin/history');
      if (res.ok) {
        const data = await res.json();
        setHistoryItems(data.history || []);
      }
    } catch (err) {
      console.error('Error fetching admin history:', err);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthLoading) return;
    if (isAdmin) {
      fetchUsers();
      fetchHistory(); // Loads once on-demand, zero live polling/heartbeat loops
    } else {
      setIsLoading(false);
    }
  }, [isAdmin, isAuthLoading]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          email: formEmail,
          password: formPassword,
          role: showCreateModal === 'instructor' ? 'EDUCATOR' : 'STUDENT',
          mapToInstructorId: formInstructorId || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      setModalSuccess(`Successfully created ${showCreateModal}: ${formName}`);
      setFormName('');
      setFormEmail('');
      setFormPassword('');
      setFormInstructorId('');
      await fetchUsers();
      setTimeout(() => {
        setShowCreateModal(null);
        setModalSuccess(null);
      }, 1200);
    } catch (err: any) {
      setModalError(err.message || 'Creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAssignment = async (instructorId: string, studentId: string, isCurrentlyAssigned: boolean) => {
    try {
      const res = await fetch('/api/admin/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isCurrentlyAssigned ? 'unassign' : 'assign',
          instructorId,
          studentId,
        }),
      });

      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error('Failed to update assignment:', err);
    }
  };

  const handleOpenEditSub = (user: { id: string; name: string; email: string; isPremium?: boolean; planType?: string; premiumExpiresAt?: string | null }) => {
    setEditingUserSub(user);
    setSubPlanType(user.isPremium ? 'PRO' : 'FREE');
    // Format YYYY-MM-DD for date input
    if (user.premiumExpiresAt) {
      const d = new Date(user.premiumExpiresAt);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        setSubExpiresAt(`${year}-${month}-${day}`);
      } else {
        setSubExpiresAt('');
      }
    } else {
      setSubExpiresAt('');
    }
    setSubModalError(null);
    setSubModalSuccess(null);
  };

  const handleSaveSubscription = async () => {
    if (!editingUserSub) return;
    setIsUpdatingSub(true);
    setSubModalError(null);
    setSubModalSuccess(null);

    try {
      let finalExpiresAt: string | null = null;
      if (subPlanType !== 'FREE') {
        if (subExpiresAt) {
          // Set to end of day in local time
          const parsed = new Date(`${subExpiresAt}T23:59:59`);
          if (isNaN(parsed.getTime())) {
            throw new Error('Please enter a valid expiration date.');
          }
          finalExpiresAt = parsed.toISOString();
        } else {
          // Default: 1 month from now
          const now = new Date();
          now.setMonth(now.getMonth() + 1);
          finalExpiresAt = now.toISOString();
        }
      }

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingUserSub.id,
          planType: subPlanType === 'FREE' ? 'FREE' : 'PRO',
          isPremium: subPlanType !== 'FREE',
          premiumExpiresAt: finalExpiresAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update subscription.');
      }

      setSubModalSuccess(`Subscription updated for ${editingUserSub.name}!`);
      await fetchUsers();
      setTimeout(() => {
        setEditingUserSub(null);
        setSubModalSuccess(null);
      }, 1000);
    } catch (err: any) {
      setSubModalError(err.message || 'Error updating subscription.');
    } finally {
      setIsUpdatingSub(false);
    }
  };

  if (isAuthLoading || (isLoading && isAdmin)) {
    return (
      <div className="w-full mx-auto px-8 py-16 flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
        <p className="text-sm text-dark-500 font-medium">Loading administrative workspace...</p>
      </div>
    );
  }

  // Admin Access Guard
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-200 shadow-xs">
          <ShieldCheck className="w-8 h-8 text-purple-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-dark-900">Administrator Access Required</h1>
          <p className="text-sm text-dark-600 max-w-md mx-auto">
            This management console is restricted to system administrators (`admin@quanbit.com`). Please sign in with an authorized administrator account to manage instructors and cohorts.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => openLoginModal()}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-colors shadow-xs"
          >
            Sign In as Admin
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

  const filteredInstructors = instructors.filter(
    (i) =>
      i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = historyItems.filter((h) => {
    const matchesSearch =
      h.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.details.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = historyCategoryFilter === 'all' || h.category === historyCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalAICalls = students.reduce((acc, s) => acc + s.aiInteractionCount, 0);

  return (
    <>
      <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 pb-24 md:pb-6 space-y-3.5 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              System Administration
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-dark-900">
            User & Cohort Management
          </h1>
          <p className="text-xs sm:text-sm text-dark-600 mt-0.5">
            Provision instructors, enroll students, and map students to assigned faculty rosters.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setShowCreateModal('instructor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Add Instructor</span>
          </button>

          <button
            onClick={() => setShowCreateModal('student')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Student</span>
          </button>

          <Link
            href="/instructor"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dark-200 bg-dark-50 hover:bg-dark-100 text-dark-700 text-xs font-semibold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-primary-600" />
            <span>Open Instructor Portal</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">Instructors</span>
            <p className="text-xl font-bold text-dark-900">{instructors.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">Students</span>
            <p className="text-xl font-bold text-dark-900">{students.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">Class Mappings</span>
            <p className="text-xl font-bold text-dark-900">{totalMappings}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-dark-500 font-medium">AI Interactions</span>
            <p className="text-xl font-bold text-dark-900">{totalAICalls}</p>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
        {/* Sub-Header / Search / Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-100">
          <div className="inline-flex rounded-xl border border-dark-200 p-1 bg-dark-50 text-xs font-semibold flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('instructors')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'instructors'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
              <span>Instructors ({instructors.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'students'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-primary-600" />
              <span>Students ({students.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-indigo-600" />
              <span>Activity & Login History ({historyItems.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-dark-200 text-xs text-dark-900 placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* INSTRUCTORS VIEW */}
        {activeTab === 'instructors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dark-200 text-dark-500 text-left">
                  <th className="py-2.5 pr-4 font-semibold">Instructor</th>
                  <th className="py-2.5 pr-4 font-semibold">Email</th>
                  <th className="py-2.5 pr-4 font-semibold">Subscription Plan</th>
                  <th className="py-2.5 pr-4 font-semibold">Mapped Students</th>
                  <th className="py-2.5 pr-4 font-semibold">Registered</th>
                  <th className="py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filteredInstructors.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-dark-500">
                      No instructors match your query.
                    </td>
                  </tr>
                ) : (
                  filteredInstructors.map((inst) => {
                    const expiry = getPlanExpiryInfo(inst.premiumExpiresAt);
                    return (
                      <tr key={inst.id} className="hover:bg-dark-50/50 transition-colors">
                        <td className="py-3 pr-4 font-bold text-dark-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">
                            {inst.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{inst.name}</span>
                        </td>
                        <td className="py-3 pr-4 text-dark-600 font-mono text-[11px]">{inst.email}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-col gap-1 items-start">
                            <div className="flex items-center gap-1.5">
                              {inst.isPremium ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                                  <Crown className="w-3 h-3 text-amber-600 fill-amber-400" />
                                  <span>Pro</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-dark-100 text-dark-600 font-medium text-[10px]">
                                  Free
                                </span>
                              )}
                              <button
                                onClick={() => handleOpenEditSub(inst)}
                                title="Edit Plan & Expiration Date"
                                className="p-1 rounded hover:bg-dark-100 text-dark-500 hover:text-dark-900 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                            {inst.isPremium && expiry && (
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                expiry.isUrgent
                                  ? 'bg-rose-100 text-rose-700 font-bold animate-pulse'
                                  : 'text-dark-500'
                              }`}>
                                {expiry.badgeText}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-[11px] border border-purple-100">
                              {inst.assignedStudentCount} Students
                            </span>
                            {inst.assignedStudents.slice(0, 3).map((st) => (
                              <span
                                key={st.id}
                                className="px-1.5 py-0.5 rounded bg-dark-100 text-dark-700 text-[10px]"
                              >
                                {st.name.split(' ')[0]}
                              </span>
                            ))}
                            {inst.assignedStudentCount > 3 && (
                              <span className="text-[10px] text-dark-400">+{inst.assignedStudentCount - 3}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-dark-500 text-[11px]">
                          {new Date(inst.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditSub(inst)}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>Plan</span>
                            </button>
                            <button
                              onClick={() => setMappingInstructor(inst)}
                              className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] border border-purple-200 transition-colors"
                            >
                              Cohort
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* STUDENTS VIEW */}
        {activeTab === 'students' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dark-200 text-dark-500 text-left">
                  <th className="py-2.5 pr-4 font-semibold">Student</th>
                  <th className="py-2.5 pr-4 font-semibold">Email</th>
                  <th className="py-2.5 pr-4 font-semibold">Subscription Plan</th>
                  <th className="py-2.5 pr-4 font-semibold">Assigned Faculty</th>
                  <th className="py-2.5 pr-4 font-semibold text-center">AI Queries</th>
                  <th className="py-2.5 pr-4 font-semibold text-center">Streak</th>
                  <th className="py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-dark-500">
                      No students match your query.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => {
                    const expiry = getPlanExpiryInfo(st.premiumExpiresAt);
                    return (
                      <tr key={st.id} className="hover:bg-dark-50/50 transition-colors">
                        <td className="py-3 pr-4 font-bold text-dark-900 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[11px]">
                            {st.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{st.name}</span>
                        </td>
                        <td className="py-3 pr-4 text-dark-600 font-mono text-[11px]">{st.email}</td>
                        <td className="py-3 pr-4">
                          <div className="flex flex-col gap-1 items-start">
                            <div className="flex items-center gap-1.5">
                              {st.isPremium ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300">
                                  <Crown className="w-3 h-3 text-amber-600 fill-amber-400" />
                                  <span>Pro</span>
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-dark-100 text-dark-600 font-medium text-[10px]">
                                  Free
                                </span>
                              )}
                              <button
                                onClick={() => handleOpenEditSub(st)}
                                title="Edit Plan & Expiration Date"
                                className="p-1 rounded hover:bg-dark-100 text-dark-500 hover:text-dark-900 transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                            {st.isPremium && expiry && (
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                                expiry.isUrgent
                                  ? 'bg-rose-100 text-rose-700 font-bold animate-pulse'
                                  : 'text-dark-500'
                              }`}>
                                {expiry.badgeText}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          {st.assignedInstructors.length === 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-dark-100 text-dark-500 text-[10px]">
                              Unassigned
                            </span>
                          ) : (
                            <div className="flex gap-1 flex-wrap">
                              {st.assignedInstructors.map((inst) => (
                                <span
                                  key={inst.id}
                                  className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200"
                                >
                                  {inst.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-center">
                          <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            <Bot className="w-3 h-3" />
                            {st.aiInteractionCount}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-center font-bold text-dark-700">
                          {st.streakDays}d
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditSub(st)}
                              className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] border border-amber-200 transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>Plan</span>
                            </button>
                            <select
                              className="bg-dark-50 border border-dark-200 text-dark-800 rounded-lg px-2 py-1 text-[11px] cursor-pointer"
                              value={st.assignedInstructors[0]?.id || ''}
                              onChange={(e) => {
                                const newInstId = e.target.value;
                                if (newInstId) {
                                  handleToggleAssignment(newInstId, st.id, false);
                                }
                              }}
                            >
                              <option value="">-- Faculty --</option>
                              {instructors.map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ACTIVITY & LOGIN HISTORY VIEW (DATABASE-BACKED, LATEST ON TOP) */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter pills and manual refresh */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-dark-50 border border-dark-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-dark-500 uppercase tracking-wider mr-1">
                  Filter Category:
                </span>
                <button
                  onClick={() => setHistoryCategoryFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    historyCategoryFilter === 'all'
                      ? 'bg-dark-900 text-white shadow-xs'
                      : 'bg-white border border-dark-200 text-dark-700 hover:bg-dark-100'
                  }`}
                >
                  All History ({historyItems.length})
                </button>
                <button
                  onClick={() => setHistoryCategoryFilter('learning')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    historyCategoryFilter === 'learning'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white border border-dark-200 text-dark-700 hover:bg-dark-100'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Student Learning ({historyItems.filter((h) => h.category === 'learning').length})</span>
                </button>
                <button
                  onClick={() => setHistoryCategoryFilter('auth')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                    historyCategoryFilter === 'auth'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-dark-200 text-dark-700 hover:bg-dark-100'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5 text-indigo-300" />
                  <span>Logins & Accounts ({historyItems.filter((h) => h.category === 'auth').length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-dark-500">
                <button
                  onClick={fetchHistory}
                  disabled={isHistoryLoading}
                  title="Reload History"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-dark-200 bg-white hover:bg-dark-100 text-dark-700 font-medium transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${isHistoryLoading ? 'animate-spin text-primary-600' : ''}`} />
                  <span>Refresh Log</span>
                </button>
                <span className="hidden sm:inline font-mono">• Latest on top</span>
              </div>
            </div>

            {/* History Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-dark-200 text-dark-500 text-left">
                    <th className="py-2.5 pr-4 font-semibold">Date & Time</th>
                    <th className="py-2.5 pr-4 font-semibold">User / Email</th>
                    <th className="py-2.5 pr-4 font-semibold">Role</th>
                    <th className="py-2.5 pr-4 font-semibold">Activity</th>
                    <th className="py-2.5 pr-4 font-semibold">Details</th>
                    <th className="py-2.5 text-right font-semibold">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-dark-400 font-medium">
                        No activity or login history found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((item) => {
                      const dateObj = new Date(item.timestamp);
                      const formattedDate = dateObj.toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      });
                      const formattedTime = dateObj.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      });

                      return (
                        <tr key={item.id} className="hover:bg-dark-50/50 transition-colors">
                          <td className="py-3 pr-4 font-mono text-[11px] text-dark-600 whitespace-nowrap">
                            <div className="font-bold text-dark-900">{formattedTime}</div>
                            <div className="text-[10px] text-dark-400">{formattedDate}</div>
                          </td>

                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                                  item.role === 'ADMIN'
                                    ? 'bg-purple-100 text-purple-700'
                                    : item.role === 'EDUCATOR'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-primary-100 text-primary-700'
                                }`}
                              >
                                {item.userName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-dark-900 leading-tight">{item.userName}</p>
                                <p className="text-[11px] text-dark-500 font-mono">{item.userEmail}</p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 pr-4">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                                item.role === 'ADMIN'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : item.role === 'EDUCATOR'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : 'bg-dark-100 text-dark-700'
                              }`}
                            >
                              {item.role}
                            </span>
                          </td>

                          <td className="py-3 pr-4 font-bold text-dark-800">
                            {item.title}
                          </td>

                          <td className="py-3 pr-4 text-dark-600 text-[11px]">
                            {item.details}
                          </td>

                          <td className="py-3 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                item.badge.variant === 'emerald'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : item.badge.variant === 'indigo'
                                  ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
                                  : item.badge.variant === 'purple'
                                  ? 'bg-purple-50 text-purple-800 border-purple-200'
                                  : item.badge.variant === 'amber'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-blue-50 text-blue-800 border-blue-200'
                              }`}
                            >
                              {item.badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 !m-0 !top-0 !left-0 !right-0 !bottom-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative bg-white rounded-2xl border border-dark-200 shadow-2xl w-full max-w-md p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-dark-100">
              <div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  {showCreateModal === 'instructor' ? 'Faculty Provisioning' : 'Student Enrollment'}
                </span>
                <h2 className="text-lg font-bold text-dark-900 mt-1">
                  {showCreateModal === 'instructor' ? 'Create Instructor Account' : 'Enroll New Student'}
                </h2>
                <p className="text-xs text-dark-500">
                  Generate credentials for login. Passwords must be at least 6 characters.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowCreateModal(null);
                  setModalError(null);
                  setModalSuccess(null);
                }}
                aria-label="Close creation modal"
                className="w-8 h-8 rounded-xl bg-dark-100 hover:bg-dark-200 text-dark-500 hover:text-dark-800 flex items-center justify-center transition-colors cursor-pointer shrink-0 self-start"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {modalError}
              </div>
            )}
            {modalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                {modalSuccess}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-dark-700 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder={showCreateModal === 'instructor' ? 'Dr. Richard Feynman' : 'Alex Mercer'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-dark-700 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder={showCreateModal === 'instructor' ? 'feynman@university.edu' : 'alex@student.edu'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-dark-700 block">Password</label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>

              {showCreateModal === 'student' && instructors.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-dark-700 block">Initial Instructor (Optional)</label>
                  <select
                    value={formInstructorId}
                    onChange={(e) => setFormInstructorId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-dark-200 text-xs text-dark-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="">-- Do not assign yet --</option>
                    {instructors.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Create {showCreateModal === 'instructor' ? 'Instructor' : 'Student'}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MANAGE COHORT MODAL */}
      {mappingInstructor && (
        <div className="fixed inset-0 !m-0 !top-0 !left-0 !right-0 !bottom-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative bg-white rounded-3xl border border-dark-200 shadow-2xl w-full max-w-xl p-6 space-y-4 max-h-[85vh] flex flex-col">
            <button
              onClick={() => setMappingInstructor(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-dark-400 hover:text-dark-700 hover:bg-dark-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                Cohort Assignment
              </span>
              <h2 className="text-lg font-bold text-dark-900 mt-1">
                Manage Students for {mappingInstructor.name}
              </h2>
              <p className="text-xs text-dark-500">
                Check or uncheck students to add or remove them from this instructor's class roster.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-dark-100 pr-1 space-y-1">
              {students.length === 0 ? (
                <p className="text-xs text-dark-500 py-4 text-center">No students registered yet.</p>
              ) : (
                students.map((st) => {
                  const isAssigned = mappingInstructor.assignedStudents.some((s) => s.id === st.id);
                  return (
                    <div
                      key={st.id}
                      className="flex items-center justify-between py-2.5 px-2 hover:bg-dark-50 rounded-xl transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-dark-900">{st.name}</p>
                        <p className="text-[11px] text-dark-500 font-mono">{st.email}</p>
                      </div>

                      <button
                        onClick={async () => {
                          await handleToggleAssignment(mappingInstructor.id, st.id, isAssigned);
                          // update local modal view
                          setMappingInstructor((prev) => {
                            if (!prev) return null;
                            const newAssigned = isAssigned
                              ? prev.assignedStudents.filter((s) => s.id !== st.id)
                              : [...prev.assignedStudents, { id: st.id, name: st.name, email: st.email }];
                            return {
                              ...prev,
                              assignedStudentCount: newAssigned.length,
                              assignedStudents: newAssigned,
                            };
                          });
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                          isAssigned
                            ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                        }`}
                      >
                        {isAssigned ? 'Remove' : 'Assign to Class'}
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t border-dark-100 text-right">
              <button
                onClick={() => setMappingInstructor(null)}
                className="px-4 py-2 rounded-xl bg-dark-900 text-white font-semibold text-xs hover:bg-dark-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SUBSCRIPTION & EXPIRATION MODAL (STUDENTS & INSTRUCTORS) */}
      {editingUserSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-dark-200 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-dark-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Crown className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-dark-900">Manage Subscription</h2>
                  <p className="text-xs text-dark-500 font-mono">{editingUserSub.email}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingUserSub(null)}
                className="p-1 rounded-lg hover:bg-dark-100 text-dark-400 hover:text-dark-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subModalError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{subModalError}</span>
              </div>
            )}

            {subModalSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 text-xs border border-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{subModalSuccess}</span>
              </div>
            )}

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-dark-700 mb-1">Select Plan Tier</label>
                <select
                  value={subPlanType}
                  onChange={(e) => {
                    const newPlan = e.target.value;
                    setSubPlanType(newPlan);
                    if (newPlan === 'FREE') {
                      setSubExpiresAt('');
                    } else if (!subExpiresAt) {
                      const now = new Date();
                      now.setMonth(now.getMonth() + 1);
                      const year = now.getFullYear();
                      const month = String(now.getMonth() + 1).padStart(2, '0');
                      const day = String(now.getDate()).padStart(2, '0');
                      setSubExpiresAt(`${year}-${month}-${day}`);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-dark-200 text-dark-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="FREE">Free Tier (No active pro status)</option>
                  <option value="PRO">Pro Plan</option>
                </select>
              </div>

              {subPlanType !== 'FREE' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-dark-700">Expiration Date</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          now.setDate(now.getDate() + 3);
                          const y = now.getFullYear();
                          const m = String(now.getMonth() + 1).padStart(2, '0');
                          const d = String(now.getDate()).padStart(2, '0');
                          setSubExpiresAt(`${y}-${m}-${d}`);
                        }}
                        className="text-[10px] text-amber-700 hover:underline font-bold"
                      >
                        +3 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          now.setMonth(now.getMonth() + 1);
                          const y = now.getFullYear();
                          const m = String(now.getMonth() + 1).padStart(2, '0');
                          const d = String(now.getDate()).padStart(2, '0');
                          setSubExpiresAt(`${y}-${m}-${d}`);
                        }}
                        className="text-[10px] text-primary-600 hover:underline font-bold"
                      >
                        +1 Month
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date();
                          now.setFullYear(now.getFullYear() + 1);
                          const y = now.getFullYear();
                          const m = String(now.getMonth() + 1).padStart(2, '0');
                          const d = String(now.getDate()).padStart(2, '0');
                          setSubExpiresAt(`${y}-${m}-${d}`);
                        }}
                        className="text-[10px] text-primary-600 hover:underline font-bold"
                      >
                        +1 Year
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      value={subExpiresAt}
                      onChange={(e) => setSubExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-dark-200 text-dark-900 font-mono bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-dark-500 mt-1">
                    After this date, the user will be automatically downgraded to the Free tier. If fewer than 3 days remain, an urgent alert countdown will be displayed.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-dark-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingUserSub(null)}
                className="px-4 py-2 rounded-xl border border-dark-200 text-dark-700 font-semibold text-xs hover:bg-dark-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveSubscription}
                disabled={isUpdatingSub}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isUpdatingSub ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
