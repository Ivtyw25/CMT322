import { homeCopy } from '@/content/home';
import type { Station } from '@/data/models/station';
import { LineDiagram } from './line-diagram';
import { toMapStations } from './line-map-data';
import { LinePreview } from './line-preview';
import { LineRailView } from './line-rail-view';
import { HomeSection, SectionHeader } from './section-frame';

const HEADING_ID = 'line-heading';

/** "The Mutiara Line in 2031" (Figma 37:1043, mobile 133:6665): rail, diagram and map. */
export function LineSection({ stations }: { stations: readonly Station[] }) {
  const copy = homeCopy.line;
  return (
    <HomeSection headingId={HEADING_ID} tone="band">
      <SectionHeader headingId={HEADING_ID} title={copy.title} lede={copy.lede} />
      <LinePreview
        rail={<LineRailView stations={stations} />}
        diagram={<LineDiagram stations={stations} />}
        mapStations={toMapStations(stations)}
      />
    </HomeSection>
  );
}
