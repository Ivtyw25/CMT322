import { readStorage, writeStorage } from '@/lib/dom/safe-storage';
import type {
  AssigneeId,
  StaffInternalNote,
  StaffTicket,
  StaffTicketEvent,
  StaffTicketStatus,
  TicketPriority,
} from '@/data/models/staff-ticket';

/** What staff changed on a ticket in this browser. There is no backend, so it lives in storage. */
export type TicketEdit = {
  status?: StaffTicketStatus;
  assigneeId?: AssigneeId | null;
  priority?: TicketPriority;
  events: StaffTicketEvent[];
  notes: StaffInternalNote[];
};

export type TicketEditMap = Readonly<Record<string, TicketEdit>>;

export const TICKET_EDITS_STORAGE_KEY = 'mlc-staff-ticket-edits';

export const NO_EDITS: TicketEditMap = {};
const NO_EDIT: TicketEdit = { events: [], notes: [] };

function isEdit(value: unknown): value is TicketEdit {
  return (
    typeof value === 'object' &&
    value !== null &&
    'events' in value &&
    Array.isArray(value.events) &&
    'notes' in value &&
    Array.isArray(value.notes)
  );
}

function parseEdits(raw: string | null): TicketEditMap {
  if (!raw) return NO_EDITS;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) return NO_EDITS;
    const edits: Record<string, TicketEdit> = {};
    for (const [id, value] of Object.entries(parsed)) {
      if (isEdit(value)) edits[id] = value;
    }
    return edits;
  } catch {
    return NO_EDITS;
  }
}

// Kept in memory too, so an edit survives for this page view when storage is blocked.
let current: TicketEditMap | null = null;
const listeners = new Set<() => void>();

export function getTicketEdits(): TicketEditMap {
  if (current === null) current = parseEdits(readStorage('local', TICKET_EDITS_STORAGE_KEY));
  return current;
}

export function recordTicketEdit(
  ticketId: string,
  change: {
    status?: StaffTicketStatus;
    assigneeId?: AssigneeId | null;
    priority?: TicketPriority;
    events?: readonly StaffTicketEvent[];
    notes?: readonly StaffInternalNote[];
  },
): void {
  const edits = getTicketEdits();
  const before = edits[ticketId] ?? NO_EDIT;
  const after: TicketEdit = {
    ...before,
    ...(change.status !== undefined ? { status: change.status } : {}),
    ...(change.assigneeId !== undefined ? { assigneeId: change.assigneeId } : {}),
    ...(change.priority !== undefined ? { priority: change.priority } : {}),
    events: [...before.events, ...(change.events ?? [])],
    notes: [...before.notes, ...(change.notes ?? [])],
  };
  current = { ...edits, [ticketId]: after };
  writeStorage('local', TICKET_EDITS_STORAGE_KEY, JSON.stringify(current));
  listeners.forEach((notify) => notify());
}

/** For useSyncExternalStore: this tab's edits plus the `storage` event from other tabs. */
export function subscribeToTicketEdits(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === TICKET_EDITS_STORAGE_KEY || event.key === null) {
      current = null;
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/** The ticket as staff last left it. */
export function applyTicketEdit(ticket: StaffTicket, edit: TicketEdit | undefined): StaffTicket {
  if (!edit) return ticket;
  return {
    ...ticket,
    status: edit.status ?? ticket.status,
    assigneeId: edit.assigneeId !== undefined ? edit.assigneeId : ticket.assigneeId,
    priority: edit.priority ?? ticket.priority,
    events: [...ticket.events, ...edit.events],
    notes: [...ticket.notes, ...edit.notes],
  };
}
