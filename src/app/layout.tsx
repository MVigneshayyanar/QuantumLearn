import type { Metadata } from 'next';
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

export const metadata: Metadata = {
  title: 'QLearn | AI-Based Interactive Quantum Algorithm Learning Platform',
  description: 'Master quantum algorithms through multi-simulator simulation (Qiskit, Cirq, PennyLane), 3D Bloch spheres, and Schrödinger AI. Built for all learners from beginners to researchers.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-font-size="md">
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
            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* Student Identity Modal — shown on first visit */}
            <StudentIdentityModal />

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
