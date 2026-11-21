import { profile } from '../data/profile';
import { Section } from './Section';

export function About() {
  const { education } = profile;
  return (
    <Section id="about" title="About">
      <div className="grid gap-10 md:grid-cols-[1fr_260px]">
        <div className="space-y-4 leading-relaxed text-gray-600 dark:text-gray-400">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <div className="space-y-8 text-sm">
          <div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-50">Education</h3>
            <p className="text-gray-900 dark:text-gray-50">{education.title}</p>
            <p className="text-gray-600 dark:text-gray-400">{education.school}</p>
            <p className="text-gray-500 dark:text-gray-400">{education.period}</p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-gray-900 dark:text-gray-50">Languages</h3>
            <ul className="space-y-1 text-gray-600 dark:text-gray-400">
              {profile.languages.map((l) => (
                <li key={l.name}>
                  {l.name} — {l.level}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
