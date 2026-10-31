# Traffic group: main agent decisions (iteration 4)

These win over the page specs and the content file where they differ.

1. **T1, map counts (Figma: 4 closures, 6 construction zones, 2 hazards, "In this area (12)").** Add the two missing records, so the map matches Figma:
   - a hazard, "Uneven road surface", on Jalan Tun Dr Awang near S09, reported 27 Oct 2026
   - one construction zone outside the Bukit Jambul area
   Hazards are their own kind (not announcements or road works), so Home's Works list (`toWorksItems`) stays unchanged: it still shows 12 Oct, 26 Oct and 3 Nov for Bukit Jambul. Mark both records VERIFY in `docs/content/verify.md`.
2. **T2, "View notice".** There is no notice URL on the records, so the link goes to `routes.traffic.announcement(id)` (`/traffic/announcements#<id>`). No external links.
