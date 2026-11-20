# Chanthorn Yoeun — Portfolio

Personal portfolio for Chanthorn Yoeun, Senior Software Engineer in Phnom Penh, Cambodia. It is built with Next.js (App Router), React 19, TypeScript (strict) and Tailwind CSS 4, and exported as a fully static site for **GitHub Pages**. No server runs in production.

- **Pages:** `/` (homepage), `/projects`, `/projects/[slug]` (case studies) and `/resume`.
- **SEO:** sitemap, `robots.txt`, a generated social preview image and Person structured data.
- **Themes:** light and dark, following the system setting by default.
- **Privacy:** no analytics or tracking.

## Requirements

- Node.js 22 (see `.nvmrc`; 20.9+ also works)
- npm 10

## Getting started

```bash
npm install
cp .env.example .env.local   # optional locally; defaults work
npm run dev                  # http://localhost:3000
```

## Scripts

| Script                            | What it does                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                     | Development server                                                                                                                                      |
| `npm run build`                   | Static export to `out/`. Validates environment variables first.                                                                                         |
| `npm run preview`                 | Serve `out/` the way GitHub Pages does, including the base path and 404 page                                                                            |
| `npm run verify:export`           | Check `out/`: required pages, links and assets under the base path, canonicals, sitemap, no secrets                                                     |
| `npm run lint`                    | ESLint                                                                                                                                                  |
| `npm run typecheck`               | TypeScript, no emit                                                                                                                                     |
| `npm run format` / `format:check` | Prettier write / check                                                                                                                                  |
| `npm test`                        | Vitest unit tests (content rules, helpers, env validation)                                                                                              |
| `npm run test:e2e:install`        | Install the Playwright browser (once)                                                                                                                   |
| `npm run test:e2e`                | Build, serve `out/` like GitHub Pages, and run Playwright on desktop and mobile. Set `E2E_BASE_PATH=/developer-portfolio` to test a repository subpath. |
| `npm run check`                   | Lint, types, format and unit tests in one go                                                                                                            |

Before merging, run `npm run check && npm run test:e2e`. CI runs the same steps.

## Environment variables

These are **build-time only**. A static site has no runtime environment, and every `NEXT_PUBLIC_` value ends up in the published files.

| Name                   | Required                   | Purpose                                                                                                                                                                                                                                                                                                                                           |
| ---------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | Production                 | The public URL, **including the repository path** on a project site: `https://<user>.github.io/<repo>`. Use `https://<user>.github.io` for a user site, or `https://example.com` for a custom domain. The Next.js `basePath` is derived from it. Defaults to `http://localhost:3000`. The deploy workflow sets it from `actions/configure-pages`. |
| `DEPLOY_ENV`           | Set by the deploy workflow | `production` makes the build require an https, non-localhost site URL.                                                                                                                                                                                                                                                                            |

`next build` checks these with [`src/lib/env.ts`](src/lib/env.ts) and **fails** if:

- a production build has no https `NEXT_PUBLIC_SITE_URL`, or it is localhost;
- the URL is malformed, uses another protocol, or has a query or hash;
- any `NEXT_PUBLIC_*KEY/SECRET/TOKEN` variable exists, because those would be published.

`.env*` files are git-ignored except `.env.example`. Never commit real values.

## Editing content

All portfolio text lives in typed data files. You change content without touching UI components, and TypeScript plus the unit tests catch mistakes.

| File                                                     | Contains                                                                                                      |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`src/content/profile.ts`](src/content/profile.ts)       | Name, headline, intro, About paragraphs, links, optional `email`, education, languages                        |
| [`src/content/experience.ts`](src/content/experience.ts) | Roles, newest first: company, title, `start`/`end` as `"YYYY-MM"` (omit `end` for a current role), highlights |
| [`src/content/projects.ts`](src/content/projects.ts)     | Case studies                                                                                                  |
| [`src/content/skills.ts`](src/content/skills.ts)         | Expertise groups                                                                                              |
| [`src/content/navigation.ts`](src/content/navigation.ts) | Header links                                                                                                  |

The data shapes are defined in [`src/lib/types.ts`](src/lib/types.ts).

**Add a case study:** add an object to `projects` in `projects.ts`.

- `slug` becomes the URL (`/projects/<slug>`): lowercase letters, numbers and hyphens.
- `order` controls position. `featured: true` puts it on the homepage.
- `contributions` is split into `leadership` and `implementation`. Keep them honest.
- `outcomes` and `lessons` sections only render when they have entries. Add only verified outcomes, and remove the "no outcomes yet" test in `tests/unit/projects.test.ts` when you do.
- `diagram` is optional, a list of simplified steps. Use no real hosts, service names or data fields.
- `repositoryUrl` and `liveUrl` only render for `visibility: "public"` projects with valid http(s) URLs.

The sitemap, project list and related projects update automatically.

**Show an email in Contact:** set `email` in `profile.ts`. It becomes the primary "Email" button in Contact and is added to the structured data. Nothing renders until it holds a valid address.

**Add a portrait (optional):** use a real photo only, never generated or stock.

1. Put it in `src/assets/`, ideally as WebP or AVIF and about 400×400.
2. Import it in `profile.ts` and set `photo: { src: portrait, alt: "Chanthorn Yoeun" }`.

It appears beside the hero on desktop and small above it on mobile. Without it, the hero stays text-only.

**Add a project preview (optional):** use an authorized screenshot with confidential details removed, or an original mockup.

1. Put it in `src/assets/`.
2. Import it in `projects.ts` and set `image: { src, alt, kind: "screenshot" | "mockup" }`.

It shows on the case study page with a caption stating which kind it is. Project cards stay text-only, so they look consistent whether or not a project has an image.

Images must be **imported** from `src/assets`, not referenced as `/public` paths. Imports give width and height (no layout shift) and get the GitHub Pages base path automatically.

**Card text:** a project's optional `cardSummary` replaces `summary` on project cards. Cards show the first four `technologies`, so list the main ones first.

**Change a job:** edit `experience.ts`. The homepage timeline groups consecutive roles at the same company, and the resume shows full details.

Content rules (no invented metrics, exact job titles, confidentiality) are in [`docs/CONTENT_GUIDELINES.md`](docs/CONTENT_GUIDELINES.md). Some rules are enforced by `tests/unit/content.test.ts`.

**Why no CMS or MDX:** the content is small, structured and changes rarely. Typed files give validation for free, need no extra service or cost, and every change is reviewed in git. Revisit this if a blog is added.

## Project structure

```
src/
  app/          routes, metadata, sitemap, robots, og.png, 404 and error pages
  components/   presentational components (server by default)
  content/      all portfolio copy (edit here)
  lib/          types, content queries, env validation, site URL
tests/
  unit/         Vitest
  e2e/          Playwright (site, projects, SEO/a11y/security audit)
scripts/        static server, export verifier, segment-file fix
docs/           spec, design system, content guidelines, plan, deployment
```

## Deployment

The site deploys to **GitHub Pages** through `.github/workflows/deploy.yml`, on every push to `main` or by running it manually. That workflow:

1. runs lint, type checks, unit tests and Playwright on the real base path;
2. builds and verifies `out/`;
3. publishes it with the official Pages actions.

See [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for:

- first-time setup: push, then **Settings → Pages → Source: GitHub Actions**;
- verifying the live site;
- custom domains;
- rollbacks;
- GitHub Pages security limits;
- how an optional AI assistant must be hosted separately.

**AI:** the portfolio has no AI features and needs none. GitHub Pages cannot run server code, so any future assistant must live on a separately hosted backend that keeps the API key. See section 8 of the deployment guide.

## Engineering rules

See [`AGENTS.md`](AGENTS.md).
