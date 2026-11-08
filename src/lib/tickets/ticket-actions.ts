import type { StaffMember } from '@/data/models/staff';
import type {
  ReplyStatus,
  Ticket,
  TicketAttachment,
  TicketId,
  TicketPriority,
} from '@/data/models/ticket';
import type { AttachmentFile } from './attachment-blobs';

/** What the report form sends. */
export type NewTicketInput = Pick<
  Ticket,
  | 'type'
  | 'categoryId'
  | 'subject'
  | 'description'
  | 'location'
  | 'coordinates'
  | 'stationCode'
  | 'areaLabel'
  | 'reporterId'
  | 'reporter'
>;

/** What the staff reply form sends. */
export type ReplyInput = {
  status: ReplyStatus;
  priority: TicketPriority;
  subject: string;
  body: string;
};

/** The attachment records for some files, and the files to keep under the same IDs. */
export function describeFiles(
  idPrefix: string,
  files: readonly File[],
): { attachments: TicketAttachment[]; blobs: AttachmentFile[] } {
  const blobs = files.map((file, index) => ({ id: `${idPrefix}-f${index + 1}`, file }));
  const attachments = blobs.map(({ id, file }) => ({
    id,
    fileName: file.name,
    sizeBytes: file.size,
    mimeType: file.type,
  }));
  return { attachments, blobs };
}

export const nextReplyId = (ticket: Ticket) => `${ticket.id}-r${ticket.replies.length + 1}`;

/** A report as it is saved on send: Submitted, unclaimed, no replies. */
export function createTicket(
  input: NewTicketInput,
  id: TicketId,
  at: string,
  attachments: TicketAttachment[],
): Ticket {
  return {
    ...input,
    id,
    status: 'submitted',
    priority: 'normal',
    submittedAt: at,
    attachments,
    handler: null,
    replies: [],
    events: [],
    notes: [],
  };
}

/** The staff member takes the ticket: they become its handler and the status moves to Pending. */
export function claimTicket(ticket: Ticket, staff: StaffMember, at: string): Ticket {
  return {
    ...ticket,
    status: 'pending',
    handler: { staffId: staff.id, name: staff.name, organisation: staff.organisation },
    events: [
      ...ticket.events,
      { id: `${ticket.id}-e${ticket.events.length + 1}`, at, by: staff.name, kind: 'claimed' },
    ],
  };
}

/** A reply to the reporter. It carries the new status when the status changed. */
export function addReply(
  ticket: Ticket,
  input: ReplyInput,
  staff: StaffMember,
  at: string,
  attachments: TicketAttachment[],
): Ticket {
  const priorityChanged = input.priority !== ticket.priority;
  return {
    ...ticket,
    status: input.status,
    priority: input.priority,
    replies: [
      ...ticket.replies,
      {
        id: nextReplyId(ticket),
        at,
        staffName: staff.name,
        organisation: staff.organisation,
        subject: input.subject,
        body: input.body,
        attachments,
        status: input.status === ticket.status ? null : input.status,
      },
    ],
    events: priorityChanged
      ? [
          ...ticket.events,
          {
            id: `${ticket.id}-e${ticket.events.length + 1}`,
            at,
            by: staff.name,
            kind: 'priority',
            priority: input.priority,
          },
        ]
      : ticket.events,
  };
}

/** A note only staff can read. */
export function addNote(ticket: Ticket, text: string, staff: StaffMember, at: string): Ticket {
  return {
    ...ticket,
    notes: [
      ...ticket.notes,
      { id: `${ticket.id}-n${ticket.notes.length + 1}`, at, author: staff.name, text },
    ],
  };
}
