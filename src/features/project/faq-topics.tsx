'use client';

import { House, Landmark, Signpost, TrainFront, type LucideIcon } from 'lucide-react';
import { LinkCard } from '@/components/ui/link-card';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import type { FaqAudience, FaqCategory, FaqCategoryId } from '@/data/models/faq';

export type AudienceChoice = 'everyone' | FaqAudience;

const { topics: copy } = projectCopy.faq;

const topicIcons: Record<FaqCategoryId, LucideIcon> = {
  'getting-around': Signpost,
  'living-near': House,
  land: Landmark,
  'the-line': TrainFront,
};

const audienceOptions = (Object.keys(copy.audiences) as AudienceChoice[]).map((value) => ({
  value,
  label: copy.audiences[value],
}));

export function topicsForAudience(
  categories: readonly FaqCategory[],
  audience: AudienceChoice,
): FaqCategory[] {
  return categories.filter(
    (category) => audience === 'everyone' || category.audiences.includes(audience),
  );
}

type FaqTopicsProps = {
  categories: readonly FaqCategory[];
  /** How many questions each topic holds. */
  counts: Readonly<Record<string, number>>;
  audience: AudienceChoice;
  onAudienceChange: (audience: AudienceChoice) => void;
  /** The topic whose questions are showing. */
  activeTopic: string | null;
};

/** The audience switch and the topic cards it filters. Cards are links to `?topic=`. */
export function FaqTopics({
  categories,
  counts,
  audience,
  onAudienceChange,
  activeTopic,
}: FaqTopicsProps) {
  return (
    <div className="flex flex-col gap-4">
      <SegmentedControl
        legend={copy.audienceLabel}
        options={audienceOptions}
        value={audience}
        onValueChange={onAudienceChange}
        orientation="adaptive"
      />
      <ul className="grid gap-4 md:grid-cols-2">
        {topicsForAudience(categories, audience).map((category) => {
          const Icon = topicIcons[category.id];
          return (
            <li key={category.id} className="flex">
              <LinkCard
                href={routes.project.faqTopic(category.id)}
                title={category.label}
                selected={activeTopic === category.id}
                className="grid w-full grid-cols-[2.25rem_1fr] content-start gap-x-3 gap-y-1 rounded-xl p-4"
                media={
                  <span
                    aria-hidden
                    className="row-span-3 flex size-9 items-center justify-center rounded-lg bg-primary-50 text-primary-700"
                  >
                    <Icon className="size-4.5" />
                  </span>
                }
              >
                <div className="flex flex-col gap-1">
                  <p className="type-body-xs text-gray-500">
                    {copy.count(counts[category.id] ?? 0)}
                  </p>
                  <p className="type-body-s text-gray-600">{category.summary}</p>
                </div>
              </LinkCard>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
