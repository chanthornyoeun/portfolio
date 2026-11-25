import { Menu, X, Moon, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useContent } from '../contexts/ContentContext';
import { container } from './styles';
import { BASE, sectionPath } from '../routes';
import type { Route } from '../routes';
import { trackEvent } from '../lib/analytics';
import type { LinkLocation } from '../lib/analytics';

const sections = [
  { label: 'Work', id: 'work' },
  { label: 'Experience', id: 'experience' },
  { label: 'Skills', id: 'skills' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'contact' },
];

const linkClass = 'rounded text-sm transition-colors hover:text-gray-900 dark:hover:text-gray-50';
const idle = 'text-gray-600 dark:text-gray-400';
const current = 'font-medium text-gray-900 dark:text-gray-50';

// Highlights the section in the middle of the viewport; on a case study, "Work" stays active.
function useActiveSection(page: Route['page']) {
  const onHome = page === 'home';
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!onHome) return;
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    ['top', 'work', 'experience', 'skills', 'about', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [onHome]);
  // Case studies belong to Work; other pages (credits, 404) have no active section.
  return page === 'project' ? 'work' : onHome ? active : '';
}

export function Header({ page }: { page: Route['page'] }) {
  const { profile } = useContent();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(page);

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close on Escape (returning focus to the toggle), on a tap outside the header, or when the desktop nav takes over.
  // Taps inside the header, such as the theme toggle, keep it open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const close = () => setIsMenuOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      close();
      toggleRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => !headerRef.current?.contains(e.target as Node) && close();
    const desktop = window.matchMedia('(min-width: 768px)');
    window.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    desktop.addEventListener('change', close);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
      desktop.removeEventListener('change', close);
    };
  }, [isMenuOpen]);

  const links = (extra = '', where: LinkLocation = 'header', activeExtra = '') => (
    <>
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={sectionPath(s.id)}
            aria-current={active === s.id ? 'true' : undefined}
            className={`${linkClass} ${active === s.id ? `${current} ${activeExtra}` : idle} ${extra}`}
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
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <nav aria-label="Main" className={`${container} py-3`}>
        <div className="flex items-center justify-between gap-4">
          <a href={page === 'home' ? '#top' : BASE} className="-my-2.5 rounded py-2.5 font-semibold text-gray-900 dark:text-gray-50">
            {profile.name}
          </a>

          <div className="flex items-center gap-1 md:gap-6">
            <ul className="hidden items-center gap-7 md:flex">{links()}</ul>

            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-600 focus-visible:outline-offset-0 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon size="1.125rem" aria-hidden="true" /> : <Sun size="1.125rem" aria-hidden="true" />}
            </button>

            <button
              ref={toggleRef}
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-gray-700 focus-visible:outline-offset-0 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X size="1.25rem" aria-hidden="true" /> : <Menu size="1.25rem" aria-hidden="true" />}
            </button>
          </div>
        </div>

      </nav>

      {/* Compact dropdown under the bar; it overlays the page instead of pushing it down. */}
      <div
        className={`absolute inset-x-0 top-full border-b border-gray-200 bg-white shadow-sm transition-[opacity,transform,visibility] duration-150 ease-out motion-reduce:transition-none md:hidden dark:border-gray-800 dark:bg-gray-950 ${
          isMenuOpen ? 'translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <ul id="mobile-nav" className={`${container} py-2`}>
          {links('flex h-11 items-center border-l-2 border-transparent pl-3 focus-visible:outline-offset-0', 'mobile_menu', 'border-l-gray-900 dark:border-l-gray-50')}
        </ul>
      </div>
    </header>
  );
}
