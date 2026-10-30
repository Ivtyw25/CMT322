# Delegation to Antigravity (agy)

Owner decision, 30 Oct 2026: from iteration 2 (home) onwards, bulk and repetitive work goes to the Antigravity CLI (Gemini) to save Claude tokens. Claude agents keep judgement, Figma, review and every check. Iteration 1 (foundations) runs as before.

## Command

```bash
agy-delegate -m "<model>" --dir <worktree> --timeout 15m --yolo --digest - <<'EOF'
<task brief, see template below>
EOF
```

- **Always pass an exact model with `-m`.** The plugin's `--tier` names are out of date (`Gemini 3.6 Flash` no longer exists) and fail.
  - Bulk generation (records, tests, scaffolds): `Gemini 3.8 Flash (Medium)`
  - Harder generation (a page template from an existing example): `Gemini 4 Argon (Medium)`
  - Digest of a long file or log: `Gemini 3.8 Flash (Low)`
- `--dir` is always the agent's own worktree. `--yolo` is allowed only together with that `--dir`, never in the main checkout.
- `--digest` makes agy return a short digest instead of raw file contents. Never paste agy's full output into your context.
- Exit codes: 10 quota, 11 auth, 12 timeout, 13 agy missing. On any of them, do the work yourself and note it in your summary. Delegation never blocks the build.

## What to delegate, by agent

| Agent | Delegate | Keep |
|---|---|---|
| Content writer | Mock records in bulk (stations, FAQ answers, announcements, tickets, construction updates), filter and dropdown option lists, "show all" list items | Visible copy edits, tone, the facts check against `docs/BRIEFING.md` §8, `docs/content/<page>.md` |
| Builder | `tests/e2e/<page-id>.spec.ts` from the UX spec; the 2nd+ instance of a repeated template (e.g. legal pages after the first one) given a finished example file | Figma reading, shared components, the first instance of any page, fixes |
| Tester | Digesting long Playwright or build logs into a failure list | Every definition-of-done verdict, the Figma side-by-side, issue ownership |
| UX designer | Nothing | The whole spec (needs Figma judgement) |
| Main agent | Digest of large files it must decide on (a long QA report, a big diff summary) | Orchestration, `pages.json`, `log.md`, `ARCHITECTURE.md`, tokens, review, git, deploy |

Only delegate a task that is clearly bigger than the brief you would write for it (rule of thumb: more than ~150 lines of output, or more than 3 files). Small edits are cheaper done directly.

## Brief template for agy

```
Repo: Next.js 16.4.2 App Router, TypeScript strict. Read AGENTS.md, CLAUDE.md and ARCHITECTURE.md first and follow them exactly.
Task: <one paragraph>
Inputs: <absolute paths: spec, content file, model types, an example file to copy the style of>
Write only these files: <absolute paths>
Do not: run git (no add/commit/stash/checkout), run vercel, edit package.json, config files, tokens, src/config/routes.ts, ARCHITECTURE.md, pages.json, log.md, or anything under .claude/; install packages; change tests or configs to make checks pass; invent product facts (use VERIFY tags as docs/BRIEFING.md §9 says).
Done when: npm run typecheck and npm run lint pass.
Return: a digest, max 15 lines: files written, anything you could not do, any VERIFY tags added.
```

## Verify (not optional)

agy's own "done" is never trusted; it has been seen editing its environment to force a pass. After every delegation the delegating agent:

1. Runs `git status --short` and `git diff --stat` in the worktree. Anything outside the allowed file list is reverted (`git checkout -- <path>` / delete the new file).
2. Reads the diff of the files it asked for (not the whole tree) and fixes what is wrong.
3. Runs `npm run verify:quick` itself.
4. Says in its summary what was delegated, to which model, and what it corrected.

The tester and the main review treat delegated files exactly like hand-written ones.
