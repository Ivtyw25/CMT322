import type { Announcement, AnnouncementStatus } from './announcement';
import type { StationCode, StationStageId } from './station';

/** One step in the history list of a staff record. */
export type StaffHistoryEntry = {
  id: string;
  /** ISO 8601 date-time. */
  at: string;
  action: 'created' | 'draft-saved' | 'scheduled' | 'published' | 'updated' | 'notice-uploaded';
  /** The staff member's name. */
  by: string;
};

export type StaffAnnouncementStatus = 'draft' | AnnouncementStatus;

export type OfficialNotice = {
  fileName: string;
  sizeKb: number;
  /** ISO 8601 date. */
  uploadedOn: string;
};

/**
 * An announcement as the developer manages it: the public record plus the publishing choices.
 * A draft has empty `startDate` and `endDate` until they are chosen. A hazard may keep an empty
 * `endDate`: it stays until someone removes it.
 *
 * Every announcement owns exactly one pin on the public traffic map. Its type, `mapName`, `lat`,
 * `lng`, dates and `showOnMap` are the map pin; the Map pins page edits these same fields.
 */
export type StaffAnnouncement = Omit<Announcement, 'status'> & {
  status: StaffAnnouncementStatus;
  /** Name on the public map. */
  mapName: string;
  /** Whether the pin is visible on the public map. */
  showOnMap: boolean;
  notice: OfficialNotice | null;
  /** Oldest first. */
  history: StaffHistoryEntry[];
};

/** How the public traffic map classes an announcement's pin. A construction announcement is a worksite. */
export type MapItemKind = 'closure' | 'worksite' | 'hazard';

export type ProgressState = 'draft' | 'scheduled' | 'published';

export type ProgressPhoto = {
  id: string;
  fileName: string;
  /** What the photo shows: the caption on the station page and its text for screen readers. Needed before the update can be published. */
  alt: string;
};

/**
 * A station progress update. Published updates are the timeline on the station page, and the
 * latest published one with a `percent` sets the station's progress and current stage there.
 */
export type StaffProgressUpdate = {
  id: string;
  title: string;
  stationCode: StationCode;
  /** The build stage the station is in, one of the six stages on the station page. */
  stage: StationStageId;
  /** What happened. */
  body: string;
  state: ProgressState;
  author: string;
  /** Publish date, or the day a scheduled update goes live. Empty for a draft. */
  date: string;
  photos: ProgressPhoto[];
  /** Whole-station completion after this update, 0 to 100. Null: the update does not set it. */
  percent: number | null;
  /** ISO 8601 date-time of the last save. */
  savedAt: string;
};
