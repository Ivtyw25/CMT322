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

## 4. Current state (30 Oct 2026)

| Branch / worktree | State |
|---|---|
| `main` (`C:\Users\Ivantham\CMT322`) | Foundations merged and deployed. Local commits since the last push are listed in `git log origin/main..main`. |
| `iter/2-home` (`C:\Users\Ivantham\mutiara-wt\home`) | Slice A (sections 1–4) done. Slice B (sections 5–11, `tests/e2e/home.spec.ts`, menu-open visual state) is committed as a wip; not yet verified. |
| `iter/3-project` (`C:\Users\Ivantham\mutiara-wt\project`) | Content and the six UX specs are done. Slice 1 (shared component changes, routes, map, data fields from `_project-decisions.md`) is committed as a wip; not yet verified. |

Groups still to do after these: traffic, report-track, account, legal-help (including 404), then the Phase 3 final sweep.

## 5. Next steps

1. **Home slice B:** a fresh builder finishes it in the home worktree. It must:
   - make sure `src/features/home/works-items.ts` merges road works, so the Bukit Jambul list matches Figma
   - recheck that the "buk" search shows 3 results
   - run `npm run verify:quick` (TEST_PORT 3100)
2. **Home close:**
   - the tester runs
   - fix rounds (at most 3) and the main review
   - merge `--no-ff` to `main`, verify, push, `vercel deploy --prod --yes`, smoke test
   - log entry with a Tokens line, then remove the worktree
3. **Project slice 1:** a fresh builder checks the slice against `_project-decisions.md`, makes `verify:quick` green (TEST_PORT 3200) and keeps the gallery working. The main agent merges the shared changes to `main`, then merges `main` into `iter/2-home` if home is still open.
4. **Project pages:** builders take one slice per page (overview + about, stations + station, construction, faq). Then the tester, the fixes and the close, as for home.
5. Then the remaining groups in `pages.json` order, and the Phase 3 final sweep.
