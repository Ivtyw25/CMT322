# Token budget

Owner request, 30 Oct 2026. Measured with `npm run usage:tokens [sessionId]`; every iteration entry in `log.md` gets a **Tokens** line.

## What drives the cost

Every call re-reads the agent's whole context, so cost ≈ calls × context size. Two things are already in place and need no change:

- **Prompt caching is automatic in Claude Code.** The system prompt, tools, `CLAUDE.md` and preloaded skills form a stable prefix that is cached. The 155M "re-read" tokens in session 1 were cache hits, already billed at the discounted rate; uncached input was about 1k. To keep the cache warm, don't edit `CLAUDE.md`, agent files or preloaded skills while a team is running.
- **Subagents don't inherit the main agent's context.** Each one starts at about 48k (system prompt, tools, rules, skills) plus its brief. Their 250–600k peaks came from their own tool output: files they wrote and read, test logs, Figma responses.

So the fix is to keep each agent's own context small and its life short.

## Rules for every agent

1. **Quiet commands.** `npm run verify`, `verify:quick` and `test:*` print one line per step plus a failure excerpt, and write full logs to `.logs/<step>.log`. Read a log with `grep` or `tail`, never in full. `VERBOSE=1` streams everything; use it only if the excerpt can't explain a failure.
2. **Targeted reads.** `Grep` before `Read`; use `offset`/`limit` on large files. Never `cat` several files at once. Don't re-read a file you just wrote.
3. **Small Figma reads.** `get_metadata` on the frame first, then `get_design_context` or `get_screenshot` on one section at a time. Never `get_design_context` on a whole page frame.
4. **Short life.** One builder per slice of a group (e.g. shared parts, then sections), not one session for the whole group. The main agent starts a **fresh** agent for a fix round when the previous one ended above ~250k context. The fresh agent reads the QA file instead of inheriting the old context.
5. **Re-test only what failed** in fix rounds, plus the quick automated regression.
6. **Antigravity delegation is paused** (owner, 30 Oct 2026: quota used up). Agents do bulk work themselves. The main agent may give mechanical work (log digests, repeated records) to a short-lived Haiku agent instead.
7. **Return format** (≤200 words, nothing else):

```
status: done | partial | blocked
files_changed: <paths>
summary: <3 sentences>
issues: <id: fixed | not fixed (reason) | needs <owner>>, or "none"
skills: <used>; delegated: <what, model, what you corrected>, or "none"
```

## Main agent

- Briefs carry only the task's scope: the page IDs, Figma IDs, file paths and decisions. Agents read the files themselves.
- Read team files (specs, QA reports) only to make a decision, using `Grep` for the part needed.
- Wait for agent notifications; avoid output-heavy polling.
- Before the context gets large, make sure `pages.json` and `log.md` are current, so a fresh session can resume.
