import Link from 'next/link';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import type { ProgressUpdate } from '@/data/models/progress-update';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';

type ProgressEntryProps = {
  update: ProgressUpdate;
  /** The newest entry: a filled dot. */
  first: boolean;
  /** The date line. Default: the publish date. */
  dateText?: string;
  /** Opens the update, e.g. in the staff editor: the title becomes a link. */
  href?: string;
  /** Beside the date, e.g. the update's status. */
  badge?: React.ReactNode;
  /** At the end of the heading row, e.g. Edit and Delete. */
  action?: React.ReactNode;
};

/**
 * One progress update on a station timeline (dot + line): date, title, what happened and the
 * photos with their descriptions. The station page and the staff Progress page both use it.
 */
export function ProgressEntry({
  update,
  first,
  dateText,
  href,
  badge,
  action,
}: ProgressEntryProps) {
  const titleId = `update-${update.id}-title`;
  return (
    <li className="group">
      <article
        aria-labelledby={titleId}
        className="relative grid grid-cols-[0.75rem_1fr] gap-x-4 pb-8 group-last:pb-0"
      >
        <div aria-hidden className="relative">
          <span
            className={cn(
              'absolute top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-primary-600',
              first ? 'bg-primary-600' : 'bg-surface',
            )}
          />
          <span className="absolute top-4.5 -bottom-8 left-1/2 w-0.5 -translate-x-1/2 bg-primary-200 group-last:hidden" />
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-start gap-3">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
              {dateText === undefined ? (
                <time dateTime={update.date} className="type-body-s-semibold text-gray-900">
                  {formatDate(update.date)}
                </time>
              ) : (
                <p className="type-body-s-semibold text-gray-900">{dateText}</p>
              )}
              {badge}
            </div>
            {action}
          </div>
          <h4 id={titleId} className="type-body-m-semibold text-gray-900">
            {href ? (
              <Link
                href={href}
                className="hit-area transition-colors duration-(--duration-fast) hover:text-primary-700"
              >
                {update.title}
              </Link>
            ) : (
              update.title
            )}
          </h4>
          {update.body ? (
            <p className="type-body-s whitespace-pre-line text-gray-700">{update.body}</p>
          ) : null}
          {update.photos.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {update.photos.map((photo) => (
                <li key={photo.id}>
                  <figure className="flex flex-col gap-1.5">
                    <ImagePlaceholder decorative className="aspect-3/2 rounded-lg" />
                    <figcaption className="type-body-xs text-gray-600">{photo.alt}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </article>
    </li>
  );
}
