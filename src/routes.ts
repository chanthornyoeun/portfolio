// Real paths so every case study is its own prerendered HTML file:
//   /portfolio/                      homepage
//   /portfolio/work/<slug>/          case study
// Old hash links (#/work/<slug>) are redirected by an inline script in index.html.

export type Route = { page: 'home' } | { page: 'project'; slug: string } | { page: 'not-found' };

export const BASE: string = import.meta.env?.BASE_URL ?? '/';
export const SITE_ORIGIN = 'https://chanthornyoeun.github.io';

export const projectPath = (slug: string, base = BASE) => `${base}work/${slug}/`;
/** Link to a homepage section that works from any page. */
export const sectionPath = (id: string, base = BASE) => `${base}#${id}`;

export function routeFromPath(pathname: string, base = BASE): Route {
  if (!pathname.startsWith(base)) return { page: 'not-found' };
  const rest = pathname.slice(base.length).replace(/index\.html$/, '');
  if (rest === '') return { page: 'home' };
  const m = /^work\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(rest);
  return m ? { page: 'project', slug: m[1] } : { page: 'not-found' };
}

/** Stable id for a route, written on the prerendered root so the client only hydrates matching HTML. */
export const routeKey = (r: Route) => (r.page === 'project' ? `project:${r.slug}` : r.page);

/** Where an old `#/work/<slug>` link should go, or null. */
export function legacyHashTarget(hash: string, base = BASE) {
  const m = /^#\/work\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/.exec(hash);
  return m ? projectPath(m[1], base) : null;
}
