# Continuation validation (4 November 2026)

The pending layout fixes were rebuilt with bundled Inter/Poppins and `DEV_GALLERY=1`, then tested against the production server at `http://localhost:3610`. Source and references remain separate: no screenshot reference or visual tolerance was changed, and no deployment was attempted.

## Implementation and regression fixes

- Integrated the pending Home image sizing/native-history filtering, account width/contrast/profile, Sitemap columns, and Project mobile spacing fixes recorded in `visual-final.md`.
- Constrained the desktop auth illustration panel to the viewport height, with sticky positioning while the form scrolls. Previously, additional form content stretched the illustration panel and displaced the art. The existing form-width regression now checks panel height and scroll position too.
- Corrected the new Home regressions to select the actual area-chip destination. The full area label differs from the short chip label. Scoped the no-JavaScript result count to the works list so the subscription heading is excluded. Both native-history and no-JavaScript cases pass without raising timeouts.
- Updated `scripts/verify-quick.mjs` to include existing group suites as well as page suites, deduplicated. Account and legal/help keep their behavior in group files, which the previous selector omitted. Quick browser checks now use two workers.

## Completed checks

| Check | Result | Evidence |
| --- | --- | --- |
| Production build after final auth change | Passed | `.logs/resume-build-final.log` |
| Updated grouped quick verification | Passed: typecheck, lint, tokens and 127 browser cases; native exit code 0 | `.logs/resume-quick-grouped.log` |
| Account and Home behavior after test fixes and final auth change | 59 passed | `.logs/resume-final-behavior.log` |
| Legal/help and mobile targets before the auth-only follow-up | 12 passed within a 71-case run; the two failures were the subsequently fixed Home test locators | `.logs/resume-behavior.log` |
| Affected responsive routes at all nine widths | 81 passed | `.logs/resume-responsive.log` |
| Account and Sitemap accessibility before the auth-only follow-up | 20 passed | `.logs/resume-a11y.log` |
| Auth accessibility after final panel change | 12 passed across three routes, both themes and both viewports | `.logs/resume-auth-final.log` |
| Complete link crawl on the previous stable baseline | 98 passed | `.logs/final-links.log` |

The initial quick command stopped because unrelated port 3100 was occupied. Subsequent checks use `BASE_URL=http://localhost:3610`. PowerShell commands use `npm.cmd` to avoid the unsigned `npm.ps1` shim. Native exit codes are preserved explicitly.

## Visual results and remaining work

The affected visual matrix finished with **13 passed, 17 missing-reference skips and 10 failed** (`.logs/resume-visual.log`). Following the final auth panel correction, the auth matrix still has six failing light references; its six dark references are absent. All 12 auth accessibility cases pass. Visual failures remain real failures against the unchanged 3% target.

| Frame | Baseline difference | Latest difference |
| --- | ---: | ---: |
| Login desktop light | 17.89% | 9.70% |
| Signup desktop light | 20.37% | 15.14% |
| Forgot password desktop light | 10.11% | 8.66% |
| Profile desktop light | 22.12% | 22.01% |
| Sitemap desktop light | 24.38% | 13.26% |
| Project overview mobile light | 18.80% | 15.88% |
| About mobile light | 25.79% | 25.82% |

Latest per-frame measurements: `.logs/resume-visual-counts.json`. Side-by-side login review: `.logs/resume-login-pair.png` (reference left). The panel-height correction substantially reduces the desktop Login difference. About's spacing correction does not improve its full-page difference; do not describe it as a measured visual improvement.

Remaining differences include auth form vertical layout/Google button framing, profile geometry, shared shell/footer geometry, and legal/help content/layout. Retain the official Google artwork, truthful prototype disclosures, approved 44px targets, and server-rendered Home filtering. Do not shrink targets, remove truthful copy, increase tolerances or replace references to obtain a pass. Account/legal-help remain in review; a full green `npm run verify` and publication are still pending.
