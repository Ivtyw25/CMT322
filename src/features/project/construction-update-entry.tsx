import { User } from 'lucide-react';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { ConstructionUpdate } from '@/data/models/construction-update';
import { cn } from '@/lib/cn';
import { formatDate } from '@/lib/format/dates';

const { updates: copy } = projectCopy.construction;
const MAX_PHOTOS = 3;

/** One site update on the rail: date and place, phase label, title, text, photos, byline. */
export function ConstructionUpdateEntry({
  update,
  first,
}: {
  update: ConstructionUpdate;
  first: boolean;
}) {
  const photos = Math.min(update.photoCount, MAX_PHOTOS);
  const titleId = `${update.id}-title`;
  return (
    <li className="group">
      <article
        id={update.id}
        aria-labelledby={titleId}
        className="relative grid scroll-mt-32 grid-cols-[0.75rem_1fr] gap-x-4 gap-y-2 pb-10 group-last:pb-0 md:grid-cols-[7rem_0.75rem_1fr] md:gap-x-5 md:pr-4"
      >
        <div className="relative col-start-1 row-span-2 row-start-1 md:col-start-2">
          <span
            aria-hidden
            className={cn(
              'absolute top-1.5 left-1/2 size-3 -translate-x-1/2 rounded-full border-2 border-primary-600',
              first ? 'bg-primary-600' : 'bg-surface',
            )}
          />
          <span
            aria-hidden
            className="absolute top-4.5 -bottom-10 left-1/2 w-0.5 -translate-x-1/2 bg-primary-200 group-last:hidden"
          />
        </div>
        <div className="col-start-2 row-start-1 flex flex-col md:col-start-1 md:row-start-1">
          <time dateTime={update.date} className="type-body-s-semibold text-gray-900">
            {formatDate(update.date)}
          </time>
          <p className="type-body-xs text-gray-500">{update.location}</p>
        </div>
        <div className="col-start-2 row-start-2 flex min-w-0 flex-col gap-2 md:col-start-3 md:row-span-2 md:row-start-1">
          <span className="inline-flex w-fit rounded-full bg-gray-100 px-2.5 py-0.5 type-body-xs-medium text-gray-700">
            {uiCopy.constructionPhases[update.phase]}
          </span>
          <h3 id={titleId} tabIndex={-1} className="type-heading-3xs outline-none">
            {update.timelineTitle ?? update.title}
          </h3>
          <p className="type-body-s text-gray-700">{update.body}</p>
          {photos > 0 ? (
            <>
              <div aria-hidden className="grid grid-cols-3 gap-2.5">
                {Array.from({ length: photos }, (_, index) => (
                  <ImagePlaceholder
                    key={index}
                    decorative
                    className={cn(
                      'aspect-3/2 rounded-lg',
                      photos === 1 && 'col-span-3 md:col-span-1',
                    )}
                  />
                ))}
              </div>
              <p className="sr-only">{copy.photosNote(photos)}</p>
            </>
          ) : null}
          <p className="flex items-center gap-1.5 type-body-xs text-gray-500">
            <User aria-hidden className="size-3.5" />
            {copy.postedBy}
          </p>
        </div>
      </article>
    </li>
  );
}
