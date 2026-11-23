// Renders public/og-image.png (1200x630), the link-preview image for LinkedIn, X, Slack, etc.
// Uses the same name/title/headline as the site and a local Chrome/Edge in headless mode (no new dependency).
// Usage: npm run og:generate   (after content:fetch; re-run when your name, title or headline changes)
// Set CHROME_PATH if Chrome/Edge is installed somewhere else.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import type { Content } from '../src/services/content.ts';

const { profile }: Content = JSON.parse(readFileSync(new URL('../src/generated/content.json', import.meta.url), 'utf8'));
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Same palette as the site: white background, gray-900 text, blue-700 accent.
const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=block" rel="stylesheet">
<style>
  * { margin: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body { font-family: Inter, 'Segoe UI', system-ui, sans-serif; background: #fff; color: #111827; padding: 88px 96px;
         display: flex; flex-direction: column; justify-content: space-between; border-top: 12px solid #1d4ed8; }
  .name { font-size: 34px; font-weight: 600; }
  .role { margin-top: 10px; font-size: 28px; color: #1d4ed8; }
  h1 { font-size: 64px; line-height: 1.12; font-weight: 600; letter-spacing: -0.02em; max-width: 960px; }
  .foot { display: flex; justify-content: space-between; font-size: 24px; color: #4b5563; border-top: 2px solid #e5e7eb; padding-top: 28px; }
</style></head><body>
  <div><div class="name">${esc(profile.name)}</div><div class="role">${esc(profile.title)} · ${esc(profile.location)}</div></div>
  <h1>${esc(profile.headline)}</h1>
  <div class="foot"><span>Case studies · Experience · Skills</span><span>chanthornyoeun.github.io/portfolio</span></div>
</body></html>`;

const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean) as string[];
const chrome = candidates.find((p) => existsSync(p));
if (!chrome) {
  console.error('og-image: no Chrome/Edge found; set CHROME_PATH.');
  process.exit(1);
}

const page = new URL('../og-image.tmp.html', import.meta.url);
const out = fileURLToPath(new URL('../public/og-image.png', import.meta.url));
writeFileSync(page, html);
try {
  execFileSync(chrome, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', '--window-size=1200,630',
    '--virtual-time-budget=5000', `--screenshot=${out}`, page.href], { stdio: 'ignore' });
} finally {
  rmSync(page, { force: true });
}
if (!existsSync(out)) {
  console.error('og-image: Chrome did not write the image.');
  process.exit(1);
}
console.log(`og-image: wrote public/og-image.png for "${profile.name}"`);
