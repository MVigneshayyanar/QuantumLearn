'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/lib/accessibility-context';
import { useStudentContext } from '@/lib/student-context';

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = sessionStorage.getItem('ql_presence_sid');
    if (!sid) {
      sid = 'sid_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now().toString(36);
      sessionStorage.setItem('ql_presence_sid', sid);
    }
    return sid;
  } catch {
    return 'fallback_' + Date.now();
  }
}

export function UserPresenceHeartbeat() {
  const pathname = usePathname();
  const { explanationMode, language } = useAccessibility();
  const { userId, studentName, studentEmail, role } = useStudentContext();

  const lastPingRef = useRef<number>(0);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
  }, []);

  const sendHeartbeat = () => {
    // Only send if tab is visible and running in browser
    if (typeof document !== 'undefined' && document.visibilityState !== 'visible') {
      return;
    }

    const payload = {
      sessionId: sessionIdRef.current || getOrCreateSessionId(),
      userId: userId || null,
      name: studentName || null,
      email: studentEmail || null,
      role: role || (userId ? 'STUDENT' : 'GUEST'),
      mode: explanationMode,
      page: pathname || '/',
      language: language || 'en',
    };

    lastPingRef.current = Date.now();

    try {
      fetch('/api/presence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    } catch {}
  };

  // Trigger on initial mount or key context changes, throttled to prevent spamming
  useEffect(() => {
    // Only send on change if at least 15s elapsed since last ping
    if (Date.now() - lastPingRef.current > 15 * 1000) {
      sendHeartbeat();
    }
  }, [pathname, explanationMode, language, userId]);

  // Periodic heartbeat with randomized jitter (105s - 135s) to avoid thundering herd on Vercel
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNext = () => {
      // 120s base ± 15s random jitter
      const nextDelay = 105000 + Math.random() * 30000;
      timeoutId = setTimeout(() => {
        sendHeartbeat();
        scheduleNext();
      }, nextDelay);
    };

    scheduleNext();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // If it's been more than 60 seconds since the last ping, ping on refocus
        if (Date.now() - lastPingRef.current > 60 * 1000) {
          sendHeartbeat();
        }
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  return null; // completely invisible non-rendering component
}
