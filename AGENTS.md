# AGENTS.md — Engineering instructions for this repo

Personal portfolio for Chanthorn Yoeun. Read `docs/` before changing anything:
`PROJECT_SPEC.md`, `DESIGN_SYSTEM.md`, `CONTENT_GUIDELINES.md`, `IMPLEMENTATION_PLAN.md`, `DEPLOYMENT.md`.

## Hard rules

- **Never invent facts.** No made-up metrics, titles, dates, clients, outcomes, links, screenshots or testimonials. If a fact is missing, leave it out and ask.
- **Role accuracy:** Ecoinsoft = "Frontend Team Leader" (did not own the insurance backend). Aibodia = "Project Leader / Team Lead" (no Scrum-ceremony claims).
- **Confidentiality:** no client internals, endpoints, schemas, code or real system names. Private projects show no repo or demo buttons.
- **No availability-for-hire claims** unless the owner states it.
- **No tracking or analytics** without explicit approval.
- **Never push, change repository settings or deploy** without the owner's explicit approval.

## Static export (GitHub Pages)

The site is `output: "export"` and is served as plain files. Nothing runs at request time.

- **No server features:**
  - no API routes or Server Actions;
  - no `cookies()`, `headers()` or `draftMode()`;
  - no middleware, ISR or `revalidate`;
  - no `next start`;
  - no `next.config` `headers()`, `redirects()` or `rewrites()`.

  None of these work on Pages.

- **Static routes:**
  - Every dynamic route needs `generateStaticParams()` and `dynamicParams = false`.
  - Metadata routes and route handlers (`sitemap.ts`, `robots.ts`, `og.png/route.tsx`) need `export const dynamic = "force-static"`.
- **Base path:** the site may live under `/<repo>/`. `basePath` is derived from `NEXT_PUBLIC_SITE_URL` (`src/lib/env.ts`).
  - Use `next/link` for internal links. Never hand-write `<a href="/...">` or `<img src="/...">` for internal URLs.
  - Build absolute URLs (canonical, Open Graph, sitemap, JSON-LD) with `absoluteUrl()` from `src/lib/site.ts`. Never use string concatenation or a relative metadata URL.
- **Trailing slashes:** URLs end in `/` (`trailingSlash: true`). Write site paths as `/projects/slug/`.
- **Images:** `images.unoptimized` is on. Keep images small and committed, and never use a remote optimizer.
- **Build-time env only:** every `NEXT_PUBLIC_` value is published, and there is no runtime environment.
- **No secrets in this repo or the build.** An AI assistant, if ever added, lives on a separately hosted backend. See `docs/DEPLOYMENT.md` §8.
- **Security policy:** the CSP is a `<meta>` tag in `src/app/layout.tsx`, because Pages cannot send headers. If you add a new external origin, it must be added there deliberately.
- **Prefetch fix:** `scripts/flatten-segments.mjs` works around Next 16.4 segment-prefetch filenames. Re-check it when upgrading Next. `npm run verify:export` fails if it stops being applied.

## Code conventions

- TypeScript strict. No `any` and no non-null assertions without a reason comment.
- Server components by default. Add `"use client"` only for real interactivity (theme toggle, mobile menu).
- All copy comes from `src/content/*`. Components take typed props and never hard-code portfolio claims.
- Tailwind with the design tokens from `DESIGN_SYSTEM.md`. No arbitrary colors.
- Do not add a dependency for something a few lines or the platform can do. Justify every new package in the PR.

## Accessibility

Semantic landmarks, one `h1`, visible focus, keyboard operable, AA contrast, `prefers-reduced-motion` respected. Axe checks must pass in both themes.

## Before declaring done

```bash
npm run check && npm run test:e2e && E2E_BASE_PATH=/developer-portfolio npm run test:e2e
```

That covers lint, types, format and unit tests, then e2e at the root path, then e2e on a repository subpath. On Windows Git Bash, prefix the subpath run with `MSYS_NO_PATHCONV=1`.

All must pass. Report failures honestly. Do not claim unverified features, and never claim a live deployment you have not seen.

## Commands

- `npm run dev` — local dev server
- `npm run build` — static export to `out/`
- `npm run preview` — serve `out/` like GitHub Pages
- `npm run verify:export` — validate `out/` (set `NEXT_PUBLIC_SITE_URL` to the URL it was built for)
- `npm test` — Vitest
- `npm run test:e2e` — Playwright against the static export
- `npm run format` — Prettier
