import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { legacyHashTarget, projectPath, routeFromPath, sectionPath } from '../src/routes.ts';
import { headTags, homeMeta, notFoundMeta, projectMeta, sitemap } from '../src/seo.ts';
import type { Content } from '../src/services/content.ts';

const B = '/portfolio/';
const SITE = 'https://chanthornyoeun.github.io/portfolio/';
const c: Content = JSON.parse(readFileSync(new URL('../supabase/backup/content.json', import.meta.url), 'utf8'));
const type = (o: object) => (o as { '@type': string })['@type'];

test('paths map to routes; unknown or malformed paths are not found', () => {
  assert.deepEqual(routeFromPath('/portfolio/', B), { page: 'home' });
  assert.deepEqual(routeFromPath('/portfolio/index.html', B), { page: 'home' });
  assert.deepEqual(routeFromPath('/portfolio/work/enterprise-crm/', B), { page: 'project', slug: 'enterprise-crm' });
  assert.deepEqual(routeFromPath('/portfolio/work/enterprise-crm', B), { page: 'project', slug: 'enterprise-crm' });
  assert.deepEqual(routeFromPath('/portfolio/work/Bad_Slug/', B), { page: 'not-found' });
  assert.deepEqual(routeFromPath('/portfolio/admin', B), { page: 'not-found' });
  assert.deepEqual(routeFromPath('/portfolio/credits/', B), { page: 'credits' });
  assert.deepEqual(routeFromPath('/portfolio/credits', B), { page: 'credits' });
  assert.deepEqual(routeFromPath('/other/', B), { page: 'not-found' });
  assert.equal(projectPath('real-time-auction', B), '/portfolio/work/real-time-auction/');
  assert.equal(sectionPath('work', B), '/portfolio/#work');
});

test('old hash links redirect to the new paths; section anchors do not', () => {
  assert.equal(legacyHashTarget('#/work/enterprise-crm', B), '/portfolio/work/enterprise-crm/');
  assert.equal(legacyHashTarget('#/work/enterprise-crm/', B), '/portfolio/work/enterprise-crm/');
  assert.equal(legacyHashTarget('#work', B), null);
  assert.equal(legacyHashTarget('#/work/<script>', B), null);
});

test('the inline redirect in index.html matches legacyHashTarget', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes("location.replace('%BASE_URL%work/' + m[1] + '/')"));
  assert.ok(html.includes('/^#\\/work\\/([a-z0-9]+(?:-[a-z0-9]+)*)\\/?$/'));
});

test('every page has a unique title, description and canonical URL', () => {
  const metas = [homeMeta(c, SITE), ...c.projects.map((p) => projectMeta(p, c, SITE))];
  for (const key of ['title', 'description', 'url'] as const) {
    assert.equal(new Set(metas.map((m) => m[key])).size, metas.length, key);
  }
  for (const m of metas) {
    assert.ok(m.description.length <= 160, m.title);
    const head = headTags(m, c.profile.name);
    for (const tag of ['<title>', 'name="description"', 'rel="canonical"', 'og:title', 'og:description', 'og:url', 'twitter:card', 'index, follow']) {
      assert.ok(head.includes(tag), `${m.title}: ${tag}`);
    }
  }
});

test('structured data is valid JSON with only verified facts', () => {
  const person = homeMeta(c, SITE).jsonLd.find((o) => type(o) === 'Person') as Record<string, unknown>;
  assert.deepEqual(person.sameAs, [c.profile.github, c.profile.linkedin]);
  assert.equal(person.jobTitle, c.profile.title);
  const crm = projectMeta(c.projects.find((p) => p.slug === 'enterprise-crm')!, c, SITE);
  assert.deepEqual(crm.jsonLd.map(type), ['BreadcrumbList', 'CreativeWork']);
  const blocks = headTags(crm, 'x').match(/<script type="application\/ld\+json">(.*?)<\/script>/g)!;
  assert.equal(blocks.length, 2);
  for (const b of blocks) JSON.parse(b.replace(/^<script[^>]*>/, '').replace(/<\/script>$/, ''));
});

test('head tags escape text and cannot break out of JSON-LD', () => {
  const head = headTags({ title: 'A "quoted" <b>', description: 'd', url: SITE, jsonLd: [{ name: '</script><script>alert(1)</script>' }] }, 'x');
  assert.ok(head.includes('A &quot;quoted&quot; &lt;b&gt;'));
  assert.ok(!head.includes('</script><script>'));
});

test('the 404 page is noindex and has no canonical', () => {
  const head = headTags(notFoundMeta(c), 'x');
  assert.ok(head.includes('noindex'));
  assert.ok(!head.includes('canonical'));
});

test('sitemap lists the homepage and published case studies with real lastmod only', () => {
  const withDate = { ...c, projects: c.projects.map((p, i) => (i === 0 ? { ...p, updatedAt: '2026-11-20T08:00:00Z' } : p)) };
  const xml = sitemap(withDate, SITE);
  assert.equal(xml.match(/<url>/g)!.length, c.projects.length + 2);
  assert.ok(xml.includes(`<loc>${SITE}credits/</loc>`));
  assert.ok(xml.includes(`<loc>${SITE}</loc>`));
  for (const p of c.projects) assert.ok(xml.includes(`<loc>${SITE}work/${p.slug}/</loc>`));
  assert.equal(xml.match(/<lastmod>/g)!.length, 1);
  assert.ok(xml.includes('<lastmod>2026-11-20</lastmod>'));
});

test('pages share a large link-preview image; screenshots win when published', () => {
  const head = headTags(homeMeta(c, SITE), c.profile.name);
  for (const tag of [`og:image" content="${SITE}og-image.png"`, 'og:image:width" content="1200"', 'og:image:height" content="630"', 'og:image:alt', 'twitter:card" content="summary_large_image"', `twitter:image" content="${SITE}og-image.png"`]) {
    assert.ok(head.includes(tag), tag);
  }
  const shot = { ...c.projects[0], image: 'https://demo.supabase.co/storage/v1/object/public/portfolio-media/p.webp' };
  const projectHead = headTags(projectMeta(shot, c, SITE), 'x');
  assert.ok(projectHead.includes('og:image" content="https://demo.supabase.co/storage/v1/object/public/portfolio-media/p.webp"'));
  assert.ok(!projectHead.includes('og:image:width'));
  assert.ok(!headTags(notFoundMeta(c), 'x').includes('og:image'));
});
