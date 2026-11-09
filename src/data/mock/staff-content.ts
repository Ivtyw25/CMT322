import type { StaffAnnouncement } from '@/data/models/staff-content';
import { announcements } from './announcements';
import { hazards } from './hazards';
import { roadWorks } from './road-works';

const DANIEL = 'Daniel Lim';

/*
 * Staff view of the 21 public announcements (Figma 116:4985), plus two drafts.
 * Every announcement owns its pin on the traffic map, so the six road works and the hazard that
 * the public map shows beside the announcements also exist here as announcements.
 */
const publishedAnnouncements: StaffAnnouncement[] = announcements.map((item) => ({
  ...item,
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
