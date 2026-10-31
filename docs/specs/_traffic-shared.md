# Traffic group: shared behaviour and shared component changes (iteration 4)

Read with the four page specs. Shell rules are in `_shared.md`; project-wide decisions in `_project-decisions.md`. **Decision** marks anything Figma does not answer. Section 1 is for the main agent to review before the build; sections 2 to 4 are behaviour the Map and Route view specs both point to.

## 1. Shared component changes (land on `main` before the page slices)

All additive and backwards compatible; the gallery and Home must keep working.

| # | Component | Change |
|---|---|---|
| 1 | `patterns/map` (extend) | Props added to `LocationMap`: `markers[].variant` (`code` \| `dot` \| `closure` \| `hazard`), `markers[].selected`, `zones[]` (`{id, lat, lng, radiusM, selected}`, dashed circle), `lines[]` (`{id, points, variant:'line'}`, polyline with station dots), `labels[]` (text tags shown from a minimum zoom), `selectedId`, `onSelect(id)`, `onDeselect()`, `renderPopup(id)` (React content in a Leaflet popup), `focusId` + `focusKey` (pan to an item and open its popup; `focusKey` re-triggers the same id), `resetBounds` (the "locate" button re-fits to these bounds), `tileErrorText`. Zoom +/- and the reset button restyled to Figma 1:918 / 1:925 (top right, 40 px). The `snippet` mode is unchanged. Markers: `divIcon`, `keyboard: true`, `title`/`aria-label` from `label`, 44 × 44 hit area under the 22 px glyph. Marker and halo colours use `static-*` tokens (tiles stay light in dark mode). |
| 2 | Line diagram and rail (now in `features/home`: `line-diagram*.tsx`, `line-rail-view.tsx`, `line-station.ts`, `line-map-data.ts`) | Promote to `components/patterns/line-diagram/` so Home and Route view share one. Add `mode: 'link' \| 'select'` (Home keeps `link`), `selectedCode`, `onSelect(code)`, and `markersByStation: Record<StationCode, ('closure'\|'construction'\|'hazard')[]>` (glyphs on the diagram: no-entry circle, amber segment, triangle; in the rail a 16 px glyph before the chevron). Selected state: S09-style halo 44 px `primary-100`, label `primary-700` Semibold. In `select` mode each station is a `button` with `aria-pressed`. |
| 3 | `ui/pagination.tsx` (new) | `<nav aria-label>` + `<ol>` of 36 × 36 buttons or links (radius `lg`, border `gray-300`; current: `primary-600` bg, `static-white` text, `aria-current="page"`; disabled prev/next `gray-100`/`gray-400`). Props: `page`, `pageCount`, `hrefFor(page)`, labels from content. 7 or fewer pages: all numbers. More: first, last, current ±1, "…" (not focusable). `hit-area` below 768. |
| 4 | `ui/tabs` | `TabsTrigger` gets optional `count` (pill: `gray-100` bg, Body/XS Medium `gray-700`; selected trigger: `primary-50` bg, `primary-700`). The count is inside the tab's accessible name ("Current, 3"). Wrapping rule already in `_shared.md`. |
| 5 | `ui/segmented-control` | Optional link mode: each segment is a `next/link` with `aria-current="page"` on the active one, inside `<nav aria-label>`; same visuals. Used by Map view / Route view. |
| 6 | `ui/text-input` | Confirm a `search` variant: leading `search` icon 18 px, trailing "Clear" icon button (`x`, 16 px, `aria-label` "Clear search", 44 px target on mobile) once there is text. If it already exists, no change. |
| 7 | `layout/site-shell` | A `workspace` layout option for Map view and Route view: no footer, content area height `calc(100dvh − var(--chrome-h))` from 1024. The shell exposes `--chrome-h` = header + visible notification bar and updates it when the bar is dismissed. Below 1024 the page scrolls normally. See Open question 6. |
| 8 | `lib/url/use-query-params.ts` (new) | `useQueryParams()` returning `get(key)` and `set(partial, {mode})` that writes with `router.replace(..., { scroll: false })`, drops params equal to their default and keeps the hash. Used in a `<Suspense>` client leaf per `_project-decisions.md` 5. |
| 9 | Data (`data/models`, `data/mock`, `data/api`) | (a) `getTrafficItems()` returns one list of `TrafficItem` built from non-ended announcements and all road works (section 2). (b) `getRoadChangesThisWeek(limit)` returns a curated order (Overview). (c) Announcement gets `noticeUrl` (external, VERIFY). (d) `getTrafficUpdatedAt()` for "Updated today at 14:20". (e) `getLineAlignment()` returns station points in line order for the polyline. (f) Counts must add up to Figma's 4 / 6 / 2 (12) under "Happening now": see Open question 4. |

Not new: tags (Closure, Construction, Hazard, Active, Upcoming, Ended exist), `filter-chips`, `checkbox`, `select`, `link-card`, `docs-layout`, `section-bar`, `need-help-block`, `breadcrumb`, `callout`, `info-list`.

## 2. The traffic item and the layers

`TrafficItem` (built in `features/traffic`, not in `data`): `{ id, source: 'announcement' | 'road-work', layer: 'closure' | 'construction' | 'hazard', status, title, brief, dateText, lat, lng, stationCodes, areaIds, announcementId? }`.
- Layer from `announcement.type` or `roadWork.kind` (same three names).
- Ended announcements never appear on the map, the diagram or the lists in Map view and Route view (they live on Announcements, tab Past).
- Date line: range ("12 Oct 2026 to Jul 2027", via `lib/format`) for announcements and works; hazards read "Reported {date}" (their `startDate`).
- Panel list rows and popup content come from the same item, so the two never disagree.

## 3. The traffic panel (Map view and Route view)

Same component in both views (Figma 1:804 and the route-view panel). Width 400 at 1024+, full width below. Padding 24 at 1024+; 16 below 768 (Figma mobile); 32 at 768 to 1023.

Order: title block, view toggle, search, time filter, layer toggles, divider, list heading, list.

- **Title block.** `h1` "Traffic map" (Heading/XS, Poppins Semibold 24/32 on mobile, 28/36 desktop per Figma), then "Updated today at {time}" Body/S `gray-600`. Both views use the same `h1` (Figma), the document `<title>` differs ("Traffic map" / "Route view").
- **View toggle.** Segmented control, link mode: Route view (`/traffic/route`) and Map view (`/traffic/map`), icons `route` and `map` 16 px. The active one has `aria-current="page"`. Carried across the switch: `when` and `hide` (minus `lrt`). Dropped: `q`, `focus`, `station`.
- **Time filter.** Three-segment control (Figma 67:2449), native radio group (fieldset, visually hidden legend "Show road changes that are"). ←/→ move and select. URL `when=now|week|upcoming`; default `now` omitted. Definitions at the design date (`MOCK_NOW`, 29 Oct 2026):
  - Happening now: `status === 'active'`.
  - Next 7 days: active, or upcoming with a start date within 7 days.
  - Upcoming: `status === 'upcoming'` (any start in the future).
- **Layer toggles** ("Show on map" / "Show on diagram"). Checkboxes in a `fieldset` with legend; each row: checkbox, 24 px swatch, label, count at the right (`tabular-nums`, `gray-500`). Row height 20 (44 below 768 via the label hit area). Swatches are the **legend**: Map view uses the line (closure), dashed amber circle, triangle, blue line with dot (LRT alignment); Route view uses the no-entry circle, amber bar, triangle. Counts are the number of items of that layer that pass the time filter and the search, **ignoring** whether the layer is checked (so a hidden layer still shows what it would add). URL `hide=closure,construction,hazard,lrt` lists unchecked layers; none unchecked is omitted. Toggling changes the map or diagram instantly (no animation) and updates the list and the "In this area" count.
- **Divider** 1 px `gray-200`, then the list heading.
- **List item** (Figma 1:843): tag (Closure / Construction / Hazard), title Body/S Semibold, brief Body/XS `gray-600`, date row with `calendar` icon 13 px. One `<button type="button">` per item inside `<li>` (Map view) or one `<a>` (Route view, to the map), whole card hit target, padding 12, radius `lg`, border transparent. Hover: bg `gray-50`. Selected (`aria-pressed="true"`, Map view only): bg `primary-50`, border `primary-300`. Focus-visible: global ring.
- **Empty list.** Heading becomes "In this area (0)"; one block replaces the list: `search-x` 20 px `gray-400`, "No road changes match", hint "Try another time range or show more layers.", and a Ghost button "Clear filters" that resets `q`, `when`, `hide`. If the cause is a time range with nothing, hint reads "Nothing is planned in this time range." (content picks by cause: no matching text, no items in range, all layers hidden).
- **Live region.** One visually hidden polite region, 500 ms debounced, says "{n} road changes shown" after any filter or search change; not on first render.

## 4. URL state (Map view and Route view)

| Param | Values | Default (omitted) | Used by |
|---|---|---|---|
| `when` | `now`, `week`, `upcoming` | `now` | both |
| `hide` | comma list of `closure`, `construction`, `hazard`, `lrt` | none | both |
| `q` | text, max 60 | empty | Map view |
| `focus` | traffic item id | none | Map view (`routes.traffic.mapFocus`) |
| `station` | lowercase station code | none | Route view (`routes.traffic.routeAt`) |

All written with `router.replace`, no scroll. **Decision:** `replace`, not `push`, so Back leaves the page instead of undoing ten toggles (differs from the wording in `_project-decisions.md` 5, which wanted Back to work for shareable views; the URLs are still shareable). Invalid values are ignored and fall back to the default (never an error). `focus` for an id that is not in the current filtered set: the filters that hide it are cleared (`when` set to the item's own status window, `hide` and `q` cleared) so a shared link always lands on the item.

## 5. Motion, shared

Map pans and "fly to" use Leaflet's animation of 250 ms (ease-out). Marker selection (halo and zone stroke) and list item colours change over 150 ms. Popups fade in over 150 ms. `prefers-reduced-motion: reduce`: every pan is instant (`animate: false`, `duration: 0`), popups appear without fade, scroll-into-view uses `behavior: 'auto'`, the skeleton does not pulse.

## 6. Open questions (group level)

Numbered with the page specs in the summary; details are in each spec's own list. The shared ones are 4 (data counts), 5 (list scope) and 6 (workspace footer).
