# Sign up: UX spec
Route: `/signup` (`routes.account.signup`), `?next=` · Figma: desktop 78:2530, mobile 133:36671 · no dark frames

Shared rules: [`_account-shared.md`](./_account-shared.md). Breakpoints and layout: same as [`login.md`](./login.md). The form is taller; on a short viewport the left column scrolls normally and the legal line follows the content.

## Purpose and primary task
A resident who wants to report an issue creates an account in one short form.

## Sections
`h1` "Create your account", intro, Google button "Sign up with Google", divider "or", Full name (leading `user`), Email (leading `mail`), Password (leading `lock`, eye toggle) with hint "At least 8 characters, with a number.", "Create account" (Primary), "Already have an account? Log in", guest card, legal line. Panel heading "Stay ahead of road changes". Build empty, as Figma.

## Password rules checklist
Figma shows only the hint. **Decision:** the hint is the resting text. While the field is focused or non-empty it becomes a two-item checklist (`PasswordRules`): "At least 8 characters", "At least one number". Unmet: `circle` `gray-400`, text `gray-600`. Met: `circle-check` `success-700`, text `success-700`. Icons `aria-hidden`; each item carries a hidden suffix ", met" or ", not met". The list is the field's `aria-describedby`. Per-keystroke changes are not announced; a polite status says "Password meets all rules" once, when both become met (debounced 500 ms). On a failed blur or submit the inline error "Use at least 8 characters, with a number." shows above the checklist. No uppercase, symbol or strength meter.

## Validation
| Field | Rule | Message |
|---|---|---|
| Full name | 2 to 80 characters | "Enter your full name." |
| Email | filled, `name@host.tld` | "Enter your email address." / "Enter an email address like name@example.com." |
| Password | 8 to 64 characters, at least one digit | "Enter a password." / "Use at least 8 characters, with a number." |
Existing email: inline error under Email "An account with this email already exists." plus a "Log in" link; also a summary entry. There is no terms checkbox (as Figma); the legal line implies it.

Success: "Creating account…" 800 ms, status "Account created", `router.replace(safeNext)`; the header then shows the entered name.

## Interactive elements
As login without Forgot password or Keep me logged in. "Log in" → login keeping `next`. Create account states: default, hover, focus-visible, active, loading. Keyboard as login.

## Hidden content inventory
Error table, existing-email message, checklist items and "meets all rules" status, "Creating account…", "Account created", `<noscript>` line.

## Dynamic states
As login (skeleton while the session resolves, redirect when signed in). A very long name scrolls in the field; the header chip truncates with an ellipsis.

## Accessibility
As login. Focus order: logo, Google, name, email, password, show/hide, Create account, Log in, guest, Terms, Privacy. Summary title "Fix {n} thing(s) to create your account".

## Links and destinations
Logo → Home; Log in → `routes.account.login`; Browse as a guest → `routes.home`; Terms, Privacy → `routes.legal.*`; success → `safeNext`.

## Open questions
1. Password rules (8 characters, a number) come from Figma's hint; I added none.
2. Sign up always signs in as the single mock user id with the entered name and email (the data layer has one account).
