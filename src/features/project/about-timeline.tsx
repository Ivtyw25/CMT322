import { Callout } from '@/components/ui/callout';
import { Timeline, type TimelineEntry } from '@/components/patterns/timeline';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { Milestone } from '@/data/models/construction-update';
import { formatDate } from '@/lib/format/dates';

/** "Feb to May 2026": the first month drops its year when both fall in the same year. */
function milestoneDate(milestone: Milestone): string {
  const start = formatDate(milestone.date);
  if (!milestone.endDate) return start;
  const end = formatDate(milestone.endDate);
  const sameYear = milestone.date.slice(0, 4) === milestone.endDate.slice(0, 4);
  return uiCopy.time.range(sameYear ? (start.split(' ')[0] ?? start) : start, end);
}

/** Milestones to 2031 as a vertical timeline, past ones filled. `today` is an ISO date. */
export function AboutTimeline({
  milestones,
  today,
}: {
  milestones: readonly Milestone[];
  today: string;
}) {
  const thisMonth = today.slice(0, 7);
  const entries: TimelineEntry[] = milestones.map((milestone) => ({
    id: milestone.id,
    date: milestoneDate(milestone),
    text: milestone.longTitle,
    state: milestone.date <= thisMonth ? 'past' : 'future',
  }));
  return (
    <div className="flex flex-col gap-6">
      {entries.length > 0 ? <Timeline items={entries} /> : null}
      <Callout tone="info">{projectCopy.about.timeline.note}</Callout>
    </div>
  );
}
