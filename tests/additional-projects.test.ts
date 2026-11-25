import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { applyDisclosure, mapContent, validateContent } from '../src/services/content.ts';
import type { Content, Rows } from '../src/services/content.ts';
import { imageAlt } from '../src/data/projects.ts';
import { PROJECT_ICONS, projectIcon } from '../src/data/projectIcons.ts';

const env = { VITE_SUPABASE_URL: 'https://demo.supabase.co', VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_x' };
const backup = (): Content => applyDisclosure(JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8')));

const minimalRows = (otherProjects: Rows['otherProjects']): Rows => ({
  projects: [], otherProjects, companies: [], skillCategories: [], education: [], languages: [], socialLinks: [], settings: [],
  profile: { name: 'N', title: 'T', location: 'L', headline: 'H', introduction: 'I', about: null, email: null, resume_path: null, avatar_path: null },
});

test('maps additional projects in sort order with optional metadata', () => {
  const c = mapContent(minimalRows([
    { title: 'B', description: 'b', url: null, sort_order: 2 },
    { title: 'A', description: 'a', url: 'https://a.example/', company: ' Co ', role: 'Lead', icon: 'Ship', capability_tags: ['X', 'Y'], url_label: 'Organization Website', sort_order: 1 },
  ]), env);
  assert.deepEqual(c.otherProjects, [
    { title: 'A', description: 'a', company: 'Co', role: 'Lead', icon: 'Ship', capabilityTags: ['X', 'Y'], url: 'https://a.example/', urlLabel: 'Organization Website' },
    // Rows from before the migration (no new columns) still map, with empty tags and no link.
    { title: 'B', description: 'b', company: undefined, role: undefined, icon: undefined, capabilityTags: [], url: undefined, urlLabel: undefined },
  ]);
});

test('validation: required fields, tag limits, https-only URLs, duplicates, label without URL', () => {
  const c = backup();
  const base = c.otherProjects[0];
  const errors = validateContent({
    ...c,
    otherProjects: [
      { ...base, title: ' ' },
      { ...base, title: 'Tags', capabilityTags: ['a', 'b', 'c', 'd'] },
      { ...base, title: 'Http', url: 'http://insecure.example/' },
      { ...base, title: 'Junk', url: 'not a url' },
      { ...base, title: 'Label', url: undefined, urlLabel: 'Visit Website' },
      { ...base, title: 'Dup' },
      { ...base, title: 'Dup' },
    ],
  }).join('\n');
  for (const expected of ['.title is empty', 'at most 3 capability tags', 'url must use https', 'url is not valid', 'url_label set without a url', 'duplicate title']) {
    assert.ok(errors.includes(expected), expected);
  }
  assert.deepEqual(validateContent({ ...c, otherProjects: [] }), []);
});

test('backup content: six valid additional projects, links only where public', () => {
  const c = backup();
  assert.deepEqual(validateContent(c), []);
  assert.equal(c.otherProjects.length, 6);
  assert.deepEqual(c.otherProjects.filter((p) => p.url).map((p) => p.url), ['https://vms.fia.maff.gov.kh/', 'https://www.iac.org.kh/']);
  for (const p of c.otherProjects) {
    assert.ok(p.icon && p.icon in PROJECT_ICONS, `${p.title}: unknown icon ${p.icon}`);
    assert.ok(p.capabilityTags.length >= 2 && p.capabilityTags.length <= 3, p.title);
  }
  for (const p of c.projects) assert.ok(p.cardSummary && p.cardSummary.length >= 120 && p.cardSummary.length <= 200, p.slug);
});

test('unknown or missing icons fall back to a generic icon', () => {
  assert.equal(projectIcon('Ship'), PROJECT_ICONS.Ship);
  assert.equal(projectIcon('NotAnIcon'), projectIcon(undefined));
  assert.equal(projectIcon('toString'), projectIcon(undefined)); // prototype keys are not icons
});

test('project images default to conceptual illustrations', () => {
  const r = minimalRows([]);
  r.projects = [{
    slug: 'x', title: 'X', role: 'r', summary: 's', overview: 'o', challenge: 'c', my_role: 'm', team: null, approach: 'a', lessons: 'l',
    featured_technologies: null, technologies: null, contributions: ['c'], image_path: 'p.webp', sort_order: 0,
  }];
  const [p] = mapContent(r, env).projects;
  assert.equal(p.imageType, 'concept');
  assert.equal(imageAlt(p), 'X — conceptual illustration');
  assert.equal(imageAlt({ ...p, imageType: 'screenshot', imageAlt: undefined }), 'X — screenshot');
  assert.equal(imageAlt({ ...p, imageAlt: 'Dashboard concept' }), 'Dashboard concept');
});
