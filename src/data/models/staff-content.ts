import type { Announcement, AnnouncementStatus } from './announcement';
import type { ConstructionPhase } from './construction-update';
import type { StationCode } from './station';

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
 * A draft has empty `startDate` and `endDate` until they are chosen.
 */
export type StaffAnnouncement = Omit<Announcement, 'status'> & {
  status: StaffAnnouncementStatus;
  showBanner: boolean;
  emailFollowers: boolean;
  showOnMap: boolean;
  notice: OfficialNotice | null;
  /** Oldest first. */
  history: StaffHistoryEntry[];
};

export type MapItemKind = 'closure' | 'worksite' | 'hazard';

/** A pin on the public traffic map, as the map editor lists it. */
export type StaffMapItem = {
  id: string;
  kind: MapItemKind;
  /** Name on the public map. */
  name: string;
  status: 'active' | 'upcoming' | 'ended';
  lat: number;
  lng: number;
  /** ISO 8601 date, or empty. */
  from: string;
  /** ISO 8601 date. Empty: no end date (a hazard stays until someone removes it). */
  to: string;
  /** The announcement the item belongs to. Null for an item without one. */
  announcementId: string | null;
  visible: boolean;
};

export type ProgressState = 'draft' | 'scheduled' | 'published';

export type ProgressPhoto = {
  id: string;
  fileName: string;
  /** Description for screen readers. Needed before the update can be published. */
  alt: string;
};

export type StaffProgressUpdate = {
  id: string;
  title: string;
  stationCode: StationCode;
  phase: ConstructionPhase;
  /** What happened. */
  body: string;
  state: ProgressState;
  author: string;
  /** Publish date, or the day a scheduled update goes live. Empty for a draft. */
  date: string;
  photos: ProgressPhoto[];
  /** Station progress before and after this update. Null: the update does not change it. */
  stationProgress: { from: number; to: number } | null;
  emailFollowers: boolean;
  showOnHome: boolean;
  /** ISO 8601 date-time of the last save. */
  savedAt: string;
};
