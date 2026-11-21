import { Github, Linkedin, Mail } from 'lucide-react';
import { profile } from '../data/profile';
import { Section } from './Section';
import { primaryButton, secondaryButton } from './styles';

export function Contact() {
  return (
    <Section id="contact" title="Let's connect.">
      <p className="mb-8 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-400">
        Interested in discussing software engineering opportunities, technical challenges, or potential collaborations? Feel free
        to reach out.
      </p>
      <div className="flex flex-wrap gap-3">
        {profile.email && (
          <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} className={`${primaryButton} gap-2 border border-transparent`}>
            <Mail size={16} aria-hidden="true" /> Email
          </a>
        )}
        <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} gap-2`}>
          <Linkedin size={16} aria-hidden="true" /> LinkedIn <span className="sr-only">(opens in new tab)</span>
        </a>
        <a href={profile.github} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} gap-2`}>
          <Github size={16} aria-hidden="true" /> GitHub <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </Section>
  );
}
