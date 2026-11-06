'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { accountCopy } from '@/content/account';
import { accountUiCopy as extra } from '@/content/account-ui';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { Callout } from '@/components/ui/callout';
import { Checkbox } from '@/components/ui/checkbox';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { PasswordInput } from '@/components/ui/password-input';
import { PasswordRules } from '@/components/ui/password-rules';
import { GoogleButton } from '@/components/ui/google-button';
import { useSession } from '@/lib/session';
import { useFieldValidation } from '@/lib/forms/use-field-validation';
import {
  authenticate,
  registerAccount,
  requestReset,
  safeNext,
  authLink,
  authDelay,
  validEmail,
  validPassword,
  rememberEmail,
  recalledEmail,
} from '@/lib/auth/auth';
import { AuthShell } from './auth-shell';

type Mode = 'login' | 'signup' | 'reset';
export function AuthForm({ mode, rawNext }: { mode: Mode; rawNext?: string }) {
  const signup = mode === 'signup';
  const reset = mode === 'reset';
  const copy = reset ? accountCopy.forgotPassword : signup ? accountCopy.signup : accountCopy.login;
  const { status, signIn } = useSession();
  const router = useRouter();
  const next = safeNext(rawNext);
  const [email, setEmail] = useState(reset ? recalledEmail : () => '');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState('');
  const [exists, setExists] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const [resentAt, setResentAt] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const summary = useRef<HTMLHeadingElement>(null);
  const sentHeading = useRef<HTMLHeadingElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const order = reset
    ? (['email'] as const)
    : signup
      ? (['name', 'email', 'password'] as const)
      : (['email', 'password'] as const);
  const validation = useFieldValidation(
    {
      name: () =>
        name.trim().length < 2 || name.trim().length > 80
          ? accountCopy.signup.errors.nameRequired
          : null,
      email: () =>
        !email.trim()
          ? copy.errors.emailRequired
          : !validEmail(email)
            ? copy.errors.emailInvalid
            : exists
              ? extra.exists
              : null,
      password: () =>
        !password
          ? accountCopy.login.errors.passwordRequired
          : signup && !validPassword(password)
            ? extra.passwordInvalid
            : null,
    },
    order,
  );
  const errors = validation.visibleErrors();
  useEffect(() => {
    if (!reset && status === 'signed-in') router.replace(next);
  }, [reset, status, router, next]);
  useEffect(() => {
    if (sent) sentHeading.current?.focus();
  }, [sent]);
  useEffect(() => {
    if (!cooldown) return;
    const timer = window.setTimeout(() => {
      setCooldown(cooldown - 1);
      if (cooldown === 1) setAnnouncement(extra.resendReady);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);
  useEffect(() => {
    if (!signup || !validPassword(password)) return;
    const timer = window.setTimeout(() => setAnnouncement(extra.rules.complete), 500);
    return () => window.clearTimeout(timer);
  }, [signup, password]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setSubmitted(true);
    setFailure('');
    if (validation.validateAll().length) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }
    setPending(true);
    try {
      if (reset) {
        await requestReset(email);
        setSent(true);
        setCooldown(30);
        setAnnouncement(extra.resetSent);
      } else if (signup) {
        if (await registerAccount(name, email, password)) {
          signIn();
          router.replace(next);
        } else {
          setExists(true);
          validation.activate('email');
          requestAnimationFrame(() => summary.current?.focus());
        }
      } else if (await authenticate(email, password)) {
        signIn();
        router.replace(next);
      } else {
        setFailure(extra.wrongCredentials);
        form.current?.querySelector<HTMLInputElement>('[name=password]')?.focus();
      }
    } catch {
      setFailure(copy.errors.network);
    } finally {
      setPending(false);
    }
  }
  async function google() {
    if (pending) return;
    setPending(true);
    await authDelay(600);
    signIn();
    router.replace(next);
  }
  const loginHref = authLink(routes.account.login, next);
  const legal = signup ? accountCopy.signup.legal : accountCopy.login.legal;
  const footer = reset ? (
    <>
      <span>{accountCopy.forgotPassword.help.text}</span>
      <Link href={routes.help.contact} className="hit-area text-primary-700">
        {accountCopy.forgotPassword.help.link}
      </Link>
    </>
  ) : (
    <>
      <span>{legal.prefix}</span>
      <Link href={routes.legal.terms} className="hit-area text-primary-700">
        {legal.terms}
      </Link>
      <span>{legal.and}</span>
      <Link href={routes.legal.privacy} className="hit-area text-primary-700">
        {legal.privacy}
      </Link>
    </>
  );
  return (
    <AuthShell
      heading={copy.panel.heading}
      illustration={signup ? 'signup' : 'login'}
      footer={footer}
      notice={<p className="type-body-xs text-gray-600">{extra.demo}</p>}
    >
      {!reset && status !== 'guest' ? (
        <div aria-busy="true" className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded-lg bg-gray-100" />
          ))}
        </div>
      ) : sent ? (
        <div className="space-y-5">
          <h1 ref={sentHeading} tabIndex={-1} className="type-heading-xs lg:type-heading-s">
            {accountCopy.forgotPassword.checkEmail.title}
          </h1>
          <Callout tone="success">
            <p className="wrap-anywhere">{extra.sent(email.trim())}</p>
          </Callout>
          <p className="type-body-s text-gray-600">{extra.spam}</p>
          <Button
            variant="secondary"
            fullWidth
            disabled={cooldown > 0}
            loading={pending}
            onClick={async () => {
              setPending(true);
              await requestReset(email);
              setPending(false);
              setCooldown(30);
              setAnnouncement(extra.resent);
              setResentAt(
                new Intl.DateTimeFormat('en-MY', { hour: 'numeric', minute: '2-digit' }).format(
                  new Date(),
                ),
              );
            }}
          >
            {pending
              ? copy.actions.submitting
              : cooldown
                ? extra.resend(cooldown)
                : accountCopy.forgotPassword.actions.resend}
          </Button>
          {resentAt ? (
            <p className="type-body-xs text-success-700">{extra.sentAt(resentAt)}</p>
          ) : null}
          <Button
            variant="ghost"
            onClick={() => {
              setSent(false);
              requestAnimationFrame(() => form.current?.querySelector('input')?.focus());
            }}
          >
            {extra.differentEmail}
          </Button>
          <Link
            href={loginHref}
            className="block rounded-lg bg-primary-600 p-3 text-center type-body-s-semibold text-static-white"
          >
            {accountCopy.forgotPassword.checkEmail.back}
          </Link>
          <Callout tone="info">{accountCopy.forgotPassword.note}</Callout>
        </div>
      ) : (
        <>
          <h1 className="type-heading-xs lg:type-heading-s">{copy.header.title}</h1>
          <p className="mt-1.5 mb-5 type-body-m text-gray-600">{copy.header.lede}</p>
          {!reset ? (
            <>
              <GoogleButton
                label={signup ? accountCopy.signup.google.label : accountCopy.login.google.label}
                disabled={pending}
                onClick={google}
              />
              <div
                aria-hidden
                className="my-5 flex h-4.5 items-start border-t border-gray-200 type-body-xs text-gray-500 lg:items-center lg:gap-3 lg:border-t-0"
              >
                <span className="hidden h-px flex-1 bg-gray-200 lg:block" />
                <span className="hidden lg:inline">{accountCopy.login.or}</span>
                <span className="hidden h-px flex-1 bg-gray-200 lg:block" />
              </div>
            </>
          ) : null}
          <form
            ref={form}
            noValidate
            onSubmit={submit}
            aria-label={copy.actions.submit}
            aria-busy={pending}
            className="space-y-5"
          >
            {submitted && errors.length ? (
              <Callout tone="danger">
                <h2 ref={summary} tabIndex={-1} className="type-body-s-semibold">
                  {extra.summary(errors.length, extra.tasks[mode])}
                </h2>
                <ul className="mt-2 space-y-1">
                  {errors.map(({ name: fieldName, message }) => (
                    <li key={fieldName}>
                      <button
                        type="button"
                        className="text-left underline"
                        onClick={() =>
                          form.current
                            ?.querySelector<HTMLInputElement>(`[name=${fieldName}]`)
                            ?.focus()
                        }
                      >
                        {message}
                      </button>
                    </li>
                  ))}
                </ul>
              </Callout>
            ) : null}
            {signup ? (
              <Field
                label={accountCopy.signup.fields.fullName.label}
                error={validation.errorOf('name') ?? undefined}
              >
                <TextInput
                  name="name"
                  autoComplete="name"
                  value={name}
                  readOnly={pending}
                  placeholder={accountCopy.signup.fields.fullName.placeholder}
                  leadingIcon={<User className="size-4" />}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => validation.onBlur('name')}
                />
              </Field>
            ) : null}
            <Field label={copy.fields.email.label} error={validation.errorOf('email') ?? undefined}>
              <TextInput
                name="email"
                type="email"
                autoComplete={mode === 'login' ? 'username' : 'email'}
                value={email}
                readOnly={pending}
                placeholder={copy.fields.email.placeholder}
                leadingIcon={<Mail className="size-4" />}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setExists(false);
                }}
                onBlur={() => validation.onBlur('email')}
              />
              {exists ? (
                <Link href={loginHref} className="type-body-s text-primary-700">
                  {accountCopy.signup.switchPrompt.link}
                </Link>
              ) : null}
            </Field>
            {!reset ? (
              <div className={signup ? 'space-y-1.5' : 'space-y-5'}>
                <div className="relative">
                  <Field
                    label={accountCopy.login.fields.password.label}
                    error={validation.errorOf('password') ?? undefined}
                  >
                    <PasswordInput
                      key={failure}
                      name="password"
                      value={password}
                      aria-describedby={signup ? 'signup-password-rules' : undefined}
                      readOnly={pending}
                      autoComplete={signup ? 'new-password' : 'current-password'}
                      placeholder={
                        signup
                          ? accountCopy.signup.fields.password.placeholder
                          : accountCopy.login.fields.password.placeholder
                      }
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => {
                        setPasswordFocused(false);
                        validation.onBlur('password');
                      }}
                    />
                  </Field>
                  {!signup ? (
                    <Link
                      href={authLink(routes.account.forgotPassword, next)}
                      onClick={() => rememberEmail(email)}
                      className="hit-area absolute top-0 right-0 inline-flex h-5 items-center type-body-s-medium text-primary-700"
                    >
                      {accountCopy.login.actions.forgotPassword}
                    </Link>
                  ) : null}
                </div>
                {signup ? (
                  passwordFocused || password ? (
                    <PasswordRules id="signup-password-rules" password={password} />
                  ) : (
                    <p id="signup-password-rules" className="type-body-xs text-gray-500">
                      {accountCopy.signup.passwordHint}
                    </p>
                  )
                ) : (
                  <Checkbox
                    className="[&_label]:hit-area [&_label]:min-h-5"
                    label={accountCopy.login.fields.keepLoggedIn}
                  />
                )}
              </div>
            ) : null}
            {failure ? (
              <div role="alert">
                <Callout tone="danger">{failure}</Callout>
              </div>
            ) : null}
            <Button type="submit" fullWidth loading={pending}>
              {pending ? copy.actions.submitting : copy.actions.submit}
            </Button>
          </form>
          <p className="mt-5 text-center type-body-s text-gray-600">
            {copy.switchPrompt.text}{' '}
            <Link
              href={signup || reset ? loginHref : authLink(routes.account.signup, next)}
              className="type-body-s-semibold text-primary-700"
            >
              {copy.switchPrompt.link}
            </Link>
          </p>
          {reset ? (
            <Callout tone="info" className="mt-6">
              {accountCopy.forgotPassword.note}
            </Callout>
          ) : (
            <div className="mt-5 rounded-lg bg-gray-50 px-4 py-3.5 text-center lg:px-7.5">
              <Link
                href={routes.home}
                className="hit-area mx-auto block w-fit type-body-s-semibold text-primary-700"
              >
                {accountCopy.login.guest.action}
              </Link>
              <p className="mt-1 text-left type-body-xs text-gray-600 lg:text-center">
                {accountCopy.login.guest.body}
              </p>
            </div>
          )}
        </>
      )}
      <div role="status" className="sr-only">
        {announcement}
      </div>
      <noscript>{extra.noScript}</noscript>
    </AuthShell>
  );
}
