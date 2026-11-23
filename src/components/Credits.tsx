import { ArrowLeft } from 'lucide-react';
import { creditGroups } from '../data/credits';
import { useContent } from '../contexts/ContentContext';
import { BASE } from '../routes';
import { container } from './styles';

export function Credits() {
  const { profile } = useContent();
  return (
    <article className={`${container} pt-24 pb-16 sm:pt-32 sm:pb-20`}>
      <a href={BASE} className="mb-8 flex w-fit items-center gap-1 rounded text-sm text-gray-600 hover:text-gray-900 sm:mb-10 dark:text-gray-400 dark:hover:text-gray-50">
        <ArrowLeft size="0.875rem" aria-hidden="true" /> Back to home
      </a>

      <header className="mb-8 max-w-3xl sm:mb-10">
        <h1 className="text-[clamp(1.75rem,1.3rem+2vw,2.25rem)] font-semibold leading-tight tracking-tight text-gray-900 dark:text-gray-50">Credits</h1>
        <p className="mt-4 text-lg leading-relaxed text-gray-600 dark:text-gray-400">
          Designed, built and maintained by {profile.name}. These are the tools and services this site is built with.
        </p>
      </header>

      {creditGroups.map((group) => (
        <section key={group.title} aria-labelledby={`credits-${group.title}`} className="grid gap-4 border-t border-gray-200 py-7 sm:py-8 md:grid-cols-[160px_1fr] md:gap-8 lg:grid-cols-[180px_1fr] dark:border-gray-800">
          <h2 id={`credits-${group.title}`} className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {group.title}
          </h2>
          <div className="max-w-3xl">
            {group.intro && <p className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">{group.intro}</p>}
            <ul className="space-y-3">
              {group.items.map((c) => (
                <li key={c.name} className="leading-relaxed">
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 underline-offset-2 hover:underline dark:text-gray-50">
                    {c.name}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                  <span className="text-gray-600 dark:text-gray-400"> — {c.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      <p className="border-t border-gray-200 pt-8 text-sm text-gray-600 dark:border-gray-800 dark:text-gray-400">
        The site's source code is{' '}
        <a href="https://github.com/chanthornyoeun/portfolio" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-900 dark:hover:text-gray-50">
          on GitHub<span className="sr-only"> (opens in new tab)</span>
        </a>{' '}
        under the MIT License. Portfolio content describes private professional work and includes no confidential code, data or screenshots.
      </p>
    </article>
  );
}
