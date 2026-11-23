# Portfolio Audit (before refresh)

Recorded 2026-11-21 against `master` @ 49cb161.

## Current site structure

- Entry: `index.html` → `src/main.tsx` → `src/App.tsx`. No router; single page with `#hash` anchors.
- Theme: `src/contexts/ThemeContext.tsx` (class-based dark mode, `localStorage`, falls back to system preference).
- Sections rendered in order: Header, Hero (`#home`), About, Experience, Education, Skills, Projects, Contact, Footer.
- Styling: Tailwind 3 (`tailwind.config.cjs`, `darkMode: 'class'`), `src/assets/styles/globals.css` (shadcn-style tokens, some Tailwind-4 syntax such as `@custom-variant`/`@theme` that Tailwind 3 ignores). `src/App.css` is not imported anywhere.
- Animation: Framer Motion on every section (fade/slide-in), plus looping blob/badge/rotating-border animations in Hero.
- Build/deploy: Vite 7, `base: '/portfolio/'`. `.github/workflows/jekyll-gh-pages.yml` builds with `npm install` + `npm run build` and deploys `dist/` via `actions/deploy-pages` on push to `master`. Commit history shows `--legacy-peer-deps` was needed for installs.

## Existing content inventory

| Section | Content | Status |
| --- | --- | --- |
| Header | Brand "Portfolio"; nav Home/About/Experience/Skills/Projects/Contact | Replace |
| Hero | "Full Stack Software Engineer", generic tagline, links to `https://github.com`, `https://linkedin.com`, `mailto:alex@example.com` | Replace (placeholder links) |
| About | Generic "Clean Code / Problem Solver / Team Player" copy | Replace |
| Experience | Placeholder companies ("Your Company Name", "Previous Company") and dates | Replace |
| Education | "University Name", invented GPA 3.8, Dean's List, AWS certification | Replace (unverified claims) |
| Skills | Includes Python, Express, Figma, Agile/Scrum | Replace with verified grouped skills |
| Projects | 4 fictional projects (E-Commerce, Task App, Weather, CMS) with Unsplash images and fake GitHub/live links | Replace |
| Contact | Fake email `alex.johnson@example.com`, fake phone, "San Francisco, CA"; mock form that only `alert()`s | Replace; remove form |
| Footer | Gradient footer, links to generic github/linkedin/twitter, placeholder email, credits block | Simplify; keep credits link to `ATTRIBUTION.md` |
| `index.html` | `<title>my-portfolio</title>`, Vite favicon, no meta description/OG | Replace |

Hardcoded/duplicated: social links duplicated in Hero and Footer; all section data inline in components.

## Existing assets and usage

- `public/vite.svg` — favicon (default Vite logo). Replace with a simple monogram SVG.
- `src/assets/react.svg` — unused.
- Remote Unsplash stock photos (Hero workspace, 4 project images) — stock imagery unrelated to real work; remove.
- No portrait, resume PDF, or project screenshots exist in the repo.

## Preserve

- React 18 + TypeScript + Vite + Tailwind + Lucide + Framer Motion architecture.
- `ThemeProvider` light/dark toggle, fixed header with mobile menu, section components, `ImageWithFallback`.
- Vite base path and GitHub Pages workflow.
- `LICENSE`, `ATTRIBUTION.md` and the footer credits link.

## Replace

All professional facts (title, experience, education, skills, projects, contact) — replaced with verified content, centralized in `src/data/`.

## Reusable components

Header, Hero, About, Experience, Skills, Projects, Contact, Footer, ThemeContext, figma/ImageWithFallback.

## Unused code and dependencies

- `src/components/ui/*` (48 shadcn components) — imported by no app component. Source of 7 of 10 pre-existing lint errors. Their dependencies (Radix packages, vaul, cmdk, recharts, react-day-picker, input-otp, react-hook-form, react-resizable-panels, embla-carousel-react, class-variance-authority) are only used there.
- `src/types/shims.d.ts` — type shims only for those packages.
- `src/App.css`, `src/assets/react.svg` — unreferenced.

## Required UI improvements

- Remove gradients, blobs, floating badges, rotating borders, looping animations, stock photos.
- Neutral near-white/near-black palette with one blue accent; thin borders, minimal shadow.
- Content width ~1000px; left-aligned section headings.
- Inter font; visible focus states; `aria-expanded` on mobile menu; respect reduced motion.
- Project cards without fake links; case-study detail view.

## Deployment considerations

- Keep `base: '/portfolio/'`; reference public assets via `import.meta.env.BASE_URL`.
- GitHub Pages has no SPA fallback → use hash routes (`#/work/<slug>`) for case studies so refresh/direct links work without a 404 hack.
- Workflow uses `npm install` without `--legacy-peer-deps`; after removing the unused UI kit the peer conflicts it caused should disappear (verify with `npm ci`).
- No server features, no API keys in the frontend. AI assistant deferred (needs a separately hosted API).
