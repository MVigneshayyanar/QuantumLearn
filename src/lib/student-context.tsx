/**
 * Student & Auth Identity Context
 *
 * Provides authentication state for the app.
 * Allows guest browsing, but gates "Submit & Verify Circuit" (Build It)
 * and "Submit Solution to Judge" (Practice) until signed in / signed up.
 * Supports the special Instructor account: instructor@quanbit.com / quanbit123.
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useProgressStore, useAITutorStore, useCircuitStore } from '@/lib/state-store';

export type UserRole = 'STUDENT' | 'EDUCATOR' | 'ADMIN';

interface StudentContextValue {
  userId: string | null;
  studentName: string | null;
  studentEmail: string | null;
  role: UserRole | null;
  isIdentified: boolean;
  isAdmin: boolean;
  isInstructor: boolean;
  isPremium: boolean;
  isLoading: boolean;
  showIdentityModal: boolean;
  showSubscriptionModal: boolean;
  openLoginModal: (callback?: (id?: string) => void) => void;
  closeLoginModal: () => void;
  openSubscriptionModal: () => void;
  closeSubscriptionModal: () => void;
  upgradeToPremium: () => void;
  downgradeToFree: () => void;
  login: (email: string, password: string) => Promise<{ isInstructor: boolean; isAdmin: boolean; userId: string }>;
  register: (name: string, email: string, password: string) => Promise<{ userId: string }>;
  logout: () => void;
}

const StudentContext = createContext<StudentContextValue>({
  userId: null,
  studentName: null,
  studentEmail: null,
  role: null,
  isIdentified: false,
  isAdmin: false,
  isInstructor: false,
  isPremium: false,
  isLoading: true,
  showIdentityModal: false,
  showSubscriptionModal: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  openSubscriptionModal: () => {},
  closeSubscriptionModal: () => {},
  upgradeToPremium: () => {},
  downgradeToFree: () => {},
  login: async () => ({ isInstructor: false, isAdmin: false, userId: '' }),
  register: async () => ({ userId: '' }),
  logout: () => {},
});

export function useStudentContext() {
  return useContext(StudentContext);
}

const LS_STUDENT_ID = 'ql_student_id';
const LS_STUDENT_NAME = 'ql_student_name';
const LS_STUDENT_EMAIL = 'ql_student_email';
const LS_STUDENT_ROLE = 'ql_student_role';
const LS_STUDENT_PREMIUM = 'ql_is_premium';
const LS_SESSION_EXPIRES_AT = 'ql_session_expires_at';

// 24-hour rolling sliding session duration
const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const SESSION_COOKIE_MAX_AGE = 86400; // 24 hours in seconds

function renewSessionCookies(userId: string, role: string, isPremium: boolean) {
  if (typeof document !== 'undefined') {
    document.cookie = `ql_user_id=${userId}; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
    document.cookie = `ql_user_role=${role}; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
    document.cookie = `ql_user_premium=${String(isPremium)}; path=/; max-age=${SESSION_COOKIE_MAX_AGE}; SameSite=Lax`;
  }
}

function refreshSessionExpiry(): number {
  const newExpiry = Date.now() + SESSION_TTL_MS;
  try {
    localStorage.setItem(LS_SESSION_EXPIRES_AT, String(newExpiry));
  } catch {}
  return newExpiry;
}

function isSessionValid(): boolean {
  try {
    const rawExpiry = localStorage.getItem(LS_SESSION_EXPIRES_AT);
    if (!rawExpiry) return false;
    const expiresAt = parseInt(rawExpiry, 10);
    if (isNaN(expiresAt)) return false;
    return Date.now() < expiresAt;
  } catch {
    return false;
  }
}

function clearAuthStorage() {
  try {
    localStorage.removeItem(LS_STUDENT_ID);
    localStorage.removeItem(LS_STUDENT_NAME);
    localStorage.removeItem(LS_STUDENT_EMAIL);
    localStorage.removeItem(LS_STUDENT_ROLE);
    localStorage.removeItem(LS_STUDENT_PREMIUM);
    localStorage.removeItem(LS_SESSION_EXPIRES_AT);
  } catch {}

  if (typeof document !== 'undefined') {
    document.cookie = 'ql_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'ql_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    document.cookie = 'ql_user_premium=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  }
}

async function syncUserProgressToStore(uid: string) {
  try {
    const res = await fetch(`/api/students/${uid}/summary`);
    if (res.ok) {
      const summary = await res.json();
      useProgressStore.getState().setProgress({
        completedModules: summary.completedModules || {},
        moduleScores: summary.moduleScores || {},
        conceptMastery: summary.conceptMastery || {
          superposition: 0,
          entanglement: 0,
          phaseKickback: 0,
          interference: 0,
          measurement: 0,
        },
        streakDays: summary.student?.streakDays || 0,
      });
    }
  } catch {}
}

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Synchronous ref to prevent stale closures from checking outdated null state
  const userIdRef = useRef<string | null>(null);

  // Stores any action to execute immediately after successful sign in / sign up
  const pendingActionRef = useRef<((id?: string) => void) | null>(null);

  // On mount, check localStorage for existing identity and validate 24-hour window
  useEffect(() => {
    try {
      const storedId = localStorage.getItem(LS_STUDENT_ID);
      const storedName = localStorage.getItem(LS_STUDENT_NAME);
      const storedEmail = localStorage.getItem(LS_STUDENT_EMAIL);
      const storedRole = (localStorage.getItem(LS_STUDENT_ROLE) as UserRole) || 'STUDENT';
      const storedPremium =
        localStorage.getItem(LS_STUDENT_PREMIUM) === 'true' ||
        storedRole === 'ADMIN' ||
        storedRole === 'EDUCATOR';

      if (storedId) {
        if (!isSessionValid()) {
          // More than 24 hours of inactivity elapsed: clear expired credentials
          clearAuthStorage();
          userIdRef.current = null;
          setUserId(null);
          setStudentName(null);
          setStudentEmail(null);
          setRole(null);
          setIsPremium(false);
        } else {
          // Within 24 hours: user is active! Slide 24h expiration forward from this visit
          refreshSessionExpiry();
          renewSessionCookies(storedId, storedRole, storedPremium);

          userIdRef.current = storedId;
          setUserId(storedId);
          setStudentName(storedName || (storedEmail ? storedEmail.split('@')[0] : 'Student'));
          setStudentEmail(storedEmail || '');
          setRole(storedRole);
          setIsPremium(storedPremium);
          syncUserProgressToStore(storedId);
        }
      } else {
        clearAuthStorage();
      }
    } catch {
      // localStorage not available
    }
    setShowIdentityModal(false);
    setIsLoading(false);
  }, []);

  const openLoginModal = useCallback((callback?: (id?: string) => void) => {
    // Only bypass if both state/ref AND localStorage agree user is logged in AND session is valid
    const storedId = typeof window !== 'undefined' ? localStorage.getItem(LS_STUDENT_ID) : null;
    const valid = isSessionValid();
    const currentId = (storedId && valid) ? (storedId || userIdRef.current) : null;

    if (currentId && storedId && valid) {
      refreshSessionExpiry();
      const storedRole = (localStorage.getItem(LS_STUDENT_ROLE) as UserRole) || 'STUDENT';
      const storedPremium = localStorage.getItem(LS_STUDENT_PREMIUM) === 'true';
      renewSessionCookies(currentId, storedRole, storedPremium);
      if (callback) {
        callback(currentId);
      }
      return;
    }

    // Ensure stale ref and expired auth data are cleared
    if (!storedId || !valid) {
      userIdRef.current = null;
      if (storedId && !valid) {
        clearAuthStorage();
        setUserId(null);
        setStudentName(null);
        setStudentEmail(null);
        setRole(null);
        setIsPremium(false);
      }
    }

    if (callback) {
      pendingActionRef.current = callback;
    }
    setShowIdentityModal(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setShowIdentityModal(false);
    pendingActionRef.current = null;
  }, []);

  const openSubscriptionModal = useCallback(() => {
    setShowSubscriptionModal(true);
  }, []);

  const closeSubscriptionModal = useCallback(() => {
    setShowSubscriptionModal(false);
  }, []);

  const upgradeToPremium = useCallback(() => {
    setIsPremium(true);
    localStorage.setItem(LS_STUDENT_PREMIUM, 'true');
    setShowSubscriptionModal(false);
  }, []);

  const downgradeToFree = useCallback(() => {
    setIsPremium(false);
    localStorage.removeItem(LS_STUDENT_PREMIUM);
  }, []);

  const executePendingAction = (newUserId?: string) => {
    if (pendingActionRef.current) {
      const action = pendingActionRef.current;
      pendingActionRef.current = null;
      action(newUserId);
    }
  };

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to sign in.');
    }

    const { userId: returnedId, name, email: returnedEmail, role: returnedRole, isInstructor, isPremium: returnedPremium } = data;
    const isPro = Boolean(returnedPremium || returnedRole === 'ADMIN' || returnedRole === 'EDUCATOR');

    // Immediately persist and sync ref before executing any callback
    userIdRef.current = returnedId;
    localStorage.setItem(LS_STUDENT_ID, returnedId);
    localStorage.setItem(LS_STUDENT_NAME, name || returnedEmail);
    localStorage.setItem(LS_STUDENT_EMAIL, returnedEmail);
    localStorage.setItem(LS_STUDENT_ROLE, returnedRole || 'STUDENT');

    if (isPro) {
      localStorage.setItem(LS_STUDENT_PREMIUM, 'true');
      setIsPremium(true);
    } else {
      localStorage.removeItem(LS_STUDENT_PREMIUM);
      setIsPremium(false);
    }

    // Initialize 24-hour rolling session & cookies
    refreshSessionExpiry();
    renewSessionCookies(returnedId, returnedRole || 'STUDENT', isPro);

    setUserId(returnedId);
    setStudentName(name || returnedEmail.split('@')[0]);
    setStudentEmail(returnedEmail);
    setRole(returnedRole || 'STUDENT');
    setShowIdentityModal(false);

    syncUserProgressToStore(returnedId);
    executePendingAction(returnedId);
    const isInst = returnedRole === 'EDUCATOR' || returnedRole === 'ADMIN' || Boolean(isInstructor);
    const isAdm = returnedRole === 'ADMIN';
    return { isInstructor: isInst, isAdmin: isAdm, userId: returnedId, isPremium: isPro };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to register.');
    }

    const { userId: returnedId, name: returnedName, email: returnedEmail, role: returnedRole, isPremium: returnedPremium } = data;
    const isPro = Boolean(returnedPremium || returnedRole === 'ADMIN' || returnedRole === 'EDUCATOR');

    userIdRef.current = returnedId;
    localStorage.setItem(LS_STUDENT_ID, returnedId);
    localStorage.setItem(LS_STUDENT_NAME, returnedName || returnedEmail);
    localStorage.setItem(LS_STUDENT_EMAIL, returnedEmail);
    localStorage.setItem(LS_STUDENT_ROLE, returnedRole || 'STUDENT');

    if (isPro) {
      localStorage.setItem(LS_STUDENT_PREMIUM, 'true');
      setIsPremium(true);
    }

    // Initialize 24-hour rolling session & cookies
    refreshSessionExpiry();
    renewSessionCookies(returnedId, returnedRole || 'STUDENT', isPro);

    setUserId(returnedId);
    setStudentName(returnedName || returnedEmail.split('@')[0]);
    setStudentEmail(returnedEmail);
    setRole(returnedRole || 'STUDENT');
    setShowIdentityModal(false);

    syncUserProgressToStore(returnedId);
    executePendingAction(returnedId);
    return { userId: returnedId };
  }, []);

  // Sliding session extension: whenever user revisits, focuses tab, or stays active
  useEffect(() => {
    if (!userId) return;

    const handleActivity = () => {
      if (!isSessionValid()) {
        clearAuthStorage();
        userIdRef.current = null;
        setUserId(null);
        setStudentName(null);
        setStudentEmail(null);
        setRole(null);
        setIsPremium(false);
      } else {
        // Slide 24-hour expiry forward from this active moment
        refreshSessionExpiry();
        const storedRole = (localStorage.getItem(LS_STUDENT_ROLE) as UserRole) || 'STUDENT';
        renewSessionCookies(userId, storedRole, isPremium);
      }
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        handleActivity();
      }
    };

    window.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('focus', handleActivity);

    // Periodic check every 15 minutes while active
    const interval = setInterval(handleActivity, 15 * 60 * 1000);

    return () => {
      window.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('focus', handleActivity);
      clearInterval(interval);
    };
  }, [userId, isPremium]);

  const logout = useCallback(() => {
    // 1. Clear credentials & local preferences
    clearAuthStorage();
    try {
      localStorage.clear();
    } catch {}

    try {
      sessionStorage.clear();
    } catch {}

    setIsPremium(false);

    // 2. Clear all cookies
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        document.cookie = `${name}=; path=/; domain=${window.location.hostname}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
      }
    }

    // 3. Clear Browser CacheStorage API (Service Worker & HTTP Caches)
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      } catch {}
    }

    // 4. Clear Zustand stores
    try {
      useAITutorStore.getState().resetChat();
      useCircuitStore.getState().clearCircuit();
    } catch {}

    // 5. Reset React context state and synchronous refs
    userIdRef.current = null;
    pendingActionRef.current = null;
    setUserId(null);
    setStudentName(null);
    setStudentEmail(null);
    setRole(null);

    // 6. Hard reload or redirect to cleanly refresh all client memory
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/instructor') ||
        currentPath.startsWith('/admin')
      ) {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
  }, []);

  const isInstructor = role === 'EDUCATOR' || role === 'ADMIN' || (role as string) === 'INSTRUCTOR';
  const isAdmin = role === 'ADMIN';
  const effectiveIsPremium = isPremium || isAdmin || isInstructor;

  return (
    <StudentContext.Provider
      value={{
        userId,
        studentName,
        studentEmail,
        role,
        isIdentified: !!userId,
        isAdmin,
        isInstructor,
        isPremium: effectiveIsPremium,
        isLoading,
        showIdentityModal,
        showSubscriptionModal,
        openLoginModal,
        closeLoginModal,
        openSubscriptionModal,
        closeSubscriptionModal,
        upgradeToPremium,
        downgradeToFree,
        login,
        register,
        logout,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
