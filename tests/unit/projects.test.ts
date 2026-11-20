import { describe, expect, it } from "vitest";
import { projects } from "@/content/projects";
import {
  getProjectBySlug,
  getProjectLinks,
  getProjectMetadata,
  getRelatedProjects,
} from "@/lib/content";
import type { Project } from "@/lib/types";

const minimal: Project = {
  slug: "minimal",
  title: "Minimal",
  summary: "Only required fields.",
  role: "Engineer",
  organization: "Example",
  context: "Context.",
  challenges: [],
  contributions: { leadership: [], implementation: [] },
  technicalApproach: [],
  outcomes: [],
  technologies: ["Java"],
  visibility: "public",
  featured: false,
  order: 99,
};

describe("getRelatedProjects", () => {
  it("excludes the project itself and respects the limit", () => {
    for (const p of projects) {
      const related = getRelatedProjects(p);
      expect(related.map((r) => r.slug)).not.toContain(p.slug);
      expect(related.length).toBeLessThanOrEqual(2);
    }
  });

  it("ranks projects with shared technologies first", () => {
    const auction = getProjectBySlug("real-time-auction-platform");
    expect(auction).toBeDefined();
    expect(getRelatedProjects(auction as Project)[0]?.slug).toBe(
      "enterprise-crm-platform",
    );
  });

  it("still returns projects when nothing is shared", () => {
    expect(
      getRelatedProjects({ ...minimal, technologies: ["Cobol"] }),
    ).toHaveLength(2);
  });
});

describe("getProjectMetadata", () => {
  it("builds title, description, canonical and Open Graph for every project", () => {
    for (const p of projects) {
      const meta = getProjectMetadata(p.slug);
      expect(meta?.title).toBe(p.title);
      expect(meta?.description).toBe(p.summary);
      // Unit tests run without NEXT_PUBLIC_SITE_URL, so the local origin is used.
      expect(meta?.alternates?.canonical).toBe(
        `http://localhost:3000/projects/${p.slug}/`,
      );
      expect(meta?.openGraph).toMatchObject({
        type: "article",
        title: p.title,
      });
    }
  });

  it("returns null for an unknown slug", () => {
    expect(getProjectMetadata("does-not-exist")).toBeNull();
    expect(getProjectBySlug("")).toBeUndefined();
  });
});

describe("optional fields and private links", () => {
  it("handles a project with no optional fields", () => {
    expect(minimal.lessons).toBeUndefined();
    expect(minimal.diagram).toBeUndefined();
    expect(getProjectLinks(minimal)).toEqual([]);
  });

  it("never returns links for private projects, even if URLs are set", () => {
    expect(
      getProjectLinks({
        ...minimal,
        visibility: "private",
        repositoryUrl: "https://github.com/x/y",
        liveUrl: "https://example.com",
      }),
    ).toEqual([]);
  });

  it("returns both links for a public project with valid URLs", () => {
    expect(
      getProjectLinks({
        ...minimal,
        repositoryUrl: "https://github.com/x/y",
        liveUrl: "https://example.com",
      }).map((l) => l.label),
    ).toEqual(["Source code", "Live site"]);
  });

  it("diagrams stay sanitized: no URLs, hosts or ports", () => {
    for (const p of projects) {
      const text = JSON.stringify(p.diagram ?? {});
      expect(text).not.toMatch(
        /https?:|www\.|\.(com|net|io|local)\b|:\d{2,5}\b/i,
      );
    }
  });

  it("no project claims verified outcomes yet", () => {
    // Remove when the owner confirms outcomes; see docs/IMPLEMENTATION_PLAN.md.
    expect(projects.every((p) => p.outcomes.length === 0)).toBe(true);
  });
});
