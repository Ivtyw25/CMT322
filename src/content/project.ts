import { routes } from '@/config/routes';

/**
 * Project group copy: Overview, About the line, Stations, Station page template, Construction
 * progress and FAQ. Figma 55:2090, 1:332, 100:3723, 95:3102, 1:413 and 1:557 (desktop) and their
 * "M ·" mobile frames. Records (stations, updates, milestones, FAQ answers) live in src/data/mock.
 * Shared words (Need help?, page feedback, actions, tags, stages) are in ui.ts.
 */

/** Joins names as "A", "A and B" or "A, B and C". */
const listOf = (items: readonly string[]): string =>
  items.length <= 1
    ? (items[0] ?? '')
    : `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;

/** One description per page, used by every "Related pages" list in the group. */
const relatedPage = {
  about: {
    label: 'About the line',
    description: 'Background, routes, stations and the timeline to 2031.',
    href: routes.project.about,
  },
  construction: {
    label: 'Construction progress',
    description: 'Site updates and photos from the project team.',
    href: routes.project.construction,
  },
  faq: {
    label: 'FAQ',
    description: 'Answers about construction hours, roads and land.',
    href: routes.project.faq,
  },
  trafficMap: {
    label: 'Traffic map',
    description: 'Closures, worksites and hazards near the line.',
    href: routes.traffic.map,
  },
  routeView: {
    label: 'Route view',
    description: 'Road changes along the line, station by station.',
    href: routes.traffic.route,
  },
  announcements: {
    label: 'Announcements',
    description: 'Current, upcoming and past road changes.',
    href: routes.traffic.announcements,
  },
} as const;

export const projectCopy = {
  /** Section bar and breadcrumb label for the whole group. */
  sectionLabel: 'Project',

  overview: {
    meta: {
      title: 'Project',
      description:
        'What the LRT Mutiara Line is, how construction is going, and answers to the questions people ask most.',
    },
    header: {
      title: 'Project',
      lede: 'What the LRT Mutiara Line is, how construction is going, and answers to the questions people ask most.',
    },
    sectionBarCurrent: 'Overview',
    toc: {
      pages: 'Pages in this section',
      latest: 'Latest update',
      questions: 'Popular questions',
    },
    pages: {
      title: 'Pages in this section',
      /** Card order as Figma: About, FAQ, Construction progress. Each card lists the page's main sections. */
      cards: [
        {
          id: 'about',
          title: 'About the line',
          description: 'Background, routes, stations and the timeline to 2031.',
          href: routes.project.about,
          highlights: ['Two routes, one line', 'Stations along the line', 'Project timeline'],
        },
        {
          id: 'faq',
          title: 'FAQ',
          description: 'Answers from MRT Corp about the works, roads and land.',
          href: routes.project.faq,
          highlights: ['Construction hours', 'Road closures', 'Land and compensation'],
        },
        {
          id: 'construction',
          title: 'Construction progress',
          description: 'Site updates and photos posted by the project team.',
          href: routes.project.construction,
          highlights: ['Latest site updates', 'Filter by type of work', 'Milestones'],
        },
      ],
    },
    latest: {
      title: 'Latest update',
      /** e.g. "22 Oct 2026, Jalan Sultan Azlan Shah". */
      meta: (date: string, location: string) => `${date}, ${location}`,
      link: 'See all construction updates',
      photoAlt: (title: string) => `Site photo: ${title}`,
      empty: 'No site updates have been posted yet.',
    },
    questions: {
      title: 'Popular questions',
      empty: 'Questions will appear here soon.',
      link: 'See all FAQs',
    },
  },

  about: {
    meta: {
      title: 'About the line',
      description:
        'Routes, stations, key figures and the project timeline for the LRT Mutiara Line, linking Penang Island and the mainland.',
    },
    header: {
      title: 'About the Mutiara Line',
      titleShort: 'About the line',
      lede: 'The first integrated metro system in the northern region of Peninsular Malaysia, linking Penang Island and the mainland.',
      /** ISO date for ui.time.updatedOn. */
      updatedAt: '2026-10-21',
    },
    sectionBarCurrent: 'About the line',
    toc: {
      overview: 'Overview',
      figures: 'Key figures',
      routes: 'Two routes, one line',
      stations: 'Stations along the line',
      travelling: 'Travelling on the line',
      benefits: 'A smarter way to travel',
      timeline: 'Project timeline',
    },
    overview: {
      title: 'Overview',
      paragraphs: [
        'The LRT Mutiara Line, formerly the Bayan Lepas LRT Project, keeps Penang’s identity as the ‘Pearl of the Orient’ while meeting its fast-growing need to travel.',
        'Its 29.67 km viaduct and 22 stations connect key areas on Penang Island and the mainland, so places are easier to reach and roads are less congested. The main route links Penang South Reclamation Island A (PSR-A), Penang Sentral and KOMTAR station in George Town.',
        'As the first metro system in the northern region, the line is planned with transit-oriented development (TOD), Park & Ride and last-mile connections. It also connects major hubs such as Penang International Airport and the Sungai Nibong bus terminal.',
        'Construction began in early 2025, with 2 depots along the line. Linked to future transit systems, the line will support Penang’s growth and a better quality of life for everyone who lives and works here.',
      ],
    },
    figures: {
      title: 'Key figures',
      items: [
        { value: '29.67 km', label: 'Elevated viaduct' },
        { value: '22', label: 'Stations' },
        { value: '2', label: 'Depots' },
        { value: '2031', label: 'Start of operations' },
      ],
    },
    routes: {
      title: 'Two routes, one line',
      lede: 'Both services share the track between PSR-A and Macallum, with trains running alternately. Select a route to see its details.',
      tabsLabel: 'Routes',
      factLabels: { length: 'Length', journeyTime: 'Journey time', construction: 'Construction' },
      tabs: [
        {
          id: 'psr-a-komtar',
          label: 'PSR-A to KOMTAR',
          intro:
            'The first phase runs from Penang South Reclamation Island A to KOMTAR in George Town. It serves busy residential, commercial and education areas.',
          facts: {
            length: '23.67 km',
            journeyTime: 'About 45 minutes',
            construction: 'From early 2025',
          },
        },
        {
          id: 'psr-a-penang-sentral',
          label: 'PSR-A to Penang Sentral',
          intro:
            'The second route shares the track from PSR-A to Macallum, then continues to Penang Sentral in Butterworth. It links the island with KTM trains, the ferry and buses on the mainland.',
          // VERIFY: length and journey time for PSR-A to Penang Sentral are not published in Figma.
          facts: {
            length: 'To be confirmed',
            journeyTime: 'To be confirmed',
            construction: 'Macallum to Penang Sentral from January 2027',
          },
        },
      ],
      note: 'Macallum and KOMTAR are only 0.79 km apart. Travelling between KOMTAR and Penang Sentral takes 8 to 13 minutes, with a change at Macallum.',
    },
    stations: {
      title: 'Stations along the line',
      lede: 'Station order, not to scale. Select a station to see what it serves.',
      diagramLabel: 'Route diagram of the Mutiara Line, 22 stations from Penang Sentral to PSR-A',
      /** Shown after the name of a station with a provisional name. */
      provisional: '(provisional)',
      legend: {
        line: 'Mutiara Line',
        nearby: 'Nearby places',
        station: 'Elevated station',
        interchange: 'Interchange',
      },
      /** Place labels drawn beside the diagram, by station code. */
      places: {
        S31: ['KTM Butterworth', 'Butterworth Ferry Terminal', 'Rapid Penang bus terminal'],
        S20: ['KOMTAR bus terminal', 'KOMTAR Tower', 'George Town UNESCO site'],
        S13: ['USM'],
        S10: ['Sungai Nibong bus terminal'],
        S08: ['SPICE Arena'],
        S05: ['Bayan Lepas FIZ'],
      },
      depot: 'Depot',
      groupLabel: 'Stations along the line',
      keyboardHint: 'Use the arrow keys to move along the line.',
      /** Accessible name of a stop, e.g. "S13 Jalan Universiti". */
      stopName: (code: string, name: string) => `${code} ${name}`,
      selected: {
        hint: 'Select a station on the diagram to see what it serves.',
        link: (name: string) => `Open the ${name} station page`,
      },
    },
    travelling: {
      title: 'Travelling on the line',
      rows: [
        {
          label: 'Train frequency',
          // VERIFY: "every 4 minutes at opening" here, "about every 5 minutes in the early years" in the benefits tab.
          value: 'Every 4 minutes at opening, and up to every 2 minutes as demand grows.',
        },
        { label: 'Operating hours', value: 'From 6 am to midnight. Hours are still tentative.' },
        {
          label: 'KOMTAR to Penang Sentral',
          value: '8 to 13 minutes, changing trains at Macallum.',
        },
        {
          label: 'Interchanges',
          value:
            'KOMTAR for future metro lines, Macallum between the two routes, and Penang Sentral for KTM Komuter and ETS.',
        },
        {
          label: 'Park & Ride',
          value: 'More than 1,000 car bays and 1,000 motorcycle bays at selected stations.',
        },
        {
          label: 'Universal access',
          value:
            'Every station is designed so that everyone can use it, including wheelchair users.',
        },
      ],
    },
    benefits: {
      title: 'A smarter way to travel',
      tabsLabel: 'Who benefits',
      tabs: [
        {
          id: 'commuters',
          label: 'Daily commuters',
          body: 'Trains arrive about every 5 minutes in the early years, so you spend less time waiting and less time stuck in traffic. Your daily commute becomes calmer and easier to plan.',
        },
        {
          id: 'public',
          label: 'General public',
          body: 'Every station has step-free access, so older people, parents with prams and wheelchair users can travel more easily. One line links the airport, the university, George Town and the mainland.',
        },
        {
          id: 'businesses',
          label: 'Businesses',
          body: 'The line links the Bayan Lepas Free Industrial Zone, the airport and George Town, so staff and customers can reach you without relying on the roads. Park & Ride at selected stations makes it easier to leave the car at home.',
        },
        {
          id: 'environment',
          label: 'Environment',
          body: 'Each full train takes cars off Penang’s roads. Less traffic means cleaner air and lower emissions, so the state can grow without adding to congestion.',
        },
      ],
    },
    timeline: {
      title: 'Project timeline',
      note: 'Figures come from MRT Corp’s official LRT Mutiara Line site (laluanmutiara.mymrt.com.my), retrieved 21 Oct 2026, and may change as the project progresses.',
    },
    related: [relatedPage.construction, relatedPage.trafficMap, relatedPage.faq],
  },

  stations: {
    meta: {
      title: 'Stations',
      description:
        'All 22 LRT Mutiara Line stations from Penang Sentral to PSR-A, with road changes, construction progress and reports near each one.',
    },
    header: {
      title: 'Stations',
      lede: '22 stations from Penang Sentral to PSR-A. Choose a station to see road changes, construction progress and reports nearby.',
    },
    sectionBarCurrent: 'Stations',
    search: {
      label: 'Search stations',
      placeholder: 'Search by name or code, for example S20',
      /** Visually hidden status after the field (docs/specs/stations.md). */
      results: (shown: number, total: number) =>
        shown === total ? `Showing all ${total} stations` : `Showing ${shown} of ${total} stations`,
      noResultsStatus: (query: string) => `No stations match ${query}`,
      emptyTitle: (query: string) => `No station matches “${query}”`,
      emptyBody: 'Check the spelling, or search by station code, for example S20.',
    },
    segments: {
      label: 'Line segments',
      items: [
        { segment: 1, title: 'PSR-A to KOMTAR', status: 'Under construction since January 2025' },
        {
          segment: 2,
          title: 'Macallum to Penang Sentral',
          status: 'Construction starts January 2027',
        },
      ],
    },
    list: {
      label: 'Stations in line order, from Penang Sentral to PSR-A',
      /** Accessible name of each row link, e.g. "S20 KOMTAR". */
      rowLabel: (code: string, name: string) => `${code} ${name}`,
    },
    aside: {
      following: {
        title: 'Stations you follow',
        /** e.g. "S20 KOMTAR and S13 Jalan Universiti. We email you about closures and works near them." */
        body: (stations: readonly string[]) =>
          `${listOf(stations)}. We email you about closures and works near ${stations.length === 1 ? 'it' : 'them'}.`,
        action: 'Manage in your profile',
      },
      none: {
        title: 'Follow a station',
        body: 'Open a station and choose Follow station. We email you about closures and works near it.',
      },
      signedOut: {
        title: 'Get alerts for your stations',
        body: 'Log in to follow stations and get emails about closures and works near them.',
        action: 'Log in to follow stations',
      },
    },
    related: [
      relatedPage.about,
      relatedPage.routeView,
      {
        ...relatedPage.construction,
        description: 'Milestones and site updates for the whole line.',
      },
    ],
  },

  station: {
    meta: {
      title: (name: string, code: string) => `${name} station (${code})`,
      description: (name: string, code: string) =>
        `Road changes, construction progress and reports near ${name} station (${code}) on the LRT Mutiara Line.`,
    },
    header: {
      codeLabel: (code: string) => `Station code ${code}`,
    },
    actions: {
      follow: 'Follow station',
      /** The pressed state uses uiCopy.station.following. */
      /** Live region after a change. */
      followed: (name: string) => `You are now following ${name}.`,
      unfollowed: (name: string) => `You no longer follow ${name}.`,
      report: 'Report an issue here',
    },
    /** Tag beside the lede: works are on site, or not started yet (Segment 2 until January 2027). */
    statusTag: {
      notStarted: 'Works not started',
    },
    stats: {
      label: 'Station figures',
      progress: 'Construction progress',
      progressValue: (percent: number) => `${percent}%`,
      progressNotStarted: 'Not started',
      traffic: 'Active traffic changes',
      reports: 'Reports nearby',
      /** e.g. "To S19 Macallum". */
      nextStation: (code: string, name: string) => `To ${code} ${name}`,
      distanceUnknown: 'Not published',
    },
    traffic: {
      title: 'Traffic around this station',
      lede: (name: string) => `Closures, lane changes and detours within 1 km of ${name}.`,
      empty: {
        title: (name: string) => `No road changes within 1 km of ${name} right now`,
        body: 'New closures are posted here at least a week before they start. Check the traffic map for works further along the line.',
      },
      links: {
        announcements: 'All announcements',
        map: 'Open the traffic map',
      },
    },
    construction: {
      title: 'Construction progress',
      lede: 'Work at the station site and the viaduct leading into it.',
      /** Follows the big percentage, e.g. "38% complete. Current stage: piers and crossheads." */
      summary: (stage: string) => `complete. Current stage: ${stage.toLowerCase()}.`,
      barLabel: (name: string) => `${name} station construction progress`,
      updatedBy: (date: string) => `Last updated ${date} by the project team`,
      notStarted: {
        title: 'Construction starts in January 2027',
        body: 'This station is on the Macallum to Penang Sentral segment. We will post progress here once work begins.',
      },
      stagesLabel: 'Build stages',
      siteUpdates: {
        title: 'Latest site updates',
        empty:
          'No updates from this station site yet. Line-wide news is on the Construction progress page.',
      },
      link: 'Progress along the whole line',
    },
    worksites: {
      title: 'Worksites and detours',
      lede: 'The fenced worksite, lane changes and detours around the station.',
      ledeNotStarted: 'There is no worksite here yet. The map shows the station location.',
      mapLabel: (name: string) => `Map of the area around ${name} station`,
      link: 'Open full traffic map',
    },
    reports: {
      title: 'Reports near this station',
      lede: 'Issues other commuters have reported within 500 m. Names and contact details are never shown.',
      reported: (date: string) => `Reported ${date}`,
      resolved: (date: string) => `Resolved ${date}`,
      empty: {
        title: (name: string) => `No reports within 500 m of ${name}`,
        body: 'If you see a problem at the worksite, send a report and we will pass it to the project team.',
      },
      cta: {
        title: (name: string) => `Something wrong near ${name}?`,
        body: 'Send a report and follow it with a ticket number.',
        action: 'Report an issue',
      },
    },
    glance: {
      title: 'Station at a glance',
      labels: {
        code: 'Code',
        line: 'Line',
        type: 'Type',
        segment: 'Segment',
        connectsTo: 'Connects to',
        interchange: 'Interchange',
        nearby: 'Nearby',
      },
      /** e.g. "1, PSR-A to KOMTAR". */
      segmentValue: (segment: number, name: string) => `${segment}, ${name}`,
      /** e.g. "S19 Macallum, 0.79 km", or "S18 Bandar Sri Pinang" when no distance is published. */
      connection: (code: string, name: string, distance: string | null) =>
        distance ? `${code} ${name}, ${distance}` : `${code} ${name}`,
      noInterchange: 'None',
    },
    alerts: {
      following: {
        title: (name: string) => `You’re following ${name}`,
        body: 'We email you about closures, night works and milestones near this station.',
        link: 'Manage alerts in your profile',
      },
      notFollowing: {
        title: (name: string) => `Get alerts for ${name}`,
        body: 'Follow this station and we email you about closures, night works and milestones near it.',
      },
      signedOut: {
        title: (name: string) => `Get alerts for ${name}`,
        body: 'Log in to follow this station and get emails about closures, night works and milestones near it.',
        action: 'Log in to follow',
      },
    },
    help: {
      title: 'Urgent problem at the worksite?',
      body: '24 hours. If anyone is in danger, call 999.',
    },
  },

  construction: {
    meta: {
      title: 'Construction progress',
      description:
        'Site updates, photos and milestones from the LRT Mutiara Line project team, from KOMTAR to Penang South.',
    },
    header: {
      title: 'Construction progress',
      lede: 'The LRT Mutiara Line is Penang’s first LRT line, linking communities from KOMTAR to Penang South. It will make travel faster, greener and easier for everyone. Follow the work here, stretch by stretch.',
      updatedAt: '2026-10-22',
    },
    sectionBarCurrent: 'Construction progress',
    toc: {
      timeline: 'Project timeline',
      updates: 'Site updates',
      /** e.g. "22 Oct: Pier caps completed". */
      update: (shortDate: string, label: string) => `${shortDate}: ${label}`,
    },
    timeline: {
      title: 'Project timeline',
      label: 'Project milestones, 2024 to 2031',
      today: 'Today',
      /** Screen-reader text for the marker. */
      todaySr: (date: string) => `Today, ${date}`,
    },
    updates: {
      title: 'Site updates',
      filtersLabel: 'Filter by type of work',
      areaLabel: 'Area',
      postedBy: 'Posted by the project team',
      photoAlt: (index: number, total: number, title: string) =>
        `Photo ${index} of ${total}: ${title}`,
      count: (shown: number, total: number) => `Showing ${shown} of ${total} updates`,
      allLoaded: 'You have reached the oldest update.',
      empty: {
        title: 'No updates match these filters',
        body: 'Choose another type of work or area to see more site updates.',
        action: 'Show all updates',
      },
      note: {
        body: 'Works affecting your road? Closures and detours linked to these works are on the traffic map.',
        link: 'Open the traffic map',
      },
    },
    related: [relatedPage.about, relatedPage.announcements, relatedPage.faq],
  },

  faq: {
    meta: {
      title: 'Frequently asked questions',
      description:
        'Answers from MRT Corp about the LRT Mutiara Line works, road changes, the project and land acquisition.',
    },
    header: {
      title: 'Frequently asked questions',
      titleShort: 'FAQ',
      lede: 'Answers from MRT Corp about the works, road changes, the project and land acquisition.',
    },
    sectionBarCurrent: 'FAQ',
    toc: {
      topics: 'Browse by topic',
      mostAsked: 'Most asked this month',
    },
    search: {
      label: 'Search questions',
      placeholder: 'Search a question, for example “night works” or “compensation”',
      popularLabel: 'Popular:',
      /** Popular search chips, in Figma order. Each one fills the search box. */
      popular: [
        'construction hours',
        'road closures',
        'night works',
        'property damage',
        'opening date',
      ],
      results: (count: number, query: string) =>
        count === 1 ? `1 question about “${query}”` : `${count} questions about “${query}”`,
      empty: {
        title: (query: string) => `No questions match “${query}”`,
        body: 'Try a shorter word, such as “noise” or “detour”. If you still can’t find an answer, send us your question.',
        action: 'Ask a question',
      },
    },
    topics: {
      title: 'Browse by topic',
      audienceLabel: 'Show topics for',
      audiences: {
        everyone: 'Everyone',
        travel: 'I travel through the area',
        'live-work': 'I live or work near the works',
        land: 'My land is affected',
      },
      count: (count: number) => (count === 1 ? '1 question' : `${count} questions`),
      /** Heading when one topic is open. */
      showingTopic: (topic: string) => `Questions about ${topic.toLowerCase()}`,
      backToAll: 'Back to all topics',
    },
    view: {
      results: (query: string) => `Results for “${query}”`,
      showMostAsked: 'Show most asked questions',
      /** Completes "Show all 22 …". */
      nouns: 'questions',
      topicEmpty: 'No questions in this topic yet.',
      status: {
        mostAsked: (count: number) => `Showing ${count} most asked questions`,
        all: (count: number) => `Showing all ${count} questions`,
        topic: (count: number, topic: string) =>
          `Showing ${count} questions about ${topic.toLowerCase()}`,
        matches: (count: number, query: string) =>
          count === 1 ? `1 question matches “${query}”` : `${count} questions match “${query}”`,
        none: (query: string) => `No questions match “${query}”`,
        topics: (count: number) => `Showing ${count} topics`,
      },
    },
    mostAsked: {
      title: 'Most asked this month',
      showFewer: 'Show fewer questions',
      allTitle: 'All questions',
    },
    item: {
      nextSteps: 'What to do next',
      feedback: {
        /** Yes and No use uiCopy.docsPage.feedback. */
        question: 'Was this helpful?',
        reasonsLabel: 'If no, tell us why:',
        reasons: ['Hard to find', 'Answer unclear', 'Out of date'],
        thanks: 'Thanks for telling us.',
        thanksReason: 'Thanks. We will use this to improve the answer.',
      },
    },
    stillNeedHelp: {
      title: 'Still need help?',
      /** Buttons use uiCopy.docsPage.needHelp.report and .track. */
      body: 'Send a report or question to the authority. You get a ticket ID to follow up.',
      /** e.g. "MRTCareline 1800-88-6782, 24 hours". */
      careline: (label: string, number: string) => `${label} ${number}, 24 hours`,
    },
    related: [relatedPage.about, relatedPage.construction, relatedPage.trafficMap],
  },
} as const;
