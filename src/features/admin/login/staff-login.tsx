'use client';

import { CircleAlert, Inbox, Mail, Megaphone, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/layout/logo';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { TextInput } from '@/components/ui/text-input';
import { routes } from '@/config/routes';
import { adminCopy } from '@/content/admin';
import type { StaffMember, StaffRole } from '@/data/models/staff';
import { useStaffSession } from '@/lib/staff-session';

const copy = adminCopy.login;

const roleIcon: Record<StaffRole, LucideIcon> = { authority: Inbox, developer: Megaphone };

type StaffLoginProps = {
  authority: StaffMember;
  developer: StaffMember;
};

/** Staff log in (Figma 113:4621). The mock accepts the authority email with any password. */
export function StaffLogin({ authority, developer }: StaffLoginProps) {
  const router = useRouter();
  const { status, signIn } = useStaffSession();
  const [email, setEmail] = useState(authority.email ?? '');
  const [password, setPassword] = useState<string>(copy.prototypePassword);
  const [touched, setTouched] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Already signed in (another tab, or a return visit): go straight to the dashboard.
  useEffect(() => {
    if (status === 'signed-in') router.replace(routes.admin.dashboard);
  }, [status, router]);

  const emailError = touched && email.trim() === '' ? copy.errors.emailRequired : undefined;
  const passwordError = touched && password === '' ? copy.errors.passwordRequired : undefined;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (email.trim() === '' || password === '') return;
    if (email.trim().toLowerCase() !== authority.email?.toLowerCase()) {
      setFormError(copy.errors.invalid);
      return;
    }
    setFormError(null);
    signIn(authority.id);
  }

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-primary-900 px-5 py-10"
    >
      <div className="flex w-full max-w-110 flex-col gap-5 rounded-3xl bg-surface p-6 sm:p-10">
        <Logo href={routes.admin.login} label={adminCopy.shell.brandLabel} />
        <div className="flex flex-col gap-1.5">
          <h1 className="type-heading-s text-gray-900">{copy.title}</h1>
          <p className="type-body-s text-gray-600">{copy.intro}</p>
        </div>

        <form noValidate onSubmit={submit} className="flex flex-col gap-5">
          <Field label={copy.emailLabel} error={emailError}>
            <TextInput
              type="email"
              name="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              leadingIcon={<Mail className="size-4.5" />}
            />
          </Field>
          <Field label={copy.passwordLabel} error={passwordError}>
            <PasswordInput
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          {formError ? (
            <p role="alert" className="flex items-start gap-1.5 type-body-s text-danger-700">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {formError}
            </p>
          ) : null}
          <Button type="submit" fullWidth>
            {copy.submit}
          </Button>
        </form>

        <p className="flex items-start gap-2.5 rounded-lg bg-gray-50 px-3.5 py-3 type-body-s text-gray-700">
          <ShieldCheck aria-hidden className="mt-0.5 size-4.5 shrink-0 text-primary-700" />
          {copy.codeNote}
        </p>

        <section
          aria-labelledby="staff-roles-heading"
          className="flex flex-col gap-2.5 border-t border-gray-200 pt-5"
        >
          <h2 id="staff-roles-heading" className="type-body-s-semibold text-gray-900">
            {copy.rolesTitle}
          </h2>
          <ul className="flex flex-col gap-2.5">
            {copy.roleList.map((role) => {
              const Icon = roleIcon[role.role];
              return (
                <li key={role.role} className="flex items-start gap-2.5">
                  <Icon aria-hidden className="mt-0.5 size-4.5 shrink-0 text-primary-700" />
                  <div className="flex min-w-0 flex-col">
                    <p className="type-body-s-medium text-gray-900">{role.title}</p>
                    <p className="type-body-xs text-gray-600">{role.summary}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <button
          type="button"
          onClick={() => signIn(developer.id)}
          className="hit-area cursor-pointer self-start type-body-xs-medium text-primary-600 transition-colors duration-(--duration-fast) hover:text-primary-800"
        >
          {copy.prototypeDeveloper}
        </button>
      </div>
      <p className="max-w-110 text-center type-body-xs text-static-on-navy-200">
        {copy.publicOnly}
      </p>
    </main>
  );
}
