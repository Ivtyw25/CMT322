import type { Metadata } from 'next';
import { commonCopy } from '@/content/common';
import { homeCopy } from '@/content/home';
import { getAnnouncements } from '@/data/api/announcements';
import { getAreas } from '@/data/api/areas';
import { getSearchIndex } from '@/data/api/search';
import type { AreaId } from '@/data/models/area';
import { Hero } from '@/features/home/hero';
import { toWorksItems } from '@/features/home/works-items';
import { WorksSection } from '@/features/home/works-section';

export const metadata: Metadata = {
  title: { absolute: commonCopy.metadata.defaultTitle },
  description: homeCopy.meta.description,
};

/** `?area=` as an area id, or null for all areas (also for a value that is not an area). */
function chosenArea(value: string | string[] | undefined, ids: readonly AreaId[]): AreaId | null {
  const first = Array.isArray(value) ? value[0] : value;
  return ids.find((id) => id === first) ?? null;
}

export default async function HomePage({ searchParams }: PageProps<'/'>) {
  const [params, searchIndex, areas, announcements] = await Promise.all([
    searchParams,
    getSearchIndex(),
    getAreas(),
    getAnnouncements(),
  ]);
  const areaOptions = areas.map(({ id, label }) => ({ id, label }));

  return (
    <>
      <Hero searchIndex={searchIndex} />
      <WorksSection
        areas={areaOptions}
        items={toWorksItems(announcements)}
        area={chosenArea(
          params.area,
          areas.map((area) => area.id),
        )}
      />
    </>
  );
}
