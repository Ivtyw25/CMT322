'use client';

import Link from 'next/link';
import { Tag } from '@/components/ui/tag';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { Ticket } from '@/data/models/ticket';
import { cn } from '@/lib/cn';
import { formatShortDateTime } from '@/lib/format/date-time';
import { priorityTagOf, statusTagOf } from './ticket-tags';

const copy = adminCopy.tickets;

type TicketResultsProps = {
  tickets: readonly Ticket[];
};

const headCell = 'px-4 py-2.5 text-left type-body-xs-semibold text-gray-600';
const bodyCell = 'px-4 py-3 align-middle';

/**
 * The ticket list. From 1280 px it is a table (Figma 115:4796); below that each ticket is a card,
 * because seven columns do not fit. Each row or card has one link, stretched over its whole area.
 */
export function TicketResults({ tickets }: TicketResultsProps) {
  return (
    <>
      <table className="hidden w-full xl:table">
        <caption className="sr-only">{copy.table.label}</caption>
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th scope="col" className={headCell}>
              {copy.table.columns.ticket}
            </th>
            <th scope="col" className={headCell}>
              {copy.table.columns.subject}
            </th>
            <th scope="col" className={headCell}>
              {copy.table.columns.area}
            </th>
            <th scope="col" className={headCell}>
              {copy.table.columns.submitted}
            </th>
            <th scope="col" className={headCell}>
              {copy.table.columns.handledBy}
            </th>
            <th scope="col" className={headCell}>
              {copy.table.columns.priority}
            </th>
            <th scope="col" className={headCell}>
              {copy.table.columns.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr
              key={ticket.id}
              className="relative border-b border-gray-200 transition-colors duration-(--duration-fast) hover:bg-primary-50"
            >
              <td className={cn(bodyCell, 'whitespace-nowrap')}>
                <Link
                  href={routes.admin.ticket(ticket.id)}
                  className="type-body-s-medium text-primary-700 before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 focus-visible:before:outline-primary-600"
                >
                  {ticket.id}
                </Link>
              </td>
              <td className={bodyCell}>
                <p className="type-body-s-medium text-gray-900">{ticket.subject}</p>
                <p className="type-body-xs text-gray-500">{copy.types[ticket.type]}</p>
              </td>
              <td className={cn(bodyCell, 'type-body-s text-gray-700')}>{ticket.areaLabel}</td>
              <td className={cn(bodyCell, 'type-body-s whitespace-nowrap text-gray-700')}>
                {formatShortDateTime(ticket.submittedAt)}
              </td>
              <td
                className={cn(
                  bodyCell,
                  'type-body-s',
                  ticket.handler ? 'text-gray-700' : 'text-gray-400',
                )}
              >
                {ticket.handler?.name ?? copy.table.unclaimed}
              </td>
              <td className={bodyCell}>
                <Tag kind={priorityTagOf[ticket.priority]} />
              </td>
              <td className={bodyCell}>
                <Tag kind={statusTagOf[ticket.status]} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul aria-label={copy.table.label} className="flex flex-col xl:hidden">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className="relative flex flex-col gap-3 border-b border-gray-200 p-4 transition-colors duration-(--duration-fast) hover:bg-primary-50"
          >
            <div className="flex items-start gap-3">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <Link
                  href={routes.admin.ticket(ticket.id)}
                  className="type-body-s-medium text-primary-700 before:absolute before:inset-0 focus-visible:outline-none focus-visible:before:outline-2 focus-visible:before:-outline-offset-2 focus-visible:before:outline-primary-600"
                >
                  {ticket.id}
                </Link>
                <p className="type-body-s-medium text-gray-900">{ticket.subject}</p>
                <p className="type-body-xs text-gray-500">{copy.types[ticket.type]}</p>
              </div>
              <Tag kind={statusTagOf[ticket.status]} />
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 sm:grid-cols-4">
              <div className="flex flex-col gap-0.5">
                <dt className="type-body-xs text-gray-500">{copy.table.columns.area}</dt>
                <dd className="type-body-s text-gray-700">{ticket.areaLabel}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="type-body-xs text-gray-500">{copy.table.columns.submitted}</dt>
                <dd className="type-body-s text-gray-700">
                  {formatShortDateTime(ticket.submittedAt)}
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="type-body-xs text-gray-500">{copy.table.columns.handledBy}</dt>
                <dd
                  className={cn('type-body-s', ticket.handler ? 'text-gray-700' : 'text-gray-400')}
                >
                  {ticket.handler?.name ?? copy.table.unclaimed}
                </dd>
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <dt className="type-body-xs text-gray-500">{copy.table.columns.priority}</dt>
                <dd>
                  <Tag kind={priorityTagOf[ticket.priority]} />
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
