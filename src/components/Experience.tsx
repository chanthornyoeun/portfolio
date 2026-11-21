import { motion } from 'framer-motion';
import { experience } from '../data/experience';
import { Section } from './Section';
import { reveal } from './styles';

export function Experience() {
  return (
    <Section id="experience" title="Professional Experience">
      <ol className="space-y-10">
        {experience.map((role, i) => (
          <motion.li {...reveal(i)} key={`${role.company}-${role.title}`} className="grid gap-2 md:grid-cols-[200px_1fr] md:gap-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">{role.period}</p>
            <div>
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
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
