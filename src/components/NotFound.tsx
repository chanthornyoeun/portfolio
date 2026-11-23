import { BASE } from '../routes';
import { container, primaryButton } from './styles';

export function NotFound() {
  return (
    <section className={`${container} pt-32 pb-24`}>
      <h1 className="text-[clamp(1.75rem,1.3rem+2vw,2.25rem)] font-semibold tracking-tight text-gray-900 dark:text-gray-50">Page not found</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400">This page doesn't exist or is no longer published.</p>
      <a href={BASE} className={`${primaryButton} mt-8`}>
        Go to the homepage
      </a>
    </section>
  );
}
