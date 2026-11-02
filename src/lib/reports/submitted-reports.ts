import type { Ticket } from '@/data/models/ticket';
import { readJson, writeJson } from '@/lib/storage';

/** Reports sent from this browser. The mock data has no write path, so they live here. */
export const SUBMITTED_REPORTS_KEY = 'mlc-submitted-reports';
const MAX_REPORTS = 20;

function isTicketList(value: unknown): value is Ticket[] {
  return (
    Array.isArray(value) &&
    value.every(
      (entry) => typeof entry === 'object' && entry !== null && 'id' in entry && 'status' in entry,
    )
  );
}

/** Newest first. Blocked or broken storage gives an empty list. */
export function readSubmittedReports(): Ticket[] {
  const stored = readJson(SUBMITTED_REPORTS_KEY);
  return isTicketList(stored) ? stored : [];
}

export function findSubmittedReport(id: string): Ticket | null {
  const wanted = id.trim().toUpperCase();
  return readSubmittedReports().find((ticket) => ticket.id === wanted) ?? null;
}

/** Adds a ticket at the top; the list keeps the newest 20. */
export function storeSubmittedReport(ticket: Ticket): void {
  const others = readSubmittedReports().filter((entry) => entry.id !== ticket.id);
  writeJson(SUBMITTED_REPORTS_KEY, [ticket, ...others].slice(0, MAX_REPORTS));
}
