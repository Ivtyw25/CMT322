import { areas } from '@/data/mock/areas';
import type { Area } from '@/data/models/area';

/** Area groups in line order, Bayan Lepas first. "All areas" is not a record: it is copy. */
export async function getAreas(): Promise<Area[]> {
  return areas;
}
