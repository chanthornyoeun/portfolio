/**
 * The e2e suite runs against the static export served like GitHub Pages.
 * E2E_BASE_PATH="" tests a custom domain / user site; "/developer-portfolio"
 * (or any repo name) tests a project site on a repository subpath.
 */
export const PORT = 3100;
export const BASE = (process.env.E2E_BASE_PATH ?? "").replace(/\/+$/, "");
export const SITE = `http://localhost:${PORT}${BASE}`;

/** Prefix a site path ("/projects/") with the base path. */
export const url = (path: string) => `${BASE}${path}`;
