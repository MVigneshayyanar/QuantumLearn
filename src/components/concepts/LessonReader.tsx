'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Code2, HelpCircle, CheckCircle2, XCircle, ArrowRight, ArrowLeft, 
  Sparkles, Terminal, Copy, Check, Orbit, Clock
} from 'lucide-react';
import { Lesson } from '@/lib/quantum-academy-data';

interface LessonReaderProps {
  lesson: Lesson;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function LessonReader({ lesson, onNext, onPrev, hasNext, hasPrev }: LessonReaderProps) {
  const [activeTab, setActiveTab] = useState<'theory' | 'math' | 'code' | 'quiz'>('theory');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Reset quiz state when lesson changes
  React.useEffect(() => {
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  }, [lesson.id]);

  const handleCopyCode = () => {
    if (lesson.codeSample?.code) {
      navigator.clipboard.writeText(lesson.codeSample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedQuizAnswer !== null) {
      setQuizSubmitted(true);
    }
  };

  const currentQuiz = lesson.quiz && lesson.quiz.length > 0 ? lesson.quiz[0] : null;

  return (
    <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl overflow-hidden shadow-xs transition-colors">
      {/* Top Header */}
      <div className="p-6 sm:p-8 border-b border-dark-200 dark:border-dark-800 bg-dark-50/60 dark:bg-dark-950/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary-600 dark:text-primary-400">
              <span>{lesson.sectionTitle}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {lesson.duration}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-dark-900 dark:text-white tracking-tight">
              {lesson.title}
            </h2>
          </div>

          {/* Sub-tabs: Theory, Math, Code, Quiz */}
          <div className="flex items-center gap-1 bg-white dark:bg-dark-900 p-1.5 rounded-2xl border border-dark-200 dark:border-dark-700 shadow-xs">
            <button
              onClick={() => setActiveTab('theory')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'theory'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Theory</span>
            </button>
            <button
              onClick={() => setActiveTab('math')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'math'
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
              }`}
            >
              <Orbit className="w-4 h-4" />
              <span>Formulas</span>
            </button>
            {lesson.codeSample && (
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'code'
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Code</span>
              </button>
            )}
            {currentQuiz && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-primary-600 text-white shadow-xs'
                    : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quiz</span>
              </button>
            )}
          </div>
        </div>

        {/* Objectives Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-dark-200/80 dark:border-dark-800">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-dark-400 dark:text-dark-500">
            Objectives:
          </span>
          {lesson.objectives.map((obj: string, i: number) => (
            <span
              key={i}
              className="text-xs px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-800 dark:text-primary-300 border border-primary-200 dark:border-primary-800/60 flex items-center gap-1.5 font-medium"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400 shrink-0" />
              <span>{obj}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 sm:p-8 min-h-[440px]">
        {/* TAB 1: THEORY */}
        {activeTab === 'theory' && (
          <div className="space-y-6">
            <div className="text-dark-800 dark:text-dark-200 text-sm sm:text-base leading-relaxed whitespace-pre-line font-article">
              {lesson.theory}
            </div>

            {/* Formula callout within theory */}
            {lesson.mathFormulae && lesson.mathFormulae.length > 0 && (
              <div className="my-6 p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-primary-200 dark:border-primary-900/60 shadow-xs">
                <div className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Key Mathematical Relation ({lesson.mathFormulae[0].label})
                </div>
                <div className="font-mono text-base md:text-lg text-primary-700 dark:text-primary-300 py-3 px-4 bg-white dark:bg-dark-900 rounded-xl border border-dark-200 dark:border-dark-800 overflow-x-auto notranslate">
                  {lesson.mathFormulae[0].latex}
                </div>
                <p className="text-xs text-dark-500 dark:text-dark-400 mt-2.5 leading-relaxed">
                  {lesson.mathFormulae[0].explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MATHEMATICAL FORMULAS */}
        {activeTab === 'math' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-dark-900 dark:text-white uppercase tracking-wider mb-1">
                Rigorous Mathematical Formulation
              </h4>
              <p className="text-xs text-dark-500 dark:text-dark-400">
                Formal Hilbert space definitions, linear algebra representations, and unitaries for {lesson.title}.
              </p>
            </div>

            <div className="space-y-4">
              {lesson.mathFormulae.map((f, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 space-y-2">
                  <div className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">{f.label}</div>
                  <div className="p-3.5 rounded-xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 font-mono text-sm md:text-base text-primary-700 dark:text-primary-300 overflow-x-auto notranslate">
                    {f.latex}
                  </div>
                  <p className="text-xs text-dark-600 dark:text-dark-300 leading-relaxed pt-1">
                    {f.explanation}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800/60 text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
              <span className="font-bold text-primary-700 dark:text-primary-300">Mathematical Insight: </span>
              In quantum mechanics, state vectors belong to a complex Hilbert space $\mathcal&#123;H&#125;$. Pure states correspond to 1-dimensional subspaces (rays). Any observable is represented by a Hermitian operator whose eigenvalues correspond to possible measurement outcomes.
            </div>
          </div>
        )}

        {/* TAB 3: CODE SNIPPET (QISKIT / PYTHON) */}
        {activeTab === 'code' && lesson.codeSample && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-dark-600 dark:text-dark-300">
                <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Executable {lesson.codeSample.framework} Implementation</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-xl bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-700 dark:text-dark-200 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-dark-950 text-white border border-dark-800 overflow-x-auto">
              <pre className="font-mono text-xs sm:text-sm text-emerald-300 leading-relaxed notranslate">
                <code>{lesson.codeSample.code}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: KNOWLEDGE CHECK QUIZ */}
        {activeTab === 'quiz' && currentQuiz && (
          <div className="max-w-2xl mx-auto space-y-6 py-4">
            <div className="p-5 rounded-2xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800/60">
              <div className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-1">
                Concept Checkpoint
              </div>
              <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white">
                {currentQuiz.question}
              </h3>
            </div>

            <div className="space-y-3">
              {currentQuiz.options.map((option: string, idx: number) => {
                const isSelected = selectedQuizAnswer === idx;
                const isCorrect = idx === currentQuiz.correctIndex;
                let cardStyle = 'bg-white dark:bg-dark-950 border-dark-200 dark:border-dark-800 hover:border-primary-400 text-dark-800 dark:text-dark-200';

                if (quizSubmitted) {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 font-semibold';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-900 dark:text-primary-100 font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={quizSubmitted}
                    onClick={() => setSelectedQuizAnswer(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-7 h-7 rounded-lg bg-dark-100 dark:bg-dark-800 text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium">{option}</span>
                    </div>

                    {quizSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    )}
                    {quizSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Submit or Explanation */}
            {!quizSubmitted ? (
              <button
                disabled={selectedQuizAnswer === null}
                onClick={handleQuizSubmit}
                className="w-full py-3 rounded-2xl bg-primary-600 hover:bg-primary-700 disabled:opacity-40 text-white font-bold text-sm shadow-card transition-all cursor-pointer"
              >
                Submit Answer
              </button>
            ) : (
              <div className="p-5 rounded-2xl bg-dark-50 dark:bg-dark-950 border border-dark-200 dark:border-dark-800 space-y-2">
                <div className="text-xs font-mono font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                  Explanation
                </div>
                <p className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
                  {currentQuiz.explanation}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Navigation Bar */}
      <div className="p-6 sm:p-8 border-t border-dark-200 dark:border-dark-800 bg-dark-50/60 dark:bg-dark-950/40 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-dark-100 dark:hover:bg-dark-700 border border-dark-200 dark:border-dark-700 disabled:opacity-30 text-dark-700 dark:text-dark-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous Lesson</span>
        </button>

        <span className="text-xs font-mono font-semibold text-dark-400 dark:text-dark-500">
          Lesson {lesson.id} of 22
        </span>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-30 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-card transition-all cursor-pointer"
        >
          <span>Next Lesson</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
