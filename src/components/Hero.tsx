import { Github, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { profile } from '../data/profile';
import { container, iconLink, primaryButton, secondaryButton } from './styles';

export function Hero() {
  return (
    <section id="top" className="pt-36 pb-24">
      <motion.div className={container} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="flex flex-col-reverse gap-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-medium text-blue-700 dark:text-blue-400">
              {profile.title} · {profile.location}
            </p>
            <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl dark:text-gray-50">
              {profile.headline}
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-gray-600 dark:text-gray-400">{profile.intro}</p>

            <div className="flex flex-wrap items-center gap-3">
              <a href="#work" className={primaryButton}>
                Explore My Work
              </a>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={secondaryButton}>
                  View Resume
                </a>
              )}
              <div className="ml-1 flex gap-1">
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub (opens in new tab)">
                  <Github size={20} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn (opens in new tab)">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {profile.portrait && (
            <img
              src={profile.portrait}
              alt={`Portrait of ${profile.name}`}
              width={160}
              height={160}
              className="h-32 w-32 rounded-xl border border-gray-200 object-cover sm:h-40 sm:w-40 dark:border-gray-800"
            />
          )}
        </div>
      </motion.div>
    </section>
  );
}
