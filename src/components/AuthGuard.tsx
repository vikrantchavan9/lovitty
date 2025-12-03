
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const publicPaths = ['/login', '/signup'];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    const pathIsPublic = publicPaths.includes(pathname);

    // If user is not logged in and is trying to access a private page, redirect to login
    if (!session && !pathIsPublic) {
      router.replace('/login');
    }

    // If user is logged in and is trying to access a public page (like login), redirect to home
    if (session && pathIsPublic) {
      router.replace('/home');
    }
  }, [session, loading, router, pathname]);

  // While loading, show a spinner
  if (loading) {
      return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      );
  }
  
  // Determine if the content should be shown
  const pathIsPublic = publicPaths.includes(pathname);
  if ((session && !pathIsPublic) || (!session && pathIsPublic)) {
    return <>{children}</>;
  }

  // If the logic above hasn't decided, show a loader as a fallback while redirecting.
  return (
    <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
