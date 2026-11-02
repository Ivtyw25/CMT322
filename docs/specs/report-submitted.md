# Report submitted: UX spec
Route: `/report/submitted/[ticketId]` (`routes.reportTrack.submitted(id)`) · Figma: desktop 1:1120, mobile 133:33577 · no dark frames

Shell and docs layout: [`_shared.md`](./_shared.md). Group rules: [`_report-track-shared.md`](./_report-track-shared.md).

## Purpose and primary task
Right after sending, the resident needs to see that it worked, keep the ticket ID, and know what happens next. Primary actions: copy the ID, then track the ticket.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390, padding 20. The ticket ID (Poppins Bold 40/48 on desktop) steps down to 28/36 so `MLC-261028-0482` fits in 280 px; "Copy ID" drops below the ID. Action buttons stack full width. |
| 390–767 | Mobile frame: section bar, one column, padding 32. ID at 32/40, Copy ID below it. Status steps vertical. "What you sent" rows become label above value (Figma M frame). Buttons stack full width, "Back to home" a centred text link. |
| 768–1023 | Mobile header, section bar. ID 40/48 with Copy ID beside it. Steps vertical. "What you sent" two columns (label 160). Buttons in a row. |
| 1024–1279 | Sidebar + article (760). Steps horizontal (4 columns, labels centred under dots, first left, last right as Figma). "Need help?" after the article. |
| 1280–1439 | Adds "On this page" aside (4 items) and "Need help?". |
| 1440+ | Desktop frame; article 760; extra width is margin at 1920. |

## Sections (top to bottom)
Breadcrumb Home / Report & Track / Report an issue / Submitted (current). `h1` "Report submitted" with a 40 px `success-600` circle `check` (decorative) left of it, then "Thank you, {first name}. We've emailed a confirmation with your ticket ID to {email}." If the name is unknown the sentence starts "Thank you." Source `reportTrackCopy.submitted`.
1. **Your ticket ID** (`h2` visually hidden, id `ticket-id`; Figma shows the label "Your ticket ID" in Body/S): block with a 4 px `success-600` left bar, the ID in `primary-800` Poppins Bold, `Copy ID` button, and "Keep this ID. You need it to check the status of your report."
2. **What happens next** (`h2`, id `what-happens-next`): `Stepper` `status`, tone `success`, first step complete ("Submitted", time `28 Oct, 14:41`), then "Pending review" "Usually within 1 working day", "In progress" "The authority works on it", "Resolved" "You see the outcome". Connector solid green after step 1, dotted after.
3. **What you sent** (`h2`, id `what-you-sent`): `info-list` rows Type, Category, Subject, Location, Attachments, Submitted. Attachments reads "2 photos" or "2 files" (if any PDF), "None" for zero. Values wrap; long subject wraps to 3 lines.
4. **Confirmation email** (`h2`, id `confirmation-email`): an example email in a `<figure>`: 3 px `gray-300` left bar, `mail` icon, "Sent to {email} at {time}", bold subject "We received your report {id}", body "Hello {first name}, your report "{subject}" has been received and is waiting for review. Track it any time at mutiaraconnect.my/track using your ticket ID." The figure has a visually hidden caption "Copy of the confirmation email". The address text is plain text, not a link. No email is really sent (prototype), which the page does not say.
5. **Actions:** "Track this ticket" (Primary) → `routes.reportTrack.ticket(id)`; "Report another issue" (Secondary) → `routes.reportTrack.report`; "Back to home" (text link, no arrow) → `routes.home`.

## Where the data comes from
1. Server: `getTicket(id)`. 2. Client: if `null`, `lib/reports` store (shared §1 item 9). Ownership: the ticket's `reporterId` must equal the signed-in user. Show the result area as a skeleton (ID bar, steps, rows) with `aria-busy` until the client check has finished (no flash of "unavailable").

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Copy ID | click | Copies the ID with `navigator.clipboard.writeText` | default, hover, focus-visible, copied | Enter, Space |
| Track this ticket | click | Navigate | default, hover, focus-visible, active | Enter |
| Report another issue | click | Navigate to a blank form | same | Enter |
| Back to home | click | Navigate | hover underline, focus-visible | Enter |
| TOC items | click | Scroll, focus the `h2` | active | Enter |

**Copy ID:** `copy` icon + "Copy ID", Secondary small. After success: `check` icon, label "Copied", `success-700`, for 2 s, then back; width fixed to the wider label so the layout does not move. Announce "Ticket ID copied". If the Clipboard API is missing or rejects: select the ID text (Range selection) and announce "Could not copy. The ticket ID is selected: press Ctrl+C or copy it from the menu." (on touch: "touch and hold to copy"). No error styling.

## Hidden content inventory
None hidden. Attachment count wording (photos, files, none); the "unavailable" state copy (below); the signed-out copy.

## Dynamic states
- **On arrival from the form:** focus moves to the `h1` (`tabindex=-1`, no ring), and the announcer says "Report submitted. Your ticket ID is MLC-261028-0482." (the ID read by characters: wrap in `<span aria-label>` with spaced groups: "M L C, 2 6 1 0 2 8, 0 4 8 2").
- **Direct visit or refresh:** same page, no announcement, focus untouched.
- **Guest, ticket not found, or ticket belongs to someone else:** replace sections 1 to 4 with a Callout (info) "We can't show this confirmation" and "Log in with the account that sent the report, or track a ticket with its ID." Actions: "Log in" (guest only, `routes.account.loginReturningTo(path)`) and "Track a ticket" → `routes.reportTrack.track`. `h1` becomes "Report confirmation". `noindex` for all submitted pages.
- **Malformed ticket ID:** the same unavailable state.
- **Loading:** skeleton as above. **Error:** none (local data).
- **Long content:** long email wraps (`overflow-wrap:anywhere`) in the sentence and the email figure.

## Motion
Copy button label swap is instant; colour 150 ms. The check circle has no animation. Stepper has none. Reduced motion changes nothing else.

## Accessibility
`main` > breadcrumb `nav`, `h1`, article sections. Headings: `h1`, four `h2`. The ticket ID sits in an element with `id="ticket-id-value"`; Copy ID has `aria-describedby` pointing at it. The Stepper is an `ol` named "Ticket status" with the state as text. Status of the copy is announced through the polite announcer, not by the button label alone. Touch targets 44 px (Copy ID gets `hit-area`). Contrast for `primary-800` on `surface` ≥ 7:1 in both themes.

## Links and destinations
Home → `routes.home`; Report & Track → `routes.reportTrack.overview`; Report an issue crumb → `routes.reportTrack.report`; Track this ticket → `routes.reportTrack.ticket(id)`; Report another issue → `routes.reportTrack.report`; Back to home → `routes.home`; Log in → `routes.account.loginReturningTo`. Need help: MRTCareline plain text.

## Open questions
1. **Ownership rule:** guests and non-owners see the unavailable state. Figma shows only the owner case.
2. **New ticket ID/time:** ID date from mock today (29 Oct), time from the browser clock (shared §3). Figma's example uses 28 Oct 14:41.
3. **Persistence:** a new ticket lives only in this browser (`mlc-submitted-reports`); it will not exist on another device.
