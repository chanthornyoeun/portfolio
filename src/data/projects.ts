export interface Project {
  slug: string;
  title: string;
  role: string;
  summary: string;
  /** Up to five shown on the homepage card. */
  featuredTech: string[];
  /** Full verified stack, shown on the case study. */
  tech: string[];
  /** Optional authorized, sanitized screenshot (16:9) in public/, e.g. 'projects/auction.webp'. Resolved with asset(). */
  image?: string;
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
  url?: string;
}
