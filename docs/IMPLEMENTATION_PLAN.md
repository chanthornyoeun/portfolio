# Implementation Plan

Each phase ends with `npm run lint && npm run typecheck && npm test && npm run build` passing. Nothing is called done without that.

## Phase 0 — Confirm facts (blocking for content, not for scaffolding)

Resolve the open questions in the "Missing facts" section below. Content uses only confirmed facts. Unconfirmed items are left out, not stubbed.

## Phase 1 — Scaffold

- `git init`, `create-next-app` (TypeScript, App Router, Tailwind, ESLint, `src/`, npm).
- Strict TS (`strict`, `noUncheckedIndexedAccess`), Prettier, Vitest, and Playwright + axe.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `test`, `test:e2e`, `format`.
- Pin versions that work together and are current stable (Next 15/16 LTS line, React 19, Tailwind 4). Check peer deps with `npm ls`.

## Phase 2 — Content layer

- `src/lib/types.ts` models; `src/content/{profile,experience,projects,skills}.ts`.
- Unit tests: unique slugs; private projects have no links; required case-study fields present; no banned phrases ("available for hire", "open to work"); Ecoinsoft title is exactly "Frontend Team Leader".

## Phase 3 — Layout and design system

- Tokens, Geist font, `next-themes` toggle (no flash), header with mobile menu, footer, skip link.
- `not-found.tsx`, `error.tsx`.

## Phase 4 — Pages

- Homepage sections in order: Hero, Selected Work, Experience, Expertise, About, (AI entry), Contact.
- `/projects`, `/projects/[slug]` with `generateStaticParams` and `notFound()`, `/resume` with print styles.
- Per-page metadata, OG image, `sitemap.ts`, `robots.ts`, JSON-LD `Person`.

## Phase 5 — Tests and quality

- Playwright: every route renders, nav anchors work, unknown slug returns 404, theme toggle works by keyboard, axe has no serious violations in light and dark, mobile viewport has no horizontal scroll.
- Lighthouse check on a production build.

## Phase 6 — Optional AI assistant (deferred)

- Not hosted on GitHub Pages. If wanted later, build a separate backend first (DEPLOYMENT.md §8).

## Phase 7 — Docs and deploy (done)

- GitHub Pages static export, deploy workflow, README, DEPLOYMENT.md, AGENTS.md.

## Missing facts (must be confirmed)

Resolved:

- work history and the project ↔ employer mapping;
- links, education, languages and skills;
- the petroleum stack: Next.js, React, TypeScript, Laravel (PHP), Figma;
- the insurance role: hands-on Angular work as Frontend Team Leader.

Still open:

1. **Contact email:** the primary contact action stays hidden until a real address is set in `profile.ts`.
2. **Petroleum database:** which database the project uses. None is documented yet, so none is shown.
3. **Portrait:** a real photo, if you want one.
4. **Project previews:** any authorized screenshots or original mockups.
5. **VMS and IAC:** what the acronyms stand for, and whether they can be named publicly. They are currently shown as-is.
6. **Verified outcomes:** any shareable outcomes for any project.
7. **Education:** whether the degree was completed. It is currently "Computer Science studies".
8. **Resume PDF:** whether there is one to host.
9. **GitHub repository:** its name, and approval to push.
