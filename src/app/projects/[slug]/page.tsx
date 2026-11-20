import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { FlowDiagram } from "@/components/flow-diagram";
import { PrivateLabel, ProjectList } from "@/components/project-list";
import { TagList } from "@/components/tag-list";
import { privacyNote } from "@/content/projects";
import {
  getProjectBySlug,
  getProjectLinks,
  getProjectMetadata,
  getProjectSlugs,
  getRelatedProjects,
} from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

// Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return getProjectMetadata((await params).slug) ?? {};
}

function CaseSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-border border-t pt-8">
      <h2 id={id} className="text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="text-fg-muted mt-3 list-disc space-y-2 pl-5">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default async function ProjectPage({ params }: Props) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();

  const links = getProjectLinks(project);
  const related = getRelatedProjects(project);
  const { leadership, implementation } = project.contributions;
  const lessons = project.lessons ?? [];

  return (
    <Container className="py-16 sm:py-20">
      <article className="max-w-[72ch]">
        <Link
          href="/projects"
          className="text-fg-muted hover:text-accent inline-flex min-h-11 items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to Projects
        </Link>

        <header className="mt-6">
          {project.visibility === "private" && <PrivateLabel />}
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {project.title}
          </h1>
          <p className="text-fg-muted mt-4 text-lg">{project.summary}</p>

          <dl className="mt-8 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-[8rem_1fr]">
            <dt className="text-fg-muted font-mono">Role</dt>
            <dd>{project.role}</dd>
            <dt className="text-fg-muted font-mono">Organization</dt>
            <dd>{project.organization}</dd>
            <dt className="text-fg-muted font-mono">Context</dt>
            <dd>{project.context}</dd>
            <dt className="text-fg-muted font-mono">Technologies</dt>
            <dd>
              <TagList items={project.technologies} />
            </dd>
          </dl>

          {links.length > 0 && (
            <ul className="mt-6 flex gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="hover:text-accent inline-flex min-h-11 items-center gap-1 text-sm font-medium"
                  >
                    {link.label}
                    <ArrowUpRight className="size-4" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </header>

        {project.image && (
          <figure className="mt-10">
            <Image
              src={project.image.src}
              alt={project.image.alt}
              sizes="(min-width: 768px) 72ch, 100vw"
              className="border-border h-auto w-full rounded-md border"
            />
            <figcaption className="text-fg-muted mt-2 text-sm">
              {project.image.kind === "mockup"
                ? "Original conceptual mockup, not a screenshot of the client system."
                : "Screenshot shared with permission; confidential details removed."}
            </figcaption>
          </figure>
        )}

        <div className="mt-12 space-y-10">
          {project.challenges.length > 0 && (
            <CaseSection id="challenge" title="The Challenge">
              <Bullets items={project.challenges} />
            </CaseSection>
          )}

          {leadership.length + implementation.length > 0 && (
            <CaseSection id="contributions" title="My Contributions">
              {leadership.length > 0 && (
                <>
                  <h3 className="mt-5 font-medium">
                    Leadership and coordination
                  </h3>
                  <Bullets items={leadership} />
                </>
              )}
              {implementation.length > 0 && (
                <>
                  <h3 className="mt-5 font-medium">Hands-on implementation</h3>
                  <Bullets items={implementation} />
                </>
              )}
            </CaseSection>
          )}

          {(project.technicalApproach.length > 0 || project.diagram) && (
            <CaseSection id="approach" title="Technical Approach">
              <Bullets items={project.technicalApproach} />
              {project.diagram && <FlowDiagram diagram={project.diagram} />}
            </CaseSection>
          )}

          {project.outcomes.length + lessons.length > 0 && (
            <CaseSection id="outcome" title="Outcome / Lessons Learned">
              {project.outcomes.length > 0 && (
                <Bullets items={project.outcomes} />
              )}
              {lessons.length > 0 && <Bullets items={lessons} />}
            </CaseSection>
          )}

          {project.visibility === "private" && (
            <p className="border-border bg-bg-subtle text-fg-muted rounded-md border p-4 text-sm">
              {privacyNote}
            </p>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related" className="mt-16">
          <h2
            id="related"
            className="text-fg-muted mb-4 font-mono text-sm font-medium tracking-wide uppercase"
          >
            Related Projects
          </h2>
          <ProjectList projects={related} />
        </section>
      )}
    </Container>
  );
}
