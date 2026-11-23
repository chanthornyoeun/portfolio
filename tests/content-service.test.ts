import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fetchRows, mapContent, validateContent } from '../src/services/content.ts';
import type { Content, Rows } from '../src/services/content.ts';
import { mediaUrl, supabaseConfig } from '../src/lib/supabase.ts';

const env = { VITE_SUPABASE_URL: 'https://demo.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x' };
const backup = (): Content => JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8'));

const project = (slug: string, sort_order: number) => ({
  slug, title: slug.toUpperCase(), role: 'Dev', summary: 's', overview: 'o', challenge: 'c', my_role: 'm', team: null, approach: 'a',
  lessons: 'l', featured_technologies: ['A'], technologies: ['A'], contributions: ['x'], image_path: 'shots/x.webp', sort_order,
  updated_at: '2026-11-20T10:00:00Z',
});

const rows = (): Rows => ({
  projects: [project('b', 2), project('a', 1)],
  otherProjects: [],
  companies: [
    {
      company_name: 'Acme',
      sort_order: 0,
      experience_roles: [
        { title: 'Old', start_date: '2020-01', end_date: '2020-06', project_name: null, highlights: ['x'], sort_order: 1 },
        { title: 'New', start_date: '2021-01', end_date: null, project_name: null, highlights: null, sort_order: 0 },
      ],
    },
  ],
  skillCategories: [
    {
      name: 'Tools',
      sort_order: 0,
      skills: [
        { name: 'Git', level: 'supporting', subgroup: null, sort_order: 1 },
        { name: 'Copilot', level: 'supporting', subgroup: 'AI-assisted', sort_order: 2 },
        { name: 'Java', level: 'primary', subgroup: null, sort_order: 0 },
      ],
    },
  ],
  profile: { name: 'N', title: 'T', location: 'L', headline: 'H', introduction: 'I', about: null, email: null, resume_path: null, avatar_path: 'me.webp' },
  education: [{ institution: 'U', program: 'CS', start_year: 2016, end_year: 2020, sort_order: 0 }],
  languages: [],
  socialLinks: [{ platform: 'github', url: 'https://github.com/x', sort_order: 0 }],
  settings: [{ key: 'site_title', value: 'Site' }],
});

test('maps rows in sort order with media URLs and timestamps', () => {
  const c = mapContent(rows(), env);
  assert.deepEqual(c.projects.map((p) => p.slug), ['a', 'b']);
  assert.equal(c.projects[0].image, 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/shots/x.webp');
  assert.equal(c.projects[0].updatedAt, '2026-11-20T10:00:00Z');
  assert.equal(c.siteTitle, 'Site');
  assert.equal(c.description, 'I'); // falls back to the introduction
  assert.deepEqual(c.experience[0].roles.map((r) => r.title), ['New', 'Old']);
  assert.equal(c.profile.education.period, '2016–2020');
});

test('splits skills into primary, supporting and a labelled subgroup', () => {
  const [tools] = mapContent(rows(), env).skills;
  assert.deepEqual([tools.primary, tools.supporting, tools.subgroup], [['Java'], ['Git'], { label: 'AI-assisted', items: ['Copilot'] }]);
});

test('a missing profile row is an error', () => {
  assert.throws(() => mapContent({ ...rows(), profile: null }, env), /profile/);
});

test('valid content passes; empty optional lists are allowed', () => {
  const c = mapContent(rows(), env);
  assert.deepEqual(validateContent(c), []);
  assert.deepEqual(validateContent({ ...c, otherProjects: [], skills: [] }), []);
});

test('validation catches incomplete or invalid required content', () => {
  const c = backup();
  const broken: Content = {
    ...c,
    profile: { ...c.profile, headline: ' ' },
    projects: [
      { ...c.projects[0], slug: 'Bad Slug' },
      { ...c.projects[1], featuredTech: ['A', 'B', 'C', 'D', 'E', 'F'] },
      { ...c.projects[2], slug: c.projects[3].slug, contributions: [] },
      c.projects[3],
    ],
    experience: [{ company: 'X', roles: [{ title: 'Dev', startDate: '2024-13' as never, endDate: '2023-01', highlights: [] }] }],
  };
  const errors = validateContent(broken).join('\n');
  for (const expected of ['profile.headline is empty', 'invalid slug', '1–5 featured technologies', 'duplicate slug', 'no contributions', 'start date must be YYYY-MM']) {
    assert.ok(errors.includes(expected), expected);
  }
  const empty = validateContent({ ...c, projects: [], experience: [] }).join('\n');
  assert.ok(empty.includes('no published projects') && empty.includes('no published companies'));
});

test('fetchRows sends the public key, keeps published filters, and fails on any HTTP error', async () => {
  const seen: string[] = [];
  const ok = (async (url: string, init: RequestInit) => {
    seen.push(url);
    assert.equal((init.headers as Record<string, string>).apikey, 'sb_publishable_x');
    return new Response(url.includes('/profile?') ? '[{"name":"N"}]' : '[]', { status: 200 });
  }) as unknown as typeof fetch;
  const r = await fetchRows(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_PUBLISHABLE_KEY, ok);
  assert.equal(seen.length, 9);
  for (const t of ['projects', 'other_projects', 'experience_companies', 'skill_categories']) {
    assert.ok(seen.some((u) => u.includes(`/${t}?`) && u.includes('status=eq.published')), t);
  }
  assert.deepEqual(r.profile, { name: 'N' });

  const failing = (async (url: string) => (url.includes('skills') ? new Response('boom', { status: 500 }) : new Response('[]', { status: 200 }))) as unknown as typeof fetch;
  await assert.rejects(fetchRows(env.VITE_SUPABASE_URL, 'k', failing), /HTTP 500/);
});

test('config refuses missing values, non-https URLs and secret keys', () => {
  assert.ok(supabaseConfig(env));
  assert.equal(supabaseConfig({}), null);
  assert.equal(supabaseConfig({ ...env, VITE_SUPABASE_URL: 'http://demo.supabase.co' }), null);
  assert.equal(supabaseConfig({ ...env, VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_abc' }), null);
  assert.equal(mediaUrl('https://cdn.example.com/a.png', env), 'https://cdn.example.com/a.png');
  assert.equal(mediaUrl('a.png', {}), '');
});
