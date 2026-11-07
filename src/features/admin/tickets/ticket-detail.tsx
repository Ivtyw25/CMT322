'use client';

import { ChevronLeft, Mail, MapPin, Phone, User } from 'lucide-react';
import Link from 'next/link';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { ButtonLink } from '@/components/ui/button-link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffTicket } from '@/data/models/staff-ticket';
import type { ReportCategory } from '@/data/models/ticket';
import { AdminPanel } from '@/features/admin/panel';
import { formatFileSize } from '@/lib/format/file-size';
import { useStaffSession } from '@/lib/staff-session';
import { useStaffTickets } from './staff-tickets-provider';
import { TicketNotes } from './ticket-notes';
import { TicketSiteNote } from './ticket-site-note';
import { priorityTagOf, statusTagOf } from './ticket-tags';
import { TicketTimeline } from './ticket-timeline';
import { TicketUpdateForm } from './ticket-update-form';

const copy = adminCopy.ticket;

const lowerFirst = (text: string) => text.charAt(0).toLowerCase() + text.slice(1);

function ReportBody({ ticket }: { ticket: StaffTicket }) {
  return (
    <AdminPanel headingId="report-heading" title={copy.report.title} className="gap-3.5 px-6 py-5">
      <p className="type-body-m text-gray-800">{ticket.description}</p>
      {ticket.attachments.length > 0 ? (
        <ul aria-label={copy.report.attachments} className="flex flex-wrap gap-3">
          {ticket.attachments.map((file) => (
            <li key={file.id} className="flex w-45 max-w-full flex-col gap-1.5">
              <ImagePlaceholder decorative className="h-28 rounded-lg" />
              <p className="type-body-xs-medium break-all text-gray-800">{file.fileName}</p>
              <p className="type-body-xs text-gray-500">{formatFileSize(file.sizeBytes)}</p>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-wrap gap-4">
        {ticket.coordinates ? (
          <div
            role="img"
            aria-label={copy.report.mapLabel(ticket.location)}
            className="relative h-30 w-55 max-w-full shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100"
          >
            <span aria-hidden className="absolute top-16 -left-6 h-3.5 w-65 rotate-12 bg-surface" />
            <MapPin aria-hidden className="absolute top-8.75 left-23.75 size-7 text-primary-600" />
          </div>
        ) : null}
        <div className="flex min-w-0 flex-1 basis-48 flex-col gap-1">
          <p className="type-body-s-medium text-gray-900">{ticket.location}</p>
          {ticket.coordinates ? (
            <p className="type-body-xs text-gray-500">
              {copy.report.coordinates(ticket.coordinates.lat, ticket.coordinates.lng)}
            </p>
          ) : null}
          {ticket.locationNote ? (
            <p className="type-body-xs text-gray-500">{ticket.locationNote}</p>
          ) : null}
        </div>
      </div>
    </AdminPanel>
  );
}

function ReporterCard({ ticket }: { ticket: StaffTicket }) {
  const reporter = ticket.reporter;
  return (
    <AdminPanel headingId="reporter-heading" title={copy.reporter.title} className="gap-2.5 p-5">
      {reporter ? (
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
      ) : (
        <p className="type-body-s text-gray-700">{copy.reporter.none}</p>
      )}
      <p className="type-body-xs text-gray-500">{copy.reporter.visibility}</p>
    </AdminPanel>
  );
}

type TicketDetailProps = {
  ticketId: string;
  categories: readonly ReportCategory[];
};

/** One ticket for staff (Figma 115:5036): the report, its timeline, notes and the update panel. */
export function TicketDetail({ ticketId, categories }: TicketDetailProps) {
  const { staff } = useStaffSession();
  const { getTicket } = useStaffTickets();
  const ticket = getTicket(ticketId);
  if (!staff) return null;
  const authority = staff.role === 'authority';

  if (!ticket) {
    return (
      <div className="max-w-xl flex flex-col items-start gap-3">
        <h1 className="type-heading-s text-gray-900">{copy.notFound.title}</h1>
        <p className="type-body-s text-gray-600">{copy.notFound.body}</p>
        <ButtonLink href={authority ? routes.admin.tickets : routes.admin.dashboard}>
          {authority ? copy.back : copy.backToDashboard}
        </ButtonLink>
      </div>
    );
  }

  const category = categories.find((candidate) => candidate.id === ticket.categoryId);
  const typeLabel = adminCopy.tickets.types[ticket.type];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={authority ? routes.admin.tickets : routes.admin.dashboard}
        className="hit-area flex w-fit items-center gap-1.5 type-body-s-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
      >
        <ChevronLeft aria-hidden className="size-4" />
        {authority ? copy.back : copy.backToDashboard}
      </Link>

      <div className="flex flex-col gap-2">
        <p className="type-body-s-medium text-gray-500">{ticket.id}</p>
        <h1 className="type-heading-s text-gray-900">{ticket.subject}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <Tag kind={statusTagOf[ticket.status]} />
          <Tag kind={priorityTagOf[ticket.priority]} />
          <p className="type-body-s text-gray-600">
            {category ? copy.categoryLine(typeLabel, lowerFirst(category.label)) : typeLabel}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="flex min-w-0 flex-col gap-5 xl:flex-1">
          <ReportBody ticket={ticket} />
          <AdminPanel
            headingId="timeline-heading"
            title={copy.timeline.title}
            className="px-6 py-5"
          >
            <TicketTimeline ticket={ticket} />
          </AdminPanel>
          <TicketNotes ticket={ticket} staff={staff} />
        </div>
        <div className="flex flex-col gap-5 xl:w-95 xl:shrink-0">
          {authority ? (
            <AdminPanel
              headingId="update-heading"
              title={adminCopy.ticket.update.title}
              className="gap-4 p-5"
            >
              <TicketUpdateForm key={ticket.id} ticket={ticket} staff={staff} />
            </AdminPanel>
          ) : (
            <TicketSiteNote ticket={ticket} staff={staff} />
          )}
          <ReporterCard ticket={ticket} />
        </div>
      </div>
    </div>
  );
}
