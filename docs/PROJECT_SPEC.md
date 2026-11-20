# Project Spec — Chanthorn Yoeun Portfolio

## Goal

A fast, credible, content-first portfolio for a Senior Software Engineer (Phnom Penh, Cambodia). It is written for recruiters, engineering managers and freelance clients. It should read like an experienced engineer's portfolio, not a marketing page.

## Audience and what they need

| Reader              | Needs within ~30 seconds                                     |
| ------------------- | ------------------------------------------------------------ |
| Recruiter           | Title, years of experience, location, stack, resume, contact |
| Engineering manager | Depth: case studies, role clarity, technical decisions       |
| Freelance client    | Domains served, communication ability, how to get in touch   |

## Routes

All routes are exported as static files for GitHub Pages (`output: "export"`, `trailingSlash: true`). There are no API routes.

| Route                                    | Purpose                                                                                           |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `/`                                      | Hero, Selected Work, Experience, Expertise, About, Contact                                        |
| `/projects/`                             | Selected projects                                                                                 |
| `/projects/[slug]/`                      | Case study, via `generateStaticParams` and `dynamicParams = false`. Unknown slugs get `404.html`. |
| `/resume/`                               | HTML resume, print-friendly                                                                       |
| `/sitemap.xml`, `/robots.txt`, `/og.png` | SEO, generated at build time (`force-static`)                                                     |

Navigation: Work, Experience, About and Contact (homepage anchors), Resume, and the theme toggle. All of these work under a repository base path.

## Stack

- Next.js (App Router, static export), React, TypeScript strict, Tailwind CSS v4
- Content: typed TypeScript modules in `src/content/` (not MDX; see below)
- Icons: `lucide-react`. Font: Geist through `next/font` (self-hosted at build)
- Theme: `next-themes` (system default, light and dark)
- Tests: Vitest (content and logic), Playwright against the exported files (routes, a11y with `@axe-core/playwright`, root and subpath)
- Lint and format: ESLint (Next config), Prettier
- Deploy: GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`); see `docs/DEPLOYMENT.md`

**Why TS content instead of MDX:** there are four case studies with a fixed structure. Typed objects give compile-time validation of required fields, such as the "outcome only if verified" rule. No MDX toolchain is needed. Revisit this if long-form writing (a blog) is added.

## Architecture

```
src/
  app/          layout (fonts, theme, CSP meta), pages, sitemap.ts, robots.ts,
                og.png/route.tsx, not-found.tsx, error.tsx
  components/   presentational, server by default; theme-toggle and mobile-nav are client
  content/      the single source of truth for all copy
  lib/          types, content queries, env validation + base path, absoluteUrl
scripts/        serve-static (Pages emulator), verify-export, flatten-segments
tests/          unit/ (Vitest), e2e/ (Playwright)
```

### Content models (summary)

The models live in `src/lib/types.ts` (`Profile`, `Experience`, `SkillGroup`, `Project`, `Link`). Data lives in `src/content/`, and query helpers in `src/lib/content.ts`. Project contributions are split into `leadership` and `implementation`. An empty `outcomes` array means the Outcome section is not rendered.

## AI assistant (optional, not built)

GitHub Pages cannot run server code, so no AI API is hosted in this project, and the portfolio is complete without one. A future assistant would need:

- a separately hosted backend that holds the provider key;
- a CORS allowlist for the portfolio origin, rate limiting and a spend cap;
- answers grounded only in `src/content/*`;
- a lazy-loaded client panel that hides itself when the backend is unavailable.

See `docs/DEPLOYMENT.md` §8.

## Non-functional requirements

- Lighthouse targets (mobile): Performance ≥ 95, Accessibility 100, SEO 100. These are targets, verified before launch.
- WCAG 2.2 AA: contrast, visible focus, skip link, keyboard-operable toggle and menu, `prefers-reduced-motion`.
- No analytics or tracking by default.
- No secrets in the repository or the build. Every `NEXT_PUBLIC_` value is public.

## Out of scope (v1)

Blog, CMS, contact form backend (use `mailto:` plus links), i18n, a Khmer translation, analytics.
