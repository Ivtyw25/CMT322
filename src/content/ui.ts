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

  empty: {
    title: 'Nothing to show yet',
    body: 'Check back later, or choose another filter.',
    noResults: (query: string) => `No results for "${query}"`,
    noResultsHint: 'Check the spelling, or search for a road, an area or a station name.',
    noMatches: 'Nothing matches these filters. Choose another area or time.',
  },

  form: {
    optional: '(optional)',
    required: '(required)',
    requiredMark: '*',
    requiredLegend: 'Fields marked * are required',
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
      capsLock: 'Caps Lock is on',
      show: 'Show password',
      hide: 'Hide password',
    },
    search: {
      clear: 'Clear search',
    },
  },

  upload: {
    dropPrefix: 'Drag files here or',
    browse: 'browse',
    dropActive: 'Drop files to add them',
    maxReached: (maxFiles: number) => `Maximum ${maxFiles} files added. Remove one to add another.`,
    rules: (maxFiles: number, maxMb: number) =>
      `JPG, PNG or PDF, up to ${maxMb} MB each, maximum ${maxFiles} files`,
    progress: (fileName: string, percent: number) => `Uploading ${fileName}, ${percent}%`,
    uploaded: (size: string) => `${size}, uploaded`,
    removed: (fileName: string) => `${fileName} removed`,
    remove: (fileName: string) => `Remove ${fileName}`,
    errors: {
      tooBig: (fileName: string, maxMb: number) =>
        `${fileName} is larger than ${maxMb} MB. Choose a smaller file.`,
      wrongType: (fileName: string) => `${fileName} is not a JPG, PNG or PDF.`,
      tooMany: (maxFiles: number) =>
        `You can add up to ${maxFiles} files. Remove one to add another.`,
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
    submitted: 'Submitted',
    /** Staff portal (Figma 113:4668, 115:4681). */
    overdue: 'Overdue',
    highPriority: 'High priority',
    normal: 'Normal',
    scheduled: 'Scheduled',
    draft: 'Draft',
    published: 'Published',
  },

  /** Ticket status words outside the tags (stepper, update log). */
  ticketStatus: {
    submitted: 'Submitted',
    pending: 'Pending',
    'in-progress': 'In progress',
    resolved: 'Resolved',
  },

  /** The conversation on a ticket, shown on Track and in the staff portal. */
  ticketThread: {
    label: 'Conversation',
    submittedBy: (name: string) => `Submitted by ${name}`,
    repliedBy: (name: string, organisation: string) => `${name}, ${organisation}`,
    statusSet: (status: string) => `Status set to ${status}`,
    claimed: (name: string) => `${name} is handling this ticket. Status set to Pending.`,
    priorityChanged: (name: string, priority: string) => `${name} set the priority to ${priority}`,
    attachments: 'Attachments',
    photoAlt: (fileName: string) => `Photo: ${fileName}`,
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
    inquiry: 'General inquiry',
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
