import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skills } from '../src/data/skills.ts';

test('core technologies are listed and no skill appears twice', () => {
  const all = skills.flatMap((g) => [...g.core, ...g.other]);
  assert.equal(new Set(all).size, all.length);
  for (const s of ['Java', 'Spring Boot', 'Laravel', 'Go', 'Node.js', 'TypeScript', 'React', 'Next.js', 'Vue.js', 'Nuxt.js', 'Angular', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Linux', 'Nginx']) {
    assert.ok(skills.some((g) => g.core.includes(s)), s);
  }
});
