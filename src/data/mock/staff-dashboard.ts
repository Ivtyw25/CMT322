import type { AuthorityDashboard, DeveloperDashboard } from '@/data/models/staff-dashboard';

/** Figma 113:4668. The three open-ticket counts come from the ticket list. */
export const authorityDashboard: AuthorityDashboard = {
  updatedAt: '29 Oct 2026, 10:30',
  newToday: { count: 7, moreThanYesterday: 3 },
  pastTarget: 5,
  averageDaysToResolve: 2.4,
  needsReply: [
    { ticketId: 'MLC-261024-0420', waiting: 'Overdue', overdue: true },
    { ticketId: 'MLC-261026-0444', waiting: 'Overdue', overdue: true },
    { ticketId: 'MLC-261028-0479', waiting: '1 day', overdue: false },
    { ticketId: 'MLC-261029-0511', waiting: '2 hours', overdue: false },
    { ticketId: 'MLC-261029-0514', waiting: '40 min', overdue: false },
  ],
  openByArea: [
    { areaLabel: 'Bayan Lepas', count: 34 },
    { areaLabel: 'George Town', count: 21 },
    { areaLabel: 'Gelugor', count: 12 },
    { areaLabel: 'Sungai Nibong', count: 9 },
    { areaLabel: 'Butterworth', count: 4 },
  ],
  byType: [
    { type: 'complaint', count: 61 },
    { type: 'feedback', count: 25 },
    { type: 'inquiry', count: 19 },
  ],
  recentActivity: [
    {
      id: 'activity-1',
      text: 'Daniel Lim (project team) added a site note to MLC-261028-0482',
      when: '10:12',
    },
    {
      id: 'activity-2',
      text: 'Automated reply sent to the reporter of MLC-261029-0514',
      when: '09:50',
    },
    {
      id: 'activity-3',
      text: 'You assigned MLC-261027-0466 to the traffic management contractor',
      when: 'Yesterday, 17:20',
    },
    {
      id: 'activity-4',
      text: 'You resolved MLC-261020-0398: blocked drain at the KOMTAR bus terminal entrance',
      when: '22 Oct, 11:05',
    },
  ],
};

/** Figma 116:4824. */
export const developerDashboard: DeveloperDashboard = {
  updatedAt: '29 Oct 2026, 10:30',
  activeAnnouncements: { count: 3, endingWithinWeek: 1 },
  scheduled: { count: 2, nextStarts: '3 Nov, 22:00' },
  liveMapItems: { closures: 9, worksites: 14, hazards: 3 },
  lastProgressUpdate: { date: '27 Oct', title: 'KOMTAR crosshead cast' },
  attention: [
    {
      id: 'attention-closure',
      kind: 'alert',
      section: 'map-items',
      title: 'Slip road closure at FIZ Phase 3 ends 9 Nov',
      hint: 'Extend the dates or let it end on time',
      tone: 'warning',
    },
    {
      id: 'attention-night-lane',
      kind: 'announcement',
      section: 'announcements',
      title: 'Night lane closure on Jalan Magazine starts 3 Nov',
      hint: 'Scheduled. Notice PDF attached, banner on',
      tone: 'info',
    },
    {
      id: 'attention-hazard',
      kind: 'map',
      section: 'map-items',
      title: 'Hazard pin at Jalan Tun Dr Awang has no end date',
      hint: 'Hazards without an end date stay on the map',
      tone: 'warning',
    },
    {
      id: 'attention-progress',
      kind: 'progress',
      section: 'progress',
      title: 'No progress update for Sungai Nibong in 30 days',
      hint: 'Commuters following this station get no news',
      tone: 'neutral',
    },
  ],
  assignedTicketIds: ['MLC-261028-0482', 'MLC-261026-0440'],
};
