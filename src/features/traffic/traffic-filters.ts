import type { TrafficLayer } from '@/data/models/traffic-item';
import { normaliseQuery } from '@/lib/search/normalise';
import type { TrafficEntry } from './traffic-entry';

/** Time windows. No window (`null`) shows every road change that has not ended. */
export const timeWindows = ['now', 'week', 'upcoming'] as const;
export type TimeWindow = (typeof timeWindows)[number];

/** What a layer toggle can switch off: the three kinds of road change, and the line on the map. */
export const hideKeys = ['closure', 'construction', 'hazard', 'lrt'] as const;
export type HideKey = (typeof hideKeys)[number];

export const MAX_QUERY_LENGTH = 60;

export type TrafficFilters = {
  when: TimeWindow | null;
  hidden: readonly HideKey[];
  query: string;
};

export function parseWhen(raw: string | null): TimeWindow | null {
  return timeWindows.find((window) => window === raw) ?? null;
}

export function parseHidden(raw: string | null): HideKey[] {
  if (!raw) return [];
  return hideKeys.filter((key) => raw.split(',').includes(key));
}

export function serialiseHidden(hidden: readonly HideKey[]): string | null {
  return hidden.length === 0 ? null : hideKeys.filter((key) => hidden.includes(key)).join(',');
}

function inWindow(entry: TrafficEntry, when: TimeWindow | null): boolean {
  if (when === null) return true;
  if (when === 'now') return entry.status === 'active';
  if (when === 'upcoming') return entry.status === 'upcoming';
  return entry.inWeek;
}

/** Entries that pass the time window and the search, whatever layers are shown. */
export function filterByTimeAndText(
  entries: readonly TrafficEntry[],
  when: TimeWindow | null,
  query: string,
): TrafficEntry[] {
  const text = normaliseQuery(query);
  return entries.filter(
    (entry) => inWindow(entry, when) && (text === '' || entry.searchText.includes(text)),
  );
}

export function countByLayer(entries: readonly TrafficEntry[]): Record<TrafficLayer, number> {
  const counts: Record<TrafficLayer, number> = { closure: 0, construction: 0, hazard: 0 };
  for (const entry of entries) counts[entry.layer] += 1;
  return counts;
}

export function showLayer(entries: readonly TrafficEntry[], hidden: readonly HideKey[]) {
  return entries.filter((entry) => !hidden.includes(entry.layer));
}

export type EmptyCause = 'text' | 'range' | 'layers';

/** Why a list is empty, so the hint can say what to change. */
export function emptyCause(entries: readonly TrafficEntry[], filters: TrafficFilters): EmptyCause {
  const inRange = filterByTimeAndText(entries, filters.when, filters.query);
  if (inRange.length > 0) return 'layers';
  const text = filterByTimeAndText(entries, null, filters.query);
  if (filters.query.trim() !== '' && text.length === 0) return 'text';
  return 'range';
}
