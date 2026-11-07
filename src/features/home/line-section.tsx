import { homeCopy } from '@/content/home';
import type { Station } from '@/data/models/station';
import { LineDiagram } from '@/components/patterns/line-diagram/line-diagram';
import { LineFlow } from '@/components/patterns/line-diagram/line-flow';
import { toMapStations } from './line-map-data';
import { LinePreview } from './line-preview';
import { LineZigzag } from '@/components/patterns/line-diagram/line-zigzag';
import { HomeSection } from './section-frame';

const HEADING_ID = 'line-heading';

/** "The Mutiara Line in 2031" (Figma 37:1043, mobile 133:6665): zigzag, diagram and map. */
export function LineSection({ stations }: { stations: readonly Station[] }) {
  const copy = homeCopy.line;
  return (
    <HomeSection headingId={HEADING_ID} tone="band">
      <LinePreview
        headingId={HEADING_ID}
        title={copy.title}
        lede={copy.lede}
        zigzag={
          <LineFlow>
            <LineZigzag stations={stations} />
          </LineFlow>
        }
        diagram={
          <LineFlow>
            <LineDiagram stations={stations} />
          </LineFlow>
        }
        mapStations={toMapStations(stations)}
      />
    </HomeSection>
  );
}
