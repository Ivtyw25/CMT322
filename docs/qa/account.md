# Account QA: continuation review (3 November 2026)

Result: **required functional fixes completed in the fresh fix round; final visual approval pending**. Independent tester reviewed the implementation against `CLAUDE.md`, `ARCHITECTURE.md`, the four account specs and `_account-decisions.md`. Owner decisions override the superseded popover, typed-delete and home-notice proposals.

## Evidence and limits

- Reused root verification: `.logs/continuation-behavior-final.log` reports 72/73 passing account/legal/report/shared behavior tests; the remaining failure is the separate map tile-text case. Root's typecheck, lint and token checks passed. Root's responsive rerun passed ten focused 320/390 checks.
- Additional browser probes against `http://localhost:3601`: `.logs/account-review-check.mjs` reproduced blocked-storage login remaining a guest and a signup password checklist with no `aria-describedby` relationship.
- Production build remains unverified because Google Fonts requests fail in this environment. Fallback fonts prevent reliable final pixel approval. No live Figma review claimed. Review applied the repository React/composition conventions.

## One batched fix round

| ID | Severity | Finding and reproduction | Required change |
| --- | --- | --- | --- |
| A-QA1 | major | With `Storage.prototype.getItem/setItem` throwing, submit the documented demo credentials at `/login?next=%2Faccount`: after the mock succeeds, the browser is back at login, `data-session="guest"`. `src/lib/session/session.ts` has no memory fallback; writes silently fail and reads stay null. `_account-shared.md` §2 explicitly requires sign-in for this page view with storage blocked. | Preserve the initial guest fallback tested by `shared/session.spec.ts`, but retain an explicit successful sign-in in memory; clear it on sign-out. Add a blocked-storage sign-in/return/sign-out test. |
| A-QA2 | medium | At mobile widths, `profile-page.tsx` renders six wrapping section links rather than the saved sticky Account section bar; these links never expose the current section. The desktop DocsAside does provide scroll-spy, so the two navigation modes differ. | Reuse/adapt SectionBar for the profile's six section anchors, update current label/`aria-current` as the visible heading changes, preserve hash/focus behavior. |
| A-QA3 | medium | Signup's visible `PasswordRules` list is not associated with its password input: the browser probe found one form list and `aria-describedby=null`. Profile password change has the same unassociated checklist; a wrong-current-password error is attached to the new-password field. | Give the checklist an id and include it in the field description without losing Field's error ids. Attach current-password failures to Current password, new-password failures to New password. |
| A-QA4 | minor | Auth passwords have no Caps Lock detection despite `_account-shared.md` §3 and `login.md` explicitly specifying the polite hint; the copy exists but is unused. | Add the focused Caps Lock hint, or record an explicit accepted spec exception. |
| A-QA5 | minor | `profile-page.tsx` calls `decodeURIComponent` on arbitrary `location.hash` without a guard; a malformed hash such as `#%` throws in the effect. | Treat malformed/unknown hashes as no selected section; retain normal valid-anchor focus. |

## Final visual/content sweep

- The fix round adds desktop label/value/action columns, compact wrapping desktop station chips, report updated date/time through existing format helpers, and an inline language editor with a disabled Bahasa Melayu option. Header, card spacing and notification/security rows still need final reference comparison.
- Login/reset reference states now fill the saved demo examples in `tests/visual/states.ts`; signup remains empty as its saved reference specifies. Keep the 3% tolerance unchanged until differences are resolved or explicitly accepted.

## Fresh builder fix round

- **A-QA1 fixed:** explicit successful sign-in uses a page-view memory fallback only when session storage cannot retain the write. Initial blocked storage remains guest; sign-out and cross-tab invalidation clear the fallback. Regression covers blocked-storage login, protected return and logout.
- **A-QA2 fixed:** Account reuses the shared sticky SectionBar with scroll-derived current labels and `aria-current`. Account selection focuses the section and writes its hash. The active offset uses actual document scroll padding plus section scroll margin; these combine to 258px on mobile. Sticky pointer/Escape focus uses `preventScroll`.
- **A-QA3 fixed:** password checklists have stable ids; PasswordInput merges these descriptions with Field errors. Current-password failures now mark Current password, while new-password failures mark New password.
- **A-QA4 fixed:** focused password controls show a polite Caps Lock hint and remove it on blur.
- **A-QA5 fixed:** malformed account hash escapes are ignored without throwing.
- **Accepted mock behavior retained:** `_account-shared.md` §3 explicitly states Keep me logged in uses the same session storage either way. The checkbox toggles; no new persistence semantics were introduced.

Validation: `npm run typecheck` and targeted ESLint passed. `.logs/account-fix-final.log` records **16/16 account and shared-session tests passing**. `.logs/account-nav-final.log` independently records the mobile pointer/keyboard/current-state regression passing. The sticky reopen test clicks the painted viewport bounds because Playwright's locator action scrolls a sticky control to its original layout box before pointer events; assertions remain unchanged. An earlier broad dev/HMR run was superseded for account; its unrelated segmented-control keyboard failure is left to root verification. Root has since integrated local fonts and is running consolidated verification; this builder does not claim its result.

Approved behaviors retained: empty resting auth forms; demo credentials; unlimited resend after each 30s cooldown; ordinary delete confirmation without typed text; delete signs out and goes Home without notice; Add a station links to Stations; latest three reports; one mock session provider.
