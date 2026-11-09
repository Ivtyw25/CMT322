import type { Announcement, AnnouncementStatus } from './announcement';

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
 * `lng` and dates are the map pin; the Map pins page edits these same fields. `showOnMap` follows
 * from the status: a published announcement's pin is always on the public map.
 */
export type StaffAnnouncement = Omit<Announcement, 'status'> & {
  status: StaffAnnouncementStatus;
  /** Name on the public map. */
  mapName: string;
  /** Whether the pin is on the public map: true once published. */
  showOnMap: boolean;
  notice: OfficialNotice | null;
  /** Oldest first. */
  history: StaffHistoryEntry[];
};

/** How the public traffic map classes an announcement's pin. A construction announcement is a worksite. */
export type MapItemKind = 'closure' | 'worksite' | 'hazard';
