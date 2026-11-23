import { useContent } from '../contexts/ContentContext';
import { container } from './styles';
import { isConfigured, setConsent } from '../lib/analytics';

export function Footer() {
  const { profile } = useContent();
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <div className={`${container} flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between`}>
        <p suppressHydrationWarning>
          &copy; {new Date().getFullYear()} {profile.name}. All rights reserved.
        </p>
        <p>
          Built with React, Vite and Tailwind CSS ·{' '}
          <a
            href="https://github.com/chanthornyoeun/portfolio/blob/master/ATTRIBUTION.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-900 dark:hover:text-gray-50"
          >
            Credits
          </a>
          {isConfigured() && (
            <>
              {' · '}
              <button type="button" onClick={() => setConsent(null)} className="underline hover:text-gray-900 dark:hover:text-gray-50">
                Privacy settings
              </button>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
