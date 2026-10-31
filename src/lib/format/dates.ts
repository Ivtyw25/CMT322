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

/**
 * A date range as two parts for the caller to join ("to"): "12 Oct 2026" and "Jul 2027", or
 * "26 Oct" and "22 Nov 2026". The year is written once when both dates share it. An end with
 * only a month ("2027-07") has no day.
 */
export function formatDateRange(start: string, end: string): [from: string, to: string] {
  const startYear = start.split('-')[0];
  const endYear = end.split('-')[0];
  const to = formatDate(end);
  if (startYear !== endYear) return [formatDate(start), to];
  const [, month, day] = start.split('-');
  const monthName = MONTHS[Number(month) - 1];
  return [monthName ? `${Number(day)} ${monthName}` : start, to];
}
