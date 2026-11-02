'use client';

import { Calendar, MapPin, Tag as TagIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { DocsSection } from '@/components/patterns/docs-section';
import { Stepper } from '@/components/patterns/stepper';
import { Tag, type TagKind } from '@/components/ui/tag';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { ReportCategory, Ticket, TicketStatus } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { formatDate } from '@/lib/format/dates';
import { isoDateOf } from '@/lib/format/date-time';
import { takeSearchSubmitted } from './track-arrival';
import { TrackReportSection } from './track-report-section';
import { TrackUpdates } from './track-updates';
import { ticketSteps } from './ticket-steps';

const { result, onThisPage } = reportTrackCopy.track;

const tagOf: Record<TicketStatus, TagKind> = {
  submitted: 'submitted',
  pending: 'pending',
  'in-progress': 'inProgress',
  resolved: 'resolved',
};

type TrackResultProps = {
  ticket: Ticket;
  category: ReportCategory | undefined;
};

/** A found ticket: summary, status steps, the authority's replies and the report. */
export function TrackResult({ ticket, category }: TrackResultProps) {
  const announce = useAnnounce();
  const summary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!takeSearchSubmitted()) return;
    summary.current?.focus();
    announce(reportTrackCopy.track.announce.found(ticket.id, uiCopy.ticketStatus[ticket.status]));
  }, [ticket.id, ticket.status, announce]);

  const typeLabel = uiCopy.reportTypes[ticket.type];
  const kind = category
    ? uiCopy.reportTypes.withCategory(typeLabel, category.shortLabel)
    : typeLabel;

  return (
    <div className="flex flex-col gap-10">
      <div id="result" ref={summary} tabIndex={-1} className="flex flex-col gap-2 outline-none">
        <div className="flex flex-col-reverse items-start gap-2 min-[390px]:flex-row min-[390px]:items-center min-[390px]:justify-between">
          <p className="type-body-s text-gray-600">{ticket.id}</p>
          <Tag kind={tagOf[ticket.status]} />
        </div>
        <h2 className="type-heading-xs wrap-anywhere md:type-heading-s">{ticket.title}</h2>
        <ul className="flex flex-col gap-2 type-body-s text-gray-600 md:flex-row md:flex-wrap md:gap-x-5">
          <li className="flex items-center gap-1.5">
            <TagIcon aria-hidden className="size-4 shrink-0" />
            {kind}
          </li>
          <li className="flex items-center gap-1.5">
            <MapPin aria-hidden className="size-4 shrink-0" />
            {ticket.location}
          </li>
          <li className="flex items-center gap-1.5">
            <Calendar aria-hidden className="size-4 shrink-0" />
            {result.submittedOn(formatDate(isoDateOf(ticket.submittedAt)))}
          </li>
        </ul>
      </div>
      <DocsSection id="status" title={onThisPage.status}>
        <Stepper steps={ticketSteps(ticket)} tone="primary" />
      </DocsSection>
      <DocsSection id="updates" title={onThisPage.updates}>
        <TrackUpdates updates={ticket.updates} />
      </DocsSection>
      <DocsSection id="report" title={result.report.title}>
        <TrackReportSection ticket={ticket} />
      </DocsSection>
    </div>
  );
}
