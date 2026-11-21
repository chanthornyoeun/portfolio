import { useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
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
import { findProject } from './data/projects';
import { profile } from './data/profile';

const defaultTitle = document.title;

// Hash routes (#/work/<slug>) so refresh and direct links work on GitHub Pages without a 404 fallback.
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const project = hash.startsWith('#/work/') ? findProject(hash.slice('#/work/'.length)) : undefined;

  useEffect(() => {
    const onHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = project ? `${project.title} — ${profile.name}` : defaultTitle;
    if (project || hash.startsWith('#/')) {
      window.scrollTo(0, 0);
    } else if (hash) {
      // Section may only exist after switching back from a case study.
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash, project]);

  return (
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-white font-sans text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-50">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-sm">
          Skip to content
        </a>
        <Header onCaseStudy={!!project} />
        <main id="main">
          {project ? (
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
      </div>
      </MotionConfig>
    </ThemeProvider>
  );
}
