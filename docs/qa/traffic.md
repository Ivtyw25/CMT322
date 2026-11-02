# QA: Traffic group (round 1)
Pages: traffic-overview, traffic-map, route-view, announcements. Build: `DEV_GALLERY=1 npm run build`, tests with `PW_SERVER=build`, port 3400. HEAD 76203d7.
Result: FAIL (visual tolerance on all four pages; 0 blockers, behaviour passes)

| DoD | Check | Result | Evidence |
|---|---|---|---|
| 1 | Design match light/dark | ❌ | Visual light: overview 34.5/32.3%, map 25.4/44.3%, route 16.2/12.4% (after height fix, 1440 about 5%), announcements 15.2/14.8%. Dark references do not exist for these pages (tests skipped). Causes in the table below. |
| 2 | Typecheck / lint / tokens / build | ✅ | Builder verify logs; `DEV_GALLERY=1 npm run build` exit 0 |
| 3 | Screen sizes | ✅ | responsive passed in builder verify; map first on mobile checked (map top 166 px, h1 below) |
| 4 | Links | ✅ | 14/14 after test fix (see T-QA11) |
| 5 | File structure | ✅ | no feature imports another feature; `normaliseQuery` in `src/lib/search`; shared pagination, tabs, link-card changes are additive; Home and Project visual and e2e pass |
| 6 | Content | ✅ with notes | copy matches `docs/content/traffic.md`; tab counts 19/3/2/14, pages 4/1/1/3; layers 4/6/2, "In this area (12)" |
| - | Accessibility (axe) | ✅ | builder verify log |

E2E: 219 tests, 214 pass in the full parallel run; the 5 failures (4 Home URL-write tests, 1 session test) all pass when run alone (53/53) — load flake, see T-QA12.

## Behaviour checked (all as specified)
- Filters write to the URL with replace (`?when=week`, history length unchanged); tabs set `?status=`; tab counts follow filters.
- Map and Route view have no footer (page height = viewport); other pages keep it. h1 and titles are unique ("Traffic map", "Route view").
- Deep link ids exist on every row (`#komtar-pedestrian-detour` etc.); list-to-marker sync, popup, halo and station search covered by the existing specs, which pass.
- Marker colours: closures red, hazards filled red triangle on the map, construction amber; dark mode uses lighter red and amber and is readable. Differences from Figma in T-QA7.

## Accepted differences (not issues)
- Overview: "Popular questions" adds about 400 px at 1440 and shifts the footer, so most of the 34% and 32% overview diff is this section.
- Map: OSM basemap (masked), no Satellite toggle (decision 12), popup closed by default, Road changes list order differs from Figma.
- Overview third row is "Slip road closure at FIZ Phase 3" (decision 9); announcements default order differs from Figma (spec: active newest first); "View notice" has no external icon (T2).
- Footer "MRT Corp on social media" vs Figma "Follow MRT Corp" is shared footer content, not this group.

## Issues
| # | Owner | Severity | What and where | Expected | Status |
|---|---|---|---|---|---|
| T-QA1 | builder | major | Overview page cards (`/traffic`, 1440 and 390): card title is 14 px medium dark text. Figma: larger (about Heading XS) primary-blue link title. Seen in `.qa/c1.png` | Figma 66:2206 and 133:26630, card title style | open |
| T-QA2 | builder | major | Section h2 ("Pages in this section", "Road changes this week", "Popular questions") renders about 23% wider than Figma (363 px vs 295 px for "Road changes this week"). Code uses `type-heading-xs lg:type-heading-s` | Match Figma's heading style (check with `get_design_context`); this also affects the vertical offset of the whole page | open |
| T-QA3 | builder | minor | Breadcrumb: Figma shows Home and Traffic as primary-blue links and the current item grey; ours are grey links and a dark current item. Announcements shows "Traffic announcements" as the current item, spec says "Announcements" | Figma 1:629; spec announcements.md line 22 | open |
| T-QA4 | builder | minor | Overview "Road changes this week": "View on map" sits at the top right of the row; Figma aligns it with the title line | Figma 66:2206 | open |
| T-QA5 | builder | minor | Announcements area select is about 165 px wide at 1440; Figma about 108 px. Table rows are taller (about 70 px vs 58 px), partly from the longer summaries (T-QA9) | Figma 1:629 | open |
| T-QA6 | builder | minor | Docs sidebar item pitch about 32 px; Figma about 36 px (Project, Traffic, Report and Track groups) on the overview | Figma 66:2206 sidebar | open |
| T-QA7 | builder | minor | Route diagram: hazard glyph is an outlined triangle (Figma filled red triangle); works are small amber ticks above stations, Figma colours the rail segment amber; diagram is scaled larger than Figma (fills the canvas) which causes 5% diff at 1440 | Figma 5:843 | open |
| T-QA8 | builder | minor | Map at default fit: labels collide ("S20 KOMTAR" under "S19 Macallum"; hazard marker on "S13 Jalan Universiti" and "S09 Bukit Jambul") in light and dark | readable labels at default zoom | open |
| T-QA9 | content-writer | minor | Announcement summaries are longer than Figma's (e.g. "Traffic is diverted from 10 pm to 6 am while viaduct segments are lifted into place." wraps to 4 lines in a 150 px column) | one short line, about 50 characters, as in Figma | open |
| T-QA10 | ux-designer | minor | No dark Figma references exist for the 4 pages, so dark visual tests skip. Ask the main agent whether to accept dark by manual check only (done here) | decision | open |
| T-QA11 | tester | minor | `tests/links/links.spec.ts` marked "Back to top" as "does nothing" because a scroll or focus change is not a DOM mutation. Fixed: now counts scroll position and focus change | n/a | fixed |
| T-QA12 | tester | minor | Full parallel e2e run (8 min) fails 5 Home and session tests that pass alone (URL not updated within 10 s under load). Not a traffic regression; Home URL writes use the shared `use-query-params` hook (decision 10), so keep an eye on it | stable under load | open (watch) |
| T-QA13 | tester | minor | Visual test took a 900 px viewport for workspace pages while Figma frames are 1008 px. Fixed in `tests/visual/visual.spec.ts` (`WORKSPACE_PAGES`). Map is now 18% unmasked diff (mostly panel list order, popup, controls); needs a tolerance or reference decision from the main agent | n/a | fixed |

## History
- Round 1: 13 issues (builder 8, content-writer 1, ux-designer 1, tester 3; tester items fixed)
