import { ArrowRight, Lock } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { projectPath } from '../routes';
import { Section } from './Section';
import { reveal } from './styles';
import { trackEvent } from '../lib/analytics';

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
      <Lock size="0.75rem" aria-hidden="true" /> Professional Project · Private
    </span>
  );
}

export function Projects() {
  const { projects, otherProjects } = useContent();
  return (
    <Section id="work" title="Selected Work">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <article
            {...reveal(i)}
            key={project.slug}
            className="relative flex flex-col rounded-lg border border-gray-200 p-5 transition-colors focus-within:border-gray-400 hover:border-gray-400 sm:p-6 dark:border-gray-800 dark:focus-within:border-gray-600 dark:hover:border-gray-600"
          >
            {project.image && (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                decoding="async"
                width={640}
                height={360}
                // A missing file is hidden rather than leaving a broken placeholder.
                onError={(e) => (e.currentTarget.hidden = true)}
                className="mb-5 aspect-video w-full rounded-md border border-gray-200 object-cover dark:border-gray-800"
              />
            )}
            <PrivateLabel />
            <h3 className="mt-2 text-lg font-semibold leading-snug text-gray-900 dark:text-gray-50">{project.title}</h3>
            <p className="mt-2 mb-5 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{project.cardSummary ?? project.summary}</p>
            <Tags items={project.featuredTech.slice(0, 5)} />
            <a
              href={projectPath(project.slug)}
              onClick={() => trackEvent('project_card_click', { project_slug: project.slug, project_title: project.title })}
              // Stretched link: the whole card is clickable, with one link for screen readers.
              className="mt-6 inline-flex w-fit items-center gap-1 text-sm font-medium text-blue-700 after:absolute after:inset-0 after:rounded-lg hover:underline dark:text-blue-400"
            >
              View Case Study <span className="sr-only">: {project.title}</span>
              <ArrowRight size="0.875rem" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>

      <h3 className="mt-14 mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Other professional work</h3>
      <ul className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {otherProjects.map((p) => (
          <li key={p.title} className="text-sm">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 underline hover:text-blue-700 dark:text-gray-50 dark:hover:text-blue-400">
                {p.title}
                <span className="sr-only"> (opens in new tab)</span>
              </a>
            ) : (
              <span className="font-medium text-gray-900 dark:text-gray-50">{p.title}</span>
            )}
            <span className="text-gray-600 dark:text-gray-400"> — {p.description}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
