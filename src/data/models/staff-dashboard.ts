import type { TicketId } from './ticket';

/** Dashboard figures that are not derived from the ticket list (Figma 113:4668). */
export type AuthorityDashboard = {
  /** e.g. "29 Oct 2026, 10:30". */
  updatedAt: string;
  newToday: { count: number; moreThanYesterday: number };
  pastTarget: number;
  averageDaysToResolve: number;
  needsReply: {
    ticketId: TicketId;
    /** How long it has waited, e.g. "40 min". */
    waiting: string;
    overdue: boolean;
  }[];
  openByArea: { areaLabel: string; count: number }[];
  byType: { type: 'complaint' | 'feedback' | 'inquiry'; count: number }[];
  recentActivity: { id: string; text: string; when: string }[];
};

export type AttentionKind = 'alert' | 'announcement' | 'map' | 'progress';
/** The staff portal section that deals with the item. */
export type AttentionSection = 'announcements' | 'map-items' | 'progress';
export type AttentionTone = 'warning' | 'info' | 'neutral';

/** Dashboard figures for the project developer (Figma 116:4824). */
export type DeveloperDashboard = {
  updatedAt: string;
  activeAnnouncements: { count: number; endingWithinWeek: number };
  scheduled: { count: number; nextStarts: string };
  liveMapItems: { closures: number; worksites: number; hazards: number };
  lastProgressUpdate: { date: string; title: string };
  attention: {
    id: string;
    kind: AttentionKind;
    section: AttentionSection;
    title: string;
    hint: string;
    tone: AttentionTone;
  }[];
  assignedTicketIds: TicketId[];
};
