'use client';

import { useState } from 'react';
import { accountCopy } from '@/content/account';
import { accountUiCopy } from '@/content/account-ui';
import { uiCopy } from '@/content/ui';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/dialog';
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordRules } from '@/components/ui/password-rules';
import { cn } from '@/lib/cn';
import { profileLabel, profileRow, profileRowAction } from './profile-card';
import type { AccountProfile } from '@/data/models/account';
import { authDelay, validPassword } from '@/lib/auth/auth';

export function ProfileSecurity({
  profile,
  announce,
}: {
  profile: AccountProfile;
  announce: (message: string) => void;
}) {
  const copy = accountCopy.account.security;
  const [editing, setEditing] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [error, setError] = useState('');
  const [errorField, setErrorField] = useState<'current' | 'next'>('next');
  const [changed, setChanged] = useState(false);
  const [pending, setPending] = useState(false);
  const [connected, setConnected] = useState(Boolean(profile.googleEmail));
  const [otherDevices, setOtherDevices] = useState(true);
  const [dialog, setDialog] = useState<'google' | 'devices' | null>(null);

  function closeEditor() {
    setEditing(false);
    setCurrent('');
    setNext('');
    setError('');
    requestAnimationFrame(() => document.getElementById('change-password')?.focus());
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    const message =
      current !== 'Mutiara123'
        ? copy.password.errors.currentWrong
        : !validPassword(next)
          ? accountUiCopy.passwordInvalid
          : next === current
            ? copy.password.errors.sameAsOld
            : '';
    setError(message);
    setErrorField(current !== 'Mutiara123' ? 'current' : 'next');
    if (message) return;
    setPending(true);
    await authDelay(400);
    setPending(false);
    setChanged(true);
    closeEditor();
    announce(copy.password.dialog.success);
  }
  function confirm() {
    if (dialog === 'google') {
      setConnected(false);
      announce(copy.google.disconnected);
    } else {
      setOtherDevices(false);
      announce(copy.devices.loggedOutOthers);
    }
    setDialog(null);
  }
  return (
    <div>
      <div className={profileRow}>
        <p className={profileLabel}>{copy.password.label}</p>
        <Button
          id="change-password"
          variant="ghost"
          className={profileRowAction}
          disabled={editing}
          onClick={() => setEditing(true)}
        >
          {copy.password.change}
        </Button>
        {editing ? (
          <form
            className="col-span-2 row-start-3 mt-2 space-y-4 md:col-span-1 md:col-start-2 md:row-start-2"
            onSubmit={submit}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && !pending) closeEditor();
            }}
          >
            <Field
              label={copy.password.dialog.current}
              error={errorField === 'current' ? error || undefined : undefined}
            >
              <PasswordInput
                autoFocus
                autoComplete="current-password"
                value={current}
                readOnly={pending}
                onChange={(event) => setCurrent(event.target.value)}
              />
            </Field>
            <Field
              label={copy.password.dialog.next}
              error={errorField === 'next' ? error || undefined : undefined}
            >
              <PasswordInput
                autoComplete="new-password"
                value={next}
                aria-describedby="profile-password-rules"
                readOnly={pending}
                onChange={(event) => setNext(event.target.value)}
              />
            </Field>
            <PasswordRules id="profile-password-rules" password={next} />
            <div className="flex gap-3">
              <Button type="submit" loading={pending}>
                {copy.password.dialog.submit}
              </Button>
              <Button variant="secondary" disabled={pending} onClick={closeEditor}>
                {uiCopy.actions.cancel}
              </Button>
            </div>
          </form>
        ) : (
          <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1">
            <p className="type-body-s text-gray-900">{accountUiCopy.passwordDots}</p>
            <p className="mt-0.5 type-body-xs text-gray-500">
              {copy.password.lastChanged(
                changed ? accountUiCopy.justNow : profile.passwordLastChanged,
              )}
            </p>
          </div>
        )}
      </div>
      <div className={profileRow}>
        <p className={profileLabel}>{copy.google.label}</p>
        <Button
          variant="ghost"
          className={profileRowAction}
          onClick={() => (connected ? setDialog('google') : setConnected(true))}
        >
          {connected ? copy.google.disconnect : copy.google.connect}
        </Button>
        <div className="col-start-1 row-start-2 flex min-w-0 flex-col gap-3 type-body-s wrap-anywhere text-gray-900 md:col-start-2 md:row-start-1 md:flex-row md:items-center md:gap-2">
          <p>{connected ? profile.googleEmail : copy.google.notConnected}</p>
          {connected ? (
            <p className="min-h-5 type-body-xs text-success-700">{copy.google.connected}</p>
          ) : null}
        </div>
      </div>
      <div className={cn(profileRow, 'grid-cols-1 md:grid-cols-[11.25rem_minmax(0,1fr)_auto]')}>
        <p className={profileLabel}>{copy.devices.label}</p>
        {otherDevices ? (
          <Button
            variant="ghost"
            className={`${profileRowAction} col-start-1 row-span-1 row-start-3 mt-3 justify-self-start md:col-start-3 md:row-span-1 md:row-start-1 md:mt-0 md:justify-self-auto`}
            onClick={() => setDialog('devices')}
          >
            {copy.devices.logOutOthers}
          </Button>
        ) : null}
        <div className="col-start-1 row-start-2 md:col-start-2 md:row-start-1">
          {profile.devices
            .filter((device) => device.current || otherDevices)
            .map((device) => (
              <p
                className="type-body-s text-gray-900 not-first:mt-0.5 not-first:type-body-xs not-first:text-gray-500"
                key={device.name}
              >
                {device.current
                  ? copy.devices.current(device.name)
                  : copy.devices.also(device.name, device.lastActive)}
              </p>
            ))}
          {otherDevices ? null : <p className="type-body-s text-gray-600">{copy.devices.none}</p>}
        </div>
      </div>
      <ConfirmDialog
        open={dialog !== null}
        title={dialog === 'google' ? copy.google.confirm.title : accountUiCopy.devicesTitle}
        body={dialog === 'google' ? copy.google.confirm.body : accountUiCopy.devicesBody}
        confirm={dialog === 'google' ? copy.google.confirm.confirm : copy.devices.logOutOthers}
        onClose={() => setDialog(null)}
        onConfirm={confirm}
      />
    </div>
  );
}
