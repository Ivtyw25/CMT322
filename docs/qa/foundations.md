# QA: Shared layer, foundations (round 2)
Result: FAIL (1 minor builder issue left: B11)

Re-test of the round 1 open issues on `/dev/components`, the shell around the placeholder Home (`/`) and the 404, plus a regression run. Measured with a Playwright script at 1440, 1024 and 390 px, light and dark, guest and signed in, and compared side by side with the Figma references.

Screenshots: `tests/visual/__diff__/qa-foundations/r2-*.png` (gitignored). Side-by-sides: `r2-cmp-footer-1440.png` (Figma 1:127 on top, build below), `r2-cmp-u1.png` (Figma 47:1249 on top, build below). The check script is kept there as `qa-r2.mjs.txt`.

| DoD | Check | Result | Evidence |
|---|---|---|---|
| 1 | Design match light/dark | ✅ | Menus 8 px below the header, right edges flush (B1). Footer at 1440 matches Figma 1:127 row for row (`r2-cmp-footer-1440.png`). Home with a panel or menu open: the header stays transparent, the trigger is a white pill with `primary-700` text, and scrolling turns it solid (`r2-cmp-u1.png`). `test:visual` not re-run: Home is still the placeholder (accepted in round 1). |
| 2 | Typecheck / lint / tokens | ✅ | `verify:quick`: typecheck, lint, check-tokens and e2e all pass, 60/60 e2e. |
| 3 | Screen sizes | ✅ | `test:responsive` 18/18. The 1024 footer now wraps cleanly: title on one line, text on 3 lines, form on one row (`r2-footer-1024-light.png`). |
| 4 | Links | ✅ | `test:links` 4/4 (4.3 min). "Show notice again" is no longer reported as doing nothing (B12). |
| 5 | File structure | ✅ | No product code changed by QA; only test files. |
| 6 | Content | ❌ | C1 and C2 are fixed. One gallery sample still doesn't make sense (B11). |
| — | Accessibility (axe) | ✅ | `test:a11y` 8/8 (light and dark, desktop and mobile). |

## Issues
| # | Owner | Severity | What and where | Expected (Figma node / spec section / content key) | Status |
|---|---|---|---|---|---|
| B1 | builder | major | Menus covered the header | 8 px below the header, right edge on the button. Measured gap 8, right offset 0 for Appearance and Account, light and dark (`r2-appearance-1440-*.png`, `r2-account-1440-*.png`); e2e passes | fixed |
| B2 | builder | major | Footer select stretched to 260 px | Select 109 px, email 280 px, form at x 799 at 1440, as in Figma 1:127; 1024 wraps cleanly | fixed |
| B3 | builder | minor | Back to top at the far right | Now 42 px after the LinkedIn pill. The remaining offset from Figma comes from the longer social label (accepted by the main agent) | fixed |
| B4 | builder | minor | Footer divider colours | Light `#ffffff`, dark `#141416` (`surface`), as in decision 6 | fixed |
| B5 | builder | minor | Newsletter tile used `mail` on a white tile in both themes | `bell` on `surface`: white tile with `primary-700` bell in light, `#141416` tile with a light-blue bell in dark | fixed |
| B6 | builder | minor | Legal row gap 24 px | 58 px, as in Figma | fixed |
| B7 | builder | minor | Resizing didn't reset open panel or drawer | Both e2e resize tests pass (3 runs in a row) | fixed |
| B8 | builder | minor | Appearance menu focus and wrapping | Test corrected per the main agent's decision: Light (checked) is focused on open, ArrowUp wraps to Match system, ArrowDown wraps back. Passes | fixed |
| B9 | builder | minor | Drawer "Create an account" centred | Left-aligned at x 20, the same as Log in | fixed |
| B10 | builder | minor | Gallery section bar specimens empty at ≥1024 px; no chevron at 390 | Three specimens render at 1440 and 390, each with its chevron (`r2-g-sectionbar-1440.png`) | fixed |
| B11 | builder | minor | Gallery sample content. The password field, leading-icon email, Category options, line-rail stops and timeline are all fixed. Still wrong: the "Error on navy" specimen (`src/app/dev/components/_sections/fields-section.tsx`, about line 133) is an `email` input with hidden label `samples.fieldLabel` ("Ticket ID") and the error "Enter a valid email address". | Use `samples.emailLabel` ("Email address") for that field. DoD 6 | open |
| B12 | builder | minor | "Show notice again" did nothing while the notice showed | Disabled while the notice shows, enabled after dismiss, and it brings the notice back | fixed |
| U1 | ux-designer | major | Spec said Solid header on Home with a panel open | Spec decision 9 follows Figma 47:1249, and the build matches it (`r2-cmp-u1.png`) | fixed |
| U2 | ux-designer | minor | Traffic panel order | Decision 10 (oldest start first). Panel shows Jalan Sultan Azlan Shah, KOMTAR, FIZ, as in Figma 101:3919 | fixed |
| C1 | content-writer | minor | `verify.md` numbering | Starts at 1 | fixed |
| C2 | content-writer | minor | Two changes from Figma not logged | Both rows are in the `foundations.md` change table | fixed |

## Tests changed by QA this round (no product code touched)
- `tests/e2e/shared/header-menus.spec.ts`: Appearance test now expects Light focused on open, then ArrowUp → Match system, ArrowDown → Light (main agent decision on B8).
- `tests/e2e/shared/drawer.spec.ts`: "choosing a link closes the drawer, even for the current page" failed once in `verify:quick` with "Execution context was destroyed". Re-choosing the current page triggers a navigation on the placeholder route while `settle()` is evaluating. The settle step now waits for `load` and retries. This was a test race, not a product fault and not a threshold change. It then passed 3 runs in a row and in the full suite.

## Notes for the main agent
- ESLint also lints files under `.logs/` (gitignored), so a scratch script there fails `npm run lint`. Consider adding `.logs/` to the ESLint ignores.

## History
- Round 1: 16 issues (builder 12: 2 major, 10 minor; ux 2: 1 major, 1 minor; content 2 minor)
- Round 2: 15 fixed, 1 open (builder B11, minor). No new issues. Regression: verify:quick, responsive 18/18, a11y 8/8, links 4/4 all pass
