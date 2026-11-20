import type { StaticImageData } from "next/image";

/**
 * An image imported from src/assets (e.g. `import photo from "@/assets/portrait.webp"`).
 * Static imports give width/height (no layout shift) and get the GitHub Pages base path.
 */
export type ContentImage = { src: StaticImageData; alt: string };

/** Year and month, e.g. "2024-11". */
export type YearMonth = `${number}-${number}`;

export type Link = { label: string; href: string };

export type Profile = {
  name: string;
  shortName: string;
  title: string;
  location: string;
  yearsOfExperience: string;
  headline: string;
  intro: string;
  about: string[];
  links: Link[];
  contactHeading: string;
  contactNote: string;
  /** Public contact email. The Contact email action renders only when set. */
  email?: string;
  /** Optional real portrait. Never generated or stock. Text-only hero when absent. */
  photo?: ContentImage;
  education: Education[];
  languages: { name: string; level: string }[];
};

export type Education = {
  institution: string;
  location: string;
  /** Deliberately not "degree": completion is unconfirmed. */
  program: string;
  start: number;
  end: number;
};

export type Experience = {
  company: string;
  title: string;
  start: YearMonth;
  /** Omitted while the role is current. */
  end?: YearMonth;
  summary: string;
  highlights: string[];
  technologies: string[];
  /** Slugs of related case studies. */
  projects?: string[];
};

export type SkillGroup = { name: string; skills: string[] };

export type ProjectDiagram = {
  caption: string;
  steps: { label: string; detail: string }[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  /** Shorter description for project lists; falls back to summary. */
  cardSummary?: string;
  role: string;
  /** Employer or engagement the project belongs to. */
  organization: string;
  context: string;
  challenges: string[];
  /** Kept apart so leadership is never presented as hands-on implementation. */
  contributions: { leadership: string[]; implementation: string[] };
  technicalApproach: string[];
  /** Verified outcomes only. Empty means the section is not rendered. */
  outcomes: string[];
  /** Optional reflections. Rendered with outcomes; omitted when empty. */
  lessons?: string[];
  /** Optional simplified, sanitized flow. Never real hosts or service names. */
  diagram?: ProjectDiagram;
  /** Optional preview: an authorized screenshot or an original conceptual mockup. */
  image?: ContentImage & { kind: "screenshot" | "mockup" };
  technologies: string[];
  visibility: "private" | "public";
  repositoryUrl?: string;
  liveUrl?: string;
  featured: boolean;
  order: number;
};
