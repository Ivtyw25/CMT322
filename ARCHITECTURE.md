# ARCHITECTURE

Next.js 16.4.2 (App Router, Turbopack), React 19, TypeScript strict, Tailwind CSS 4. No backend: typed mock data behind async functions. Only the main agent edits this file.

## 1. Folders

```
design/tokens/figma-tokens.json   Token source extracted from Figma. Edit, then `npm run tokens`.
src/
  app/                 Routes only. Thin: fetch data, compose features, set metadata.
    (site)/            Pages with the site header, notification bar and footer (layout.tsx).
    (auth)/            Log in, Sign up, Forgot password (split layout, no site footer).
    dev/components/    Development-only gallery of every shared component. 404 in production.
    layout.tsx         Root: <html>, fonts, theme script, providers.
    not-found.tsx      404 page.
  features/<group>/    Page sections and page-specific widgets, one folder per page group:
                       home, project, traffic, report-track, account, legal-help.
  components/
    ui/                Shared primitives: button, tag, field, switch, tabs, accordion, … (shadcn-based, restyled)
    layout/            Header, mobile menu, nav panel, notification bar, footer, section bar, docs layout
    patterns/          Line rail, timeline, stepper, theme switcher, image placeholder, map (client-only)
  content/             All copy. One file per page group (home.ts, project.ts, …) plus common.ts, nav.ts.
  data/
    models/            Domain types (Station, Announcement, Ticket, …). No logic.
    mock/              Typed mock records. Only data/api reads them.
    api/               Async access functions (getStations, getTicket, …). The future real API swaps in here.
  config/routes.ts     Every route path, once. Links use these helpers, never string literals.
  lib/                 Framework-free helpers and providers: cn, theme/, session/, format/ (dates, times).
  styles/              tokens.css (generated), globals.css (Tailwind + base), fonts.ts.
  assets/              Images and brand files imported with next/image (images/, brand/google/).
tests/
  e2e/<page-id>.spec.ts  Behaviour per page (states from the UX spec). e2e/shared/ for site-wide behaviour.
  responsive/ links/ a11y/ visual/   Suites driven by pages.json (pages that are in-progress or later).
  visual/reference/      Figma screenshots: <page-id|state>--<1440|390>--<light|dark>.png
  support/               pages.ts (page → URLs), browser.ts (theme/session setup), external-links.ts
scripts/               tokens, check-tokens, test runners, verify.
docs/specs/ docs/content/ docs/qa/   UX specs, content notes, QA reports, one file per page.
```

## 2. Where do I put…?

| Thing | Place |
|---|---|
| A new page | `src/app/(site)/<path>/page.tsx`, path from `config/routes.ts` (add it there first; main agent approves) |
| A section used by one page group | `src/features/<group>/<section-name>.tsx` |
| A widget used by two or more groups | `src/components/{ui,layout,patterns}/` (tell the main agent; shared changes land on `main` first) |
| Words, labels, alt text, aria-labels, metadata | `src/content/<group>.ts` |
| Records (stations, tickets, FAQ answers, announcements) | `src/data/mock/<type>.ts` + type in `data/models` + getter in `data/api` |
| Colour, type, radius, shadow, width | `design/tokens/figma-tokens.json` → `npm run tokens` (main agent only) |
| A hook or helper | `src/lib/<topic>/` (no JSX) or next to the one component that uses it |
| An image | `src/assets/images/`, imported statically into `next/image` |

## 3. Rules the linter enforces

- **Dependency direction:** `app → features → components → lib · config · content · data · assets · styles`. Nothing imports `src/app`. `components` never import `features`. `lib`, `config` and `data` never import UI or copy. `content` never imports data. Only `data/api` reads `data/mock`.
- **Imports** across folders use `@/…`; `../` is not allowed (`./` inside a folder is fine).
- **No copy in JSX** (`react/jsx-no-literals`): text comes from `src/content`.
- **No hard-coded design values** (`npm run check:tokens`): no hex/rgb/hsl, no Tailwind default palette, no arbitrary `text-[…]`, `bg-[…]`, `rounded-[…]`, `shadow-[…]`.

## 4. Conventions

- **Files** kebab-case (`station-card.tsx`); components PascalCase named exports; one component per file; no default exports except Next.js route files.
- **Server components by default.** `'use client'` only on the interactive leaf. Pages fetch with `await getX()` from `@/data/api` and pass plain props down.
- **Copy objects:** `export const <group>Copy = { … } as const`. Copy that needs a value is a function: `resultCount: (n: number) => \`${n} results\``. Records never live in copy.
- **Styling:** Tailwind utilities on tokens only. Type: `type-<style>` utilities (`type-heading-s lg:type-heading-l`), mobile first. Variants with `cva` in the component file; merge with `cn()`. No `dark:` colour variants: tokens swap per theme.
- **Breakpoints:** Tailwind defaults. Below `lg` (1024 px) the mobile header shows. Content width `max-w-content` (1200 px) with `px-5 md:px-8 lg:px-10`; docs pages: sidebar `w-docs-sidebar`, article `max-w-article`, aside `w-docs-aside`.
- **Primitives:** shadcn/ui (Radix) for behaviour, restyled to Figma with tokens. Run `npx shadcn add <name>`, then restyle; discard any change it makes to `globals.css`.
- **Icons:** `lucide-react`, stroke 2. Decorative icons `aria-hidden`.
- **Links:** `next/link` with `routes.*`. External: `target="_blank" rel="noopener noreferrer"` plus an "opens in new tab" label from content. Social names are plain text.
- **Theme:** `useTheme()` from `@/lib/theme/theme-provider` (`preference`, `resolvedTheme`, `setPreference`). Storage key `mlc-theme`. Never touch `data-theme` yourself.
- **Session (mock):** `@/lib/session` (built in the foundations iteration), storage key `mlc-session` holding `{ "userId": "user-meiling" }`. Protected routes are listed in `config/routes.ts`.
- **Map:** Leaflet loaded with `next/dynamic({ ssr: false })` from `components/patterns/map/`. OSM attribution visible. Light tiles in both themes.
- **Testing hooks:** the desktop header root has `data-header="desktop"`, the mobile header `data-header="mobile"`. Controls smaller than 44 × 44 px on mobile get the `hit-area` utility.
- **Tests:** each page has `tests/e2e/<page-id>.spec.ts`. New concrete URLs (e.g. a new template) go in `tests/support/pages.ts`. Visual states go in `tests/visual/states.ts`.
