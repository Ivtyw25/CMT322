# QA: Home (round 1)
Result: FAIL

| DoD | Check | Result | Evidence |
|---|---|---|---|
| 1 | Design match light/dark | FAIL | test:visual: 8 fail (7.2 to 13.5% vs 3%): 1440 light 8.4%, 1440 dark 7.2%, 390 light 12.5%, 390 dark 11.1%, menu-open 1440 13.5%, search 1440 8.4%, search 390 13.2%. menu-open 390 fails on a selector (H4). Page is 113 px shorter than Figma at 1440 (6472 vs 6585) and 137 px at 390. Per-band diffs: `.logs/qa/shots.out`; side-by-sides `.logs/qa/sbs-*.png` |
| 2 | Typecheck / lint / tokens | PASS | all exit 0; build passes |
| 3 | Screen sizes | FAIL | No horizontal scroll or clipping at 320, 360, 720, 768, 1024, 1280, 1440, 1920. test:responsive fails 8: careline link 276x28 (H3) |
| 4 | Links | PASS | test:links 4 passed |
| 5 | File structure | PASS | thin route, features/home, copy in content/home.ts, data through data/api, spec at tests/e2e/home.spec.ts |
| 6 | Content | PASS | Rendered text matches docs/content/home.md; Bukit Jambul shows 12 Oct, 26 Oct, 3 Nov; Butterworth shows the empty state |
| - | Accessibility (axe) | FAIL | test:a11y 6 fail (H1, H2) |
| - | e2e | PASS | home.spec.ts 46/46 on re-run with --workers=1 against the production build. First full run: 1 Home flake (sign-up success, passes on re-run) and 1 shared failure (H9) |

## Issues
| # | Owner | Severity | What and where | Expected | Status |
|---|---|---|---|---|---|
| H1 | builder | major | axe `label-content-name-mismatch` (serious) on all 22 diagram links, e.g. `a[aria-label="S31 Penang Sentral"]`: the aria-label does not start with the visible text. test:a11y home | Accessible name contains the visible text (WCAG 2.5.3); suffixes go at the end | open |
| H2 | builder | major | axe `color-contrast` (serious): (a) subscribe footnote "You can unsubscribe at any time." gray-500 on primary-50 is 4.44:1 (light, desktop and mobile); (b) dark mode diagram station codes `text-primary-600` on #141416 is 3.92:1 | 4.5:1: darker footnote token; lighter code colour in dark | open |
| H3 | builder | major | Careline title link is 276x28 px below 768 (320, 360, 390, 414). test:responsive "tap targets under 44x44" | Spec: 44 px minimum, add `hit-area` | open |
| H4 | builder (or tester if the selector is wrong) | major | home-menu-open--390--light: `[data-header="mobile"]` button "Open menu" not found in 10 s (tests/visual/states.ts) | Menu opens at 390 and matches 134:8244 | open |
| H5 | builder | major | Visual diff over tolerance. Hero, Works, About and FAQ match closely, but vertical rhythm drifts. Line preview is about 15 px shorter: toggle row 14 px higher, lede runs full width (Figma wraps near 600 px), legend shows a different item set. About text column is wider (about 490 px, Figma 380) and sits 15 px higher. Total -113 px at 1440. See `.logs/qa/sbs-home--1440--light-1900.png` | Section sizes and gaps per Figma 37:1043 and 37:1037 | open |
| H6 | builder | minor | At 390 the over-hero notice bar is dark translucent navy; Figma 133:6556 shows a cream bar with amber text. The theme button also shows a boxed outline at rest in the mobile header screenshot | Match 133:6556, or main agent confirms the difference | open |
| H7 | ux-designer | minor | Spec says About paragraph is Body/M on mobile; Figma 133:6671 renders it larger (about 18/32, Body/L) | Spec states the real Figma size, or confirms Body/M | open |
| H8 | main agent (shared) | minor | `tests/e2e/shared/ui-controls.spec.ts:136` theme switcher arrow keys (Dark not checked) failed once on the dev server; probably load flake, not a Home file | Re-run shared suite | open |

Content notes (no issue): copy differences from Figma ("See all announcements", "Opening is planned for December 2031", legend "Junction") are listed in docs/content/home.md and accepted.

## Not checked
Figma MCP calls were skipped; the exported references in `tests/visual/reference/` were used, per the token budget. 200% zoom and reduced motion were not run by hand; the Home e2e spec and the 720 px overflow run cover part of it. Dark mobile was reviewed only through band diffs.

## History
- Round 1: 8 issues (builder 6, ux-designer 1, main agent 1)
