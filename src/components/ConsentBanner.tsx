import { useEffect, useState } from 'react';
import { CONSENT_EVENT, getConsent, isConfigured, setConsent } from '../lib/analytics';
import { container, primaryButton, secondaryButton } from './styles';

/** Asks once; nothing loads until "Allow". Footer "Privacy settings" brings it back. */
export function ConsentBanner() {
  const [open, setOpen] = useState(() => isConfigured() && getConsent() === null);

  useEffect(() => {
    const onChange = () => setOpen(isConfigured() && getConsent() === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!open) return null;
  return (
    <div role="region" aria-label="Analytics consent" className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className={`${container} flex flex-col gap-3 py-4 text-sm sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-gray-600 dark:text-gray-400">
          May I use Google Analytics to count visits and see which projects are viewed? No personal details are collected.
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" className={`${secondaryButton} py-2`} onClick={() => setConsent('denied')}>
            Decline
          </button>
          <button type="button" className={`${primaryButton} py-2`} onClick={() => setConsent('granted')}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
