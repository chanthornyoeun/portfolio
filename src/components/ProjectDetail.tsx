import { ArrowLeft } from 'lucide-react';
import type { Project } from '../data/projects';
import { PrivateLabel, Tags } from './Projects';
import { asset } from '../data/profile';
import { container } from './styles';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-2 border-t border-gray-200 py-8 sm:grid-cols-[180px_1fr] sm:gap-8 dark:border-gray-800">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{title}</h2>
      <div className="leading-relaxed text-gray-700 dark:text-gray-300">{children}</div>
    </section>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className={`${container} pt-28 pb-20 sm:pt-32`}>
      <a
        href="#work"
        className="mb-10 flex w-fit items-center gap-1 rounded text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Back to Selected Work
      </a>

      <header className="mb-10 max-w-3xl">
        <PrivateLabel />
        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">{project.title}</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-400">{project.role}</p>
        <div className="mt-5">
          <Tags items={project.tech} />
        </div>
      </header>

      {project.image && (
        <img
          src={asset(project.image)}
          alt={`${project.title} screenshot`}
          width={1280}
          height={720}
          decoding="async"
          onError={(e) => (e.currentTarget.hidden = true)}
          className="mb-10 aspect-video w-full rounded-lg border border-gray-200 object-cover dark:border-gray-800"
        />
      )}

      <Block title="Overview">{project.overview}</Block>
      <Block title="Challenge">{project.challenge}</Block>
      <Block title="My Role">{project.myRole}</Block>
      {project.team && <Block title="Team & Collaboration">{project.team}</Block>}
      <Block title="Contributions">
        <ul className="grid list-disc gap-x-8 gap-y-1 pl-5 marker:text-gray-400 sm:grid-cols-2">
          {project.contributions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Block>
      <Block title="Technical Approach">{project.approach}</Block>
      <Block title="Lessons Learned">{project.lessons}</Block>
    </article>
  );
}
