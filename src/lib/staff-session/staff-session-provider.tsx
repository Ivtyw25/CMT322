'use client';

import { createContext, use, useCallback, useMemo, useSyncExternalStore } from 'react';
import type { StaffMember } from '@/data/models/staff';
import {
  clearStaffSession,
  notifyStaffSessionChange,
  readStaffId,
  subscribeToStaffSession,
  writeStaffSession,
  type StaffSessionStatus,
} from './session';

type StaffSessionValue = {
  /** 'loading' on the server and during hydration, then 'signed-out' or 'signed-in'. */
  status: StaffSessionStatus;
  staff: StaffMember | null;
  /** Every staff account, for @-mentions. */
  members: readonly StaffMember[];
  signIn: (staffId: string) => void;
  signOut: () => void;
};

const StaffSessionContext = createContext<StaffSessionValue | null>(null);

const getServerId = (): string | null => null;

/** `members` are the accounts the mock can sign in as. */
export function StaffSessionProvider({
  members,
  children,
}: {
  members: readonly StaffMember[];
  children: React.ReactNode;
}) {
  const staffId = useSyncExternalStore(subscribeToStaffSession, readStaffId, getServerId);
  // The server cannot read storage, so it and hydration agree on "loading".
  const hydrated = useSyncExternalStore(
    subscribeToStaffSession,
    () => true,
    () => false,
  );
  const staff = members.find((member) => member.id === staffId) ?? null;
  const status: StaffSessionStatus = !hydrated ? 'loading' : staff ? 'signed-in' : 'signed-out';

  const signIn = useCallback((id: string) => {
    writeStaffSession(id);
    notifyStaffSessionChange();
  }, []);

  const signOut = useCallback(() => {
    clearStaffSession();
    notifyStaffSessionChange();
  }, []);

  const value = useMemo<StaffSessionValue>(
    () => ({ status, staff, members, signIn, signOut }),
    [status, staff, members, signIn, signOut],
  );
  return <StaffSessionContext value={value}>{children}</StaffSessionContext>;
}

export function useStaffSession(): StaffSessionValue {
  const context = use(StaffSessionContext);
  if (!context) throw new Error('useStaffSession must be used inside <StaffSessionProvider>.');
  return context;
}
