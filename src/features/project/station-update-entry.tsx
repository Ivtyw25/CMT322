import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import type { ProgressUpdate } from '@/data/models/progress-update';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';

/** One progress update on the station timeline: date, title, what happened and the photos. */
export function StationUpdateEntry({ update, first }: { update: ProgressUpdate; first: boolean }) {
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
          <time dateTime={update.date} className="type-body-s-semibold text-gray-900">
            {formatDate(update.date)}
          </time>
          <h4 id={titleId} className="type-body-m-semibold text-gray-900">
            {update.title}
          </h4>
          <p className="type-body-s whitespace-pre-line text-gray-700">{update.body}</p>
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
