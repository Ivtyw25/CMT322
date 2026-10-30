# Construction progress: UX spec
Route: `routes.project.construction` (`/project/construction`) · Figma: desktop 1:413, mobile 133:24780, dark: none (token rules)

Shell, docs layout, section bar, sidebar, "On this page" and scroll-spy: [`_shared.md`](./_shared.md) §10–11. Page feedback, related pages and "Need help?": shared parts described in the About spec.

## Purpose and primary task
Residents near the works and curious commuters check what has happened recently along the line and where the project stands overall. Typical task: "what is happening on my road?": filter site updates by type of work and area, then read the newest entries.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390. Filter chips wrap (3 rows possible); the area select drops to its own row, full width. Photos: grid keeps 3 columns for 3 photos (each ~92 px wide, aspect 3:2 kept). |
| 390–767 | Mobile frame 133:24780. Section bar `Project / Construction progress`. Project timeline **vertical** (shared Timeline, with the Today marker as its own item). Site updates: a single column per entry: rail dot on the left (`primary-600` ring), then date Body/S Semibold, place Body/XS `gray-500`, phase tag, title, body, photos, "Posted by the project team". Filter chips wrap; the area select follows the chips on the same flow (Figma 133:24780 shows it after "Stations"). "Load older updates" Secondary auto width. |
| 768–1023 | Section bar; article max 760. Timeline still vertical. Entries use the **desktop** three-column arrangement (date/place column 112, rail 14, content). Chips and select on one row if they fit, else wrap. |
| 1024–1279 | Sidebar + article (~648 px at 1024). Timeline still **vertical** (decision below). Entries desktop arrangement; photo grid shrinks with the content column. Aside hidden; "Need help?" after the article. |
| 1280+ | Three columns. Timeline **horizontal** (1:413). |
| 1440+ | Desktop frame; content 1200 centred; at 1920 extra width is margin. |

**Decision (timeline orientation):** horizontal only from **1280** px, where the article is the full 760 px. At 1024–1279 the article is ~648 px and six 118 px labels would wrap to 4–5 lines. This refines `_shared.md` ("horizontal from 1024"), which assumed full width. Needs a Timeline option (see Shared needs).

## Sections (top to bottom)

### 1. Head (60:2617)
Breadcrumb `Home / Project / Construction progress`; `h1`; lede (4 sentences, Body/L); "Last updated 22 Oct 2026" Body/XS `gray-500` (= date of the newest update, computed, `<time>`).

### 2. Project timeline (60:2631), `h2 id="timeline"`
- Source `getMilestones()`; "Today" position from the mock clock (29 Oct 2026): the marker sits between the last past and first future milestone.
- Horizontal (≥1280): line through dots; past segment solid 4 px `primary-600`, future segment dotted `gray-300`; past dots filled `primary-600` 16 px; future dots hollow `gray-400` 16 px; Today: 24 px ring `primary-600` with halo `primary-200` and a `primary-600` pill "Today" (Body/XS Semibold `static-white`) above it. Labels under each dot: date Body/XS Semibold (`gray-900` past, `gray-500` future), text Body/XS `gray-600`, centred (first left-aligned, last right-aligned, as Figma).
- Vertical (<1280): shared vertical Timeline (133:24780): dot + date Body/S Semibold + text Body/S `gray-600`; Today is an item with the "Today" pill.
- Semantics either way: `<ol>`; each item has a visually hidden state ("Done", "Planned"); the Today item reads "Today, 29 Oct 2026". Not interactive.

### 3. Site updates (60:2665), `h2 id="updates"`

**Filters (60:2667), `id="update-filters"`.**
- Phase chips (shared FilterChips, single select, `aria-pressed`): All updates (default), Utility relocation, Piling, Viaduct, Stations. Group label (visually hidden): "Type of work".
- A 10 × 1 px `gray-300` separator (decorative, ≥768 only), then the **area select** styled as a chip (Figma 60:2679: border `gray-200`, radius full, padding 6 × 13, `chevron-down` 16 px): a native `<select>` with visually hidden label "Area"; options "All areas" (default) + the areas from `getAreas()` in their order. Explicit `surface` bg and `gray-900` text (dark mode, native popup).
- Filters combine (phase AND area). Changing either updates the list at once (no Apply button), resets "load older" to the first page, keeps focus on the control, and announces via a visually hidden polite status: "Showing {n} updates" / "Showing {n} updates for Piling in George Town" / "No updates match these filters".
- **URL state:** `?phase=<id>&area=<id>` with `router.replace` (no history entry per click; no scroll). On load, read them (unknown values fall back to All). Defaults are not written. Reason: a resident can share or bookmark "Piling near me".

**Update list (60:2683).**
- Source `getConstructionUpdates({ phase, areaId })`, newest first. **Page size 4** (Figma shows 4).
- Entry (desktop arrangement ≥768): left column 112 px: date Body/S Semibold `gray-900` (`<time>`) and place Body/XS `gray-500` (`location`); rail column: 12 px `primary-600` dot with a 2 px `primary-200` line down to the next entry (last entry: no line below); content column: phase tag (neutral pill `gray-100`, Body/XS Medium `gray-700`; this is a label, not one of the 9 status tags), `h3` title Heading/3XS (`timelineTitle ?? title`), `body` Body/S `gray-700`, photos, "Posted by the project team" Body/XS `gray-500` with `user` 14 px.
- Each entry is an `<article id="{update.id}" aria-labelledby>`; its `h3` has `tabindex="-1"` (focus target for deep links and "load older").
- **Photos:** `photoCount` grey placeholders, at most 3 shown, in a 3-column grid (gap 10, aspect 3:2): 3 photos fill the row; 2 photos take two cells, left-aligned; 1 photo takes one cell ≥768 and the **full width below 768**; 0 photos: no grid. More than 3: show 3 (no "+N" overlay; nothing to open). Placeholders are `aria-hidden`; the entry has one visually hidden line "{n} photos, not yet available" (content function). Photos are not interactive.
- Figma mobile shows "Water mains moved" with 1 wide photo while desktop shows 2; spec follows the record's `photoCount` and the rules above (see Open questions).

**Load older updates (60:2795).** Secondary button below the list.
- Click: appends the next 4 entries of the current filter; button shows the loading state for the mock delay (~400 ms, "Loading older updates…"); then focus moves to the `h3` of the first new entry; status "Showing {n} updates".
- When no more entries remain: the button is removed and a Body/S `gray-500` line "You've reached the earliest update." takes its place (not focusable).
- No error state: the data layer is local mock data, so the button only has default, loading and done states.

**Empty (filters match nothing):** the list is replaced by: "No updates match these filters." (Body/M Semibold) + "Try another type of work or All areas." (Body/S `gray-600`) + Secondary button "Show all updates" (resets both filters, focus to the "All updates" chip). The button "Load older updates" is hidden.

**Deep links `#<update-id>`** (`routes.project.constructionUpdate(id)`, used by Home and the Overview): on load or hash change, if the entry is not in the rendered list because of filters, reset filters to All (and drop them from the URL); if it is older than the loaded pages, load pages until it is included; then scroll it to the top (respecting `scroll-margin-top`) and focus its `h3`. Unknown id: ignore, stay at the top.

**Note (60:2797).** Info callout: "Works affecting your road? Closures and detours linked to these works are on the traffic map." + link "Open the traffic map".

### 4. Page end (60:2805)
Page feedback (shared, About spec). Related pages: About the line, Announcements, FAQ.

### 5. On this page (60:2840)
Two levels: "Project timeline", "Site updates", and under "Site updates" one indented sub-item per **rendered** entry, max 6, label "{d MMM}: {tocLabel}" ("22 Oct: Pier caps completed"), Body/XS, indent 12 px. Sub-items follow the filters and loaded pages. Scroll-spy considers sub-items too (the active one gets the bar; its parent text turns `gray-900`). Clicking a sub-item = the deep-link behaviour above (without reloading).

## Interactive elements
| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Phase chip (×5) | click | Filter list, update URL, announce | default, hover, focus-visible, pressed | Tab to each chip, Enter/Space | Single select |
| Area select | change | Filter list, update URL, announce | default, hover, focus, (open: native) | native | Styled as chip |
| Load older updates | click | Append 4, focus first new | default, hover, focus-visible, loading, gone (end text) | Enter/Space | Secondary |
| Show all updates | click | Reset filters | Secondary states | Enter/Space | Empty state only |
| Open the traffic map | click | → map | link states | Enter | |
| Page feedback | click | As About | as About | as About | |
| Related row (×3) | click | → page | as shared | Enter | |
| On this page (+ sub-items) | click | Scroll + focus | default, hover, focus-visible, active | Enter | |

## Hidden content inventory
| Item | Count / kind |
|---|---|
| Construction updates | **≥ 12** records (3 pages) covering all 4 phases and at least 5 areas, newest 22 Oct 2026 as Figma; `photoCount` 0–5 mixed; at least one combination (e.g. Stations + Bayan Lepas) with **no** match, for the empty state |
| `tocLabel` per update | one per record, ≤ 28 characters ("Pier caps completed") for the aside (field exists in the working tree) |
| Phase labels | 4 + "All updates" (exist in `uiCopy`) |
| Area options | from `getAreas()` + "All areas" |
| Status messages | 3 functions (count, count with filters, none) |
| Empty state | title, hint, button |
| Load older: label, loading label, end text | 3 |
| Photos sr-only text | 1 function |
| Today label, sr-only states | "Today, {date}", "Done", "Planned" |
| Related pages | 3 rows (in Figma) |

## Dynamic states
- **Loading:** first page is server-rendered (no skeleton). "Load older" shows the button loading state only.
- **Empty:** filters with no match (above). No updates at all: the empty text "No site updates have been posted yet." and no filters.
- **Error:** route error boundary only.
- **Signed in vs guest:** no difference.
- **Long content:** long titles and place names wrap (place column 112 px wraps to 2–3 lines as Figma shows "Jalan Sultan Azlan Shah"); 100 updates: pagination keeps the page short; the aside caps at 6 sub-items.
- **No JavaScript:** first 4 updates of "All" render; chips do nothing (acceptable; the timeline and updates are readable). Deep links to the first 4 entries work natively.

## Motion
- Filter changes and appended entries appear instantly (no stagger; a fade of 150 ms opacity on newly appended entries is allowed). Reduced motion: no fade.
- Deep-link scroll: smooth (instant with reduced motion).
- Chip and select colours 150 ms.

## Accessibility
- One `h1`; `h2` Project timeline, Site updates; `h3` per update.
- Focus order: breadcrumb → (timeline has no focusables) → 5 chips → area select → (entries have no focusable content) → Load older → note link → feedback → related → Need help → footer.
- The filter group is a `<div role="group" aria-label="Filter site updates">` containing the chip group (`aria-label="Type of work"`) and the select.
- Live region: one polite status for counts (not the list itself).
- Contrast: future timeline labels `gray-500` on `surface` are Body/XS: check 4.5:1 in both modes; if they fail in dark, use `gray-600`.
- Touch: chips 32 px tall get `hit-area` below 768; area select 34 px gets `hit-area`.

## Links and destinations
| Element | Destination |
|---|---|
| Breadcrumb Home, Project | `routes.home`, `routes.project.overview` |
| Open the traffic map | `routes.traffic.map` |
| Related: About the line, Announcements, FAQ | `routes.project.about`, `routes.traffic.announcements`, `routes.project.faq` |
| Need help | as Project overview |
| On this page | `#timeline`, `#updates`, `#<update-id>` |
| Chips, select, Load older, Show all updates | Actions (URL query via `router.replace`) |

## Shared component needs
1. **Timeline:** an orientation breakpoint option (`horizontalFrom: 'lg' | 'xl'`), Construction uses `xl`; and the horizontal styling above (dotted future line, Today pill above the line).
2. **DocsAside:** nested items (one sub-level) with scroll-spy on sub-items; items can change after mount (filters).
3. **FilterChips + select-as-chip:** a `ChipSelect` styling of the native select that matches the chip (Home may reuse it).
4. **Model:** `ConstructionUpdate.tocLabel` and `timelineTitle` (already added by the content writer in this worktree; main merges them).
5. **Route helper** for section anchors (Overview spec).

## Open questions
1. Timeline horizontal from 1280 instead of 1024 (refines `_shared.md`). Confirm.
2. Mobile photo layout differs between Figma desktop and mobile for the same entry; spec derives it from `photoCount`.
3. Filters in the URL (`?phase=&area=`). Confirm; Home "Works in your area" could then link here with an area.
