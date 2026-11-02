# Report an issue: UX spec
Route: `/report` (`routes.reportTrack.report`), `?station=<code>` via `routes.reportTrack.reportAt` · Figma: desktop 1:950, mobile 133:33123 (Figma shows a filled example) · no dark frames

Shell, docs layout, form field, focus ring, buttons: [`_shared.md`](./_shared.md). Group rules (form language, session states, shared components): [`_report-track-shared.md`](./_report-track-shared.md).

## Purpose and primary task
A signed-in resident, often on a phone at the roadside, tells the authority about a construction problem: what it is, where, with photos, and how to reach them. Success is a ticket ID. It must be quick, forgiving, and never lose their words.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390, side padding 20. Buttons stay on one row ("Submit report" + "Cancel" fit in 280). Map 180 tall. |
| 390–767 | Mobile frame: section bar, one column, padding 32. Type cards stacked. Name and phone stacked. Aside content ("What happens next", emergency note) **after the form**, as Figma. Map 200 tall. |
| 768–1023 | Mobile header and section bar. Type cards 3 columns. Name and phone 2 columns. Map 220. Aside content after the form. |
| 1024–1279 | Sidebar + article (760). No right aside; "What happens next" and the emergency note after the form. |
| 1280–1439 | Adds the right aside: "On this page" (5 items), "What happens next", emergency note (warning). Sticky. |
| 1440+ | Desktop frame. Form column max 760; at 1920 only margins grow. |

## Sections (top to bottom)
Page header: breadcrumb Home / Report & Track / Report an issue, `h1` "Report an issue", intro. Then `<form noValidate>` named "Report an issue". Each section is an `h2` with an id used by the TOC, separated by a 1 px `gray-200` rule with 40 px padding.

1. **Error summary** (only after a failed submit; between intro and first section; see Submit).
2. **Draft notice** (only when a draft was restored): info callout "We restored your draft from {time}." and a text button "Start over" that clears the draft and resets the form; focus then moves to the `h2` "What are you reporting?".
3. **What are you reporting?** (id `type`): `role="radiogroup"` labelled by the `h2`; radio cards Complaint (default selected), Feedback, General inquiry. Then **Category** `select` (required, placeholder "Choose a category"; Figma's chosen value is a filled example). Helper text under the select shows the chosen category's `hint`; it is the select's `aria-describedby`, not a live region.
4. **Details** (id `details`): Subject (`input`, required, 5 to 100 characters, `maxlength=100`, no counter). Description (`textarea`, required, min 20, `maxlength=1000`, 5 rows, resize vertical) with counter "184 of 1000 characters" right-aligned Body/XS `gray-500`, `aria-hidden`. A visually hidden polite status says "100 characters left" at 900 and "Character limit reached" at 1000, debounced 500 ms. Counter turns `warning-700` from 900.
5. **Location** (id `location`): Address or landmark (`input`, required, leading `map-pin`, min 3). With a station from `?station`, a removable chip under the field "Near S05 Bayan Lepas station" with an `x` button named "Remove station". Then the map (`LocationMap`, pin mode); bottom-left button "Use my current location" (secondary, `locate-fixed`); bottom-right coordinates `5.2945, 100.2650` shown once a pin exists. The pin is optional; the address is required.
6. **Photos and files** (id `files`): optional; see Upload.
7. **Your contact details** (id `contact`): Full name (required, prefilled, `autocomplete=name`), Phone number (optional, `type=tel`, `autocomplete=tel`), Email address (required, `type=email`, prefilled, `autocomplete=email`, leading `mail` icon).
8. **Consent and actions**: checkbox "I agree that the details in this report can be shared with the project developer and the authority handling it." (required). Row: "Submit report" (Primary), "Cancel" (Secondary). Once a draft exists, a Body/XS `gray-500` line "Draft saved in this browser" sits beside them (not live).

## Prefill from `?station=<code>`
Read in a small client leaf with `useSearchParams` inside `<Suspense>` (project decision 5), never in the route file. A valid code (case-insensitive, one of the 22) sets: the station chip, Address "{station name} station", and a map pin at the station's coordinates (zoom 16). The query wins over a stored draft for those fields only. An unknown or malformed code is ignored silently. The address stays editable; the chip has its own remove button. Guests: `loginReturningTo` carries the query through.

## Location picker
- **Map:** a click or tap sets the pin; the pin is draggable. The map does not pan by dragging and ignores the wheel, so page scrolling is never trapped on a phone; the +/- buttons zoom. No pin: the whole line at zoom 14.
- **Keyboard:** a "Drop a pin at the map centre" button follows the zoom controls in tab order and creates a pin. The pin is a focusable marker named "Report location pin, 5.2945, 100.2650. Use the arrow keys to move it." Arrow keys nudge it 10 m (Shift: 50 m).
- **Feedback:** after any pin change, a polite message (debounced 500 ms) "Pin set near {nearest station name}". If Address is empty it is filled with "Near {nearest station name}" (editable).
- **Use my current location:** `getCurrentPosition`, timeout 10 s, no high accuracy. States: default; loading (label "Finding your location…", `aria-busy`, spinner, ignores clicks); success (pin set, map recentres at zoom 16, message "Pin set to your current location"); failure under the map in danger text with `circle-alert`: denied "Location access is blocked. Type the address instead, or tap the map."; unavailable or timeout "We couldn't find your location. Type the address instead, or tap the map." The failure clears on the next pin change. If the API is missing, the button is not rendered.
- **Tiles error:** the map shows `tileErrorText`; the address field still works.

## Upload
- Rules (Figma): JPG, PNG or PDF, up to 10 MB each, maximum 5 files.
- **Drop zone:** dashed `gray-300` border, `gray-50` bg, `upload` icon, "Drag files here or **browse**". "browse" is a real `button` that opens the file dialog; the zone itself is not a tab stop. A visually hidden `<input type=file multiple accept>` is present. Drag over: border `primary-600`, bg `primary-50`, text "Drop files to add them". `dragover` is prevented on the zone only.
- **Adding:** simulated upload (existing component): a row with a `role="progressbar"` bar and "Uploading {name}, 40%" (not live), then "2.1 MB, uploaded" in `success-700` with `circle-check`.
- **Rejections** (type, size, count) never block the valid files. One message per problem under the zone in danger text with `circle-alert`, e.g. "driveway.gif is not a JPG, PNG or PDF.". Announced once (polite), replaced on the next add. A file with the same name and size is ignored silently.
- **Removing:** `x` icon button named "Remove {file name}", 44 px target on mobile, instant, no confirm. Focus moves to the next row's remove button, else the previous row's, else "browse". Announce "{file name} removed".
- **At the maximum:** the zone text becomes "Maximum 5 files added. Remove one to add another." and "browse" is `aria-disabled` but focusable.
- Files are not kept in the draft. If the saved draft had files, the restore callout adds "Photos are not saved in a draft. Add them again if you need them."

## Validation timing
Rules in `_report-track-shared.md` §4: check a field on blur after it was touched; every field on submit; once in error, re-check on input.
| Field | Rule | Message |
|---|---|---|
| Category | chosen | "Choose a category." |
| Subject | 5 to 100 | "Enter a subject." / "Use at least 5 characters for the subject." |
| Description | 20 to 1000 | "Describe the problem." / "Add a little more detail. Use at least 20 characters." |
| Address | 3 or more | "Enter an address or landmark." |
| Full name | filled | "Enter your full name." |
| Phone | empty, or 9 to 12 digits (spaces, `+`, `-` allowed) | "Enter a phone number with 9 to 12 digits, or leave it empty." |
| Email | filled, `name@host.tld` | "Enter your email address." / "Enter an email address like name@example.com." |
| Consent | checked (on change and submit, not blur) | "Agree to share your report details to send it." |
| Files | none still uploading | summary only: "Wait for your photos to finish uploading." |

## Submit, error summary and pending
- **Errors on submit:** a danger callout at the top of the form with `circle-alert`, title "Fix {n} thing(s) to send your report" (`h2`, `tabindex=-1`) and a list of links whose text is the error message, in page order. Focus moves to the summary title (so a screen reader reads the whole list). A link moves focus to its field, with scroll margin 140 px under the sticky header. Inline errors show at the same time. The summary updates as errors are fixed and disappears when none remain, without moving focus.
- **Valid submit, pending:** 1200 ms (mock latency). Button shows spinner and "Sending report…", `aria-busy`, `aria-disabled`. The form body is `inert` (no editing, no double submit); Cancel stays active. Announce "Sending your report". On success: store the ticket (`lib/reports`), clear the draft, `router.push(routes.reportTrack.submitted(id))`. Back then returns to a blank form.
- **Failure** (the async call rejects): `inert` removed, button resets, a danger callout "We couldn't send your report" with "Your answers are still here. Check your connection and try again." replaces the summary position and takes focus. Submit retries. Nothing is lost.
- **Cancel:** link to `routes.reportTrack.overview`. The draft stays; no confirm dialog.

## Review step
No separate review page. The Submitted page shows "What you sent" straight after. See Open question 1.

## Draft in the browser
- Key `mlc-report-draft`: `{ savedAt, type, categoryId, subject, description, address, pin, stationCode, phone, fileCount }`. Not stored: name, email (from the account), files, consent.
- Write 500 ms after the last change, only when subject, description, address or phone is non-empty or a category is chosen. Every access in try/catch via `lib/storage`. If storage is blocked nothing visible changes and "Draft saved" never shows.
- Restore on mount when the draft is under 7 days old. Cleared on success and on "Start over". Leaving the page by Back, Forward or a link gives no prompt; the draft is the safety net.

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Type cards | click | Select | default, hover, selected, focus-visible | Arrow keys, Space |
| Category select | change | Hint updates | default, focus, error | Native |
| Text fields, textarea | input, blur | Validate on blur after touch | default, focus (2 px `primary-600` ring), error, filled | Tab |
| Station chip remove | click | Removes the station only | default, hover, focus-visible | Enter, Space |
| Map | click, tap, drag pin | Pin set, message | default, pin, focus-visible, tiles loading, tiles error | Arrows, "Drop a pin" button |
| Use my current location | click | Geolocate | default, loading, error | Enter, Space |
| Browse, drop zone | click, drop | Add files | default, drag-over, max reached | Enter, Space on browse |
| Remove file | click | Remove | default, hover, focus-visible | Enter, Space |
| Consent | click | Toggle | default, checked, error | Space |
| Submit report | click, Enter in a single-line field | Validate, submit | default, hover, focus-visible, active, loading | Enter |
| Cancel | click | Go to overview | default, hover, focus-visible | Enter |
| Start over | click | Reset form and draft | default | Enter |
| TOC items | click | Scroll, focus the `h2` | active | Enter |

Enter in the textarea inserts a newline.

## Hidden content inventory
- 9 categories (data exists, each with a `hint`) and 3 types with one-line descriptions.
- Error messages (table above), summary titles (one and several), failure callout, draft notice and restore note.
- Upload messages: 4 error kinds, uploading, uploaded, removed, max reached. Location messages: denied, unavailable, success, pin set. "Draft saved in this browser". `<noscript>` line.
- "What happens next" 3 steps, emergency note, "Need help?".
- Station chip and address templates with the station name.

## Dynamic states
- **Guest or session loading:** neutral skeleton (title bar, field blocks), `aria-busy`, no form in the DOM; then redirect (guest) or form.
- **Empty first visit:** Complaint selected, no category, name and email prefilled, no pin, no files.
- **Long content:** a 100-character subject wraps in summary and Submitted; the description scrolls in the textarea; file names truncate with an ellipsis in the row (the remove button's name carries the full name).
- **No JavaScript:** the form needs it (protected, client-only); `<noscript>` says so and gives the MRTCareline number. **Storage blocked:** form works, no draft.

## Motion
Border and background transitions 150 ms ease-out. Errors and the summary appear with no animation. Drag-over colour change 100 ms. Progress ticks 250 ms steps (existing). Spinner 1 s linear. Reduced motion: colour swaps are instant, spinner stands still (the "Sending report…" label carries the state), no scroll animation to errors.

## Accessibility
- `main` holds breadcrumb `nav`, `h1`, `form`. Headings: `h1`, then five `h2`. Radio group and fields have visible labels; "(optional)" is part of the label text.
- Focus order: sidebar or section bar, breadcrumb, draft notice button, type radios (one stop), category, subject, description, address, station chip remove, map controls and pin, current-location button, "browse", file remove buttons, name, phone, email, consent, Submit, Cancel, aside.
- Errors are linked with `aria-describedby`. The summary and failure callout are not `role=alert`: focus does the announcing.
- Touch targets 44 px on mobile: inputs and select (min-height 44), radio cards, checkbox row, remove buttons, map buttons.
- Colour is never the only signal: errors have an icon and text.

## Links and destinations
Home → `routes.home`; Report & Track → `routes.reportTrack.overview`; Cancel → `routes.reportTrack.overview`; submit success → `routes.reportTrack.submitted(id)`; guest redirect → `routes.account.loginReturningTo(...)`. Aside text (999, MRTCareline) is plain text.

## Open questions
1. **Review step:** the brief lists one; Figma has none. I specified one page, with Submitted as the summary. A review step would need a Figma frame.
2. **Type names:** settled by R1.
3. **Resting state:** Figma is a filled example; I specify an empty form. `tests/visual/states.ts` should fill it to match the reference.
4. **Nearest-station address fill** is mine, not in Figma.
5. **PDF:** settled by R5; the shared upload gets an `accept` prop (shared §1 item 1).
