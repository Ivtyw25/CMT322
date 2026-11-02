import type { Station } from '@/data/models/station';

/** The parts of a station the Route view needs; all 22 go to the browser, so keep it small. */
export type RouteStation = Pick<
  Station,
  'code' | 'name' | 'subtitle' | 'isProvisionalName' | 'serves'
>;

export function toRouteStation({
  code,
  name,
  subtitle,
  isProvisionalName,
  serves,
}: Station): RouteStation {
  return { code, name, subtitle, isProvisionalName, serves };
}
