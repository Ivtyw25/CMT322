# Legal and help specification

Use the saved desktop/mobile Figma references in `tests/visual/reference`. Reuse DocsLayout: Help and Legal sidebar at lg, current group section bar below lg, sticky on-this-page list at xl and help card after related pages below xl. Mobile padding 20px; token typography and theme surfaces. No page-specific client boundary is needed.

Each route has metadata, one h1, breadcrumb, lede, semantic h2 sections and related links. On-this-page links focus the existing shared heading target and update the hash. Help links and cards use central route helpers; telephone and email come from getSiteInfo(). Sidebar current links expose aria-current. Contact has report/track cards, urgent guidance, careline/email links and FAQ/announcements cards. Sitemap groups public routes, including account entry points; no admin or dynamic ticket links. Terms has 14 sections, privacy 8, accessibility 4, following reference ordering while accurately explaining the mock service.

404 has no Figma frame: compose the site shell, accent bar, existing page typography, and links to Home, Project, Traffic, Report & Track and Sitemap. Any unknown URL shows this page with noindex. It must not duplicate shell landmarks.

Verify at 320, 390 and 1440 widths in both themes: navigation, hash focus, contact destinations, sitemap coverage, one main/h1 and absence of overflow. Existing shared tests cover section-bar keyboard behaviour and theme choice. No live submissions or operational/legal guarantees.
