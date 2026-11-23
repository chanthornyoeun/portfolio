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
  if exists (select 1 from public.admins) then raise exception 'anon can read the admin allowlist'; end if;
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

select 'RLS checks passed' as result;
rollback;
