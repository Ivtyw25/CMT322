import { routes } from '@/config/routes';

/** Header, nav panels (Figma 101:4039), account and appearance menus, mobile drawer. */

export type NavItem = { id: string; label: string; description: string; href: string };
export type NavGroup = { id: string; label: string; intro: string; items: readonly NavItem[] };

export const navGroups = {
  project: {
    id: 'project',
    label: 'Project',
    intro: 'Plans, stations and progress for the Mutiara Line.',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        description: 'The project at a glance',
        href: routes.project.overview,
      },
      {
        id: 'about',
        label: 'About the line',
        description: 'Route, features and the timeline to 2031',
        href: routes.project.about,
      },
      {
        id: 'stations',
        label: 'Stations',
        description: 'All 22 stations and what is happening at each',
        href: routes.project.stations,
      },
      {
        id: 'construction',
        label: 'Construction progress',
        description: 'Milestones and site updates',
        href: routes.project.construction,
      },
      {
        id: 'faq',
        label: 'FAQ',
        description: 'Answers about the works, roads and reports',
        href: routes.project.faq,
      },
    ],
  },
  traffic: {
    id: 'traffic',
    label: 'Traffic',
    intro: 'How the works change the roads, and when.',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        description: 'What to expect on the roads near the works',
        href: routes.traffic.overview,
      },
      {
        id: 'map',
        label: 'Traffic map',
        description: 'Closures, worksites and hazards on a map',
        href: routes.traffic.map,
      },
      {
        id: 'route',
        label: 'Route view',
        description: 'Road changes station by station',
        href: routes.traffic.route,
      },
      {
        id: 'announcements',
        label: 'Announcements',
        description: 'Current, upcoming and past closures',
        href: routes.traffic.announcements,
      },
    ],
  },
  reportTrack: {
    id: 'report-track',
    label: 'Report & Track',
    intro: 'Tell the project team about a problem and follow it to the end.',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        description: 'How reporting works and what happens next',
        href: routes.reportTrack.overview,
      },
      {
        id: 'report',
        label: 'Report an issue',
        description: 'Damaged roads, drains, noise, dust or unsafe sites',
        href: routes.reportTrack.report,
      },
      {
        id: 'track',
        label: 'Track a ticket',
        description: 'Follow your report with its ticket ID',
        href: routes.reportTrack.track,
      },
    ],
  },
} as const satisfies Record<string, NavGroup>;

export const navCopy = {
  /** Visually hidden suffix on the trigger of the group the current page belongs to. */
  currentGroup: ', current section',
  /** Visually hidden prefix on the mobile section bar button. */
  sectionBarPrefix: 'Pages in this section:',

  projectPanel: {
    title: 'Find a station',
    /** Shown in this order. Names and areas come from the station records. */
    featuredStationCodes: ['S20', 'S13', 'S09', 'S03'],
    seeAll: (count: number) => `See all ${count} stations`,
    seeAllHref: routes.project.stations,
  },
  trafficPanel: {
    title: 'Happening now',
    /** Card line built from the announcement, e.g. "One lane each way until Jul 2027". */
    cardSummary: (brief: string, endDate: string) => `${brief} until ${endDate}`,
    empty: 'No road closures right now.',
    allLink: 'All current closures',
    allHref: routes.traffic.announcements,
  },
  reportTrackPanel: {
    emergencyTitle: 'Someone in danger? Call 999 first.',
    emergencyText: (careline: string) =>
      `For urgent problems at a worksite, call MRTCareline on ${careline}, open 24 hours.`,
    /** Guests only. */
    accountTitle: 'You need a free account to send a report',
    accountText: 'Guests can still read every page and track a ticket.',
    accountLink: 'Create an account',
    /** Sign-up returns the guest to the page they were on (main agent decision). */
    accountHref: (currentPath: string) => routes.account.signupReturningTo(currentPath),
  },

  header: {
    logIn: 'Log in',
    logInHref: (currentPath: string) => routes.account.loginReturningTo(currentPath),
    /** Accessible name of the signed-in account chip, which shows the first name only. */
    accountMenuLabel: (fullName: string) => `Account menu, ${fullName}`,
  },

  appearance: {
    title: 'Appearance',
    subtitle: 'Saved on this device',
    /** Accessible name of the theme button, e.g. "Appearance: Match system". */
    buttonLabel: (current: string) => `Appearance: ${current}`,
    /** Live-region message after a change, e.g. "Appearance set to Dark". */
    changed: (choice: string) => `Appearance set to ${choice}`,
    options: {
      light: { label: 'Light', shortLabel: 'Light', description: null },
      dark: { label: 'Dark', shortLabel: 'Dark', description: null },
      system: {
        label: 'Match system',
        /** Mobile segmented control. */
        shortLabel: 'System',
        description: 'Follows your device setting',
      },
    },
  },

  account: {
    signedInAs: (fullName: string) => `Signed in as ${fullName}`,
    items: [
      { id: 'profile', label: 'Profile & settings', href: routes.account.profile },
      { id: 'reports', label: 'My reports', href: routes.account.profileSection('reports') },
      { id: 'stations', label: 'My stations', href: routes.account.profileSection('stations') },
      {
        id: 'notifications',
        label: 'Notifications',
        href: routes.account.profileSection('notifications'),
      },
    ],
    logOut: 'Log out',
  },

  mobile: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    /** Accessible name of the signed-in avatar link. */
    profileLink: (fullName: string) => `Your profile, ${fullName}`,
    logIn: 'Log in',
    createAccount: 'Create an account',
    createAccountHref: (currentPath: string) => routes.account.signupReturningTo(currentPath),
    /** Account rows in the drawer (signed in): Profile & settings and My reports. */
    accountItemIds: ['profile', 'reports'],
    appearanceLegend: 'Appearance',
  },
} as const;
