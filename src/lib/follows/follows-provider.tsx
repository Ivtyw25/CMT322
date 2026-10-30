'use client';

import { createContext, use, useCallback, useMemo, useSyncExternalStore } from 'react';
import type { StationCode } from '@/data/models/station';
import { useSession } from '@/lib/session';
import { parseFollows, readFollowsRaw, subscribeToFollows, writeFollows } from './follows';

type FollowsContextValue = {
  /** The signed-in visitor's followed stations. Empty for guests and while the session loads. */
  codes: readonly StationCode[];
  /** False until the session is known, so a page can hold back "Log in to follow". */
  ready: boolean;
  signedIn: boolean;
  isFollowing: (code: StationCode) => boolean;
  follow: (code: StationCode) => void;
  unfollow: (code: StationCode) => void;
};

const FollowsContext = createContext<FollowsContextValue | null>(null);

const getServerRaw = (): string | null => null;

/**
 * Followed stations for the signed-in visitor: the account's own list until they change it,
 * then their saved list (`mlc-follows`, synced across tabs). Guests follow nothing.
 */
export function FollowsProvider({
  accountCodes,
  children,
}: {
  /** The account's followed stations: the list before the visitor changes anything. */
  accountCodes: readonly StationCode[];
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const raw = useSyncExternalStore(subscribeToFollows, readFollowsRaw, getServerRaw);
  const signedIn = status === 'signed-in';
  const codes = useMemo(
    () => (signedIn ? (parseFollows(raw) ?? accountCodes) : []),
    [signedIn, raw, accountCodes],
  );

  const follow = useCallback(
    (code: StationCode) => {
      if (signedIn && !codes.includes(code)) writeFollows([...codes, code]);
    },
    [signedIn, codes],
  );
  const unfollow = useCallback(
    (code: StationCode) => {
      if (signedIn && codes.includes(code)) writeFollows(codes.filter((item) => item !== code));
    },
    [signedIn, codes],
  );
  const isFollowing = useCallback((code: StationCode) => codes.includes(code), [codes]);

  const value = useMemo<FollowsContextValue>(
    () => ({ codes, ready: status !== 'loading', signedIn, isFollowing, follow, unfollow }),
    [codes, status, signedIn, isFollowing, follow, unfollow],
  );
  return <FollowsContext value={value}>{children}</FollowsContext>;
}

export function useFollowedStations(): FollowsContextValue {
  const context = use(FollowsContext);
  if (!context) throw new Error('useFollowedStations must be used inside <FollowsProvider>.');
  return context;
}
