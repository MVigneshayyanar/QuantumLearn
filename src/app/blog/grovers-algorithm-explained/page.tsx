import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { buildBlogArticleSchema, siteUrl } from '@/lib/seo-schema';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Building,
  CheckCircle2,
  Atom,
  Cpu,
  Globe,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { MathRenderer } from '@/components/math/MathRenderer';

export const metadata: Metadata = {
  title: "Grover's Algorithm Explained: Math Derivation, Oracle & Qiskit Code — QuanBit",
  description:
    "Master Grover's quantum search algorithm. Learn how phase oracle inversion and the Grover diffusion operator achieve quadratic O(√N) speedup with full Qiskit, Cirq, and PennyLane code.",
  keywords: [
    "grover's algorithm explained",
    'grover quantum search',
    'amplitude amplification',
    'quantum speedup',
    'grover oracle circuit',
    'qiskit grover algorithm',
    'cirq grover code',
    'inversion about the mean',
  ],
  alternates: {
    canonical: `${siteUrl}/blog/grovers-algorithm-explained`,
  },
  openGraph: {
    title: "Grover's Algorithm Explained — Complete Mathematical & Code Guide",
    description:
      'Learn how Grover’s algorithm searches unsorted databases in O(√N) queries using phase inversion and amplitude amplification.',
    url: `${siteUrl}/blog/grovers-algorithm-explained`,
    type: 'article',
  },
};

export default function GroversAlgorithmBlogPage() {
  const articleSchema = buildBlogArticleSchema({
    title: "Grover's Algorithm Explained: Step-by-Step Mathematical Derivation & Circuit Implementation",
    description:
      "Comprehensive technical breakdown of Grover's quantum search algorithm, amplitude amplification, 2D geometric statevector rotations, and code generation across IBM Qiskit and Google Cirq.",
    url: `${siteUrl}/blog/grovers-algorithm-explained`,
    datePublished: '2026-10-15T00:00:00Z',
    keywords: [
      "Grover's Algorithm",
      'Quantum Search',
      'Amplitude Amplification',
      'IBM Qiskit',
      'Google Cirq',
      'Xanadu PennyLane',
      'Quantum Computing',
    ],
  });

  return (
    <>
      {/* Schema.org TechArticle JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-dark-500">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/blog" className="hover:text-primary-600">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-dark-900 dark:text-dark-200 font-semibold truncate">Grover&apos;s Algorithm Explained</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 border-b border-dark-200 dark:border-dark-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Core Quantum Algorithm Masterclass</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 dark:text-white tracking-tight leading-tight">
            Grover&apos;s Algorithm Explained: Step-by-Step Mathematical Derivation &amp; Circuit Implementation
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-dark-500 dark:text-dark-400 pt-2">
            <div className="flex items-center gap-1.5 font-medium text-dark-900 dark:text-white">
              <User className="w-4 h-4 text-primary-600" />
              <span>QuanBit Team</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Building className="w-4 h-4 text-dark-400" />
              <span>REVERSUN</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-dark-400" />
              <span>October 15, 2026</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-dark-400" />
              <span>12 min read</span>
            </div>
          </div>
        </header>

        {/* Featured Snippet Definition Box (AEO) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800/80 shadow-xs space-y-2 speakable-summary">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
            Direct Definition (Featured Snippet)
          </h2>
          <p className="text-sm sm:text-base text-dark-800 dark:text-dark-200 leading-relaxed font-medium">
            <strong>Grover&apos;s algorithm</strong> is a quantum search algorithm devised by Lov Grover in 1996 that finds a unique marked item in an unstructured database of <MathRenderer text="$N$" /> entries in <MathRenderer text="$\mathcal{O}(\sqrt{N})$" /> time, delivering a provable quadratic speedup over the best classical search (<MathRenderer text="$\mathcal{O}(N)$" />) using phase oracle inversion and amplitude amplification.
          </p>
        </div>

        {/* Section 1: The Problem */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            1. Classical Search vs. Quantum Search
          </h2>
          <p className="text-sm sm:text-base text-dark-700 dark:text-dark-300 leading-relaxed">
            Imagine an unsorted phone directory containing <MathRenderer text="$N = 2^n$" /> names and telephone numbers. You are given a specific telephone number and asked to find who owns it. Because the database is completely unstructured, classical computers have no choice but to check each entry one by one.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border border-dark-200 dark:border-dark-800 rounded-xl overflow-hidden">
              <thead className="bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white font-bold">
                <tr>
                  <th className="p-3">Search Metric</th>
                  <th className="p-3">Classical Computer</th>
                  <th className="p-3 text-emerald-600 dark:text-emerald-400">Grover&apos;s Quantum Algorithm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200 dark:divide-dark-800 text-dark-700 dark:text-dark-300">
                <tr>
                  <td className="p-3 font-semibold">Worst-Case Complexity</td>
                  <td className="p-3 font-mono"><MathRenderer text="$\mathcal{O}(N)$" /> queries</td>
                  <td className="p-3 font-mono font-bold text-emerald-600"><MathRenderer text="$\mathcal{O}(\sqrt{N})$" /> queries</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Average-Case Queries</td>
                  <td className="p-3 font-mono"><MathRenderer text="$N/2$" /> queries</td>
                  <td className="p-3 font-mono font-bold text-emerald-600"><MathRenderer text="$\frac{\pi}{4}\sqrt{N}$" /> queries</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">For <MathRenderer text="$N = 1,000,000$" /> entries</td>
                  <td className="p-3 font-mono">~500,000 checks</td>
                  <td className="p-3 font-mono font-bold text-emerald-600">~785 queries (636× faster!)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">For <MathRenderer text="$N = 2^{64}$" /> entries</td>
                  <td className="p-3 font-mono">~<MathRenderer text="$9 \times 10^{18}$" /> operations (millennia)</td>
                  <td className="p-3 font-mono font-bold text-emerald-600">~<MathRenderer text="$3.3 \times 10^9$" /> operations (seconds)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Mathematical Derivation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            2. The Grover Iteration Mechanics
          </h2>
          <p className="text-sm sm:text-base text-dark-700 dark:text-dark-300 leading-relaxed">
            The algorithm begins by placing an <MathRenderer text="$n$" />-qubit register into a uniform superposition state <MathRenderer text="$|s\rangle$" /> using Hadamard gates on each qubit:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm font-bold text-primary-950 dark:text-primary-300">
            <MathRenderer text="$|s\rangle = H^{\otimes n}|0\rangle^{\otimes n} = \frac{1}{\sqrt{N}}\sum_{x=0}^{N-1}|x\rangle$" />
          </div>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            Every state initially has equal probability amplitude <MathRenderer text="$1/\sqrt{N}$" />. Grover’s algorithm consists of repeatedly applying a unitary loop called the <strong>Grover Iteration (or Grover Operator <MathRenderer text="$G$" />)</strong>:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm font-bold text-dark-900 dark:text-white">
            <MathRenderer text="$G = D \cdot O_f$" />
          </div>

          <h3 className="text-lg font-bold text-dark-900 dark:text-white pt-2">
            Step A: The Phase Inversion Oracle (<MathRenderer text="$O_f$" />)
          </h3>
          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            The oracle identifies the marked target item <MathRenderer text="$|\omega\rangle$" /> and flips its quantum phase by <MathRenderer text="$\pi$" /> radians (multiplying by <MathRenderer text="$-1$" />) while leaving all other basis states untouched:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm text-dark-900 dark:text-white">
            <MathRenderer text="$O_f |x\rangle = (-1)^{f(x)}|x\rangle = \begin{cases} -|x\rangle & \text{if } x = \omega \\ +|x\rangle & \text{if } x \neq \omega \end{cases}$" />
          </div>

          <h3 className="text-lg font-bold text-dark-900 dark:text-white pt-2">
            Step B: The Grover Diffusion Operator (<MathRenderer text="$D$" />)
          </h3>
          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            The diffusion operator is often called <strong>inversion about the mean</strong>. Mathematically, it reflects the statevector about the equal superposition vector <MathRenderer text="$|s\rangle$" />:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm text-dark-900 dark:text-white">
            <MathRenderer text="$D = 2|s\rangle\langle s| - I = H^{\otimes n}(2|0\rangle\langle 0| - I)H^{\otimes n}$" />
          </div>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            Because the target state was flipped to a negative amplitude by the oracle, its amplitude is now far below the average mean. When the diffusion operator inverts all amplitudes about the mean, the target amplitude is amplified upward, while non-target amplitudes shrink!
          </p>
        </section>

        {/* Section 3: Geometric 2D Rotation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            3. Geometric Interpretation: Rotation in a 2D Subspace
          </h2>
          <p className="text-sm sm:text-base text-dark-700 dark:text-dark-300 leading-relaxed">
            Although the Hilbert space has <MathRenderer text="$N = 2^n$" /> dimensions, the entire dynamics of Grover&apos;s algorithm occur inside a simple two-dimensional plane spanned by:
          </p>
          <ul className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 space-y-2 list-disc pl-5">
            <li><MathRenderer text="$|\omega\rangle$" /> — the marked target state.</li>
            <li><MathRenderer text="$|s'\rangle = \frac{1}{\sqrt{N-1}}\sum_{x \neq \omega}|x\rangle$" /> — the normalized superposition of all non-target states.</li>
          </ul>
          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            Each Grover iteration rotates the state vector toward <MathRenderer text="$|\omega\rangle$" /> by an angle of <MathRenderer text="$\theta \approx 2/\sqrt{N}$" />. The optimal number of iterations to rotate directly onto the target axis is:
          </p>

          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950 font-mono text-center text-base font-extrabold text-primary-900 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            <MathRenderer text="$R \approx \left\lfloor \frac{\pi}{4}\sqrt{N} \right\rfloor$" />
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Warning: The &quot;Overcooking&quot; Trap:</strong> Unlike classical algorithms where more iterations always improve accuracy, continuing to run Grover iterations past <MathRenderer text="$R$" /> will rotate the state vector past <MathRenderer text="$|\omega\rangle$" />, actually <em>decreasing</em> the success probability back toward zero!
          </div>
        </section>

        {/* Section 4: Python Code Snippet */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            4. IBM Qiskit Code Implementation
          </h2>
          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            Here is a verified 2-qubit Grover search circuit targeting state <MathRenderer text="$|11\rangle$" /> using IBM Qiskit (generated and tested via QuanBit):
          </p>

          <div className="rounded-2xl bg-dark-950 text-dark-100 p-5 font-mono text-xs overflow-x-auto border border-dark-800 space-y-2">
            <div className="text-dark-400"># Qiskit 1.0+ Implementation of Grover Algorithm for |11&gt;</div>
            <div>import numpy as np</div>
            <div>from qiskit import QuantumCircuit</div>
            <div>from qiskit_aer import AerSimulator</div>
            <div>&nbsp;</div>
            <div>qc = QuantumCircuit(2, 2)</div>
            <div>&nbsp;</div>
            <div className="text-emerald-400"># Step 1: Initialize Equal Superposition |s&gt;</div>
            <div>qc.h([0, 1])</div>
            <div>&nbsp;</div>
            <div className="text-emerald-400"># Step 2: Phase Oracle for |11&gt; (Controlled-Z)</div>
            <div>qc.cz(0, 1)</div>
            <div>&nbsp;</div>
            <div className="text-emerald-400"># Step 3: Grover Diffusion Operator D</div>
            <div>qc.h([0, 1])</div>
            <div>qc.x([0, 1])</div>
            <div>qc.cz(0, 1)</div>
            <div>qc.x([0, 1])</div>
            <div>qc.h([0, 1])</div>
            <div>&nbsp;</div>
            <div className="text-emerald-400"># Step 4: Measurement</div>
            <div>qc.measure([0, 1], [0, 1])</div>
            <div>&nbsp;</div>
            <div>backend = AerSimulator()</div>
            <div>counts = backend.run(qc, shots=1024).result().get_counts()</div>
            <div>print(&quot;Measurement results (100% |11&gt;):&quot;, counts)</div>
          </div>
        </section>

        {/* Section 5: Interactive Simulation CTA */}
        <div className="bg-gradient-to-br from-primary-900 via-indigo-950 to-dark-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Atom className="w-3.5 h-3.5 text-primary-300" />
            <span>Interactive 4-Stage Lab on QuanBit</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Simulate Grover&apos;s Algorithm in Your Browser
          </h2>

          <p className="text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
            Test oracle phase flips, inspect live probability histograms, and earn your verified <strong>QuanBit Certificate in Grover&apos;s Algorithm</strong> — 100% free with no account setup.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/learn/grover"
              className="px-6 py-3 rounded-xl bg-white text-primary-900 font-bold text-sm hover:bg-primary-50 transition-all shadow-md flex items-center gap-2"
            >
              <span>Launch Grover Interactive Course</span>
              <ArrowRight className="w-4 h-4 text-primary-600" />
            </Link>
            <Link
              href="/simulator"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20"
            >
              Open Circuit Simulator
            </Link>
          </div>
        </div>

        {/* Author Bio Footer */}
        <footer className="border-t border-dark-200 dark:border-dark-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-dark-500">
          <div>
            Written by the <strong>QuanBit Team</strong> at{' '}
            <a href="https://www.reversun.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 font-bold hover:underline">
              REVERSUN
            </a>
          </div>
          <Link href="/blog" className="text-primary-600 font-bold hover:underline flex items-center gap-1">
            <span>Back to All Guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </footer>
      </article>
    </>
  );
}
