# Track a ticket: UX spec
Route: `/track` (search only) and `/track/[ticketId]` (`routes.reportTrack.track`, `routes.reportTrack.ticket(id)`) · Figma: desktop 1:1175, mobile 133:33954 (Figma shows MLC-261028-0482, signed in) · no dark frames

Shell and docs layout: [`_shared.md`](./_shared.md). Group rules: [`_report-track-shared.md`](./_report-track-shared.md).

## Purpose and primary task
Someone with a ticket ID (from the email) wants to know where their report stands and what the authority said. They arrive with an ID in hand, sometimes mistyped, sometimes on a phone from an email link.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390, padding 20. Search field and "Check status" stack (button full width). Meta line wraps to one item per line. Updates: name and date on two lines. |
| 390–767 | Mobile frame: section bar, one column, padding 32. Search stacked. Tag drops under the ID line. Status stepper vertical with dates beside labels. Meta items one per line with their icons. Report photos 2 per row. |
| 768–1023 | Mobile header, section bar. Search on one row (field flex, button auto). Stepper vertical. Meta line wraps freely. |
| 1024–1279 | Sidebar + article (760). Stepper horizontal. "Need help?" with "Report another issue" after the article. |
| 1280–1439 | Adds "On this page" aside (Status, Updates from the authority, Your report) and "Need help?". On `/track` with no ID the aside shows only "Need help?". |
| 1440+ | Desktop frame; article 760; margin grows at 1920. |

## Sections (top to bottom)
Breadcrumb Home / Report & Track / Track a ticket. `h1` "Track your ticket". Intro. Then:
1. **Search form** (`<form role="search">` named "Find a ticket"): visible `<label>` "Ticket ID" (Figma has none visible; keep it visible, Body/S Medium, 6 px above the field), field with leading `search` icon and the value, button "Check status" (Primary). Hint under the label: "Example: MLC-261028-0482". The form is the same on `/track` and on `/track/[id]` (value = the normalised ID from the URL). A 1 px rule below separates it from the result.
2. **Result** (only on `/track/[id]` when found): see the next block.
3. **Search help** (only on `/track`, no ID): `h2` "Where to find your ticket ID" with two short lines (the confirmation email subject; the "Report submitted" page) and, for signed-in users, `h2` "Your recent reports": up to 3 rows (ID, title, status tag; whole row a link to `routes.reportTrack.ticket(id)`, newest first) from `getTicketsForUser`. Hidden for guests and while the session loads. No recent reports: the block is omitted.

### The result (`/track/[id]`, found)
- **Summary** (`div`, id `result`; focus target): ID in Body/S `gray-600`, status `Tag` right-aligned (Submitted, Pending, In progress, Resolved), `h2` is the ticket title (Poppins Semibold 28/36, mobile 24/32). Meta row: icon + "Complaint, blocked access" (`tag`), icon + location (`map-pin`), icon + "Submitted 28 Oct 2026" (`calendar`); icons `aria-hidden`, no separators.
- **Status** (`h2`, id `status`): `Stepper` `status`, tone `primary`. Steps Submitted, Pending review, In progress, Resolved. Current step by `ticket.status` (`submitted`→1, `pending`→2, `in-progress`→3, `resolved`→all four complete). Each step's date is that status's first update ("28 Oct, 14:41"); steps not reached read "Not yet" except Pending review at status `submitted`, which reads "Usually within 1 working day".
- **Updates from the authority** (`h2`, id `updates`): `Timeline` vertical, newest first. Each item: author (Body/S Semibold) + `<time>` (Body/XS `gray-500`) on one line (stacked below 390), "Status: In progress" (Body/XS `primary-700`, plain text), message (Body/S `gray-700`). Newest dot `primary-600`, older `gray-300`. More than 5 updates: show the newest 5 and a text button "Show 3 earlier updates"; activating it reveals the rest and moves focus to the first newly shown item (`tabindex=-1`). Automated replies use the same layout.
- **Your report** (`h2`, id `report`): for the owner: the description as a paragraph, attachment tiles (`attachmentCount`, 140 × 96, `ImagePlaceholder` with `image` icon, each `role="img"` named "Attachment 1 of 2"; tiles are not links), then the resolution box. Resolution box: unresolved: neutral callout "Resolution details" and "Shown here once the authority marks this ticket as resolved."; resolved: success callout "Resolution details" with `ticket.resolution` and the resolved date. For guests and other accounts: instead of description and tiles, a neutral callout "Report details are private" and "Log in with the account that sent this report to see what was sent." plus a "Log in" button (guests only, `routes.account.loginReturningTo(currentPath)`). The resolution box shows for everybody.

## Search behaviour
- Input: `type="text"`, `inputmode="text"`, `autocapitalize="characters"`, `autocomplete="off"`, `spellcheck="false"`, `enterkeyhint="search"`, `maxlength="24"`, Body/M. Typing is left alone; the value is normalised on submit and on blur (shared §3), so pasted text with spaces or an en dash works.
- **Timing:** on blur only when the field is non-empty, and on submit.
- **Errors (field):** empty "Enter your ticket ID." Not matching the pattern "That is not a ticket ID. It looks like MLC-261028-0482: MLC, six digits, four digits." Inline under the field, `circle-alert`, `aria-invalid`, `aria-describedby`; focus stays in or returns to the field on submit. No error summary (one field).
- **Submit with a valid ID:** `router.push(routes.reportTrack.ticket(id))` in a transition. While pending: button "Checking…" with spinner, `aria-busy`, `aria-disabled`; the field stays editable. When the new page is ready, focus moves to the `#result` block (`tabindex=-1`, no ring), or to the not-found callout, and the announcer says "Ticket {id}: {status}" or "No ticket found for {id}". On a direct visit or reload, focus is not moved.
- **Not found** (valid format, `getTicket` null and not in the client store): the form stays with the value, and under it a warning callout, `h2` "We couldn't find {id}", text "Check the ID in your confirmation email. If you just sent the report, wait a few minutes and try again, or call MRTCareline 1800-88-6782." Actions: "Try another ID" (focuses the field and selects its text) and "Report an issue" link. Response is the normal page (no 404 status) with `noindex`.
- **Invalid ID in the address** (`/track/abc`): the form renders with the field value "abc" in the error state ("That is not a ticket ID…"), no result. Not the global 404.
- The Enter key submits. Clearing the field and submitting shows the empty error (it does not navigate to `/track`).

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Ticket ID field | type, blur | Validate (on blur if filled) | default, focus ring, error, filled | Tab |
| Check status | click, Enter | Validate then navigate | default, hover, focus-visible, active, loading | Enter |
| Try another ID | click | Focus and select field | default, hover, focus-visible | Enter |
| Show earlier updates | click | Reveal more | default, hover, focus-visible | Enter |
| Recent report rows | click | Open that ticket | hover bg `gray-50`, focus-visible | Enter |
| Log in (private note) | click | Login and return | default | Enter |
| TOC, section bar, aside link | click | as `_shared.md` | | |

## Hidden content inventory
- Status step labels and texts (4 steps, with "Usually within 1 working day", "Not yet", dates).
- 4 status tags; the status and update copy per status. Mock tickets exist for submitted, pending, in progress and resolved states (check `tickets.ts`: it needs at least one ticket in each of these four statuses and one with more than 5 updates for the "show earlier" case; the writer adds the missing ones).
- Errors (empty, bad format), not-found callout, private-report callout, resolution callouts, announcements, "Where to find your ticket ID" (2 lines), "Your recent reports" heading.

## Dynamic states
- **Empty `/track`:** form and "Where to find your ticket ID". **Loading:** route `loading.tsx` shows a skeleton in the result area only (summary bar, stepper, three update rows), form stays live; also used while a new ticket is looked up in the client store (`aria-busy`). **Error:** a data failure shows a danger callout "We couldn't load this ticket" and "Try again" (reload) — mock data cannot fail but the state exists.
- **Resolved:** all four steps complete, last step "Resolved" with its date, resolution callout success. **Submitted (new):** one update, step 1 current.
- **Signed in vs guest:** shared §2.
- **Long content:** titles wrap (up to 3 lines); update messages are plain wrapped text; 100 updates: newest 5 then the button, which reveals in chunks of 20 in the same way.
- **No JavaScript:** the search needs it; a `<noscript>` line tells users to add the ID to the address, `/track/MLC-261028-0482`. Result pages are server-rendered and work without it.

## Motion
Stepper and timeline are static. Button spinner 1 s linear. Reveal of earlier updates has no animation. Callouts appear without motion. Reduced motion: spinner still, label "Checking…" carries the state.

## Accessibility
- `main` > breadcrumb, `h1`, search form, result. Heading order: `h1`, `h2` ticket title (in the result), then `h2` Status, Updates, Your report. (The ticket title is an `h2` because the section headings are siblings.)
- Focus order: sidebar or bar, breadcrumb, ID field, Check status, result (nothing focusable inside except Show earlier, Log in), aside.
- Stepper `ol` named "Ticket status" with `aria-current="step"` on the current step and state text. Timeline `ol`; times in `<time datetime>`.
- Error messages are `aria-describedby`, not alerts. The announcer carries the result.
- Touch targets 44 px (field, button, rows). Colour is never the only status signal: tags and steps have text.

## Links and destinations
Home → `routes.home`; Report & Track → `routes.reportTrack.overview`; Check status → `routes.reportTrack.ticket(id)`; Recent rows → same; Report another issue and Report an issue (aside, not-found) → `routes.reportTrack.report`; Log in → `routes.account.loginReturningTo`. MRTCareline is plain text.

## Open questions
1. **Report text visibility:** per R2 guests can track. I made status and replies public (the ID is the key) and the description and photos owner-only. Confirm.
2. **Submitted tag:** a fourth status tag (shared §1 item 2). Also the overview intro's guest sentence says "track a ticket" needs an account, which R2 contradicts: content should drop "or track a ticket".
3. **Recent reports and "Where to find your ticket ID"** on the empty state are mine (the brief asks me to specify the empty state; Figma has none).
4. **Mock coverage:** one ticket with more than 5 updates.
