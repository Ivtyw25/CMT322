import { Calendar, Clock } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { Tag } from '@/components/ui/tag';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import type { WorksItem } from './works-items';

function MetaLine({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: string;
}) {
  return (
    <p className="flex items-center gap-1.5 type-body-s text-gray-700 md:whitespace-nowrap">
      {icon}
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </p>
  );
}

/** One road change: tag, title and summary, then dates, hours and the link to the map. */
export function WorksListItem({ item }: { item: WorksItem }) {
  const copy = homeCopy.works.item;
  return (
    <li className="flex flex-col gap-5 px-4 py-5 md:flex-row md:gap-5 md:px-6">
      <div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
        <Tag kind={item.tag} />
        <h3 className="type-body-m-semibold text-gray-900">{item.title}</h3>
        <p className="type-body-s text-gray-600">{item.summary}</p>
      </div>
      <div className="flex flex-col items-start gap-1.5 md:w-50 md:shrink-0">
        <MetaLine
          icon={<Calendar aria-hidden className="size-4 shrink-0 text-gray-500" />}
          label={copy.datesLabel}
        >
          {item.dates}
        </MetaLine>
        <MetaLine
          icon={<Clock aria-hidden className="size-4 shrink-0 text-gray-500" />}
          label={copy.hoursLabel}
        >
          {item.hours}
        </MetaLine>
        <ButtonLink variant="ghost" href={copy.viewOnMapHref(item.id)}>
          {uiCopy.actions.viewOnMap}
          <VisuallyHidden>{copy.viewOnMapLabel(item.title)}</VisuallyHidden>
        </ButtonLink>
      </div>
    </li>
  );
}
