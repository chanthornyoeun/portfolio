# Deployment: GitHub Pages

The site is a fully static export (`output: "export"`). GitHub Pages serves the files in `out/`, and nothing runs on a server: no API routes, no runtime environment variables, no custom HTTP headers. GitHub Pages is free for public repositories, so no paid service or domain is required.

> Nothing deploys until you push to `main` (or run the workflow manually) in a repository where Pages is enabled with the **GitHub Actions** source.

## How the URL and base path work

One build input controls every URL: `NEXT_PUBLIC_SITE_URL`.

| Repository                           | Published at                                        | `NEXT_PUBLIC_SITE_URL`                             | Base path              |
| ------------------------------------ | --------------------------------------------------- | -------------------------------------------------- | ---------------------- |
| `developer-portfolio` (project site) | `https://<username>.github.io/developer-portfolio/` | `https://<username>.github.io/developer-portfolio` | `/developer-portfolio` |
| `<username>.github.io` (user site)   | `https://<username>.github.io/`                     | `https://<username>.github.io`                     | none                   |
| Any repo with a custom domain        | `https://example.com/`                              | `https://example.com`                              | none                   |

The base path is derived from the URL's path (`src/lib/env.ts`). You never set it separately.

In the workflow, `actions/configure-pages` supplies `base_url`, so the username, repository name and custom domain are **read from GitHub at build time** and never hard-coded.

## 1. Push the code to GitHub

The workflow deploys from `main`. If your local branch is called `master`, rename it first:

```bash
git branch -M main
```

Create an **empty** repository on GitHub (for example `developer-portfolio`), with no README, licence or `.gitignore`, then:

```bash
git remote add origin https://github.com/<username>/<repository>.git
```

```bash
git push -u origin main
```

GitHub Pages on a free account requires the repository to be **public**. Private repositories need a paid GitHub plan for Pages.

## 2. Enable Pages with GitHub Actions

1. On GitHub, open the repository and go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**. Do not choose "Deploy from a branch".

That's all; no branch or folder needs selecting.

## 3. Run the deployment workflow

- **Automatic:** every push to `main` runs `.github/workflows/deploy.yml`.
- **Manual:** go to **Actions → Deploy to GitHub Pages → Run workflow**.

The workflow runs these steps in order. Any failure stops it **before** anything is deployed.

1. `npm ci`
2. Lint, type check and unit tests
3. Playwright on desktop and mobile, against the static export served on the **real base path**
4. `npm run build` with `NEXT_PUBLIC_SITE_URL` from `configure-pages` and `DEPLOY_ENV=production`. The build fails if the URL is missing, not https, or localhost.
5. `npm run verify:export`. It checks that:
   - the required pages, `404.html`, `sitemap.xml`, `robots.txt` and `og.png` exist;
   - every internal link and asset is under the base path;
   - canonical URLs are correct;
   - no secrets or localhost URLs are published.
6. Upload `out/` and deploy with `actions/deploy-pages`.

Deployments never overlap (`concurrency: pages`).

Pull requests run `.github/workflows/ci.yml`. It runs the same checks, plus the e2e suite on both a root path and a repository subpath, and never deploys.

## 4. Verify the published site

Open the URL shown on the workflow run, or in **Settings → Pages**, and check:

- [ ] The homepage loads with styles, fonts and the theme toggle working in light and dark.
- [ ] Header links (Work, Experience, About, Contact, Resume) work.
- [ ] `/projects/` and each case study open. Also **refresh** a case study page and open one directly from a pasted URL.
- [ ] A nonexistent URL, such as `/<repo>/nope/`, shows the custom "Page not found" page, styled.
- [ ] `sitemap.xml` and `robots.txt` list URLs that include the repository path, if there is one.
- [ ] View source on a case study: `<link rel="canonical">` and `og:image` use the full published URL.
- [ ] On a phone, check that the menu opens and closes and that nothing scrolls sideways.

GitHub Pages can take a minute or two after the workflow finishes before changes appear.

## 5. Custom domain (optional, later)

You do not need to buy a domain. If you own one:

1. **Settings → Pages → Custom domain:** enter `example.com` (or `www.example.com`) and save.
2. At your DNS provider, add the records from GitHub's documentation, _Managing a custom domain for your GitHub Pages site_:
   - **Apex domain:** `A` records to GitHub's Pages IP addresses (and optionally `AAAA`).
   - **`www`:** a `CNAME` to `<username>.github.io`.

   Use the values in GitHub's current docs rather than copying them from here.

3. Wait for the DNS check to pass, then tick **Enforce HTTPS**.
4. Re-run the deploy workflow. `configure-pages` now returns `https://example.com`, so the site rebuilds with **no base path** and canonical URLs on the new domain. Nothing in the code changes.

Consider verifying the domain under your account's **Settings → Pages** to prevent takeovers.

## 6. Rolling back

GitHub Pages serves the most recent successful deployment. To roll back:

- **Revert and push:** `git revert <bad-commit>` then `git push`. The workflow deploys the previous content. This is the recommended way.
- **Redeploy an older commit:** check out the older commit on a branch, merge it to `main`, or temporarily allow the workflow to run from that ref.

Under **Actions**, each run keeps its uploaded `github-pages` artifact for a limited time. Old runs can't be "re-promoted" in one click the way some hosts allow.

## 7. Security on GitHub Pages

- Pages cannot send custom HTTP headers. The Content-Security-Policy and referrer policy are delivered as `<meta>` tags in `src/app/layout.tsx`.
- `frame-ancestors`, `X-Frame-Options` and HSTS headers cannot be set this way. GitHub serves Pages over HTTPS, and **Enforce HTTPS** should stay on.
- The CSP allows `'unsafe-inline'` scripts. Next.js's own startup code and the theme switcher's no-flash script need them.
- No secrets are build inputs. The build rejects any `NEXT_PUBLIC_*KEY/SECRET/TOKEN` variable, and `verify:export` scans the output.

## 8. AI assistant (not on GitHub Pages)

GitHub Pages cannot run server code, so an AI API **must not** be hosted here, and an LLM key must never be in this repository or the static build. The portfolio is complete without AI.

If an "Ask about my work" feature is added later:

- Host a small backend separately, for example a serverless function on a platform you choose. Approve any paid service first.
- Keep the provider API key only in that backend's secret store.
- Make the backend accept requests only from the portfolio's origin, using a strict CORS allowlist rather than `*`.
- Add input validation, per-IP rate limiting, a `max_tokens` cap and a provider-side monthly spend limit.
- Ground answers only in this repository's `src/content/*` data.
- In this site, call the backend from a small, lazy-loaded client component. The only build input is the backend's **public** URL. Allow that origin in the CSP `connect-src`, and make the UI hide itself if the backend is unreachable.

To turn such an assistant off, remove or blank its public URL and redeploy. To cut access immediately, disable the backend or revoke its provider key.

## 9. Local equivalents

| Task                                     | Command                                                                                                        |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Build like production for a project site | `NEXT_PUBLIC_SITE_URL=https://<user>.github.io/<repo> npm run build`                                           |
| Serve `out/` like GitHub Pages           | `NEXT_PUBLIC_SITE_URL=http://localhost:3000/<repo> npm run preview`, then open `http://localhost:3000/<repo>/` |
| Verify the export                        | `NEXT_PUBLIC_SITE_URL=<same URL as the build> npm run verify:export`                                           |
| E2E on a subpath                         | `E2E_BASE_PATH=/developer-portfolio npm run test:e2e`                                                          |

On Windows Git Bash, prefix commands whose values start with `/` with `MSYS_NO_PATHCONV=1`, or Bash rewrites them as Windows paths.
