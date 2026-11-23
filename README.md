# Chanthorn Yoeun — Portfolio

Live site: https://chanthornyoeun.github.io/portfolio/

This is a personal portfolio built with React 18, TypeScript, Vite, Tailwind CSS and Framer Motion. Content comes from Supabase, and the site is **prerendered to static HTML at build time** and served by GitHub Pages. There is no running backend, and visitors never query the database.

## Architecture

| Piece | Where |
|---|---|
| Content source | Supabase tables, RLS and storage. See [docs/supabase-setup.md](docs/supabase-setup.md). |
| Build-time fetch and validation | `scripts/fetch-content.ts`, `src/services/content.ts` |
| Content snapshot (git-ignored) | `src/generated/content.json` |
| Pages | `src/App.tsx` with one route per page (`src/routes.ts`) |
| Prerender, SEO tags, sitemap | `src/entry-server.tsx`, `scripts/prerender.ts`, `src/seo.ts` |
| Analytics (GA4, consent-based) | `src/lib/analytics.ts`, [docs/analytics-setup.md](docs/analytics-setup.md) |

**Routes:**
- `/portfolio/` is the homepage.
- `/portfolio/work/<slug>/` is a case study.
- Old `#/work/<slug>` links redirect to the new paths.
- Unknown paths get `404.html`, which is marked `noindex`.

Each page is a real HTML file with its own title, description, canonical URL, Open Graph and X tags, and structured data. The homepage has Person and WebSite data; each case study has BreadcrumbList and CreativeWork. React hydrates the HTML for theme switching, the mobile menu, animations and analytics.

## Development

```powershell
npm ci
```

Add the Supabase and analytics values to `.env.local`, using `.env.example` as the template. Then:

```powershell
npm run dev
```

`npm run dev` fetches published content from Supabase first. To work without Supabase:

```powershell
npm run content:fetch -- --from-backup
```

Then run `npx vite`. This uses `supabase/backup/content.json` and is for development only.

| Command | What it does |
|---|---|
| `npm test` | Unit tests: content mapping and validation, routes, SEO, sitemap, analytics |
| `npm run lint` | ESLint |
| `npm run build` | Fetch content, typecheck, build and prerender into `dist/` |
| `npm run build:local` | The same build from the backup snapshot, so it doesn't need Supabase |
| `npm run og:generate` | Re-render `public/og-image.png`, the 1200×630 link-preview image, with a local Chrome or Edge. Re-run it when your name, title or headline changes. |
| `npm run preview` | Serve `dist/` at http://localhost:4173/portfolio/ |

## Publishing content

1. Edit rows in the Supabase Table Editor and set `status` to `published`.
2. In GitHub, go to **Actions → Deploy Vite React App to GitHub Pages → Run workflow**. It also runs daily at 02:00 UTC and on every push to `master`.
3. After about 2 minutes the new HTML is live.

If the content is invalid, for example a missing field, a duplicate slug, more than 5 badges or a bad date, the build fails with a list of problems and the previous site stays live.

## Deployment

`.github/workflows/jekyll-gh-pages.yml` runs these steps in order:

1. `npm ci`
2. lint
3. tests
4. fetch and validate content
5. typecheck, build, prerender, then check every page has its heading and canonical tag
6. deploy

The deploy only runs if every earlier step passed.

Repository **Variables** (all public values):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_GA_MEASUREMENT_ID`

No secret keys are used.

## Conventions

- **Responsive:** mobile-first Tailwind classes. Tighter spacing below `sm` (640 px); case-study label columns only from `md` (768 px). Headings use rem-based `clamp()` and icons use rem sizes, so both follow the user's text-size setting.
- **Animations:** content is fully visible in the prerendered HTML. `src/lib/reveal.ts` only fades in items below the fold after JavaScript runs, and skips this for reduced-motion users.
- **Fonts:** Inter is self-hosted (`@fontsource-variable/inter`), and the Latin file is preloaded.

## Testing

- `npm test` runs the unit tests.
- The prerender step also fails the build if:
  - a page is missing its heading or tags;
  - content starts hidden;
  - the sitemap doesn't match the generated pages.
- Accessibility and responsive checks are manual for now: axe-core in the browser, keyboard checks of the menu, and a viewport sweep from 320 to 1920 px.

## Performance checks

- **Bundle and page sizes:** printed by `npm run build`. Compare `dist/assets/*.js` and `dist/**/index.html`.
- **Lighthouse:** open the live site in Chrome, then DevTools → Lighthouse → Mobile.
- **Real-user Core Web Vitals:** PageSpeed Insights, once enough traffic exists.

## Rollback

- **Code:** revert the merge commit on `master`. The push redeploys automatically.
- **Content:** fix or re-publish the rows in Supabase, then run the workflow. `supabase/backup/content.json` and `supabase/seed.sql` hold the content snapshot that was migrated.
- **A bad deploy that somehow passed checks:** re-run the workflow from an earlier commit using **Actions → Run workflow → Use workflow from** a branch or tag.
