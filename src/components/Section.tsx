import { m } from 'framer-motion';

import { container } from './styles';

export function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 border-t border-gray-200 py-20 dark:border-gray-800">
      <m.div
        className={container}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.4 }}
      >
        <h2 id={`${id}-title`} className="mb-10 text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-50">
          {title}
        </h2>
        {children}
      </m.div>
    </section>
  );
}
