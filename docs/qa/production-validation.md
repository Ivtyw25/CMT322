# Production validation (4 November 2026)

Validation snapshot: the main agent's existing production build at `http://localhost:3610`, with `DEV_GALLERY=1` and bundled local Inter/Poppins fonts. This supersedes the earlier fallback-font environment described in the historical legal/help QA round. This reviewer has not rebuilt or restarted the server and has changed no application source.

## Links and accessibility

- The initial combined run selected 294 checks: 98 link/button tests and 196 accessibility tests over 49 concrete page visits. It was stopped before completion to separate request-heavy link crawling from other concurrent suites. Its partial output in `.logs/final-links-a11y.log` is **not** a passing full verification result.
- One initial test, `links on home /?area=bukit-jambul`, hit the existing 60-second per-test limit during a sequential API request to `/project/stations/a01`. A separate direct request returned HTTP 200 in 2.36 seconds. The timeout remains unresolved until a clean isolated link run; no timeout setting or assertion has been weakened.
- The complete accessibility project finished with **193 passed, 3 failed (196 total, 13.7 minutes)** using two workers and no retries. Line output: `.logs/final-a11y.log`; artifacts: `.logs/final-a11y-results`. All 24 legal/help combinations passed. The three failures share the auth illustration-panel contrast defect PV-QA1 below.
- After the other browser suites finished, the main agent retained the unchanged baseline server for a complete 98-test link/button run with one worker, no retries and unchanged timeouts. The active run writes `.logs/final-links.log` and `.logs/final-links-results`. Source builders may edit files, but the main agent will not rebuild or restart this server until that baseline run completes. After the corrected build, only the affected route checks will be repeated while carrying the completed unchanged-route coverage forward.

Accessibility assertions use the existing WCAG-tagged axe configuration and block serious or critical violations. The traffic-map marker pane is excluded by the existing suite because text-list alternatives and independent marker/tap-target tests cover that interface. A passing axe run alone does not establish complete accessibility compliance. Root owns behavior, responsive and visual results; this file reports only the suites assigned to this reviewer.

## Required fixes

| ID | Severity | Evidence | Required fix |
| --- | --- | --- | --- |
| PV-QA1 | Serious accessibility defect | Login, signup and forgot-password fail axe `color-contrast` on the desktop illustration heading (`.max-w-lg`) in dark mode. `src/features/account/auth-shell.tsx` combines `bg-primary-800` and `text-static-white`; `src/styles/tokens.css` changes primary-800 to `#c3d7ff` in dark mode. White against that pale-blue panel is approximately **1.45:1**, below even the 3:1 large-text threshold. Mobile hides the illustration panel and passes. Each failure is recorded under `.logs/final-a11y-results/a11y-<page>-<route>-dark-desktop-a11y/error-context.md`. | Use the existing static navy/blue surface token for the branded illustration panel, or another token pairing that preserves readable heading contrast in both themes. Keep the axe assertion enabled. Rebuild and rerun the affected auth accessibility matrix after the fix. |

No application source was changed by this reviewer. The main agent has received PV-QA1. The initial Home link timeout remains separate and still needs its isolated link run after concurrent suites finish.
