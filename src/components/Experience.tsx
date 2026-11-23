import { m } from 'framer-motion';
import { companyPeriod, formatDuration, formatPeriod, monthsBetween } from '../data/experience';
import { useContent } from '../contexts/ContentContext';
import type { Role } from '../data/experience';
import { Section } from './Section';
import { reveal } from './styles';

function Highlights({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-600 marker:text-gray-400 dark:text-gray-400">
      {items.map((h) => (
        <li key={h}>{h}</li>
      ))}
    </ul>
  );
}

function RoleTitle({ role }: { role: Role }) {
  return (
    <h4 className="font-medium text-gray-900 dark:text-gray-50">
      {role.title}
      {role.project && <span className="font-normal text-gray-600 dark:text-gray-400"> · {role.project}</span>}
    </h4>
  );
}

export function Experience() {
  const { experience } = useContent();
  return (
    <Section id="experience" title="Professional Experience">
      <ol className="ml-1.5 space-y-12 border-l border-gray-200 dark:border-gray-800">
        {experience.map((group, i) => {
          const { start, end } = companyPeriod(group);
          const single = group.roles.length === 1 ? group.roles[0] : null;
          return (
            <m.li {...reveal(i)} key={group.company} className="relative pl-8">
              <span
                aria-hidden="true"
                className={`absolute -left-[6px] top-1.5 h-[11px] w-[11px] rounded-full border-2 ring-4 ring-white dark:ring-gray-950 ${
                  end === null ? 'border-blue-600 bg-blue-600 dark:border-blue-400 dark:bg-blue-400' : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-950'
                }`}
              />
              <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{group.company}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatPeriod(start, end)} · {formatDuration(monthsBetween(start, end))}
                </p>
              </div>

              {single ? (
                <>
                  <div className="mt-1">
                    <RoleTitle role={single} />
                  </div>
                  <Highlights items={single.highlights} />
                </>
              ) : (
                <ol className="mt-4 space-y-6 border-l border-dashed border-gray-200 pl-5 dark:border-gray-800" aria-label={`Roles at ${group.company}`}>
                  {group.roles.map((role) => (
                    <li key={role.title} className="relative">
                      <span aria-hidden="true" className="absolute -left-[23.5px] top-2 h-[7px] w-[7px] rounded-full bg-gray-300 dark:bg-gray-600" />
                      <RoleTitle role={role} />
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatPeriod(role.startDate, role.endDate)}</p>
                      <Highlights items={role.highlights} />
                    </li>
                  ))}
                </ol>
              )}
            </m.li>
          );
        })}
      </ol>
    </Section>
  );
}
