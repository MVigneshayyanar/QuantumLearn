'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/lib/accessibility-context';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  variant?: 'navbar' | 'bar';
  className?: string;
}

export function ThemeToggle({ variant = 'navbar', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    if (variant === 'bar') {
      return (
        <div className={`h-6 w-20 rounded bg-dark-100 animate-pulse ${className}`} />
      );
    }
    return (
      <div className={`w-10 h-10 rounded-xl bg-dark-100 animate-pulse shrink-0 ${className}`} />
    );
  }

  if (variant === 'bar') {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs font-medium transition-colors cursor-pointer ${
          isDark
            ? 'bg-amber-500/15 border-amber-500/30 text-amber-300 hover:bg-amber-500/25'
            : 'bg-white border-dark-200 text-dark-700 hover:bg-dark-100 hover:text-dark-900'
        } ${className}`}
      >
        {isDark ? (
          <>
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Dark Theme</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-dark-600" />
            <span>Light Theme</span>
          </>
        )}
      </button>
    );
  }

  // Default 'navbar' variant
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      className={`relative group w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 select-none cursor-pointer shrink-0 ${
        isDark
          ? 'bg-dark-800 border-dark-700 hover:border-amber-400/50 hover:bg-dark-700 text-amber-300 shadow-2xs hover:shadow-[0_0_12px_rgba(251,191,36,0.25)]'
          : 'bg-white border-dark-200 hover:border-dark-300 hover:bg-dark-50 text-dark-700 hover:text-dark-900 shadow-2xs'
      } ${className}`}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-all duration-300 group-hover:rotate-45 group-hover:scale-110 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
        ) : (
          <Moon className="w-4 h-4 text-dark-600 transition-all duration-300 group-hover:-rotate-12 group-hover:text-primary-600 group-hover:scale-110" />
        )}
      </div>
      <span className="sr-only">
        {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      </span>
    </button>
  );
}
