# Traffic: copy change notes

Copy in `src/content/traffic.ts` (`trafficCopy.overview`, `.map`, `.route`, `.announcements`). Figma: overview 66:2206 and 133:26630, map 1:801 and 133:27469, route view 5:843 and 133:27775, announcements 1:629 and 133:27022. Typos and casing fixes are not listed. Records (announcements, road works, stations) live in the mock data and are not edited here.

| Where (key) | Before (Figma) | After | Why |
|---|---|---|---|
| `overview.header.lede` | Get the latest information on road closures, diversions and construction works for the LRT Mutiara Line project. Every notice comes with its dates and duration, to help you plan your journey more smoothly and safely. | See road closures, diversions and construction works for the LRT Mutiara Line. Every notice shows its dates and duration, so you can plan your journey. | One 40-word sentence pair cut to two short sentences. "More smoothly and safely" is filler |
| `overview.pages.cards[map].body` | Closures, construction zones and hazards on a map of Penang. | See closures, construction zones and hazards on a map of Penang. | Starts with a verb, says what the reader can do |
| `overview.pages.cards[announcements].body` | Every road change with start date, end date and duration. | Read every road change, with its start date, end date and duration. | Verb first, complete sentence |
| `overview.pages.cards[route].body` | Road changes shown station by station along the line. | See road changes station by station along the line. | Active voice |
| `overview.faq.title` | Popular questions (side contents) | Same | Matches the "On this page" item |
| `map.header.title` and `route.header.title` | Traffic map | Same on both pages | Figma uses one heading for both views. The browser title differs: `map.meta.title` "Traffic map", `route.meta.title` "Route view" |
| `route.diagram.caption` | Station order, not to scale. Select a station to see road changes near it. | Stations in line order, not to scale. Select a station to see road changes near it. | Same wording as the Home line diagram caption |
| `map.legend.construction` | Active worksite (route diagram legend) | Route diagram keeps "Active worksite"; the map and toggles use "Construction zone" | Figma shows both. The toggle is the plural "Construction zones" on both pages |
| `map.attribution` | Google Maps placeholder | © OpenStreetMap contributors | CLAUDE.md: Leaflet and OpenStreetMap only, attribution visible |
| `map.popup.reportProblem` | Report a problem | Kept | Matches "Report an issue" elsewhere in meaning, but Figma wording kept. VERIFY T3 if the owner wants one term |
| `announcements.filters.searchPlaceholder` | Search road or area | Kept. The accessible label is "Search a road or area" | A placeholder is not a label |
| `announcements.table.columns.notice` | Official notice | Kept. Link text "View notice" (uiCopy), accessible name "View notice for {title}" | Several identical links need distinct names |
| `announcements.pagination` | Showing 1 to 6 of 19 announcements | Built with `uiCopy.pagination.showing(1, 6, 19, 'announcements')` | Same sentence, one source |

## Hidden content

- Tab counts, rows and pages come from the 19 announcement records (3 active, 2 upcoming, 14 ended). At 6 per page: All has 4 pages, Current 1, Upcoming 1, Past 3.
- Every empty and error state is written for each tab, the area and search filter, the map list, the route view and the overview list.
- Layer toggle counts (4 closures, 6 construction zones, 2 hazards, 12 in the area) are computed by the builder from records. See VERIFY T1: the data gives 10, not 12.
- Route stop lines (for example "KTM Butterworth, ferry terminal, Rapid Penang bus terminal") are each station's `subtitle`. No new records.
