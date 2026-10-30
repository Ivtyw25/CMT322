import type { Metadata } from 'next';
import { commonCopy } from '@/content/common';
import { homeCopy } from '@/content/home';
import { getAnnouncements } from '@/data/api/announcements';
import { getAreas } from '@/data/api/areas';
import { getConstructionUpdates } from '@/data/api/construction';
import { getMostAskedFaq } from '@/data/api/faq';
import { getRoadWorks } from '@/data/api/road-works';
import { getSearchIndex } from '@/data/api/search';
import { getSiteInfo } from '@/data/api/site-info';
import { getStations } from '@/data/api/stations';
import type { AreaId } from '@/data/models/area';
import { AboutSection } from '@/features/home/about-section';
import { FaqSection } from '@/features/home/faq-section';
import { GuideSection } from '@/features/home/guide-section';
import { HelpSection } from '@/features/home/help-section';
import { Hero } from '@/features/home/hero';
import { LineSection } from '@/features/home/line-section';
import { ProgressSection } from '@/features/home/progress-section';
import { SafetySection } from '@/features/home/safety-section';
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
  const [
    params,
    searchIndex,
    areas,
    announcements,
    roadWorks,
    stations,
    constructionUpdates,
    siteInfo,
    faqItems,
  ] = await Promise.all([
    searchParams,
    getSearchIndex(),
    getAreas(),
    getAnnouncements(),
    getRoadWorks(),
    getStations(),
    getConstructionUpdates(),
    getSiteInfo(),
    getMostAskedFaq(),
  ]);
  const areaOptions = areas.map(({ id, label }) => ({ id, label }));

  return (
    <>
      <Hero searchIndex={searchIndex} />
      <WorksSection
        areas={areaOptions}
        items={toWorksItems(announcements, roadWorks)}
        area={chosenArea(
          params.area,
          areas.map((area) => area.id),
        )}
      />
      <LineSection stations={stations} />
      <AboutSection />
      <GuideSection />
      <SafetySection />
      <ProgressSection updates={constructionUpdates.slice(0, 3)} />
      <HelpSection careline={siteInfo.careline} />
      <FaqSection items={faqItems.slice(0, 5)} />
    </>
  );
}
