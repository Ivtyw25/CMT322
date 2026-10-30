# FAQ: UX spec
Route: `routes.project.faq` (`/project/faq`) · Figma: desktop 1:557, mobile 133:16086, dark: none (token rules)

Shell, docs layout, section bar, sidebar, "On this page" and scroll-spy: [`_shared.md`](./_shared.md) §10–11. Accordion: shared (multiple open, `hidden="until-found"`, `#id` opens). Item feedback uses the shared `PageFeedback` (About spec) in its small variant.

## Purpose and primary task
People with a worry ("how late will they work outside my house?", "will I be compensated?") want a straight answer fast. The page must get them to one answer in as few steps as possible: search, a popular term, a topic, or the most asked list. If the answer isn't there, they need the way to ask (report) or call.

## The questions region (how the page works)
One list region, `h2 id="questions"`, shows one **view** at a time:

| View | When | Heading | List | Under the list |
|---|---|---|---|---|
| Most asked (default) | no query, no topic, no `view` | "Most asked this month" | `getMostAskedFaq()` (5, by rank) | Secondary "Show all 22 questions" (count from data) |
| All | after "Show all …" or a deep link to an item outside the current view | "All questions" | all items, grouped order: topics in category order, items in data order | — |
| Topic | `?topic=<categoryId>` | the topic label, e.g. "Land and compensation", with "{n} questions" Body/S `gray-600` under it | that topic's items | Ghost button "Show most asked questions" (clears the topic) |
| Search | search field not empty (`?q=`) | "Results for “{query}”" | matching items (below) | — |

- Search wins over topic: typing a query ignores the topic; clearing the query returns to the previous view (topic if set, else Most asked).
- Every item shows its topic's `shortLabel` above the question (eyebrow, Body/XS `gray-500`), in every view.
- **URL state:** `?q=…`, `?topic=…`, `?view=all`, written with `router.replace` (no history entry; no scroll). Read on load; unknown values ignored. Topic cards are links (`routes.project.faqTopic(id)`, which adds `#questions`) so Back returns from a topic to where you were.
- When the view changes because of the user's action, the list updates instantly, a visually hidden polite status announces it ("Showing 5 most asked questions", "Showing all 22 questions", "Showing 5 questions about Land and compensation", "3 questions match “night works”", "No questions match “xyz”"), and focus stays where it was, except: "Show all" and "Show most asked" move focus to the `h2` (it has `tabindex="-1"`), and arriving via a topic link focuses the `h2`.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390. Search placeholder wraps (field grows, min 50 px). Popular chips wrap (3 rows). "What to do next" buttons full width, stacked. Feedback reason chips wrap. |
| 390–767 | Mobile frame 133:16086. Section bar `Project / FAQ`. Audience switch is a **vertical** segmented list (4 full-width options, 44 px each, selected option `surface` + `shadow-control`). Topic cards 1 column. In an open item: next-step buttons full width stacked; "Last updated" on its own line under Yes/No; reason chips wrap. "Still need help?" card after Related pages; buttons full width. |
| 768–1023 | Section bar; article max 760. Audience switch horizontal (it needs ~656 px; the article is 704). Topic cards 2 columns. Next-step buttons in a row (wrap if needed). "Still need help?" after the article, max 760. |
| 1024–1279 | Sidebar + article (~648 px). The audience switch would not fit in a row: **decision:** it uses a container query: horizontal when its container is ≥ 660 px, vertical otherwise (so 1024–1279 shows the vertical list). Topic cards 2 columns. Aside hidden; "Still need help?" after the article. |
| 1280+ | Three columns; aside: "On this page" + "Still need help?" card (1:557). |
| 1440+ | Desktop frame; content 1200 centred; at 1920 extra width is margin. |

## Sections (top to bottom)

### 1. Head (61:2617)
Breadcrumb `Home / Project / FAQ`; `h1` "Frequently asked questions"; lede; then the search and popular searches (part of the head, before the first `h2`).

**Search (61:2630).** `role="search"` wrapper, `<input type="search">`, leading `search` 18 px, height 50, radius `xl`; placeholder "Search a question, for example “night works” or “compensation”"; visually hidden label "Search the FAQ". `enterkeyhint="search"`, `spellcheck="false"`.
- Filters as you type (22 records, in memory); URL `?q=` updated 300 ms after typing stops.
- Matching: case- and accent-insensitive; the query is split into words; an item matches when **every** word appears in its question, summary, answer paragraphs or keywords. Order: items whose question contains the whole query first, then the rest, each in data order.
- Matched words are **bold** in the question text (not in answers).
- Enter: moves focus to the questions `h2` (keyboard and screen-reader users land on the results). Escape: clears the query (focus stays).
- Clear button: native search clear, or a fallback 32 px `x` "Clear search" button inside the field (as Stations spec).

**Popular searches (61:2635).** "Popular:" label + 5 chips (construction hours, road closures, night works, property damage, opening date). Each chip is a `button` that puts its term in the search field and runs the search; focus stays on the chip; the status announces the result count. Not toggles (no `aria-pressed`). Chips 30 px; `hit-area` below 768.

### 2. Browse by topic (61:2656), `h2 id="topics"`
- **Audience switch** (61:2658): shared SegmentedControl (native radio group, visually hidden legend "Who are you?"): Everyone (default), I travel through the area, I live or work near the works, My land is affected. It filters the **topic cards only** (by `category.audiences`; Everyone shows all 4). Not in the URL. Announce "Showing {n} topics".
- **Topic cards** (61:2667): link cards (shared LinkCard: stretched title link). Icon tile 36 px (`primary-50`, icon 18 px `primary-700`: `signpost` / `house` / `landmark` / `train-front` matching Figma), title Body/M Semibold `gray-900`, "{n} questions" Body/XS `gray-500` (count from data), summary Body/S `gray-600`. Hover border `gray-300` and title `primary-700`; focus ring around the card. The card of the active topic (`?topic=`) shows selected: border `primary-600`, bg `primary-50`, and `aria-current="true"` on its link.
- Grid: 2 columns ≥768 (gap 16), 1 column below. With one card (My land is affected), it stays in the left column.

### 3. Questions (61:2704), `h2 id="questions"`
See "The questions region". The accordion (61:2706):
- Item header button (inside an `h3`): eyebrow + question Body/L Semibold (mobile Body/M Semibold) `gray-900`, `chevron-down` 20 px `gray-500` right, rotating when open; padding 18 × 0; 1 px `gray-200` top border on every item and bottom border on the last. Hover: question `primary-700`. Focus-visible: ring around the whole header row.
- Open content (61:2714–61:2737), in order:
  1. Short answer: `answer[0]` in Body/M Semibold `gray-900`.
  2. Remaining paragraphs Body/M `gray-700`.
  3. "What to do next" box (`gray-50`, radius `xl`, padding 16; title Body/S Semibold) with one Secondary button-link per `nextSteps` entry. Hidden when `nextSteps` is empty.
  4. Item feedback row: "Was this helpful?" + Yes / No (32 px, small `PageFeedback`), a 10 px separator, "Last updated {date}" Body/XS `gray-500`. No → the row "If no, tell us why:" with chips Hard to find / Answer unclear / Out of date appears (Figma 61:2737 shows it in the open state; **decision:** show it only after "No", per the prototype). Thanks message replaces the row (`role="status"`). State per item, per page view.
- **Default open:** in the Most asked view on a plain visit (no hash, no query, no topic) the **first** item is open (as Figma). Other views start with all items closed, except a search with exactly one result, which opens it.
- Multiple items may be open; opening does not close others and does not change the URL.
- **Deep link `#<item-id>`** (`routes.project.faqItem(id)`, used by Home, Overview and other pages): on load or hash change, if the item is not in the current view, switch to the All view (clear `q`, `topic`); open it; scroll it into view (with `scroll-margin-top`); focus its header button. Unknown id: ignore.
- Find-in-page: closed answers are `hidden="until-found"` (shared), but only the items of the current view are in the DOM. **Decision:** acceptable; the All view is one click away.

### 4. Page end (61:2775)
Related pages: About the line, Construction progress, Traffic map. No page-level feedback (each item has its own).

### 5. Still need help? (61:2806)
Card (`gray-50`, border `gray-200`, radius `2xl`, padding 16): title Body/S Semibold, text Body/XS `gray-600`, Primary "Report an issue" (full width of the card), Secondary "Track a ticket", then the careline line "MRTCareline 1800-88-6782, 24 hours" where the number is a `tel:` link. This card **replaces** the generic "Need help?" block on this page.

## Interactive elements
| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Search field | type | Live filter, URL `?q=` | default, hover, focus, filled | Enter → results heading; Esc clears | |
| Clear search (fallback) | click | Clear | hidden, default, hover, focus-visible | Enter/Space | |
| Popular chip (×5) | click | Search for the term | default, hover, focus-visible | Enter/Space | Not toggles |
| Audience option (×4) | click / arrows | Filter topic cards | unselected, hover, selected, focus-visible | Radio group arrows | Horizontal or vertical by container |
| Topic card (×4) | click | → `?topic=` view, focus `h2` | default, hover, focus-visible, selected (current topic) | Enter | Link card |
| Accordion header | click | Open/close item | closed, open, hover, focus-visible | Enter/Space | Shared |
| Next-step button-links | click | → destination | Secondary states | Enter | |
| Item Yes / No / reasons | click | Feedback flow | default, hover, focus-visible, pressed (No) | Enter/Space | Small PageFeedback |
| Show all 22 questions | click | All view, focus `h2` | Secondary states | Enter/Space | Most asked view only |
| Show most asked questions | click | Clear topic, focus `h2` | Ghost states | Enter/Space | Topic view only |
| Related row (×3) | click | → page | shared | Enter | |
| Report an issue / Track a ticket | click | → page | Primary / Secondary | Enter | |
| Careline | click | Call | link states | Enter | `tel:` |
| On this page (×2) | click | Scroll + focus | shared | Enter | Second label follows the view heading |

## Hidden content inventory
| Item | Count / kind |
|---|---|
| FAQ items | **22** (exist in mock: 5 getting-around, 6 living-near, 5 land, 6 the-line). Each: question, `summary`, 1–3 answer paragraphs with a one-sentence first paragraph (shown bold), 0–2 `nextSteps`, 2–5 keywords, `updatedAt`. Only "What are the construction hours?" is written in Figma; the other 21 answers come from the content writer (facts per BRIEFING §8; unknowns `VERIFY`) |
| Most asked ranks | 5 items ranked 1–5 (exist) |
| Topic cards | 4 × label, summary, icon (exist in mock categories); counts from data |
| Audience options + legend | 4 + "Who are you?" |
| Popular search terms | 5 (Figma) |
| View headings and status messages | 4 headings ("Most asked this month", "All questions", topic label, "Results for “{q}”"), "{n} questions", 5 status functions |
| Search empty state | title "No questions match “{query}”", hint "Try one word, such as “noise”, or browse by topic.", button "Clear search" |
| Buttons | "Show all {n} questions", "Show most asked questions" |
| Item feedback | "Was this helpful?", Yes, No, "If no, tell us why:", 3 reasons, thanks text |
| Still need help card | title, text, 2 buttons, careline line (Figma) |
| Metadata | title + description |

## Dynamic states
- **Loading:** none (server data; filtering is client-side).
- **Search with no results:** heading "Results for “{query}”", then the empty block (title, hint, Secondary "Clear search" which clears the field and moves focus into it). The Still need help card is the next step (no duplicate CTA in the empty block).
- **Topic with 0 items** (not possible with current data): "No questions in this topic yet." and the "Show most asked questions" button.
- **Error:** route error boundary.
- **Signed in vs guest:** no difference ("Report an issue" for guests leads through Log in, shared protected-route rule).
- **Long content:** long questions wrap (chevron stays top-aligned to the first line); long answers are fine (the item grows); 22 items in All view is the maximum.
- **No JavaScript:** search and chips do nothing; the Most asked list renders with the first item open and closed items expandable through `hidden="until-found"` only via find-in-page; topic links load the server-rendered `?topic=` view (the route reads `searchParams` on the server too), so topics still work.

## Motion
- Accordion height 200 ms (shared); chevron 150 ms.
- View changes and filtering: instant. Feedback rows: reason row fades in 150 ms.
- Deep-link scroll: smooth; reduced motion instant. Reduced motion: accordion opens instantly.

## Accessibility
- One `h1`; `h2` Browse by topic, the questions heading, Related pages (styled small), Still need help (styled small); `h3` per question (accordion).
- Focus order: breadcrumb → search → (clear) → 5 popular chips → audience radios (one tab stop) → topic cards → question headers (and the content of open items in order: next-step links, Yes/No) → Show all / Show most asked → related rows → Still need help (Report, Track, careline) → footer.
- Live region: one polite status for view and count changes; the empty state block is static content.
- The accordion header's accessible name is the question only (the eyebrow is `aria-hidden` inside the button and repeated as visually hidden text after the question: "What are the construction hours?, Living near a site"), so screen-reader users hear the question first.
- Touch: popular chips and reason chips `hit-area` below 768; item feedback buttons 32 px `hit-area`; accordion headers ≥ 64 px.

## Links and destinations
| Element | Destination |
|---|---|
| Breadcrumb Home, Project | `routes.home`, `routes.project.overview` |
| Topic cards | `routes.project.faqTopic(categoryId)` (**new helper**: `/project/faq?topic=<id>#questions`) |
| Next-step buttons | per item, from data. **Data fix needed:** `FaqNextStep.href` is a free string today; it must be built from `routes.*` in the data layer (e.g. "See night works this week" → `routes.traffic.announcements`, "Report noise outside these hours" → `routes.reportTrack.report`) so no path is typed twice |
| Related: About the line, Construction progress, Traffic map | `routes.project.about`, `routes.project.construction`, `routes.traffic.map` |
| Report an issue, Track a ticket | `routes.reportTrack.report`, `routes.reportTrack.track` |
| Careline | `siteInfo.careline.tel` |
| On this page | `#topics`, `#questions` |
| Deep links in | `routes.project.faqItem(id)` (e.g. `#construction-hours`, `#road-closures`) |

## Shared component needs
1. **Accordion:** optional `eyebrow` per entry (rendered above the title, read after it), a "first item open unless a hash is present" option, and a way for the page to open an item and focus its header programmatically (deep link after a view switch).
2. **SegmentedControl:** vertical orientation, and an automatic mode via container query (horizontal when the container ≥ 660 px).
3. **PageFeedback:** small variant with the "Last updated" slot (About spec).
4. **LinkCard:** selected state (`aria-current`).
5. **Route helper** `routes.project.faqTopic(id)`.
6. **Data:** `FaqNextStep.href` from route helpers (see Links).

## Open questions
1. Item feedback reasons shown only after "No" (Figma shows them in the open state). Confirm.
2. Search keeps the query in the URL (`?q=`, replace). Confirm.
3. Topic cards are links with a history entry (Back returns); search, Show all and audience use `replace`. Confirm this split.
