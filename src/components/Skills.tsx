import { useContent } from '../contexts/ContentContext';
import { Section } from './Section';
import { reveal } from './styles';

// Supporting skills are plain muted text, so only primary technologies carry badge borders.
function Muted({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
      {items.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

export function Skills() {
  const { skills } = useContent();
  return (
    <Section id="skills" title="Professional Skills & Tools">
      <div className="grid items-start gap-x-12 gap-y-10 md:grid-cols-2">
        {skills.map((group, i) => (
          <div {...reveal(i)} key={group.category}>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50">{group.category}</h3>
            {group.primary.length > 0 && (
              <ul className="mb-3 flex flex-wrap gap-2" aria-label={`${group.category}: primary`}>
                {group.primary.map((s) => (
                  <li key={s} className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-900 dark:border-gray-600 dark:text-gray-50">
                    {s}
                  </li>
                ))}
              </ul>
            )}
            <Muted items={group.supporting} />
            {group.subgroup && (
              <div className="mt-3">
                <h4 className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{group.subgroup.label}</h4>
                <Muted items={group.subgroup.items} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
