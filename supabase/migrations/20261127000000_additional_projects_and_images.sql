-- Additional Professional Projects metadata (other_projects) and project image disclosure (projects).
-- All new columns are nullable or defaulted, so existing rows and older builds keep working. Safe to re-run.
-- Rollback: supabase/migrations/rollback/20261127000000_additional_projects_and_images_down.sql

-- other_projects: company, role, icon, capability tags and an optional link label.
alter table public.other_projects add column if not exists company text;
alter table public.other_projects add column if not exists role text;
alter table public.other_projects add column if not exists icon text;
alter table public.other_projects add column if not exists capability_tags text[] not null default '{}';
alter table public.other_projects add column if not exists url_label text;
alter table public.other_projects drop constraint if exists other_projects_capability_tags_max;
alter table public.other_projects add constraint other_projects_capability_tags_max check (cardinality(capability_tags) <= 3);
alter table public.other_projects drop constraint if exists other_projects_url_label_needs_url;
alter table public.other_projects add constraint other_projects_url_label_needs_url check (url_label is null or url is not null);

-- projects: what the image is, and its alt text. 'concept' images are labelled as not being real screenshots.
alter table public.projects add column if not exists image_type text not null default 'concept';
alter table public.projects drop constraint if exists projects_image_type_valid;
alter table public.projects add constraint projects_image_type_valid check (image_type in ('concept', 'screenshot'));
alter table public.projects add column if not exists image_alt text;

-- Expose the two image columns through the public projection (appended, so the existing column order is kept).
create or replace view public.projects_public
with (security_invoker = false, security_barrier = true) as
select
  slug, title, role, summary, card_summary, overview, challenge, my_role, team, approach, lessons,
  contributions, image_path, sort_order, updated_at, tech_visibility,
  case when tech_visibility = 'general' then capability_tags else '{}'::text[] end as capability_tags,
  case when tech_visibility = 'full' then featured_technologies else '{}'::text[] end as featured_technologies,
  case when tech_visibility = 'full' then technologies else '{}'::text[] end as technologies,
  image_type, image_alt
from public.projects
where status = 'published';

revoke all on public.projects_public from public;
grant select on public.projects_public to anon, authenticated;
