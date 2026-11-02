'use client';

import { useEffect, useState } from 'react';
import type { Ticket } from '@/data/models/ticket';
import { findSubmittedReport } from '@/lib/reports';

export type ResolvedTicket =
  | { state: 'loading' }
  | { state: 'missing' }
  | { state: 'found'; ticket: Ticket; fromThisBrowser: boolean };

/**
 * The ticket from the mock data when the server found one, otherwise one sent from this browser
 * (read after mount, so the server and first client render agree).
 */
export function useResolvedTicket(serverTicket: Ticket | null, id: string): ResolvedTicket {
  const [stored, setStored] = useState<{ id: string; ticket: Ticket | null } | null>(null);

  useEffect(() => {
    if (serverTicket) return;
    setStored({ id, ticket: findSubmittedReport(id) });
  }, [serverTicket, id]);

  if (serverTicket) return { state: 'found', ticket: serverTicket, fromThisBrowser: false };
  if (stored?.id !== id) return { state: 'loading' };
  return stored.ticket
    ? { state: 'found', ticket: stored.ticket, fromThisBrowser: true }
    : { state: 'missing' };
}
