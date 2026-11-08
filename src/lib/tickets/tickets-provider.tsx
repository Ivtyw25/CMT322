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
  addReporterReply,
  claimTicket,
  createTicket,
  describeFiles,
  nextReplyId,
  nextReporterReplyId,
  type NewTicketInput,
  type ReplyInput,
} from './ticket-actions';
import { isHandler, isUnclaimed } from './ticket-selectors';
import { ticketStore } from './ticket-store';

type TicketsValue = {
  /** Every ticket, demo and new, newest submitted first. */
  tickets: readonly Ticket[];
  /** False on the server and during hydration, before this browser's tickets are read. */
  ready: boolean;
  getTicket: (id: string) => Ticket | null;
  /** Tickets nobody has picked up yet: Pending and unclaimed. */
  unclaimedCount: number;
  /** True for a report sent from this browser, whoever is signed in. */
  sentFromHere: (id: string) => boolean;
  /** The mock "now" (ISO). */
  now: () => string;
  /** Saves a report as Pending and unclaimed. Resolves with the saved ticket. */
  submitTicket: (input: NewTicketInput, files: readonly File[]) => Promise<Ticket>;
  /** The staff member takes an unclaimed ticket: they become its handler and it moves to In progress. */
  claim: (ticketId: string, staff: StaffMember) => void;
  /** Saves the handler's reply with its status and priority. Ignored for any other staff member. The reporter is emailed (simulated). */
  reply: (
    ticketId: string,
    input: ReplyInput,
    files: readonly File[],
    staff: StaffMember,
  ) => Promise<void>;
  /** An internal note. Any staff member can add one. `mentions` are the staff IDs it @-mentions. */
  addNote: (ticketId: string, text: string, mentions: string[], staff: StaffMember) => void;
  /** The reporter's reply from the Track page, with optional photos and files. */
  replyAsReporter: (ticketId: string, body: string, files: readonly File[]) => Promise<void>;
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
  const unclaimedCount = useMemo(() => tickets.filter(isUnclaimed).length, [tickets]);

  const now = useCallback(() => mockNow(anchor), [anchor]);
  const getTicket = useCallback(
    (id: string) => tickets.find((ticket) => ticket.id === id) ?? null,
    [tickets],
  );

  const demoIds = useMemo(
    () => new Set<string>(demoTickets.map((ticket) => ticket.id)),
    [demoTickets],
  );
  const sentFromHere = useCallback(
    (id: string) => !demoIds.has(id) && id in edits.upserts,
    [demoIds, edits],
  );

  const value = useMemo<TicketsValue>(() => {
    const current = (id: string): Ticket | null =>
      applyRecordEdits(demoTickets, ticketStore.getSnapshot()).find((t) => t.id === id) ?? null;

    return {
      tickets,
      ready,
      getTicket,
      unclaimedCount,
      sentFromHere,
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
        if (ticket && isUnclaimed(ticket)) {
          ticketStore.upsert(claimTicket(ticket, staff, now()));
        }
      },
      async reply(ticketId, input, files, staff) {
        const ticket = current(ticketId);
        if (!ticket || !isHandler(ticket, staff.id)) return;
        const { attachments, blobs } = describeFiles(nextReplyId(ticket), files);
        await saveAttachmentBlobs(blobs);
        const latest = current(ticketId) ?? ticket;
        ticketStore.upsert(addReply(latest, input, staff, now(), attachments));
      },
      addNote(ticketId, text, mentions, staff) {
        const ticket = current(ticketId);
        if (ticket) ticketStore.upsert(addNote(ticket, text, mentions, staff, now()));
      },
      async replyAsReporter(ticketId, body, files) {
        const ticket = current(ticketId);
        if (!ticket) return;
        const { attachments, blobs } = describeFiles(nextReporterReplyId(ticket), files);
        await saveAttachmentBlobs(blobs);
        const latest = current(ticketId) ?? ticket;
        ticketStore.upsert(addReporterReply(latest, body, now(), attachments));
      },
    };
  }, [demoTickets, tickets, ready, getTicket, unclaimedCount, sentFromHere, now]);

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
