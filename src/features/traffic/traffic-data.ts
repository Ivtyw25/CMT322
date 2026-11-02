import { getAreas } from '@/data/api/areas';
import { getLineAlignment, getStations } from '@/data/api/stations';
import { getTrafficItems, getTrafficUpdatedAt, getTrafficWeekEnd } from '@/data/api/traffic';
import { toTrafficEntries } from './traffic-entry';

/** Everything the Map view and the Route view need, fetched together on the server. */
export async function loadTrafficData() {
  const [items, areas, weekEnd, stations, alignment, updatedAt] = await Promise.all([
    getTrafficItems(),
    getAreas(),
    getTrafficWeekEnd(),
    getStations(),
    getLineAlignment(),
    getTrafficUpdatedAt(),
  ]);
  return { entries: toTrafficEntries(items, areas, weekEnd), stations, alignment, updatedAt };
}
