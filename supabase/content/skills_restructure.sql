-- Professional Skills & Tools: eight categories, primary/supporting levels and the AI-assisted subgroup.
-- Content only, no schema change. Run in the Supabase SQL Editor, then run the deploy workflow.
-- Idempotent: categories and skills are renamed in place where possible (ids kept), then upserted by name;
-- skills that are no longer approved are deleted from these categories, and any other category is set to draft.
begin;

-- 1. Rename categories in place (skipped once the new name exists).
update public.skill_categories o set name = r.new_name
from (values
  ('Backend Engineering', 'Backend Development'),
  ('Frontend Engineering', 'Frontend Development'),
  ('Development Tools', 'Development & Testing Tools'),
  ('Leadership', 'Leadership & Business Analysis')
) as r(old_name, new_name)
where o.name = r.old_name and not exists (select 1 from public.skill_categories n where n.name = r.new_name);

-- 2. Approved categories and their order.
create temp table approved_categories (name text primary key, sort_order int) on commit drop;
insert into approved_categories values
  ('Backend Development', 0),
  ('Frontend Development', 1),
  ('Databases & Caching', 2),
  ('Cloud & DevOps', 3),
  ('Software Engineering', 4),
  ('Development & Testing Tools', 5),
  ('Project Management & Delivery', 6),
  ('Leadership & Business Analysis', 7);

insert into public.skill_categories (name, status, sort_order)
select name, 'published', sort_order from approved_categories
on conflict (name) do update set status = 'published', sort_order = excluded.sort_order;

-- Categories outside the approved list are hidden, not deleted.
update public.skill_categories set status = 'draft' where name not in (select name from approved_categories);

-- 3. Rename skills in place where one entry replaces another (skipped once the new name exists).
update public.skills s set name = r.new_name
from (values
  ('Frontend Development', 'TypeScript', 'TypeScript/JavaScript'),
  ('Frontend Development', 'React', 'React/Next.js'),
  ('Frontend Development', 'Vue.js', 'Vue.js/Nuxt.js'),
  ('Cloud & DevOps', 'AWS EC2', 'AWS'),
  ('Software Engineering', 'Database Transactions', 'Transaction Management'),
  ('Software Engineering', 'API Performance', 'Performance Optimization')
) as r(category, old_name, new_name)
join public.skill_categories c on c.name = r.category
where s.category_id = c.id and s.name = r.old_name
  and not exists (select 1 from public.skills x where x.category_id = c.id and x.name = r.new_name);

-- 4. Approved skills: (category, name, level, subgroup, sort_order).
create temp table approved_skills (category text, name text, level text, subgroup text, sort_order int) on commit drop;
insert into approved_skills values
  ('Backend Development', 'Java', 'primary', null, 0),
  ('Backend Development', 'Spring Boot', 'primary', null, 1),
  ('Backend Development', 'Node.js', 'primary', null, 2),
  ('Backend Development', 'Laravel', 'primary', null, 3),
  ('Backend Development', 'Go', 'primary', null, 4),
  ('Backend Development', 'Grails', 'supporting', null, 5),
  ('Backend Development', 'NestJS', 'supporting', null, 6),
  ('Backend Development', 'Gin', 'supporting', null, 7),
  ('Backend Development', 'REST APIs', 'supporting', null, 8),
  ('Backend Development', 'WebSocket', 'supporting', null, 9),
  ('Frontend Development', 'TypeScript/JavaScript', 'primary', null, 0),
  ('Frontend Development', 'React/Next.js', 'primary', null, 1),
  ('Frontend Development', 'Vue.js/Nuxt.js', 'primary', null, 2),
  ('Frontend Development', 'Angular', 'primary', null, 3),
  ('Frontend Development', 'Tailwind CSS', 'supporting', null, 4),
  ('Frontend Development', 'Material UI', 'supporting', null, 5),
  ('Frontend Development', 'Vuetify', 'supporting', null, 6),
  ('Databases & Caching', 'MySQL', 'primary', null, 0),
  ('Databases & Caching', 'PostgreSQL', 'primary', null, 1),
  ('Databases & Caching', 'MongoDB', 'primary', null, 2),
  ('Databases & Caching', 'Redis', 'primary', null, 3),
  ('Databases & Caching', 'MariaDB', 'supporting', null, 4),
  ('Databases & Caching', 'SQL Server', 'supporting', null, 5),
  ('Databases & Caching', 'SQLite', 'supporting', null, 6),
  ('Cloud & DevOps', 'Linux', 'primary', null, 0),
  ('Cloud & DevOps', 'Docker', 'primary', null, 1),
  ('Cloud & DevOps', 'Nginx', 'primary', null, 2),
  ('Cloud & DevOps', 'CI/CD', 'primary', null, 3),
  ('Cloud & DevOps', 'GitHub Actions', 'supporting', null, 4),
  ('Cloud & DevOps', 'AWS', 'supporting', null, 5),
  ('Cloud & DevOps', 'DigitalOcean', 'supporting', null, 6),
  ('Cloud & DevOps', 'Supabase', 'supporting', null, 7),
  ('Software Engineering', 'System Design', 'primary', null, 0),
  ('Software Engineering', 'Microservices', 'primary', null, 1),
  ('Software Engineering', 'Design Patterns', 'primary', null, 2),
  ('Software Engineering', 'SOLID', 'primary', null, 3),
  ('Software Engineering', 'Concurrency Control', 'supporting', null, 4),
  ('Software Engineering', 'Transaction Management', 'supporting', null, 5),
  ('Software Engineering', 'RabbitMQ', 'supporting', null, 6),
  ('Software Engineering', 'Performance Optimization', 'supporting', null, 7),
  ('Development & Testing Tools', 'Git', 'primary', null, 0),
  ('Development & Testing Tools', 'GitHub', 'primary', null, 1),
  ('Development & Testing Tools', 'GitLab', 'primary', null, 2),
  ('Development & Testing Tools', 'Postman', 'primary', null, 3),
  ('Development & Testing Tools', 'Bitbucket', 'supporting', null, 4),
  ('Development & Testing Tools', 'Swagger/OpenAPI', 'supporting', null, 5),
  ('Development & Testing Tools', 'Apache JMeter', 'supporting', null, 6),
  ('Development & Testing Tools', 'ChatGPT', 'supporting', 'AI-Assisted Development', 7),
  ('Development & Testing Tools', 'OpenAI Codex', 'supporting', 'AI-Assisted Development', 8),
  ('Development & Testing Tools', 'Claude Code', 'supporting', 'AI-Assisted Development', 9),
  ('Development & Testing Tools', 'GitHub Copilot', 'supporting', 'AI-Assisted Development', 10),
  ('Project Management & Delivery', 'Jira', 'primary', null, 0),
  ('Project Management & Delivery', 'ClickUp', 'primary', null, 1),
  ('Project Management & Delivery', 'Trello', 'primary', null, 2),
  ('Project Management & Delivery', 'Redmine', 'primary', null, 3),
  ('Project Management & Delivery', 'Notion', 'primary', null, 4),
  ('Project Management & Delivery', 'Agile', 'supporting', null, 5),
  ('Project Management & Delivery', 'Scrum', 'supporting', null, 6),
  ('Project Management & Delivery', 'Sprint Planning', 'supporting', null, 7),
  ('Project Management & Delivery', 'Backlog Management', 'supporting', null, 8),
  ('Project Management & Delivery', 'Task Prioritization', 'supporting', null, 9),
  ('Leadership & Business Analysis', 'Technical Leadership', 'primary', null, 0),
  ('Leadership & Business Analysis', 'Business Analysis', 'primary', null, 1),
  ('Leadership & Business Analysis', 'Team Management', 'supporting', null, 2),
  ('Leadership & Business Analysis', 'Mentoring', 'supporting', null, 3),
  ('Leadership & Business Analysis', 'Code Review', 'supporting', null, 4),
  ('Leadership & Business Analysis', 'Requirements Gathering', 'supporting', null, 5),
  ('Leadership & Business Analysis', 'Client Communication', 'supporting', null, 6);

insert into public.skills (category_id, name, level, subgroup, sort_order)
select c.id, a.name, a.level, a.subgroup, a.sort_order
from approved_skills a join public.skill_categories c on c.name = a.category
on conflict (category_id, name) do update set level = excluded.level, subgroup = excluded.subgroup, sort_order = excluded.sort_order;

-- 5. Remove skills that are no longer approved from the approved categories.
delete from public.skills s
using public.skill_categories c
where s.category_id = c.id and c.name in (select name from approved_categories)
  and not exists (select 1 from approved_skills a where a.category = c.name and a.name = s.name);

-- Check: 8 published categories and 68 skills.
select (select count(*) from public.skill_categories where status = 'published') as published_categories,
       (select count(*) from public.skills s join public.skill_categories c on c.id = s.category_id where c.status = 'published') as published_skills;
commit;
