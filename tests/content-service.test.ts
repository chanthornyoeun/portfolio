import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchContent, mapContent, staticContent } from '../src/services/content.ts';
import type { Rows } from '../src/services/content.ts';
import { mediaUrl, supabaseConfig } from '../src/lib/supabase.ts';

const env = { VITE_SUPABASE_URL: 'https://demo.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x' };

const project = (slug: string, sort_order: number) => ({
  slug, title: slug.toUpperCase(), role: 'Dev', summary: 's', overview: 'o', challenge: 'c', my_role: 'm', team: null, approach: 'a',
  lessons: 'l', featured_technologies: ['A', 'B', 'C', 'D', 'E', 'F'], technologies: ['A'], contributions: null, image_path: 'shots/x.webp', sort_order,
});

const rows = (): Rows => ({
  projects: [project('b', 2), project('a', 1)],
  otherProjects: [],
  companies: [
    {
      company_name: 'Acme', sort_order: 0,
      experience_roles: [
        { title: 'Old', start_date: '2020-01', end_date: '2020-06', project_name: null, highlights: ['x'], sort_order: 1 },
        { title: 'New', start_date: '2021-01', end_date: null, project_name: null, highlights: null, sort_order: 0 },
        { title: 'Broken', start_date: 'soon', end_date: null, project_name: null, highlights: [], sort_order: 2 },
      ],
    },
    { company_name: 'Empty', sort_order: 1, experience_roles: [] },
  ],
  skillCategories: [
    { name: 'Tools', sort_order: 0, skills: [{ name: 'Git', level: 'supporting', subgroup: null, sort_order: 1 }, { name: 'Copilot', level: 'supporting', subgroup: 'AI-assisted', sort_order: 2 }, { name: 'Java', level: 'primary', subgroup: null, sort_order: 0 }] },
  ],
  profile: { name: 'N', title: 'T', location: 'L', headline: 'H', introduction: 'I', about: null, email: null, resume_path: null, avatar_path: 'me.webp' },
  education: [{ institution: 'U', program: 'CS', start_year: 2016, end_year: 2020, sort_order: 0 }],
  languages: [],
  socialLinks: [{ platform: 'github', url: 'https://github.com/x', sort_order: 0 }],
  settings: [{ key: 'site_title', value: 'Site' }],
});

test('maps rows in sort order and caps featured technologies at five', () => {
  const c = mapContent(rows(), env);
  assert.equal(c.source, 'supabase');
  assert.deepEqual(c.projects.map((p) => p.slug), ['a', 'b']);
  assert.equal(c.projects[0].featuredTech.length, 5);
  assert.deepEqual(c.projects[0].contributions, []);
  assert.equal(c.projects[0].image, 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/shots/x.webp');
  assert.equal(c.siteTitle, 'Site');
});

test('nests roles newest first, drops malformed dates and empty companies', () => {
  const c = mapContent(rows(), env);
  assert.deepEqual(c.experience.map((g) => g.company), ['Acme']);
  assert.deepEqual(c.experience[0].roles.map((r) => r.title), ['New', 'Old']);
  assert.equal(c.experience[0].roles[0].endDate, null);
});

test('splits skills into primary, supporting and a labelled subgroup', () => {
  const [tools] = mapContent(rows(), env).skills;
  assert.deepEqual(tools.primary, ['Java']);
  assert.deepEqual(tools.supporting, ['Git']);
  assert.deepEqual(tools.subgroup, { label: 'AI-assisted', items: ['Copilot'] });
});

test('maps profile, education and links; missing values become empty', () => {
  const { profile } = mapContent(rows(), env);
  assert.equal(profile.education.period, '2016–2020');
  assert.equal(profile.github, 'https://github.com/x');
  assert.equal(profile.linkedin, '');
  assert.equal(profile.resumeUrl, '');
  assert.equal(profile.portrait, 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/me.webp');
});

test('a missing profile row is an error, so the caller keeps the fallback', () => {
  assert.throws(() => mapContent({ ...rows(), profile: null }, env), /profile/);
});

// Minimal stand-in for the Supabase query builder: every chain resolves to the given result.
function fakeDb(result: (table: string) => { data: unknown; error: { message: string } | null }) {
  return {
    from(table: string) {
      const r = result(table);
      const chain = { select: () => chain, eq: () => chain, maybeSingle: () => Promise.resolve(r), then: (f: (v: unknown) => unknown, g?: (e: unknown) => unknown) => Promise.resolve(r).then(f, g) };
      return chain;
    },
  } as never;
}

test('fetchContent rejects on any API error', async () => {
  await assert.rejects(fetchContent(fakeDb((t) => ({ data: [], error: t === 'skills' || t === 'skill_categories' ? { message: 'boom' } : null }))), /boom/);
});

test('fetchContent maps a successful response', async () => {
  const r = rows();
  const byTable: Record<string, unknown> = {
    projects: r.projects, other_projects: [], experience_companies: r.companies, skill_categories: r.skillCategories,
    profile: r.profile, education: r.education, languages: [], social_links: r.socialLinks, site_settings: r.settings,
  };
  const c = await fetchContent(fakeDb((t) => ({ data: byTable[t], error: null })));
  assert.deepEqual(c.projects.map((p) => p.slug), ['a', 'b']);
});

test('config refuses missing values, non-https URLs and secret keys', () => {
  assert.ok(supabaseConfig(env));
  assert.equal(supabaseConfig({}), null);
  assert.equal(supabaseConfig({ ...env, VITE_SUPABASE_URL: 'http://demo.supabase.co' }), null);
  assert.equal(supabaseConfig({ ...env, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_abc' }), null);
  assert.equal(mediaUrl('https://cdn.example.com/a.png', env), 'https://cdn.example.com/a.png');
  assert.equal(mediaUrl('a.png', {}), '');
});

test('the bundled fallback is marked static and matches the repo data', () => {
  assert.equal(staticContent.source, 'static');
  assert.equal(staticContent.projects.length, 4);
});
