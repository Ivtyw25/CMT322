import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { ButtonLink } from '@/components/ui/button-link';
import { LinkCard } from '@/components/ui/link-card';
import { homeCopy } from '@/content/home';
import { formatDate } from '@/lib/format/dates';
import { HomeSection, SectionHeader } from './section-frame';

const HEADING_ID = 'progress-heading';

export type ProgressItem = { id: string; date: string; title: string; summary: string };

type ProgressSectionProps = { updates: readonly ProgressItem[] };

/** "Latest construction progress" (Figma 37:1159, mobile 133:6789): the three newest updates. */
export function ProgressSection({ updates }: ProgressSectionProps) {
  const copy = homeCopy.progress;
  return (
    <HomeSection headingId={HEADING_ID}>
      <SectionHeader
        headingId={HEADING_ID}
        title={copy.title}
        lede={copy.lede}
        action={
          <ButtonLink variant="secondary" href={copy.seeAll.href}>
            {copy.seeAll.label}
          </ButtonLink>
        }
      />
      {updates.length > 0 ? (
        <ul className="grid items-start gap-6 md:grid-cols-3">
          {updates.map((update) => (
            <li key={update.id}>
              <LinkCard
                href={copy.cardHref(update.id)}
                title={update.title}
                media={
                  <div className="flex flex-col gap-3">
                    <ImagePlaceholder decorative className="h-50 w-full" />
                    <time dateTime={update.date} className="px-5 type-body-xs text-gray-500">
                      {formatDate(update.date)}
                    </time>
                  </div>
                }
                className="gap-2 overflow-hidden rounded-3xl p-0 [&_h3]:type-body-m-semibold [&_h3]:text-wrap group-hover:[&_h3]:text-primary-700 [&_h3_a]:flex [&>h3]:px-5"
              >
                <p className="px-5 pb-5 type-body-s text-gray-600">{update.summary}</p>
              </LinkCard>
            </li>
          ))}
        </ul>
      ) : (
        <p className="type-body-m text-gray-600">{copy.empty}</p>
      )}
    </HomeSection>
  );
}
