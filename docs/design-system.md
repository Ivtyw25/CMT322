# Design system

Generated from Figma file `8kWWATZPol9TwztOw8MYG4` on 30 Oct 2026. The repo had no earlier design system (no tokens, theme files or component library), so nothing was migrated.

## Pipeline

```
Figma variables + text styles ──(main agent, Figma MCP)──► design/tokens/figma-tokens.json
                                                              │  npm run tokens
                                                              ▼
                                         src/styles/tokens.css  (generated; the only file with raw values)
                                                              │  @import in globals.css
                                                              ▼
                                         Tailwind theme: bg-primary-600, type-heading-s, rounded-lg, shadow-panel…
```

`tokens.css` clears Tailwind's default palette, font sizes, radii, shadows and container widths, so only Figma values exist. `npm run check:tokens` fails on any hex, `rgb()`/`hsl()`, default-palette class or arbitrary value outside `tokens.css`.

## Colour

All 36 variables of the "MYDS Colour" collection, Light and Dark, named as in Figma with `/` → `-` (`gray/500` → `bg-gray-500`, `text-gray-500`, `border-gray-500`). Figma `white` is `surface` (`bg-surface`): it is the page and card background and turns `#141416` in dark mode.

Mode switching: `:root` holds the light values as `--myds-*`; `:root[data-theme='dark']` overrides them. Tailwind classes point at those variables, so **components never need `dark:` colour variants**.

| Role (from the dark-mode board) | Token |
|---|---|
| Page and card surface | `surface` |
| Alternate section, raised panel | `gray-50` |
| Subtle fill, image placeholder | `gray-100` |
| Borders and dividers | `gray-200` |
| Secondary text, icons | `gray-500` |
| Body text | `gray-700` |
| Headings, inverted chips | `gray-900` |
| Selected item, tinted box | `primary-50` |
| Buttons, active bar, accent bar | `primary-600` |
| Links, active labels | `primary-700` |
| Footer, auth panels (navy zone) | `primary-900` |
| Notification bar, construction tag | `warning-50` + `warning-700` |
| Closure text, errors | `danger-700` (on `danger-50`) |
| Resolved, verified | `success-700` (on `success-50`) |

**Static tokens never flip.** Use them for text and icons on photos, the hero and navy surfaces: `static-white`, `static-on-navy-100/200/300` (Figma variables) and these values measured on the canvas that have no variable:

| Token | Value | Used on |
|---|---|---|
| `static-navy` | #1e3a8a | Hero fallback behind the photo |
| `static-amber` | #fce08a | Notification bar text over the hero |
| `static-glass` | white 14 % | Glass panels on the hero |
| `static-glass-subtle` | white 6 % | Mobile footer newsletter box |
| `static-scrim-bar` | #0a1433 at 45 % | Notification bar over the hero (with `backdrop-blur-bar`) |
| `bg-hero-scrim` | navy gradient 15 → 60 → 92 % | Hero photo overlay |
| `bg-nav-scrim` | navy 65 % → 0 | Top of the hero behind the transparent header |

Not tokenised on purpose: the Google sign-in button colours (we use Google's official SVGs unchanged) and the colours of the Figma map drawing (replaced by OpenStreetMap tiles).

## Typography

Poppins SemiBold for headings and Inter for body, loaded with `next/font` (`src/styles/fonts.ts`). Each Figma text style is one utility that sets family, size, line height, letter spacing and weight:

`type-heading-xl` 60/72 · `type-heading-l` 48/60 · `type-heading-m` 36/44 · `type-heading-s` 30/38 · `type-heading-xs` 24/32 · `type-heading-2xs` 20/28 · `type-heading-3xs` 16/24 · `type-body-xl` 20/28 · `type-body-l` 18/26 · `type-body-m` 16/24 · `type-body-s` 14/20 · `type-body-xs` 12/18, and `-medium` / `-semibold` for body M, S and XS.

Mobile steps down (BRIEFING §4.3) with responsive classes, mobile first: `type-heading-m lg:type-heading-xl`, `type-heading-s lg:type-heading-l`, `type-heading-s lg:type-heading-m`, `type-heading-xs lg:type-heading-s`, `type-heading-2xs lg:type-heading-xs`, `type-body-l lg:type-body-xl`, `type-body-m lg:type-body-l`.

`cn()` (`src/lib/cn.ts`) knows the `type-*` group, so `cn('type-body-m', 'type-body-s')` keeps the last one and never drops a colour class.

## Radius, shadow, layout

| Radius | xs 2 · sm 4 · md 6 · lg 8 · xl 10 · 2xl 12 · 3xl 16 · 4xl 20 · full | `rounded-lg` etc. Note `xl` is 10 px here (Tailwind's default is 12). |
|---|---|---|

| Shadow | Value | Used on |
|---|---|---|
| `shadow-xs` | 0 1 2 / 10 % | Map frame, small surfaces |
| `shadow-control` | 0 1 3 / 10 % | Segmented control thumb, toggles |
| `shadow-button` | 0 1 3 navy / 18 % | Primary button |
| `shadow-knob` | 0 1 2 / 20 % | Switch knob |
| `shadow-map-control` | 0 1 4 / 18 % | Map buttons and labels |
| `shadow-popover` | 0 8 24 / 16 % | Map pop-up |
| `shadow-menu` | 0 12 32 / 16 % | Appearance menu |
| `shadow-drawer` | 0 16 32 / 18 % | Mobile menu drawer |
| `shadow-panel` | 0 16 40 / 14 % | Mega-menu nav panel |
| `shadow-suggestions` | 0 16 40 / 22 % | Home search suggestions |
| `shadow-hero-search` | 0 12 32 / 25 % | Hero search box |
| `shadow-focus` | 3 px `primary-200` ring | Focused form fields (Figma "box" focus) |

Dark mode: shadows barely show, so depth comes from lighter surfaces and `gray-200` borders, as the dark-mode board says. Keep the same shadow class; don't add dark-only shadows.

Layout: page frame 1440 px; content `max-w-content` 1200 px; docs article `max-w-article` 760 px; docs sidebar `w-docs-sidebar` 240 px; aside `w-docs-aside` 200 px. Header height `h-header` 92 px desktop, `h-header-mobile` 60 px mobile (each plus a 1 px border). Spacing uses Tailwind's 4 px scale, which matches Figma's auto-layout values.

## Theme

Light, Dark and Match system (the default for new visitors). `src/lib/theme/theme-script.ts` sets `data-theme` on `<html>` in `<head>` before first paint; `ThemeProvider` keeps it in sync, follows `prefers-color-scheme` live while on System, and saves Light or Dark in `localStorage` (`mlc-theme`), wrapped in try/catch. Dark mode never moves, hides or re-orders anything.

## Components

Built in the foundations iteration on shadcn/ui (Radix) primitives, restyled to Figma with these tokens. The catalogue, with every variant and state, lives at `/dev/components` in development.

## Added in iteration 1 (not variables in Figma)

| Token | Light | Dark | Why |
|---|---|---|---|
| `action-hover` | #1d4ed8 (primary/700) | #255fe0 | Primary button hover. Dark `primary-700` is a light text blue, so it can't carry white labels |
| `action-active` | #1e40af (primary/800) | #1f50c4 | Primary button pressed |
| `static-white-30` | white 30 % | white 30 % | Social pill border on the navy footer (measured on 1:127) |

Motion: `ease-standard` cubic-bezier(0.2, 0, 0, 1), `ease-enter` (0, 0, 0.2, 1), `ease-exit` (0.4, 0, 1, 1); durations `--duration-fast` 150 ms, `--duration-base` 200 ms, `--duration-slow` 250 ms (use `duration-(--duration-base)`). All motion is removed under `prefers-reduced-motion`.
