'use client';

import React from 'react';
import { ExternalLink, BookOpen, Layers, Code, Award, GraduationCap } from 'lucide-react';
import { ACADEMY_RESOURCES, ResourceItem } from '@/lib/quantum-academy-data';

export function ResourcesView() {
  const resourceTypes: ResourceItem['type'][] = [
    'Textbook',
    'Landmark Paper',
    'Framework',
    'Lecture Notes',
  ];

  const getCategoryTitle = (type: ResourceItem['type']) => {
    switch (type) {
      case 'Textbook': return 'Authoritative Textbooks';
      case 'Landmark Paper': return 'Foundational & Breakthrough Papers';
      case 'Framework': return 'Open-Source SDKs & Compilers';
      case 'Lecture Notes': return 'University & Research Lectures';
      default: return type;
    }
  };

  const getCategoryIcon = (type: ResourceItem['type']) => {
    switch (type) {
      case 'Textbook': return <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Landmark Paper': return <Award className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'Framework': return <Code className="w-4 h-4 text-primary-600 dark:text-primary-400" />;
      case 'Lecture Notes': return <GraduationCap className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      default: return <Layers className="w-4 h-4 text-dark-400" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 via-primary-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Curated Academic &amp; Industry Library</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Quantum Computing Resources &amp; Papers
          </h2>
          <p className="text-xs sm:text-sm text-dark-300 leading-relaxed">
            Curated collection of canonical literature, graduate-level textbooks, seminal research papers, and open-source frameworks.
          </p>
        </div>
      </div>

      {resourceTypes.map((type) => {
        const items = ACADEMY_RESOURCES.filter(r => r.type === type);
        if (items.length === 0) return null;

        return (
          <div key={type} className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-dark-900 dark:text-white flex items-center gap-2 border-b border-dark-200 dark:border-dark-800 pb-3">
              {getCategoryIcon(type)}
              <span>{getCategoryTitle(type)}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between group shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-dark-500 font-mono mb-2">
                      <span className="font-semibold">{item.author}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 font-medium">
                        {item.level}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-dark-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed font-article">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {item.type}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 transition-colors"
                    >
                      <span>View Source</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
