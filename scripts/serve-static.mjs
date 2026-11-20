// Serves out/ the way GitHub Pages does, for local previews and Playwright:
// - the site lives under the base path from NEXT_PUBLIC_SITE_URL (e.g. /repo/)
// - "dir" redirects to "dir/", "dir/" serves dir/index.html, "x" may serve x.html
// - anything else gets 404.html with status 404
// Usage: node scripts/serve-static.mjs [port]
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.argv[2] ?? process.env.PORT ?? 3000);
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const basePath = new URL(siteUrl).pathname.replace(/\/+$/, "");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

if (!existsSync(root)) {
  console.error("out/ not found. Run `npm run build` first.");
  process.exit(1);
}

const isFile = (p) => existsSync(p) && statSync(p).isFile();
const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

function send(res, file, status = 200) {
  res.writeHead(status, {
    "Content-Type": types[extname(file)] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const notFound = () => send(res, join(root, "404.html"), 404);

  if (basePath && pathname === basePath) {
    res.writeHead(301, { Location: `${basePath}/` }).end();
    return;
  }
  if (!pathname.startsWith(`${basePath}/`)) return notFound();

  const relative = decodeURIComponent(pathname.slice(basePath.length));
  const target = normalize(join(root, relative));
  if (!target.startsWith(root)) return notFound(); // path traversal

  if (relative.endsWith("/")) {
    const index = join(target, "index.html");
    return isFile(index) ? send(res, index) : notFound();
  }
  if (isFile(target)) return send(res, target);
  if (isDir(target)) {
    res.writeHead(301, { Location: `${pathname}/` }).end();
    return;
  }
  if (isFile(`${target}.html`)) return send(res, `${target}.html`);
  return notFound();
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}${basePath}/`);
});
