# Stations: UX spec
Route: `routes.project.stations` (`/project/stations`) · Figma: desktop 100:3723, mobile 133:18202, dark: none (token rules)

Shell, docs layout, section bar and sidebar: [`_shared.md`](./_shared.md) §10–11. This page has **no "On this page" list**: the aside column holds the "Stations you follow" card instead.

## Purpose and primary task
Find one station fast (often "the one near me" or "the one I pass every day") and open its page to see road changes, progress and reports. Secondary: see which stations you follow.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390. Search placeholder wraps to two lines inside the field (Figma 133:18253 already shows two lines at 390; the field grows, min height 50). Rail rows: name and subtitle wrap; chevron centred vertically. |
| 390–767 | Mobile frame 133:18202. Section bar `Project / Stations`. Segment box stacks the two segments (gap 24). Following chip sits **under** the subtitle (133:18304). Follow card after Related pages, full width, button full width. |
| 768–1023 | Section bar. Segment box two columns (desktop 100:3852). Following chip on the right of the row, before the chevron (desktop). Follow card after the article, max 760 wide, button auto width. |
| 1024–1279 | Sidebar + article. Aside column hidden (shared rule); the follow card renders after the article. |
| 1280+ | Desktop frame: aside column 200 px with the follow card (sticky like the aside, `top: 117px`). |
| 1440+ | Content 1200 centred; at 1920 extra width is margin. |

## Sections (top to bottom)

### 1. Head (100:3737)
Breadcrumb `Home / Project / Stations`; `h1` "Stations"; lede. Content `projectCopy.stations.head`.

### 2. Station search (100:3847)
- A search field, not a form submit: `<input type="search">` inside `role="search"`, leading `search` icon 18 px `gray-400`, height 50, radius `xl`, border `gray-300`; placeholder "Search by name or code, for example S20". Visually hidden label "Search stations" (content key). `autocomplete="off"`, `spellcheck="false"`, `enterkeyhint="search"`.
- **Filters the rail as you type** (no debounce needed: 22 records, in memory). Match rules: case- and accent-insensitive, trimmed; a station matches when its code, name, subtitle or area **contains** the query; a code query also matches without the letter ("20" finds S20) and with a space ("s 20"). Leading zeros: "9" does not match S09 alone; "09" does.
- Matched text in name and subtitle is shown **bold** (Semibold), like Home search suggestions; no colour change.
- Results announcement: a visually hidden `role="status"` region after the field: "Showing 3 of 22 stations" (updates 300 ms after typing stops, so it doesn't chatter); "Showing all 22 stations" when cleared.
- Clear: the native search clear "×" plus **Escape** clears the field and restores all 22 (focus stays in the field). Browsers without a native clear button: show a 32 px icon button `x` "Clear search" inside the field on the right when it has text (`hit-area` below 768).
- Enter: if exactly one station matches, go to that station's page; otherwise do nothing (no reload).
- **Decision:** the query is not written to the URL. Reason: commuters search, open a station and come back with Back; browsers restore the field value from the back/forward cache, and Next.js restores scroll. Re-apply the filter on mount from the input's current value so a restored value and the list agree.

### 3. Segments (100:3852)
Static info box (`gray-50`, radius `xl`, padding 14 × 16): "PSR-A to KOMTAR / Under construction since January 2025" and "Macallum to Penang Sentral / Construction starts January 2027". Title Body/S Semibold `gray-900`, line Body/S `gray-600`. Not interactive, not a filter. `<dl>`-like pairs are not needed: two short paragraphs each.

### 4. Station list (100:3859 / 133:18265)
- Shared `LineRail` (page variant) in line order from S31 Penang Sentral to A01 PSR-A, source `getStations()` (sorted by `order`).
- Row: stop 24 px (hollow ring `primary-600` on `surface`), code chip 44 × 24, name Body/M Semibold `gray-900`, subtitle Body/S `gray-600` (the station `subtitle`; "Provisional name" for `isProvisionalName` stations without a subtitle), optional **Following** chip (signed-in users, stations in their followed list: `primary-50` bg, `bell` 12 px + "Following" Body/XS Medium `primary-700`, plus visually hidden "You follow this station"), `chevron-right` 18 px `gray-400`.
- The whole row is one link (`LineRailStop` with `href`). Hover: bg `gray-50`, name `primary-700`, chevron `primary-700`. Focus-visible: ring inset −2 px, radius `xl`. Pressed (touch): bg `gray-100`.
- While filtering, only matching stops render, still in line order, still joined by the rail line (the line is a visual device; gaps between non-adjacent stations are not drawn). The `<ol>` keeps `start`-free numbering; each stop's code carries the order.
- **No-results state:** the rail is replaced by a block: `search-x` 24 px `gray-400`, "No station matches “{query}”" (Body/M Semibold `gray-900`), "Check the spelling or try a station code such as S20." (Body/S `gray-600`), and a Secondary button "Show all stations" that clears the search and moves focus to the field.

### 5. Related pages (100:3789)
Shared `RelatedPages`: About the line, Route view, Construction progress. No page feedback on this page (Figma has none).

### 6. Stations you follow (100:3810 / 133:18507)
Card: border `gray-200`, `gray-50` bg, radius `2xl`, padding 16; title Body/S Semibold, text Body/XS `gray-600`, Primary button 40 px.
Three variants, chosen from the session (`useSession`) and the followed list:
| Variant | Title | Text | Button |
|---|---|---|---|
| Signed in, following ≥1 | "Stations you follow" | "{list}. We email you about closures and works near them." where list is "S20 KOMTAR and S13 Jalan Universiti" (codes + names, joined with commas and a final "and") | "Manage in your profile" (Primary) |
| Signed in, following 0 | "Stations you follow" | "You don't follow any stations yet. Open a station and choose Follow to get emails about works near it." | "Manage in your profile" (Primary) |
| Guest | "Get alerts for your stations" | "Log in to follow stations and get emails about closures and works near them." | "Log in to follow stations" (Primary) |

No flash: the shell's head script sets `data-session` before paint; render both the guest and signed-in variants on the server and let CSS show the right one (shared decision 7). The followed list (and so the text and the Following chips) comes from the client store and appears after hydration; the signed-in card shows a 2-line text skeleton (`gray-100` bars, Body/XS height) until then.

## Interactive elements
| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Search field | type | Filter rail, announce count | default, hover, focus (`shadow-focus`), filled, no-results | Esc clears; Enter opens single match | `type="search"` |
| Clear search (fallback button) | click | Clear and show all | hidden (empty), default, hover, focus-visible | Enter/Space | Only if no native clear |
| Station row (×22) | click | → station page | default, hover, pressed, focus-visible, following | Tab, Enter | Whole row link |
| "Show all stations" | click | Clear search, focus field | Secondary states | Enter/Space | No-results only |
| Related page row (×3) | click | → page | default, hover, focus-visible | Enter | |
| Follow card button | click | → profile stations / log in | Primary states | Enter | |

## Hidden content inventory
| Item | Count / kind |
|---|---|
| Search label, clear label, status texts ("Showing {n} of 22 stations", "Showing all 22 stations") | 4 |
| No-results title (with query), hint, button | 3 |
| Follow card: 3 variants (titles, texts, buttons) | 3 × 3 strings; list formatter for "A, B and C" (`lib/format`) |
| "You follow this station" (sr-only) | 1 (already shared) |
| Station records | 22 (exist); each needs `subtitle` or provisional flag |
| Metadata | title + description |

## Dynamic states
- **Loading:** none for stations (server). Follow card: skeleton until the client store is read (signed-in only).
- **Empty:** no-results state above. Zero stations from the data layer cannot happen; if it does, show the no-results block without the query sentence ("No stations to show.").
- **Error:** route error boundary.
- **Signed in vs guest:** Following chips and the follow card variant. Signing in or out in another tab updates both (session `storage` event).
- **Long content:** a 60-character query fits (field scrolls its text); long names wrap.
- **No JavaScript:** the full rail renders and every row works; the search field does nothing (it is still visible; acceptable). Without JS the head script does not run, so the follow card shows the guest variant.

## Motion
Filtering is instant (no list animation). Row hover colours 150 ms. Reduced motion: nothing moves anyway.

## Accessibility
- `h1` "Stations"; the station list has a visually hidden `h2` "All stations" (content key) so the list is reachable by heading; Related pages title is an `h2` styled Body/S Semibold (shared); the follow card title is an `h2` styled Body/S Semibold.
- Focus order: breadcrumb → search field → (clear) → 22 station links → Related pages → follow card button (below 1280 it is after Related pages; from 1280 it is in the aside, which follows the article in DOM) → footer.
- The rail `<ol aria-label="Stations in line order">`. Each link's accessible name: "S20 KOMTAR, KOMTAR bus terminal, KOMTAR Tower, George Town UNESCO site, You follow this station" (code, name, subtitle, following), built from the visible text.
- Live region: one polite status for the result count. The no-results block is ordinary content (not a live region); for zero results the status reads "No stations match {query}" instead of a count.
- Touch: rows ≥ 48 px; search field 50 px; clear button `hit-area`.

## Links and destinations
| Element | Destination |
|---|---|
| Breadcrumb Home, Project | `routes.home`, `routes.project.overview` |
| Station row | `routes.project.station(code)` |
| Related: About the line, Route view, Construction progress | `routes.project.about`, `routes.traffic.route`, `routes.project.construction` |
| "Manage in your profile" | `routes.account.profileSection('stations')` |
| "Log in to follow stations" | `routes.account.loginReturningTo(routes.project.stations)` |
| Search, clear, Show all stations | Actions |

## Shared component needs
1. **Followed-stations store** (`lib/session` or `lib/follows`): `useFollowedStations()` → `{ codes, follow(code), unfollow(code), isFollowing(code) }`, seeded from `user.followedStationCodes`, saved in `localStorage` (`mlc-follows`, try/catch), synced across tabs. Used here, on the station page and on Profile.
2. `DocsLayout`: allow an aside slot without "On this page" items (the follow card), shown in the aside ≥1280 and after the article below. The existing `needHelp` prop can carry it if renamed to something neutral (`asideBlock`).
3. `LineRail` stop: support the Following chip placement (right of the text ≥768, below the subtitle <768) and highlighted match text in name/subtitle.
4. `lib/format`: list formatter ("A, B and C").

## Open questions
1. Guest variant of "Stations you follow" is not in Figma; copy above is a proposal for the content writer.
2. Search query not kept in the URL (decision above). Confirm.
3. No "Need help?" block on this page (Figma has none). Kept as designed.
