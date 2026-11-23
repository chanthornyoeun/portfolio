// Supabase is only used at build time (scripts/fetch-content.ts). The browser never talks to it.

/** Both public values must be set; refuses non-https URLs and secret keys, which must never be used for builds. */
export function supabaseConfig(e: Record<string, unknown>) {
  const url = String(e.VITE_SUPABASE_URL ?? '').replace(/\/+$/, '');
  const key = String(e.VITE_SUPABASE_PUBLISHABLE_KEY ?? '');
  if (!/^https:\/\/[^/]+$/.test(url) || !key || key.startsWith('sb_secret_')) return null;
  return { url, key };
}

/** Public URL for a file in the portfolio-media bucket; full https URLs pass through unchanged. */
export function mediaUrl(path: string | null | undefined, e: Record<string, unknown> = {}) {
  if (!path) return '';
  if (/^https:\/\//.test(path)) return path;
  const config = supabaseConfig(e);
  return config ? `${config.url}/storage/v1/object/public/portfolio-media/${path.replace(/^\/+/, '')}` : '';
}
