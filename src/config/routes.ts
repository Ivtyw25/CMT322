/**
 * The only place route paths are written. Every link uses these helpers.
 * Never type a path string anywhere else.
 */
export const routes = {
  home: '/',
  project: {
    overview: '/project',
    about: '/project/about',
    stations: '/project/stations',
    station: (stationCode: string) => `/project/stations/${stationCode.toLowerCase()}`,
    construction: '/project/construction',
    faq: '/project/faq',
  },
  traffic: {
    overview: '/traffic',
    map: '/traffic/map',
    route: '/traffic/route',
    routeAt: (stationCode: string) => `/traffic/route?station=${stationCode.toLowerCase()}`,
    announcements: '/traffic/announcements',
  },
  reportTrack: {
    overview: '/report-track',
    report: '/report',
    submitted: (ticketId: string) => `/report/submitted/${ticketId}`,
    track: '/track',
    ticket: (ticketId: string) => `/track/${ticketId}`,
  },
  account: {
    login: '/login',
    loginReturningTo: (path: string) => `/login?next=${encodeURIComponent(path)}`,
    signup: '/signup',
    forgotPassword: '/forgot-password',
    profile: '/account',
    profileSection: (section: ProfileSection) => `/account#${section}`,
  },
  legal: {
    terms: '/terms',
    privacy: '/privacy',
  },
  help: {
    contact: '/contact',
    accessibility: '/accessibility',
    sitemap: '/sitemap',
  },
  dev: {
    components: '/dev/components',
  },
} as const;

export const profileSections = [
  'profile',
  'reports',
  'stations',
  'notifications',
  'security',
  'privacy',
] as const;
export type ProfileSection = (typeof profileSections)[number];

/** Routes that need a signed-in user. Guests go to Log in and come back after. */
export const protectedRoutes: readonly string[] = [
  routes.reportTrack.report,
  routes.account.profile,
];
