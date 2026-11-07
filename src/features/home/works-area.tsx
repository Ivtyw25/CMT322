'use client';

import { CalendarCheck } from 'lucide-react';
import { useState, useSyncExternalStore } from 'react';
import { FilterChips } from '@/components/ui/filter-chips';
import { useQueryParams } from '@/lib/url/use-query-params';
import { homeCopy } from '@/content/home';
import { uiCopy } from '@/content/ui';
import type { AreaId } from '@/data/models/area';
import { WorksListItem } from './works-list-item';
import type { WorksItem } from './works-items';
import { WorksSubscribe } from './works-subscribe';

const MAX_ITEMS = 3;
const MAX_ALL_ITEMS = 10;
const ALL = 'all';
type AreaChoice = AreaId | typeof ALL;
const subscribeHydration = () => () => {};
const browserReady = () => true;
const serverReady = () => false;

export type WorksAreaOption = { id: AreaId; label: string };

/** The rows one area chip shows: its earliest works, at most three. */
const itemsFor = (items: readonly WorksItem[], areaId: AreaId) =>
  items.filter((item) => item.areaIds.includes(areaId)).slice(0, MAX_ITEMS);

/**
 * All areas: every row any area chip shows, once each, earliest first, at most ten; the list
 * scrolls inside the card (owner decision 2026-11-07).
 */
function allAreaItems(items: readonly WorksItem[], areas: readonly WorksAreaOption[]) {
  const shown = new Set(
    areas.flatMap((option) => itemsFor(items, option.id).map((item) => item.id)),
  );
  return items.filter((item) => shown.has(item.id)).slice(0, MAX_ALL_ITEMS);
}

type WorksAreaProps = {
  areas: readonly WorksAreaOption[];
  items: readonly WorksItem[];
  /** The area in the URL (`?area=`), already checked on the server; null means all areas. */
  initialArea: AreaId | null;
};

/**
 * Area chips, the list of works and the sign-up card. The list is filtered in the browser; the
 * choice is kept in the URL (`?area=`) so a reload or a shared link shows the same list.
 */
export function WorksArea({ areas, items, initialArea }: WorksAreaProps) {
  const copy = homeCopy.works;
  const query = useQueryParams();
  const hydrated = useSyncExternalStore(subscribeHydration, browserReady, serverReady);
  // Keep the server-rendered list tied to the validated request prop, including with
  // JavaScript disabled. After hydration, native history and Back drive the same list.
  const selected: AreaChoice = hydrated
    ? (areas.find((option) => option.id === query.get('area'))?.id ?? ALL)
    : (initialArea ?? ALL);
  const [announcedChoice, setAnnouncedChoice] = useState<AreaChoice>(initialArea ?? ALL);
  const [announcement, setAnnouncement] = useState('');

  const area = areas.find((option) => option.id === selected) ?? null;
  const areaLabel = area?.label ?? copy.allAreasInSentence;
  const visible = area ? itemsFor(items, area.id) : allAreaItems(items, areas);

  // Say the new count once whenever the choice changes, however it changed.
  if (announcedChoice !== selected) {
    setAnnouncedChoice(selected);
    setAnnouncement(copy.resultCount(visible.length, areaLabel));
  }

  function choose(next: AreaChoice) {
    query.set({ area: next === ALL ? null : next });
  }

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <FilterChips<AreaChoice>
        label={copy.chipsLabel}
        layout="scroll"
        options={[
          { value: ALL, label: uiCopy.filters.allAreas },
          ...areas.map((option) => ({ value: option.id, label: option.label })),
        ]}
        value={selected}
        onValueChange={choose}
      />
      <div className="grid items-start gap-6 md:gap-8 lg:grid-cols-[1fr_20rem] xl:grid-cols-[1fr_22.5rem]">
        <div
          key={selected}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-surface transition-opacity duration-(--duration-fast) ease-(--ease-enter) motion-reduce:transition-none starting:opacity-0"
        >
          {visible.length > 0 ? (
            <ul className="scrollbar-none max-h-150 divide-y divide-gray-200 overflow-y-auto overscroll-contain">
              {visible.map((item) => (
                <WorksListItem key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-start gap-2 px-4 py-8 md:items-center md:px-6 md:text-center">
              <CalendarCheck aria-hidden className="size-6 text-gray-400" />
              <p className="type-body-m-semibold text-gray-900">
                {area ? copy.empty.title(area.label) : copy.empty.titleAllAreas}
              </p>
              <p className="type-body-s text-gray-600 lg:hidden">{copy.empty.textBelow}</p>
              <p className="hidden type-body-s text-gray-600 lg:block">{copy.empty.textRight}</p>
            </div>
          )}
        </div>
        <WorksSubscribe area={area} />
      </div>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
