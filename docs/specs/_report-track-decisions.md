# Report and track: main agent decisions (iteration 5)

These win over the page specs and the content file where they differ.

- **R1, report types:** Figma wins (BRIEFING: "Figma wins"). `ReportType` becomes `'complaint' | 'feedback' | 'inquiry'` (labels: Complaint, Feedback, General inquiry). Update `uiCopy.reportTypes`, the mock tickets and anything else that reads the type, such as account ticket lists and Home. Hazards are reported as a Complaint with a hazard category.
- **R2, guests can track:** yes, as the nav shows. Tracking by ticket ID works without signing in.
- **R5, upload limits:** follow Figma (PDF allowed) and update the shared `uiCopy.upload` so there's one source.

## UX open questions answered

1. **No review step:** the form is a single page, and the Submitted page is the summary. Confirmed.
2. **Privacy:** status and replies are public by ticket ID. The description, photos and contact details show only to the signed-in owner. Confirmed.
3. **Overview guest sentence:** drop "to track a ticket" from the log-in clause (R2). The builder edits `reportTrackCopy`.
4. **Resting state:** the form starts empty. The visual test fills the form to match Figma's filled frame.
5. **New tickets:** they live in this browser only (`mlc-submitted-reports`, try/catch). The ID date uses the mock today. Accepted.
6. **Extras not in Figma:** keep the nearest-station address fill, because it supports `?station=`. Drop "Your recent reports" and "Where to find your ticket ID" from the empty `/track`; empty `/track` is what Figma shows.
7. **Shared changes (`_report-track-shared.md` §1):** all ten approved, if they're additive and backwards compatible. The `LocationMap` pin mode builds on patterns/map as it is on main. The traffic branch is changing map-canvas too, so keep the pin mode in its own file or props, so the merge stays simple.
