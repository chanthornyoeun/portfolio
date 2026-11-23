-- Portfolio CMS: content tables, admin allowlist, Row-Level Security and media storage.
-- Run once in the Supabase SQL Editor (or `supabase db push`). Safe to re-run: every object uses IF NOT EXISTS / OR REPLACE.

-- ---------------------------------------------------------------------------
-- Admin allowlist
-- ---------------------------------------------------------------------------
-- RLS is on and there are no policies, so no API client (anon or signed in) can read or write it.
-- Rows are added only from the SQL Editor / service role, so admin rights cannot be self-assigned.
create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- SECURITY DEFINER so policies can check the allowlist without exposing it. Pinned search_path.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content tables
-- Lists that are only ever edited with their parent (technologies, contributions, highlights, about
-- paragraphs) are text[] columns: they can't leak separately from a draft parent and are easy to edit
-- in the Table Editor.
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  role text not null,
  summary text not null,
  overview text not null,
  challenge text not null,
  my_role text not null,
  team text,
  approach text not null,
  lessons text not null,
  featured_technologies text[] not null default '{}' check (cardinality(featured_technologies) <= 5),
  technologies text[] not null default '{}',
  contributions text[] not null default '{}',
  image_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.other_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null,
  url text check (url is null or url ~ '^https://'),
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0
);

create table if not exists public.experience_companies (
  id uuid primary key default gen_random_uuid(),
  company_name text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0
);

create table if not exists public.experience_roles (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.experience_companies (id) on delete cascade,
  title text not null,
  start_date text not null check (start_date ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  end_date text check (end_date is null or end_date ~ '^\d{4}-(0[1-9]|1[0-2])$'), -- null = current role
  project_name text,
  highlights text[] not null default '{}',
  sort_order int not null default 0,
  unique (company_id, title, start_date)
);

create table if not exists public.skill_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0
);

-- `level` is a display grouping only, not a proficiency rating.
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.skill_categories (id) on delete cascade,
  name text not null,
  level text not null default 'supporting' check (level in ('primary', 'supporting')),
  subgroup text,
  sort_order int not null default 0,
  unique (category_id, name)
);

-- Single row (id is always true).
create table if not exists public.profile (
  id boolean primary key default true check (id),
  name text not null,
  title text not null,
  location text not null,
  headline text not null,
  introduction text not null,
  about text[] not null default '{}',
  email text,
  resume_path text,
  avatar_path text,
  updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  program text not null,
  start_year int,
  end_year int,
  sort_order int not null default 0,
  unique (institution, program)
);

create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  proficiency text not null,
  sort_order int not null default 0
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null unique,
  url text not null check (url ~ '^https://'),
  sort_order int not null default 0
);

create table if not exists public.site_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

create index if not exists experience_roles_company_idx on public.experience_roles (company_id, sort_order);
create index if not exists skills_category_idx on public.skills (category_id, sort_order);
create index if not exists projects_status_order_idx on public.projects (status, sort_order);

-- Stamp published_at the first time a project is published.
create or replace function public.stamp_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at = now();
  end if;
  return new;
end;
$$;
drop trigger if exists projects_published on public.projects;
create trigger projects_published before insert or update on public.projects for each row execute function public.stamp_published_at();

drop trigger if exists projects_touch on public.projects;
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();
drop trigger if exists profile_touch on public.profile;
create trigger profile_touch before update on public.profile for each row execute function public.touch_updated_at();
drop trigger if exists site_settings_touch on public.site_settings;
create trigger site_settings_touch before update on public.site_settings for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- Everyone: read published rows (children only when the parent is published). Admins: read and write all.
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array['projects', 'other_projects', 'experience_companies', 'experience_roles', 'skill_categories', 'skills',
                           'profile', 'education', 'languages', 'social_links', 'site_settings'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists admin_write on public.%I', t);
    execute format('create policy admin_write on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format('drop policy if exists public_read on public.%I', t);
  end loop;
end $$;

create policy public_read on public.projects for select to anon, authenticated using (status = 'published');
create policy public_read on public.other_projects for select to anon, authenticated using (status = 'published');
create policy public_read on public.experience_companies for select to anon, authenticated using (status = 'published');
create policy public_read on public.experience_roles for select to anon, authenticated using (
  exists (select 1 from public.experience_companies c where c.id = company_id and c.status = 'published')
);
create policy public_read on public.skill_categories for select to anon, authenticated using (status = 'published');
create policy public_read on public.skills for select to anon, authenticated using (
  exists (select 1 from public.skill_categories c where c.id = category_id and c.status = 'published')
);
-- Always-public profile data (no draft state).
create policy public_read on public.profile for select to anon, authenticated using (true);
create policy public_read on public.education for select to anon, authenticated using (true);
create policy public_read on public.languages for select to anon, authenticated using (true);
create policy public_read on public.social_links for select to anon, authenticated using (true);
create policy public_read on public.site_settings for select to anon, authenticated using (true);

-- ---------------------------------------------------------------------------
-- Media storage: public read by URL, admin-only writes, images and PDFs up to 5 MB.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 5242880, array['image/webp', 'image/png', 'image/jpeg', 'image/avif', 'application/pdf'])
on conflict (id) do update
  set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists portfolio_media_admin_insert on storage.objects;
create policy portfolio_media_admin_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'portfolio-media' and (select public.is_admin()));
drop policy if exists portfolio_media_admin_update on storage.objects;
create policy portfolio_media_admin_update on storage.objects for update to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_admin()));
drop policy if exists portfolio_media_admin_delete on storage.objects;
create policy portfolio_media_admin_delete on storage.objects for delete to authenticated
  using (bucket_id = 'portfolio-media' and (select public.is_admin()));
