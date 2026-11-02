const shortDateTime = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kuala_Lumpur',
});

/** "29 Oct, 14:41": 24-hour, Malaysia time. */
export function formatShortDateTime(iso: string): string {
  return shortDateTime.format(new Date(iso));
}
