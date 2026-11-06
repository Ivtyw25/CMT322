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

## Fix round 4 Nov+ (6 November 2026)

Scope: visual differences for login, signup, forgot password and profile (desktop 1440, light). References and the 3% tolerance are unchanged. Measured on the dev server (port 3701) with `tests/visual` (`.logs/auth-fix-run.log`, counts by `.logs/counts-auth.mjs`).

| Frame | Before | After |
| --- | ---: | ---: |
| Login desktop light | 9.70% | 2.17% |
| Signup desktop light | 15.14% | 1.93% |
| Forgot password desktop light | 8.66% | 2.12% |
| Profile desktop light | 22.01% | 8.42% |
| Login / signup / forgot / profile mobile light (not targeted) | 13.19 / 13.63 / 11.92 / 22.44% | 13.28 / 13.85 / 12.06 / 10.97% |

What changed, from Figma metadata (frames 4:959, 78:2530, 100:4081, 92:2963):
- Auth shell: columns are 712/728 as in Figma (were 50/50); form column is vertically centred between logo and legal line without extra padding, so content starts at y 154 (login), 117 (signup), 278 (forgot); legal line sits at y 842 in a 600 px box (it wrapped before); panel heading breaks as designed ("Your reports, / all in one place", "Stay ahead of / road changes") at y 200; sign-up illustration is offset 14 px as in Figma.
- The prototype notice (truthful copy kept) no longer pushes the form down at 1024 px and above: it sits right of the logo row. Below 1024 px it stays above the heading.
- Form rhythm: 20 px between login password, keep-me-logged-in and button; 6 px for the sign-up hint; guest panel is 88 px with a 44 px hit area on its link.
- Profile: container is 1200 px wide with the Figma gutters; cards now have head (title, lede, optional action) plus divided rows, label/value/action columns of 180 / flexible / auto, hints under phone, home area and language, notification switches at the row end with the hint beneath the label, security and privacy rows in columns, "View all tickets", "Add a station" and "Delete account" as header actions, station chips with code badge, sidebar rows 34 px high with a 44 px hit area. `Switch` gained an optional `description` prop (backwards compatible); `ProfileCard` takes `lede` and `action`.
- Remaining profile difference: the approved latest three reports (Figma shows one) push all lower cards 86 px down, plus the shared footer (prefilled newsletter email, other builder). The Google "G" mark beside "Connected" is not rendered because only the full button artwork exists in the brand folder.
- Google button: official artwork is kept at 180 x 40 and centred; Figma shows a 400 px wide button, which would need stretched artwork, so it is not matched.
- Mobile: the notice above the heading still shifts the form (about 90 px) against the 390 frames; mobile differences are unchanged within 0.2 points for auth and improved for profile.

Dark references: none of the six auth dark references can be generated. `docs/BRIEFING.md` lists the only dark Figma frames (D01, D02, D13 and the two mobile ones: Home, About, KOMTAR) and `pages.json` has no dark frame for login, signup, forgot password or profile. No reference was fabricated; those dark visual cases stay skipped.

Checks (dev server 3701): typecheck pass; check:tokens pass; ESLint on changed files clean (the repository-wide `npm run lint` also scans untracked `.next-3702` build output and reports thousands of unrelated errors); account e2e plus session spec 18 passed; accessibility 16 passed; responsive 36 passed (four pages, nine widths).

## Fix round: match Figma for account pages (6 November 2026)

Owner decision of 6 Nov applied: the pages follow Figma; accessibility stays through `hit-area` extensions. References and tolerance unchanged. Measured with `tests/visual` against the shared dev server (port 3702: a second dev server cannot start in the same folder while the other builder's server owns `.next`). Counts by `.logs/counts2.mjs`.

| Frame (light) | Before | After |
| --- | ---: | ---: |
| Login 1440 / 390 | 2.17 / 13.28% | 1.89 / 2.87% |
| Signup 1440 / 390 | 1.93 / 13.85% | 2.11 / 2.33% |
| Forgot password 1440 / 390 | 2.12 / 12.06% | 1.96 / 2.18% |
| Profile 1440 / 390 | 8.42 / 10.97% | 1.15 / 2.90% |

Causes found and fixed:
- Auth 390: the Figma frames have no prototype notice; ours sat above the heading. It now sits under the legal line (below the fold, truthful copy kept). The divider has no "or" on mobile (Figma draws a plain 1 px line) and 18 px height. Google button was 44 px high (now 40 px with a 44 px hit area); checkbox, "Forgot password?", guest link and legal links use `hit-area` instead of 44 px boxes; guest hint is left-aligned on mobile with 16 px padding; legal line is four items with 4/8 px gaps and no underline; form column starts at y 96.
- Logo (shared): the PNG has transparent padding, so the mark painted 33 px instead of 44. Default size now uses a 56 px image with -6 px margins (same 44 px footprint). This also corrects the header and footer logos.
- Profile: rows are 16 px padded with a 2 px gap between title and hint (were 71 px, Figma 73); Switch label is a block (was a 24 px line box); trailing empty status paragraph added a 24 px flex gap above the footer; privacy values use body-s; station chips 60 px with a 44 px hit area on the link and a grey X; devices hint is 12 px; "View all tickets" is the ghost link style; one latest report (was three); danger card has the light red border; mobile uses the stacked row layout, 32 px gutters, 2-column stats, stacked latest-report row (tag and chevron below), action beside the title for My reports only.
- Shared footer: mobile link rows 30 px apart (hit areas keep 44 px), heading gap 10 px, contact and logo gaps as in the mobile frame.

Residual (not fixed, by design):
- Google sign-in button stays 180 x 40 official artwork; Figma shows a 350/400 px wide button, and the artwork may not be stretched.
- The "Connected" row has no Google "G" mark (only full button artwork exists).
- Latest report title: Figma profile frames say "Hoarding blocking driveway on Jalan Penang"; the mock ticket (also used by the track frames) says "Driveway blocked by site hoarding". The mobile title is given a two-line minimum height so the layout matches the Figma row; the wording differs.
- Station subtitle for S13 is "USM, Gelugor" (data); Figma "Gelugor". Newsletter on mobile keeps its truthful copy (no area select) and the signed-in prefilled email; Figma shows the signed-out form. Mobile header icon chrome (theme button border, avatar size) is the shared header, untouched.
- Email value breaks as "example.c/om" at 390; Figma breaks after the dot.

Checks (BASE_URL 3702): typecheck, check:tokens and ESLint/Prettier on touched files pass; account e2e 19 passed, a11y 16 passed, responsive 36 passed, visual for these four pages 8 passed.
