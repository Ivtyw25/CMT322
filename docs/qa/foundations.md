# QA: Shared layer, foundations (round 1)
Result: FAIL

Checked on `/dev/components` (gallery), the shell around the placeholder Home (`/`) and the placeholder 404, at 320, 360, 390, 768, 1024, 1440 and 1920 px, light and dark, guest and signed in. Compared with Figma 1:127, 127:5801, 101:3919, 101:3971, 101:4008, 123:5280, 47:1249 and 134:8244, and the dark Home reference (D01 121:4634, `tests/visual/reference/home--1440--dark.png`).

Screenshots: `tests/visual/__diff__/qa-foundations/` (gitignored). The file names are given under each issue.

| DoD | Check | Result | Evidence |
|---|---|---|---|
| 1 | Design match light/dark | ❌ | No reference exists for the gallery, so the shell was compared side by side with Figma. Two major differences: menu placement (B1) and footer form width (B2). Spec mismatch on Home menu-open (U1). `test:visual`: Home fails at 84–96 % (Home is still the placeholder; accepted, not counted). |
| 2 | Typecheck / lint / tokens | ✅ | `typecheck` 0, `lint` 0 (ESLint and Prettier clean), `check:tokens` 0. `verify:quick` e2e: the 56 original shared tests pass. The 4 tests I added fail and document B1, B7 and B8 (one other test failed once and then passed; watch for flakiness). |
| 3 | Screen sizes | ✅ | `test:responsive` 18/18 passed. No horizontal scroll at 320–1920 or at 200 % zoom (720 CSS px at DPR 2). The header switches at 1023/1024. Mobile bar targets are 44 px with `hit-area`. The 1024 footer wraps badly (B2). |
| 4 | Links | ❌ | `test:links`: 3/4 passed. The gallery button crawl timed out at 60 s (a test budget issue; I raised the timeout to 300 s in `tests/links/links.spec.ts`). On rerun it finds one real fault: "Show notice again" does nothing while the notice is showing (B12). Pages not built yet are reported as pending. Social names are plain text. `/dev/components` returns 404 in production (`next start`). |
| 5 | File structure | ✅ | Matches ARCHITECTURE.md. Nothing outside `data/api` imports mocks. No route strings typed outside `config/routes.ts`. No copy in JSX. No TODO, dead or commented-out code. Client boundaries are at the interactive leaves (`DesktopHeader`, 329 lines, is the largest; acceptable). |
| 6 | Content | ❌ | The shell copy matches `src/content/*` and `docs/content/foundations.md`. The footer area options match the spec (6). Gallery sample content is mismatched (B11). Content documentation gaps (C1, C2). |
| — | Accessibility (axe) | ✅ | `test:a11y` 8/8 passed (light and dark, desktop and mobile). Checked by hand: skip link at 16/16 moves focus to `main`; Tab order follows the spec; panels and menus support arrows, Home/End, Escape and focus return; drawer `inert`, scroll lock and Escape; live-region messages "Appearance set to Dark" and "You are logged out."; newsletter `aria-invalid`/`aria-describedby`, focus on the first error, `role="status"` success with focus; back to top focuses the logo; reduced motion leaves the drawer animation at 0.01 ms. |
| — | Build | ✅ | `npm run build` succeeded; 6 static routes. |

Behaviour I ran by hand (all pass unless an issue says otherwise): nav panels open on click only (hover does nothing), close on outside click and when Tab leaves them; theme choice applies, saves, survives reload, and shows no flash or hydration warning; notice dismiss hides it, focuses `main` and keeps it hidden on reload; sign out from the account menu clears the session and focuses Log in; `/report` and `/account?x=1#reports` redirect guests to `/login?next=…` with search and hash kept; newsletter shows the empty, format, sending ("Signing you up…", fields disabled), `@fail.test` error (focus on the button) and success states; the docs layout scroll-spy, hash, heading focus at 117 px, sticky section bar at 61 px, and section bar Escape all work.

## Issues
| # | Owner | Severity | What and where | Expected (Figma node / spec section / content key) | Status |
|---|---|---|---|---|---|
| B1 | builder | major | The Appearance and account menus open 8 px below their **button** (top 74 px), so they cover the bottom 19 px of the 93 px header and its border. Evidence: `account-1440-light.png`, `appearance-1440-dark.png`; e2e "the appearance and account menus open 8 px below the header" (received −19). | 8 px below the header bottom (top 101 px), right edge on the button's right edge. Spec §4, §5; Figma 123:5280, 101:4008 | open |
| B2 | builder | major | The footer area select has no width and stretches to 260 px. At 1440 the form starts at x 648 (Figma 799) and the newsletter text wraps to "…closure or night / work is announced". At 1024 the title wraps to 2 lines and the text to 5 lines in a column about 170 px wide. Evidence: `home-1440-light.png`, `home-1024-light.png`. | Select hugs its content ("All areas" + chevron, about 107 px); email 280; text column as in Figma. Figma 1:127; spec §12 (≥1024) | open |
| B3 | builder | minor | Footer "Back to top" sits at the far right of the social row. | Directly after the LinkedIn pill (x 789 in Figma). Figma 1:127 | open |
| B4 | builder | minor | Footer dividers: light #6175ad (Figma #ffffff), dark #545c70 (Figma #141416). | Main agent decision 6: the token Figma binds (`surface`) at the frame's opacity. Figma 1:127, D01 121:4634 | open |
| B5 | builder | minor | Newsletter icon tile: a `mail` icon on a static white tile in both themes. | Figma uses `bell`; the tile is `surface`, so in dark it is a dark tile with a light bell. Figma 1:127, D01 | open |
| B6 | builder | minor | Legal row: 24 px gap between the copyright and "Privacy policy". | About 58 px, as in Figma 1:127 | open |
| B7 | builder | minor | Resizing doesn't reset the open state. A nav panel opened at 1280 is open again after the window narrows below 1024 and widens back. The drawer opened at 390 is open again after the window widens to 1100 and narrows back. e2e: "resizing below 1024 px closes an open panel for good", "resizing to 1024 px or wider closes the drawer for good". | Spec §3 (closes on resize below 1024), §7 (closes on resize to ≥1024) | open |
| B8 | builder | minor | The Appearance menu focuses "Light" on open, although "Match system" is checked. Arrow Up on the first item does not wrap. e2e: "the appearance menu focuses the checked option and arrow keys wrap". | Spec §4: focus goes to the checked option; arrows wrap | open |
| B9 | builder | minor | Drawer (guest): "Create an account" is centred. Evidence: `drawer-390-light-full.png` vs `ref-drawer.png`. | Left-aligned under the Log in button. Figma 134:8244 | open |
| B10 | builder | minor | Gallery: the three Section bar specimens are empty at ≥1024 px, because they keep `lg:hidden`. Evidence: `g-sectionbar-docs.png` (1440) vs `g390-sectionbar-docs.png`. At 390 the closed and long-text specimens show no chevron. | Spec "Dev components gallery": parts take a `layout` prop so previews render at any viewport | open |
| B11 | builder | minor | Gallery sample content doesn't make sense: the password field is labelled "Ticket ID"; the leading-icon email field's hidden label is the error "Enter your email address"; the "Category" select lists areas; line-rail stops are named after areas ("S19 All areas") with pier-cap subtitles; timeline entries are FAQ questions. Evidence: `g-fields-dark.png`, `g-rail.png`. | DoD 6: sensible content. Use the matching samples in `src/content/dev.ts` (ask content-writer for any that are missing) | open |
| B12 | builder | minor | Gallery toolbar "Show notice again" does nothing while the notice is showing (found by `test:links`: `button does nothing "Show notice again"`). | Disable it while the notice is visible, or make it always do something visible | open |
| U1 | ux-designer | major | Spec §2 "Home with a panel or menu open" says the header turns Solid and cites Figma 47:1249. 47:1249 (`tests/visual/reference/home-menu-open--1440--light.png`, crop `ref-menu-open.png`) shows the header still **Transparent** over the hero, with the open trigger as a white pill (`surface` background, `primary-700` text). The build follows the spec, so the home-menu-open visual state will not match. | Either change the spec to follow Figma, or record a decision (with contrast as the reason) and accept the diff | open |
| U2 | ux-designer | minor | The Traffic panel rule "start date, newest first" gives FIZ, KOMTAR, Jalan Sultan Azlan Shah. Figma 101:3919 shows the reverse: Jalan Sultan Azlan Shah, KOMTAR, FIZ. | A sort rule that reproduces Figma (e.g. oldest start first, or longest-running first) | open |
| C1 | content-writer | minor | `docs/content/verify.md` numbering starts at #2; #1 is missing. | Numbered from 1, or a note saying #1 was removed | open |
| C2 | content-writer | minor | `docs/content/foundations.md` doesn't log two changes from Figma: the mobile newsletter text (Figma 127:5801 "Choose your area and we email you…" → `footer.newsletter.bodyMobile` "We email you…") and the notice link name ("View details: Road closure tonight" vs spec §8 "View details about the road closure tonight"). | Record both in the change table (the wording itself is fine) | open |

Not counted (accepted): Home hero placeholder and its visual diff; 404 placeholder (its title has no page name); footer social names as plain text; links to unbuilt pages reported as pending; the drawer is full height (spec decision, Figma shows content height).

Tests changed by QA (no product code touched):
- `tests/e2e/shared/header-menus.spec.ts`: 3 tests (resize closes a panel, Appearance focus and wrap, menu placement)
- `tests/e2e/shared/drawer.spec.ts`: 1 test (resize closes the drawer)
- `tests/links/links.spec.ts`: button crawl timeout raised to 300 s

## History
- Round 1: 16 issues (builder 12: 2 major, 10 minor; ux 2: 1 major, 1 minor; content 2 minor)
