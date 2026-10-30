# Build log

The main agent appends one entry per iteration, using the format in `PLAN.md` §7. Newest entries go at the bottom.

**Legend:**
- ✅ done
- ⚠️ blocked (pushed with open issues)
- ⏸️ not started

---

## Iteration 0: setup (2026-10-30)

**Pages:** none (scaffold and design system)
**Commit:** d6e17b2 `chore: scaffold codebase and design system`
**Deploy:** https://mutiara-connect-9e2hh33c3-ivtyw25s-projects.vercel.app (production: https://mutiara-connect.vercel.app). Smoke test passed: `/` 200, `/dev/components` 404 in production, unknown path 404.

### Done
- **Repo audit:** no existing app, tokens, theme files or component library, so nothing to migrate. `design-assets/` moved into `src/assets/` (hero → JPEG 415 KB, illustrations → WebP, logo → 176 px PNG, favicon and Apple icon from the logo, 12 Google sign-in SVGs renamed to kebab case and otherwise unchanged).
- **Figma read:** 1 variable collection "MYDS Colour" (36 variables, Light/Dark), matching BRIEFING §4.1 exactly; 18 text styles matching §4.2; no effect styles, so radii and shadows were measured on the canvas.
- **Page list confirmed:** all 25 commuter pages and the 3 prototype states in `pages.json` match Figma frames (58 commuter frames checked). The Sitemap board lists no page missing from the manifest. Admin pages are left `skipped`.
- **Design system:** `design/tokens/figma-tokens.json` → `npm run tokens` → `src/styles/tokens.css` (Tailwind defaults cleared). See `docs/design-system.md`.
- **Codebase:** Next.js 16.4.2, React 19.3, TS strict (+ noUncheckedIndexedAccess), Tailwind 4.3, shadcn `components.json` (no CSS variables), ESLint flat config with import boundaries and `react/jsx-no-literals`, Prettier, `check:tokens`. Structure in `ARCHITECTURE.md`.
- **App shell:** root layout with Poppins/Inter via `next/font`, no-flash theme script and `ThemeProvider` (System default, live OS changes, try/catch storage), route registry `src/config/routes.ts`, data models + mock + async `data/api`, content layer.
- **Tests:** Playwright projects e2e, responsive (9 widths: overflow, clipping, 44 px targets, header switch), links (status, `#`, external rules, every button does something), a11y (axe WCAG 2.2 AA, light/dark, desktop/mobile), visual (pixelmatch vs Figma). All driven by `pages.json`. Harness smoke-tested against the placeholder home page.
- **Visual references:** 57 PNGs exported at 1× into `tests/visual/reference/`.
- **Vercel:** project `mutiara-connect` linked and deployed.

### Critique
- Self-check: `npm run verify` green. Visual suite correctly fails the placeholder home (95.7 % different), which shows the diff works.

### Open
- `pages.json` route for track is two routes (`/track`, `/track/[ticketId]`); both are covered in `tests/support/pages.ts`.
- The Google SVGs supplied are "Sign in with Google" buttons; Figma also has "Sign up with" and "Continue with" variants. Account team to check; if needed, use the official text variant closest to Figma and log it.

### Skills used
- main: figma-use, react-best-practices (read for setup), commits. Installed Vercel `react-best-practices`, `composition-patterns`, `web-design-guidelines` into `.claude/skills/`. Mapping in `docs/skills.md` and agent frontmatter.

### Decisions
- Content width is 1200 px (Figma: 1440 frame with 120 px padding), not "about 1176" as BRIEFING §4.4 says. Header 92 px desktop and 60 px mobile, plus a 1 px border.
- Figma `white` is `surface`; extra static values (hero navy, amber notification text, glass whites, scrims) are tokens with `static-` names, documented in `docs/design-system.md`.
- Radius `xl` is 10 px (Figma scale), not Tailwind's 12.
- Route groups: `(site)` with header/footer, `(auth)` for log in, sign up and forgot password.
- Tests use port 3100 (team 2 sets `TEST_PORT=3200`); dev servers use 5173/5174.
- The Sitemap board says "Report & Track needs an account". The UX designer decides in the report-track iteration whether Track needs sign-in. Report and Profile need it for sure.

## Resume note (iteration 1, foundations, in progress)

- The tester's round 1 is FAIL with 16 issues (3 major, 13 minor). The report is in the foundations worktree at docs/qa/foundations.md: builder B1–B12 (2 major), ux-designer U1–U2 (1 major: Home header Solid vs Transparent on 47:1249), content-writer 2 minor.
- Next: send each owner its issues (round 1 of 3), have the tester re-test only the failed checks, then the main review, then merge.
- The owner added Antigravity delegation from iteration 2 (docs/delegation.md, commit 724ff51, not pushed yet). Add it under Decisions in the foundations entry.
- gstack browse is not installed, so the tester used Playwright scripts instead. Its first-time build needs the owner's OK.

## Token usage (tracking from 30 Oct 2026)

Measured with `npm run usage:tokens [sessionId]`, which reads Claude Code's local transcripts. Every iteration entry from now on gets a **Tokens** line.

Session 1b750263 (Phase 0, iteration 1 build and the home spec/copy): 589 calls, 155M cache-read, 4.7M cache-write, 0.75M output.

| Agent | Calls | Cache read | Max context |
|---|---|---|---|
| Foundations builder | 168 | 68.3M | 593k |
| Main agent | 140 | 33.9M | 366k |
| Foundations tester | 99 | 21.5M | 304k |
| Foundations content writer | 73 | 13.0M | 364k |
| Home UX / home content / foundations UX | 31–41 | 5.9–6.7M | 253–325k |

Cost is roughly calls × context. Changes from now on (main agent decision):
1. **Fresh agent per fix round when the old one is over ~250k context.** This is cheaper than resuming it. It departs from PLAN §5 step 4 ("continue the same agent"); the fresh agent reads the QA file and the earlier summary.
2. **One builder per slice** (e.g. shell components, then page sections) instead of one 150+ call session.
3. **Lean-context rule in every brief:** test, lint and build output goes to a file, and the agent reads only the failures. No multi-file `cat`. Small Figma reads.
4. **Antigravity** for bulk generation (docs/delegation.md) from iteration 2.
5. **Tester re-tests only failed checks** in fix rounds.
