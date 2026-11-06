# Final visual review: intended production fonts (4 November 2026)

The complete visual suite finished against `http://localhost:3610`, the stable production build with bundled Inter/Poppins: **104 cases, 39 passed, 47 skipped for missing references, 18 failed, 17.5 minutes**. One worker, no retries, isolated artifacts `.logs/final-visual-results`, console log `.logs/final-visual.log`. This supersedes prior fallback-font measurements. References and `visualTolerance` remain untouched.

## Interpretation

The saved goal is at most 3% pixel difference. Earlier groups currently retain raised per-page tolerances (9–27%); passing those assertions is not evidence that the 3% final-sweep goal is met. Missing dark frames are skipped, not visually approved. Leaflet is masked by the existing suite; prototype copy, 44px controls and mobile vertical timelines remain approved deviations.

## Prioritized fix batch

1. **Home mobile hero resolution — unapproved visual defect.** The source is 1712×919. At 390×844/DPR1, its `object-fit: cover` box is 390×622 but `sizes="100vw"` chooses a 640px optimized source. Covering the 622px height needs approximately 1159px source width, so the downloaded image is enlarged approximately 1.81×. Account for cover height when selecting the narrow-screen resource (at least 1200w at this viewport); retain the source image, crop and scrim. Evidence: `.logs/hero-image-evidence.mjs`, `.logs/home--390--light-top.png` (reference left, actual right), `src/features/home/hero.tsx`.
2. **Home area URL latency — separate functional/performance item confirmed by root.** HeroSearch area selection and TryChips still initiate router navigation despite browser filtering. Root observed delayed URL writes exceeding the behavior assertion window under load. Follow the installed Next Native History API guidance and the existing `lib/url/use-query-params` pattern: subscribe WorksArea to URL state, use native history for area-only updates, retain shareable query/hash semantics and real navigation for station/road destinations. **Retain server searchParams/initialArea rendering:** `docs/specs/home.md` explicitly requires the first Works list to reflect `?area=` without JavaScript. Do not make the whole Home route static, and do not hide delays by extending test timeouts.
3. **Missing account/modal width constraints — required layout fix.** `tokens.css` resets `--container-*` and defines only page/content/article/docs-sidebar/docs-aside. AuthShell's `max-w-sm` and `max-w-lg`, ConfirmDialog's `max-w-lg`, and profile station chips' `md:max-w-xs` therefore have no generated constraints. The desktop form expands to approximately 608px rather than the reference's 400px; the panel heading spans too far horizontally. Use numeric spacing-backed widths such as `max-w-100` for 400px and `max-w-128` for a 512px modal, or legitimate generated named tokens. Add width assertions at 1440px for form/modal; overflow tests alone cannot detect this failure. Evidence: `.logs/login--1440--light-top.png`, `src/features/account/auth-shell.tsx`, `src/components/ui/dialog.tsx`, `src/features/account/profile-page.tsx`.
4. **Auth heading scale and panel alignment — required layout fix.** Generated token values differ from default Tailwind assumptions: `type-heading-xs` is 24/32px, `s` 30/38px, `m` 36/44px, `l` 48/60px and `xl` 60/72px. Actual mobile auth uses `m` (36px) against a 24px reference; the illustration heading uses `xl` (60px) against approximately 48px. Use measured responsive steps (24px on mobile, nearest approved desktop token) and the 48px panel token. Once widths are constrained, align the desktop panel heading with its approximately 212px reference top position rather than the current 128px padding. Keep the truthful prototype note; account for its extra height explicitly instead of removing it.
5. **Google button framing and login fixture — minor account visual fixes.** The neutral official Google SVG paints a gray inner button inside the component's separate white full-width bordered wrapper. The saved reference has one white button surface. Inspect the supplied official light variant and its framing; retain exact official artwork rather than recoloring/redrawing it. The asset declares 180×40 while the component specifies 189×40; preserve its natural ratio. The Login reference's Keep me logged in checkbox is unchecked at both sizes, but the visual fixture calls `check()`; retain its empty default in that fixture.
6. **Profile card furniture and navigation — required account layout fix.** The fresh desktop pair (`.logs/profile--1440--light-top.png`) shows standard DocsAside "On this page" navigation replacing the saved Account/icon/sidebar treatment; use the saved account navigation while retaining the new scroll-spy behavior. Shared DocsSection h2 is 24px on desktop against 16px card headings. Each `py-4` detail row adds 32px around a 44px Edit button, producing approximately 76px rows against approximately 54px in the reference; reduce padding while retaining a non-overlapping 44px target. Header metadata is stacked below the avatar instead of aligned beside it in the pale full-width desktop band; mobile must retain the reference's avatar-above-name layout. The report-count tiles should use existing warning/primary/success semantic surfaces and text rather than identical gray tiles. Keep dynamic counts, latest three reports and truthful profile copy.
7. **Profile visual fixture notice state — correct the fixture, preserve the product notice.** Both saved profile frames have no active site notice; the production snapshot has the global active notice. A profile visual state can dismiss it through the existing user-visible action before capture. Do not add a profile-specific product rule to suppress active notices. This removes an irrelevant 44px desktop/approximately 105px mobile page offset before judging the remaining profile structure; `.logs/profile--390--light-top.png` confirms the additional independent avatar/card typography gaps.
8. **Sitemap desktop columns and group headings — required legal/help layout fix.** The saved desktop frame has three columns × two group rows; `SitemapPage` renders only `sm:grid-cols-2`, yielding two columns × three group rows at 1440px. Add the intended desktop three-column layout, retaining the mobile one-column flow and all public route coverage (including Forgot password). Its group headings also inherit 24px DocsSection typography against the saved 16px headings; apply a page-appropriate heading token without changing semantics. This is an unapproved structural cause of the 24.38% desktop difference, separate from approved 44px link rows and truthful copy.

## Legal/help inspection

The fresh Terms desktop composite (`.logs/terms--1440--light-top.png`) keeps the expected sidebar/article/aside columns, title hierarchy and blue summary surface. The largest document differences are content length: the truthful university-prototype lede, three-point summary and shorter terms differ from operational-service copy, five-point summary and dated legal claims in the reference. Keep the truthful copy; do not restore invented legal effective dates, real-service guarantees or Google Maps claims. Distinguish these accepted content/state deltas from geometry. The added Legal breadcrumb level and help-card divider/action set are smaller explicit spec/reference differences to reconcile after account constraints are fixed.

## Approved differences to retain

- Mobile footer navigation uses 44px rows; the saved frame uses approximately 30px rows. This intentionally increases page height. Shrinking row pitch while overlaying 44px hit areas would overlap adjacent links, so that is not an acceptable visual fix.
- Mobile header/profile/menu and map controls retain 44px targets; the smaller reference controls do not override accessibility requirements.
- Truthful university-prototype copy, simulated authentication/email/report disclosures, absence of invented legal guarantees and vertical mobile timelines stay. They can change line wrapping and page length; do not restore false claims to lower pixel differences.

## Measurements

All 18 failures are the nine new account/legal-help pages in light theme at 1440px and 390px. Their dark frames do not exist and were skipped. No 404 visual frame exists, so no 404 pixel test is defined.

| Page | 1440px light difference | 390px light difference |
| --- | ---: | ---: |
| Log in | 17.89% | 13.84% |
| Sign up | 20.37% | 14.18% |
| Forgot password | 10.11% | 12.74% |
| Profile | 22.12% | 23.22% |
| Terms | 35.52% | 41.40% |
| Privacy | 12.94% | 10.35% |
| Contact | 11.09% | 14.64% |
| Accessibility | 8.75% | 14.75% |
| Sitemap | 24.38% | 23.46% |

**All 57 measured frames exceed 3%.** The 39 legacy assertions pass their current raised thresholds, not the final 3% goal. The closest measured frame is Home desktop dark at 3.34%. Home desktop light is 3.44%; mobile light 8.66%, dark 8.84%; mobile menu 10.45%; desktop menu/search states 3.36–3.53%. Larger legacy examples: About mobile light 25.79%, Project overview mobile light 18.80%, Traffic overview desktop/mobile light 21.44%/21.15%. Keep these explicit; do not mark the visual sweep complete or lower tolerances without another valid measurement.

Detailed percentages are reconstructed from red difference pixels in the generated suite diff PNGs (`.logs/visual-counts.mjs`); this matches pixelmatch's default diff color and does not change screenshots or references. Full per-frame values are saved in `.logs/final-visual-counts.json` (57 entries). Failure ratios also appear directly in the console log.

No source changes, reference updates or tolerance changes were made by this reviewer. A fresh builder should implement this batch; then rebuild and rerun the affected intended-font visual frames plus the relevant behavior/responsive/axe checks. Keep the complete-suite result above as the pre-fix measurement.
