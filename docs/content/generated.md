# Generated content inventory

Foundations entries arrive with the foundations merge; append, do not replace. Entries below are for **home** (iteration 2).

## home: copy (`src/content/home.ts`)

| What | Key | Why |
|---|---|---|
| Page description | `meta.description` | Figma has no metadata. The title is `commonCopy.metadata.defaultTitle` |
| Try chip targets (4) | `hero.tryChips[].target` | Spec: chips are links (2 area filters, 2 station pages) |
| Search form name, listbox name | `search.formLabel`, `suggestionsLabel` | Accessible names |
| Search live messages: count (1 and many), no results | `search.resultCount`, `noResultsLive` | Debounced screen-reader announcements |
| No-results links (2) | `search.noResultsLinks` | Spec: give a next step when nothing matches |
| Area chip group name, result count (0, 1, many) | `works.chipsLabel`, `resultCount`, `allAreasInSentence` | The filter announces its result |
| Item hidden labels, "View on map" name suffix and target | `works.item.*` | Icons carry meaning; 3 "View on map" links need distinct names |
| Empty state: one area and all areas, 2 text variants | `works.empty` | Butterworth has no current or upcoming works (Segment 2 starts Jan 2027) |
| Sign-up: whole-line title and text, sending, success, "the whole line", send error | `works.subscribe.*` | Figma shows the idle form for one area only. Wording matches the footer newsletter |
| Line: map caption, toggle legend, station names and suffixes, callouts | `line.captions.map`, `viewToggle.label`, `stationLabel`, `provisionalSuffix`, `junctionSuffix`, `callouts` | Diagram and map need text names; callouts are the Figma diagram labels (6 stations, 10 labels) |
| Map view: region name, "Illustrative alignment.", OSM attribution and link, loading, error, zoom labels, popup link | `line.map.*` | Map view states from the spec |
| About photo alt text | `about.imageAlt` | Figma has none |
| Guide card icons and links (8) | `guide.cards[].icon`, `href` | Link cards per spec; icons as in Figma |
| Safety tip icons (6) | `safety.tips[].icon` | As in Figma |
| Progress card link, empty text | `progress.cardHref`, `empty` | Spec |
| Help strip hidden heading, careline call name | `help.title`, `help.careline.callLabel` | Accessible names |
| Section load error | `sectionError` | Spec error boundary per section |

## home: data

No new records. 3 replacement values (1 announcement summary, 2 construction update titles) so Home matches Figma: see `home-data-additions.md`.
