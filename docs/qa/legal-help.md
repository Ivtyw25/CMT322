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

## Legal-help fix round (6 November 2026)

Measured on a dev server (port 3702, bundled fonts), light frames, same suite and unchanged references and tolerances. Before = first run this round; after = last run. Run-to-run noise is about 0.1 point.

| Frame | Before | After | Change made |
| --- | ---: | ---: | --- |
| Sitemap 1440 | 13.39% | 6.37% | Link rows 30 px pitch from lg (44 px kept below lg), 14 px link text, aside body 12 px; the page is no longer 150 px taller than the frame |
| Sitemap 390 | 23.00% | 22.89% | 14 px link text. Rows stay 44 px (approved), so the page is still about 590 px taller than the frame |
| About 1440 | 7.19% | 7.17% | none needed |
| About 390 | 25.82% | 25.99% | no change. The Figma frame stops after the station list, so the footer in the reference lines up with our later sections. Not fixable without removing spec sections |
| Project overview 1440 | 6.85% | 6.69% | none |
| Project overview 390 | 16.14% | 15.41% | Popular questions rows use 14 px text on phones (as Figma). Remaining difference is the approved 44 px list rows |
| Terms 1440 / 390 | 35.56% / 41.49% | 35.52% / 41.53% | none. The reference holds longer, operational-service copy; truthful prototype copy stays |
| Privacy 1440 / 390 | 13.01% / 10.50% | 12.97% / 10.26% | none, copy length |
| Contact 1440 / 390 | 11.19% / 14.75% | 11.05% / 14.67% | none, added prototype notes and wrapped copy |
| Accessibility 1440 / 390 | 8.85% / 14.98% | 8.80% / 14.83% | none |

Shared changes: desktop notice text is now vertically centred in the bar (it sat 5 px high); site footer legal links use regular weight from 48 rem as in Figma; help aside card body is 12 px. The 404 has no Figma frame. None of these frames reaches the 3% goal. What is left is copy length and the approved 44 px rows, not geometry. The About 390 reference is an incomplete frame.

## Match-Figma round (6 November 2026, after the copy change)

Dev server on port 3702, light frames, references and tolerances unchanged. Before = measured at the start of this round (copy change already in); the figures in the earlier table predate it.

| Frame | Before | After | Cause and change |
| --- | ---: | ---: | --- |
| Terms 1440 / 390 | 2.08 / 4.60 | 2.08 / 4.60 | `updated`, `note`, `after`, `aside` already rendered. 390: text 1 px narrower than Figma per word (about 4% uniform text anti-aliasing), geometry equal |
| Privacy 1440 / 390 | 1.96 / 4.05 | 1.96 / 4.05 | same as Terms |
| Contact 1440 / 390 | 1.46 / 16.81 | 1.47 / 16.82 | 390: Figma lays out "Track a ticket" (172 px) and "Announcements" (152 px) cards with a broken auto-layout (icon, title and chevron wrap onto separate lines). The page is 122 px shorter than the frame, so the footer is misaligned and about 40% of footer pixels differ. Not replicated, see below |
| Accessibility 1440 / 390 | 1.76 / 10.36 | 1.86 / 10.35 | 390: Figma's list item "Switch between English and Bahasa Melayu" wraps to two lines. Our truthful copy ("Choose Light, Dark or System appearance", the site has no language switch) fits one line. That 24 px offset shifts the whole footer. Every section position before it matches Figma to the pixel |
| Sitemap 1440 / 390 | 5.35 / 7.94 | 1.28 / 2.84 | Removed the extra "Forgot password" link (Figma lists three links under Your account, it cost 30 px); lede, Home and Contact related descriptions set to Figma copy; sitemap now has its Figma sidebar card (Can't find a page?) |

Other changes: the help sidebar card ends with "MRTCareline 1800-88-6782, 24 hours" as in Figma (copy moved to `legalHelpCopy.aside.careline`, no longer the shared docs-page string). `demo` paragraph is no longer rendered.

Needs an owner call: to match Contact 390 the two Figma cards would need the broken stacked layout. I did not copy it, because it puts the icon and chevron on their own lines. Doing so would remove most of the 16.8%.
