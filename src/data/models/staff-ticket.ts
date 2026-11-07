import type { ReportCategoryId, ReportType, TicketId, TicketStatus } from './ticket';

/** Staff handle three states; the commuter-only "submitted" step is part of pending for them. */
export type StaffTicketStatus = Exclude<TicketStatus, 'submitted'>;
export type TicketPriority = 'normal' | 'high';

export type AssigneeId =
  'mrt-corp' | 'traffic-contractor' | 'council-road-works' | 'council-drainage';

export type Assignee = { id: AssigneeId; label: string };

export type ReplyTemplateId = 'action-scheduled' | 'more-information' | 'resolved';

export type ReplyTemplate = { id: ReplyTemplateId; label: string; body: string };

/** A line on the staff timeline of a ticket. */
export type StaffTicketEvent = {
  id: string;
  /** ISO 8601 date-time. */
  at: string;
  /** The full sentence as shown, e.g. "Assigned to MRT Corp project team by Nurul Aisyah". */
  text: string;
  /** `site-note` is a note from the project team that the authority sees on the timeline. */
  kind: 'event' | 'site-note';
};

/** A note only staff can read. */
export type StaffInternalNote = {
  id: string;
  at: string;
  author: string;
  text: string;
};

export type TicketAttachment = {
  id: string;
  fileName: string;
  sizeBytes: number;
};

export type TicketReporter = {
  name: string;
  email: string;
  phone: string;
};

export type StaffTicket = {
  id: TicketId;
  subject: string;
  type: ReportType;
  categoryId: ReportCategoryId;
  /** The reporter's own words. */
  description: string;
  /** Area label as the queue shows it, e.g. "Bayan Lepas". */
  areaLabel: string;
  /** Road and town, e.g. "Lebuh Kampung Jawa, Bayan Lepas". */
  location: string;
  coordinates: { lat: number; lng: number } | null;
  /** e.g. "Near the S05 FIZ South worksite". */
  locationNote: string | null;
  status: StaffTicketStatus;
  priority: TicketPriority;
  assigneeId: AssigneeId | null;
  /** ISO 8601 date-time. */
  submittedAt: string;
  /** Null when the reporter did not share contact details. */
  reporter: TicketReporter | null;
  attachments: TicketAttachment[];
  /** Oldest first. */
  events: StaffTicketEvent[];
  notes: StaffInternalNote[];
  /** The reply staff started to write. Null when nothing is drafted. */
  draftReply: { templateId: ReplyTemplateId | null; text: string } | null;
};
