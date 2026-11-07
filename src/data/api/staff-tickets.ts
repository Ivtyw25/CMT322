import { assignees, replyTemplates } from '@/data/mock/staff-ticket-options';
import { staffTickets } from '@/data/mock/staff-tickets';
import type { Assignee, ReplyTemplate, StaffTicket } from '@/data/models/staff-ticket';
import type { TicketId } from '@/data/models/ticket';

const newestFirst = (a: StaffTicket, b: StaffTicket) =>
  Date.parse(b.submittedAt) - Date.parse(a.submittedAt);

/** Every ticket for the staff queue, newest submitted first. */
export async function getStaffTickets(): Promise<StaffTicket[]> {
  return [...staffTickets].sort(newestFirst);
}

/** Looks a ticket up by ID, ignoring case and surrounding spaces. */
export async function getStaffTicket(id: string): Promise<StaffTicket | null> {
  const wanted = id.trim().toUpperCase();
  return staffTickets.find((ticket) => ticket.id === wanted) ?? null;
}

export async function getStaffTicketIds(): Promise<TicketId[]> {
  return staffTickets.map((ticket) => ticket.id);
}

export async function getAssignees(): Promise<Assignee[]> {
  return assignees;
}

export async function getReplyTemplates(): Promise<ReplyTemplate[]> {
  return replyTemplates;
}
