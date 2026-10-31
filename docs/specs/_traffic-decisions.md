# Traffic group: main agent decisions (iteration 4)

These win over the page specs and the content file where they differ.

1. **T1, map counts (Figma: 4 closures, 6 construction zones, 2 hazards, "In this area (12)").** Add the two missing records, so the map matches Figma:
   - a hazard, "Uneven road surface", on Jalan Tun Dr Awang near S09, reported 27 Oct 2026
   - one construction zone outside the Bukit Jambul area
   Hazards are their own kind (not announcements or road works), so Home's Works list (`toWorksItems`) stays unchanged: it still shows 12 Oct, 26 Oct and 3 Nov for Bukit Jambul. Mark both records VERIFY in `docs/content/verify.md`.
2. **T2, "View notice".** There is no notice URL on the records, so the link goes to `routes.traffic.announcement(id)` (`/traffic/announcements#<id>`). No external links.

## UX open questions answered (numbers as in the UX hand-back)

1. **Overview "Popular questions":** keep it. The content has `trafficCopy.overview.faq`, so build the section; it matches the Figma TOC.
2. **"View notice":** see T2. It links to `routes.traffic.announcement(id)`.
3. **Route diagram:** the horizontal diagram from 1440; the vertical rail from 1024 to 1439 and on mobile. Accepted.
4. **Map counts:** see T1. Add the records.
5. **"In this area (n)":** counts every filtered item, not only the ones in the map bounds. Accepted.
6. **Workspace layout without the footer** for Map and Route view, as in Figma. Add it as an additive layout variant of the shell (`--chrome-h`). Every other page keeps the footer.
7. **Locate:** re-centres on the whole line; no GPS, as in project decision 2.
8. **h1:** the Map page keeps "Traffic map". The Route view h1 uses the route view title from `trafficCopy.route.header`, so each page has a unique h1. Metadata titles are unique too.
9. **"Road changes this week":** ordered by start date, earliest first. No curated order.
10. **URL writes:** use `replace` for filter and search changes, so Back leaves the page rather than stepping through filters. This applies to traffic and project pages alike. Project decision 5's "Back works" means the page URL is shareable and restores the view.
11. **Extra station-page link in the station card:** allowed, with a specific label. Rail glyphs are allowed if `aria-hidden`.
12–14. Accepted as specified: no satellite toggle, the table from 1280, and tab counts follow the filters.

## Shared changes (`_traffic-shared.md` §1)

All 9 are approved, if they are additive and backwards compatible. The Home and Project pages and the gallery must keep working. Promote the line diagram to patterns only if Home then uses the same component. Never keep two copies.
