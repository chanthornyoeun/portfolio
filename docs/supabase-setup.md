# Supabase content setup

Supabase is the source of truth for all portfolio content. It is read **only at build time**: the GitHub Actions build fetches the published rows, validates them, and prerenders static HTML. Visitors never query Supabase.

```
Supabase (published rows, RLS)
   │  build only: 9 parallel read-only REST requests with the publishable key
   ▼
scripts/fetch-content.ts ── validates ──► src/generated/content.json (git-ignored)
   ▼
vite build + scripts/prerender.ts ──► dist/index.html, dist/work/<slug>/index.html, 404.html, sitemap.xml
   ▼
GitHub Pages (static files only)
```

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → **New project**.
   - The Free plan is enough.
   - Pick a nearby region, for example Singapore.
2. Open **Project Settings → API** and note:
   - the **Project URL**;
   - the **Publishable key** (`sb_publishable_…`).
3. Never use the secret or `service_role` key in this repo, `.env` files or GitHub. The build refuses `sb_secret_` keys.

## 2. Create the schema

1. Open the **SQL Editor**.
2. Run, in order:
   1. `supabase/migrations/20261123000000_portfolio_cms.sql`: tables, admin allowlist, RLS and the media bucket.
   2. `supabase/migrations/20261124000000_harden_grants.sql`: removes the API grants on `admins`, gives anonymous visitors read-only access, and adds the `meta_description` setting.
   3. `supabase/migrations/20261125000000_project_card_summary.sql`: adds the optional `projects.card_summary` column. Run it **before** deploying code that reads it; otherwise the build fails with a clear error and the live site stays as it is.

Both scripts are safe to re-run.

## 3. Import content (first time only)

1. Run `npm run seed:generate`. It builds `supabase/seed.sql` from `supabase/backup/content.json`.
2. Run `supabase/seed.sql` in the SQL Editor.

The seed never duplicates rows or overwrites dashboard edits, because it uses `on conflict do nothing`.

`supabase/backup/content.json` is the verified content snapshot taken before Supabase became the source. It is kept for re-seeding, tests and local development. It is **not** used by production builds.

## 4. Admin account

1. Create your user in **Authentication → Users → Add user** and confirm it.
2. Turn off **Allow new users to sign up**.
3. In the SQL Editor, run:

   ```sql
   insert into public.admins (user_id) select id from auth.users where email = 'YOUR_EMAIL';
   ```

No API client can read or change `public.admins`, so nobody can grant themselves admin.

## 5. Verify security

Run `supabase/tests/rls_check.sql` in the SQL Editor. Everything happens inside a transaction that is rolled back.

It checks:
- anonymous reads and writes;
- that a signed-in non-admin can't write or make itself admin;
- that drafts and draft children (roles, skills) stay hidden;
- table grants, `is_admin()` settings and storage uploads;
- admin reads and writes.

The result line says whether **all** sections passed, or that the admin section was skipped because no admin exists yet.

## 6. Connect the build

Add these **repository Variables** in **Settings → Secrets and variables → Actions → Variables**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

For local work, put the same two values in `.env.local`.

## 7. Editing and publishing content

| To change | Table |
|---|---|
| Project / case study | `projects`. `slug` is the URL `/work/<slug>/`; card badges are `featured_technologies` (1–5, each also in `technologies`). |
| Shorter text on homepage cards | `projects.card_summary` (optional, up to 220 characters). Leave it empty to show the full `summary`, which is always used on the case study and in search results. |
| Other professional work | `other_projects` |
| Experience | `experience_companies` → `experience_roles` (`YYYY-MM` dates; an empty `end_date` means Present) |
| Skills | `skill_categories` → `skills` (`level` is `primary` or `supporting`; `subgroup` gives a labelled sub-list) |
| Profile, About, email | `profile` (one row) |
| Education, languages, links | `education`, `languages`, `social_links` (`github`, `linkedin`) |
| Browser title, homepage description | `site_settings`: `site_title`, `meta_description` |

- **Paragraphs:** separate them with a blank line. A paragraph that starts with `Label: ` shows the label in bold.
- **Order:** `sort_order`, lowest first.
- **Publish / unpublish:** set `status` to `published` or `draft` on `projects`, `other_projects`, `experience_companies` or `skill_categories`. Roles and skills follow their parent.

**Changes go live when the site is rebuilt:**
- Go to **GitHub → Actions → Deploy Vite React App to GitHub Pages → Run workflow** (about 2 minutes).
- The workflow also runs every day at 02:00 UTC.
- If the content fails validation, the build stops and the previous site stays live. The workflow log lists each problem.

**Unpublishing** removes a page from the next build and from `sitemap.xml`. Browsers, CDNs and search engines may keep old copies for a while. To have Google drop a page quickly, use Search Console → Removals.

## 8. Media

1. Upload files to **Storage → portfolio-media**, using a path such as `projects/<slug>.webp`. The bucket accepts images and PDFs up to 5 MB, and only admins can upload.
2. Put that path in `projects.image_path`, `profile.avatar_path` or `profile.resume_path`. A full `https://` URL also works.

Files in this bucket are public by URL, so only upload screenshots you're allowed to share.

## 9. Free-plan notes

- Supabase pauses Free projects after about a week with no activity. The daily build counts as activity.
- If the project is paused or unreachable during a build, the build fails and the last deployed site stays online. Resume the project in the dashboard and re-run the workflow.
