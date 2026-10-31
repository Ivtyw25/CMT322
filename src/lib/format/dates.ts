const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Short date as the site writes it: "30 Nov 2026". Month-only input ("2027-07") gives "Jul 2027".
 * Done by hand so the server and the browser always agree.
 */
export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  const monthName = MONTHS[Number(month) - 1];
  if (!year || !monthName) return iso;
  return day ? `${Number(day)} ${monthName} ${year}` : `${monthName} ${year}`;
}

/** "3 to 7 Nov 2026", "20 Oct to 30 Nov 2026" or "5 Oct 2026 to Feb 2027". Month-only ends are fine. */
export function formatDateRange(start: string, end: string): string {
  const [startYear, startMonth, startDay] = start.split('-');
  const [endYear, endMonth, endDay] = end.split('-');
  if (startYear !== endYear) return `${formatDate(start)} to ${formatDate(end)}`;
  if (startMonth === endMonth && startDay && endDay) {
    return startDay === endDay ? formatDate(end) : `${Number(startDay)} to ${formatDate(end)}`;
  }
  const monthName = MONTHS[Number(startMonth) - 1];
  const startShort = startDay ? `${Number(startDay)} ${monthName}` : monthName;
  return `${startShort} to ${formatDate(end)}`;
}
