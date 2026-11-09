import type { Announcement } from '@/data/models/announcement';
import type { ProgressUpdate, StageBase } from '@/data/models/progress-update';
import type { Station, StationCode, StationStage } from '@/data/models/station';

/** A traffic notice as the "Your stations" section lists it. */
export type FollowedNotice = Pick<
  Announcement,
  'id' | 'title' | 'type' | 'status' | 'road' | 'startDate' | 'endDate'
>;

/** Everything "Your stations" shows for one station, before this browser's changes. */
export type FollowedStationData = {
  code: StationCode;
  name: string;
  area: string;
  /** Active and upcoming notices near the station, active first. */
  notices: readonly FollowedNotice[];
  /** The station's stages before any progress update. */
  base: readonly StationStage[];
  /** The station's progress updates from the data layer. */
  updates: readonly ProgressUpdate[];
};

const MAX_NOTICES = 3;

/** Builds the section's data for every station, on the server; the visitor's follows pick from it. */
export function toFollowedStations(
  stations: readonly Station[],
  announcements: readonly Announcement[],
  updates: readonly ProgressUpdate[],
  bases: readonly StageBase[],
): FollowedStationData[] {
  return stations.map((station) => ({
    code: station.code,
    name: station.name,
    area: station.area,
    notices: announcements
      .filter((item) => item.status !== 'ended' && item.stationCodes.includes(station.code))
      .sort((a, b) => Number(b.status === 'active') - Number(a.status === 'active'))
      .slice(0, MAX_NOTICES)
      .map(({ id, title, type, status, road, startDate, endDate }) => ({
        id,
        title,
        type,
        status,
        road,
        startDate,
        endDate,
      })),
    base: bases.find((entry) => entry.code === station.code)?.stages ?? station.stages,
    updates: updates.filter((update) => update.stationCode === station.code),
  }));
}
