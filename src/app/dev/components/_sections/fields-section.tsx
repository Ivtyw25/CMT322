import { Mail } from 'lucide-react';
import { devCopy } from '@/content/dev';
import { uiCopy } from '@/content/ui';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { FileUpload } from '@/components/ui/file-upload';
import { PasswordInput } from '@/components/ui/password-input';
import { RadioCard } from '@/components/ui/radio-card';
import { Select } from '@/components/ui/select';
import { TextInput } from '@/components/ui/text-input';
import { Textarea } from '@/components/ui/textarea';
import { DemoSearchInput } from '@/app/dev/components/_parts/demo-search-input';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const { samples, states, traffic } = devCopy;
const errorText = uiCopy.form.errors.ticketIdInvalid;
const columnClass = 'w-full sm:w-80';

export function FieldsSection() {
  return (
    <GallerySection id="form-fields">
      <Specimen caption={traffic.searchCaption}>
        <DemoSearchInput />
      </Specimen>
      <Specimen
        caption={`${states.default}, ${states.hover}, ${states.focus}, ${states.filled}`}
        className="gap-6"
      >
        <Field label={samples.fieldLabel} className={columnClass}>
          <TextInput name="default" placeholder={samples.fieldPlaceholder} />
        </Field>
        <Field label={samples.fieldLabel} className={columnClass}>
          <TextInput
            name="hover"
            placeholder={samples.fieldPlaceholder}
            className="[&_input]:border-gray-400"
          />
        </Field>
        <Field label={samples.fieldLabel} className={columnClass}>
          <TextInput
            name="focus"
            placeholder={samples.fieldPlaceholder}
            className="[&_input]:border-primary-600 [&_input]:shadow-focus"
          />
        </Field>
        <Field label={samples.fieldLabel} className={columnClass}>
          <TextInput name="filled" defaultValue={samples.fieldValue} />
        </Field>
      </Specimen>
      <Specimen
        caption={`${states.error}, ${states.disabled}, ${states.readOnly}`}
        className="gap-6"
      >
        <Field label={samples.fieldLabel} error={errorText} className={columnClass}>
          <TextInput name="error" defaultValue="MLC-26" />
        </Field>
        <Field label={samples.fieldLabel} className={columnClass}>
          <TextInput name="disabled" defaultValue={samples.fieldValue} disabled />
        </Field>
        <Field label={samples.fieldLabel} className={columnClass}>
          <TextInput name="readonly" defaultValue={samples.fieldValue} readOnly />
        </Field>
      </Specimen>
      <Specimen
        caption={`${states.withHint}, ${states.optional}, ${states.leadingIcon}, ${states.passwordToggle}`}
        className="gap-6"
      >
        <Field label={samples.fieldLabel} hint={samples.fieldHint} className={columnClass}>
          <TextInput name="hint" placeholder={samples.fieldPlaceholder} />
        </Field>
        <Field label={samples.optionalLabel} optional className={columnClass}>
          <TextInput name="optional" type="tel" />
        </Field>
        <Field label={samples.emailLabel} hideLabel className={columnClass}>
          <TextInput
            name="email"
            type="email"
            leadingIcon={<Mail className="size-4.5" />}
            defaultValue="meiling.tan@example.com"
          />
        </Field>
        <Field label={samples.passwordLabel} className={columnClass}>
          <PasswordInput name="password" defaultValue="secret-value" />
        </Field>
      </Specimen>
      <Specimen
        caption={`${states.normal}, ${states.nearLimit}, ${states.overLimit}`}
        className="gap-6"
      >
        <Field label={samples.textareaLabel} className={columnClass}>
          <Textarea name="normal" maxCharacters={500} defaultValue={samples.textareaValue} />
        </Field>
        <Field label={samples.textareaLabel} className={columnClass}>
          <Textarea name="near" maxCharacters={90} defaultValue={samples.textareaValue} />
        </Field>
        <Field
          label={samples.textareaLabel}
          error={uiCopy.form.errors.tooLong(60)}
          className={columnClass}
        >
          <Textarea name="over" maxCharacters={60} defaultValue={samples.textareaValue} />
        </Field>
      </Specimen>
      <Specimen caption={samples.selectLabel}>
        <Field label={samples.selectLabel} className={columnClass}>
          <Select
            name="category"
            options={samples.categoryOptions.map((label) => ({ value: label, label }))}
          />
        </Field>
      </Specimen>
      <Specimen
        caption={`${states.unchecked}, ${states.checked}, ${states.error}, ${states.disabled}`}
        className="gap-6"
      >
        <Checkbox name="unchecked" label={samples.checkboxLabel} />
        <Checkbox name="checked" label={samples.checkboxLabel} defaultChecked />
        <Checkbox
          name="error"
          label={samples.checkboxLabel}
          error={uiCopy.form.errors.consentRequired}
        />
        <Checkbox name="disabled" label={samples.checkboxLabel} disabled />
      </Specimen>
      <Specimen caption={`${states.unselected}, ${states.selected}`}>
        <fieldset className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
          <legend className="sr-only">{samples.fieldLabel}</legend>
          {samples.radioCards.map((label, index) => (
            <RadioCard
              key={label}
              name="type"
              value={label}
              label={label}
              defaultChecked={index === 0}
            />
          ))}
        </fieldset>
      </Specimen>
      <Specimen caption={devCopy.labels.errorOnNavy} surface="navy">
        <Field
          label={samples.emailLabel}
          hideLabel
          tone="onNavy"
          error={uiCopy.form.errors.emailInvalid}
          className={columnClass}
        >
          <TextInput name="navy" type="email" defaultValue="meiling" />
        </Field>
      </Specimen>
      <Specimen caption={states.upload}>
        <FileUpload maxFiles={3} maxMegabytes={5} className="w-full sm:w-96" />
      </Specimen>
    </GallerySection>
  );
}
