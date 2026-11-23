// Shown on /credits/. Keep in sync with ATTRIBUTION.md and package.json when tools change.
export interface Credit {
  name: string;
  url: string;
  /** What it does on this site. */
  role: string;
}

export const creditGroups: { title: string; intro?: string; items: Credit[] }[] = [
  {
    title: 'AI assistants',
    intro: 'Used for code, content editing, reviews and debugging. Every change was directed, reviewed and approved by me.',
    items: [
      { name: 'Claude (Anthropic) via Claude Code', url: 'https://claude.com/claude-code', role: 'Implementation, refactoring, audits, SEO, prerendering, Supabase security, tests and documentation.' },
      { name: 'ChatGPT (OpenAI)', url: 'https://chatgpt.com/', role: 'Planning, requirements and prompt writing, and content drafting.' },
      { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', role: 'Code completion and debugging.' },
      { name: 'Figma AI', url: 'https://www.figma.com/', role: 'Early design and layout exploration.' },
    ],
  },
  {
    title: 'Frameworks & libraries',
    items: [
      { name: 'React', url: 'https://react.dev/', role: 'User interface, prerendered to static HTML at build time.' },
      { name: 'TypeScript', url: 'https://www.typescriptlang.org/', role: 'Typed JavaScript.' },
      { name: 'Vite', url: 'https://vite.dev/', role: 'Development server and build tool.' },
      { name: 'Tailwind CSS', url: 'https://tailwindcss.com/', role: 'Styling, with PostCSS and Autoprefixer.' },
      { name: 'Lucide', url: 'https://lucide.dev/', role: 'Icons (ISC License).' },
      { name: 'Inter by Rasmus Andersson', url: 'https://rsms.me/inter/', role: 'Typeface, self-hosted via Fontsource (SIL Open Font License).' },
    ],
  },
  {
    title: 'Services & platforms',
    items: [
      { name: 'Supabase', url: 'https://supabase.com/', role: 'Content database with Row-Level Security, read only at build time.' },
      { name: 'GitHub Pages & Actions', url: 'https://pages.github.com/', role: 'Hosting, automated checks and deployment.' },
      { name: 'Google Analytics 4', url: 'https://marketingplatform.google.com/about/analytics/', role: 'Visit statistics, loaded only after consent.' },
    ],
  },
  {
    title: 'Development & testing tools',
    items: [
      { name: 'Node.js', url: 'https://nodejs.org/', role: 'Build scripts and the built-in test runner.' },
      { name: 'ESLint', url: 'https://eslint.org/', role: 'Linting, with typescript-eslint and React Hooks rules.' },
      { name: 'Lighthouse', url: 'https://developer.chrome.com/docs/lighthouse/', role: 'Performance, accessibility and SEO audits.' },
      { name: 'axe-core', url: 'https://github.com/dequelabs/axe-core', role: 'Accessibility checks.' },
      { name: 'Google Chrome (headless)', url: 'https://www.google.com/chrome/', role: 'Renders the link-preview image.' },
      { name: 'Figma', url: 'https://www.figma.com/', role: 'Wireframes and layout.' },
    ],
  },
];
