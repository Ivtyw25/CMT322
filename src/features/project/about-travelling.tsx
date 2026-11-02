import { InfoList } from '@/components/ui/info-list';
import { projectCopy } from '@/content/project';

/** Frequency, hours, interchanges and access as name/value rows. */
export function AboutTravelling() {
  return (
    <InfoList
      items={projectCopy.about.travelling.rows.map((row) => ({
        id: row.label,
        label: row.label,
        value: row.value,
      }))}
    />
  );
}
