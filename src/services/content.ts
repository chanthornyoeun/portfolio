// Portfolio content: the static data in src/data is the built-in fallback; Supabase, when configured,
// replaces it at runtime with the published rows.
import type { SupabaseClient } from '@supabase/supabase-js';
import { experience as staticExperience } from '../data/experience.ts';
import type { ExperienceGroup } from '../data/experience.ts';
import { asset, profile as staticProfile } from '../data/profile.ts';
import { otherProjects as staticOtherProjects, projects as staticProjects } from '../data/projects.ts';
import type { Project } from '../data/projects.ts';
import { skills as staticSkills } from '../data/skills.ts';
import type { SkillGroup } from '../data/skills.ts';
import { mediaUrl } from '../lib/supabase.ts';

export type Profile = typeof staticProfile;
export type OtherProject = (typeof staticOtherProjects)[number];

export interface Content {
  /** Which data is on screen: the bundled fallback or the database. */
  source: 'static' | 'supabase';
  siteTitle: string;
  profile: Profile;
  projects: Project[];
  otherProjects: OtherProject[];
  experience: ExperienceGroup[];
  skills: SkillGroup[];
}

export const staticContent: Content = {
  source: 'static',
  siteTitle: `${staticProfile.name} — ${staticProfile.title}`,
  profile: staticProfile,
  projects: staticProjects.map((p) => ({ ...p, image: p.image && asset(p.image) })),
  otherProjects: staticOtherProjects,
  experience: staticExperience,
  skills: staticSkills,
};

// Row shapes returned by the queries in fetchContent (see supabase/migrations).
type Sorted = { sort_order: number };
export interface Rows {
  projects: (Sorted & {
    slug: string; title: string; role: string; summary: string; overview: string; challenge: string; my_role: string;
    team: string | null; approach: string; lessons: string; featured_technologies: string[] | null; technologies: string[] | null;
    contributions: string[] | null; image_path: string | null;
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
const YM = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Turns database rows into the shapes the components already use. Rows missing required fields are skipped. */
export function mapContent(rows: Rows, env?: Record<string, unknown>): Content {
  const p = rows.profile;
  if (!p?.name) throw new Error('Supabase profile row is missing');
  const link = (platform: string) => rows.socialLinks.find((l) => l.platform === platform)?.url ?? '';
  const edu = bySort(rows.education)[0];

  return {
    source: 'supabase',
    siteTitle: rows.settings.find((s) => s.key === 'site_title')?.value || staticContent.siteTitle,
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
    projects: bySort(rows.projects)
      .filter((r) => r.slug && r.title)
      .map((r) => ({
        slug: r.slug,
        title: r.title,
        role: r.role,
        summary: r.summary,
        featuredTech: (r.featured_technologies ?? []).slice(0, 5),
        tech: r.technologies ?? [],
        image: mediaUrl(r.image_path, env) || undefined,
        overview: r.overview,
        challenge: r.challenge,
        myRole: r.my_role,
        team: r.team ?? undefined,
        contributions: r.contributions ?? [],
        approach: r.approach,
        lessons: r.lessons,
      })),
    otherProjects: bySort(rows.otherProjects).map((r) => ({ title: r.title, description: r.description, url: r.url ?? undefined })),
    experience: bySort(rows.companies)
      .map((c) => ({
        company: c.company_name,
        roles: bySort(c.experience_roles)
          .filter((r) => YM.test(r.start_date) && (r.end_date === null || YM.test(r.end_date)))
          .map((r) => ({
            title: r.title,
            startDate: r.start_date as ExperienceGroup['roles'][number]['startDate'],
            endDate: r.end_date as ExperienceGroup['roles'][number]['endDate'],
            project: r.project_name ?? undefined,
            highlights: r.highlights ?? [],
          })),
      }))
      .filter((g) => g.roles.length > 0),
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

/** One parallel round of queries. Throws on any error so the caller can keep the fallback. */
export async function fetchContent(db: SupabaseClient): Promise<Content> {
  // status filters are explicit too, so even a signed-in admin session never renders drafts on the public site.
  const [projects, otherProjects, companies, skillCategories, profile, education, languages, socialLinks, settings] = await Promise.all([
    db.from('projects').select('slug,title,role,summary,overview,challenge,my_role,team,approach,lessons,featured_technologies,technologies,contributions,image_path,sort_order').eq('status', 'published'),
    db.from('other_projects').select('title,description,url,sort_order').eq('status', 'published'),
    db.from('experience_companies').select('company_name,sort_order,experience_roles(title,start_date,end_date,project_name,highlights,sort_order)').eq('status', 'published'),
    db.from('skill_categories').select('name,sort_order,skills(name,level,subgroup,sort_order)').eq('status', 'published'),
    db.from('profile').select('name,title,location,headline,introduction,about,email,resume_path,avatar_path').maybeSingle(),
    db.from('education').select('institution,program,start_year,end_year,sort_order'),
    db.from('languages').select('name,proficiency,sort_order'),
    db.from('social_links').select('platform,url,sort_order'),
    db.from('site_settings').select('key,value'),
  ]);
  const failed = [projects, otherProjects, companies, skillCategories, profile, education, languages, socialLinks, settings].find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  return mapContent({
    projects: projects.data ?? [],
    otherProjects: otherProjects.data ?? [],
    companies: companies.data ?? [],
    skillCategories: skillCategories.data ?? [],
    profile: profile.data,
    education: education.data ?? [],
    languages: languages.data ?? [],
    socialLinks: socialLinks.data ?? [],
    settings: settings.data ?? [],
  } as Rows);
}
