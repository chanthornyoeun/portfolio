import { useEffect, useState } from 'react';
import { LazyMotion, MotionConfig, domAnimation } from 'framer-motion';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ThemeProvider } from './contexts/ThemeContext';
import { useContent } from './contexts/ContentContext';
import { ConsentBanner } from './components/ConsentBanner';
import { initAnalytics, trackEvent, trackPageView } from './lib/analytics';

initAnalytics(); // no-op unless configured and consented

// Hash routes (#/work/<slug>) so refresh and direct links work on GitHub Pages without a 404 fallback.
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const { projects, profile, siteTitle, ready } = useContent();
  const slug = hash.startsWith('#/work/') ? hash.slice('#/work/'.length) : '';
  const project = slug ? projects.find((p) => p.slug === slug) : undefined;
  // A case study that only exists in the database: wait for it instead of flashing the homepage.
  const pending = !!slug && !project && !ready;

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    if (pending) return;
    document.title = project ? `${project.title} — ${profile.name}` : siteTitle;
    // project_view only on a real page change, so StrictMode, repeated hashes and content refreshes don't double count.
    if (trackPageView(project ? hash : '', document.title) && project) {
      trackEvent('project_view', { project_slug: project.slug, project_title: project.title });
    }
  }, [hash, project, pending, profile.name, siteTitle]);

  // Scroll only when the route changes, not when content refreshes.
  useEffect(() => {
    if (hash.startsWith('#/')) {
      window.scrollTo(0, 0);
    } else if (hash) {
      // Section may only exist after switching back from a case study.
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash]);

  return (
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:text-gray-900 focus:px-3 focus:py-2 focus:text-sm">
          Skip to content
        </a>
        <Header onCaseStudy={!!project} />
        <main id="main">
          {pending ? null : project ? (
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
      </MotionConfig>
      </LazyMotion>
    </ThemeProvider>
  );
}
