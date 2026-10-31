# QA: Project group (round 1)
Pages: project-overview, about, stations, station (S20 KOMTAR, A01 and others), construction, faq
Result: FAIL

| DoD | Check | Result | Evidence |
|---|---|---|---|
| 1 | Design match light/dark | ❌ | Diffs vs tolerance 3%: overview 1440 6.8%, 390 29.6%; about 1440 9.9% (dark 9.2%), 390 48.1%; stations 1440 4.0%, 390 14.8%; station 1440 12.2% (dark 14.7%), 390 19.5% (dark 25.7%); construction 1440 7.9%, 390 16.3%; faq 1440 2.9% (pass), 390 16.0%. Screenshots in `.logs/qa/`. |
| 2 | Typecheck / lint / tokens / build | ✅ | All pass in `.logs/verify-*.log`. |
| 3 | Screen sizes | ❌ | 8 responsive fails (P-QA1, P-QA2). No overflow. |
| 4 | Links | ❌ | 2 button fails, both false positives of the test (P-QA9). Real 404s seen are for later-iteration routes only (`/traffic/*`, `/report*`, `/track`, `/login`). |
| 5 | File structure | ✅ | Routes thin, copy in `src/content/project.ts`, features in `src/features/project`. Minor: P-QA12. |
| 6 | Content | ⚠️ | See P-QA6 to P-QA8. No placeholders, middle dots or arrows. |
| - | Accessibility (axe) | ✅ | Passes. Duplicate ids found by hand (P-QA11). |
| - | e2e | ✅ after fix | 1 failing test was a stale locator in the test (P-QA10); fixed by tester. |

## Visual: where the percentage comes from
Most of the diff is mock data and the test setup, not styling.
- **Station (KOMTAR) 1440 and 390:** the Figma frame is signed in (header "Mei Ling", button "Following") and shows 3 notices. The page renders 1 notice. 3584 px against 3712 px tall is the 2 missing notice cards, and the shift moves everything below them. The 3 Figma cards read Active, Active, Upcoming, so the stat should be 2 "Active traffic changes" (page shows 1). The mock user already follows S20 and S13, so signing in gives the "Following" state.
- **Stations:** the Figma frame is signed in (Following chips on S20 and S13, "Stations you follow" card). The test was loading it as a guest. I added `station` and `stations` to `SIGNED_IN_PAGES` in `tests/support/pages.ts`. Stations 390 then measured worse (17.3%), so the signed-in layout needs a check (P-QA5).
- **About 390:** the Figma mobile frame ends after the station rail (4754 px). The page renders sections 6 to 9 as well (Travelling, Benefits, Timeline, Feedback and Related pages), so it is 6968 px tall. The 1440 frame does include them. The mobile frame is the odd one out.
- **Project overview 390:** 3718 px against 3182 px. Mostly 44 px tap rows in the card link lists (Figma ~28 px rows), plus shorter latest-update copy.

## Issues
| # | Owner | Severity | What and where | Expected | Status |
|---|---|---|---|---|---|
| P-QA1 | builder | major | `/project` at 320 to 414 px: the "FAQ" card title link in "Pages in this section" is 33×44 px. Fails test:responsive (4 widths). | Tap target at least 44×44 (add `min-w-11`, or make the whole card title row the target). | open |
| P-QA2 | builder | major | `/project/faq` at 320 to 414 px: the "MRTCareline 1800-88-6782, 24 hours" link in the "Still need help?" card is 216×15 px. Fails test:responsive (4 widths). | `inline-flex min-h-11 items-center` as in the overview Need-help block. | open |
| P-QA3 | main | major | Station mock data: KOMTAR (S20) has 1 notice and 1 active change. Figma 95:3102 shows 3 notices (Closure Active; Construction Active "Left lane closed for pier works"; Construction Upcoming "Night lane closure for crosshead lifting", 3 to 7 Nov) and "2 Active traffic changes". Cards and the stat must agree, so add 2 notices near S20 and make the stat count 2 active. The data layer and the traffic announcements need the new records. | Figma frame 95:3102 and 133:14946 | open |
| P-QA4 | builder | major | About, station and construction do not follow Figma on these details. About 1440: the content column is wider than Figma, so the overview text wraps differently. Construction: the "All areas" select drops to a second row under the chips (Figma keeps it on the chip row at the right) and a stray "—" glyph follows the "Stations" chip. Construction: the "works affecting your road" note is a blue box (Figma: grey with a left accent bar). Feedback "Yes/No" buttons have no thumb icons (Figma has them, about and construction). "Related pages" heading is a large H2 (Figma: small Body/S semibold label). Station hero: the lede wraps in a narrow column under the title (Figma: one line, full width). | Figma 54:2128, 1:413 (construction), 95:3102 | open |
| P-QA5 | builder | major | `/project/stations` signed in at 390 (Figma 133:xxxx, the stations mobile frame): the rows must carry the small "Following" chip under the subtitle for S20 and S13, text sits 16 px further right of the rail than the page renders, and the signed-in card reads "Stations you follow: S20 KOMTAR and S13 Jalan Universiti. Manage in your profile". The search placeholder is cut off at 390 ("Search by name or code, for example S" cut), so shorten or wrap it. Recheck after this: diff rose from 14.8% to 17.3% once signed in. | Figma stations mobile frame, spec stations.md | open |
| P-QA6 | content-writer | minor | Wording differs from Figma where the page is meant to match. Overview "Latest update" body is a shorter text than Figma ("Twelve pier caps are now in place between the FIZ Phase 3 and Phase 4 junctions. Viaduct segment launching begins next month, mostly at night."). Third popular question is "How will I be told about works near me?", Figma "When will the Mutiara Line start running?". Construction lede is shorter than Figma. Stations "Related pages" About description reads "Background, routes, stations and the timeline to 2031." (Figma: "Routes, features and the timeline to 2031."). Decide per string whether the Figma wording or the new wording stays, and record the choice in `docs/content/project.md`. | Figma strings | open |
| P-QA7 | ux-designer | major | About at 390: the Figma mobile frame (Figma 133:xxxx "M · About") stops after "Stations along the line" and shows a station card ("S13 Jalan Universiti") below the rail. Spec and build render sections 6 to 9 on mobile too, with no card under the rail. Confirm that sections 6 to 9 belong on mobile (then the frame is incomplete and the visual reference for about--390 needs a new export) or remove them. Also confirm whether the rail shows the S13 serves-card on mobile. | spec about.md sections 5 to 9 | open |
| P-QA8 | main | minor | Shared footer: Figma says "Follow MRT Corp" for the social row, the build says "MRT Corp on social media". The bell tile in the newsletter strip is a white box in Figma; the build draws a bell. Decide (foundations item). | Figma footer | open |
| P-QA9 | main | minor | `test:links` "button does nothing" false positives: "Back to top" on `/project/stations` (scroll and focus change no DOM) and "Centre on PSR-A" on A01 (map is already centred). Both work by hand (back to top moves focus to the logo; locate resets the pane transform from `150px,80px` to `0,0`). Allow these two in `tests/links/links.spec.ts` (tester can do it when told). | | open |
| P-QA10 | tester | minor | Stale locator in `tests/e2e/shared/project-parts.spec.ts` ("eyebrow and start open"): the component now adds a screen-reader copy of the eyebrow, so the count was 6. Fixed with `exact: true`. | | fixed |
| P-QA11 | builder | minor | Duplicate `id` values: `faq-help-title` twice on `/project/faq` (two "Still need help?" blocks), `_S_n_` on overview, about and construction (React-generated, ignore). Make the FAQ ids unique. | unique ids | open |
| P-QA12 | builder | minor | `faq-view.tsx` (252 lines) and `stations-view.tsx` (193 lines) are client components for the whole explorer area. Spec lets them be client for search, but the static headings and topic copy could stay server-rendered. Optional split, no behaviour change. | CLAUDE.md section 1, small client leaves | open |

## Checked by hand, passing
- Stations: search filters rows ("kom" gives 1 of 22, "jalan" gives 3), `?q=` is in the URL and restores on load, no-results shows "Show all stations". 22 rows, order matches Figma. Follow toggle on station, store `mlc-follows` (`["S13"]` after unfollowing S20), cross-tab sync and rows in `/project/stations` agree. Guest sees "Follow station" link.
- Station pages S31, S30, S20, S13, S09, S03, A01: names, "(provisional)", progress, "Reports nearby" count equals rows, notices equal "Active traffic changes" (except KOMTAR, P-QA3), empty states read well, attribution "© OpenStreetMap contributors (opens in new tab)" is visible, locate button re-centres the map.
- Construction: chips write `?phase=` and filter, 12 updates reached by 2 "Load older updates" clicks, all unique and newest first.
- FAQ: topic cards link `?topic=` (4 topics, counts 5+6+5+6 = 22, "Show all 22 questions"), audience switch filters topic cards only and is not in the URL (as spec), `#property-damage` opens and focuses that item, unknown `?topic=` is ignored.
- No middle dots or arrow characters, no placeholder text, one `h1` per page, titles per route.
- Not checked this round: 200% zoom, reduced motion, dark at 390 for every page, Lighthouse (no live URL given).

## History
- Round 1: 12 issues (builder 5 open, main 3, content-writer 1, ux-designer 1, tester 1 fixed, plus P-QA12 builder optional). Test changes made by tester: `tests/e2e/shared/project-parts.spec.ts` (locator), `tests/support/pages.ts` (station and stations tested signed in).
