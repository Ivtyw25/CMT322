import { TicketAttachments } from '@/components/patterns/ticket-attachments';
import { uiCopy } from '@/content/ui';
import type { Ticket, TicketEvent, TicketReply, TicketReporterReply } from '@/data/models/ticket';
import { cn } from '@/lib/cn';
import { formatFullDateTime } from '@/lib/format/date-time';

type ThreadNode =
  | { kind: 'submission'; at: string }
  | { kind: 'reply'; at: string; reply: TicketReply }
  | { kind: 'reporter-reply'; at: string; reply: TicketReporterReply }
  | { kind: 'event'; at: string; event: TicketEvent };

type TicketThreadProps = {
  ticket: Ticket;
  /** Staff also see priority changes; the reporter does not. */
  viewer: 'reporter' | 'staff';
  /** Replaces the details of the submission, for a visitor who did not send the report. */
  submissionNotice?: React.ReactNode;
  /** The reporter's own replies. Staff always see them; the Track page shows them to the reporter only. */
  showReporterReplies?: boolean;
  className?: string;
};

function nodesOf(
  ticket: Ticket,
  viewer: TicketThreadProps['viewer'],
  showReporterReplies: boolean,
): ThreadNode[] {
  const events = ticket.events.filter((event) => viewer === 'staff' || event.kind === 'claimed');
  const reporterReplies = showReporterReplies ? ticket.reporterReplies : [];
  const later: ThreadNode[] = [
    ...ticket.replies.map((reply): ThreadNode => ({ kind: 'reply', at: reply.at, reply })),
    ...reporterReplies.map((reply): ThreadNode => ({
      kind: 'reporter-reply',
      at: reply.at,
      reply,
    })),
    ...events.map((event): ThreadNode => ({ kind: 'event', at: event.at, event })),
  ].toSorted((a, b) => Date.parse(a.at) - Date.parse(b.at));
  return [{ kind: 'submission', at: ticket.submittedAt }, ...later];
}

function eventText(event: TicketEvent): string {
  return event.kind === 'claimed'
    ? uiCopy.ticketThread.claimed(event.by)
    : uiCopy.ticketThread.priorityChanged(
        event.by,
        uiCopy.tags[event.priority === 'high' ? 'highPriority' : 'normal'],
      );
}

function NodeHeader({ who, at }: { who: string; at: string }) {
  return (
    <p className="flex flex-col gap-0.5 min-[390px]:flex-row min-[390px]:flex-wrap min-[390px]:items-baseline min-[390px]:gap-x-3">
      <span className="type-body-s-semibold text-gray-900">{who}</span>
      <time dateTime={at} className="type-body-xs text-gray-500">
        {formatFullDateTime(at)}
      </time>
    </p>
  );
}

/**
 * The conversation on a ticket, oldest first, on a line: the reporter's submission, then each staff
 * reply. Claiming (and, for staff, a priority change) shows as a small system line in between.
 */
export function TicketThread({
  ticket,
  viewer,
  submissionNotice,
  showReporterReplies = viewer === 'staff',
  className,
}: TicketThreadProps) {
  const copy = uiCopy.ticketThread;
  return (
    <ol aria-label={copy.label} className={cn('flex flex-col', className)}>
      {nodesOf(ticket, viewer, showReporterReplies).map((node) => {
        const system = node.kind === 'event';
        const key =
          node.kind === 'submission'
            ? 'submission'
            : node.kind === 'event'
              ? node.event.id
              : node.reply.id;
        return (
          <li key={key} className="group flex gap-4 pb-5 last:pb-0">
            <span aria-hidden className="relative flex w-3 shrink-0 justify-center">
              <span className="absolute top-2.5 -bottom-7.5 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200 group-last:hidden" />
              <span
                className={cn(
                  'relative z-10 rounded-full',
                  system ? 'mt-2 size-2 bg-gray-300' : 'mt-1.5 size-3 bg-primary-600',
                )}
              />
            </span>
            {node.kind === 'submission' ? (
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                {submissionNotice ?? (
                  <>
                    <NodeHeader who={copy.submittedBy(ticket.reporter.name)} at={node.at} />
                    <h3 className="type-body-m-semibold wrap-anywhere text-gray-900">
                      {ticket.subject}
                    </h3>
                    <p className="type-body-m wrap-anywhere whitespace-pre-line text-gray-700">
                      {ticket.description}
                    </p>
                    <TicketAttachments attachments={ticket.attachments} />
                  </>
                )}
              </div>
            ) : null}
            {node.kind === 'reply' ? (
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <NodeHeader
                  who={copy.repliedBy(node.reply.staffName, node.reply.organisation)}
                  at={node.at}
                />
                {node.reply.status ? (
                  <p className="type-body-xs-medium text-primary-700">
                    {copy.statusSet(uiCopy.ticketStatus[node.reply.status])}
                  </p>
                ) : null}
                <h3 className="type-body-m-semibold wrap-anywhere text-gray-900">
                  {node.reply.subject}
                </h3>
                <p className="type-body-m wrap-anywhere whitespace-pre-line text-gray-700">
                  {node.reply.body}
                </p>
                <TicketAttachments attachments={node.reply.attachments} />
              </div>
            ) : null}
            {node.kind === 'reporter-reply' ? (
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <NodeHeader who={copy.reporterReplied(node.reply.name)} at={node.at} />
                <p className="type-body-m wrap-anywhere whitespace-pre-line text-gray-700">
                  {node.reply.body}
                </p>
                <TicketAttachments attachments={node.reply.attachments} />
              </div>
            ) : null}
            {node.kind === 'event' ? (
              <p className="min-w-0 flex-1 type-body-xs text-gray-600">
                {eventText(node.event)}
                <time dateTime={node.at} className="ml-2 text-gray-500">
                  {formatFullDateTime(node.at)}
                </time>
              </p>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
