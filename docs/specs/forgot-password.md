# Forgot password: UX spec
Route: `/forgot-password` (`routes.account.forgotPassword`), `?next=` · Figma: desktop 100:4081, mobile 133:36768 · no dark frames, **no sent-state frame**

Shared rules: [`_account-shared.md`](./_account-shared.md). Layout and breakpoints as [`login.md`](./login.md); the short form is vertically centred (Figma). Bottom line "Still stuck? Contact us".

## Purpose and primary task
Someone who cannot log in asks for a reset link and is sure it was sent.

## Sections
1. **Form:** `h1` "Reset your password", intro, Email (leading `mail`; prefilled with the address typed on login when they arrived by "Forgot password?" in the same page view, else empty), "Send reset link" (Primary), "Remembered it? Back to log in", note card (30 minutes, Google users). Build empty (Figma shows a filled example).
2. **Sent state** (my design, replaces the form in place; the panel is unchanged): `h1` "Check your email" (focus moves here, `tabindex=-1`); success Callout `circle-check` "If an account exists for {email}, we have sent a link to set a new password. It expires after 30 minutes."; Body/S line "Nothing in your inbox? Check your spam folder, or send it again."; Secondary button "Send the link again"; text link "Use a different email" (back to the form with the field filled, focus on it); Primary button "Back to log in", full width; the note card stays. The address wraps (`overflow-wrap:anywhere`).
3. Bottom line "Still stuck?" with link "Contact us".

## Validation and submit
Email rules and messages as login. "Sending…" 800 ms, then the sent state for any valid email; status "Reset link sent". Failure (rejected request): danger callout "We couldn't send the link. Check your connection and try again." above the button, address kept.

## Resend
"Send the link again" is disabled for 30 s after each send; the label is "Send the link again in {n}s" (counter ticks each second, not announced; one polite message "You can send the link again" when it enables). Click: 800 ms, label "Sending…", then status "Link sent again" and a Body/XS `success-700` line "Sent again at {time}" (`lib/format`, mock clock). Maximum 3 sends per page view; after the third the button is replaced by the danger text "Too many requests. Try again in a few minutes." with `circle-alert`. Reduced motion: the counter is text only.

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Email | input, blur | Validate | default, focus, error | Tab |
| Send reset link | click, Enter | Sent state | default, hover, focus-visible, active, loading | Enter |
| Send the link again | click | Resend | default, disabled (countdown), loading | Enter, Space |
| Use a different email | click | Back to the form | link states | Enter |
| Back to log in | click | Login keeping `next` | link and button states | Enter |
| Contact us | click | Contact page | link states | Enter |

## Hidden content inventory
Sent-state heading, callout, spam hint and buttons; resend countdown, sent-again, too-many strings; failure callout; error messages; `<noscript>` line.

## Dynamic states
Skeleton while the session resolves; a signed-in visitor is not redirected. Reloading restores the form (the sent state is not stored). Storage blocked: no effect.

## Motion
Shared §4. No transition between form and sent state.

## Accessibility
The swap happens inside the same `main`; focus moves to the new `h1` so the callout is read. Focus order in the sent state: h1, Send the link again, Use a different email, Back to log in, Contact us. The countdown is not a live region.

## Links and destinations
Logo → `routes.home`; Back to log in → `routes.account.login`; Contact us → `routes.help.contact`.

## Open questions
1. Sent state and resend rules are mine; a Figma frame is needed for a visual check.
2. The note card stays visible in both states, since the response never reveals whether an account exists.
