-- Defence in depth on top of RLS. Safe to re-run.

-- The admin allowlist is only ever managed from the SQL Editor / service role. Removing the default
-- API grants means a mistaken policy later could still not expose or modify it.
revoke all on table public.admins from anon, authenticated;

-- Public visitors only ever read. Write privileges stay for `authenticated` (RLS limits them to admins)
-- so a future admin dashboard can work; anonymous clients get read-only grants.
do $$
declare
  t text;
begin
  foreach t in array array['projects', 'other_projects', 'experience_companies', 'experience_roles', 'skill_categories', 'skills',
                           'profile', 'education', 'languages', 'social_links', 'site_settings'] loop
    execute format('revoke insert, update, delete, truncate, references, trigger on table public.%I from anon', t);
    execute format('grant select on table public.%I to anon, authenticated', t);
  end loop;
end $$;

-- Homepage meta description used by the prerendered <head>; keeps the existing one if already set.
insert into public.site_settings (key, value)
values ('meta_description', 'Chanthorn Yoeun is a senior software engineer in Phnom Penh, Cambodia, with 7+ years of experience building enterprise applications with Java, Spring Boot, React, Angular, Vue.js and Laravel.')
on conflict (key) do nothing;
