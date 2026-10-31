# Facts to verify

Facts that could not be confirmed. Each is also tagged `// VERIFY:` in code. Facts in BRIEFING §8 are not listed.

| # | Page / file | Key | Issue | Value kept |
|---|---|---|---|---|
| 1 | Notification bar, `mock/site-notices.ts` | first notice | Notice says "one lane each way from 10 pm to 6 am", but the linked Jalan Sultan Azlan Shah closure runs all day until Jul 2027 | Figma text kept on both |
| 2 | Track / Profile / KOMTAR, `mock/tickets.ts` | MLC-261028-0482 | Track shows "Driveway blocked by site hoarding" at Lebuh Kampung Jawa; Profile and KOMTAR show "Hoarding blocking driveway on Jalan Penang" with the same ID | Track version kept for 0482; Jalan Penang item became ticket MLC-261028-0455 |
| 3 | Construction, `mock/construction-updates.ts` | piling update | "Piling starts at George Town station site" does not say which station | Linked to S18 |
| 4 | KOMTAR station, `mock/stations.ts` | connectsTo | Figma lists only S19 (0.79 km) | Kept |
| 5 | Nav panel vs Profile, `mock/stations.ts` | S13 area | "USM, Gelugor" in the nav panel, "Gelugor" on Profile | "USM, Gelugor" |
| 6 | Nav Report & Track panel | account note | Figma said an account is needed to track; Track is a public route | Text changed to match the routes |
| 7 | FAQ, `mock/faq.ts` | land acquisition answer | Process and compensation terms are legal claims | General wording only |
| 8 | FAQ, `mock/faq.ts` | property damage answer | Claims process and contractor liability | General wording only |
| 9 | FAQ, `mock/faq.ts` | station access answer | Lifts and accessible routes at every station | Kept general |
| 10 | FAQ, `mock/faq.ts` | two segments answer | Segment 2 start Jan 2027 and its route | Kept as BRIEFING |
| 11 | Home map, traffic map, station pages, `mock/stations.ts` | `lat`, `lng` | Approximate coordinates for all 22 stations, estimated along the published alignment | Replace with surveyed positions |

## Home

| # | Page / file | Key | Issue | Value kept |
|---|---|---|---|---|
| H1 | Home, `content/home.ts` | `linePreview.lede` | "December 2031": BRIEFING confirms only "Operations start in 2031" (FAQ and milestone data also use Dec 2031) | December 2031 |
| H2 | Home, `content/home.ts` | `about.body` | The line as a key part of the Penang Transport Master Plan and the State Government vision | Kept, reworded |
| H3 | Home, `content/home.ts` | `help.property.body` | An independent surveyor records nearby buildings before work starts, and owners can ask for a copy | Kept |
| H4 | Home, `content/home.ts` | `help.careline.body` | Careline is "run by MRT Corp" (number and 24 hours are confirmed) | Kept |
| H5 | Home, `content/home.ts` | `linePreview.callouts.S31` | "Sultan Abdul Halim Ferry Terminal, Butterworth" and interstate express buses at Penang Sentral | Kept as Figma |
| H6 | Home vs data | announcement `sultan-azlan-shah-lane-closure` summary | Home card in Figma: "One lane each way for viaduct works." The record: "One lane closed in each direction for viaduct works." One record, one text | Resolved: record set to the Figma text (`home-data-additions.md`) |
| H7 | Home vs data | construction update `water-mains-bayan-lepas-fiz` title | Home card in Figma: "Utility relocation at Bayan Lepas FIZ". Foundations renamed the record "Water mains moved at Bayan Lepas FIZ" | Resolved: record set back to the Figma title (`home-data-additions.md`) |

## Project

| # | Page / file | Key | Issue | Value kept |
|---|---|---|---|---|
| P1 | About, `content/project.ts` | `about.routes.tabs[1].facts` | Length and journey time for PSR-A to Penang Sentral are not in Figma or BRIEFING §8 | "To be confirmed" for both |
| P2 | About and FAQ, `content/project.ts`, `mock/faq.ts` | `about.travelling.rows[0]`, `about.benefits.tabs[0]`, `train-frequency` | Figma says "every 4 minutes at opening" in the table and "about every 5 minutes in the early years" in the Daily commuters tab | Both Figma texts kept; FAQ answer follows the table (4 minutes) |
| P3 | About, `mock/construction-updates.ts` | milestone `segment-2-inspection` | Figma includes the Sungai Dua Depot in the Segment 2 public inspection, but S11 Sungai Dua is on Segment 1 | Figma text kept |
| P4 | Home vs Construction, `mock/construction-updates.ts` | `water-mains-bayan-lepas-fiz`, `piling-george-town-station` | Home card titles ("Utility relocation at Bayan Lepas FIZ", "Piling starts at George Town station site") differ from the Construction timeline ("Water mains moved at Bayan Lepas FIZ", "Piling starts at the George Town station site") | Both kept: `title` for cards, `timelineTitle` for the timeline |
| P5 | About, `content/project.ts` | `about.routes`, `about.travelling` | Figures cited from MRT Corp's site, not on the confirmed list: 23.67 km, about 45 minutes, 8 to 13 minutes, train frequency, 6 am to midnight, 1,000 car and 1,000 motorcycle bays, KTM Komuter and ETS at Penang Sentral | Figma values kept |
| P6 | About, `content/project.ts` | `about.timeline.note` | Source "laluanmutiara.mymrt.com.my" has no confirmed URL; shown as plain text, not a link (BRIEFING §9) | Plain text |
| P7 | Station template, `content/project.ts` | `station.traffic.lede`, `station.reports.lede` | Radius rules "within 1 km" (traffic) and "within 500 m" (reports) come from the KOMTAR frame; the data layer must apply the same radii | Figma values kept |
