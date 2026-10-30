# Mutiara LRT Community Connect: Figma to frontend build plan

This plan turns the Figma prototype into a production-quality frontend through a team of AI agents. The team works in iterations: build a page group, test it, fix it, review it, commit and push it, log it, then repeat until every page is done.

Read these files before acting on this plan:

| File | What it holds |
|---|---|
| `CLAUDE.md` | House rules every agent must follow (code, design, git) |
| `docs/BRIEFING.md` | Everything the agents need to know about the Figma file, design system and product |
| `pages.json` | The page manifest: every route, its Figma frame IDs and its build status. **This is the source of truth for progress.** |
| `log.md` | One entry per iteration: what was built, what the tester criticised, what was fixed, what is still open |
| `docs/USER-CHECKLIST.md` | Things the human owner must do (assets, keys, accounts). Agents never block on these silently; they log the gap and carry on. |

---

## 1. Goal

Build the **commuter site** from Figma file `8kWWATZPol9TwztOw8MYG4` as a maintainable Next.js 16.4.2 (App Router, Turbopack) + TypeScript codebase, and deploy it to Vercel.
- Every page must match the design 1:1 in light and dark mode.
- Every page must work from 320 px phones to 1920 px desktops.
- The copy must be clear and correct.
- Every link must lead somewhere.

### Owner decisions (30 Oct 2026)

| Topic | Decision |
|---|---|
| Stack | Next.js 16.4.2 with the App Router and Turbopack, TypeScript strict |
| Folder structure | The main agent decides, guided by the qualities in `CLAUDE.md` §2, and documents it in `ARCHITECTURE.md` |
| Hidden content | The content writer also writes everything Figma doesn't show: all options, tab panels, paginated and "show all" lists, accordion answers, and the records behind template pages (all 22 stations, all tickets) |
| Scope | Commuter site only. The admin console (10 pages) is **out of scope**; those pages are `skipped` in `pages.json`. Don't build them, and don't link to `/admin` from the commuter site. |
| Map | Leaflet + OpenStreetMap. No Google Maps. |
| UI/UX designer model | Opus 5.5, medium effort (confirmed) |
| Careline and email | "MRTCareline 1800-88-6782" and `help@mutiaraconnect.my` are confirmed. Use them as given; don't tag them `VERIFY`. |
| Line facts | 29.67 km, 22 stations, 2 depots, 2031 opening and the segment dates are confirmed. Don't tag them `VERIFY`. |
| Social media | No real URLs, and that's accepted. Show the social names as plain text, not links (see §3 item 4). |
| Construction photos | Keep the grey `ImagePlaceholder`s from the design. |
| Hosting | Vercel. The main agent deploys with the Vercel CLI (§6a). |

---

## 2. The team

| Role | Agent file | Model | Effort | Owns |
|---|---|---|---|---|
| Main agent (orchestrator) | `.claude/agents/orchestrator.md` | Opus 5.5 (`claude-opus-5-5`) | Extra high (`xhigh`) | Design system, codebase structure, page list, delegation, final review, commits, pushes, Vercel deploys, `log.md` |
| Builder | `.claude/agents/builder.md` | Sonnet 5.5 (`claude-sonnet-5-5`) | High | Turns Figma frames into code, including interactions and responsive behaviour |
| UI/UX designer | `.claude/agents/ux-designer.md` | Opus 5.5 | Medium | Writes the interaction and responsive spec the builder follows, because Figma is static |
| Tester | `.claude/agents/tester.md` | Opus 5.5 | Medium | Tests each page against the definition of done and sends issues back to the right owner |
| Content writer | `.claude/agents/content-writer.md` | Opus 5.5 | Medium | Rewrites placeholder copy so it is grammatical, plain and easy to understand, without changing facts. Also writes the content Figma doesn't show: every option in dropdowns and filters, every tab panel, every paginated or expanded list, and every record behind a template page. |

**How a "team" is formed.** A team is one builder, one UI/UX designer, one tester and one content writer, all working on one page group.
- The main agent spawns and coordinates all four.
- Team members do not spawn agents themselves (`Agent` is disallowed in their files). This keeps every handoff visible to the main agent and in the log.
- The main agent may run **up to two teams at once** on different page groups. Each team works in its own git worktree (section 6).

---

## 3. Definition of done (per page)

A page is `done` in `pages.json` only when all six checks pass. The table also says how each check is verified, so "done" is never a matter of opinion.

| # | Requirement | Verified by |
|---|---|---|
| 1 | **Built correctly**: layout, spacing, type, colour and components match Figma in light and dark mode | Playwright screenshots at 1440 and 390 px, compared with the Figma frame screenshots in `tests/visual/reference/`. Pixel diff within tolerance (default 3% of pixels, set per page in `pages.json`), plus a written side-by-side review by the tester. Dark mode is compared with the dark reference frames where they exist. Otherwise it is checked against the dark token rules in `docs/BRIEFING.md` §4.3. |
| 2 | **Code quality**: follows `CLAUDE.md`; type check and lint clean | `npm run typecheck`, `npm run lint`, `npm run check:tokens` (no hard-coded colours or font sizes) all exit 0 |
| 3 | **Every screen size**: renders correctly from 320 to 1920 px | `npm run test:responsive` at 320, 360, 390, 414, 768, 1024, 1280, 1440 and 1920 px. Checks: no horizontal scroll, nothing clipped, tap targets at least 44 × 44 px below 768 px, the header switches to the mobile header below 1024 px. The tester also looks at the screenshots. |
| 4 | **Navigation works**: every link and button leads somewhere | `npm run test:links` crawls every route, clicks every internal link and button, and fails on 404s, dead `href="#"` links and buttons with no handler. External links must point to a real URL from `docs/BRIEFING.md` §8. **Accepted exception:** the social media names in the footer have no URLs by owner decision. They render as plain text, not as links or buttons, so they are not counted as dead links. |
| 5 | **Organised code**: files are in the right place | The tester checks the new files against `ARCHITECTURE.md` and the qualities in `CLAUDE.md` §2. Lint enforces the dependency direction the main agent set up. |
| 6 | **Content is correct** for the page | The tester compares the rendered text with the content writer's files for the page, and those files with the Figma frame's meaning. **Hidden content counts too:** every tab, filter option, dropdown option, accordion item, paginated page and template instance (e.g. all 22 stations) shows real, sensible content. None of it is empty, duplicated or placeholder. Counts shown in the UI match the data, e.g. tabs reading Current 3, Upcoming 2 and Past 14 mean 3, 2 and 14 records. No lorem ipsum, no "TODO" visible. Facts that can't be confirmed are tagged `VERIFY` and listed in `docs/content/verify.md`. |

Every page must also pass `npm run test:a11y` (axe: no serious or critical issues) and `npm run build`.

---

## 4. Phases

### Phase 0: Set up (main agent, before any team starts)

1. **Read the Figma file.** Use the Figma MCP tools on the "Prototype — Commuter" page. The "Prototype — Admin" page is out of scope.
2. **Audit the repo.** If the repo already has a design system (tokens, theme files, a component library), list what it contains in `log.md`.
3. **Decide the design system.** Pull the variables (collection "MYDS Colour", modes Light and Dark) and the text styles from Figma. Generate one token source with a light block and a dark block, plus the styling-layer mapping (e.g. the Tailwind theme). **Replace the old design system completely**: delete old token files and map or delete old components. Document the result in `docs/design-system.md`.
4. **Set up the codebase:**
   - **Stack:** Next.js 16.4.2, App Router, Turbopack, TypeScript (strict). If the repo already has a Next.js app, upgrade it in place rather than starting over.
   - **Structure:** choose the folder structure yourself, meeting the qualities in `CLAUDE.md` §2, and write `ARCHITECTURE.md` explaining it.
   - **Tooling:** lint and format, test tooling, and all the `npm run` scripts in `CLAUDE.md` §5.
   - **App shell:** the root layout with the theme (Light, Dark, System, no flash), fonts, and a single place where routes are defined.
   - **Data layer:** the mock data and data-access layer, with typed domain models for stations, announcements, construction updates, tickets, FAQ and site info.
5. **Finish the page list.**
   - Confirm every commuter page in `pages.json` against Figma.
   - Add any commuter page Figma links to that is missing from the manifest.
   - Leave the `skipped` admin pages alone.
6. **Export visual references.** For every frame ID of a non-skipped page in `pages.json`, take a Figma screenshot and save it to `tests/visual/reference/<page-id>--<viewport>--<theme>.png`.
7. **Set up Vercel** (§6a): `vercel link`, then a first production deploy of the scaffold. Next.js on Vercel needs no `vercel.json`.
8. **Choose the skills** for each agent (§4a): take stock, install what's missing from trusted sources, write `docs/skills.md`, and set each agent's `skills:` frontmatter.
9. **Commit** "chore: scaffold codebase and design system", push, deploy, and write log entry 0 with the production URL and the skills chosen.

### Phase 1: Shared layer (one team, foundations group)

Build everything the pages share, before any page:
- **Layout:** header (desktop and mobile, guest and signed in, solid and transparent, menu open), nav panel and mobile menu drawer, notification bar, footer (desktop and mobile), section bar, docs layout
- **UI parts:** buttons, tags, form fields, switch, segmented control, tabs, accordion, breadcrumb, cards
- **Patterns:** the line rail, the vertical timeline and stepper, the theme switcher

The content writer writes the shared copy and data in this iteration too:
- navigation labels and the footer
- notification bar messages
- the search index behind the home search suggestions (stations, roads and areas)
- the core mock data set: all 22 stations, announcements, construction updates, FAQ, tickets and the signed-in user

Later page iterations extend this data rather than starting their own.

The tester checks the shared layer on a development-only components route showing every variant and state. That route must not be reachable in production.

### Phase 2: Pages (one iteration per page group)

Run in this order, at most two groups at once:

| Iteration | Group | Pages |
|---|---|---|
| 2 | home | Home (including the menu-open and search-suggestions states) |
| 3 | project | Overview, About the line, Stations, station page (template for all 22 stations), Construction progress, FAQ |
| 4 | traffic | Overview, Traffic map, Route view, Announcements |
| 5 | report-track | Overview, Report an issue, Report submitted, Track a ticket |
| 6 | account | Log in, Sign up, Forgot password, Profile & settings |
| 7 | legal-help | Terms, Privacy, Contact us, Accessibility, Sitemap, 404 page |
| — | admin-1, admin-2 | **Skipped**: out of scope by owner decision |

### Phase 3: Final sweep (main agent)

1. Run the whole test suite on the merged `main` branch.
2. Crawl every route for links.
3. Deploy to production, then have the tester run the links, responsive and accessibility tests and a Lighthouse pass (performance, accessibility, best practices) **against the live Vercel URL**, at mobile and desktop.
4. Fix regressions through a final team pass if needed.
5. Write the closing `log.md` entry, titled `## Final sweep`, with the full list of open issues and `VERIFY` items.
6. Delete `.claude/hooks/.build-active` so the Stop hook switches off.

## 4a. Skills

Skills are packaged instructions for doing one kind of task well, e.g. a shadcn/ui skill for consistent components, or a Playwright testing skill. **The main agent decides which skills each agent uses, and every agent must use the skills it is given.**

**In Phase 0, the main agent:**
1. **Takes stock** of the skills available in this Claude Code setup: project skills in `.claude/skills/`, personal skills, plugins, and the Figma MCP skills (`figma-use`, `figma-design-to-code`).
2. **Finds the gaps** each role needs. Candidates to consider:

   | Role | Consider |
   |---|---|
   | Main agent | Figma design-system and design-to-code skills; a Next.js / React best-practices skill; a code-review skill |
   | Builder | **shadcn/ui** (accessible, consistent primitives); `figma-design-to-code`; a Next.js App Router / React performance skill; a frontend-design skill; a Tailwind skill |
   | UI/UX designer | `figma-use` / `figma-design-to-code` (to read frames); frontend-design; accessibility review; interaction and motion guidelines |
   | Tester | A Playwright / web-app testing skill; accessibility review (WCAG 2.1 AA); a visual-regression skill if available |
   | Content writer | UX copy / microcopy; plain-language editing; `figma-design-to-code` (to extract text) |

3. **Installs missing skills** only from trusted sources: official vendor skills (Anthropic, Vercel, shadcn, Figma) or well-known public repos.
   - Read a skill's `SKILL.md` and any scripts before installing it.
   - Install project skills into `.claude/skills/` and commit them, so every worktree and agent gets the same versions.
   - Never install a skill that asks for secrets or runs unexplained scripts.
4. **Writes `docs/skills.md`** recording:
   - each skill, its source and version, and why it was chosen
   - which agents use it, and for which tasks
   - any rules that override it (see the precedence below)
5. **Wires the skills in.** It lists each agent's skills in that agent's `skills:` frontmatter, so they preload, and also names them in every team brief.

**Precedence when a skill disagrees with the plan:** owner decisions (§1), then `CLAUDE.md`, then Figma and `docs/BRIEFING.md`, then the skill. For example, a shadcn/ui skill decides *how* a component is built (accessible primitives, composition, variants), but it is restyled to match Figma exactly with the project's tokens. No default shadcn look, colours or radii.

**During iterations:**
- Every agent invokes its assigned skills (Skill tool) before starting its task, and says in its summary which skills it used.
- If an agent finds a skill missing or unhelpful, it says so in its summary. The main agent can change the mapping in `docs/skills.md` and log the decision. Changes to `skills:` frontmatter take effect the next time that agent is spawned.

## 4b. Delegation to Antigravity (from iteration 2)

Owner decision (30 Oct 2026), to cut Claude token use: bulk, repetitive work (mock records, e2e test files, repeated page templates, digests of long logs) is delegated to the Antigravity CLI by the agent that owns it. `docs/delegation.md` lists what goes to agy, the exact command and models, the brief template, and the verify steps. Judgement, Figma work, reviews, `pages.json`, `log.md`, git and deploys stay with Claude. Every delegated result is checked by the delegating agent (`npm run verify:quick` and a diff read) before handing back. If agy fails, the agent does the work itself.

**Paused (owner, 30 Oct 2026):** the Antigravity quota is used up, so delegation is off until the owner turns it back on. To save tokens, team agents run on Sonnet with effort medium; the main agent runs on Opus with effort medium, never above high. Mechanical work may go to a short-lived Haiku agent instead.

Owner decision (30 Oct 2026), token budget: every agent follows `docs/token-budget.md` (quiet commands with logs in `.logs/`, targeted reads, small Figma reads, short-lived agents, a fixed return format). For a fix round the main agent may start a fresh agent instead of continuing one whose context ended above ~250k; the fresh agent reads the QA file.

---

## 5. One iteration, step by step

```
main: pick next group (status "todo" in pages.json) → create worktree + branch
  ├─ content writer ─┐  (in parallel)
  ├─ UI/UX designer ─┘  → page copy + mock data (content), docs/specs/<page>.md (UX)
  ├─ builder           → code, using Figma + spec + content
  ├─ tester  ──► issues? ──► owner fixes ──► tester re-tests   (max 3 rounds per owner)
  └─ team result back to main
main: own review ──► issues? ──► team fixes ──► main re-reviews  (max 2 rounds)
main: merge → commit → push → update pages.json + log.md → next group
```

1. **Prepare.** The main agent sets the group's pages to `in-progress` in `pages.json`. It creates the worktree (§6) and writes a short brief for the team. The brief gives:
   - the worktree path
   - the dev-server port
   - the page IDs and Figma frame IDs
   - the shared components available
   - anything carried over from earlier logs
2. **Content and UX, in parallel.**
   - **Content writer:** writes the typed copy for each page and the mock data records the page shows, in the places `ARCHITECTURE.md` defines. It also writes `docs/content/<page>.md` (before and after, with reasons). This includes content Figma doesn't show (see its agent file): all dropdown and filter options, every tab panel, every paginated or "show all" list, and the records behind template pages. All of it must be consistent with the counts and facts visible in Figma.
   - **UI/UX designer:** writes `docs/specs/<page>.md` from the template in its agent file. It covers states, interactions, responsive behaviour at every breakpoint, motion, focus order, keyboard use, and empty, loading and error states.
3. **Build.** The builder implements each page:
   - from the Figma frames (desktop, mobile and dark), the UX spec and the content file
   - reusing shared components and adding new shared ones only when the spec needs them
   - running `npm run verify:quick` before handing back
4. **Test.** The tester runs the definition-of-done checks and writes `docs/qa/<page>.md`.
   - Each issue has an owner (`builder`, `ux-designer` or `content-writer`), a severity, and steps or a screenshot.
5. **Fix rounds (max 3 per owner).**
   - The main agent sends each owner its issues, continuing the same agent so it keeps its context.
   - The owner fixes, and the tester re-tests only the failed checks.
   - If an owner still has open issues after 3 rounds, the tester marks them `unresolved` and hands back.
6. **Main review (max 2 rounds).**
   - The main agent runs `npm run verify` itself.
   - It looks at the screenshots next to the Figma references.
   - It reads the diff for structure and code quality.
   - Any issues go back to the team as one batch per round.
7. **Close.** The main agent:
   - merges the team branch into `main`
   - commits with a conventional message, e.g. `feat(traffic): build traffic overview, map, route view and announcements`
   - pushes
   - deploys to production (§6a) and smoke-tests the live URL: every route in the group loads, there are no console errors, and the links work (`npm run test:links -- --base-url <production URL>`)
   - sets each page to `done`, or `blocked` with a reason, in `pages.json`
   - writes the `log.md` entry (§7)
   - removes the worktree
8. **Repeat** with the next `todo` group until none are left, then run Phase 3.

### Failure rules

- **Never push a red build.** Type check, lint and `npm run build` must pass on every push. If a page cannot reach that state, revert that page's changes and mark it `blocked`.
- **Visual or content issues left after all rounds** do not stop the push, as long as the build is green. The page is marked `blocked`, and each open issue is written in `log.md` under "Open".
- **A missing asset or key** from `docs/USER-CHECKLIST.md` is never a reason to stop. Use the documented fallback (`docs/BRIEFING.md` §9), log it, and move on.

---

## 6. Git and worktrees

- **One branch per iteration:** `iter/<n>-<group>`, in a worktree at `../mutiara-wt/<group>`. Create it with `git worktree add ../mutiara-wt/<group> -b iter/<n>-<group> main`.
- **Dev-server ports:** each worktree runs its dev server on its own port. The first team uses 5173 and the second uses 5174.
- **Merging:** merge into `main` with `--no-ff` so each iteration stays visible in history.
- **Commits:** Conventional Commits (`feat`, `fix`, `refactor`, `test`, `docs`, `chore`), with the scope set to the page group.
- **Pushing:** push `main` after each iteration. Never force-push, and never rewrite pushed history.

## 6a. Deploying to Vercel

The main agent deploys with the Vercel CLI. The owner has already run `vercel login` on this machine (`docs/USER-CHECKLIST.md` #5).

- **Once, in Phase 0:** run `vercel link --yes` in the repo root to create the project. Don't commit `.vercel/` (it's git-ignored).
- **After every pushed iteration:** run `vercel deploy --prod --yes`.
  - Record the deployment URL in the log entry.
  - On the first deploy, store the stable production URL in `pages.json` under `deploy.productionUrl`.
- **Routing:** Vercel serves the Next.js app natively, so deep links like `/project/stations/s20` work directly, and unknown paths show the app's `not-found` page.
- **If a deploy fails,** read the build log (`vercel inspect <url> --logs`). Fix the cause on `main`, push, and deploy again. A failed deploy counts as a red build: don't start the next iteration until production is green.
- **Never** commit secrets, and never run `vercel env pull` into a committed file. This build needs no environment variables.

---

## 7. `log.md` format

Every iteration appends one entry:

```markdown
## Iteration 4: traffic (2026-11-02)

**Pages:** traffic-overview ✅, traffic-map ✅, route-view ✅, announcements ⚠️ blocked
**Commit:** a1b2c3d `feat(traffic): ...`
**Deploy:** https://mutiara-connect-abc123.vercel.app (production: https://mutiara-connect.vercel.app). Smoke test passed.

### Done
- ...

### Critique (tester and main review)
- Round 1 (tester → builder): map controls overlapped the notification bar at 390 px. Fixed.
- Round 1 (tester → content): "Lane closure on Jalan Sultan Azlan Shah" casing inconsistent. Fixed.
- Main review 1: route view rail line did not reach the last stop. Fixed.

### Open
- announcements: dark-mode table header contrast 3.9:1 (needs 4.5:1). Owner: builder. Carried to final sweep.

### Skills used
- builder: shadcn/ui, figma-design-to-code, …; tester: playwright testing, accessibility review; …

### Decisions
- Route view keeps the selected station in the URL (`?station=s09`) so it can be shared.
```

---

## 8. Resuming after a break or a context reset

Everything needed to resume lives in files, not in conversation memory:
- `pages.json` statuses say what is left.
- `log.md` says what happened and what is open.
- Worktrees on disk show unfinished iterations.

To resume, start the main agent again (§9). It reads the three, finishes any `in-progress` group, and continues.

The Stop hook in `.claude/settings.json` blocks the main agent from ending the session while any page is still `todo`, `in-progress` or `review`, or while the "Final sweep" entry is missing. Pages that are `done`, `blocked` or `skipped` count as finished.
- **Safety valve:** it gives up after 25 consecutive attempts with no change to `pages.json` or `log.md`, so a stuck loop cannot run forever.
- **On/off switch:** it is active only while `.claude/hooks/.build-active` exists. The main agent creates that file at start, so ordinary Claude Code sessions in the repo are not affected. To pause the loop, delete the file.

---

## 9. How to start

1. Complete `docs/USER-CHECKLIST.md` (items 1–6).
2. Copy this kit into the repo root, add the lines in `.gitignore.additions` to `.gitignore`, and commit.
3. From the repo root, run:

   ```bash
   claude --agent orchestrator
   ```

   This runs the main agent with its own model (Opus 5.5) and effort (extra high). Its first prompt is built in. **Do not set the `CLAUDE_CODE_EFFORT_LEVEL` environment variable**: it overrides every agent's effort setting.
4. Watch `log.md`, the GitHub commits and the live Vercel URL. To steer, type into the session, e.g. "do the traffic group next" or "pause after this iteration".
