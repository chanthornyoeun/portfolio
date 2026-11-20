import type { Metadata } from "next";
import { Container } from "@/components/container";
import { ProjectList } from "@/components/project-list";
import { projectsIntro, selectedWorkNote } from "@/content/projects";
import { getProjects } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Selected Projects",
  description:
    "Selected professional case studies by Chanthorn Yoeun, described at a general level to protect client confidentiality.",
  alternates: { canonical: absoluteUrl("/projects/") },
};

export default function ProjectsPage() {
  return (
    <Container className="py-16 sm:py-24">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        Selected Projects
      </h1>
      <div className="text-fg-muted mt-4 mb-10 max-w-[70ch] space-y-3">
        <p>{projectsIntro}</p>
        <p>{selectedWorkNote}</p>
      </div>
      <ProjectList projects={getProjects()} headingLevel="h2" />
    </Container>
  );
}
