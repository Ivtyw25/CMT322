# Home: UX spec
Route: `/` (`routes.home`) · Figma: desktop 37:1025, mobile 133:6556, dark 121:4634 (desktop) and 134:11532 (mobile); states search-suggestions 49:1127 / 134:8874, menu-open 47:1249 / 134:8244 (shell state, see `_shared.md`)

Shell behaviour (sticky header, transparent-over-hero rule, notification bar over the hero, drawer, footer, focus ring, buttons, tags, filter chips, accordion, line rail, segmented control, motion tokens) is in [`_shared.md`](./_shared.md) (until foundations is merged: `C:\Users\Ivantham\mutiara-wt\foundations\docs\specs\_shared.md`) and its "Main agent decisions". This spec only adds what is specific to Home. Anything marked **Decision:** is not answered by Figma; the main agent confirms or overrides it in "Open questions".

## Purpose and primary task
Residents and commuters land here to answer one question fast: "Is anything happening on my road, my area or my station?" The hero search and the "Works in your area" chips are the two ways to get that answer; everything below is orientation (the line, how to use the site, safety, latest progress, help, FAQ).

## Layout across breakpoints

Breakpoints are Tailwind defaults. Content container `max-w-content` (1200) centred.

**Decision (side padding on Home):** Home follows the mobile frame's 32 px side padding from 390 px, not the generic 20 px: `px-5 min-[390px]:px-8 lg:px-10`. Reason: every section in M · 01 Home uses x = 32. Below 390 px it drops to 20 px so content fits at 320.

**Decision (section rhythm):** section padding top/bottom 40 px below 768, 64 px at 768–1023, 80 px at ≥1024 (Figma: 40 mobile, 80 desktop). Section backgrounds as in each Figma section frame (tokens only; they flip in dark mode).

| Width | Layout |
|---|---|
| 320–389 | As 390 with 20 px side padding. Hero title steps down to 36/44 (Poppins Bold) so "LRT Mutiara" fits on one line in 280 px. Search hint text (see Hero search) uses Body/S 14/20 and may wrap to three lines; the box grows. Try chips and area chips wrap. Hero CTAs stay on one row (264 px needed, 280 available). |
| 390–767 | Mobile frame M · 01 Home (133:6556) as designed: everything one column; hero left-aligned; area update cards stack their meta under the text; subscribe card under the list; line preview is the vertical line rail (no Route view / Map view toggle); guide cards, tips, progress cards, help columns and FAQ stack. |
| 768–1023 | Mobile header (shell rule). Hero: mobile layout (left-aligned, mobile type), content `max-w-[560px]`, hero min-height 640. Works: header row as desktop (heading left, "All announcements" right); area update cards use the desktop row layout (text left, 200 px meta column right); subscribe card full width below the list. Line preview: toggle appears; Route view = vertical line rail (max width 560), Map view = map 480 px tall. About: text then photo (full width, 3:2). Guide cards 2 columns. Tips 3 columns × 2 rows. Progress cards 3 columns. Help strip 3 columns with dividers. FAQ: intro block on top, accordion below, full width. |
| 1024–1279 | Desktop header. Hero: desktop layout (content column 640 px, right-aligned text, desktop type). Works: list + subscribe card side by side, subscribe card 320 px, gap 32. Line preview: Route view is still the vertical line rail (max width 560) because the 1152 px diagram does not fit without shrinking its 12 px labels below legibility; Map view 600 px tall. About: two columns 1fr / 1fr, gap 48, photo 3:2. Guide cards 4 columns (card padding 20). Tips 3 columns. Progress 3 columns. FAQ: intro 300 px + accordion (gap 48). |
| 1280–1439 | Desktop frame layout. Route view shows the logical diagram at full size (container is 1200; diagram 1152 + 24 padding each side). Tips 6 columns. Subscribe card 360. FAQ intro 340 + accordion, gap 80. |
| 1440+ | Desktop frame 37:1025 as designed. Content stays 1200 px centred; at 1920 the extra width is margin. Full-bleed: hero photo and scrims, section backgrounds, footer. Hero height stays 800 px at every desktop width (photo `object-cover`, centred). |

## Sections (top to bottom)

### 1. Hero, node 37:1026 (mobile 133:6557)
Content source: `homeCopy.hero` (title, tagline lines, search label/hint, try label, CTA labels), `getSearchIndex()` for suggestions, try chips from `homeCopy.hero.tryChips`.

- **Photo and scrims.** Photo `src/assets/images/` hero (Figma 37:1027), `next/image` with `priority`, `fill`, `sizes="100vw"`, `object-cover` centred, `alt=""` (decorative: the `h1` carries the meaning). Fallback background `static-navy`. Overlays in this order: `bg-hero-scrim` (whole hero), `bg-nav-scrim` (top 220 px). Both `aria-hidden`.
- **Under the header.** The hero starts at y = 0 behind the transparent header and the over-hero notification bar (shell spec, sections 2 and 8). Hero height: 800 px at ≥1024, min 640 px at 768–1023, 622 px below 768 (grows if content needs it).
- **Decision (no jump when the notice goes):** the hero's top padding is fixed at 148 px (≥1024) and 190 px (<1024), whether or not the notice bar is showing. Dismissing the notice removes the bar but the hero text does not move.
- **Content block.** ≥1024: a 640 px column at the right edge of the container, all items right-aligned (`items-end`, `text-right`), gap 14. <1024: full width (max 560 at ≥768), left-aligned, gap 14.
  - Title "LRT Mutiara Line", the page's only `h1`. Poppins Bold 60/72, −1.2 letter spacing (desktop); 44/50 (<1024); 36/44 (<390). Colour `static-white`. See Open question 1 (type tokens).
  - Tagline, two lines "Empowering Mobility" / "Enriching Communities": a `<p>` with a `<br>`-free two-span layout (each line a block span). Poppins Light 36/46 desktop, 22/30 <1024, colour `static-on-navy-200`.
  - Hero search (section 2 below).
  - Try row (section 3 below).
  - CTA row (pt 6, gap 12): "View traffic map" (Secondary button) and "Report an issue" (Ghost style on the photo: text **`static-white`**, not Figma's `white` token, which flips to near-black in dark mode).
- **Header contrast.** Covered by the shell (solid at scrollY ≥ 8, solid while a panel is open).

### 2. Hero search (combobox), node 37:1238; open state 49:1127 / 134:8874
A `<form role="search">` with accessible name "Check works near you" (content key), containing a combobox input and the Search button. Data: `getSearchIndex()` is called in the page (server) and the 51 entries are passed as a prop to the client search component. Search runs in the browser.

**Box.** `surface` background, radius `xl` (12), `shadow-hero-search`, padding 6 / 6 / 6 / 16, gap 10, width 560 (≥1024) or 100 % (<1024). Leading icon `map-pin` 20 px `gray-500`, `aria-hidden`. Search button: Primary, "Search", `type="submit"`.
- Rest height 52 desktop. Focus (`:focus-within`): 2 px `primary-600` ring drawn **inside** the box (inset box-shadow, combined with `shadow-hero-search`), so the box does not grow (Figma's focused frame is 56 px because it uses a border; **Decision:** inset ring, no layout shift).
- **Hint text. Decision:** the hint "Check works near you: road, area or station" is not the native `placeholder` (which cannot wrap) but a `<span aria-hidden>` laid over the input's text area, Body/M `gray-400`, `pointer-events: none`, wrapping to two lines below 768 as in M · 01 (box 60 px tall there). It hides as soon as the input has a value. The input's accessible name comes from a visually hidden `<label>` with the same words. The input keeps `placeholder=""`.
- Input: `type="text"`, `role="combobox"`, `aria-autocomplete="list"`, `aria-expanded`, `aria-controls="home-search-listbox"`, `aria-activedescendant` (id of the active option, or absent), `autocomplete="off"`, `autocapitalize="none"`, `spellcheck="false"`, `enterkeyhint="search"`, `maxlength="60"`, Body/M `gray-900`, caret `primary-600`.

**Matching.**
- Minimum 2 characters (after trimming). With 0 or 1 character the list is closed.
- **Decision (debounce):** matching is synchronous on every input event (51 local records, well under 1 ms), so the list never lags behind typing. Only the screen-reader announcement is debounced (500 ms after the last keystroke).
- Normalise both sides: lower case, strip diacritics (NFD), collapse spaces, treat "-" as a space ("psr a" matches "PSR-A").
- An entry matches when its `label` or its `detail` contains the query. Ranking inside each group: label starts with the query, then a word in the label starts with the query, then label contains it, then detail only; ties keep data order (stations are already in line order).
- Groups in fixed order **Stations, Roads, Areas**; a group with no matches is not rendered. **Decision:** at most 4 options per group (12 total), so the list fits above a phone keyboard.
- Highlight: the first occurrence of the query in the **label only** is wrapped in `<mark>` styled `font-bold`, no background, inherit colour (Figma bolds "Buk" in the label, not in the detail). Matches that are only in the detail show the label without bold.

**List panel** (49:1455): `<div>` absolutely positioned 8 px under the box, same width as the box, `surface`, border `gray-200`, radius `xl`, `shadow-panel`-style shadow from Figma (use the closest existing shadow token; Open question 6), padding-block 8, z-index above page sections (it overflows the hero into "Works in your area" on mobile) and below the sticky header. Max height: `min(400px, visible viewport height − box bottom − 16px)`, recomputed on `visualViewport` resize; scrolls inside with `overscroll-behavior: contain`.
- Group header: Body/XS Semibold `gray-500`, padding 8 × 16, element with an `id`; the group is `role="group"` with `aria-labelledby` that id.
- Option (`role="option"`, `id`, `aria-selected` on the active one): padding 10 × 16, gap 12; icon tile 36 × 36 radius `lg` `gray-100` with an 18 px icon (station `train-front`, road: the road glyph from Figma node 49:1474, area `map-pin`; all `aria-hidden`); label Body/S `gray-900` (wraps); detail Body/XS `gray-500` (wraps, as in 134:9428). Minimum row height 60.
- Active option: bg `primary-50`, 3 px left border `primary-600` (padding-left reduced by 3 so text does not move), icon tile `surface`, icon `primary-700`.
- **Decision (first option active):** when the list opens or the results change, the first option becomes active (as Figma shows), so Enter or Search goes straight to the best match.
- Mouse: hovering an option makes it active. Clicking selects it. `mousedown` on the panel calls `preventDefault` so the input keeps focus.

**Keyboard (ARIA 1.2 combobox, list autocomplete).**
| Key | In the input |
|---|---|
| typing | Opens/updates the list at ≥2 characters; first option active |
| Arrow Down | List closed and ≥2 characters: open it, first option active. Open: next option, crossing groups; on the last option, stays there (no wrap) |
| Arrow Up | Previous option; on the first option, stays there |
| Alt + Arrow Down / Alt + Arrow Up | Open / close the list without moving |
| Enter | List open with an active option: select it. Otherwise submit (see Search button) |
| Escape | List open: close it, keep the text. List closed: clear the text |
| Tab / Shift+Tab | Close the list, move focus normally (Search button next). Does not select |
| Home / End, Left / Right | Move the caret in the input (default) |
The active option scrolls into view inside the panel (`block: "nearest"`).

**Search button / form submit.**
- List open: select the active option (the first, unless the user moved).
- ≥2 characters and no results: keep the no-results panel open, focus stays in the input.
- 0–1 characters: focus moves to the input; nothing else happens.

**What selecting does** (all paths from `config/routes.ts`; the input keeps the chosen label as its value, the list closes):
| Kind | Result |
|---|---|
| Station | `router.push(routes.project.station(entry.stationCode))` |
| Road | `router.push(routes.traffic.routeAt(entry.stationCode))`: Route view opened at the road's nearest station, where the road's closures are listed |
| Area | Stays on Home: sets the "Works in your area" filter to `entry.areaId` (URL `?area=<id>`, see section 4), scrolls the section into view (smooth; instant with reduced motion) and moves focus to its `h2` (`tabindex="-1"`, no visible ring). The polite region announces the result count (section 4). |

**No results** (≥2 characters, nothing matches): the panel shows one non-selectable block (not an option; `aria-expanded` stays true, no `aria-activedescendant`): `search-x` 20 px `gray-400`, title `uiCopy.empty.noResults(query)` Body/S Semibold `gray-900` (query shown as typed), hint `uiCopy.empty.noResultsHint` Body/XS `gray-500`, then two Ghost links "Browse all 22 stations" → `routes.project.stations` and "Open the traffic map" → `routes.traffic.map`. These links are reachable with Tab (the panel stays open while focus is inside it; it closes when focus leaves the box and panel).

**Closing.** The list closes on: Escape, Tab out, selection, a click or tap outside the box and panel, input cleared below 2 characters, route change. It re-opens on focus if the input already holds ≥2 characters.

**Phone keyboard. Decision:** below 1024 px, when the input receives focus, scroll the page so the box's top sits 12 px under the sticky mobile header (61 px), smooth (instant with reduced motion). This leaves room for the list above the on-screen keyboard. Do not scroll if the box is already within that position.

**Live region** (own visually hidden `aria-live="polite"` element inside the search component, debounced 500 ms):
- results: `homeCopy.search.resultCount(n)` e.g. "3 suggestions. Use the up and down arrows to choose one."
- none: "No results for "{query}"."
- Cleared or closed: no message.

### 3. Try chips, node 37:1246
"Try" (Body/S `static-white`, not focusable) + four chips. Chip: `static-glass` bg, 1 px white 35 % border (use `static-white-30`, the closest token; Open question 6), radius full, padding 4 × 12, Body/S `static-white`. Hover: bg white 24 % (one step stronger; token needed, else `static-glass` + underline). Focus-visible: `static-white` ring. `hit-area` below 768 (30 → 44).

**Decision (chips are links, one tap to the answer):** each chip is a `next/link` to a fixed destination, defined in content as `{ label, target }`:
| Chip | Destination |
|---|---|
| Bayan Lepas | Home filtered to `bayan-lepas` (`?area=bayan-lepas#works`) |
| Bukit Jambul | Home filtered to `bukit-jambul` (`?area=bukit-jambul#works`) |
| Jalan Universiti | `routes.project.station('S13')` |
| KOMTAR | `routes.project.station('S20')` |
Reason: commuters at the roadside should not have to type or choose again; the chips also work without JavaScript. They do not fill the search box.

Row wraps (Figma mobile wraps to two rows). Desktop: right-aligned (`justify-end`); <1024 left-aligned.

### 4. Works in your area, node 37:1110 (mobile 133:6584)
`<section id="works" aria-labelledby="works-heading">`. Source: `homeCopy.works`, `getAreas()`, `getAnnouncements()` (filtered below), `subscribeToAlerts()` for the card.

**Header.** Accent bar, `h2` "Works in your area" (`type-heading-xs lg:type-heading-s`, Figma mobile 24/32), intro Body/M `gray-600`. "All announcements" Secondary button → `routes.traffic.announcements`: right of the header at ≥768, full width under the intro below 768 (133:6590).

**Area chips** (37:1419): shared filter chips, single-select (`aria-pressed`, one pressed at a time), inside `<div role="group" aria-label="Choose an area">` (content key). Chips: "All areas" (copy) then `getAreas()` labels in line order (Bayan Lepas and airport, Bukit Jambul to Sungai Nibong, Gelugor and USM, Jelutong to George Town, Butterworth). Chip padding 8 × 16, Body/S Medium; unpressed `surface`, border `gray-300`, text `gray-700`; hover border `gray-400`; pressed `gray-900` bg and border, text `surface`. Wrap on all widths (as both frames). `hit-area` below 768 (38 → 44).

**Selection and URL state. Decision:**
- Default: **All areas** for everyone (guest and signed in). Reason: a guest has no area; a signed-in user's `homeArea` is free text, not an `AreaId`; and personalising after hydration would make the list flash.
- The selection lives in the URL: `?area=<AreaId>`; "All areas" removes the parameter. Choosing a chip calls `router.replace(url, { scroll: false })` (no history entry per chip, the back button leaves Home). The page reads `searchParams.area` on the server, so a shared link or reload renders the right list with no flash.
- An unknown `area` value is treated as All areas (the URL is left as is).
- The Figma frames show "Bukit Jambul to Sungai Nibong" selected: that state is `/?area=bukit-jambul`. The visual test uses that URL (record it in `tests/visual/states.ts`).
- Filtering happens in the browser on the list passed from the server (all active and upcoming announcements); no loading state.

**Which items, which order. Decision:** announcements with status `active` or `upcoming` whose `areaIds` include the chosen area (all of them for All areas), sorted by `startDate` ascending (earliest first), at most 3. This reproduces Figma for Bukit Jambul (12 Oct closure, 26 Oct lane shift, 3 Nov night works). Ended items never show.

**Area update card list** (37:1433): one `surface` card, border `gray-200`, radius `2xl` (16), items separated by 1 px `gray-200`. `<ul>`; each item `<li>`:
- Text column: Tag (if `status === 'upcoming'` the **Upcoming** tag, otherwise the type tag Closure / Construction / Hazard), title `h3` Body/M Semibold `gray-900`, one-line summary Body/S `gray-600` (`announcement.summary`).
- Meta column (200 px at ≥768; under the text below 768, 20 px gap): date line (`calendar` 16 px `gray-500` + Body/S `gray-700`) and hours line (`clock` 16 px + Body/S `gray-700`), each with a visually hidden label ("Dates:", "Daily hours:") so they read as label/value pairs; then "View on map" Ghost link.
  - Dates: `formatDateRange(start, end)`: "12 Oct 2026 to Jul 2027" (month-only end), "26 Oct to 22 Nov 2026" (same year: year once), "3 Nov to 10 Nov 2026" (month repeated even when the same, as Figma). Helper in `src/lib/format/`.
  - Hours: `dailyHours` null → "All day"; otherwise "7 am to 7 pm", "10 pm to 6 am" (12-hour, as Figma).
- The card item itself is not a link (Figma has one action per item). "View on map" accessible name: "View on map: {title}" via visually hidden text (content function).
- Padding 20 × 24 (≥768), 20 × 16 (<768).

**Empty result** (e.g. Butterworth today): the card shows one block instead of the list, padding 32 × 24, centred on ≥768, left on mobile: `calendar-check` 24 px `gray-400`, title Body/M Semibold `gray-900` "No road works announced for {area}" (All areas: "No road works announced on the line right now"), text Body/S `gray-600` "We'll list closures and night works here as soon as they're announced. Sign up below to hear first." (below 1024) / "…Sign up on the right to hear first." (≥1024) (content: two variants). The subscribe card stays.

**Change announcement.** After a chip change (and after an area chosen in search), the section's own polite live region says `homeCopy.works.resultCount(n, areaLabel)`: "3 road changes in Bukit Jambul to Sungai Nibong" / "No road changes in Butterworth". Focus stays on the chip.

**Subscribe card** (37:1494): `primary-50` bg, border `primary-200`, radius `2xl`, padding 24 (16 sides below 768: Figma 17), gap 14. `bell` 20 px `primary-700` + title `h3` "Get updates for this area" (All areas: "Get updates for the whole line"), Body/M Semibold. Text Body/S `gray-700`: `homeCopy.works.subscribe.text(areaLabel)` ("We email you when a new closure or night work is announced for Bukit Jambul to Sungai Nibong."; All areas variant: "…announced anywhere on the line."). Form: email field (shared form field, visually hidden label "Email address", placeholder "Email address", `type="email"`, `autocomplete="email"`), "Get updates" Primary full width, footnote Body/XS `gray-500` "You can unsubscribe at any time."
- Signed in: email pre-filled with the user's email (editable), as in the footer.
- Validation (on submit, then live): empty → `uiCopy.form.errors.emailRequired`; bad format → `emailInvalid`. Error style: shared field error (danger tokens; this is not the navy footer). Focus to the field on error.
- Sending: `subscribeToAlerts(email, areaId | null)`; button loading "Signing you up…" (shared loading button), field disabled. The area is captured at submit time; changing chips while sending does not change it.
- Success: the form is replaced (card keeps its title) by a `role="status"` block: `circle-check` 20 px `success-600` + Body/S `gray-800` "You're signed up. We'll email {email} when road changes are announced for {area}." ({area} = "the whole line" for All areas). Focus moves to it (`tabindex="-1"`). **Decision:** success is remembered per area for this page view: switching to another chip shows the form again for that area; switching back shows the success message.
- Error (mock rejects `@fail.test`): message under the button, `circle-alert` 16 px + Body/S `danger-700`, "We couldn't sign you up just now. Check your connection and try again."; values kept; focus to the button.

### 5. The Mutiara Line in 2031, node 37:1043 (component 28:968, mobile 133:6665)
Source: `homeCopy.line` (heading, intro, captions, legend, toggle labels), `getStations()` (codes, names, subtitles, provisional flags, order).

**Header.** Accent bar, `h2`, intro Body/M `gray-600` (max 600 px).

**Below 768: line rail only** (133:7316), as designed. Shared line rail, all 22 stops in line order from S31 to A01; each row is a link to `routes.project.station(code)`: stop 24 px, code chip 44 × 24, name Body/M Semibold `gray-900`, subtitle Body/S `gray-600` (`station.subtitle`; "Provisional name" when `isProvisionalName` and there is no subtitle), `chevron-right` 18 px `gray-400`. Row padding 12, radius 10 (`lg`), gap 16. Row hover/pressed bg `gray-50`; focus-visible ring inside the row. No toggle and no map on phones (Figma has none; the full Traffic map is one tap away in the menu).

**768 and up: top row + view.** Top row: caption Body/S `gray-600` on the left ("Station order, not to scale" in Route view; "Where the line runs on Penang Island and the mainland" in Map view), segmented control on the right (shared segmented control: native radio group, legend visually hidden "Line view"; options "Route view" with `route` 16 px, "Map view" with `map` 16 px). Default Route view. **Decision:** the choice is local state, not in the URL and not saved (Home already uses `?area=`; the view is a one-off look). The caption is the `<figcaption>` of the view below.
- Route view, 768–1279: the same line rail as mobile in a `surface` card (border `gray-200`, radius `2xl`, padding 12), max width 560.
- Route view, ≥1280: the logical diagram (48:1031 inside a `surface` card, border `gray-200`, radius `2xl`, padding 24), drawn at its Figma size 1152 × 614. Build the line as one inline SVG (exported from Figma 51:2203) and place labels with absolute positions from Figma. Every station (circle + code + name) is **one link** to its station page, with accessible name "{code} {name}" (+ ", provisional name" / ", interchange between the two routes" for S19), DOM order = line order S31 → A01 (one tab stop each, 22 in total). Hover: circle fill `primary-50`, name `primary-700` + underline. Focus-visible: ring around circle and label together. The Macallum label (Heading/2XS `primary-800`) belongs to the S19 link. "Nearby places" texts, "Depot" labels and the legend are plain text (not focusable). The whole diagram is a `<figure>`; the links sit in an `<ol>` visually positioned, so a screen reader hears an ordered list of 22 stations.
- Map view (Figma 28:881, rebuilt on Leaflet + OSM per CLAUDE.md, no Google): container 600 px tall at ≥1024, 480 at 768–1023, border `gray-200`, radius `2xl`, `isolation: isolate`. Loaded client-only and **only when Map view is first chosen** (dynamic import). Content: OSM light tiles (both themes); the line as a `primary-600` polyline 5 px; a circle marker per station (hollow, `primary-600` stroke; S19 and the two ends larger, as Figma); permanent labels (white chip, Body/XS Semibold `gray-900`, `shadow-control`) for the seven Figma stations S31, S20, S19, S13, S08, S03, A01; other stations show their "{code} {name}" label as a tooltip on hover or keyboard focus. Clicking or pressing Enter on a marker opens a small popup with the station name and a link "Open {name} station page" → `routes.project.station(code)`. Zoom buttons top right (Figma position), styled with tokens. **Decision:** the Figma "Map / Satellite" switch is dropped (OSM has no satellite layer). Bottom-right caption: "Illustrative alignment." followed by the OSM attribution "© OpenStreetMap contributors" (external link, new tab, "(opens in new tab)" label). Initial view: fit the line's bounds with 24 px padding. Scroll-wheel zoom is off until the map is clicked or focused (so the page keeps scrolling); one-finger drag is off on touch devices (zoom buttons and pinch still work). Data: see Open question 2 (coordinates).
- Map loading: the container shows a `gray-100` skeleton with `loader-circle` 20 px and "Loading map…" Body/S `gray-600` (`role="status"`). Map error (Leaflet import fails or no tile loads within 10 s): `map-off` 24 px `gray-400`, "The map didn't load." + "Check your connection, or use Route view." Body/S `gray-600`, and a Secondary "Try again" button that retries. The toggle keeps working.
- Switching views: the view swaps in place; focus stays on the selected radio; no scroll jump (the container reserves the larger of the two heights while the map loads).

### 6. About the Mutiara Line, node 37:1037 (mobile 133:6671)
Source: `homeCopy.about`. Accent bar, `h2`, paragraph Body/L `gray-700` (desktop; Body/M mobile), "Read more about the line" Primary button → `routes.project.about`. Photo 37:1042 with `next/image`, radius `2xl`, aspect 3:2 (560 × 374 desktop, 326 × 218 mobile), `object-cover`, `sizes="(min-width: 1024px) 560px, 100vw"`, meaningful `alt` from content (it shows a George Town street with lanterns). Desktop: text column 568 left, photo right, text vertically centred to the photo (Figma: text starts 36 px lower than the photo).

### 7. How to use this platform, node 37:1048 (mobile 133:6678)
Source: `homeCopy.guide` (8 cards: icon, title, text). Header: accent bar, `h2`, intro. Cards (shared link card): `surface`, border `gray-200`, radius `2xl`, padding 24 (16/17 mobile), icon tile 44 × 44 `primary-50` with 22 px `primary-700` icon (`aria-hidden`), title `h3` Body/M Semibold, text Body/S `gray-600`. **Decision:** each card is a link card (the title is the link, stretched over the card); Figma shows no other action, and dead-end cards would frustrate. Destinations in "Links and destinations". Hover: border `gray-300`, title `primary-700`. Focus-visible: ring around the card. Card heights equal within a row (`grid` + `h-full`). Figma's two rows of four are one grid of 8 at ≥1024.

### 8. Stay safe around worksites, node 38:1237 (mobile 133:6741)
Source: `homeCopy.safety` (6 tips: icon, title, text). Not interactive. `<ul>`; each tip: icon tile 48 × 48 (as Figma, `primary-50` / `primary-700`), title `h3` Body/M Semibold, text Body/S `gray-600`. Columns: 1 (<768), 3 (768–1279), 6 (≥1280), gap 32.

### 9. Latest construction progress, node 37:1159 (mobile 133:6789)
Source: `getConstructionUpdates()` newest first, first 3; header copy in `homeCopy.progress`. Header: accent bar, `h2`, intro, "See all updates" Secondary → `routes.project.construction` (right at ≥768, under the intro below 768, auto width as Figma 133:6795).
Card (link card): `ImagePlaceholder` 200 px tall (full card width, top radius), date Body/XS `gray-500` (`formatDate`, "22 Oct 2026", in a `<time dateTime>`), title `h3` Body/M Semibold, summary Body/S `gray-600`. **Decision:** each card links to `routes.project.construction` (anchor `#<update-id>` once the Construction spec defines anchors; Open question 4). Placeholder `aria-hidden` (the card text describes it). Columns: 1 (<768), 3 (≥768), gap 24.
Empty (no updates): the three cards are replaced by Body/M `gray-600` "No construction updates yet." The "See all updates" button stays.

### 10. Help strip, node 38:1284 (mobile 133:6827)
Source: `homeCopy.help`, careline from `getSiteInfo()`. `gray-50` band. A visually hidden `h2` "Help and contacts" (content key) heads the section; each column title is an `h3` (Heading/2XS).
1. "Something blocking your way?" (`triangle-alert` 24 `primary-600`), text, "Report an issue" Primary → `routes.reportTrack.report`; "Track a ticket" Secondary → `routes.reportTrack.track`. Buttons wrap below 360 px.
2. "Is your property near the works?" (`house`), text, "Read about property surveys" Ghost → FAQ item `condition-survey` (Open question 3).
3. Careline (`phone`): the title "MRTCareline 1800-88-6782" is a link `siteInfo.careline.tel` styled as the heading (`gray-900`, hover underline, focus ring), accessible name "Call MRTCareline 1800-88-6782" (content). Text below. **Decision:** Figma's empty 100 × 100 frame (38:1312) is a leftover spacer; do not render it.
- ≥768: three equal columns, 1 px `gray-200` vertical dividers, 32 px inner padding (first column no left padding).
- **Decision (<768):** columns stack full width with no side indent; between columns a 1 px `gray-200` top border and 24 px padding-top. Reason: the M · 01 frame keeps the desktop right borders and 16 px indents, which read as a layout error on a phone.

### 11. Common questions, node 37:1203 (mobile 133:6850)
Source: `getMostAskedFaq()` (5 items in rank order; the question and `summary` are shown); header copy `homeCopy.faq`. Left: accent bar, `h2`, intro, "See all FAQs" Secondary → `routes.project.faq`. Right: shared accordion, items separated by 1 px `gray-200`, question Body/M Semibold `gray-900` (wraps; chevron top-aligned), answer Body/M `gray-600` max 600 px. **Decision:** the first item is open on load (as Figma); others closed; several can be open. Item ids prefixed `home-faq-` so they never clash with FAQ page anchors. No deep links on Home.
Empty (no items): the section is not rendered.

### 12. Footer
Shell footer, unchanged.

## Interactive elements

| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Hero search input | type / focus | Opens grouped suggestions at ≥2 chars | default (hint visible), hover (none), focus (inset ring), filled, open, no-results | ↓ ↑, Alt+↓/↑, Enter, Esc (close, then clear), Tab | ARIA 1.2 combobox |
| Suggestion option | hover / click / Enter | Select (station, road, area action) | default, active (`primary-50` + left bar), hover = active | ↑/↓ from the input | `role="option"`, not focusable itself |
| No-results links (2) | click | Stations / Traffic map | Ghost states | Tab | Inside the panel |
| Search button | click / Enter | Select the active option; see submit rules | Primary states | Enter/Space | `type="submit"` |
| Try chips (4) | click | Navigate (area filter or station page) | default, hover, focus-visible (`static-white` ring) | Enter | Links; `hit-area` <768 |
| View traffic map | click | → traffic map | Secondary states | Enter | On photo |
| Report an issue (hero, Ghost) | click | → report (guests → login) | default `static-white`, hover underline, focus-visible `static-white` ring | Enter | Not Figma's flipping `white` token |
| All announcements | click | → announcements | Secondary | Enter | Full width <768 |
| Area chip (6) | click | Filter list, update URL, update card text | unpressed, hover, focus-visible, pressed | Tab between chips, Enter/Space | `aria-pressed`; `hit-area` <768 |
| View on map (per item) | click | → traffic map | Ghost | Enter | Name includes the item title; `hit-area` <768 |
| Subscribe email | type | Value; clears error on valid input | default, hover, focus, filled, error, disabled (sending) | — | Pre-filled when signed in |
| Get updates | click / Enter | Validate, send, success or error | Primary, loading ("Signing you up…"), disabled during send | Enter | |
| Line view toggle (≥768) | click / arrows | Swap Route view / Map view | unselected, hover, selected, focus-visible | ←/→ move and select | Native radios |
| Station link (rail row / diagram stop) | click | → station page | default, hover, focus-visible | Enter | 22 per view |
| Map marker | click / Enter | Opens popup with station link | default, hover/focus (tooltip), open | Tab to marker, Enter, Esc closes popup | Leaflet keyboard support on |
| Map zoom +/− | click | Zoom | default, hover, focus-visible, disabled at min/max zoom | Enter/Space; +/− keys when the map has focus | Labels "Zoom in", "Zoom out" |
| Map "Try again" | click | Retry loading | Secondary, loading | Enter | Error state only |
| Read more about the line | click | → about | Primary | Enter | |
| Guide card (8) | click | → destination | default, hover, focus-visible | Enter | Link card |
| Progress card (3) | click | → construction progress | default, hover, focus-visible | Enter | Link card |
| See all updates | click | → construction | Secondary | Enter | |
| Help: Report an issue / Track a ticket | click | → report / track | Primary / Secondary | Enter | |
| Read about property surveys | click | → FAQ item | Ghost | Enter | |
| Careline title | click | Phone call | default, hover underline, focus-visible | Enter | `tel:` (not external) |
| See all FAQs | click | → FAQ | Secondary | Enter | |
| FAQ accordion header (5) | click | Expand/collapse | closed, open, hover, focus-visible | Enter/Space | Shared accordion |

## Hidden content inventory
All copy in `src/content/home.ts` unless stated; records in `src/data/mock`.

| Item | How many / kind |
|---|---|
| Metadata | Home `description` (title uses the site default, see Open question 7) |
| Hero | Title; tagline (2 lines); search form accessible name "Check works near you"; input label + hint (same words as Figma); "Search"; "Try"; 4 try chips (label + target); CTA labels |
| Search groups | 3 group headings: Stations, Roads, Areas |
| Search live messages | `resultCount(n)` (1 and many: "1 suggestion…", "{n} suggestions. Use the up and down arrows to choose one."), no-results message (reuse `uiCopy.empty.noResults` / `noResultsHint`) |
| Search no-results links | "Browse all 22 stations", "Open the traffic map" |
| Search index | Already 51 entries (22 stations, 17 roads, 12 areas). Keep the "buk" rule: exactly one station, one road and one area contain "buk". Every road and area entry needs `stationCode` and `areaId` (used by selection). |
| Works header | Heading, intro, "All announcements" |
| Area chips | Group label "Choose an area"; "All areas" (areas themselves come from `getAreas()`) |
| Works list | Visually hidden "Dates:" and "Daily hours:"; "All day"; "View on map" + sr suffix function `viewOnMapLabel(title)`; `resultCount(n, area)` (0, 1, many) |
| Works empty | Title for one area and for All areas; text in two variants (below / on the right) |
| Announcement records | Active or upcoming items for every area except one (keep **Butterworth** with none, to show the empty state). Bukit Jambul must keep the three Figma items as its first three by start date (12 Oct, 26 Oct, 3 Nov). Summaries should match Figma: "One lane each way for viaduct works." (current mock: "One lane closed in each direction for viaduct works."), "Traffic shifts to the inner lane near the station site." |
| Subscribe card | Title (area / whole line), text function (area / whole line), field label and placeholder, button, loading, footnote, success function, error text; email errors reuse `uiCopy.form.errors` |
| Line preview | Heading, intro, 2 captions (route / map), toggle legend "Line view", 2 option labels, legend (4 items), "Depot", nearby place texts (8 groups as Figma), "(provisional)", S19 interchange suffix, "Provisional name", map: "Illustrative alignment.", attribution text, "Loading map…", error title + text, "Try again", "Zoom in", "Zoom out", popup link function `openStationPage(name)`, map region label "Map of the Mutiara Line" |
| About | Heading, paragraph, button, photo alt |
| Guide | Heading, intro, 8 cards × (title, text, icon name, destination key) |
| Safety | Heading, intro, 6 tips × (title, text, icon name) |
| Progress | Heading, intro, "See all updates", empty text. Records: the 3 newest construction updates should match Figma titles and summaries ("Pier caps completed along Jalan Sultan Azlan Shah", "Utility relocation at Bayan Lepas FIZ", "Piling starts at George Town station site"); the mock currently has slightly different titles for the second and third |
| Help | Visually hidden `h2`; 3 titles, 3 texts, 3 link/button labels; careline accessible name "Call MRTCareline 1800-88-6782" |
| FAQ | Heading, intro, "See all FAQs". Records: the 5 most-asked items already exist (ranks 1–5 match Figma order); each `summary` is the visible answer |

## Dynamic states

- **Loading.** Home is server-rendered from mock data; no skeletons for sections. Client-only loading states: Map view (skeleton, section 5) and the subscribe card's sending state. Search has no loading state (local data).
- **Empty.** Area filter with no items (section 4); no construction updates (section 9); no FAQ items (section hidden); no search matches (section 2); no site notice (shell: no bar; hero text does not move).
- **Error.** Subscribe failure (section 4). Map failure (section 5). **Decision:** if a server data call for a section throws, that section renders its header plus Body/M `gray-600` "We couldn't load this section. Refresh the page to try again." instead of failing the whole page (one small error boundary component wrapping each data section); the mock never throws, so this is not tested.
- **Success.** Subscribe (section 4).
- **Signed out vs signed in.** Only differences on Home: the subscribe email is pre-filled; "Report an issue" (hero, help strip, guide card) takes guests to Log in first (shell protected-route rule). Area default and everything else are identical.
- **Long content.**
  - Announcement titles wrap (no truncation: safety information).
  - Meta lines never wrap inside the 200 px column at ≥768 (the longest Figma value is 159 px); below 768 they may wrap.
  - Search labels and details wrap.
  - Area labels in chips stay on one line (the longest, 239 px, fits 280 px at 320). A longer future label wraps inside the chip.
  - Station names in the rail wrap with the chevron centred. The diagram's labels are fixed-position, so a renamed station must still fit the Figma label width (98–109 px). Content writer: keep diagram names to two lines.
  - Search query of 60 characters: the input scrolls horizontally inside itself.
- **No JavaScript.** The server renders the Works list for `?area=`, so the Try chips (links) still filter it. Search, the area chips (buttons), the view toggle, the subscribe form and the accordion need JS; the first FAQ answer is visible because it is open by default; the line rail and diagram links work. Acceptable for this build.
- **Reduced data / slow connection.** The hero photo is the LCP image (`priority`); Leaflet and tiles load only if Map view is chosen.

## Motion
Tokens from the shell (`--duration-fast|base|slow`, `ease-enter`, `ease-exit`). Animate only opacity, transform, colours and `grid-template-rows`.

| What | Enter | Exit |
|---|---|---|
| Suggestions panel | opacity 0→1 + translateY(−4 px→0), 150 ms `ease-enter` | opacity, 100 ms `ease-exit` |
| Active option change | instant (no transition), so arrow keys feel immediate | — |
| Results list change while typing | instant | — |
| Area filter: list content | opacity 0→1, 150 ms (new content fades in; no height animation) | instant |
| Subscribe form → success | opacity 0→1, 150 ms | — |
| Line view swap | opacity 0→1, 150 ms | instant |
| Map skeleton | static (no pulse) | — |
| Scroll to Works (area chosen in search, Try chips) and phone-keyboard scroll | `scroll-behavior: smooth` | — |
| Card, chip, button hover | colours 150 ms | colours 150 ms |
| Accordion | shared (rows 200 ms) | shared |

`prefers-reduced-motion: reduce`: no movement. Panel and views appear instantly (opacity only, or nothing); scrolling jumps; spinners stand still (the "…" label carries the state); Leaflet zoom animation off (`zoomAnimation: false`, `fadeAnimation: false`, `markerZoomAnimation: false`).

## Accessibility

- **Landmarks.** Shell landmarks, plus `form role="search"` (named) in the hero. Each section is a `<section aria-labelledby>` pointing at its `h2`.
- **Headings.** `h1` "LRT Mutiara Line" → `h2` per section: Works in your area, The Mutiara Line in 2031, About the Mutiara Line, How to use this platform, Stay safe around worksites, Latest construction progress, Help and contacts (visually hidden), Common questions → `h3` for update titles, the subscribe card title, guide cards, tips, progress cards, help columns, accordion questions (inside the shared accordion's `h3` buttons).
- **Focus order (desktop).** Shell (skip link, header, notice) → search input → Search → Try chips (4) → View traffic map → Report an issue → All announcements → area chips (6) → View on map links (in list order) → subscribe email → Get updates → line view toggle → station links (22, line order) or map → Read more about the line → guide cards (8) → See all updates → progress cards (3) → Report an issue → Track a ticket → Read about property surveys → careline → See all FAQs → accordion headers (5) → footer. Mobile is the same minus the toggle; "All announcements" and "See all updates" come after their intros (they already do in DOM).
- **Focus management.** Search keeps focus in the input throughout; selecting an area moves focus to the Works `h2`; subscribe success moves focus to the success message, error to the field or button; dismissing the notice is the shell's rule (focus to `main`).
- **Live regions.** Search (debounced 500 ms), Works result count, subscribe result (`role="status"`), map loading (`role="status"`). No other live announcements.
- **Combobox details.** `aria-activedescendant` changes as the active option moves; `aria-selected="true"` only on the active option; group labels via `role="group"` + `aria-labelledby`; the `<mark>` bold is not announced separately.
- **Labels for icon-only and ambiguous controls.** Search input label (visually hidden); "View on map: {title}"; careline "Call MRTCareline 1800-88-6782"; map zoom "Zoom in"/"Zoom out"; map markers "{code} {name}"; station links "{code} {name}" with provisional and interchange suffixes. Decorative icons `aria-hidden`.
- **Colour is not the only signal.** Pressed chip also has `aria-pressed` and stronger contrast; tags always carry text; the active suggestion has a left bar as well as a tint.
- **Contrast.** Hero text uses `static-*` tokens on the scrims. The hero scrim is a left-to-right gradient that is lightest on the left, where the mobile layout puts its text; the tester checks 4.5:1 for the tagline (`static-on-navy-200`) and the Try chips on the M · 01 crop. If it fails, see Open question 5.
- **Touch targets below 768.** ≥44 × 44: Try chips (30) and area chips (38) get `hit-area`; "View on map" (40) and Ghost links get `hit-area`; rail rows are 48+; suggestion rows 60+; accordion headers 64+.
- **Map.** The map container is `role="region"` with label "Map of the Mutiara Line"; it does not trap focus or page scroll; Route view gives the same 22 stations as an accessible list.

## Links and destinations

| Element | Destination |
|---|---|
| Search: station option | `routes.project.station(stationCode)` |
| Search: road option | `routes.traffic.routeAt(stationCode)` |
| Search: area option | Home Works section filtered to `areaId` (in-page action; URL `?area=<id>`) |
| Search no-results: Browse all 22 stations | `routes.project.stations` |
| Search no-results: Open the traffic map | `routes.traffic.map` |
| Search button | Action: select the active option |
| Try: Bayan Lepas / Bukit Jambul | Home `?area=bayan-lepas#works` / `?area=bukit-jambul#works` (helper, Open question 3) |
| Try: Jalan Universiti / KOMTAR | `routes.project.station('S13')` / `routes.project.station('S20')` |
| View traffic map (hero) | `routes.traffic.map` |
| Report an issue (hero, help strip) | `routes.reportTrack.report` |
| All announcements | `routes.traffic.announcements` |
| Area chips | Action: filter (URL `?area=`) |
| View on map (each update) | `routes.traffic.map` (focus on the item once a helper exists, Open question 3) |
| Get updates | Action: `subscribeToAlerts` |
| Line view toggle | Action: swap view |
| Station links (rail, diagram, map popup) | `routes.project.station(code)` |
| OSM attribution | `https://www.openstreetmap.org/copyright` (external, new tab) |
| Read more about the line | `routes.project.about` |
| Guide: Learn about the line | `routes.project.about` |
| Guide: Follow construction progress | `routes.project.construction` |
| Guide: Check roads on the traffic map | `routes.traffic.map` |
| Guide: Plan ahead with announcements | `routes.traffic.announcements` |
| Guide: Report an issue | `routes.reportTrack.report` |
| Guide: Get a ticket ID | `routes.reportTrack.overview` |
| Guide: Track your ticket | `routes.reportTrack.track` |
| Guide: Find quick answers | `routes.project.faq` |
| See all updates, progress cards | `routes.project.construction` |
| Track a ticket | `routes.reportTrack.track` |
| Read about property surveys | FAQ item `condition-survey` on `routes.project.faq` |
| Careline | `siteInfo.careline.tel` |
| See all FAQs | `routes.project.faq` |
| FAQ accordion headers | Action: expand/collapse |

## Open questions
1. **Hero type tokens.** The hero title is Poppins **Bold** 60/72 (44/50 mobile) and the tagline Poppins **Light** 36/46 (22/30 mobile); neither is a Figma text style or an existing `type-*` utility, and `fonts.ts` may load only SemiBold. Proposal: add `type-hero-title` and `type-hero-tagline` (with mobile sizes and the 36/44 step below 390) and load Poppins 300 and 700. Fallback if refused: `type-heading-m lg:type-heading-xl` and `type-body-xl`.
2. **Map view needs coordinates.** No model has latitude/longitude. Map view needs station positions and the alignment path (`getLineAlignment()` in `data/api`, e.g. `{ stations: {code, lat, lng}[], path: [lat, lng][] }`), shared with the Traffic map. These are approximate positions of a planned line; the caption already says "Illustrative alignment". Who supplies them (content writer or Traffic group), and should they be tagged `VERIFY`? Until they exist, the builder can ship Route view only and hide the toggle.
3. **Route helpers to add in `config/routes.ts`** (main agent approval): `routes.homeWorksIn(areaId)` → `/?area=<id>#works` (Try chips, search area option); `routes.project.faqItem(id)` → `/project/faq#<id>`; `routes.traffic.mapFocus(announcementId)` for "View on map" (until then it goes to the plain traffic map).
4. **Progress card anchors:** cards link to Construction progress without an anchor until that spec defines `#<update-id>`.
5. **Hero scrim on mobile.** Figma uses the same left-to-right gradient on mobile, where the text is on the lighter left side. If the tester's contrast check fails at 390, a `bg-hero-scrim-mobile` token (stronger on the left) is needed. Only the main agent edits tokens.
6. **Shadow and border tokens:** the suggestions panel shadow (0 16 40, 22 %) and the Try chip border (white 35 %) and hover (white 24 %) have no exact tokens. Use `shadow-panel`, `static-white-30` and `static-glass` unless the main agent adds exact ones.
7. **Home `<title>`:** "Home | Mutiara LRT Community Connect" reads oddly; proposal: Home uses the plain site name as an absolute title.
8. **Works list cap of 3 with no "show all" link:** Bukit Jambul has 4 items and the 4th is reachable only through "All announcements" (an area-filtered announcements link would need Announcements to support `?area=`). Adding a link row would also break the Figma match. Confirm the cap, or ask the Announcements spec for an area filter and add a link.
9. **Default area is All areas** for everyone (Figma's frame shows Bukit Jambul selected; the visual test uses `/?area=bukit-jambul`). Confirm.
10. **Help strip on mobile** is restacked (no right borders, no indent, no empty 100 px frame) instead of copying 133:6827 literally; this may cost visual-diff tolerance at 390.
11. **Route view between 768 and 1279** uses the vertical rail, not a shrunken diagram. Confirm.

## Main agent answers (iteration 2)

1. **Hero type:** use the new tokens `type-hero-title-compact` (<390) → `type-hero-title-mobile` (<1024) → `type-hero-title`; tagline `type-hero-tagline-mobile` → `type-hero-tagline` (≥1024). Poppins 300/700 are loaded.
2. **Coordinates:** the foundations content writer adds approximate `lat`/`lng` to every station (tagged VERIFY). Map view uses them.
3. **Route helpers** now exist: `routes.homeWorksIn(areaId)`, `routes.project.faqItem(id)`, `routes.traffic.mapFocus(id)`, `routes.project.constructionUpdate(id)`. Ids become element ids on the target pages; the project and traffic iterations honour them.
4. Construction card anchors: `routes.project.constructionUpdate(update.id)`.
5. **Mobile scrim:** use `bg-hero-scrim` first; add a mobile scrim token only if the tester's 4.5:1 check fails (ask the main agent).
6. **Tokens:** the suggestions panel uses `shadow-suggestions` (an exact match for 0 16 40 / 22 %). Try chip border `static-white-35`, hover `static-glass-strong`.
7. **Page title:** Home uses the absolute title `commonCopy.metadata.defaultTitle`.
8. **3-item cap and the "All areas" default:** confirmed.
9. The empty 100 × 100 frame in the careline column (38:1312) has no fill or content. It is a spacer; render nothing.
