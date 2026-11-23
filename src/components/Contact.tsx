import { Github, Linkedin, Mail } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { Section } from './Section';
import { primaryButton, secondaryButton } from './styles';
import { trackEvent } from '../lib/analytics';

const at = { link_location: 'contact' } as const;

export function Contact() {
  const { profile } = useContent();
  return (
    <Section id="contact" title="Let's connect.">
      <p className="mb-8 max-w-2xl leading-relaxed text-gray-600 dark:text-gray-400">
        Interested in discussing software engineering opportunities, technical challenges, or potential collaborations? Feel free
        to reach out.
      </p>
      <div className="flex flex-wrap gap-3">
        {profile.email && (
          <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} title={profile.email} onClick={() => trackEvent('contact_email_click', at)} className={`${primaryButton} gap-2 border border-transparent`}>
            <Mail size={16} aria-hidden="true" /> Email
          </a>
        )}
        <a href={profile.linkedin} onClick={() => trackEvent('linkedin_click', at)} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} gap-2`}>
          <Linkedin size={16} aria-hidden="true" /> LinkedIn <span className="sr-only">(opens in new tab)</span>
        </a>
        <a href={profile.github} onClick={() => trackEvent('github_click', at)} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} gap-2`}>
          <Github size={16} aria-hidden="true" /> GitHub <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
    </Section>
  );
}
