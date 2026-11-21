import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projects, findProject } from '../src/data/projects.ts';
import { experience } from '../src/data/experience.ts';
import { profile } from '../src/data/profile.ts';

test('four featured projects with unique slugs that resolve', () => {
  assert.equal(projects.length, 4);
  assert.equal(new Set(projects.map((p) => p.slug)).size, 4);
  for (const p of projects) assert.equal(findProject(p.slug), p);
  assert.equal(findProject('missing'), undefined);
});

test('private projects carry no repository or demo links', () => {
  for (const p of projects) assert.doesNotMatch(JSON.stringify(p), /https?:\/\//);
});

test('experience is newest-first and keeps verified titles', () => {
  assert.equal(experience.length, 7);
  assert.equal(experience[0].title, 'Freelance Software Engineer');
  assert.equal(experience.at(-1)?.period, 'December 2018 – October 2019');
});

test('no placeholder contact details', () => {
  const all = JSON.stringify({ profile, projects, experience });
  assert.doesNotMatch(all, /example\.com|alex|555/i);
  if (profile.email) assert.match(profile.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
});
