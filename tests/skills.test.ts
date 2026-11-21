import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skills } from '../src/data/skills.ts';

const all = skills.flatMap((g) => [...g.primary, ...g.supporting, ...(g.subgroup?.items ?? [])]);

test('every skill appears once, AI tools live under Development Tools', () => {
  assert.equal(new Set(all).size, all.length);
  assert.equal(all.length, 55);
  assert.ok(!skills.some((g) => g.category.startsWith('AI')));
  assert.deepEqual(skills.find((g) => g.category === 'Development Tools')?.subgroup?.items, ['OpenAI Codex', 'Claude Code', 'GitHub Copilot', 'ChatGPT']);
});

test('core technologies are primary', () => {
  for (const s of ['Java', 'Spring Boot', 'Laravel', 'Go', 'Node.js', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Linux', 'Nginx']) {
    assert.ok(skills.some((g) => g.primary.includes(s)), s);
  }
});
