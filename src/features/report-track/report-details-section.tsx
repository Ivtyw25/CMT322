'use client';

import { Field } from '@/components/ui/field';
import { RadioCard } from '@/components/ui/radio-card';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import { Textarea } from '@/components/ui/textarea';
import { reportTrackCopy } from '@/content/report-track';
import type { ReportCategory } from '@/data/models/ticket';
import { DocsSectionHeading } from '@/features/project/docs-section';
import type { ReportSectionProps } from './report-section-props';
import { reportFieldId } from './report-values';

const { type, category, details } = reportTrackCopy.report;

const CATEGORY_HINT_ID = 'report-category-hint';

type TypeSectionProps = ReportSectionProps & { categories: readonly ReportCategory[] };

/** "What are you reporting?": the three type cards and the category select. */
export function ReportTypeSection({
  values,
  update,
  errorOf,
  onBlur,
  categories,
}: TypeSectionProps) {
  const chosen = categories.find((entry) => entry.id === values.categoryId);
  const categoryError = errorOf('category');
  return (
    <section aria-labelledby="type" className="flex flex-col gap-5">
      <DocsSectionHeading id="type" title={type.legend} />
      <div role="radiogroup" aria-labelledby="type" className="grid gap-3 md:grid-cols-3">
        {type.options.map((option) => (
          <RadioCard
            key={option.id}
            name="report-type"
            value={option.id}
            label={option.label}
            description={option.hint}
            checked={values.type === option.id}
            onChange={() => update({ type: option.id })}
          />
        ))}
      </div>
      <div id={reportFieldId('category')} className="group scroll-mt-35">
        <Field label={category.label} error={categoryError ?? undefined}>
          <Select
            name="category"
            value={values.categoryId}
            onChange={(event) =>
              update({
                categoryId: event.target.value as ReportSectionProps['values']['categoryId'],
              })
            }
            onBlur={() => onBlur('category')}
            aria-describedby={chosen && !categoryError ? CATEGORY_HINT_ID : undefined}
            options={[
              { value: '', label: category.placeholder },
              ...categories.map((entry) => ({ value: entry.id, label: entry.label })),
            ]}
          />
        </Field>
        {chosen ? (
          <p
            id={CATEGORY_HINT_ID}
            className="mt-1.5 type-body-xs text-gray-500 not-group-focus-within:sr-only"
          >
            {chosen.hint}
          </p>
        ) : null}
      </div>
    </section>
  );
}

/** "Details": subject and description. */
export function ReportDetailsSection({ values, update, errorOf, onBlur }: ReportSectionProps) {
  return (
    <section
      aria-labelledby="details"
      className="flex flex-col gap-5 border-t border-gray-200 pt-10"
    >
      <DocsSectionHeading id="details" title={details.title} />
      <div id={reportFieldId('subject')} className="scroll-mt-35">
        <Field label={details.subject.label} error={errorOf('subject') ?? undefined}>
          <TextInput
            name="subject"
            value={values.subject}
            maxLength={details.subject.max}
            placeholder={details.subject.placeholder}
            onChange={(event) => update({ subject: event.target.value })}
            onBlur={() => onBlur('subject')}
          />
        </Field>
      </div>
      <div id={reportFieldId('description')} className="scroll-mt-35">
        <Field label={details.description.label} error={errorOf('description') ?? undefined}>
          <Textarea
            name="description"
            value={values.description}
            maxCharacters={details.description.max}
            placeholder={details.description.placeholder}
            onChange={(event) => update({ description: event.target.value })}
            onBlur={() => onBlur('description')}
          />
        </Field>
      </div>
    </section>
  );
}
