export const TECH_VISIBILITY = ['full', 'general', 'hidden'] as const;
export type TechVisibility = (typeof TECH_VISIBILITY)[number];

/** The badges a project may show publicly, already limited by its visibility setting. */
export function publicTags(p: Pick<Project, 'techVisibility' | 'capabilityTags' | 'tech' | 'featuredTech'>, where: 'card' | 'detail') {
  if (p.techVisibility === 'full') return where === 'card' ? p.featuredTech.slice(0, 5) : p.tech;
  if (p.techVisibility === 'general') return p.capabilityTags.slice(0, 5);
  return [];
}

/** Image alt text: the configured text, else a description that says whether it is a concept or a screenshot. */
export const imageAlt = (p: Pick<Project, 'title' | 'imageType' | 'imageAlt'>) =>
  p.imageAlt ?? `${p.title} — ${p.imageType === 'screenshot' ? 'screenshot' : 'conceptual illustration'}`;

export interface Project {
  slug: string;
  title: string;
  role: string;
  summary: string;
  /** Optional shorter summary for homepage cards; falls back to `summary`. */
  cardSummary?: string;
  /**
   * What technology information is public: 'full' = approved technologies, 'general' = capability tags only,
   * 'hidden' = nothing. Private client work defaults to 'general'.
   */
  techVisibility: TechVisibility;
  /** High-level capabilities shown instead of exact technologies when visibility is 'general' (max 5). */
  capabilityTags: string[];
  /** Up to five shown on the homepage card. Empty unless visibility is 'full'. */
  featuredTech: string[];
  /** Full approved stack, shown on the case study. Empty unless visibility is 'full'. */
  tech: string[];
  /** Optional authorized, sanitized screenshot (16:9) in public/, e.g. 'projects/auction.webp'. Resolved with asset(). */
  image?: string;
  /** 'concept' images are labelled as illustrations, not product screenshots. Defaults to 'concept'. */
  imageType?: 'concept' | 'screenshot';
  /** Alt text for the image; a generic description is used when empty. */
  imageAlt?: string;
  overview: string;
  challenge: string;
  myRole: string;
  /** Work done by others on the project, so it isn't read as mine. */
  team?: string;
  contributions: string[];
  approach: string;
  lessons: string;
  /** ISO timestamp of the last content change, used for sitemap lastmod. */
  updatedAt?: string;
}

export interface OtherProject {
  title: string;
  description: string;
  company?: string;
  role?: string;
  /** Key in the icon registry (components/AdditionalProjects.tsx); unknown values get a generic icon. */
  icon?: string;
  /** General capabilities, at most 3. */
  capabilityTags: string[];
  /** Optional public https URL. */
  url?: string;
  /** Link text, e.g. "Organization Website"; defaults to "Visit Website". */
  urlLabel?: string;
}
