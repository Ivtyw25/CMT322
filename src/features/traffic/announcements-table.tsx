import Link from 'next/link';
import { Tag } from '@/components/ui/tag';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { cn } from '@/lib/cn';
import type { AnnouncementRow } from './announcement-rows';

const copy = trafficCopy.announcements.table;

const linkClass =
  'hit-area whitespace-nowrap type-body-s-semibold text-primary-700 hover:text-primary-800 transition-colors duration-(--duration-fast)';

/** A cell of the table. Below 1280 px it is a label and value line inside the card. */
const cellClass = 'type-body-s max-xl:flex max-xl:gap-3 xl:px-3 xl:py-4 xl:align-middle';
const labelClass = 'w-24 shrink-0 text-gray-500 xl:hidden';

type AnnouncementsTableProps = {
  rows: readonly AnnouncementRow[];
  /** The row opened by a deep link: highlighted. */
  linkedId: string | null;
  /** "View notice" was clicked: the page highlights that row. */
  onViewNotice: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
};

/**
 * The announcements (Figma 1:671): a table from 1280 px, cards below. The elements keep their
 * table roles when CSS changes their display, so screen readers still read a table.
 */
export function AnnouncementsTable({ rows, linkedId, onViewNotice }: AnnouncementsTableProps) {
  const { columns, card } = copy;
  return (
    <div className="max-md:rounded-xl max-md:border max-md:border-gray-200 xl:overflow-hidden xl:rounded-xl xl:border xl:border-gray-200">
      <table role="table" className="w-full max-xl:block xl:border-separate xl:border-spacing-0">
        <caption className="sr-only">{copy.label}</caption>
        <thead role="rowgroup" className="max-xl:sr-only">
          <tr role="row" className="bg-gray-50 text-left type-body-xs-semibold text-gray-700">
            <th role="columnheader" scope="col" className="w-26 py-3 pr-3 pl-5 font-semibold">
              {columns.status}
            </th>
            <th role="columnheader" scope="col" className="w-56 px-3 py-3 font-semibold">
              {columns.announcement}
            </th>
            <th role="columnheader" scope="col" className="w-42.5 px-3 py-3 font-semibold">
              {columns.location}
            </th>
            <th role="columnheader" scope="col" className="w-27 px-3 py-3 font-semibold">
              {columns.start}
            </th>
            <th role="columnheader" scope="col" className="w-27 px-3 py-3 font-semibold">
              {columns.end}
            </th>
            <th role="columnheader" scope="col" className="w-26 px-3 py-3 font-semibold">
              {columns.duration}
            </th>
            <th role="columnheader" scope="col" className="w-32 px-3 py-3 font-semibold">
              {columns.notice}
            </th>
            <th role="columnheader" scope="col" className="w-25 px-3 py-3 font-semibold">
              <VisuallyHidden>{columns.map}</VisuallyHidden>
            </th>
          </tr>
        </thead>
        <tbody
          role="rowgroup"
          className="max-md:block max-md:divide-y max-md:divide-gray-200 md:max-xl:grid md:max-xl:grid-cols-2 md:max-xl:gap-4"
        >
          {rows.map((row) => {
            const linked = row.id === linkedId;
            return (
              <tr
                key={row.id}
                id={row.id}
                role="row"
                tabIndex={-1}
                data-linked={linked}
                className={cn(
                  'group/row scroll-mt-35 transition-colors duration-(--duration-fast) outline-none',
                  'max-xl:flex max-xl:flex-wrap max-xl:gap-x-6 max-xl:gap-y-3 max-xl:p-4',
                  'md:max-xl:rounded-xl md:max-xl:border md:max-xl:border-gray-200',
                  'data-[linked=true]:bg-primary-50 max-xl:data-[linked=true]:ring-2 max-xl:data-[linked=true]:ring-primary-300 max-xl:data-[linked=true]:ring-inset',
                  'xl:hover:bg-gray-50 xl:data-[linked=true]:hover:bg-primary-50',
                )}
              >
                <td
                  role="cell"
                  className="max-xl:basis-full xl:border-t xl:border-gray-200 xl:py-4 xl:pr-3 xl:pl-4"
                >
                  <Tag kind={row.status} />
                </td>
                <td
                  role="cell"
                  className="max-xl:flex max-xl:basis-full max-xl:flex-col max-xl:gap-1 xl:border-t xl:border-gray-200 xl:px-3 xl:py-4"
                >
                  {linked ? <VisuallyHidden>{copy.linked}</VisuallyHidden> : null}
                  <strong className="block type-body-s-semibold text-gray-900">{row.title}</strong>
                  <span className="block type-body-xs text-gray-600 xl:mt-1">{row.summary}</span>
                </td>
                <td
                  role="cell"
                  className={cn(cellClass, 'max-xl:basis-full xl:border-t xl:border-gray-200')}
                >
                  <span className={labelClass}>{card.location}</span>
                  <span className="text-gray-700">{row.location}</span>
                </td>
                <td
                  role="cell"
                  className="type-body-s text-gray-700 max-xl:hidden xl:border-t xl:border-gray-200 xl:px-3 xl:py-4"
                >
                  {row.startText}
                </td>
                <td
                  role="cell"
                  className="type-body-s text-gray-700 max-xl:hidden xl:border-t xl:border-gray-200 xl:px-3 xl:py-4"
                >
                  {row.endText}
                </td>
                <td role="cell" className={cn(cellClass, 'max-xl:basis-full xl:hidden')}>
                  <span className={labelClass}>{card.dates}</span>
                  <span className="text-gray-700">{row.datesText}</span>
                </td>
                <td
                  role="cell"
                  className={cn(cellClass, 'max-xl:basis-full xl:border-t xl:border-gray-200')}
                >
                  <span className={labelClass}>{card.duration}</span>
                  <span className="text-gray-700">{row.duration}</span>
                </td>
                <td role="cell" className="xl:border-t xl:border-gray-200 xl:px-3 xl:py-4">
                  <Link
                    href={routes.traffic.announcement(row.id)}
                    aria-label={copy.viewNotice(row.title)}
                    onClick={(event) => onViewNotice(event, row.id)}
                    className={cn(linkClass, 'inline-flex items-center')}
                  >
                    {copy.viewNoticeLabel}
                  </Link>
                </td>
                <td role="cell" className="xl:border-t xl:border-gray-200 xl:py-4 xl:pr-5 xl:pl-3">
                  <Link
                    href={routes.traffic.mapFocus(row.id)}
                    aria-label={copy.viewOnMap(row.title)}
                    className={cn(linkClass, 'inline-flex items-center')}
                  >
                    {copy.viewOnMapLabel}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
