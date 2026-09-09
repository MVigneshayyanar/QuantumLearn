'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { useAITutorStore } from '@/lib/state-store';
import { useStudentContext } from '@/lib/student-context';
import {
  Atom,
  Cpu,
  Globe,
  LayoutDashboard,
  Bot,
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown,
  Terminal,
  LogOut,
  GraduationCap,
  User
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language } = useAccessibility();
  const { isOpen, setIsOpen } = useAITutorStore();
  const { userId, studentName, isInstructor, logout, openLoginModal } = useStudentContext();
  const t = translations[language];

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Atom },
    { href: '/simulator', label: t.nav.simulator, icon: Cpu },
    { href: '/practice', label: t.nav.practice, icon: Terminal },
    { href: '/bloch-sphere', label: t.nav.blochSphere, icon: Globe },
  ];

  const algoLinks = [
    { href: '/learn/deutsch-jozsa', label: 'Deutsch-Jozsa', icon: BookOpen },
    { href: '/learn/grover', label: 'Grover', icon: Sparkles },
    { href: '/learn/teleportation', label: 'Teleportation', icon: Layers },
    { href: '/learn/superdense-coding', label: 'Superdense', icon: Layers },
  ];

  // Hide Navbar on full-screen practice solve workbench
  if (pathname.startsWith('/practice/') && pathname !== '/practice') {
    return null;
  }

  return (
    <>
    <header className="bg-white border-b border-dark-200 sticky top-0 z-30 shadow-subtle">
      <div className="w-full mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Atom className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg text-dark-900 tracking-tight whitespace-nowrap">
                {t.nav.brand}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100 whitespace-nowrap shrink-0">
                Multi-Simulator
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1 shrink-0" aria-label="Main Navigation">
            {navLinks.slice(0, 2).map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-600' : 'text-dark-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Algorithms Dropdown */}
            <div className="relative group shrink-0">
              <button
                className={`px-2.5 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  pathname.startsWith('/learn')
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50'
                }`}
              >
                <BookOpen className={`w-4 h-4 shrink-0 ${pathname.startsWith('/learn') ? 'text-primary-600' : 'text-dark-500'}`} />
                <span>{t.nav.algorithms}</span>
                <ChevronDown className="w-3.5 h-3.5 text-dark-500 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-52 bg-white border border-dark-200 rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top scale-95 group-hover:scale-100">
                <div className="py-1.5 flex flex-col">
                  {algoLinks.map(algo => {
                    const isAlgoActive = pathname === algo.href;
                    return (
                      <Link
                        key={algo.href}
                        href={algo.href}
                        className={`px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                          isAlgoActive 
                            ? 'bg-primary-50 text-primary-700 font-semibold' 
                            : 'text-dark-700 hover:bg-dark-50 hover:text-dark-900'
                        }`}
                      >
                        <algo.icon className={`w-4 h-4 shrink-0 ${isAlgoActive ? 'text-primary-600' : 'text-dark-500'}`} />
                        <span>{algo.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {navLinks.slice(2).map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-2.5 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-600' : 'text-dark-500'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* AI Tutor Drawer Button & Auth Controls */}
          <div className="flex items-center gap-1.5 lg:gap-2 shrink-0">
            {isInstructor && (
              <Link
                href="/instructor"
                className={`h-10 px-3 rounded-xl border text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-colors shadow-2xs shrink-0 ${
                  pathname.startsWith('/instructor')
                    ? 'bg-primary-600 text-white border-primary-600 ring-2 ring-primary-500/20'
                    : 'bg-primary-50 hover:bg-primary-100 text-primary-800 border-primary-200'
                }`}
                title="Instructor Portal & Student Analytics"
              >
                <GraduationCap className="w-4 h-4 text-primary-600 shrink-0" />
                <span className="hidden xl:inline">Instructor Portal</span>
                <span className="xl:hidden">Instructor</span>
              </Link>
            )}

            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="h-10 px-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-all hover:shadow-card shrink-0"
              aria-label="Toggle Schrödinger AI"
            >
              <Bot className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">{t.nav.aiTutor}</span>
              <span className="xl:hidden">AI Tutor</span>
            </button>

            {userId ? (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-dark-200 shrink-0">
                <Link
                  href="/dashboard"
                  className={`h-10 px-2.5 lg:px-3 rounded-xl border flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${
                    pathname === '/dashboard'
                      ? 'bg-primary-50 border-primary-300 text-primary-900 ring-2 ring-primary-500/20 shadow-xs'
                      : 'border-dark-200 hover:border-dark-300 hover:bg-dark-50 text-dark-800'
                  }`}
                  title="Open Student Dashboard & Progress"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0">
                    {(studentName || 'S').charAt(0).toUpperCase()}
                  </div>
                  <span className="font-semibold text-xs text-dark-900 max-w-[70px] xl:max-w-[105px] truncate">
                    {studentName}
                  </span>
                  <span className="text-[10px] font-bold text-primary-700 bg-primary-100/70 border border-primary-200 px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                    <LayoutDashboard className="w-3 h-3 text-primary-600 shrink-0" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </span>
                </Link>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="h-10 w-10 rounded-xl border border-dark-200 hover:border-red-200 hover:bg-red-50 text-dark-400 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-dark-200 shrink-0">
                <button
                  onClick={() => openLoginModal()}
                  className="h-10 px-3.5 rounded-xl border border-dark-200 hover:border-dark-300 hover:bg-dark-50 text-dark-700 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors shrink-0"
                  title="Sign in to view your dashboard"
                >
                  <User className="w-3.5 h-3.5 text-dark-500" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-dark-200 z-50 flex justify-around items-center h-16 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          pathname === '/' ? 'text-primary-600' : 'text-dark-500 hover:text-dark-700'
        }`}
      >
        <Atom className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      <Link
        href="/simulator"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          pathname === '/simulator' ? 'text-primary-600' : 'text-dark-500 hover:text-dark-700'
        }`}
      >
        <Cpu className="w-5 h-5" />
        <span className="text-[10px] font-medium">Simulator</span>
      </Link>

      <Link
        href="/learn/deutsch-jozsa"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          pathname.startsWith('/learn') ? 'text-primary-600' : 'text-dark-500 hover:text-dark-700'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] font-medium">Algorithms</span>
      </Link>

      <Link
        href="/practice"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          pathname.startsWith('/practice') ? 'text-primary-600' : 'text-dark-500 hover:text-dark-700'
        }`}
      >
        <Terminal className="w-5 h-5" />
        <span className="text-[10px] font-medium">Practice</span>
      </Link>

      {/* Profile & Dashboard combined */}
      {userId ? (
        <Link
          href="/dashboard"
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            pathname === '/dashboard' ? 'text-primary-600' : 'text-dark-500 hover:text-dark-700'
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[10px] font-bold">
            {(studentName || 'S').charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
      ) : (
        <button
          onClick={() => openLoginModal()}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-dark-500 hover:text-dark-700 transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-[10px] font-medium">Sign In</span>
        </button>
      )}
    </nav>
    </>
  );
}
