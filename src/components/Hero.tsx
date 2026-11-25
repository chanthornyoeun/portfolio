import { Download, Github, Linkedin } from 'lucide-react';
import { resumeDownload } from '../data/profile';
import { useContent } from '../contexts/ContentContext';
import { container, iconLink, primaryButton, secondaryButton } from './styles';
import { trackEvent } from '../lib/analytics';

const at = { link_location: 'hero' } as const;

/** Upload portrait-sm / portrait / portrait-lg side by side in Storage (see docs/supabase-setup.md). */
const portraitSrcSet = (url: string) => {
  const m = /^(.*?)(\.\w+)$/.exec(url);
  // shortcut: assumes the -sm/-lg files exist next to the main file; add explicit columns if that becomes error-prone.
  return m ? `${m[1]}-sm${m[2]} 400w, ${url} 800w, ${m[1]}-lg${m[2]} 1086w` : undefined;
};

export function Hero() {
  const { profile } = useContent();
  return (
    <section id="top" aria-label="Introduction" className="pt-24 pb-14 sm:pt-32 sm:pb-20">
      {/* No entrance animation: the headline is the largest paint and should show immediately. */}
      <div className={container}>
        <div className="grid gap-10 md:grid-cols-[3fr_2fr] md:items-center md:gap-12">
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{profile.name}</p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              {profile.title} · {profile.location}
            </p>
            <h1 className="mt-6 text-[clamp(2rem,1.5rem+2.5vw,3rem)] font-semibold leading-[1.15] tracking-tight text-gray-900 dark:text-gray-50">
              {profile.headline}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg dark:text-gray-400">{profile.intro}</p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a href="#work" className={primaryButton}>
                Explore My Work
              </a>
              {profile.resumeUrl && (
                <a
                  href={resumeDownload(profile.resumeUrl, profile.name).href}
                  download={resumeDownload(profile.resumeUrl, profile.name).fileName}
                  onClick={() => trackEvent('resume_download', at)}
                  className={`${secondaryButton} gap-2`}
                >
                  <Download size="1rem" aria-hidden="true" /> Download CV <span className="sr-only">(PDF)</span>
                </a>
              )}
              <div className="flex gap-1">
                <a href={profile.github} onClick={() => trackEvent('github_click', at)} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub (opens in new tab)">
                  <Github size="1.25rem" aria-hidden="true" />
                </a>
                <a href={profile.linkedin} onClick={() => trackEvent('linkedin_click', at)} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn (opens in new tab)">
                  <Linkedin size="1.25rem" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {profile.portrait && (
            <img
              src={profile.portrait}
              srcSet={portraitSrcSet(profile.portrait)}
              sizes="(min-width: 1024px) 380px, (min-width: 768px) 38vw, (min-width: 640px) 20rem, 16rem"
              alt={`Black-and-white portrait of ${profile.name}, ${profile.title}.`}
              width={800}
              height={1066}
              decoding="async"
              {...{ fetchpriority: 'high' }}
              // A missing file hides the portrait; the text column then fills the hero.
              onError={(e) => (e.currentTarget.hidden = true)}
              className="mx-auto aspect-[3/4] w-64 rounded-lg border border-gray-200 bg-black object-cover sm:w-80 md:mx-0 md:w-full dark:border-transparent"
            />
          )}
        </div>
      </div>
    </section>
  );
}
