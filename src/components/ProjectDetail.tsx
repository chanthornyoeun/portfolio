import { ArrowLeft } from 'lucide-react';
import type { Project } from '../data/projects';
import { PrivateLabel, Tags } from './Projects';
import { container } from './styles';

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-gray-200 py-8 dark:border-gray-800">
      <h2 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-50">{title}</h2>
      <div className="leading-relaxed text-gray-600 dark:text-gray-400">{children}</div>
    </section>
  );
}

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <article className={`${container} max-w-3xl pt-28 pb-20`}>
      <a href="#work" className="mb-10 flex w-fit items-center gap-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
        <ArrowLeft size={14} aria-hidden="true" /> Back to Selected Work
      </a>
      <PrivateLabel />
      <h1 className="mt-2 mb-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">{project.title}</h1>
      <p className="mb-8 text-gray-600 dark:text-gray-400">{project.role}</p>

      <Block title="Overview">{project.overview}</Block>
      <Block title="Challenge">{project.challenge}</Block>
      <Block title="My Role">{project.myRole}</Block>
      <Block title="My Contributions">
        <ul className="list-disc space-y-1 pl-5 marker:text-gray-400">
          {project.contributions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </Block>
      <Block title="Technical Approach">{project.approach}</Block>
      <Block title="Lessons Learned">{project.lessons}</Block>
      <Block title="Technologies">
        <Tags items={project.tech} />
      </Block>
    </article>
  );
}
