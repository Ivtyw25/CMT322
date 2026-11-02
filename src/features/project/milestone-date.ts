import { uiCopy } from '@/content/ui';
import type { Milestone } from '@/data/models/construction-update';
import { formatDate } from '@/lib/format/dates';

/** "Feb to May 2026": the first month drops its year when both fall in the same year. */
export function milestoneDate(milestone: Milestone): string {
  const start = formatDate(milestone.date);
  if (!milestone.endDate) return start;
  const end = formatDate(milestone.endDate);
  const sameYear = milestone.date.slice(0, 4) === milestone.endDate.slice(0, 4);
  return uiCopy.time.range(sameYear ? (start.split(' ')[0] ?? start) : start, end);
}
