/** "07:00" gives "7 am", "22:30" gives "10:30 pm", "00:00" gives "12 am". */
export function formatHour(time: string): string {
  const [hourPart, minutePart] = time.split(':');
  const hour = Number(hourPart);
  const minute = Number(minutePart);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return time;
  const suffix = hour < 12 ? 'am' : 'pm';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return minute === 0
    ? `${hour12} ${suffix}`
    : `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

/** A daily working window as two parts for the caller to join: "7 am" and "7 pm". */
export function formatHourRange(from: string, to: string): [from: string, to: string] {
  return [formatHour(from), formatHour(to)];
}
