# Report & Track: copy change notes

Copy in `src/content/report-track.ts` (`reportTrackCopy.shared`, `.overview`, `.report`, `.submitted`, `.track`). Figma: overview 71:2326 and 133:32762, report 1:950 and 133:33123, submitted 1:1120 and 133:33577, track 1:1175 and 133:33954. Tickets already exist in `src/data/mock/tickets.ts`: MLC-261028-0482 matches Figma and every status has a record. No ticket records were added.

| Where (key) | Before (Figma) | After | Why |
|---|---|---|---|
| `overview.header.lede` | ...Log in or create an account to report an issue or track a ticket. | ...to report an issue. You do not need an account to track a ticket. | Nav says guests can track. VERIFY R2 |
| `overview.emergency` | Emergency or immediate danger? Call 999. Reports are not monitored around the clock. | Same | Fact kept |
| `report.files.dropzone.rules` | JPG, PNG or PDF, up to 10 MB each, maximum 5 files | Same | Differs from `uiCopy.upload`. VERIFY R5 |
| `report.consent.label` | I agree that the details in this report can be shared... | Same | Legal meaning kept |
| `submitted.header.lede` | Thank you, Mei Ling. We've emailed... | Same, built from name and email | Dynamic, not hard-coded |
| `track.errors.invalid` | none | Enter a ticket ID in the format MLC-261028-0482 | Matches `uiCopy.form.errors` |

## Hidden content

- Report type cards (3), category placeholder and error. The 9 category options are records in `report-categories.ts`.
- Validation for subject, description, location, phone, email, consent; upload errors; location errors.
- Submit failure, error summary, cancel confirmation, guest log-in panel.
- Submitted: copy button states, attachment counts, not-found, loading.
- Track: idle, empty, invalid, not found and load-failed states, loading, no replies, no photos.
- Overview: 4 how-it-works steps, 3 popular questions with answers.
