'use client';

import { House, Landmark, Signpost, TrainFront, type LucideIcon } from 'lucide-react';
import { LinkCard } from '@/components/ui/link-card';
import { Field } from '@/components/ui/field';
import { MenuSelect } from '@/components/ui/menu-select';
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
  /** The section `h2`, shown on the same row as the audience menu. */
  heading: React.ReactNode;
};

/** The heading row with the audience menu, then the topic cards it filters (links to `?topic=`). */
export function FaqTopics({
  categories,
  counts,
  audience,
  onAudienceChange,
  activeTopic,
  heading,
}: FaqTopicsProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {heading}
        <Field
          label={copy.audienceLabel}
          className="flex-row items-center gap-3 [&>label]:shrink-0 [&>label]:whitespace-nowrap"
        >
          <MenuSelect
            className="w-full min-w-0 sm:w-60"
            value={audience}
            onValueChange={(value) => {
              const choice = audienceOptions.find((option) => option.value === value);
              if (choice) onAudienceChange(choice.value);
            }}
            options={audienceOptions}
          />
        </Field>
      </div>
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
