'use client';

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import type { StaffMember } from '@/data/models/staff';
import type { Ticket } from '@/data/models/ticket';
import { newTicketId } from '@/lib/reports';
import { applyRecordEdits } from '@/lib/staff-records/record-store';
import { saveAttachmentBlobs } from './attachment-blobs';
import { mockNow } from './mock-clock';
import {
  addNote,
  addReply,
  claimTicket,
  createTicket,
  describeFiles,
  nextReplyId,
  type NewTicketInput,
  type ReplyInput,
} from './ticket-actions';
import { ticketStore } from './ticket-store';

type TicketsValue = {
  /** Every ticket, demo and new, newest submitted first. */
  tickets: readonly Ticket[];
  /** False on the server and during hydration, before this browser's tickets are read. */
  ready: boolean;
  getTicket: (id: string) => Ticket | null;
  /** Tickets no staff member has claimed yet. */
  unclaimedCount: number;
  /** The mock "now" (ISO). */
  now: () => string;
  /** Saves a report as Submitted and unclaimed. Resolves with the saved ticket. */
  submitTicket: (input: NewTicketInput, files: readonly File[]) => Promise<Ticket>;
  claim: (ticketId: string, staff: StaffMember) => void;
  /** Saves a reply and its status and priority. The reporter is emailed (simulated). */
  reply: (
    ticketId: string,
    input: ReplyInput,
    files: readonly File[],
    staff: StaffMember,
  ) => Promise<void>;
  addNote: (ticketId: string, text: string, staff: StaffMember) => void;
};

const TicketsContext = createContext<TicketsValue | null>(null);

const subscribeNever = () => () => {};

const byNewestSubmitted = (a: Ticket, b: Ticket) =>
  Date.parse(b.submittedAt) - Date.parse(a.submittedAt);

type ProviderProps = {
  /** The demo tickets from `getTickets()`. */
  demoTickets: readonly Ticket[];
  /** ISO date-time the mock site treats as now. */
  mockNow: string;
  children: ReactNode;
};

/**
 * The one ticket store of the site: demo tickets with this browser's changes on top (`mlc-tickets`).
 * The report form, Track, the profile and the whole staff portal read and write through it.
 */
export function TicketsProvider({ demoTickets, mockNow: anchor, children }: ProviderProps) {
  const edits = useSyncExternalStore(
    ticketStore.subscribe,
    ticketStore.getSnapshot,
    ticketStore.getServerSnapshot,
  );
  const ready = useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

  const tickets = useMemo(
    () => applyRecordEdits(demoTickets, edits).toSorted(byNewestSubmitted),
    [demoTickets, edits],
  );
  const unclaimedCount = useMemo(
    () => tickets.filter((ticket) => ticket.status === 'submitted').length,
    [tickets],
  );

  const now = useCallback(() => mockNow(anchor), [anchor]);
  const getTicket = useCallback(
    (id: string) => tickets.find((ticket) => ticket.id === id) ?? null,
    [tickets],
  );

  const value = useMemo<TicketsValue>(() => {
    const current = (id: string): Ticket | null =>
      applyRecordEdits(demoTickets, ticketStore.getSnapshot()).find((t) => t.id === id) ?? null;

    return {
      tickets,
      ready,
      getTicket,
      unclaimedCount,
      now,
      async submitTicket(input, files) {
        const at = now();
        const taken = applyRecordEdits(demoTickets, ticketStore.getSnapshot()).map((t) => t.id);
        const id = newTicketId(at, taken);
        const { attachments, blobs } = describeFiles(`${id}-s`, files);
        await saveAttachmentBlobs(blobs);
        const ticket = createTicket(input, id, at, attachments);
        ticketStore.upsert(ticket);
        return ticket;
      },
      claim(ticketId, staff) {
        const ticket = current(ticketId);
        if (ticket && ticket.status === 'submitted') {
          ticketStore.upsert(claimTicket(ticket, staff, now()));
        }
      },
      async reply(ticketId, input, files, staff) {
        const ticket = current(ticketId);
        if (!ticket) return;
        const { attachments, blobs } = describeFiles(nextReplyId(ticket), files);
        await saveAttachmentBlobs(blobs);
        const latest = current(ticketId) ?? ticket;
        ticketStore.upsert(addReply(latest, input, staff, now(), attachments));
      },
      addNote(ticketId, text, staff) {
        const ticket = current(ticketId);
        if (ticket) ticketStore.upsert(addNote(ticket, text, staff, now()));
      },
    };
  }, [demoTickets, tickets, ready, getTicket, unclaimedCount, now]);

  return <TicketsContext value={value}>{children}</TicketsContext>;
}

export function useTickets(): TicketsValue {
  const context = use(TicketsContext);
  if (!context) throw new Error('useTickets must be used inside <TicketsProvider>.');
  return context;
}

export type TicketLookup =
  { state: 'loading' } | { state: 'missing' } | { state: 'found'; ticket: Ticket };

/** One ticket by ID. A demo ticket is found at once; a new one once this browser's tickets are read. */
export function useTicket(id: string): TicketLookup {
  const { getTicket, ready } = useTickets();
  const ticket = getTicket(id);
  if (ticket) return { state: 'found', ticket };
  return ready ? { state: 'missing' } : { state: 'loading' };
}
