import type { Area } from '@/data/models/area';

/** Area groups in line order, south to north, as the Home area chips show them. */
export const areas: Area[] = [
  {
    id: 'bayan-lepas',
    label: 'Bayan Lepas and airport',
    stationCodes: ['A01', 'S02', 'S03', 'S04', 'S05', 'S06'],
  },
  {
    id: 'bukit-jambul',
    label: 'Bukit Jambul to Sungai Nibong',
    stationCodes: ['S07', 'S08', 'S09', 'S10'],
  },
  {
    id: 'gelugor',
    label: 'Gelugor and USM',
    stationCodes: ['S11', 'S12', 'S13', 'S14'],
  },
  {
    id: 'george-town',
    label: 'Jelutong to George Town',
    stationCodes: ['S15', 'S16', 'S17', 'S18', 'S20', 'S19'],
  },
  {
    id: 'butterworth',
    label: 'Butterworth',
    stationCodes: ['S30', 'S31'],
  },
];
