import { FileText, Github, Linkedin } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { container, iconLink, primaryButton, secondaryButton } from './styles';
import { trackEvent } from '../lib/analytics';

const at = { link_location: 'hero' } as const;

export function Hero() {
  const { profile } = useContent();
  return (
    <section id="top" aria-label="Introduction" className="pt-28 pb-20 sm:pt-40 sm:pb-28">
      {/* No entrance animation: the headline is the largest paint and should show immediately. */}
      <div className={container}>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{profile.name}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {profile.title} · {profile.location}
            </p>
            <h1 className="mt-6 text-[2rem] font-semibold leading-[1.15] tracking-tight text-gray-900 sm:text-5xl dark:text-gray-50">
              {profile.headline}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">{profile.intro}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className={primaryButton}>
                Explore My Work
              </a>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} onClick={() => trackEvent('resume_view', at)} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} gap-2`}>
                  <FileText size={16} aria-hidden="true" /> View Resume <span className="sr-only">(PDF, opens in new tab)</span>
                </a>
              )}
              <div className="flex gap-1">
                <a href={profile.github} onClick={() => trackEvent('github_click', at)} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub (opens in new tab)">
                  <Github size={20} aria-hidden="true" />
                </a>
                <a href={profile.linkedin} onClick={() => trackEvent('linkedin_click', at)} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn (opens in new tab)">
                  <Linkedin size={20} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {profile.portrait && (
            <img
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              width={400}
              height={400}
              decoding="async"
              className="order-first aspect-square w-24 shrink-0 rounded-xl object-cover sm:w-32 md:order-none md:w-48"
            />
          )}
        </div>
      </div>
    </section>
  );
}
