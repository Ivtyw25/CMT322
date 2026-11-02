import type { SearchEntry, SearchEntryKind } from '@/data/models/search';
import { normalise, normaliseQuery } from '@/lib/search/normalise';

export const MIN_QUERY_LENGTH = 2;
const MAX_PER_GROUP = 4;
const GROUP_ORDER: readonly SearchEntryKind[] = ['station', 'road', 'area'];

export type SearchMatch = {
  entry: SearchEntry;
  /** Character range of the first match in the label, to show in bold. Null when only the detail matches. */
  highlight: { start: number; end: number } | null;
};

export type SearchGroup = { kind: SearchEntryKind; matches: SearchMatch[] };

/** Lower is better: label starts with the query, a label word does, the label contains it, only the detail does. */
function rank(label: string, detail: string, query: string): { score: number; at: number } | null {
  const at = label.indexOf(query);
  if (at === 0) return { score: 0, at };
  const wordStart = label.indexOf(` ${query}`);
  if (wordStart !== -1) return { score: 1, at: wordStart + 1 };
  if (at !== -1) return { score: 2, at };
  return detail.includes(query) ? { score: 3, at: -1 } : null;
}

/** Suggestions for a query: grouped Stations, Roads, Areas; at most four each; empty below two characters. */
export function matchEntries(entries: readonly SearchEntry[], rawQuery: string): SearchGroup[] {
  const query = normaliseQuery(rawQuery);
  if (query.length < MIN_QUERY_LENGTH) return [];

  const groups: SearchGroup[] = [];
  for (const kind of GROUP_ORDER) {
    const ranked: { match: SearchMatch; score: number }[] = [];
    for (const entry of entries) {
      if (entry.kind !== kind) continue;
      const label = normalise(entry.label);
      const found = rank(label.text, normalise(entry.detail).text, query);
      if (!found) continue;
      const first = label.origin[found.at];
      const last = label.origin[found.at + query.length - 1];
      const highlight =
        found.at === -1 || first === undefined || last === undefined
          ? null
          : { start: first, end: last + 1 };
      ranked.push({ match: { entry, highlight }, score: found.score });
    }
    const matches = ranked
      .toSorted((a, b) => a.score - b.score)
      .slice(0, MAX_PER_GROUP)
      .map((item) => item.match);
    if (matches.length > 0) groups.push({ kind, matches });
  }
  return groups;
}
