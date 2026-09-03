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
  isInstructor: boolean;
  isLoading: boolean;
  showIdentityModal: boolean;
  openLoginModal: (callback?: (id?: string) => void) => void;
  closeLoginModal: () => void;
  login: (email: string, password: string) => Promise<{ isInstructor: boolean; userId: string }>;
  register: (name: string, email: string, password: string) => Promise<{ userId: string }>;
  logout: () => void;
}

const StudentContext = createContext<StudentContextValue>({
  userId: null,
  studentName: null,
  studentEmail: null,
  role: null,
  isIdentified: false,
  isInstructor: false,
  isLoading: true,
  showIdentityModal: false,
  openLoginModal: () => {},
  closeLoginModal: () => {},
  login: async () => ({ isInstructor: false, userId: '' }),
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
  const [isLoading, setIsLoading] = useState(true);
  const [showIdentityModal, setShowIdentityModal] = useState(false);

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

      if (storedId) {
        userIdRef.current = storedId;
        setUserId(storedId);
        setStudentName(storedName || (storedEmail ? storedEmail.split('@')[0] : 'Student'));
        setStudentEmail(storedEmail || '');
        setRole(storedRole);
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

    syncUserProgressToStore(returnedId);
    executePendingAction(returnedId);
    return { isInstructor: Boolean(isInstructor), userId: returnedId };
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
    localStorage.setItem(LS_STUDENT_NAME, returnedName);
    localStorage.setItem(LS_STUDENT_EMAIL, returnedEmail);
    localStorage.setItem(LS_STUDENT_ROLE, returnedRole || 'STUDENT');

    setUserId(returnedId);
    setStudentName(returnedName);
    setStudentEmail(returnedEmail);
    setRole(returnedRole || 'STUDENT');
    setShowIdentityModal(false);

    syncUserProgressToStore(returnedId);
    executePendingAction(returnedId);
    return { userId: returnedId };
  }, []);

  const logout = useCallback(() => {
    userIdRef.current = null;

    // 1. Clear all authentication credentials from localStorage
    localStorage.removeItem(LS_STUDENT_ID);
    localStorage.removeItem(LS_STUDENT_NAME);
    localStorage.removeItem(LS_STUDENT_EMAIL);
    localStorage.removeItem(LS_STUDENT_ROLE);

    // 2. Clear practice problem progress & history caches
    localStorage.removeItem('ql_practice_solved');
    localStorage.removeItem('ql_practice_attempted');

    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (
          key &&
          (key.startsWith('ql_practice_history_') ||
            key.startsWith('ql_temp_') ||
            key.startsWith('ql_sim_'))
        ) {
          localStorage.removeItem(key);
        }
      }
    } catch {}

    // 3. Reset in-memory state stores to clean initial state
    useProgressStore.getState().resetProgress();
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
      if (currentPath.startsWith('/dashboard') || currentPath.startsWith('/instructor')) {
        window.location.href = '/';
      }
    }
  }, []);

  return (
    <StudentContext.Provider
      value={{
        userId,
        studentName,
        studentEmail,
        role,
        isIdentified: !!userId,
        isInstructor: role === 'EDUCATOR',
        isLoading,
        showIdentityModal,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        logout,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}
