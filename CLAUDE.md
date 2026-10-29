# CLAUDE.md: house rules for Mutiara LRT Community Connect

Every agent in this repo follows these rules. Other files cover the rest:

| File | What it holds |
|---|---|
| `PLAN.md` | The build plan |
| `docs/BRIEFING.md` | Product and design knowledge |
| `pages.json` | Progress |
| `ARCHITECTURE.md` | Where things live in the code. The main agent writes it in Phase 0. |

## 1. Stack

**Fixed by the owner:**
- **Framework:** Next.js **16.4.2** with the **App Router** and **Turbopack**, React, TypeScript (strict)
- **Map:** Leaflet + OpenStreetMap, with the © OpenStreetMap contributors attribution visible. No Google Maps.
- **Hosting:** Vercel, deployed by the main agent with the Vercel CLI (`PLAN.md` §6a)
- **Scope:** commuter site only. The admin console is out of scope: no `/admin` routes or links.
- **Backend:** none. All data comes from typed mock data behind a small data-access layer (async functions), so a real API can replace it later without touching pages or components.

**Chosen by the main agent in Phase 0**, and recorded in `ARCHITECTURE.md`:
- styling approach; Tailwind is the default, mapped to CSS variables generated from Figma
- test tooling; Playwright for e2e, responsive, link and visual tests, and axe for accessibility, are the defaults
- lint and format setup
- folder structure

### Next.js notes

- **Server and client components:** server components are the default. Use client components only where there is state, effects, browser APIs or event handlers. Keep client boundaries small, at the interactive leaf, not at whole pages.
- **Leaflet** touches `window`, so load the map client-only (`next/dynamic` with `ssr: false`, or an equivalent).
- **Routing:**
  - dynamic routes for station pages and tickets, statically generated where possible (e.g. all 22 stations)
  - a `not-found` page for 404s
  - metadata (title, description) set per route
- **Fonts and images:** load Poppins and Inter with `next/font`. Serve the design's images with `next/image` and explicit sizes.
- **Theme:** dark mode must not flash on load. Set the theme on `<html>` before first paint, and make sure hydration doesn't complain.

## 2. What we want from the codebase

The main agent decides the folder structure. These are the qualities it must have; the tester checks them (definition of done item 5).

- **Predictable:** someone new can guess where a thing lives.
  - one place for routes
  - one place for shared UI
  - one place for page copy
  - one place for mock data and data access
  - one place for design tokens
- **Thin routes:** route files compose components and fetch data. Behaviour lives in features or components, not in route files.
- **One source of truth:**
  - a shared component exists once
  - design values exist once, as tokens generated from Figma
  - each piece of copy exists once
  - each route path is defined once and referenced, never retyped as a string
- **Separated concerns:**
  - copy is separate from components, so the content writer can work alone and a Bahasa Melayu version is possible later
  - data is separate from presentation
  - styling is separate from logic
- **Clear dependency direction:**
  - shared UI doesn't depend on pages or features
  - nothing depends on route files
  - enforce this with lint rules where practical
- **Small, typed, named:**
  - small focused files
  - explicit prop and data types
  - consistent naming throughout
  - no dead code, no commented-out code, no duplicate helpers
- **Documented:** `ARCHITECTURE.md` explains the structure, the conventions and "where do I put…?" in under two pages. Team agents read it before working and follow it exactly. Only the main agent changes it.

## 3. Code rules

- **TypeScript:** `strict: true`. No `any`, no `@ts-ignore`. Use `unknown` and narrow it.
- **No hard-coded design values.** Colours, font sizes, line heights, radii, shadows and spacing come from tokens. A `check:tokens` script fails on hex, `rgb()`, `hsl()` or pixel font sizes outside the token source.
- **No hard-coded copy in components.** Every word comes from the content layer, and every record from the mock data.
- **Accessibility:**
  - semantic HTML first (`button` for actions, links for navigation)
  - every interactive element reachable and visible on keyboard focus
  - `aria-*` only where HTML is not enough
  - meaningful `alt` text, or `alt=""` if decorative
  - colour is never the only signal
- **Responsive:**
  - mobile-first
  - the desktop design is 1440 px and the mobile design is 390 px; the UX spec decides behaviour in between
  - no horizontal scroll at any width from 320 px
- **Theme:**
  - Light, Dark and System
  - System follows `prefers-color-scheme` live
  - the choice is saved per browser, with storage access wrapped in try/catch
- **Links:**
  - internal links use `next/link` and the shared route definitions
  - no `href="#"`
  - external links open in a new tab with `rel="noopener noreferrer"` and an "opens in new tab" label
  - social media names in the footer have no URLs (owner decision). Render them as plain text styled as in Figma: not links or buttons, never focusable, never counted as dead links.
- **State:** React state and context. No global store unless the spec needs one; if so, record it in `log.md`.
- **Tests:** every page has a behaviour spec covering its interactive states from the UX spec.

## 4. Design rules from the Figma file

These are decisions already made with the owner. Do not undo them.

- **Line-rail motif:** stations, timelines and menus show stops on a vertical line (dot + line). Reuse the shared line-rail and timeline components; don't invent new list styles for these.
- **Accent bar:** a short 48 × 4 px primary bar above section headings. Keep it.
- **Meta strings:** no middle dots (`·`) to join metadata. Use separate lines, icons with labels, or label/value pairs.
- **Link labels:** no arrow characters stuck onto link text ("See all →"). Use a proper chevron icon where the design shows one.
- **Specific labels:** nothing vague like "Explore" or "Learn more". Say what the link does.
- **Mobile adaptations** are already designed in Figma (the "M · …" frames). Follow them:
  - docs sidebars become a section bar
  - the map comes first on traffic pages
  - tables become cards
  - horizontal timelines and steppers become vertical
- **Google sign-in button:** use the official Google button SVGs exactly as Google's branding guidelines require. Do not restyle them.

## 5. Commands

The main agent creates these npm scripts in Phase 0. The names are fixed because the plan, the hook and the agents use them; how they work is up to the main agent.

| Command | Does |
|---|---|
| `npm run dev -- --port <p>` | Dev server with Turbopack (each worktree uses its own port) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint + Prettier check |
| `npm run check:tokens` | Fails on hard-coded colours or font sizes |
| `npm run test:e2e` | Behaviour tests |
| `npm run test:responsive` | Overflow, clipping and tap-target checks at all breakpoints |
| `npm run test:links` | Crawls routes and clicks every link and button (supports `--base-url <url>` for the live site) |
| `npm run test:a11y` | axe on every route, light and dark |
| `npm run test:visual` | Screenshot vs Figma reference diff |
| `npm run verify:quick` | typecheck + lint + check:tokens + e2e for changed pages |
| `npm run verify` | Everything above + `npm run build` |
| `vercel deploy --prod --yes` | Production deploy (main agent only) |

## 6. Git

- Only the main agent commits, merges, pushes and deploys. Team agents leave their changes uncommitted in their worktree.
- Commit messages follow Conventional Commits with a group scope, e.g. `feat(project): build stations list and station page template`.
- Never commit `.env*`, `.vercel/`, `.next/`, visual diff output or `node_modules/`.
- Never force-push.

## 7. Working agreements for agents

- **Return short summaries.** Give the main agent at most 200 words with links to your files. Put detail in your files: `docs/specs`, `docs/content`, `docs/qa`.
- **Work in the brief's worktree.** All file paths in your brief are absolute; stay inside that worktree.
- **Use your assigned skills.** Invoke the skills named in your brief and in `docs/skills.md` before you start, and follow them within the precedence in `PLAN.md` §4a.
- **Follow `ARCHITECTURE.md`** for where new files go. If something doesn't fit, ask the main agent in your summary rather than inventing a new place.
- **When unsure, look again.** Before guessing, look at the Figma frame again (Figma MCP `get_design_context` / `get_screenshot` with the frame ID from `pages.json`). If Figma doesn't answer it, follow the UX spec. If the spec doesn't answer it, ask the main agent in your summary. Never invent product facts.
