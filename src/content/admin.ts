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
      title: 'Map pins',
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
    panel: { heading: 'Reports and works,\nhandled together' },
    rolesTitle: 'What you can manage depends on your role',
    roleList: [
      {
        role: 'authority',
        title: 'Government authority',
        summary: 'Claim, reply to and resolve tickets from the public',
      },
      {
        role: 'developer',
        title: 'Project developer',
        summary: 'Announcements, map pins, progress updates and tickets',
      },
    ],
    prototypeDeveloper: 'Prototype only: continue as project developer',
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
    collapseSidebar: 'Close the sidebar',
    expandSidebar: 'Open the sidebar',
    menuTitle: 'Staff portal menu',
    logOut: 'Log out',
    loggedOut: 'You are logged out.',
    checking: 'Checking your staff session',
    publicSite: 'View public site',
    opensInNewTab: 'opens in new tab',
    skipToContent: 'Skip to main content',
    search: {
      authority: {
        label: 'Search tickets',
        placeholder: 'Search tickets by ID, subject or road',
      },
      developer: {
        label: 'Search announcements, map pins and updates',
        placeholder: 'Search announcements, map pins or updates',
      },
      submit: 'Search',
    },
    notificationsUnread: (unread: number) =>
      unread === 0 ? 'Notifications, none unread' : `Notifications, ${unread} unread`,
  },

  nav: {
    groups: {
      overview: 'Overview',
      feedback: 'Reports',
      traffic: 'Traffic',
      project: 'Project',
    },
    items: {
      dashboard: 'Dashboard',
      tickets: 'Tickets',
      announcements: 'Announcements',
      mapItems: 'Map pins',
      progress: 'Progress updates',
    },
    unclaimedBadge: (count: number) => `${count} unclaimed`,
  },

  /** The notification feed, on the dashboard and in the top bar bell. */
  notifications: {
    title: 'Notifications',
    hint: 'Mentions, notes on your tickets and replies from reporters.',
    listLabel: 'Notifications',
    empty: 'You have no notifications yet.',
    markAllRead: 'Mark all as read',
    allRead: 'All notifications marked as read.',
    unread: 'Unread',
    excerpt: (text: string) => `“${text}”`,
    viewAll: 'See all on the dashboard',
    kinds: {
      mention: (name: string) => `${name} mentioned you in a note`,
      comment: (name: string) => `${name} added a note on a ticket you handle`,
      'reporter-reply': (name: string) => `${name} replied on a ticket you handle`,
    },
  },

  dashboard: {
    title: 'Dashboard',
    /** Pending tickets nobody has picked up, on both dashboards. */
    unclaimed: {
      title: 'Waiting to be picked up',
      hint: 'Pending tickets nobody is handling yet, oldest first. The target is a pick-up within 2 working days.',
      viewAll: 'View pending tickets',
      listLabel: 'Tickets waiting to be picked up',
      empty: 'Every ticket has been picked up.',
      areaLabel: 'Area',
      waitingLabel: 'Waiting',
      claim: 'I’m working on this',
      claimed: (id: string, name: string) => `${id} is now yours, handled by ${name}.`,
      waited: {
        minutes: (n: number) => `${n} min`,
        hours: (n: number) => (n === 1 ? '1 hour' : `${n} hours`),
        days: (n: number) => (n === 1 ? '1 day' : `${n} days`),
      },
    },
    ticketCounts: {
      label: 'Ticket status counts',
      pending: { label: 'Pending' },
      inProgress: { label: 'In progress' },
      resolved: { label: 'Resolved' },
    },
    authority: {
      intro: 'Reports from commuters, residents and businesses near the works.',
      openQueue: 'Open ticket queue',
      byArea: {
        title: 'Open tickets by area',
        empty: 'No open tickets.',
      },
      byType: {
        title: 'Tickets by type',
      },
    },
    developer: {
      intro: 'What the public currently sees about the works.',
      newAnnouncement: 'New announcement',
      stats: {
        active: { label: 'Active announcements' },
        scheduled: { label: 'Scheduled' },
        mapItems: { label: 'Live map pins' },
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
      handling: {
        title: 'Tickets you are handling',
        hint: 'Tickets you claimed. Reply to the reporter and move them to Resolved.',
        empty: 'You have not claimed a ticket yet.',
        viewAll: 'Open ticket queue',
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
      'Handled by',
      'Priority',
      'Status',
    ],
    tabsLabel: 'Ticket status',
    tabs: {
      all: 'All',
      pending: 'Pending',
      'in-progress': 'In progress',
      resolved: 'Resolved',
    },
    toolbarLabel: 'Filter tickets',
    searchLabel: 'Search tickets',
    searchPlaceholder: 'Ticket ID, subject or road',
    clearSearch: 'Clear search',
    filter: (name: string, value: string) => `${name}: ${value}`,
    filters: {
      type: { name: 'Type', all: 'All' },
      area: { name: 'Area', all: 'All' },
      range: {
        name: 'Submitted',
        options: { '7': 'Last 7 days', '30': 'Last 30 days', all: 'All time' },
      },
      sort: {
        name: 'Sort',
        options: { newest: 'Newest first', oldest: 'Oldest first' },
      },
    },
    types: { complaint: 'Complaint', inquiry: 'General inquiry' },
    table: {
      label: 'Tickets',
      columns: {
        ticket: 'Ticket',
        subject: 'Subject',
        area: 'Area',
        submitted: 'Submitted',
        handledBy: 'Handled by',
        priority: 'Priority',
        status: 'Status',
      },
      unclaimed: 'Not claimed yet',
    },
    showing: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} tickets`,
    paginationLabel: 'Ticket pages',
    empty: {
      title: 'No tickets match these filters',
      body: 'Change the filters or search for a different ticket ID, subject or road.',
      clear: 'Clear filters',
    },
  },

  ticket: {
    back: 'All tickets',
    categoryLine: (type: string, category: string) => `${type}: ${category}`,
    notFound: {
      title: 'Ticket not found',
      body: 'No ticket has this ID. Check the ID or go back to the queue.',
    },
    handledBy: (name: string) => `Handled by ${name}`,
    notClaimed: 'Not claimed yet',
    conversation: { title: 'Conversation' },
    location: {
      title: 'Location',
      mapLabel: (location: string) => `Map of ${location}`,
      coordinates: (lat: number, lng: number) => `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    },
    claim: {
      title: 'Nobody is handling this ticket yet',
      body: 'Claim it to become its handler. The status moves to In progress and the reporter sees who is looking into it.',
      action: 'I’m working on this',
      claimed: (name: string) => `You are now handling this ticket as ${name}.`,
    },
    notes: {
      title: 'Internal notes',
      staffOnly: 'Staff only, never shown to the reporter',
      label: 'Note for staff',
      placeholder: 'Add a note for staff…',
      add: 'Add note',
      byline: (author: string) => author,
      added: 'Internal note added.',
      mentionHint: 'Type @ to mention a colleague. They are notified.',
      mentionList: 'Staff to mention',
      mentionSuggestions: (count: number) =>
        count === 1 ? '1 colleague to mention' : `${count} colleagues to mention`,
    },
    reply: {
      title: 'Reply to the reporter',
      hint: 'The reply is emailed to the reporter and added to the conversation.',
      status: 'Status',
      statusOptions: { 'in-progress': 'In progress', resolved: 'Resolved' },
      readOnly: {
        title: (name: string) => `Handled by ${name}`,
        body: 'Only they can reply, change the status or priority, or resolve this ticket. You can still add internal notes.',
      },
      priority: 'Priority',
      priorityOptions: { normal: 'Normal', high: 'High' },
      subject: { label: 'Reply subject', placeholder: 'Sum up the reply', max: 100 },
      description: {
        label: 'Reply description',
        placeholder: 'Write the reply to the reporter…',
        max: 1000,
      },
      files: { label: 'Photos and files', maxFiles: 5, maxMb: 10 },
      errors: {
        subject: 'Enter a reply subject',
        description: 'Enter a reply description',
        uploading: 'Wait for your files to finish uploading.',
      },
      send: 'Send reply to reporter',
      sending: 'Sending reply…',
      sent: 'Reply sent. The reporter was emailed.',
    },
    reporter: {
      title: 'Reporter',
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
      },
    },
    showing: (from: number, to: number, total: number) =>
      `Showing ${from} to ${to} of ${total} announcements.`,
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
      ended: 'Ended.',
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
      mapName: 'Name on the public map',
      mapNameHint: (kind: string) => `Shown as a ${kind.toLowerCase()} pin. Empty uses the title.`,
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
    },
    notice: {
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
      automatic: (stations: string) =>
        `When it goes live, it shows in the site banner and is emailed to people following ${stations}.`,
      automaticNone:
        'When it goes live, it shows in the site banner and is emailed to people following the stations nearby.',
      and: ' and ',
      map: { label: 'Show on the traffic map', hint: 'Shows its pin on the public traffic map.' },
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
    title: 'Map pins',
    intro: 'Every announcement has one pin on the public traffic map.',
    add: 'Add pin',
    placing: {
      title: 'Add map pin',
      body: 'Choose the type, then click the map or drag the pin to the spot. Arrow keys nudge the pin 10 m.',
      road: 'Road or area',
      finding: 'Finding the road…',
      lookupFailed:
        'We could not find a road name for this spot. You can type it in the announcement.',
      noPin: 'Click the map to place the pin.',
      continue: 'Continue to announcement',
      cancel: 'Cancel',
      pinLabel: (kind: string) => `New ${kind.toLowerCase()} pin`,
      hint: 'Placing a new pin: click the map to drop it, or drag it.',
    },
    searchLabel: 'Search map pins',
    searchPlaceholder: 'Road or pin name',
    listLabel: 'Map pins',
    filterLabel: 'Pin type',
    filters: {
      all: (n: number) => `All ${n}`,
      closure: (n: number) => `Closures ${n}`,
      worksite: (n: number) => `Worksites ${n}`,
      hazard: (n: number) => `Hazards ${n}`,
    },
    kinds: { closure: 'Closure', worksite: 'Worksite', hazard: 'Hazard' },
    itemMeta: (kind: string, hazardNoEnd: boolean) => (hazardNoEnd ? `${kind}, no end date` : kind),
    empty: 'No map pins match this search.',
    map: {
      label: 'Traffic map of closures, worksites and hazards',
      centreLabel: 'Fit the map to all pins',
      dropLabel: 'Drop a pin at the map centre',
      pinLabel: (name: string) => `Pin for ${name}`,
    },
    tools: {
      label: 'Map tools',
      select: 'Select pins',
      pin: 'Move the selected pin',
      pinHint: 'Pin tool: click the map to move the pin, or drag it. Arrow keys nudge it 10 m.',
      selectHint: 'Select tool: click a pin on the map or in the list.',
    },
    edit: {
      title: 'Edit map pin',
      close: 'Close',
      type: 'Type',
      name: 'Name on the public map',
      from: 'From',
      to: 'To',
      announcement: 'Announcement',
      visible: 'Visible on the public map',
      visibleFrom: (when: string) => `Shows from ${when}`,
      visibleNoDate: 'Shows as soon as you save.',
      visibleDraft: 'Publish the announcement first.',
      save: 'Save changes',
      deleteNote: 'To delete this pin, delete its announcement.',
      saved: 'Map pin saved.',
      errors: {
        name: 'Enter a name for the public map.',
        range: 'The end date must be on or after the start date.',
      },
    },
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
    },
    fields: {
      title: 'Title',
      station: 'Station',
      stage: 'Construction stage',
      body: 'What happened',
      progress: 'Station progress',
      progressHint: (station: string, now: number) =>
        `Drag to set the progress bar on the ${station} station page. It is ${now}% now.`,
      progressValue: (percent: number) => `${percent}%`,
      publish: 'Publish',
      scheduleDate: 'Publish on',
    },
    bodyMax: 600,
    publishModes: { now: 'Now, when I click Publish update', later: 'On a later date' },
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
      altPlaceholder: 'Describe what the photo shows. It appears under the photo.',
      altMissing: 'A description is needed before you can publish.',
      empty: 'No photos yet.',
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
