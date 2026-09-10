'use client';

import React, { useState, useMemo } from 'react';
import { QuizQuestion } from '@/lib/types';
import { ALGORITHM_QUIZZES } from '@/lib/quiz-data';
import { useProgressStore, useAITutorStore } from '@/lib/state-store';
import { useStudentContext } from '@/lib/student-context';
import { apiLogQuizAttempt, apiReportProgress } from '@/lib/api-helpers';
import { useAccessibility } from '@/lib/accessibility-context';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  HelpCircle,
  Brain,
  Target,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdaptiveQuizEngineProps {
  moduleSlug: string;
  onComplete?: (score: number) => void;
  onProceedToSkillBase?: () => void;
}

/** Seeded shuffle so questions are random-but-stable per session */
function shuffleArray<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function AdaptiveQuizEngine({
  moduleSlug,
  onComplete,
  onProceedToSkillBase,
}: AdaptiveQuizEngineProps) {
  const { language, explanationMode } = useAccessibility();
  const { recordMisconception, updateMastery } = useProgressStore();
  const { askTutor } = useAITutorStore();
  const { userId } = useStudentContext();

  const allQuestions: QuizQuestion[] = ALGORITHM_QUIZZES[moduleSlug] || [];

  // Pick 3 random questions, stable per session (seed from current minute)
  const sessionSeed = useMemo(() => Math.floor(Date.now() / 60000), []);
  const selectedQuestions = useMemo<QuizQuestion[]>(() => {
    if (allQuestions.length === 0) return [];
    // prefer non-premium first, then fill
    const free = allQuestions.filter((q) => !q.isPremium);
    const premium = allQuestions.filter((q) => q.isPremium);
    const pool = shuffleArray(free, sessionSeed).concat(shuffleArray(premium, sessionSeed + 1));
    return pool.slice(0, 3);
  }, [allQuestions, sessionSeed]);

  const TOTAL_QUESTIONS = selectedQuestions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState<number>(Date.now());

  // Track answers: { [qId]: isCorrect }
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  if (TOTAL_QUESTIONS === 0) {
    return (
      <div className="p-8 text-center text-dark-500 bg-white rounded-2xl border border-dark-200">
        No quiz questions available for this module yet.
      </div>
    );
  }

  const currentQ = selectedQuestions[currentIdx];
  const isLastQuestion = currentIdx === TOTAL_QUESTIONS - 1;

  const correctCount = Object.values(answers).filter(Boolean).length;
  const scorePercent = Math.round((correctCount / TOTAL_QUESTIONS) * 100);

  const handleSelectOption = (optId: string) => {
    if (isSubmitted) return;
    setSelectedOptionId(optId);
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);

    const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = selectedOption?.is_correct || false;
    const timeTaken = Date.now() - startTime;

    setAnswers((prev) => ({ ...prev, [currentQ.id]: isCorrect }));

    if (isCorrect) {
      updateMastery('superposition', 8);
    } else {
      if (selectedOption?.misconception_tag) {
        recordMisconception(selectedOption.misconception_tag);
      }
    }

    if (userId) {
      apiLogQuizAttempt({
        userId,
        moduleSlug,
        questionId: currentQ.id,
        selectedAnswer: selectedOptionId,
        isCorrect,
        timeTakenMs: timeTaken,
        difficulty: currentQ.difficulty,
        misconceptionTag: selectedOption?.misconception_tag,
      });
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setIsFinished(true);
      // Report Stage 5 complete (83.3% = 5/6 stages)
      if (userId) {
        apiReportProgress(userId, moduleSlug, 'in_progress', {
          stageReached: 5,
          score: scorePercent,
        });
      }
      if (scorePercent >= 50) {
        try {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ['#F59E0B', '#10B981', '#6366F1'] });
        } catch {}
      }
      if (onComplete) onComplete(scorePercent);
    } else {
      setCurrentIdx((i) => i + 1);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setAnswers({});
    setIsFinished(false);
    setIsSubmitted(false);
    setSelectedOptionId(null);
    setShowHint(false);
  };

  // ── Finished screen ────────────────────────────────────────────────────────
  if (isFinished) {
    const passed = scorePercent >= 67; // ≥ 2/3 correct
    return (
      <div className="bg-white rounded-3xl border border-dark-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl mx-auto animate-fadeIn">
        {/* Trophy icon */}
        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto shadow-sm ${
            passed ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-amber-50 border border-amber-200 text-amber-600'
          }`}
        >
          <Trophy className="w-8 h-8" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-3 py-0.5 rounded-full">
            Stage 5 of 6 Completed
          </span>
          <h3 className="text-2xl font-black text-dark-900">
            Knowledge Check {passed ? 'Passed' : 'Done'} · {scorePercent}%
          </h3>
          <p className="text-xs text-dark-600 max-w-md mx-auto leading-relaxed">
            You answered <strong>{correctCount} of {TOTAL_QUESTIONS}</strong> questions correctly.
            To reach <strong>100% Algorithm Mastery</strong>, complete Stage 6: Skill Base &amp; Practice.
          </p>
        </div>

        {/* Per-question result summary */}
        <div className="grid grid-cols-3 gap-3">
          {selectedQuestions.map((q, idx) => {
            const correct = answers[q.id];
            const qText = language === 'hi' && q.question_hi ? q.question_hi : q.question;
            return (
              <div
                key={q.id}
                className={`p-3 rounded-2xl border text-center ${
                  correct === undefined
                    ? 'border-dark-200 bg-dark-50'
                    : correct
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-red-300 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-center mb-1.5">
                  {correct === undefined ? (
                    <div className="w-6 h-6 rounded-full bg-dark-200 flex items-center justify-center text-[10px] font-bold text-dark-600">
                      {idx + 1}
                    </div>
                  ) : correct ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <p className="text-[10px] text-dark-700 leading-tight line-clamp-2">{qText}</p>
                <span
                  className={`mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full ${
                    correct === undefined
                      ? 'bg-dark-100 text-dark-500'
                      : correct
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {correct === undefined ? 'Skipped' : correct ? 'Correct' : 'Incorrect'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Score bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-dark-700">
            <span>Stage 5 Score</span>
            <span className="font-mono">{correctCount}/{TOTAL_QUESTIONS} correct</span>
          </div>
          <div className="w-full h-3 bg-dark-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${passed ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-dark-500 text-right">{scorePercent}% Score</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-dark-100">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dark-200 hover:bg-dark-50 font-semibold text-xs text-dark-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Quiz</span>
          </button>

          {onProceedToSkillBase && (
            <button
              onClick={onProceedToSkillBase}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-600 via-indigo-600 to-primary-700 hover:brightness-110 font-bold text-xs text-white shadow-md shadow-primary-500/25 transition-all cursor-pointer ring-2 ring-primary-400/40"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Stage 6: Skill Base &amp; Practice →</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              askTutor(
                `I just finished the Knowledge Check for the ${moduleSlug} algorithm. Can you give me a personalized challenge question to reinforce what I studied?`,
                { explanationMode, language }
              );
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary-200 hover:bg-primary-50 text-primary-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            <Bot className="w-4 h-4" />
            <span>Ask AI Tutor</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Active question ────────────────────────────────────────────────────────
  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
  const isCurrentCorrect = selectedOption?.is_correct || false;

  return (
    <div className="bg-white rounded-3xl border border-dark-200 p-5 sm:p-7 shadow-xs space-y-5 max-w-3xl mx-auto">

      {/* ── Header: Quiz title & progress dots ─────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-dark-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs">
            <Brain className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-dark-900 leading-none">Knowledge Check</h3>
            <p className="text-[10px] text-dark-500 mt-0.5">Stage 5 of 6</p>
          </div>
        </div>

        {/* Question dots */}
        <div className="flex items-center gap-1.5">
          {selectedQuestions.map((q, idx) => (
            <div
              key={q.id}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                idx < currentIdx
                  ? answers[q.id]
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-red-400 border-red-400 text-white'
                  : idx === currentIdx
                  ? 'bg-primary-600 border-primary-600 text-white ring-2 ring-primary-300/50'
                  : 'bg-dark-50 border-dark-200 text-dark-400'
              }`}
            >
              {idx < currentIdx ? (answers[q.id] ? '✓' : '✗') : idx + 1}
            </div>
          ))}
          <span className="ml-1 text-[11px] font-mono font-bold text-dark-600">
            {currentIdx + 1}/{TOTAL_QUESTIONS}
          </span>
        </div>
      </div>

      {/* ── Difficulty badge + concept tag ──────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
            currentQ.difficulty === 'beginner'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : currentQ.difficulty === 'intermediate'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-purple-50 border-purple-200 text-purple-800'
          }`}
        >
          {currentQ.difficulty}
        </span>
        {currentQ.concept_tag && (
          <span className="text-xs font-semibold text-dark-600 bg-dark-50 border border-dark-200 px-2.5 py-0.5 rounded-full">
            {currentQ.concept_tag}
          </span>
        )}
      </div>

      {/* ── Question text ─────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-base sm:text-lg font-bold text-dark-900 leading-snug">
          {language === 'hi' && currentQ.question_hi ? currentQ.question_hi : currentQ.question}
        </h3>
      </div>

      {/* ── Options ──────────────────────────────────────────────────────── */}
      <div className="space-y-3" role="radiogroup" aria-label="Quiz question options">
        {currentQ.options.map((opt) => {
          const isSelected = selectedOptionId === opt.id;
          const optText = language === 'hi' && opt.text_hi ? opt.text_hi : opt.text;

          let optionStyle = 'border-dark-200 bg-white hover:border-dark-300 hover:bg-dark-50/50';
          if (isSubmitted) {
            if (opt.is_correct) {
              optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-semibold';
            } else if (isSelected && !opt.is_correct) {
              optionStyle = 'border-red-400 bg-red-50/70 text-red-950';
            } else {
              optionStyle = 'border-dark-200 bg-dark-50 opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'border-primary-600 bg-primary-50/80 text-primary-900 ring-2 ring-primary-500/20 font-medium';
          }

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleSelectOption(opt.id); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs leading-relaxed ${optionStyle}`}
            >
              <div className="w-5 h-5 rounded-full border border-dark-300 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                {isSubmitted ? (
                  opt.is_correct ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isSelected ? (
                    <XCircle className="w-4 h-4 text-red-500" />
                  ) : null
                ) : isSelected ? (
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-600" />
                ) : null}
              </div>
              <span className="flex-1">{optText}</span>
            </div>
          );
        })}
      </div>

      {/* ── Explanation after submit ──────────────────────────────────────── */}
      {isSubmitted && (
        <div
          className={`p-4 rounded-xl border text-xs leading-relaxed animate-fadeIn space-y-1.5 ${
            isCurrentCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Correct! +{Math.round(100 / TOTAL_QUESTIONS)}% stage score</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Incorrect — review the explanation below</span>
              </>
            )}
          </div>
          <p>{selectedOption?.explanation}</p>
        </div>
      )}

      {/* ── Footer actions ────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-3 border-t border-dark-100">
        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-dark-500 hover:text-dark-800 flex items-center gap-1 font-medium transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'Hide hint' : 'Need a hint?'}</span>
            </button>
          )}
          {showHint && !isSubmitted && currentQ.hint && (
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg animate-fadeIn">
              💡 {currentQ.hint}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Check Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
