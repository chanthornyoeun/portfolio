import { m } from 'framer-motion';
import { skills } from '../data/skills';
import { Section } from './Section';
import { reveal } from './styles';

const badge = 'rounded border px-2 py-0.5 text-xs';
const core = `${badge} border-gray-300 font-medium text-gray-900 dark:border-gray-600 dark:text-gray-50`;
const other = `${badge} border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400`;

export function Skills() {
  return (
    <Section id="skills" title="Technical Expertise">
      <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
        {skills.map((group, i) => (
          <m.div {...reveal(i)} key={group.category}>
            <dt className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50">{group.category}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.core.map((s) => (
                  <li key={s} className={core}>
                    {s}
                  </li>
                ))}
                {group.other.map((s) => (
                  <li key={s} className={other}>
                    {s}
                  </li>
                ))}
              </ul>
            </dd>
          </m.div>
        ))}
      </dl>
    </Section>
  );
}
