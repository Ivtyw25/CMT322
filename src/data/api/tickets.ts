import { reportCategories } from '@/data/mock/report-categories';
import { tickets } from '@/data/mock/tickets';
import type { StationCode } from '@/data/models/station';
import type { ReportCategory, Ticket, TicketId } from '@/data/models/ticket';

const newestFirst = (a: Ticket, b: Ticket) => Date.parse(b.submittedAt) - Date.parse(a.submittedAt);

/**
 * The demo tickets, newest submitted first. Reports sent from the form and every staff action are
 * kept in the browser on top of these (src/lib/tickets), so both sides see the same list.
 */
export async function getTickets(): Promise<Ticket[]> {
  return [...tickets].sort(newestFirst);
}

/** Demo reports linked to a station ("Reports near this station"), newest first. */
export async function getTicketsNearStation(code: StationCode): Promise<Ticket[]> {
  return tickets.filter((ticket) => ticket.stationCode === code).sort(newestFirst);
}

/** Report form "Category" options, in display order. */
export async function getReportCategories(): Promise<ReportCategory[]> {
  return reportCategories;
}

/** The ID of every demo ticket, for generating the track and staff ticket pages ahead of time. */
export async function getTicketIds(): Promise<TicketId[]> {
  return tickets.map((ticket) => ticket.id);
}
