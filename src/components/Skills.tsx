import { motion } from 'framer-motion';
import { skills } from '../data/skills';
import { Tags } from './Projects';
import { Section } from './Section';
import { reveal } from './styles';

export function Skills() {
  return (
    <Section id="skills" title="Technical Expertise">
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {skills.map((group, i) => (
          <motion.div {...reveal(i)} key={group.category}>
            <dt className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50">{group.category}</dt>
            <dd>
              <Tags items={group.items} />
            </dd>
          </motion.div>
        ))}
      </dl>
    </Section>
  );
}
