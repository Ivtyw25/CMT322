import type { ProgressUpdate, StageBase } from '@/data/models/progress-update';
import {
  STATION_STAGE_ORDER,
  type StationCode,
  type StationStage,
  type StationStageId,
} from '@/data/models/station';
import { constructionUpdates } from './construction-updates';
import { sitePhotos } from './photos';

/*
 * Station progress, in one place. The station records (src/data/mock/stations.ts), the station
 * page and the developer's Progress pages all read these updates and stage bases, and work out
 * each station's percentage, current stage and six stages from them the same way
 * (src/lib/station-progress/live-progress.ts).
 */

const DANIEL = 'Daniel Lim';
const FARAH = 'Farah Hassan';

/** When each stage is planned on Segment 1 if it has not started yet. */
const SEGMENT_1_PLAN: Record<StationStageId, string> = {
  'site-clearing': '2025',
  piling: '2026',
  piers: '2027',
  structure: '2027',
  systems: '2029 to 2030',
  testing: 'Dec 2031',
};

/** Segment 2 construction starts in January 2027. */
const SEGMENT_2_PLAN: Record<StationStageId, string> = {
  'site-clearing': '2027',
  piling: '2027 to 2028',
  piers: '2028',
  structure: '2029',
  systems: '2030 to 2031',
  testing: 'Dec 2031',
};

type Completed = Partial<Record<StationStageId, string>>;

function stagesFrom(completed: Completed, plan: Record<StationStageId, string>): StationStage[] {
  return STATION_STAGE_ORDER.map((id): StationStage => {
    const completedIn = completed[id];
    if (completedIn) return { id, status: 'done', completedIn };
    return { id, status: 'planned', when: plan[id], isTarget: id === 'testing' };
  });
}

/** The month each finished stage was completed in, per Segment 1 station. */
const SEGMENT_1_COMPLETED: [StationCode, Completed][] = [
  ['S20', { 'site-clearing': '2025-03', piling: '2025-11' }],
  ['S18', { 'site-clearing': '2026-06' }],
  ['S17', { 'site-clearing': '2025-04', piling: '2026-02' }],
  ['S16', { 'site-clearing': '2025-04', piling: '2026-01' }],
  ['S15', { 'site-clearing': '2025-05', piling: '2026-02' }],
  ['S14', { 'site-clearing': '2025-03', piling: '2025-10' }],
  ['S13', { 'site-clearing': '2025-02', piling: '2025-09', piers: '2026-08' }],
  ['S12', { 'site-clearing': '2025-03', piling: '2025-12' }],
  ['S11', { 'site-clearing': '2025-02', piling: '2025-08', piers: '2026-07' }],
  ['S10', { 'site-clearing': '2025-02', piling: '2025-10' }],
  ['S09', { 'site-clearing': '2025-03', piling: '2026-01' }],
  ['S08', { 'site-clearing': '2025-04', piling: '2026-01' }],
  ['S07', { 'site-clearing': '2025-05', piling: '2026-03' }],
  ['S06', { 'site-clearing': '2026-04' }],
  ['S05', { 'site-clearing': '2026-02' }],
  ['S04', { 'site-clearing': '2025-06', piling: '2026-05' }],
  ['S03', { 'site-clearing': '2025-05', piling: '2026-04' }],
  ['S02', { 'site-clearing': '2026-03' }],
  ['A01', {}],
];

const SEGMENT_2: readonly StationCode[] = ['S31', 'S30', 'S19'];

/** Every station's stages before any progress update. */
export const stageBases: StageBase[] = [
  ...SEGMENT_2.map((code) => ({ code, stages: stagesFrom({}, SEGMENT_2_PLAN) })),
  ...SEGMENT_1_COMPLETED.map(([code, completed]) => ({
    code,
    stages: stagesFrom(completed, SEGMENT_1_PLAN),
  })),
];

/**
 * The stage and percentage each line-wide site update (src/data/mock/construction-updates.ts)
 * gives its first station. The Penang Sentral survey is not here: Segment 2 works have not started.
 */
const SITE_UPDATE_PROGRESS: Record<string, { stage: StationStageId; percent: number }> = {
  'pier-caps-sultan-azlan-shah': { stage: 'piling', percent: 17 },
  'water-mains-bayan-lepas-fiz': { stage: 'piling', percent: 15 },
  'piling-george-town-station': { stage: 'piling', percent: 14 },
  'first-span-gelugor': { stage: 'piers', percent: 41 },
  'concourse-jalan-universiti': { stage: 'structure', percent: 40 },
  'power-cables-tun-dr-awang': { stage: 'piers', percent: 42 },
  'piling-fiz-south': { stage: 'piling', percent: 21 },
  'platform-beams-sungai-dua': { stage: 'structure', percent: 48 },
  'launching-gantry-bayan-lepas': { stage: 'piers', percent: 24 },
  'telecom-lines-komtar': { stage: 'piers', percent: 30 },
  'piling-complete-sungai-tiram': { stage: 'piers', percent: 18 },
};

const fromSiteUpdates: ProgressUpdate[] = constructionUpdates.flatMap((item, index) => {
  const progress = SITE_UPDATE_PROGRESS[item.id];
  const stationCode = item.stationCodes[0];
  if (!progress || !stationCode) return [];
  return [
    {
      id: item.id,
      title: item.title,
      stationCode,
      stage: progress.stage,
      body: item.body,
      state: 'published',
      author: Math.floor(index / 2) % 2 === 0 ? DANIEL : FARAH,
      date: item.date,
      photos: item.photos.map((photo, index) => ({
        id: `${item.id}-p${index + 1}`,
        fileName: `${item.id}-${index + 1}.jpg`,
        alt: photo.alt,
        src: photo.src,
      })),
      percent: progress.percent,
      savedAt: `${item.date}T10:00:00+08:00`,
    },
  ];
});

type StationNote = Omit<ProgressUpdate, 'state' | 'author' | 'savedAt'>;

/** Updates written for one station, published unless they are the drafts at the end. */
const stationNotes: StationNote[] = [
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
        src: sitePhotos.trafficDiversion.src,
      },
    ],
    percent: 35,
  },
  {
    id: 'crosshead-cast-komtar-tower',
    title: 'Crosshead cast on the pier facing KOMTAR Tower',
    stationCode: 'S20',
    stage: 'piers',
    body: 'Crosshead cast on the pier facing KOMTAR Tower. Night lifting works start on 3 November.',
    date: '2026-10-27',
    photos: [
      {
        id: 'p1',
        fileName: 'crosshead-cast.jpg',
        alt: 'The cast crosshead on top of the pier',
        src: sitePhotos.viaductPierCaps.src,
      },
    ],
    percent: 38,
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
        src: sitePhotos.concourseFormwork.src,
      },
      {
        id: 'p2',
        fileName: 'usm-gate-footpath.jpg',
        alt: 'The temporary footpath beside the USM gate',
        src: sitePhotos.coveredWalkway.src,
      },
    ],
    percent: 46,
  },
  {
    id: 'inner-lane-traffic-s09',
    title: 'Traffic moved to the inner lane',
    stationCode: 'S09',
    stage: 'piers',
    body: 'Traffic now runs in the inner lane beside the station site while the next two piers are built.',
    date: '2026-10-26',
    photos: [],
    percent: 36,
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
        src: sitePhotos.viaductPierCaps.src,
      },
    ],
    percent: 34,
  },
  {
    id: 'piers-rising-sungai-pinang',
    title: 'Piers rising beside the Sungai Pinang river',
    stationCode: 'S17',
    stage: 'piers',
    body: 'Three station piers now stand beside the river. Jalan Sungai Pinang keeps both lanes open.',
    date: '2026-10-16',
    photos: [],
    percent: 29,
  },
  {
    id: 'pier-columns-east-jelutong',
    title: 'Pier columns poured at East Jelutong',
    stationCode: 'S16',
    stage: 'piers',
    body: 'Concrete for four pier columns was poured beside Lebuhraya Tun Dr Lim Chong Eu.',
    date: '2026-10-16',
    photos: [],
    percent: 33,
  },
  {
    id: 'pier-formwork-penang-waterfront',
    title: 'Pier formwork up at Penang Waterfront',
    stationCode: 'S15',
    stage: 'piers',
    body: 'Formwork is up for the next two piers along the eastern waterfront.',
    date: '2026-10-16',
    photos: [],
    percent: 31,
  },
  {
    id: 'pier-caps-batu-uban',
    title: 'First pier caps in place at Batu Uban',
    stationCode: 'S12',
    stage: 'piers',
    body: 'The first two pier caps are in place. Access to Masjid Jamek Batu Uban is unchanged.',
    date: '2026-10-20',
    photos: [],
    percent: 39,
  },
  {
    id: 'piers-jalan-tengah',
    title: 'Pier work moves along Jalan Tengah',
    stationCode: 'S07',
    stage: 'piers',
    body: 'Pier work has moved to the stretch outside Bayan Baru town centre. Footpaths stay open.',
    date: '2026-10-12',
    photos: [],
    percent: 30,
  },
  {
    id: 'pier-bases-airport',
    title: 'Pier bases finished at the airport station',
    stationCode: 'S03',
    stage: 'piers',
    body: 'The pier bases beside the airport terminal road are finished. Columns go up next.',
    date: '2026-10-05',
    photos: [],
    percent: 27,
  },
  {
    id: 'piling-permatang-damar-laut',
    title: 'Piling under way at Permatang Damar Laut',
    stationCode: 'S02',
    stage: 'piling',
    body: 'Piling rigs are working on the station foundations, mostly in daytime hours.',
    date: '2026-09-24',
    photos: [],
    percent: 12,
  },
  {
    id: 'site-clearing-psr-a',
    title: 'Site clearing starts at PSR-A',
    stationCode: 'A01',
    stage: 'site-clearing',
    body: 'Site clearing has started for the PSR-A station on the reclaimed island.',
    date: '2026-09-24',
    photos: [],
    percent: 6,
  },
];

const published: ProgressUpdate[] = stationNotes.map((note, index) => ({
  ...note,
  state: 'published',
  author: index % 2 === 0 ? DANIEL : FARAH,
  savedAt: `${note.date}T10:00:00+08:00`,
}));

/** The drafts the Figma list shows beside the published updates (Figma 117:5417). */
const drafts: ProgressUpdate[] = [
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
        src: sitePhotos.viaductPierCaps.src,
      },
      {
        id: 'p2',
        fileName: 'komtar-pier-6-wide.jpg',
        alt: '',
        src: sitePhotos.trafficDiversion.src,
      },
    ],
    percent: 41,
    savedAt: '2026-10-29T10:42:00+08:00',
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
    percent: 42,
    savedAt: '2026-10-28T14:10:00+08:00',
  },
];

/** Every station progress update, drafts first. */
export const progressUpdates: ProgressUpdate[] = [...drafts, ...published, ...fromSiteUpdates];
