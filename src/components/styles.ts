export const container = 'mx-auto w-full max-w-5xl px-4 sm:px-6';

export const primaryButton =
  'inline-flex items-center rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-700 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-200 transition-colors';

export const secondaryButton =
  'inline-flex items-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-800 transition-colors';

export const iconLink =
  'rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50';

// Subtle staggered reveal for list items; MotionConfig in App disables it for reduced-motion users.
export const reveal = (index: number) => ({
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.4, delay: Math.min(index, 6) * 0.06 },
});
