import { stations } from '@/data/mock/stations';
import type { Station, StationCode } from '@/data/models/station';

/** All 22 stations in line order, Penang Sentral first. */
export async function getStations(): Promise<Station[]> {
  return [...stations].sort((a, b) => a.order - b.order);
}

/** Looks a station up by code, case-insensitive ("s20" or "S20"). */
export async function getStation(code: string): Promise<Station | null> {
  const wanted = code.toUpperCase();
  return stations.find((station) => station.code === wanted) ?? null;
}

export async function getStationCodes(): Promise<StationCode[]> {
  return (await getStations()).map((station) => station.code);
}
