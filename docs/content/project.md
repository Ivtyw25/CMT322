# Project group: copy changes

Copy is in `src/content/project.ts` (`projectCopy`); shared docs-page words in `src/content/ui.ts` (`docsPage`). Only edits beyond typos are listed. Mobile frames use the same text as desktop.

| Page / key | Before (Figma) | After | Why |
|---|---|---|---|
| About `overview.paragraphs[0]` | "formerly known as the Bayan Lepas LRT Project … while meeting its fast-growing mobility needs." | "formerly the Bayan Lepas LRT Project … while meeting its fast-growing need to travel." | Plainer words for second-language readers |
| About `overview.paragraphs[1]` | "With a 29.67-kilometre viaduct and 22 strategic stations … improving accessibility and easing road congestion. The main alignment links …" | "Its 29.67 km viaduct and 22 stations connect … so places are easier to reach and roads are less congested. The main route links …" | Shorter sentence; "km" format; "alignment" is jargon. Facts unchanged |
| About `overview.paragraphs[2]` | "designed with … Park & Ride facilities and last-mile connectivity" | "planned with … Park & Ride and last-mile connections" | Fewer abstract nouns |
| About `overview.paragraphs[3]` | "supported by two operational depots along the alignment. Integrated with future transit systems, the line will lay the foundation for long-term prosperity …" | "with 2 depots along the line. Linked to future transit systems, the line will support Penang's growth and a better quality of life …" | Numerals; removed marketing phrasing |
| About `travelling.rows[1]` | "From 6:00 am to midnight." | "From 6 am to midnight." | Time format "10 pm" as elsewhere |
| Construction `header.lede` | "Penang's first LRT system … The project is a catalyst for faster, greener and more inclusive mobility for everyone. Follow our journey as we bring this progress to life, step by step and stretch by stretch." | "Penang's first LRT line … It will make travel faster, greener and easier for everyone. Follow the work here, stretch by stretch." | Removed jargon ("catalyst", "mobility"); about 40% shorter, so the head fits on mobile |
| Overview latest update body | "…mostly at night." | Uses the record body "…mostly at night to limit traffic impact." | One record, one text (Construction page version) |
| Stations `related[0]` | "Routes, features and the timeline to 2031." | "Background, routes, stations and the timeline to 2031." | One description per page across Related pages lists |
| Station `worksites.lede` | "The fenced worksite, lane changes and the pedestrian detour around the station." | "The fenced worksite, lane changes and detours around the station." | The template serves 22 stations; not every station has a pedestrian detour |
| FAQ `stillNeedHelp.careline` | "MRTCareline 1800-88-6782, 24 hours" | Same text, built from site info | Number stays in one place |
| FAQ `train-frequency` answer (data) | "The timetable … will be published before the line opens." | "Trains are planned to run every 4 minutes when the line opens, and up to every 2 minutes …" | Matched the About page (verify P2) |

## Notes for builders

- Station names, codes, subtitles, lede, `serves`, connections and stages come from `getStation()`; stage words from `uiCopy.stationStages`.
- Construction: the timeline heading is `timelineTitle ?? title`; the TOC label is `projectCopy.construction.toc.update(shortDate, tocLabel)`.
- About timeline uses `milestone.longTitle`; Construction timeline uses `milestone.title`.
- FAQ "Show all 22 questions" is `uiCopy.actions.showAll(items.length, 'questions')`.
- The MRT Corp site name in the About note is plain text, not a link (BRIEFING §9).
