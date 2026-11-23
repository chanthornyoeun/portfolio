import { StrictMode, startTransition } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
// Self-hosted Inter (variable weight): no render-blocking request to Google Fonts.
import '@fontsource-variable/inter';
import './index.css';
import App from './App.tsx';
import { routeFromPath, routeKey } from './routes.ts';

const root = document.getElementById('root')!;
const route = routeFromPath(window.location.pathname);
const app = (
  <StrictMode>
    <App route={route} />
  </StrictMode>
);

// Hydrate only HTML prerendered for this exact route. Anything else (dev server shell, a server's
// fallback page) is rendered from scratch instead of failing hydration.
// Hydrating inside a transition lets React yield to the browser between chunks instead of one long task;
// the page is already fully visible from the prerendered HTML while this runs.
if (root.dataset.route === routeKey(route)) startTransition(() => void hydrateRoot(root, app));
else createRoot(root).render(app);
