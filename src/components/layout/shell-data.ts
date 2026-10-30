import { navCopy } from '@/content/nav';
import { getAnnouncements } from '@/data/api/announcements';
import { getSiteInfo } from '@/data/api/site-info';
import { getStations } from '@/data/api/stations';
import { getCurrentUser } from '@/data/api/user';
import { formatDate } from '@/lib/format/dates';
import { givenName, initialsOf } from '@/lib/format/person';

export type ShellUser = {
  id: string;
  fullName: string;
  givenName: string;
  initials: string;
  email: string;
};

export type PanelStation = { code: string; name: string; area: string };
export type PanelClosure = { id: string; title: string; summary: string };

/** Everything the header, nav panels and drawer need from the records, as plain values. */
export type ShellData = {
  user: ShellUser;
  featuredStations: PanelStation[];
  stationCount: number;
  closures: PanelClosure[];
  careline: string;
};

const CLOSURES_SHOWN = 3;

export async function loadShellData(): Promise<ShellData> {
  const [user, stations, active, siteInfo] = await Promise.all([
    getCurrentUser(),
    getStations(),
    getAnnouncements({ status: 'active' }),
    getSiteInfo(),
  ]);
  const featured = navCopy.projectPanel.featuredStationCodes.flatMap((code) => {
    const station = stations.find((candidate) => candidate.code === code);
    return station ? [{ code: station.code, name: station.name, area: station.area }] : [];
  });
  return {
    user: {
      id: user.id,
      fullName: user.name,
      givenName: givenName(user.name),
      initials: initialsOf(user.name),
      email: user.email,
    },
    featuredStations: featured,
    stationCount: stations.length,
    closures: [...active]
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .slice(0, CLOSURES_SHOWN)
      .map((item) => ({
        id: item.id,
        title: item.title,
        summary: navCopy.trafficPanel.cardSummary(item.brief, formatDate(item.endDate)),
      })),
    careline: siteInfo.careline.number,
  };
}
