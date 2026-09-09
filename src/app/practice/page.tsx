'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PRACTICE_PROBLEMS, ProblemDifficulty, PracticeProblem } from '@/lib/practice-problems';
import { MathRenderer } from '@/components/math/MathRenderer';
import {
  Terminal,
  Search,
  CheckCircle2,
  Clock,
  Circle,
  ArrowRight,
  Filter,
  Trophy,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';

import { useStudentContext } from '@/lib/student-context';

export default function PracticeListPage() {
  const { userId } = useStudentContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [attemptedIds, setAttemptedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      if (!userId) {
        setSolvedIds([]);
        setAttemptedIds([]);
        return;
      }
      const solved = JSON.parse(localStorage.getItem('ql_practice_solved') || '[]');
      const attempted = JSON.parse(localStorage.getItem('ql_practice_attempted') || '[]');
      setSolvedIds(solved);
      setAttemptedIds(attempted);
    } catch {
      setSolvedIds([]);
      setAttemptedIds([]);
    }
  }, [userId]);

  const categories = ['All', ...Array.from(new Set(PRACTICE_PROBLEMS.map((p) => p.category)))];

  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDifficulty = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const getStatus = (id: string) => {
    if (solvedIds.includes(id)) return 'SOLVED';
    if (attemptedIds.includes(id)) return 'ATTEMPTED';
    return 'UNSOLVED';
  };

  const solvedCount = solvedIds.length;
  const totalCount = PRACTICE_PROBLEMS.length;

  return (
    <div className="w-full mx-auto px-8 py-3 space-y-3.5 animate-fadeIn">
      {/* Hero Header */}
      <div className="bg-white rounded-2xl border border-dark-200 p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Strict Judge Arena — Zero AI Hints
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-dark-100 text-dark-700">
                LeetCode Style
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark-900 tracking-tight">
              Quantum Circuit Practice Problems
            </h1>
            <p className="text-xs sm:text-sm text-dark-600 leading-normal">
              Solve circuit construction challenges under strict automated verification. Your circuits are graded directly against statevector fidelity and measurement probability thresholds.
            </p>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-dark-900 text-white rounded-xl p-4 min-w-[180px] border border-dark-800 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs text-dark-400">
              <span>Solved Progress</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {solvedCount} <span className="text-xs font-normal text-dark-400">/ {totalCount}</span>
            </div>
            <div className="w-full bg-dark-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(solvedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-dark-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-dark-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, topics, or gate sets..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-dark-50 border border-dark-200 text-xs text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center gap-1 bg-dark-100 p-1 rounded-xl border border-dark-200 text-xs">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                selectedDifficulty === diff
                  ? 'bg-white text-dark-900 shadow-xs'
                  : 'text-dark-600 hover:text-dark-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 text-xs text-dark-600">
          <Filter className="w-3.5 h-3.5 text-dark-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-dark-50 border border-dark-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-dark-900 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem List Table */}
      <div className="bg-white rounded-3xl border border-dark-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-dark-200 bg-dark-50/50 text-dark-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-5 w-12 text-center">Status</th>
                <th className="py-3.5 px-5">Problem</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-center">Difficulty</th>
                <th className="py-3.5 px-4 text-center">Qubits</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100">
              {filteredProblems.map((prob) => {
                const status = getStatus(prob.id);
                return (
                  <tr key={prob.id} className="hover:bg-dark-50/60 transition-colors group">
                    {/* Status Icon */}
                    <td className="py-4 px-5 text-center">
                      {status === 'SOLVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : status === 'ATTEMPTED' ? (
                        <Clock className="w-4 h-4 text-amber-500 mx-auto" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-dark-300 mx-auto" />
                      )}
                    </td>

                    {/* Title & Description */}
                    <td className="py-4 px-5">
                      <Link href={`/practice/${prob.id}`} className="block group-hover:text-primary-600 transition-colors">
                        <span className="font-bold text-sm text-dark-900 group-hover:text-primary-600 flex items-center gap-1.5">
                          <MathRenderer text={prob.title} />
                        </span>
                        <div className="text-xs text-dark-500 mt-0.5 line-clamp-1">
                          <MathRenderer text={prob.description} />
                        </div>
                      </Link>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 text-dark-700 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-dark-100 text-dark-700 text-[11px]">
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
                      <Link
                        href={`/practice/${prob.id}`}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all shadow-2xs ${
                          status === 'SOLVED'
                            ? 'bg-dark-100 hover:bg-dark-200 text-dark-800'
                            : 'bg-primary-600 hover:bg-primary-700 text-white'
                        }`}
                      >
                        <span>{status === 'SOLVED' ? 'Review' : 'Solve'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
