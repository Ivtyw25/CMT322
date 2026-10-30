import type { StationCode } from './station';

/** Format MLC-YYMMDD-NNNN, e.g. MLC-261028-0482. */
export type TicketId = `MLC-${string}-${string}`;
export const TICKET_ID_PATTERN = /^MLC-\d{6}-\d{4}$/;

export type TicketStatus = 'submitted' | 'pending' | 'in-progress' | 'resolved';
export type ReportType = 'complaint' | 'hazard' | 'suggestion';

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

export type TicketUpdate = {
  id: string;
  /** ISO 8601 date-time. */
  at: string;
  /** The status this update moved the ticket to. */
  status: TicketStatus;
  /** "Automated reply" or the organisation replying. */
  author: string;
  message: string;
};

export type Ticket = {
  id: TicketId;
  type: ReportType;
  categoryId: ReportCategoryId;
  title: string;
  /** The reporter's own words. */
  description: string;
  location: string;
  stationCode: StationCode | null;
  status: TicketStatus;
  /** ISO 8601 date-time. */
  submittedAt: string;
  /** ISO 8601 date-time of the latest update. */
  updatedAt: string;
  /** The account that sent it. Null for reports from other members of the public. */
  reporterId: string | null;
  attachmentCount: number;
  /** Oldest first. */
  updates: TicketUpdate[];
  /** What was done, shown once the ticket is resolved. Null until then. */
  resolution: string | null;
};
