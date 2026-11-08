export type AttentionKind = 'alert' | 'announcement' | 'map' | 'progress';
/** The staff portal section that deals with the item. */
export type AttentionSection = 'announcements' | 'map-items' | 'progress';
export type AttentionTone = 'warning' | 'info' | 'neutral';

/** Dashboard figures for the project developer (Figma 116:4824). */
export type DeveloperDashboard = {
  activeAnnouncements: { count: number };
  scheduled: { count: number };
  liveMapItems: { closures: number; worksites: number; hazards: number };
  lastProgressUpdate: { date: string };
  attention: {
    id: string;
    kind: AttentionKind;
    section: AttentionSection;
    title: string;
    hint: string;
    tone: AttentionTone;
  }[];
};
