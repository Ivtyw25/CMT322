# Traffic announcements: UX spec
Route: `/traffic/announcements` (`routes.traffic.announcements`, deep link `routes.traffic.announcement(id)` = `#<id>`) · Figma: desktop 1:629, mobile 133:27022 (no dark frames; tokens swap)

Shell rules: `_shared.md`. Shared changes used here: tabs with counts, pagination (`_traffic-shared.md` section 1).

## Purpose and primary task
Find a specific road notice (or all notices for an area), see its dates and duration, and open the official notice or the map. Also the landing place of "Read announcement" and "View details" links, which jump to one row.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390; side padding 20. Tabs wrap to rows of two or three; filters stack. Card label column 96 px so values keep room. |
| 390–767 | Mobile frame: header band, tabs wrapped (All, Current / Upcoming, Past), area select full width, search full width, then one bordered box of cards (rows divided by 1 px `gray-200`), summary and pagination (left aligned count above centred pager). |
| 768–1279 | Header band as desktop. Tabs in one row; select (180) and search (flex) on the next row. Rows are **cards in a 2-column grid** (gap 16, each card its own border and radius `xl`), same card content as mobile. Pager row: count left, pager right. |
| 1280–1439 | Table at full width (container 1200): columns as Figma. Table needs about 1100 px, so it starts here, not at 1024. Filters in the tab row (Figma 1:643). |
| 1440+ | Desktop frame as designed. Content 1200 centred; at 1920 the band background stays full bleed. |

(At 1024 to 1279 the desktop header shows but the list is cards; the table would need columns narrower than the Figma widths. Decision.)

## Sections
### 1. Page header band (1:631)
`gray-50` full-bleed band, breadcrumb (Home, Traffic, Announcements), `h1` "Traffic announcements", lede Body/L `gray-600` max 720. No sidebar, no on-page nav (Figma has none). Content: `trafficCopy.announcements`.

### 2. Filters (1:643)
- **Tabs** All / Current / Upcoming / Past with counts (shared change 4): `role="tablist"`, automatic activation, ←/→, Home/End. All = every status, Current = `active`, Upcoming = `upcoming`, Past = `ended`. Counts respect the area and search filters (so 0 explains an empty tab). One shared `tabpanel` (the results region), `aria-labelledby` the selected tab. Selected: text `primary-700`, 2 px `primary-600` underline; unselected underline `gray-200`.
- **Area select**: native `select`, "All areas" + the five areas from `getAreas()` (labels as Home chips). Width 107 fits "All areas" in Figma; widen to the longest label (about 260) and truncate nothing.
- **Search**: "Search road or area", `type="search"`, 280 wide desktop, matches title, summary, location, road, area label (Home normaliser), filters live, Escape clears, clear button when filled.
- Any filter change resets the page to 1. Filters apply client side to all 19 records.

### 3. Results (1:671)
A real `<table>` with a caption (visually hidden: "Traffic announcements"), `thead` Status, Announcement, Location, Start, End, Duration, Official notice, and an unlabeled actions column (visually hidden header "Map"). One `<tr id="<announcement id>">` per record, `scroll-margin-top: 140px`.
- **Table (≥1280):** Figma column widths (104, 224, 170, 108, 108, 104, 128, 100). Status = tag (Active, Upcoming, Ended). Announcement = title Body/S Semibold + `summary` Body/XS `gray-600`, wraps (no truncation). Start and End dates via `lib/format`; End may read "Jul 2027". Row hover bg `gray-50`.
- **Cards (<1280):** `display` switches `tr` to a grid; `td`s become label/value pairs using `data-label` text from content (Location, Dates, Duration). The status tag is top left, title and summary under it, then pairs (Dates shows "12 Oct 2026 to Jul 2027"), then two actions side by side: "View on map", "View notice" with external icon. Because `display` overrides drop table semantics, the elements carry explicit `role="table"/"rowgroup"/"row"/"cell"/"columnheader"`, and the `thead` is visually hidden.
- **Actions:** "View notice" is an external link to the official notice (`noticeUrl`, `target="_blank"`, `rel="noopener noreferrer"`, `external-link` icon 14 px, visually hidden " (opens in new tab)"). "View on map" → `routes.traffic.mapFocus(id)`. Each has a visually hidden suffix with the title ("View notice: Lane closure on Jalan Sultan Azlan Shah"). `hit-area` below 768.
- **Row order:** `getAnnouncements()` order (active newest first, then upcoming soonest, then ended latest). No user sorting. Page size 6.

### 4. Summary and pagination (1:783)
"Showing 1 to 6 of 19 announcements" (`lib` string with numbers; "Showing 0 announcements" when empty). Pagination (shared change 3), `?page=n` links via `next/link` with `scroll={false}`. On page change: the table top scrolls into view 24 px under the sticky header (instant under reduced motion), focus moves to the summary text (`tabindex=-1`), and the live region says "Page 2 of 4. Showing 7 to 12 of 19 announcements." Invalid or out-of-range `page` clamps to the nearest valid page. Hidden when the result fits one page (summary stays).

## Deep link `#<id>`
Handled on load and on `hashchange`.
1. If the row is in the current filtered result on the current page: scroll to it and highlight.
2. Else: clear tab, area, search; compute the page that holds it; set `page`; keep the hash (`replace`); then scroll and highlight.
3. Unknown id: nothing scrolls; an info callout above the table, `role="status"`: "We could not find that announcement. Showing all announcements." (dismissible with `x`, 44 px). The URL hash is left alone.
Highlight: row bg `primary-50` and a 3 px `primary-600` left border (on cards: a full `primary-300` border) until the user changes a filter or page or clicks elsewhere in the table (not a timed fade, so users with slow reading are not rushed; Decision). Focus moves to the row (`tabindex=-1`, no ring) so keyboard continues from there and screen readers read the row. Scroll: smooth, instant under reduced motion, row top 140 px below the viewport top. If JS is off, the browser's own `#id` jump works because the server renders page 1 with all rows ids (rows from other pages are not in the HTML; acceptable).

## Interactive elements
| Element | Trigger | Result | States | Keyboard | Notes |
|---|---|---|---|---|---|
| Status tab | click, arrows | Set `status`, page 1 | default, hover, focus-visible, selected | ←/→, Home/End | Counts in name |
| Area select | change | Set `area`, page 1 | default, hover, focus, open | native | |
| Search | type | Filter, page 1; Escape clears | default, focus, filled | | 300 ms URL write |
| View notice | click | External notice, new tab | default, hover, focus-visible, visited not styled | Enter | |
| View on map | click | Map focused on item | default, hover, focus-visible | Enter | |
| Page link | click | Set `page` | default, hover, current, disabled | Tab, Enter | |
| Clear filters (empty state) | click | Reset filters | default, hover | Enter | |

## URL state
`status` (`current`, `upcoming`, `past`; All omitted), `area` (area id), `q`, `page` (2+). `router.replace`, `scroll: false`, read in a client leaf inside `<Suspense>`; the route stays static. Hash is preserved by every write.

## Hidden content inventory
- 19 announcements in the table (6 per page, 4 pages). Content writer: each needs a `noticeUrl` (open question 2).
- 5 area options plus "All areas"; four tab labels; column headers; card labels (Location, Dates, Duration); two action labels with title suffix function; empty-state text per cause (no match for search, no items in tab/area); not-found callout; summary string function; page-change announcement function; caption.

## Dynamic states
- **Empty:** table/cards replaced by one block inside the results box: `search-x` 24 px `gray-400`, "No announcements match", hint "Try another status or area, or clear the search.", Secondary button "Clear filters". Pager hidden. Tabs still show counts.
- **Loading:** static data; Suspense fallback = header band real, filters real but disabled looking skeleton bars, six skeleton rows (title bar, summary bar, tag pill) in the results box, pulse 1.2 s (static under reduced motion).
- **Error:** route `error.tsx`: "We could not load announcements.", Primary "Try again", Ghost "Contact us".
- **Long content:** titles and locations wrap; the table rows grow; no truncation. 100 items: 17 pages, pager shows first, last, current ±1 with "…".
- **No JS:** page 1 renders (All tab), tabs/filters/pager need JS except the pager links, which load `?page=n` (client reads it after hydration; acceptable).

## Motion
Tab underline colour 150 ms; row hover 150 ms; deep-link scroll smooth; no row animation when filtering. Reduced motion: instant scroll, no pulse.

## Accessibility
- Landmarks: `main` with `h1`; `role="search"` on the search field's wrapper only; tabs and select sit in a `div role="group" aria-label="Filter announcements"`. Results region `aria-live` none; a polite live region announces "{n} announcements" after filters (500 ms debounce).
- Heading order: h1, then none (table caption); cards have the title as `<strong>`, not headings (a list of 6 `h2`s would add noise).
- Table: `scope="col"`, status tag text carries meaning (not colour), the highlighted row also has a visually hidden "Linked announcement" prefix.
- Tap targets ≥ 44 on mobile; pager 36 visual with hit-area.
- Focus order: filters, results actions (row by row), summary, pager.

## Links and destinations
Breadcrumb: Home `routes.home`, Traffic `routes.traffic.overview`. View on map → `routes.traffic.mapFocus(id)`. View notice → external `noticeUrl`. Pager → `?page=n`. Notification bar "View details" → `routes.traffic.announcement(id)` (this deep link). Inbound deep links: popup, Home, station pages.

## Open questions
2. No official notice URL exists in the data. Figma shows "View notice" on every row. Needs `noticeUrl` (a real source) or the link is omitted.
13. Table starts at 1280, cards below (Figma only has 1440 and 390). Confirm.
14. Counts in the tabs follow the active area and search filters (Figma shows totals only).
