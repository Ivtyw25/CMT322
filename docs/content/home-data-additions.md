# Home: data additions

Checked against the foundations mock data (`src/data/{models,mock,api}`) and `docs/specs/home.md`, 30 Oct 2026.

## Replacements to paste (3 values)

The Home spec requires these records to read exactly as Figma 37:1025. Each record exists once, so the new text also shows on Announcements, Traffic and Construction progress.

### `src/data/mock/announcements.ts`, id `sultan-azlan-shah-lane-closure`

```ts
    summary: 'One lane each way for viaduct works.',
```
Replaces `'One lane closed in each direction for viaduct works.'`. The `brief` field (`'One lane each way'`) already matches this wording.

### `src/data/mock/construction-updates.ts`, id `water-mains-bayan-lepas-fiz`

```ts
    title: 'Utility relocation at Bayan Lepas FIZ',
```
Replaces `'Water mains moved at Bayan Lepas FIZ'`. The summary already says "Water mains moved…", so the card still says what happened.

### `src/data/mock/construction-updates.ts`, id `piling-george-town-station`

```ts
    title: 'Piling starts at George Town station site',
```
Replaces `'Piling starts at the George Town station site'`. The record's `// VERIFY:` comment (station not named) stays.

After pasting, remove the matching two rows ("Home card (FIZ utility update)" and "Construction update title") from `docs/content/foundations.md`. Those foundations edits are reversed.

## Already correct (no change)

| Home needs | Source | Status |
|---|---|---|
| Area chips (5 plus "All areas") | `getAreas()`: labels match Figma 37:1419 | OK |
| Bukit Jambul: the 3 Figma items first by start date | active or upcoming, `startDate` ascending: 12 Oct closure, 26 Oct lane shift, 3 Nov night works (22:00 to 06:00). The 4th (Tun Dr Awang utility works, 10 Nov) is hidden by the 3-item cap | OK |
| "Traffic shifts to the inner lane near the station site." | `bukit-jambul-lane-shift.summary` | OK, matches Figma |
| Other chips give different results | Bayan Lepas and airport 2, Gelugor and USM 1, Jelutong to George Town 3, Butterworth 0 (empty state, kept on purpose), All areas first 3 of 10 | OK |
| Progress card 1 | `pier-caps-sultan-azlan-shah`: title and summary match Figma | OK |
| Progress summaries 2 and 3 | Match Figma | OK |
| Common questions | `getMostAskedFaq()` ranks 1 to 5 in Figma order; `summary` matches the open answer | OK |
| Line rail | `getStations()` name, subtitle, `isProvisionalName` | OK |
| Search "buk" | exactly 1 station, 1 road and 1 area | OK |
| Careline | `getSiteInfo().careline` label, number, tel | OK |
| Station coordinates for Map view | Being added by the foundations content writer (main agent answer 2) | Not Home's job |
