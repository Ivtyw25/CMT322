# Route view: UX spec
Route: `/traffic/route` (`routes.traffic.route`, `routes.traffic.routeAt(code)`) · Figma: desktop 5:843, mobile 133:27775 (no dark frames; tokens swap). Figma shows S09 Bukit Jambul selected.

Shell rules: `_shared.md`. Panel, time filter, layer toggles, list item, URL params: [`_traffic-shared.md`](./_traffic-shared.md). Home's line diagram is reused (shared change 2).

## Purpose and primary task
Someone who travels by station ("what is happening near Bukit Jambul?") picks a station on the line and sees the road changes near it, without reading a map.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390; panel padding 16; station rail rows wrap names and subtitles; glyphs stay on the right. |
| 390–767 | Mobile frame: panel on top (title, toggle, search, time, layers, station card, road changes), then the hint line and the vertical **line rail** (one row per station). Full width, page scrolls. No footer (shared Open question 6). |
| 768–1023 | Same single column; panel and rail centred, max width 640. Road changes near the station in two columns. |
| 1024–1439 | Workspace (panel 400 + canvas) as the desktop frame, but the canvas shows the **vertical rail** (max width 560, left aligned, 24 padding), not the diagram: the 976 px diagram would need to shrink below 12 px labels (Decision, as Home decision 11; Open question 3). Canvas scrolls vertically inside its own column. |
| 1440+ | Desktop frame 5:843: canvas 1040 wide, the logical diagram at natural size (about 976 × 600) with the hint line above it and the legend below; diagram left aligned at 24 padding, canvas bg `gray-50`. At 1920 the canvas widens, diagram stays natural size and is centred horizontally; vertically centred in the canvas. |

## Sections
### 1. Panel
Shared section 3 with "Show on diagram" (three layers, no LRT row), search below, then:
- **Search a station** (combobox, ARIA 1.2 list autocomplete as Home search, simplified): input `role="combobox"`, `aria-controls`, `aria-activedescendant`, `aria-expanded`. Opens at 1 character. Matches station code ("s09", "9"), name and subtitle (landmarks), normalised as Home. Options: code chip (Body/XS Semibold, `primary-600` bg) + name + subtitle, max 6, order = line order, first option active. Enter or click selects the station. Escape closes, second Escape clears. No match: one non-option row "No station matches “{query}”" with hint "Try the station code, for example S09." Same panel visuals as Home's list. Live region "n stations".
- **Station card** (Figma 5:xxx "S09 Bukit Jambul"), shown only when a station is selected: bg `primary-50`, border `primary-200`, radius `xl`, padding 16; code chip, name Heading/3XS, "Clear" Ghost button (top right, `aria-label` "Clear station Bukit Jambul"), `serves` text Body/S `gray-700`, then a Ghost link "Open the station page" (`routes.project.station(code)`; Decision, Open question 11). Clear removes `station` and focus moves to the search field.
- **List.** Heading "Road changes near this station (n)" with a station selected, otherwise "Road changes on the line (n)" listing every item passing the filters, sorted by the position of its first station along the line (S31 to A01), then start date. Items with several stations list under the first one. Each row is a link to `routes.traffic.mapFocus(id)` (same-tab). Figma's tinted first card is a hover/focus sample: no row is preselected.
- Empty: shared empty block; with a station selected the text is "No road changes near {name} in this time range."

### 2. Diagram, 1440+ (5:xxx canvas, built from the Home diagram)
Hint line "Station order, not to scale. Select a station to see road changes near it." Body/S `gray-600`, plain text above the diagram. Legend below: Mutiara Line, Station, Interchange, Nearby place, Active worksite, Road closure, Traffic hazard (plain, not focusable).
- Stations are `button`s (`aria-pressed`, name "{code} {name}", plus ", provisional name" or ", interchange" as Home) in an `<ol>` in line order S31 to A01: 22 tab stops. Hover: circle fill `primary-50`, name underline. Selected: 44 px halo `primary-100`, label `primary-700` Semibold (Figma "Bukit Jambul" in blue), `aria-pressed="true"`. Focus-visible: ring around circle and label.
- Glyphs sit where Figma shows them: closure no-entry circle on the station, amber 6 px bar segment on the line before or after the station for works (S10–S09, S05–S06 style), triangle beside it for hazards. A station with several items stacks at most two glyph types; screen readers get the count in the station name ("S09 Bukit Jambul, 2 road changes nearby"). Glyphs follow the layer toggles and the time filter. Glyph source: item `stationCodes[0]`.
- Selecting a station: updates `station`, panel card and list; no scrolling of the diagram (it fits). Selecting the selected station again deselects it.
- Nearby places and Depot labels: plain text, not focusable, never links.

### 3. Rail, below 1440 (133:27775 lower half)
Home's `LineRailView` in `select` mode, 22 rows S31 to A01 (code chip, name Body/M Semibold, subtitle Body/S `gray-600`, `chevron-right`). Row is a `button` (`aria-pressed`). Selected row bg `primary-50`, name `primary-700`, dot ring `primary-600`. Rows with road changes show their glyphs (16 px, max two types) before the chevron, with visually hidden "{n} road changes nearby" (Decision, needed so the layer toggles have a visible effect; Open question 11b). Hint line above the rail as above. On selection below 1024 the page scrolls to the station card (top 72 px under the header), focus stays on the row; the card is announced by the live region.

## Interactive elements
| Element | Trigger | Result | States | Keyboard | Notes |
|---|---|---|---|---|---|
| View toggle | click | Go to Map view with `when`, `hide` | default, hover, focus-visible, current | Tab, Enter | |
| Station search | type, choose | Select station (`station=`), close list, scroll diagram or rail target into view (`nearest`) | default, focus, open, no results | ↑/↓, Enter, Esc | Combobox |
| Time filter, layers | click | Glyphs, counts and list update | as shared | ←/→, Space | |
| Station (diagram or rail) | click | Select; card, list update | default, hover, selected, focus-visible | Tab, Enter, Space | Toggles off if selected |
| Clear (card) | click | Deselect | default, hover, focus-visible | Enter | Focus to search |
| Station page link | click | → station page | default, hover | Enter | |
| List row | click | → Map view focused on the item | default, hover, focus-visible | Enter | Hit-area on mobile |

## Hidden content inventory
- 22 stations with name, subtitle, `serves`, code (from `getStations()`); nearby-place labels per diagram (already on Home).
- Per-station glyph set (derived from items). Station-card text for provisional-name stations (S30 Jalan Bagan Luar, A01 PSR-A): append "Provisional name" under the name.
- No-match, empty, live-region and hint strings.

## Dynamic states
- **No station in URL:** no card, list titled "on the line", nothing selected, search empty.
- **Invalid `station`:** ignored (shown as none).
- **Empty / error / loading / no JS:** empty as above; error boundary as Map view; Suspense skeleton = panel skeleton plus a grey rail (six 56 px rows, pulse, static under reduced motion). Without JavaScript the rail rows render as links to `routes.traffic.routeAt(code)` (progressive enhancement; Decision) so the page still works.
- **Long content:** names wrap in the rail; the diagram keeps Figma label widths, so diagram names stay two lines (as Home).

## Motion
Selection colour and halo 150 ms; list update instant; scroll to card smooth below 1024 (instant under reduced motion). No diagram animation.

## Accessibility
- Landmarks: panel section (h1), canvas `<figure>` with `aria-label` "Mutiara Line stations and road changes" and `<figcaption>` hint (visible). Headings: h1, h2 list heading.
- Focus order: toggle, station search, time, layers, station card (Clear, link), list rows, then the 22 stations (diagram or rail). Keyboard users can reach the diagram without tabbing through the list via the station search; a visually hidden skip link "Skip to the stations" precedes the list.
- Glyphs are `aria-hidden`; meaning comes from the station's accessible name and the list. Colour is never alone (shape plus the list tag).
- Touch: rail rows ≥ 52 tall; checkboxes and chips 44.

## Links and destinations
View toggle → `routes.traffic.map` (with `when`, `hide`). Station card → `routes.project.station(code)`. List rows → `routes.traffic.mapFocus(id)`. No-JS rail rows → `routes.traffic.routeAt(code)`.

## Open questions
3. Diagram only at 1440+; 1024 to 1439 gets the vertical rail. Confirm, or accept a horizontally scrolling diagram box.
8. Both Map and Route view use the same `h1` "Traffic map" (Figma). Distinct `h1` "Route view" would be better for screen readers.
11. "Open the station page" link in the station card is not in Figma. 11b: glyphs in the mobile rail are not in Figma either.
