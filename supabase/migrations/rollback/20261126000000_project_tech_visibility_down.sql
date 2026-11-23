-- Reverts 20261126000000_project_tech_visibility.sql. Deploy code that reads public.projects first,
-- otherwise the next build fails (and the live site stays as it is).
drop view if exists public.projects_public;
grant select on public.projects to anon;
alter table public.projects drop constraint if exists projects_capability_tags_max;
alter table public.projects drop constraint if exists projects_tech_visibility_valid;
alter table public.projects drop column if exists capability_tags;
alter table public.projects drop column if exists tech_visibility;
