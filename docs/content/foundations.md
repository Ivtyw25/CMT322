# Foundations: copy change notes

Shared copy in `src/content/` (common, nav, footer, notifications, ui, dev). Typos and casing fixes are not listed.

| Where | Before (Figma) | After | Why |
|---|---|---|---|
| `common.siteName`, footer copyright | Mutiara Line Community Connect (some frames) | Mutiara LRT Community Connect | One product name across the site, as in the Figma logo and BRIEFING §8 |
| `footer.social.title` | Follow MRT Corp | MRT Corp on social media | The names are plain text with no links (owner decision), so "Follow" invites an action the page cannot offer |
| `nav.reportTrackPanel.accountTitle` / `accountText` | You need an account to report or track | You need a free account to send a report. Guests can still read every page and track a ticket. | Track a ticket is not a protected route; the old text was wrong and put guests off |
| `nav.reportTrackPanel.emergencyText` | For urgent problems at a worksite, call MRTCareline on 1800-88-6782, 24 hours. | …, open 24 hours. | "24 hours" alone reads as a duration; "open 24 hours" says the line is always open |
| Announcement title (KOMTAR detour) | Pedestrian detour beside Komtar | Pedestrian detour beside KOMTAR | Proper name is written in capitals everywhere else |
| `footer.newsletter.bodyMobile` | Choose your area and we email you… (Figma 127:5801) | We email you when a closure or night work is announced. Unsubscribe at any time. | The mobile form has no area field, so "Choose your area" asked for something the reader cannot do there |
| `notifications.viewDetails` + `viewDetailsContext` (accessible name) | View details about the road closure tonight (spec §8) | View details: Road closure tonight | Built from the notice title, so the name stays right for every notice instead of one fixed sentence. Screen readers hear the visible "View details" first, then the title |
| Nav Traffic panel card lines | One lane each way, until Jul 2027 (mixed patterns) | {brief} until {date}, e.g. "One lane each way until Jul 2027" | One pattern for every card, built from the record; no stray comma |

New copy with no Figma original (states, errors, accessible names) is listed in `generated.md`.
