'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AboutRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/concepts');
  }, [router]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-sm text-slate-400 font-mono">
        Redirecting to Quantum Academy & Concepts...
      </p>
    </div>
  );
}
