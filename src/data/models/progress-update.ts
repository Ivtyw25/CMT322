import type { PhotoSource } from './photo';
import type { StationCode, StationStage, StationStageId } from './station';

export type ProgressState = 'draft' | 'scheduled' | 'published';

export type ProgressPhoto = {
  id: string;
  fileName: string;
  /** What the photo shows: the caption on the station page and its text for screen readers. Needed before the update can be published. */
  alt: string;
  /** The picture. Photos staff add in the editor have none: only the file name is kept. */
  src?: PhotoSource;
};

/**
 * A station progress update: the one record behind both the developer's Progress pages and the
 * station page. Live updates (published, or scheduled and due) are the station's timeline, and
 * the one saved last sets the station's percentage, current stage and "updated" date.
 */
export type ProgressUpdate = {
  id: string;
  title: string;
  stationCode: StationCode;
  /** The build stage the station is in after this update, one of the six on the station page. */
  stage: StationStageId;
  /** What happened. */
  body: string;
  state: ProgressState;
  author: string;
  /** Publish date, or the day a scheduled update goes live. Empty for a draft. */
  date: string;
  photos: ProgressPhoto[];
  /** Whole-station completion after this update, 0 to 100. */
  percent: number;
  /** ISO 8601 date-time of the last save. */
  savedAt: string;
};

/**
 * A station's six stages before any progress update: the months finished stages were completed
 * in, and the plan for the rest. Progress updates put the current stage on top of it.
 */
export type StageBase = {
  code: StationCode;
  stages: StationStage[];
};
