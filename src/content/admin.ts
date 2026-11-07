/**
 * Staff portal copy (admin-1: log in, dashboard, tickets). Words come from Figma frames
 * 113:4621, 113:4668, 116:4824, 115:4681 and 115:5036; where Figma shows no words, the plain
 * wording here is the only invention.
 */
export const adminCopy = {
  meta: {
    login: {
      title: 'Staff log in',
      description: 'Log in to the Mutiara Line staff portal.',
    },
    dashboard: {
      title: 'Dashboard',
      description: 'What needs attention in the Mutiara Line staff portal.',
    },
    tickets: {
      title: 'Tickets',
      description: 'Every report, complaint and question sent from the public site.',
    },
    announcements: {
      title: 'Traffic announcements',
      description: 'Closures and diversions shown on the public site.',
    },
    announcementEditor: {
      title: 'Announcement',
      description: 'Write, schedule and publish a traffic announcement.',
    },
    mapItems: {
      title: 'Map items',
      description: 'Closures, worksites and hazards on the public traffic map.',
    },
    progress: {
      title: 'Progress updates',
      description: 'Photos and notes shown on Construction progress and station pages.',
    },
    progressEditor: {
      title: 'Progress update',
      description: 'Write, schedule and publish a progress update.',
    },
    ticket: (ticketId: string) => ({
      title: `Ticket ${ticketId}`,
      description: `Review, assign and reply to ticket ${ticketId}.`,
    }),
  },

  roles: {
    authority: 'Government authority',
    developer: 'Project developer',
  },

  login: {
    title: 'Staff portal',
    intro: 'For the project team and the government authority handling the Mutiara Line.',
    emailLabel: 'Work email',
    passwordLabel: 'Password',
    /** The prototype accepts any password; this fills the field as the design shows it. */
    prototypePassword: 'mutiara-line',
    submit: 'Log in',
    submitting: 'Logging in',
    codeNote: 'Next, enter the 6-digit code from your authenticator app.',
    rolesTitle: 'What you can manage depends on your role',
    roleList: [
      {
        role: 'authority',
        title: 'Government authority',
        summary: 'Review, assign and reply to tickets from the public',
      },
      {
        role: 'developer',
        title: 'Project developer',
        summary: 'Announcements, map items and progress updates',
      },
    ],
    prototypeDeveloper: 'Prototype only: continue as project developer',
    publicOnly:
      'Commuters and residents use the public site. This portal is for authorised staff only.',
    errors: {
      emailRequired: 'Enter your work email.',
      passwordRequired: 'Enter your password.',
      invalid: 'The email or password is not right. Check them and try again.',
    },
  },

  shell: {
    portalName: 'Staff portal',
    brandLabel: 'Mutiara Line, staff portal home',
    navLabel: 'Staff portal',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    menuTitle: 'Staff portal menu',
    logOut: 'Log out',
    loggedOut: 'You are logged out.',
    checking: 'Checking your staff session',
    publicSite: 'View public site',
    opensInNewTab: 'opens in new tab',
    notifications: 'Notifications',
    skipToContent: 'Skip to main content',
    search: {
      authority: {
        label: 'Search tickets',
        placeholder: 'Search tickets by ID, subject or road',
      },
      developer: {
        label: 'Search announcements, map items and updates',
        placeholder: 'Search announcements, map items or updates',
      },
      submit: 'Search',
    },
    notificationPanel: {
      authority: (waiting: number) =>
        waiting === 0
          ? 'No tickets are waiting for a first reply.'
          : waiting === 1
            ? '1 ticket is waiting for a first reply.'
            : `${waiting} tickets are waiting for a first reply.`,
      developer: (count: number) =>
        count === 1 ? '1 item needs your attention.' : `${count} items need your attention.`,
      authorityAction: 'Open pending tickets',
      developerAction: 'Open the dashboard',
    },
  },

  nav: {
    groups: {
      overview: 'Overview',
      feedback: 'Feedback',
      traffic: 'Traffic',
      project: 'Project',
    },
    items: {
      dashboard: 'Dashboard',
      tickets: 'Tickets',
      announcements: 'Announcements',
      mapItems: 'Map items',
      progress: 'Progress updates',
    },
    pendingBadge: (count: number) => `${count} pending`,
  },

  page: {
    updated: (when: string) => `Updated ${when}.`,
  },

  dashboard: {
    title: 'Dashboard',
    authority: {
      intro: 'Feedback from commuters, residents and businesses near the works.',
      openQueue: 'Open ticket queue',
      stats: {
        newToday: { label: 'New today', hint: (n: number) => `${n} more than yesterday` },
        waiting: {
          label: 'Waiting for a first reply',
          hint: (n: number) => `${n} past the 2-day target`,
        },
        inProgress: { label: 'In progress', hint: 'Assigned to a team' },
        resolved: {
          label: 'Resolved this month',
          hint: (days: number) => `Average ${days} days to resolve`,
        },
      },
      needsReply: {
        title: 'Needs a reply',
        hint: 'Oldest first. The target is a first reply within 2 working days.',
        viewAll: 'View all pending tickets',
        tableLabel: 'Tickets that need a reply',
        columns: { ticket: 'Ticket', subject: 'Subject', area: 'Area', waiting: 'Waiting' },
        empty: 'Every ticket has had a first reply.',
        areaLabel: 'Area',
        waitingLabel: 'Waiting',
      },
      byArea: {
        title: 'Open tickets by area',
        row: (area: string, count: number) => `${area}: ${count} open tickets`,
      },
      byType: {
        title: 'Tickets this month by type',
        share: (type: string, count: number) => `${type}: ${count} tickets`,
      },
      activity: { title: 'Recent activity' },
    },
    developer: {
      intro: 'What the public currently sees about the works.',
      newAnnouncement: 'New announcement',
      stats: {
        active: {
          label: 'Active announcements',
          hint: (n: number) => `${n} ends within 7 days`,
        },
        scheduled: { label: 'Scheduled', hint: (when: string) => `Next starts ${when}` },
        mapItems: {
          label: 'Live map items',
          hint: (closures: number, worksites: number, hazards: number) =>
            `${closures} closures, ${worksites} worksites, ${hazards} hazards`,
        },
        progress: { label: 'Last progress update' },
      },
      attention: {
        title: 'Needs your attention',
        hint: 'Check these before they go out of date on the public site.',
        empty: 'Nothing needs your attention right now.',
      },
      quickActions: {
        title: 'Quick actions',
        announcement: 'Publish a traffic announcement',
        mapItem: 'Add a closure or hazard to the map',
        progress: 'Post a progress update',
      },
      assigned: {
        title: 'Tickets assigned to your team',
        hint: 'The authority assigns these to you. Add a site note so they can reply to the reporter.',
        empty: 'No tickets are assigned to your team.',
      },
    },
  },

  tickets: {
    title: 'Tickets',
    intro: 'Every report, complaint and question sent from the public site.',
    exportCsv: 'Export CSV',
    csvName: 'mutiara-line-tickets.csv',
    csvColumns: [
      'Ticket',
      'Subject',
      'Type',
      'Area',
      'Submitted',
      'Assigned to',
      'Priority',
      'Status',
    ],
    tabsLabel: 'Ticket status',
    tabs: { all: 'All', pending: 'Pending', 'in-progress': 'In progress', resolved: 'Resolved' },
    toolbarLabel: 'Filter tickets',
    searchLabel: 'Search tickets',
    searchPlaceholder: 'Ticket ID, subject or road',
    clearSearch: 'Clear search',
    filter: (name: string, value: string) => `${name}: ${value}`,
    filters: {
      type: { name: 'Type', all: 'All' },
      area: { name: 'Area', all: 'All' },
      assignee: { name: 'Assigned to', all: 'Anyone', none: 'Unassigned' },
      range: {
        name: 'Submitted',
        options: { '7': 'Last 7 days', '30': 'Last 30 days', all: 'All time' },
      },
      sort: {
        name: 'Sort',
        options: { newest: 'Newest first', oldest: 'Oldest first' },
      },
    },
    types: { complaint: 'Complaint', feedback: 'Feedback', inquiry: 'General inquiry' },
    table: {
      label: 'Tickets',
      selectAll: 'Select all tickets on this page',
      selectRow: (ticketId: string) => `Select ${ticketId}`,
      columns: {
        ticket: 'Ticket',
        subject: 'Subject',
        area: 'Area',
        submitted: 'Submitted',
        assigned: 'Assigned to',
        priority: 'Priority',
        status: 'Status',
      },
      unassigned: 'Unassigned',
      selected: (count: number) =>
        count === 1 ? '1 ticket selected' : `${count} tickets selected`,
    },
    showing: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} tickets`,
    paginationLabel: 'Ticket pages',
    empty: {
      title: 'No tickets match these filters',
      body: 'Change the filters or search for a different ticket ID, subject or road.',
      clear: 'Clear filters',
    },
    forbidden: 'The ticket queue is for the government authority. Opening the dashboard.',
  },

  ticket: {
    back: 'All tickets',
    backToDashboard: 'Dashboard',
    categoryLine: (type: string, category: string) => `${type}, ${category}`,
    notFound: {
      title: 'Ticket not found',
      body: 'No ticket has this ID. Check the ID or go back to the queue.',
    },
    report: {
      title: 'Report',
      attachments: 'Attachments',
      mapLabel: (location: string) => `Map of ${location}`,
      coordinates: (lat: number, lng: number) => `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      noPhotos: 'The reporter did not attach any photos.',
    },
    timeline: {
      title: 'Timeline',
      resolvedStep: 'Resolved',
      waiting: 'Waiting',
      done: 'Done',
      current: 'Latest',
    },
    notes: {
      title: 'Internal notes',
      staffOnly: 'Staff only, never shown to the reporter',
      label: 'Note for staff',
      placeholder: 'Add a note for staff…',
      add: 'Add note',
      empty: 'No internal notes yet.',
      byline: (author: string) => author,
      added: 'Internal note added.',
    },
    update: {
      title: 'Update ticket',
      status: 'Status',
      statusOptions: { pending: 'Pending', 'in-progress': 'In progress', resolved: 'Resolved' },
      assignee: 'Assigned to',
      unassigned: 'Unassigned',
      priority: 'Priority',
      priorityOptions: { normal: 'Normal', high: 'High' },
      reply: 'Reply to the reporter',
      template: 'Reply template',
      noTemplate: 'Write your own',
      templateOption: (label: string) => `Template: ${label}`,
      replyLabel: 'Reply message',
      replyPlaceholder: 'Write a reply to the reporter…',
      replyMax: 1000,
      email: {
        label: 'Email the reporter',
        hint: 'An automated email goes to the reporter with this reply and the new status.',
        hintNoEmail: 'This reporter did not share an email address, so no email is sent.',
      },
      save: 'Save and notify reporter',
      saveOnly: 'Save changes',
      saved: 'Ticket updated.',
      savedAndEmailed: 'Ticket updated. The reporter will get an email.',
      nothingChanged: 'Change the status, assignee, priority or reply to save.',
      readOnlyTitle: 'Site note',
      readOnlyHint:
        'The authority changes the status and replies to the reporter. Add a site note so they know what is happening on site.',
    },
    siteNote: {
      label: 'Site note',
      placeholder: 'Write what is happening on site…',
      add: 'Add site note',
      added: 'Site note added to the timeline.',
    },
    reporter: {
      title: 'Reporter',
      visibility: 'Contact details are only visible to staff handling this ticket.',
      none: 'The reporter did not share contact details.',
    },
    events: {
      assigned: (team: string, by: string) => `Assigned to ${team} by ${by}`,
      unassigned: (by: string) => `Unassigned by ${by}`,
      status: (status: string) => `Status changed to ${status}`,
      statusWithReply: (status: string, reply: string) =>
        `Status changed to ${status}. Reply sent: “${reply}”`,
      reply: (reply: string) => `Reply sent: “${reply}”`,
      priority: (priority: string, by: string) => `Priority changed to ${priority} by ${by}`,
      siteNote: (by: string, text: string) => `Site note from ${by} (project team): ${text}`,
    },
  },
  /** Words shared by the developer's three content areas. */
  content: {
    forbidden: 'This page is for the project developer. Opening the dashboard.',
    rowMenu: { label: (title: string) => `Actions for ${title}`, edit: 'Edit', delete: 'Delete' },
    confirmDelete: {
      title: (name: string) => `Delete ${name}?`,
      body: 'This removes it from the staff portal and the public site. You cannot undo this.',
      confirm: 'Delete',
    },
    notFound: { title: 'Not found', body: 'Nothing has this ID. It may have been deleted.' },
    noDate: '—',
    history: {
      created: (when: string) => `Draft created, ${when}`,
      'draft-saved': (when: string, by: string) => `Draft saved by ${by}, ${when}`,
      scheduled: (when: string, by: string) => `Scheduled by ${by}, ${when}`,
      published: (when: string, by: string) => `Published by ${by}, ${when}`,
      updated: (when: string, by: string) => `Updated by ${by}, ${when}`,
      'notice-uploaded': (when: string) => `Notice PDF uploaded, ${when}`,
    },
  },

  announcements: {
    title: 'Traffic announcements',
    intro:
      'Closures and diversions shown on the public Announcements page, the map and the site banner.',
    newAnnouncement: 'New announcement',
    tabsLabel: 'Announcement status',
    tabs: {
      all: 'All',
      active: 'Active',
      scheduled: 'Scheduled',
      ended: 'Ended',
      drafts: 'Drafts',
    },
    toolbarLabel: 'Filter announcements',
    searchLabel: 'Search announcements',
    searchPlaceholder: 'Road or announcement title',
    filters: {
      type: { name: 'Type', all: 'All' },
      area: { name: 'Area', all: 'All' },
      sort: {
        name: 'Sort',
        options: { newest: 'Start date, newest first', oldest: 'Start date, oldest first' },
      },
    },
    types: { closure: 'Closure', construction: 'Construction', hazard: 'Hazard' },
    table: {
      label: 'Announcements',
      columns: {
        announcement: 'Announcement',
        start: 'Start',
        end: 'End',
        duration: 'Duration',
        status: 'Status',
        banner: 'Banner',
      },
      banner: (title: string) => `Show ${title} in the site banner`,
    },
    showing: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} announcements.`,
    endedNote: 'Ended announcements stay visible on the public Past tab.',
    paginationLabel: 'Announcement pages',
    empty: {
      title: 'No announcements match these filters',
      body: 'Change the filters or search for a different road or title.',
      clear: 'Clear filters',
    },
  },

  announcementEditor: {
    back: 'All announcements',
    newTitle: 'New announcement',
    status: {
      draft: (saved: string) => (saved ? `Draft, last saved ${saved}.` : 'Draft, not saved yet.'),
      upcoming: (when: string) => `Scheduled. Goes live on the public site on ${when}.`,
      active: 'Live on the public site.',
      ended: 'Ended. It stays on the public Past tab.',
    },
    saveDraft: 'Save draft',
    schedule: 'Save and schedule',
    publish: 'Publish announcement',
    sections: {
      details: 'Details',
      when: 'When',
      where: 'Where',
      notice: 'Official notice',
    },
    fields: {
      title: 'Title',
      type: 'Type',
      area: 'Area',
      summary: 'What commuters need to know',
      start: 'Start',
      end: 'End',
      duration: 'Duration',
      calculated: '(calculated)',
      nightly: 'Repeats nightly, 10 pm to 6 am',
      road: 'Road or place',
    },
    typeOptions: { closure: 'Closure', construction: 'Construction', hazard: 'Hazard' },
    summaryMax: 400,
    errors: {
      title: 'Enter a title.',
      summary: 'Tell commuters what changes and what to do.',
      start: 'Choose a start date.',
      end: 'Choose an end date.',
      endBeforeStart: 'The end date must be on or after the start date.',
      road: 'Enter the road or place.',
    },
    duration: {
      nights: (n: number) => (n === 1 ? '1 night' : `${n} nights`),
      days: (n: number) => (n === 1 ? '1 day' : `${n} days`),
      weeks: (n: number) => (n === 1 ? '1 week' : `${n} weeks`),
      months: (n: number) => `About ${n} months`,
      none: '—',
    },
    map: {
      label: 'Map of the road or place. Click the map to move the pin.',
      dropLabel: 'Drop a pin at the map centre',
      pinLabel: 'Announcement location pin',
      linked: (name: string) => `Linked map item: ${name}`,
    },
    notice: {
      shown: 'Shown as “View notice” on the public Announcements table.',
      uploaded: (sizeKb: number, when: string) => `${sizeKb} KB, uploaded ${when}`,
      remove: (fileName: string) => `Remove ${fileName}`,
      choose: 'Upload a PDF notice',
      rules: 'PDF only, up to 10 MB.',
      wrongType: 'The notice must be a PDF.',
      tooBig: 'The notice is larger than 10 MB.',
      maxMegabytes: 10,
    },
    publishing: {
      title: 'Publishing',
      banner: {
        label: 'Show in the site banner',
        hint: 'The yellow bar at the top of every page while it is active.',
      },
      email: {
        label: 'Email followers of nearby stations',
        hint: (stations: string) => `Sends to people following ${stations}.`,
        none: 'Sends to people following the stations nearby.',
        and: ' and ',
        comma: ', ',
      },
      map: { label: 'Show on the traffic map', hint: 'Uses the linked map item.' },
    },
    preview: {
      title: 'Public preview',
      banner: (title: string, road: string) => `${title}. ${road}.`,
      card: (road: string, range: string) => (range ? `${road}, ${range}` : road),
      untitled: 'Untitled announcement',
      to: 'to',
    },
    history: { title: 'History', empty: 'Nothing has happened yet.' },
    messages: {
      saved: 'Draft saved.',
      scheduled: 'Scheduled. It goes live on the start date.',
      published: 'Published.',
      updated: 'Changes saved.',
      invalid: 'Some fields need your attention.',
    },
  },

  mapItems: {
    title: 'Map items',
    intro: 'Everything commuters see on the public traffic map.',
    add: 'Add item',
    searchLabel: 'Search map items',
    searchPlaceholder: 'Road or item name',
    listLabel: 'Map items',
    filterLabel: 'Item type',
    filters: {
      all: (n: number) => `All ${n}`,
      closure: (n: number) => `Closures ${n}`,
      worksite: (n: number) => `Worksites ${n}`,
      hazard: (n: number) => `Hazards ${n}`,
    },
    kinds: { closure: 'Closure', worksite: 'Worksite', hazard: 'Hazard' },
    itemMeta: (kind: string, hazardNoEnd: boolean) =>
      hazardNoEnd ? `${kind}, pin, no end date` : `${kind}, pin`,
    empty: 'No map items match this search.',
    map: {
      label: 'Traffic map of closures, worksites and hazards',
      centreLabel: 'Fit the map to all items',
      dropLabel: 'Drop a pin at the map centre',
      pinLabel: (name: string) => `Pin for ${name}`,
    },
    tools: {
      label: 'Map tools',
      select: 'Select items',
      pin: 'Move the pin of the selected item',
      remove: 'Delete the selected item',
      pinHint: 'Pin tool: click the map to move the pin, or drag it. Arrow keys nudge it 10 m.',
      selectHint: 'Select tool: click an item on the map or in the list.',
    },
    edit: {
      title: 'Edit map item',
      newTitle: 'New map item',
      close: 'Close',
      type: 'Type',
      name: 'Name on the public map',
      from: 'From',
      to: 'To',
      toHint: 'Leave empty for no end date.',
      linked: 'Linked announcement',
      noLinked: 'No linked announcement',
      visible: 'Visible on the public map',
      visibleFrom: (when: string) => `Shows from ${when}`,
      visibleNoDate: 'Shows as soon as you save.',
      save: 'Save changes',
      create: 'Add item',
      delete: 'Delete',
      saved: 'Map item saved.',
      errors: {
        name: 'Enter a name for the public map.',
        range: 'The end date must be on or after the start date.',
      },
    },
    newName: 'New map item',
    legend: { label: 'Legend', closure: 'Closure', worksite: 'Worksite', hazard: 'Hazard' },
  },

  progress: {
    title: 'Progress updates',
    intro: 'Photos and notes shown on Construction progress, station pages and the Home page.',
    newUpdate: 'New update',
    tabsLabel: 'Update status',
    tabs: { all: 'All', published: 'Published', scheduled: 'Scheduled', drafts: 'Drafts' },
    searchLabel: 'Search progress updates',
    searchPlaceholder: 'Update title or station',
    table: {
      label: 'Progress updates',
      by: (name: string) => `By ${name}`,
      station: 'Station',
      date: 'Date',
      status: 'Status',
    },
    showing: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} updates.`,
    paginationLabel: 'Update pages',
    empty: {
      title: 'No updates match this search',
      body: 'Change the tab or search for a different title or station.',
      clear: 'Clear filters',
    },
  },

  progressEditor: {
    back: 'All updates',
    newTitle: 'New progress update',
    status: {
      draft: (saved: string) => (saved ? `Draft, last saved ${saved}.` : 'Draft, not saved yet.'),
      scheduled: (when: string) => `Scheduled. Goes live on ${when}.`,
      published: (when: string) => `Published on ${when}.`,
    },
    saveDraft: 'Save draft',
    publish: 'Publish update',
    schedule: 'Schedule update',
    update: 'Save changes',
    sections: {
      update: 'Update',
      photos: 'Photos',
      publishing: 'Publishing',
      preview: 'Public preview',
    },
    fields: {
      title: 'Title',
      station: 'Station',
      stage: 'Construction stage',
      body: 'What happened',
      progress: 'Station progress',
      progressHint: (station: string) => `Updates the progress bar on the ${station} station page.`,
      progressValue: (from: number, to: number) => `${from}% to ${to}%`,
      publish: 'Publish',
      scheduleDate: 'Publish on',
    },
    bodyMax: 600,
    publishModes: { now: 'Now, when I click Publish update', later: 'On a later date' },
    email: {
      label: (station: string) => `Email followers of ${station}`,
      hint: 'People following this station get an email when the update goes live.',
    },
    home: { label: 'Show on the Home page', hint: 'Appears in Latest construction progress.' },
    photos: {
      drop: 'Drag photos here or browse',
      dropActive: 'Drop photos to add them',
      rules: (max: number, mb: number) => `JPG or PNG, up to ${mb} MB each, maximum ${max} photos`,
      maxPhotos: 8,
      maxMegabytes: 10,
      tooMany: (max: number) => `You can add up to ${max} photos. Remove one to add another.`,
      tooBig: (name: string, mb: number) => `${name} is larger than ${mb} MB.`,
      wrongType: (name: string) => `${name} is not a JPG or PNG.`,
      remove: (name: string) => `Remove ${name}`,
      removed: (name: string) => `${name} removed.`,
      altLabel: (name: string) => `Description of ${name}`,
      altPlaceholder: 'Describe this photo for screen reader users',
      altMissing: 'A description is needed before you can publish.',
      empty: 'No photos yet.',
    },
    preview: {
      note: (station: string) =>
        `As it appears under Latest site updates on the ${station} station page.`,
      untitled: 'Untitled update',
      noDate: 'Date set when published',
    },
    errors: {
      title: 'Enter a title.',
      body: 'Describe what happened.',
      date: 'Choose the publish date.',
    },
    messages: {
      saved: 'Draft saved.',
      published: 'Published.',
      scheduled: 'Scheduled.',
      updated: 'Changes saved.',
      invalid: 'Some fields need your attention.',
    },
  },
} as const;
