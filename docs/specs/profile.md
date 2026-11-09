# Profile and settings: UX spec
Route: `/account` (`routes.account.profile`, protected), anchors `#profile #reports #stations #security #privacy` · Figma: desktop 92:2963, mobile 133:36817 · no dark frames

Header, footer, docs layout: [`_shared.md`](./_shared.md). Mock session, dialog, inline-edit row: [`_account-shared.md`](./_account-shared.md).

## Purpose and primary task
A signed-in resident checks their reports, manages followed stations and email alerts, and edits their details. Quick, forgiving, on a phone.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390, side padding 20. Value and "Edit" link stack: Edit stays on the label row (right). Station chips stack one per row. |
| 390–767 | Mobile frame: page header (avatar, name, email, "Member since March 2026", "Log out" button below), section bar "Account / Profile details" (sticky, opens the list of the 6 sections), one column of cards, padding 20 (32 from 600). Rows: label above value, "Edit"/"Change" on the label row right. Report counts: 2 + 1 tiles wrap as Figma. |
| 768–1023 | Mobile header and section bar. Cards use the desktop row (label column 160, value, action). Counts in 3 columns. Log out beside the name block. |
| 1024–1279 | Sidebar (240) + cards (max 680). "Log out" in the header band right. |
| 1280–1439 | As 1024; cards 720. |
| 1440+ | Desktop frame: sidebar, cards 680. At 1920 only margins grow. |

## Sections
Page header: breadcrumb Home / Account, avatar circle 72 (`primary-600`, initials), `h1` the user's name (`Poppins`), email and "Member since March 2026" on separate lines on mobile, side by side on desktop (no middle dot), "Log out" Secondary button. Sections are `h2` cards with ids from `profileSections`; the sidebar and section bar mark the one in view (scroll spy, `aria-current="true"`), and a click scrolls with 140 px margin and moves focus to the `h2`. Hash on load scrolls and focuses the same way.

1. **Profile details** (`#profile`): rows Full name, Email (with "Verified" tag), Phone (optional), Home area, Language. Actions "Edit" (Language: "Change").
2. **My reports** (`#reports`): counts Pending, In progress, Resolved from the user's tickets (`lib/reports` plus mock tickets); "View all tickets" → `routes.reportTrack.track`; latest report row (title, ID, "updated {date} at {time}", status Tag, `chevron-right`) is one link to `routes.reportTrack.ticket(id)`. Up to 3 rows (most recent first); each is a link.
3. **My stations** (`#stations`): followed stations from `lib/follows` as chips (code tag, name, area, remove `x`). "Add a station".
4. **Sign-in and security** (`#security`): Password (dots, "Last changed 2 months ago", Change), Google account (email, "Connected", Disconnect), Signed-in devices ("Log out of other devices").
5. **Privacy and data** (`#privacy`): Your data "Request", Terms "View" (→ `routes.legal.terms`).
6. **Delete account** card (danger text, outlined danger button).

## Edit details
Row "Edit" swaps the value into a field with Save (Primary small) and Cancel (text) under it; one row edits at a time: while one is open the other Edit links are `aria-disabled`. Focus goes to the field; Save returns focus to that row's Edit link. Escape = Cancel.
| Field | Rule | Message |
|---|---|---|
| Full name | 2 to 80 | "Enter your full name." |
| Email | `name@host.tld` | "Enter your email address." |
| Phone | empty, or 9 to 12 digits (spaces, `+`, `-`) | "Enter a phone number with 9 to 12 digits, or leave it empty." |
| Home area | select, 1 of the mock areas | none (always valid) |
| Language | segmented English / Bahasa Melayu | Bahasa Melayu is not available yet: selecting it shows the info line "Bahasa Melayu is coming soon. The site stays in English." and nothing changes |
Validation timing: on Save and on blur after touch. Save: 400 ms, writes `mlc-profile`, status "Name saved" (per field), row updates, header chip and page title update at once. Changing Email replaces the "Verified" tag with "Not verified" (`warning` tag) until reloaded; no flow.

## Followed stations
`lib/follows` (`useFollows`): chips mirror it live (also from the header and station pages). Remove `x` button named "Stop following {station name}": removes at once, status "{name} removed from your stations", focus moves to the next chip's remove button, else the previous, else "Add a station". Undo: a text button "Undo" appears in the status line for 6 s ("{name} removed. Undo"); activating it restores the chip at its old position. "Add a station" opens a Popover (not a dialog) listing the unfollowed stations as checkbox rows with search-free scroll (max 320 high), "Done" closes; each checked row follows at once. Empty: dashed card "You are not following any station." and "Add a station"; the sentence "We alert you about closures…" stays. Cap: none. Chip name truncates with ellipsis at 2 lines.

## My reports
Empty (no tickets): counts show 0 (muted), instead of the row: "You haven't sent a report yet." with Secondary button "Report an issue" → `routes.reportTrack.report`. A count tile with 0 is not a link. Loading: 3 tile skeletons and one row skeleton.

## Notification preferences
Each row is a `switch` (`role="switch"`) labelled by the row title, described by its line. Saved on toggle, instantly (optimistic), 300 ms mock write; status "{title} on" / "{title} off". On failure (write rejects): the switch reverts, an inline danger line under the card title "We couldn't save that. Try again." with `circle-alert`, status the same. Never block the other switches. The switch and its label (a `<label>` for the switch) are the target, 44 px tall.

## Password change, Google, devices
- **Change password:** opens inline form (current password, new password with `PasswordRules`, Save, Cancel). Current password must be `Mutiara123` else "Current password is incorrect."; success status "Password changed", row says "Last changed just now". The new password is not stored.
- **Disconnect Google:** dialog "Disconnect Google?" with body "You can still log in with your email and password." and buttons Disconnect (Primary danger) / Cancel. Success: row becomes "Not connected" with link "Connect Google" (instant, mock).
- **Log out of other devices:** dialog, "Log out other devices?" / "This device stays logged in." Confirm shows status "Other devices were logged out" and the line "Also signed in on…" is replaced by "No other devices."
- **Request a copy:** click shows status line under the row "We'll email a copy to {email} within 7 days." and the link becomes disabled text "Requested".

## Log out
Header "Log out" button (and the account menu one): `useSession().signOut()`; on `/account` the existing guard goes Home. No confirmation. Focus lands on the Home `h1`.

## Delete account dialog
Danger button "Delete account" opens `Dialog` (`role="alertdialog"`): title "Delete your account?", text "This permanently removes your account and personal details. Open tickets will be closed. This cannot be undone.", a field "Type DELETE to confirm" (not case-sensitive, trimmed), buttons "Delete account" (danger, disabled until the field matches; label while pending "Deleting…") and "Cancel"; initial focus is on Cancel (the safe action). Escape, scrim click and Cancel close it and return focus to the trigger. Success (700 ms mock): clear `mlc-session`, `mlc-profile`, `mlc-follows`; redirect Home with a one-time notice. **Notice:** `routes.home?deleted=1` is not allowed (query noise); use `sessionStorage` key `mlc-notice` = "Your account was deleted." read by the notification bar on Home as a success message, dismissible, then removed. Failure never occurs in the mock; on rejection the dialog shows the danger line "We couldn't delete your account. Try again." and stays open.

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Edit / Change | click | Inline editor | default, hover, focus-visible, aria-disabled | Enter |
| Save, Cancel | click | Save or close | default, hover, focus-visible, loading | Enter, Escape |
| View all tickets, report row | click | Track / ticket | link states, hover bg `gray-50` | Enter |
| Remove chip x | click | Unfollow, undo status | default, hover, focus-visible | Enter, Space |
| Add a station | click | Popover | default, open | Enter, Escape closes, Arrow keys in list |
| Switches | click | Toggle, save | on, off, hover, focus-visible, pending, disabled while pending | Space |
| Log out | click | Sign out | default, hover, focus-visible, loading | Enter |
| Delete account | click | Dialog | danger outline states | Enter |
| Sidebar / section bar | click | Scroll to section | default, current | Enter |

## Hidden content inventory
All field messages and statuses above; empty cards (stations, reports); 3 dialogs' text; Language options; "Bahasa Melayu" line; undo line; mock areas list (existing `areas.ts`); station popover rows (all 22 minus followed); 5 notification titles and lines (Figma); "Not verified", "Not connected", "No other devices", "Requested", the home notice text.

## Dynamic states
- **Guest / loading:** skeleton page (header band, 3 cards), `aria-busy`, nothing personal in the DOM; guest then redirects.
- **Long content:** 100-character name wraps in the header (`overflow-wrap:anywhere`) and truncates with an ellipsis in the header chip; long email wraps in rows. 100 followed stations is not reachable (22 max). 100 reports: only the 3 latest show, with "View all tickets".
- **Storage blocked:** edits and switches apply for the page view only; no message.
- **No JavaScript:** `<noscript>` "This page needs JavaScript."

## Motion
Shared §4. Section scroll is instant (no smooth scroll) under reduced motion, otherwise 250 ms. Chip removal: no animation. Popover: fade 100 ms.

## Accessibility
`main` holds breadcrumb, `h1`, then six `h2` cards plus Delete account. Sidebar `nav` "Account sections". Focus order: sidebar or section bar, Log out, then each card in order. Statuses go through one shared polite region. Dialogs: focus trap, Escape, `aria-labelledby` and `aria-describedby`, page behind `inert`, focus returns to the trigger. Switch rows: label and description in one `<label>`. Chip remove buttons 44 px target (hit area extends beyond the chip). Colour never alone: status Tags have a dot and text; "Verified" has a check icon.

## Links and destinations
Home → `routes.home`; View all tickets → `routes.reportTrack.track`; report rows → `routes.reportTrack.ticket(id)`; Report an issue (empty) → `routes.reportTrack.report`; Terms View → `routes.legal.terms`; Log out, Delete account, Add a station, Request, Change, Disconnect → actions as above. Logo, nav, footer: shared.

## Open questions
1. Language "Bahasa Melayu" is shown but not built (BM is out of scope): proposed the "coming soon" line.
2. Type-to-confirm in the delete dialog is stricter than Figma shows; drop it if the owner wants a plain confirm.
3. The "Add a station" popover and the 3-report limit are mine; Figma shows one report and no picker.
4. Home notice via `sessionStorage` `mlc-notice` needs a small notification-bar change (shared change 8 area).
