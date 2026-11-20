import { ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import { TagList } from "./tag-list";

export function PrivateLabel() {
  return (
    <span className="text-fg-muted inline-flex items-center gap-1.5 font-mono text-xs">
      <Lock className="size-3" aria-hidden />
      Professional Project · Private
    </span>
  );
}

export function ProjectList({
  projects,
  headingLevel = "h3",
}: {
  projects: Project[];
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <ul className="divide-border border-border divide-y border-y">
      {projects.map((project) => (
        <li
          key={project.slug}
          className="group hover:bg-bg-subtle has-[a:focus-visible]:outline-accent relative -mx-3 flex items-start gap-4 rounded-md px-3 py-6 transition-colors has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2"
        >
          <div className="min-w-0 flex-1">
            {project.visibility === "private" && <PrivateLabel />}
            <Heading className="mt-1 text-lg font-semibold tracking-tight sm:text-xl">
              {/* The ::after overlay makes the whole row clickable while the link's name stays just the title. */}
              <Link
                href={`/projects/${project.slug}`}
                className="group-hover:text-accent block transition-colors after:absolute after:inset-0 after:rounded-md focus-visible:outline-none"
              >
                {project.title}
              </Link>
            </Heading>
            <p className="text-fg-muted mt-1 max-w-[70ch]">
              {project.cardSummary ?? project.summary}
            </p>
            <div className="mt-3">
              {/* Main technologies only; the case study lists the full stack. */}
              <TagList
                items={project.technologies.slice(0, 4)}
                label="Main technologies"
              />
            </div>
            {/* Visual cue only: the row-wide title link above is what receives clicks and focus. */}
            <span
              aria-hidden
              className="text-fg-muted group-hover:text-accent mt-4 inline-flex items-center gap-1 text-sm font-medium transition-colors"
            >
              View case study
              <ArrowRight className="size-4" />
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
