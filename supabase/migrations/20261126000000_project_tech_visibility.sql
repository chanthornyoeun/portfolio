-- Per-project technology disclosure.
--   tech_visibility = 'full'    -> approved technologies are public
--                     'general' -> only capability_tags are public (default: secure for private client work)
--                     'hidden'  -> no technology or capability information is public
-- Public readers (the build uses the publishable key) read public.projects_public, a projection that never
-- returns technologies unless the project is 'full'. They can no longer read public.projects directly.
-- Safe to re-run. Rollback: supabase/migrations/rollback/20261126000000_project_tech_visibility_down.sql

alter table public.projects add column if not exists tech_visibility text not null default 'general';
alter table public.projects drop constraint if exists projects_tech_visibility_valid;
alter table public.projects add constraint projects_tech_visibility_valid check (tech_visibility in ('full', 'general', 'hidden'));

alter table public.projects add column if not exists capability_tags text[] not null default '{}';
alter table public.projects drop constraint if exists projects_capability_tags_max;
alter table public.projects add constraint projects_capability_tags_max check (cardinality(capability_tags) <= 5);

-- Existing rows get the secure default ('general') from the column default. Nothing is switched to 'full' here:
-- set it per project in the Table Editor only after confirming the client allows it.

-- Public projection. It runs with the view owner's rights (security_invoker = false), so it does its own
-- filtering: published rows only, and technology columns emptied unless the project is approved for 'full'.
create or replace view public.projects_public
with (security_invoker = false, security_barrier = true) as
select
  slug, title, role, summary, card_summary, overview, challenge, my_role, team, approach, lessons,
  contributions, image_path, sort_order, updated_at, tech_visibility,
  case when tech_visibility = 'general' then capability_tags else '{}'::text[] end as capability_tags,
  case when tech_visibility = 'full' then featured_technologies else '{}'::text[] end as featured_technologies,
  case when tech_visibility = 'full' then technologies else '{}'::text[] end as technologies
from public.projects
where status = 'published';

revoke all on public.projects_public from public;
grant select on public.projects_public to anon, authenticated;

-- Anonymous clients can no longer read the base table (and with it the restricted technology columns).
-- Admins keep full access through `authenticated` + the admin_write policy.
revoke select on public.projects from anon;
