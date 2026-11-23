import { Download, FileText, Github, Linkedin, Mail } from 'lucide-react';
import { resumeDownload } from '../data/profile';
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
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {profile.email && (
          <a href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`} title={profile.email} onClick={() => trackEvent('contact_email_click', at)} className={`${primaryButton} justify-center gap-2 border border-transparent`}>
            <Mail size="1rem" aria-hidden="true" /> Email
          </a>
        )}
        <a href={profile.linkedin} onClick={() => trackEvent('linkedin_click', at)} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} justify-center gap-2`}>
          <Linkedin size="1rem" aria-hidden="true" /> LinkedIn <span className="sr-only">(opens in new tab)</span>
        </a>
        <a href={profile.github} onClick={() => trackEvent('github_click', at)} target="_blank" rel="noopener noreferrer" className={`${secondaryButton} justify-center gap-2`}>
          <Github size="1rem" aria-hidden="true" /> GitHub <span className="sr-only">(opens in new tab)</span>
        </a>
      </div>
      {profile.resumeUrl && (
        <p className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
          <span>Prefer a CV?</span>
          <a
            href={resumeDownload(profile.resumeUrl, profile.name).href}
            download={resumeDownload(profile.resumeUrl, profile.name).fileName}
            onClick={() => trackEvent('resume_download', at)}
            className="inline-flex min-h-[2.75rem] items-center gap-1.5 font-medium text-gray-900 underline-offset-2 hover:underline dark:text-gray-50"
          >
            <Download size="1rem" aria-hidden="true" /> Download (PDF)
          </a>
          <a
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent('resume_view', at)}
            className="inline-flex min-h-[2.75rem] items-center gap-1.5 font-medium text-gray-900 underline-offset-2 hover:underline dark:text-gray-50"
          >
            <FileText size="1rem" aria-hidden="true" /> View online <span className="sr-only">(opens in new tab)</span>
          </a>
        </p>
      )}
    </Section>
  );
}
