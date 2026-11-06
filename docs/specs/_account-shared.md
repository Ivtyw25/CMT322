# Account group: shared behaviour and shared changes (iteration 6), for main-agent review

Covers `/login`, `/signup`, `/forgot-password`, `/account`. Header, menu, theme, footer: [`_shared.md`](./_shared.md). Form language and validation timing: `_report-track-shared.md` §4 (check on blur after touch, all fields on submit, re-check on input once in error, error summary with focus on its title). Reuse `lib/forms` from iteration 5.

## 1. Shared changes proposed (additive, land before the page slices)
| # | Change | Why |
|---|---|---|
| 1 | New `lib/auth/`: `authenticate(email, password)`, `registerAccount(fields)`, `requestReset(email)` (async, 800 ms mock latency, outcomes in §2) and `safeNext(raw)` | One place for mock rules and the open-redirect guard |
| 2 | New `lib/profile/`: `mlc-profile` store (details, language, notification prefs) with a `useSyncExternalStore` hook, same pattern as `lib/follows` | Profile edits survive reload |
| 3 | New `components/ui/password-rules.tsx`: live checklist | Signup and profile "Change password" |
| 4 | New `components/ui/google-button.tsx`: official Google SVGs from `assets/brand/google/`, label prop, never restyled | CLAUDE.md §4 |
| 5 | `Switch` (exists): accept `aria-labelledby` and `aria-describedby`, add a `pending` state | Notification rows |
| 6 | New `components/ui/dialog.tsx`: modal, focus trap, Escape, return focus, page behind `inert` | Delete account, sign out of other devices, discard edits |
| 7 | New `components/ui/inline-edit-row.tsx`: label / value / hint / action-link row that swaps into field + Save + Cancel | Profile details and security |
| 8 | New `components/ui/status-message.tsx`: visually hidden polite `role="status"` region with debounce | Announcements |
| 9 | `(auth)` layout: split layout, no site header or footer. Left column: logo link, form column (max 400), footer line. Right: illustration panel with heading, art `alt=""`, hidden below 1024 | Figma |
| 10 | `/account` uses the site layout with the docs sidebar and section bar (existing patterns); sections ids are `routes` `profileSections` | Figma |

## 2. Mock auth rules (one account, `mockUser`)
- **Session:** localStorage key `mlc-session` = `{"userId":"user-meiling"}` (existing). Access in try/catch via `lib/dom/safe-storage`. If storage is blocked, sign-in still works for this page view (in memory, like `lib/follows`); no message. Other tabs follow through the `storage` event.
- **Log in succeeds** only for `meiling.tan@example.com` (trim, case-insensitive) with password `Mutiara123` (10 characters, matching Figma's 10 dots), or for the email and password just registered in this page view.
- **Log in fails:** any other pair, after 800 ms: "Email or password is incorrect. Check them and try again." Never says which part. No lockout.
- **Sign up succeeds** for valid fields unless the email is `meiling.tan@example.com`: inline error on Email "An account with this email already exists." with a "Log in" link beside it (keeps `next`). Success signs in as `user-meiling` with the entered name and email stored in `mlc-profile`.
- **Forgot password:** any valid email gives the sent state (never reveals whether an account exists). No email is sent.
- **Google button:** always succeeds after 600 ms and signs in as the mock user. No popup.
- **Return-to:** `?next=<encoded path with search and hash>`, set by the guest redirect and header Log in. `safeNext(raw)` accepts only a value that starts with one `/`, not `//`, with no `\` and no scheme, that is not `/login`, `/signup` or `/forgot-password`; otherwise `routes.home`. On success `router.replace(next)`, so Back does not return to the form. `next` is carried by every link between login, signup and forgot-password. "Browse as a guest" goes Home and drops it.
- **Already signed in** on `/login` or `/signup`: show the neutral skeleton, then `router.replace(safeNext)`. `/forgot-password` stays reachable.
- **Guest on `/account`:** the existing guard redirects to `routes.account.loginReturningTo(path+search+hash)`. While `loading` the page shows a skeleton; nothing of the account renders for a guest.

## 3. Form behaviour on the auth pages
- `<form noValidate>`. Client errors: one danger Callout with `circle-alert` at the top of the form, title (`h2`, `tabindex=-1`, focus on submit) "Fix {n} thing(s) to log in" / "to create your account" / "to send the reset link", a list of links to the fields. Inline errors under fields: danger/600, Body/S, `circle-alert` 16 px; the field border turns danger/600.
- **Server failure** (wrong password, send failed) is not in the summary: a danger Callout above the submit button, `role="alert"`; focus moves to the password field (login) or stays on the button; entered values are kept.
- **Pending:** button shows a spinner and "Logging in…", "Creating account…", "Sending…", `aria-busy`, `aria-disabled`; fields `readonly`; the Google button is disabled. Latency 800 ms.
- Enter submits from a single-line field. `autocomplete`: login email `username`, signup email `email`, password `current-password` / `new-password`, name `name`.
- Controls 44 px tall on every width (Figma 42 on desktop; raised for the tap rule).
- **Password field** (`password-input`): eye button `aria-label` "Show password" / "Hide password", `aria-pressed`, 44 px target, toggles `type`, focus stays on it. Resets to hidden after a failed submit. Never stored. Caps Lock on while focused: Body/XS hint "Caps Lock is on" (polite).
- "Keep me logged in" is shown as Figma; the mock stores the session the same either way (no visible difference).
- Terms & Conditions and Privacy policy link to `routes.legal.terms` and `routes.legal.privacy`, same tab.

## 4. Motion
Colour and border 150 ms ease-out. Callouts appear without animation. Dialog: scrim fades 150 ms, panel 0.98 to 1 scale over 200 ms ease-out. Switch knob 150 ms. Reduced motion: everything instant, spinner static (the label carries the state).
