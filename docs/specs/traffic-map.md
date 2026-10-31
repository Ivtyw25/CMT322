# Traffic map: UX spec
Route: `/traffic/map` (`routes.traffic.map`) · Figma: desktop 1:801, mobile 133:27469 (no dark frames; tokens swap)

Shell rules are in `_shared.md`. The panel, time filter, layer toggles, list item, URL params and shared component changes are in [`_traffic-shared.md`](./_traffic-shared.md); this spec adds only what is specific to the map. Basemap differs from Figma (OpenStreetMap); compare panel, controls, popup and legend only.

## Purpose and primary task
A commuter at the roadside or planning a trip asks "what is closed or dug up near me, and until when?". They scan the map or the list, tap one item, read dates and decide to detour, read the full notice or report a problem.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390. Panel padding 16. Popup width `min(300px, mapWidth − 32px)` = 288. Layer rows and list cards keep one column; long titles wrap. |
| 390–767 | Mobile frame: **map first** (CLAUDE.md §4), then panel. Map height `min(480px, 60svh)`, full width, no radius, directly under the notification bar. Panel below, full width. Page scrolls. No footer (see shared, Open question 6). |
| 768–1023 | Same order. Map height 520. Panel padding 32, list in two columns (cards 1fr 1fr, gap 12). Popup 300. |
| 1024–1439 | Workspace: panel 400 left (own vertical scroll, bottom border-free), map fills the rest; both `height: calc(100dvh − var(--chrome-h))`, min 600. Page itself does not scroll. Map 624 wide at 1024: popup 300 still fits; autopan keeps it inside. |
| 1440+ | Desktop frame as designed. At 1920 the map just gets wider; panel stays 400. |

DOM order is panel then map (so headings read h1 first); below 1024 the map is moved up with `order` (touch-first; accepted). A visually hidden "Skip to the list of road changes" link is the first focusable element inside the map region and goes to the list heading.

## Sections
### 1. Panel (1:804, mobile panel under 133:27469 map)
See `_traffic-shared.md` section 3. Search here is a **filter**, not a combobox: "Search a road or area" (`type="search"`, label hidden but present, `enterkeyhint="search"`, `maxlength=60`). Matches title, road, location and area label, case and diacritic insensitive, "-" as space (same normaliser as Home search). Filters list, markers and counts live on every keystroke (client, 12 records). Enter additionally fits the map to the remaining markers (`maxZoom 15`); with no match nothing moves. Escape in the field clears it. URL `q` updated 300 ms after the last keystroke.

### 2. Map (1:859)
Leaflet + OSM, attribution "© OpenStreetMap contributors" always visible bottom right (replaces Figma's "Google Maps placeholder"). `interaction="full"`: wheel zoom, one-finger pan, pinch. Default view fits the LRT alignment (all 22 stations) with 24 px padding; initial `zoom` min 11.
- **Layers** (checkbox state controls each):
  - Road closure: marker, 22 px circle `danger-600` with white no-entry (minus) glyph, 2 px white ring, `static` colours.
  - Construction zone: dashed circle, radius 150 m, stroke 1.5 px dashed `static-amber`, fill `static-amber` at 20 %. Plus a 10 px centre dot so it can be targeted at low zoom.
  - Traffic hazard: 24 px triangle `danger-600`, white exclamation.
  - LRT alignment: 4 px `primary-600` polyline through the stations in line order, station dots 8 px white fill with 2 px `primary-600` ring. Not interactive.
  - Station labels (white pill, Body/XS Semibold, as 67:2403): shown for S31, S20, S19, S13, S09, S03 and A01 from zoom 11, all stations from zoom 14. Plain, `aria-hidden`, not focusable (stations are reached in Route view).
- **Selected item:** closure gets a 44 px halo `danger-100`; zone stroke becomes solid 2 px and fill 32 %; hazard gets a 44 px halo. Selection never changes colour only: the popup also opens. Unselected markers dim nothing.
- **Z-order:** selected on top, then hazards, closures, zones (zones sit under markers), alignment lowest.
- **Controls:** zoom +/- (1:918) and reset (1:925) top right, 40 px, `aria-label` "Zoom in", "Zoom out", "Show the whole line" (the "locate" crosshair icon; resets to the default fit, Decision, Open question 7). Disabled zoom button at min/max. The Map/Satellite switch (67:2444) is **not built** (iteration 3 decision). Controls are real `button`s, in DOM order after the markers.
- **Map region:** `role="region"` `aria-label` "Map of road changes along the Mutiara Line", focusable (Leaflet keyboard on): arrows pan, + / - zoom. Visible focus ring inset.
- **Tiles fail** (offline, blocked): the placeholder tint shows with `unavailableText` "The map could not load. The list still shows every road change." centred over the map; markers still render on the grey background; list and popup work.
- **Loading:** `MapPlaceholder` (existing, `gray-100`, pulsing `map` icon, static under reduced motion) until the canvas is ready; panel is interactive immediately.

### 3. Popup (Figma popover 67:2416, mobile 133:27469)
Rendered by `renderPopup(id)` inside a Leaflet popup: `surface`, radius `xl`, `shadow-panel`, width 300, padding 16, pointer toward the marker. Content: type tag + close icon button (`x` 16 px, `aria-label` "Close", 44 px target on mobile); title Heading/3XS; summary Body/S `gray-700` (announcement `summary`; works `summary`); `calendar` 14 px + date text; `clock` 14 px + hours ("All day" when `dailyHours` is null, otherwise "10 pm to 6 am"); actions row "Read announcement" (`routes.traffic.announcement(id)`, announcements only) and "Report a problem" (`routes.reportTrack.reportAt(first stationCode)`), Body/S Medium `primary-700`. Road works have no announcement: only "Report a problem". Hazards omit the clock row.
- Opens on: marker click/Enter/Space, zone click, list item activation, `?focus=<id>` on load.
- Autopan: keep the popup fully inside the map with 16 px padding; at 390 the map is 390 × 480 so the popup (about 250 tall) fits; on desktop an extra 400 px right padding is not needed.
- Closes on: close button, Escape, click on empty map, selecting another item (swap, no flicker), clearing a filter that removes the item. Closing deselects the list item and removes `focus` from the URL.
- Focus: opening from a marker moves focus to the popup container (`role="dialog"`, `aria-labelledby` the title, `tabindex=-1`, non-modal, no trap). Tab order inside: close, Read announcement, Report a problem, then onward in DOM order. Escape returns focus to the marker (or to the list item if it came from the list). Opening from the list leaves focus on the list item.

## Interactive elements
| Element | Trigger | Result | States | Keyboard | Notes |
|---|---|---|---|---|---|
| View toggle | click | Navigate to Route view with `when`, `hide` carried | default, hover, focus-visible, current | Tab, Enter | Link mode |
| Search | type | Filters list, markers, counts | default, focus, filled, no results | Esc clears; Enter fits map | Clear button when filled |
| Time filter | click, arrows | Sets `when`; list, markers, counts update | selected, hover, focus-visible | ←/→ | Native radios |
| Layer checkbox | click | Shows/hides layer; URL `hide` | checked, unchecked, hover, focus-visible | Space | Count unchanged by checking |
| List item | click | Select: pan to item (zoom to at least 14), open popup, scroll map into view below 1024 | default, hover, selected, focus-visible | Enter, Space | Second click on selected item deselects |
| Marker / zone | click | Select item, popup opens, list item scrolls into view (`nearest`) and highlights | default, hover (halo 32 px), selected, focus-visible (ring around halo) | Tab, Enter, Space | `aria-label` "{type}: {title}, {date text}" |
| Popup links | click | Announcement anchor, or Report with station prefilled | default, hover, focus-visible | Tab, Enter | Same tab |
| Zoom, reset | click | Map zoom or default view | default, hover, active, disabled, focus-visible | Enter, Space | |

Below 1024, activating a list item or a marker scrolls the page so the map top sits 72 px under the viewport top (below the sticky header) before the pan starts; `scroll-margin-top: 72px`; instant under reduced motion. Hover (desktop only): hovering a list item halos its marker (32 px, no popup); hovering a marker highlights its list item (`gray-50`).

## Hidden content inventory
- Popup content: one per traffic item (about 10 to 12). Needs `summary`, hours text, date text from data.
- Marker labels for screen readers: type word per layer ("Road closure", "Construction zone", "Traffic hazard").
- Empty and filter-cause messages (3 variants), tile error text, skip link text, popup actions, control labels, live-region strings (`resultCount(n)`), "Updated today at {time}".
- No pagination: the list shows every item (at most 12 to 15), scrolling inside the panel.

## Dynamic states
- **Empty:** see shared section 3; the map still shows the LRT alignment.
- **Loading:** page is statically rendered with data; only the map canvas loads (placeholder). The URL-reading leaf has a `<Suspense>` fallback: panel skeleton (title, toggle, three grey bars, four 20 px rows, four 96 px cards) with `gray-100` blocks, pulse 1.2 s, static under reduced motion.
- **Error:** data function failure shows the route's `error.tsx` ("We could not load road changes.", Primary button "Try again", link "Contact us"). Tile failure as above.
- **Long content:** titles wrap (no truncation) in list and popup; popup max height `min(70% map height, 360px)` with inner scroll; search text truncates with the input's own scroll.
- **Many items:** 100 items works: list scrolls inside the panel; markers cluster not required (Decision: no clustering at this data size; revisit if more than 40 markers).
- **No JavaScript:** panel and list render server-side with default filters; map area shows the placeholder with `unavailableText`; items link via `routes.traffic.announcement` are not shown (needs JS). Acceptable.

## Motion
Per shared section 5. Panel list updates swap instantly; no list animation. Popup 150 ms fade. Skeleton pulse only. Reduced motion: no pan animation, no fade.

## Accessibility
- Landmarks: panel is `<section aria-labelledby>` (the `h1`), map `role="region"`. Heading order: h1 title, h2 "Show on map" (the fieldset legend styled Body/S Semibold, not a heading), h2 "In this area (n)".
- Focus order on desktop: view toggle, search, time filter, layers, list items, skip link target, map controls and markers. Markers follow list order.
- Item colour is never the only signal: shape (circle, dashed circle, triangle), the glyph, the tag word in the list and popup.
- Contrast: marker glyphs white on `danger-600` (4.5:1); zone stroke is decoration, the zone dot and label carry meaning.
- Touch targets: markers 44 × 44 hit areas; list cards 44+ tall; checkbox rows 44; popup close 44.
- Live region announces "Selected: {tag}, {title}, {date}" (polite) when a popup opens, and result counts after filters.
- Zoom buttons and reset have names; the map is not the only way to get any content (the list has all of it).

## Links and destinations
Logo/nav: shell. Breadcrumb: none on this page. View toggle → `routes.traffic.route` (with `when`, `hide`). Popup: Read announcement → `routes.traffic.announcement(id)`; Report a problem → `routes.reportTrack.reportAt(code)`. Skip link → `#road-changes-list`. Attribution "OpenStreetMap contributors" → external `https://www.openstreetmap.org/copyright` (new tab, label "opens in new tab"). Inbound: `routes.traffic.mapFocus(id)` from Home, Overview, Announcements, station pages.

## Open questions
4. Figma counts (4 closures, 6 zones, 2 hazards, "In this area (12)") under "Happening now" cannot come from the mock data (3 active announcements plus 3 active works, 5 non-ended items overall plus upcoming). Builder shows computed counts; the main agent must extend the mock data or accept different numbers (tests must not hard-code 12).
5. "In this area (n)": Figma's wording suggests map bounds. Decision: it lists every item passing the filters, not bounds-limited. Keep the copy?
7. The "locate" crosshair resets the view to the whole line (not the user's GPS). Confirm.
10. URL writes use `replace`, not `push` (see shared section 4).
12. Map/Satellite switch dropped (iteration 3 decision) so the popup has no satellite twin.
