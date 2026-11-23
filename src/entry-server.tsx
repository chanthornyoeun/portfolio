// Server entry used only by scripts/prerender.ts at build time.
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import type { Route } from './routes.ts';

export function render(route: Route) {
  return renderToString(
    <StrictMode>
      <App route={route} />
    </StrictMode>,
  );
}
