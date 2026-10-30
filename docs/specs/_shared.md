# Shared shell and UI parts: UX spec
Route: every route (shell), plus `/dev/components` · Figma: Components 1:48, Mobile components 127:5451, Header set 4:736, Mobile header 127:5787, Nav panel 101:4039, Notification bar 4:750 (over hero: instance 37:1236), mobile bar 127:5800, Footer 1:127, mobile footer 127:5801, Dark mode guidelines 124:5451, states 47:1249 / 134:8244, docs layout 1:332, section bar 129:6117 (in M · About 129:5475)

Page specs link here instead of repeating shell behaviour. Anything marked **Decision:** is not answered by Figma; the main agent confirms or overrides it (see "Open questions").

## Purpose and primary task
Every visitor uses the shell to get somewhere fast: open a group, pick a page, check the one urgent road notice, switch the theme, sign in or out. Many are commuters on a phone at the roadside, so every control is one tap, labelled in plain words, and works with one thumb.

## Layout across breakpoints

Breakpoints are Tailwind defaults (`md` 768, `lg` 1024, `xl` 1280). Container: `max-w-content` (1200) centred, side padding 20 / 32 / 40 px (`px-5 md:px-8 lg:px-10`).

| Width | Layout |
|---|---|
| 320–389 | Mobile frames. Header bar 60 px + 1 px border, 16 px side padding; logo mark 36 px, wordmark never wraps. Bar fits at 320 (logo 131 + theme 40 + avatar 36 + menu 40 + gaps). Notification bar stacks (icon + title row, message, link). Footer link columns stay 2-up (each column is ~140 px at 320; labels such as "Construction progress" may wrap to two lines, that is fine). Social pills wrap. |
| 390–767 | Mobile frames as designed (127:5453–127:5694, 127:5788, 127:5801). |
| 768–1023 | Still the mobile header and drawer (house rule: desktop header from 1024). Side padding 32 px. Drawer content keeps one column, full width. Notification bar keeps the stacked mobile layout. Footer: tablet layout (see Footer). Docs pages: section bar, no sidebar. |
| 1024–1279 | Desktop header (`data-header="desktop"`), 40 px side padding, logo left, nav centred by `justify-between`, actions right. Nav panel width = container width (944 px at 1024), two equal columns. Notification bar single row; message may wrap to two lines, close button stays top-aligned right. Docs layout: sidebar 240 + article (fluid, max 760); the "On this page" aside is hidden and its "Need help?" block moves below the article, as on mobile. Desktop footer layout, compressed (columns flex). |
| 1280–1439 | Desktop. Docs layout gets all three columns (240 / up to 760 / 200). |
| 1440+ | Desktop frames as designed. Content stays 1200 px centred; at 1920 the extra width is empty margin. Full-bleed: header background and border, notification bar background, hero, footer background. |

## Sections (top to bottom)

### 1. Skip link
- First focusable element on every page. Copy `commonCopy.skipToContent` ("Skip to main content").
- Hidden until focused; on focus it shows top-left (16 px from top and left) as a Primary button above everything (z above header). Activating moves focus to `<main id="main" tabindex="-1">` (no visible focus ring on `main`).

### 2. Desktop header (≥1024), node 4:736
Height 92 px + 1 px bottom border. Content source: `src/content/nav.ts` (groups, labels, panel copy), session from `@/lib/session`, user from `data/api` (`getCurrentUser`).

**Stickiness. Decision:** the header (desktop and mobile) is `position: sticky; top: 0` on every page, so the menu is always one tap away on long pages (About is 4,300 px tall). It does not hide on scroll. Anchored headings get `scroll-margin-top` = header height + 24 px (desktop 117 px, mobile 85 px; add 45 px more on docs pages under 1024 for the section bar).

**Solid vs transparent.**
- **Transparent** is used only on Home, over the hero (frame 12:681, instance 37:1237). The header is pinned at the top and overlays the hero (the hero starts at y = 0 behind it). Text and icons `static-white`, bottom border white 20 %, theme button border `static-white`, Log in button border white 60 %. No background; the hero's `bg-nav-scrim` gives contrast.
- **Solid** everywhere else (1:95, 4:697): `surface` background, `gray-200` bottom border, text `gray-700`/`gray-900`.
- **Home on scroll. Decision:** the header switches to Solid as soon as `window.scrollY ≥ 8`, and back to Transparent when it returns below 8. Reason: once the nav scrim scrolls away, white text over bright parts of the photo fails contrast. Transition: `background-color`, `border-color`, `color` 200 ms ease-out (colours only).
- **Home with a panel or menu open (desktop, ≥ 1024):** the header **stays Transparent** at scroll < 8 while a nav panel, the Appearance menu or the account menu is open (Figma 47:1249). Only the open trigger changes: it becomes a white pill, bg `surface`, text and chevron `primary-700`, `chevron-up`. The theme button and account chip do the same when their menu is open (icon or label and chevron `primary-700`; the avatar keeps its colours). The panel itself is the normal opaque `surface` card, so its content needs no extra treatment. Opening or closing a panel never switches the header variant; only the scroll rule above does (scrollY ≥ 8 → Solid, with the panel staying open). The mobile drawer rule in §2a is unchanged (the drawer is on a Solid bar, 127:5694).
- Signed in on Transparent is not designed. **Decision:** account chip label and chevron `static-white`; the avatar circle keeps `primary-100` / `primary-800`; hover `static-glass`.

**Guest vs signed in.**
- Guest actions: theme button (40 × 40, `contrast` 18 px) + "Log in" link (Secondary style with `user` icon 18 px).
- Signed in: theme button + account chip (avatar circle 32 px `primary-100` with initials "ML" Body/XS Semibold `primary-800`, first name "Mei Ling" Body/S Medium `gray-800`, `chevron-down` 16 px).
- The nav triggers are identical for both.

**Nav triggers** ("Project", "Traffic", "Report & Track"): `<button>` with Body/S Medium label + `chevron-down` 16 px, padding 8 × 12, radius `lg`.

| State | Solid | Transparent |
|---|---|---|
| default | text `gray-700` | text `static-white` |
| hover | bg `gray-100`, text `gray-900` | bg `static-glass` |
| focus-visible | global ring (2 px `primary-600`, offset 2) | ring `static-white` |
| open | bg `primary-50`, text `primary-700`, `chevron-up` (15:772) | bg `surface`, text and chevron `primary-700`, `chevron-up` (47:1249) |
| current group | text `primary-700`, Body/S Semibold (weight is the non-colour cue) + visually hidden ", current section" | n/a (Home has no group) |

**Current group. Decision:** a page belongs to a group by route: `routes.project.*` → Project; `routes.traffic.*` → Traffic; `routes.reportTrack.*` (overview, report, submitted, track, ticket) → Report & Track. Account, legal and help pages have no current group. Derive it from the route definitions, never from string prefixes typed in components.

### 3. Nav panels (mega menu), node 101:4039
One panel per trigger: Project 101:3846, Traffic 101:3919, Report & Track 101:3971. Panel: 8 px below the header bottom (Figma top 101 = 92 + 1 + 8), left edge = container left edge, width = container width, radius `3xl` (16), border `gray-200`, `shadow-panel`, `surface`. Two columns 50/50: left "pages" (intro + line rail), right "feature" (`gray-50`, left border `gray-200`). `max-height: calc(100dvh − 117px)`; scrolls inside if the window is short (e.g. 1024 × 600).

Left column (all panels): intro title (Heading/3XS) + description (Body/S `gray-600`), then the line rail: each page is a row link (stop 20 px + title Body/M Semibold + description Body/S `gray-600`); the first stop (Overview) is filled, the others hollow, on a 3 px `primary-200` line. Row states: hover bg `gray-50`, title `primary-700`; focus-visible ring inside the row (offset −2 px so it isn't clipped); current page (`aria-current="page"`) bg `primary-50`, title `primary-700`.

Right column:
- **Project:** "Find a station", a card of 4 station rows (S20 KOMTAR, S13 Jalan Universiti, S09 Bukit Jambul, S03 Penang International Airport; code chip `primary-600`/`static-white`, name, area, `chevron-right`), then "See all 22 stations". Station row hover bg `gray-50`. **Decision:** the four stations are fixed content (same for guests and signed-in users).
- **Traffic:** "Happening now", up to 3 announcement cards (Active tag, title Body/S Semibold, one-line summary Body/XS `gray-600`), then "All current closures". Source: `getAnnouncements({ status: 'active' })`, then ordered by start date **oldest first** (longest-running closure on top), first 3. With the current mock data this gives Jalan Sultan Azlan Shah, KOMTAR, FIZ, as in Figma 101:3919. Ties: earlier end date first. Card hover: border `primary-300`. Empty (no active items): replace the cards with Body/S `gray-600` "No road closures right now." and keep the link.
- **Report & Track:** emergency callout (`warning-50`, 3 px left border `warning-600`, `triangle-alert` 16 px, title `warning-700` Body/S Semibold, text `gray-700`), then the account note card ("You need a free account to report or track", "Guests can still read every page.", "Create an account"). **Decision:** the account note shows to guests only; signed-in users see the emergency callout alone (Figma 102:4036 shows the note for signed-in users too, which contradicts its own wording). The careline number in the callout is plain text here, as in Figma.

**Behaviour.**
- Opens on **click/tap** (Enter or Space on a focused trigger). **Decision:** no hover-to-open. Reason: predictable on touch laptops, no accidental panels while moving the mouse to the logo, and matches the click interaction in the prototype.
- One panel at a time. Clicking another trigger while a panel is open swaps the content instantly (no close/open animation). Clicking the open trigger closes it.
- Closes on: Escape (focus returns to its trigger), click or tap outside the header and panel, choosing any link inside, a route change, resizing below 1024 px, opening the Appearance or account menu.
- Pattern: **disclosure**, not an ARIA menu. Trigger has `aria-expanded` and `aria-controls`; the panel is a `<div>` that follows its trigger in DOM order and contains plain links in lists. No focus trap.
- Keyboard: Tab from an open trigger goes into its panel (left column top to bottom, then right column), then on to the next trigger; when focus leaves the trigger + panel pair, the panel closes. Arrow Down on a closed trigger opens it and focuses the first link; Arrow Down/Up move between links inside an open panel; Arrow Left/Right move focus between the three triggers (and, if a panel is open, open the focused trigger's panel instead); Home/End jump to the first/last trigger. Escape anywhere in the panel closes it and focuses the trigger.
- No backdrop or dimming behind the panel (47:1249 shows none). The page under it does not scroll-lock.

### 4. Appearance menu (desktop and mobile), node 123:5280
- Opened by the theme button (`contrast` icon). Per the dark-mode board: the button opens the menu, it never toggles the theme directly.
- 264 px wide, 8 px below the header, right edge aligned to the theme button's right edge (desktop). On mobile: right edge 16 px from the viewport edge, width `min(264px, 100vw − 32px)`. Radius `2xl`, `shadow-menu`, padding 8.
- Content: label "Appearance" (Body/S Semibold) + "Saved on this device" (Body/XS `gray-500`), not focusable. Options: Light (`sun`), Dark (`moon`), Match system (`monitor`, with "Follows your device setting" always shown). Selected option: bg `primary-50`, label `primary-700` Body/S Semibold, `check` 16 px on the right. Default for new visitors: Match system.
- Theme button states: default border `gray-200`; hover bg `gray-50`, border `gray-300`; open bg `primary-50`, border `primary-200`, icon `primary-700` (123:5300); focus-visible global ring. On Transparent: border `static-white`, icon `static-white`, hover `static-glass`.
- Pattern: ARIA menu with a radio group (Radix `DropdownMenu` + `RadioGroup` via shadcn). On open, focus goes to the checked option. Arrow Up/Down move (wrap), Home/End, typeahead (L/D/M), Enter/Space select. Choosing an option applies the theme at once (no transition on colours; disable transitions for one frame while the theme swaps), saves it (`mlc-theme`, via `useTheme().setPreference`), closes the menu and returns focus to the theme button. Escape or outside click closes without change.
- Accessible name of the button: "Appearance" + current choice, e.g. "Appearance: Match system". The global live region announces "Appearance set to Dark".

### 5. Account menu (desktop, signed in), node 101:4008
- Opened by the account chip. 300 px wide, 8 px below the header, right edge aligned to the chip's right edge. Radius `2xl` (Figma 14; use `2xl`, 12, and log the 2 px difference), `shadow-panel`.
- Content: identity block (avatar 40 px `primary-600` with initials `static-white`, full name Body/S Semibold, email Body/XS `gray-500`; not focusable). Links: Profile & settings (`user`) → profile, My reports (`ticket`) → `#reports`, My stations (`map-pin`) → `#stations`, Notifications (`bell`) → `#notifications`. Divider. "Log out" (`log-out`) is a **button** (it is an action, although Figma draws it as a link).
- Item states: hover/highlighted bg `gray-100`, text `gray-900`; focus-visible ring inside the item.
- Chip states: hover bg `gray-100`; open bg `primary-50` (102:4220); focus-visible ring.
- Pattern: ARIA menu (Radix `DropdownMenu`, links via `asChild`). Focus goes to the first item on open; Arrow keys, Home/End, Escape (focus back to chip), outside click closes. Choosing a link navigates and closes.
- Long names: the chip shows the first name, truncated with an ellipsis at 160 px; the menu shows the full name and email wrapping (`break-words`).

### 6. Mobile header (<1024), node 127:5787
Bar 60 px + 1 px border, padding 10 × 16, gap 8. Root `data-header="mobile"`. Order: logo link, spacer, theme button (40 × 40, `contrast` 20 px), [signed in: avatar link 36 px `primary-100`, "ML" `primary-700`] , menu button (40 × 40, `menu` 20 px ↔ `x` 20 px).
- Transparent on Home over the hero (127:5680), same scroll rule (Solid at scrollY ≥ 8) and Solid whenever the drawer or Appearance menu is open (127:5694 shows the open drawer on a Solid bar).
- Theme button opens the Appearance menu (section 4).
- Signed-in avatar is a link to `routes.account.profile`, accessible name "Your profile, Tan Mei Ling" (content key). It gets `hit-area`.
- Theme and menu buttons get `hit-area` (40 → 44).

### 7. Mobile drawer, node 127:5592 (state 134:8244)
- Menu button: `aria-expanded`, `aria-controls="site-menu"`, label "Open menu" when closed, "Close menu" when open; the icon swaps `menu` ↔ `x` instantly.
- **Decision (full height):** the drawer starts directly under the bar and fills the rest of the viewport: `height: calc(100dvh − 61px)`, `surface`, `shadow-drawer`, scrolls inside (`overscroll-behavior: contain`), bottom padding `env(safe-area-inset-bottom)` + 8 px. It covers the notification bar and page. No separate scrim is needed because it covers everything below the bar.
- Scroll lock: while open, the page behind does not scroll (lock `<html>` overflow; keep the scroll position; reserve the scrollbar gutter so nothing shifts).
- Content top to bottom (all always expanded; **Decision:** no accordions, as designed. Reason: 12 links fit, one tap fewer):
  1. Group "Project" (label Body/XS Semibold `gray-500`) with rows Overview, About the line, Stations, Construction progress, FAQ.
  2. Group "Traffic": Overview, Traffic map, Route view, Announcements.
  3. Group "Report & Track": Overview, Report an issue, Track a ticket.
  4. Account area. Guest (127:5467): "Log in" (Primary, full width) and "Create an account" (text link `primary-700`). Signed in (127:5576): identity block (avatar 36 px `primary-600`, name, email), then "Profile & settings", "My reports" (links) and "Log out" (button).
  5. Appearance: label + segmented control Light / Dark / System (System = Match system). Selected segment `surface` with `shadow-control`, label `primary-700`; others `gray-700` on `gray-100`. Same state as the desktop menu (both read `useTheme`).
- Rows: Body/M Medium `gray-900`, `chevron-right` 18 px `gray-400`, 44 px tall (py 10). Hover/pressed bg `gray-50`; focus-visible ring inset. Current page: text `primary-700` Body/M Semibold, chevron `primary-700`, `aria-current="page"`. Account rows (Profile & settings, My reports, Log out) are py 10 too (Figma py 8 = 40 px; raised to 44 for the tap rule).
- Groups separated by 1 px `gray-200`; group padding 12 × 20 (32 px sides at ≥768).
- Focus: on open, focus stays on the menu button (now "Close menu"); the next Tab enters the drawer at its first link. Everything outside the header (notification bar, `main`, footer) gets `inert` while open, so Tab cycles through the bar and drawer only. Screen readers: the drawer is a `<nav aria-label="Site menu">` region; with the rest inert it behaves like a modal without `role="dialog"`.
- Closes on: menu button, Escape (focus to the menu button), choosing any link (closes on route change; even if the link is the current page), "Log out", tapping the logo, resizing to ≥1024 px. Theme changes keep it open.
- On close, `inert` and scroll lock are removed and the scroll position is unchanged.

### 8. Notification bar, node 4:750 (desktop), 127:5800 (mobile), over hero 37:1236
- **One message at a time. Decision:** the shell shows the single most urgent site notice from `getSiteNotice()` in `data/api` (returns `SiteNotice | null`: `id`, `title`, `message`, `announcementId`). Null → no bar and no empty space. The mock returns the Figma notice ("Road closure tonight", Jalan Sultan Azlan Shah, one lane each way from 10 pm to 6 am).
- Placement: directly under the header, full-bleed, not sticky (it scrolls away). On Home it sits over the hero under the transparent header.
- Styles: Solid (all pages except Home): `warning-50` bg, `warning-100` bottom border, `triangle-alert` 18 px `warning-700`, title Body/S Semibold `warning-700`, message Body/S `gray-800`, "View details" Body/S Semibold underlined `warning-700`, close `x` 18 px `gray-600`. Over hero (Home): `static-scrim-bar` + `backdrop-blur-bar`, border white 15 %, title and link `static-amber`, message `static-white`, icons `static-white`. The over-hero style does not change when the header turns Solid (the bar scrolls with the hero).
- Layout: ≥1024 single row (icon, title, message, link inline, close at the far right; wraps to two lines if needed). <1024 the mobile layout: row 1 icon + title, message below, link below, close top-right (127:5788).
- "View details" → `routes.traffic.announcements` (no hash until the Announcements spec defines anchors). Its accessible name adds context with visually hidden text: "View details about the road closure tonight" (content key).
- Close: `<button>` with `aria-label` "Dismiss this notice", 30 × 30 visible, `hit-area` below 768; hover bg `warning-100` (over hero: `static-glass`); focus-visible ring (over hero `static-white`).
- Dismiss: saves the notice `id` in `sessionStorage` under `mlc-notice-dismissed` (wrapped in try/catch; if storage fails, the bar still hides for this page view). The bar fades out (opacity 150 ms) and is removed; content below moves up. Focus moves to `<main id="main">`. If the stored id differs from the current notice id (a new notice was published), the bar shows again. A new tab or browser session shows it again.
- No flash: a visitor who dismissed it must not see it reappear on the next page load in the same session. **Decision:** render the bar on the server with `data-notice-id`, and hide it before first paint with a tiny inline script that compares `sessionStorage['mlc-notice-dismissed']` with that id (same technique as the theme script). No layout shift for visitors who did not dismiss it.
- Screen readers: the bar is a `<section aria-label="Site notice">`, not a live region (it is present on load and must not interrupt).

### 9. Main
`<main id="main" tabindex="-1">`, one per page. Pages own their content; page `<h1>` is the first heading in `main`.

### 10. Docs layout (desktop ≥1024), from About 1:332
Used by the docs-style pages whose frames show a left sidebar (About, Construction, FAQ, Report, Terms, Privacy, and others the page specs confirm).
- **Sidebar** (240 px, `w-docs-sidebar`): the groups of the page's docs set, as the frame shows (Project / Traffic / Report & Track on commuter pages; the legal and help groups on legal-help pages). Group label Body/XS Semibold `gray-500`, links Body/S `gray-700`, row padding 6 × 12, radius `lg`. Hover bg `gray-50`, text `gray-900`. Current page: bg `primary-50`, text `primary-700` Semibold, `aria-current="page"`. `<nav aria-label="Section pages">` (content key). Sticky at `top: 117px` (header + 24), `max-height: calc(100dvh − 141px)`, scrolls inside.
- **Article** (`max-w-article` 760): page content.
- **"On this page" aside** (200 px, `w-docs-aside`), ≥1280 only: `<nav aria-label="On this page">` with one link per `<h2>` of the article (ids from content), left rail 2 px `gray-200`; active item text `primary-700` Body/S Medium with a 2 px `primary-600` bar over the rail; inactive `gray-600`, hover `gray-900`. Below it, the page's "Need help?" block (page spec owns its content). Sticky like the sidebar.
- **Scroll-spy:** the active item is the last `<h2>` section whose top has passed a line 140 px below the viewport top (IntersectionObserver, `rootMargin: "-140px 0px -60% 0px"`). At the very bottom of the page the last item is active. Before the first section, the first item is active. The active item has `aria-current="true"`.
- Clicking an item: plain `<a href="#id">` (back button works), smooth scroll (instant with reduced motion), the target `<h2>` (`tabindex="-1"`) receives focus without a visible ring, and it becomes active immediately (don't wait for the observer).
- 1024–1279: aside hidden; the "Need help?" block renders after the article (as in M · About 129:5869).

### 11. Section bar (mobile docs nav, <1024), node 129:6117
- Replaces the sidebar on docs pages. Sits under the notification bar, full-bleed, `gray-50`, bottom border `gray-200`, padding 12 × 20 (32 at ≥768), 44 px tall. **Decision:** sticky under the header (`top: 61px`) so section navigation stays in reach on long pages.
- Content: group name (Body/S `gray-500`), "/" (`gray-400`), current page (Body/S Semibold `gray-900`, truncates with ellipsis), `chevron-down` 18 px at the right. The whole bar is one `<button>` with `aria-expanded`/`aria-controls`; visually hidden prefix "Pages in this section:" (content key).
- **Decision (what it opens):** a panel directly under the bar, overlaying the page (not pushing it), full width, `surface`, bottom border `gray-200`, `shadow-drawer`, listing the pages of the **current group only** (the drawer already offers every group). Rows as drawer rows (44 px, Body/M Medium, `chevron-right`), current page `primary-700` Semibold with `aria-current="page"`. Max height `calc(100dvh − 105px)`, scrolls inside.
- Closes on: the bar again, Escape (focus back to the bar), outside tap, choosing a link, route change, resize to ≥1024. No scroll lock, no focus trap. Chevron rotates 180° when open.

### 12. Footer, nodes 1:127 (desktop), 127:5801 (mobile)
`<footer>` on `primary-900` (navy zone: all text uses `static-*` tokens; it never flips). Dividers white 30 % (Figma draws them in `white`, which would flip in dark; use a static white-alpha token).
- **Brand block:** logo link → Home; description; careline row (`phone` icon, "MRTCareline 1800-88-6782" link `tel:1800886782`, caption "24-hour line for complaints about the works"); email row (`mail`, `mailto:help@mutiaraconnect.my`, caption). Values from `getSiteInfo()`. Link hover: underline; focus-visible ring `static-white`.
- **Doormat:** four columns Project / Traffic / Report & Track / Help (title Body/S Semibold `static-white`; links Body/S `static-on-navy-200`, hover `static-white` + underline). **Decision:** one `<nav aria-label="Footer">` containing four headed lists (headings are `<h2>` styled as Figma, Body/S Semibold), not four separate nav landmarks.
- **Newsletter** (see Interactive elements and Dynamic states for the full form spec).
- **Social row:** "Follow MRT Corp" + six pills (Facebook, Instagram, X, YouTube, TikTok, LinkedIn) from `siteInfo.socials`. Plain text in a `<ul>`: not links, not buttons, never focusable, no hover, default cursor. Then "Back to top" (desktop and tablet only).
- **Legal row:** "© 2026 Mutiara LRT Community Connect" (year from content, not `new Date()` to keep hydration stable), "Privacy policy", "Terms & Conditions".

Footer by width:
| Width | Layout |
|---|---|
| <768 | Mobile frame 127:5801: brand stacked; doormat 2 × 2 grid (Project, Traffic / Report & Track, Help); newsletter in a `static-glass-subtle` box with email field and full-width "Get updates" button (no area select, as designed); social pills wrap; no "Back to top"; legal row wraps (copyright, then links). Footer links keep the 30 px row pitch and get `hit-area`. |
| 768–1023 | **Decision:** brand block full width on top; doormat in 4 columns below it; newsletter text full width, then the desktop form row (email flexible, area select, button) below it; social row wraps with "Back to top" at the end; legal row on one line. |
| ≥1024 | Desktop frame 1:127: brand 360 px + doormat (4 flex columns, gap 32); newsletter row (text left, form right: email 280, area select, button); social row; legal row. |

## Interactive elements

| Element | Trigger | Result | States to build | Keyboard | Notes |
|---|---|---|---|---|---|
| Skip link | focus / Enter | Shows; moves focus to `main` | hidden, focus-visible | Tab, Enter | First in DOM |
| Logo (header, footer, drawer bar) | click | → `routes.home`; closes any open panel or drawer | default, hover (none), focus-visible | Enter | Accessible name "Mutiara Line, home" (content key); mark image `alt=""` |
| Nav trigger (×3) | click / Enter / Space / Arrow Down | Toggles its panel | default, hover, focus-visible, open, current group, transparent variants | Enter/Space toggle; ↓ open + first link; ←/→ between triggers; Home/End; Esc close | Disclosure pattern |
| Panel link (rail row, station row, now card, footer links of panel) | click | Navigate; panel closes | default, hover, focus-visible, current page | Enter; ↑/↓ inside panel; Esc | |
| Theme button | click / Enter / Space / ↓ | Opens Appearance menu | default, hover, focus-visible, open, transparent | Enter/Space/↓ open; Esc close | Never toggles directly |
| Appearance option (×3) | click / Enter / Space | Sets theme, saves, closes | default, highlighted, selected (check), focus | ↑/↓, Home/End, typeahead, Esc | `menuitemradio` |
| Log in (guest) | click | → `routes.account.loginReturningTo(currentPath)` | default, hover (bg `gray-50`, border `gray-400`), focus-visible, transparent (border white 60 %, hover `static-glass`) | Enter | Not shown on auth pages; current path includes search + hash |
| Account chip | click / Enter / Space / ↓ | Opens account menu | default, hover, focus-visible, open, transparent | as Appearance | |
| Account menu items | click | Navigate or log out | default, highlighted, focus | ↑/↓, Home/End, Esc | Log out is a `button` |
| Mobile menu button | click | Open/close drawer | closed ("Open menu", `menu`), open ("Close menu", `x`), hover bg `gray-100`, focus-visible | Enter/Space; Esc closes when open | `hit-area` |
| Mobile avatar | click | → profile | default, hover, focus-visible | Enter | `hit-area` |
| Drawer row | click | Navigate; drawer closes | default, pressed, focus-visible, current | Tab, Enter | 44 px |
| Drawer Log in / Create an account | click | → login (with `next`), → signup | Primary states / link states | Enter | |
| Drawer segmented Appearance | click / arrows | Sets theme | unselected, hover, selected, focus-visible (ring on the group's selected item) | Radio group: ←/→ move and select, Tab enters/leaves the group | Native radios, visually styled; `hit-area` (36 → 44) |
| Notification "View details" | click | → announcements | default, hover (same colour, underline thickens to 2 px), focus-visible | Enter | Over hero uses `static-amber` |
| Notification close | click | Dismiss for the session | default, hover, focus-visible | Enter/Space | `aria-label` "Dismiss this notice" |
| Sidebar link | click | Navigate | default, hover, focus-visible, current | Tab, Enter | |
| On this page link | click | Smooth scroll, focus heading, hash updates | default, hover, focus-visible, active | Tab, Enter | Scroll-spy sets active |
| Section bar | click | Open/close page list | closed, open (chevron up), hover bg `gray-100`, focus-visible | Enter/Space; Esc | |
| Footer links, tel, mailto | click | Navigate / call / email | default, hover underline, focus-visible `static-white` ring | Enter | tel/mailto are not external links (no new tab) |
| Newsletter email | type | Value; clears its error on change | default, hover, focus (`shadow-focus`), filled, error, disabled (while sending) | — | `type="email"`, `name="email"`, `autocomplete="email"`, `spellcheck="false"`, visually hidden label "Email address" |
| Newsletter area select (≥768) | change | Area value | default, hover, focus, disabled | native select keys | Native `<select>` with explicit `surface` bg and `gray-900` text; label "Area" visually hidden; default "All areas" |
| "Get updates" | click / Enter in field | Validate, send, show result | default, hover, focus-visible, loading ("Signing you up…", spinner), disabled during send | Enter submits | Secondary style on navy (Figma) |
| Back to top | click | Scroll to top (smooth; instant if reduced motion), then focus moves to the header logo link | default, hover bg `static-glass`, focus-visible `static-white` ring | Enter/Space | `button`, `chevron-up` icon; ≥768 only |
| Social pills | none | none | static only | not focusable | Plain text |

## Shared UI parts and patterns
Every part lives once in `components/ui` or `components/patterns`. Hover colours transition 150 ms (list the properties; never `transition: all`). Focus is the global `:focus-visible` ring (2 px `primary-600`, offset 2) unless stated; on navy, hero and photos it is `static-white`. Form fields use `shadow-focus` + `primary-600` border instead.

**Button** (`1:51`, `1:53`, `1:55`): Body/S Semibold, radius `lg`, padding 10 × 16, height 40.
- Primary: `primary-600`, text `static-white`, `shadow-button`; hover `button-primary-hover`, active `button-primary-active`. **Decision:** these are two new semantic tokens (light: `primary-700` / `primary-800`; dark: `primary-500` / `primary-600`), because in dark mode `primary-700` and `primary-800` flip to light blues that would fail contrast with white text. See Open questions.
- Secondary: `surface`, border `gray-300`, text `gray-800`; hover bg `gray-50`, border `gray-400`; active bg `gray-100`.
- Ghost: no bg or padding-x, text `primary-700`; hover underline; active `primary-800`.
- Disabled (all): bg `gray-100`, border `gray-200`, text `gray-400`, no shadow, `cursor: not-allowed`, real `disabled` attribute only when the action is unavailable (not during validation).
- Loading: `aria-busy="true"`, `aria-disabled="true"` (stays focusable, ignores clicks), keeps its width, `loader-circle` 16 px spinning before a label that ends with "…" ("Signing you up…"). Reduced motion: icon does not spin.
- With icon: icon 16–18 px, gap 8, `aria-hidden`. Full width variant (mobile forms).
- Links styled as buttons are `<a>` (next/link); actions are `<button type="button">` unless they submit.

**Tag** (9 fixed variants `1:68`–`1:92`): pill, padding 2 × 10, 6 px dot + Body/XS Medium label. Never interactive, never recoloured. The label text always carries the meaning (colour is not the only signal).

**Form field** (from Report 1:950, login 4:959): label Body/S Medium `gray-900` above (gap 6), optional "(optional)" in `gray-500`, hint Body/XS `gray-500` below the label, control 42 px tall, padding 11 × 14, border `gray-300`, radius `lg`, `surface`, placeholder `gray-400` ending with "…" where it shows an example.
- hover border `gray-400`; focus border `primary-600` + `shadow-focus`; filled as default.
- error: border `danger-600`, message below the control: `circle-alert` 16 px + Body/S `danger-700`, linked with `aria-describedby`, `aria-invalid="true"`. On submit, focus moves to the first invalid field. Errors clear as soon as the value becomes valid (on input), and are first shown on submit or on blur after the user has typed.
- disabled: bg `gray-100`, text `gray-500`, border `gray-200`. Read-only: bg `gray-50`.
- Leading icon variant (login email `mail`, password `lock`), trailing action (password `eye`/`eye-off` toggle button, `aria-label` "Show password"/"Hide password", `aria-pressed`).
- Textarea with counter "{n} of {max} characters" Body/XS `gray-500` right-aligned; counter turns `danger-700` over the limit; screen readers get an update only at 90 % and 100 % (polite).
- Select: native `<select>` styled, `chevron-down` 16 px, explicit bg/text colours.
- Checkbox and radio: native inputs styled, 16 px control, label shares the hit target (whole row clickable, min 44 px tall below 768). Radio cards (Report "What are you reporting?"): the card is the label; selected border `primary-600` + bg `primary-50`; arrow keys move selection (native radio group).
- On navy (footer): error text `static-amber` with `circle-alert` `static-amber`, field border 2 px `static-amber` (danger tokens fail contrast on `primary-900`).

**Switch** (`91:2963` on, `91:2965` off): 40 × 24, `role="switch"` (button with `aria-checked`) or native checkbox with `role="switch"`. Label to its left or right is clickable; row ≥44 px tall below 768. On: track `primary-600`, knob `static-white` `shadow-knob` right; off: track `gray-300`, knob left. Knob slides 150 ms (reduced: instant). Space/Enter toggles. Disabled: 50 % track opacity is not allowed (opacity rule): use track `gray-200`, knob `gray-100`.

**Segmented control** (Line preview "Route view / Map view", drawer Appearance): container `gray-100`, padding 3, radius `xl`; segments radius `lg`, Body/S Medium; selected `surface` + `shadow-control`, text `primary-700`; unselected `gray-700`, hover `gray-900`. Semantics: native radio group (`fieldset` + visually hidden legend). ←/→ move and select. Selected segment indicator moves instantly (no sliding thumb).

**Tabs** (underline tabs, About "Two routes, one line"): `role="tablist"`, Body/S Medium; selected text `primary-700` with 2 px `primary-600` underline, others `gray-600`, hover `gray-900`. Automatic activation: ←/→ move and select, Home/End. Tabs **wrap** to a second row on narrow screens (M · About shows "Environment" on row 2); never a horizontal scroll. Panels `role="tabpanel"`, `tabindex="0"` only if the panel has no focusable content. When a page spec says the tab is deep-linkable, the URL gets `?tab=<id>` via `router.replace` (no history entry per tab).

**Filter chips** (Home area tabs, FAQ topics, Construction filters): `button` with `aria-pressed` (single-select groups behave like radios: one pressed at a time). Pressed: `gray-900` bg, `surface` text (inverted chip, as on Home); unpressed border `gray-200`, hover border `gray-400`. Chip groups wrap by default; a page spec may choose a single scrolling row on mobile (the row scrolls, the page never does).

**Accordion** (FAQ, Home "Common questions"): each header is a `<button>` inside an `<h3>` with `aria-expanded`/`aria-controls`, full-width hit target, `chevron-down` 20 px rotating 180° when open. Multiple items may be open. Content stays in the DOM (`hidden="until-found"` so browser find-in-page opens it). Open/close animates height via `grid-template-rows` 0fr → 1fr, 200 ms (reduced: instant). Deep link `#<item-id>` opens and scrolls to that item.

**Breadcrumb**: `<nav aria-label="Breadcrumb"><ol>`, Body/S, links `gray-600` hover `primary-700` underline, separator `chevron-right` 14 px `gray-400` `aria-hidden`, last item plain text `gray-900` with `aria-current="page"`. Wraps on narrow screens; never truncates the current page.

**Card (link card)**: one link per card (the title), stretched to the whole card with a pseudo-element; no nested interactive elements except a clearly separate secondary action placed outside the stretched area. Hover: border `gray-300`, title `primary-700`. Focus-visible: ring around the whole card (`:focus-within` on the card). Cards with images use `ImagePlaceholder`.

**Line rail** (stations, menus, route view): `<ol>` of stops on a vertical 3–4 px `primary-600` line (lighter `primary-200` in nav panels); each stop: dot 20–24 px, code chip (`primary-600`, Body/XS Semibold `static-white`, 44 × 24), name Body/M Semibold, optional subtitle Body/S `gray-600`. When the stop is a link, the whole row is the link (hover bg `gray-50`, `chevron-right` `gray-400`). "Following" stops show a bell chip with visually hidden "You follow this station". Selected stop (About, Route view): bg `primary-50`, name `primary-700`, `aria-current="true"`.

**Vertical timeline** (milestones, site updates): `<ol>`; past items filled dot `primary-600` on a solid line, future items hollow dot on a `gray-300` line; the "Today" marker is a list item of its own with the tag-style label "Today". Dates in a fixed-width column (`tabular-nums`). Horizontal timeline (Construction desktop) becomes vertical **below 1024** (Decision: 6 milestones do not fit legibly at 768).

**Stepper** (ticket status): `<ol>`, four steps Submitted, Pending review, In progress, Resolved; complete steps `check` in a filled `primary-600` circle, current step ring + `aria-current="step"`, upcoming hollow `gray-300`. Each step also has visually hidden "Completed", "Current step" or "Not started". Horizontal at ≥1024, vertical below (Decision, same reason as the timeline).

**Image placeholder**: `gray-100` surface, `image` icon 28 px `gray-400` centred, keeps the frame's aspect ratio. `role="img"` with `aria-label` "Photo not yet available" (content key); when the card already describes the photo, `aria-hidden="true"`.

**Callouts**: info note (`primary-50`, `info` 18 px `primary-700`, Body/S `gray-700`), warning callout (as in the Report & Track panel). Static, not live regions.

**Accent bar**: 48 × 4 px `primary-600` above section headings, `aria-hidden`.

## Hidden content inventory
Content the content writer must provide (all in `src/content`, mostly `nav.ts` and `common.ts`):

| Item | Count / kind |
|---|---|
| Nav groups | 3 groups × title + one-line intro, and per page: title + description (12 rows; copy is in Figma 101:3846/3919/3971) |
| Project panel feature | Heading "Find a station", 4 station rows (code, name, area) and "See all 22 stations" |
| Traffic panel feature | Heading "Happening now", link "All current closures", empty text "No road closures right now." Records: the active announcements in mock data (at least 3, matching Figma titles/summaries) |
| Report & Track feature | Emergency title and text, account note title, text and "Create an account" |
| Account menu | 4 link labels + "Log out" |
| Appearance menu | Title, subtitle, 3 options + Match system description; mobile labels Light / Dark / System; legend "Appearance" |
| Drawer | Group labels, guest "Log in", "Create an account" |
| Notice | 1 `SiteNotice` record (id, title desktop with full stop / mobile without, message, announcement link); sr-only link context |
| Footer | Description, careline/email captions, 4 column titles + 15 links, newsletter title + text (desktop and mobile versions), placeholder, area options (6: All areas, Bayan Lepas and airport, Bukit Jambul to Sungai Nibong, Gelugor and USM, Jelutong to George Town, Butterworth), button, loading, success, 3 error messages, "Follow MRT Corp", "Back to top", copyright, 2 legal links |
| Docs | Sidebar `aria-label`, "On this page", section bar sr-only prefix, per-page `h2` ids and labels (page specs) |
| Gallery | Section titles and sample labels in `src/content/dev.ts` |

## Dynamic states

**Signed out vs signed in (the sign-in simulation).**
- Session: `localStorage['mlc-session'] = {"userId":"user-meiling"}` via `@/lib/session` (`useSession()` → `{ status: 'signed-in' | 'guest', user, signIn(), signOut() }`), all storage access in try/catch (failure = guest). Changes in another tab sync through the `storage` event.
- What signing in changes in the shell: desktop header actions (Log in → account chip + menu); mobile bar (avatar link appears); drawer account area (Log in / Create an account → identity block, Profile & settings, My reports, Log out); Report & Track panel (account note hidden); footer newsletter email pre-filled with the user's email (editable). Nothing else in the shell changes.
- **No auth flash.** A signed-in visitor must never see "Log in" flash on reload. **Decision:** an inline head script (beside the theme script) reads `mlc-session` and sets `data-auth="signed-in"` or `"guest"` on `<html>` before paint; the server renders both auth variants of the auth slots and CSS shows the one that matches. The mock user's name and initials come from mock data at build time, so both variants render on the server without hydration warnings. After hydration `useSession` takes over.
- **Log in** sets the session (the Log in page spec owns the form), then `router.replace(next)` if `next` is a safe internal path (starts with `/`, not `//`, not an auth page), otherwise Home.
- **Log out** (account menu or drawer): clears the session, closes the menu or drawer, announces "You are logged out." in the global polite live region, and focus goes to the header's "Log in" link. If the current route is protected, `router.replace(routes.home)`; otherwise stay on the page.
- **Protected routes** (`protectedRoutes` in `config/routes.ts`: Report, Profile): a guest who opens one is sent with `router.replace(routes.account.loginReturningTo(path + search + hash))`; the page renders only a neutral skeleton of the page header (no form, no personal data) until the session is known, then the content or the redirect. Links to protected pages stay visible to guests in all menus (they lead to Log in, which explains why: Log in spec). `replace` keeps the back button from looping.

**Notification bar:** present / dismissed this session / none published (no bar, no gap).

**Traffic panel:** loading is not visible (data is fetched on the server with the layout); empty state as above.

**Newsletter form (footer).**
- Validation on submit, then live after the first submit:
  - empty: "Enter your email address"
  - bad format: "Enter an email address in the correct format, like name@example.com"
- Sending (mock `subscribeToAlerts(email, area)` in `data/api`, ~600 ms): button loading "Signing you up…", field and select disabled.
- Success: the form is replaced by a `role="status"` message with `circle-check` 20 px `static-white`: "You're signed up. We'll email {email} when road changes are announced for {area}." ({area} reads "all areas" for All areas). Focus moves to the message (`tabindex="-1"`). It resets on reload.
- Error (mock rejects when the email ends with `@fail.test`, so the tester can trigger it): message under the form "We couldn't sign you up just now. Check your connection and try again." in `static-amber` with `circle-alert`; values kept; focus to the button.

**Long content:** long first name truncates in the chip (160 px); long notice message wraps (never truncated: it is safety information); long page titles in the section bar truncate with an ellipsis (full title is in the `h1`); drawer rows wrap to two lines with the chevron top-aligned.

**No JavaScript:** links render as plain links (footer doormat has every page, so the site stays navigable). Panels, drawer, menus and the theme menu need JS; the theme still follows the system through the head script defaults. The notification bar shows and cannot be dismissed. Acceptable for this build.

## Motion
Durations from 100 to 200 ms. Easing: enter `cubic-bezier(0.16, 1, 0.3, 1)`, exit `cubic-bezier(0.4, 0, 1, 1)`. Animate only `opacity`, `transform`, colours and `grid-template-rows`.

| What | Enter | Exit |
|---|---|---|
| Nav panel | opacity 0→1 + translateY(−4 px→0), 150 ms | opacity, 100 ms |
| Switching panel | instant swap | — |
| Appearance and account menus | opacity + scale(0.98→1), 150 ms, origin top right | opacity, 100 ms |
| Mobile drawer | opacity + translateY(−8 px→0), 200 ms | opacity, 150 ms |
| Section bar panel | opacity + translateY(−4 px→0), 150 ms | opacity, 100 ms |
| Chevron rotate (triggers, section bar, accordion) | 150 ms | 150 ms |
| Header transparent ↔ solid | colours 200 ms | colours 200 ms |
| Notification dismiss | — | opacity 150 ms, then removed |
| Accordion | rows 200 ms | rows 200 ms |
| Switch knob | translate 150 ms | — |
| Hover/press colours | 150 ms | 150 ms |
| Anchor and back-to-top scroll | `scroll-behavior: smooth` | — |
| Theme change | none (transitions suppressed during the swap) | — |

`prefers-reduced-motion: reduce`: no movement at all. Panels, menus and drawer appear and disappear instantly (opacity only if anything); chevrons switch instantly; scrolling jumps; spinners stand still (the "…" label carries the state). The global rule in `globals.css` already shortens durations; components must not use JS-timed movement that bypasses it. **Decision:** the main agent adds `--ease-out`, `--ease-in` and the three durations as tokens so components don't hard-code them (see Open questions).

## Accessibility
- **Landmarks:** `header` (banner), `nav aria-label="Main"` (desktop triggers and panels), `nav aria-label="Site menu"` (drawer), `section aria-label="Site notice"`, `main`, docs `nav aria-label="Section pages"` and `nav aria-label="On this page"`, `footer` (contentinfo) with `nav aria-label="Footer"`. Labels from content.
- **Headings:** the shell adds no `h1`. Panel intro titles are not headings (they are inside a disclosure); footer column titles and the newsletter title are `h2` styled as Figma. Every page has one `h1`.
- **Focus order (desktop):** skip link → logo → Project (→ its panel when open) → Traffic → Report & Track → theme button → Log in / account chip → notification "View details" → dismiss → (docs: sidebar → article → aside) → footer.
- **Focus order (mobile):** skip link → logo → theme → [avatar] → menu → (drawer when open) → notification link → dismiss → section bar → main → footer.
- **Focus management:** panels and menus return focus to their trigger on Escape; the drawer keeps focus on its button and makes the rest of the page `inert`; dismissing the notice focuses `main`; back to top focuses the header logo; route changes rely on Next's route announcer.
- **Live regions:** one global polite region in the shell (`aria-live="polite"`, visually hidden) for "Appearance set to …" and "You are logged out."; the newsletter result is `role="status"`; form errors are tied to fields with `aria-describedby` (not announced as a region).
- **Names for icon-only controls:** theme button "Appearance: {current}", menu button "Open menu"/"Close menu", notice close "Dismiss this notice", mobile avatar "Your profile, {full name}", logo "Mutiara Line, home". Decorative icons `aria-hidden`.
- **Touch targets below 768:** ≥44 × 44 px; visual sizes stay as in Figma and small controls carry `hit-area` (theme 40, menu 40, avatar 36, notice close 30, segmented options 36, footer links 20).
- **Contrast:** the transparent header relies on `bg-nav-scrim`; the switch to Solid at 8 px scroll keeps text over the photo only where the scrim is. On navy, use `static-*` tokens only; errors use `static-amber`.
- **Overlays never cover focus:** sticky header and section bar heights are included in `scroll-margin-top`, and the browser's focus scrolling uses `scroll-padding-top` on `html` with the same values.
- **Stacking:** skip link > header, panels, menus, drawer > section bar > page. Leaflet panes use z-index 400+, so the map container must create its own stacking context (`isolation: isolate`) or menus will open behind the map.
- **Meta:** `<meta name="theme-color">` per theme matching `surface`; `color-scheme` set on `<html>` with the theme.

## Links and destinations

| Element | Destination |
|---|---|
| Logo (header, drawer, footer, auth pages) | `routes.home` |
| Project panel / drawer / footer: Overview, About the line, Stations, Construction progress, FAQ | `routes.project.overview`, `.about`, `.stations`, `.construction`, `.faq` |
| Station rows S20, S13, S09, S03 | `routes.project.station(code)` |
| "See all 22 stations" | `routes.project.stations` |
| Traffic: Overview, Traffic map, Route view, Announcements | `routes.traffic.overview`, `.map`, `.route`, `.announcements` |
| "Happening now" cards | `routes.traffic.announcements` (**Decision:** add `#<announcement-id>` once the Announcements spec defines anchors) |
| "All current closures" | `routes.traffic.announcements` |
| Report & Track: Overview, Report an issue, Track a ticket | `routes.reportTrack.overview`, `.report`, `.track` |
| "Create an account" (panel, drawer) | `routes.account.signup` |
| "Log in" (header, drawer) | `routes.account.loginReturningTo(current path)` |
| Account menu: Profile & settings, My reports, My stations, Notifications | `routes.account.profile`, `routes.account.profileSection('reports' / 'stations' / 'notifications')` |
| Drawer: Profile & settings, My reports | `routes.account.profile`, `profileSection('reports')` |
| Mobile avatar | `routes.account.profile` |
| Log out | Action: sign out (then Home if on a protected route) |
| Theme button / options | Action: open menu / set theme |
| Notification "View details" | `routes.traffic.announcements` |
| Notification close | Action: dismiss for the session |
| Section bar rows, sidebar links | The group's page routes above; legal-help sets use `routes.legal.*` and `routes.help.*` |
| On this page links | `#<h2 id>` on the same page |
| Footer Help: Contact us, Accessibility, Sitemap | `routes.help.contact`, `.accessibility`, `.sitemap` |
| Footer careline, email | `siteInfo.careline.tel`, `siteInfo.email.href` |
| Footer Privacy policy, Terms & Conditions | `routes.legal.privacy`, `routes.legal.terms` |
| Get updates | Action: mock subscribe |
| Back to top | Action: scroll to top |
| Social pills | None (plain text, owner decision) |

## Dev components gallery (`/dev/components`)
Development only (404 in production). One page, sections in this order, each with an `h2` and an anchor; a sticky toolbar at the top with: the real theme switch (Light / Dark / System), a "Simulate signed in" switch (calls `signIn`/`signOut`), and "Show notice again" (clears `mlc-notice-dismissed`). Shell parts accept explicit state props for previews (e.g. `auth`, `variant: 'solid' | 'transparent'`, `openPanel`, `menuOpen`), rendered inside a relative preview frame that reserves the panel's height; transparent previews sit on the hero photo with its scrims. Static previews show the state; the real header at the top of the page stays interactive.

1. **Tokens:** colour swatches with names (both modes via the toolbar), type scale (every `type-*` utility, desktop and mobile step-down), radii, shadows.
2. **Buttons:** Primary, Secondary, Ghost × default, hover (forced class), focus-visible (forced), active, disabled, loading; with icon; full width; on navy and on hero.
3. **Tags:** all 9.
4. **Form fields:** text input default / hover / focus / filled / error / disabled / read-only / with hint / optional / leading icon / password toggle; textarea with counter (normal, near limit, over limit); select; checkbox (unchecked, checked, error, disabled); radio cards (unselected, selected, focus); on-navy input with error.
5. **Switch:** on, off, focus, disabled.
6. **Segmented control:** two and three options, each selected.
7. **Tabs:** 2 tabs and 4 tabs (wrapping example in a 350 px wide box).
8. **Filter chips:** single-select group with one pressed.
9. **Accordion:** 3 items, first open.
10. **Breadcrumb:** 3 levels and a long current page.
11. **Cards:** link card, card with image placeholder, hover/focus forced.
12. **Line rail:** 5 stops with subtitles, one following (bell), one selected; nav-panel variant.
13. **Timeline:** vertical with past / Today / future; horizontal (≥1024) and its vertical form.
14. **Stepper:** each of the 4 steps as current; horizontal and vertical.
15. **Image placeholder, callouts, accent bar.**
16. **Header (desktop):** all 16 variants of 4:736 (Guest/Signed in × Solid/Transparent × Closed/Project/Traffic/Report & Track/Account/Appearance, as in Figma), current-group example.
17. **Nav panels:** Project, Traffic (with cards and empty state), Report & Track (guest and signed in), Account.
18. **Appearance menu:** each option selected.
19. **Mobile header and drawer:** 6 variants of 127:5787 rendered in 390 px frames; drawer guest and signed in, with a current page.
20. **Notification bar:** solid desktop, over hero, mobile layout (390 px frame), dismissed (nothing).
21. **Section bar:** closed and open, long title.
22. **Docs layout:** a short sample article with 4 `h2`s, sidebar and aside, to check scroll-spy.
23. **Footer:** desktop; mobile (390 px frame); newsletter in error, loading and success states.

Mobile previews in 390 px frames need the components to respond to their container, not the viewport. **Decision:** shell parts that differ by breakpoint expose a `layout` prop (`'desktop' | 'mobile'`) used only by the gallery; in the real shell the layout follows the viewport. The tester also checks the real shell by resizing.

## Open questions
1. **Sticky header** on all pages (and sticky section bar under 1024). Not shown in Figma; chosen for long pages on phones. Confirm.
2. **No hover-to-open** for nav panels (click only). Confirm.
3. **Report & Track panel for signed-in users:** the account note is hidden (Figma 102:4036 shows it, which contradicts its text). Confirm or ask the content writer for a signed-in alternative.
4. **Mobile newsletter has no area select** (as designed), so mobile sign-ups are for All areas; tablet and desktop show the select. Confirm, or add the select on mobile.
5. **Footer links on mobile** keep Figma's 30 px pitch with `hit-area` (44 px targets overlap neighbours by up to 7 px). The alternative is a 44 px row pitch, which makes the mobile footer about 100 px taller than Figma. Main agent to choose.
6. **Tokens needed:** motion (`--ease-out`, `--ease-in`, durations 100/150/200), a static white-alpha for footer dividers and pill borders (white 30 %), and primary button hover/active tokens that work in dark mode (light: primary-700/primary-800; dark: primary-500/primary-600, because primary-700/800 flip to light blues). Only the main agent edits tokens.
7. **Auth no-flash technique** (head script + both variants rendered) and **notice no-flash technique** (inline script after the bar): recorded as recommendations; the main agent may choose another way that meets "no flash, no hydration warning".
8. **Signup with return path:** `routes.ts` has `loginReturningTo` but no signup equivalent. If "Create an account" should return the visitor too, add `signupReturningTo`.
9. **"Happening now" cards** link to Announcements without an anchor until that page defines one.
10. **Account menu radius** is 14 px in Figma, not on the radius scale; spec uses `2xl` (12 px).
11. **Docs-layout pages:** confirmed from frames for About, Construction, FAQ, Report and Terms; the remaining page specs say whether they use it.

## Main agent decisions (iteration 1)

These answer the open questions above and override anything earlier in this file.

1. **Sticky:** the header is sticky on every page. Below 1024 px the docs section bar is sticky directly under the mobile header.
2. **Nav panels** open on click only (and Enter/Space), never on hover.
3. **Report & Track panel account note** is hidden for signed-in users.
4. **Mobile newsletter** keeps Figma's email-only form; mobile sign-ups cover all areas.
5. **Mobile footer links** use 44 px rows (no overlapping hit areas). Accept the taller footer; the visual diff tolerance is not raised for it.
6. **Tokens added on main** (see `docs/design-system.md`): `ease-standard`, `ease-enter`, `ease-exit`, `--duration-fast|base|slow`; `action-hover` and `action-active` for primary buttons; `static-white-30` for the social pill border. Footer dividers use the token Figma binds (`surface`) at the opacity shown in the frame. If that can't be matched with tokens, the builder asks the main agent.
7. **No-flash shell state:** the head script also sets `data-session="signed-in|guest"` and `data-notice="dismissed"` on `<html>` from storage (try/catch), and CSS hides the wrong variant until React hydrates. The builder extends `src/lib/theme/theme-script.ts` into one shell script. Keys: `mlc-session` (localStorage) and `mlc-notice-dismissed` (sessionStorage).
8. **Sign up** also returns visitors to where they were: `routes.account.signupReturningTo(path)` is on main.
9. **Home header with a panel or menu open (QA U1):** Figma 47:1249 wins. On Home the desktop header stays Transparent while a nav panel, the Appearance menu or the account menu is open; the open trigger is a white pill (`surface` bg, `primary-700` text). The theme button and account chip use the same pill when their menu is open on Transparent (icon or label and chevron `primary-700`; the avatar keeps its colours). Only scrolling (scrollY ≥ 8) switches it to Solid.
10. **Traffic panel order (QA U2):** active announcements, oldest start first, first 3 (matches Figma 101:3919). The panel sorts this itself; the data layer's default order is unchanged for other pages.
