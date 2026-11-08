'use client';

import { ChevronLeft, Mail, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { TicketThread } from '@/components/patterns/ticket-thread';
import { ButtonLink } from '@/components/ui/button-link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { ReplyTemplate, ReportCategory, Ticket } from '@/data/models/ticket';
import { AdminPanel } from '@/features/admin/panel';
import { useStaffSession } from '@/lib/staff-session';
import { useTicket } from '@/lib/tickets';
import { TicketClaimPanel } from './ticket-claim-panel';
import { TicketNotes } from './ticket-notes';
import { TicketReplyForm } from './ticket-reply-form';
import { priorityTagOf, statusTagOf } from './ticket-tags';

const copy = adminCopy.ticket;

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

function LocationPanel({ ticket }: { ticket: Ticket }) {
  return (
    <AdminPanel
      headingId="location-heading"
      title={copy.location.title}
      className="gap-3.5 px-6 py-5"
    >
      <div className="flex flex-wrap gap-4">
        <div
          role="img"
          aria-label={copy.location.mapLabel(ticket.location)}
          className="relative h-30 w-55 max-w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
        >
          <span aria-hidden className="absolute top-16 -left-6 h-3.5 w-65 rotate-12 bg-surface" />
          <MapPin aria-hidden className="absolute top-8.75 left-23.75 size-7 text-primary-600" />
        </div>
        <div className="flex min-w-0 flex-1 basis-48 flex-col gap-1">
          <p className="type-body-s-medium text-gray-900">{ticket.location}</p>
          <p className="type-body-xs text-gray-500">
            {copy.location.coordinates(ticket.coordinates.lat, ticket.coordinates.lng)}
          </p>
        </div>
      </div>
    </AdminPanel>
  );
}

function ReporterCard({ ticket }: { ticket: Ticket }) {
  const { reporter } = ticket;
  return (
    <AdminPanel headingId="reporter-heading" title={copy.reporter.title} className="gap-2.5 p-5">
      <ul className="flex flex-col gap-2.5">
        <li className="flex items-center gap-2.5 type-body-s text-gray-800">
          <User aria-hidden className="size-4 shrink-0 text-gray-500" />
          {reporter.name}
        </li>
        <li className="flex items-center gap-2.5 type-body-s text-gray-800">
          <Mail aria-hidden className="size-4 shrink-0 text-gray-500" />
          <span className="min-w-0 break-all">{reporter.email}</span>
        </li>
        <li className="flex items-center gap-2.5 type-body-s text-gray-800">
          <Phone aria-hidden className="size-4 shrink-0 text-gray-500" />
          {reporter.phone}
        </li>
      </ul>
    </AdminPanel>
  );
}

type TicketDetailProps = {
  ticketId: string;
  categories: readonly ReportCategory[];
  templates: readonly ReplyTemplate[];
};

/** One ticket for staff: claim it, read the conversation, reply, and keep internal notes. */
export function TicketDetail({ ticketId, categories, templates }: TicketDetailProps) {
  const { staff } = useStaffSession();
  const lookup = useTicket(ticketId);
  if (!staff || lookup.state === 'loading') return null;

  if (lookup.state === 'missing') {
    return (
      <div className="max-w-xl flex flex-col items-start gap-3">
        <h1 className="type-heading-s text-gray-900">{copy.notFound.title}</h1>
        <p className="type-body-s text-gray-600">{copy.notFound.body}</p>
        <ButtonLink href={routes.admin.tickets}>{copy.back}</ButtonLink>
      </div>
    );
  }

  const { ticket } = lookup;
  const category = categories.find((candidate) => candidate.id === ticket.categoryId);
  const typeLabel = adminCopy.tickets.types[ticket.type];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={routes.admin.tickets}
        className="hit-area flex w-fit items-center gap-1.5 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
      >
        <ChevronLeft aria-hidden className="size-4" />
        {copy.back}
      </Link>

      <div className="flex flex-col gap-2">
        <p className="type-body-s-medium text-gray-500">{ticket.id}</p>
        <h1 className="type-heading-s wrap-anywhere text-gray-900">{ticket.subject}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Tag kind={statusTagOf[ticket.status]} />
          <Tag kind={priorityTagOf[ticket.priority]} />
          <p className="type-body-s text-gray-600">
            {category ? copy.categoryLine(typeLabel, lowerFirst(category.label)) : typeLabel}
          </p>
        </div>
        <p className="type-body-s text-gray-700">
          {ticket.handler ? copy.handledBy(ticket.handler.name) : copy.notClaimed}
        </p>
      </div>

      {ticket.status === 'submitted' ? <TicketClaimPanel ticket={ticket} staff={staff} /> : null}

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-1">
          <AdminPanel
            headingId="conversation-heading"
            title={copy.conversation.title}
            className="px-6 py-5"
          >
            <TicketThread ticket={ticket} viewer="staff" />
          </AdminPanel>
          <LocationPanel ticket={ticket} />
          <TicketNotes ticket={ticket} staff={staff} />
        </div>
        <div className="flex flex-col gap-5 xl:w-95 xl:shrink-0">
          {ticket.status === 'submitted' ? null : (
            <AdminPanel headingId="reply-heading" title={copy.reply.title} className="gap-4 p-5">
              <TicketReplyForm
                key={ticket.id}
                ticket={ticket}
                staff={staff}
                templates={templates}
              />
            </AdminPanel>
          )}
          <ReporterCard ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
