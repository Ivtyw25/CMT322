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
