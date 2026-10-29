# Agent briefing: what you need to know before you start

This file is the shared knowledge for every agent. It was written from the Figma file itself. Where Figma and this file disagree, **Figma wins**; tell the main agent so this file can be corrected.

---

## 1. The product

**Mutiara LRT Community Connect** is a public information and feedback portal for the **LRT Mutiara Line** in Penang, Malaysia. That line was formerly called the Bayan Lepas LRT and has 22 stations. Penang Sentral on the mainland to PSR-A is the full line; it is built in two segments, PSR-A to KOMTAR first, then Macallum to Penang Sentral.

It serves two audiences:

| Audience | What they do | Where |
|---|---|---|
| **Commuters and residents** (public; guest or signed in) | Read project info, check road closures and detours, follow construction, report problems and track tickets | Commuter site, routes `/…` |
| **Staff** (two roles: *Government authority* and *Project developer*) | Triage and answer tickets; publish traffic announcements, map items and progress updates | Admin console. **Out of scope for this build.** |

This is a university project (USM, CMT322). There is **no backend**:
- Everything runs on typed mock data and mock services.
- Sign-in is simulated: a mock session in `localStorage` with a "Signed in as Tan Mei Ling" user.
- Form submissions are simulated too, e.g. a report returns a generated ticket ID.

---

## 2. The Figma file

- **File key:** `8kWWATZPol9TwztOw8MYG4`
- **Pages:**
  - `Prototype — Commuter` (id `0:1`)
  - `Prototype — Admin` (id `112:4615`): out of scope, don't read or build it
- **Skill first:** the Figma MCP server requires the `figma-design-to-code` skill to be loaded before `get_design_context`, and the `figma-use` skill before `use_figma`. Skill choices for each agent are in `docs/skills.md`.
- **Reading frames:** use the Figma MCP tools with a frame ID from `pages.json`:
  - `get_design_context` for structure and styles
  - `get_screenshot` for the picture
  - `get_variable_defs` for the tokens a frame uses
- **Big frames:** desktop pages are 1440 px wide and some are over 6000 px tall. Read big pages section by section using the child frame IDs that `get_metadata` returns, not as one huge request.

### Reference boards (read, don't build as pages)

| Frame | ID | Use |
|---|---|---|
| Components (desktop) | `1:48` | All desktop components and variants |
| Mobile components | `127:5451` | Mobile header (`127:5787`), mobile notification bar (`127:5800`), mobile footer (`127:5801`) |
| Foundations | `5:1408` | Colour, type and spacing overview |
| Dark mode guidelines | `124:5451` | Rules for dark mode (see §4.3) |
| Sitemap & page list | `5:1356` | Information architecture |

### Prototype states (not separate routes)

| Frame | Implement as |
|---|---|
| `01b Home — Project menu open` (`47:1249`, mobile `134:8244`) | Header menu open state on every page |
| `01c Home — search suggestions ("buk")` (`49:1127`, mobile `134:8874`) | Home search with the suggestions dropdown open |
| `D01`, `D02`, `D13` (desktop dark) and `M · D01`, `M · D13` (mobile dark) | Dark-mode references for Home, About and the KOMTAR station page |

### Key component IDs

| Component | ID |
|---|---|
| Header (component set) | `4:736` |
| Notification bar | `4:750` |
| Footer | `1:127` |
| Nav panel (mega menu) | `101:4039` |
| Logo | `1:57` |
| Buttons | Primary `1:51`, Secondary `1:53`, Ghost `1:55` |
| Tags | Closure `1:68`, Construction `1:71`, Hazard `1:74`, Active `1:77`, Upcoming `1:80`, Ended `1:83`, Pending `1:86`, In progress `1:89`, Resolved `1:92` |
| Switch | On `91:2963`, Off `91:2965` |
| Line preview | `28:968` |

Header variants: Auth (Guest, Signed in) × Theme (Solid, Transparent) × Menu (Closed, open per group) × Appearance (theme menu open).

---

## 3. Information architecture and routes

The navigation groups and their pages are below. The exact route paths are in `pages.json`.

| Group | Pages |
|---|---|
| **Project** | Overview · About the line · Stations · Construction progress · FAQ |
| **Traffic** | Overview · Traffic map · Route view · Announcements |
| **Report & Track** | Overview · Report an issue · Track a ticket |
| **Account** (header avatar or menu) | Log in · Sign up · Forgot password · Profile & settings (sections: Profile details, My reports, My stations, Notifications, Sign-in & security, Privacy & data) |
| **Help** (footer) | Contact us · Accessibility · Sitemap |
| **Legal** (footer) | Terms & Conditions · Privacy policy |

The **Station page** is a template. Figma shows KOMTAR (S20), and the same template must render all 22 stations from the mock data. The content writer writes each station's record; stations with little activity show the empty states the UX spec defines.

**Stations in line order** (code, name, subtitle where Figma gives one):

| Code | Name | Subtitle |
|---|---|---|
| S31 | Penang Sentral | KTM Butterworth, ferry terminal, Rapid Penang bus terminal |
| S30 | Jalan Bagan Luar | Provisional name |
| S19 | Macallum | |
| S20 | KOMTAR | KOMTAR bus terminal, KOMTAR Tower, George Town UNESCO site |
| S18 | Bandar Sri Pinang | |
| S17 | Sungai Pinang | |
| S16 | East Jelutong | |
| S15 | Penang Waterfront | |
| S14 | Gelugor | |
| S13 | Jalan Universiti | Universiti Sains Malaysia (USM) |
| S12 | Batu Uban | |
| S11 | Sungai Dua | Sungai Dua Depot |
| S10 | Sungai Nibong | Sungai Nibong bus terminal |
| S09 | Bukit Jambul | |
| S08 | SPICE | SPICE Arena |
| S07 | Jalan Tengah | |
| S06 | FIZ North | Bayan Lepas Free Industrial Zone |
| S05 | FIZ South | Bayan Lepas Free Industrial Zone |
| S04 | Sungai Tiram | |
| S03 | Penang International Airport | Airport terminal |
| S02 | Permatang Damar Laut | |
| A01 | PSR-A | Provisional name |

Read the full station details from the Stations frame (`100:3723`).

**Admin pages (A00–A09)** are listed in `pages.json` with status `skipped`. Don't build them, and don't add any `/admin` link to the commuter site.

---

## 4. Design system

Phase 0 generates the tokens from Figma. This section tells you what to expect, so you can sanity-check the generated files.

### 4.1 Colour

There is one variable collection, **"MYDS Colour"** (based on the Malaysia Government Design System), with modes **Light** and **Dark** and 36 variables. The tables give Light and Dark values.

**gray**

| Token | Light | Dark |
|---|---|---|
| `gray/50` | #fafafa | #1b1b1f |
| `gray/100` | #f4f4f5 | #26262b |
| `gray/200` | #e4e4e7 | #34343a |
| `gray/300` | #d4d4d8 | #4a4a52 |
| `gray/400` | #a1a1aa | #6e6e78 |
| `gray/500` | #71717a | #a1a1aa |
| `gray/600` | #52525b | #b8b8c0 |
| `gray/700` | #3f3f46 | #d4d4d8 |
| `gray/800` | #27272a | #e4e4e7 |
| `gray/900` | #18181b | #f4f4f5 |

**primary**

| Token | Light | Dark |
|---|---|---|
| `primary/50` | #eff6ff | #16203a |
| `primary/100` | #dbeafe | #1b2a4f |
| `primary/200` | #c2d5ff | #26407a |
| `primary/300` | #96b7ff | #3558a8 |
| `primary/500` | #3a75f6 | #5b92ff |
| `primary/600` | #2563eb | #2f6bf0 |
| `primary/700` | #1d4ed8 | #8ab4ff |
| `primary/800` | #1e40af | #c3d7ff |
| `primary/900` | #1e3a8a | #0b1633 |

**Status colours**

| Token | Light | Dark |
|---|---|---|
| `danger/50` | #fef2f2 | #2c1517 |
| `danger/100` | #fee2e2 | #40191d |
| `danger/600` | #dc2626 | #f26b6b |
| `danger/700` | #b91c1c | #fca5a5 |
| `success/50` | #f0fdf4 | #0f2619 |
| `success/100` | #dcfce7 | #163522 |
| `success/600` | #16a34a | #2bb866 |
| `success/700` | #15803d | #86efac |
| `warning/50` | #fefce8 | #2a2310 |
| `warning/100` | #fef9c3 | #3d3214 |
| `warning/600` | #ca8a04 | #e2a80c |
| `warning/700` | #a16207 | #fcd34d |

**Surface and static**

| Token | Light | Dark | Notes |
|---|---|---|---|
| `white` | #ffffff | #141416 | Page/card surface; it flips in dark mode |
| `static/white` | #ffffff | #ffffff | Never flips |
| `static/on-navy-100` | #dbeafe | #dbeafe | Never flips |
| `static/on-navy-200` | #c2d5ff | #c2d5ff | Never flips |
| `static/on-navy-300` | #96b7ff | #96b7ff | Never flips |

**Naming in code:** turn `/` into `-`, e.g. `--color-primary-600`, and Tailwind class `bg-primary-600`. `white` becomes `--color-surface`, so nobody mistakes it for literal white.

### 4.2 Typography

Headings use **Poppins SemiBold**; body text uses **Inter**. Load both with `next/font/google`.

**Headings**

| Style | Size / line height | Letter spacing |
|---|---|---|
| Heading/XL | 60/72 | −1.2 |
| Heading/L | 48/60 | −0.96 |
| Heading/M | 36/44 | −0.5 |
| Heading/S | 30/38 | −0.3 |
| Heading/XS | 24/32 | 0 |
| Heading/2XS | 20/28 | 0 |
| Heading/3XS | 16/24 | 0 |

**Body**

| Style | Size / line height |
|---|---|
| Body/XL | 20/28 |
| Body/L | 18/26 |
| Body/M | 16/24 |
| Body/S | 14/20 |
| Body/XS | 12/18 |

Body/M, Body/S and Body/XS also come in Medium and Semibold weights.

**Mobile type scale.** The mobile frames step headings down:

| Desktop | Mobile |
|---|---|
| XL | M |
| L | S |
| M | S |
| S | XS |
| XS | 2XS |
| Body/XL | Body/L |
| Body/L | Body/M |

Implement this with responsive classes, not separate components.

### 4.3 Dark mode rules (from the "Dark mode guidelines" board `124:5451`)

- **Mode-aware tokens only:** dark mode is a token swap. Components never contain dark-specific colours; they use tokens that change per mode.
- **Static tokens on photos and navy:** text on photos, the hero and navy surfaces (the footer) uses `static/*` tokens, which do not flip.
- **Contrast:** text needs at least 4.5:1 and large text and UI parts at least 3:1, in both modes. axe checks this.
- **Dark mode references:** the D01, D02 and D13 frames (desktop) and M · D01 and M · D13 (mobile).
- **Theme switch:** desktop puts it in the header's Appearance menu; mobile puts it at the bottom of the menu drawer. Options: Light, Dark, System. System follows the operating system live.

### 4.4 Layout

- **Desktop:** frame 1440 px, main content container about 1176 px; docs-style pages use a 240 px sidebar, a 760 px article and a 200 px "on this page" aside.
- **Mobile:** frame 390 px, side padding 20–32 px depending on the section.
- **Spacing:** follow Figma's auto-layout values; they are multiples of 4.

---

## 5. Signature patterns (reuse them)

- **Line rail:** stations as stops on a vertical blue line, each with a code chip (e.g. `S20`), a name and an optional subtitle. Used on About, Stations, Home ("The Mutiara Line in 2031"), Route view and the mobile menu. "Following" stations show a bell chip.
- **Vertical timeline:** construction updates and project milestones, with a "Today" marker between past and future items.
- **Stepper:** ticket status (Submitted → Pending review → In progress → Resolved). Horizontal on desktop, vertical on mobile.
- **Accent bar:** a 48 × 4 px primary bar above section headings.
- **Section bar (mobile):** replaces the docs sidebar on small screens. It shows "Group / Current page ▾" and opens the section's page list.
- **Tags:** status and type tags have fixed meanings (§2 table). Do not recolour them.

---

## 6. Interactions already wired in the Figma prototype

These show intended behaviour. The UX designer expands each into a full spec.

| Element | Behaviour |
|---|---|
| Header nav (desktop) | Opens a mega-menu panel per group: Project, Traffic, Report & Track, Account |
| Header nav (mobile) | The menu button opens a full-height drawer with all groups, account actions and the appearance switch. The same button becomes a close button. |
| Header logo | Goes to Home |
| Notification bar | "View details" goes to Announcements; the close button dismisses the bar for the session |
| Home search | Typing shows grouped suggestions (Stations, Roads, Areas) with the matching part bold |
| Home "Works in your area" | Area chips filter the update cards below |
| FAQ accordion | Expand and collapse; "Was this helpful?" asks for a reason on "No" |
| Traffic map | Route view / Map view toggle; time filter (Happening now, Next 7 days, Upcoming); layer checkboxes; a list ↔ map pop-up link |
| Report form | Type radio cards, category select, file upload with progress, consent checkbox. Submit generates a ticket ID and goes to the Submitted page. |
| Track a ticket | Enter a ticket ID to see the status stepper and updates from the authority |
| Profile | Edit actions per row; notification switches; add or remove followed stations |

---

## 7. Assets

**The only real images** in the design:

| Asset | Figma node | Size | Where |
|---|---|---|---|
| Logo mark (photo badge) | `7:850` | 44 × 44 | Header, footer, auth pages |
| Hero photo | `37:1027` | 1440 × 800 | Home hero |
| About photo (George Town street) | `37:1042` | 560 × 374 | Home "About the Mutiara Line" |
| Login illustration | `78:2527` | 728 × 485 | Log in and Forgot password |
| Sign-up illustration | `78:2622` | 728 × 485 | Sign up |
| Google sign-in buttons | (official SVGs) | | Log in and Sign up |

**Where they go:**
- The owner drops these into `design-assets/` at the repo root (see `docs/USER-CHECKLIST.md` #3). In Phase 0 the main agent moves them to wherever `ARCHITECTURE.md` says assets live, optimised for `next/image`.
- If a file is missing, use the Figma MCP asset export.
- If that fails too, use a neutral placeholder that matches Figma's grey placeholder style, and log it.
- **Photo placeholders:** construction update photos and progress card photos are intentionally grey placeholders with an image icon. Build them as an `ImagePlaceholder` component until real photos are supplied.
- **Icons:** Lucide icons match the Figma icon set (stroke 2, rounded). Use `lucide-react`.

---

## 8. Content facts

The current text is placeholder quality. The content writer improves the wording but **must not change facts**. Facts that are not on the confirmed list below and can't be checked are marked `VERIFY`.

**Line facts (confirmed by the owner; use as given, don't tag `VERIFY`):**
- 29.67 km elevated viaduct, 22 stations, 2 depots
- Operations start in 2031
- Construction began in early 2025
- Segment 1 runs from PSR-A to KOMTAR
- Segment 2, Macallum to Penang Sentral, starts January 2027
- Macallum and KOMTAR are 0.79 km apart

**Contacts (confirmed by the owner):**
- Careline: "MRTCareline 1800-88-6782", a 24-hour line. Link it as `tel:1800886782`.
- Email: `help@mutiaraconnect.my`. Link it as `mailto:help@mutiaraconnect.my`.

**Other data:**
- **Ticket ID format:** `MLC-YYMMDD-NNNN`, e.g. `MLC-261028-0482`.
- **Mock signed-in user:** Tan Mei Ling, `meiling.tan@example.com`, home area George Town, following KOMTAR and Jalan Universiti.
- **Social media** (Facebook, Instagram, X, YouTube, TikTok, LinkedIn) has **no URLs, by owner decision**.
  - Keep the names in the site data with `url: null`.
  - Render them as plain-text pills styled as in Figma, not links. They are not focusable, have no hover state, and are never `#`.
  - The link test skips them. This is not a `VERIFY` item.
- **Language and spelling:** English with British/Malaysian spelling (colour, organise, centre). Dates read "28 Oct 2026"; times read "10 pm" and "14:41" as in Figma. Malaysian place names keep their local spelling.

---

## 9. Defaults when something is missing

| Missing | Default |
|---|---|
| Map (owner decision) | Leaflet + OpenStreetMap tiles, centred on George Town (5.4141, 100.3288). Keep the Figma map controls, legend and pop-up design, and show the OSM attribution. In dark mode, keep the light tiles and give the map a dark frame and controls; don't invert the tiles with CSS filters. |
| A photo (owner decision: placeholders for now) | `ImagePlaceholder` (grey surface, image icon), as in Figma |
| A social URL (owner decision: none) | Plain-text label, not a link (§8) |
| Any other external URL | Don't invent one; render as plain text and log it |
| A frame for an in-between breakpoint | The UX spec decides; log the decision in the spec |
| A dark reference for a page | Token rules (§4.3) plus a contrast check |
| A 404 page (not in Figma) | The UX designer specifies it from existing patterns (page header, accent bar, links back to the main groups) |
