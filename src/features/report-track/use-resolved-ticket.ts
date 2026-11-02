'use client';

import { useMemo, useSyncExternalStore } from 'react';
import type { Ticket } from '@/data/models/ticket';
import { findSubmittedReport } from '@/lib/reports';

export type ResolvedTicket =
  | { state: 'loading' }
  | { state: 'missing' }
  | { state: 'found'; ticket: Ticket; fromThisBrowser: boolean };

const subscribeNever = () => () => {};

/** False while rendering on the server and during hydration, true afterwards. */
function useMounted(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );
}

/**
 * The ticket from the mock data when the server found one, otherwise one sent from this browser
 * (read once mounted, so the server and first client render agree).
 */
export function useResolvedTicket(serverTicket: Ticket | null, id: string): ResolvedTicket {
  const mounted = useMounted();
  const stored = useMemo(
    () => (mounted && !serverTicket ? findSubmittedReport(id) : null),
    [mounted, serverTicket, id],
  );

  if (serverTicket) return { state: 'found', ticket: serverTicket, fromThisBrowser: false };
  if (!mounted) return { state: 'loading' };
  return stored ? { state: 'found', ticket: stored, fromThisBrowser: true } : { state: 'missing' };
}
