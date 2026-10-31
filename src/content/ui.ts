/**
 * Generic UI words and the labels for fixed record values (tags, statuses, stages, phases).
 * Shared by every page group. Page-specific copy lives in the page group's own file.
 */
export const uiCopy = {
  actions: {
    close: 'Close',
    cancel: 'Cancel',
    save: 'Save',
    saveChanges: 'Save changes',
    edit: 'Edit',
    change: 'Change',
    remove: 'Remove',
    search: 'Search',
    clearSearch: 'Clear search',
    viewOnMap: 'View on map',
    viewNotice: 'View notice',
    backToTop: 'Back to top',
    showMore: 'Show more',
    showLess: 'Show less',
    showAll: (count: number, noun: string) => `Show all ${count} ${noun}`,
    loadOlder: 'Load older updates',
    tryAgain: 'Try again',
  },

  breadcrumb: {
    home: 'Home',
  },

  /** Visually hidden after the text of every external link. */
  opensInNewTab: '(opens in new tab)',

  status: {
    loading: 'Loading…',
    saving: 'Saving…',
    sending: 'Sending…',
    saved: 'Saved',
  },

  pagination: {
    label: 'Pagination',
    previous: 'Previous page',
    next: 'Next page',
    page: (page: number) => `Page ${page}`,
    /** Between page numbers that are not next to each other. Not focusable. */
    ellipsis: '…',
    showing: (from: number, to: number, total: number, noun: string) =>
      `Showing ${from} to ${to} of ${total} ${noun}`,
  },

  tabs: {
    /** Read between a tab's name and its count: "Current, 3". */
    countSeparator: ', ',
  },

  empty: {
    title: 'Nothing to show yet',
    body: 'Check back later, or choose another filter.',
    noResults: (query: string) => `No results for "${query}"`,
    noResultsHint: 'Check the spelling, or search for a road, an area or a station name.',
    noMatches: 'Nothing matches these filters. Choose another area or time.',
  },

  form: {
    optional: '(optional)',
    requiredNote: 'All fields are required unless marked optional.',
    errorSummaryTitle: 'There is a problem',
    errors: {
      required: (field: string) => `Enter ${field}`,
      selectRequired: (field: string) => `Select ${field}`,
      consentRequired: 'Tick the box to confirm before you send your report',
      emailRequired: 'Enter your email address',
      emailInvalid: 'Enter an email address in the correct format, like name@example.com',
      ticketIdRequired: 'Enter your ticket ID',
      ticketIdInvalid: 'Enter a ticket ID in the format MLC-261028-0482',
      ticketNotFound: (id: string) =>
        `We can't find ticket ${id}. Check the ID in your confirmation email and try again.`,
      tooLong: (max: number) => `Use ${max} characters or fewer`,
      tooShort: (min: number) => `Use at least ${min} characters`,
    },
    characterCount: (count: number, max: number) => `${count} of ${max} characters`,
    password: {
      show: 'Show password',
      hide: 'Hide password',
    },
    search: {
      clear: 'Clear search',
    },
  },

  upload: {
    choose: 'Choose photos',
    dropHint: 'or drag them here',
    rules: (maxFiles: number, maxMb: number) =>
      `Up to ${maxFiles} photos, JPG or PNG, ${maxMb} MB each.`,
    progress: (fileName: string, percent: number) => `Uploading ${fileName}, ${percent}%`,
    done: (fileName: string) => `${fileName} uploaded`,
    remove: (fileName: string) => `Remove ${fileName}`,
    errors: {
      tooBig: (fileName: string, maxMb: number) =>
        `${fileName} is larger than ${maxMb} MB. Choose a smaller photo.`,
      wrongType: (fileName: string) => `${fileName} is not a JPG or PNG. Choose a photo file.`,
      tooMany: (maxFiles: number) =>
        `You can add up to ${maxFiles} photos. Remove one to add another.`,
      failed: (fileName: string) =>
        `${fileName} did not upload. Check your connection and try again.`,
    },
  },

  /** The nine Figma tags (Components 1:68–1:92). */
  tags: {
    closure: 'Closure',
    construction: 'Construction',
    hazard: 'Hazard',
    active: 'Active',
    upcoming: 'Upcoming',
    ended: 'Ended',
    pending: 'Pending',
    inProgress: 'In progress',
    resolved: 'Resolved',
  },

  /** Ticket status words outside the tags (stepper, update log). "Submitted" shows the Pending tag. */
  ticketStatus: {
    submitted: 'Submitted',
    pending: 'Pending review',
    'in-progress': 'In progress',
    resolved: 'Resolved',
    statusLine: (status: string) => `Status: ${status}`,
  },

  timeline: {
    past: 'Done',
    future: 'Planned',
  },

  stepper: {
    label: 'Ticket status',
    completed: 'Completed',
    current: 'Current step',
    notStarted: 'Not started',
    notYet: 'Not yet',
  },

  reportTypes: {
    complaint: 'Complaint',
    hazard: 'Hazard',
    suggestion: 'Suggestion',
    /** e.g. "Complaint, blocked access". */
    withCategory: (type: string, category: string) => `${type}, ${category}`,
  },

  stationStages: {
    'site-clearing': 'Site clearing and utility relocation',
    piling: 'Piling',
    piers: 'Piers and crossheads',
    structure: 'Station structure and platforms',
    systems: 'Track, systems and fit-out',
    testing: 'Testing and opening',
    completedIn: (month: string) => `Completed ${month}`,
    plannedFor: (when: string) => `Planned for ${when}`,
    target: (when: string) => `Target ${when}`,
    currentStage: (stage: string) => `Current stage: ${stage}`,
  },

  constructionPhases: {
    all: 'All updates',
    'utility-relocation': 'Utility relocation',
    piling: 'Piling',
    viaduct: 'Viaduct',
    stations: 'Stations',
  },

  filters: {
    allAreas: 'All areas',
    area: 'Area',
  },

  station: {
    elevated: 'Elevated station',
    provisionalName: 'Provisional name',
    following: 'Following',
    /** Visually hidden on the bell chip. */
    followingSr: 'You follow this station',
    distance: (km: number) => `${km} km`,
    /** Segment names as Figma writes them. */
    segments: {
      1: 'PSR-A to KOMTAR',
      2: 'Macallum to Penang Sentral',
    },
  },

  time: {
    today: 'Today',
    allDay: 'All day',
    /** e.g. "10 pm to 6 am" or "20 Oct to 30 Nov 2026". */
    range: (from: string, to: string) => `${from} to ${to}`,
    updatedOn: (date: string) => `Last updated ${date}`,
  },

  imagePlaceholder: 'Photo not yet available',

  /** Parts every docs-layout page shares (Project, Traffic, Report & Track groups). */
  docsPage: {
    needHelp: {
      title: 'Need help?',
      report: 'Report an issue',
      track: 'Track a ticket',
      /** e.g. "MRTCareline 1800-88-6782". Values come from getSiteInfo(). */
      careline: (label: string, number: string) => `${label} ${number}`,
    },
    feedback: {
      question: 'Was this page helpful?',
      yes: 'Yes',
      no: 'No',
      thanks: 'Thanks for your feedback.',
      reasonsLabel: 'If no, tell us why:',
      reasons: ['Hard to find', 'Answer unclear', 'Out of date'],
      thanksReason: "Thanks. We'll use this to improve the page.",
    },
    relatedPages: 'Related pages',
  },

  map: {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out',
    attribution: '© OpenStreetMap contributors',
    attributionHref: 'https://www.openstreetmap.org/copyright',
    loading: 'Loading the map',
    unavailable: "The map couldn't load.",
  },
} as const;
