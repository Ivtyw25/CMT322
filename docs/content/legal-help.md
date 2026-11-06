# Legal and help copy

Source: `docs/BRIEFING.md` and saved Figma light references for terms, privacy, contact, accessibility and sitemap. Figma MCP is unavailable in this session.

Keep the reference hierarchy, section order, help/legal navigation, related links and contact cards. Correct prototype text that implies Google Maps, real authentication, authority handling, guaranteed replies, a retention policy or legal compliance. This is USM CMT322 coursework with mock services, not an operational transport portal. Browser storage retains demo preferences, sessions, follows and reports; selected files are not uploaded. Confirmed careline and email come from the existing site-info data. No new legal or operational facts are asserted.

Accessibility describes supported controls and known limitations, not certification. English is the implemented language. Map alternatives link to route view and announcements. No fabricated accessible-format or response-time promise.

## Update 6 Nov 2026: copy matches Figma (owner decision)

Source: Figma MCP, terms 89:2843, privacy 99:3246, contact 99:3673, accessibility 99:3469 (desktop). The earlier "truthful prototype" copy and the prototype notices were removed. Section titles, order, paragraph and bullet counts now match Figma. Sitemap is unchanged.

| Page | Before | After | Why |
|---|---|---|---|
| Terms | 14 sections of short prototype text, 3-bullet summary, `demo` notice | Figma text: 14 sections (11 "Suspending or closing accounts", 14 "Law and contact"), 5-bullet "In short", dated line, emergency note | Owner decision |
| Privacy | 8 sections about browser storage, 3-bullet summary | Figma text: 8 sections ("5. Your rights", "6. Cookies"), 4-bullet "In short", closing line under rights | Owner decision |
| Contact | Lede and cards mention the simulated journey; demo notice under the first cards | Figma lede, card text, emergency note, careline and email lines (3 working days) | Owner decision |
| Accessibility | Prototype caveats, English only, no response time | Figma: WCAG 2.1 AA aim, 5 abilities, 3 limitations plus format note, 5 working days | Owner decision |
| All four | Shared "related" descriptions and one shared aside | Per-page related descriptions and a per-page `aside` as in Figma | Figma differs per page |

Deliberate departures from Figma, to keep the text true for this site:
- Terms 7 and 10: "Google Maps" became "OpenStreetMap" (the site uses Leaflet and OpenStreetMap, per CLAUDE.md).
- Accessibility: "Switch between English and Bahasa Melayu" became "Choose Light, Dark or System appearance. The site remembers your choice." The site has no language switch, and the theme choice is saved per browser (CLAUDE.md §3). The longer wording also wraps to two lines at 390 px like the Figma bullet.

## Needs component support (not done: components are out of scope here)

New optional content fields exist and are not yet rendered, so their text is currently missing on the pages:
- `updated` on terms, privacy and accessibility (the "Last updated" line under the lede).
- `note` on a section (terms 4 warning note, accessibility "Known limitations" info note). `HelpSection.note.tone` is `warning` or `info`.
- `after` on a section (paragraphs after the bullets, privacy 5).
- `aside` per page (title, body, primary and optional secondary button), replacing the shared `legalHelpCopy.aside` in the sidebar card.
- `legalHelpCopy.demo` is now an empty string. Remove the `<p>` and the key in `contact-page.tsx`.
- Contact "Urgent problems" note is rendered by the existing emergency block.
