# Account: main agent decisions (iteration 6)

These win over the page specs where they differ.

1. **Demo login:** `meiling.tan@example.com` with password `Mutiara123`. It is a mock and never a real credential. Document it in the login spec and in the iteration log, not in USER-CHECKLIST (that file is for owner actions).
2. **Forgot password:**
   - the sent state and the password checklist are accepted
   - resend unlocks after 30 s, with no maximum count, to keep it simple
3. **Bahasa Melayu:** if Figma shows the language option, show it disabled with the "coming soon" line from the content file. If it doesn't, leave it out.
4. **Delete account:** a plain confirm dialog with Cancel and Delete. No type-to-confirm.
5. **After delete:** sign out and go Home. No notice and no notification-bar change.
6. **Followed stations "Add a station":** a link to the Stations list (`routes.project.stations`), not a popover. **My reports:** show the 3 latest, plus a link to all of them.
7. **Resting states:** forms start empty, and the visual states fill them to match Figma. Accepted.

**Shared changes (`_account-shared.md`):** all approved, if they're additive and backwards compatible. The mock session in `src/lib/session` stays the one source of the signed-in state. The new `lib/auth` wraps it and doesn't duplicate it.

## Content follow-ups

- **A8, report types:** decision R1 (complaint, feedback, inquiry) lands on main with the report-track merge. Account merges main before it builds, so it doesn't change the types itself.
- **A1, ticket title:** use Figma's title, "Hoarding blocking driveway on Jalan Penang", in the mock ticket. Change it after the merge, so there's one edit.
- **Profile counts:** they come from the signed-in user's tickets (1 pending, 1 in progress, 4 resolved), never from hard-coded numbers.
