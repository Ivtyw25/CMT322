/** A notice for the notification bar under the header. The bar shows one at a time. */
export type SiteNotice = {
  id: string;
  /** Short title without a full stop, e.g. "Road closure tonight". */
  title: string;
  /** One sentence with the road, the change and the time. */
  message: string;
  /** The announcement that "View details" is about. */
  announcementId: string;
  /** ISO 8601 date-times. The notice is published between these. */
  showFrom: string;
  showUntil: string;
};
