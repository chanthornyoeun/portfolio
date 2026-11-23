# Supabase CMS

The portfolio can read its content from Supabase at runtime, so you edit content in the Supabase Dashboard instead of changing code and redeploying. There is no backend server: the browser talks to Supabase directly, and Row-Level Security (RLS) decides what each visitor may read or write.

## How it works

```
GitHub Pages (static React app)
  ├─ renders the content bundled from src/data immediately  ← fallback
  └─ loads @supabase/supabase-js in a separate chunk, fetches published rows, swaps them in
Supabase
  ├─ PostgreSQL tables (supabase/migrations)
  ├─ RLS: anyone reads published rows; only allowlisted admins write
  └─ Storage bucket "portfolio-media" (public read, admin-only upload)
```

The important pieces in the code:

- `src/lib/supabase.ts` validates the config and creates the client.
  - It refuses non-https URLs and `sb_secret_…` keys.
- `src/services/content.ts` turns database rows into the shapes the components already use.
  - It uses one round of parallel queries.
  - It asks only for `status = 'published'` rows.
- `src/contexts/ContentContext.tsx` keeps the bundled content until Supabase answers.
  - If Supabase is not configured, errors, or has no profile row, the bundled content stays on screen and a warning is logged.
- The components read everything through `useContent()`.
  - A case-study link that exists only in Supabase waits for the data instead of flashing the homepage.

**Fallback.** `src/data/*.ts` stays as the bundled fallback and as the source for the seed. It is the content of the last deploy, never drafts.

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → **New project**.
   - The Free plan is enough.
   - Pick the region closest to your visitors, for example Singapore.
2. Open **Project Settings → API** and note:
   - the **Project URL** (`https://<ref>.supabase.co`)
   - the **Publishable key** (`sb_publishable_…`). On older projects, use the `anon` public key.
3. **Never** copy the secret or `service_role` key into the app, `.env` files or GitHub. It bypasses RLS.

## 2. Create the schema

1. Open **SQL Editor → New query**.
2. Paste `supabase/migrations/20261123000000_portfolio_cms.sql` and click **Run**.

It creates:
- the content tables, the `admins` allowlist and the `is_admin()` function;
- RLS policies on every table;
- the `portfolio-media` storage bucket: 5 MB limit; WebP, PNG, JPEG, AVIF and PDF only.

The script is safe to run again.

If you use the Supabase CLI instead: `supabase link`, then `supabase db push`.

## 3. Import the current content

1. Run `npm run seed:generate`. It rebuilds `supabase/seed.sql` from `src/data` and was already run once for this commit.
2. Paste `supabase/seed.sql` into the SQL Editor and click **Run**.

Every row is inserted as **published**, with the same slugs, dates, ordering and wording as the site today.

Re-running the seed never duplicates rows and never overwrites rows you edited in the dashboard: it uses `on conflict … do nothing`. To reset one record to the repo version, delete it in the dashboard and run the seed again.

## 4. Make yourself the admin

The allowlist can only be changed from the SQL Editor or with the service role. No browser client can read it or add itself to it.

1. In **Authentication → Users → Add user**, create your user with your email and a strong password, then confirm it.
2. In **Authentication → Providers / Sign In**, turn off **Allow new users to sign up**. Even if someone does sign up, they still get no write access.
3. In the SQL Editor, run:

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where email = 'YOUR_EMAIL';
   ```

To remove an admin: `delete from public.admins where user_id = '…';`

The admin account is only needed for a future custom dashboard. In the Supabase Dashboard itself you already have full access as the project owner.

## 5. Check the security rules

Paste `supabase/tests/rls_check.sql` into the SQL Editor and run it. It works inside a transaction that is rolled back, so nothing is changed.

It checks that:
- anonymous visitors can't read drafts, or the roles and skills of a draft parent;
- anonymous visitors can't read the allowlist or write anything;
- a signed-in non-admin can't make itself admin or edit anything;
- the admin can read drafts and edit content. This check is skipped until you bootstrap an admin.

The last line should read **RLS checks passed**.

## 6. Connect the site

**Local development:** add these to `.env.local` (git ignores it), then run `npm run dev`:

```
VITE_SUPABASE_URL=https://<ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

**Production:**
1. In GitHub, go to **Settings → Secrets and variables → Actions → Variables** and add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Both values are public by design.
2. Re-run the deploy workflow.

You only need to deploy this once. After that, content changes need no deploy.

## 7. Managing content (Table Editor)

| To change | Table | Notes |
|---|---|---|
| A project or case study | `projects` | `slug` is the URL (`#/work/<slug>`). Keep it lowercase with hyphens. |
| Card badges | `projects.featured_technologies` | At most 5; the database rejects more. |
| Full stack, contributions | `projects.technologies`, `projects.contributions` | One list item per line. |
| Paragraphs in long fields | `challenge`, `approach`, … | Separate paragraphs with a blank line. Starting a paragraph with `Label: ` shows the label in bold. |
| Other professional work | `other_projects` | `url` must start with `https://` or be empty. |
| Experience | `experience_companies` → `experience_roles` | Dates are `YYYY-MM`. An empty `end_date` means "Present". `highlights` is a list. |
| Skills | `skill_categories` → `skills` | `level` is `primary` (badge) or `supporting` (muted text). Set `subgroup` (e.g. `AI-assisted`) for a labelled sub-list. |
| About, headline, intro, email | `profile` (one row) | `about` is a list of paragraphs. |
| Education, languages | `education`, `languages` | The About section shows the first education row. |
| GitHub / LinkedIn | `social_links` | `platform` is `github` or `linkedin`. |
| Browser title | `site_settings`, key `site_title` | |

- **Ordering:** `sort_order`, lowest first. Roles: put the newest role at 0.
- **Publish / unpublish:** set `status` to `published` or `draft` on `projects`, `other_projects`, `experience_companies` and `skill_categories`. Roles and skills follow their parent.
- **When changes show up:** visitors get new content on their next page load. There is no cache to clear.

## 8. Media (screenshots, portrait, CV)

1. In **Storage → portfolio-media**, upload the file. Use a path such as `projects/real-time-auction.webp`, `profile/portrait.webp` or `cv/resume.pdf`, and lowercase names without spaces.
2. Put that path in the matching field:
   - `projects.image_path` for a screenshot: 16:9, about 1280×720 WebP;
   - `profile.avatar_path` for your portrait;
   - `profile.resume_path` for your CV.

   A full `https://` URL also works in these fields.
3. Only upload screenshots you're allowed to share, with confidential data removed. The bucket is public: anyone with the link can view a file.

An empty CV or portrait path keeps the Resume button and the portrait hidden, as they are today.

## 9. SEO and limits

- **Search engines and link previews** read `index.html`: title, description, Open Graph and structured data. Those still come from the repo. Content loaded from Supabase changes what visitors see and the browser tab title, but crawlers that don't run JavaScript won't see it. Update `index.html` and redeploy for SEO wording.
- **Free plan:** projects are **paused after about a week with no activity**. While paused, the site quietly shows the bundled content. Resume the project in the dashboard, or keep it active with occasional visits.
- **Free-plan sizes:** 500 MB database, 1 GB storage and 5 GB egress, which is plenty for a portfolio.

## 10. Backups and rollback

- **Backups:** the Free plan has no point-in-time restore. Every so often, run `npm run seed:generate` after copying dashboard edits back into `src/data`. Or export the tables as CSV from the Table Editor, or use `supabase db dump`.
- **Turn the CMS off:** delete the two `VITE_SUPABASE_*` repository variables and redeploy. The site goes back to the bundled content, and nothing else changes.
- **Undo the code change:** revert the commit or merge.
- **Remove the database objects:** drop the tables, the `is_admin` and `touch_updated_at` functions, and the `portfolio-media` bucket in the dashboard. The portfolio keeps working from the bundled content.

## Future admin dashboard (not built)

A `#/admin` route could:
- sign in with `supabase.auth.signInWithPassword`;
- read and write the same tables (the RLS `admin_write` policies already allow this for allowlisted users);
- upload to `portfolio-media`.

It needs a second client with `persistSession: true`. The public client in `src/lib/supabase.ts` deliberately keeps no session.
