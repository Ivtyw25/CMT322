/**
 * Notification bar, Figma 4:750 (desktop) and 127:5800 (mobile).
 * The notices themselves are records (getSiteNotice() in @/data/api/announcements).
 */
export const notificationCopy = {
  /** Desktop shows the title inline as a sentence; mobile shows it as a heading without the stop. */
  titleInline: (title: string) => `${title}.`,
  viewDetails: 'View details',
  /** Visually hidden end of the link name, e.g. "View details: Road closure tonight". */
  viewDetailsContext: (title: string) => `: ${title}`,
  dismiss: 'Dismiss this notice',
} as const;
