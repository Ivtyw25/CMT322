'use client';

import { Check } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { DocsPageHead } from '@/components/patterns/docs-page-head';
import { DocsSection } from '@/components/patterns/docs-section';
import { Stepper, type StepEntry } from '@/components/patterns/stepper';
import { ButtonLink } from '@/components/ui/button-link';
import { Callout } from '@/components/ui/callout';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import type { ReportCategory, Ticket } from '@/data/models/ticket';
import { useAnnounce } from '@/lib/announce/announcer';
import { formatShortDateTime } from '@/lib/format/date-time';
import { givenName } from '@/lib/format/person';
import { spokenTicketId } from '@/lib/reports';
import { useSession } from '@/lib/session';
import { SubmittedEmail } from './submitted-email';
import { SubmittedSent } from './submitted-sent';
import { SubmittedSkeleton } from './submitted-skeleton';
import { SubmittedTicketId } from './submitted-ticket-id';
import { useResolvedTicket } from './use-resolved-ticket';

const { submitted } = reportTrackCopy;
const ARRIVAL_WINDOW_MS = 60_000;

const breadcrumb = [
  { label: uiCopy.breadcrumb.home, href: routes.home },
  { label: reportTrackCopy.shared.breadcrumb.section, href: routes.reportTrack.overview },
  { label: reportTrackCopy.shared.breadcrumb.report, href: routes.reportTrack.report },
];
const breadcrumbCurrent = reportTrackCopy.shared.breadcrumb.submitted;

function nextSteps(ticket: Ticket): StepEntry[] {
  const { steps } = submitted.next;
  return [
    {
      id: 'submitted',
      label: steps.submitted.title,
      state: 'complete',
      detail: formatShortDateTime(ticket.submittedAt),
    },
    { id: 'pending', label: steps.pending.title, state: 'upcoming', detail: steps.pending.detail },
    {
      id: 'in-progress',
      label: steps['in-progress'].title,
      state: 'upcoming',
      detail: steps['in-progress'].detail,
    },
    {
      id: 'resolved',
      label: steps.resolved.title,
      state: 'upcoming',
      detail: steps.resolved.detail,
    },
  ];
}

type SubmittedViewProps = {
  ticketId: string;
  /** The ticket when the mock data has it; otherwise this browser's own reports are searched. */
  serverTicket: Ticket | null;
  categories: readonly ReportCategory[];
};

/** The confirmation: owner only. Everyone else, and unknown IDs, get the unavailable note. */
export function SubmittedView({ ticketId, serverTicket, categories }: SubmittedViewProps) {
  const resolved = useResolvedTicket(serverTicket, ticketId);
  const { status, user } = useSession();
  const announce = useAnnounce();
  const heading = useRef<HTMLHeadingElement>(null);
  const arrived = useRef(false);

  const ticket = resolved.state === 'found' ? resolved.ticket : null;
  const owner = ticket !== null && user !== null && ticket.reporterId === user.id;
  const fromThisBrowser = resolved.state === 'found' && resolved.fromThisBrowser;

  useEffect(() => {
    if (!owner || !fromThisBrowser || !ticket || arrived.current) return;
    if (Date.now() - new Date(ticket.submittedAt).getTime() >= ARRIVAL_WINDOW_MS) return;
    arrived.current = true;
    heading.current?.focus();
    announce(submitted.ticket.arrived(spokenTicketId(ticket.id)));
  }, [owner, fromThisBrowser, ticket, announce]);

  if (resolved.state === 'loading' || status === 'loading') {
    return (
      <div className="flex flex-col gap-10">
        <DocsPageHead
          title={submitted.header.title}
          lede={submitted.loading}
          breadcrumb={breadcrumb}
          breadcrumbCurrent={breadcrumbCurrent}
        />
        <SubmittedSkeleton />
      </div>
    );
  }

  if (!ticket || !owner || !user) {
    return (
      <div className="flex flex-col gap-8">
        <DocsPageHead
          title={submitted.unavailable.heading}
          lede={null}
          breadcrumb={breadcrumb}
          breadcrumbCurrent={breadcrumbCurrent}
        />
        <Callout tone="info">
          <p className="type-body-s-semibold text-gray-900">{submitted.unavailable.title}</p>
          <p>{submitted.unavailable.body}</p>
        </Callout>
        <div className="flex flex-col gap-3 sm:flex-row">
          {status === 'guest' ? (
            <ButtonLink
              href={routes.account.loginReturningTo(routes.reportTrack.submitted(ticketId))}
            >
              {submitted.unavailable.login}
            </ButtonLink>
          ) : null}
          <ButtonLink variant="secondary" href={routes.reportTrack.track}>
            {submitted.notFound.action}
          </ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <DocsPageHead
        title={submitted.header.title}
        lede={submitted.header.lede(givenName(user.name), user.email)}
        breadcrumb={breadcrumb}
        breadcrumbCurrent={breadcrumbCurrent}
        titleRef={heading}
        titleIcon={
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success-600 text-static-white"
          >
            <Check className="size-6" strokeWidth={3} />
          </span>
        }
      />
      <SubmittedTicketId id={ticket.id} />
      <DocsSection id="what-happens-next" title={submitted.next.title}>
        <Stepper steps={nextSteps(ticket)} tone="success" />
      </DocsSection>
      <DocsSection id="what-you-sent" title={submitted.sent.title}>
        <SubmittedSent
          ticket={ticket}
          category={categories.find((category) => category.id === ticket.categoryId)}
        />
      </DocsSection>
      <DocsSection id="confirmation-email" title={submitted.email.title}>
        <SubmittedEmail ticket={ticket} name={user.name} address={user.email} />
      </DocsSection>
      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        <ButtonLink href={routes.reportTrack.ticket(ticket.id)}>
          {submitted.actions.track}
        </ButtonLink>
        <ButtonLink variant="secondary" href={routes.reportTrack.report}>
          {submitted.actions.another}
        </ButtonLink>
        <ButtonLink variant="ghost" href={routes.home} className="justify-center md:px-2">
          {submitted.actions.home}
        </ButtonLink>
      </div>
    </div>
  );
}
