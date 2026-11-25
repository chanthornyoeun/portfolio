-- Additional Professional Projects (other_projects) and Selected Work card summaries.
-- Run AFTER supabase/migrations/20261127000000_additional_projects_and_images.sql, in the Supabase SQL Editor,
-- then run the deploy workflow. One transaction; safe to re-run (rows are matched by title / slug, never duplicated).
begin;

-- 1. Rename existing rows in place so their ids are kept (skipped once the new title exists).
update public.other_projects o set title = r.new_title
from (values
  ('Insurance Reporting / IAC', 'Insurance Reporting System (IAC)'),
  ('E-commerce Frontend', 'E-Commerce Platform'),
  ('Real Estate, CMS, and POS Systems', 'Real Estate Management System')
) as r(old_title, new_title)
where o.title = r.old_title and not exists (select 1 from public.other_projects n where n.title = r.new_title);

-- 2. Approved projects: insert or update by title (title is unique).
insert into public.other_projects (title, description, company, role, icon, capability_tags, url, url_label, sort_order, status)
select title, description, company, role, icon, capability_tags, url, url_label, sort_order, 'published'
from (values
  ('Vessel Monitoring System', 'Led frontend development and team coordination for a vessel monitoring application.', 'Ecoinsoft', 'Frontend Team Lead', 'Ship', array['Frontend Leadership', 'Enterprise Applications']::text[], 'https://vms.fia.maff.gov.kh/', 'Visit Website', 0),
  ('Insurance Reporting System (IAC)', 'Led frontend development for insurance reporting and coordinated requirements with development teams.', 'Ecoinsoft', 'Frontend Team Lead', 'ChartNoAxesCombined', array['Reporting', 'Technical Leadership']::text[], 'https://www.iac.org.kh/', 'Organization Website', 1),
  ('E-Commerce Platform', 'Developed e-commerce interfaces, reusable UI components, and API integrations.', 'Aibodia', 'Senior Frontend Developer', 'ShoppingCart', array['Frontend Engineering', 'API Integration']::text[], null, null, 2),
  ('Real Estate Management System', 'Contributed to backend APIs and frontend interfaces for real estate applications.', 'Ecoinsoft', 'Software Developer', 'Building2', array['Backend Engineering', 'Frontend Development']::text[], null, null, 3),
  ('Content Management System', 'Developed backend APIs for content management and back-office applications.', 'Ecoinsoft', 'Backend Developer', 'FileText', array['Backend Engineering', 'API Development']::text[], null, null, 4),
  ('Point of Sale System', 'Contributed to backend APIs and frontend interfaces for point-of-sale applications.', 'Ecoinsoft', 'Software Developer', 'Receipt', array['Business Applications', 'API Development']::text[], null, null, 5)
) as v(title, description, company, role, icon, capability_tags, url, url_label, sort_order)
on conflict (title) do update set
  description = excluded.description, company = excluded.company, role = excluded.role, icon = excluded.icon,
  capability_tags = excluded.capability_tags, url = excluded.url, url_label = excluded.url_label,
  sort_order = excluded.sort_order, status = 'published';

-- 3. Anything else (e.g. the old grouped entry, if it was renamed by hand) is hidden, not deleted.
update public.other_projects set status = 'draft'
where title not in ('Vessel Monitoring System', 'Insurance Reporting System (IAC)', 'E-Commerce Platform', 'Real Estate Management System', 'Content Management System', 'Point of Sale System');

-- 4. Shorter homepage card summaries for Selected Work (the full summary stays on the case study).
update public.projects p set card_summary = v.card_summary
from (values
  ('petroleum-distribution', 'Enterprise petroleum distribution platform. I led frontend development, client requirements and UI/UX prototyping, working alongside a separate backend team.'),
  ('general-core-insurance', 'Enterprise general insurance platform where I led the frontend team, built core insurance workflows and coordinated requirements with backend teams and clients.'),
  ('real-time-auction', 'Real-time auction and e-commerce platform. As project lead, I built live bidding, concurrent transaction handling and shopping workflows across backend and frontend.'),
  ('enterprise-crm', 'CRM platform for customer management, sales leads and reporting. Backend and frontend development, including a production N+1 query fix and large-volume data exports.')
) as v(slug, card_summary)
where p.slug = v.slug;

-- Check: 6 published additional projects and 4 card summaries.
select (select count(*) from public.other_projects where status = 'published') as additional_projects,
       (select count(*) from public.projects where card_summary is not null and status = 'published') as card_summaries;
commit;
