# Report & Track overview: UX spec
Route: `/report-track` (`routes.reportTrack.overview`) · Figma: desktop 71:2326, mobile 133:32762 · no dark frames (tokens flip)

Shell, docs layout, section bar, accordion and focus ring: [`_shared.md`](./_shared.md). Group rules: [`_report-track-shared.md`](./_report-track-shared.md). Reference: `tests/visual/reference/report-track-overview--*.png`.

## Purpose and primary task
A resident decides whether to report a problem or follow one already sent, and learns what happens after. Two big links first; reassurance second.

## Layout across breakpoints
| Width | Layout |
|---|---|
| 320–389 | As 390, side padding 20. Cards, steps and FAQ rows one column. Breadcrumb wraps. |
| 390–767 | Mobile frame: section bar under the notification bar, one column, side padding 32. Steps are a vertical list (number circles on a line). |
| 768–1023 | Mobile header and section bar. Link cards two columns (~340 each). Steps still vertical. |
| 1024–1279 | Docs sidebar + article (760). No right aside; "Need help?" after the article. Cards two columns. Steps in 4 columns (~175 each, text wraps to 3 lines). |
| 1280–1439 | Adds the "On this page" aside (200) with "Need help?" below it. |
| 1440+ | Desktop frame. Article stays 760; at 1920 only margins grow. |

## Sections (top to bottom)
1. **Header**: breadcrumb Home / Report & Track (current, not a link), `h1` "Report & Track", intro. Source `reportTrackCopy.overview.header`. The intro's last sentence ("Log in or create an account to report an issue or track a ticket.") is `.guest-only` (shared §2).
2. **Pages in this section** (`h2`, id `pages`): two `link-card`s, the whole card is the link. Card 1 "Report an issue" (`flag` tile) lists Complaint, Feedback, General inquiry, link to `routes.reportTrack.report`. Card 2 "Track a ticket" (`search` tile) lists Status updates, Replies from the authority, Resolution details, link to `routes.reportTrack.track`. The three lines are a plain `<ul>` without bullets, inside the link. Hover: border `primary-300`, title underline.
3. **How it works** (`h2`, id `how-it-works`): four steps, an `<ol>` from `reportTrackCopy.overview.steps`. Number circle 28 px, `primary-600` border, number `primary-700` as real text. Vertical below 1024 with a 2 px `gray-200` line joining the circles (line rail motif).
4. **Emergency callout** (warning tone, `triangle-alert`): static text, not a live region.
5. **Popular questions** (`h2`, id `popular-questions`): three link rows from `reportTrackCopy.overview.faq`; Body/M, `chevron-right` 18 px `gray-400`, min 48 px, bottom border `gray-200`. Each goes to `routes.withHash(routes.project.faq, questionId)`. "See all FAQs" text link to `routes.project.faq`, `primary-700`, no arrow character.

## Interactive elements
| Element | Trigger | Result | States | Keyboard |
|---|---|---|---|---|
| Link cards (2) | click | Navigate | default, hover, focus-visible ring on the card, active bg `gray-50` | Tab, Enter |
| FAQ rows, See all FAQs | click | Navigate | hover bg `gray-50`, chevron nudges 2 px, focus-visible inset ring | Tab, Enter |
| TOC items | click | Scroll, focus the `h2` (`_shared.md` §10) | active, hover | Tab, Enter |
| Section bar | click | Group panel (`_shared.md` §11) | open, closed | Enter, Esc |

## Hidden content inventory
Group page list (3 pages). 3 FAQ questions that must be real ids in `faq.ts`: who handles a report, how to check the status, whether an account is needed. Everything else is visible in Figma.

## Dynamic states
Static page: no loading or error. Signed in: guest sentence hidden by CSS. Long text: card titles and FAQ questions wrap. No JavaScript: all links work; scroll-spy and the section-bar panel need JavaScript.

## Motion
Hover colour transitions 150 ms ease-out; chevron nudge 150 ms. Reduced motion: colour change only, instant, no nudge.

## Accessibility
Landmarks: `main`, sidebar or section-bar `nav`, "On this page" `nav`. Headings: `h1`, three `h2`, step titles `h3`. Focus order: sidebar, article (cards, FAQ rows, See all FAQs), aside. "See all FAQs" gets `hit-area` below 768. Callout text must be 4.5:1 on `warning-50`.

## Links and destinations
Home → `routes.home`. Cards → `routes.reportTrack.report`, `routes.reportTrack.track`. FAQ rows → FAQ hash. See all FAQs → `routes.project.faq`. Sidebar and footer: shell.

## Open questions
1. FAQ row hashes rely on the FAQ accordion opening an item from `#id` (project decision). If a question isn't in `faq.ts`, the writer must use one that is.
