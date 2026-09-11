import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { AccessibilityBar } from '@/components/accessibility/AccessibilityBar';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { QubitPrimerModal } from '@/components/accessibility/QubitPrimerModal';
import { AITutorDrawer } from '@/components/ai-tutor/AITutorDrawer';
import { GoogleTranslator } from '@/components/accessibility/GoogleTranslator';
import { StudentProvider } from '@/lib/student-context';
import { StudentIdentityModal } from '@/components/identity/StudentIdentityModal';
import { SubscriptionModal } from '@/components/subscription/SubscriptionModal';
import {
  websiteSchema,
  organizationSchema,
  softwareApplicationSchema,
  courseSchemaList,
  faqSchema,
  algorithmListSchema,
  howToSchema,
  siteUrl,
} from '@/lib/seo-schema';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'QLearn | Learn Quantum Computing Online - 3D Bloch Sphere & Circuit Simulator',
    template: '%s | QLearn',
  },
  description:
    'Master quantum algorithms through multi-simulator execution (IBM Qiskit, Google Cirq, Xanadu PennyLane), interactive 3D Bloch spheres, and Schrödinger AI tutoring. Learn Grover, Deutsch-Jozsa, quantum teleportation, and superdense coding online.',
  keywords: [
    'quantum computing',
    'learn quantum computing',
    'quantum computing online',
    'quantum algorithms',
    'bloch sphere',
    '3d bloch sphere',
    'bloch sphere simulator',
    'quantum circuit simulator',
    'online quantum circuit simulator',
    'quantum circuit builder',
    'qiskit simulator online',
    'google cirq',
    'xanadu pennylane',
    'openqasm export',
    'grovers algorithm',
    'grover search algorithm',
    'deutsch jozsa algorithm',
    'quantum teleportation',
    'superdense coding',
    'qubit',
    'qubit visualization',
    'quantum statevector',
    'dirac notation',
    'bra ket notation',
    'quantum superposition',
    'quantum entanglement',
    'bell state',
    'hadamard gate',
    'pauli gates',
    'cnot gate',
    'schrodinger ai',
    'quantum computing tutorial',
    'quantum computing course',
    'quantum education',
    'qlearn',
    'qlearn tech',
    'quantum python',
    'quantum speedup',
    'quantum phase kickback',
    'amplitude amplification',
  ],
  authors: [{ name: 'QLearn Team', url: siteUrl }],
  creator: 'QLearn',
  publisher: 'QLearn',
  applicationName: 'QLearn',
  category: 'Quantum Computing Education',
  classification: 'Educational Technology',
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'QLearn',
    title: 'QLearn | Learn Quantum Computing Online - 3D Bloch Sphere & Circuit Simulator',
    description:
      'Master quantum algorithms through multi-simulator execution (Qiskit, Cirq, PennyLane), 3D Bloch sphere, and Schrödinger AI. Built for all learners from beginners to researchers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QLearn - Interactive Quantum Algorithm Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QLearn | Interactive Quantum Algorithm Learning Platform',
    description:
      'Learn quantum computing with interactive 3D Bloch spheres, quantum circuit simulator (Qiskit, Cirq, PennyLane), Grover, Deutsch-Jozsa, and AI tutor.',
    images: ['/og-image.png'],
    creator: '@qlearn_tech',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-font-size="md" suppressHydrationWarning>
      <head>
        {/* Prevent Flash of Incorrect Theme (FOIT) on initial load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ql_theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.setAttribute('data-theme', 'light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
        {/* Performance: DNS prefetch & preconnect for faster LCP (Core Web Vitals = ranking signal) */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured Data: Schema.org WebSite (Sitelinks SearchBox) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Structured Data: EducationalOrganization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {/* Structured Data: SoftwareApplication (EducationalApplication) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
        {/* Structured Data: Course Catalog × 5 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchemaList) }}
        />
        {/* Structured Data: Algorithm ItemList (carousel rich snippets) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(algorithmListSchema) }}
        />
        {/* Structured Data: HowTo — How to use the quantum circuit simulator */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
        {/* Structured Data: Expanded FAQ Rich Snippets (10 Q&As) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#111827] antialiased pb-16 md:pb-0">
        <AccessibilityProvider>
          <StudentProvider>
            {/* Skip link for keyboard accessibility WCAG 2.1 AA */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-md"
            >
              Skip to main content
            </a>

            {/* Accessible Settings & Language Top Bar */}
            <AccessibilityBar />

            {/* Navigation Bar */}
            <Navbar />

            {/* Main Content Area */}
            <main id="main-content" className="flex-1 w-full">
              {children}
            </main>

            {/* Student Identity Modal — shown on first visit */}
            <StudentIdentityModal />

            {/* QLearn Pro Subscription Modal */}
            <SubscriptionModal />

            {/* Onboarding Primer Modal */}
            <QubitPrimerModal />

            {/* Socratic AI Tutor Drawer */}
            <AITutorDrawer />

            {/* Hidden Google Translate Engine */}
            <GoogleTranslator />

            {/* Footer */}
            <Footer />
          </StudentProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}

