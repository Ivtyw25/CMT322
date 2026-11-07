# TripAdvisor-pattern trial (home page): ACCEPTED by owner 2026-11-07, recorded in CLAUDE.md §4

Revert: delete the added files and undo the one-line changes below.

## Added
- `src/components/patterns/swipe-row.tsx`: shared phone swipe row (ul/ol, snap, edge bleed, grid from 768 px via `wideClassName`).
- `src/components/patterns/swipe-row-item.tsx`: snap item (80% width on phones).
- `src/components/patterns/line-diagram/line-swipe-view.tsx`: horizontal station stops on the line (phones).

## Changed
- `src/features/home/guide-section.tsx`: SwipeRow/SwipeRowItem; card title `type-heading-3xs`.
- `src/features/home/safety-section.tsx`: SwipeRow/SwipeRowItem; tip title `type-heading-3xs`.
- `src/features/home/progress-section.tsx`: SwipeRow/SwipeRowItem; card title `type-heading-2xs`.
- `src/features/home/line-section.tsx`: passes `swipe={<LineSwipeView/>}`.
- `src/features/home/line-preview.tsx`: new `swipe` prop; phones show swipe row, rail shows from 768 px.
- `src/components/ui/button-variants.ts`: base `rounded-lg` to `rounded-full` (all variants, site-wide).
- `src/features/home/hero-search.tsx`: search form `rounded-xl` to `rounded-full`, `pl-4` to `pl-5`.
- Prettier also reformatted other files in `src/features/home/` (whitespace only).
