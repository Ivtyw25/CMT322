import { getToday } from '@/data/api/clock';
import type { ReportCategoryId, ReportType, Ticket, TicketId } from '@/data/models/ticket';
import type { StationCode } from '@/data/models/station';

/** Mock latency of sending a report. */
const SUBMIT_DELAY_MS = 1200;
/** The first ticket number of the day, so the IDs of new reports look like those of old ones. */
const FIRST_SEQUENCE = 500;
const MALAYSIA_OFFSET_MS = 8 * 60 * 60 * 1000;

export type SubmitReportInput = {
  type: ReportType;
  categoryId: ReportCategoryId;
  title: string;
  description: string;
  location: string;
  stationCode: StationCode | null;
  reporterId: string;
  attachmentCount: number;
  /** How many reports this browser has already sent; it moves the ticket number on. */
  sentCount: number;
};

/** The ticket ID of a report: `MLC-YYMMDD-NNNN`, dated on the mock today. */
function newTicketId(today: string, sentCount: number): TicketId {
  const day = today.replaceAll('-', '').slice(2);
  const sequence = String(FIRST_SEQUENCE + sentCount).padStart(4, '0');
  return `MLC-${day}-${sequence}`;
}

/** Sends a report. The mock waits, then returns the new ticket (status Submitted, one automated reply). */
export async function submitReport(input: SubmitReportInput): Promise<Ticket> {
  await new Promise((resolve) => setTimeout(resolve, SUBMIT_DELAY_MS));
  const today = await getToday();
  const clock = new Date(Date.now() + MALAYSIA_OFFSET_MS).toISOString().slice(11, 19);
  const at = `${today}T${clock}+08:00`;
  const id = newTicketId(today, input.sentCount);
  return {
    id,
    type: input.type,
    categoryId: input.categoryId,
    title: input.title,
    description: input.description,
    location: input.location,
    stationCode: input.stationCode,
    status: 'submitted',
    submittedAt: at,
    updatedAt: at,
    reporterId: input.reporterId,
    attachmentCount: input.attachmentCount,
    updates: [
      {
        id: `${id}-received`,
        at,
        status: 'submitted',
        author: 'Automated reply',
        message: 'We received your report and sent a confirmation to your email.',
      },
    ],
    resolution: null,
  };
}
