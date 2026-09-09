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
  BookOpen
} from 'lucide-react';

interface InstructorData {
  id: string;
  name: string;
  email: string;
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

  const [activeTab, setActiveTab] = useState<'instructors' | 'students'>('instructors');
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

  useEffect(() => {
    if (isAuthLoading) return;
    if (isAdmin) {
      fetchUsers();
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
            This management console is restricted to system administrators (`admin@qlearn.com`). Please sign in with an authorized administrator account to manage instructors and cohorts.
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

  const totalAICalls = students.reduce((acc, s) => acc + s.aiInteractionCount, 0);

  return (
    <div className="w-full mx-auto px-6 sm:px-8 py-4 space-y-4 animate-fadeIn">
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
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
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
            <span className="text-[11px] text-dark-500 font-medium">AI Interactions Logged</span>
            <p className="text-xl font-bold text-dark-900">{totalAICalls}</p>
          </div>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 shadow-xs space-y-4">
        {/* Sub-Header / Search / Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-100">
          <div className="inline-flex rounded-xl border border-dark-200 p-1 bg-dark-50 text-xs font-semibold">
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
          </div>

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

        {/* INSTRUCTORS VIEW */}
        {activeTab === 'instructors' && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dark-200 text-dark-500 text-left">
                  <th className="py-2.5 pr-4 font-semibold">Instructor</th>
                  <th className="py-2.5 pr-4 font-semibold">Email</th>
                  <th className="py-2.5 pr-4 font-semibold">Mapped Students</th>
                  <th className="py-2.5 pr-4 font-semibold">Registered</th>
                  <th className="py-2.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filteredInstructors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-dark-500">
                      No instructors match your query.
                    </td>
                  </tr>
                ) : (
                  filteredInstructors.map((inst) => (
                    <tr key={inst.id} className="hover:bg-dark-50/50 transition-colors">
                      <td className="py-3 pr-4 font-bold text-dark-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[11px]">
                          {inst.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{inst.name}</span>
                      </td>
                      <td className="py-3 pr-4 text-dark-600 font-mono text-[11px]">{inst.email}</td>
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
                        <button
                          onClick={() => setMappingInstructor(inst)}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-[11px] border border-purple-200 transition-colors"
                        >
                          Manage Cohort
                        </button>
                      </td>
                    </tr>
                  ))
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
                  <th className="py-2.5 pr-4 font-semibold">Assigned Faculty</th>
                  <th className="py-2.5 pr-4 font-semibold text-center">AI Queries</th>
                  <th className="py-2.5 pr-4 font-semibold text-center">Streak</th>
                  <th className="py-2.5 text-right font-semibold">Assign Instructor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-dark-500">
                      No students match your query.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((st) => (
                    <tr key={st.id} className="hover:bg-dark-50/50 transition-colors">
                      <td className="py-3 pr-4 font-bold text-dark-900 flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[11px]">
                          {st.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{st.name}</span>
                      </td>
                      <td className="py-3 pr-4 text-dark-600 font-mono text-[11px]">{st.email}</td>
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
                          <option value="">-- Assign Instructor --</option>
                          {instructors.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.name} ({i.email})
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE USER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="relative bg-white rounded-3xl border border-dark-200 shadow-2xl w-full max-w-md p-6 space-y-5">
            <button
              onClick={() => {
                setShowCreateModal(null);
                setModalError(null);
                setModalSuccess(null);
              }}
              className="absolute top-5 right-5 p-2 rounded-xl text-dark-400 hover:text-dark-700 hover:bg-dark-100"
            >
              <X className="w-5 h-5" />
            </button>

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
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
    </div>
  );
}
