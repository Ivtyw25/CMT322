import type { AreaId } from './area';

export type StationCode = `${'S' | 'A'}${number}`;

/** The six build stages every station goes through, in order. Labels live in src/content/ui.ts. */
export type StationStageId =
  'site-clearing' | 'piling' | 'piers' | 'structure' | 'systems' | 'testing';

export type StationStage =
  | {
      id: StationStageId;
      status: 'done';
      /** Year-month, e.g. "2025-03". */
      completedIn: string;
    }
  | {
      id: StationStageId;
      status: 'in-progress';
      /** Progress note, e.g. "6 of 10 piers complete". */
      detail: string;
    }
  | {
      id: StationStageId;
      status: 'planned';
      /** Display period, e.g. "2027", "2029 to 2030", "Dec 2031". */
      when: string;
      /** Shown as "Target …" instead of "Planned for …" (the opening stage). */
      isTarget: boolean;
    };

export type StationProgress = {
  /** Whole-station completion, 0 to 100. */
  percent: number;
  /** The stage in progress, used in "Current stage: …". */
  currentStageId: StationStageId;
  /** ISO 8601 date of the last progress update. */
  updatedAt: string;
};

export type StationSiteUpdate = {
  id: string;
  /** ISO 8601 date. */
  date: string;
  text: string;
};

export type StationConnection = {
  code: StationCode;
  /** Track distance in km. Null where no figure has been published. */
  distanceKm: number | null;
};

export type Station = {
  code: StationCode;
  name: string;
  /** Landmark or interchange line shown under the name, e.g. "KOMTAR bus terminal, KOMTAR Tower". */
  subtitle: string | null;
  /** The name is not final yet ("Provisional name" in Figma). */
  isProvisionalName: boolean;
  /** 1-based position from Penang Sentral (1) to PSR-A (22). */
  order: number;
  /** Segment 1: PSR-A to KOMTAR. Segment 2: Macallum to Penang Sentral. */
  segment: 1 | 2;
  /** Approximate WGS 84 position for the maps, 4 decimals. */
  lat: number;
  lng: number;
  /** Short place name shown in lists and menus, e.g. "George Town" or "USM, Gelugor". */
  area: string;
  /** Area group for filters and alerts. */
  areaId: AreaId;
  /** One-sentence introduction under the station name on the station page. */
  lede: string;
  /** Every Mutiara Line station is elevated. */
  structure: 'elevated';
  /** Neighbouring stations shown under "Connects to". */
  connectsTo: StationConnection[];
  /** Other transport you can change to here. Empty when there is none. */
  interchanges: string[];
  /** Landmarks near the station. */
  nearby: string[];
  /** Null until construction starts at this station (Segment 2 starts January 2027). */
  progress: StationProgress | null;
  /** All six stages, in build order. */
  stages: StationStage[];
  /** Short notes from the station site, newest first. Separate from the line-wide site updates. */
  siteUpdates: StationSiteUpdate[];
};
