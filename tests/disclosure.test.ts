import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { publicTags } from '../src/data/projects.ts';
import type { Project } from '../src/data/projects.ts';
import { applyDisclosure, mapContent, validateContent } from '../src/services/content.ts';
import type { Content, Rows } from '../src/services/content.ts';
import { headTags, projectMeta } from '../src/seo.ts';

const SITE = 'https://chanthornyoeun.github.io/portfolio/';
const backup = (): Content => JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8'));
const withVisibility = (c: Content, v: string): Content => ({ ...c, projects: c.projects.map((p) => ({ ...p, techVisibility: v as Project['techVisibility'] })) });
// Exact technologies that appear nowhere else in public output (not in Skills): if these leak, the projection failed.
const restricted = ['RabbitMQ', 'OneSignal', 'MyBatis', 'WebSocket', 'Spring Data JPA', 'Laravel (backend team)'];

test('general: only capability tags remain; exact technologies are stripped from the snapshot', () => {
  const c = applyDisclosure(withVisibility(backup(), 'general'));
  for (const p of c.projects) {
    assert.deepEqual([p.tech, p.featuredTech], [[], []], p.slug);
    assert.ok(p.capabilityTags.length >= 1 && p.capabilityTags.length <= 5, p.slug);
    assert.deepEqual(publicTags(p, 'card'), p.capabilityTags);
  }
  const json = JSON.stringify(c.projects.map(({ slug, techVisibility, capabilityTags, featuredTech, tech }) => ({ slug, techVisibility, capabilityTags, featuredTech, tech })));
  for (const t of restricted) assert.ok(!json.includes(t), t);
  assert.deepEqual(validateContent(c), []);
});

test('hidden: no technologies and no capability tags anywhere', () => {
  const c = applyDisclosure(withVisibility(backup(), 'hidden'));
  for (const p of c.projects) {
    assert.deepEqual([p.tech, p.featuredTech, p.capabilityTags], [[], [], []]);
    assert.deepEqual(publicTags(p, 'card'), []);
    assert.deepEqual(publicTags(p, 'detail'), []);
  }
  assert.deepEqual(validateContent(c), []);
});

test('full: approved technologies are shown, capped at five on cards', () => {
  const c = applyDisclosure(withVisibility(backup(), 'full'));
  const auction = c.projects.find((p) => p.slug === 'real-time-auction')!;
  assert.ok(auction.tech.includes('RabbitMQ'));
  assert.equal(publicTags(auction, 'card').length, 5);
  assert.deepEqual(publicTags(auction, 'detail'), auction.tech);
  assert.deepEqual(auction.capabilityTags, []);
  assert.deepEqual(validateContent(c), []);
});

test('missing visibility (legacy rows) defaults to general, never to full', () => {
  const legacy = backup();
  for (const p of legacy.projects) delete (p as Partial<Project>).techVisibility;
  const c = applyDisclosure(legacy);
  for (const p of c.projects) assert.deepEqual([p.techVisibility, p.tech.length], ['general', 0]);
});

test('invalid visibility or leaked technologies fail validation', () => {
  const c = applyDisclosure(backup());
  const bad = { ...c, projects: [{ ...c.projects[0], techVisibility: 'public' as never }, ...c.projects.slice(1)] };
  assert.ok(validateContent(bad).some((e) => e.includes('tech_visibility must be full, general or hidden')));
  // A projection bug that let technologies through must stop the build, not publish them.
  const leaked = { ...c, projects: [{ ...c.projects[0], tech: ['Laravel'] }, ...c.projects.slice(1)] };
  assert.ok(validateContent(leaked).some((e) => e.includes('restricted technologies present')));
  const tooMany = { ...c, projects: [{ ...c.projects[0], capabilityTags: ['a', 'b', 'c', 'd', 'e', 'f'] }, ...c.projects.slice(1)] };
  assert.ok(validateContent(tooMany).some((e) => e.includes('at most 5 capability tags')));
});

test('database rows: the mapper applies the projection even if a row carries technologies', () => {
  const row = {
    slug: 'p', title: 'P', role: 'r', summary: 's', overview: 'o', challenge: 'c', my_role: 'm', team: null, approach: 'a', lessons: 'l',
    contributions: ['x'], image_path: null, sort_order: 0, tech_visibility: 'general', capability_tags: ['API Integration'],
    featured_technologies: ['Secret DB'], technologies: ['Secret DB'],
  };
  const rows = { projects: [row], otherProjects: [], companies: [], skillCategories: [], education: [], languages: [], socialLinks: [], settings: [],
    profile: { name: 'N', title: 'T', location: 'L', headline: 'H', introduction: 'I', about: null, email: null, resume_path: null, avatar_path: null } } as Rows;
  const [p] = mapContent(rows).projects;
  assert.deepEqual([p.techVisibility, p.capabilityTags, p.tech, p.featuredTech], ['general', ['API Integration'], [], []]);
});

test('SEO keywords follow visibility: technologies, capability tags, or none', () => {
  const head = (v: string) => {
    const c = applyDisclosure(withVisibility(backup(), v));
    return headTags(projectMeta(c.projects.find((p) => p.slug === 'real-time-auction')!, c, SITE), 'x');
  };
  assert.ok(head('full').includes('RabbitMQ'));
  const general = head('general');
  assert.ok(general.includes('"keywords":"Full-Stack Engineering, Real-Time Systems'));
  for (const t of restricted) assert.ok(!general.includes(t), t);
  assert.ok(!head('hidden').includes('"keywords"'));
});
