import type { Metadata, Viewport } from 'next';
import { Nunito, Roboto, Fira_Code } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-gfg-sans',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-gfg-body',
  display: 'swap',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-gfg-mono',
  display: 'swap',
});
import { AccessibilityProvider } from '@/lib/accessibility-context';
import { IntlClientWrapper } from '@/components/i18n/IntlClientWrapper';
import { AccessibilityBar } from '@/components/accessibility/AccessibilityBar';
import { Navbar } from '@/components/navigation/Navbar';
import { Footer } from '@/components/navigation/Footer';
import { QubitPrimerModal } from '@/components/accessibility/QubitPrimerModal';
import { AITutorDrawer } from '@/components/ai-tutor/AITutorDrawer';
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
    default: 'QuanBit — Free Interactive Quantum Computing Platform',
    template: '%s | QuanBit',
  },
  description:
    'Learn quantum computing free with QuanBit — 3D Bloch sphere, circuit simulator (Qiskit, Cirq, PennyLane), interactive algorithms, Schrödinger AI tutor & verifiable certificates.',
  keywords: [
    'quantum computing',
    'learn quantum computing',
    'quantum computing for beginners',
    'how to learn quantum computing',
    'quantum computing online',
    'quantum computing course',
    'free quantum computing certificate',
    'quantum algorithms',
    'quantum programming',
    'quantum software engineering',
    'bloch sphere',
    '3d bloch sphere',
    'bloch sphere simulator',
    'bloch sphere visualizer',
    'interactive bloch sphere',
    'qubit visualization',
    'quantum statevector simulator',
    'reduced density matrix',
    'trace purity quantum',
    'quantum circuit simulator',
    'online quantum circuit builder',
    'drag and drop quantum circuit',
    'qiskit simulator online',
    'learn qiskit online',
    'ibm qiskit tutorial',
    'google cirq simulator',
    'xanadu pennylane quantum',
    'openqasm 3.0 export',
    'grovers algorithm simulator',
    'grover search algorithm',
    'amplitude amplification step by step',
    'deutsch jozsa algorithm tutorial',
    'quantum parallelism explained',
    'quantum teleportation protocol',
    'quantum teleportation step by step',
    'superdense coding tutorial',
    'qubit',
    'qubits and gates',
    'dirac notation tutorial',
    'bra ket notation explained',
    'quantum superposition',
    'quantum entanglement visualizer',
    'bell state simulator',
    'hadamard gate',
    'pauli x y z gates',
    'cnot gate phase kickback',
    'schrodinger ai',
    'schrodinger ai quantum tutor',
    'socratic quantum tutor',
    'quantum leetcode',
    'quantum computing practice problems',
    'quantum computing challenge',
    'quanbit',
    'quanbit tech',
    'quantabit',
    'qlearn',
    'quantum python course',
    'quantum speedup',
    'no-cloning theorem quantum',
  ],
  authors: [{ name: 'QuanBit Team', url: siteUrl }],
  creator: 'QuanBit',
  publisher: 'QuanBit',
  applicationName: 'QuanBit',
  category: 'Quantum Computing Education',
  classification: 'Educational Technology',
  alternates: {
    canonical: '/',
    // hreflang removed: all locales pointed to same URL — misconfiguration
    // Re-add when real translated routes (/hi/, /es/, etc.) exist
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'QuanBit',
    title: 'QuanBit | #1 Interactive Quantum Computing Learning Platform',
    description:
      'Master quantum algorithms through multi-simulator execution (Qiskit, Cirq, PennyLane), 3D Bloch sphere, and Schrödinger AI. Built for all learners from beginners to researchers.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'QuanBit - Interactive Quantum Computing Learning Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuanBit | #1 Interactive Quantum Computing Platform',
    description:
      'Learn quantum computing with interactive 3D Bloch spheres, quantum circuit simulator (Qiskit, Cirq, PennyLane), Grover, Deutsch-Jozsa, and Schrödinger AI.',
    images: ['/og-image.png'],
    creator: '@quanbit_tech',
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
    <html
      lang="en"
      data-font-size="md"
      suppressHydrationWarning
      className={`${nunito.variable} ${roboto.variable} ${firaCode.variable}`}
    >
      <head>
        {/* Prevent Flash of Incorrect Theme (FOIT) on initial load */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ql_theme');
                  if (saved === 'dark') {
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
      <body className="font-sans min-h-screen flex flex-col bg-[#FAFAFA] text-[#111827] antialiased pb-16 md:pb-0">
        <AccessibilityProvider>
          <IntlClientWrapper>
            <StudentProvider>
              {/* Skip link for keyboard accessibility WCAG 2.1 AA */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:shadow-md"
              >
                Skip to main content
              </a>

              <div className="group/nav-shell">
                {/* Accessible Settings & Language Top Bar */}
                <AccessibilityBar />

                {/* Navigation Bar */}
                <Navbar />
              </div>

              {/* Main Content Area */}
              <main id="main-content" className="flex-1 w-full">
                {children}
              </main>

              {/* Student Identity Modal — shown on first visit */}
              <StudentIdentityModal />

              {/* QuanBit Pro Subscription Modal */}
              <SubscriptionModal />

              {/* Onboarding Primer Modal */}
              <QubitPrimerModal />

              {/* Socratic AI Tutor Drawer */}
              <AITutorDrawer />


              {/* Footer */}
              <Footer />
            </StudentProvider>
          </IntlClientWrapper>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
