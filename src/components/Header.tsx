import { Menu, X, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { profile } from '../data/profile';
import { container } from './styles';
import { trackEvent } from '../lib/analytics';
import type { LinkLocation } from '../lib/analytics';

const sections = [
  { label: 'Work', id: 'work' },
  { label: 'Experience', id: 'experience' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

const linkClass = 'rounded text-sm transition-colors hover:text-gray-900 dark:hover:text-gray-50';
const idle = 'text-gray-600 dark:text-gray-400';
const current = 'font-medium text-gray-900 dark:text-gray-50';

// Highlights the section in the middle of the viewport; on a case study, "Work" stays active.
function useActiveSection(onCaseStudy: boolean) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (onCaseStudy) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', 'work', 'experience', 'skills', 'about', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onCaseStudy]);
  return onCaseStudy ? 'work' : active;
}

export function Header({ onCaseStudy }: { onCaseStudy: boolean }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(onCaseStudy);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  const links = (extra = '', where: LinkLocation = 'header') => (
    <>
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            aria-current={active === s.id ? 'true' : undefined}
            className={`${linkClass} ${active === s.id ? current : idle} ${extra}`}
            onClick={() => {
              trackEvent('navigation_click', { navigation_target: s.id, link_location: where });
              setIsMenuOpen(false);
            }}
          >
            {s.label}
          </a>
        </li>
      ))}
      {profile.resumeUrl && (
        <li>
          <a href={profile.resumeUrl} onClick={() => trackEvent('resume_view', { link_location: where })} target="_blank" rel="noopener noreferrer" className={`${linkClass} ${idle} ${extra}`}>
            Resume <span className="sr-only">(PDF, opens in new tab)</span>
          </a>
        </li>
      )}
    </>
  );

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <nav aria-label="Main" className={`${container} py-3`}>
        <div className="flex items-center justify-between gap-4">
          <a href="#top" className="-my-2 rounded py-2 font-semibold text-gray-900 dark:text-gray-50">
            {profile.name}.
          </a>

          <div className="flex items-center gap-1 md:gap-6">
            <ul className="hidden items-center gap-7 md:flex">{links()}</ul>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon size={18} aria-hidden="true" /> : <Sun size={18} aria-hidden="true" />}
            </button>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <ul id="mobile-nav" className="mt-3 border-t border-gray-200 pt-2 md:hidden dark:border-gray-800">
            {links('block py-3', 'mobile_menu')}
          </ul>
        )}
      </nav>
    </header>
  );
}
