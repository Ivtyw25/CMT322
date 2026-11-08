'use client';

import { useMemo } from 'react';
import { adminCopy } from '@/content/admin';
import { cn } from '@/lib/cn';
import { useTickets } from '@/lib/tickets';
import { ticketCounts } from './dashboard-figures';
import { StatCard } from './stat-card';

const copy = adminCopy.dashboard.ticketCounts;

/** How many tickets are Pending, In progress and Resolved, counted from the ticket store. */
export function TicketCountCards({ className }: { className?: string }) {
  const { tickets, now } = useTickets();
  const nowIso = now();
  const { counts, pastTarget, averageDaysToResolve } = useMemo(
    () => ticketCounts(tickets, nowIso),
    [tickets, nowIso],
  );

  return (
    <div
      role="group"
      aria-label={copy.label}
      className={cn('grid grid-cols-1 gap-4 sm:grid-cols-3', className)}
    >
      <StatCard
        label={copy.pending.label}
        value={String(counts.pending)}
        hint={copy.pending.hint(pastTarget)}
        tone={pastTarget > 0 ? 'danger' : 'default'}
      />
      <StatCard
        label={copy.inProgress.label}
        value={String(counts['in-progress'])}
        hint={copy.inProgress.hint}
      />
      <StatCard
        label={copy.resolved.label}
        value={String(counts.resolved)}
        hint={copy.resolved.hint(averageDaysToResolve)}
      />
    </div>
  );
}
