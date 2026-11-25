import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { SkillGroup } from '../src/data/skills.ts';

const { skills }: { skills: SkillGroup[] } = JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8'));

const all = skills.flatMap((g) => [...g.primary, ...g.supporting, ...(g.subgroup?.items ?? [])]);
const group = (name: string) => skills.find((g) => g.category === name)!;

test('eight categories in the approved order', () => {
  assert.deepEqual(
    skills.map((g) => g.category),
    ['Backend Development', 'Frontend Development', 'Databases & Caching', 'Cloud & DevOps', 'Software Engineering',
      'Development & Testing Tools', 'Project Management & Delivery', 'Leadership & Business Analysis'],
  );
});

test('every skill appears once and every category has primary skills', () => {
  assert.equal(new Set(all).size, all.length);
  assert.equal(all.length, 68);
  for (const g of skills) assert.ok(g.primary.length > 0, g.category);
});

test('AI tools are a subgroup of Development & Testing Tools only', () => {
  assert.deepEqual(group('Development & Testing Tools').subgroup, { label: 'AI-Assisted Development', items: ['ChatGPT', 'OpenAI Codex', 'Claude Code', 'GitHub Copilot'] });
  assert.equal(skills.filter((g) => g.subgroup).length, 1);
});

test('levels match the approved structure', () => {
  assert.deepEqual(group('Frontend Development').primary, ['TypeScript/JavaScript', 'React/Next.js', 'Vue.js/Nuxt.js', 'Angular']);
  assert.deepEqual(group('Project Management & Delivery').primary, ['Jira', 'ClickUp', 'Trello', 'Redmine', 'Notion']);
  assert.deepEqual(group('Leadership & Business Analysis').primary, ['Technical Leadership', 'Business Analysis']);
  for (const old of ['Spring Framework', 'PHP', 'MVC', 'Apache Tomcat', 'AWS EC2', 'AWS S3', 'Next.js', 'Nuxt.js', 'JavaScript']) assert.ok(!all.includes(old), old);
});
