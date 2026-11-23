export const container = 'mx-auto w-full max-w-5xl px-4 sm:px-6';

export const primaryButton =
  'inline-flex items-center rounded-md bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors';

export const secondaryButton =
  'inline-flex items-center rounded-md border border-gray-300 px-5 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800 transition-colors';

export const iconLink =
  'inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50';

// Progressive reveal: content is visible in the HTML; src/lib/reveal.ts fades in items below the fold
// once JavaScript runs (skipped for reduced-motion users and when JavaScript is off).
export const reveal = (index: number) =>
  ({ 'data-reveal': '', style: { '--reveal-delay': `${Math.min(index, 6) * 60}ms` } }) as Record<string, unknown>;
