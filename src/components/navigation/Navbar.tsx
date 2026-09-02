'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccessibility } from '@/lib/accessibility-context';
import { translations } from '@/lib/i18n';
import { useAITutorStore } from '@/lib/state-store';
import { Atom, Cpu, Globe, LayoutDashboard, Bot, Sparkles, BookOpen, Layers } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { language } = useAccessibility();
  const { isOpen, setIsOpen } = useAITutorStore();
  const t = translations[language];

  const navLinks = [
    { href: '/', label: 'Home', icon: Atom },
    { href: '/simulator', label: t.nav.simulator, icon: Cpu },
    { href: '/bloch-sphere', label: t.nav.blochSphere, icon: Globe },
    { href: '/learn/deutsch-jozsa', label: 'Deutsch-Jozsa', icon: BookOpen },
    { href: '/learn/grover', label: 'Grover', icon: Sparkles },
    { href: '/learn/teleportation', label: 'Teleportation', icon: Layers },
    { href: '/learn/superdense-coding', label: 'Superdense', icon: Layers },
    { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
  ];

  return (
    <header className="bg-white border-b border-dark-200 sticky top-0 z-30 shadow-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Atom className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-lg text-dark-900 tracking-tight">
                {t.nav.brand}
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 border border-primary-100">
                Qiskit 2.5
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold'
                      : 'text-dark-700 hover:text-dark-900 hover:bg-dark-50'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-dark-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* AI Tutor Drawer Button */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-xs transition-all hover:shadow-card"
              aria-label="Toggle Socratic AI Tutor"
            >
              <Bot className="w-4 h-4" />
              <span>{t.nav.aiTutor}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
