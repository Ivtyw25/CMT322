# Project overview: UX spec
Route: `routes.project.overview` (`/project`) · Figma: desktop 55:2090, mobile 133:14049, dark: none (token rules, `_shared.md`)

Shell, docs layout, section bar, sidebar, "On this page" and scroll-spy behave as in [`_shared.md`](./_shared.md) §10–11. This spec covers only what is specific to this page.

## Purpose and primary task
The landing page of the Project group. A visitor who opened "Project" wants to pick the right page (About, FAQ, Construction progress) or get straight to the newest site update or a top question, in one tap.

## Layout across breakpoints
Docs layout. Article sections stack in this order at every width: head, Pages in this section, Latest update, Popular questions, then (below 1280) the "Need help?" block.

| Width | Layout |
|---|---|
| 320–389 | As 390, side padding 20 px (container rule). Page cards one column. Latest update photo full width, aspect 350:132 kept (it shrinks in height with width). Card sub-link labels and question rows wrap; chevrons stay top-aligned to the first line. |
| 390–767 | Mobile frame 133:14049: section bar (`Project / Overview`), cards stacked with 16 px gap, latest update stacked (photo on top, 20 px gap, text below), "Need help?" block after the article. |
| 768–1023 | Section bar stays; article full container width (max 760, side padding 32). Page cards **3 columns** (grid, 16 px gap, equal heights). Latest update switches to the desktop row (photo 200 × 132 left, text right, gap 20). "Need help?" below the article. |
| 1024–1279 | Sidebar 240 + article (fluid, max 760). Cards stay 3 columns (each ≥ 200 px at 1024; titles may wrap to 2 lines). Aside hidden; "Need help?" below the article. |
| 1440+ | Desktop frame 55:2090. Content 1200 centred; at 1920 extra width is margin. |

## Sections (top to bottom)

### 1. Head (55:2530 / 133:14089)
- Breadcrumb: `Home` link, current `Project` (plain text, `aria-current="page"`). Shared `Breadcrumb`.
- `h1` "Project" (Heading/M desktop, Heading/S mobile per the mobile scale), lede Body/L → Body/M on mobile, `gray-600`, max 680 px.
- Content: `projectCopy.overview.head` (title, lede, breadcrumb labels).

### 2. Pages in this section (55:2539), `h2 id="pages"`
- Three cards in this order: About the line, FAQ, Construction progress (Figma order; do not re-sort).
- Card: border `gray-200`, radius `2xl`, padding 20; icon tile 36 px (`primary-50`, icon 18 px `primary-700`: `info`, `circle-help`, `camera`), title Heading/3XS `primary-700`, description Body/S `gray-600`, a 1 px `gray-200` divider, then three sub-links (Body/S `gray-700`, 26 px row pitch).
- **Decision (links):** the card title is a link to the page; each sub-link is its own deep link (table in Links). The card is **not** a stretched link card, because it contains four links. Hover on the title: underline; hover on a sub-link: text `primary-700` + underline. No card-level hover state.
- Sub-link rows are 26 px apart in Figma: below 768 each sub-link gets `hit-area` and the list uses 44 px rows (same rule as the mobile footer, `_shared.md` decision 5). From 768 keep 26 px.
- Content: `projectCopy.overview.pages[]` (title, description, icon id, 3 × {label, href}).

### 3. Latest update (55:2593), `h2 id="latest-update"`
- Source: `getConstructionUpdates()` first item (newest). Shows: `ImagePlaceholder` (decorative, `aria-hidden`, the text describes the update), meta line, title (Heading/3XS, plain text, not a link), summary (Body/S `gray-700`, the record's `summary`), link "See all construction updates" (Body/S Semibold `primary-700`).
- Meta line: date and place in one `<p>` as Figma shows ("22 Oct 2026, Jalan Sultan Azlan Shah"), date formatted with `lib/format`, joined by a comma (no middle dot). The date is a `<time datetime>`.
- Long title or summary: wraps; never truncated.

### 4. Popular questions (55:2603), `h2 id="popular-questions"`
- Source: `getMostAskedFaq()`, first 3. Each row is a **link** (not an accordion): question text Body/M `gray-900`, `chevron-right` 16 px `gray-400` on the right, 1 px `gray-200` top border on every row and a bottom border on the last. Whole row is the link (49 px tall; ≥ 44 px).
- Row hover: bg `gray-50`, text `primary-700`; focus-visible ring inset (−2 px).
- "See all FAQs" link below (Body/S Semibold `primary-700`).

### 5. Need help? (55:2634; mobile 133:14168)
Shared block (see "Shared component needs"): "Need help?" title Body/XS Semibold, links "Report an issue", "Track a ticket", careline as plain text "MRTCareline 1800-88-6782" (plain text in Figma here; **Decision:** make it a `tel:` link styled like the other two, because a phone user at the roadside should be able to tap it; label from `getSiteInfo()`).

## Interactive elements
| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Breadcrumb "Home" | click | → Home | default, hover, focus-visible | Enter | Shared |
| Card title (×3) | click | → page | default, hover (underline), focus-visible | Enter | Heading/3XS inside an `h3` |
| Card sub-link (×9) | click | → deep link | default, hover, focus-visible | Enter | 44 px rows below 768 |
| "See all construction updates" | click | → Construction | default, hover, focus-visible | Enter | |
| Question row (×3) | click | → FAQ item | default, hover, focus-visible | Enter | Opens the item on arrival (FAQ spec) |
| "See all FAQs" | click | → FAQ | default, hover, focus-visible | Enter | |
| Need help links | click | → page / call | default, hover, focus-visible | Enter | |
| On this page items | click | scroll + focus `h2` | as shared | Enter | 3 items |

## Hidden content inventory
| Item | Count / kind |
|---|---|
| Card sub-link labels and targets | 9 (already in Figma) |
| Icon tile `aria-hidden` (no copy) | — |
| Empty texts | 2: no construction update ("No site updates have been posted yet."), no questions ("Questions will appear here soon.") |
| Metadata | page title "Project" + meta description (1 sentence) |

## Dynamic states
- **Loading:** none visible; data is fetched on the server.
- **Empty latest update** (no records): keep the `h2`, replace the row with Body/S `gray-600` empty text and keep the "See all construction updates" link.
- **Empty popular questions:** empty text, keep "See all FAQs".
- **Error:** the data layer is local mock; a thrown error goes to the route's error boundary (shared). No per-section error UI.
- **Signed in vs guest:** no difference on this page.
- **Long content:** card descriptions wrap; cards in a row keep equal height (grid `align-items: stretch`); sub-link lists align to the bottom is **not** required (they follow the description).
- **No JavaScript:** all content and links work; only scroll-spy is lost.

## Motion
Only shared hover colour transitions (150 ms) and the aside scroll behaviour. Reduced motion: anchor jumps instantly.

## Accessibility
- One `h1`; three `h2`; card titles are `h3`.
- Focus order: breadcrumb → card 1 title → its 3 sub-links → card 2 … → "See all construction updates" → 3 question rows → "See all FAQs" → (below 1280) Need help links → footer. From 1280 the aside follows the article in DOM order (shared).
- Sub-link lists are `<ul>` with an accessible name from the card title (`aria-labelledby`).
- Question rows: `<ul>` of links; the link text is the question (no "Read more").
- Touch targets: 44 px rows below 768 for sub-links; question rows 49 px.

## Links and destinations
| Element | Destination |
|---|---|
| Breadcrumb Home | `routes.home` |
| About the line (title) | `routes.project.about` |
| Two routes, one line | `routes.project.about` + `#routes` (**needs helper**, see below) |
| Stations along the line | `routes.project.about` + `#stations` |
| Project timeline | `routes.project.about` + `#timeline` |
| FAQ (title) | `routes.project.faq` |
| Construction hours | `routes.project.faqItem('construction-hours')` |
| Road closures | `routes.project.faqItem('road-closures')` |
| Land and compensation | `routes.project.faqTopic('land')` (**new helper**, FAQ spec) |
| Construction progress (title) | `routes.project.construction` |
| Latest site updates | `routes.project.construction` + `#updates` |
| Filter by type of work | `routes.project.construction` + `#update-filters` |
| Milestones | `routes.project.construction` + `#timeline` |
| See all construction updates | `routes.project.construction` |
| Question rows | `routes.project.faqItem(item.id)` |
| See all FAQs | `routes.project.faq` |
| Need help: Report an issue / Track a ticket / careline | `routes.reportTrack.report`, `routes.reportTrack.track`, `siteInfo.careline.tel` |

**Route helper needed (main agent, `config/routes.ts`):** `routes.project.aboutSection(id)` and `routes.project.constructionSection(id)` (or one generic `withHash(path, id)`), so no hash string is typed in content. Section ids: About `overview, key-figures, routes, stations, travelling, benefits, timeline`; Construction `timeline, updates, update-filters`.

## Shared component needs
1. **`NeedHelpBlock`** (components/layout, used by every docs page): title + Report / Track links + careline `tel:` link; under the aside ≥1280, after the article below. Copy already in `uiCopy.docsPage.needHelp`.
2. Route helpers above.

## Open questions
1. Careline in "Need help?" is plain text in Figma; spec makes it a `tel:` link (roadside use). Confirm.
2. Card sub-links are treated as deep links (Figma draws them grey, link-less). If the owner prefers them as plain text, the card becomes a stretched link card instead.
