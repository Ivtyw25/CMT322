import type { Station } from '@/data/models/station';
import { fold } from './faq-search';

/** "s20", "s 20", "20" or "a01": a station code with or without its letter. */
const CODE_QUERY = /^([sa])?\s*(\d+)$/;

/** True when the query reads as a station code, so the text is not highlighted word by word. */
export function isCodeQuery(query: string): boolean {
  return CODE_QUERY.test(fold(query.trim()));
}

/** "9" does not find S09, "09" does: the digits must start the code's digits. */
function codeMatches(code: string, letter: string | undefined, digits: string): boolean {
  const folded = fold(code);
  if (letter && folded.charAt(0) !== letter) return false;
  return folded.slice(1).startsWith(digits);
}

/** Stations whose code, name, subtitle or area contains the query. Accent and case blind. */
export function searchStations<T extends Pick<Station, 'code' | 'name' | 'subtitle' | 'area'>>(
  stations: readonly T[],
  query: string,
): T[] {
  const wanted = fold(query.trim());
  if (!wanted) return [...stations];
  const code = CODE_QUERY.exec(wanted);
  if (code) {
    const [, letter, digits = ''] = code;
    return stations.filter((station) => codeMatches(station.code, letter, digits));
  }
  return stations.filter((station) =>
    fold([station.code, station.name, station.subtitle ?? '', station.area].join(' ')).includes(
      wanted,
    ),
  );
}
