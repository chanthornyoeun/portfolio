import { motion } from 'framer-motion';
import { experience } from '../data/experience';
import { Section } from './Section';
import { reveal } from './styles';

export function Experience() {
  return (
    <Section id="experience" title="Professional Experience">
      <ol className="ml-1.5 space-y-10 border-l border-gray-200 dark:border-gray-800">
        {experience.map((role, i) => (
          <motion.li {...reveal(i)} key={`${role.company}-${role.title}`} className="relative pl-8">
            <span
              aria-hidden="true"
              className={`absolute -left-[6px] top-1.5 h-[11px] w-[11px] rounded-full border-2 ring-4 ring-white dark:ring-gray-950 ${
                i === 0 ? 'border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-950'
              }`}
            />
            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">{role.period}</p>
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">{role.title}</h3>
            <p className="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {role.company}
              {role.project && ` · ${role.project}`}
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600 marker:text-gray-400 dark:text-gray-400">
              {role.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
