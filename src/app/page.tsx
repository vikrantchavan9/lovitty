
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// This component now simply redirects to the main app page.
// The actual home page content has been moved to /src/app/(app)/home/page.tsx
// to ensure it uses the correct layout.
export default function RedirectToHome() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return null; // Render nothing while redirecting
}
