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

## 4. Current state (3 Nov 2026)

| Branch / worktree | State |
|---|---|
| `main` | Foundations, Home, Project, Traffic and Report-track (19 pages) merged, pushed and deployed. |
| `iter/6-account` (`mutiara-wt/account`) | Content, spec and decisions done; main merged in. A builder is on login, signup, forgot-password and profile (TEST_PORT 3600). Next: tester, fixes, close. Decisions: `docs/specs/_account-decisions.md`. |
| `iter/7-legal-help` (`mutiara-wt/legal-help`) | One agent is writing the content and spec for terms, privacy, contact, accessibility, sitemap and not-found. Next: main answers its questions, then builder, tester, close. |

Still to do after these: the Phase 3 final sweep. It fixes the shared mobile header and footer, R-QA1, 2, 5 and 9 (`docs/qa/report-track.md`), then re-measures every page and lowers the raised `visualTolerance` values in pages.json.

## 5. Next steps

Follow PLAN §5 for each open group, with the token rules in `docs/token-budget.md`: one tester pass per group, the tester reuses the builder's verify logs, and a fresh agent for each fix round.
