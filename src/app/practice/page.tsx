'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  PRACTICE_PROBLEMS,
  ProblemDifficulty,
  PracticeProblem,
  ALGORITHM_OPTIONS,
  AlgorithmSlug
} from '@/lib/practice-problems';
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
  Zap,
  Atom,
  RotateCcw,
  Crown,
} from 'lucide-react';

import { useStudentContext } from '@/lib/student-context';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';

export default function PracticeListPage() {
  const { userId } = useStudentContext();
  const { language } = useAccessibility();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmSlug | 'all'>('all');
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

  const getAlgoCount = (slug: AlgorithmSlug | 'all') => {
    if (slug === 'all') return PRACTICE_PROBLEMS.length;
    return PRACTICE_PROBLEMS.filter((p) => p.algorithms?.includes(slug)).length;
  };

  const getAlgoIcon = (slug: AlgorithmSlug | 'all') => {
    switch (slug) {
      case 'deutsch-jozsa':
        return Atom;
      case 'grover':
        return Sparkles;
      case 'teleportation':
        return Zap;
      case 'superdense-coding':
        return Cpu;
      case 'foundations':
        return Terminal;
      default:
        return Layers;
    }
  };

  const filteredProblems = PRACTICE_PROBLEMS.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.algorithms && p.algorithms.some((a) => a.toLowerCase().includes(q)));

    const isPremium = p.isPremium || p.difficulty === 'Hard';
    const matchesDifficulty =
      selectedDifficulty === 'All'
        ? true
        : selectedDifficulty === 'Premium'
        ? isPremium
        : p.difficulty === selectedDifficulty;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesAlgorithm =
      selectedAlgorithm === 'all' || (p.algorithms && p.algorithms.includes(selectedAlgorithm));

    return matchesSearch && matchesDifficulty && matchesCategory && matchesAlgorithm;
  });

  const getStatus = (id: string) => {
    if (solvedIds.includes(id)) return 'SOLVED';
    if (attemptedIds.includes(id)) return 'ATTEMPTED';
    return 'UNSOLVED';
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('All');
    setSelectedCategory('All');
    setSelectedAlgorithm('all');
  };

  const solvedCount = solvedIds.length;
  const totalCount = PRACTICE_PROBLEMS.length;

  return (
    <div className="w-full mx-auto px-3 sm:px-6 lg:px-8 py-3 pb-24 md:pb-6 space-y-3.5 animate-fadeIn">
      {/* Compact Header */}
      <div className="bg-white rounded-2xl border border-dark-200 px-4 py-3 sm:px-5 sm:py-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <h1 className="text-base sm:text-lg font-bold text-dark-900 tracking-tight">
            {t.practice.title || 'Practice Problems'}
          </h1>
          <p className="text-xs text-dark-500">
            {t.practice.subtitle || 'Build and test quantum circuits against strict test cases.'}
          </p>
        </div>

        {/* Compact Solved Progress */}
        <div className="flex items-center gap-3 bg-dark-50 px-3 py-1.5 rounded-xl border border-dark-200">
          <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
          <div className="text-xs font-semibold text-dark-800">
            {t.practice.completed || 'Solved'}: <span className="font-bold text-dark-900">{solvedCount}</span> <span className="text-dark-400">/ {totalCount}</span>
          </div>
          <div className="w-20 bg-dark-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(solvedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Compact Filters Bar with Algorithm Dropdown */}
      <div className="bg-white rounded-2xl border border-dark-200 p-2.5 sm:p-3 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search Input - Expands to fill available space */}
          <div className="relative w-full sm:flex-1 sm:min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-dark-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-dark-50 border border-dark-200 text-xs text-dark-900 placeholder:text-dark-400 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Algorithm Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-dark-600">
            <span className="text-dark-500 font-medium">Algorithm:</span>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as AlgorithmSlug | 'all')}
              className="bg-dark-50 border border-dark-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-dark-900 focus:outline-none cursor-pointer"
            >
              {ALGORITHM_OPTIONS.map((algo) => (
                <option key={algo.slug} value={algo.slug}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-dark-600">
            <span className="text-dark-500 font-medium">Topic:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-dark-50 border border-dark-200 rounded-xl px-2.5 py-1.5 text-xs font-medium text-dark-900 focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Topics' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty & Premium Filter */}
          <div className="flex items-center gap-0.5 bg-dark-100 p-0.5 rounded-xl border border-dark-200 text-xs">
            {['All', 'Easy', 'Medium', 'Hard', 'Premium'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                title={diff === 'Premium' ? 'Premium challenges' : `${diff} difficulty`}
                className={`px-2 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 text-[11px] ${
                  selectedDifficulty === diff
                    ? diff === 'Premium'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-xs'
                      : 'bg-white text-dark-900 shadow-xs'
                    : diff === 'Premium'
                    ? 'text-amber-700 hover:text-amber-900 font-bold'
                    : 'text-dark-600 hover:text-dark-900'
                }`}
              >
                {diff === 'Premium' ? (
                  <Crown className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                ) : (
                  <span>{diff}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-dark-500 font-medium">
            {filteredProblems.length === totalCount ? `${totalCount} problems` : `${filteredProblems.length} of ${totalCount}`}
          </span>
        </div>
      </div>

      {/* Problem List Table */}
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
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center">
                    <div className="max-w-sm mx-auto space-y-3">
                      <div className="w-10 h-10 rounded-full bg-dark-100 text-dark-400 flex items-center justify-center mx-auto">
                        <Filter className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-dark-900 text-sm">No practice problems found</p>
                        <p className="text-dark-500 text-xs">
                          No problems match your current filter criteria. Try clearing some filters.
                        </p>
                      </div>
                      <button
                        onClick={resetFilters}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((prob, probIdx) => {
                  const status = getStatus(prob.id);
                  const isPremium = prob.isPremium || prob.difficulty === 'Hard';
                  const globalIdx = PRACTICE_PROBLEMS.findIndex((p) => p.id === prob.id);
                  const displayNum = globalIdx !== -1 ? globalIdx + 1 : probIdx + 1;
                  return (
                    <tr key={prob.id} className={`hover:bg-dark-50/60 transition-colors group ${isPremium ? 'bg-amber-50/30' : ''}`}>
                      {/* Question Number */}
                      <td className="py-4 px-3 text-center">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black mx-auto ${
                          isPremium
                            ? 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white shadow-xs shadow-amber-500/25'
                            : 'bg-dark-100 text-dark-700'
                        }`}>
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
                        <Link href={`/practice/${prob.id}`} className="block group-hover:text-primary-600 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-dark-900 group-hover:text-primary-600">
                              <MathRenderer text={prob.title} />
                            </span>
                            {isPremium && (
                              <span
                                title="Premium problem"
                                className="inline-flex items-center text-[8px] font-extrabold text-amber-800 bg-amber-100 border border-amber-300 p-0.5 px-1 rounded shrink-0"
                              >
                                <Crown className="w-3 h-3 text-amber-600 fill-amber-500" />
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-dark-500 mt-0.5 line-clamp-1">
                            <MathRenderer text={prob.description} />
                          </div>
                        </Link>
                      </td>

                      {/* Algorithm Badge(s) */}
                      <td className="py-4 px-4 text-dark-700">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {prob.algorithms?.map((alg) => {
                            const meta = ALGORITHM_OPTIONS.find((a) => a.slug === alg);
                            const label = meta ? meta.shortLabel : alg;
                            const isCurrent = selectedAlgorithm === alg;
                            return (
                              <button
                                key={alg}
                                type="button"
                                onClick={() => setSelectedAlgorithm(alg)}
                                className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all whitespace-nowrap ${
                                  isCurrent
                                    ? 'bg-primary-600 text-white font-bold'
                                    : 'bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-100'
                                }`}
                                title={`Filter by ${meta?.label || alg}`}
                              >
                                {label}
                              </button>
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
