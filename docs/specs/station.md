# Station page (template): UX spec
Route: `routes.project.station(code)` (`/project/stations/[stationCode]`, lowercase code, e.g. `/project/stations/s20`) · Figma: desktop 95:3102, mobile 133:14946, dark 121:5382 (desktop) and 134:12072 (mobile). Figma shows S20 KOMTAR; the same template renders all 22 stations.

Shell: [`_shared.md`](./_shared.md). **Not a docs-layout page**: no sidebar, no section bar, no "On this page". It has its own two-column body (main + rail).

## Purpose and primary task
Someone who uses, lives or works near one station wants to know, quickly: what is closed or changed on the roads around it right now, how far the station build has got, and how to report a problem there. Signed-in users can follow the station to get emails.

## Template rules
- Static generation for all 22 codes (`generateStaticParams` from `getStationCodes()`, lowercase).
- Unknown code → `notFound()` (shared 404). A code in upper case (`/project/stations/S20`) → permanent redirect to the lowercase URL.
- Metadata title: "{name} ({code}) station"; description: the station `lede`.
- Every piece of the page comes from the station record and the data layer; nothing is KOMTAR-specific. Sentences that name the station ("within 1 km of KOMTAR", "Something wrong near KOMTAR?") are copy functions taking the name.

## Layout across breakpoints
Container 1200 (`max-w-content`, padding 20 / 32 / 40). Body: main column + rail.

| Width | Layout |
|---|---|
| 320–389 | As 390. Title Heading/M wraps (e.g. "Penang International Airport" on 3 lines). Action buttons stack full width. Stats 2 × 2 (tiles ≥ 140 px; labels wrap). Traffic card actions ("View notice", "View on map") move **below** the card text as a row (gap 16) instead of the right column. Site update photo full width. Glance table label column 104 px. |
| 390–767 | Mobile frame 133:14946. Header band: breadcrumb, code chip 48 × 48 (Heading/XS `static-white`, radius `xl`) **above** the title (not beside it), title, lede, tag, then actions in a row (Following + Report an issue here; wrap to 2 rows if needed). Stats 2 × 2 in one bordered box. One column body: Traffic → Construction progress → Worksites and detours → Reports → Station at a glance → Alerts card → Urgent help. |
| 768–1023 | Header: chip beside the title (desktop arrangement) but actions on their own row under the tag. Stats 4 in a row. One-column body (same order as mobile), max width 760, left-aligned in the container. Rail cards full width (max 760). |
| 1024–1279 | Header as desktop: chip + title block left, actions right (top-aligned to the title). Body two columns: main fluid (min 0), rail `clamp(300px, 30%, 392px)`, gap 48. |
| 1440+ | Desktop frame 95:3102: main 760, rail 392, gap 48 (container 1200). At 1920 extra width is margin. The header band's background is full-bleed. |

**Rail stickiness. Decision:** the rail is not sticky (it is 645 px tall and would cover nothing useful; long main column scrolls past it).

## Sections (top to bottom)

### 1. Station header band (95:3136)
Full-bleed `gray-50` band with a 1 px `gray-200` bottom border, padding top 40, bottom 40.
- Breadcrumb `Home / Project / Stations / {name}` (last current).
- Code chip: 64 × 64, `primary-600`, code Heading/XS `static-white`, radius `2xl` (desktop); 48 × 48 on mobile. `aria-hidden` (the code is in the title's accessible name, below).
- `h1`: the station name, Heading/XL desktop / Heading/M mobile, with a visually hidden prefix "{code} " so the heading reads "S20 KOMTAR". Provisional names get a visible "(provisional)" suffix in Body/L `gray-500` inside the `h1`.
- Lede: station `lede`, Body/L `gray-600` (mobile Body/M).
- Status tag (one): **Construction** when `progress` exists and `percent < 100`; none when `progress` is null (not started). Tags are not interactive.
- Actions: **Follow button** + Primary "Report an issue here" (see Interactive elements).
- Stats box (95:3168): 4 tiles in one bordered box (`surface`, border `gray-200`, radius `2xl`, 1 px dividers). Value Heading/S `gray-900` (mobile Heading/XS), label Body/S `gray-600`. `<dl>` with label first in DOM.
  1. Construction progress: `{percent}%`. Not started: value "Not started", label "Construction starts {segment start}" (Segment 2: "January 2027", from content).
  2. Active traffic changes: count of announcements for this station with status `active`.
  3. Reports nearby: count of `getTicketsNearStation(code)` (all statuses, matches the list).
  4. Distance: the first `connectsTo` entry with a `distanceKm`: value "{km} km", label "To {code} {name}". If none has a distance: value is the neighbour's code ("S18"), label "Next station: {name}".
  Tiles are static (not links).

### 2. Traffic around this station (95:3184), `h2 id="traffic"`
- Intro "Closures, lane changes and detours within 1 km of {name}."
- Source: `getAnnouncements()` filtered to `stationCodes` containing the code and status `active` or `upcoming`; order: active first, then upcoming; within each, earlier start date first. Show at most **5**; the links below lead to the rest.
- Card list in one bordered box (radius `2xl`, rows divided by 1 px `gray-200`): tags row (type tag + status tag), title Heading/3XS (Body/M Semibold), summary Body/S `gray-700`, meta row with icons: `map-pin` 14 px + road, `calendar` 14 px + date range ("20 Oct to 30 Nov 2026"; `lib/format` range). Meta items are separate elements with icons, never joined by dots; on mobile they stack (133:14946 shows two lines).
- Card actions (right column ≥390, below the text <390): "View notice" and "View on map" (Body/S Medium `primary-700`, underline on hover). Each has a visually hidden suffix with the title: "View notice: Pedestrian detour beside KOMTAR". Below 768 each gets `hit-area`.
- Cards are not themselves links (two actions each).
- Under the box: "All announcements" and "Open the traffic map" links (gap 24).
- **Empty:** the box shows one row: `circle-check` 20 px `success-600` + "No road changes near {name} right now." (Body/S `gray-700`). Links stay.

### 3. Construction progress (95:3273), `h2 id="progress"`
- Intro "Work at the station site and the viaduct leading into it."
- **Progress card** (95:3277): border `gray-200`, radius `2xl`, padding 24. "{percent}%" Heading/M `primary-700` + "complete. Current stage: {stage label lower-case}." Body/M `gray-700`; bar 8 px (`gray-100` track, `primary-600` fill, radius full, width = percent); "Last updated {date} by the project team" Body/XS `gray-500`. The bar is `aria-hidden` (the sentence carries the value).
  - Not started (`progress === null`): the card shows "Construction at {name} has not started yet. It is planned to start in January 2027." (from content per segment) and no bar.
- **Stages list** (95:3284): six stages, always vertical (all widths). Marker column 24 px: done = `success-600` filled circle with `check` 14 px `static-white`; in progress = `primary-600` ring with a 10 px `primary-600` dot, plus an **In progress** tag after the stage name; planned = hollow `gray-300` ring. Connector 2 px: `success-600` after done stages, `gray-200` after the others. Stage name Body/M Medium `gray-900`; detail Body/S `gray-600`: "Completed Mar 2025", the in-progress `detail` ("6 of 10 piers complete"), "Planned for 2027", or "Target Dec 2031" (`isTarget`). The list is an `<ol>`; each item has visually hidden state text ("Completed", "In progress", "Not started").
- **Latest site updates** (95:3340): `h3`. Up to 3 from `station.siteUpdates` (newest first). Row: `ImagePlaceholder` 140 × 92 (decorative; mobile full width × 92), date Body/XS `gray-500` (`<time>`), text Body/S `gray-800`. Empty: "No site updates for {name} yet." Body/S `gray-600`.
- Link "Progress along the whole line".

### 4. Worksites and detours (95:3364), `h2 id="worksites"`
- Intro sentence; map snippet 760 × 380 (mobile full width × 380, 133:14946), radius `2xl`, border `gray-200`; link "Open full traffic map".
- The map is the shared Leaflet map (`components/patterns/map`, client-only), **not** the Google placeholder in Figma: OSM tiles (light in both themes), attribution "© OpenStreetMap contributors" visible bottom-right, centred on the station `lat/lng` at zoom 16, station marker (code chip style), and markers for this station's active/upcoming announcements and road works that have coordinates.
- Controls kept from Figma: zoom in/out (top-right), "locate" button. **Decision:** the locate button recentres the map on the station (label "Centre on {name}"), not on the user's location (no geolocation prompt on an info page). The Map / Satellite switch is **not built** (no satellite tile source without Google; owner decision is OSM only). See Open questions.
- Interaction: no scroll-wheel zoom; on touch, one-finger drag is disabled so the page scrolls (two-finger pan and the zoom buttons work); keyboard: the map container is focusable (`tabindex="0"`) with arrow-key panning and +/- zoom (Leaflet defaults) and an `aria-label` "Map of worksites and detours around {name}".
- Loading: the map box shows a `gray-100` skeleton with the `map` icon 24 px `gray-400` until tiles load. Tiles fail (offline): keep the grey box with "The map couldn't load. The traffic map lists every closure." and the link stays.
- Stacking: the map container uses `isolation: isolate` (shared rule) so header panels open above it.

### 5. Reports near this station (95:3498), `h2 id="reports"`
- Intro "Issues other commuters have reported within 500 m. Names and contact details are never shown."
- List (bordered box, rows divided): title Body/S Medium `gray-900`, line "Reported {date}" or "Resolved {date}" Body/XS `gray-500`, status tag on the right (Pending / In progress / Resolved). At most **5**, most recently updated first. Rows are **not links** (other people's tickets).
- Report CTA (95:3524): `primary-50` box, title "Something wrong near {name}?" Heading/3XS `primary-700`, text, Primary button "Report an issue" (right ≥768, below <768).
- **Empty:** list replaced by "No reports near {name} yet." Body/S `gray-600`; CTA stays.

### 6. Rail (95:3183)
**a. Station at a glance** (95:3530): card with title (Body/M Semibold) and the shared info list: Code; Line ("LRT Mutiara Line"); Type ("Elevated station"); Segment ("1, PSR-A to KOMTAR"); Connects to (one line per neighbour: "{code} {name}, {km} km"; the "{code} {name}" part is a **link** to that station; without a distance just "{code} {name}"); Interchange (comma list of `interchanges`, or "None"); Nearby (comma list of `nearby`, or the row is omitted when empty). Label column 96 px (104 at <390), value wraps.

**b. Alerts card** (95:3554): `primary-50`, radius `2xl`, padding 20. Variants:
| State | Title (with `bell` 18 px `primary-700`) | Text | Action |
|---|---|---|---|
| Signed in, following | "You're following {name}" | "We email you about closures, night works and milestones near this station." | Link "Manage alerts in your profile" |
| Signed in, not following | "Get alerts for {name}" | "Follow this station and we'll email you about closures, night works and milestones near it." | Secondary button "Follow {name}" (same action as the header button) |
| Guest | "Get alerts for {name}" | "Log in to follow this station and get emails about works near it." | Link "Log in to follow {name}" |

**c. Urgent help** (95:3562): bordered card: "Urgent problem at the worksite?" Body/S Semibold, `phone` 16 px + careline link (`tel:`), "24 hours. If anyone is in danger, call 999." Body/XS `gray-600`. **Decision:** "999" is plain text, as in Figma; the careline is the action on this card.

## Interactive elements
| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Follow button (signed in) | click | Toggle follow; update card and live message | not following (Secondary, `bell` 16 px, "Follow station"), following (`primary-50` bg, `primary-200` border, `check` 16 px, "Following", 95:3164), hover (following: bg `primary-100`; not following: Secondary hover), focus-visible, pressed | Enter/Space | `button aria-pressed`; accessible name "Follow {name}" constant; the live region announces the result |
| Follow button (guest) | click | → log in, return here | Secondary states | Enter | A link styled as the not-following button ("Follow station") |
| Report an issue here | click | → report form for this station | Primary states | Enter | Guests pass through Log in (protected route) |
| View notice (×n) | click | → announcement | default, hover, focus-visible | Enter | sr-only title suffix |
| View on map (×n) | click | → traffic map focused on it | default, hover, focus-visible | Enter | |
| All announcements, Open the traffic map, Progress along the whole line, Open full traffic map | click | → page | link states | Enter | |
| Map zoom +/− | click | Zoom | default, hover, focus-visible, disabled at min/max | Enter/Space; +/− on map | 28 px visual, `hit-area` |
| Map centre button | click | Recentre on station | default, hover, focus-visible | Enter/Space | |
| Map container | focus / drag | Pan | focus-visible ring | Arrows pan, +/− zoom | |
| Report an issue (CTA) | click | → report form for this station | Primary states | Enter | |
| Connects to links | click | → neighbour station | link states | Enter | |
| Alerts card link/button | click | → profile notifications / follow / log in | link or Secondary states | Enter | |
| Careline | click | Call | link states | Enter | `tel:` |

**Follow behaviour.** Uses the followed-stations store (Stations spec, "Shared component needs" 1). Toggling is instant (optimistic; mock store cannot fail). Announce in the global polite live region: "You're following {name}. We'll email you about works near it." / "You've stopped following {name}." Focus stays on the button. Both the header button and the alerts card reflect the same state. Changes sync to other tabs. No confirmation dialog for unfollow (one tap undoes it).

## Hidden content inventory
| Item | Count / kind |
|---|---|
| Station records | **22** full records (exist in mock; content writer checks): `lede`, `subtitle`, `area`, `connectsTo` (+ distances where published, else null), `interchanges`, `nearby`, `progress` (null for Segment 2 stations), 6 `stages`, 0–3 `siteUpdates` |
| Announcements and road works per station | enough mock records that at least: 2 stations have 3+ items, several have 1, and some (e.g. Segment 2 stations) have none |
| Tickets near stations | 3 for S20 (Figma), 0–2 elsewhere, at least 3 stations with none |
| Copy functions with station name | traffic intro, empty texts (traffic, site updates, reports), CTA title, alerts card titles/texts/actions (3 variants), map label, centre button label, live messages (2), not-started progress sentence, not-started stat label |
| Labels | stat labels, stage labels (in `uiCopy`), glance labels, "None", "(provisional)", sr-only state texts, "View notice: {title}" pattern |
| Metadata | title and description functions |

## Dynamic states
- **Under construction** (S20 and Segment 1 stations): as Figma.
- **Not started** (Segment 2: S31, S30, S19; `progress` null): no Construction tag; stat "Not started"; progress card replaced by the not-started sentence; stages all planned; site updates empty text.
- **No traffic changes / no reports / no site updates:** empty texts above; section headings and links stay, so the page shape is the same for every station.
- **Signed in vs guest:** Follow button variant, alerts card variant, Report links (guests go to Log in via the protected-route redirect). No auth flash: both variants render on the server; CSS shows one from `data-session` (shared decision 7). The followed state itself comes from the client store: until it is read, the signed-in button shows the not-following label with `aria-busy="true"` and is inert for that moment (no visible spinner; it resolves on hydration).
- **Long content:** long names (Penang International Airport, Permatang Damar Laut) wrap in the `h1`, breadcrumb current item, CTA title and alerts title; long road names in meta wrap under their icon.
- **Map error / slow tiles:** see section 4.
- **No JavaScript:** everything except the follow toggle and the map renders; the map box shows its grey fallback text and link.

## Motion
- Follow toggle: colours 150 ms; the icon swaps instantly.
- Map: Leaflet zoom animation on; with reduced motion set `zoomAnimation: false`, `fadeAnimation: false`, `markerZoomAnimation: false`.
- Progress bar: no fill animation (static value).
- Hover colours 150 ms. Reduced motion: nothing moves.

## Accessibility
- Landmarks: shared shell; the rail is an `<aside aria-label="About this station">` (content key) after the main column in DOM.
- Headings: `h1` station; `h2` Traffic around this station, Construction progress, Worksites and detours, Reports near this station; `h3` Latest site updates; rail card titles `h2` styled Body/M Semibold (they are page sections).
- Focus order: breadcrumb → Follow → Report an issue here → traffic card actions (per card: View notice, View on map) → All announcements → Open the traffic map → Progress along the whole line → map controls → map → Open full traffic map → Report an issue → rail: Connects to links → alerts action → careline → footer.
- Stats `<dl>`; announcements list `<ul>` with each card an `<article aria-labelledby>`; reports list `<ul>`; stages `<ol>`.
- Tags carry text; stage states carry sr-only text; colour is never the only signal.
- Touch: buttons 40–42 px get `hit-area` below 768; link actions in cards get `hit-area` below 768.

## Links and destinations
| Element | Destination |
|---|---|
| Breadcrumb Home, Project, Stations | `routes.home`, `routes.project.overview`, `routes.project.stations` |
| Follow (guest) | `routes.account.loginReturningTo(routes.project.station(code))` |
| Report an issue here, Report an issue (CTA) | `routes.reportTrack.reportAt(code)` (**new helper**: `/report?station=s20`; the Report form preselects the station) |
| View notice | `routes.traffic.announcement(id)` (**new helper**, `/traffic/announcements#<id>`; until the Announcements spec defines anchors, `routes.traffic.announcements`) |
| View on map | `routes.traffic.mapFocus(id)` |
| All announcements | `routes.traffic.announcements` |
| Open the traffic map, Open full traffic map | `routes.traffic.map` (**Decision:** the plain map; a station-focused map URL waits for the Traffic map spec) |
| Progress along the whole line | `routes.project.construction` |
| Connects to | `routes.project.station(neighbour.code)` |
| Manage alerts in your profile | `routes.account.profileSection('notifications')` |
| Log in to follow {name} | `routes.account.loginReturningTo(routes.project.station(code))` |
| Careline | `siteInfo.careline.tel` |

## Shared component needs
1. **Followed-stations store** (see Stations spec).
2. **Stepper**: a "stages" variant (vertical at all widths; per step a detail line and optional tag; complete steps in `success-600`, current ring in `primary-600`). Alternatively a dedicated `StageList` pattern; main agent decides. Ticket stepper stays as is.
3. **Map pattern** (`components/patterns/map`) usable as a small embedded snippet (props: centre, zoom, markers, `interactive: 'snippet'` with the touch/scroll rules above). Shared with the Traffic map; build on main.
4. **Geometry on records**: announcements and road works need a point (lat/lng) for markers. Data model change on main, coordinated with the Traffic map spec. Until then the snippet shows the station marker only.
5. **Info list** (About spec) for "Station at a glance".
6. **Route helpers**: `routes.reportTrack.reportAt(code)`, `routes.traffic.announcement(id)`.

## Open questions
1. **Map/Satellite switch** dropped (no satellite source under the OSM-only decision). Confirm, or name a free imagery source.
2. **Locate button** recentres on the station instead of the user's location. Confirm.
3. **Mobile code chip:** Figma 133:14946 draws a squashed chip above the title; spec uses a 48 × 48 chip above the title. Visual diff may flag it.
4. **No previous/next station control** (not in Figma); "Connects to" links serve that. Confirm.
5. Guest and not-following variants of the alerts card are not in Figma; copy above is a proposal.
6. Should a guest who logs in from "Follow station" be followed automatically on return? Spec: no (they tap Follow again). Simpler and predictable.
