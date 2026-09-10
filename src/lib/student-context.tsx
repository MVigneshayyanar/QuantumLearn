/**
 * Student & Auth Identity Context
 *
 * Provides authentication state for the app.
 * Allows guest browsing, but gates "Submit & Verify Circuit" (Build It)
 * and "Submit Solution to Judge" (Practice) until signed in / signed up.
 * Supports the special Instructor account: instructor@qlearn.com / qlearn123.
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

  // On mount, check localStorage for existing identity
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

      setIsPremium(storedPremium);

      if (storedId) {
        userIdRef.current = storedId;
        setUserId(storedId);
        setStudentName(storedName || (storedEmail ? storedEmail.split('@')[0] : 'Student'));
        setStudentEmail(storedEmail || '');
        setRole(storedRole);
        if (typeof document !== 'undefined') {
          document.cookie = `ql_user_id=${storedId}; path=/; max-age=604800; SameSite=Lax`;
          document.cookie = `ql_user_role=${storedRole}; path=/; max-age=604800; SameSite=Lax`;
        }
        syncUserProgressToStore(storedId);
      }
    } catch {
      // localStorage not available
    }
    setShowIdentityModal(false);
    setIsLoading(false);
  }, []);

  const openLoginModal = useCallback((callback?: (id?: string) => void) => {
    // GUARD: If already logged in, immediately run the callback and NEVER re-open the modal!
    const currentId =
      userIdRef.current ||
      (typeof window !== 'undefined' ? localStorage.getItem(LS_STUDENT_ID) : null);

    if (currentId) {
      if (callback) {
        callback(currentId);
      }
      return;
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

    const { userId: returnedId, name, email: returnedEmail, role: returnedRole, isInstructor } = data;

    // Immediately persist and sync ref before executing any callback
    userIdRef.current = returnedId;
    localStorage.setItem(LS_STUDENT_ID, returnedId);
    localStorage.setItem(LS_STUDENT_NAME, name || returnedEmail);
    localStorage.setItem(LS_STUDENT_EMAIL, returnedEmail);
    localStorage.setItem(LS_STUDENT_ROLE, returnedRole || 'STUDENT');

    setUserId(returnedId);
    setStudentName(name || returnedEmail.split('@')[0]);
    setStudentEmail(returnedEmail);
    setRole(returnedRole || 'STUDENT');
    setShowIdentityModal(false);

    if (typeof document !== 'undefined') {
      document.cookie = `ql_user_id=${returnedId}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `ql_user_role=${returnedRole || 'STUDENT'}; path=/; max-age=604800; SameSite=Lax`;
    }

    syncUserProgressToStore(returnedId);
    executePendingAction(returnedId);
    const isInst = returnedRole === 'EDUCATOR' || returnedRole === 'ADMIN' || Boolean(isInstructor);
    const isAdm = returnedRole === 'ADMIN';
    return { isInstructor: isInst, isAdmin: isAdm, userId: returnedId };
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

    const { userId: returnedId, name: returnedName, email: returnedEmail, role: returnedRole } = data;

    userIdRef.current = returnedId;
    localStorage.setItem(LS_STUDENT_ID, returnedId);
    localStorage.setItem(LS_STUDENT_NAME, returnedName || returnedEmail);
    localStorage.setItem(LS_STUDENT_EMAIL, returnedEmail);
    localStorage.setItem(LS_STUDENT_ROLE, returnedRole || 'STUDENT');

    setUserId(returnedId);
    setStudentName(returnedName || returnedEmail.split('@')[0]);
    setStudentEmail(returnedEmail);
    setRole(returnedRole || 'STUDENT');
    setShowIdentityModal(false);

    if (typeof document !== 'undefined') {
      document.cookie = `ql_user_id=${returnedId}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `ql_user_role=${returnedRole || 'STUDENT'}; path=/; max-age=604800; SameSite=Lax`;
    }

    syncUserProgressToStore(returnedId);
    executePendingAction(returnedId);
    return { userId: returnedId };
  }, []);

  const logout = useCallback(() => {
    // 1. Clear credentials
    localStorage.removeItem(LS_STUDENT_ID);
    localStorage.removeItem(LS_STUDENT_NAME);
    localStorage.removeItem(LS_STUDENT_EMAIL);
    localStorage.removeItem(LS_STUDENT_ROLE);
    localStorage.removeItem(LS_STUDENT_PREMIUM);
    setIsPremium(false);

    // Clear cookies
    if (typeof document !== 'undefined') {
      document.cookie = 'ql_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
      document.cookie = 'ql_user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;';
    }

    // 2. Clear practice problem progress & history caches
    localStorage.removeItem('ql_practice_solved');
    localStorage.removeItem('ql_practice_attempted');
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('ql_practice_history_') ||
            key.startsWith('ql_code_') ||
            key.startsWith('ql_quiz_result_'))
        ) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {}

    // 3. Clear Zustand stores
    useAITutorStore.getState().resetChat();
    useCircuitStore.getState().clearCircuit();

    // 4. Reset React context state
    setUserId(null);
    setStudentName(null);
    setStudentEmail(null);
    setRole(null);

    // 5. If on protected route, redirect to home
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      if (
        currentPath.startsWith('/dashboard') ||
        currentPath.startsWith('/instructor') ||
        currentPath.startsWith('/admin')
      ) {
        window.location.href = '/';
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
