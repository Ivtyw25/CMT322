# Skills

Chosen by the main agent in Phase 0 (30 Oct 2026). Every agent invokes its skills (Skill tool) before starting and names them in its summary. Preloaded skills are also in each agent's `skills:` frontmatter.

**Precedence:** owner decisions (`PLAN.md` §1) → `CLAUDE.md` → Figma and `docs/BRIEFING.md` → `ARCHITECTURE.md` → the skill.

## Inventory

| Skill (invoke as) | Source | Version | Why |
|---|---|---|---|
| `figma:figma-design-to-code` | Figma official plugin | 2.2.157 | Required before `get_design_context`; how to adapt Figma output to this codebase |
| `figma:figma-use` | Figma official plugin | 2.2.157 | Required before `use_figma` (read-only scripts: variables, text, node lists) |
| `shadcn` | shadcn/ui (personal skill) | installed | Accessible Radix primitives, composition and variants for `components/ui` |
| `react-best-practices` | Vercel, `vercel-labs/agent-skills@1a2c79d`, project skill | 1.0.0 | Next.js/React performance: server components, client boundaries, bundles, waterfalls |
| `composition-patterns` | Vercel, `vercel-labs/agent-skills@1a2c79d`, project skill | 1.0.0 | Component APIs without boolean-prop sprawl; compound components; React 19 |
| `web-design-guidelines` | Vercel, `vercel-labs/agent-skills@1a2c79d`, project skill | 1.0.0 | Interface review checklist (focus, forms, motion, touch, typography) |
| `responsive-design` | personal skill | installed | Mobile-first layouts, container queries, breakpoints |
| `interaction-design` | personal skill | installed | Microinteractions, transitions, loading and feedback states |
| `typescript-style-guide` | personal skill | installed | Type modelling, discriminated unions, props |
| `design:accessibility-review` | design plugin | installed | WCAG 2.1 AA review |
| `design:ux-copy` | design plugin | installed | Microcopy, labels, errors, empty states |
| `browse` | gstack (personal) | installed | Headless browser for manual checks and screenshots. The owner's global rule: use it for all web browsing, never the Chrome extension tools |
| `code-review` | Claude Code built-in | — | Main agent's diff review |
| `commits` | personal skill | installed | Conventional Commits messages |

Vercel skills were read in full before installing into `.claude/skills/` (Markdown only; no scripts, no secrets). Not installed: `anthropics/skills` `webapp-testing` (Python Playwright; our suites are TypeScript Playwright already) and `frontend-design` (pushes original aesthetics; we must match Figma 1:1).

## Mapping

| Agent | Skills | For |
|---|---|---|
| Main agent | `figma:figma-use`, `figma:figma-design-to-code`, `react-best-practices`, `composition-patterns`, `code-review`, `commits`, `web-design-guidelines` | Tokens, page list, briefs, final review, commits |
| Builder | `figma:figma-design-to-code`, `shadcn`, `react-best-practices`, `composition-patterns`, `responsive-design`, `typescript-style-guide`, `interaction-design` | Building pages and shared components |
| UI/UX designer | `figma:figma-design-to-code`, `interaction-design`, `responsive-design`, `design:accessibility-review`, `web-design-guidelines` | Specs: states, motion, focus order, breakpoints |
| Tester | `browse`, `design:accessibility-review`, `web-design-guidelines`, `figma:figma-design-to-code` | Definition-of-done checks, visual side-by-side, a11y |
| Content writer | `design:ux-copy`, `figma:figma-design-to-code` | Copy edits, hidden content, mock records |

## Overrides

- **shadcn:** use it for behaviour and structure only. Restyle every component to Figma with project tokens. No default shadcn colours, radii, shadows or CSS variables. `components.json` sets `cssVariables: false`; if `npx shadcn add` edits `src/styles/globals.css`, revert that change.
- **react-best-practices / composition-patterns:** `ARCHITECTURE.md` decides file placement and naming when a rule disagrees.
- **interaction-design:** motion stays subtle (150–250 ms) and must respect `prefers-reduced-motion`; the UX spec has the final say.
- **design:ux-copy:** British/Malaysian spelling and the facts in `docs/BRIEFING.md` §8 win over any style advice.
- **browse:** for looking at pages. The pass/fail checks are the `npm run test:*` suites.
