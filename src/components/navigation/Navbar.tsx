'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  User,
  ShieldCheck,
  UserCheck,
  Crown,
  Info
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language } = useAccessibility();
  const { isOpen, setIsOpen } = useAITutorStore();
  const {
    userId,
    studentName,
    studentEmail,
    role,
    isAdmin,
    isInstructor,
    isPremium,
    openSubscriptionModal,
    logout,
    openLoginModal
  } = useStudentContext();
  const t = translations[language];

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { href: '/', label: t.nav.home, icon: Atom },
    { href: '/bloch-sphere', label: t.nav.blochSphere, icon: Globe },
    { href: '/practice', label: t.nav.practice, icon: Terminal },
    { href: '/simulator', label: t.nav.simulator, icon: Cpu },
    { href: '/about', label: 'About', icon: Info },
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
    <header className="bg-white dark:bg-dark-900/95 dark:border-dark-800 border-b border-dark-200 sticky top-0 z-50 backdrop-blur-md shadow-subtle">
      <div className="w-full mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Atom className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg text-dark-900 dark:text-white tracking-tight whitespace-nowrap">
                {t.nav.brand}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-100 dark:border-primary-800/60 whitespace-nowrap shrink-0">
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
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-200 font-semibold'
                      : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Algorithms Dropdown */}
            <div className="relative group shrink-0">
              <button
                className={`px-2.5 lg:px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  pathname.startsWith('/learn')
                    ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-200 font-semibold'
                    : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
                }`}
              >
                <BookOpen className={`w-4 h-4 shrink-0 ${pathname.startsWith('/learn') ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'}`} />
                <span>{t.nav.algorithms}</span>
                <ChevronDown className="w-3.5 h-3.5 text-dark-500 dark:text-dark-400 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden transform origin-top scale-95 group-hover:scale-100">
                <div className="py-1.5 flex flex-col">
                  {algoLinks.map(algo => {
                    const isAlgoActive = pathname === algo.href;
                    return (
                      <Link
                        key={algo.href}
                        href={algo.href}
                        className={`px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors whitespace-nowrap ${
                          isAlgoActive 
                            ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-200 font-semibold' 
                            : 'text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                        }`}
                      >
                        <algo.icon className={`w-4 h-4 shrink-0 ${isAlgoActive ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'}`} />
                        <span>{algo.label}</span>
                      </Link>
                    );
                  })}

                  {/* More Algorithms Coming Soon */}
                  <div className="border-t border-dark-100 dark:border-dark-700 mt-1 pt-1">
                    <div className="px-4 py-2 flex items-center justify-between text-xs bg-dark-50/60 dark:bg-dark-800/60 select-none">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="font-medium text-dark-700 dark:text-dark-300">More Algorithms</span>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700/60 shrink-0">
                        Coming Soon
                      </span>
                    </div>
                  </div>
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
                      ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-200 font-semibold'
                      : 'text-dark-700 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* AI Tutor Drawer Button & Auth Controls */}
          <div className="flex items-center gap-2 shrink-0">
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

            {/* Profile Dropdown or Sign In */}
            {studentEmail ? (
              <div className="relative shrink-0" ref={profileDropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                  className={`h-10 px-2.5 rounded-xl border flex items-center gap-2 transition-all select-none cursor-pointer ${
                    profileDropdownOpen
                      ? 'bg-dark-100 dark:bg-dark-800 border-dark-300 dark:border-dark-600 shadow-xs ring-2 ring-primary-500/20'
                      : 'border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600 hover:bg-dark-50 dark:hover:bg-dark-800 bg-white dark:bg-dark-900'
                  }`}
                  title="Open user profile menu"
                >
                  <div
                    className={`w-7 h-7 rounded-lg text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0 ${
                      isAdmin
                        ? 'bg-purple-600'
                        : isInstructor
                        ? 'bg-indigo-600'
                        : 'bg-primary-600'
                    }`}
                  >
                    {(studentName || 'U').charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col items-start text-left leading-tight hidden sm:flex">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs text-dark-900 dark:text-white max-w-[90px] xl:max-w-[120px] truncate">
                        {studentName}
                      </span>
                      {isPremium && !isAdmin && !isInstructor && (
                        <Crown className="w-3 h-3 text-amber-500 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider ${
                        isAdmin
                          ? 'text-purple-700 dark:text-purple-400'
                          : isInstructor
                          ? 'text-indigo-700 dark:text-indigo-400'
                          : isPremium
                          ? 'text-amber-700 dark:text-amber-400 font-black'
                          : 'text-primary-700 dark:text-primary-400'
                      }`}
                    >
                      {isAdmin ? 'Admin' : isInstructor ? 'Instructor' : isPremium ? 'Pro Student' : 'Student'}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-dark-400 transition-transform duration-200 ${
                      profileDropdownOpen ? 'rotate-180 text-dark-800 dark:text-dark-200' : ''
                    }`}
                  />
                </button>

                {/* Dropdown Floating Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-700 rounded-2xl shadow-xl z-50 p-2 animate-fadeIn text-xs">
                    {/* User Header Info */}
                    <div className="p-2.5 rounded-xl bg-dark-50/80 dark:bg-dark-800/90 mb-1 border border-dark-100 dark:border-dark-700">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 ${
                            isAdmin
                              ? 'bg-purple-600'
                              : isInstructor
                              ? 'bg-indigo-600'
                              : 'bg-primary-600'
                          }`}
                        >
                          {(studentName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden leading-tight">
                          <p className="font-bold text-xs text-dark-900 dark:text-white truncate">{studentName}</p>
                          <p className="text-[11px] text-dark-500 dark:text-dark-400 font-mono truncate">{studentEmail}</p>
                        </div>
                      </div>

                      <div className="mt-2 pt-1.5 border-t border-dark-200/60 dark:border-dark-700/60 flex items-center justify-between">
                        <span className="text-[10px] text-dark-500 dark:text-dark-400 font-medium">Role:</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-transparent dark:border-purple-800/60'
                              : isInstructor
                              ? 'bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-transparent dark:border-indigo-800/60'
                              : isPremium
                              ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/70'
                              : 'bg-primary-100 dark:bg-primary-950/70 text-primary-800 dark:text-primary-300 border border-transparent dark:border-primary-800/60'
                          }`}
                        >
                          {isAdmin
                            ? 'System Administrator'
                            : isInstructor
                            ? 'Verified Instructor'
                            : isPremium
                            ? '👑 Pro Student Learner'
                            : 'Student Learner'}
                        </span>
                      </div>
                    </div>

                    {/* Role-Specific Navigation Menu Items */}
                    <div className="py-1 space-y-0.5">
                      {/* ADMIN ROLE */}
                      {isAdmin ? (
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                            pathname.startsWith('/admin')
                              ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold border border-purple-200/60 dark:border-purple-800/60'
                              : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                          }`}
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-dark-900 dark:text-white">Admin Dashboard</span>
                            <span className="text-[10px] text-dark-500 dark:text-dark-400">User & cohort management</span>
                          </div>
                        </Link>
                      ) : isInstructor ? (
                        /* INSTRUCTOR ROLE */
                        <>
                          <Link
                            href="/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                              pathname === '/dashboard'
                                ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-900 dark:text-primary-200 font-bold border border-primary-200/60 dark:border-primary-800/60'
                                : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                            }`}
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-dark-900 dark:text-white">Personal Record</span>
                              <span className="text-[10px] text-dark-500 dark:text-dark-400">Your personal learning journey</span>
                            </div>
                          </Link>

                          <Link
                            href="/instructor"
                            onClick={() => setProfileDropdownOpen(false)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                              pathname.startsWith('/instructor')
                                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200 font-bold border border-indigo-200/60 dark:border-indigo-800/60'
                                : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                            }`}
                          >
                            <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-dark-900 dark:text-white">Student Record</span>
                              <span className="text-[10px] text-dark-500 dark:text-dark-400">Class roster & AI analytics</span>
                            </div>
                          </Link>
                        </>
                      ) : (
                        /* NORMAL USER / STUDENT ROLE */
                        <Link
                          href="/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors ${
                            pathname === '/dashboard'
                              ? 'bg-primary-50 dark:bg-primary-950/60 text-primary-900 dark:text-primary-200 font-bold border border-primary-200/60 dark:border-primary-800/60'
                              : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800 hover:text-dark-900 dark:hover:text-white'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4 text-primary-600 dark:text-primary-400 shrink-0" />
                          <div className="flex flex-col">
                            <span className="font-semibold text-xs text-dark-900 dark:text-white">Dashboard</span>
                            <span className="text-[10px] text-dark-500 dark:text-dark-400">Your learning & progress</span>
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Pro Subscription Status / Upgrade Card */}
                    <div className="pt-1 mt-1 border-t border-dark-100 dark:border-dark-700">
                      {!isPremium ? (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openSubscriptionModal();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-amber-900 dark:text-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-200/80 dark:border-amber-700/50 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 transition-colors font-semibold text-xs cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-400 shrink-0" />
                            <div className="flex flex-col text-left">
                              <span className="font-bold text-[11px] text-amber-950 dark:text-amber-200">Upgrade to Pro</span>
                              <span className="text-[9px] text-amber-700 dark:text-amber-400">Unlock all questions & AI</span>
                            </div>
                          </div>
                          <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded shadow-2xs">
                            PRO
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            openSubscriptionModal();
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-600/40 hover:bg-amber-500/20 dark:hover:bg-amber-950/60 transition-colors text-[11px] font-bold cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-400" />
                            <span className="text-amber-950 dark:text-amber-200 font-bold">QLearn Pro Member</span>
                          </div>
                          <span className="text-[10px] text-amber-700 dark:text-amber-400 underline font-semibold">Manage</span>
                        </button>
                      )}
                    </div>

                    {/* Sign Out Action */}
                    <div className="pt-1 mt-1 border-t border-dark-100 dark:border-dark-700">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-dark-600 dark:text-dark-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors font-semibold text-xs"
                      >
                        <LogOut className="w-4 h-4 text-dark-400 group-hover:text-red-600 dark:text-dark-400 dark:group-hover:text-red-400" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-dark-200 dark:border-dark-700 shrink-0">
                <button
                  onClick={() => openLoginModal()}
                  className="h-10 px-3.5 rounded-xl border border-dark-200 dark:border-dark-700 hover:border-dark-300 dark:hover:border-dark-600 hover:bg-dark-50 dark:hover:bg-dark-800 bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-200 text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-colors shrink-0"
                  title="Sign in to view your dashboard"
                >
                  <User className="w-3.5 h-3.5 text-dark-500 dark:text-dark-400" />
                  <span>Sign In</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Bottom Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-dark-900 border-t border-dark-200 dark:border-dark-800 z-50 flex justify-around items-center h-16 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link
        href="/"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          pathname === '/' ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400 hover:text-dark-700 dark:hover:text-dark-200'
        }`}
      >
        <Atom className="w-5 h-5" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>

      <Link
        href="/bloch-sphere"
        className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
          pathname === '/bloch-sphere' ? 'text-primary-600' : 'text-dark-500 hover:text-dark-700'
        }`}
      >
        <Globe className="w-5 h-5" />
        <span className="text-[10px] font-medium">Bloch Sphere</span>
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
          href={isAdmin ? '/admin' : isInstructor ? '/instructor' : '/dashboard'}
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            pathname === '/dashboard' || pathname.startsWith('/admin') || pathname.startsWith('/instructor')
              ? 'text-primary-600'
              : 'text-dark-500 hover:text-dark-700'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${
              isAdmin ? 'bg-purple-600' : isInstructor ? 'bg-indigo-600' : 'bg-primary-600'
            }`}
          >
            {(studentName || 'U').charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] font-medium">
            {isAdmin ? 'Admin' : isInstructor ? 'Class' : 'Dashboard'}
          </span>
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
