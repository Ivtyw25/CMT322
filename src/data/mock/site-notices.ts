import type { SiteNotice } from '@/data/models/site-notice';

/*
 * Notices for the notification bar. The bar shows the one published at MOCK_NOW
 * (the first record, from Figma 4:750). The others are invented and go live on later dates.
 */
export const siteNotices: SiteNotice[] = [
  {
    id: 'notice-2026-10-29-sultan-azlan-shah',
    title: 'Road closure tonight',
    // VERIFY: the announcement this links to is an all-day lane closure; the notice says 10 pm to 6 am.
    message: 'Jalan Sultan Azlan Shah, one lane each way from 10 pm to 6 am.',
    announcementId: 'sultan-azlan-shah-lane-closure',
    showFrom: '2026-10-29T06:00:00+08:00',
    showUntil: '2026-10-30T06:00:00+08:00',
  },
  {
    id: 'notice-2026-11-03-fiz-diversion',
    title: 'Night diversion from tonight',
    message: 'Lebuhraya Bayan Lepas at the FIZ Phase 4 junction, 10 pm to 6 am for 2 weeks.',
    announcementId: 'fiz-phase-4-night-diversion',
    showFrom: '2026-11-03T06:00:00+08:00',
    showUntil: '2026-11-04T06:00:00+08:00',
  },
  {
    id: 'notice-2026-11-10-tun-dr-awang',
    title: 'Contra-flow starts today',
    message: 'Jalan Tun Dr Awang, contra-flow on the inner lane until 24 Nov.',
    announcementId: 'tun-dr-awang-utility-works',
    showFrom: '2026-11-10T06:00:00+08:00',
    showUntil: '2026-11-11T06:00:00+08:00',
  },
];
