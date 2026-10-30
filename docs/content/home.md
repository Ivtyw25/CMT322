# Home: copy change notes

Copy in `src/content/home.ts` (`homeCopy`). Figma 37:1025 (desktop), 133:6556 (mobile), 49:1127 (search). Typos and casing fixes are not listed. Records (cards, stations, FAQ answers, search entries) live in the foundations mock data and are not edited here.

| Where (key) | Before (Figma) | After | Why |
|---|---|---|---|
| `hero.tagline` | Empowering Mobility / Enriching Communities | Kept as is | Project slogan. Title case kept because it is a brand line, not a heading |
| `works.lede` | Pick your area to see what is happening on your roads this week. | Choose your area to see current and upcoming works on your roads. | The cards run for months (e.g. 12 Oct 2026 to Jul 2027), not "this week". "Choose" is plainer for second-language readers |
| `works.allAnnouncements` | All announcements | See all announcements | Links start with a verb (CLAUDE.md §4) |
| `line.lede` | 22 stations linking PSR-A, the airport and George Town with Penang Sentral on the mainland, ready in December 2031. | 22 stations will link PSR-A, the airport and George Town with Penang Sentral on the mainland. Opening is planned for December 2031. | Two short sentences. "Planned" because the date is a target. Fact unchanged (VERIFY H1) |
| `line.captions.route` | Station order, not to scale | Stations in line order, not to scale | Reads as a sentence |
| `line.legend.junction` | Interchange: Macallum links the two routes | Junction: the two routes meet at Macallum | "Interchange" suggests changing to another line or mode. Macallum is where the routes to KOMTAR and to Penang Sentral split |
| `about.body` | The LRT Mutiara Line is more than a transit solution. It is a cornerstone of the Penang Transport Master Plan, laying the foundation for inclusive growth and job creation in line with the State Government's vision of a connected and dynamic future. | The LRT Mutiara Line is a key part of the Penang Transport Master Plan. It is more than a way to travel. It will support growth that benefits everyone and bring new jobs, as part of the State Government's vision of a connected, dynamic Penang. | One 40-word sentence split into three. "Cornerstone", "transit solution" and "inclusive growth" replaced with common words. Same claims (VERIFY H2) |
| `guide.cards[announcements].body` | Browse current, upcoming and past road changes with their start date, end date and duration. | See current, upcoming and past road changes, with start and end dates and how long they last. | Plainer. "Duration" spelt out |
| `guide.cards[ticket-id].body` | Every report gets a unique ticket ID straight away, with a confirmation sent to your email. | Every report gets its own ticket ID straight away. We also email you a confirmation. | Two short sentences, active voice |
| `guide.cards[faq].body` | The FAQ covers construction hours, road closures, property, operations and land acquisition. | Read answers about construction hours, road closures, property, train services and land acquisition. | Avoids the abbreviation. "Operations" is vague: the topic covers opening date, train frequency and fares |
| `progress.lede` | Posted by the project team with photos from site. | Updates and site photos from the project team. | Shorter, and fixes "from site" |
| `faq.seeAll` | See all FAQs | See all questions | Many readers skip "FAQs". Matches "Show all 22 questions" on the FAQ page |
| `works.subscribe.emailLabel` | Placeholder only | Visually hidden label "Email address" plus the Figma placeholder | A placeholder is not a label: it disappears while typing |
| `line.junctionSuffix` | (spec draft: ", interchange between the two routes") | ", where the two routes meet" | Same reason as the legend: Macallum is not a change to another line |
| `help.careline.title` | MRTCareline 1800-88-6782 | Same text, built from the site-info record | The number lives once in data. The heading is a `tel:` link named "Call MRTCareline on 1800-88-6782" |

Spec alignment: keys follow `docs/specs/home.md` (`hero`, `search`, `works`, `line`, `about`, `guide`, `safety`, `progress`, `help`, `faq`). The hero photo is decorative (`alt=""`) per the spec. The page title is `commonCopy.metadata.defaultTitle`.

Not changed: safety tip titles and bodies, help strip report and property copy, section headings, and the button labels "View traffic map", "Report an issue", "Track a ticket", "Read more about the line", "Read about property surveys", "See all updates" and "Get updates".

New copy with no Figma original (labels, states, accessible names) is listed in `generated.md`.
