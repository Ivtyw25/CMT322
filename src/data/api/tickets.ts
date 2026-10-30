import { reportCategories } from '@/data/mock/report-categories';
import { tickets } from '@/data/mock/tickets';
import type { StationCode } from '@/data/models/station';
import type { ReportCategory, Ticket } from '@/data/models/ticket';

const newestFirst = (a: Ticket, b: Ticket) => b.updatedAt.localeCompare(a.updatedAt);

/** Looks a ticket up by ID, ignoring case and surrounding spaces. */
export async function getTicket(id: string): Promise<Ticket | null> {
  const wanted = id.trim().toUpperCase();
  return tickets.find((ticket) => ticket.id === wanted) ?? null;
}

/** A user's own tickets, most recently updated first. */
export async function getTicketsForUser(userId: string): Promise<Ticket[]> {
  return tickets.filter((ticket) => ticket.reporterId === userId).sort(newestFirst);
}

/** Every report linked to a station ("Reports near this station"), most recently updated first. */
export async function getTicketsNearStation(code: StationCode): Promise<Ticket[]> {
  return tickets.filter((ticket) => ticket.stationCode === code).sort(newestFirst);
}

/** Report form "Category" options, in display order. */
export async function getReportCategories(): Promise<ReportCategory[]> {
  return reportCategories;
}
