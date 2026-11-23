// Build-time content: published rows from Supabase, mapped to the shapes the components use, then validated.
// Runs in Node (scripts/fetch-content.ts); the browser only ever sees the validated snapshot.
import type { ExperienceGroup } from '../data/experience.ts';
import type { Profile } from '../data/profile.ts';
import { TECH_VISIBILITY } from '../data/projects.ts';
import type { OtherProject, Project, TechVisibility } from '../data/projects.ts';
import type { SkillGroup } from '../data/skills.ts';
import { mediaUrl } from '../lib/supabase.ts';

export interface Content {
  siteTitle: string;
  /** Homepage meta description. */
  description: string;
  profile: Profile;
  projects: Project[];
  otherProjects: OtherProject[];
  experience: ExperienceGroup[];
  skills: SkillGroup[];
}

type Sorted = { sort_order: number };
export interface Rows {
  projects: (Sorted & {
    slug: string; title: string; role: string; summary: string; card_summary?: string | null; overview: string; challenge: string; my_role: string;
    team: string | null; approach: string; lessons: string; featured_technologies: string[] | null; technologies: string[] | null;
    contributions: string[] | null; image_path: string | null; updated_at?: string | null;
    tech_visibility?: string | null; capability_tags?: string[] | null;
  })[];
  otherProjects: (Sorted & { title: string; description: string; url: string | null })[];
  companies: (Sorted & {
    company_name: string;
    experience_roles: (Sorted & { title: string; start_date: string; end_date: string | null; project_name: string | null; highlights: string[] | null })[] | null;
  })[];
  skillCategories: (Sorted & { name: string; skills: (Sorted & { name: string; level: string; subgroup: string | null })[] | null })[];
  profile: {
    name: string; title: string; location: string; headline: string; introduction: string; about: string[] | null;
    email: string | null; resume_path: string | null; avatar_path: string | null;
  } | null;
  education: (Sorted & { institution: string; program: string; start_year: number | null; end_year: number | null })[];
  languages: (Sorted & { name: string; proficiency: string })[];
  socialLinks: (Sorted & { platform: string; url: string })[];
  settings: { key: string; value: string }[];
}

const bySort = <T extends Sorted>(rows: T[] | null | undefined) => [...(rows ?? [])].sort((a, b) => a.sort_order - b.sort_order);
type YearMonth = ExperienceGroup['roles'][number]['startDate'];

/** Turns database rows into component shapes. Faulty rows are kept as-is so validateContent can report them. */
export function mapContent(rows: Rows, env?: Record<string, unknown>): Content {
  return applyDisclosure(mapRows(rows, env));
}

/**
 * Removes technology data a project is not approved to show, whatever the source (database or backup file).
 * Runs before the snapshot is written, so restricted values never reach HTML, JavaScript or SEO tags.
 */
export function applyDisclosure(c: Content): Content {
  return {
    ...c,
    projects: c.projects.map((p) => {
      const v = (p.techVisibility ?? 'general') as TechVisibility;
      return {
        ...p,
        techVisibility: v,
        capabilityTags: v === 'general' ? (p.capabilityTags ?? []) : [],
        featuredTech: v === 'full' ? p.featuredTech : [],
        tech: v === 'full' ? p.tech : [],
      };
    }),
  };
}

function mapRows(rows: Rows, env?: Record<string, unknown>): Content {
  const p = rows.profile;
  if (!p) throw new Error('profile: no published profile row');
  const link = (platform: string) => rows.socialLinks.find((l) => l.platform === platform)?.url ?? '';
  const setting = (key: string) => rows.settings.find((s) => s.key === key)?.value ?? '';
  const edu = bySort(rows.education)[0];

  return {
    siteTitle: setting('site_title') || `${p.name} — ${p.title}`,
    description: setting('meta_description') || p.introduction,
    profile: {
      name: p.name,
      title: p.title,
      location: p.location,
      headline: p.headline,
      intro: p.introduction,
      about: p.about ?? [],
      // shortcut: the About section shows one education entry, the first by sort_order; render a list if more are added.
      education: edu
        ? { title: edu.program, school: edu.institution, period: [edu.start_year, edu.end_year].filter(Boolean).join('–') }
        : { title: '', school: '', period: '' },
      languages: bySort(rows.languages).map((l) => ({ name: l.name, level: l.proficiency })),
      email: p.email ?? '',
      resumeUrl: mediaUrl(p.resume_path, env),
      portrait: mediaUrl(p.avatar_path, env),
      github: link('github'),
      linkedin: link('linkedin'),
    },
    projects: bySort(rows.projects).map((r) => ({
      slug: r.slug,
      title: r.title,
      role: r.role,
      summary: r.summary,
      cardSummary: r.card_summary?.trim() || undefined,
      // Missing (pre-migration) rows default to 'general'; invalid values pass through so validation fails the build.
      techVisibility: (r.tech_visibility ?? 'general') as TechVisibility,
      capabilityTags: r.capability_tags ?? [],
      featuredTech: r.featured_technologies ?? [],
      tech: r.technologies ?? [],
      image: mediaUrl(r.image_path, env) || undefined,
      overview: r.overview,
      challenge: r.challenge,
      myRole: r.my_role,
      team: r.team ?? undefined,
      contributions: r.contributions ?? [],
      approach: r.approach,
      lessons: r.lessons,
      updatedAt: r.updated_at ?? undefined,
    })),
    otherProjects: bySort(rows.otherProjects).map((r) => ({ title: r.title, description: r.description, url: r.url ?? undefined })),
    experience: bySort(rows.companies).map((c) => ({
      company: c.company_name,
      roles: bySort(c.experience_roles).map((r) => ({
        title: r.title,
        startDate: r.start_date as YearMonth,
        endDate: r.end_date as YearMonth | null,
        project: r.project_name ?? undefined,
        highlights: r.highlights ?? [],
      })),
    })),
    skills: bySort(rows.skillCategories).map((c) => {
      const items = bySort(c.skills);
      const sub = items.filter((s) => s.subgroup);
      return {
        category: c.name,
        primary: items.filter((s) => !s.subgroup && s.level === 'primary').map((s) => s.name),
        supporting: items.filter((s) => !s.subgroup && s.level !== 'primary').map((s) => s.name),
        subgroup: sub.length ? { label: sub[0].subgroup!, items: sub.map((s) => s.name) } : undefined,
      };
    }),
  };
}

const YM = /^\d{4}-(0[1-9]|1[0-2])$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Every problem in the snapshot. Any error fails the build, so the last good deploy stays live.
 * Required: profile basics, at least one project and one employer. Optional lists (other projects, skills, about) may be empty.
 */
export function validateContent(c: Content): string[] {
  const errors: string[] = [];
  const need = (value: unknown, label: string) => {
    if (typeof value !== 'string' || !value.trim()) errors.push(`${label} is empty`);
  };

  (['name', 'title', 'location', 'headline', 'intro'] as const).forEach((k) => need(c.profile[k], `profile.${k}`));
  for (const [label, url] of [['profile.github', c.profile.github], ['profile.linkedin', c.profile.linkedin], ['profile.resumeUrl', c.profile.resumeUrl], ['profile.portrait', c.profile.portrait]]) {
    if (url && !/^https:\/\//.test(url) && !url.startsWith('/')) errors.push(`${label} is not an https URL: ${url}`);
  }

  // The CV buttons promise a PDF; catch an image or a typo in profile.resume_path before it goes live.
  if (c.profile.resumeUrl && !/\.pdf$/i.test(new URL(c.profile.resumeUrl, 'https://x').pathname)) errors.push('profile.resume_path must point to a .pdf file');

  if (!c.projects.length) errors.push('projects: no published projects (incomplete migration?)');
  const slugs = new Set<string>();
  for (const p of c.projects) {
    const at = `project "${p.slug || p.title || '?'}"`;
    if (!SLUG.test(p.slug)) errors.push(`${at}: invalid slug`);
    if (slugs.has(p.slug)) errors.push(`${at}: duplicate slug`);
    slugs.add(p.slug);
    (['title', 'role', 'summary', 'overview', 'challenge', 'myRole', 'approach', 'lessons'] as const).forEach((k) => need(p[k], `${at}.${k}`));
    if (!(TECH_VISIBILITY as readonly string[]).includes(p.techVisibility)) {
      errors.push(`${at}: tech_visibility must be full, general or hidden (got ${JSON.stringify(p.techVisibility)})`);
    } else if (p.techVisibility === 'full') {
      if (!p.featuredTech.length || p.featuredTech.length > 5) errors.push(`${at}: needs 1–5 featured technologies`);
      const missing = p.featuredTech.filter((t) => !p.tech.includes(t));
      if (missing.length) errors.push(`${at}: featured technologies not in the full stack: ${missing.join(', ')}`);
    } else if (p.tech.length || p.featuredTech.length) {
      // Defence in depth: never publish technologies for a project that is not approved for them.
      errors.push(`${at}: restricted technologies present for visibility "${p.techVisibility}"`);
    }
    if (p.capabilityTags.length > 5) errors.push(`${at}: at most 5 capability tags`);
    if (p.capabilityTags.some((t) => !t.trim() || t.length > 40)) errors.push(`${at}: capability tags must be 1–40 characters`);
    if (!p.contributions.length) errors.push(`${at}: no contributions`);
    if (p.cardSummary && p.cardSummary.length > 220) errors.push(`${at}: card summary is over 220 characters`);
    if (p.image && !/^https:\/\//.test(p.image) && !p.image.startsWith('/')) errors.push(`${at}: image is not a URL`);
  }

  if (!c.experience.length) errors.push('experience: no published companies (incomplete migration?)');
  for (const g of c.experience) {
    need(g.company, 'experience company');
    if (!g.roles.length) errors.push(`experience "${g.company}": no roles`);
    for (const r of g.roles) {
      const at = `role "${g.company} / ${r.title}"`;
      need(r.title, `${at}.title`);
      if (!YM.test(r.startDate)) errors.push(`${at}: start date must be YYYY-MM`);
      if (r.endDate !== null && !YM.test(r.endDate)) errors.push(`${at}: end date must be YYYY-MM or empty`);
      if (r.endDate && r.endDate < r.startDate) errors.push(`${at}: ends before it starts`);
    }
  }
  for (const s of c.skills) {
    if (!s.primary.length && !s.supporting.length && !s.subgroup) errors.push(`skill category "${s.category}" has no skills`);
  }
  return errors;
}

const QUERIES: Record<keyof Omit<Rows, 'profile'> | 'profile', string> = {
  // Public projection: published rows only, technologies emptied unless approved (see the tech_visibility migration).
  projects: 'projects_public?select=slug,title,role,summary,card_summary,overview,challenge,my_role,team,approach,lessons,tech_visibility,capability_tags,featured_technologies,technologies,contributions,image_path,sort_order,updated_at',
  otherProjects: 'other_projects?select=title,description,url,sort_order&status=eq.published',
  companies: 'experience_companies?select=company_name,sort_order,experience_roles(title,start_date,end_date,project_name,highlights,sort_order)&status=eq.published',
  skillCategories: 'skill_categories?select=name,sort_order,skills(name,level,subgroup,sort_order)&status=eq.published',
  profile: 'profile?select=name,title,location,headline,introduction,about,email,resume_path,avatar_path',
  education: 'education?select=institution,program,start_year,end_year,sort_order',
  languages: 'languages?select=name,proficiency,sort_order',
  socialLinks: 'social_links?select=platform,url,sort_order',
  settings: 'site_settings?select=key,value',
};

/** GET with a timeout; retries once on network errors and 5xx (e.g. a paused project waking up), never on 4xx. */
async function getJson(name: string, url: string, key: string, fetchImpl: typeof fetch, attempts = 2): Promise<unknown> {
  for (let attempt = 1; ; attempt++) {
    let res: Response;
    try {
      res = await fetchImpl(url, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(15_000) });
    } catch (error) {
      if (attempt < attempts) continue;
      throw new Error(`${name}: request failed (${(error as Error).message})`);
    }
    if (res.status >= 500 && attempt < attempts) continue;
    // The response body is PostgREST's error message; it never contains the key.
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
    return res.json();
  }
}

/** One parallel round of read-only REST queries with the public key (RLS returns published rows only). Throws on any error. */
export async function fetchRows(url: string, key: string, fetchImpl: typeof fetch = fetch): Promise<Rows> {
  const entries = await Promise.all(
    Object.entries(QUERIES).map(async ([name, path]) => [name, await getJson(name, `${url}/rest/v1/${path}`, key, fetchImpl)] as const),
  );
  const rows = Object.fromEntries(entries) as unknown as Rows & { profile: Rows['profile'] | Rows['profile'][] };
  return { ...rows, profile: Array.isArray(rows.profile) ? (rows.profile[0] ?? null) : rows.profile };
}
