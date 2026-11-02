import Link from 'next/link';
import { LocationMap, type MapMarker } from '@/components/patterns/map/location-map';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Station } from '@/data/models/station';
import { DocsSection } from './docs-section';

const { worksites: copy } = projectCopy.station;
const MAP_ZOOM = 16;

/** "Worksites and detours": the shared OSM map centred on the station, then a link to the full map. */
export function StationWorksites({
  id,
  station,
  works,
}: {
  id: string;
  station: Station;
  /** Active and upcoming notices and road works near the station, with their positions. */
  works: readonly { id: string; title: string; lat: number; lng: number }[];
}) {
  const markers: MapMarker[] = [
    {
      id: station.code,
      label: station.name,
      code: station.code,
      lat: station.lat,
      lng: station.lng,
    },
    ...works.map((work) => ({ id: work.id, label: work.title, lat: work.lat, lng: work.lng })),
  ];
  return (
    <DocsSection id={id} title={copy.title}>
      <p className="-mt-2 type-body-m text-gray-600">
        {station.progress ? copy.lede : copy.ledeNotStarted}
      </p>
      <LocationMap
        center={{ lat: station.lat, lng: station.lng }}
        zoom={MAP_ZOOM}
        markers={markers}
        label={copy.mapLabel(station.name)}
        centreLabel={copy.centreLabel(station.name)}
        unavailableText={uiCopy.map.unavailable}
        interaction="snippet"
        className="h-95 rounded-2xl"
      />
      <Link
        href={routes.traffic.map}
        className="hit-area w-fit type-body-s-medium text-primary-700 hover:underline"
      >
        {copy.link}
      </Link>
    </DocsSection>
  );
}
