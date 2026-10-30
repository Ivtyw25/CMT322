import { routes } from '@/config/routes';

/**
 * Home page copy, Figma 37:1025 (desktop), 133:6556 (mobile), search state 49:1127 / 134:8874.
 * UX spec: docs/specs/home.md. Sections are in reading order.
 *
 * Records come from @/data/api, never from here: announcements (works list), areas (chip
 * labels), stations (line preview), construction updates (progress cards), most-asked FAQ
 * items (Common questions), search entries, site info (careline label, number and tel).
 *
 * Shared words come from src/content and are not repeated here:
 * commonCopy.metadata.defaultTitle (page title), uiCopy.actions.search / viewOnMap / tryAgain,
 * uiCopy.filters.allAreas, uiCopy.tags.*, uiCopy.time.range / allDay,
 * uiCopy.station.provisionalName, uiCopy.empty.noResults / noResultsHint,
 * uiCopy.form.errors.emailRequired / emailInvalid, uiCopy.imagePlaceholder, uiCopy.opensInNewTab.
 */
export const homeCopy = {
  meta: {
    /** The title is commonCopy.metadata.defaultTitle, used as an absolute title. */
    description:
      'Check road closures and construction near you on the LRT Mutiara Line in Penang. Report a problem and track your ticket.',
  },

  hero: {
    /** The page h1. The hero photo is decorative (alt=""). */
    title: 'LRT Mutiara Line',
    /** Project tagline, one line each. Title case kept: it is a slogan, not a heading. */
    tagline: ['Empowering Mobility', 'Enriching Communities'],
    tryLabel: 'Try',
    /** Quick links under the search box. They do not fill the box. */
    tryChips: [
      { label: 'Bayan Lepas', target: routes.homeWorksIn('bayan-lepas') },
      { label: 'Bukit Jambul', target: routes.homeWorksIn('bukit-jambul') },
      { label: 'Jalan Universiti', target: routes.project.station('S13') },
      { label: 'KOMTAR', target: routes.project.station('S20') },
    ],
    actions: {
      trafficMap: { label: 'View traffic map', href: routes.traffic.map },
      report: { label: 'Report an issue', href: routes.reportTrack.report },
    },
  },

  search: {
    /** Accessible name of the <form role="search">. */
    formLabel: 'Check works near you',
    /** Visible hint over the input and its visually hidden <label> (same words). */
    hint: 'Check works near you: road, area or station',
    /** Accessible name of the suggestions listbox. */
    suggestionsLabel: 'Suggestions',
    groups: {
      station: 'Stations',
      road: 'Roads',
      area: 'Areas',
    },
    /** Search's own polite live region, 500 ms after the last keystroke. */
    resultCount: (count: number) =>
      count === 1
        ? '1 suggestion. Press Enter to choose it.'
        : `${count} suggestions. Use the up and down arrows to choose one.`,
    /** Live message when nothing matches. The panel shows uiCopy.empty.noResults / noResultsHint. */
    noResultsLive: (query: string) => `No results for "${query}".`,
    /** Links in the no-results panel. */
    noResultsLinks: {
      stations: {
        label: (count: number) => `Browse all ${count} stations`,
        href: routes.project.stations,
      },
      trafficMap: { label: 'Open the traffic map', href: routes.traffic.map },
    },
  },

  works: {
    title: 'Works in your area',
    lede: 'Choose your area to see current and upcoming works on your roads.',
    allAnnouncements: { label: 'See all announcements', href: routes.traffic.announcements },
    /** Accessible name of the area chip group. Chips: uiCopy.filters.allAreas, then area labels. */
    chipsLabel: 'Choose an area',
    /** The section's polite live region after a chip change or an area chosen in search. */
    resultCount: (count: number, area: string) => {
      if (count === 0) return `No road changes in ${area}`;
      return count === 1 ? `1 road change in ${area}` : `${count} road changes in ${area}`;
    },
    /** {area} in resultCount when "All areas" is chosen. */
    allAreasInSentence: 'all areas',
    item: {
      /** Visually hidden labels before the date and hours lines (the icons are decorative). */
      datesLabel: 'Dates:',
      hoursLabel: 'Daily hours:',
      /** Visually hidden end of the "View on map" link name: "View on map: {title}". */
      viewOnMapLabel: (title: string) => `: ${title}`,
      viewOnMapHref: (announcementId: string) => routes.traffic.mapFocus(announcementId),
    },
    empty: {
      title: (area: string) => `No road works announced for ${area}`,
      titleAllAreas: 'No road works announced on the line right now',
      /** Below 1024 px the sign-up card is under the list. */
      textBelow:
        "We'll list closures and night works here as soon as they're announced. Sign up below to hear first.",
      /** From 1024 px the sign-up card is on the right. */
      textRight:
        "We'll list closures and night works here as soon as they're announced. Sign up on the right to hear first.",
    },
    subscribe: {
      title: 'Get updates for this area',
      titleAllAreas: 'Get updates for the whole line',
      text: (area: string) =>
        `We email you when a new closure or night work is announced for ${area}.`,
      textAllAreas:
        'We email you when a new closure or night work is announced anywhere on the line.',
      emailLabel: 'Email address',
      emailPlaceholder: 'Email address',
      submit: 'Get updates',
      submitting: 'Signing you up…',
      /** {area} is the area label, or allAreasInSentence. */
      success: (email: string, area: string) =>
        `You're signed up. We'll email ${email} when road changes are announced for ${area}.`,
      allAreasInSentence: 'the whole line',
      sendFailed: "We couldn't sign you up just now. Check your connection and try again.",
      footnote: 'You can unsubscribe at any time.',
    },
  },

  line: {
    title: 'The Mutiara Line in 2031',
    // VERIFY: "December 2031". BRIEFING §8 confirms only "Operations start in 2031".
    lede: '22 stations will link PSR-A, the airport and George Town with Penang Sentral on the mainland. Opening is planned for December 2031.',
    /** <figcaption> of each view (768 px and up). */
    captions: {
      route: 'Stations in line order, not to scale',
      map: 'Where the line runs on Penang Island and the mainland',
    },
    viewToggle: {
      /** Visually hidden legend of the radio group. */
      label: 'Line view',
      route: 'Route view',
      map: 'Map view',
    },
    /** Accessible name of each station link (rail, diagram) and map marker: "S20 KOMTAR". */
    stationLabel: (code: string, name: string) => `${code} ${name}`,
    /** Added to stationLabel for a provisional name. */
    provisionalSuffix: ', provisional name',
    /** Added to stationLabel for S19 Macallum. */
    junctionSuffix: ', where the two routes meet',
    /** Short form under a provisional name in the diagram. The rail uses "Provisional name". */
    provisionalShort: '(provisional)',
    depot: 'Depot',
    legend: {
      line: 'Mutiara Line',
      nearby: 'Nearby places',
      station: 'Elevated station',
      junction: 'Junction: the two routes meet at Macallum',
    },
    /**
     * Nearby-place call-outs on the desktop diagram, keyed by the station they point to.
     * Diagram labels from Figma, not station records. Keep each to two lines.
     */
    callouts: {
      S31: [
        'KTM Butterworth',
        'Sultan Abdul Halim Ferry Terminal, Butterworth',
        'Rapid Penang bus terminal (local and interstate express)',
      ],
      S20: ['KOMTAR bus terminal', 'KOMTAR Tower', 'George Town UNESCO World Heritage Site'],
      S13: ['USM'],
      S10: ['Sungai Nibong bus terminal'],
      S08: ['SPICE Arena'],
      S05: ['Bayan Lepas Free Industrial Zone (FIZ)'],
    },
    map: {
      /** role="region" name. */
      label: 'Map of the Mutiara Line',
      caption: 'Illustrative alignment.',
      /** Followed by uiCopy.opensInNewTab (visually hidden). */
      attribution: {
        label: '© OpenStreetMap contributors',
        href: 'https://www.openstreetmap.org/copyright',
      },
      loading: 'Loading map…',
      errorTitle: "The map didn't load.",
      errorText: 'Check your connection, or use Route view.',
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      /** Link in a station marker's popup. */
      openStationPage: (name: string) => `Open ${name} station page`,
    },
  },

  about: {
    title: 'About the Mutiara Line',
    // VERIFY: the line's role in the Penang Transport Master Plan and the State Government vision.
    body: "The LRT Mutiara Line is a key part of the Penang Transport Master Plan. It is more than a way to travel. It will support growth that benefits everyone and bring new jobs, as part of the State Government's vision of a connected, dynamic Penang.",
    link: { label: 'Read more about the line', href: routes.project.about },
    imageAlt: 'Red lanterns hang over Love Lane, a street of shophouses in George Town',
  },

  guide: {
    title: 'How to use this platform',
    lede: 'Everything you can do here while the Mutiara Line is being built.',
    /** Link cards: the title is the link. Icons are lucide-react names, as in Figma. */
    cards: [
      {
        id: 'learn',
        icon: 'info',
        title: 'Learn about the line',
        text: 'Read the project background, key figures, the two routes and what every station serves.',
        href: routes.project.about,
      },
      {
        id: 'construction',
        icon: 'camera',
        title: 'Follow construction progress',
        text: 'See site photos and updates from the project team, plus a timeline of milestones to 2031.',
        href: routes.project.construction,
      },
      {
        id: 'traffic-map',
        icon: 'map',
        title: 'Check roads on the traffic map',
        text: 'Find road closures, construction zones and hazards on a map or station by station.',
        href: routes.traffic.map,
      },
      {
        id: 'announcements',
        icon: 'calendar-days',
        title: 'Plan ahead with announcements',
        text: 'See current, upcoming and past road changes, with start and end dates and how long they last.',
        href: routes.traffic.announcements,
      },
      {
        id: 'report',
        icon: 'flag',
        title: 'Report an issue',
        text: 'Tell us about blocked access, hazards or other problems. Add photos and pin the exact location.',
        href: routes.reportTrack.report,
      },
      {
        id: 'ticket-id',
        icon: 'ticket',
        title: 'Get a ticket ID',
        text: 'Every report gets its own ticket ID straight away. We also email you a confirmation.',
        href: routes.reportTrack.overview,
      },
      {
        id: 'track',
        icon: 'search',
        title: 'Track your ticket',
        text: 'Enter your ticket ID to see its status and read replies from the authority handling it.',
        href: routes.reportTrack.track,
      },
      {
        id: 'faq',
        icon: 'circle-help',
        title: 'Find quick answers',
        text: 'Read answers about construction hours, road closures, property, train services and land acquisition.',
        href: routes.project.faq,
      },
    ],
  },

  safety: {
    title: 'Stay safe around worksites',
    lede: 'Simple habits that keep you and the work crews safe while the line is built.',
    /** Icons are lucide-react names, as in Figma. */
    tips: [
      {
        id: 'detours',
        icon: 'signpost',
        title: 'Follow detour signs',
        text: 'Use the signed route, even if it looks longer.',
      },
      {
        id: 'walkways',
        icon: 'person-standing',
        title: 'Keep to marked walkways',
        text: 'Temporary paths are lit and kept clear.',
      },
      {
        id: 'vehicles',
        icon: 'truck',
        title: 'Watch for site vehicles',
        text: 'Lorries and cranes enter and leave site gates.',
      },
      {
        id: 'hoarding',
        icon: 'shield',
        title: 'Stay behind the hoarding',
        text: 'Never enter a worksite or move barriers.',
      },
      {
        id: 'slow-down',
        icon: 'gauge',
        title: 'Slow down near works',
        text: 'Lanes are narrower and can shift overnight.',
      },
      {
        id: 'report-hazards',
        icon: 'flag',
        title: 'Report hazards early',
        text: 'Tell us about anything unsafe you see.',
      },
    ],
  },

  progress: {
    title: 'Latest construction progress',
    lede: 'Updates and site photos from the project team.',
    seeAll: { label: 'See all updates', href: routes.project.construction },
    /** Each card links to its update on Construction progress. */
    cardHref: (updateId: string) => routes.project.constructionUpdate(updateId),
    empty: 'No construction updates yet.',
  },

  help: {
    /** Visually hidden h2 of the help strip. */
    title: 'Help and contacts',
    report: {
      title: 'Something blocking your way?',
      text: 'Report blocked access, hazards or other problems. You get a ticket ID straight away.',
      primary: { label: 'Report an issue', href: routes.reportTrack.report },
      secondary: { label: 'Track a ticket', href: routes.reportTrack.track },
    },
    property: {
      title: 'Is your property near the works?',
      // VERIFY: independent pre-construction survey and the right to ask for a copy.
      text: 'An independent surveyor records the condition of nearby buildings before work starts. You can ask for a copy.',
      link: {
        label: 'Read about property surveys',
        href: routes.project.faqItem('condition-survey'),
      },
    },
    careline: {
      /** Heading and tel: link text from the site-info record: "MRTCareline 1800-88-6782". */
      title: (label: string, number: string) => `${label} ${number}`,
      /** Accessible name of the heading link. */
      callLabel: (label: string, number: string) => `Call ${label} ${number}`,
      // VERIFY: "run by MRT Corp".
      text: 'A 24-hour line for urgent complaints about the works, run by MRT Corp.',
    },
  },

  faq: {
    title: 'Common questions',
    lede: 'Quick answers about the works, road changes and when the line opens.',
    seeAll: { label: 'See all questions', href: routes.project.faq },
  },

  /** Shown under a section header when that section's data call fails. */
  sectionError: "We couldn't load this section. Refresh the page to try again.",
} as const;
