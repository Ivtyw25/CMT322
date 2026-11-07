/**
 * Copy for Report & Track: overview (/report-track), report form (/report),
 * report submitted (/report/submitted/[ticketId]) and track a ticket (/track, /track/[ticketId]).
 * Shared words (statuses, report types, form errors, upload errors) come from ui.ts.
 * Category options and tickets are records in the mock data, not copy.
 */

/** Used on all four pages: the sidebar "Need help?" and the emergency notice. */
const shared = {
  needHelp: {
    title: 'Need help?',
  },
  emergency: {
    title: 'Emergency or immediate danger?',
    body: 'Call 999. This form is not monitored around the clock.',
    /** Banner version for the overview page. */
    bodyShort:
      'Emergency or immediate danger? Call 999. Reports are not monitored around the clock.',
  },
  breadcrumb: {
    section: 'Report & Track',
    report: 'Report an issue',
    track: 'Track a ticket',
    submitted: 'Submitted',
  },
} as const;

const overview = {
  meta: {
    title: 'Report & Track',
    description:
      'Report a construction problem near you and follow it until it is resolved. Check any ticket with its ticket ID.',
  },
  header: {
    title: 'Report & Track',
    lede: 'Tell the authority about construction problems near you, then follow your report until it is resolved.',
    /** Shown to guests only, after the lede. */
    ledeGuest:
      'Log in or create an account to report an issue. You do not need an account to track a ticket.',
    ledeShort: 'Report a construction problem near you, then follow it until it is resolved.',
  },
  pages: {
    title: 'Pages in this section',
    cards: [
      {
        id: 'report',
        title: 'Report an issue',
        body: 'Send a complaint, feedback or a general inquiry, with photos and the exact location.',
        points: ['Complaint', 'Feedback', 'General inquiry'],
      },
      {
        id: 'track',
        title: 'Track a ticket',
        body: 'Check the status of your report with the ticket ID from your email.',
        points: ['Status updates', 'Replies from the authority', 'Resolution details'],
      },
    ],
  },
  howItWorks: {
    title: 'How it works',
    steps: [
      {
        title: 'Log in and submit',
        body: 'Describe the problem, add photos and pin the location.',
      },
      { title: 'Get your ticket ID', body: 'It appears on screen and arrives in your email.' },
      {
        title: 'The authority reviews it',
        body: 'The status moves from Pending review to In progress.',
      },
      { title: 'See the outcome', body: 'Resolution details appear when you track the ticket.' },
    ],
  },
  emergency: shared.emergency.bodyShort,
  faq: {
    title: 'Popular questions',
    seeAll: 'See all FAQs',
    items: [
      {
        faqId: 'missing-detour-sign',
        question: 'Who handles my report after I submit it?',
        answer:
          'The authority reviews it first, then passes it to the project developer’s site team if the works caused the problem. Replies appear on your ticket.',
      },
      {
        faqId: 'property-damage',
        question: 'How do I check the status of my report?',
        answer:
          'Open Track a ticket and enter your ticket ID. It starts with MLC and is in your confirmation email.',
      },
      {
        faqId: 'noise-dust',
        question: 'Do I need an account to report an issue?',
        answer:
          'Yes. A free account lets us send you updates by email. You can track a ticket without an account.',
      },
    ],
  },
  onThisPage: {
    pages: 'Pages in this section',
    howItWorks: 'How it works',
    faq: 'Popular questions',
  },
  sidebar: shared.needHelp,
} as const;

const report = {
  meta: {
    title: 'Report an issue',
    description:
      'Tell us about a construction problem, complaint or question. You get a ticket ID you can use to track it.',
  },
  header: {
    title: 'Report an issue',
    lede: 'Tell us about a construction problem, complaint or question. It takes about 3 minutes.',
  },
  onThisPage: {
    type: 'What are you reporting?',
    details: 'Details',
    location: 'Location',
    files: 'Photos and files',
    contact: 'Your contact details',
  },
  /** Radio cards. Figma shows Complaint, Feedback and General inquiry. VERIFY R1. */
  type: {
    legend: 'What are you reporting?',
    options: [
      { id: 'complaint', label: 'Complaint', hint: 'A problem caused by the works' },
      { id: 'feedback', label: 'Feedback', hint: 'A suggestion or comment' },
      { id: 'inquiry', label: 'General inquiry', hint: 'A question for the team' },
    ],
  },
  category: {
    label: 'Category',
    placeholder: 'Select a category',
    error: 'Select a category',
  },
  details: {
    title: 'Details',
    subject: {
      label: 'Subject',
      placeholder: 'Sum up the problem in a few words',
      hint: 'For example: Driveway blocked by site hoarding.',
      errorEmpty: 'Enter a subject',
      errorShort: 'Use at least 5 characters for the subject',
      min: 5,
      errorLong: 'Use 100 characters or fewer for the subject',
      max: 100,
    },
    description: {
      label: 'Description',
      placeholder: 'What happened, where, and since when?',
      hint: 'Say what you saw, when it started and who it affects. Do not include passwords or bank details.',
      errorEmpty: 'Enter a description',
      errorShort: 'Use at least 20 characters so the team understands the problem',
      errorLong: 'Use 1000 characters or fewer for the description',
      min: 20,
      max: 1000,
      counter: (used: number, max: number) => `${used} of ${max} characters`,
      charactersLeft: (left: number) => `${left} characters left`,
      limitReached: 'Character limit reached',
      /** The count starts to warn at this many characters. */
      warnFrom: 900,
    },
  },
  draft: {
    restored: (time: string) => `We restored your draft from ${time}.`,
    photosNote: 'Photos are not saved in a draft. Add them again if you need them.',
    startOver: 'Start over',
    saved: 'Draft saved in this browser',
  },
  location: {
    title: 'Location',
    lede: 'Pin the exact spot so the site team can find it.',
    address: {
      label: 'Address or landmark',
      placeholder: 'Road name, building or landmark',
      errorEmpty: 'Enter an address or landmark, or pin the spot on the map',
    },
    map: {
      label: 'Map. Select a point to pin the location.',
      useMyLocation: 'Use my current location',
      locating: 'Finding your location…',
      pinned: (lat: string, lng: string) => `Pinned at ${lat}, ${lng}`,
      errorDenied:
        'We could not get your location. Allow location access in your browser, or type the address.',
      errorUnavailable: 'Location is not available on this device. Type the address instead.',
      attribution: '© OpenStreetMap contributors',
      dropPin: 'Drop a pin at the map centre',
      pinLabel: (lat: string, lng: string) =>
        `Report location pin, ${lat}, ${lng}. Use the arrow keys to move it.`,
      pinSetNear: (station: string) => `Pin set near ${station}`,
      pinSetCurrent: 'Pin set to your current location',
      addressNear: (station: string) => `Near ${station}`,
      addressAtStation: (station: string) => `${station} station`,
      stationChip: (code: string, station: string) => `Near ${code} ${station} station`,
      removeStation: 'Remove station',
    },
  },
  files: {
    title: 'Photos and files',
    lede: 'Photos help the team understand the problem faster.',
    maxFiles: 5,
    maxMb: 10,
    waitUploading: 'Wait for your photos to finish uploading.',
  },
  contact: {
    title: 'Your contact details',
    lede: 'Filled in from your account. We send your ticket ID and status updates to this email.',
    fullName: { label: 'Full name', errorEmpty: 'Enter your full name' },
    phone: {
      label: 'Phone number',
      placeholder: '012-345 6789',
      hint: 'The site team may call you if they need more detail.',
      error: 'Enter a Malaysian phone number, like 012-345 6789',
    },
    email: {
      label: 'Email address',
      errorEmpty: 'Enter your email address',
      errorInvalid: 'Enter an email address in the correct format, like name@example.com',
    },
  },
  consent: {
    label:
      'I agree that the details in this report can be shared with the project developer and the authority handling it.',
    error: 'Tick the box to confirm before you send your report',
  },
  actions: {
    submit: 'Submit report',
    submitting: 'Sending report…',
    sending: 'Sending your report',
    cancel: 'Cancel',
  },
  errorSummary: {
    title: 'There is a problem',
    intro: 'Fix these before you send your report:',
  },
  errors: {
    submitFailedTitle: 'We could not send your report',
    submitFailed: 'Your answers are still here. Check your connection and try again.',
  },
  /** Right sidebar. */
  next: {
    title: 'What happens next',
    steps: [
      { title: 'You get a ticket ID', body: 'Shown on screen and emailed to you.' },
      { title: 'The authority reviews it', body: 'Pending, then In progress.' },
      { title: 'You see the outcome', body: 'Resolution details when you track it.' },
    ],
  },
  emergency: shared.emergency,
  /** Guests are asked to log in first. */
  loginRequired: {
    title: 'Log in to report an issue',
    body: 'You need a free account so we can email you your ticket ID and updates. Guests can still track a ticket.',
    login: 'Log in',
    signup: 'Create an account',
    track: 'Track a ticket',
  },
  cancelConfirm: {
    title: 'Leave this report?',
    body: 'Your answers and files will not be saved.',
    leave: 'Leave and discard',
    stay: 'Keep writing',
  },
} as const;

const submitted = {
  meta: {
    title: 'Report submitted',
    description: 'Your report has been received. Keep your ticket ID to track it.',
  },
  header: {
    title: 'Report submitted',
    lede: (name: string, email: string) =>
      `Thank you, ${name}. We’ve emailed a confirmation with your ticket ID to ${email}.`,
    ledeGuest: 'Thank you. We’ve emailed a confirmation with your ticket ID.',
  },
  onThisPage: {
    ticket: 'Your ticket ID',
    next: 'What happens next',
    sent: 'What you sent',
    email: 'Confirmation email',
  },
  ticket: {
    label: 'Your ticket ID',
    hint: 'Keep this ID. You need it to check the status of your report.',
    copy: 'Copy ID',
    copied: 'Copied',
    copyFailed: 'Could not copy. The ticket ID is selected: press Ctrl+C or copy it from the menu.',
    copyFailedTouch: 'Could not copy. The ticket ID is selected: touch and hold to copy it.',
    copiedAnnounce: 'Ticket ID copied',
    arrived: (spokenId: string) => `Report submitted. Your ticket ID is ${spokenId}.`,
  },
  next: {
    title: 'What happens next',
    steps: {
      submitted: { title: 'Submitted' },
      pending: { title: 'Pending review', detail: 'Usually within 1 working day' },
      'in-progress': { title: 'In progress', detail: 'The authority works on it' },
      resolved: { title: 'Resolved', detail: 'You see the outcome' },
    },
  },
  sent: {
    title: 'What you sent',
    rows: {
      type: 'Type',
      category: 'Category',
      subject: 'Subject',
      location: 'Location',
      attachments: 'Attachments',
      submitted: 'Submitted',
    },
    attachments: (count: number) =>
      count === 0 ? 'None' : count === 1 ? '1 photo' : `${count} photos`,
  },
  email: {
    title: 'Confirmation email',
    sentTo: (email: string, time: string) => `Sent to ${email} at ${time}`,
    subject: (id: string) => `We received your report ${id}`,
    body: (name: string, title: string) =>
      `Hello ${name}, your report “${title}” has been received and is waiting for review. Track it any time at mutiaraconnect.my/track using your ticket ID.`,
  },
  actions: {
    track: 'Track this ticket',
    another: 'Report another issue',
    home: 'Back to home',
  },
  sidebar: shared.needHelp,
  notFound: {
    title: 'We can’t find that report',
    body: 'This confirmation page has expired or the ticket ID is not right. Check your confirmation email, or search for the ticket.',
    action: 'Track a ticket',
  },
  loading: 'Loading your confirmation…',
  unavailable: {
    title: 'We can’t show this confirmation',
    body: 'Log in with the account that sent the report, or track a ticket with its ID.',
    heading: 'Report confirmation',
    login: 'Log in',
  },
} as const;

const track = {
  meta: {
    title: 'Track a ticket',
    description:
      'Enter your ticket ID to see the status of your report and replies from the authority.',
    titleTicket: (id: string) => `Ticket ${id}`,
  },
  header: {
    title: 'Track your ticket',
    lede: 'Enter the ticket ID from your confirmation email to see its status and replies from the authority.',
  },
  onThisPage: {
    status: 'Status',
    updates: 'Updates from the authority',
    report: 'Your report',
  },
  search: {
    formLabel: 'Find a ticket',
    label: 'Ticket ID',
    placeholder: 'MLC-261028-0482',
    hint: 'It starts with MLC and is in your confirmation email.',
    submit: 'Check status',
    searching: 'Checking…',
  },
  errors: {
    empty: 'Enter your ticket ID',
    invalid: 'Enter a ticket ID in the format MLC-261028-0482',
    notFound: (id: string) =>
      `We can’t find ticket ${id}. Check the ID in your confirmation email and try again.`,
    loadFailed: 'We could not load this ticket. Check your connection and try again.',
  },
  /** Shown on /track before anyone searches. */
  idle: {
    title: 'Where is your ticket ID?',
    body: 'We email it to you as soon as you send a report. It looks like MLC-261028-0482. Lost it? Log in and open My reports on your profile.',
    profile: 'Open My reports',
  },
  notFound: {
    title: 'No ticket found',
    body: 'We can’t find a ticket with that ID. Check for typing mistakes, or call MRTCareline 1800-88-6782.',
    action: 'Try another ticket ID',
  },
  loading: 'Looking up your ticket…',
  noscript:
    'Search needs JavaScript. Add the ticket ID to the address instead: /track/MLC-261028-0482.',
  announce: {
    found: (id: string, status: string) => `Ticket ${id}: ${status}`,
    missing: (id: string) => `No ticket found for ${id}`,
  },
  result: {
    privateTitle: 'Report details are private',
    privateBody: 'Log in with the account that sent this report to see what was sent.',
    login: 'Log in',
    attachmentAlt: (n: number, total: number) => `Attachment ${n} of ${total}`,
    earlier: (n: number) => (n === 1 ? 'Show 1 earlier update' : `Show ${n} earlier updates`),
    submittedOn: (date: string) => `Submitted ${date}`,
    status: { title: 'Status' },
    updates: {
      title: 'Updates from the authority',
      empty: 'No replies yet. We email you when the authority replies.',
    },
    report: {
      title: 'Your report',
      photoAlt: (n: number, total: number) => `Photo ${n} of ${total} from your report`,
      noPhotos: 'No photos were added.',
    },
    resolution: {
      title: 'Resolution details',
      pending: 'Shown here once the authority marks this ticket as resolved.',
      resolvedOn: (date: string) => `Resolved ${date}`,
    },
  },
  stepper: {
    notYet: 'Not yet',
  },
  sidebar: {
    title: 'Need help?',
    another: 'Report another issue',
  },
  actions: {
    reportAnother: 'Report another issue',
    searchAgain: 'Check another ticket',
  },
} as const;

export const reportTrackCopy = {
  shared,
  overview,
  report,
  submitted,
  track,
} as const;
