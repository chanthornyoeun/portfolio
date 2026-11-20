import { describe, expect, it } from "vitest";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skills } from "@/content/skills";
import {
  formatPeriod,
  getFeaturedProjects,
  getProjectBySlug,
  getProjectLinks,
  groupByCompany,
  isValidEmail,
  isValidUrl,
} from "@/lib/content";
import type { Project } from "@/lib/types";

describe("experience grouping and contact", () => {
  it("groups consecutive roles by company and keeps separate roles", () => {
    const groups = groupByCompany(experience);
    expect(groups.map((g) => g.company)).toEqual([
      "Freelance",
      "Aibodia Co., Ltd",
      "YesCAR Cambodia",
      "Ecoinsoft Solution Co., Ltd",
    ]);
    expect(groups[1]?.roles).toHaveLength(2);
    expect(groups[3]?.roles).toHaveLength(3);
  });

  it("only accepts plausible emails", () => {
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail("")).toBe(false);
    expect(isValidEmail("not-an-email")).toBe(false);
    expect(isValidEmail("me@example.com")).toBe(true);
  });
});

const allContent = JSON.stringify({ profile, experience, projects, skills });

describe("content rules", () => {
  it.each([
    /available for hire/i,
    /open to work/i,
    /\bscrum\b/i,
    /sprint planning/i,
    /bachelor|degree/i,
    /passionate|cutting-edge|rockstar|synergy|10x/i,
    /\d+\s?%/, // no unverified percentages
    /@[a-z0-9-]+\.[a-z]/i, // no email address
  ])("contains no %s", (pattern) => {
    expect(allContent).not.toMatch(pattern);
  });

  it("keeps the confirmed job titles", () => {
    const titles = experience.map((e) => `${e.company}: ${e.title}`);
    expect(titles).toContain(
      "Ecoinsoft Solution Co., Ltd: Frontend Team Leader",
    );
    expect(titles).toContain("Aibodia Co., Ltd: Project Leader / Team Lead");
  });

  it("does not claim the insurance backend or full-stack ownership", () => {
    const insurance = getProjectBySlug("general-insurance-platform");
    const text = JSON.stringify(insurance);
    // Integrating *with* the backend APIs is fine; building or owning it is not.
    expect(text).not.toMatch(
      /(built|implemented|developed|owned|designed)\s+(the\s+)?(entire\s+|whole\s+)?backend/i,
    );
    expect(text).not.toMatch(/full[- ]stack/i);
    expect(insurance?.contributions.implementation[0]).toMatch(/Angular/);
    expect(insurance?.technologies.slice(0, 3)).toEqual([
      "Angular",
      "TypeScript",
      "REST APIs",
    ]);
  });

  it("petroleum leads with hands-on Next.js and Laravel work", () => {
    const petroleum = getProjectBySlug("petroleum-distribution-management");
    expect(petroleum?.technologies.slice(0, 4)).toEqual([
      "Next.js",
      "React",
      "TypeScript",
      "Laravel",
    ]);
    const [first, second] = petroleum?.contributions.implementation ?? [];
    expect(first).toMatch(/frontend.*Next\.js/i);
    expect(second).toMatch(/Laravel/);
  });

  it("experience and case studies agree on stacks", () => {
    for (const role of experience) {
      for (const slug of role.projects ?? []) {
        const project = getProjectBySlug(slug);
        for (const tech of role.technologies) {
          expect(project?.technologies, `${role.title} → ${slug}`).toContain(
            tech,
          );
        }
      }
    }
  });

  it("lists experience newest first with valid periods", () => {
    for (const [i, e] of experience.entries()) {
      if (e.end) expect(e.end >= e.start).toBe(true);
      const next = experience[i + 1];
      if (next) expect(e.start > next.start).toBe(true);
    }
    expect(experience.filter((e) => !e.end)).toHaveLength(1);
  });

  it("only uses http(s) URLs for profile links", () => {
    for (const link of profile.links) expect(isValidUrl(link.href)).toBe(true);
  });
});

describe("projects", () => {
  it("have unique slugs and orders", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
    expect(new Set(projects.map((p) => p.order)).size).toBe(projects.length);
  });

  it.each(projects)("$slug has every required case-study field", (p) => {
    expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    for (const field of [
      "title",
      "summary",
      "role",
      "organization",
      "context",
    ] as const) {
      expect(p[field].trim()).not.toBe("");
    }
    expect(p.challenges.length).toBeGreaterThan(0);
    expect(p.technicalApproach.length).toBeGreaterThan(0);
    expect(p.technologies.length).toBeGreaterThan(0);
    expect(
      p.contributions.leadership.length + p.contributions.implementation.length,
    ).toBeGreaterThan(0);
  });

  it("private projects carry no repository or live URL", () => {
    for (const p of projects.filter((p) => p.visibility === "private")) {
      expect(p.repositoryUrl).toBeUndefined();
      expect(p.liveUrl).toBeUndefined();
    }
  });

  it("experience links point at existing projects", () => {
    for (const slug of experience.flatMap((e) => e.projects ?? [])) {
      expect(getProjectBySlug(slug)).toBeDefined();
    }
  });

  it("returns featured projects in order", () => {
    expect(getFeaturedProjects().map((p) => p.order)).toEqual([1, 2, 3, 4]);
  });
});

describe("helpers", () => {
  const base = projects[0] as Project;

  it("getProjectLinks renders only valid URLs on public projects", () => {
    expect(
      getProjectLinks({ ...base, repositoryUrl: "https://github.com/x/y" }),
    ).toEqual([]);
    expect(
      getProjectLinks({
        ...base,
        visibility: "public",
        repositoryUrl: "https://github.com/x/y",
        liveUrl: "javascript:alert(1)",
      }),
    ).toEqual([{ label: "Source code", href: "https://github.com/x/y" }]);
  });

  it("isValidUrl rejects junk", () => {
    expect(isValidUrl("")).toBe(false);
    expect(isValidUrl("not a url")).toBe(false);
    expect(isValidUrl("ftp://x.com")).toBe(false);
  });

  it("formatPeriod formats ranges", () => {
    expect(formatPeriod("2024-11", "2025-12")).toBe("Nov 2024 – Dec 2025");
    expect(formatPeriod("2026-01")).toBe("Jan 2026 – Present");
  });
});
