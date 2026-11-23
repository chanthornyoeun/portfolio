// Resolves a file in public/ against the Vite base path (/portfolio/ on GitHub Pages).
// `?.` keeps this importable from Node tests, where import.meta.env is undefined.
export const asset = (file: string) => (file ? `${import.meta.env?.BASE_URL ?? '/'}${file.replace(/^\//, '')}` : '');

/**
 * Link that downloads the CV instead of opening it. Supabase Storage forces a download with `?download=<name>`;
 * the HTML `download` attribute only works for same-origin files, so it is set as well.
 */
export function resumeDownload(url: string, name: string) {
  const fileName = `${name.trim().replace(/\s+/g, '-')}-CV.pdf`;
  const href = url.includes('/storage/v1/object/public/') ? `${url}${url.includes('?') ? '&' : '?'}download=${encodeURIComponent(fileName)}` : url;
  return { href, fileName };
}

export interface Profile {
  name: string;
  title: string;
  location: string;
  headline: string;
  intro: string;
  about: string[];
  education: { title: string; school: string; period: string };
  languages: { name: string; level: string }[];
  /** Empty values hide the related links and buttons. */
  email: string;
  resumeUrl: string;
  portrait: string;
  github: string;
  linkedin: string;
}
