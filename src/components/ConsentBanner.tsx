import { useEffect, useRef, useState } from 'react';
import { CONSENT_EVENT, getConsent, isConfigured, setConsent } from '../lib/analytics';
import { container, primaryButton, secondaryButton } from './styles';

/** Asks once; nothing loads until "Allow". Footer "Privacy settings" brings it back. */
export function ConsentBanner() {
  // Closed in the prerendered HTML; the stored choice is only known in the browser.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onChange = () => setOpen(isConfigured() && getConsent() === null);
    onChange();
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  // Reserve space under the page so the fixed bar never hides the footer or contact links.
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open || !bar.current) return;
    const el = bar.current;
    const ro = new ResizeObserver(() => (document.body.style.paddingBottom = `${el.offsetHeight}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.body.style.paddingBottom = '';
    };
  }, [open]);

  if (!open) return null;
  return (
    <div ref={bar} role="region" aria-label="Analytics consent" className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
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
