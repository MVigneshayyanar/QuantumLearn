import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Instructor Portal | QuantaBit',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
