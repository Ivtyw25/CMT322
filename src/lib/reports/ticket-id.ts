import { TICKET_ID_PATTERN } from '@/data/models/ticket';

const DASHES = /[‐-―−]/g;

/** Trims, upper-cases, turns dash-like characters into "-" and removes inner spaces. */
export function normaliseTicketId(raw: string): string {
  return raw.replace(DASHES, '-').replace(/\s+/g, '').toUpperCase();
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
