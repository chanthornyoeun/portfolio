import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
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
if (root.dataset.route === routeKey(route)) hydrateRoot(root, app);
else createRoot(root).render(app);
