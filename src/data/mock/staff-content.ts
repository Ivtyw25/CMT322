import type { StaffAnnouncement, StaffProgressUpdate } from '@/data/models/staff-content';
import { announcements } from './announcements';
import { constructionUpdates } from './construction-updates';
import { hazards } from './hazards';
import { roadWorks } from './road-works';

const DANIEL = 'Daniel Lim';
const FARAH = 'Farah Hassan';

/*
 * Staff view of the 21 public announcements (Figma 116:4985), plus two drafts. The banner is on for
 * the lane closure and the night closure, as in the Figma list; everything else is off.
 * Every announcement owns its pin on the traffic map, so the six road works and the hazard that
 * the public map shows beside the announcements also exist here as announcements.
 */
const bannerOn = new Set(['sultan-azlan-shah-lane-closure', 'komtar-crosshead-night-closure']);

const publishedAnnouncements: StaffAnnouncement[] = announcements.map((item) => ({
  ...item,
  showBanner: bannerOn.has(item.id),
  emailFollowers: item.id === 'komtar-crosshead-night-closure',
  mapName: item.title,
  showOnMap: item.status !== 'ended',
  notice:
    item.id === 'komtar-crosshead-night-closure'
      ? {
          fileName: 'Notis-penutupan-lorong-Jalan-Magazine.pdf',
          sizeKb: 412,
          uploadedOn: '2026-10-28',
        }
      : null,
  history:
    item.id === 'komtar-crosshead-night-closure'
      ? [
          { id: 'h1', at: '2026-10-27T09:40:00+08:00', action: 'created', by: DANIEL },
          { id: 'h2', at: '2026-10-28T15:12:00+08:00', action: 'notice-uploaded', by: DANIEL },
          { id: 'h3', at: '2026-10-28T15:20:00+08:00', action: 'scheduled', by: DANIEL },
        ]
      : [],
}));

const draftBase = announcements.find((item) => item.id === 'tun-dr-awang-utility-works');

const drafts: StaffAnnouncement[] = draftBase
  ? [
      {
        ...draftBase,
        id: 'tun-dr-awang-footpath-closure',
        type: 'closure',
        status: 'draft',
        title: 'Footpath closure on Jalan Tun Dr Awang',
        summary: '',
        brief: '',
        location: 'Jalan Tun Dr Awang, Sungai Nibong',
        road: 'Jalan Tun Dr Awang',
        startDate: '',
        endDate: '',
        duration: '',
        detour: [],
        showBanner: false,
        emailFollowers: false,
        mapName: 'Footpath closure on Jalan Tun Dr Awang',
        showOnMap: false,
        notice: null,
        history: [{ id: 'h1', at: '2026-10-27T11:05:00+08:00', action: 'created', by: DANIEL }],
      },
      {
        ...draftBase,
        id: 'macallum-night-works',
        type: 'construction',
        status: 'draft',
        title: 'Night works at the Jalan Macallum junction',
        summary: '',
        brief: '',
        location: 'Jalan Macallum, George Town',
        road: 'Jalan Macallum',
        startDate: '',
        endDate: '',
        duration: '',
        detour: [],
        showBanner: false,
        emailFollowers: false,
        mapName: 'Night works at the Jalan Macallum junction',
        showOnMap: false,
        notice: null,
        history: [{ id: 'h1', at: '2026-10-28T16:30:00+08:00', action: 'created', by: DANIEL }],
      },
    ]
  : [];

const roadWorkAnnouncements: StaffAnnouncement[] = roadWorks.map((item) => ({
  id: item.id,
  type: item.kind,
  status: item.status,
  title: item.title,
  summary: item.summary,
  brief: item.brief,
  location: item.location,
  road: item.road,
  lat: item.lat,
  lng: item.lng,
  areaIds: item.areaIds,
  stationCodes: item.stationCodes,
  startDate: item.startDate,
  endDate: item.endDate,
  dailyHours: item.dailyHours,
  duration: item.duration,
  detour: [],
  publishedAt: item.startDate,
  showBanner: false,
  emailFollowers: false,
  mapName: item.title,
  showOnMap: true,
  notice: null,
  history: [],
}));

const hazardAnnouncements: StaffAnnouncement[] = hazards.map((item) => ({
  id: item.id,
  type: 'hazard',
  status: item.status,
  title: item.title,
  summary: item.summary,
  brief: item.brief,
  location: item.location,
  road: item.road,
  lat: item.lat,
  lng: item.lng,
  areaIds: item.areaIds,
  stationCodes: item.stationCodes,
  startDate: item.reportedOn,
  endDate: '',
  dailyHours: null,
  duration: '',
  detour: [],
  publishedAt: item.reportedOn,
  showBanner: false,
  emailFollowers: false,
  mapName: item.title,
  showOnMap: true,
  notice: null,
  history: [],
}));

export const staffAnnouncements: StaffAnnouncement[] = [
  ...publishedAnnouncements,
  ...roadWorkAnnouncements,
  ...hazardAnnouncements,
  ...drafts,
];

/*
 * Staff view of the site updates (Figma 117:5417). The two drafts and the scheduled update are
 * the ones the Figma list shows beside the published updates; authors alternate as in Figma.
 */
const published: StaffProgressUpdate[] = constructionUpdates.map((item, index) => ({
  id: item.id,
  title: item.title,
  stationCode: item.stationCodes[0] ?? 'S20',
  phase: item.phase,
  body: item.body,
  state: 'published',
  author: Math.floor(index / 2) % 2 === 0 ? DANIEL : FARAH,
  date: item.date,
  photos: Array.from({ length: item.photoCount }, (_, photo) => ({
    id: `${item.id}-p${photo + 1}`,
    fileName: `${item.id}-${photo + 1}.jpg`,
    alt: item.title,
  })),
  stationProgress: null,
  emailFollowers: false,
  showOnHome: true,
  savedAt: `${item.date}T10:00:00+08:00`,
}));

const extraUpdates: StaffProgressUpdate[] = [
  {
    id: 'sixth-pier-komtar',
    title: 'Sixth pier completed at KOMTAR',
    stationCode: 'S20',
    phase: 'viaduct',
    body: 'The sixth of ten piers outside KOMTAR Tower is complete. Crosshead lifting starts on 3 November at night, with one lane closed on Jalan Magazine.',
    state: 'draft',
    author: DANIEL,
    date: '',
    photos: [
      {
        id: 'p1',
        fileName: 'komtar-pier-6.jpg',
        alt: 'Completed concrete pier beside KOMTAR Tower with scaffolding removed',
      },
      { id: 'p2', fileName: 'komtar-pier-6-wide.jpg', alt: '' },
    ],
    stationProgress: { from: 38, to: 41 },
    emailFollowers: true,
    showOnHome: true,
    savedAt: '2026-10-29T10:42:00+08:00',
  },
  {
    id: 'crosshead-cast-komtar-tower',
    title: 'Crosshead cast on the pier facing KOMTAR Tower',
    stationCode: 'S20',
    phase: 'viaduct',
    body: 'The crosshead on the pier facing KOMTAR Tower has been cast and is curing.',
    state: 'published',
    author: DANIEL,
    date: '2026-10-27',
    photos: [
      { id: 'p1', fileName: 'crosshead-cast.jpg', alt: 'The cast crosshead on top of the pier' },
    ],
    stationProgress: null,
    emailFollowers: false,
    showOnHome: true,
    savedAt: '2026-10-27T10:00:00+08:00',
  },
  {
    id: 'viaduct-foundations-sungai-nibong',
    title: 'Viaduct foundation works at Sungai Nibong',
    stationCode: 'S10',
    phase: 'viaduct',
    body: '',
    state: 'draft',
    author: FARAH,
    date: '',
    photos: [],
    stationProgress: null,
    emailFollowers: false,
    showOnHome: false,
    savedAt: '2026-10-28T14:10:00+08:00',
  },
];

export const staffProgressUpdates: StaffProgressUpdate[] = [...extraUpdates, ...published];
