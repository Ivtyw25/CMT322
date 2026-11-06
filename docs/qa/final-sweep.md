# Final sweep: shared shell, maps and submitted reports

Update 4 November 2026: Inter and Poppins are now bundled locally, and the fixed production build is served at http://localhost:3610. The font-fetch limitations in the historical 3 November notes below are superseded. The complete production responsive suite passed: **441 passed, 0 failed, 0 skipped**. See the final production result at the end of this report.

Reviewed 3 November 2026 against the current uncommitted workspace. This is a focused tester pass, not completion of Phase 3. No implementation changes were made by this reviewer.

Read AGENTS.md, CLAUDE.md, ARCHITECTURE.md, docs/CODEX.md, the installed Next.js page guide, shared/report specifications and the repository React/composition skills. Inspected the shared/map/report diff and ran an independent Playwright inspection against http://localhost:3601. The development server uses fallback fonts because Google Fonts cannot be fetched. Production verification and authoritative visual measurements remain outstanding.

## Batched fixes

| ID | Severity | Finding and evidence | Required action |
| --- | --- | --- | --- |
| FS1 | medium, test | `tests/e2e/report.spec.ts`, tile-error overlap case, scopes the status to `mapRegion(page)`. The named region is the inner Leaflet container; the React error overlay is its sibling in `LocationMap`. The failure snapshot already contains `status: The map couldn't load.` immediately after the region. Root's targeted run reports 72 passed and this one failure. | Scope the status to the enclosing map wrapper, for example `mapRegion(page).locator('..').getByRole('status')`. Keep the existing geometric overlap assertion and rerun the focused case. This is a deterministic locator error, not an observed tile-loading regression. |
| FS2 | minor, accessibility | The draggable report pin remains an interactive 40 by 40 px Leaflet marker, without the shared `hit-area` utility. Independent measurements at both 320 and 390 px confirm 40 by 40. The report accessibility spec requires mobile map buttons to have 44 px targets. Enlarging zoom/drop controls did not enlarge the draggable pin itself. | Provide a 44 px mobile target for the draggable pin while retaining its intended visual size and geographic anchor. Include the pin in the mobile target check. |

## Deferred report QA items

| Original item | Result in this review |
| --- | --- |
| R-QA1, map controls | Zoom/drop controls now use 44 px below lg, and the location button has a 44 px minimum. Root's focused control test passed. See FS2 for the remaining draggable-pin target. |
| R-QA2, error under pin | Fixed in the inspected implementation. Independent tile-abort checks at 320 and 390 px show the error text ending 47 px above a centred pin. The full unavailable message remains visible. FS1 prevents the automated regression case from measuring this. |
| R-QA5, unavailable contents | Fixed for guest and unknown-ID states. Independent checks show no On this page navigation and no `#ticket-id-value` for these states. Root's owner test confirms four contents links with corresponding rendered targets. |
| R-QA9, shell controls | Fixed for measured mobile controls. At 320 and 390 px, theme/menu/avatar controls and notice-dismiss button have 44 by 44 px boxes; mobile header remains 61 px tall and the document does not overflow. |

## Ownership and regression review

`SubmittedView` still gates confirmation sections on a resolved ticket and `ticket.reporterId === user.id`. Moving DocsLayout into the view correctly keeps contents navigation synchronized with the rendered state. Guests and unknown IDs do not render ticket details in the inspected DOM. The mock session and serialized mock records are demonstration behavior, not production authorization.

The new profile-aware shell helper keeps saved names in the header and drawer; it does not change the session identity. The current diff retains Leaflet isolation, visible OpenStreetMap attribution, existing keyboard pin controls, and reduced-motion behavior.

## Remaining visual work

- Re-measure all page/reference combinations with Inter and Poppins available, then lower measured tolerances only when justified. Fallback-font screenshots cannot certify the intended typography or wrapping.
- Shared mobile header/footer differences carried from earlier groups remain open. Do not reduce tap targets to reproduce Figma's smaller controls. The accepted 44 px footer rows intentionally make the footer taller than the reference.
- Revisit the saved Home QA H6 notice/theme-button appearance and project QA P-QA8 footer social-row wording/newsletter tile against the saved references and owner decisions; this pass did not approve those visual differences.
- Run the final consolidated verify pass after fixes and a successful production build. Separate concurrent Playwright runs must use distinct output directories to avoid trace-file collisions.

Independent inspection evidence: `.logs/shared-sweep-review.mjs`, `.logs/shared-report-320.png`, `.logs/shared-report-390.png` (scratch artifacts, not for commit). Root run evidence: `.logs/continuation-behavior-final.log` and its tile-error failure context under `.logs/continuation-behavior-results/`.

## Fresh builder fix round (3 November 2026)

- **FS1 fixed:** the tile-error regression now searches the common map wrapper for the sibling status overlay. Its geometric error/pin separation assertion passes.
- **FS2 fixed:** the Leaflet marker has a 44 by 44 px interactive box and a centred 22 by 22 px anchor. Its inner circle remains 40 by 40 px, preserving the geographic point and visual treatment. The mobile map-control test now places a pin and measures its target too.
- Focused map, 404 and help-navigation regression: **16 passed**, recorded in `.logs/integration-fix.log`, with separate artifacts under `.logs/integration-fix-results`. This includes keyboard pin placement/nudging, current-location behavior, text-error separation, attribution, both nested-404 widths and shared navigation. Targeted ESLint passed.
- No visual tolerance was changed. The remaining visual/build limits above still apply; this fixes the batched functional issues without declaring the final sweep complete.

## Complete production responsive pass (4 November 2026)

**Result: 441 passed, 0 failed, 0 skipped in 16.1 minutes.** This pass ran against the stable production build at http://localhost:3610 with the actual locally bundled Inter and Poppins fonts and the integrated fix rounds.

Command: `BASE_URL=http://localhost:3610 node node_modules/@playwright/test/cli.js test --project=responsive --workers=2 --retries=0 --reporter=line --output=.logs/final-responsive-results`.

The matrix covers all 49 active concrete route visits at 320, 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px: both Home URLs; Project overview, About, Stations and all 22 station templates; Construction and FAQ; every Traffic URL, including both route-view states; Report & Track, Report, Submitted and both Track URLs; Login, Signup, Forgot password and Profile; all legal/help routes and the unknown-route page.

Every case passed the repository assertions for document overflow, clipped leaf text, mobile 44 px target sizing (including the suite's explicit hit-area and inline-link exemptions), and the visible mobile/desktop header variant. These are the suite's initial route states; interactive-state behavior and visual comparison have separate verification.

No additional responsive source or test fixes are required from this run. The earlier FS1/FS2 fixes remain integrated. Full output is recorded in `.logs/final-responsive.log`; the run used a separate artifact directory to avoid collisions with other agents' checks. Visual fidelity and the other final verification suites remain the root agent's integration responsibility.

Runner note: Playwright's final summary is `441 passed (16.1m)` with no test failure blocks. The outer PowerShell command nevertheless reported exit code 1; redirected stderr includes its `NativeCommandError` envelope for the NO_COLOR/FORCE_COLOR warning. The native process exit code was not captured separately. Future wrappers should preserve `$LASTEXITCODE` explicitly; this pass was not repeated solely to investigate the shell envelope.

## Fix round, 6 November 2026

Re-verified R-QA1, R-QA2, R-QA5 and R-QA9 on a fresh dev server (port 3702): the existing regressions pass (8 of 8: mobile map controls and pin at 44 px, tile-error text clear of the pin, guest and unknown-ID Submitted without "On this page", header and notice buttons at 44 px). Shared geometry fixes: desktop notice text centring, footer legal link weight. Visual before and after per frame is in `docs/qa/legal-help.md`. Sitemap 1440 fell from 13.39% to 6.37%; Project overview 390 from 16.14% to 15.41%; About 390 stays near 26% because its Figma frame is truncated. References and tolerances untouched.

## Final visual fix round, 6 November 2026

| Frame | Before | After | Tolerance |
|---|---|---|---|
| report-track-overview 390 light | 10.55% | passes (under 10%) | 10% |
| report-submitted 390 light | 17.34% (when the aside divider was restored) | passes | 17% |
| terms 390 light | 4.60% | 3.83% | 3% |
| privacy 390 light | 4.05% | 3.43% | 3% |
| accessibility 390 light | 10.35% | 3.38% alone, 3.65% under load | 3% |
| account frames (login, signup, forgot-password, profile, 1440 and 390) | pass | pass | 3% |

**1. report-track-overview regression.** Cause: this round's `docs-layout.tsx` removed the divider above the aside ("Need help?") and cut the gap to 24 px. The Figma frames for Report & Track keep the divider (border-top, 24 px padding, 40 px top margin), and so do most docs pages. The legal-help card aside has none. `DocsLayout` now takes `asideDivider` (default true, Figma docs pages); the legal-help frame and Report Submitted pass `false`, which is what their frames and references measure. Page height went from 3036 to 3077 px (Figma 3087). The footer was not the cause: its heading, link and contact offsets match Figma to the pixel.

**2. terms and privacy 390.** Verified by measurement, not assumed. Colours, left edges, line positions and block offsets match the references. Remaining differences: (a) the references are greyscale-antialiased, the test browser used sub-pixel (LCD) antialiasing, so the visual project now launches Chromium with `--disable-lcd-text` (about 0.7 points); (b) Figma's Inter renders lines 1 to 2 px wider or narrower than the bundled Inter, a glyph-advance difference between font builds that no token can change; (c) one real mismatch, fixed: the breadcrumb. Figma uses 6 px gaps around the chevron (we had 8) and gray-700 for the current page (we had gray-900); `breadcrumb.tsx` now matches. Newsletter card copy ("Choose your area...") and a 2 px shorter footer card come from deliberate choices (no area select on mobile, 44 px tap input). These frames stay slightly over 3%.

**3. accessibility 390.** The bullet now reads "Choose Light, Dark or System appearance. The site remembers your choice." (true: the theme choice is saved per browser) and wraps to two lines like Figma's bullet. Every row up to the footer now aligns with the reference (shift 0); only the footer is 2 px shorter, as above. Also changed: the mobile theme button uses the bordered outline style of the Figma header (40 px, hit area keeps 44 px). Noted in `docs/content/legal-help.md`.

Runs (port 3701, dev server): typecheck, lint, check:tokens pass; visual 54 passed and the 3 frames above over 3%; e2e for the touched pages 237 passed.
Responsive 446 passed, a11y 200 passed (same run).
