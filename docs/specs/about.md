# About the line: UX spec
Route: `routes.project.about` (`/project/about`) · Figma: desktop 1:332, mobile 129:5475, dark 121:4964

Shell, docs layout, section bar, sidebar, "On this page" and scroll-spy: [`_shared.md`](./_shared.md) §10–11. Need help block, page feedback and related pages: shared parts listed under "Shared component needs" (also used by Construction and Stations).

Note on the mobile frame: in Figma the mobile `docs-layout` frame (129:5478, 3494 px) clips its article (5532 px), so the 4754 px export hides everything after "Stations along the line". The layer tree has all sections (129:5754–129:5891); build them all.

## Purpose and primary task
Residents and commuters come to understand what the Mutiara Line is: its length and stations, the two services, which station serves what, how travel will work and when it opens. It is read top to bottom; the one interaction that matters is picking a station to see what it serves.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390. Key figures stay 2 × 2 (each tile ≥ 140 px; "Start of operations" wraps). Tabs wrap to more rows (shared Tabs rule). Label/value tables: see "Info tables". Timeline date column 96 px instead of 140. |
| 390–767 | Mobile frame 129:5475. Section bar `Project / About the line`. Key figures 2 × 2 (129:5535: left column no inner padding, right column with a 1 px `gray-200` left divider; row gap 20). Station diagram replaced by the **station line rail** (129:6123). Timeline rows: date column 140, text wraps in the rest (129:5789). Feedback and related pages full width; "Need help?" after the article. |
| 768–1023 | Section bar; article max 760. Key figures **4 in a row** (desktop 54:2148, dividers between tiles). Station line rail (not the diagram; see "Stations along the line"). Tables use the desktop columns (label 200, value rest). |
| 1024–1279 | Sidebar + article (fluid, ~648 px at 1024). Key figures 4 in a row. Station **line rail** still (the diagram needs 760 px). Aside hidden; "Need help?" after the article. |
| 1280–1439 | Three columns; article is the full 760 px: the **route diagram** replaces the rail. |
| 1440+ | Desktop frame 1:332; content 1200 centred; at 1920 extra width is margin. |

## Sections (top to bottom)
Every section heading is an `h2` with the id given; the aside lists all seven in this order (54:2485). Headings: Heading/XS desktop, Heading/2XS mobile. Body paragraphs Body/M `gray-700`, max 680 px.

### 1. Head (54:2128), no id
Breadcrumb `Home / Project / About the line` (last is current). `h1` "About the Mutiara Line", lede, "Last updated 21 Oct 2026" Body/XS `gray-500` (date from content, `<time>`). Content: `projectCopy.about.head`.

### 2. Overview (54:2140), `id="overview"`
Four paragraphs. Content `projectCopy.about.overview.paragraphs[]`. Static.

### 3. Key figures (54:2146), `id="key-figures"`
Four stat tiles: value (Heading/S `primary-700`, mobile Heading/XS) + label (Body/S `gray-600`): 29.67 km Elevated viaduct; 22 Stations; 2 Depots; 2031 Start of operations (confirmed facts, BRIEFING §8). Semantics: `<dl>` with `<dt>` = label and `<dd>` = value, visually value first (CSS order), so screen readers read "Stations, 22". Not interactive.

### 4. Two routes, one line (54:2161), `id="routes"`
- Intro paragraph, then shared **Tabs**: "PSR-A to KOMTAR" (selected by default), "PSR-A to Penang Sentral".
- Each tab panel: one paragraph + an info table (Length, Journey time, Construction).
- Below the tabs (outside the panels, same for both): info note callout (`info` 18 px) with the Macallum–KOMTAR text.
- **Decision:** tabs are not deep-linked (no `?tab=`): the content is short and nothing links to the second tab.
- Panel switch is instant; the panel height may change; content below moves (no animation).

### 5. Stations along the line (54:2185), `id="stations"`
Intro "Station order, not to scale. Select a station to see what it serves." Two presentations of the same 22 stations, chosen by width (render both, show one with CSS; the hidden one is `display:none` so it is out of the accessibility tree):

**a. Route diagram, ≥1280 (54:2188 + 54:2361).**
- Bordered box (`gray-200`, radius `2xl`, padding 20) with the schematic diagram (720 × 384) and the legend row (Mutiara Line, Nearby places, Elevated station, Interchange). Then the **selected-station card** below the box (`primary-50`, radius `xl`, code chip, name Body/S Semibold, "what it serves" Body/S `gray-700`).
- The diagram is an inline SVG drawn from the Figma vectors, with every colour bound to tokens (`primary-600` line, `primary-200` lighter line, `surface` stop fill, `gray-700` labels, `gray-500` nearby places) so dark mode (121:4964) is a token swap. Station names, codes and nearby-place labels are SVG text marked `aria-hidden`; the accessible content is the stop controls below.
- **Stops are interactive.** Each of the 22 stops has a transparent HTML `<button>` positioned over it (40 × 40 hit circle centred on the stop; stops are ≥ 43 px apart, so circles don't overlap).
- Stop states: default (ring `primary-600` 2 px, fill `surface`); hover (fill `primary-50`, cursor pointer, station name `primary-700`); selected (fill `primary-600`, code `static-white`, halo ring `primary-200` 6 px, name `primary-700` Semibold: as S13 in Figma); focus-visible (2 px `primary-600` ring at 3 px offset around the hit circle); interchange S19 keeps its larger double ring in every state.
- Default selection: **S13 Jalan Universiti** (as Figma). Selecting a stop updates the card immediately. Selection is not saved in the URL.
- Card: code chip, station name as a **link** to the station page (Body/S Semibold `gray-900`, hover `primary-700` + underline), then the "serves" sentence. The card is `aria-live="polite"` `aria-atomic="true"` so the change is announced ("S13, Jalan Universiti. Serves Universiti Sains Malaysia …").
- Keyboard: the stops form one `role="radiogroup"` (`aria-label` "Stations along the line") with roving tabindex: Tab enters on the selected stop; Arrow Right/Down = next station in line order (S31 → A01), Arrow Left/Up = previous, Home = S31, End = A01; selection follows focus; Enter/Space also select. Each stop is `role="radio"` with `aria-checked` and name "S13 Jalan Universiti". Tab leaves the group to the card's link.

**b. Station line rail, <1280 (129:6123).**
- Shared `LineRail` page variant, one stop per station in line order: stop 24 px, code chip, name Body/M Semibold, subtitle Body/S `gray-600` (the station's `subtitle`, or "Provisional name"), `chevron-right` 18 px `gray-400`.
- **Decision:** each row is a **link to the station page**, as the chevrons in 129:6123 imply. The selected-station card is **not shown** below 1280 (Figma 129:5748 shows it after the rail, but with rows as links nothing would select it, and the rail already shows each subtitle). See Open questions.
- Row states: hover/pressed bg `gray-50`, name `primary-700`; focus-visible ring inset; rows ≥ 48 px.

### 6. Travelling on the line (54:2367), `id="travelling"`
Info table, 6 rows (Train frequency, Operating hours, KOMTAR to Penang Sentral, Interchanges, Park & Ride, Universal access). Static.

**Info tables (sections 4 and 6).** `<dl>`; each row has a 1 px `gray-200` top border (last row also bottom), padding 12 × 0; label Body/S Medium `gray-900`, value Body/S `gray-700`. Desktop and ≥768: label column 200 px, gap 24, value fills the rest. **Below 768, decision:** label column 128 px, gap 16, value fills the rest (Figma 129:5757 keeps the 200 px label and squeezes values into 126 px, which wraps "Interchanges" to 7 lines). Labels wrap if needed. Not a `<table>`: these are name/value pairs.

### 7. A smarter way to travel (54:2388), `id="benefits"`
Shared Tabs with four tabs: Daily commuters (default), General public, Businesses, Environment. Each panel one paragraph. Tabs wrap (129:5777 shows "Environment" on row 2). Not deep-linked.

### 8. Project timeline (54:2400), `id="timeline"`
- Shared vertical `Timeline` (date column 140 px `tabular-nums` Body/S Semibold `gray-900`, text Body/S `gray-700`). Source: `getMilestones()` (same records as Construction), text = `longTitle`.
- Past/future styling from the mock "today" (`data/mock/clock`, 29 Oct 2026): past = filled `primary-600` dot and solid line; future = hollow dot, `gray-300` line. **Decision:** no "Today" marker here (Figma 54:2402 has none; Construction shows it).
- Info note below: source statement. The site name "laluanmutiara.mymrt.com.my" is plain text (no URL invented; BRIEFING §9).

### 9. Page end (54:2450)
- Page feedback "Was this page helpful?" (shared `PageFeedback`, see Interactive elements).
- Related pages (shared `RelatedPages`): Construction progress, Traffic map, FAQ. Each row: title Body/M Semibold `primary-700`, description Body/S `gray-600`, `chevron-right` 16 px `gray-400`; the whole row is the link; row hover bg `gray-50`; rows 71 px.

### 10. Need help? (54:2502 / 129:5887)
Shared block (as Project overview spec).

## Interactive elements
| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Route tabs (×2) | click / arrows | Switch panel | default, hover, focus-visible, selected | ←/→, Home/End (automatic activation) | Shared Tabs |
| Benefit tabs (×4) | click / arrows | Switch panel | as above | as above | Wrap on narrow widths |
| Diagram stop (×22, ≥1280) | click / arrows | Select station, update card | default, hover, focus-visible, selected | Radio group: arrows in line order, Home/End, Enter/Space | Card is a polite live region |
| Selected card name | click | → station page | default, hover, focus-visible | Enter | |
| Rail row (×22, <1280) | click | → station page | default, hover/pressed, focus-visible | Tab, Enter | |
| Page feedback Yes | click | Thanks message replaces the row | default, hover, focus-visible | Enter/Space | `button`, `thumbs-up` 16 px |
| Page feedback No | click | Reason chips appear below | default, hover, focus-visible, pressed (`aria-pressed`) | Enter/Space | `thumbs-down` 16 px |
| Reason chip (×3) | click | Thanks message replaces the whole feedback block | default, hover, focus-visible | Enter/Space | Hard to find, Answer unclear, Out of date |
| Related page row (×3) | click | → page | default, hover, focus-visible | Enter | |
| On this page (×7) | click | Scroll + focus `h2` | shared | Enter | |

**Page feedback detail (shared `PageFeedback`).** Buttons 34 px tall (Secondary style, radius `lg`); below 768 they get `hit-area`. Yes → the row is replaced by `circle-check` 16 px `success-600` + "Thanks for your feedback." in a `role="status"` element; focus moves to it (`tabindex="-1"`). No → No becomes pressed; a row "If no, tell us why:" with three small chips (26 px, `hit-area` below 768) appears under it and focus moves to the first chip; choosing a chip shows the same thanks message ("Thanks. We'll use this to improve the page."). Nothing is sent (mock); state is per page view and resets on reload.

## Hidden content inventory
| Item | Count / kind |
|---|---|
| Second route tab ("PSR-A to Penang Sentral") | 1 paragraph + 3 rows (Length, Journey time, Construction). Facts not confirmed: tag `VERIFY` except "Construction: from January 2027" (confirmed) |
| Benefit tabs 2–4 (General public, Businesses, Environment) | 3 paragraphs, ~2 sentences each, same tone as "Daily commuters" |
| "What it serves" per station | **22** one-sentence `serves` values (Figma shows S13 only) |
| Diagram stop accessible names | derived from code + name (no copy) |
| Radiogroup label, card live-region prefix | 1 label "Stations along the line"; no prefix |
| Feedback reason chips + 2 thanks messages + "If no, tell us why:" | 3 + 2 + 1 |
| Related pages | 3 rows (title + description, in Figma) |
| Metadata | title + description |

## Dynamic states
- **Loading:** none (server data).
- **Empty:** milestones empty → hide the timeline list, keep the note. Station without a "serves" sentence → card shows the station subtitle instead; if that is empty too, only code and name.
- **Error:** route error boundary (shared).
- **Signed in vs guest:** no difference.
- **Long content:** long station names in the rail wrap (2 lines max at 320, e.g. "Penang International Airport"); chevron stays vertically centred on the row. Tab labels never truncate (they wrap rows).
- **No JavaScript:** tabs show the first panel only (acceptable); the diagram shows S13 selected and stops do nothing; below 1280 the rail links work.

## Motion
- Tabs: instant panel swap; selected underline moves instantly (shared).
- Diagram: stop fill/halo transition 150 ms `ease-standard` (colour and `box-shadow`/stroke only). Card text swaps instantly (no fade, so the live region reads once).
- Feedback: thanks message appears instantly; reason row fades in 150 ms (opacity).
- Reduced motion: everything instant.

## Accessibility
- Landmarks per shared docs layout. One `h1`, seven `h2` (ids above), card and table labels are not headings.
- Focus order (DOM order): breadcrumb links → route tablist (only the selected tab is in the tab order) → route panel (it has no focusable content, so the panel gets `tabindex="0"`) → diagram radiogroup (one stop) → card link (≥1280) or the 22 rail links (<1280) → benefit tablist → its panel → feedback buttons → related rows → Need help links → footer. Overview, Key figures and Travelling have no focusable content.
- Diagram: SVG `aria-hidden="true"`; the legend is a visible list, also `aria-hidden` (it only explains the drawing); a visually hidden sentence before the group: "Use the arrow keys to move along the line." (content key).
- Contrast: lighter line `primary-200` is decorative (≥3:1 not required); stop rings `primary-600` on `surface` pass 3:1 in both modes.
- Touch: rail rows ≥ 48 px; feedback buttons and chips get `hit-area` below 768.

## Links and destinations
| Element | Destination |
|---|---|
| Breadcrumb Home, Project | `routes.home`, `routes.project.overview` |
| Selected card station name | `routes.project.station(code)` |
| Rail rows | `routes.project.station(code)` |
| Related: Construction progress, Traffic map, FAQ | `routes.project.construction`, `routes.traffic.map`, `routes.project.faq` |
| Feedback Yes / No / reasons | Action (local state) |
| Need help | as Project overview |
| On this page | `#overview`, `#key-figures`, `#routes`, `#stations`, `#travelling`, `#benefits`, `#timeline` |

## Shared component needs
1. **`PageFeedback`** (components/patterns): Yes/No + reasons + thanks, as above. Used by About, Construction, and the FAQ per-item feedback (same component, smaller variant: 32 px buttons, question "Was this helpful?").
2. **`RelatedPages`** (components/patterns): titled list of row links with description and chevron.
3. **`NeedHelpBlock`** (see Project overview spec).
4. **Station model field** `serves: string` (already added by the content writer in this worktree) for the selected-station card.
5. **Info table** (`InfoList`, `<dl>` rows with the mobile 128 px label rule): used here and on the station page "Station at a glance" (and likely Announcements and Ticket pages later). Put in components/ui.
6. **Route diagram** is About-only: `features/project/route-diagram.tsx` (not shared).

## Open questions
1. **Selected-station card below 1280:** spec hides it and makes rail rows links (chevrons). Alternative: rows select (no chevron) and the card stays. Main agent to confirm.
2. **Diagram breakpoint:** shown only from 1280 (where the article is 760 px). Scaling it down at 1024–1279 would shrink 12 px labels below 10 px.
3. **Info table label column on mobile:** 128 px instead of Figma's 200 px (readability). Small visual diff on M · About.
4. **Default selected stop** S13 is Figma's choice; for signed-in users it could be the first followed station. Spec keeps S13 for everyone.
