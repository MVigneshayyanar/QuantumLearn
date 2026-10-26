import type { Metadata } from 'next';
import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.quanbit.tech';

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Quantum Algorithm Courses', item: `${siteUrl}/learn` },
    { '@type': 'ListItem', position: 3, name: "Shor's Factoring Algorithm", item: `${siteUrl}/learn/shor` },
  ],
};

const learningResource = {
  '@context': 'https://schema.org',
  '@type': 'LearningResource',
  name: "Shor's Factoring Algorithm Tutorial & Interactive Simulator | QuanBit",
  description: "Interactive tutorial for Shor's algorithm demonstrating polynomial-time order finding and prime factorization breaking RSA encryption.",
  url: `${siteUrl}/learn/shor`,
  educationalLevel: 'Advanced',
  learningResourceType: 'Interactive Simulation',
  teaches: "Shor's Algorithm, Modular Exponentiation, Period Finding, Continued Fractions, RSA Cryptanalysis",
  isAccessibleForFree: true,
  inLanguage: 'en',
  provider: { '@type': 'EducationalOrganization', name: 'QuanBit', url: siteUrl },
};

export const metadata: Metadata = {
  title: "Shor's Factoring Algorithm Tutorial & Simulator | QuanBit",
  description:
    "Learn Peter Shor's legendary quantum factoring algorithm. Discover how quantum modular exponentiation and the inverse QFT break RSA in polynomial time O(log³ N).",
  keywords: [
    'shors algorithm',
    'shor factoring algorithm',
    'quantum factoring rsa',
    'order finding quantum',
    'quantum modular exponentiation',
    'period finding algorithm',
    'quanbit shor algorithm'
  ],
  alternates: { canonical: '/learn/shor' },
  openGraph: {
    title: "Shor's Factoring Algorithm Interactive Simulator | QuanBit",
    description: "Interactive guide and circuit simulation of Shor's quantum factoring algorithm.",
    url: '/learn/shor',
  },
};

export default function ShorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="shor-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <Script
        id="shor-learning-resource"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResource) }}
      />
      {children}
    </>
  );
}
