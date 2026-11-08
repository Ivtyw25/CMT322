'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { Callout } from '@/components/ui/callout';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import type { ReportCategory } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { useTicket } from '@/lib/tickets';
import { takeSearchSubmitted } from './track-arrival';
import { TrackResult } from './track-result';
import { TRACK_INPUT_NAME } from './track-search';

const { notFound, errors, loading } = reportTrackCopy.track;

function TrackNotFound({ id }: { id: string }) {
  const announce = useAnnounce();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!takeSearchSubmitted()) return;
    box.current?.focus();
    announce(reportTrackCopy.track.announce.missing(id));
  }, [id, announce]);

  function tryAnother() {
    const field = document.querySelector<HTMLInputElement>(`input[name="${TRACK_INPUT_NAME}"]`);
    field?.focus();
    field?.select();
  }

  return (
    <div className="flex flex-col gap-4">
      <Callout ref={box} tabIndex={-1} tone="warning" title={notFound.title} titleAs="h2">
        <p>{errors.notFound(id)}</p>
        <p>{notFound.body}</p>
      </Callout>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="secondary" onClick={tryAnother}>
          {notFound.action}
        </Button>
        <ButtonLink variant="ghost" href={routes.reportTrack.report} className="justify-center">
          {reportTrackCopy.shared.breadcrumb.report}
        </ButtonLink>
      </div>
    </div>
  );
}

type TrackViewProps = {
  ticketId: string;
  categories: readonly ReportCategory[];
};

/** What sits under the search on /track/[id]: the ticket, or why there is none. */
export function TrackView({ ticketId, categories }: TrackViewProps) {
  const resolved = useTicket(ticketId);

  if (resolved.state === 'loading') {
    return (
      <div role="status" aria-busy="true" aria-label={loading} className="flex flex-col gap-6">
        <div className="h-6 w-1/2 rounded-md bg-gray-100" />
        <div className="h-20 w-full rounded-md bg-gray-100" />
        <div className="h-40 w-full rounded-md bg-gray-100" />
      </div>
    );
  }
  if (resolved.state === 'missing') return <TrackNotFound id={ticketId} />;
  return (
    <TrackResult
      ticket={resolved.ticket}
      category={categories.find((category) => category.id === resolved.ticket.categoryId)}
    />
  );
}
