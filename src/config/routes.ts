/** Query parameter names of a new announcement's starting place (set from the Map pins page). */
export const announcementPlaceParams = {
  type: 'type',
  lat: 'lat',
  lng: 'lng',
  road: 'road',
} as const;

/** Query parameter naming a station on the Progress pages. */
export const progressStationParam = 'station';

type AnnouncementPlace = { type: string; lat: number; lng: number; road: string };

/**
 * The only place route paths are written. Every link uses these helpers.
 * Never type a path string anywhere else.
 */
export const routes = {
  home: '/',
  /** A section deep link: `<path>#<id>`. */
  withHash: (path: string, id: string) => `${path}#${id}`,
  homeWorksIn: (areaId: string) => `/?area=${areaId}#works`,
  project: {
    overview: '/project',
    about: '/project/about',
    stations: '/project/stations',
    station: (stationCode: string) => `/project/stations/${stationCode.toLowerCase()}`,
    construction: '/project/construction',
    constructionUpdate: (updateId: string) => `/project/construction#${updateId}`,
    faq: '/project/faq',
    faqItem: (itemId: string) => `/project/faq#${itemId}`,
    faqTopic: (topicId: string) => `/project/faq?topic=${topicId}`,
  },
  traffic: {
    overview: '/traffic',
    map: '/traffic/map',
    mapFocus: (itemId: string) => `/traffic/map?focus=${itemId}`,
    route: '/traffic/route',
    routeAt: (stationCode: string) => `/traffic/route?station=${stationCode.toLowerCase()}`,
    announcements: '/traffic/announcements',
    announcement: (announcementId: string) => `/traffic/announcements#${announcementId}`,
  },
  reportTrack: {
    overview: '/report-track',
    report: '/report',
    reportAt: (stationCode: string) => `/report?station=${stationCode.toLowerCase()}`,
    submitted: (ticketId: string) => `/report/submitted/${ticketId}`,
    track: '/track',
    ticket: (ticketId: string) => `/track/${ticketId}`,
  },
  account: {
    login: '/login',
    loginReturningTo: (path: string) => `/login?next=${encodeURIComponent(path)}`,
    signup: '/signup',
    signupReturningTo: (path: string) => `/signup?next=${encodeURIComponent(path)}`,
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
  /** Staff portal. Not linked from the commuter site. */
  admin: {
    login: '/admin/login',
    dashboard: '/admin',
    tickets: '/admin/tickets',
    ticketsWith: (query: string) => `/admin/tickets?q=${encodeURIComponent(query)}`,
    ticketsByStatus: (status: string) => `/admin/tickets?status=${status}`,
    ticket: (ticketId: string) => `/admin/tickets/${ticketId}`,
    announcements: '/admin/announcements',
    announcementsWith: (query: string) => `/admin/announcements?q=${encodeURIComponent(query)}`,
    announcementNew: '/admin/announcements/new/edit',
    announcementNewAt: (place: AnnouncementPlace) =>
      `/admin/announcements/new/edit?${new URLSearchParams({
        [announcementPlaceParams.type]: place.type,
        [announcementPlaceParams.lat]: String(place.lat),
        [announcementPlaceParams.lng]: String(place.lng),
        [announcementPlaceParams.road]: place.road,
      })}`,
    announcementEdit: (announcementId: string) => `/admin/announcements/${announcementId}/edit`,
    mapItems: '/admin/map-items',
    progress: '/admin/progress',
    progressFor: (stationCode: string) => `/admin/progress?${progressStationParam}=${stationCode}`,
    progressEditor: (updateId: string) => `/admin/progress/${updateId}/edit`,
    progressNew: '/admin/progress/new/edit',
    progressNewFor: (stationCode: string) =>
      `/admin/progress/new/edit?${progressStationParam}=${stationCode}`,
  },
  dev: {
    components: '/dev/components',
    workspace: '/dev/workspace',
  },
} as const;

export const profileSections = ['profile', 'reports', 'stations', 'security', 'privacy'] as const;
export type ProfileSection = (typeof profileSections)[number];

/** Routes that need a signed-in user. Guests go to Log in and come back after. */
export const protectedRoutes: readonly string[] = [
  routes.reportTrack.report,
  routes.account.profile,
];
