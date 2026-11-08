import type { DeveloperDashboard } from '@/data/models/staff-dashboard';

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
};
