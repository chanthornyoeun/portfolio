import { container } from './styles';

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-gray-200 py-14 sm:py-20 dark:border-gray-800">
      <div className={container} data-reveal="">
        <h2 id={`${id}-title`} className="mb-8 sm:mb-10 text-[clamp(1.5rem,1.3rem+1vw,1.875rem)] font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}
