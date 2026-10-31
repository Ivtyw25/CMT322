import type { Hazard } from '@/data/models/hazard';

/*
 * Hazards beside the announcements and road works. The uneven surface is from Figma (Traffic map
 * 1:804); its wording and position are invented. VERIFY with the project team.
 */
export const hazards: Hazard[] = [
  {
    id: 'tun-dr-awang-uneven-surface',
    status: 'active',
    title: 'Uneven road surface',
    summary:
      'Ridges in the left lane near Bukit Jambul station. Slow down and keep a safe distance.',
    brief: 'Ridges in the left lane',
    location: 'Jalan Tun Dr Awang, Bukit Jambul',
    road: 'Jalan Tun Dr Awang',
    lat: 5.3398,
    lng: 100.2931,
    areaIds: ['bukit-jambul'],
    stationCodes: ['S09'],
    reportedOn: '2026-10-27',
  },
];
