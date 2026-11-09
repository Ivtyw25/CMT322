import type { GeoPoint } from './reverse-geocode';

/** The station closest to a point (straight-line, good enough at city scale). */
export function nearestStation<T extends GeoPoint>(
  stations: readonly T[],
  point: GeoPoint,
): T | null {
  const cosine = Math.cos((point.lat * Math.PI) / 180);
  let best: T | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const station of stations) {
    const distance = (station.lat - point.lat) ** 2 + ((station.lng - point.lng) * cosine) ** 2;
    if (distance < bestDistance) {
      best = station;
      bestDistance = distance;
    }
  }
  return best;
}
