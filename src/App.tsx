import { useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { NotFound } from './components/NotFound';
import { Credits } from './components/Credits';
import { ThemeProvider } from './contexts/ThemeContext';
import { useContent } from './contexts/ContentContext';
import { ConsentBanner } from './components/ConsentBanner';
import { initAnalytics, trackEvent, trackPageView } from './lib/analytics';
import { startReveal } from './lib/reveal';
import type { Route } from './routes';

if (typeof window !== 'undefined') initAnalytics(); // no-op unless configured and consented

// Each route is a separate prerendered HTML page, so there is no client-side router.
export default function App({ route }: { route: Route }) {
  const { projects } = useContent();
  const project = route.page === 'project' ? projects.find((p) => p.slug === route.slug) : undefined;
  const notFound = route.page === 'not-found' || (route.page === 'project' && !project);

  useEffect(() => {
    if (notFound) return;
    if (trackPageView(window.location.pathname, document.title) && project) {
      trackEvent('project_view', { project_slug: project.slug, project_title: project.title });
    }
  }, [notFound, project]);

  useEffect(startReveal, []);

  return (
    <ThemeProvider>
          <div className="min-h-screen bg-white font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50">
            <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:text-gray-900 focus:px-3 focus:py-2 focus:text-sm">
              Skip to content
            </a>
            <Header page={notFound ? 'not-found' : route.page} />
            <main id="main">
              {notFound ? (
                <NotFound />
              ) : route.page === 'credits' ? (
                <Credits />
              ) : project ? (
                <ProjectDetail project={project} />
              ) : (
                <>
                  <Hero />
                  <Projects />
                  <Experience />
                  <Skills />
                  <About />
                  <Contact />
                </>
              )}
            </main>
            <Footer />
            <ConsentBanner />
          </div>
    </ThemeProvider>
  );
}
