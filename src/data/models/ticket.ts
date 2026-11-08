import type { StationCode } from './station';

/** Format MLC-YYMMDD-NNNN, e.g. MLC-261028-0482. */
export type TicketId = `MLC-${string}-${string}`;
export const TICKET_ID_PATTERN = /^MLC-\d{6}-\d{4}$/;

/** Submitted means no staff member has claimed the ticket yet. */
export type TicketStatus = 'submitted' | 'pending' | 'in-progress' | 'resolved';
/** The statuses a staff reply can set. Only claiming moves a ticket out of Submitted. */
export type ReplyStatus = Exclude<TicketStatus, 'submitted'>;
export type ReportType = 'complaint' | 'inquiry';
export type TicketPriority = 'normal' | 'high';

export type ReportCategoryId =
  | 'blocked-access'
  | 'noise'
  | 'dust'
  | 'road-damage'
  | 'drainage'
  | 'traffic'
  | 'safety'
  | 'property'
  | 'other';

export type ReportCategory = {
  id: ReportCategoryId;
  /** Select option, e.g. "Blocked access to home or business". */
  label: string;
  /** Lower-case form for "Complaint, blocked access". */
  shortLabel: string;
  /** Helper text under the select when this option is chosen. */
  hint: string;
};

/** A photo or file on a submission or a reply. The file itself lives in IndexedDB under `id`. */
export type TicketAttachment = {
  id: string;
  fileName: string;
  sizeBytes: number;
  mimeType: string;
};

/** Always shared: the form requires all three. */
export type TicketReporter = {
  name: string;
  email: string;
  phone: string;
};

/** The staff member who claimed a ticket. */
export type TicketHandler = {
  staffId: string;
  name: string;
  organisation: string;
};

/** A staff reply: one node of the conversation. */
export type TicketReply = {
  id: string;
  /** ISO 8601 date-time. */
  at: string;
  staffName: string;
  organisation: string;
  subject: string;
  body: string;
  attachments: TicketAttachment[];
  /** The status this reply set. Null when the status stayed the same. */
  status: ReplyStatus | null;
};

/** A small system line between the conversation nodes. */
export type TicketEvent = { id: string; at: string; by: string } & (
  { kind: 'claimed' } | { kind: 'priority'; priority: TicketPriority }
);

/** A note only staff can read. */
export type TicketNote = {
  id: string;
  at: string;
  author: string;
  text: string;
};

/** One ticket, as the commuter and the staff portal both see it. */
export type Ticket = {
  id: TicketId;
  type: ReportType;
  categoryId: ReportCategoryId;
  subject: string;
  /** The reporter's own words. */
  description: string;
  /** The street address the reporter confirmed, e.g. "Lebuh Kampung Jawa, Bayan Lepas". */
  location: string;
  coordinates: { lat: number; lng: number };
  /** The station nearest to the pin. */
  stationCode: StationCode | null;
  /** Area label as the queue shows it, e.g. "Bayan Lepas". */
  areaLabel: string;
  status: TicketStatus;
  priority: TicketPriority;
  /** ISO 8601 date-time. */
  submittedAt: string;
  /** The account that sent it. Null for reports from other members of the public. */
  reporterId: string | null;
  reporter: TicketReporter;
  attachments: TicketAttachment[];
  /** Null until a staff member claims the ticket. */
  handler: TicketHandler | null;
  /** Oldest first. */
  replies: TicketReply[];
  /** Oldest first. */
  events: TicketEvent[];
  /** Oldest first. */
  notes: TicketNote[];
};

export type ReplyTemplateId = 'action-scheduled' | 'more-information' | 'resolved';

export type ReplyTemplate = { id: ReplyTemplateId; label: string; subject: string; body: string };
