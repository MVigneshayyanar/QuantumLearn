'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentContext } from '@/lib/student-context';
import {
  Atom,
  ArrowRight,
  Loader2,
  X,
  Lock,
  Mail,
  User
} from 'lucide-react';

export function StudentIdentityModal() {
  const router = useRouter();
  const { showIdentityModal, closeLoginModal, login, register } = useStudentContext();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!showIdentityModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!trimmedPassword || trimmedPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const trimmedName = name.trim();
        if (!trimmedName || trimmedName.length < 2) {
          setError('Please enter your name (at least 2 characters).');
          setIsSubmitting(false);
          return;
        }
        await register(trimmedName, trimmedEmail, trimmedPassword);
      } else {
        const res = await login(trimmedEmail, trimmedPassword);
        if (res.isAdmin) {
          router.push('/admin');
        } else if (res.isInstructor) {
          router.push('/instructor');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm animate-fadeIn p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white dark:bg-dark-900 rounded-3xl border border-dark-200 dark:border-dark-800 shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Close Button */}
        <button
          onClick={closeLoginModal}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 hover:bg-dark-100 dark:hover:bg-dark-800 transition-colors cursor-pointer"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Container */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-5 flex-1">
          {/* Modal Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center mx-auto shadow-md shadow-primary-500/20">
              <Atom className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                {mode === 'signin' ? 'Sign In to QLearn' : 'Create Student Account'}
              </h2>
              <p className="text-xs text-dark-500 dark:text-dark-400 mt-0.5">
                Sign in to submit your quantum circuits to the judge and track progress.
              </p>
            </div>
          </div>

          {/* Tab Switcher: Sign In vs Sign Up */}
          <div className="flex rounded-xl bg-dark-100 dark:bg-dark-800 p-1 text-xs font-semibold border border-dark-200/40 dark:border-dark-700/60">
            <button
              type="button"
              onClick={() => {
                setMode('signin');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-xs font-bold'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-dark-700 text-dark-900 dark:text-white shadow-xs font-bold'
                  : 'text-dark-600 dark:text-dark-400 hover:text-dark-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium animate-fadeIn">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-dark-700 dark:text-dark-300">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Marie Curie"
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-xs text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-dark-700 dark:text-dark-300">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-xs text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-dark-700 dark:text-dark-300">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-dark-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-xs text-dark-900 dark:text-white placeholder:text-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-primary-600 hover:bg-primary-700 active:bg-primary-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all hover:shadow-card cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'signin' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials */}
          {mode === 'signin' && (
            <div className="pt-2 border-t border-dark-100 dark:border-dark-800 space-y-2">
              <span className="text-[11px] font-semibold text-dark-500 dark:text-dark-400 block text-center">
                Quick Sign-In Accounts:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('admin@qlearn.com');
                    setPassword('admin123');
                  }}
                  className="py-1.5 px-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-semibold text-[11px] border border-purple-200 dark:border-purple-800/60 transition-colors text-center cursor-pointer"
                >
                  Admin Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('instructor@qlearn.com');
                    setPassword('qlearn123');
                  }}
                  className="py-1.5 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-[11px] border border-indigo-200 dark:border-indigo-800/60 transition-colors text-center cursor-pointer"
                >
                  Instructor Demo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('student@qlearn.com');
                    setPassword('student123');
                  }}
                  className="py-1.5 px-2 rounded-xl bg-primary-50 dark:bg-primary-950/60 hover:bg-primary-100 dark:hover:bg-primary-900/60 text-primary-700 dark:text-primary-300 font-semibold text-[11px] border border-primary-200 dark:border-primary-800/60 transition-colors text-center cursor-pointer"
                >
                  Student Demo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
