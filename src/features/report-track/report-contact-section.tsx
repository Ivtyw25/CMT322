'use client';

import { Mail } from 'lucide-react';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { reportTrackCopy } from '@/content/report-track';
import { DocsSectionHeading } from '@/components/patterns/docs-section';
import type { ReportSectionProps } from './report-section-props';
import { reportFieldId } from './report-values';

const { contact } = reportTrackCopy.report;

/** "Your contact details": name and email come from the account. */
export function ReportContactSection({ values, update, errorOf, onBlur }: ReportSectionProps) {
  return (
    <section
      aria-labelledby="contact"
      className="flex flex-col gap-5 border-t border-gray-200 pt-10"
    >
      <div className="flex flex-col gap-1.5">
        <DocsSectionHeading id="contact" title={contact.title} />
        <p className="type-body-s text-gray-600">{contact.lede}</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div id={reportFieldId('name')} className="scroll-mt-35">
          <Field label={contact.fullName.label} error={errorOf('name') ?? undefined}>
            <TextInput
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => update({ name: event.target.value })}
              onBlur={() => onBlur('name')}
            />
          </Field>
        </div>
        <div id={reportFieldId('phone')} className="scroll-mt-35">
          <Field label={contact.phone.label} optional error={errorOf('phone') ?? undefined}>
            <TextInput
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              placeholder={contact.phone.placeholder}
              onChange={(event) => update({ phone: event.target.value })}
              onBlur={() => onBlur('phone')}
            />
          </Field>
        </div>
      </div>
      <div id={reportFieldId('email')} className="scroll-mt-35">
        <Field label={contact.email.label} error={errorOf('email') ?? undefined}>
          <TextInput
            name="email"
            type="email"
            autoComplete="email"
            leadingIcon={<Mail className="size-4" />}
            value={values.email}
            onChange={(event) => update({ email: event.target.value })}
            onBlur={() => onBlur('email')}
          />
        </Field>
      </div>
    </section>
  );
}
