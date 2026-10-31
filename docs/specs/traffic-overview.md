# Traffic overview: UX spec
Route: `/traffic` (`routes.traffic.overview`) · Figma: desktop 66:2206, mobile 133:26630 (no dark frames; tokens swap)

Docs layout, sidebar, section bar, on-page aside, breadcrumb, footer: `_shared.md` sections 10 and 11. Only what is specific is below.

## Purpose and primary task
A section landing page: tell people what the Traffic pages are for, send them to the right one, and show the three road changes that matter this week.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390; padding 20. Cards one column. Road change meta stacks; "View on map" drops under the title (it needs 100 px). |
| 390–767 | Mobile frame: section bar ("Traffic / Overview"), breadcrumb, `h1`, lede, "Pages in this section" cards in one column, "Road changes this week" list, "See all announcements", then the "Need help?" block, then footer. |
| 768–1023 | Same as mobile (section bar, no sidebar), padding 32, cards in 3 columns (about 220 each; card padding 16), road changes as mobile. |
| 1024–1279 | Docs layout: sidebar 240 + article (fluid, max 760). Cards 3 columns at article width (about 190 each at 1024: card padding 16, icon tile 36). The aside is hidden; "Need help?" renders after the article. |
| 1280–1439 | Three columns: sidebar, article 760, aside 200 with "On this page" and "Need help?". |
| 1440+ | Desktop frame as designed; at 1920 extra width is margin. |

## Sections
### 1. Header (breadcrumb, `h1` "Traffic", lede)
`trafficCopy.overview.header`. Lede Body/L `gray-600`, max 700.

### 2. Pages in this section, `h2 id="pages"` (66:xxxx)
Three link cards (`link-card`): icon tile (map, route, calendar), title, description, divider, a plain `<ul>` of three short phrases (Road closures, Construction zones, Traffic hazards / Works near each station, Nearby places, Interchanges / Current, Upcoming, Past). The title is the single link (stretched); the phrases are plain text, not links (nested links would break the card rule). Hover: border `gray-300`, title `primary-700`; focus: ring around the card. Destinations: `routes.traffic.map`, `routes.traffic.route`, `routes.traffic.announcements`.

### 3. Road changes this week, `h2 id="road-changes"`
Three items from `getRoadChangesThisWeek(3)` (curated: Figma order is Lane closure on Jalan Sultan Azlan Shah, Pedestrian detour beside KOMTAR, Night diversion at FIZ Phase 4 junction; not the API's newest-first order; Open question 9). Row: status tag (Active / Upcoming), title Heading/3XS, meta as separate elements with icons: `map-pin` + location, `calendar` + date range (night works append the hours: "3 Nov to 17 Nov 2026, 10 pm to 6 am"); no middle dots. "View on map" link at the right (desktop) or right of the title (mobile), `routes.traffic.mapFocus(id)`, hidden suffix with the title, `hit-area` below 768. Rows divided by 1 px `gray-200`. Below the list: "See all announcements" Ghost link → `routes.traffic.announcements`.
- Empty (nothing in the window): one row "No road changes are planned this week." with `circle-check` `success-600`; the link stays.

### 4. Need help (aside ≥1280, else after article)
`need-help-block` ("Report an issue" → `routes.reportTrack.report`, "Track a ticket" → `routes.reportTrack.track`, phone text MRTCareline 1800-88-6782 plain text, not a link, as Figma).

## Interactive elements
| Element | Trigger | Result | States | Keyboard | Notes |
|---|---|---|---|---|---|
| Page card | click | Go to the page | default, hover, focus-within ring | Tab, Enter | One tab stop each |
| View on map | click | Map focused on item | default, hover, focus-visible | Enter | 3 instances |
| See all announcements | click | Announcements | default, hover, focus-visible | Enter | |
| Aside item | click | Smooth scroll to h2, focus it | default, active, hover | Enter | Per `_shared.md` 10 |
| Section bar | click | Panel with the Traffic pages | per shared | Enter, Esc | |

## Hidden content inventory
3 card records (title, description, three phrases, icon), 3 road-change records (curated ids), empty text, aside items (2), help block copy. Content writer: no "Popular questions" (see Open question 1).

## Dynamic states
Server-rendered; no client state. Empty as above. Error: route `error.tsx` as the other Traffic pages. Long titles wrap; meta wraps under its icon. No JS: everything works.

## Motion
Card and link colour 150 ms; aside scroll smooth (instant under reduced motion). No other animation.

## Accessibility
Landmarks per docs layout; headings h1, h2, h2. Cards: one link each with the title as its name and the description as `aria-describedby`. Road list is an `<ul>`; tags carry text. Hit targets ≥ 44 on mobile.

## Links and destinations
As above. Breadcrumb: Home `routes.home`, Traffic plain text. Sidebar and section bar: Traffic group pages (`routes.traffic.*`), Project and Report & Track groups as in the shared sidebar.

## Open questions
1. Figma's "On this page" lists "Popular questions" but the page has no such section. Decision: aside shows only the two real sections. Confirm, or add a FAQ block.
9. "Road changes this week" order is curated, so the data layer needs a small curated list or a `featured` rank.
