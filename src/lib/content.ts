import type { Metadata } from "next";
import { projects } from "@/content/projects";
import { absoluteUrl, ogImage } from "@/lib/site";
import type { Experience, Link, Project, YearMonth } from "@/lib/types";

const byOrder = (a: Project, b: Project) => a.order - b.order;

export const getProjects = () => [...projects].sort(byOrder);
export const getFeaturedProjects = () =>
  getProjects().filter((p) => p.featured);
export const getProjectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
export const getProjectSlugs = () => projects.map((p) => p.slug);

/** Other projects, most shared technologies first, then by display order. */
export function getRelatedProjects(project: Project, limit = 2): Project[] {
  const shared = (p: Project) =>
    p.technologies.filter((t) => project.technologies.includes(t)).length;
  return getProjects()
    .filter((p) => p.slug !== project.slug)
    .sort((a, b) => shared(b) - shared(a) || byOrder(a, b))
    .slice(0, limit);
}

/** Metadata for a case study, or null for an unknown slug. */
export function getProjectMetadata(slug: string): Metadata | null {
  const project = getProjectBySlug(slug);
  if (!project) return null;
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: absoluteUrl(`/projects/${project.slug}/`) },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: absoluteUrl(`/projects/${project.slug}/`),
      // A page-level openGraph replaces the root one, so restate the shared image.
      images: [ogImage],
    },
  };
}

export function isValidUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    const { protocol } = new URL(value);
    return protocol === "https:" || protocol === "http:";
  } catch {
    return false;
  }
}

/** Links to render for a project. Private projects never get any. */
export function getProjectLinks(project: Project): Link[] {
  if (project.visibility === "private") return [];
  return [
    { label: "Source code", href: project.repositoryUrl },
    { label: "Live site", href: project.liveUrl },
  ].filter((l): l is Link => isValidUrl(l.href));
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatYearMonth(value: YearMonth): string {
  const [year, month] = value.split("-").map(Number);
  return `${MONTHS[(month ?? 1) - 1]} ${year}`;
}

export function formatPeriod(start: YearMonth, end?: YearMonth): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Present"}`;
}

/** Groups consecutive roles at the same company, keeping their order. */
export function groupByCompany(items: Experience[]) {
  const groups: { company: string; roles: Experience[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last?.company === item.company) last.roles.push(item);
    else groups.push({ company: item.company, roles: [item] });
  }
  return groups;
}

/** Loose shape check; the address is author-provided, not user input. */
export const isValidEmail = (value: string | undefined): value is string =>
  !!value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
