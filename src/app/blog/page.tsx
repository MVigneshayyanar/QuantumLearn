import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { siteUrl } from '@/lib/seo-schema';
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Tag,
  Building,
  Atom,
  Globe
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Quantum Computing Blog & In-Depth Guides — QuanBit',
  description:
    'Authoritative technical guides, algorithmic derivations, and tutorials on quantum computing, Grover’s algorithm, 3D Bloch spheres, and circuit simulation by REVERSUN.',
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: 'QuanBit Quantum Computing Blog & Guides',
    description:
      'Deep dive into quantum algorithms, statevector linear algebra, and circuit implementations with IBM Qiskit and Google Cirq.',
    url: `${siteUrl}/blog`,
    type: 'website',
  },
};

export default function BlogIndexPage() {
  const articles = [
    {
      slug: 'grovers-algorithm-explained',
      title: "Grover's Algorithm Explained: Step-by-Step Mathematical Derivation & Circuit Implementation",
      description:
        "Comprehensive guide to Grover's quantum search algorithm. Learn how phase inversion oracles and amplitude amplification achieve quadratic O(√N) speedup over classical search, with complete Qiskit, Cirq, and PennyLane code.",
      date: 'October 15, 2026',
      readTime: '12 min read',
      category: 'Quantum Algorithms',
      author: 'QuanBit Team',
      authorRole: 'REVERSUN',
      tags: ["Grover's Algorithm", 'Amplitude Amplification', 'IBM Qiskit', 'Google Cirq', 'Quantum Search'],
      featured: true,
    },
    {
      slug: 'bloch-sphere-complete-guide',
      title: 'The Bloch Sphere Complete Guide: Visualizing Qubits, Relative Phase, and Entanglement Collapse',
      description:
        'Master the geometry of single-qubit quantum states. Learn how polar angle θ and azimuthal phase φ map onto the 3D unit sphere, why pure states have Tr(ρ²) = 1, and why entanglement shrinks the vector to the origin.',
      date: 'October 15, 2026',
      readTime: '10 min read',
      category: 'Quantum Mechanics',
      author: 'QuanBit Team',
      authorRole: 'REVERSUN',
      tags: ['Bloch Sphere', 'Qubit Statevector', 'Entanglement', 'Density Matrix', 'Three.js'],
      featured: true,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fadeIn">
      {/* Blog Hero Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-bold text-primary-800 dark:text-primary-300">
          <BookOpen className="w-3.5 h-3.5 text-primary-600" />
          <span>REVERSUN Quantum Research &amp; Education Blog</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 dark:text-white tracking-tight">
          Quantum Computing Guides &amp; Algorithms
        </h1>

        <p className="text-sm sm:text-base text-dark-600 dark:text-dark-300 leading-relaxed">
          Rigorous mathematical derivations, step-by-step circuit tutorials, and pedagogical insights written by the quantum engineering team at <strong>REVERSUN</strong>.
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="bg-white dark:bg-dark-900 rounded-3xl border border-dark-200 dark:border-dark-800 p-6 sm:p-8 shadow-xs flex flex-col justify-between space-y-6 hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-md transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  {art.category}
                </span>
                <div className="flex items-center gap-3 text-xs text-dark-500 dark:text-dark-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{art.date}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{art.readTime}</span>
                  </span>
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-dark-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                <Link href={`/blog/${art.slug}`}>
                  {art.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-dark-600 dark:text-dark-300 leading-relaxed">
                {art.description}
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {art.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-dark-50 dark:bg-dark-800 text-dark-600 dark:text-dark-300 border border-dark-200 dark:border-dark-700"
                  >
                    <Tag className="w-2.5 h-2.5 text-dark-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-dark-100 dark:border-dark-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-dark-900 dark:text-white">{art.author}</p>
                <p className="text-[11px] text-dark-500">{art.authorRole}</p>
              </div>

              <Link
                href={`/blog/${art.slug}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-600 text-white font-bold text-xs hover:bg-primary-700 transition-colors shrink-0 shadow-xs"
              >
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Interactive Platform Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-primary-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Atom className="w-3.5 h-3.5 text-primary-300" />
            <span>Simulate While You Read</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Test These Algorithms Live</h3>
          <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
            QuanBit allows you to execute circuits directly in your browser with sub-16ms simulation times and real-time 3D Bloch sphere projections.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/bloch-sphere"
            className="px-5 py-2.5 rounded-xl bg-white text-primary-900 font-bold text-xs hover:bg-primary-50 transition-colors shadow-md"
          >
            Launch 3D Bloch Sphere
          </Link>
          <Link
            href="/simulator"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20"
          >
            Open Circuit Builder
          </Link>
        </div>
      </div>
    </div>
  );
}
