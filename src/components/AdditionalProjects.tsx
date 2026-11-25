import { ExternalLink } from 'lucide-react';
import { createElement } from 'react';
import { useContent } from '../contexts/ContentContext';
import type { OtherProject } from '../data/projects';
import { projectIcon } from '../data/projectIcons';
import { trackEvent } from '../lib/analytics';
import { Tags } from './Projects';

function AdditionalProjectCard({ project }: { project: OtherProject }) {
  const meta = [project.company, project.role].filter(Boolean).join(' · ');
  return (
    <li className="flex flex-col rounded-lg border border-gray-200 p-4 sm:p-5 dark:border-gray-800">
      <div className="flex items-start gap-3">
        {createElement(projectIcon(project.icon), { size: '1.125rem', 'aria-hidden': true, className: 'mt-0.5 shrink-0 text-gray-500 dark:text-gray-400' })}
        <div className="min-w-0">
          <h4 className="font-semibold leading-snug text-gray-900 dark:text-gray-50">{project.title}</h4>
          {meta && <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{meta}</p>}
        </div>
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{project.description}</p>
      {project.capabilityTags.length > 0 && (
        <div className="mt-4">
          <Tags items={project.capabilityTags} />
        </div>
      )}
      {project.url && (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent('additional_project_link_click', { project_title: project.title })}
          // py-2 gives a 24px+ touch target without making the card itself look clickable.
          className="-mb-2 mt-2 inline-flex w-fit items-center gap-1 rounded py-2 text-sm font-medium text-blue-700 hover:underline dark:text-blue-400"
        >
          {project.urlLabel ?? 'Visit Website'}
          <span className="sr-only">: {project.title} (opens in new tab)</span>
          <ExternalLink size="0.875rem" aria-hidden="true" />
        </a>
      )}
    </li>
  );
}

export function AdditionalProjects() {
  const { otherProjects } = useContent();
  if (!otherProjects.length) return null;
  return (
    <div className="mt-14">
      <h3 id="additional-projects" className="text-lg font-semibold text-gray-900 dark:text-gray-50">Additional Professional Projects</h3>
      <p className="mt-1 mb-5 text-sm text-gray-600 dark:text-gray-400">Other enterprise applications I contributed to throughout my professional career.</p>
      <ul className="grid gap-4 md:grid-cols-2">
        {otherProjects.map((p) => (
          <AdditionalProjectCard key={p.title} project={p} />
        ))}
      </ul>
    </div>
  );
}
