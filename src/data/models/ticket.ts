import type { StationCode } from './station';

/** Format MLC-YYMMDD-NNNN, e.g. MLC-261028-0482. */
export type TicketId = `MLC-${string}-${string}`;
export const TICKET_ID_PATTERN = /^MLC-\d{6}-\d{4}$/;

export type TicketStatus = 'submitted' | 'pending' | 'in-progress' | 'resolved';
export type ReportType = 'complaint' | 'hazard' | 'suggestion';

export type TicketUpdate = {
  id: string;
  /** ISO 8601 date-time. */
  at: string;
  status: TicketStatus;
  author: string;
  message: string;
};

export type Ticket = {
  id: TicketId;
  type: ReportType;
  category: string;
  title: string;
  description: string;
  location: string;
  stationCode: StationCode | null;
  status: TicketStatus;
  submittedAt: string;
  attachmentCount: number;
  updates: TicketUpdate[];
};
