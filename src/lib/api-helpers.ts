/**
 * API helper functions for writing learning data to the Neon DB.
 *
 * These are fire-and-forget calls — the UI updates optimistically via
 * Zustand state, and these calls sync the data to the DB in the
 * background. If a call fails, a console warning is emitted (not silent).
 *
 * DO NOT silently fall back to localStorage if these fail — the DB is
 * the source of truth. Surface errors rather than letting data drift.
 */

/**
 * Report module progress to the DB.
 */
export async function apiReportProgress(
  userId: string,
  moduleSlug: string,
  status: 'in_progress' | 'completed',
  options?: { score?: number; stageReached?: number }
) {
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        moduleSlug,
        status,
        score: options?.score,
        stageReached: options?.stageReached,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn(`[apiReportProgress] Failed (HTTP ${res.status}):`, data.error || 'Unknown error');
    }
  } catch (err) {
    console.warn('[apiReportProgress] Network error:', err);
  }
}

/**
 * Log a quiz attempt to the DB.
 */
export async function apiLogQuizAttempt(params: {
  userId: string;
  moduleSlug: string;
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeTakenMs: number;
  difficulty: string;
  misconceptionTag?: string;
}) {
  try {
    const res = await fetch('/api/quiz-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      console.warn(`[apiLogQuizAttempt] Failed (HTTP ${res.status}):`, data.error || 'Unknown error');
    }
  } catch (err) {
    console.warn('[apiLogQuizAttempt] Network error:', err);
  }
}
