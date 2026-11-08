import type { Ticket } from '@/data/models/ticket';
import { isHandler } from '@/lib/tickets';

/** Why a staff member is notified. */
export type NotificationKind = 'mention' | 'comment' | 'reporter-reply';

export type StaffNotification = {
  /** The ID of the note or reporter reply it comes from. */
  id: string;
  kind: NotificationKind;
  /** ISO 8601 date-time. */
  at: string;
  ticketId: string;
  /** The staff member or reporter who wrote it. */
  actor: string;
  /** The start of what was written. */
  excerpt: string;
};

const EXCERPT_LENGTH = 90;

function excerptOf(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length <= EXCERPT_LENGTH ? flat : `${flat.slice(0, EXCERPT_LENGTH).trimEnd()}…`;
}

/**
 * What a staff member is told about, newest first, worked out from the tickets' notes and reporter
 * replies: an @-mention in a note by someone else, a note by someone else on a ticket they handle,
 * and a reporter reply on a ticket they handle.
 */
export function notificationsFor(tickets: readonly Ticket[], staffId: string): StaffNotification[] {
  const found = tickets.flatMap((ticket): StaffNotification[] => {
    const handling = isHandler(ticket, staffId);
    const fromNotes = ticket.notes.flatMap((note): StaffNotification[] => {
      if (note.authorId === staffId) return [];
      const mentioned = note.mentions.includes(staffId);
      if (!mentioned && !handling) return [];
      return [
        {
          id: note.id,
          kind: mentioned ? 'mention' : 'comment',
          at: note.at,
          ticketId: ticket.id,
          actor: note.author,
          excerpt: excerptOf(note.text),
        },
      ];
    });
    const fromReporter = handling
      ? ticket.reporterReplies.map((reply): StaffNotification => ({
          id: reply.id,
          kind: 'reporter-reply',
          at: reply.at,
          ticketId: ticket.id,
          actor: reply.name,
          excerpt: excerptOf(reply.body),
        }))
      : [];
    return [...fromNotes, ...fromReporter];
  });
  return found.toSorted((a, b) => Date.parse(b.at) - Date.parse(a.at));
}
