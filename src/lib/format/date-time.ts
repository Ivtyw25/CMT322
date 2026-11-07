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

const clockTime = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kuala_Lumpur',
});

/** "14:41": 24-hour, Malaysia time. */
export function formatClockTime(iso: string): string {
  return clockTime.format(new Date(iso));
}

/** The Malaysia calendar date of an ISO date-time, as "YYYY-MM-DD". */
export function isoDateOf(iso: string): string {
  return new Date(iso).toLocaleDateString('sv-SE', { timeZone: 'Asia/Kuala_Lumpur' });
}

const fullDateTime = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
  timeZone: 'Asia/Kuala_Lumpur',
});

/** "28 Oct 2026, 14:41": 24-hour, Malaysia time. */
export function formatFullDateTime(iso: string): string {
  return fullDateTime.format(new Date(iso));
}
