# Owner checklist: things only you can do

Items 1–6 must be done before you start the main agent. Agents never stop because something is missing later on; they use the fallback, log it, and keep going.

## Before the first run

- [ ] **1. Create the GitHub repo and give push access.**
  - Create an empty repo, or pick the existing one whose design system is being replaced.
  - Clone it locally.
  - Run `gh auth login` (or set up SSH) so `git push` works from your terminal without a password prompt.
  - The agent pushes to `main`. If you want PRs instead, say so in your first message.

- [ ] **2. Install the tools.**
  - Node.js 22 LTS (Next.js 16 needs at least 20.9), and git 2.40 or newer
  - Claude Code, latest version
  - The Vercel CLI: `npm i -g vercel`
  - After Phase 0 has added Playwright, run `npx playwright install chromium` once in the repo.

- [ ] **3. Export the images from Figma into a `design-assets/` folder at the repo root.** Use 2× exports. In Phase 0 the main agent moves them into the place its folder structure uses and optimises them for `next/image`, so you don't need to know the final paths.

  | Figma layer | Node | Save as |
  |---|---|---|
  | `mark` (logo badge) | `7:850` | `design-assets/logo-mark.png`, plus a 512 × 512 version `design-assets/logo-mark-512.png` for the favicon |
  | `hero-photo` | `37:1027` | `design-assets/hero.jpg` |
  | `about-photo` | `37:1042` | `design-assets/about-george-town.jpg` |
  | `illustration/login` | `78:2527` | `design-assets/illustration-login.png` (transparent) |
  | `illustration/sign-up` | `78:2622` | `design-assets/illustration-sign-up.png` (transparent) |
  | Google sign-in buttons (the official SVGs you downloaded) | | `design-assets/google/` (keep Google's file names) |

  If the photos came from a stock site, note the credit in `design-assets/CREDITS.md`. Construction photos stay as grey placeholders for now (your decision), so there's nothing to export for them.

- [ ] **4. Connect Figma to Claude Code.**
  - Add Figma's MCP server to Claude Code and sign in with an account that can open file `8kWWATZPol9TwztOw8MYG4`. Figma's remote server is usually added with `claude mcp add --transport http figma https://mcp.figma.com/mcp`, then `/mcp` inside Claude Code to sign in. Check Figma's MCP docs if that URL has changed.
  - Check it works: in a Claude Code session, ask "list the pages in Figma file 8kWWATZPol9TwztOw8MYG4".
  - Heavy use needs a Figma plan whose MCP rate limits allow it. If you hit limits, the agents slow down rather than fail.

- [ ] **5. Set up Vercel so the main agent can deploy.**
  - Create a free Vercel account (signing up with GitHub is easiest).
  - In the terminal you will run Claude Code from, run `vercel login` and finish the browser sign-in. Check it with `vercel whoami`.
  - Don't create the project yourself. The main agent runs `vercel link` in Phase 0 and deploys after each iteration.
  - Optional: in the Vercel dashboard, turn off automatic Git deployments for this project, so each iteration isn't deployed twice (once by Git and once by the agent).

- [ ] **6. Copy this kit into the repo root and commit it.**
  - Unzip the kit: `PLAN.md`, `CLAUDE.md`, `pages.json`, `log.md`, `docs/`, `.claude/`.
  - Add the lines from `.gitignore.additions` to `.gitignore`.
  - Commit and push.

## Decisions already made (30 Oct 2026)

These are recorded in `PLAN.md` §1 and the agents follow them.

- [x] **Stack:** Next.js 16.4.2, App Router, Turbopack.
- [x] **Folder structure:** decided by the main agent and documented in `ARCHITECTURE.md`.
- [x] **Content:** the content writer also writes everything Figma doesn't show: options, tabs, paginated lists and all 22 station pages.
- [x] **Map:** Leaflet + OpenStreetMap. No Google Maps.
- [x] **Scope:** commuter site only. The admin console is skipped for now.
- [x] **UI/UX designer model:** Opus 5.5, medium effort.
- [x] **Careline number** "MRTCareline 1800-88-6782": confirmed.
- [x] **Contact email** `help@mutiaraconnect.my`: confirmed.
- [x] **Social media:** no real links. Shown as plain text, which is accepted.
- [x] **Line facts:** 29.67 km, 22 stations, 2031 opening and segment dates confirmed.
- [x] **Construction photos:** placeholders for now.
- [x] **Hosting:** Vercel, deployed by the main agent.

## While it runs

- [ ] **7. Check in now and then.** Read `log.md`, the commits on GitHub and the live Vercel URL. The "Open" and "Decisions" sections are where your input helps most.
- [ ] **8. Answer questions.** If the main agent asks something, it keeps working on other groups meanwhile. Answer whenever you can.
- [ ] **9. Don't push to the same branch** while the agents are running, or you will cause merge conflicts. If you must, tell the main agent first.
- [ ] **10. Keep the computer awake** during long runs, and keep the terminal session open.

## After it finishes

- [ ] **11. Review blocked pages.** Read the final log entry's "Open" list and every page marked `blocked` in `pages.json`.
- [ ] **12. Clear the `VERIFY` list.** Go through `docs/content/verify.md`, which should now only hold smaller facts such as individual works dates and road names.
- [ ] **13. Click through it yourself** on the live Vercel URL, on a real phone and a desktop, in both themes.
- [ ] **14. Later, if you want the admin console:** tell the main agent "admin is back in scope". It will set the 10 admin pages back to `todo` and build them as two more iterations.
