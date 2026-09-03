'use client';

import React, { useState, useEffect } from 'react';
import { QuizQuestion, QuizOption, MisconceptionTag } from '@/lib/types';
import { ALGORITHM_QUIZZES } from '@/lib/quiz-data';
import { useProgressStore, useAITutorStore } from '@/lib/state-store';
import { useStudentContext } from '@/lib/student-context';
import { apiLogQuizAttempt, apiReportProgress } from '@/lib/api-helpers';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Bot,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Trophy,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdaptiveQuizEngineProps {
  moduleSlug: string;
  onComplete?: (score: number) => void;
}

export function AdaptiveQuizEngine({ moduleSlug, onComplete }: AdaptiveQuizEngineProps) {
  const { language, explanationMode, announce } = useAccessibility();
  const { recordMisconception, markModuleComplete, updateMastery } = useProgressStore();
  const { setIsOpen: setAITutorOpen, addMessage, setActiveMisconception } = useAITutorStore();
  const { userId } = useStudentContext();

  const questions: QuizQuestion[] = ALGORITHM_QUIZZES[moduleSlug] || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOptionId(null);
    setIsSubmitted(false);
    setShowHint(false);
  }, [currentIdx]);

  if (!questions || questions.length === 0) {
    return (
      <div className="p-8 text-center text-dark-500 bg-white rounded-2xl border border-dark-200">
        No quiz questions available for this module yet.
      </div>
    );
  }

  const currentQ = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;

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

    if (isCorrect) {
      setScore((s) => s + 1);
      updateMastery('superposition', 10);
      updateMastery('entanglement', 10);
      announce('Correct answer!');
    } else {
      if (selectedOption?.misconception_tag) {
        recordMisconception(selectedOption.misconception_tag);
        announce(`Misconception detected: ${selectedOption.misconception_tag}`);
      }
    }

    // Write quiz attempt to DB (fire-and-forget)
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
      const finalScore = Math.round(((score + (isCurrentCorrect ? 1 : 0)) / questions.length) * 100);
      markModuleComplete(moduleSlug, finalScore);

      // Write module completion to DB (fire-and-forget)
      if (userId) {
        apiReportProgress(userId, moduleSlug, 'completed', { score: finalScore });
      }

      if (finalScore >= 60) {
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
      if (onComplete) onComplete(finalScore);
    } else {
      setCurrentIdx((i) => i + 1);
    }
  };

  const handleAskAITutor = (misconceptionTag?: MisconceptionTag) => {
    if (misconceptionTag) {
      setActiveMisconception(misconceptionTag);
    }
    const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
    addMessage({
      role: 'user',
      content: `I'm confused about this quiz question: "${currentQ.question}". I answered "${selectedOption?.text}", but that was marked incorrect. Could you help me understand why and guide me through the physics?`
    });
    setAITutorOpen(true);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setIsFinished(false);
    setIsSubmitted(false);
    setSelectedOptionId(null);
  };

  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);
  const isCurrentCorrect = selectedOption?.is_correct || false;

  // Quiz Finished Screen
  if (isFinished) {
    const finalPercentage = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl border border-dark-200 p-8 text-center space-y-6 shadow-xs max-w-xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-dark-900">Quiz Completed!</h3>
          <p className="text-sm text-dark-600 mt-1">
            You scored {score} out of {questions.length} ({finalPercentage}%)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-dark-50 border border-dark-200 text-xs text-dark-700 leading-relaxed">
          {finalPercentage >= 80 ? (
            <p className="text-emerald-700 font-semibold">
              🌟 Outstanding mastery! You demonstrate a solid intuition and mathematical grasp of this algorithm.
            </p>
          ) : (
            <p>
              Great effort! Review any flagged misconceptions with Schrödinger AI to strengthen your conceptual foundation.
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-dark-200 hover:bg-dark-50 font-semibold text-xs text-dark-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Retry Quiz
          </button>
          <button
            onClick={() => {
              addMessage({
                role: 'user',
                content: `Could you give me a personalized practice challenge on the ${moduleSlug} algorithm to test what I just learned?`
              });
              setAITutorOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 font-semibold text-xs text-white shadow-xs transition-colors"
          >
            <Bot className="w-4 h-4" />
            Ask AI for Practice Challenge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dark-200 p-6 shadow-xs space-y-6 max-w-2xl mx-auto">
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between border-b border-dark-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100 uppercase">
            {currentQ.difficulty}
          </span>
          <span className="text-xs font-medium text-dark-500">{currentQ.concept_tag}</span>
        </div>
        <span className="text-xs font-mono font-bold text-dark-700">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Question Text */}
      <div>
        <h3 className="text-base font-bold text-dark-900 leading-snug">
          {language === 'hi' && currentQ.question_hi ? currentQ.question_hi : currentQ.question}
        </h3>
      </div>

      {/* Options List */}
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
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') handleSelectOption(opt.id);
              }}
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

      {/* Feedback & Misconception Box */}
      {isSubmitted && selectedOption && (
        <div
          className={`p-4 rounded-xl border text-xs space-y-3 animate-fadeIn ${
            isCurrentCorrect
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-red-50/70 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {isCurrentCorrect ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <p className="font-bold">
                {isCurrentCorrect ? 'Correct!' : 'Incorrect Concept Formulation'}
              </p>
              <p className="leading-relaxed">
                {language === 'hi' && selectedOption.explanation_hi
                  ? selectedOption.explanation_hi
                  : selectedOption.explanation}
              </p>
            </div>
          </div>

          {/* Socratic AI Referral Button if misconception flagged */}
          {!isCurrentCorrect && selectedOption.misconception_tag && (
            <div className="pt-2 border-t border-red-200 flex items-center justify-between gap-3">
              <span className="text-[11px] text-red-800 font-medium">
                Flagged concept: <code className="font-mono">{selectedOption.misconception_tag}</code>
              </span>
              <button
                onClick={() => handleAskAITutor(selectedOption.misconception_tag)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs transition-colors shadow-2xs"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Ask AI Tutor to Guide Me</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Hint toggle */}
      {!isSubmitted && (
        <div>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-primary-700 hover:text-primary-800 font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Need a hint?'}</span>
          </button>
          {showHint && (
            <p className="mt-2 p-3 bg-primary-50/60 rounded-xl border border-primary-100 text-xs text-primary-900 leading-relaxed">
              💡 {language === 'hi' && currentQ.hint_hi ? currentQ.hint_hi : currentQ.hint}
            </p>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-3 border-t border-dark-100 flex items-center justify-between">
        <span className="text-xs text-dark-500 font-medium">
          Score: {score} / {questions.length}
        </span>

        {!isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
            className="px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <span>{isLastQuestion ? 'View Results' : 'Next Question'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
