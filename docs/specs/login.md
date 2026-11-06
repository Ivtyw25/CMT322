# Log in: UX spec
Route: `/login` (`routes.account.login`), `?next=` · Figma: desktop 4:959, mobile 133:36579 · no dark frames (tokens only; the illustration panel stays `primary-800` in both themes)

Mock auth, return-to, form behaviour: [`_account-shared.md`](./_account-shared.md).

## Purpose and primary task
A resident logs in to report or track, often on a phone. Success is landing back on the page that sent them.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390, side padding 20 (280 content). "Password" label and "Forgot password?" share a row; below 300 the link wraps under the label. |
| 390–767 | Mobile frame: one column, logo on top, padding 20 (32 from 600). No illustration. |
| 768–1023 | One column, form centred, max 440. No illustration. |
| 1024–1439 | Split 50/50. Form max 400 centred in the left half, illustration right. Below 1200 the panel heading drops to 36 px. |
| 1440+ | Desktop frame. At 1920 the halves stay 50/50 and the form stays 400. |

Left column is `min-height: 100dvh`; the form block is centred when there is room, otherwise normal flow; the "By logging in…" line sits at the bottom.

## Sections
1. Logo link (name "Mutiara Line, home").
2. `h1` "Welcome back" and intro.
3. Google button "Sign in with Google".
4. Divider "or" (`aria-hidden`).
5. Form: Email (leading `mail`), Password (leading `lock`, eye toggle, "Forgot password?" on the label row), checkbox "Keep me logged in", "Log in" (Primary, full width).
6. "New here? Create an account", guest card (the title "Browse as a guest" is the link, the text under it is plain), legal line.
7. Illustration panel heading "Your reports, all in one place" (plain text, art `alt=""`).

**Resting state:** Figma shows email and password filled. Build **empty** (placeholders "Enter your email", "Enter your password"); `tests/visual/states.ts` fills the demo credentials to match the reference.

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Sign in with Google | click | 600 ms pending, signs in, redirect | default, hover, focus-visible, active, loading, disabled | Enter, Space |
| Email, Password | input, blur | Validate after touch | default, focus (2 px `primary-600` ring), error, filled | Tab |
| Show / Hide password | click | Toggle type | default, pressed, focus-visible | Enter, Space |
| Forgot password? | click | Go to forgot-password | link states | Enter |
| Keep me logged in | click | Toggle | default, checked, focus-visible | Space |
| Log in | click, Enter | Validate, then authenticate | default, hover, focus-visible, active, loading | Enter |
| Create an account | click | Go to signup | link states | Enter |
| Browse as a guest | click | Home | link states | Enter |

## Validation
| Field | Rule | Message |
|---|---|---|
| Email | filled, `name@host.tld` | "Enter your email address." / "Enter an email address like name@example.com." |
| Password | filled | "Enter your password." |
Wrong credentials: callout "Email or password is incorrect. Check them and try again." (shared §3). On success announce "Logged in" (status) and redirect.

## Hidden content inventory
Error messages above, failure callout, summary titles (one and several), "Logging in…", "Logged in", "Caps Lock is on", `<noscript>` line "Logging in needs JavaScript. Call MRTCareline 1800-88-6782." (plain text).

## Dynamic states
- **Loading** (session unresolved, or signed in and redirecting): skeleton of heading and three field blocks, `aria-busy`, no form in the DOM.
- **Long content:** a very long email scrolls inside the field; callout text wraps.
- **Storage blocked:** login works for this page view, no message.

## Motion
Shared §4.

## Accessibility
`main` holds `h1` and the form (named "Log in"); the illustration panel is `aside` with `aria-hidden`. Focus order: logo, Google, email, password, show/hide, Forgot password?, checkbox, Log in, Create an account, Browse as a guest, Terms, Privacy. No autofocus. Errors use `aria-describedby` and `aria-invalid`. The eye toggle is named and 44 px. The Google button's name is its visible text.

## Links and destinations
Logo → `routes.home`; Forgot password? → `routes.account.forgotPassword`; Create an account → `routes.account.signup`; Browse as a guest → `routes.home`; Terms → `routes.legal.terms`; Privacy policy → `routes.legal.privacy`; success → `safeNext`.

## Open questions
1. Demo credentials are not shown on the page (not in Figma). Document `meiling.tan@example.com` / `Mutiara123` in `docs/USER-CHECKLIST.md`.
2. Figma's filled resting state vs my empty build.
