/**
 * Copy for the Traffic section: overview (/traffic), traffic map (/traffic/map),
 * route view (/traffic/route) and announcements (/traffic/announcements).
 * Shared words (View on map, View notice, pagination, tags) come from ui.ts.
 */

/** Filters and layer toggles shared by the traffic map and the route view. */
const filters = {
  stationSearch: {
    label: 'Search a station',
    placeholder: 'Search a station',
    noMatches: (query: string) =>
      `No station matches "${query}". Check the spelling, or try the station code, like S09.`,
  },
  placeSearch: {
    label: 'Search a road or area',
    placeholder: 'Search a road or area',
    noMatches: (query: string) =>
      `No road or area matches "${query}". Check the spelling, or try a nearby station name.`,
  },
  /** Group name read out for the time filter. */
  timeGroupLabel: 'Time period',
  time: {
    now: 'Happening now',
    week: 'Next 7 days',
    upcoming: 'Upcoming',
  },
  layersTitleDiagram: 'Show on diagram',
  layersTitleMap: 'Show on map',
  layers: {
    closures: 'Road closures',
    construction: 'Construction zones',
    hazards: 'Traffic hazards',
    alignment: 'LRT alignment',
  },
  /** Accessible name of a layer toggle, e.g. "Road closures, 4". */
  layerCount: (name: string, count: number) => `${name}, ${count}`,
  /** One road change of each layer, for marker names ("Road closure: Jalan ..."). */
  layerSingular: {
    closure: 'Road closure',
    construction: 'Construction zone',
    hazard: 'Traffic hazard',
  },
  /** Joins the two ends of a date range: "12 Oct 2026 to Jul 2027". */
  dateRange: (from: string, to: string) => `${from} to ${to}`,
  /** Read out politely after a filter or search changes. */
  liveRegion: (count: number) => `${count} road ${count === 1 ? 'change' : 'changes'} shown`,
  clearFilters: 'Clear filters',
  /** Empty list, by what caused it. */
  noMatch: {
    title: 'No road changes match',
    text: 'Try another time range or show more layers.',
    range: 'Nothing is planned in this time range.',
    layers: 'Turn on at least one layer to see road changes.',
  },
  skipToList: 'Skip to the list of road changes',
  skipToStations: 'Skip to the stations',
} as const;

const viewSwitch = {
  label: 'Traffic views',
  route: 'Route view',
  map: 'Map view',
} as const;

/** The updated-at line under the page title, e.g. "Updated today at 14:20". */
const updated = (time: string) => `Updated today at ${time}`;

export const trafficCopy = {
  overview: {
    meta: {
      title: 'Traffic',
      description:
        'Road closures, diversions and construction works for the LRT Mutiara Line, with dates and duration for each.',
    },
    header: {
      title: 'Traffic',
      lede: 'See road closures, diversions and construction works for the LRT Mutiara Line. Every notice shows its dates and duration, so you can plan your journey.',
    },
    pages: {
      title: 'Pages in this section',
      cards: [
        {
          id: 'map',
          title: 'Traffic map',
          body: 'See closures, construction zones and hazards on a map of Penang.',
          points: ['Road closures', 'Construction zones', 'Traffic hazards'],
        },
        {
          id: 'route',
          title: 'Route view',
          body: 'See road changes station by station along the line.',
          points: ['Works near each station', 'Nearby places', 'Interchanges'],
        },
        {
          id: 'announcements',
          title: 'Announcements',
          body: 'Read every road change, with its start date, end date and duration.',
          points: ['Current', 'Upcoming', 'Past'],
        },
      ],
    },
    week: {
      title: 'Road changes this week',
      listLabel: 'Road changes this week',
      seeAll: 'See all announcements',
      viewOnMap: 'View on map',
      /** Full name of the "View on map" link, for screen readers. */
      viewOnMapNamed: (title: string) => `View on map: ${title}`,
      locationLabel: 'Location',
      datesLabel: 'Dates',
      dateRange: (from: string, to: string) => `${from} to ${to}`,
      dateRangeHours: (from: string, to: string, fromHour: string, toHour: string) =>
        `${from} to ${to}, ${fromHour} to ${toHour}`,
      empty: {
        title: 'No road changes this week',
        body: 'We have no closures or works to report right now. Check the traffic map for later changes.',
      },
      error: {
        title: 'We could not load road changes',
        body: 'Check your connection and try again.',
      },
    },
    toc: {
      pages: 'Pages in this section',
      week: 'Road changes this week',
      questions: 'Popular questions',
    },
    help: {
      title: 'Need help?',
      report: 'Report an issue',
      track: 'Track a ticket',
    },
    faq: {
      title: 'Popular questions',
      seeAll: 'See all questions',
      /** Keeps these item ids apart from the FAQ page's own anchors. */
      idPrefix: 'traffic-faq-',
    },
  },

  map: {
    meta: {
      title: 'Traffic map',
      description:
        'See road closures, construction zones and traffic hazards along the LRT Mutiara Line on a map of Penang.',
    },
    header: { title: 'Traffic map', updated },
    viewSwitch,
    filters,
    layout: {
      panelLabel: 'Map controls and results',
      mapLabel: 'Map of road changes along the LRT Mutiara Line',
      /** Over the map when its tiles cannot load. */
      unavailable: 'The map could not load. The list still shows every road change.',
      showMap: 'Show map',
      showList: 'Show list',
    },
    basemap: {
      label: 'Map type',
      map: 'Map',
      /** VERIFY T4: OpenStreetMap has no satellite layer, so the builder may drop this option. */
      satellite: 'Satellite',
    },
    controls: {
      zoomIn: 'Zoom in',
      zoomOut: 'Zoom out',
      locate: 'Show my location',
      locating: 'Finding your location…',
      locateDenied:
        'We could not get your location. Allow location access in your browser, or search for a road instead.',
      locateOutside: 'You are outside the Penang area, so the map shows the whole line.',
      resetView: 'Show the whole line',
    },
    attribution: '© OpenStreetMap contributors',
    legend: {
      title: 'Map key',
      line: 'Mutiara Line',
      station: 'Station',
      interchange: 'Interchange',
      closure: 'Road closure',
      construction: 'Construction zone',
      hazard: 'Traffic hazard',
    },
    results: {
      title: (count: number) => `In this area (${count})`,
      listLabel: 'Road changes in this area',
      loading: 'Loading road changes…',
      empty: {
        title: 'No road changes here',
        body: 'Nothing matches these filters. Choose another time, turn on more layers, or zoom out.',
      },
      noLayers: 'Turn on at least one layer to see road changes.',
      error: {
        title: 'We could not load the map data',
        body: 'Check your connection and try again.',
      },
      reported: (date: string) => `Reported ${date}`,
      until: (end: string) => `until ${end}`,
    },
    popup: {
      close: 'Close details',
      readAnnouncement: 'Read announcement',
      reportProblem: 'Report a problem',
      allDay: 'All day',
      hours: (from: string, to: string) => `${from} to ${to}`,
    },
    mapError: {
      title: 'The map did not load',
      body: 'Try again, or use the route view to see road changes by station.',
      routeLink: 'Open route view',
    },
  },

  route: {
    meta: {
      title: 'Route view',
      description:
        'See road changes station by station along the LRT Mutiara Line, from Penang Sentral to PSR-A.',
    },
    header: { title: 'Route view', updated },
    viewSwitch,
    filters,
    diagram: {
      label: 'Diagram of the LRT Mutiara Line',
      caption:
        'Stations in line order, not to scale. Select a station to see road changes near it.',
      stationButton: (code: string, name: string) => `${code} ${name}`,
      /** Rail rows with glyphs, read out after the station name. */
      changesNearby: (count: number) =>
        `${count} road ${count === 1 ? 'change' : 'changes'} nearby`,
      stationSelected: (code: string, name: string) => `${code} ${name}, selected`,
      stationWithChanges: (code: string, name: string, count: number) =>
        `${code} ${name}, ${count} road ${count === 1 ? 'change' : 'changes'} nearby`,
      provisional: '(provisional)',
      depot: 'Depot',
      legend: {
        title: 'Diagram key',
        line: 'Mutiara Line',
        station: 'Station',
        interchange: 'Interchange',
        place: 'Nearby place',
        worksite: 'Active worksite',
        closure: 'Road closure',
        hazard: 'Traffic hazard',
      },
    },
    search: {
      noMatchTitle: (query: string) => `No station matches “${query}”`,
      noMatchHint: 'Try the station code, for example S09.',
      count: (count: number) => `${count} ${count === 1 ? 'station' : 'stations'}`,
      listLabel: 'Stations',
    },
    stationList: {
      label: 'Stations from Penang Sentral to PSR-A',
      select: (name: string) => `Show road changes near ${name}`,
      provisionalName: 'Provisional name',
    },
    selected: {
      clear: 'Clear',
      clearLabel: (name: string) => `Clear selection of ${name}`,
      prompt: 'Choose a station on the diagram to see road changes near it.',
      changesTitle: (count: number) => `Road changes near this station (${count})`,
      lineTitle: (count: number) => `Road changes on the line (${count})`,
      emptyNear: (name: string) => `No road changes near ${name} in this time range.`,
      viewStation: 'View station page',
      empty: {
        title: 'No road changes near this station',
        body: 'Nothing matches these filters. Try Next 7 days or Upcoming.',
      },
      noLayers: 'Turn on at least one type above to see road changes.',
    },
    error: {
      title: 'We could not load the route view',
      body: 'Check your connection and try again.',
    },
  },

  announcements: {
    meta: {
      title: 'Traffic announcements',
      description:
        'Planned road closures and diversions for the LRT Mutiara Line, with the dates and duration of each.',
    },
    header: {
      title: 'Traffic announcements',
      breadcrumb: 'Announcements',
      lede: 'Planned closures and diversions, with the dates and duration of each.',
    },
    tabs: {
      label: 'Filter by status',
      all: 'All',
      current: 'Current',
      upcoming: 'Upcoming',
      past: 'Past',
    },
    filters: {
      groupLabel: 'Filter announcements',
      areaLabel: 'Area',
      allAreas: 'All areas',
      searchLabel: 'Search a road or area',
      searchPlaceholder: 'Search road or area',
      clearAll: 'Clear filters',
      resultCount: (count: number) =>
        `${count} ${count === 1 ? 'announcement' : 'announcements'} found`,
    },
    table: {
      label: 'Traffic announcements',
      columns: {
        status: 'Status',
        announcement: 'Announcement',
        location: 'Location',
        start: 'Start',
        end: 'End',
        duration: 'Duration',
        notice: 'Official notice',
        map: 'Map',
      },
      viewNoticeLabel: 'View notice',
      viewOnMapLabel: 'View on map',
      linked: 'Linked announcement',
      /** Row labels in the mobile card layout. */
      card: {
        location: 'Location',
        dates: 'Dates',
        duration: 'Duration',
      },
      dateRange: (start: string, end: string) => `${start} to ${end}`,
      viewNotice: (title: string) => `View notice: ${title}`,
      viewOnMap: (title: string) => `View on map: ${title}`,
    },
    pagination: {
      label: 'Announcements pages',
      pageSize: 6,
      summary: (from: number, to: number, total: number) =>
        `Showing ${from} to ${to} of ${total} announcements`,
      summaryEmpty: 'Showing 0 announcements',
      changed: (page: number, pages: number, from: number, to: number, total: number) =>
        `Page ${page} of ${pages}. Showing ${from} to ${to} of ${total} announcements.`,
    },
    notFound: {
      text: 'We could not find that announcement. Showing all announcements.',
      dismiss: 'Dismiss this message',
    },
    empty: {
      all: {
        title: 'No announcements yet',
        body: 'We have not published any road changes. Check back soon.',
      },
      current: {
        title: 'No current announcements',
        body: 'No road changes are happening now. Check Upcoming for planned works.',
      },
      upcoming: {
        title: 'No upcoming announcements',
        body: 'No road changes are planned yet. Check Current to see what is happening now.',
      },
      past: {
        title: 'No past announcements',
        body: 'Finished road changes will appear here.',
      },
      filtered: {
        title: 'No announcements match',
        body: 'Try another area, or search for a different road.',
        reset: 'Clear filters',
      },
    },
    error: {
      title: 'We could not load announcements',
      body: 'Check your connection and try again.',
      contact: 'Contact us',
    },
    loading: 'Loading announcements…',
  },
} as const;
