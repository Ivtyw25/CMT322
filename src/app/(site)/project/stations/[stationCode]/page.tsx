import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { getAnnouncements } from '@/data/api/announcements';
import { getRoadWorks } from '@/data/api/road-works';
import { getSiteInfo } from '@/data/api/site-info';
import { getStation, getStationCodes, getStations } from '@/data/api/stations';
import { getTicketsNearStation } from '@/data/api/tickets';
import { StationAlertsCard } from '@/features/project/station-alerts-card';
import { StationHeader, type StationStat } from '@/features/project/station-header';
import { StationProgress } from '@/features/project/station-progress';
import { StationGlance, StationUrgentHelp } from '@/features/project/station-rail-cards';
import { StationReports } from '@/features/project/station-reports';
import { StationTraffic } from '@/features/project/station-traffic';
import { StationWorksites } from '@/features/project/station-worksites';
import { uiCopy } from '@/content/ui';

const { station: copy } = projectCopy;
const MAX_NOTICES = 5;
const MAX_REPORTS = 5;

type StationPageProps = { params: Promise<{ stationCode: string }> };

export async function generateStaticParams() {
  const codes = await getStationCodes();
  return codes.map((code) => ({ stationCode: code.toLowerCase() }));
}

export async function generateMetadata({ params }: StationPageProps): Promise<Metadata> {
  const station = await getStation((await params).stationCode);
  if (!station) return {};
  return {
    title: copy.meta.title(station.name, station.code),
    description: copy.meta.description(station.name, station.code),
    // A request in upper case ("S20") shows the same page; search engines get the one address.
    alternates: { canonical: routes.project.station(station.code) },
  };
}

export default async function StationPage({ params }: StationPageProps) {
  const { stationCode } = await params;
  const station = await getStation(stationCode);
  if (!station) notFound();

  const [stations, announcements, roadWorks, tickets, siteInfo] = await Promise.all([
    getStations(),
    getAnnouncements({ stationCode: station.code }),
    getRoadWorks({ stationCode: station.code }),
    getTicketsNearStation(station.code),
    getSiteInfo(),
  ]);

  const notices = announcements.filter((item) => item.status !== 'ended').slice(0, MAX_NOTICES);
  const activeCount = announcements.filter((item) => item.status === 'active').length;
  const nameOf = new Map(stations.map((item) => [item.code, item.name]));
  const neighbours = station.connectsTo.map((link) => ({
    code: link.code,
    name: nameOf.get(link.code) ?? link.code,
    distanceKm: link.distanceKm,
  }));
  const measured = neighbours.find((neighbour) => neighbour.distanceKm !== null);
  const first = neighbours[0];

  const stats: StationStat[] = [
    {
      id: 'progress',
      label: copy.stats.progress,
      value: station.progress
        ? copy.stats.progressValue(station.progress.percent)
        : copy.stats.progressNotStarted,
    },
    { id: 'traffic', label: copy.stats.traffic, value: String(activeCount) },
    { id: 'reports', label: copy.stats.reports, value: String(tickets.length) },
    measured
      ? {
          id: 'distance',
          label: copy.stats.nextStation(measured.code, measured.name),
          value: uiCopy.station.distance(measured.distanceKm ?? 0),
        }
      : {
          id: 'distance',
          label: copy.stats.nextStation(first?.code ?? '', first?.name ?? ''),
          value: copy.stats.distanceUnknown,
        },
  ];

  const works = [...announcements.filter((item) => item.status !== 'ended'), ...roadWorks].map(
    ({ id, title, lat, lng }) => ({ id, title, lat, lng }),
  );

  return (
    <>
      <StationHeader station={station} stats={stats} />
      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_clamp(18.75rem,33%,24.5rem)] lg:gap-12 lg:py-12">
        <div className="flex max-w-190 flex-col gap-12 lg:max-w-none lg:gap-14">
          <StationTraffic id="traffic" name={station.name} notices={notices} />
          <StationProgress id="progress" station={station} />
          <StationWorksites id="worksites" station={station} works={works} />
          <StationReports id="reports" station={station} tickets={tickets.slice(0, MAX_REPORTS)} />
        </div>
        <aside
          aria-label={copy.railLabel}
          className="flex max-w-190 flex-col gap-4 self-start lg:max-w-none"
        >
          <StationGlance station={station} neighbours={neighbours} />
          <StationAlertsCard code={station.code} name={station.name} />
          <StationUrgentHelp careline={siteInfo.careline} />
        </aside>
      </Container>
    </>
  );
}
