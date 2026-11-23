import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { companyPeriod, formatDuration, formatPeriod, monthsBetween } from '../src/data/experience.ts';
import { asset } from '../src/data/profile.ts';
import { applyDisclosure, validateContent } from '../src/services/content.ts';
import type { Content } from '../src/services/content.ts';

// The verified content backup (supabase/backup/content.json) that seeded Supabase.
const backup: Content = JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8'));
const { projects, experience, profile } = backup;
const findProject = (slug: string) => projects.find((p) => p.slug === slug);

test('the backup passes the same validation as a deploy', () => {
  assert.deepEqual(validateContent(applyDisclosure(backup)), []);
});

test('four featured projects with unique slugs that resolve', () => {
  assert.equal(projects.length, 4);
  assert.equal(new Set(projects.map((p) => p.slug)).size, 4);
  for (const p of projects) assert.equal(findProject(p.slug), p);
  assert.equal(findProject('missing'), undefined);
});

test('private projects carry no repository or demo links', () => {
  for (const p of projects) assert.doesNotMatch(JSON.stringify(p), /https?:\/\//);
});

test('experience is grouped by employer with verified titles and dates', () => {
  assert.deepEqual(
    experience.map((g) => [g.company, g.roles.map((r) => `${r.title} ${formatPeriod(r.startDate, r.endDate)}`)]),
    [
      ['Freelance', ['Freelance Software Engineer Jan 2026 – Present']],
      ['Aibodia Co., Ltd', ['Project Leader / Team Lead Nov 2024 – Dec 2025', 'Senior Frontend Developer Aug 2024 – Oct 2024']],
      ['YesCAR Cambodia', ['Senior Java Developer Jan 2024 – Jun 2024']],
      [
        'Ecoinsoft Solution Co., Ltd',
        ['Frontend Team Leader Mar 2020 – Sep 2023', 'Frontend Developer Nov 2019 – Feb 2020', 'Backend Developer Dec 2018 – Oct 2019'],
      ],
    ],
  );
});

test('roles are newest first within each company', () => {
  for (const g of experience) {
    const starts = g.roles.map((r) => r.startDate);
    assert.deepEqual(starts, [...starts].sort().reverse(), g.company);
  }
});

test('company period spans earliest start to latest end', () => {
  const [freelance, aibodia, yescar, ecoinsoft] = experience;
  assert.deepEqual(companyPeriod(aibodia), { start: '2024-08', end: '2025-12' });
  assert.deepEqual(companyPeriod(ecoinsoft), { start: '2018-12', end: '2023-09' });
  assert.deepEqual(companyPeriod(freelance), { start: '2026-01', end: null });
  assert.equal(formatDuration(monthsBetween('2024-08', '2025-12')), '1 yr 5 mos');
  assert.equal(formatDuration(monthsBetween('2018-12', '2023-09')), '4 yrs 10 mos');
  assert.equal(formatDuration(monthsBetween(yescar.roles[0].startDate, yescar.roles[0].endDate)), '6 mos');
  assert.equal(monthsBetween('2026-01', null, new Date(2026, 10, 21)), 11);
});

test('no placeholder contact details', () => {
  const all = JSON.stringify({ profile, projects, experience });
  assert.doesNotMatch(all, /example\.com|alex|555/i);
  if (profile.email) assert.match(profile.email, /^[^@\s]+@[^@\s]+\.[^@\s]+$/);
});

test('each role lists 2–5 concise highlights', () => {
  for (const role of experience.flatMap((g) => g.roles)) {
    assert.ok(role.highlights.length >= 2 && role.highlights.length <= 5, role.title);
  }
});

test('asset() resolves against the base path and keeps empty values empty', () => {
  assert.equal(asset(''), '');
  assert.equal(asset('resume.pdf'), '/resume.pdf');
  assert.equal(asset('/resume.pdf'), '/resume.pdf');
});

test('cards feature at most five technologies, all from the full stack', () => {
  for (const p of projects) {
    assert.ok(p.featuredTech.length >= 1 && p.featuredTech.length <= 5, p.slug);
    for (const t of p.featuredTech) assert.ok(p.tech.includes(t), `${p.slug}: ${t}`);
  }
});

test('Petroleum is described as frontend and client coordination, not backend work', () => {
  const p = projects.find((x) => x.slug === 'petroleum-distribution')!;
  const mine = [p.role, p.summary, p.myRole, ...p.contributions].join(' ');
  assert.match(p.role, /Frontend Development & Client Coordination/);
  assert.doesNotMatch(mine, /Laravel backend development|database design|full-stack/i);
  assert.match(p.team ?? '', /backend team/);
  const freelance = experience.find((g) => g.company === 'Freelance')!.roles[0].highlights.join(' ');
  assert.doesNotMatch(freelance, /Laravel|backend development|database design/i);
});

test('YesCAR CRM keeps its slug, five featured badges and no invented metrics', () => {
  const p = findProject('enterprise-crm')!;
  assert.match(p.title, /^YesCAR/);
  assert.deepEqual(p.featuredTech, ['Java', 'Spring Boot', 'Spring Data JPA', 'Vue.js', 'REST APIs']);
  assert.match(p.challenge, /N\+1/);
  assert.doesNotMatch([p.summary, p.challenge, p.approach, p.lessons].join(' '), /\d+\s*(%|ms|x\b|times faster)/i);
});

test('CV download link forces a download from Supabase Storage and keeps other URLs as they are', async () => {
  const { resumeDownload } = await import('../src/data/profile.ts');
  const supa = 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/cv/resume.pdf';
  assert.deepEqual(resumeDownload(supa, 'Chanthorn Yoeun'), { href: `${supa}?download=Chanthorn-Yoeun-CV.pdf`, fileName: 'Chanthorn-Yoeun-CV.pdf' });
  assert.equal(resumeDownload('https://cdn.example.com/cv.pdf', 'A B').href, 'https://cdn.example.com/cv.pdf');
});

test('the CV must be a PDF', () => {
  const ok = applyDisclosure({ ...backup, profile: { ...profile, resumeUrl: 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/cv/resume.pdf' } });
  assert.deepEqual(validateContent(ok), []);
  const bad = { ...ok, profile: { ...ok.profile, resumeUrl: 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/cv/resume.png' } };
  assert.ok(validateContent(bad).includes('profile.resume_path must point to a .pdf file'));
});
