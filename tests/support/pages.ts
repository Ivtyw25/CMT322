import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { routes } from '@/config/routes';
import { getStationCodes } from '@/data/api/stations';

/** Ticket shown in Figma; the mock data must contain it. */
export const SAMPLE_TICKET_ID = 'MLC-261028-0482';

export type PageStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked' | 'skipped';
export type ManifestPage = {
  id: string;
  route: string;
  title: string;
  group: string;
  status: PageStatus;
  visualTolerance: number;
  figma: {
    desktop: string | null;
    mobile: string | null;
    darkDesktop?: string;
    darkMobile?: string;
  };
  states?: { name: string; desktop: string; mobile: string; how: string }[];
};

type Manifest = { pages: ManifestPage[] };
const manifest = JSON.parse(readFileSync(join(process.cwd(), 'pages.json'), 'utf8')) as Manifest;

/** Pages that exist in code: anything started and not skipped. */
const ACTIVE: PageStatus[] = ['in-progress', 'review', 'done', 'blocked'];
export const activePages = manifest.pages.filter((page) => ACTIVE.includes(page.status));

/** Pages whose Figma design shows a signed-in user. Tests sign in before loading them. */
const SIGNED_IN_PAGES = new Set(['report', 'report-submitted', 'track', 'profile']);
export const needsSignIn = (pageId: string) => SIGNED_IN_PAGES.has(pageId);

const stationCodes = await getStationCodes();

/** Concrete URLs per page. The first URL is the one compared with Figma. */
const URLS: Record<string, string[]> = {
  home: [routes.home],
  'project-overview': [routes.project.overview],
  about: [routes.project.about],
  stations: [routes.project.stations],
  station: ['S20', ...stationCodes.filter((code) => code !== 'S20')].map(routes.project.station),
  construction: [routes.project.construction],
  faq: [routes.project.faq],
  'traffic-overview': [routes.traffic.overview],
  'traffic-map': [routes.traffic.map],
  'route-view': [routes.traffic.routeAt('S09'), routes.traffic.route],
  announcements: [routes.traffic.announcements],
  'report-track-overview': [routes.reportTrack.overview],
  report: [routes.reportTrack.report],
  'report-submitted': [routes.reportTrack.submitted(SAMPLE_TICKET_ID)],
  track: [routes.reportTrack.ticket(SAMPLE_TICKET_ID), routes.reportTrack.track],
  login: [routes.account.login],
  signup: [routes.account.signup],
  'forgot-password': [routes.account.forgotPassword],
  profile: [routes.account.profile],
  terms: [routes.legal.terms],
  privacy: [routes.legal.privacy],
  contact: [routes.help.contact],
  accessibility: [routes.help.accessibility],
  sitemap: [routes.help.sitemap],
  'not-found': ['/this-page-does-not-exist'],
};

export function urlsFor(pageId: string): string[] {
  const urls = URLS[pageId];
  if (!urls) throw new Error(`tests/support/pages.ts has no URLs for page "${pageId}".`);
  return urls;
}

export type PageVisit = { pageId: string; url: string; signedIn: boolean; expectStatus: number };

/** Every URL the responsive, links and a11y suites visit. */
export function visitsForActivePages(): PageVisit[] {
  const visits = activePages.flatMap((page) =>
    urlsFor(page.id).map((url) => ({
      pageId: page.id,
      url,
      signedIn: needsSignIn(page.id),
      expectStatus: page.id === 'not-found' ? 404 : 200,
    })),
  );
  // The components gallery exists only on the dev server.
  if (process.env.PW_SERVER !== 'build' && !process.env.BASE_URL && isGroupActive('foundations')) {
    visits.push({
      pageId: 'dev-components',
      url: routes.dev.components,
      signedIn: false,
      expectStatus: 200,
    });
  }
  return visits;
}

function isGroupActive(groupId: string): boolean {
  const raw = JSON.parse(readFileSync(join(process.cwd(), 'pages.json'), 'utf8')) as {
    groups: { id: string; status: string }[];
  };
  return raw.groups.some(
    (group) => group.id === groupId && group.status !== 'todo' && group.status !== 'skipped',
  );
}
