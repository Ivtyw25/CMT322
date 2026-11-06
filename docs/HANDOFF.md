# Handoff: resuming the build in a new session

Everything the build needs lives in this repo and its git branches, not in any chat. A new agent can resume at any point from these files. The main agent keeps the **Current state** section up to date at each group boundary.

## 1. How to resume

1. Open a terminal in `C:\Users\Ivantham\CMT322`.
2. Start the main agent: `claude --agent orchestrator` (Opus, effort medium). To use a different tool, give it the same reading list and prompt below.
3. Paste this prompt:

> You are taking over the Mutiara LRT Community Connect build as the main agent. Read, in order: `CLAUDE.md`, `PLAN.md`, `docs/HANDOFF.md`, `pages.json`, `log.md` (the latest iteration and "Decisions in progress"), `docs/token-budget.md`, and `docs/specs/_project-decisions.md`. Then run `git worktree list` and `git -C <each worktree> status --short`. Continue from "Next steps" in `docs/HANDOFF.md`. Follow the PLAN workflow: teams, tester, fix rounds, review, then merge, push, deploy, smoke test and a log entry. Antigravity delegation is paused. Team agents run on Sonnet with effort medium.

4. If the new session is in the same Claude Code install, the agent files in `.claude/agents/` already set the models. Check with `grep -n "^model:\|^effort:" .claude/agents/*.md`.

## 2. Rules a new agent must not miss

- Never read `.env*` or credential files, and never run `vercel env pull`.
- Never commit `.env*`, `.vercel/`, `.next/`, `node_modules/`, `.logs/` or visual diff output.
- Never force-push. Never push or deploy a red `npm run verify`.
- No `/admin` routes.
- On Windows, never pass `/tmp/...` paths to node. Use `.logs/` for scratch files.
- Keep `.claude/hooks/.build-active` until the Phase 3 final sweep is done.
- Commit trailer: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Wait for agent notifications. Don't run long sleep or poll loops (the owner asked for this).

## 3. Saving work when tokens run low

When a session is near its limit, the main agent:

1. Commits each worktree's uncommitted work as `wip(<group>): <what>` on its iteration branch. Work is never lost that way.
2. Updates **Current state** below: branches, what is done, and what is half done.
3. Updates `pages.json` statuses and adds any new decisions to `log.md` under "Decisions in progress".
4. Commits these on `main`. It pushes only if `npm run verify` is green; otherwise it leaves the commits local and says so here.

The next session then needs only the prompt in §1.

## 4. Current state (6 Nov 2026)

**Update 6 Nov:** account and legal-help are merged to `main` and marked `done` (log.md iteration 6). Only the Phase 3 final sweep remains. The 3–4 Nov notes below are history.

| Branch / worktree | State |
|---|---|
| `main` | Foundations, Home, Project, Traffic and Report-track (19 pages) merged, pushed and deployed. |
| Account continuation in `C:/Users/Ivantham/CMT322` | Implemented; independent review and fresh fix round completed. All A-QA1-5 findings fixed, including blocked-storage sign-in, mobile section navigation and password accessibility. Account/session regression: 16/16 passed. Decisions: `docs/specs/_account-decisions.md`; evidence: `docs/qa/account.md`. Legacy worktree preserved. |
| Legal/help continuation in `C:/Users/Ivantham/CMT322` | Implemented; independent review and fresh fix round completed. Nested station 404 now has one shell; group breadcrumbs and relevant help actions restored. Shared map/404/navigation regression: 16/16 passed. Spec: `docs/specs/_legal-help-shared.md`; evidence: `docs/qa/legal-help.md` and `docs/qa/final-sweep.md`. Legacy worktree preserved. |

Still to do after these: the Phase 3 final sweep. It fixes the shared mobile header and footer, R-QA1, 2, 5 and 9 (`docs/qa/report-track.md`), then re-measures every page and lowers the raised `visualTolerance` values in pages.json.

### Codex continuation (3 Nov 2026)

- Read `docs/CODEX.md` for the Codex role mapping. The owner explicitly requested subagents following the saved team workflow. Account, legal/help and shared-sweep reviewers run separately; the root integrates their batched findings and performs final checks. Antigravity remains paused.
- Existing shared mobile/map/report fixes were preserved. Mobile header/notice targets pass the focused 44px check. Auth, profile, sitemap and 404 touch targets were corrected; ten focused 320/390px responsive checks pass.
- Development server for this continuation: `http://localhost:3601`. Port 3100 was already occupied. Do not stop an unrelated service. Run browser checks with `BASE_URL`, `--reporter=line` and a distinct `--output=.logs/<task>-results` per runner: concurrent default Playwright output directories caused trace conflicts in an incomplete broad run.
- The Google Fonts build failure was resolved by bundling byte-identical original cached Inter/Poppins assets with OFL licences through `next/font/local`; provenance: `docs/fonts.md`. Earlier fallback-font screenshots are superseded. No font substitution or mocked font responses were used.
- The earlier 72/73 behavior result's remaining map-test locator defect is fixed; the integration regression passes 16/16. Account/session tests pass 16/16 after the fresh fix round. Consolidated `npm run verify` now runs with `TEST_PORT=3602`; final results: `.logs/continuation-verify-final.log`. Never push or deploy failed verification. Final visual acceptance remains pending; tolerances stay unchanged.

## 5. Next steps

Follow PLAN §5 for each open group, with the token rules in `docs/token-budget.md`: one tester pass per group, the tester reuses the builder's verify logs, and a fresh agent for each fix round.

### Production validation resumed (4 Nov 2026)

- The 3 Nov consolidated command passed typecheck, lint, formatting, tokens and the production build, then never recorded a completed browser-suite result. It was stopped on resume. Do not claim a full verify pass from that log.
- The same stable production build is served on `http://localhost:3610` with the test gallery enabled. Separate team runners use `BASE_URL`, line reporting and distinct artifact directories beneath `.logs/`.
- Full matrices: root behavior `.logs/final-e2e.log` (439 cases); shared tester responsive `.logs/final-responsive.log` (441); legal/help tester accessibility `.logs/final-a11y.log` (196); visual tester `.logs/final-visual.log` (104 including missing-reference skips). The complete links crawl is deferred until browser pressure falls, then runs with one worker. `.logs/final-links-a11y.log` is an interrupted partial run, not final evidence.
- Findings under investigation: Home area links use router navigation for browser-only filtering and exceeded URL assertion timeouts under load; mobile hero `sizes="100vw"` selects a 640px image for a cover crop requiring about 1160px. See the final visual report when available. Keep the approved 44px footer rows and truthful prototype copy; do not manufacture a visual pass by shrinking targets or raising tolerances.
- Current implementation remains uncommitted on `main`. Finish the measured fix round and affected checks before closing account/legal-help or attempting production publication.

Baseline results on 4 Nov: responsive **441/441 passed**; behavior **435/439 passed**, and all four URL-timeout cases then passed an unchanged-build isolated rerun; accessibility **193/196 passed**, with only the shared dark-desktop auth-panel contrast failure; visual **39 passed, 47 skipped, 18 failed**. Every measured frame still exceeds the final 3% goal; older assertions pass raised legacy thresholds. Reports: `docs/qa/production-validation.md`, `docs/qa/visual-final.md`, `docs/qa/final-sweep.md`. A single-worker complete 98-case link crawl is now running on the stable baseline while source-only fix builders work; do not rebuild until it finishes.

Fresh builders: `final_layout_fix` owns the measured Home image/history, account/modal/auth/profile and Sitemap fixes, with server-rendered no-JavaScript Home filtering preserved. `legacy_visual_sweep` owns measured Project/About spacing and compact mobile-logo corrections. They must retain truthful copy and non-overlapping 44px targets. After both source freezes and the link crawl, rebuild and run affected checks. Development server 3601 started by this continuation has been stopped; production validation uses 3610.

### Integrated continuation validation (4 Nov 2026, evening)

This supersedes the active-builder/link-crawl instructions above. The link crawl finished **98/98 passed**; the pending fixes have been integrated and rebuilt. No team agents remain active in this continuation.

- Production server: `http://localhost:3610`, running the final rebuilt source with `DEV_GALLERY=1`. The unrelated port 3100 service was left alone. Use `npm.cmd` in PowerShell and `BASE_URL=http://localhost:3610` for checks against this server.
- Root corrected Home regression locators and added a desktop auth panel-height/scroll regression. Native-history filtering and no-JavaScript filtered results both pass. The final auth illustration uses a viewport-height sticky panel so taller forms do not stretch the artwork.
- Final Account/Home behavior: **59 passed**; affected responsive matrix: **81 passed**; Account/Sitemap accessibility: **20 passed**, with the final auth-only accessibility rerun **12 passed**. Build, typecheck, lint and token checks passed. Evidence and scope: `docs/qa/continuation-validation.md`.
- Quick verification now discovers group suites (`account.spec.ts`, `legal-help.spec.ts`) as well as page suites, and uses two browser workers. The updated run **passed typecheck, lint, tokens and 127 browser cases**, with native exit code 0. Evidence: `.logs/resume-quick-grouped.log`.
- Affected visuals: **13 passed, 17 skipped, 10 failed**. The final auth follow-up still fails all six light references, with six absent dark references. Latest desktop differences: Login **9.70%**, Signup **15.14%**, Forgot password **8.66%**, Sitemap **13.26%**. Project overview mobile improves to **15.88%**; About mobile remains **25.82%**. Full frame measurements: `.logs/resume-visual-counts.json`.
- Account/legal-help remain `review`; tolerances and references are unchanged. No full verify pass, commit, push or deployment is claimed. Next work is the remaining measured auth/profile/shared-shell/legal layout differences, then affected checks and full verification. Preserve truthful copy, official Google artwork and non-overlapping 44px targets.

## 6. State at wrap-up (6 Nov 2026, evening)

- `main` is pushed and deployed (https://mutiara-connect.vercel.app). All 32 page groups/pages in `pages.json` are `done` or `skipped`. Full verify green (`.logs/session-verify5.log`).
- **Owner is testing the live site** and will send feedback. Start the next session from that feedback: fix, `npm run verify`, merge, push, deploy, smoke test.
- **Then Phase 3** (PLAN): live-URL responsive, a11y, Lighthouse and console-error checks; lower the 15 older pages to 3%. Measured differences (light unless noted, desktop 1440 / mobile 390): traffic-overview 21.4/21.1, traffic-map 18.0/10.2, about 7.0/25.7 (dark desktop 5.0), station 8.1/11.5 (dark 6.0/17.9), report-submitted 11.0/16.0, project-overview 6.4/15.8, report 4.1/13.7, track 9.9/13.0, stations 4.3/12.0, faq 2.9/11.9, construction 3.1/10.1, home 3.3/8.0 (dark 3.2/8.5; menu-open 3.2/10.6; search 3.4/8.4), route-view 5.4/8.7, announcements 8.3/8.8, report-track-overview 6.0/7.2. Script: `node .logs/all-counts.mjs` after a visual run.
- Keep `.claude/hooks/.build-active` until Phase 3 closes. Leftovers to remove when convenient: worktrees `mutiara-wt/account`, `mutiara-wt/legal-help`, branch `wip/account-legal-help` (merged), root `debug.log`.
