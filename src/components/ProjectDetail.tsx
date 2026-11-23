import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Project } from '../data/projects';
import { PrivateLabel, Tags } from './Projects';
import { useContent } from '../contexts/ContentContext';
import { projectPath, sectionPath } from '../routes';
import { container } from './styles';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2 border-t border-gray-200 py-8 sm:grid-cols-[180px_1fr] sm:gap-8 dark:border-gray-800">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h2>
      <div className="max-w-3xl space-y-4 leading-relaxed text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  );
}

// Text fields may hold several paragraphs separated by a blank line.
// A short "Label: " lead-in is shown in bold so sub-topics stand out.
const paras = (text: string) =>
  text.split('\n\n').map((p) => {
    const lead = /^([A-Z][\w -]{2,40}):\s/.exec(p);
    return (
      <p key={p}>
        {lead && <strong className="font-semibold text-gray-900 dark:text-gray-50">{lead[1]}: </strong>}
        {lead ? p.slice(lead[0].length) : p}
      </p>
    );
  });

export function ProjectDetail({ project }: { project: Project }) {
  const { projects } = useContent();
  const next = projects[(projects.findIndex((p) => p.slug === project.slug) + 1) % projects.length];
  return (
    <article className={`${container} pt-24 pb-16 sm:pt-32 sm:pb-20`}>
      <a
        href={sectionPath('work')}
        className="mb-8 flex w-fit items-center gap-1 rounded text-sm sm:mb-10 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <ArrowLeft size="0.875rem" aria-hidden="true" /> Back to Selected Work
      </a>

      <header className="mb-8 max-w-3xl sm:mb-10">
        <PrivateLabel />
        <h1 className="mt-3 text-[clamp(1.75rem,1.3rem+2vw,2.25rem)] font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-50">{project.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{project.summary}</p>
        <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-[auto_1fr] sm:gap-x-8">
          <div className="sm:contents">
            <dt className="font-semibold text-gray-900 dark:text-gray-50">Role</dt>
            <dd className="mt-1 text-gray-600 sm:mt-0 dark:text-gray-400">{project.role}</dd>
          </div>
          <div className="sm:contents">
            <dt className="font-semibold text-gray-900 dark:text-gray-50">Stack</dt>
            <dd className="mt-2 sm:mt-0">
              <Tags items={project.tech} />
            </dd>
          </div>
        </dl>
      </header>

      {project.image && (
        <img
          src={project.image}
          alt={`${project.title} screenshot`}
          width={1280}
          height={720}
          decoding="async"
          onError={(e) => (e.currentTarget.hidden = true)}
          className="mb-10 aspect-video w-full rounded-lg border border-gray-200 object-cover dark:border-gray-800"
        />
      )}

      <Block title="Overview">{paras(project.overview)}</Block>
      <Block title="Challenge">{paras(project.challenge)}</Block>
      <Block title="My Role">{paras(project.myRole)}</Block>
      {project.team && <Block title="Team & Collaboration">{paras(project.team)}</Block>}
      <Block title="Contributions">
        <ul className="list-disc space-y-2 pl-5 marker:text-gray-400">
          {project.contributions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Block>
      <Block title="Technical Approach">{paras(project.approach)}</Block>
      <Block title="Lessons Learned">{paras(project.lessons)}</Block>

      <nav
        aria-label="Case studies"
        className="mt-4 flex flex-col gap-4 border-t border-gray-200 pt-8 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-gray-800"
      >
        <a href={sectionPath('work')} className="flex w-fit items-center gap-1 rounded text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
          <ArrowLeft size="0.875rem" aria-hidden="true" /> All projects
        </a>
        <a
          href={projectPath(next.slug)}
          className="group flex w-fit items-center gap-2 rounded font-medium text-gray-900 hover:text-blue-700 dark:text-gray-50 dark:hover:text-blue-400"
        >
          <span>
            <span className="block text-xs font-normal text-gray-500 dark:text-gray-400">Next case study</span>
            {next.title}
          </span>
          <ArrowRight size="1rem" aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </a>
      </nav>
    </article>
  );
}
