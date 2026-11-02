import { InfoList } from '@/components/ui/info-list';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { ReportCategory, Ticket } from '@/data/models/ticket';
import { formatDate } from '@/lib/format/dates';
import { formatClockTime, isoDateOf } from '@/lib/format/date-time';

const { rows, attachments } = reportTrackCopy.submitted.sent;

/** "What you sent": the ticket's own fields as label/value rows. */
export function SubmittedSent({
  ticket,
  category,
}: {
  ticket: Ticket;
  category: ReportCategory | undefined;
}) {
  const submitted = `${formatDate(isoDateOf(ticket.submittedAt))}, ${formatClockTime(ticket.submittedAt)}`;
  return (
    <InfoList
      items={[
        { id: 'type', label: rows.type, value: uiCopy.reportTypes[ticket.type] },
        { id: 'category', label: rows.category, value: category?.label ?? ticket.categoryId },
        { id: 'subject', label: rows.subject, value: ticket.title },
        { id: 'location', label: rows.location, value: ticket.location },
        { id: 'attachments', label: rows.attachments, value: attachments(ticket.attachmentCount) },
        { id: 'submitted', label: rows.submitted, value: submitted },
      ]}
      className="[&_dd]:wrap-anywhere"
    />
  );
}
