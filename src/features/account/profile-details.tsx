'use client';

import { useRef, useState } from 'react';
import { accountCopy } from '@/content/account';
import { accountUiCopy } from '@/content/account-ui';
import { uiCopy } from '@/content/ui';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { Select } from '@/components/ui/select';
import { profileRow, profileRowAction } from './profile-card';
import type { Area } from '@/data/models/area';
import { authDelay, validEmail } from '@/lib/auth/auth';
import { Check } from 'lucide-react';
import { saveProfile, type ProfileChanges } from '@/lib/profile/profile';

type DetailKey = 'name' | 'email' | 'phone' | 'homeArea';
type Details = Record<DetailKey, string>;

export function ProfileDetails({
  details,
  areas,
  verified,
  announce,
}: {
  details: Details;
  areas: Area[];
  verified: boolean;
  announce: (message: string) => void;
}) {
  const copy = accountCopy.account.details;
  const [editing, setEditing] = useState<DetailKey | null>(null);
  const [languageEditing, setLanguageEditing] = useState(false);
  const languageTrigger = useRef<HTMLButtonElement>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const triggers = useRef<Partial<Record<DetailKey, HTMLButtonElement | null>>>({});

  function close() {
    const field = editing;
    setEditing(null);
    setError('');
    if (field) requestAnimationFrame(() => triggers.current[field]?.focus());
  }
  function validate(field: DetailKey) {
    if (field === 'name' && (value.trim().length < 2 || value.trim().length > 80))
      return copy.errors.nameRequired;
    if (field === 'email' && !validEmail(value)) return copy.errors.emailInvalid;
    if (
      field === 'phone' &&
      value.trim() &&
      (!/^[+\d\s-]+$/.test(value) || !/^\d{9,12}$/.test(value.replace(/\D/g, '')))
    )
      return copy.errors.phoneInvalid;
    return '';
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!editing || pending) return;
    const message = validate(editing);
    setError(message);
    if (message) return;
    setPending(true);
    await authDelay(400);
    saveProfile({ [editing]: value.trim() } as ProfileChanges);
    setPending(false);
    close();
    announce(copy.edit.saved);
  }

  return (
    <div>
      {(['name', 'email', 'phone', 'homeArea'] as const).map((field) => (
        <div key={field} className={profileRow}>
          <div className="contents">
            <span className="type-body-s-medium">{copy.rows[field].label}</span>
            <Button
              ref={(node) => {
                triggers.current[field] = node;
              }}
              variant="ghost"
              className={profileRowAction}
              disabled={editing !== null || languageEditing}
              onClick={() => {
                setValue(
                  field === 'homeArea'
                    ? (areas.find(
                        (area) => area.id === details[field] || area.label.includes(details[field]),
                      )?.id ??
                        areas[0]?.id ??
                        '')
                    : details[field],
                );
                setEditing(field);
              }}
            >
              {uiCopy.actions.edit}
            </Button>
          </div>
          {editing === field ? (
            <form
              onSubmit={submit}
              onKeyDown={(event) => {
                if (event.key === 'Escape' && !pending) close();
              }}
              className="col-span-2 row-start-2 mt-2 space-y-3 md:col-start-2"
              noValidate
            >
              <Field label={copy.edit.fields[field]} error={error || undefined}>
                {field === 'homeArea' ? (
                  <Select
                    autoFocus
                    options={areas.map((area) => ({ value: area.id, label: area.label }))}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    disabled={pending}
                  />
                ) : (
                  <TextInput
                    autoFocus
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={value}
                    readOnly={pending}
                    onChange={(event) => setValue(event.target.value)}
                    onBlur={() => setError(validate(field))}
                  />
                )}
              </Field>
              <div className="flex gap-2">
                <Button type="submit" loading={pending}>
                  {copy.edit.save}
                </Button>
                <Button variant="secondary" disabled={pending} onClick={close}>
                  {copy.edit.cancel}
                </Button>
              </div>
            </form>
          ) : (
            <div className="col-span-2 row-start-2 min-w-0 wrap-anywhere md:col-span-1 md:col-start-2 md:row-start-1">
              <p className="type-body-s text-gray-900">
                {field === 'homeArea'
                  ? (areas.find((area) => area.id === details[field])?.label ?? details[field])
                  : details[field] || copy.rows.phone.empty}
                {field === 'email' ? (
                  <span
                    className={`ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 align-middle type-body-xs-medium ${verified ? 'bg-success-50 text-success-700' : 'bg-gray-100 text-gray-700'}`}
                  >
                    {verified ? <Check aria-hidden className="size-3" /> : null}
                    {verified ? copy.rows.email.verified : copy.rows.email.unverified}
                  </span>
                ) : null}
              </p>
              {field === 'phone' || field === 'homeArea' ? (
                <p className="type-body-xs text-gray-500">{copy.rows[field].hint}</p>
              ) : null}
            </div>
          )}
        </div>
      ))}
      <div className={profileRow}>
        <p className="type-body-s-medium">{copy.rows.language.label}</p>
        <Button
          ref={languageTrigger}
          variant="ghost"
          className={profileRowAction}
          disabled={editing !== null || languageEditing}
          onClick={() => setLanguageEditing(true)}
        >
          {uiCopy.actions.change}
        </Button>
        {languageEditing ? (
          <div className="col-span-2 space-y-3 md:col-start-2">
            <Field label={copy.edit.fields.language} hint={accountUiCopy.languageSoon}>
              <Select
                autoFocus
                defaultValue="en"
                options={[
                  { value: 'en', label: copy.languages.en },
                  { value: 'ms', label: copy.languages.ms, disabled: true },
                ]}
              />
            </Field>
            <Button
              variant="secondary"
              onClick={() => {
                setLanguageEditing(false);
                requestAnimationFrame(() => languageTrigger.current?.focus());
              }}
            >
              {uiCopy.actions.cancel}
            </Button>
          </div>
        ) : (
          <div className="col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1">
            <p className="type-body-s text-gray-900">{copy.languages.en}</p>
            <p className="type-body-xs text-gray-500">{accountUiCopy.languageSoon}</p>
          </div>
        )}
      </div>
    </div>
  );
}
