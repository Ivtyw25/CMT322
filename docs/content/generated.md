# Generated content inventory

Content that Figma implies but does not show. "Today" in the data is `MOCK_NOW` = 29 Oct 2026, 18:00 (`src/data/mock/clock.ts`).

## Data (`src/data/mock/`)

| What | Where | Count | Why |
|---|---|---|---|
| Areas | `areas.ts` | 5 (Bayan Lepas and airport, Bukit Jambul, Gelugor and USM, George Town, Butterworth) | Footer area select, Home area chips, filters. "All areas" is copy, not a record |
| Station records | `stations.ts` | 22 complete (Figma shows KOMTAR only) | Station template. Each has area, lede, segment, connections, nearby places, stages, progress and site updates. Segment 2 stations have no progress and fewer details |
| Station progress percentages | `stations.ts` | 18 invented (KOMTAR 38% is Figma) | Stations list and station pages need a value per Segment 1 station |
| Station site updates | `stations.ts` | 2 for KOMTAR (Figma), 0 to 2 for others | Station page "Latest from the site" |
| Announcements | `announcements.ts` | 21 (4 active, 3 upcoming, 14 ended); 15 invented | Figma tabs show 19 (Current 3, Upcoming 2, Past 14); 2 KOMTAR notices were added (VERIFY) so the KOMTAR page matches Figma 95:3102. The 6 on page 1 of Figma 1:629 are kept as shown. Covers every type (closure, construction, hazard) |
| Road works | `road-works.ts` (`getRoadWorks`) | 5 (3 active, 2 upcoming); 4 from Figma, 1 invented hazard | Coordinator decision: the extra cards on Home and KOMTAR (pier works lane, Bukit Jambul lane shift, crosshead night closure, Tun Dr Awang night works) are works on the traffic map, not announcements. Titles kept as Figma. Home and station pages list announcements and road works together |
| Site notices | `site-notices.ts` | 3 (1 from Figma; 3 Nov FIZ diversion, 10 Nov Tun Dr Awang contra-flow) | `getSiteNotice()` needs a record; later ones prove date switching. Each links to an upcoming announcement |
| Station coordinates | `stations.ts` (`lat`, `lng`) | 22 | Home map, traffic map and station maps. Approximate; listed in verify.md |
| Construction updates | `construction-updates.ts` | 12 (4 from Figma, 8 older) | Every phase filter (Utility relocation, Piling, Viaduct, Stations) shows 3 different updates; "Load older updates" has records |
| Milestones | `construction-updates.ts` | 6 | Timeline from 2024 to opening in Dec 2031, split around today |
| FAQ categories | `faq.ts` | 4 (5, 6, 5, 6 questions) | Figma topic counts; 22 questions in total ("Show all 22 questions") |
| FAQ answers | `faq.ts` | 22 | Figma opens only the first answer |
| FAQ "Most asked" ranks | `faq.ts` | 5 | Popular chips and Home FAQ |
| Report categories | `report-categories.ts` | 9, each with a hint | Figma shows only "Blocked access to home or business" selected |
| Tickets | `tickets.ts` | 11 (6 for Mei Ling: 1 pending, 1 in progress, 4 resolved; 5 others) | Profile "My reports" counts; KOMTAR "Reports nearby 3"; Track page needs MLC-261028-0482 exactly as Figma, plus others to look up |
| Ticket histories and replies | `tickets.ts` | 1 to 4 entries per ticket | Track page stepper and update log |
| Search index | `search-index.ts` | 22 stations, 17 roads, 12 areas | Home search; "buk" returns exactly Figma's 3 suggestions |

## Copy (`src/content/`)

| What | Where | Why |
|---|---|---|
| Nav panel copy for all 4 panels, incl. "No road closures right now." | `nav.ts` | Figma shows panels in one state |
| Appearance menu, live-region "Appearance set to …" | `nav.ts` | Spec live regions |
| Account menu and mobile drawer labels, aria labels | `nav.ts` | Spec accessible names |
| Newsletter states: sending, success, 2 validation errors, 1 send error | `footer.ts` | Figma shows the idle form only |
| Notification bar link context and dismiss label | `notifications.ts` | Spec accessible names |
| Generic UI: pagination, form errors, upload states, empty states, stepper, stage and phase labels, "Photo not yet available" | `ui.ts` | Shared states every page needs |
| Landmark labels, "You are logged out." | `common.ts` | Spec landmarks and live regions |
| Gallery sections (23), state labels and sample values | `dev.ts` | Dev components gallery |

<<<<<<< HEAD
## Home

## home: copy (`src/content/home.ts`)

| What | Key | Why |
|---|---|---|
| Page description | `meta.description` | Figma has no metadata. The title is `commonCopy.metadata.defaultTitle` |
| Try chip targets (4) | `hero.tryChips[].target` | Spec: chips are links (2 area filters, 2 station pages) |
| Search form name, listbox name | `search.formLabel`, `suggestionsLabel` | Accessible names |
| Search live messages: count (1 and many), no results | `search.resultCount`, `noResultsLive` | Debounced screen-reader announcements |
| No-results links (2) | `search.noResultsLinks` | Spec: give a next step when nothing matches |
| Area chip group name, result count (0, 1, many) | `works.chipsLabel`, `resultCount`, `allAreasInSentence` | The filter announces its result |
| Item hidden labels, "View on map" name suffix and target | `works.item.*` | Icons carry meaning; 3 "View on map" links need distinct names |
| Empty state: one area and all areas, 2 text variants | `works.empty` | Butterworth has no current or upcoming works (Segment 2 starts Jan 2027) |
| Sign-up: whole-line title and text, sending, success, "the whole line", send error | `works.subscribe.*` | Figma shows the idle form for one area only. Wording matches the footer newsletter |
| Line: map caption, toggle legend, station names and suffixes, callouts | `line.captions.map`, `viewToggle.label`, `stationLabel`, `provisionalSuffix`, `junctionSuffix`, `callouts` | Diagram and map need text names; callouts are the Figma diagram labels (6 stations, 10 labels) |
| Map view: region name, "Illustrative alignment.", OSM attribution and link, loading, error, zoom labels, popup link | `line.map.*` | Map view states from the spec |
| About photo alt text | `about.imageAlt` | Figma has none |
| Guide card icons and links (8) | `guide.cards[].icon`, `href` | Link cards per spec; icons as in Figma |
| Safety tip icons (6) | `safety.tips[].icon` | As in Figma |
| Progress card link, empty text | `progress.cardHref`, `empty` | Spec |
| Help strip hidden heading, careline call name | `help.title`, `help.careline.callLabel` | Accessible names |
| Section load error | `sectionError` | Spec error boundary per section |

## home: data

No new records. 3 replacement values (1 announcement summary, 2 construction update titles) so Home matches Figma: see `home-data-additions.md`.
=======
## Project

Iteration 3. Station, FAQ, construction and milestone records already existed (see Data above); this iteration extended them and wrote all Project page copy.

| What | Where | Count | Why |
|---|---|---|---|
| Station "serves" sentences | `mock/stations.ts` (`serves`, new field) | 22 (S13 from Figma, 21 written) | About route diagram: Figma shows only S13 selected |
| Construction timeline titles | `mock/construction-updates.ts` (`timelineTitle`, new field) | 2 set, 10 null | Construction page words two updates differently from Home (verify P4) |
| Construction "On this page" labels | `mock/construction-updates.ts` (`tocLabel`, new field) | 12 (4 from Figma, 8 written) | TOC lists each update; older ones appear after "Load older updates" |
| Milestone long titles | `mock/construction-updates.ts` (`longTitle`, new field) | 6, all from Figma 1:332 | About timeline uses longer labels than the Construction timeline |
| Route tab "PSR-A to Penang Sentral" | `content/project.ts` `about.routes.tabs[1]` | 1 panel (intro + 3 facts) | Figma shows only the PSR-A to KOMTAR panel |
| "A smarter way to travel" tabs | `content/project.ts` `about.benefits.tabs` | 3 written (General public, Businesses, Environment) + 1 Figma | Figma shows only Daily commuters |
| Route diagram texts | `content/project.ts` `about.stations` | hint, link, diagram label | Panel before a station is selected; link to the station page |
| Stations search states | `content/project.ts` `stations.search` | result count, empty title and body | Figma shows the idle search box only |
| Stations aside variants | `content/project.ts` `stations.aside` | 3 (following, none, signed out) | Figma shows Mei Ling following 2 stations |
| Station template states | `content/project.ts` `station` | Follow / followed / unfollowed, not-started tag and stat, no-distance stat, traffic empty, progress not started (Segment 2), site updates empty, worksite not started, reports empty, alerts for not following and signed out | Figma shows KOMTAR only; 21 other stations and Segment 2 need these |
| Construction filter states | `content/project.ts` `construction.updates` | count, all loaded, empty with reset, photo alt | Figma shows "All updates" with 4 entries |
| FAQ states | `content/project.ts` `faq` | search results and empty state, topic view heading and back link, show fewer, feedback thanks (2) | Figma shows the default view with the first answer open |
| Docs page shared words | `content/ui.ts` `docsPage` | Need help?, page feedback, Related pages | Same on every docs-layout page (Project, Traffic, Report & Track) |
| FAQ "How often will trains run?" answer | `mock/faq.ts` | 1 rewritten | Matched the About page figure (verify P2) |

Not delegated to Antigravity: the bulk records (22 stations, 22 FAQ answers, 12 updates, 6 milestones) already existed, and the additions (about 60 short lines) were smaller than a delegation brief.
>>>>>>> main
