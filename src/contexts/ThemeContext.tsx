import { createContext, useContext, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
// The `dark` class on <html> is the source of truth: index.html sets it before paint from the saved choice.
// The server snapshot is 'light' so hydration matches the prerendered HTML, then React picks up the real class.
const root = () => document.documentElement;
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(root(), { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = useSyncExternalStore(
    subscribe,
    () => (root().classList.contains('dark') ? 'dark' : 'light'),
    () => 'light',
  );


  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    root().classList.toggle('dark', newTheme === 'dark');
    // Keep the phone browser toolbar the same color as the header.
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', newTheme === 'dark' ? '#030712' : '#ffffff');
    try {
      localStorage.setItem('theme', newTheme);
    } catch {
      // storage unavailable (private mode); theme still applies for this visit
    }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
