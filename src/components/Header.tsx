import { Menu, X, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { profile } from '../data/profile';
import { container } from './styles';

const navItems = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
  ...(profile.resumeUrl ? [{ label: 'Resume', href: profile.resumeUrl }] : []),
];

const linkClass = 'text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 transition-colors';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <nav aria-label="Main" className={`${container} py-4`}>
        <div className="flex items-center justify-between">
          <a href="#top" className="font-semibold text-gray-900 dark:text-gray-50">
            {profile.name}.
          </a>

          <div className="flex items-center gap-6">
            <ul className="hidden items-center gap-6 md:flex">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <button
              className="rounded-md p-1 text-gray-700 md:hidden dark:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <ul id="mobile-nav" className="mt-4 space-y-3 md:hidden">
            {navItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={`block py-1 ${linkClass}`} onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
