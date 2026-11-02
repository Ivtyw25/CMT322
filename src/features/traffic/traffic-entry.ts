import { trafficCopy } from '@/content/traffic';
import type { Area } from '@/data/models/area';
import type { StationCode } from '@/data/models/station';
import type { TrafficItem, TrafficLayer } from '@/data/models/traffic-item';
import { formatDate, formatDateRange } from '@/lib/format/dates';
import { formatHourRange } from '@/lib/format/times';
import { normaliseQuery } from '@/lib/search/normalise';

/** A road change as the traffic panel, map and diagram use it: the record plus its display text. */
export type TrafficEntry = {
  id: string;
  layer: TrafficLayer;
  status: TrafficItem['status'];
  title: string;
  brief: string;
  summary: string;
  lat: number;
  lng: number;
  stationCodes: StationCode[];
  announcementId?: string;
  /** "12 Oct 2026 to Jul 2027", or "Reported 27 Oct 2026" for a hazard. */
  dateText: string;
  /** "10 pm to 6 am" or "All day". Null for a hazard, which has no working hours. */
  hoursText: string | null;
  /** Starts within the next seven days, or is already under way. */
  inWeek: boolean;
  /** Title, road, place and area names, normalised, for the search. */
  searchText: string;
};

const copy = trafficCopy.map;

function dateTextOf(item: TrafficItem): string {
  if (item.source === 'hazard' || item.endDate === null) {
    return copy.results.reported(formatDate(item.startDate));
  }
  const [from, to] = formatDateRange(item.startDate, item.endDate);
  return copy.filters.dateRange(from, to);
}

function hoursTextOf(item: TrafficItem): string | null {
  if (item.source === 'hazard') return null;
  if (!item.dailyHours) return copy.popup.allDay;
  const [from, to] = formatHourRange(item.dailyHours.from, item.dailyHours.to);
  return copy.popup.hours(from, to);
}

/** Builds the entries once, on the server. `weekEnd` is the last day of "Next 7 days". */
export function toTrafficEntries(
  items: readonly TrafficItem[],
  areas: readonly Area[],
  weekEnd: string,
): TrafficEntry[] {
  return items.map((item) => {
    const areaNames = areas
      .filter((area) => item.areaIds.includes(area.id))
      .map((area) => area.label);
    return {
      id: item.id,
      layer: item.layer,
      status: item.status,
      title: item.title,
      brief: item.brief,
      summary: item.summary,
      lat: item.lat,
      lng: item.lng,
      stationCodes: item.stationCodes,
      announcementId: item.announcementId,
      dateText: dateTextOf(item),
      hoursText: hoursTextOf(item),
      inWeek: item.status === 'active' || item.startDate <= weekEnd,
      searchText: normaliseQuery([item.title, item.road, item.location, ...areaNames].join(' ')),
    };
  });
}
