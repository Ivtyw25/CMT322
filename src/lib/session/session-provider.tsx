'use client';

import { usePathname, useRouter } from 'next/navigation';
import { createContext, use, useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { protectedRoutes, routes } from '@/config/routes';
import type { User } from '@/data/models/user';
import {
  beginLeavingProtectedPage,
  clearSession,
  endLeavingProtectedPage,
  notifySessionChange,
  readSessionUserId,
  subscribeToSession,
  writeSession,
  type SessionStatus,
} from './session';

type SessionContextValue = {
  /** 'loading' on the server and during hydration, then 'guest' or 'signed-in'. */
  status: SessionStatus;
  user: User | null;
  signIn: () => void;
  signOut: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const getServerStatus = (): SessionStatus => 'loading';

export function isProtectedPath(pathname: string): boolean {
  return protectedRoutes.includes(pathname);
}

/** `user` is the one account the mock can sign in as. */
export function SessionProvider({ user, children }: { user: User; children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const getStatus = useCallback(
    (): SessionStatus => (readSessionUserId() === user.id ? 'signed-in' : 'guest'),
    [user.id],
  );
  const status = useSyncExternalStore(subscribeToSession, getStatus, getServerStatus);

  // The head script set this before first paint; keep it true after sign-in and sign-out.
  useEffect(() => {
    if (status !== 'loading') document.documentElement.dataset.session = status;
  }, [status]);

  // The guard stands down only until the visitor has left the protected page.
  useEffect(() => {
    if (!isProtectedPath(pathname)) endLeavingProtectedPage();
  }, [pathname]);

  const signIn = useCallback(() => {
    writeSession(user.id);
    notifySessionChange();
  }, [user.id]);

  const signOut = useCallback(() => {
    clearSession();
    notifySessionChange();
    if (isProtectedPath(pathname)) {
      beginLeavingProtectedPage();
      router.replace(routes.home);
    }
  }, [pathname, router]);

  const value = useMemo<SessionContextValue>(
    () => ({ status, user: status === 'signed-in' ? user : null, signIn, signOut }),
    [status, user, signIn, signOut],
  );
  return <SessionContext value={value}>{children}</SessionContext>;
}

export function useSession(): SessionContextValue {
  const context = use(SessionContext);
  if (!context) throw new Error('useSession must be used inside <SessionProvider>.');
  return context;
}
