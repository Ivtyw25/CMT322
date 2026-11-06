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
    <div className="divide-y divide-gray-200">
      <div className="space-y-3 py-4">
        <div className="flex justify-between gap-3">
          <p className="type-body-s-semibold">{copy.password.label}</p>
          <Button
            id="change-password"
            variant="ghost"
            disabled={editing}
            onClick={() => setEditing(true)}
          >
            {copy.password.change}
          </Button>
        </div>
        {editing ? (
          <form
            className="space-y-4"
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
          <>
            <p>{accountUiCopy.passwordDots}</p>
            <p className="type-body-s text-gray-500">
              {copy.password.lastChanged(
                changed ? accountUiCopy.justNow : profile.passwordLastChanged,
              )}
            </p>
          </>
        )}
      </div>
      <div className="space-y-2 py-4">
        <p className="type-body-s-semibold">{copy.google.label}</p>
        <p className="type-body-m wrap-anywhere">
          {connected ? profile.googleEmail : copy.google.notConnected}
        </p>
        <Button
          variant="secondary"
          onClick={() => (connected ? setDialog('google') : setConnected(true))}
        >
          {connected ? copy.google.disconnect : copy.google.connect}
        </Button>
      </div>
      <div className="space-y-3 py-4">
        <p className="type-body-s-semibold">{copy.devices.label}</p>
        {profile.devices
          .filter((device) => device.current || otherDevices)
          .map((device) => (
            <p className="type-body-s text-gray-600" key={device.name}>
              {device.current
                ? copy.devices.current(device.name)
                : copy.devices.also(device.name, device.lastActive)}
            </p>
          ))}
        {otherDevices ? (
          <Button variant="secondary" onClick={() => setDialog('devices')}>
            {copy.devices.logOutOthers}
          </Button>
        ) : (
          <p className="type-body-s text-gray-600">{copy.devices.none}</p>
        )}
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
