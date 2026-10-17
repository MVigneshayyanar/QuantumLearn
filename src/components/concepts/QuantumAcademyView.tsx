'use client';

import React, { useState } from 'react';
import { 
  BookOpen, Cpu, Activity, Play, BookA, FileText, Bookmark, 
  Search, CheckCircle2, ChevronRight, Sparkles, Orbit, Clock
} from 'lucide-react';

import { ACADEMY_LESSONS, Lesson } from '@/lib/quantum-academy-data';
import { LessonReader } from './LessonReader';
import { HardwareLabView } from './HardwareLabView';
import { CharacterizationLabView } from './CharacterizationLabView';
import { PlaygroundView } from './PlaygroundView';
import { GlossaryView } from './GlossaryView';
import { CheatSheetView } from './CheatSheetView';
import { ResourcesView } from './ResourcesView';
import { CircuitBuilder } from '@/components/circuit-builder/CircuitBuilder';

export function QuantumAcademyView() {
  const [activeTab, setActiveTab] = useState<string>('learn');
  const [activeLessonId, setActiveLessonId] = useState<number>(ACADEMY_LESSONS[0].id);
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const sections = [
    { id: 'All', label: 'All Sections' },
    { id: '1', label: '1. Foundations' },
    { id: '2', label: '2. The Qubit' },
    { id: '3', label: '3. Circuits & Algorithms' },
    { id: '4', label: '4. NISQ & Beyond' },
  ];

  const filteredLessons = ACADEMY_LESSONS.filter(lesson => {
    const matchesSection = 
      selectedSection === 'All' || 
      lesson.sectionId.toString() === selectedSection;
    const matchesSearch = 
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.theory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const activeLessonIndex = ACADEMY_LESSONS.findIndex(l => l.id === activeLessonId);
  const currentLesson = ACADEMY_LESSONS[activeLessonIndex] || ACADEMY_LESSONS[0];

  const handleNextLesson = () => {
    if (activeLessonIndex < ACADEMY_LESSONS.length - 1) {
      setActiveLessonId(ACADEMY_LESSONS[activeLessonIndex + 1].id);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonId(ACADEMY_LESSONS[activeLessonIndex - 1].id);
    }
  };

  const navTabs = [
    { id: 'learn', label: 'Learn', icon: BookOpen, badge: '22 Lessons' },
    { id: 'composer', label: 'Circuit Composer', icon: Orbit, badge: 'Interactive' },
    { id: 'hardware', label: 'Hardware Lab', icon: Cpu, badge: '5 Platforms' },
    { id: 'characterization', label: 'Characterization', icon: Activity, badge: 'Physics Lab' },
    { id: 'playground', label: 'Playground', icon: Play, badge: '21 Mini-Labs' },
    { id: 'glossary', label: 'Glossary', icon: BookA, badge: '160+ Terms' },
    { id: 'cheatsheet', label: 'Cheat Sheet', icon: FileText, badge: 'Formulas' },
    { id: 'resources', label: 'Resources', icon: Bookmark, badge: 'Papers' },
  ];

  return (
    <div className="w-full bg-slate-50 dark:bg-dark-950 text-dark-900 dark:text-dark-50 transition-colors">
      {/* Academy Top Hero Banner */}
      <div className="border-b border-dark-200 dark:border-dark-800 bg-white dark:bg-dark-900/80 backdrop-blur-md pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800/60 text-primary-700 dark:text-primary-300 text-xs font-semibold mb-2 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
                <span>QuanBit Quantum Academy</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-dark-900 dark:text-white">
                Quantum Computing Concepts &amp; Interactive Academy
              </h1>
              <p className="text-xs sm:text-sm md:text-base text-dark-600 dark:text-dark-300 mt-1.5 max-w-3xl leading-relaxed">
                A complete, self-contained course in quantum computing: physics, mathematics, a 3D Bloch sphere, a circuit composer, every major algorithm, noise &amp; error correction, and quantum hardware — all interactive directly inside QuanBit.
              </p>
            </div>
          </div>

          {/* Navigation Bar for Academy Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 scrollbar-none border-t border-dark-100 dark:border-dark-800">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer border ${
                    isActive
                      ? 'bg-primary-600 text-white border-primary-500 shadow-card'
                      : 'bg-white dark:bg-dark-900 text-dark-700 dark:text-dark-300 border-dark-200 dark:border-dark-800 hover:bg-dark-50 dark:hover:bg-dark-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary-600 dark:text-primary-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-400'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: LEARN (22 LESSONS) */}
        {activeTab === 'learn' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Sidebar Lesson Tree */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 rounded-3xl p-5 shadow-xs">
                {/* Search */}
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-dark-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search curriculum..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-dark-50 dark:bg-dark-950 text-xs sm:text-sm text-dark-900 dark:text-dark-100 placeholder-dark-400 border border-dark-200 dark:border-dark-800 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                {/* Section filter */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sections.map((sec) => (
                    <button
                      key={sec.id}
                      onClick={() => setSelectedSection(sec.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        selectedSection === sec.id
                          ? 'bg-primary-600 text-white shadow-xs'
                          : 'bg-dark-100 dark:bg-dark-800 text-dark-600 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700'
                      }`}
                    >
                      {sec.label}
                    </button>
                  ))}
                </div>

                {/* Lesson List */}
                <div className="space-y-1.5 max-h-[640px] overflow-y-auto pr-1">
                  {filteredLessons.map((lesson) => {
                    const isSelected = lesson.id === activeLessonId;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonId(lesson.id)}
                        className={`w-full text-left p-3 rounded-2xl transition-all flex items-start gap-3 border ${
                          isSelected
                            ? 'bg-primary-50 dark:bg-primary-950/60 border-primary-500 text-primary-950 dark:text-primary-100 shadow-sm'
                            : 'bg-transparent border-transparent hover:bg-dark-50 dark:hover:bg-dark-800/60 text-dark-700 dark:text-dark-300'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-lg shrink-0 text-xs font-mono font-bold flex items-center justify-center ${
                          isSelected 
                            ? 'bg-primary-600 text-white shadow-xs' 
                            : 'bg-dark-100 dark:bg-dark-800 text-dark-500 dark:text-dark-400'
                        }`}>
                          {lesson.id}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs sm:text-sm font-semibold truncate leading-tight ${
                            isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-dark-800 dark:text-dark-200'
                          }`}>
                            {lesson.title}
                          </div>
                          <div className="text-[11px] text-dark-500 dark:text-dark-400 truncate mt-1 flex items-center gap-1.5">
                            <span>{lesson.sectionTitle}</span>
                            <span>•</span>
                            <Clock className="w-3 h-3 text-dark-400 inline" />
                            <span>{lesson.duration}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Active Lesson Content Viewer */}
            <div className="lg:col-span-8">
              <LessonReader 
                lesson={currentLesson}
                onNext={handleNextLesson}
                onPrev={handlePrevLesson}
                hasNext={activeLessonIndex < ACADEMY_LESSONS.length - 1}
                hasPrev={activeLessonIndex > 0}
              />
            </div>
          </div>
        )}

        {/* TAB 2: CIRCUIT COMPOSER */}
        {activeTab === 'composer' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-dark-900 border border-dark-200 dark:border-dark-800 text-xs sm:text-sm text-dark-600 dark:text-dark-300 flex items-center justify-between shadow-xs">
              <span>Interactive multi-qubit quantum circuit composer with real-time statevector simulation, probability measurements, and OpenQASM export.</span>
            </div>
            <CircuitBuilder />
          </div>
        )}

        {/* TAB 3: HARDWARE LAB */}
        {activeTab === 'hardware' && (
          <HardwareLabView />
        )}

        {/* TAB 4: CHARACTERIZATION LAB */}
        {activeTab === 'characterization' && (
          <CharacterizationLabView />
        )}

        {/* TAB 5: PLAYGROUND (21 MINI-LABS) */}
        {activeTab === 'playground' && (
          <PlaygroundView />
        )}

        {/* TAB 6: GLOSSARY */}
        {activeTab === 'glossary' && (
          <GlossaryView />
        )}

        {/* TAB 7: CHEAT SHEET */}
        {activeTab === 'cheatsheet' && (
          <CheatSheetView />
        )}

        {/* TAB 8: RESOURCES */}
        {activeTab === 'resources' && (
          <ResourcesView />
        )}
      </div>
    </div>
  );
}
