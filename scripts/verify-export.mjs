// Validates the static export in out/ before it is published.
// Uses the same NEXT_PUBLIC_SITE_URL as the build. Exits non-zero on any problem.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";

const root = resolve("out");
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/+$/, "");
const basePath = new URL(siteUrl).pathname.replace(/\/+$/, "");
const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(root)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const files = walk(root);
const rel = (p) => relative(root, p).replaceAll("\\", "/");

// 1. Required pages and files.
const required = [
  "index.html",
  "404.html",
  "projects/index.html",
  "resume/index.html",
  "sitemap.xml",
  "robots.txt",
  "og.png",
];
for (const r of required) if (!existsSync(join(root, r))) fail(`missing ${r}`);

// 2. Sitemap: every URL uses the site URL and maps to an exported page.
const sitemapPath = join(root, "sitemap.xml");
const sitemapUrls = existsSync(sitemapPath)
  ? [...readFileSync(sitemapPath, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1],
    )
  : [];
if (sitemapUrls.length < 7)
  fail(`sitemap has ${sitemapUrls.length} URLs, expected at least 7`);
for (const url of sitemapUrls) {
  if (!url.startsWith(`${siteUrl}/`)) {
    fail(`sitemap URL ${url} does not start with ${siteUrl}/`);
    continue;
  }
  const path = url.slice(siteUrl.length + 1);
  if (!existsSync(join(root, path, "index.html")))
    fail(`sitemap URL ${url} has no page`);
}
const projectPages = sitemapUrls.filter((u) => /\/projects\/[^/]+\/$/.test(u));
if (projectPages.length < 4)
  fail(`expected at least 4 project pages, found ${projectPages.length}`);

// 3. robots.txt points at this site's sitemap.
const robots = existsSync(join(root, "robots.txt"))
  ? readFileSync(join(root, "robots.txt"), "utf8")
  : "";
if (!robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`))
  fail("robots.txt has the wrong sitemap URL");

// 4. Every HTML page: canonical, internal links and assets resolve under the base path.
const exists = (urlPath) => {
  const p = decodeURIComponent(urlPath.split(/[?#]/)[0].slice(basePath.length));
  if (p === "" || p.endsWith("/"))
    return existsSync(join(root, p, "index.html"));
  return existsSync(join(root, p)) || existsSync(join(root, `${p}.html`));
};
const htmlFiles = files.filter((f) => f.endsWith(".html"));
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const name = rel(file);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  // Next writes the 404 page to several paths; none of them should have a canonical.
  const isNotFound = /^(404|_not-found)(\.html|\/)/.test(name);
  if (!isNotFound && !canonical?.startsWith(`${siteUrl}/`)) {
    fail(
      `${name}: canonical ${canonical ?? "(none)"} is not under ${siteUrl}/`,
    );
  }
  for (const [, attr, url] of html.matchAll(/\s(href|src)="(\/[^"]*)"/g)) {
    if (url.startsWith("//")) continue;
    if (basePath && !url.startsWith(`${basePath}/`)) {
      fail(`${name}: ${attr}="${url}" is missing the base path ${basePath}`);
    } else if (!exists(url)) {
      fail(`${name}: ${attr}="${url}" does not resolve to an exported file`);
    }
  }
}

// 5. CSS and JS were emitted and are referenced.
const assets = files.map(rel).filter((f) => f.startsWith("_next/static/"));
if (!assets.some((f) => f.endsWith(".css"))) fail("no CSS in _next/static");
if (!assets.some((f) => f.endsWith(".js")))
  fail("no JavaScript in _next/static");

// 6. Segment prefetch files exist under the flat names the client requests
//    (see scripts/flatten-segments.mjs).
for (const f of files.map(rel)) {
  const m = f.match(/^(.*?)(__next\.[^/]+)\/(.+)$/);
  if (
    m &&
    !existsSync(join(root, `${m[1]}${m[2]}.${m[3].replaceAll("/", ".")}`))
  ) {
    fail(`${f} has no flat copy; run scripts/flatten-segments.mjs`);
  }
}

// 7. Nothing that looks like a secret or a dev URL is published.
for (const file of files.filter((f) => /\.(html|js|txt|xml|json)$/.test(f))) {
  const text = readFileSync(file, "utf8");
  if (/sk-ant-[A-Za-z0-9_-]{10,}|ANTHROPIC_API_KEY/.test(text))
    fail(`${rel(file)} contains a secret-like value`);
  if (!siteUrl.includes("localhost") && text.includes("localhost:3000")) {
    fail(`${rel(file)} references localhost:3000`);
  }
}

if (problems.length) {
  console.error(`Export verification failed (${problems.length}):`);
  for (const p of problems.slice(0, 50)) console.error(`  - ${p}`);
  process.exit(1);
}
console.log(
  `Export OK: ${htmlFiles.length} HTML files, ${sitemapUrls.length} sitemap URLs, base path "${basePath || "/"}", site ${siteUrl}`,
);
