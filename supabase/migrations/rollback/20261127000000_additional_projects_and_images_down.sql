-- Reverts 20261127000000_additional_projects_and_images.sql. Deploy code that no longer selects the new columns first,
-- otherwise the next build fails (and the live site stays as it is).
drop view if exists public.projects_public;
create view public.projects_public
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
alter table public.projects drop constraint if exists projects_image_type_valid;
alter table public.projects drop column if exists image_type;
alter table public.projects drop column if exists image_alt;
alter table public.other_projects drop constraint if exists other_projects_capability_tags_max;
alter table public.other_projects drop constraint if exists other_projects_url_label_needs_url;
alter table public.other_projects drop column if exists company;
alter table public.other_projects drop column if exists role;
alter table public.other_projects drop column if exists icon;
alter table public.other_projects drop column if exists capability_tags;
alter table public.other_projects drop column if exists url_label;
