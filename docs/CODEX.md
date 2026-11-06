# Codex continuation

Resumed 3 November 2026. Product decisions in CLAUDE.md, PLAN.md, ARCHITECTURE.md and approved specs remain applicable.

## Role mapping

| Previous role | Codex assignment | Reasoning |
| --- | --- | --- |
| Claude Opus orchestrator | Current Codex root session | Inherited |
| Claude Sonnet builder | GPT-6.1 Sol | Medium |
| Claude Sonnet UX/content | GPT-6.1 Sol | Medium |
| Claude Sonnet tester/reviewer | Separate GPT-6.1 Sol agent | Medium |
| Optional Haiku helper | GPT-6 Luna if needed | Medium |

These are project assignments using session-available models, not exact equivalence claims. Root coordinates integration and final verification. Antigravity stays paused. Official orchestration reference: https://developers.openai.com/api/docs/guides/responses-multi-agent.

## Workspace

Active workspace: C:/Users/Ivantham/CMT322. Legacy account/legal-help worktrees are preserved outside the writable root. Saved account content, models and specs were imported from iter/6-account. Agents work here with disjoint ownership.

Agents read AGENTS.md and installed Next.js guides before code; apply repository React/composition skills. Keep thin routes, centralized routes/copy/tokens, mock data behind async access and the existing session provider.

The Figma MCP server was registered with codex mcp add figma --url https://mcp.figma.com/mcp. OAuth authorization was requested. Registration does not itself expose tools to an already running session. Use saved references until live tools are callable; do not claim live design review without it.

Separate review follows implementation, then targeted fixes and full npm run verify. Never push or deploy failed verification. Never read credentials or .env files. Retain historical attribution but do not add Claude co-authorship to Codex changes. Claude frontmatter, usage accounting and hooks do not configure Codex. Keep .claude/hooks/.build-active through final sweep.

## Resume

Read this file, docs/HANDOFF.md, CLAUDE.md, ARCHITECTURE.md, pages.json and latest log. Inspect actual changes first. Existing done entries still carry deferred visual polish. Account, legal/help and the final sweep are active work.
