/** Station code of the place where the two routes meet. */
export const JUNCTION_CODE = 'S19';

/** The branch to KOMTAR leaves the main line at Macallum. */
const BRANCH_CODE = 'S20';

type Point = { code: string; lat: number; lng: number };

/** The line drawn on a map: the main line, and the short branch from the junction to KOMTAR. */
export type LineAlignment<Station extends Point = Point> = {
  /** Penang Sentral to PSR-A in line order, KOMTAR left out. */
  main: Station[];
  /** Junction then KOMTAR. Empty when either station is missing. */
  branch: Station[];
};

/** Splits stations (already in line order) into the paths of the line. */
export function buildLineAlignment<Station extends Point>(
  stations: readonly Station[],
): LineAlignment<Station> {
  const junction = stations.find((station) => station.code === JUNCTION_CODE);
  const branch = stations.find((station) => station.code === BRANCH_CODE);
  return {
    main: stations.filter((station) => station.code !== BRANCH_CODE),
    branch: junction && branch ? [junction, branch] : [],
  };
}
