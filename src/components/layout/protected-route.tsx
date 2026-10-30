'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { uiCopy } from '@/content/ui';
import { routes } from '@/config/routes';
import { useCurrentPath } from '@/lib/navigation/use-current-path';
import { isProtectedPath, useSession } from '@/lib/session';
import { isLeavingProtectedPage } from '@/lib/session/session';
import { Container } from './container';

/**
 * Guards the routes listed in `protectedRoutes`. A guest is sent to Log in and returned after;
 * until the session is known the page shows only a neutral skeleton (no form, no personal data).
 * Every other route renders its children untouched.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = useCurrentPath();
  const router = useRouter();
  const { status } = useSession();
  const guarded = isProtectedPath(pathname);

  useEffect(() => {
    if (guarded && status === 'guest' && !isLeavingProtectedPage()) {
      // `replace`, so the back button does not return to a page that redirects again.
      router.replace(routes.account.loginReturningTo(currentPath));
    }
  }, [guarded, status, router, currentPath]);

  if (guarded && status !== 'signed-in') {
    return (
      <Container className="flex flex-col gap-4 py-12" aria-busy="true">
        <div aria-hidden className="h-4 w-40 rounded-md bg-gray-100" />
        <div aria-hidden className="h-10 w-72 max-w-full rounded-lg bg-gray-100" />
        <div aria-hidden className="h-5 w-full max-w-article rounded-md bg-gray-100" />
        <p className="sr-only">{uiCopy.status.loading}</p>
      </Container>
    );
  }
  return children;
}
