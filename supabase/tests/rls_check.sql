-- Row-Level Security checks. Run in the Supabase SQL Editor AFTER the migration and seed.
-- Everything runs inside a transaction that is rolled back, so no data changes are kept.
-- Each check raises an exception on failure; "RLS checks passed" means all passed.
begin;

-- A draft project with a draft company/role and a draft skill category, created as the owner (bypasses RLS).
insert into public.projects (slug, title, role, summary, overview, challenge, my_role, approach, lessons, status)
values ('rls-draft-check', 'Draft', 'r', 's', 'o', 'c', 'm', 'a', 'l', 'draft');
insert into public.experience_companies (company_name, status) values ('RLS Draft Co', 'draft');
insert into public.experience_roles (company_id, title, start_date)
select id, 'Hidden role', '2020-01' from public.experience_companies where company_name = 'RLS Draft Co';
insert into public.skill_categories (name, status) values ('RLS Draft Skills', 'draft');
insert into public.skills (category_id, name) select id, 'Hidden skill' from public.skill_categories where name = 'RLS Draft Skills';

-- 1. Anonymous visitor
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  if exists (select 1 from public.projects where status <> 'published') then raise exception 'anon can read draft projects'; end if;
  if exists (select 1 from public.experience_roles where title = 'Hidden role') then raise exception 'anon can read roles of a draft company'; end if;
  if exists (select 1 from public.skills where name = 'Hidden skill') then raise exception 'anon can read skills of a draft category'; end if;
  -- After the grants migration, reading the allowlist is denied outright (before it, RLS returns no rows).
  begin
    if exists (select 1 from public.admins) then raise exception 'anon can read the admin allowlist'; end if;
  exception when insufficient_privilege then null; -- expected
  end;
  if not exists (select 1 from public.profile) then raise exception 'anon cannot read the public profile'; end if;
  begin
    insert into public.projects (slug, title, role, summary, overview, challenge, my_role, approach, lessons) values ('anon-write', 't', 'r', 's', 'o', 'c', 'm', 'a', 'l');
    raise exception 'anon could insert a project';
  exception when insufficient_privilege then null; -- expected: blocked by RLS
  end;
  update public.projects set title = 'hacked';
  if found then raise exception 'anon could update projects'; end if;
  delete from public.projects;
  if found then raise exception 'anon could delete projects'; end if;
end $$;
reset role;

-- 2. Signed-in user who is NOT in public.admins (random uuid, not in the allowlist)
set local role authenticated;
select set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000000001"}', true);
do $$
begin
  if public.is_admin() then raise exception 'non-admin is treated as admin'; end if;
  if exists (select 1 from public.projects where status <> 'published') then raise exception 'non-admin can read drafts'; end if;
  begin
    insert into public.admins (user_id) values ('00000000-0000-0000-0000-000000000001');
    raise exception 'non-admin could add itself to the admin allowlist';
  exception when insufficient_privilege then null;
  end;
  update public.profile set name = 'hacked';
  if found then raise exception 'non-admin could update the profile'; end if;
  delete from public.skills;
  if found then raise exception 'non-admin could delete skills'; end if;
end $$;
reset role;

-- 3. Admin (first user in the allowlist, if one has been bootstrapped)
do $$
declare
  admin_id uuid := (select user_id from public.admins limit 1);
begin
  if admin_id is null then
    raise notice 'No admin bootstrapped yet: admin checks skipped';
    return;
  end if;
  perform set_config('request.jwt.claims', json_build_object('role', 'authenticated', 'sub', admin_id)::text, true);
  execute 'set local role authenticated';
  if not public.is_admin() then raise exception 'admin is not recognised'; end if;
  if not exists (select 1 from public.projects where slug = 'rls-draft-check') then raise exception 'admin cannot read drafts'; end if;
  update public.projects set title = 'Draft (edited)' where slug = 'rls-draft-check';
  if not found then raise exception 'admin cannot update projects'; end if;
  execute 'reset role';
end $$;

-- 4. Grants and functions (after supabase/migrations/20261124000000_harden_grants.sql)
do $$
declare
  t text;
begin
  if has_table_privilege('anon', 'public.admins', 'select') or has_table_privilege('authenticated', 'public.admins', 'insert') then
    raise exception 'API roles still have privileges on public.admins';
  end if;
  foreach t in array array['projects', 'other_projects', 'experience_companies', 'experience_roles', 'skill_categories', 'skills',
                           'profile', 'education', 'languages', 'social_links', 'site_settings'] loop
    if not (select relrowsecurity from pg_class where oid = format('public.%I', t)::regclass) then raise exception 'RLS is off on %', t; end if;
    if has_table_privilege('anon', format('public.%I', t), 'insert') or has_table_privilege('anon', format('public.%I', t), 'update')
       or has_table_privilege('anon', format('public.%I', t), 'delete') then
      raise exception 'anon has write privileges on %', t;
    end if;
  end loop;
  if (select prosecdef from pg_proc where oid = 'public.is_admin()'::regprocedure) is not true then raise exception 'is_admin must be SECURITY DEFINER'; end if;
  if not exists (select 1 from pg_proc where oid = 'public.is_admin()'::regprocedure and proconfig @> array['search_path=""']) then
    raise exception 'is_admin must pin an empty search_path';
  end if;
end $$;

-- 5. Storage: only admins may upload, change or delete files in portfolio-media.
set local role anon;
select set_config('request.jwt.claims', '{"role":"anon"}', true);
do $$
begin
  begin
    insert into storage.objects (bucket_id, name) values ('portfolio-media', 'rls-check/anon.txt');
    raise exception 'anon could upload to portfolio-media';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
set local role authenticated;
select set_config('request.jwt.claims', '{"role":"authenticated","sub":"00000000-0000-0000-0000-000000000001"}', true);
do $$
begin
  begin
    insert into storage.objects (bucket_id, name, owner_id) values ('portfolio-media', 'rls-check/user.txt', '00000000-0000-0000-0000-000000000001');
    raise exception 'non-admin could upload to portfolio-media';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

-- Never report a full pass when the admin checks were skipped.
select case when exists (select 1 from public.admins)
  then 'RLS checks passed (all sections)'
  else 'RLS checks passed EXCEPT admin read/write, which was SKIPPED: no admin bootstrapped'
end as result;
rollback;
