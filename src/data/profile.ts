// Resolves a file in public/ against the Vite base path (/portfolio/ on GitHub Pages).
// `?.` keeps this importable from Node tests, where import.meta.env is undefined.
export const asset = (file: string) => (file ? `${import.meta.env?.BASE_URL ?? '/'}${file.replace(/^\//, '')}` : '');

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
