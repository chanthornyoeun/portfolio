import { Mail } from 'lucide-react';
import { profile } from '../data/profile';
import { container } from './styles';
import { isConfigured, setConsent, trackEvent } from '../lib/analytics';

export function Footer() {
  return (
    <footer className="border-t border-gray-200 py-8 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
      <div className={`${container} flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-between`}>
        <p className="flex items-center gap-2">
          &copy; {new Date().getFullYear()} {profile.name}
          {profile.email && (
            <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} title={profile.email} onClick={() => trackEvent('contact_email_click', { link_location: 'footer' })} className="-my-2.5 inline-flex h-11 w-11 items-center justify-center rounded hover:text-gray-900 dark:hover:text-gray-50">
              <Mail size={16} aria-hidden="true" />
            </a>
          )}
        </p>
        <p>
          Built with React, Vite and Tailwind CSS ·{' '}
          <a
            href="https://github.com/chanthornyoeun/portfolio_v1/blob/master/ATTRIBUTION.md"
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
