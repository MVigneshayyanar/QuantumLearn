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
  X,
  Award,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuantumCertificateModal } from '@/components/certificate/QuantumCertificateModal';

interface AdaptiveQuizEngineProps {
  moduleSlug: string;
  moduleTitle?: string;
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
  moduleTitle,
  onComplete,
  onProceedToSkillBase,
}: AdaptiveQuizEngineProps) {
  const { language, explanationMode } = useAccessibility();
  const { recordMisconception, updateMastery } = useProgressStore();
  const { askTutor, setContextPage } = useAITutorStore();
  const { userId, studentName } = useStudentContext();

  const allQuestions: QuizQuestion[] = ALGORITHM_QUIZZES[moduleSlug] || [];

  // Pick 3 foundational (non-premium) questions for the Knowledge Check
  const selectedQuestions = useMemo<QuizQuestion[]>(() => {
    if (allQuestions.length === 0) return [];
    const free = allQuestions.filter((q) => !q.isPremium);
    return free.slice(0, 3);
  }, [allQuestions]);

  const TOTAL_QUESTIONS = selectedQuestions.length;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isRetryingFromFinish, setIsRetryingFromFinish] = useState(false);
  const [reviewingQuestion, setReviewingQuestion] = useState<QuizQuestion | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [startTime] = useState<number>(Date.now());

  // Track answers: { [qId]: isCorrect }
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  // Track selected options: { [qId]: optionId }
  const [selectedOptionIds, setSelectedOptionIds] = useState<Record<string, string>>({});

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

  const askAIToExplainMistake = (q: QuizQuestion, chosenOptId?: string) => {
    const optId = chosenOptId || selectedOptionIds[q.id];
    const chosenOpt = q.options.find((o) => o.id === optId);
    const qText = language === 'hi' && q.question_hi ? q.question_hi : q.question;
    const chosenText = chosenOpt
      ? language === 'hi' && chosenOpt.text_hi
        ? chosenOpt.text_hi
        : chosenOpt.text
      : 'an incorrect answer';

    const prompt = `I got this question wrong on the ${moduleSlug} Knowledge Check.
Question: "${qText}"
My Answer: "${chosenText}"

Teach me indirectly using Socratic guidance. Do NOT reveal the correct answer, the correct option text, the correct number, or a yes/no conclusion. Do not repeat the answer choices. Give one short analogy or concept reminder, then ask one guiding question that helps me reason to the answer myself. End with a brief retry hint.`;

    setContextPage('Knowledge Check');
    askTutor(prompt, {
      explanationMode,
      language,
      activeMisconception: chosenOpt?.misconception_tag || null,
    });
  };

  const handleRetrySingleQuestion = (qId: string) => {
    const targetIdx = selectedQuestions.findIndex((q) => q.id === qId);
    if (targetIdx !== -1) {
      setCurrentIdx(targetIdx);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setShowHint(false);
      setIsFinished(false);
      setIsRetryingFromFinish(true);
      setReviewingQuestion(null);
    }
  };

  const askAIToCoachAllMistakes = () => {
    const wrongQs = selectedQuestions.filter((q) => answers[q.id] === false);
    if (wrongQs.length === 0) return;

    const mistakesSummary = wrongQs
      .map((q, idx) => {
        const optId = selectedOptionIds[q.id];
        const opt = q.options.find((o) => o.id === optId);
        return `${idx + 1}. Question: "${q.question}"\n   My Answer: "${opt ? opt.text : 'Incorrect choice'}"`;
      })
      .join('\n\n');

    const prompt = `I just finished the ${moduleSlug} Knowledge Check and missed ${wrongQs.length} question(s):

${mistakesSummary}

Could you teach me the core quantum principles behind these mistakes in simple terms, and give me clear guidance so I can retry and score 100%?`;

    askTutor(prompt, {
      explanationMode,
      language,
    });
  };

  const handleSubmit = () => {
    if (!selectedOptionId || isSubmitted) return;
    setIsSubmitted(true);

    const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
    const isCorrect = selectedOption?.is_correct || false;
    const timeTaken = Date.now() - startTime;

    setSelectedOptionIds((prev) => ({ ...prev, [currentQ.id]: selectedOptionId }));
    const newAnswers = { ...answers, [currentQ.id]: isCorrect };
    setAnswers(newAnswers);

    const newCorrectCount = Object.values(newAnswers).filter(Boolean).length;
    const newScorePercent = Math.round((newCorrectCount / TOTAL_QUESTIONS) * 100);

    if (isCorrect) {
      updateMastery('superposition', 8);
      if (newScorePercent >= 67) {
        try {
          confetti({
            particleCount: 70,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10B981', '#6366F1', '#F59E0B'],
          });
        } catch {}
      }
      if (userId) {
        apiReportProgress(userId, moduleSlug, 'in_progress', {
          stageReached: 5,
          score: newScorePercent,
        });
      }
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
    if (isRetryingFromFinish) {
      setIsFinished(true);
      setIsRetryingFromFinish(false);
      setSelectedOptionId(null);
      setIsSubmitted(false);
      setShowHint(false);
      return;
    }

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
    setSelectedOptionIds({});
    setIsFinished(false);
    setIsRetryingFromFinish(false);
    setReviewingQuestion(null);
    setIsSubmitted(false);
    setSelectedOptionId(null);
    setShowHint(false);
  };

  // ── Finished screen ────────────────────────────────────────────────────────
  if (isFinished) {
    const passed = scorePercent === 100;
    const incorrectQuestions = selectedQuestions.filter((q) => answers[q.id] === false);

    return (
      <div className="bg-white rounded-2xl border border-dark-200 p-4 sm:p-5 space-y-2.5 shadow-xs w-full h-full min-h-0 flex flex-col animate-fadeIn relative">
        {/* Trophy icon */}
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto shadow-sm ${
            passed ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' : 'bg-amber-50 border border-amber-200 text-amber-600'
          }`}
        >
          <Trophy className="w-5 h-5" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
            Stage 5 of 6 Completed
          </span>
          <h3 className="text-lg sm:text-xl font-black text-dark-900">
            Knowledge Check {passed ? 'Passed' : 'Done'} · {scorePercent}%
          </h3>
          <p className="text-[11px] text-dark-600 max-w-lg mx-auto leading-snug">
            You answered <strong>{correctCount} of {TOTAL_QUESTIONS}</strong> questions correctly.
            {scorePercent === 100
              ? ' Outstanding! You achieved 100% Mastery on this algorithm!'
              : ' Click any incorrect question below to have Schrödinger AI teach you the concept, then retry to reach 100%!'}
          </p>
        </div>

        {/* Per-question result summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {selectedQuestions.map((q, idx) => {
            const correct = answers[q.id];
            const qText = language === 'hi' && q.question_hi ? q.question_hi : q.question;
            const chosenOptId = selectedOptionIds[q.id];
            const chosenOpt = q.options.find((o) => o.id === chosenOptId);

            return (
              <div
                key={q.id}
                onClick={() => {
                  if (correct === false) {
                    setReviewingQuestion(q);
                  }
                }}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  correct === undefined
                    ? 'border-dark-200 bg-dark-50'
                    : correct
                    ? 'border-emerald-300 bg-emerald-50/80 shadow-2xs'
                    : 'border-red-300 bg-red-50/90 hover:border-red-400 hover:shadow-md cursor-pointer hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono font-bold text-dark-700">Question {idx + 1}</span>
                  {correct === undefined ? (
                    <div className="w-5 h-5 rounded-full bg-dark-200 flex items-center justify-center text-[10px] font-bold text-dark-600">
                      ?
                    </div>
                  ) : correct ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>

                <p className="text-[10px] font-medium text-dark-800 dark:text-dark-100 leading-snug line-clamp-2 min-h-[2.4rem]">
                  {qText}
                </p>

                <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      correct === undefined
                        ? 'bg-dark-100 text-dark-500'
                        : correct
                        ? 'bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200'
                        : 'bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {correct === undefined ? 'Skipped' : correct ? 'Correct ✓' : 'Incorrect ✗'}
                  </span>
                </div>

                {correct === false && (
                  <div className="mt-1.5 pt-1.5 border-t border-red-200/80 flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        askAIToExplainMistake(q);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-bold text-[10px] transition-colors cursor-pointer"
                      title="Ask Schrödinger AI to teach this question"
                    >
                      <Bot className="w-3 h-3 text-red-700" />
                      <span>Teach Me</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetrySingleQuestion(q.id);
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-[10px] transition-colors cursor-pointer shadow-2xs"
                      title="Retry this question to get the answer right"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Retry</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Mistake Help Banner when there are wrong questions */}
        {incorrectQuestions.length > 0 && (
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-950 text-xs">Reach 100% Algorithm Mastery</h4>
                <p className="text-[10px] text-amber-800">
                  Schrödinger AI can explain your {incorrectQuestions.length} missed question(s) so you can retry and achieve a perfect score!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={askAIToCoachAllMistakes}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/90 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Coach Mistakes</span>
              </button>
              <button
                onClick={() => handleRetrySingleQuestion(incorrectQuestions[0].id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-[11px] transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Missed Question</span>
              </button>
            </div>
          </div>
        )}

        {/* Perfect score banner */}
        {scorePercent === 100 && (
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 text-[11px] text-emerald-900 font-bold animate-fadeIn">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>🎉 Perfect 100% Score! You have fully mastered this stage!</span>
          </div>
        )}

        {/* Score bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-dark-700">
            <span>Stage 5 Score</span>
            <span className="font-mono">{correctCount}/{TOTAL_QUESTIONS} correct</span>
          </div>
          <div className="w-full h-2 bg-dark-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${scorePercent === 100 ? 'bg-emerald-500' : passed ? 'bg-emerald-500' : 'bg-amber-500'}`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <p className="text-[10px] text-dark-500 text-right">{scorePercent}% Score</p>
        </div>

        {/* Quantum Certificate Callout Banner */}
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
              <Award className="w-4 h-4 text-amber-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-extrabold tracking-wider uppercase px-1.5 py-0.5 rounded-md bg-amber-200 text-amber-900 border border-amber-300">
                  Official Quantum Credential
                </span>
                <span className="text-[10px] font-bold text-amber-800">QuanBit Quantum Academy</span>
              </div>
              <h4 className="text-xs font-black text-dark-900 mt-0.5">
                {moduleTitle || (moduleSlug.includes('grover') ? "Grover's Algorithm" : 'Quantum Algorithm')} Certification
              </h4>
              <p className="text-[11px] text-dark-600">
                Verified certificate of completion signed by Dr. Erwin Schrödinger
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCertModal(true)}
            className="w-full sm:w-auto px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-black text-[11px] shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0"
          >
            <Trophy className="w-4 h-4 text-amber-200" />
            <span>
              Get {moduleSlug.includes('grover') ? 'Grover ' : ''}Certification
            </span>
          </button>
        </div>

        {/* Keep the single progression action at the bottom-right. Retrying and
            teaching remain available in the mistake banner above. */}
        <div className="mt-auto flex justify-end pt-2 border-t border-dark-100">
          {onProceedToSkillBase && (
            <button
              onClick={onProceedToSkillBase}
              disabled={!passed}
              title={!passed ? 'Reach 100% to unlock the next module' : 'Continue to the next module'}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-[11px] shadow-xs transition-colors ${
                passed
                  ? 'bg-primary-600 hover:bg-primary-700 text-white cursor-pointer'
                  : 'bg-dark-100 text-dark-400 cursor-not-allowed opacity-70'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${passed ? 'text-amber-300' : 'text-dark-400'}`} />
              <span>{passed ? 'Next Module: Skill Base &amp; Practice' : 'Next Module (Reach 100% to unlock)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Review & Retry Modal for clicked incorrect question */}
        {reviewingQuestion && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-xs animate-fadeIn">
            <div className="bg-white rounded-3xl border border-dark-200 p-6 max-w-lg w-full shadow-2xl space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-dark-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <XCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-dark-900">Review Incorrect Question</h4>
                    <span className="text-[10px] text-dark-500 font-medium">{reviewingQuestion.concept_tag}</span>
                  </div>
                </div>
                <button
                  onClick={() => setReviewingQuestion(null)}
                  className="w-7 h-7 rounded-full bg-dark-100 hover:bg-dark-200 flex items-center justify-center text-dark-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="font-bold text-sm text-dark-900 leading-snug">
                  {language === 'hi' && reviewingQuestion.question_hi
                    ? reviewingQuestion.question_hi
                    : reviewingQuestion.question}
                </p>

                {/* What user answered */}
                {(() => {
                  const optId = selectedOptionIds[reviewingQuestion.id];
                  const opt = reviewingQuestion.options.find((o) => o.id === optId);
                  if (!opt) return null;
                  return (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 space-y-1 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-red-900">
                        <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>Your Answer: {opt.text}</span>
                      </div>
                      {opt.explanation && (
                        <p className="text-[11px] text-red-800 leading-relaxed pl-5">
                          {opt.explanation}
                        </p>
                      )}
                    </div>
                  );
                })()}

                {/* Socratic Hint */}
                {reviewingQuestion.hint && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <span className="font-bold">💡 Clue:</span>
                    <span>{reviewingQuestion.hint}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-dark-100">
                <button
                  onClick={() => setReviewingQuestion(null)}
                  className="px-3.5 py-2 rounded-xl border border-dark-200 hover:bg-dark-50 text-xs font-semibold text-dark-700 transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    askAIToExplainMistake(reviewingQuestion);
                    setReviewingQuestion(null);
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5 text-amber-800" />
                  <span>Ask AI Tutor to Explain</span>
                </button>
                <button
                  onClick={() => handleRetrySingleQuestion(reviewingQuestion.id)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Question Now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quantum Certificate Modal */}
        <QuantumCertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          moduleSlug={moduleSlug}
          moduleTitle={moduleTitle || (moduleSlug.includes('grover') ? "Grover's Quantum Search" : moduleSlug)}
          studentName={studentName || 'Alex Mercer'}
          isCompleted={true}
        />
      </div>
    );
  }

  // ── Active question ────────────────────────────────────────────────────────
  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
  const isCurrentCorrect = selectedOption?.is_correct || false;

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl border border-dark-200 shadow-xs text-xs flex flex-col flex-1 h-full">
      <div className="p-4 sm:p-5 space-y-3 flex-1 min-h-0">
      {/* ── Retrying Banner ───────────────────────────────────────────────── */}
      {isRetryingFromFinish && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs text-amber-900 animate-fadeIn">
          <div className="flex items-center gap-2 font-semibold">
            <RotateCcw className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Retrying Mistake: Select the correct answer to raise score to 100%!</span>
          </div>
          <button
            onClick={() => {
              setIsFinished(true);
              setIsRetryingFromFinish(false);
              setSelectedOptionId(null);
              setIsSubmitted(false);
            }}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer"
          >
            Back to Results
          </button>
        </div>
      )}

      {/* ── Header: Quiz title & progress dots with Question Numbers ─────────── */}
      <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-dark-100">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
            Q{currentIdx + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-dark-900 leading-none">
                Question {currentIdx + 1} of {TOTAL_QUESTIONS}
              </h3>
            </div>
            <p className="text-[9px] text-dark-500 mt-0.5">
              Stage 5: Knowledge Check · {moduleTitle || 'Quantum Algorithm'}
            </p>
          </div>
        </div>

        {/* Question dots with Q1, Q2, Q3, Q4 */}
        <div className="flex items-center gap-1.5 rounded-full bg-dark-50 border border-dark-100 px-2 py-1">
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
                  : 'bg-dark-50 border-dark-200 text-dark-500 font-mono'
              }`}
              title={`Question ${idx + 1}`}
            >
              {idx < currentIdx ? (answers[q.id] ? '✓' : '✗') : `Q${idx + 1}`}
            </div>
          ))}
          <span className="ml-1 text-[11px] font-mono font-bold text-dark-600">
            {currentIdx + 1}/{TOTAL_QUESTIONS}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-dark-500">
          <span>Your progress</span>
          <span className="text-primary-700">{currentIdx + 1} / {TOTAL_QUESTIONS}</span>
        </div>
        <div className="h-1.5 rounded-full bg-dark-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-600 to-violet-500 transition-all duration-500"
            style={{ width: `${((currentIdx + 1) / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>
      </div>

      {/* ── Difficulty badge + concept tag ──────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
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
          <span className="text-[11px] font-semibold text-dark-600 bg-dark-50 border border-dark-200 px-2 py-0.5 rounded-full">
            {currentQ.concept_tag}
          </span>
        )}
      </div>

      {/* ── Question text ─────────────────────────────────────────────────── */}
      <div className="rounded-xl bg-primary-50/60 border border-primary-100 p-3 sm:p-3.5">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-primary-700 mb-1">Think like a quantum learner</p>
        <h3 className="text-sm sm:text-base font-bold text-dark-950 leading-snug">
          {language === 'hi' && currentQ.question_hi ? currentQ.question_hi : currentQ.question}
        </h3>
      </div>

      {/* ── Options ──────────────────────────────────────────────────────── */}
      <div className="space-y-1.5" role="radiogroup" aria-label="Quiz question options">
        {currentQ.options.map((opt, optionIndex) => {
          const isSelected = selectedOptionId === opt.id;
          const optText = language === 'hi' && opt.text_hi ? opt.text_hi : opt.text;

          let optionStyle = 'border-dark-200 bg-white dark:bg-dark-900 text-dark-800 dark:text-dark-100 hover:border-dark-300 hover:bg-dark-50/50';
          if (isSubmitted) {
            if (isCurrentCorrect && opt.is_correct) {
              optionStyle = 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 font-semibold';
            } else if (isSelected && !opt.is_correct) {
              optionStyle = 'border-red-400 bg-red-50/70 dark:bg-red-950/60 text-red-950 dark:text-red-100';
            } else {
              optionStyle = 'border-dark-200 bg-dark-50 dark:bg-dark-900/50 text-dark-400 opacity-60';
            }
          } else if (isSelected) {
            optionStyle = 'border-primary-600 bg-primary-50/80 dark:bg-primary-950/60 text-primary-900 dark:text-primary-100 ring-2 ring-primary-500/20 font-medium';
          }

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectOption(opt.id)}
              role="radio"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') handleSelectOption(opt.id); }}
              className={`p-2.5 sm:p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 text-xs sm:text-sm leading-snug hover:shadow-sm ${optionStyle}`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-bold text-[10px] ${
                isSelected ? 'bg-primary-600 text-white' : 'bg-dark-50 text-dark-500 border border-dark-200'
              }`}>
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <div className="w-3.5 h-3.5 rounded-full border border-dark-300 flex items-center justify-center shrink-0 mt-0.5 bg-white">
                {isSubmitted ? (
                  isCurrentCorrect && opt.is_correct ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isSelected ? (
                    <XCircle className="w-3.5 h-3.5 text-red-500" />
                  ) : null
                ) : isSelected ? (
                  <div className="w-2 h-2 rounded-full bg-primary-600" />
                ) : null}
              </div>
              <span className="flex-1">{optText}</span>
            </div>
          );
        })}
      </div>

      {/* ── Explanation after submit ──────────────────────────────────────── */}
      {isSubmitted && !isCurrentCorrect && (
        <div
          className={`p-3 rounded-xl border text-xs leading-relaxed animate-fadeIn space-y-1.5 ${
            'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-2 font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Incorrect — review the explanation below</span>
          </div>
          <p>
            Use the tutor for a guided clue and work through the concept yourself before trying again.
          </p>

          {/* AI Teaching & Retry buttons when incorrect */}
          {!isCurrentCorrect && (
            <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-amber-200/80 mt-1.5">
              <button
                type="button"
                onClick={() => askAIToExplainMistake(currentQ, selectedOptionId || undefined)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-200/90 hover:bg-amber-300 text-amber-950 font-bold text-[11px] shadow-2xs transition-colors cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-amber-800" />
                <span>Teach Me With AI Tutor</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setSelectedOptionId(null);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 hover:bg-amber-100/80 text-amber-900 font-semibold text-[11px] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
                <span>Try Again Now</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Footer actions ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-dark-100">
        <div className="flex items-center gap-2">
          {!isSubmitted && (
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-dark-500 hover:text-primary-700 flex items-center gap-1.5 font-semibold transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>{showHint ? 'Hide hint' : 'Need a hint?'}</span>
            </button>
          )}
          {showHint && !isSubmitted && currentQ.hint && (
            <span className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg animate-fadeIn">
              💡 {currentQ.hint}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOptionId}
              className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              Check Answer
            </button>
          ) : (
            <>
              {!isCurrentCorrect && !isRetryingFromFinish && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedOptionId(null);
                  }}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-dark-300 hover:bg-dark-50 text-dark-800 font-semibold text-xs transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <span>
                  {isRetryingFromFinish
                    ? `Back to Results (${scorePercent}%)`
                    : isLastQuestion
                    ? 'View Results'
                    : 'Next Question'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
