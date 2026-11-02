# Report and track: main agent decisions (iteration 5)

These win over the page specs and the content file where they differ.

- **R1, report types:** Figma wins (BRIEFING: "Figma wins"). `ReportType` becomes `'complaint' | 'feedback' | 'inquiry'` (labels: Complaint, Feedback, General inquiry). Update `uiCopy.reportTypes`, the mock tickets and anything else that reads the type, such as account ticket lists and Home. Hazards are reported as a Complaint with a hazard category.
- **R2, guests can track:** yes, as the nav shows. Tracking by ticket ID works without signing in.
- **R5, upload limits:** follow Figma (PDF allowed) and update the shared `uiCopy.upload` so there's one source.
