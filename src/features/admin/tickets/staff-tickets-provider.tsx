'use client';

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from 'react';
import type { Assignee, ReplyTemplate, StaffTicket } from '@/data/models/staff-ticket';
import {
  applyTicketEdit,
  getTicketEdits,
  NO_EDITS,
  recordTicketEdit,
  subscribeToTicketEdits,
} from './ticket-edits';

type RecordChange = Parameters<typeof recordTicketEdit>[1];

type StaffTicketsValue = {
  /** Every ticket with the staff's edits applied, newest submitted first. */
  tickets: readonly StaffTicket[];
  assignees: readonly Assignee[];
  templates: readonly ReplyTemplate[];
  /** The mock "now" (ISO), moved on by the time spent on the page. */
  now: () => string;
  /** The mock "now" at page load, for filters that count back from today. */
  today: string;
  pendingCount: number;
  getTicket: (id: string) => StaffTicket | null;
  record: (ticketId: string, change: RecordChange) => void;
};

const StaffTicketsContext = createContext<StaffTicketsValue | null>(null);

type ProviderProps = {
  tickets: readonly StaffTicket[];
  assignees: readonly Assignee[];
  templates: readonly ReplyTemplate[];
  /** ISO date-time the mock site treats as now. */
  mockNow: string;
  children: React.ReactNode;
};

/** The ticket list plus the edits staff made, shared by the sidebar, dashboard, queue and detail. */
export function StaffTicketsProvider({
  tickets,
  assignees,
  templates,
  mockNow,
  children,
}: ProviderProps) {
  const edits = useSyncExternalStore(subscribeToTicketEdits, getTicketEdits, () => NO_EDITS);
  const mountedAt = useRef<number | null>(null);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const merged = useMemo(
    () => tickets.map((ticket) => applyTicketEdit(ticket, edits[ticket.id])),
    [tickets, edits],
  );
  const pendingCount = useMemo(
    () => merged.filter((ticket) => ticket.status === 'pending').length,
    [merged],
  );

  const now = useCallback(() => {
    const elapsed = mountedAt.current === null ? 0 : Date.now() - mountedAt.current;
    return new Date(Date.parse(mockNow) + elapsed).toISOString();
  }, [mockNow]);

  const getTicket = useCallback(
    (id: string) => merged.find((ticket) => ticket.id === id) ?? null,
    [merged],
  );

  const value = useMemo<StaffTicketsValue>(
    () => ({
      tickets: merged,
      assignees,
      templates,
      now,
      today: mockNow,
      pendingCount,
      getTicket,
      record: recordTicketEdit,
    }),
    [merged, assignees, templates, now, mockNow, pendingCount, getTicket],
  );
  return <StaffTicketsContext value={value}>{children}</StaffTicketsContext>;
}

export function useStaffTickets(): StaffTicketsValue {
  const context = use(StaffTicketsContext);
  if (!context) throw new Error('useStaffTickets must be used inside <StaffTicketsProvider>.');
  return context;
}
