import { TICKET_ID_PATTERN, type TicketId } from '@/data/models/ticket';
import { isoDateOf } from '@/lib/format/date-time';

const DASHES = /[‐-―−]/g;

/** Trims, upper-cases, and treats dash-like characters and inner spaces as one "-" ("mlc 261028 0482"). */
export function normaliseTicketId(raw: string): string {
  return raw
    .trim()
    .replace(DASHES, '-')
    .replace(/\s*-\s*|\s+/g, '-')
    .replace(/-+/g, '-')
    .toUpperCase();
}

export type TicketIdProblem = 'empty' | 'invalid';

/** What is wrong with a normalised ID, or `null` when it has the ticket ID format. */
export function ticketIdProblem(normalised: string): TicketIdProblem | null {
  if (normalised === '') return 'empty';
  return TICKET_ID_PATTERN.test(normalised) ? null : 'invalid';
}

/** "MLC-261028-0482" as "M L C, 2 6 1 0 2 8, 0 4 8 2" so a screen reader says it by characters. */
export function spokenTicketId(id: string): string {
  return id
    .split('-')
    .map((part) => part.split('').join(' '))
    .join(', ');
}

/** The first ticket number when nothing newer exists, so new IDs look like the demo ones. */
const FIRST_SEQUENCE = 500;

/** The next ticket ID: `MLC-YYMMDD-NNNN` dated on `at`, numbered after every ID already taken. */
export function newTicketId(at: string, takenIds: readonly string[]): TicketId {
  const day = isoDateOf(at).replaceAll('-', '').slice(2);
  const highest = takenIds.reduce((max, id) => {
    const sequence = Number.parseInt(id.slice(-4), 10);
    return Number.isNaN(sequence) ? max : Math.max(max, sequence);
  }, FIRST_SEQUENCE - 1);
  return `MLC-${day}-${String(highest + 1).padStart(4, '0')}`;
}
