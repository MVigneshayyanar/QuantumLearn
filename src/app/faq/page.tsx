import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { faqSchema, siteUrl } from '@/lib/seo-schema';
import {
  HelpCircle,
  Atom,
  Cpu,
  Globe,
  Award,
  BookOpen,
  ArrowRight,
  Building,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) — Learn Quantum Computing Free',
  description:
    'Comprehensive answers to common questions about QuanBit, 3D Bloch sphere visualization, quantum circuit simulation, multi-backend export (Qiskit, Cirq, PennyLane), and REVERSUN.',
  alternates: {
    canonical: `${siteUrl}/faq`,
  },
  openGraph: {
    title: 'QuanBit FAQ — Quantum Computing Platform Questions Answered',
    description:
      'Answers to essential questions regarding quantum circuit building, Bloch sphere mechanics, verified certificates, and REVERSUN.',
    url: `${siteUrl}/faq`,
    type: 'website',
  },
};

export default function FAQPage() {
  const faqs = [
    {
      category: 'Platform & Organization',
      icon: Building,
      badgeColor: 'bg-primary-50 text-primary-700 border-primary-200',
      questions: [
        {
          q: 'Who develops and backs QuanBit?',
          a: 'QuanBit is developed, engineered, and maintained by the QuanBit Team and REVERSUN Team at REVERSUN (https://www.reversun.com). REVERSUN builds next-generation visual scientific computing and educational engineering platforms to democratize quantum technology worldwide.',
          link: { label: 'Visit REVERSUN', href: 'https://www.reversun.com', external: true },
        },
        {
          q: 'What is QuanBit and how do I learn quantum computing with it?',
          a: 'QuanBit (https://quanbit.tech) is the premier free, interactive quantum computing platform. It lets you visualize qubits in real-time 3D on the Bloch sphere, build quantum circuits with live multi-backend compilation (IBM Qiskit, Google Cirq, Xanadu PennyLane, OpenQASM), and receive guided Socratic hints from Schrödinger AI — directly in your browser without any installation.',
          link: { label: 'Explore the Platform', href: '/simulator' },
        },
        {
          q: 'Is QuanBit completely free to use?',
          a: 'Yes! QuanBit is 100% free and open-access. You get unrestricted access to the 3D Bloch sphere, the drag-and-drop circuit builder, algorithm modules (Deutsch-Jozsa, Grover, Teleportation, Superdense Coding), practice coding problems, and Schrödinger AI tutoring.',
          link: { label: 'Start Practicing', href: '/practice' },
        },
      ],
    },
    {
      category: 'Simulators & Hardware Compilation',
      icon: Cpu,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      questions: [
        {
          q: 'Which quantum programming frameworks does QuanBit support?',
          a: 'QuanBit supports bidirectional code generation for IBM Qiskit (Python), Google Cirq (Python), Xanadu PennyLane (Python), and OpenQASM 2.0 / 3.0. All emitted code is verified and directly executable on physical quantum processors (such as IBM Quantum hardware) or local simulator backends.',
          link: { label: 'Open Circuit Simulator', href: '/simulator' },
        },
        {
          q: 'How does QuanBit handle qubit endianness between Qiskit and Cirq?',
          a: 'QuanBit automatically normalizes endianness conversions in real-time. IBM Qiskit uses little-endian ordering (|q_n ... q_0⟩) while Google Cirq and standard Dirac math use big-endian ordering (|q_0 ... q_n⟩). QuanBit provides side-by-side annotations showing learners exactly how basis state indices map across different frameworks.',
          link: { label: 'Learn in Masterclass', href: '/concepts' },
        },
      ],
    },
    {
      category: 'Quantum Mechanics & 3D Visualization',
      icon: Globe,
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      questions: [
        {
          q: 'What is a Bloch Sphere and how does QuanBit display entanglement?',
          a: 'The Bloch sphere is a geometric representation of a single qubit pure state space. The north pole |0⟩ and south pole |1⟩ represent computational basis states. When qubits become entangled (e.g., in a Bell state), their individual pure state collapses into a mixed state. QuanBit uniquely computes the reduced density matrix trace purity Tr(rho^2) in real time: when purity drops to 0.5, the 3D vector shrinks to the origin and an amber entanglement badge alerts you that single-qubit coordinates are undefined.',
          link: { label: 'Launch 3D Bloch Sphere', href: '/bloch-sphere' },
        },
        {
          q: 'Can I learn quantum computing on QuanBit with no physics background?',
          a: 'Yes! QuanBit features a Dual-Explanation Mode: "Simple Mode" explains concepts using everyday analogies (light switches, polarized sunglasses, coin tosses), while "Technical Mode" presents formal Dirac bra-ket notations, complex statevector amplitudes, and unitary matrices. The Schrödinger AI tutor adapts to your knowledge level.',
          link: { label: 'Read Concept Guide in Quantum Academy', href: '/concepts' },
        },
      ],
    },
    {
      category: 'Algorithms & Verified Certification',
      icon: Award,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      questions: [
        {
          q: 'What quantum algorithms can I learn and simulate on QuanBit?',
          a: 'QuanBit provides structured 4-stage interactive courses for: (1) Deutsch-Jozsa Algorithm (exponential query speedup via quantum parallelism), (2) Grover’s Quantum Search Algorithm (quadratic O(√N) database search), (3) Quantum Teleportation Protocol (disembodied state transit via EPR pairs), and (4) Superdense Coding (transmitting 2 classical bits via 1 qubit). Additional modules for Quantum Fourier Transform (QFT) and Shor’s Algorithm are also included.',
          link: { label: 'Study Grover Algorithm', href: '/learn/grover' },
        },
        {
          q: "How does Grover's Search Algorithm achieve quadratic quantum speedup?",
          a: "Grover's algorithm searches an unsorted database of N items in O(√N) queries instead of classical O(N). It uses phase oracle inversion to flip the sign of the target item, followed by the Grover diffusion operator (inversion about the mean) to constructively amplify the target's probability amplitude.",
          link: { label: "Read Grover Pillar Guide", href: '/blog/grovers-algorithm-explained' },
        },
        {
          q: 'Can I get a verified quantum computing certificate on QuanBit?',
          a: 'Yes! Upon completing module challenges and passing the adaptive mastery quiz with score >= 75%, QuanBit issues a digitally signed Certificate of Quantum Mastery with a unique SHA-256 cryptographic hash verifiable publicly at https://quanbit.tech/verify/[id].',
          link: { label: 'Certificate Verification', href: '/verify' },
        },
      ],
    },
  ];

  return (
    <>
      {/* Schema.org FAQPage structured data injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-xs font-bold text-primary-800 dark:text-primary-300">
            <HelpCircle className="w-3.5 h-3.5 text-primary-600" />
            <span>QuanBit Knowledge Base & FAQ</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-dark-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-sm sm:text-base text-dark-600 dark:text-dark-300 leading-relaxed speakable-summary">
            Everything you need to know about learning quantum computing with QuanBit, 3D Bloch sphere statevectors, multi-backend code generation, and our parent enterprise REVERSUN.
          </p>
        </div>

        {/* Categorized FAQs */}
        <div className="space-y-10">
          {faqs.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <section key={idx} className="space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-dark-200 dark:border-dark-800">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-dark-900 dark:text-white">
                    {cat.category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {cat.questions.map((item, qIdx) => (
                    <article
                      key={qIdx}
                      className="bg-white dark:bg-dark-900 rounded-2xl border border-dark-200 dark:border-dark-800 p-5 sm:p-6 shadow-xs space-y-3 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                    >
                      <h3 className="font-bold text-base sm:text-lg text-dark-900 dark:text-white speakable-question flex items-start gap-2.5">
                        <span className="text-primary-600 font-extrabold">Q:</span>
                        <span>{item.q}</span>
                      </h3>

                      <div className="pl-6 border-l-2 border-primary-200 dark:border-primary-800 text-sm text-dark-600 dark:text-dark-300 leading-relaxed speakable-answer">
                        <p>{item.a}</p>
                      </div>

                      {item.link && (
                        <div className="pl-6 pt-1">
                          {item.link.external ? (
                            <a
                              href={item.link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            >
                              <span>{item.link.label}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <Link
                              href={item.link.href}
                              className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
                            >
                              <span>{item.link.label}</span>
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div className="bg-gradient-to-br from-primary-900 via-indigo-950 to-dark-950 text-white rounded-3xl p-8 sm:p-10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold">Have a question not covered here?</h3>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
              Reach out directly to the QuanBit development team at REVERSUN. We assist university faculty, student researchers, and developers worldwide.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-white text-primary-900 font-bold text-sm hover:bg-primary-50 transition-all shadow-md flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <span>Contact REVERSUN</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
