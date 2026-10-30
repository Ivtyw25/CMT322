import { projectCopy } from '@/content/project';
import { CopyTabs } from './copy-tabs';

const { benefits } = projectCopy.about;

/** Who the line helps, one short paragraph per audience. */
export function AboutBenefits() {
  return (
    <CopyTabs
      label={benefits.tabsLabel}
      tabs={benefits.tabs.map((tab) => ({
        id: tab.id,
        label: tab.label,
        content: <p className="max-w-170 type-body-m text-gray-700">{tab.body}</p>,
      }))}
    />
  );
}
