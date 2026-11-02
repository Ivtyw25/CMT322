'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { TicketUpdate } from '@/data/models/ticket';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';
import { formatClockTime, isoDateOf } from '@/lib/format/date-time';

const { updates: copy } = reportTrackCopy.track.result;
const FIRST_PAGE = 5;
const CHUNK = 20;

/** The authority's replies as a rail, newest first. Older ones are revealed on request. */
export function TrackUpdates({ updates }: { updates: readonly TicketUpdate[] }) {
  const newestFirst = [...updates].reverse();
  const [shown, setShown] = useState(FIRST_PAGE);
  const [focusId, setFocusId] = useState<string | null>(null);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (focusId) list.current?.querySelector<HTMLElement>(`[data-update="${focusId}"]`)?.focus();
  }, [focusId]);

  if (updates.length === 0) return <p className="type-body-s text-gray-600">{copy.empty}</p>;

  const hidden = newestFirst.length - shown;
  const visible = newestFirst.slice(0, shown);

  function showMore() {
    setFocusId(newestFirst[shown]?.id ?? null);
    setShown((count) => count + CHUNK);
  }

  return (
    <div className="flex flex-col gap-4">
      <ol ref={list} className="flex flex-col">
        {visible.map((update, index) => (
          <li key={update.id} className="group flex gap-4 pb-6 last:pb-0">
            <span aria-hidden className="relative flex w-3 shrink-0 justify-center">
              <span className="absolute top-2.5 -bottom-8.5 left-1/2 w-0.5 -translate-x-1/2 bg-gray-200 group-last:hidden" />
              <span
                className={cn(
                  'relative z-10 mt-1.5 size-3 rounded-full',
                  index === 0 ? 'bg-primary-600' : 'bg-gray-300',
                )}
              />
            </span>
            <div
              data-update={update.id}
              tabIndex={-1}
              className="flex min-w-0 flex-1 flex-col gap-1 outline-none"
            >
              <p className="flex flex-col gap-0.5 min-[390px]:flex-row min-[390px]:flex-wrap min-[390px]:items-baseline min-[390px]:gap-x-3">
                <span className="type-body-s-semibold text-gray-900">{update.author}</span>
                <time dateTime={update.at} className="type-body-xs text-gray-500">
                  {formatDate(isoDateOf(update.at))}, {formatClockTime(update.at)}
                </time>
              </p>
              <p className="type-body-xs text-primary-700">
                {uiCopy.ticketStatus.statusLine(uiCopy.ticketStatus[update.status])}
              </p>
              <p className="type-body-s text-gray-700">{update.message}</p>
            </div>
          </li>
        ))}
      </ol>
      {hidden > 0 ? (
        <Button variant="ghost" onClick={showMore} className="self-start">
          {reportTrackCopy.track.result.earlier(Math.min(hidden, CHUNK))}
        </Button>
      ) : null}
    </div>
  );
}
