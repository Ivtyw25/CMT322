# QA: Legal and help (round 1, 3 November 2026)

Result after fresh builder fix round: **functional fixes pass** for LH-QA1, LH-QA2 and LH-QA3. Production verification and visual approval remain open.

## Batched findings

| ID | Severity | Location | Finding and required action |
| --- | --- | --- | --- |
| LH-QA1 | Major | `src/app/not-found.tsx:10` | The root 404 always renders `SiteShell`. A dynamic station that calls `notFound()`, such as `/project/stations/does-not-exist`, already has the `(site)` layout. The resulting DOM has **two `main` landmarks** at both 390 and 1440 px. The ordinary unknown-URL test does not cover this path. Extract shell-free recovery content, use it from a `(site)/not-found.tsx`, and retain one shell for the root unknown-route case. Add a regression for the nested station case. |
| LH-QA2 | Minor, visual hierarchy | `src/features/legal-help/help-page-frame.tsx:39` | All help/legal breadcrumbs render `Home > current page`. The saved references show `Home > Help/Legal > current page`. Restore the group crumb through the shared frame, using a meaningful existing destination rather than introducing a dead group link. |
| LH-QA3 | Minor, visual | `src/features/legal-help/help-aside.tsx:13` | Every help/legal page receives the same FAQ card. The Accessibility and Sitemap reference cards offer **Contact us**, while the current version offers **Read the FAQ**. Contact remains available in Related pages, so this does not block the task. Parameterize the shared card if restoring the reference treatment during the final sweep. |

The fresh fix builder should address LH-QA1 first; LH-QA2 and LH-QA3 can be grouped with visual polish. This reviewer changed no implementation files.

## Evidence and checks

- Read `AGENTS.md`, `docs/CODEX.md`, `CLAUDE.md`, `ARCHITECTURE.md`, the shared legal/help spec and content notes. Reviewed the installed Next.js `page.md` and `not-found.md` guides, relevant route/component/copy files, and mock storage/contact behavior.
- Reused the root run in `.logs/continuation-page-checks.log`: the legal/help link and button crawls and all 24 legal/help axe combinations (six pages, two widths, two themes) passed. The earlier responsive failures for Sitemap's FAQ width and the 404 Home link height were fixed; root's focused 320/390 px rerun passed. Broader original responsive results predate those fixes.
- Root's `.logs/continuation-behavior-final.log` passes all eight legal/help behavior tests. The whole 73-test selection ended with 72 passes and an unrelated report-map failure.
- Additional read-only browser scenarios in `.logs/legal-review.mjs`: direct `/privacy#storage` eventually scrolls to and focuses `#storage` at 390 and 1440 px, with no browser `pageerror`; nested unknown station returns 404 plus `noindex` and one h1, but two `main` elements. No screenshots or implementation files were altered by this script.
- Terms has 14 body sections, privacy 8 and accessibility 4. Links use shared routes; careline and email come from `getSiteInfo()`. Copy accurately distinguishes local demo state from real submissions, identity verification, uploaded files, live traffic, staffed support or certified accessibility. No new operational/legal facts were introduced.
- Sitemap intentionally lists Home in Related pages, as the saved Sitemap reference does. A separate Home group is **not missing**. Account entries include the extra useful Forgot password link. No admin or dynamic ticket links appear in the sitemap groups.

## Visual review limits and remaining differences

Compared the saved Contact desktop and Accessibility/Sitemap mobile reference images with the generated actual Contact/Accessibility images. All ten legal/help light-reference comparisons fail the current 3% tolerance. Do not lower or raise tolerances based on the fallback-font run: Inter and Poppins could not be fetched in this environment, so typography and wrapping are not final.

Some differences are independent of fonts: the missing breadcrumb group, generic help-card CTA, Contact's missing tinted icon containers, the extra prototype explanation below the report/track cards, and the shared mobile header/footer. Content corrections that remove fabricated service promises are intentional and should remain; restore comparable spacing and hierarchy without restoring inaccurate copy. There are no saved dark legal/help references; dark functional/axe checks do not constitute a dark visual comparison. The 404 has no Figma frame.

## Skills and sources

Applied the repository React/composition review conventions and `.claude/skills/web-design-guidelines/SKILL.md`; retrieved its [current primary checklist](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md). Local product decisions and the approved prototype-content requirements take precedence over generic checklist advice.

No credentials or environment files were read. No commits, pushes or deployments were attempted. The production build remains blocked by Google Fonts network access, as reported by the main agent.

## Fresh builder fix round (3 November 2026)

- **LH-QA1 fixed:** reusable `NotFoundContent` contains recovery UI only. The root 404 supplies its site shell; the new `(site)/not-found.tsx` uses the existing layout shell. Direct unknown-station regressions at 390 and 1440 px each confirm HTTP 404, noindex, one main, one footer and one recovery h1. The generic unknown-route regression also passes.
- **LH-QA2 fixed:** the shared help frame includes its Help or Legal group breadcrumb. Help points to the existing Contact page and Legal to Terms; neither introduces an empty group URL.
- **LH-QA3 fixed:** Accessibility and Sitemap receive the Contact us card action; other pages retain Read the FAQ. The help card takes an explicit action object rather than restyling individual pages.
- Focused legal/map integration regression: **16 passed** (`.logs/integration-fix.log`, artifacts `.logs/integration-fix-results`). Targeted ESLint passed. Contact's telephone and email icons now have the tinted 40px containers shown in the saved desktop reference; the ordinary report/track/FAQ cards retain their untinted icons. Broader shared chrome/typography differences remain for final visual work; tolerances were preserved.
- These focused checks ran before the separate font team integrated cached local fonts. The main agent is responsible for the consolidated build and intended-font visual recheck.

## Production recheck (4 November 2026)

The earlier Google Fonts build blocker and fallback-font limitation are historical. The current source bundles Inter and Poppins through `next/font/local`, and the main agent supplied an existing production server on port 3610. Consolidated link and accessibility outcomes for that snapshot are tracked in `docs/qa/production-validation.md`; the earlier round's results do not imply that the new production checks have passed.
