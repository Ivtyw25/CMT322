import { roadWorks } from '@/data/mock/road-works';
import type { AreaId } from '@/data/models/area';
import type { RoadWork, RoadWorkStatus } from '@/data/models/road-work';
import type { StationCode } from '@/data/models/station';

export type RoadWorkFilter = {
  status?: RoadWorkStatus;
  areaId?: AreaId;
  stationCode?: StationCode;
};

/** Active first (newest start first), then upcoming (soonest first). Filters combine. */
export async function getRoadWorks(filter: RoadWorkFilter = {}): Promise<RoadWork[]> {
  return roadWorks
    .filter((item) => !filter.status || item.status === filter.status)
    .filter((item) => !filter.areaId || item.areaIds.includes(filter.areaId))
    .filter((item) => !filter.stationCode || item.stationCodes.includes(filter.stationCode))
    .sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      if (a.status === 'upcoming') return a.startDate.localeCompare(b.startDate);
      return b.startDate.localeCompare(a.startDate);
    });
}
