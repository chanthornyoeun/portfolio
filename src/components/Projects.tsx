import { ArrowRight, Lock } from 'lucide-react';
import { otherProjects, projects } from '../data/projects';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Section } from './Section';

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((t) => (
        <li key={t} className="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600 dark:border-gray-700 dark:text-gray-400">
          {t}
        </li>
      ))}
    </ul>
  );
}

export function PrivateLabel() {
  return (
    <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
      <Lock size={12} aria-hidden="true" /> Professional Project · Private
    </span>
  );
}

export function Projects() {
  return (
    <Section id="work" title="Selected Work">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="flex flex-col rounded-lg border border-gray-200 p-6 transition-colors hover:border-gray-400 dark:border-gray-800 dark:hover:border-gray-600"
          >
            {project.image && (
              <ImageWithFallback
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                width={600}
                height={340}
                className="mb-5 aspect-video w-full rounded-md border border-gray-200 object-cover dark:border-gray-800"
              />
            )}
            <PrivateLabel />
            <h3 className="mt-2 mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">{project.title}</h3>
            <p className="mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{project.summary}</p>
            <Tags items={project.tech} />
            <a
              href={`#/work/${project.slug}`}
              className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
            >
              View Case Study <span className="sr-only">: {project.title}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>

      <h3 className="mt-14 mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Other professional work</h3>
      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {otherProjects.map((p) => (
          <li key={p.title} className="text-sm">
            <span className="font-medium text-gray-900 dark:text-gray-50">{p.title}</span>
            <span className="text-gray-600 dark:text-gray-400"> — {p.description}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
