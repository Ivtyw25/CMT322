# Project group: main agent decisions (iteration 3)

These win over the six page specs where they differ.

## Open questions answered

1. **Map/Satellite toggle:** dropped. We have OpenStreetMap tiles only (owner decision). No satellite source.
2. **Locate button** on the station map re-centres on the station.
3. **No selected card below 1280 px:** accepted as specified.
4. **Mobile table label column 128 px:** use `w-32` (Tailwind's 4 px spacing scale), not a new token.
5. **Filters and search in the URL:** yes (`?q=`, `?status=`, `?segment=`…), so views can be shared and Back works. Read them in a small client leaf with `useSearchParams` inside `<Suspense>`, so the route stays statically generated. Don't read `searchParams` in the route file.
6. **Followed stations:** a small context in `src/lib/follows/` (storage key `mlc-follows`, every storage access in try/catch, synced across tabs with the `storage` event). It isn't a global store. Logged in `log.md`.
7. **`FaqNextStep.href`** comes from `routes`, as a route key or helper, never a string.
8. **Copy keys:** the content uses `header`, not `head` (`projectCopy.overview.header`). Builders follow the content file.

## Routes added (main agent approves; slice 1 adds them to `src/config/routes.ts`)

- `routes.project.faqTopic(topicId)` → `/project/faq?topic=<id>`
- `routes.reportTrack.reportAt(stationCode)` → `/report?station=<code>` (lowercase code)
- `routes.traffic.announcement(id)` → `/traffic/announcements#<id>` (there is no announcement detail page)
- `routes.withHash(path, id)` → `<path>#<id>`, for section deep links

## Shared component changes (slice 1, landing on `main` before the page slices)

All are additive and backwards compatible. The existing gallery and Home must keep working.

| Component | Change |
|---|---|
| New `components/patterns/need-help-block.tsx`, `page-feedback.tsx` (`size="sm"`), `related-pages.tsx`, `info-list.tsx` (`<dl>` rows) | Docs page furniture, copy from `ui.docsPage` |
| `patterns/timeline` | `orientation="responsive"`: vertical below `xl`, horizontal from `xl` |
| `layout/docs-aside` | Nested items (one level) |
| `layout/docs-layout` | Optional `aside` slot, a block below the TOC |
| `ui/accordion` | Optional item eyebrow; `defaultOpen` per item; open an item from code (hash or prop) |
| `ui/segmented-control` | `orientation="vertical"` |
| `ui/link-card` | `selected` state (`aria-current`) |
| `patterns/stepper` | `variant="stages"` |
| New `patterns/map/` | Minimal client-only Leaflet map (`next/dynamic`, `ssr: false`): centre, zoom, markers, visible OSM attribution, locate (re-centre) button. Traffic extends it in iteration 4. |
| Data | `lat`/`lng` on announcements and road works (VERIFY), plus `getStationFollows` isn't needed (follows are client-side) |

## QA round 1 decisions (main agent)

- **P-QA3, KOMTAR data:** add records so S20 shows what Figma shows: 3 notices and 2 active changes. Use the Figma text. Mark them VERIFY. Home's Works list for Bukit Jambul must not change.
- **P-QA6, wording:** use the Figma wording for the Overview "Latest update" body and the third popular question, so the pages match Figma. Update docs/content/project.md.
- **P-QA7, About on mobile:** sections 6–9 stay on mobile. They are on desktop, and hiding content on mobile would be worse. The Figma mobile frame is incomplete: it stops after the rail. Add the station card below the rail as Figma shows it. The visual test compares only the height of the reference when the reference is shorter than the page.
- **P-QA8, footer:** goes to the Phase 3 final sweep, with Home's footer item.
- **P-QA9, links:** allow "Back to top" and the map locate button in tests/links as known non-DOM actions.
- **P-QA12, client leaves:** do it. Keep static headings and topic copy server-rendered.
