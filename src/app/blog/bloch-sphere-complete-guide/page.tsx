import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { buildBlogArticleSchema, siteUrl } from '@/lib/seo-schema';
import {
  Globe,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  User,
  Building,
  CheckCircle2,
  Atom,
  Cpu,
  ChevronRight,
  Layers,
  Sparkles
} from 'lucide-react';
import { MathRenderer } from '@/components/math/MathRenderer';

export const metadata: Metadata = {
  title: 'The Bloch Sphere Complete Guide: Geometry, Angles & Entanglement Collapse — QuanBit',
  description:
    'Master the 3D Bloch sphere for single-qubit quantum states. Understand polar angle θ, azimuthal phase φ, density matrix purity Tr(ρ²), and why entanglement shrinks the vector to the origin.',
  keywords: [
    'bloch sphere guide',
    'how to read a bloch sphere',
    'bloch sphere angles theta phi',
    'qubit bloch sphere visualization',
    'density matrix purity bloch sphere',
    'bloch sphere entanglement',
    'pure state vs mixed state',
  ],
  alternates: {
    canonical: `${siteUrl}/blog/bloch-sphere-complete-guide`,
  },
  openGraph: {
    title: 'The Bloch Sphere Complete Guide — Geometry, Formulas & Entanglement',
    description:
      'Learn how the Bloch sphere maps two-level Hilbert spaces onto 3D spherical coordinates, and how quantum entanglement collapses the single-qubit vector.',
    url: `${siteUrl}/blog/bloch-sphere-complete-guide`,
    type: 'article',
  },
};

export default function BlochSphereBlogPage() {
  const articleSchema = buildBlogArticleSchema({
    title: 'The Bloch Sphere Complete Guide: Visualizing Qubits, Relative Phase, and Entanglement Collapse',
    description:
      'Comprehensive mathematical and geometric breakdown of the 3D Bloch sphere, spherical coordinates (θ, φ), density matrix trace purity diagnostics, and WebGL rendering in QuanBit.',
    url: `${siteUrl}/blog/bloch-sphere-complete-guide`,
    datePublished: '2026-10-15T00:00:00Z',
    keywords: [
      'Bloch Sphere',
      'Qubit',
      'Quantum Mechanics',
      'Density Matrix',
      'Entanglement',
      'REVERSUN',
      'Quantum Visualizer',
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
          <span className="text-dark-900 dark:text-dark-200 font-semibold truncate">Bloch Sphere Complete Guide</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4 border-b border-dark-200 dark:border-dark-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-bold text-primary-800 dark:text-primary-300">
            <Globe className="w-3.5 h-3.5 text-primary-600" />
            <span>Geometric Quantum Mechanics Guide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 dark:text-white tracking-tight leading-tight">
            The Bloch Sphere Complete Guide: Visualizing Qubits, Relative Phase, and Entanglement Collapse
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
              <span>10 min read</span>
            </div>
          </div>
        </header>

        {/* Featured Snippet Definition Box (AEO) */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-950/40 dark:to-indigo-950/30 border border-primary-200 dark:border-primary-800/80 shadow-xs space-y-2 speakable-summary">
          <h2 className="text-sm font-bold uppercase tracking-wider text-primary-900 dark:text-primary-300">
            Direct Definition (Featured Snippet)
          </h2>
          <p className="text-sm sm:text-base text-dark-800 dark:text-dark-200 leading-relaxed font-medium">
            The <strong>Bloch sphere</strong> is a unit two-sphere representation (<MathRenderer text="$S^2$" />) of the state space of a two-level quantum mechanical system (qubit). Named after physicist Felix Bloch, it maps complex statevectors <MathRenderer text="$|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$" /> into intuitive 3D spherical coordinates defined by polar angle <MathRenderer text="$\theta$" /> and azimuthal phase <MathRenderer text="$\phi$" />.
          </p>
        </div>

        {/* Section 1: The Mathematics of the Bloch Sphere */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            1. The Mathematical Formulation
          </h2>
          <p className="text-sm sm:text-base text-dark-700 dark:text-dark-300 leading-relaxed">
            Any pure qubit state in two-dimensional complex Hilbert space <MathRenderer text="$\mathbb{C}^2$" /> is written as a linear superposition of computational basis states <MathRenderer text="$|0\rangle$" /> and <MathRenderer text="$|1\rangle$" />:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm font-bold text-dark-900 dark:text-white">
            <MathRenderer text="$|\psi\rangle = \alpha|0\rangle + \beta|1\rangle, \quad \alpha, \beta \in \mathbb{C}, \quad |\alpha|^2 + |\beta|^2 = 1$" />
          </div>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            Because a global phase factor <MathRenderer text="$e^{i\gamma}$" /> has no observable physical consequences (it cancels out when computing measurement probabilities <MathRenderer text="$|\langle \phi | \psi \rangle|^2$" />), we can factor out the global phase and parameterize the remaining degrees of freedom with two real angles:
          </p>

          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950 font-mono text-center text-base font-extrabold text-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            <MathRenderer text="$|\psi\rangle = \cos\left(\frac{\theta}{2}\right)|0\rangle + e^{i\phi}\sin\left(\frac{\theta}{2}\right)|1\rangle$" />
          </div>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            where the angles span the spherical domain:
          </p>
          <ul className="text-xs sm:text-sm text-dark-700 dark:text-dark-300 space-y-1.5 list-disc pl-5">
            <li><MathRenderer text="$0 \le \theta \le \pi$" /> — Polar latitude angle (determines relative measurement probabilities <MathRenderer text="$P(|0\rangle) = \cos^2(\theta/2)$" /> and <MathRenderer text="$P(|1\rangle) = \sin^2(\theta/2)$" />).</li>
            <li><MathRenderer text="$0 \le \phi < 2\pi$" /> — Azimuthal longitudinal angle (controls quantum relative phase between <MathRenderer text="$|0\rangle$" /> and <MathRenderer text="$|1\rangle$" />).</li>
          </ul>
        </section>

        {/* Section 2: Cardinal Poles Table */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            2. The 6 Cardinal Basis States on the Sphere
          </h2>
          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            The Cartesian coordinates <MathRenderer text="$(x, y, z)$" /> of the Bloch vector are calculated directly from spherical coordinates:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-xs sm:text-sm text-dark-900 dark:text-white">
            <MathRenderer text="$x = \sin\theta \cos\phi, \quad y = \sin\theta \sin\phi, \quad z = \cos\theta$" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm text-left border border-dark-200 dark:border-dark-800 rounded-xl overflow-hidden">
              <thead className="bg-dark-50 dark:bg-dark-800 text-dark-900 dark:text-white font-bold">
                <tr>
                  <th className="p-3">State</th>
                  <th className="p-3">Dirac Vector</th>
                  <th className="p-3"><MathRenderer text="$\theta$" /></th>
                  <th className="p-3"><MathRenderer text="$\phi$" /></th>
                  <th className="p-3">Cartesian <MathRenderer text="$(x, y, z)$" /></th>
                  <th className="p-3">Location on Sphere</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-200 dark:divide-dark-800 text-dark-700 dark:text-dark-300">
                <tr>
                  <td className="p-3 font-bold"><MathRenderer text="$|0\rangle$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$[1, 0]^T$" /></td>
                  <td className="p-3 font-mono">0</td>
                  <td className="p-3 font-mono">0</td>
                  <td className="p-3 font-mono"><MathRenderer text="$(0, 0, +1)$" /></td>
                  <td className="p-3 text-primary-600 font-semibold">North Pole</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold"><MathRenderer text="$|1\rangle$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$[0, 1]^T$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi$" /></td>
                  <td className="p-3 font-mono">0</td>
                  <td className="p-3 font-mono"><MathRenderer text="$(0, 0, -1)$" /></td>
                  <td className="p-3 text-primary-600 font-semibold">South Pole</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold"><MathRenderer text="$|+\rangle$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\frac{|0\rangle + |1\rangle}{\sqrt{2}}$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi/2$" /></td>
                  <td className="p-3 font-mono">0</td>
                  <td className="p-3 font-mono"><MathRenderer text="$(+1, 0, 0)$" /></td>
                  <td className="p-3 text-emerald-600 font-semibold">Equator (+X axis)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold"><MathRenderer text="$|-\rangle$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\frac{|0\rangle - |1\rangle}{\sqrt{2}}$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi/2$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$(-1, 0, 0)$" /></td>
                  <td className="p-3 text-emerald-600 font-semibold">Equator (-X axis)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold"><MathRenderer text="$|+i\rangle$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\frac{|0\rangle + i|1\rangle}{\sqrt{2}}$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi/2$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi/2$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$(0, +1, 0)$" /></td>
                  <td className="p-3 text-indigo-600 font-semibold">Equator (+Y axis)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold"><MathRenderer text="$|-i\rangle$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\frac{|0\rangle - i|1\rangle}{\sqrt{2}}$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$\pi/2$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$3\pi/2$" /></td>
                  <td className="p-3 font-mono"><MathRenderer text="$(0, -1, 0)$" /></td>
                  <td className="p-3 text-indigo-600 font-semibold">Equator (-Y axis)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Pure States vs Mixed States and Entanglement Collapse */}
        <section className="space-y-4">
          <h2 className="text-2xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            3. Pure States, Mixed States, and Why Entanglement Collapses the Sphere
          </h2>
          <p className="text-sm sm:text-base text-dark-700 dark:text-dark-300 leading-relaxed">
            One of the most profound insights in quantum information science is that <strong>only pure quantum states live on the surface of the Bloch sphere</strong> (<MathRenderer text="$|\vec{r}| = 1$" />). Mixed states—which describe statistical ensembles or entangled subsystems—live strictly <em>inside</em> the sphere ball (<MathRenderer text="$|\vec{r}| < 1$" />).
          </p>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            The general density matrix <MathRenderer text="$\rho$" /> of a single qubit is parameterized by its Bloch vector <MathRenderer text="$\vec{r} = (r_x, r_y, r_z)$" />:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm font-bold text-dark-900 dark:text-white">
            <MathRenderer text="$\rho = \frac{1}{2}\left(I + \vec{r}\cdot\vec{\sigma}\right) = \frac{1}{2}\begin{pmatrix} 1 + r_z & r_x - i r_y \\ r_x + i r_y & 1 - r_z \end{pmatrix}$" />
          </div>

          <h3 className="text-lg font-bold text-dark-900 dark:text-white pt-2">
            What Happens During Quantum Entanglement?
          </h3>
          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            Consider the maximally entangled Bell pair <MathRenderer text="$|\Phi^+\rangle = \frac{|00\rangle + |11\rangle}{\sqrt{2}}$" />. If we trace out qubit B to inspect the state of qubit A alone (<MathRenderer text="$\rho_A = \text{Tr}_B(|\Phi^+\rangle\langle\Phi^+|)$" />), we obtain:
          </p>

          <div className="p-4 rounded-xl bg-dark-50 dark:bg-dark-800 font-mono text-center text-sm font-bold text-dark-900 dark:text-white">
            <MathRenderer text="$\rho_A = \frac{1}{2}\begin{pmatrix} 1 & 0 \\ 0 & 1 \end{pmatrix} = \frac{1}{2}I_2$" />
          </div>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            The trace purity <MathRenderer text="$\text{Tr}(\rho^2)$" /> for this maximally mixed state is:
          </p>

          <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-950 font-mono text-center text-sm font-bold text-primary-900 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            <MathRenderer text="$\text{Tr}(\rho_A^2) = \left(\frac{1}{2}\right)^2 + \left(\frac{1}{2}\right)^2 = 0.5$" />
          </div>

          <p className="text-sm text-dark-700 dark:text-dark-300 leading-relaxed">
            The length of the Bloch vector is given by <MathRenderer text="$|\vec{r}| = \sqrt{2\text{Tr}(\rho^2) - 1}$" />. When <MathRenderer text="$\text{Tr}(\rho^2) = 0.5$" />, <MathRenderer text="$|\vec{r}| = 0$" />!
          </p>

          <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
            <strong>Visual Significance in QuanBit:</strong> In QuanBit&apos;s 3D Bloch sphere visualizer, when you entangle two qubits with a Hadamard and CNOT gate, the 3D state vector physically shrinks to the origin <MathRenderer text="$(0, 0, 0)$" /> and an amber <em>Entangled (Mixed State)</em> badge illuminates. This visually reinforces to students that a single qubit does not possess an independent state in an entangled pair.
          </div>
        </section>

        {/* Section 4: Interactive Simulation CTA */}
        <div className="bg-gradient-to-br from-indigo-950 via-primary-900 to-indigo-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold backdrop-blur-xs border border-white/10">
            <Globe className="w-3.5 h-3.5 text-primary-300" />
            <span>Real-Time Three.js Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Explore the 3D Bloch Sphere Live
          </h2>

          <p className="text-sm text-indigo-100/90 leading-relaxed max-w-2xl">
            Manipulate <MathRenderer text="$\theta$" /> and <MathRenderer text="$\phi$" /> with interactive sliders, apply Pauli gates, rotate axes in real time, and monitor statevector probability amplitudes.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/bloch-sphere"
              className="px-6 py-3 rounded-xl bg-white text-primary-900 font-bold text-sm hover:bg-primary-50 transition-all shadow-md flex items-center gap-2"
            >
              <span>Launch 3D Bloch Sphere Visualizer</span>
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
