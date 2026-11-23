import type { SupabaseClient } from '@supabase/supabase-js';

const env = import.meta.env ?? {};

/** Both public values must be set; the publishable key is safe in the browser because RLS guards every table. */
export function supabaseConfig(e: Record<string, unknown> = env) {
  const url = String(e.VITE_SUPABASE_URL ?? '');
  const key = String(e.VITE_SUPABASE_PUBLISHABLE_KEY ?? '');
  // A secret/service-role key must never ship to the browser: refuse to use one.
  if (!/^https:\/\/[^/]+$/.test(url) || !key || key.startsWith('sb_secret_')) return null;
  return { url, key };
}

let client: Promise<SupabaseClient> | null = null;

/** Lazily loads the SDK in its own chunk so it never delays the first paint. Null when not configured. */
export function getSupabase() {
  const config = supabaseConfig();
  if (!config) return null;
  client ??= import('@supabase/supabase-js').then(({ createClient }) =>
    // Public read-only use: no session needs to be stored or refreshed.
    createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } }),
  );
  return client;
}

/** Public URL for a file in the portfolio-media bucket; full https URLs pass through unchanged. */
export function mediaUrl(path: string | null | undefined, e: Record<string, unknown> = env) {
  if (!path) return '';
  if (/^https:\/\//.test(path)) return path;
  const config = supabaseConfig(e);
  return config ? `${config.url}/storage/v1/object/public/portfolio-media/${path.replace(/^\/+/, '')}` : '';
}
