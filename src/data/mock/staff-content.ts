import type { ConstructionPhase } from '@/data/models/construction-update';
import type { StaffAnnouncement, StaffProgressUpdate } from '@/data/models/staff-content';
import type { StationStageId } from '@/data/models/station';
import { announcements } from './announcements';
import { constructionUpdates } from './construction-updates';
import { hazards } from './hazards';
import { roadWorks } from './road-works';

const DANIEL = 'Daniel Lim';
const FARAH = 'Farah Hassan';

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

/** The station stage a line-wide construction phase belongs to. */
const stageOf: Record<ConstructionPhase, StationStageId> = {
  'utility-relocation': 'site-clearing',
  piling: 'piling',
  viaduct: 'piers',
  stations: 'structure',
};

/*
 * Staff view of the site updates (Figma 117:5417). The two drafts and the scheduled update are
 * the ones the Figma list shows beside the published updates; authors alternate as in Figma.
 */
const published: StaffProgressUpdate[] = constructionUpdates.map((item, index) => ({
  id: item.id,
  title: item.title,
  stationCode: item.stationCodes[0] ?? 'S20',
  stage: stageOf[item.phase],
  body: item.body,
  state: 'published',
  author: Math.floor(index / 2) % 2 === 0 ? DANIEL : FARAH,
  date: item.date,
  photos: Array.from({ length: item.photoCount }, (_, photo) => ({
    id: `${item.id}-p${photo + 1}`,
    fileName: `${item.id}-${photo + 1}.jpg`,
    alt: item.title,
  })),
  percent: null,
  savedAt: `${item.date}T10:00:00+08:00`,
}));

type SiteNote = Pick<
  StaffProgressUpdate,
  'id' | 'title' | 'stationCode' | 'stage' | 'body' | 'date' | 'photos'
>;

/** Station site notes, published as progress updates. */
const siteNoteRecords: SiteNote[] = [
  {
    id: 'komtar-new-lane-layout',
    title: 'New lane layout on Jalan Dr Lim Chwee Leong',
    stationCode: 'S20',
    stage: 'piers',
    body: 'Traffic moved to the new lane layout on Jalan Dr Lim Chwee Leong so pier work can continue.',
    date: '2026-10-14',
    photos: [
      {
        id: 'p1',
        fileName: 'komtar-lane-layout.jpg',
        alt: 'Traffic using the new lane layout beside the KOMTAR worksite',
      },
    ],
  },
  {
    id: 'concourse-formwork-jalan-universiti',
    title: 'Concourse slab formwork up at Jalan Universiti',
    stationCode: 'S13',
    stage: 'structure',
    body: 'Formwork is up for the concourse slab. The temporary footpath beside the USM gate stays open.',
    date: '2026-10-21',
    photos: [
      {
        id: 'p1',
        fileName: 'concourse-formwork.jpg',
        alt: 'Timber formwork for the concourse slab above the station site',
      },
      {
        id: 'p2',
        fileName: 'usm-gate-footpath.jpg',
        alt: 'The temporary footpath beside the USM gate',
      },
    ],
  },
  {
    id: 'inner-lane-traffic-s09',
    title: 'Traffic moved to the inner lane',
    stationCode: 'S09',
    stage: 'piers',
    body: 'Traffic now runs in the inner lane beside the station site while the next two piers are built.',
    date: '2026-10-26',
    photos: [],
  },
  {
    id: 'pier-cap-lifting-mayang-pasir',
    title: 'Pier cap lifting finished on Jalan Mayang Pasir',
    stationCode: 'S08',
    stage: 'piers',
    body: 'Pier cap lifting on Jalan Mayang Pasir finished over the weekend. The road is fully open again.',
    date: '2026-10-12',
    photos: [
      {
        id: 'p1',
        fileName: 'mayang-pasir-pier-cap.jpg',
        alt: 'A pier cap in place over Jalan Mayang Pasir',
      },
    ],
  },
];

const siteNotes: StaffProgressUpdate[] = siteNoteRecords.map((note, index) => ({
  ...note,
  state: 'published',
  author: index % 2 === 0 ? DANIEL : FARAH,
  percent: null,
  savedAt: `${note.date}T10:00:00+08:00`,
}));

const extraUpdates: StaffProgressUpdate[] = [
  {
    id: 'sixth-pier-komtar',
    title: 'Sixth pier completed at KOMTAR',
    stationCode: 'S20',
    stage: 'piers',
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
    percent: 41,
    savedAt: '2026-10-29T10:42:00+08:00',
  },
  {
    id: 'crosshead-cast-komtar-tower',
    title: 'Crosshead cast on the pier facing KOMTAR Tower',
    stationCode: 'S20',
    stage: 'piers',
    body: 'Crosshead cast on the pier facing KOMTAR Tower. Night lifting works start on 3 November.',
    state: 'published',
    author: DANIEL,
    date: '2026-10-27',
    photos: [
      { id: 'p1', fileName: 'crosshead-cast.jpg', alt: 'The cast crosshead on top of the pier' },
    ],
    percent: null,
    savedAt: '2026-10-27T10:00:00+08:00',
  },
  {
    id: 'viaduct-foundations-sungai-nibong',
    title: 'Viaduct foundation works at Sungai Nibong',
    stationCode: 'S10',
    stage: 'piers',
    body: '',
    state: 'draft',
    author: FARAH,
    date: '',
    photos: [],
    percent: null,
    savedAt: '2026-10-28T14:10:00+08:00',
  },
];

export const staffProgressUpdates: StaffProgressUpdate[] = [
  ...extraUpdates,
  ...siteNotes,
  ...published,
];
