// Writes one real HTML file per public page into dist/, plus 404.html and sitemap.xml.
// Runs after `vite build` (client) and `vite build --ssr src/entry-server.tsx --outDir dist-ssr`.
// Fails (exit 1) if any page is missing its text or tags, so a broken build is never deployed.
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import type { Content } from '../src/services/content.ts';
import { routeKey } from '../src/routes.ts';
import type { Route } from '../src/routes.ts';
import { headTags, homeMeta, notFoundMeta, projectMeta, sitemap } from '../src/seo.ts';
import type { PageMeta } from '../src/seo.ts';

const BASE = '/portfolio/';
const SITE_URL = `https://chanthornyoeun.github.io${BASE}`;
const dist = new URL('../dist/', import.meta.url);

const content: Content = JSON.parse(readFileSync(new URL('../src/generated/content.json', import.meta.url), 'utf8'));
// Preload the Latin Inter file so text renders in the final font without a late swap.
const latinFont = readdirSync(new URL('assets/', dist)).find((f) => /^inter-latin-wght-normal-.*\.woff2$/.test(f));
const template = readFileSync(new URL('index.html', dist), 'utf8').replace(
  '</head>',
  latinFont ? `  <link rel="preload" href="${BASE}assets/${latinFont}" as="font" type="font/woff2" crossorigin />
  </head>` : '</head>',
);
const { render } = (await import(new URL('../dist-ssr/entry-server.js', import.meta.url).href)) as { render: (r: Route) => string };

const problems: string[] = [];

function page(file: string, route: Route, meta: PageMeta, mustContain: string[]) {
  const html = template
    .replace(/<!--head-->[\s\S]*?<!--\/head-->/, headTags(meta, content.profile.name))
    .replace('<div id="root"><!--app--></div>', `<div id="root" data-route="${routeKey(route)}">${render(route)}</div>`);
  for (const text of mustContain) if (!html.includes(text)) problems.push(`${file}: missing ${JSON.stringify(text)}`);
  if (html.includes('<!--app-->') || html.includes('<!--head-->')) problems.push(`${file}: placeholder not replaced`);
  // Content must be readable without JavaScript: nothing may start hidden by an inline style.
  if (/style="[^"]*opacity:\s*0/.test(html)) problems.push(`${file}: content starts invisible (opacity:0)`);
  const target = new URL(file, dist);
  mkdirSync(new URL('.', target), { recursive: true });
  writeFileSync(target, html);
}

// HTML-escaped text as React renders it (apostrophes become &#x27;).
const asHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

page('index.html', { page: 'home' }, homeMeta(content, SITE_URL), [
  asHtml(content.profile.headline),
  `<link rel="canonical" href="${SITE_URL}" />`,
  `<meta property="og:image" content="${SITE_URL}og-image.png" />`,
  ...content.projects.map((p) => `href="${BASE}work/${p.slug}/"`),
]);
for (const p of content.projects) {
  page(`work/${p.slug}/index.html`, { page: 'project', slug: p.slug }, projectMeta(p, content, SITE_URL), [
    `>${asHtml(p.title)}</h1>`,
    `<link rel="canonical" href="${SITE_URL}work/${p.slug}/" />`,
  ]);
}
page('404.html', { page: 'not-found' }, notFoundMeta(content), ['Page not found', 'noindex']);
const xml = sitemap(content, SITE_URL);
// Every sitemap URL must be a page we just wrote (no drafts, no duplicates, no missing pages).
const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const expected = [SITE_URL, ...content.projects.map((p) => `${SITE_URL}work/${p.slug}/`)];
if (new Set(locs).size !== locs.length || locs.join() !== expected.join()) problems.push('sitemap.xml does not match the generated pages');
writeFileSync(new URL('sitemap.xml', dist), xml);
rmSync(new URL('../dist-ssr/', import.meta.url), { recursive: true, force: true });

if (problems.length) {
  console.error(`prerender: ${problems.length} problem(s):\n  - ${problems.join('\n  - ')}`);
  process.exit(1);
}
console.log(`prerender: ${content.projects.length + 2} pages and sitemap.xml written`);
