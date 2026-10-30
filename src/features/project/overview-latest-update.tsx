import Link from 'next/link';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { ConstructionUpdate } from '@/data/models/construction-update';
import { formatDate } from '@/lib/format/dates';

const { latest } = projectCopy.overview;

const seeAllClass =
  'inline-flex min-h-11 items-center type-body-s-semibold text-primary-700 hover:underline md:min-h-0';

/** The newest site update: photo, date and place, title, summary and the link to all updates. */
export function OverviewLatestUpdate({ update }: { update: ConstructionUpdate | null }) {
  const seeAll = (
    <Link href={routes.project.construction} className={seeAllClass}>
      {latest.link}
    </Link>
  );

  if (!update) {
    return (
      <div className="flex flex-col gap-2">
        <p className="type-body-s text-gray-600">{latest.empty}</p>
        {seeAll}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 md:flex-row">
      <ImagePlaceholder
        decorative
        className="aspect-350/132 w-full shrink-0 rounded-xl md:aspect-auto md:h-33 md:w-50"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <p className="type-body-xs text-gray-600">
          <time dateTime={update.date}>
            {latest.meta(formatDate(update.date), update.location)}
          </time>
        </p>
        <h3 className="type-heading-3xs text-gray-900">{update.title}</h3>
        <p className="type-body-s text-gray-700">{update.summary}</p>
        {seeAll}
      </div>
    </div>
  );
}
