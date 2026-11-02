# Report & Track group: shared behaviour and shared component changes (iteration 5)

Read with the four page specs. Shell rules are in `_shared.md`; decisions of earlier groups in `_project-decisions.md` and `_traffic-decisions.md`. **Decision** marks anything Figma does not answer. Section 1 is for main-agent review before the build.

## 1. Shared component changes (land on `main` before the page slices; additive)

| # | Component | Change |
|---|---|---|
| 1 | `ui/file-upload` | (a) `accept` prop; Report allows JPG, PNG, PDF (Figma "JPG, PNG or PDF, up to 10 MB each, maximum 5 files"), the default stays JPG/PNG so Profile is unchanged. (b) Row layout of Figma: 40 px file tile (`file` icon; `image` for photos), name Body/S Medium, "2.1 MB, uploaded" Body/XS `success-700`, remove `x` icon button. (c) `onBusyChange(boolean)`. (d) Focus rule on remove and an `aria-live` announcement (page spec `report.md`). (e) Drop zone and rules copy from props, not photo-only wording. |
| 2 | `ui/tag` | Status tag `submitted` (neutral: `gray-100` bg, `gray-700` text, `circle` dot) beside Pending / In progress / Resolved. A new ticket is `submitted`. |
| 3 | `patterns/stepper` (`status`) | Confirm: `detail` line under each label; vertical below 1024 (Figma M frames); `tone` `primary` (Track: blue ticks and line) or `success` (Submitted: green first step). Connector: solid after a complete step, dotted after the current one. All four complete when resolved. |
| 4 | `patterns/map` (`LocationMap`) | New pin mode: `pin {lat,lng}`, `onPinChange`, `pickable` (click or tap places the pin), draggable pin, arrow-key nudge, `panEnabled=false` (page scroll is never trapped; zoom buttons stay), overlay slot for the "Use my current location" button (bottom left) and a coordinates readout (bottom right, `5.2945, 100.2650`). Builds on the traffic map props; land after them. |
| 5 | New `patterns/error-summary.tsx` | Danger callout with title, one link per error (`href="#field-id"`), focus moves to it when `focusKey` changes. Reusable by Sign up and Log in later. |
| 6 | New `lib/forms/` | `useFieldValidation(rules)`: per-field `touched`, validate on blur, re-validate on input once a field has an error, `validateAll()` returns the first invalid field. No library. |
| 7 | New `lib/storage/` (`readJson`, `writeJson`, `removeKey`) | Every access in try/catch, returns `null`/no-op on failure. Used by the draft and the submitted-report store. Reuse in follows and theme if they have their own copy. |
| 8 | `ui/callout` | Confirm tones `info`, `warning`, `success`, `danger`, with optional title and `ref`/`tabIndex={-1}` for focus. |
| 9 | Data | (a) `ReportType` becomes `complaint | feedback | inquiry` (decision R1). (b) `submitReport(input)` in `data/api`: waits 1200 ms, returns a `Ticket` with `status: 'submitted'`, one automated update, `reporterId` from the input. (c) New `lib/reports/`: client store `mlc-submitted-reports` (array, newest first, max 20) of those tickets, so Submitted and Track find a ticket that the mock data does not contain. (d) `getTicket` stays server-side; pages fall back to the client store when it returns `null`. |
| 10 | `layout/docs-layout` | Confirm the `aside` slot renders in the right column at 1280+ and after the article below 1280 (Report: "What happens next" and the emergency note; Track and Submitted: "Need help?" with an extra link). |

Not new: `radio-card`, `select`, `textarea`, `text-input`, `checkbox`, `section-bar`, `docs-layout`, `breadcrumb`, `link-card`, `accordion`, `info-list`, `need-help-block`, `timeline`, `button`, `callout`.

## 2. The mock account and the two session states

The only account is Tan Mei Ling (`mockUser`, `useSession()`: `loading | guest | signed-in`).

| Page | Guest | Signed in |
|---|---|---|
| Overview `/report-track` | Intro adds the sentence "Log in or create an account to report an issue or track a ticket." | That sentence is hidden. Nothing else changes. |
| Report `/report` | Protected: neutral skeleton, then `router.replace(loginReturningTo(path+search))`. The form never renders. | Form, name and email prefilled from the account. |
| Submitted `/report/submitted/[id]` | Shows "Confirmation unavailable" state (see page spec). | Shows the confirmation if the ticket is theirs. |
| Track `/track[/id]` | Search and status work (R2; the ID is the key). "Your report" content is private: replaced by a login prompt. | Their own tickets also show the description and photos; "Your recent reports" list on `/track`. |

Hide guest-only text with `[data-session="signed-in"] .guest-only { display: none }`: the head script sets `data-session` before first paint, so there is no shift or hydration mismatch. Components that need the user's name use `useSession()` and render the skeleton text (a neutral "Thank you") until the status is known.

## 3. Ticket IDs and the clock

- Format `MLC-YYMMDD-NNNN` (`TICKET_ID_PATTERN`). A new ID uses the mock "today" (`getToday()`, 29 Oct 2026, so `MLC-261029-0500`), the sequence starting at 0500 and counting up with the client store length. The time of day comes from the browser clock, so confirmation time is real.
- Normalising user input (Track): trim, upper-case, replace any dash-like character (en dash, em dash, minus) with `-`, remove inner spaces. Do it on submit and when a `/track/[id]` address is opened; never while typing.
- Dates: `28 Oct 2026, 14:41` (full) and `28 Oct, 14:41` (stepper) via `lib/format`, 24-hour, Malaysia time, in a `<time datetime>`.

## 4. Form language (all forms in this group)

- Required fields have no asterisk; optional ones say "(optional)" in the label, as in Figma. A short line above the form is not needed.
- Inline error: under the field, `circle-alert` 16 px + Body/S `danger-600`, `id` referenced by `aria-describedby` on the control with `aria-invalid="true"`; border `danger-600`. Hint text stays above the error. Errors are not live regions; the error summary and the announcer carry the news.
- Validation timing: a field is checked when it **loses focus** after having been touched (never while the first character is typed), and every field on **submit**. Once a field shows an error it re-checks on every input, so the message goes away the moment it is fixed.
- Error summary (on submit only): see `report.md`. Focus goes to the summary; the summary links focus the field.
- Loading button: `aria-disabled="true"`, `aria-busy="true"`, `loader-circle` spinner, label ends with "…" (`_shared.md` Buttons). Reduced motion: no spin.
- Announcements use `useAnnounce()` (polite). Never announce on every keystroke.

## 5. Docs layout facts used by all four pages

Sidebar group "Report & Track" with Overview, Report an issue, Track a ticket; the current page `aria-current="page"` (Submitted keeps "Report an issue" current, Track keeps "Track a ticket"). Breadcrumb as Figma: Submitted = Home / Report & Track / Report an issue / Submitted (current, not a link). Below 1024: section bar, no sidebar. "On this page" aside from 1280; "Need help?" (MRTCareline) follows the article below 1280. Footer on every page.
