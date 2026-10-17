'use client';

import React, { useState, useMemo } from 'react';
import { Search, BookA } from 'lucide-react';
import { GLOSSARY_TERMS } from '@/lib/quantum-academy-data';

export function GlossaryView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const set = new Set<string>();
    GLOSSARY_TERMS.forEach(t => set.add(t.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter(term => {
      const matchesSearch = 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (term.formula && term.formula.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat = selectedCategory === 'All' || term.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search & Header Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-primary-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-dark-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-semibold backdrop-blur-xs border border-white/10 mb-2">
              <BookA className="w-3.5 h-3.5 text-cyan-400" />
              <span>160+ Formal Definitions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Quantum Glossary &amp; Index
            </h2>
            <p className="text-xs sm:text-sm text-dark-300 mt-1 max-w-2xl leading-relaxed">
              Comprehensive reference covering quantum mechanics, quantum logic gates, complexity theory, and hardware physics.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search terms, gates, formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/10 text-white placeholder-dark-300 border border-white/20 focus:outline-none focus:border-cyan-400 transition-colors text-xs sm:text-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-dark-950 font-bold shadow-card'
                  : 'bg-white/10 text-dark-200 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTerms.map((t, idx) => (
          <div
            key={idx}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 font-mono text-[10px] font-bold border border-cyan-200 dark:border-cyan-800/60">
                  {t.category}
                </span>
              </div>
              <h3 className="text-base font-bold text-dark-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {t.term}
              </h3>
              <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-300 mt-2 leading-relaxed font-article">
                {t.definition}
              </p>
            </div>

            {t.formula && (
              <div className="mt-4 pt-3 border-t border-dark-100 dark:border-dark-800 font-mono text-xs text-primary-700 dark:text-cyan-400 bg-dark-50 dark:bg-dark-950 px-3 py-2 rounded-xl overflow-x-auto notranslate">
                {t.formula}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="p-12 text-center text-dark-400 rounded-3xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 shadow-xs">
          No quantum terms matching &quot;{searchQuery}&quot;. Try another search term or filter category.
        </div>
      )}
    </div>
  );
}
